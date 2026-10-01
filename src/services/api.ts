/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, FandomCategory, Activity, Rating, FanSubmission, ChatFAQ } from "../types";
import { ManagedMerchItem, ManagedExploreItem } from "../utils/contentStore";

const API_BASE = "";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // ── Auth APIs ──
  requestOtp: (email: string, password?: string) =>
    request<{
      success: boolean;
      requireOtp: boolean;
      email: string;
      maskedEmail: string;
      userName: string;
      isRealEmailSent: boolean;
      devOtpHint?: string;
    }>("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  verifyOtp: (email: string, otp: string) =>
    request<{ success: boolean; user: User; token: string }>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),

  resendOtp: (email: string) =>
    request<{ success: boolean; message: string; isRealEmailSent: boolean; devOtpHint?: string }>("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  login: (email: string, password?: string) =>
    request<{ user: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string, favorite: FandomCategory) =>
    request<{ user: User; token: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, favorite }),
    }),

  getMe: (userId: string) =>
    request<{ user: User }>(`/api/auth/me?userId=${encodeURIComponent(userId)}`),

  updateProfile: (userId: string, data: Partial<User>) =>
    request<{ user: User }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ userId, ...data }),
    }),

  verifyEmail: (userId: string) =>
    request<{ user: User }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  verifyAdmin: (userId: string) =>
    request<{ verified: boolean; user: User }>(`/api/auth/verify-admin?userId=${encodeURIComponent(userId)}`),

  resetPassword: (email: string) =>
    request<{ success: boolean; message: string; devOtpHint?: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  requestForgotPasswordOtp: (email: string) =>
    request<{
      success: boolean;
      message: string;
      email: string;
      maskedEmail: string;
      userName: string;
      isRealEmailSent: boolean;
      devOtpHint?: string;
    }>("/api/auth/forgot-password/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  confirmForgotPassword: (email: string, otp: string, newPassword: string) =>
    request<{ success: boolean; message: string; email: string }>("/api/auth/forgot-password/confirm", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    }),

  getAllUsers: () => request<{ users: User[] }>("/api/users"),

  // ── User Data (Watchlist, Favorites, Ratings, Activities) ──
  getUserData: (userId: string) =>
    request<{
      watchlist: string[];
      favorites: FandomCategory[];
      ratings: Rating[];
      activities: Activity[];
    }>(`/api/users/${encodeURIComponent(userId)}/data`),

  toggleWatchlist: (userId: string, contentId: string) =>
    request<{ watchlist: string[] }>(`/api/users/${encodeURIComponent(userId)}/watchlist`, {
      method: "POST",
      body: JSON.stringify({ contentId }),
    }),

  toggleFavorite: (userId: string, category: FandomCategory) =>
    request<{ favorites: FandomCategory[] }>(`/api/users/${encodeURIComponent(userId)}/favorites`, {
      method: "POST",
      body: JSON.stringify({ category }),
    }),

  rateContent: (userId: string, contentId: string, score: number) =>
    request<{ ratings: Rating[] }>(`/api/users/${encodeURIComponent(userId)}/ratings`, {
      method: "POST",
      body: JSON.stringify({ contentId, score }),
    }),

  addActivity: (userId: string, activity: Omit<Activity, "id" | "timestamp">) =>
    request<{ activities: Activity[] }>(`/api/users/${encodeURIComponent(userId)}/activities`, {
      method: "POST",
      body: JSON.stringify(activity),
    }),

  // ── Submissions ──
  getSubmissions: () => request<{ submissions: FanSubmission[] }>("/api/submissions"),

  createSubmission: (data: Omit<FanSubmission, "id" | "status" | "timestamp">) =>
    request<{ submission: FanSubmission }>("/api/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSubmissionStatus: (id: string, status: "approved" | "rejected") =>
    request<{ submission: FanSubmission }>(`/api/submissions/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteSubmission: (id: string) =>
    request<{ success: boolean }>(`/api/submissions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // ── FAQs ──
  getFaqs: () => request<{ faqs: ChatFAQ[] }>("/api/faqs"),

  createFaq: (data: Omit<ChatFAQ, "id">) =>
    request<{ faq: ChatFAQ }>("/api/faqs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteFaq: (id: string) =>
    request<{ success: boolean }>(`/api/faqs/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // ── Feedback ──
  getFeedback: () => request<{ feedback: any[] }>("/api/feedback"),

  createFeedback: (data: { type: string; message: string; email?: string }) =>
    request<{ success: boolean }>("/api/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ── Merchandise ──
  getMerchandise: () => request<{ items: ManagedMerchItem[] }>("/api/merchandise"),

  saveMerchandise: (item: ManagedMerchItem) =>
    request<{ items: ManagedMerchItem[] }>("/api/merchandise", {
      method: "POST",
      body: JSON.stringify(item),
    }),

  deleteMerchandise: (id: string) =>
    request<{ items: ManagedMerchItem[] }>(`/api/merchandise/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // ── Explore Content ──
  getExplore: () => request<{ items: ManagedExploreItem[] }>("/api/explore"),

  saveExplore: (item: ManagedExploreItem) =>
    request<{ items: ManagedExploreItem[] }>("/api/explore", {
      method: "POST",
      body: JSON.stringify(item),
    }),

  deleteExplore: (id: string) =>
    request<{ items: ManagedExploreItem[] }>(`/api/explore/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // ── Top 10 Ranked Shows (Most Watched) ──
  getTopShows: () => request<{ items: any[] }>("/api/top-shows"),

  saveTopShow: (item: any) =>
    request<{ items: any[] }>("/api/top-shows", {
      method: "POST",
      body: JSON.stringify(item),
    }),

  deleteTopShow: (id: string) =>
    request<{ items: any[] }>(`/api/top-shows/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // ── Media File Upload ──
  uploadMedia: (data: { name: string; type: string; data: string }) =>
    request<{ success: boolean; url: string; filename: string }>("/api/upload", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
