import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bookmark, User, Moon, Sun, Command, ShieldCheck, LogOut, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { Button } from "../common/Button";
import { cn } from "../../utils";
import { motion, AnimatePresence } from "motion/react";
import { SearchOverlay } from "./SearchOverlay";

export const Navbar = () => {
  const { theme, fontSize, toggleTheme, setFontSize } = useTheme();
  const { user, logout } = useAuth();
  const { watchlist } = useAppContext();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Characters", path: "/characters" },
    { label: "Airing", path: "/airing" },
    { label: "Events", path: "/events" },
    { label: "Merchandise", path: "/merchandise" },
    { label: "Flow", path: "/flow" },
  ];

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      <header
        className={cn(
          "fixed top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ease-out transform-gpu will-change-transform",
          "rounded-full backdrop-blur-md border shadow-lg",
          isAuthPage
            ? "w-[96%] sm:w-[90%] max-w-4xl bg-slate-950/90 border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-white py-1 px-2.5 sm:px-3"
            : "w-[96%] sm:w-[94%] max-w-6xl bg-white/95 dark:bg-slate-950/90 border-slate-200 dark:border-cyan-500/20 shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.2)] py-1 sm:py-1.5 px-2.5 sm:px-4"
        )}
      >
        <div className="flex items-center justify-between px-1 sm:px-3">
          {/* Zone 1: Brand */}
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 sm:gap-2.5 group relative shrink-0 cursor-pointer px-1.5 sm:px-2.5 py-1 rounded-2xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:border hover:border-cyan-500/30 dark:hover:border-cyan-400/30 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:backdrop-blur-md"
          >
            <img
              src="/logo.png"
              alt="Fan Hub Plus Logo"
              className="w-7 h-7 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:scale-110 group-hover:rotate-2 transition-all duration-300"
            />
            <span className={cn(
              "text-base sm:text-lg font-black tracking-tight",
              isAuthPage ? "text-white" : "text-slate-900 dark:text-white"
            )}>
              FAN HUB<span className="text-cyan-500 dark:text-cyan-400 font-black">+</span>
            </span>
          </Link>

          {/* Zone 2: Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 backdrop-blur-xl shadow-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    if (location.pathname === link.path) {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-[12.5px] font-bold tracking-tight transition-all duration-300",
                    "hover:-translate-y-0.5 active:scale-95",
                    isActive
                      ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border border-cyan-500/30 dark:border-cyan-400/40 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                      : isAuthPage
                        ? "text-zinc-300 hover:text-white hover:bg-white/15 border border-transparent"
                        : "text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200/70 dark:hover:bg-white/15 hover:border hover:border-cyan-500/30 dark:hover:border-cyan-400/40 hover:shadow-sm dark:hover:shadow-[0_0_16px_rgba(6,182,212,0.3)] border border-transparent"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-1.5">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-glass-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 border border-cyan-500/40 dark:border-cyan-400/50 backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.4)] pointer-events-none"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full transition-all duration-300 text-xs font-semibold group border shadow-sm backdrop-blur-xl shrink-0",
                "hover:-translate-y-0.5 active:scale-95",
                isAuthPage
                  ? "bg-white/10 border-white/15 text-zinc-300 hover:text-white hover:bg-white/20"
                  : "bg-slate-100/90 dark:bg-white/[0.06] text-slate-700 dark:text-muted hover:text-cyan-700 dark:hover:text-white border-slate-200 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-400/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/15"
              )}
            >
              <Search className="w-3.5 h-3.5 text-slate-500 dark:text-muted group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              <span className="text-[11px] font-bold uppercase tracking-wider hidden md:inline group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">Search</span>
              <kbd className={cn(
                "hidden md:flex h-5 items-center gap-0.5 rounded-md border px-1.5 font-mono text-[9px] font-bold",
                isAuthPage
                  ? "bg-white/10 border-white/20 text-muted"
                  : "border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-slate-600 dark:text-muted/80 group-hover:border-cyan-400/40 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors"
              )}>
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>
            
            <button 
              onClick={toggleTheme}
              className={cn(
                "w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all duration-300 group border shadow-sm backdrop-blur-xl shrink-0",
                "hover:-translate-y-0.5 active:scale-95",
                isAuthPage
                  ? "bg-white/10 border-white/15 hover:bg-white/20"
                  : "bg-slate-100/90 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 hover:bg-amber-50 dark:hover:bg-amber-500/15 hover:border-amber-400/50"
              )}
              title="Toggle Theme"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-300 group-hover:text-amber-300 transition-colors" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="relative group hidden sm:block">
              <button 
                className={cn(
                  "w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all duration-300 border shadow-sm font-bold text-xs backdrop-blur-xl shrink-0",
                  "hover:-translate-y-0.5 active:scale-95",
                  isAuthPage
                    ? "bg-white/10 border-white/15 text-zinc-300 hover:text-white"
                    : "bg-slate-100/90 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-700 dark:text-muted hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/15 hover:border-cyan-400/50"
                )}
                title="Font Size"
              >
                A<span className="text-[7px] opacity-60">±</span>
              </button>
              <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200 dark:border-white/15 backdrop-blur-2xl shadow-2xl opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[115px]">
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                      fontSize === size ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30" : "text-slate-600 dark:text-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <Link to="/dashboard" className="relative hidden sm:block">
              <button 
                className={cn(
                  "w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all duration-300 border shadow-sm backdrop-blur-xl shrink-0",
                  "hover:-translate-y-0.5 active:scale-95",
                  isAuthPage
                    ? "bg-white/10 border-white/15 text-zinc-300 hover:text-white"
                    : "bg-slate-100/90 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-700 dark:text-muted hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/15 hover:border-cyan-400/50"
                )}
                title="Watchlist"
              >
                <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {watchlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-md shadow-cyan-400/50 border border-bg-main" />
                )}
              </button>
            </Link>

            <div className={cn("h-4 sm:h-5 w-px mx-0.5 hidden sm:block", isAuthPage ? "bg-white/20" : "bg-slate-200 dark:bg-white/10")} />

            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {user.role === "admin" && (
                  <Link to="/admin">
                    <button
                      className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-600 dark:text-cyan-300 border border-cyan-500/35 text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_18px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 active:scale-95"
                      title="Admin Dashboard"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                      Admin
                    </button>
                  </Link>
                )}

                <div className="relative group shrink-0">
                  <Link to={user.role === "admin" ? "/admin" : "/dashboard"}>
                    <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 shadow-md shadow-cyan-500/30 group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] transition-all duration-300 shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Profile quick dropdown */}
                  <div className="absolute top-full mt-2 right-0 glass-panel rounded-2xl p-2 border border-white/15 backdrop-blur-2xl shadow-2xl opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[170px]">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-black text-main truncate">{user.name}</p>
                      <p className="text-[10px] text-muted truncate">{user.email}</p>
                      {user.role === "admin" ? (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-[9px] font-black uppercase tracking-wider border border-cyan-500/30">
                          🛡️ Admin Session
                        </span>
                      ) : (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-cyan-600/20 text-cyan-400 text-[9px] font-black uppercase tracking-wider border border-cyan-500/30">
                          👤 Member
                        </span>
                      )}
                    </div>

                    {user.role === "admin" ? (
                      <Link
                        to="/admin"
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/15 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-muted hover:text-main hover:bg-white/10 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" /> My Dashboard
                      </Link>
                    )}

                    <Link
                      to="/submit"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/15 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Fan Upload & Submit
                    </Link>

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/15 transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="shrink-0">
                <button className="h-8 sm:h-8.5 rounded-full px-3.5 sm:px-5 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 text-white flex items-center justify-center shrink-0">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
