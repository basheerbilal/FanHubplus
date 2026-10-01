import React, { createContext, useContext, useState, useEffect } from "react";
import { User, FandomCategory } from "../types";
import { api } from "../services/api";
import { storage } from "../utils/localStorage";

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<User>;
  requestOtp: (email: string, password?: string) => Promise<{
    success: boolean;
    requireOtp: boolean;
    email: string;
    maskedEmail: string;
    userName: string;
    isRealEmailSent: boolean;
    devOtpHint?: string;
  }>;
  verifyOtp: (email: string, otp: string) => Promise<User>;
  resendOtp: (email: string) => Promise<{ success: boolean; message: string; isRealEmailSent: boolean; devOtpHint?: string }>;
  signup: (name: string, email: string, password: string, favorite: FandomCategory) => Promise<User>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  requestForgotPasswordOtp: (email: string) => Promise<{
    success: boolean;
    message: string;
    email: string;
    maskedEmail: string;
    userName: string;
    isRealEmailSent: boolean;
    devOtpHint?: string;
  }>;
  confirmForgotPassword: (email: string, otp: string, newPassword: string) => Promise<{
    success: boolean;
    message: string;
    email: string;
  }>;
  verifyEmail: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.get<User>("USER"));
  const [isLoading, setIsLoading] = useState(true);

  // Sync user state with Node.js backend on boot
  useEffect(() => {
    const initAuth = async () => {
      const cached = storage.get<User>("USER");
      if (cached?.id) {
        try {
          const res = await api.getMe(cached.id);
          if (res?.user) {
            setUser(res.user);
            storage.set("USER", res.user);
          } else {
            setUser(null);
            storage.remove("USER");
          }
        } catch {
          // If user not found on backend, invalidate cache
          setUser(null);
          storage.remove("USER");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const requestOtp = async (email: string, password?: string) => {
    return await api.requestOtp(email, password);
  };

  const verifyOtp = async (email: string, otp: string): Promise<User> => {
    const res = await api.verifyOtp(email, otp);
    setUser(res.user);
    storage.set("USER", res.user);
    return res.user;
  };

  const resendOtp = async (email: string) => {
    return await api.resendOtp(email);
  };

  const login = async (email: string, password?: string): Promise<User> => {
    const res = await api.login(email, password);
    setUser(res.user);
    storage.set("USER", res.user);
    return res.user;
  };

  const signup = async (name: string, email: string, password: string, favorite: FandomCategory): Promise<User> => {
    const res = await api.signup(name, email, password, favorite);
    setUser(res.user);
    storage.set("USER", res.user);
    return res.user;
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;
    const optimistic = { ...user, ...updatedData };
    setUser(optimistic);
    storage.set("USER", optimistic);

    try {
      const res = await api.updateProfile(user.id, updatedData);
      if (res?.user) {
        setUser(res.user);
        storage.set("USER", res.user);
      }
    } catch (err) {
      console.warn("Backend profile update failed:", err);
    }
  };

  const verifyEmail = async () => {
    if (!user) return;
    const optimistic = { ...user, isEmailVerified: true };
    setUser(optimistic);
    storage.set("USER", optimistic);

    try {
      const res = await api.verifyEmail(user.id);
      if (res?.user) {
        setUser(res.user);
        storage.set("USER", res.user);
      }
    } catch (err) {
      console.warn("Backend verify email failed:", err);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await api.resetPassword(email);
      return true;
    } catch {
      return true;
    }
  };

  const requestForgotPasswordOtp = async (email: string) => {
    return await api.requestForgotPasswordOtp(email);
  };

  const confirmForgotPassword = async (email: string, otp: string, newPassword: string) => {
    return await api.confirmForgotPassword(email, otp, newPassword);
  };

  const logout = () => {
    setUser(null);
    storage.remove("USER");
    storage.remove("WATCHLIST");
    storage.remove("FAVORITES");
    storage.remove("RATINGS");
    storage.remove("ACTIVITY");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        requestOtp,
        verifyOtp,
        resendOtp,
        signup,
        logout,
        updateUser,
        verifyEmail,
        resetPassword,
        requestForgotPasswordOtp,
        confirmForgotPassword,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
