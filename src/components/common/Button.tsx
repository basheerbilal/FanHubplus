import React from "react";
import { cn } from "../../utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-bold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] active:scale-95",
      secondary: "bg-cyan-500/15 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-bold hover:bg-cyan-500/25 shadow-sm active:scale-95",
      outline: "border border-slate-200 dark:border-cyan-500/30 text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/15 hover:border-cyan-500/40 active:scale-95",
      ghost: "text-slate-600 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/15 active:scale-95",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "p-2",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
