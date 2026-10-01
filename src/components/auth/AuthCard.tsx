import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FandomCategory } from "../../types";
import "./AuthCard.css";

interface AuthCardProps {
  initialMode?: "login" | "signup";
}

const FANDOM_OPTIONS: { value: FandomCategory; label: string; icon: string }[] = [
  { value: "Anime", label: "Anime Fandom", icon: "fa-fire" },
  { value: "Gaming", label: "Gaming Universe", icon: "fa-gamepad" },
  { value: "Movies", label: "Movies & Cinema", icon: "fa-film" },
  { value: "TV Shows", label: "TV Shows & Series", icon: "fa-tv" },
  { value: "Comics", label: "Comic Books", icon: "fa-book-open" },
  { value: "Manga", label: "Manga & Webtoons", icon: "fa-scroll" },
  { value: "Cosplay", label: "Cosplay Art", icon: "fa-mask" },
  { value: "K-Pop", label: "K-Pop World", icon: "fa-music" },
];

export default function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [tiltClass, setTiltClass] = useState<string>("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Auth Context & Navigation
  const {
    login,
    signup,
    resetPassword,
    requestOtp,
    verifyOtp,
    resendOtp,
    requestForgotPasswordOtp,
    confirmForgotPassword
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Verification Step State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [favoriteFandom, setFavoriteFandom] = useState<FandomCategory>("Gaming");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isFandomDropdownOpen, setIsFandomDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "login" | "signup" | "error"; text: string } | null>(null);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"email" | "otp_new_pass" | "success">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMaskedEmail, setForgotMaskedEmail] = useState("");
  const [forgotOtpDigits, setForgotOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotDevOtpHint, setForgotDevOtpHint] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotResendCooldown, setForgotResendCooldown] = useState(0);
  const forgotOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Video refs
  const videoLoginRef = useRef<HTMLVideoElement>(null);
  const videoSignupRef = useRef<HTMLVideoElement>(null);

  // Cooldown countdown for OTP resend & Forgot Password resend
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    let timer: any;
    if (forgotResendCooldown > 0) {
      timer = setInterval(() => {
        setForgotResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [forgotResendCooldown]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFandomDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Synchronize mode if user navigates back/forward or prop changes
  useEffect(() => {
    if (initialMode && initialMode !== mode) {
      if (initialMode === "signup") {
        handleShowSignup(false);
      } else {
        handleShowLogin(false);
      }
    }
  }, [initialMode]);

  // Initial video autoplay
  useEffect(() => {
    if (mode === "login" && videoLoginRef.current) {
      videoLoginRef.current.play().catch(() => {});
    } else if (mode === "signup" && videoSignupRef.current) {
      videoSignupRef.current.play().catch(() => {});
    }
  }, []);

  const handleShowSignup = (updateUrl = true) => {
    setIsOtpStep(false);
    setTiltClass("tilt-signup");
    setMode("signup");
    if (updateUrl && location.pathname !== "/signup") {
      window.history.pushState(null, "", "/signup");
    }

    if (videoLoginRef.current && videoSignupRef.current) {
      videoLoginRef.current.classList.remove("active");
      videoSignupRef.current.currentTime = 0;
      videoSignupRef.current.play().catch(() => {});
      videoSignupRef.current.classList.add("active");
    }
  };

  const handleShowLogin = (updateUrl = true) => {
    setIsOtpStep(false);
    setTiltClass("tilt-login");
    setMode("login");
    if (updateUrl && location.pathname !== "/login") {
      window.history.pushState(null, "", "/login");
    }

    if (videoLoginRef.current && videoSignupRef.current) {
      videoSignupRef.current.classList.remove("active");
      videoLoginRef.current.currentTime = 0;
      videoLoginRef.current.play().catch(() => {});
      videoLoginRef.current.classList.add("active");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setFeedback({ type: "error", text: "Please enter both email and password" });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await requestOtp(loginEmail, loginPassword);
      if (res.requireOtp) {
        if (res.email) {
          setLoginEmail(res.email);
        }
        setMaskedEmail(res.maskedEmail || loginEmail);
        setDevOtpHint(res.devOtpHint || null);
        setIsOtpStep(true);
        setResendCooldown(45);
        setOtpDigits(["", "", "", "", "", ""]);
        setFeedback({
          type: "login",
          text: res.isRealEmailSent
            ? "Verification code sent to your email!"
            : "Verification code sent! (Check dev preview below)"
        });
        setTimeout(() => setFeedback(null), 4000);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 120);
      } else {
        const loggedUser = await login(loginEmail, loginPassword);
        if (loggedUser.role === "admin") {
          setFeedback({ type: "login", text: "👑 Administrator Verified! Entering Admin Central..." });
          setTimeout(() => {
            navigate("/admin");
          }, 800);
        } else {
          setFeedback({ type: "login", text: "Welcome Back!" });
          setTimeout(() => {
            navigate("/dashboard");
          }, 800);
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err?.message || "Invalid email or password" });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    // Handle pasting multi-character code
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const nextDigits = [...otpDigits];
      chars.forEach((c, idx) => {
        if (idx < 6) nextDigits[idx] = c;
      });
      setOtpDigits(nextDigits);
      const focusTarget = Math.min(chars.length, 5);
      otpInputRefs.current[focusTarget]?.focus();
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleaned;
    setOtpDigits(nextDigits);

    // Auto move to next input
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join("");
    if (fullCode.length !== 6) {
      setFeedback({ type: "error", text: "Please enter all 6 digits of the verification code." });
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      const verifiedUser = await verifyOtp(loginEmail, fullCode);
      setFeedback({ type: "login", text: "✨ Verification Successful! Entering Realm..." });
      setTimeout(() => {
        if (verifiedUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 800);
    } catch (err: any) {
      setFeedback({ type: "error", text: err?.message || "Invalid or expired OTP code" });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await resendOtp(loginEmail);
      setResendCooldown(45);
      if (res.devOtpHint) {
        setDevOtpHint(res.devOtpHint);
      }
      setFeedback({
        type: "login",
        text: res.isRealEmailSent ? "New code sent to your email!" : "New verification code generated!"
      });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      setFeedback({ type: "error", text: err?.message || "Failed to resend code" });
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) return;

    if (signupPassword !== confirmPassword) {
      setFeedback({ type: "error", text: "Passwords do not match!" });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      await signup(signupName, signupEmail, signupPassword, favoriteFandom);
      setLoginEmail(signupEmail);
      setLoginPassword(signupPassword);

      // Immediately request OTP for newly registered account
      const res = await requestOtp(signupEmail, signupPassword);
      setMaskedEmail(res.maskedEmail || signupEmail);
      setDevOtpHint(res.devOtpHint || null);
      setMode("login");
      setIsOtpStep(true);
      setResendCooldown(45);
      setOtpDigits(["", "", "", "", "", ""]);
      setFeedback({
        type: "login",
        text: res.isRealEmailSent
          ? "Account created! Verification code sent to your email."
          : "Account created! Please enter verification code below."
      });
      setTimeout(() => setFeedback(null), 4000);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 120);
    } catch (err: any) {
      setFeedback({ type: "error", text: err?.message || "Registration failed" });
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: "visitor" | "user" | "admin") => {
    if (role === "admin") {
      setLoginEmail("admin@fanhub.plus");
      setLoginPassword("admin");
    } else if (role === "user") {
      setLoginEmail("hunter@fanhub.plus");
      setLoginPassword("hunter");
    } else {
      setLoginEmail("visitor@fanhub.plus");
      setLoginPassword("visitor");
    }
  };

  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your registered email address.");
      return;
    }
    setForgotLoading(true);
    setForgotError(null);
    try {
      const res = await requestForgotPasswordOtp(forgotEmail.trim());
      setForgotMaskedEmail(res.maskedEmail || forgotEmail);
      setForgotDevOtpHint(res.devOtpHint || null);
      setForgotOtpDigits(["", "", "", "", "", ""]);
      setForgotStep("otp_new_pass");
      setForgotResendCooldown(45);
      setTimeout(() => {
        forgotOtpRefs.current[0]?.focus();
      }, 120);
    } catch (err: any) {
      setForgotError(err?.message || "Could not find an account with this email.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotOtpDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const nextDigits = [...forgotOtpDigits];
      chars.forEach((c, idx) => {
        if (idx < 6) nextDigits[idx] = c;
      });
      setForgotOtpDigits(nextDigits);
      const focusTarget = Math.min(chars.length, 5);
      forgotOtpRefs.current[focusTarget]?.focus();
      return;
    }

    const nextDigits = [...forgotOtpDigits];
    nextDigits[index] = cleaned;
    setForgotOtpDigits(nextDigits);

    if (cleaned && index < 5) {
      forgotOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleForgotOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !forgotOtpDigits[index] && index > 0) {
      forgotOtpRefs.current[index - 1]?.focus();
    }
  };

  const handleForgotResendOtp = async () => {
    if (forgotResendCooldown > 0 || forgotLoading) return;
    setForgotLoading(true);
    setForgotError(null);
    try {
      const res = await requestForgotPasswordOtp(forgotEmail.trim());
      setForgotResendCooldown(45);
      if (res.devOtpHint) {
        setForgotDevOtpHint(res.devOtpHint);
      }
    } catch (err: any) {
      setForgotError(err?.message || "Failed to resend code.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = forgotOtpDigits.join("");
    if (fullCode.length !== 6) {
      setForgotError("Please enter the complete 6-digit verification code.");
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setForgotError("New password must be at least 4 characters long.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match. Please verify.");
      return;
    }

    setForgotLoading(true);
    setForgotError(null);
    try {
      await confirmForgotPassword(forgotEmail.trim(), fullCode, forgotNewPassword);
      setForgotStep("success");
      setLoginEmail(forgotEmail);
      setLoginPassword(forgotNewPassword);

      setTimeout(() => {
        setIsForgotOpen(false);
        setForgotStep("email");
        setForgotEmail("");
        setForgotOtpDigits(["", "", "", "", "", ""]);
        setForgotNewPassword("");
        setForgotConfirmPassword("");
        setFeedback({
          type: "login",
          text: "✨ Password updated successfully! Click 'Enter Realm' to log in."
        });
        setTimeout(() => setFeedback(null), 5000);
      }, 2000);
    } catch (err: any) {
      setForgotError(err?.message || "Password reset failed. Invalid or expired OTP.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCloseForgotModal = () => {
    setIsForgotOpen(false);
    setForgotStep("email");
    setForgotError(null);
    setForgotEmail("");
    setForgotOtpDigits(["", "", "", "", "", ""]);
    setForgotNewPassword("");
    setForgotConfirmPassword("");
  };

  const isSignup = mode === "signup";
  const selectedFandomObj = FANDOM_OPTIONS.find((f) => f.value === favoriteFandom) || FANDOM_OPTIONS[0];

  return (
    <div className="auth-page-container">
      {/* Background Floating Particles */}
      <div className="particles">
        <span style={{ left: "5%", animationDuration: "7s" }} />
        <span style={{ left: "15%", animationDuration: "10s", animationDelay: "2s" }} />
        <span style={{ left: "27%", animationDuration: "8s", animationDelay: "1s" }} />
        <span style={{ left: "40%", animationDuration: "12s", animationDelay: "4s" }} />
        <span style={{ left: "55%", animationDuration: "9s", animationDelay: "2s" }} />
        <span style={{ left: "68%", animationDuration: "11s" }} />
        <span style={{ left: "80%", animationDuration: "8s", animationDelay: "3s" }} />
        <span style={{ left: "92%", animationDuration: "13s", animationDelay: "1s" }} />
      </div>

      <div className="auth-wrapper">
        <div className={`auth-card ${isSignup ? "signup-mode" : "login-mode"} ${tiltClass}`}>
          
          {/* SHOWCASE PANEL WITH DYNAMIC BACKGROUND VIDEOS */}
          <div className="info">
            <div className="info-bg-wrap">
              <video
                ref={videoLoginRef}
                className="info-bg-video active"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/1.mp4" type="video/mp4" />
              </video>
              <video
                ref={videoSignupRef}
                className="info-bg-video"
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/2.mp4" type="video/mp4" />
              </video>
              <div className="info-overlay" />
            </div>

            <div className="info-card">
              <div className="logo-wrap">
                <div className="logo">
                  <i className={`fa-solid ${isSignup ? "fa-fire" : "fa-bolt"}`} />
                </div>
                <span className="info-badge">
                  <i className={`fa-solid ${isSignup ? "fa-fire" : "fa-bolt"}`} />{" "}
                  {isSignup ? "Shinobi Realm" : "Shadow Realm"}
                </span>
              </div>

              <h1 className="info-title">
                {isSignup ? (
                  <>
                    Join Our <span className="highlight">Community</span>
                  </>
                ) : (
                  <>
                    Shadow <span className="highlight">Dominion</span>
                  </>
                )}
              </h1>

              <p className="info-desc">
                {isSignup
                  ? "Step into the shinobi universe — join our elite community & unlock exclusive anime power."
                  : "Return to the shadows — step into the realm and awaken your ultimate warrior power."}
              </p>

              <div className="info-stats">
                <div className="stat-item">
                  <span className="stat-val">{isSignup ? "50K+" : "Rank S"}</span>
                  <span className="stat-lbl">{isSignup ? "Shinobi" : "Hunter"}</span>
                </div>
                <div className="stat-sep" />
                <div className="stat-item">
                  <span className="stat-val">{isSignup ? "Akatsuki" : "Shadow"}</span>
                  <span className="stat-lbl">Clan</span>
                </div>
                <div className="stat-sep" />
                <div className="stat-item">
                  <span className="stat-val">Active</span>
                  <span className="stat-lbl">{isSignup ? "24/7 Active" : "Domain"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: LOGIN PANEL */}
          <section className="panel login">
            {isOtpStep ? (
              <div className="otp-verification-container">
                <div className="brand">
                  Verify <span className="brand-highlight">Email OTP</span>
                </div>
                <div className="subtitle">
                  Enter the 6-digit verification code sent to{" "}
                  <span className="text-white font-semibold">{maskedEmail || loginEmail}</span>
                </div>

                {feedback && feedback.type === "error" && (
                  <div className="mb-2 px-3 py-1.5 text-xs bg-red-500/20 border border-red-500/40 text-red-200 rounded-lg flex items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation" /> {feedback.text}
                  </div>
                )}

                {feedback && feedback.type === "login" && (
                  <div className="mb-2 px-3 py-1.5 text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 rounded-lg flex items-center gap-2">
                    <i className="fa-solid fa-check-circle" /> {feedback.text}
                  </div>
                )}

                {devOtpHint && (
                  <div className="dev-otp-banner">
                    <div className="dev-otp-header">
                      <i className="fa-solid fa-terminal" /> Testing / Dev Mode OTP:
                    </div>
                    <div className="dev-otp-code-row">
                      <span className="dev-otp-code">{devOtpHint}</span>
                      <button
                        type="button"
                        className="dev-otp-fill-btn"
                        onClick={() => {
                          const digits = devOtpHint.split("").slice(0, 6);
                          setOtpDigits(digits);
                          otpInputRefs.current[5]?.focus();
                        }}
                      >
                        <i className="fa-solid fa-paste" /> Auto-fill
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerifyOtpSubmit}>
                  <div className="otp-boxes-wrapper">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onFocus={(e) => e.target.select()}
                        className="otp-digit-input"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>

                  <div className="otp-resend-row">
                    <span className="otp-resend-text">Didn't get code?</span>
                    <button
                      type="button"
                      className="otp-resend-btn"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleResendOtp}
                    >
                      {resendCooldown > 0 ? (
                        <>Resend in <span className="otp-countdown-num">{resendCooldown}s</span></>
                      ) : (
                        <><i className="fa-solid fa-rotate-right" /> Resend OTP</>
                      )}
                    </button>
                  </div>

                  <button
                    className="btn"
                    type="submit"
                    disabled={isLoading || otpDigits.join("").length !== 6}
                    style={
                      feedback?.type === "login"
                        ? { background: "linear-gradient(90deg, #00c853, #00e676)" }
                        : {}
                    }
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" /> Verifying...
                      </>
                    ) : feedback?.type === "login" ? (
                      <>
                        <i className="fa-solid fa-circle-check" /> Verified!
                      </>
                    ) : (
                      <>
                        Verify & Enter Realm <i className="fa-solid fa-arrow-right" />
                      </>
                    )}
                  </button>

                  <div className="otp-back-wrap">
                    <button
                      type="button"
                      className="otp-back-btn"
                      onClick={() => setIsOtpStep(false)}
                    >
                      <i className="fa-solid fa-arrow-left" /> Change Email / Back to Login
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="mobile-auth-tabs">
                  <button
                    type="button"
                    className="mobile-tab active"
                    onClick={() => handleShowLogin(true)}
                  >
                    <i className="fa-solid fa-arrow-right-to-bracket mr-1.5" /> Sign In
                  </button>
                  <button
                    type="button"
                    className="mobile-tab"
                    onClick={() => handleShowSignup(true)}
                  >
                    <i className="fa-solid fa-user-plus mr-1.5" /> Sign Up
                  </button>
                </div>
                <div className="brand">
                  Welcome <span className="brand-highlight">Back</span>
                </div>
                <div className="subtitle">Enter your credentials to enter the shadow realm</div>

                {feedback && feedback.type === "error" && (
                  <div className="mb-2 px-3 py-1.5 text-xs bg-red-500/20 border border-red-500/40 text-red-200 rounded-lg flex items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation" /> {feedback.text}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <div className="field">
                    <label className="field-label">Email Address</label>
                    <div className="input-wrap">
                      <i className="fa-solid fa-envelope field-icon" />
                      <input
                        type="email"
                        placeholder="hunter@fanhub.plus"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label">Password</label>
                    <div className="input-wrap">
                      <i className="fa-solid fa-lock field-icon" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <i
                        className={`fa-solid ${showLoginPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      />
                    </div>
                  </div>

                  <div className="options">
                    <label>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />{" "}
                      Remember me
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsForgotOpen(true);
                      }}
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    className="btn"
                    type="submit"
                    disabled={isLoading}
                    style={
                      feedback?.type === "login"
                        ? { background: "linear-gradient(90deg, #00c853, #00e676)" }
                        : {}
                    }
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" /> Verifying Credentials...
                      </>
                    ) : feedback?.type === "login" ? (
                      <>
                        <i className="fa-solid fa-circle-check" /> Verified!
                      </>
                    ) : (
                      <>
                        Enter Realm <i className="fa-solid fa-arrow-right" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Demo Logins for Testing */}
                <div className="demo-roles-wrap">
                  <div className="demo-roles-title">⚡ Quick 1-Click Demo Login</div>
                  <div className="demo-roles-grid">
                    <button
                      type="button"
                      className="demo-btn"
                      onClick={() => handleDemoLogin("user")}
                      title="Demo User"
                    >
                      <i className="fa-solid fa-shield-halved" /> User
                    </button>
                    <button
                      type="button"
                      className="demo-btn"
                      onClick={() => handleDemoLogin("visitor")}
                      title="Demo Visitor"
                    >
                      <i className="fa-solid fa-user-astronaut" /> Visitor
                    </button>
                  </div>
                </div>

                <div className="switch">
                  Don't have an account?{" "}
                  <a onClick={() => handleShowSignup(true)}>Create Account</a>
                </div>
              </>
            )}
          </section>

          {/* RIGHT SIDE: SIGNUP PANEL */}
          <section className="panel signup">
            <div className="mobile-auth-tabs">
              <button
                type="button"
                className="mobile-tab"
                onClick={() => handleShowLogin(true)}
              >
                <i className="fa-solid fa-arrow-right-to-bracket mr-1.5" /> Sign In
              </button>
              <button
                type="button"
                className="mobile-tab active signup"
                onClick={() => handleShowSignup(true)}
              >
                <i className="fa-solid fa-user-plus mr-1.5" /> Sign Up
              </button>
            </div>
            <div className="brand">
              Create <span className="brand-highlight-signup">Account</span>
            </div>
            <div className="subtitle">Join us and start your shinobi journey</div>

            {feedback && feedback.type === "error" && (
              <div className="mb-2 px-3 py-1.5 text-xs bg-red-500/20 border border-red-500/40 text-red-200 rounded-lg flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation" /> {feedback.text}
              </div>
            )}

            <form onSubmit={handleSignupSubmit}>
              <div className="field">
                <label className="field-label">Full Name</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-user field-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Minato Namikaze"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Email Address</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-envelope field-icon" />
                  <input
                    type="email"
                    placeholder="admin@sentrova.co.uk"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Custom Styled Fandom Dropdown (No white-box bugs!) */}
              <div className="field" ref={dropdownRef}>
                <label className="field-label">Favorite Fandom</label>
                <div className="input-wrap">
                  <i className={`fa-solid ${selectedFandomObj.icon} field-icon text-red-400`} />
                  <button
                    type="button"
                    className={`fandom-dropdown-btn ${isFandomDropdownOpen ? "open" : ""}`}
                    onClick={() => setIsFandomDropdownOpen(!isFandomDropdownOpen)}
                  >
                    <span>{selectedFandomObj.label}</span>
                    <i className={`fa-solid fa-chevron-${isFandomDropdownOpen ? "up" : "down"} text-xs text-muted`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isFandomDropdownOpen && (
                    <div className="fandom-dropdown-menu">
                      {FANDOM_OPTIONS.map((f) => (
                        <button
                          key={f.value}
                          type="button"
                          className={`fandom-dropdown-item ${favoriteFandom === f.value ? "selected" : ""}`}
                          onClick={() => {
                            setFavoriteFandom(f.value);
                            setIsFandomDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <i className={`fa-solid ${f.icon} w-4 text-center ${favoriteFandom === f.value ? "text-red-400" : "text-muted"}`} />
                            <span>{f.label}</span>
                          </div>
                          {favoriteFandom === f.value && (
                            <i className="fa-solid fa-check text-xs text-red-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-lock field-icon" />
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Create a password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  <i
                    className={`fa-solid ${showSignupPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Confirm Password</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-shield-halved field-icon" />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="options">
                <label>
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />{" "}
                  I agree to Terms & Conditions
                </label>
              </div>

              <button
                className="btn"
                type="submit"
                disabled={isLoading}
                style={
                  feedback?.type === "signup"
                    ? { background: "linear-gradient(90deg, #00c853, #00e676)" }
                    : {}
                }
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" /> Creating Clan...
                  </>
                ) : feedback?.type === "signup" ? (
                  <>
                    <i className="fa-solid fa-circle-check" /> Account Created!
                  </>
                ) : (
                  <>
                    Join Clan <i className="fa-solid fa-user-plus" />
                  </>
                )}
              </button>
            </form>

            <div className="switch">
              Already have an account?{" "}
              <a onClick={() => handleShowLogin(true)}>Login</a>
            </div>
          </section>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1222]/95 border border-white/15 rounded-2xl max-w-md w-full p-6 sm:p-7 relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={handleCloseForgotModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>

            {forgotStep === "email" && (
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/30 border border-violet-500/40 text-violet-300 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/10">
                  <i className="fa-solid fa-key text-xl text-cyan-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                  Reset Password <span className="text-cyan-400 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-medium">OTP Secured</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Enter your registered account email. We will dispatch a secure 6-digit verification code to reset your password.
                </p>

                {forgotError && (
                  <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation text-sm shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <form onSubmit={handleForgotRequestOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Registered Email</label>
                    <div className="relative">
                      <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="hunter@fanhub.plus"
                        className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Quick Demo Autofill */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-500">Quick fill:</span>
                    <button
                      type="button"
                      onClick={() => setForgotEmail("hunter@fanhub.plus")}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
                    >
                      hunter@fanhub.plus
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotEmail("admin@fanhub.plus")}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-violet-300 border border-slate-700 transition-colors"
                    >
                      admin@fanhub.plus
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white rounded-xl font-bold text-sm hover:opacity-95 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" /> Dispatching Code...
                      </>
                    ) : (
                      <>
                        Send Reset Code <i className="fa-solid fa-paper-plane text-xs" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {forgotStep === "otp_new_pass" && (
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
                  <i className="fa-solid fa-shield-halved text-xl text-cyan-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                  Verify Code & New Password
                </h3>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Enter the 6-digit code sent to <span className="text-white font-semibold">{forgotMaskedEmail || forgotEmail}</span> and choose a new password.
                </p>

                {forgotDevOtpHint && (
                  <div className="mb-3 p-2.5 bg-cyan-500/15 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-info text-cyan-400" /> Dev Preview OTP:
                    </span>
                    <span className="font-mono font-black text-white bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-400/50 tracking-wider">
                      {forgotDevOtpHint}
                    </span>
                  </div>
                )}

                {forgotError && (
                  <div className="mb-3 p-2.5 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation text-sm shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <form onSubmit={handleForgotConfirmReset} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">6-Digit Verification Code</label>
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      {forgotOtpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            forgotOtpRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleForgotOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleForgotOtpKeyDown(idx, e)}
                          className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-black bg-slate-900/90 border border-slate-700/80 rounded-xl text-cyan-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-slate-400">Didn't receive code?</span>
                    <button
                      type="button"
                      disabled={forgotResendCooldown > 0 || forgotLoading}
                      onClick={handleForgotResendOtp}
                      className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 font-medium"
                    >
                      {forgotResendCooldown > 0 ? `Resend in ${forgotResendCooldown}s` : "Resend Code"}
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
                    <div className="relative">
                      <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        required
                        minLength={4}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="At least 4 characters"
                        className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <i className={`fa-solid ${showForgotNewPassword ? "fa-eye-slash" : "fa-eye"}`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <i className="fa-solid fa-shield-halved absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="password"
                        required
                        minLength={4}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading || forgotOtpDigits.join("").length !== 6 || !forgotNewPassword}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white rounded-xl font-bold text-sm hover:opacity-95 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-2"
                  >
                    {forgotLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" /> Updating Password...
                      </>
                    ) : (
                      <>
                        Confirm & Reset Password <i className="fa-solid fa-check text-xs" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep("email")}
                      className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <i className="fa-solid fa-arrow-left text-[10px] mr-1" /> Change Email
                    </button>
                  </div>
                </form>
              </div>
            )}

            {forgotStep === "success" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
                  <i className="fa-solid fa-check text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Password Successfully Reset!</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto mb-4 leading-relaxed">
                  Your credentials have been updated in the database. Redirecting you to login with your new password...
                </p>
                <div className="w-8 h-8 mx-auto border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      , document.body)}
    </div>
  );
}
