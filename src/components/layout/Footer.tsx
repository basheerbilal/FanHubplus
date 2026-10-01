import React from "react";
import { Link } from "react-router-dom";
import { Camera, Video, Globe, Code, Type } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme, fontSize, setFontSize } = useTheme();

  const sections = [
    {
      title: "Explore",
      links: [
        { label: "All Content", path: "/explore" },
        { label: "Anime", path: "/explore/anime" },
        { label: "Gaming", path: "/explore/gaming" },
        { label: "Characters", path: "/characters" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Fan Upload / Submit", path: "/submit" },
        { label: "Events", path: "/events" },
        { label: "Articles", path: "/articles" },
        { label: "Cosplay", path: "/explore/cosplay" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Feedback", path: "/feedback" },
        { label: "Sitemap", path: "/sitemap" },
        { label: "Admin Dashboard", path: "/admin" },
      ],
    },
  ];

  return (
    <footer className="pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          <div className="lg:col-span-2">
            <Link 
              to="/" 
              className="inline-flex items-center gap-3.5 mb-8 group p-2 -ml-2 rounded-2xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:border hover:border-cyan-500/30 dark:hover:border-cyan-400/30 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:backdrop-blur-md border border-transparent"
            >
              <img
                src="/logo.png"
                alt="Fan Hub Plus Logo"
                className="w-12 h-12 object-contain drop-shadow-[0_0_14px_rgba(6,182,212,0.5)] group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300"
              />
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                FAN HUB<span className="text-cyan-500 dark:text-cyan-400 font-black">+</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-muted mb-10 max-w-sm leading-relaxed font-medium">
              Your premium destination for multi-fandom discovery. Connecting fans with the universes they love through a unified live database.
            </p>
            <div className="flex items-center gap-4 mb-10">
              {[Camera, Video, Globe, Code].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-11 h-11 rounded-2xl bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-muted hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/15 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:shadow-md dark:hover:shadow-[0_0_16px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 backdrop-blur-xl shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-slate-400 dark:text-muted/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Discovery Mode: Text Clarity
              </span>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border shadow-sm",
                      "hover:-translate-y-0.5 active:scale-95",
                      fontSize === size 
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 border-cyan-400/40" 
                        : "bg-white dark:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-700 dark:text-muted hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/15 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:shadow-sm dark:hover:shadow-[0_0_14px_rgba(6,182,212,0.25)]"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-slate-900 dark:text-white font-black mb-8 tracking-[0.2em] text-[10px] uppercase">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.path} 
                      className="inline-flex items-center px-3 py-1.5 -ml-3 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-muted hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/15 hover:border hover:border-cyan-500/30 dark:hover:border-cyan-400/40 hover:shadow-sm dark:hover:shadow-[0_0_14px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 border border-transparent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-glass pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 dark:text-muted/60 text-[10px] font-black uppercase tracking-[0.3em]">
          <p>© {currentYear} Fan Hub Plus. Integrated Global Live Database.</p>
          <div className="flex items-center gap-10">
            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">Privacy Protocols</a>
            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">Neural Core Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
