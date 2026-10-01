import nodemailer from "nodemailer";

export interface SendOtpResult {
  success: boolean;
  message: string;
  isRealEmailSent: boolean;
}

export async function sendOtpEmail(
  toEmail: string,
  otp: string,
  userName: string = "Otaku",
  type: "login" | "reset" = "login"
): Promise<SendOtpResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;

  const isReset = type === "reset";
  const subject = isReset
    ? `🔑 Reset Your Fan Hub Plus Password: ${otp}`
    : `🔐 Your Fan Hub Plus Verification Code: ${otp}`;
  const actionText = isReset
    ? "Use the verification code below to reset your Fan Hub Plus account password."
    : "Use the verification code below to verify your email and securely access your Fan Hub Plus account.";

  console.log(`\n======================================================`);
  console.log(`📩 [${isReset ? "PASSWORD RESET" : "EMAIL VERIFICATION"} OTP DISPATCHED]`);
  console.log(`To: ${toEmail}`);
  console.log(`Verification OTP Code: [ ${otp} ]`);
  console.log(`Expires in: 10 minutes`);
  console.log(`======================================================\n`);

  // 1. Check Resend API
  if (resendApiKey && resendApiKey !== "YOUR_RESEND_API_KEY" && resendApiKey.startsWith("re_")) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Fan Hub Plus <onboarding@resend.dev>",
          to: [toEmail],
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 40px; border-radius: 16px; max-width: 500px; margin: auto; border: 1px solid rgba(139,92,246,0.3);">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #a78bfa; margin: 0; font-size: 28px; font-weight: 900;">FAN HUB<span style="color: #22d3ee;">+</span></h1>
                <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Universal Entertainment Portal</p>
              </div>
              <p style="font-size: 16px;">Hello <strong>${userName}</strong>,</p>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">${actionText}</p>
              
              <div style="background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2)); border: 2px dashed #8b5cf6; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
                <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="color: #64748b; font-size: 12px; text-align: center;">This code will expire in <strong>10 minutes</strong>. If you did not request this, your account remains secure.</p>
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
              <p style="color: #475569; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} Fan Hub Plus. All rights reserved.</p>
            </div>
          `,
        }),
      });

      if (response.ok) {
        return { success: true, message: "Email sent via Resend API", isRealEmailSent: true };
      }
    } catch (err: any) {
      console.warn("Resend API send failed:", err.message);
    }
  }

  // 2. Check SMTP / Nodemailer
  if (smtpUser && smtpPass && smtpUser !== "YOUR_EMAIL" && smtpPass !== "YOUR_PASSWORD") {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Fan Hub Plus" <${smtpUser}>`,
        to: toEmail,
        subject: `🔐 Your Fan Hub Plus Verification Code: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 40px; border-radius: 16px; max-width: 500px; margin: auto; border: 1px solid rgba(139,92,246,0.3);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #a78bfa; margin: 0; font-size: 28px; font-weight: 900;">FAN HUB<span style="color: #22d3ee;">+</span></h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Universal Entertainment Portal</p>
            </div>
            <p style="font-size: 16px;">Hello <strong>${userName}</strong>,</p>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Use the verification code below to verify your email and securely access your Fan Hub Plus account.</p>
            
            <div style="background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2)); border: 2px dashed #8b5cf6; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
              <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otp}</span>
            </div>
            
            <p style="color: #64748b; font-size: 12px; text-align: center;">This code will expire in <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
            <p style="color: #475569; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} Fan Hub Plus. All rights reserved.</p>
          </div>
        `,
      });

      return { success: true, message: "Email sent via SMTP", isRealEmailSent: true };
    } catch (err: any) {
      console.warn("SMTP send failed:", err.message);
    }
  }

  return {
    success: true,
    message: "OTP generated and logged (configure RESEND_API_KEY or SMTP_USER/SMTP_PASS in .env for live inbox dispatch)",
    isRealEmailSent: false,
  };
}
