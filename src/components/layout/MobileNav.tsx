import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, Users, Newspaper, Calendar } from "lucide-react";
import { cn } from "../../utils";
import { motion } from "motion/react";

export const MobileNav = () => {
  const links = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Users, label: "Characters", path: "/characters" },
    { icon: Newspaper, label: "Articles", path: "/articles" },
    { icon: Calendar, label: "Events", path: "/events" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] w-[95%] max-w-md">
      <div className="glass-panel rounded-full border border-cyan-500/30 px-2 sm:px-4 py-2 shadow-[0_0_25px_-5px_rgba(6,182,212,0.35)] backdrop-blur-2xl bg-white/95 dark:bg-slate-950/90">
        <div className="grid grid-cols-5 items-center justify-items-center relative w-full gap-0.5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center justify-center gap-1 w-full py-1.5 px-0.5 rounded-2xl transition-all duration-300",
                  isActive ? "text-cyan-600 dark:text-cyan-400 font-extrabold" : "text-slate-600 dark:text-zinc-400 hover:text-cyan-500 font-bold"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform", isActive ? "text-cyan-600 dark:text-cyan-400 scale-110" : "text-slate-500 dark:text-zinc-400")} />
                  <span className="text-[9px] uppercase tracking-tight leading-none truncate max-w-full text-center">{link.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 bg-cyan-500/15 border border-cyan-500/30 rounded-xl -z-10 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
