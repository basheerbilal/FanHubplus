import React from "react";
import { motion } from "motion/react";

interface PageLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const logoSizes = {
    sm: "w-4 h-4",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  const container = (
    <div className="flex flex-col items-center justify-center gap-4 relative select-none">
      {/* Outer subtle glowing aura */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 dark:bg-cyan-500/25 blur-xl animate-pulse" />
        
        {/* Outer rotating gradient ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} rounded-full border-2 border-transparent border-t-cyan-400 border-r-brand-purple border-b-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.45)]`}
        />
        
        {/* Inner reverse rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          className={`absolute ${size === "sm" ? "w-5 h-5" : size === "md" ? "w-9 h-9" : "w-14 h-14"} rounded-full border border-dashed border-cyan-400/40 dark:border-cyan-300/50`}
        />

        {/* Center Logo */}
        {size !== "sm" && (
          <img
            src="/logo.png"
            alt="Loading"
            className={`${logoSizes[size]} object-contain absolute animate-pulse drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]`}
          />
        )}
      </div>

      {message && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200 dark:border-cyan-500/25 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.2)] backdrop-blur-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
          <span className="text-cyan-700 dark:text-cyan-300 font-extrabold uppercase tracking-widest text-[10px]">
            {message}
          </span>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6">
        {container}
      </div>
    );
  }

  return container;
};
