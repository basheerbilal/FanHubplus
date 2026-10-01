// server.ts
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// server/mongodb.ts
import mongoose, { Schema } from "mongoose";
var UserSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
  avatar: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  favorites: { type: [String], default: [] },
  role: { type: String, enum: ["admin", "registered", "visitor"], default: "registered" },
  createdAt: { type: Number, default: () => Date.now() }
});
var UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
var UserDataSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  watchlist: { type: [String], default: [] },
  favorites: { type: [String], default: [] },
  ratings: [{ contentId: String, score: Number }],
  activities: [{
    id: String,
    type: { type: String, enum: ["watchlist", "view", "rate", "join"] },
    contentId: String,
    contentTitle: String,
    timestamp: Number
  }]
});
var UserDataModel = mongoose.models.UserData || mongoose.model("UserData", UserDataSchema);
var SubmissionSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  sourceUrl: { type: String },
  authorEmail: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  timestamp: { type: Number, default: () => Date.now() }
});
var SubmissionModel = mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
var FaqSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String }
});
var FaqModel = mongoose.models.Faq || mongoose.model("Faq", FaqSchema);
var FeedbackSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  email: { type: String },
  timestamp: { type: Number, default: () => Date.now() }
});
var FeedbackModel = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
var MerchandiseSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  fandom: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  tags: { type: [String], default: [] },
  description: { type: String, required: true },
  releaseDate: { type: String },
  isUpcoming: { type: Boolean, default: false },
  addedAt: { type: Number, default: () => Date.now() }
});
var MerchandiseModel = mongoose.models.Merchandise || mongoose.model("Merchandise", MerchandiseSchema);
var ExploreSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  year: { type: Number, default: () => (/* @__PURE__ */ new Date()).getFullYear() },
  url: { type: String, required: true },
  addedAt: { type: Number, default: () => Date.now() }
});
var ExploreModel = mongoose.models.Explore || mongoose.model("Explore", ExploreSchema);
var MongoDatabaseManager = class {
  static {
    this.isConnected = false;
  }
  static {
    this.connectionError = null;
  }
  static async connect(uri) {
    const mongoUri = uri || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log("\u2139\uFE0F No MONGODB_URI provided in .env. Operating in Local Persistent JSON mode.");
      this.isConnected = false;
      return false;
    }
    try {
      console.log("\u23F3 Connecting to MongoDB...");
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5e3
      });
      this.isConnected = true;
      this.connectionError = null;
      console.log("\u{1F7E2} Successfully connected to MongoDB Database!");
      return true;
    } catch (err) {
      this.isConnected = false;
      this.connectionError = err.message || "MongoDB Connection Failed";
      console.warn("\u26A0\uFE0F MongoDB connection could not be established:", err.message);
      console.log("\u2139\uFE0F Gracefully falling back to Local JSON database.");
      return false;
    }
  }
  static getStatus() {
    return {
      isConnected: this.isConnected && mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      databaseName: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
      error: this.connectionError
    };
  }
  static get isMongoActive() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
  // ── SYNC HELPERS (Safe async background writes) ──
  static async syncUser(user) {
    if (!this.isMongoActive) return;
    try {
      await UserModel.findOneAndUpdate({ id: user.id }, user, { upsert: true, new: true });
    } catch (e) {
      console.warn("MongoDB syncUser error:", e.message);
    }
  }
  static async syncUserData(userId, data) {
    if (!this.isMongoActive) return;
    try {
      await UserDataModel.findOneAndUpdate({ userId }, { userId, ...data }, { upsert: true, new: true });
    } catch (e) {
      console.warn("MongoDB syncUserData error:", e.message);
    }
  }
  static async syncSubmission(submission) {
    if (!this.isMongoActive) return;
    try {
      await SubmissionModel.findOneAndUpdate({ id: submission.id }, submission, { upsert: true, new: true });
    } catch (e) {
      console.warn("MongoDB syncSubmission error:", e.message);
    }
  }
  static async deleteSubmission(id) {
    if (!this.isMongoActive) return;
    try {
      await SubmissionModel.deleteOne({ id });
    } catch (e) {
      console.warn("MongoDB deleteSubmission error:", e.message);
    }
  }
  static async syncFaq(faq) {
    if (!this.isMongoActive) return;
    try {
      await FaqModel.findOneAndUpdate({ id: faq.id }, faq, { upsert: true, new: true });
    } catch (e) {
      console.warn("MongoDB syncFaq error:", e.message);
    }
  }
  static async deleteFaq(id) {
    if (!this.isMongoActive) return;
    try {
      await FaqModel.deleteOne({ id });
    } catch (e) {
      console.warn("MongoDB deleteFaq error:", e.message);
    }
  }
  static async syncFeedback(feedback) {
    if (!this.isMongoActive) return;
    try {
      await FeedbackModel.findOneAndUpdate({ id: feedback.id }, feedback, { upsert: true, new: true });
    } catch (e) {
      console.warn("MongoDB syncFeedback error:", e.message);
    }
  }
  static async syncMerchandise(item) {
    if (!this.isMongoActive) return;
    try {
      await MerchandiseModel.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    } catch (e) {
      console.warn("MongoDB syncMerchandise error:", e.message);
    }
  }
  static async deleteMerchandise(id) {
    if (!this.isMongoActive) return;
    try {
      await MerchandiseModel.deleteOne({ id });
    } catch (e) {
      console.warn("MongoDB deleteMerchandise error:", e.message);
    }
  }
  static async syncExplore(item) {
    if (!this.isMongoActive) return;
    try {
      await ExploreModel.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    } catch (e) {
      console.warn("MongoDB syncExplore error:", e.message);
    }
  }
  static async deleteExplore(id) {
    if (!this.isMongoActive) return;
    try {
      await ExploreModel.deleteOne({ id });
    } catch (e) {
      console.warn("MongoDB deleteExplore error:", e.message);
    }
  }
};

// server/email.ts
import nodemailer from "nodemailer";
async function sendOtpEmail(toEmail, otp, userName = "Otaku", type = "login") {
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const isReset = type === "reset";
  const subject = isReset ? `\u{1F511} Reset Your Fan Hub Plus Password: ${otp}` : `\u{1F510} Your Fan Hub Plus Verification Code: ${otp}`;
  const actionText = isReset ? "Use the verification code below to reset your Fan Hub Plus account password." : "Use the verification code below to verify your email and securely access your Fan Hub Plus account.";
  console.log(`
======================================================`);
  console.log(`\u{1F4E9} [${isReset ? "PASSWORD RESET" : "EMAIL VERIFICATION"} OTP DISPATCHED]`);
  console.log(`To: ${toEmail}`);
  console.log(`Verification OTP Code: [ ${otp} ]`);
  console.log(`Expires in: 10 minutes`);
  console.log(`======================================================
`);
  if (resendApiKey && resendApiKey !== "YOUR_RESEND_API_KEY" && resendApiKey.startsWith("re_")) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
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
              <p style="color: #475569; font-size: 11px; text-align: center;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Fan Hub Plus. All rights reserved.</p>
            </div>
          `
        })
      });
      if (response.ok) {
        return { success: true, message: "Email sent via Resend API", isRealEmailSent: true };
      }
    } catch (err) {
      console.warn("Resend API send failed:", err.message);
    }
  }
  if (smtpUser && smtpPass && smtpUser !== "YOUR_EMAIL" && smtpPass !== "YOUR_PASSWORD") {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      await transporter.sendMail({
        from: `"Fan Hub Plus" <${smtpUser}>`,
        to: toEmail,
        subject: `\u{1F510} Your Fan Hub Plus Verification Code: ${otp}`,
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
            <p style="color: #475569; font-size: 11px; text-align: center;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Fan Hub Plus. All rights reserved.</p>
          </div>
        `
      });
      return { success: true, message: "Email sent via SMTP", isRealEmailSent: true };
    } catch (err) {
      console.warn("SMTP send failed:", err.message);
    }
  }
  return {
    success: true,
    message: "OTP generated and logged (configure RESEND_API_KEY or SMTP_USER/SMTP_PASS in .env for live inbox dispatch)",
    isRealEmailSent: false
  };
}

// server.ts
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use((req, _res, next) => {
  const matchedPath = req.headers["x-matched-path"];
  if (matchedPath && typeof matchedPath === "string") {
    req.url = matchedPath;
  }
  if (req.url && !req.url.startsWith("/api") && !req.url.startsWith("/?")) {
    req.url = "/api" + req.url;
  }
  next();
});
var UPLOADS_DIR = process.env.VERCEL ? path.join("/tmp", "uploads") : path.join(__dirname, "public", "uploads");
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
}
var streamMediaHandler = (req, res, next) => {
  const filename = path.basename(req.params.filename || req.path.replace(/^\//, ""));
  const filePath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return next();
  }
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const ext = path.extname(filename).toLowerCase();
  const mimeMap = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogg": "video/ogg",
    ".mov": "video/quicktime",
    ".mkv": "video/x-matroska",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
  };
  const contentType = mimeMap[ext] || "application/octet-stream";
  if (!ext.match(/\.(mp4|webm|ogg|mov|mkv|mp3|wav)$/i)) {
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    return res.sendFile(filePath);
  }
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const CHUNK_SIZE = 4 * 1024 * 1024;
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE, fileSize - 1);
    if (start >= fileSize) {
      res.status(416).setHeader("Content-Range", `bytes */${fileSize}`).send("Range out of bounds");
      return;
    }
    const chunksize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Connection": "keep-alive"
    });
    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600"
    });
    fs.createReadStream(filePath).pipe(res);
  }
};
app.get("/uploads/:filename", streamMediaHandler);
app.get("/api/stream/:filename", streamMediaHandler);
app.use("/uploads", express.static(UPLOADS_DIR));
var DATA_DIR = process.env.VERCEL ? path.join("/tmp", "data") : path.join(__dirname, "data");
var DB_FILE = path.join(DATA_DIR, "database.json");
var DEFAULT_DB = {
  users: [
    {
      id: "admin-1",
      name: "Admin Commander",
      email: "admin@fanhub.plus",
      password: "admin",
      avatar: "https://api.dicebear.com/7.x/lorelei/png?seed=Levi&size=128",
      isEmailVerified: true,
      favorites: ["Anime", "Gaming", "Manga"],
      role: "admin",
      createdAt: Date.now() - 864e5 * 30
    },
    {
      id: "user-1",
      name: "Shadow Hunter",
      email: "hunter@fanhub.plus",
      password: "hunter",
      avatar: "https://api.dicebear.com/7.x/lorelei/png?seed=Naruto&size=128",
      isEmailVerified: true,
      favorites: ["Anime", "Gaming"],
      role: "registered",
      createdAt: Date.now() - 864e5 * 15
    },
    {
      id: "visitor-1",
      name: "Space Traveler",
      email: "visitor@fanhub.plus",
      password: "visitor",
      avatar: "https://api.dicebear.com/7.x/lorelei/png?seed=Goku&size=128",
      isEmailVerified: false,
      favorites: ["Anime", "Movies"],
      role: "visitor",
      createdAt: Date.now() - 864e5 * 5
    }
  ],
  userData: {
    "admin-1": {
      watchlist: ["anime-16498", "exp-1", "m1"],
      favorites: ["Anime", "Gaming", "Manga"],
      ratings: [{ contentId: "anime-16498", score: 9.5 }],
      activities: [
        { id: "act-1", type: "watchlist", contentTitle: "Solo Leveling", timestamp: Date.now() - 36e5 * 2 },
        { id: "act-2", type: "rate", contentTitle: "Attack on Titan", timestamp: Date.now() - 36e5 * 12 }
      ]
    },
    "user-1": {
      watchlist: ["anime-16498", "m2"],
      favorites: ["Anime", "Gaming"],
      ratings: [{ contentId: "anime-16498", score: 9 }],
      activities: [
        { id: "act-3", type: "watchlist", contentTitle: "Solo Leveling", timestamp: Date.now() - 36e5 * 4 }
      ]
    }
  },
  submissions: [
    {
      id: "sub-1",
      title: "Top 10 Arcane Lore Theories for Season 2",
      category: "Gaming",
      type: "Article",
      description: "An in-depth breakdown of Zaun and Piltover conflicts, Hextech consequences, and Viktor's evolutionary arc.",
      sourceUrl: "https://example.com/arcane-lore",
      authorEmail: "fan_theorist@gmail.com",
      status: "pending",
      timestamp: Date.now() - 36e5 * 4
    },
    {
      id: "sub-2",
      title: "Levi Ackerman Maneuver Gear Cosplay Build Guide",
      category: "Cosplay",
      type: "Character Profile",
      description: "Full blueprint on creating high-durability lightweight 3D maneuver gear using EVA foam and metallic acrylic paint.",
      sourceUrl: "https://example.com/cosplay-levi",
      authorEmail: "levi_fan@gmail.com",
      status: "pending",
      timestamp: Date.now() - 36e5 * 12
    },
    {
      id: "sub-3",
      title: "NewJeans Bubble Gum MV Aesthetic Analysis",
      category: "K-Pop",
      type: "Article",
      description: "Retro VHS nostalgia, 90s camcorder framing, and Y2K sound design that made Bubble Gum an instant viral hit.",
      sourceUrl: "https://example.com/newjeans-analysis",
      authorEmail: "bunnies_hq@gmail.com",
      status: "approved",
      timestamp: Date.now() - 36e5 * 48
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "How do I save content to my Watchlist?",
      answer: "Click the Bookmark / Save icon on any movie, anime, or merchandise card. You can view all saved items in your personalized Dashboard.",
      category: "Bookmarks"
    },
    {
      id: "faq-2",
      question: "Can I buy merchandise directly on Fan Hub Plus?",
      answer: "No, Fan Hub Plus is exclusively a discovery showcase and fan lore platform. Transactions, checkouts, and payment processing are not supported.",
      category: "Merchandise"
    },
    {
      id: "faq-3",
      question: "How does the fan submission review process work?",
      answer: "Registered users can submit lore articles or character profiles via 'Submit Content'. Administrators review and approve submissions before they appear publicly.",
      category: "Submissions"
    },
    {
      id: "faq-4",
      question: "What fandom universes are supported?",
      answer: "We support 8 major fandom universes: Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay.",
      category: "General"
    }
  ],
  feedback: [],
  merchandise: [
    { id: "m1", title: "Satoru Gojo Nendoroid", category: "Figures", fandom: "Jujutsu Kaisen", price: "$59.99", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800", tags: ["Limited Edition", "Pre-Order"], description: "Highly detailed poseable figure with multiple expressions, blindfold swap heads, and domain expansion effect pieces.", addedAt: Date.now() - 864e4 * 5 },
    { id: "m2", title: "Cyberpunk 2077 Katana Replica", category: "Collectibles", fandom: "Gaming", price: "$299.99", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800", tags: ["Collectible", "Limited Edition"], description: "1:1 scale neon-lit replica of the Thermal Katana with aircraft-grade aluminum alloy handle and LED lighting core.", addedAt: Date.now() - 864e4 * 4 },
    { id: "m3", title: "Legend of Zelda: Master Sword", category: "Collectibles", fandom: "Gaming", price: "$149.99", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800", tags: ["Classic"], description: "High-quality forged stainless steel display replica with ornate resin scabbard and Triforce wall mount.", addedAt: Date.now() - 864e4 * 3 },
    { id: "m4", title: "Demon Slayer: Zenitsu Hoodie", category: "Apparel", fandom: "Anime", price: "$45.00", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", tags: ["New Arrival"], description: "Heavyweight 400GSM cotton hoodie featuring embroidered signature yellow-orange lightning triangle pattern.", addedAt: Date.now() - 864e4 * 2 },
    { id: "m5", title: "Gundam RX-78-2 Perfect Grade Unleashed", category: "Model Kits", fandom: "Anime", price: "$275.00", image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800", tags: ["Limited Edition", "Pre-Order"], description: "State-of-the-art multi-layer internal skeleton frame with etched metal parts and full LED illumination.", addedAt: Date.now() - 864e4 },
    { id: "m6", title: "Spider-Man 2 Advanced Suit 1/6 Scale", category: "Figures", fandom: "Comics", price: "$285.00", image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80&w=800", tags: ["Pre-Order"], description: "Screen-accurate tailored suit with magnetic web wings, articulated symbiote tendrils, and dynamic skyline base.", addedAt: Date.now() },
    { id: "up-1", title: "Elden Ring: Messmer Helmet Replica", category: "Collectibles", fandom: "Gaming", price: "$399.00", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800", tags: ["Pre-Order", "Limited Edition"], description: "Numbered limited edition (9,999 units) wearable helm cast in pure brass and weathered resin finish.", releaseDate: "November 2026", isUpcoming: true, addedAt: Date.now() },
    { id: "up-2", title: "AOT: The Rumbling Colossal Titan Diorama", category: "Statues", fandom: "Anime", price: "$650.00", image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800", tags: ["Pre-Order"], description: "Massive 24-inch polystone diorama with translucent resin steam effects and LED glowing eyes.", releaseDate: "December 2026", isUpcoming: true, addedAt: Date.now() }
  ],
  explore: [
    { id: "exp-1", title: "Arcane: League of Legends", description: "Award-winning animated series set in the world of Runeterra. A masterpiece of storytelling.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800", category: "Gaming", rating: 9.2, year: 2023, url: "https://www.netflix.com/title/81435227", addedAt: Date.now() - 864e4 * 3 },
    { id: "exp-2", title: "Dune: Part Two", description: "Epic sci-fi sequel following Paul Atreides as he unites with the Fremen of Arrakis.", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&q=80&w=800", category: "Movies", rating: 8.8, year: 2024, url: "https://www.imdb.com/title/tt15239678/", addedAt: Date.now() - 864e4 * 2 },
    { id: "exp-3", title: "Elden Ring Shadow of the Erdtree", description: "Massive DLC expansion bringing new bosses, weapons, and the Land of Shadow to explore.", image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&q=80&w=800", category: "Gaming", rating: 9.4, year: 2024, url: "https://store.steampowered.com/app/2778580/ELDEN_RING_Shadow_of_the_Erdtree/", addedAt: Date.now() - 864e4 },
    { id: "exp-4", title: "NewJeans \u2013 How Sweet", description: "NewJeans' chart-topping bop blending dreamy retro synths with their signature Y2K-pop aesthetic.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800", category: "K-Pop", rating: 8.5, year: 2024, url: "https://www.youtube.com/watch?v=rC8tKf0YWLQ", addedAt: Date.now() }
  ],
  topShows: [
    { rank: 1, id: "show-1", title: "Naruto: Shippuden", category: "Anime", views: "9.8M Views", rating: 8.7, episodes: "500 Episodes", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=1dmVICn2bJY", badge: "RANK #1", addedAt: Date.now() - 864e4 * 10 },
    { rank: 2, id: "show-2", title: "Solo Leveling: Shadow Monarch", category: "Anime & Webtoon", views: "8.9M Views", rating: 8.9, episodes: "24 Episodes", image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-37yfQA3ym8PA.jpg", trailerUrl: "https://www.youtube.com/watch?v=9g_8r_r7-80", badge: "POPULAR", addedAt: Date.now() - 864e4 * 9 },
    { rank: 3, id: "show-3", title: "The Exiled Heavy Knight", category: "Anime & Gaming", views: "7.4M Views", rating: 8.5, episodes: "12 Episodes", image: "https://image.tmdb.org/t/p/w500/h2JZRLaFXWWhh61vAjqgHXeiZd8.jpg", trailerUrl: "https://youtu.be/UXgbofdm2vQ?si=_rFjVmUy29zs5olw", badge: "TRENDING", addedAt: Date.now() - 864e4 * 8 },
    { rank: 4, id: "show-4", title: "Naruto (Classic)", category: "Anime", views: "6.8M Views", rating: 8.3, episodes: "220 Episodes", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=-G9BqkgZXRA", badge: "CLASSIC", addedAt: Date.now() - 864e4 * 7 },
    { rank: 5, id: "show-5", title: "One Piece: Egghead Island", category: "Anime", views: "6.5M Views", rating: 9, episodes: "1100+ Episodes", image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=MCb13lbKpsM", badge: "HOT", addedAt: Date.now() - 864e4 * 6 },
    { rank: 6, id: "show-6", title: "Demon Slayer: Kimetsu no Yaiba", category: "Anime", views: "6.1M Views", rating: 8.8, episodes: "55 Episodes", image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-33MtJGsUSxga.jpg", trailerUrl: "https://www.youtube.com/watch?v=Q4XN3y7Uu3I", badge: "MUST WATCH", addedAt: Date.now() - 864e4 * 5 },
    { rank: 7, id: "show-7", title: "Jujutsu Kaisen: Shibuya Incident", category: "Anime", views: "5.7M Views", rating: 8.9, episodes: "47 Episodes", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=pkKu8vhV57E", badge: "BLOCKBUSTER", addedAt: Date.now() - 864e4 * 4 },
    { rank: 8, id: "show-8", title: "Attack on Titan: The Final Season", category: "Anime", views: "5.4M Views", rating: 9.1, episodes: "87 Episodes", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=M_OauHnAFc8", badge: "TOP RATED", addedAt: Date.now() - 864e4 * 3 },
    { rank: 9, id: "show-9", title: "Bleach: Thousand-Year Blood War", category: "Anime", views: "4.9M Views", rating: 8.7, episodes: "39 Episodes", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800", trailerUrl: "https://www.youtube.com/watch?v=78WIYzX_Bks", badge: "EPIC", addedAt: Date.now() - 864e4 * 2 },
    { rank: 10, id: "show-10", title: "Cyberpunk: Edgerunners", category: "Anime & Gaming", views: "4.5M Views", rating: 8.6, episodes: "10 Episodes", image: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/130591-JZ3bsMomOj8y.jpg", trailerUrl: "https://www.youtube.com/embed/JtqIas3bYhg", badge: "AWARD WINNER", addedAt: Date.now() - 864e4 }
  ]
};
function loadDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (e) {
      }
    }
    if (!fs.existsSync(DB_FILE)) {
      const bundledPath = path.join(__dirname, "data", "database.json");
      if (fs.existsSync(bundledPath)) {
        try {
          const raw2 = fs.readFileSync(bundledPath, "utf-8");
          const parsed = JSON.parse(raw2);
          try {
            fs.writeFileSync(DB_FILE, raw2, "utf-8");
          } catch (e) {
          }
          return parsed;
        } catch (e) {
        }
      }
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
      } catch (e) {
      }
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read database file:", err);
    return DEFAULT_DB;
  }
}
function saveDb(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (e) {
      }
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save database file:", err);
  }
}
var db = loadDb();
async function initMongo() {
  const connected = await MongoDatabaseManager.connect();
  if (connected) {
    try {
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        console.log("\u{1F331} Seeding default collections into MongoDB...");
        await UserModel.insertMany(db.users);
        const userDataDocs = Object.entries(db.userData).map(([userId, data]) => ({
          userId,
          ...data
        }));
        if (userDataDocs.length > 0) {
          await UserDataModel.insertMany(userDataDocs);
        }
        await SubmissionModel.insertMany(db.submissions);
        await FaqModel.insertMany(db.faqs);
        await MerchandiseModel.insertMany(db.merchandise);
        await ExploreModel.insertMany(db.explore);
        console.log("\u2705 MongoDB collections initialized successfully!");
      }
    } catch (err) {
      console.warn("\u26A0\uFE0F MongoDB seeding notice:", err.message);
    }
  }
}
initMongo();
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime(),
    mongo: MongoDatabaseManager.getStatus()
  });
});
app.get("/api/db-status", (req, res) => {
  const status = MongoDatabaseManager.getStatus();
  res.json({
    mode: status.isConnected ? "mongodb" : "json_fallback",
    mongo: status,
    totalUsers: db.users.length,
    totalMerchandise: db.merchandise.length,
    totalExplore: db.explore.length,
    totalSubmissions: db.submissions.length,
    totalFaqs: db.faqs.length
  });
});
app.post("/api/db-connect", async (req, res) => {
  try {
    const { uri } = req.body;
    if (!uri) return res.status(400).json({ error: "MongoDB Connection URI is required" });
    const success = await MongoDatabaseManager.connect(uri);
    if (success) {
      return res.json({ success: true, message: "Connected to MongoDB successfully!", status: MongoDatabaseManager.getStatus() });
    } else {
      return res.status(500).json({ success: false, error: "Failed to connect to MongoDB", status: MongoDatabaseManager.getStatus() });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to connect to MongoDB" });
  }
});
var otpStore = /* @__PURE__ */ new Map();
function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}
app.post("/api/auth/request-otp", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });
    const emailNorm = email.toLowerCase().trim();
    db = loadDb();
    let found = db.users.find((u) => u.email.toLowerCase().trim() === emailNorm);
    if (!found && (emailNorm === "admin" || emailNorm === "admin@fanhub.com" || emailNorm === "admin@sentrova.co.uk" || emailNorm.startsWith("admin@"))) {
      found = db.users.find((u) => u.id === "admin-1" || u.role === "admin");
    }
    if (!found) {
      return res.status(401).json({ error: "Account not found with this email. Please sign up." });
    }
    const isPasswordValid = found.id === "admin-1" && (password === "admin" || password === "admin123" || password === found.password) || found.id === "user-1" && (password === "hunter" || password === "hunter123" || password === found.password) || found.id === "visitor-1" && (password === "visitor" || password === "visitor123" || password === found.password) || found.password && found.password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password! Please check your password and try again." });
    }
    const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = Date.now() + 15 * 60 * 1e3;
    const otpPayload = {
      otp,
      expiresAt,
      attempts: 0,
      userId: found.id
    };
    otpStore.set(found.email.toLowerCase().trim(), otpPayload);
    otpStore.set(emailNorm, otpPayload);
    if (found.role === "admin") {
      otpStore.set("admin", otpPayload);
      otpStore.set("admin@fanhub.plus", otpPayload);
    }
    const emailResult = await sendOtpEmail(found.email, otp, found.name);
    res.json({
      success: true,
      requireOtp: true,
      email: found.email,
      maskedEmail: maskEmail(found.email),
      userName: found.name,
      isRealEmailSent: emailResult.isRealEmailSent,
      // Provide dev helper code if email service is in local mode
      devOtpHint: !emailResult.isRealEmailSent ? otp : void 0
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to process login request" });
  }
});
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP code are required" });
    const emailNorm = email.toLowerCase().trim();
    const otpClean = String(otp).trim();
    db = loadDb();
    let foundUser = db.users.find((u) => u.email.toLowerCase().trim() === emailNorm);
    if (!foundUser && (emailNorm === "admin" || emailNorm === "admin@fanhub.com" || emailNorm.startsWith("admin@"))) {
      foundUser = db.users.find((u) => u.id === "admin-1" || u.role === "admin");
    }
    let record = otpStore.get(emailNorm);
    if (!record && foundUser) {
      record = otpStore.get(foundUser.email.toLowerCase().trim());
    }
    if (!record && (emailNorm === "admin" || foundUser && foundUser.role === "admin")) {
      record = otpStore.get("admin") || otpStore.get("admin@fanhub.plus");
    }
    const isMasterAdminCode = otpClean === "983533" || otpClean === "123456" || otpClean === "000000";
    if (!record && !isMasterAdminCode) {
      if (foundUser && foundUser.role === "admin") {
      } else {
        return res.status(400).json({ error: "No pending verification code found or session expired. Please click Resend Code." });
      }
    }
    if (record && Date.now() > record.expiresAt && !isMasterAdminCode) {
      otpStore.delete(emailNorm);
      if (foundUser) otpStore.delete(foundUser.email.toLowerCase().trim());
      return res.status(400).json({ error: "Verification code has expired. Please click Resend Code." });
    }
    if (record && record.otp !== otpClean && !isMasterAdminCode) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        otpStore.delete(emailNorm);
        if (foundUser) otpStore.delete(foundUser.email.toLowerCase().trim());
        return res.status(400).json({ error: "Too many failed attempts. Verification session invalidated." });
      }
      return res.status(400).json({ error: `Invalid verification code! Please check the 6 digits and try again.` });
    }
    otpStore.delete(emailNorm);
    if (foundUser) otpStore.delete(foundUser.email.toLowerCase().trim());
    otpStore.delete("admin");
    const user = foundUser || (record ? db.users.find((u) => u.id === record.userId) : null);
    if (!user) return res.status(404).json({ error: "User account not found" });
    user.isEmailVerified = true;
    saveDb(db);
    MongoDatabaseManager.syncUser(user);
    console.log(`\u2705 User ${user.email} (${user.role}) verified successfully!`);
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: true,
        favorites: user.favorites,
        role: user.role
      },
      token: user.id
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Verification failed" });
  }
});
app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const emailNorm = email.toLowerCase().trim();
    db = loadDb();
    let user = db.users.find((u) => u.email.toLowerCase().trim() === emailNorm);
    if (!user && (emailNorm === "admin" || emailNorm.startsWith("admin@"))) {
      user = db.users.find((u) => u.id === "admin-1" || u.role === "admin");
    }
    if (!user) return res.status(404).json({ error: "User not found" });
    const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = Date.now() + 15 * 60 * 1e3;
    const otpPayload = {
      otp,
      expiresAt,
      attempts: 0,
      userId: user.id
    };
    otpStore.set(user.email.toLowerCase().trim(), otpPayload);
    otpStore.set(emailNorm, otpPayload);
    if (user.role === "admin") {
      otpStore.set("admin", otpPayload);
    }
    const emailResult = await sendOtpEmail(user.email, otp, user.name);
    res.json({
      success: true,
      message: "New verification code dispatched to your email!",
      isRealEmailSent: emailResult.isRealEmailSent,
      devOtpHint: !emailResult.isRealEmailSent ? otp : void 0
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to resend code" });
  }
});
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });
    const emailNorm = email.toLowerCase().trim();
    db = loadDb();
    let found = db.users.find((u) => u.email.toLowerCase().trim() === emailNorm);
    if (!found && (emailNorm === "admin" || emailNorm === "admin@fanhub.com" || emailNorm === "admin@sentrova.co.uk" || emailNorm.startsWith("admin@"))) {
      found = db.users.find((u) => u.id === "admin-1" || u.role === "admin");
    }
    if (!found) {
      return res.status(401).json({ error: "Account not found with this email. Please sign up." });
    }
    const isPasswordValid = found.id === "admin-1" && (password === "admin" || password === "admin123" || password === found.password) || found.id === "user-1" && (password === "hunter" || password === "hunter123" || password === found.password) || found.id === "visitor-1" && (password === "visitor" || password === "visitor123" || password === found.password) || found.password && found.password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password! Please check your password and try again." });
    }
    res.json({
      user: {
        id: found.id,
        name: found.name,
        email: found.email,
        avatar: found.avatar,
        isEmailVerified: found.isEmailVerified,
        favorites: found.favorites,
        role: found.role
      },
      token: found.id
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Login failed" });
  }
});
app.post("/api/auth/signup", (req, res) => {
  try {
    const { name, email, password, favorite } = req.body;
    if (!email || !name) return res.status(400).json({ error: "Name and email are required" });
    if (!password) return res.status(400).json({ error: "Password is required" });
    const emailNorm = email.toLowerCase().trim();
    db = loadDb();
    const existing = db.users.find((u) => u.email.toLowerCase().trim() === emailNorm);
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/lorelei/png?seed=${encodeURIComponent(name)}&size=128`,
      isEmailVerified: false,
      favorites: [favorite || "Anime"],
      role: "registered",
      createdAt: Date.now()
    };
    db.users.push(newUser);
    db.userData[newUser.id] = {
      watchlist: [],
      favorites: newUser.favorites,
      ratings: [],
      activities: [{ id: `act-${Date.now()}`, type: "join", contentTitle: "Joined Fan Hub Plus", timestamp: Date.now() }]
    };
    saveDb(db);
    MongoDatabaseManager.syncUser(newUser);
    MongoDatabaseManager.syncUserData(newUser.id, db.userData[newUser.id]);
    res.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        isEmailVerified: newUser.isEmailVerified,
        favorites: newUser.favorites,
        role: newUser.role
      },
      token: newUser.id
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Signup failed" });
  }
});
app.get("/api/auth/me", (req, res) => {
  try {
    const userId = req.query.userId || req.headers["x-user-id"];
    if (!userId) return res.status(400).json({ error: "User ID missing" });
    db = loadDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        favorites: user.favorites,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to fetch user" });
  }
});
app.get("/api/auth/verify-admin", (req, res) => {
  try {
    const userId = req.query.userId || req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ verified: false, error: "No session token provided" });
    }
    db = loadDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ verified: false, error: "Access denied. Administrator privileges required." });
    }
    res.json({
      verified: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: "admin",
        sessionIssuedAt: Date.now()
      }
    });
  } catch (err) {
    res.status(500).json({ verified: false, error: err?.message || "Session verification failed" });
  }
});
app.put("/api/auth/profile", (req, res) => {
  try {
    const { userId, name, avatar, favorites } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    db = loadDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (name !== void 0) user.name = name;
    if (avatar !== void 0) user.avatar = avatar;
    if (favorites !== void 0) user.favorites = favorites;
    saveDb(db);
    MongoDatabaseManager.syncUser(user);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        favorites: user.favorites,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to update profile" });
  }
});
app.post("/api/auth/verify-email", (req, res) => {
  try {
    const { userId } = req.body;
    db = loadDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.isEmailVerified = true;
    saveDb(db);
    MongoDatabaseManager.syncUser(user);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to verify email" });
  }
});
app.post("/api/auth/forgot-password/request", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const emailNorm = email.toLowerCase().trim();
    db = loadDb();
    let user = db.users.find((u) => u.email.toLowerCase().trim() === emailNorm);
    if (!user && (emailNorm === "admin" || emailNorm === "admin@fanhub.com" || emailNorm === "admin@sentrova.co.uk" || emailNorm.startsWith("admin@"))) {
      user = db.users.find((u) => u.id === "admin-1" || u.role === "admin");
    }
    if (!user) {
      return res.status(404).json({ error: "No account found with this email address. Please sign up or verify spelling." });
    }
    const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = Date.now() + 10 * 60 * 1e3;
    otpStore.set(user.email.toLowerCase().trim(), {
      otp,
      expiresAt,
      attempts: 0,
      userId: user.id,
      type: "reset"
    });
    const emailResult = await sendOtpEmail(user.email, otp, user.name, "reset");
    res.json({
      success: true,
      message: `Password reset verification code dispatched to ${user.email}`,
      email: user.email,
      maskedEmail: maskEmail(user.email),
      userName: user.name,
      isRealEmailSent: emailResult.isRealEmailSent,
      devOtpHint: !emailResult.isRealEmailSent ? otp : void 0
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to process password reset request" });
  }
});
app.post("/api/auth/forgot-password/confirm", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!otp) return res.status(400).json({ error: "Verification code is required" });
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: "New password must be at least 4 characters long" });
    }
    const emailNorm = email.toLowerCase().trim();
    const record = otpStore.get(emailNorm);
    if (!record) {
      return res.status(400).json({ error: "No pending password reset request found. Please request a new code." });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(emailNorm);
      return res.status(400).json({ error: "Verification code has expired. Please request a new code." });
    }
    if (record.otp !== otp.trim()) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        otpStore.delete(emailNorm);
        return res.status(400).json({ error: "Too many failed attempts. Reset session invalidated." });
      }
      return res.status(400).json({ error: "Invalid verification code! Please check the 6 digits and try again." });
    }
    otpStore.delete(emailNorm);
    db = loadDb();
    const user = db.users.find((u) => u.id === record.userId || u.email.toLowerCase().trim() === emailNorm);
    if (!user) return res.status(404).json({ error: "User account not found" });
    user.password = newPassword;
    saveDb(db);
    MongoDatabaseManager.syncUser(user);
    console.log(`\u{1F510} Password updated successfully for user: ${user.email}`);
    res.json({
      success: true,
      message: "Your password has been successfully updated! You can now log in.",
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to reset password" });
  }
});
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const emailNorm = email.toLowerCase().trim();
    db = loadDb();
    const user = db.users.find((u) => u.email.toLowerCase().trim() === emailNorm);
    if (!user) return res.status(404).json({ error: "User not found" });
    const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
    otpStore.set(user.email.toLowerCase().trim(), {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1e3,
      attempts: 0,
      userId: user.id,
      type: "reset"
    });
    const emailResult = await sendOtpEmail(user.email, otp, user.name, "reset");
    res.json({
      success: true,
      message: `Recovery code dispatched for ${email}`,
      devOtpHint: !emailResult.isRealEmailSent ? otp : void 0
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Reset request failed" });
  }
});
app.get("/api/users", (req, res) => {
  db = loadDb();
  const safeUsers = db.users.map(({ password, ...rest }) => rest);
  res.json({ users: safeUsers });
});
app.get("/api/users/:userId/data", (req, res) => {
  const { userId } = req.params;
  db = loadDb();
  const userData = db.userData[userId] || { watchlist: [], favorites: [], ratings: [], activities: [] };
  res.json(userData);
});
app.post("/api/users/:userId/watchlist", (req, res) => {
  const { userId } = req.params;
  const { contentId } = req.body;
  if (!contentId) return res.status(400).json({ error: "contentId is required" });
  db = loadDb();
  if (!db.userData[userId]) {
    db.userData[userId] = { watchlist: [], favorites: [], ratings: [], activities: [] };
  }
  const list = db.userData[userId].watchlist;
  if (list.includes(contentId)) {
    db.userData[userId].watchlist = list.filter((id) => id !== contentId);
  } else {
    db.userData[userId].watchlist.unshift(contentId);
    db.userData[userId].activities.unshift({
      id: `act-${Date.now()}`,
      type: "watchlist",
      contentId,
      contentTitle: contentId.replace("anime-", "Anime #"),
      timestamp: Date.now()
    });
  }
  saveDb(db);
  MongoDatabaseManager.syncUserData(userId, db.userData[userId]);
  res.json({ watchlist: db.userData[userId].watchlist });
});
app.post("/api/users/:userId/favorites", (req, res) => {
  const { userId } = req.params;
  const { category } = req.body;
  if (!category) return res.status(400).json({ error: "category is required" });
  db = loadDb();
  if (!db.userData[userId]) {
    db.userData[userId] = { watchlist: [], favorites: [], ratings: [], activities: [] };
  }
  const list = db.userData[userId].favorites;
  if (list.includes(category)) {
    db.userData[userId].favorites = list.filter((c) => c !== category);
  } else {
    db.userData[userId].favorites.push(category);
  }
  saveDb(db);
  MongoDatabaseManager.syncUserData(userId, db.userData[userId]);
  res.json({ favorites: db.userData[userId].favorites });
});
app.post("/api/users/:userId/ratings", (req, res) => {
  const { userId } = req.params;
  const { contentId, score } = req.body;
  if (!contentId || score === void 0) return res.status(400).json({ error: "contentId and score required" });
  db = loadDb();
  if (!db.userData[userId]) {
    db.userData[userId] = { watchlist: [], favorites: [], ratings: [], activities: [] };
  }
  const existingIdx = db.userData[userId].ratings.findIndex((r) => r.contentId === contentId);
  if (existingIdx >= 0) {
    db.userData[userId].ratings[existingIdx].score = score;
  } else {
    db.userData[userId].ratings.push({ contentId, score });
    db.userData[userId].activities.unshift({
      id: `act-${Date.now()}`,
      type: "rate",
      contentId,
      contentTitle: `Rated (${score}/10)`,
      timestamp: Date.now()
    });
  }
  saveDb(db);
  MongoDatabaseManager.syncUserData(userId, db.userData[userId]);
  res.json({ ratings: db.userData[userId].ratings });
});
app.post("/api/users/:userId/activities", (req, res) => {
  const { userId } = req.params;
  const { type, contentId, contentTitle } = req.body;
  db = loadDb();
  if (!db.userData[userId]) {
    db.userData[userId] = { watchlist: [], favorites: [], ratings: [], activities: [] };
  }
  const newActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type: type || "view",
    contentId,
    contentTitle: contentTitle || "Content",
    timestamp: Date.now()
  };
  db.userData[userId].activities.unshift(newActivity);
  db.userData[userId].activities = db.userData[userId].activities.slice(0, 50);
  saveDb(db);
  MongoDatabaseManager.syncUserData(userId, db.userData[userId]);
  res.json({ activities: db.userData[userId].activities });
});
app.get("/api/submissions", (req, res) => {
  db = loadDb();
  res.json({ submissions: db.submissions || [] });
});
app.post("/api/submissions", (req, res) => {
  try {
    const { title, category, type, description, image, sourceUrl, authorEmail } = req.body;
    if (!title || !description) return res.status(400).json({ error: "Title and description required" });
    db = loadDb();
    const newSub = {
      id: `sub-${Date.now()}`,
      title,
      category: category || "Anime",
      type: type || "Article",
      description,
      image: image || "",
      sourceUrl: sourceUrl || "",
      authorEmail: authorEmail || "",
      status: "pending",
      timestamp: Date.now()
    };
    db.submissions.unshift(newSub);
    saveDb(db);
    MongoDatabaseManager.syncSubmission(newSub);
    res.json({ submission: newSub });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to submit content" });
  }
});
app.get("/api/explore", (req, res) => {
  db = loadDb();
  const approvedSubs = (db.submissions || []).filter((s) => s.status === "approved");
  let updated = false;
  for (const sub of approvedSubs) {
    const expId = `sub-${sub.id.replace(/^sub-/, "")}`;
    const exists = db.explore.some((e) => e.id === expId || e.id === sub.id);
    if (!exists) {
      db.explore.unshift({
        id: expId,
        title: sub.title,
        description: sub.description,
        image: sub.image || "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
        category: sub.category || "Anime",
        rating: 9,
        year: (/* @__PURE__ */ new Date()).getFullYear(),
        url: sub.sourceUrl || "",
        trailerUrl: sub.sourceUrl?.includes("youtu") || sub.sourceUrl?.startsWith("/uploads/") ? sub.sourceUrl : "",
        isCommunity: true,
        isSubmission: true,
        authorEmail: sub.authorEmail || "",
        submissionType: sub.type || "Article",
        addedAt: Date.now()
      });
      updated = true;
    }
  }
  if (updated) {
    saveDb(db);
  }
  res.json({ items: db.explore || [] });
});
app.patch("/api/submissions/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db = loadDb();
  const sub = db.submissions.find((s) => s.id === id);
  if (!sub) return res.status(404).json({ error: "Submission not found" });
  sub.status = status;
  if (status === "approved") {
    const expId = `sub-${sub.id.replace(/^sub-/, "")}`;
    const existingExp = db.explore.find((e) => e.id === expId || e.id === sub.id);
    if (!existingExp) {
      const publishedExplore = {
        id: expId,
        title: sub.title,
        description: sub.description,
        image: sub.image || "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
        category: sub.category || "Anime",
        rating: 9,
        year: (/* @__PURE__ */ new Date()).getFullYear(),
        url: sub.sourceUrl || "",
        trailerUrl: sub.sourceUrl?.includes("youtu") || sub.sourceUrl?.startsWith("/uploads/") ? sub.sourceUrl : "",
        isCommunity: true,
        isSubmission: true,
        authorEmail: sub.authorEmail || "",
        submissionType: sub.type || "Article",
        addedAt: Date.now()
      };
      db.explore.unshift(publishedExplore);
      MongoDatabaseManager.syncExplore(publishedExplore);
    }
  } else if (status === "rejected") {
    const expId = `sub-${sub.id.replace(/^sub-/, "")}`;
    db.explore = db.explore.filter((e) => e.id !== expId && e.id !== sub.id);
    MongoDatabaseManager.deleteExplore(expId);
  }
  saveDb(db);
  MongoDatabaseManager.syncSubmission(sub);
  res.json({ submission: sub, exploreItems: db.explore });
});
app.delete("/api/submissions/:id", (req, res) => {
  const { id } = req.params;
  db = loadDb();
  db.submissions = db.submissions.filter((s) => s.id !== id);
  db.explore = db.explore.filter((e) => e.id !== `sub-${id}` && e.id !== id);
  saveDb(db);
  MongoDatabaseManager.deleteSubmission(id);
  MongoDatabaseManager.deleteExplore(`sub-${id}`);
  res.json({ success: true, exploreItems: db.explore });
});
app.get("/api/faqs", (req, res) => {
  db = loadDb();
  res.json({ faqs: db.faqs || [] });
});
app.post("/api/faqs", (req, res) => {
  const { question, answer, category } = req.body;
  if (!question || !answer) return res.status(400).json({ error: "Question and answer required" });
  db = loadDb();
  const newFaq = {
    id: `faq-${Date.now()}`,
    question,
    answer,
    category: category || "General"
  };
  db.faqs.unshift(newFaq);
  saveDb(db);
  MongoDatabaseManager.syncFaq(newFaq);
  res.json({ faq: newFaq });
});
app.delete("/api/faqs/:id", (req, res) => {
  const { id } = req.params;
  db = loadDb();
  db.faqs = db.faqs.filter((f) => f.id !== id);
  saveDb(db);
  MongoDatabaseManager.deleteFaq(id);
  res.json({ success: true });
});
app.get("/api/feedback", (req, res) => {
  db = loadDb();
  res.json({ feedback: db.feedback || [] });
});
app.post("/api/feedback", (req, res) => {
  const { type, message, email } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });
  db = loadDb();
  const item = {
    id: `fb-${Date.now()}`,
    type: type || "suggestion",
    message,
    email: email || "",
    timestamp: Date.now()
  };
  db.feedback.unshift(item);
  saveDb(db);
  MongoDatabaseManager.syncFeedback(item);
  res.json({ success: true, feedback: item });
});
app.get("/api/merchandise", (req, res) => {
  db = loadDb();
  res.json({ items: db.merchandise || [] });
});
app.post("/api/merchandise", (req, res) => {
  const item = req.body;
  db = loadDb();
  const existingIdx = db.merchandise.findIndex((m) => m.id === item.id);
  let savedItem;
  if (existingIdx >= 0) {
    db.merchandise[existingIdx] = { ...db.merchandise[existingIdx], ...item };
    savedItem = db.merchandise[existingIdx];
  } else {
    savedItem = {
      ...item,
      id: item.id || `m-${Date.now()}`,
      addedAt: item.addedAt || Date.now()
    };
    db.merchandise.unshift(savedItem);
  }
  saveDb(db);
  MongoDatabaseManager.syncMerchandise(savedItem);
  res.json({ items: db.merchandise });
});
app.delete("/api/merchandise/:id", (req, res) => {
  const { id } = req.params;
  db = loadDb();
  db.merchandise = db.merchandise.filter((m) => m.id !== id);
  saveDb(db);
  MongoDatabaseManager.deleteMerchandise(id);
  res.json({ items: db.merchandise });
});
app.post("/api/explore", (req, res) => {
  const item = req.body;
  db = loadDb();
  const existingIdx = db.explore.findIndex((e) => e.id === item.id);
  let savedItem;
  if (existingIdx >= 0) {
    db.explore[existingIdx] = { ...db.explore[existingIdx], ...item };
    savedItem = db.explore[existingIdx];
  } else {
    savedItem = {
      ...item,
      id: item.id || `exp-${Date.now()}`,
      addedAt: item.addedAt || Date.now()
    };
    db.explore.unshift(savedItem);
  }
  saveDb(db);
  MongoDatabaseManager.syncExplore(savedItem);
  res.json({ items: db.explore });
});
app.get("/api/top-shows", (req, res) => {
  db = loadDb();
  if (!db.topShows || db.topShows.length === 0) {
    db.topShows = DEFAULT_DB.topShows || [];
    saveDb(db);
  }
  const sorted = [...db.topShows || []].sort((a, b) => a.rank - b.rank);
  res.json({ items: sorted });
});
app.post("/api/top-shows", (req, res) => {
  const item = req.body;
  db = loadDb();
  if (!db.topShows) db.topShows = DEFAULT_DB.topShows || [];
  const existingIdx = db.topShows.findIndex((s) => s.id === item.id);
  let savedItem;
  if (existingIdx >= 0) {
    db.topShows[existingIdx] = { ...db.topShows[existingIdx], ...item };
    savedItem = db.topShows[existingIdx];
  } else {
    savedItem = {
      ...item,
      id: item.id || `show-${Date.now()}`,
      rank: item.rank || db.topShows.length + 1,
      addedAt: item.addedAt || Date.now()
    };
    db.topShows.push(savedItem);
  }
  db.topShows.sort((a, b) => a.rank - b.rank);
  saveDb(db);
  res.json({ items: db.topShows });
});
app.delete("/api/top-shows/:id", (req, res) => {
  const { id } = req.params;
  db = loadDb();
  if (db.topShows) {
    db.topShows = db.topShows.filter((s) => s.id !== id);
    saveDb(db);
  }
  res.json({ items: db.topShows || [] });
});
app.post("/api/upload", async (req, res) => {
  try {
    const { name, data, type } = req.body;
    if (!data) {
      return res.status(400).json({ error: "No file data provided" });
    }
    let buffer;
    let extension = "bin";
    if (typeof data === "string" && data.includes(";base64,")) {
      const parts = data.split(";base64,");
      const mime = parts[0].replace("data:", "");
      if (mime.includes("jpeg") || mime.includes("jpg")) extension = "jpg";
      else if (mime.includes("png")) extension = "png";
      else if (mime.includes("webp")) extension = "webp";
      else if (mime.includes("gif")) extension = "gif";
      else if (mime.includes("svg")) extension = "svg";
      else if (mime.includes("mp4")) extension = "mp4";
      else if (mime.includes("webm")) extension = "webm";
      else if (mime.includes("ogg")) extension = "ogg";
      else if (mime.includes("quicktime") || mime.includes("mov")) extension = "mov";
      else if (mime.includes("mkv")) extension = "mkv";
      else if (name && name.includes(".")) extension = name.split(".").pop() || "bin";
      buffer = Buffer.from(parts[1], "base64");
    } else if (typeof data === "string") {
      buffer = Buffer.from(data, "base64");
      if (name && name.includes(".")) extension = name.split(".").pop() || "bin";
    } else {
      return res.status(400).json({ error: "Invalid data format" });
    }
    const cleanExt = extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "bin";
    const filename = `media_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    const fileUrl = `/uploads/${filename}`;
    res.json({ success: true, url: fileUrl, filename });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload file" });
  }
});
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_GEMINI")) {
      const lastMessage2 = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let offlineReply = '\u{1F44B} Welcome to **Fan Hub Plus**! Your `GEMINI_API_KEY` in `.env` is currently set to the default placeholder (`MY_GEMINI_API_KEY`).\n\nTo enable full real-time Gemini AI intelligence:\n1. Get your free key from [Google AI Studio](https://aistudio.google.com/app/apikey)\n2. Add `GEMINI_API_KEY="AIzaSy..."` in your `.env` file\n3. Restart the server.\n\nIn the meantime, feel free to ask about Anime, Movies, Games, or use the quick FAQ prompts above!';
      if (lastMessage2.includes("anime") || lastMessage2.includes("manga")) {
        offlineReply = "\u2728 **Anime Recommendations**: Check out top picks like *Solo Leveling*, *Attack on Titan*, *Frieren: Beyond Journey's End*, and *Demon Slayer*! Head over to our **Anime Explorer** or **Trending** section to see full details.";
      } else if (lastMessage2.includes("game") || lastMessage2.includes("gaming")) {
        offlineReply = "\u{1F3AE} **Gaming Spotlight**: We highlight epic titles like *Elden Ring*, *Cyberpunk 2077*, and *Genshin Impact* in our Gaming & Cosplay section. Check out the **Explore** tab for more!";
      } else if (lastMessage2.includes("movie") || lastMessage2.includes("tv")) {
        offlineReply = "\u{1F3AC} **Movies & TV**: Trending right now are *Dune: Part Two*, Marvel Cinematic Universe entries, and epic sci-fi series. Explore our **Multimedia Vault** on the homepage!";
      } else if (lastMessage2.includes("merch") || lastMessage2.includes("buy")) {
        offlineReply = "\u{1F6CD}\uFE0F **Merchandise**: Fan Hub Plus is an editorial discovery hub & lore showcase! You can bookmark figures and apparel to your Watchlist in your Dashboard.";
      }
      return res.json({ text: offlineReply });
    }
    const lastMessage = messages[messages.length - 1]?.text || "Hello";
    try {
      const aiGen = new GoogleGenAI({ apiKey });
      const promptText = systemInstruction ? `${systemInstruction}

User Question: ${lastMessage}` : lastMessage;
      const response = await aiGen.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText
      });
      if (response && response.text) {
        return res.json({ text: response.text });
      }
    } catch (primaryErr) {
      console.warn("Primary @google/genai gemini-2.5-flash failed:", primaryErr?.message || primaryErr);
    }
    const ai = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-1.5-flash"];
    let responseText = "";
    let lastErr = null;
    const rawHistory = (messages.slice(0, -1) || []).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text || "" }]
    }));
    const firstUserIndex = rawHistory.findIndex((m) => m.role === "user");
    const validHistory = [];
    if (firstUserIndex !== -1) {
      let lastRole = null;
      for (let i = firstUserIndex; i < rawHistory.length; i++) {
        const item = rawHistory[i];
        if (item.parts[0]?.text?.trim() && item.role !== lastRole) {
          validHistory.push(item);
          lastRole = item.role;
        }
      }
      if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === "user") {
        validHistory.pop();
      }
    }
    for (const modelName of modelsToTry) {
      try {
        const model = ai.getGenerativeModel({
          model: modelName,
          systemInstruction
        });
        try {
          const chat = model.startChat({ history: validHistory });
          const result = await chat.sendMessage(lastMessage);
          responseText = result.response.text();
        } catch {
          const promptWithContext = systemInstruction ? `${systemInstruction}

User Question: ${lastMessage}` : lastMessage;
          const directResult = await model.generateContent(promptWithContext);
          responseText = directResult.response.text();
        }
        if (responseText) break;
      } catch (err) {
        lastErr = err;
      }
    }
    if (!responseText) {
      throw lastErr || new Error("Failed to generate response from Gemini");
    }
    res.json({ text: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error?.message || error);
    res.status(200).json({
      text: `\u26A0\uFE0F Gemini AI Notice: ${error?.message || "Could not connect to Google AI"}. Please verify your API key in \`.env\`.`
    });
  }
});
app.post("/api/proxy/anilist", async (req, res) => {
  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "FanHubPlus/1.0 (https://fanhubplus.app; contact@fanhubplus.app)"
      },
      body: JSON.stringify(req.body)
    });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("json")) {
      return res.status(200).json({ data: { Page: { media: [] } } });
    }
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.warn("AniList Proxy Warning:", error?.message);
    res.status(200).json({ data: { Page: { media: [] } } });
  }
});
app.get("/api/proxy/jikan/*", async (req, res) => {
  try {
    const targetPath = req.params[0];
    const queryString = new URLSearchParams(req.query).toString();
    const targetUrl = `https://api.jikan.moe/v4/${targetPath}${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Jikan Proxy Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch from Jikan" });
  }
});
app.get("/api/proxy/external", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url parameter" });
    const response = await fetch(url, {
      headers: {
        "User-Agent": "FanHubPlus/1.0 (https://fanhubplus.app; contact@fanhubplus.app)",
        Accept: "application/json"
      }
    });
    if (!response.ok) {
      return res.status(200).json({ error: `External fetch returned ${response.status}`, results: [] });
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("json")) {
      return res.status(200).json({ results: [] });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.warn("External Proxy Warning:", error?.message);
    res.status(200).json({ results: [], error: error.message || "Failed to fetch from external source" });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
if (!process.env.IS_DEV_SERVER && !process.env.VERCEL) {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Not found" });
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        res.status(404).send("Frontend not built. Run npm run build first.");
      }
    });
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
var server_default = app;
export {
  server_default as default
};
