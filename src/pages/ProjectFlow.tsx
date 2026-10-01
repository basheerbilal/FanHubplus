import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowDown, 
  ArrowRight,
  User, 
  Search, 
  MessageSquare, 
  Bookmark, 
  ShieldCheck, 
  Database, 
  Layout,
  Globe,
  Smartphone,
  Eye,
  FileText,
  CheckCircle,
  ExternalLink,
  Bot,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  KeyRound,
  Send,
  Star,
  Zap,
  Server,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  Compass
} from "lucide-react";
import { cn } from "../utils";

export default function ProjectFlow() {
  const [selectedPersona, setSelectedPersona] = useState<"all" | "visitor" | "registered" | "admin">("all");

  const srsFlows = {
    visitor: {
      persona: "Visitor",
      tagline: "Unauthenticated Guests & Newcomers",
      badge: "Discovery & Exploration",
      gradient: "from-cyan-500/15 via-sky-500/10 to-transparent",
      borderAccent: "border-cyan-500/30 dark:border-cyan-400/30",
      glowColor: "rgba(6, 182, 212, 0.2)",
      badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/25",
      iconBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white",
      stepAccent: "text-cyan-600 dark:text-cyan-400",
      btnClass: "border-cyan-500/30 dark:border-cyan-400/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]",
      steps: [
        {
          id: 1,
          title: "Homepage Discovery",
          subtitle: "Browse Categories & Highlights",
          desc: "Entry point to discover trending Anime, Gaming highlights, and major fandom universes with interactive hero carousels.",
          icon: Globe,
          link: "/",
          actionLabel: "Visit Home",
        },
        {
          id: 2,
          title: "Content & Character Lore",
          subtitle: "View Media, Trailers & Profiles",
          desc: "Deep-dive into character lore, trailers, episode schedules, and verified community articles across multiple categories.",
          icon: Eye,
          link: "/explore",
          actionLabel: "Explore Media",
        },
        {
          id: 3,
          title: "FanAI Assistant",
          subtitle: "Intelligent Multiverse Help",
          desc: "Ask FanAI questions regarding anime recommendations, release dates, character lore, and platform navigation in real-time.",
          icon: Bot,
          link: "/",
          actionLabel: "Launch FanAI",
        },
        {
          id: 4,
          title: "Account Registration",
          subtitle: "Unlock Member Capabilities",
          desc: "Create personal identity and unlock Watchlists, Star ratings, personalized feed, and community Fan Contributions.",
          icon: User,
          link: "/signup",
          actionLabel: "Sign Up Now",
        },
      ],
    },
    registered: {
      persona: "Registered User",
      tagline: "Authenticated Community Members",
      badge: "Personalization & Contributions",
      gradient: "from-emerald-500/15 via-cyan-500/10 to-transparent",
      borderAccent: "border-emerald-500/30 dark:border-emerald-400/30",
      glowColor: "rgba(16, 185, 129, 0.2)",
      badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/25",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
      stepAccent: "text-emerald-600 dark:text-emerald-400",
      btnClass: "border-emerald-500/30 dark:border-emerald-400/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      steps: [
        {
          id: 1,
          title: "Secure Authentication",
          subtitle: "Personal Dashboard Access",
          desc: "Secure login to access personal profile, tracked watchlists, activity history, and verified member credentials.",
          icon: KeyRound,
          link: "/login",
          actionLabel: "Member Login",
        },
        {
          id: 2,
          title: "Advanced Universe Explorer",
          subtitle: "Filter, Search & Sort Library",
          desc: "Filter across Anime, Gaming, Movies, K-Pop, and Cosplay with instant search and live category sorting.",
          icon: SlidersHorizontal,
          link: "/explore",
          actionLabel: "Filter Library",
        },
        {
          id: 3,
          title: "Watchlist & Ratings",
          subtitle: "Save & Synchronize Favorites",
          desc: "Bookmark anime, movies, and merchandise to your Watchlist with persistent Node.js backend synchronization.",
          icon: Bookmark,
          link: "/dashboard",
          actionLabel: "My Watchlist",
        },
        {
          id: 4,
          title: "Submit Fan Lore",
          subtitle: "Community Publishing Pipeline",
          desc: "Publish fan lore, reviews, articles, and cosplay guides into the live moderation queue for admin review.",
          icon: Send,
          link: "/submit-content",
          actionLabel: "Submit Lore",
        },
      ],
    },
    admin: {
      persona: "Platform Admin",
      tagline: "Privileged Operators & Moderators",
      badge: "Platform Control & Moderation",
      gradient: "from-sky-500/15 via-blue-500/10 to-transparent",
      borderAccent: "border-sky-500/30 dark:border-sky-400/30",
      glowColor: "rgba(14, 165, 233, 0.2)",
      badgeBg: "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/25",
      iconBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white",
      stepAccent: "text-sky-600 dark:text-sky-400",
      btnClass: "border-sky-500/30 dark:border-sky-400/40 text-sky-700 dark:text-sky-300 hover:bg-sky-500/15 hover:border-sky-500/50 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]",
      steps: [
        {
          id: 1,
          title: "Admin Gateway",
          subtitle: "Privileged Role Verification",
          desc: "Privileged administrator access gateway (admin@fanhub.plus) with encrypted session security and role clearance.",
          icon: ShieldCheck,
          link: "/login",
          actionLabel: "Admin Access",
        },
        {
          id: 2,
          title: "Catalog Management",
          subtitle: "Full CRUD Product & Media Control",
          desc: "Full CRUD control on Merchandise Vault items and Explore Content catalog with live instant JSON database persistence.",
          icon: FileText,
          link: "/admin",
          actionLabel: "Manage Catalog",
        },
        {
          id: 3,
          title: "Content Moderation",
          subtitle: "Review Pending Submissions",
          desc: "Review incoming community lore and cosplay submissions with 1-click Approve / Reject status moderation.",
          icon: CheckCircle,
          link: "/admin",
          actionLabel: "Review Submissions",
        },
        {
          id: 4,
          title: "Platform & User Telemetry",
          subtitle: "Usage Metrics & Database Health",
          desc: "Real-time user database management, feedback logs, category engagement analytics, and server health monitoring.",
          icon: BarChart3,
          link: "/admin",
          actionLabel: "Platform Stats",
        },
      ],
    },
  };

  const tabs = [
    { id: "all", label: "All 3 User Flows", icon: Sparkles },
    { id: "visitor", label: "Visitor Flow", icon: Globe },
    { id: "registered", label: "Registered User Flow", icon: User },
    { id: "admin", label: "Admin Flow", icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-bg-main pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Glowing Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-cyan-500/25 shadow-md shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(6,182,212,0.25)] backdrop-blur-2xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
              SRS Specification Page 5
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            Architecture <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">&</span> User Flow
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            Depicting real-time interaction between entities in Fan Hub Plus: from public category discovery and AI assistance to member bookmarking and privileged moderation flows.
          </p>

          {/* Persona Filter Tabs (Navbar Style Pill) */}
          <div className="pt-2 flex justify-center">
            <nav className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.2)]">
              {tabs.map((tab) => {
                const isActive = selectedPersona === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedPersona(tab.id)}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-2 select-none",
                      "hover:-translate-y-0.5 active:scale-95",
                      isActive
                        ? "text-cyan-700 dark:text-cyan-300 font-extrabold bg-cyan-500/15 dark:bg-white/10 border border-cyan-500/40 dark:border-cyan-400/50 shadow-sm dark:shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                        : "text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent"
                    )}
                  >
                    <IconComponent className={cn("w-3.5 h-3.5", isActive ? "text-cyan-500" : "opacity-70")} />
                    <span className="relative z-10">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="flow-tab-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 border border-cyan-500/40 dark:border-cyan-400/50 backdrop-blur-md pointer-events-none"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 3-Column Interactive Flowchart Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Visitor */}
          {(selectedPersona === "all" || selectedPersona === "visitor") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/25 p-6 sm:p-8 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden group",
                selectedPersona === "visitor" && "lg:col-span-3 max-w-2xl mx-auto w-full"
              )}
            >
              {/* Subtle top ambient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Column Header */}
                <div className="text-center pb-6 mb-6 border-b border-slate-200 dark:border-white/10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-widest border bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/25 shadow-sm">
                    <Globe className="w-3 h-3" />
                    {srsFlows.visitor.badge}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3.5 tracking-tight">
                    {srsFlows.visitor.persona}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    {srsFlows.visitor.tagline}
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {srsFlows.visitor.steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <React.Fragment key={step.id}>
                        <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-400/50 hover:bg-cyan-500/[0.02] dark:hover:bg-cyan-500/10 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 group/card relative">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/20 group-hover/card:bg-cyan-500 group-hover/card:text-white group-hover/card:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300">
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-300 transition-colors">
                                  {step.title}
                                </h3>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                                  0{step.id}
                                </span>
                              </div>
                              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-0.5 mb-1">
                                {step.subtitle}
                              </p>
                              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                                {step.desc}
                              </p>
                              <Link to={step.link}>
                                <button className={cn(
                                  "h-8 px-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all duration-300 active:scale-95",
                                  srsFlows.visitor.btnClass
                                )}>
                                  {step.actionLabel} <ArrowRight className="w-3 h-3" />
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {idx < srsFlows.visitor.steps.length - 1 && (
                          <div className="flex flex-col items-center py-0.5">
                            <div className="w-0.5 h-3 bg-cyan-500/30 dark:bg-cyan-500/40" />
                            <ArrowDown className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-bounce -my-1" />
                            <div className="w-0.5 h-3 bg-cyan-500/30 dark:bg-cyan-500/40" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Column 2: Registered User */}
          {(selectedPersona === "all" || selectedPersona === "registered") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className={cn(
                "rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-emerald-500/25 p-6 sm:p-8 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden group",
                selectedPersona === "registered" && "lg:col-span-3 max-w-2xl mx-auto w-full"
              )}
            >
              {/* Subtle top ambient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Column Header */}
                <div className="text-center pb-6 mb-6 border-b border-slate-200 dark:border-white/10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-widest border bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/25 shadow-sm">
                    <User className="w-3 h-3" />
                    {srsFlows.registered.badge}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3.5 tracking-tight">
                    {srsFlows.registered.persona}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    {srsFlows.registered.tagline}
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {srsFlows.registered.steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <React.Fragment key={step.id}>
                        <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 dark:hover:border-emerald-400/50 hover:bg-emerald-500/[0.02] dark:hover:bg-emerald-500/10 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 group/card relative">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 group-hover/card:bg-emerald-500 group-hover/card:text-white group-hover/card:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300">
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover/card:text-emerald-600 dark:group-hover/card:text-emerald-300 transition-colors">
                                  {step.title}
                                </h3>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                                  0{step.id}
                                </span>
                              </div>
                              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 mb-1">
                                {step.subtitle}
                              </p>
                              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                                {step.desc}
                              </p>
                              <Link to={step.link}>
                                <button className={cn(
                                  "h-8 px-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all duration-300 active:scale-95",
                                  srsFlows.registered.btnClass
                                )}>
                                  {step.actionLabel} <ArrowRight className="w-3 h-3" />
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {idx < srsFlows.registered.steps.length - 1 && (
                          <div className="flex flex-col items-center py-0.5">
                            <div className="w-0.5 h-3 bg-emerald-500/30 dark:bg-emerald-500/40" />
                            <ArrowDown className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-bounce -my-1" />
                            <div className="w-0.5 h-3 bg-emerald-500/30 dark:bg-emerald-500/40" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Column 3: Admin */}
          {(selectedPersona === "all" || selectedPersona === "admin") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={cn(
                "rounded-[2.5rem] bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-sky-500/25 p-6 sm:p-8 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden group",
                selectedPersona === "admin" && "lg:col-span-3 max-w-2xl mx-auto w-full"
              )}
            >
              {/* Subtle top ambient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Column Header */}
                <div className="text-center pb-6 mb-6 border-b border-slate-200 dark:border-white/10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-widest border bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/25 shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    {srsFlows.admin.badge}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3.5 tracking-tight">
                    {srsFlows.admin.persona}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    {srsFlows.admin.tagline}
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {srsFlows.admin.steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <React.Fragment key={step.id}>
                        <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-sky-500/40 dark:hover:border-sky-400/50 hover:bg-sky-500/[0.02] dark:hover:bg-sky-500/10 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all duration-300 group/card relative">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 border border-sky-500/20 group-hover/card:bg-sky-500 group-hover/card:text-white group-hover/card:shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-all duration-300">
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover/card:text-sky-600 dark:group-hover/card:text-sky-300 transition-colors">
                                  {step.title}
                                </h3>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                                  0{step.id}
                                </span>
                              </div>
                              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-0.5 mb-1">
                                {step.subtitle}
                              </p>
                              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                                {step.desc}
                              </p>
                              <Link to={step.link}>
                                <button className={cn(
                                  "h-8 px-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all duration-300 active:scale-95",
                                  srsFlows.admin.btnClass
                                )}>
                                  {step.actionLabel} <ArrowRight className="w-3 h-3" />
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {idx < srsFlows.admin.steps.length - 1 && (
                          <div className="flex flex-col items-center py-0.5">
                            <div className="w-0.5 h-3 bg-sky-500/30 dark:bg-sky-500/40" />
                            <ArrowDown className="w-4 h-4 text-sky-500 dark:text-sky-400 animate-bounce -my-1" />
                            <div className="w-0.5 h-3 bg-sky-500/30 dark:bg-sky-500/40" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Section 1.3 Purpose of the Document */}
        <div className="rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)] p-8 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-500 dark:text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Layout className="w-7 h-7" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Section 1.3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Purpose of the Specification Document
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                This document presents a detailed architectural and functional blueprint of the <strong className="text-slate-900 dark:text-white font-black">Fan Hub Plus</strong> platform. It articulates the end-to-end interactions between unauthenticated visitors, registered fandom members, and system administrators with live Node.js REST API synchronization.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Backend Stack Pill Bar */}
        <div className="rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 backdrop-blur-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)] p-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted text-[10px] font-black uppercase tracking-widest">
            <Server className="w-3.5 h-3.5 text-cyan-500" /> Connected Full-Stack System Architecture
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              { label: "Node.js & Express REST API", sub: "Modular server backend with real-time routing", icon: Server },
              { label: "Persistent JSON Database", sub: "data/database.json sync & state persistence", icon: Database },
              { label: "Google Gemini 2.0 AI Assistant", sub: "Multimodal contextual fandom intelligence", icon: Bot },
              { label: "AniList GraphQL Live Sync", sub: "Automated live anime trending & airing feeds", icon: Globe },
              { label: "Role-Based Access Control", sub: "Secure Visitor / Member / Admin clearance gates", icon: Lock },
              { label: "Full Moderation Queue", sub: "One-click Approve / Reject fan content pipeline", icon: CheckCircle2 },
            ].map((tech) => {
              const TechIcon = tech.icon;
              return (
                <div
                  key={tech.label}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:bg-cyan-500/[0.03] dark:hover:bg-cyan-500/[0.08] transition-all duration-300 text-left flex items-start gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <TechIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {tech.label}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {tech.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
