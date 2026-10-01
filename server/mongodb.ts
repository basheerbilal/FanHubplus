import mongoose, { Schema, Document } from "mongoose";

// ── SCHEMAS & MODELS ─────────────────────────────────────────────

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  isEmailVerified: boolean;
  favorites: string[];
  role: "admin" | "registered" | "visitor";
  createdAt: number;
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
  avatar: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  favorites: { type: [String], default: [] },
  role: { type: String, enum: ["admin", "registered", "visitor"], default: "registered" },
  createdAt: { type: Number, default: () => Date.now() },
});

export const UserModel: mongoose.Model<IUser> = (mongoose.models.User as any) || mongoose.model<IUser>("User", UserSchema);

export interface IUserData extends Document {
  userId: string;
  watchlist: string[];
  favorites: string[];
  ratings: Array<{ contentId: string; score: number }>;
  activities: Array<{
    id: string;
    type: "watchlist" | "view" | "rate" | "join";
    contentId?: string;
    contentTitle?: string;
    timestamp: number;
  }>;
}

const UserDataSchema = new Schema<IUserData>({
  userId: { type: String, required: true, unique: true, index: true },
  watchlist: { type: [String], default: [] },
  favorites: { type: [String], default: [] },
  ratings: [{ contentId: String, score: Number }],
  activities: [{
    id: String,
    type: { type: String, enum: ["watchlist", "view", "rate", "join"] },
    contentId: String,
    contentTitle: String,
    timestamp: Number,
  }],
});

export const UserDataModel: mongoose.Model<IUserData> = (mongoose.models.UserData as any) || mongoose.model<IUserData>("UserData", UserDataSchema);

export interface ISubmission extends Document {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  image?: string;
  sourceUrl?: string;
  authorEmail?: string;
  status: "pending" | "approved" | "rejected";
  timestamp: number;
}

const SubmissionSchema = new Schema<ISubmission>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  sourceUrl: { type: String },
  authorEmail: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  timestamp: { type: Number, default: () => Date.now() },
});

export const SubmissionModel: mongoose.Model<ISubmission> = (mongoose.models.Submission as any) || mongoose.model<ISubmission>("Submission", SubmissionSchema);

export interface IFaq extends Document {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const FaqSchema = new Schema<IFaq>({
  id: { type: String, required: true, unique: true, index: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String },
});

export const FaqModel: mongoose.Model<IFaq> = (mongoose.models.Faq as any) || mongoose.model<IFaq>("Faq", FaqSchema);

export interface IFeedback extends Document {
  id: string;
  type: string;
  message: string;
  email?: string;
  timestamp: number;
}

const FeedbackSchema = new Schema<IFeedback>({
  id: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  email: { type: String },
  timestamp: { type: Number, default: () => Date.now() },
});

export const FeedbackModel: mongoose.Model<IFeedback> = (mongoose.models.Feedback as any) || mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export interface IMerchandise extends Document {
  id: string;
  title: string;
  category: string;
  fandom: string;
  price: string;
  image: string;
  tags: string[];
  description: string;
  releaseDate?: string;
  isUpcoming?: boolean;
  addedAt: number;
}

const MerchandiseSchema = new Schema<IMerchandise>({
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
  addedAt: { type: Number, default: () => Date.now() },
});

export const MerchandiseModel: mongoose.Model<IMerchandise> = (mongoose.models.Merchandise as any) || mongoose.model<IMerchandise>("Merchandise", MerchandiseSchema);

export interface IExplore extends Document {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  year: number;
  url: string;
  addedAt: number;
}

const ExploreSchema = new Schema<IExplore>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  year: { type: Number, default: () => new Date().getFullYear() },
  url: { type: String, required: true },
  addedAt: { type: Number, default: () => Date.now() },
});

export const ExploreModel: mongoose.Model<IExplore> = (mongoose.models.Explore as any) || mongoose.model<IExplore>("Explore", ExploreSchema);

// ── MONGO DATABASE MANAGER ──────────────────────────────────────────

export class MongoDatabaseManager {
  private static isConnected = false;
  private static connectionError: string | null = null;

  public static async connect(uri?: string): Promise<boolean> {
    const mongoUri = uri || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log("ℹ️ No MONGODB_URI provided in .env. Operating in Local Persistent JSON mode.");
      this.isConnected = false;
      return false;
    }

    try {
      console.log("⏳ Connecting to MongoDB...");
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      this.isConnected = true;
      this.connectionError = null;
      console.log("🟢 Successfully connected to MongoDB Database!");
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.connectionError = err.message || "MongoDB Connection Failed";
      console.warn("⚠️ MongoDB connection could not be established:", err.message);
      console.log("ℹ️ Gracefully falling back to Local JSON database.");
      return false;
    }
  }

  public static getStatus() {
    return {
      isConnected: this.isConnected && mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      databaseName: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
      error: this.connectionError,
    };
  }

  public static get isMongoActive(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  // ── SYNC HELPERS (Safe async background writes) ──
  public static async syncUser(user: any) {
    if (!this.isMongoActive) return;
    try {
      await UserModel.findOneAndUpdate({ id: user.id }, user, { upsert: true, new: true });
    } catch (e: any) {
      console.warn("MongoDB syncUser error:", e.message);
    }
  }

  public static async syncUserData(userId: string, data: any) {
    if (!this.isMongoActive) return;
    try {
      await UserDataModel.findOneAndUpdate({ userId }, { userId, ...data }, { upsert: true, new: true });
    } catch (e: any) {
      console.warn("MongoDB syncUserData error:", e.message);
    }
  }

  public static async syncSubmission(submission: any) {
    if (!this.isMongoActive) return;
    try {
      await SubmissionModel.findOneAndUpdate({ id: submission.id }, submission, { upsert: true, new: true });
    } catch (e: any) {
      console.warn("MongoDB syncSubmission error:", e.message);
    }
  }

  public static async deleteSubmission(id: string) {
    if (!this.isMongoActive) return;
    try {
      await SubmissionModel.deleteOne({ id });
    } catch (e: any) {
      console.warn("MongoDB deleteSubmission error:", e.message);
    }
  }

  public static async syncFaq(faq: any) {
    if (!this.isMongoActive) return;
    try {
      await FaqModel.findOneAndUpdate({ id: faq.id }, faq, { upsert: true, new: true });
    } catch (e: any) {
      console.warn("MongoDB syncFaq error:", e.message);
    }
  }

  public static async deleteFaq(id: string) {
    if (!this.isMongoActive) return;
    try {
      await FaqModel.deleteOne({ id });
    } catch (e: any) {
      console.warn("MongoDB deleteFaq error:", e.message);
    }
  }

  public static async syncFeedback(feedback: any) {
    if (!this.isMongoActive) return;
    try {
      await FeedbackModel.findOneAndUpdate({ id: feedback.id }, feedback, { upsert: true, new: true });
    } catch (e: any) {
      console.warn("MongoDB syncFeedback error:", e.message);
    }
  }

  public static async syncMerchandise(item: any) {
    if (!this.isMongoActive) return;
    try {
      await MerchandiseModel.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    } catch (e: any) {
      console.warn("MongoDB syncMerchandise error:", e.message);
    }
  }

  public static async deleteMerchandise(id: string) {
    if (!this.isMongoActive) return;
    try {
      await MerchandiseModel.deleteOne({ id });
    } catch (e: any) {
      console.warn("MongoDB deleteMerchandise error:", e.message);
    }
  }

  public static async syncExplore(item: any) {
    if (!this.isMongoActive) return;
    try {
      await ExploreModel.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    } catch (e: any) {
      console.warn("MongoDB syncExplore error:", e.message);
    }
  }

  public static async deleteExplore(id: string) {
    if (!this.isMongoActive) return;
    try {
      await ExploreModel.deleteOne({ id });
    } catch (e: any) {
      console.warn("MongoDB deleteExplore error:", e.message);
    }
  }
}
