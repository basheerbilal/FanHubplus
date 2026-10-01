import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  Globe,
  Save,
  X,
  Star,
  User as UserIcon,
  Home as HomeIcon,
  ArrowRight,
  Mail,
  Calendar,
  Lock,
  LogOut,
  Database,
  RefreshCw,
  Upload,
  Video,
  Play,
  Film,
  Flame,
  Award,
  Eye
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { cn } from "../utils";
import { motion, AnimatePresence } from "motion/react";
import { storage } from "../utils/localStorage";
import { FanSubmission, ChatFAQ, User as UserType } from "../types";
import { api } from "../services/api";
import {
  getMerchItems, saveMerchItems, ManagedMerchItem,
  getExploreItems, saveExploreItems, ManagedExploreItem,
  getTopShows, saveTopShows, syncTopShowsFromBackend, ManagedTopShowItem, DEFAULT_TOP_SHOWS
} from "../utils/contentStore";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<"overview" | "content" | "merchandise" | "explore" | "topshows" | "users" | "feedback" | "submissions" | "faqs">("overview");
  const [openAddSignal, setOpenAddSignal] = useState(0);

  const handleHeaderAddClick = () => {
    if (activeSection === "overview" || activeSection === "users" || activeSection === "feedback") {
      setActiveSection("explore");
      setTimeout(() => setOpenAddSignal((s) => s + 1), 60);
    } else {
      setOpenAddSignal((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex pt-24 lg:pt-28">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-slate-200 dark:border-cyan-500/20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl hidden lg:flex flex-col p-6 pt-2">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-md shadow-cyan-500/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Admin Central</span>
        </div>

        <nav className="space-y-1">
          {[
            { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
            { id: "topshows", label: "Top 10 Ranked Shows", icon: Flame },
            { id: "merchandise", label: "Merchandise Manager", icon: ShoppingBag },
            { id: "explore", label: "Explore Content", icon: Globe },
            { id: "submissions", label: "Fan Submissions", icon: CheckCircle },
            { id: "faqs", label: "Chatbot FAQs", icon: HelpCircle },
            { id: "users", label: "User Management", icon: Users },
            { id: "feedback", label: "User Feedback", icon: MessageSquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                activeSection === item.id 
                  ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20" 
                  : "text-slate-600 dark:text-muted hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" /> Secure Session
              </span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || "Administrator"}</p>
            <p className="text-[10px] text-muted truncate mb-3">{user?.email}</p>
            <Button
              variant="outline"
              onClick={() => logout()}
              className="w-full justify-center gap-2 text-[11px] font-bold border-rose-500/30 hover:bg-rose-500/10 text-rose-300 h-8"
            >
              <LogOut className="w-3.5 h-3.5" /> End Admin Session
            </Button>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-glass flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-black text-slate-600 dark:text-muted uppercase tracking-widest">Node DB Online</span>
            </div>
            <span className="text-[9px] text-muted font-mono">v2.4.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-2 overflow-y-auto">
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide border-b border-glass">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "topshows", label: "Top 10", icon: Flame },
            { id: "merchandise", label: "Merch", icon: ShoppingBag },
            { id: "explore", label: "Explore", icon: Globe },
            { id: "submissions", label: "Submissions", icon: CheckCircle },
            { id: "faqs", label: "FAQs", icon: HelpCircle },
            { id: "users", label: "Users", icon: Users },
            { id: "feedback", label: "Feedback", icon: MessageSquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                activeSection === item.id
                  ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white border-transparent shadow-md shadow-cyan-500/20"
                  : "bg-white dark:bg-white/5 text-slate-600 dark:text-muted border-slate-200 dark:border-glass"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                👑 Admin Control Center
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 capitalize">
              {activeSection === "topshows" ? "Top 10 Ranked Shows" : activeSection} <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 bg-clip-text text-transparent">Center</span>
            </h1>
            <p className="text-slate-600 dark:text-muted text-sm">Manage the Fan Hub Plus universe, top ranked anime slider, merchandise, and content.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Admin Mode Verified</span>
            </div>
            <Button
              variant="outline"
              onClick={() => logout()}
              className="h-12 px-4 rounded-xl gap-2 font-bold text-xs border-rose-500/30 hover:bg-rose-500/10 text-rose-300"
            >
              <LogOut className="w-4 h-4" /> Lock Session
            </Button>
            <Button 
              variant="primary" 
              onClick={handleHeaderAddClick}
              className="h-12 px-6 rounded-xl gap-2 font-black text-xs uppercase tracking-widest bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" /> 
              {activeSection === "topshows" ? "Add Ranked Show" :
               activeSection === "explore" ? "Add Content" :
               activeSection === "merchandise" ? "Add Merch" :
               activeSection === "faqs" ? "Add FAQ" : "Add Content"}
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeSection === "overview" && <OverviewGrid key="overview" />}
          {activeSection === "topshows" && <TopShowsManager key="topshows" openAddSignal={openAddSignal} />}
          {activeSection === "merchandise" && <MerchandiseManager key="merchandise" openAddSignal={openAddSignal} />}
          {activeSection === "explore" && <ExploreManager key="explore" openAddSignal={openAddSignal} />}
          {activeSection === "submissions" && <SubmissionsModerator key="submissions" />}
          {activeSection === "faqs" && <FaqManager key="faqs" openAddSignal={openAddSignal} />}
          {activeSection === "users" && <UserTable key="users" />}
          {activeSection === "feedback" && <FeedbackList key="feedback" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

const OverviewGrid = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-10"
  >
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Total Users", value: "12,402", trend: "+12%", icon: Users, color: "text-blue-500" },
        { label: "Active Fans", value: "3,842", trend: "+5%", icon: TrendingUp, color: "text-green-500" },
        { label: "Total Articles", value: "842", trend: "+24", icon: FileText, color: "text-cyan-500" },
        { label: "Media Items", value: "4,209", trend: "+120", icon: ImageIcon, color: "text-pink-500" },
      ].map((stat, i) => (
        <div key={i} className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className={cn("p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-green-500 text-[10px] font-black">{stat.trend}</span>
          </div>
          <div>
            <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">{stat.label}</span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>

    {/* Popular Categories (SRS requirement) */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" /> Popular Categories
          </h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted">Full Report</Button>
        </div>
        <div className="space-y-6">
          {[
            { label: "Anime", value: 85, color: "bg-cyan-500" },
            { label: "Gaming", value: 72, color: "bg-blue-600" },
            { label: "Movies", value: 45, color: "bg-pink-600" },
            { label: "K-Pop", value: 68, color: "bg-amber-600" },
          ].map((cat) => (
            <div key={cat.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-muted">
                <span>{cat.label}</span>
                <span>{cat.value}% Engagement</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn("h-full rounded-full", cat.color)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)]">
        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" /> Recent Content Updates
        </h3>
        <div className="space-y-4">
          {[
            { title: "Geralt Character Profile", time: "2 mins ago", author: "Admin Sarah" },
            { title: "Fall Season Anime News", time: "15 mins ago", author: "Editor Mike" },
            { title: "Gaming Merchandise Drop", time: "1 hour ago", author: "Admin Sarah" },
            { title: "New Interview: Jungkook", time: "3 hours ago", author: "Editor Leo" },
          ].map((update, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{update.title}</h4>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{update.author}</p>
                </div>
              </div>
              <span className="text-[10px] text-muted/80 font-bold">{update.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Live MongoDB & Database Engine Connection Manager */}
    <DatabaseManagerCard />
  </motion.div>
);

const DatabaseManagerCard = () => {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [inputUri, setInputUri] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setDbStatus(data);
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUri.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/db-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri: inputUri.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: "🟢 MongoDB Connected Successfully!", type: "success" });
        fetchStatus();
      } else {
        setMessage({ text: `❌ ${data.error || "Connection failed"}`, type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: `❌ ${err.message || "Failed to connect to MongoDB"}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const isMongo = dbStatus?.mode === "mongodb";

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-glass">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Database Core & MongoDB Hub
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                isMongo 
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              )}>
                {isMongo ? "🟢 MongoDB Active" : "🟡 Local Persistent JSON"}
              </span>
            </h3>
            <p className="text-xs text-muted font-medium">
              {isMongo 
                ? `Connected to: ${dbStatus?.mongo?.databaseName || "fanhub"} (${dbStatus?.mongo?.host || "cluster"})` 
                : "Syncing locally with automatic MongoDB failover protection."}
            </p>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchStatus}
          className="gap-2 text-xs border-glass self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-black text-slate-600 dark:text-muted uppercase tracking-widest block mb-1">Users in DB</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{dbStatus?.totalUsers || 0}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-black text-slate-600 dark:text-muted uppercase tracking-widest block mb-1">Merchandise</span>
          <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">{dbStatus?.totalMerchandise || 0}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-black text-slate-600 dark:text-muted uppercase tracking-widest block mb-1">Explore Items</span>
          <span className="text-xl font-black text-cyan-400">{dbStatus?.totalExplore || 0}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-black text-slate-600 dark:text-muted uppercase tracking-widest block mb-1">Submissions</span>
          <span className="text-xl font-black text-pink-400">{dbStatus?.totalSubmissions || 0}</span>
        </div>
      </div>

      {/* MongoDB Connection Form */}
      <form onSubmit={handleConnect} className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted uppercase tracking-wider">
            Connect MongoDB Atlas or Local URI
          </label>
          <span className="text-[10px] text-cyan-400 font-mono">MONGODB_URI in .env</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputUri}
            onChange={(e) => setInputUri(e.target.value)}
            placeholder="mongodb+srv://<user>:<password>@cluster0.mongodb.net/fanhub OR mongodb://127.0.0.1:27017/fanhub"
            className="flex-1 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <Button
            type="submit"
            disabled={loading || !inputUri.trim()}
            variant="primary"
            className="h-10 px-5 text-xs font-black uppercase tracking-wider gap-2 shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            Connect MongoDB
          </Button>
        </div>

        {message && (
          <div className={cn(
            "p-3 rounded-xl text-xs font-bold flex items-center gap-2",
            message.type === "success" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
          )}>
            <span>{message.text}</span>
          </div>
        )}
      </form>
    </div>
  );
};

const ContentManager = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input 
          type="text" 
          placeholder="Filter content items..." 
          className="w-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 shadow-sm"
        />
      </div>
      <Button variant="outline" className="h-11 rounded-xl">Filter</Button>
    </div>

    <div className="bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 rounded-3xl overflow-hidden shadow-md dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)]">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-500 dark:text-muted uppercase tracking-widest">
            <th className="px-8 py-5">Title</th>
            <th className="px-8 py-5">Category</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5">Date</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
          {[
            { id: 1, title: "Anime Expo Worldwide 2026", category: "Anime", status: "Published", date: "2026-10-15" },
            { id: 2, title: "CyberPulse eSports World Championship 2026", category: "Gaming", status: "Published", date: "2026-11-08" },
            { id: 3, title: "K-Pop World Tour: Luminous Resonance", category: "K-Pop", status: "Published", date: "2026-11-22" },
            { id: 4, title: "Comic-Con International 2026", category: "Comics", status: "Published", date: "2026-12-05" },
          ].map((row) => (
            <tr key={row.id} className="text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
              <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{row.title}</td>
              <td className="px-8 py-5">
                <span className="px-3 py-1 rounded-full bg-bg-main border border-glass text-[10px] font-bold">
                  {row.category}
                </span>
              </td>
              <td className="px-8 py-5">
                <span className={cn(
                  "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                  row.status === "Published" ? "text-green-500" : "text-amber-500"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", row.status === "Published" ? "bg-green-500" : "bg-amber-500")} />
                  {row.status}
                </span>
              </td>
              <td className="px-8 py-5 text-muted text-xs font-medium">{row.date}</td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-main/10 rounded-lg text-muted hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-red-500/10 rounded-lg text-muted hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-main/10 rounded-lg text-muted transition-all"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// ── Merchandise Manager (CRUD) ────────────────────────────────
const FANDOMS = ["Anime", "Gaming", "Comics", "Movies", "TV Shows", "K-Pop", "Manga", "Cosplay"];
const MERCH_CATS = ["Figures", "Collectibles", "Apparel", "Model Kits", "Statues", "Accessories", "Art Books"];

const emptyMerch = (): Omit<ManagedMerchItem, "id" | "addedAt"> => ({
  title: "", category: "Figures", fandom: "Anime", price: "", image: "", tags: [], description: "", releaseDate: "", isUpcoming: false,
});

const MerchandiseManager = ({ openAddSignal }: { openAddSignal?: number }) => {
  const [items, setItems] = useState<ManagedMerchItem[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ManagedMerchItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyMerch());
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (openAddSignal && openAddSignal > 0) {
      setIsAdding(true);
      setEditing(null);
      setForm(emptyMerch());
    }
  }, [openAddSignal]);

  useEffect(() => {
    api.getMerchandise()
      .then((res) => {
        if (res?.items) setItems(res.items);
      })
      .catch(() => {
        setItems(getMerchItems());
      });
  }, []);

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.fandom.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setItems(items.filter(i => i.id !== id));
    try {
      const res = await api.deleteMerchandise(id);
      if (res?.items) setItems(res.items);
    } catch {
      saveMerchItems(items.filter(i => i.id !== id));
    }
  };

  const handleEdit = (item: ManagedMerchItem) => {
    setEditing(item);
    setForm({ title: item.title, category: item.category, fandom: item.fandom, price: item.price, image: item.image, tags: item.tags, description: item.description, releaseDate: item.releaseDate || "", isUpcoming: item.isUpcoming || false });
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const updatedItem = { ...editing, ...form };
      setItems(items.map(i => i.id === editing.id ? updatedItem : i));
      setEditing(null);
      try {
        const res = await api.saveMerchandise(updatedItem);
        if (res?.items) setItems(res.items);
      } catch {
        saveMerchItems(items.map(i => i.id === editing.id ? updatedItem : i));
      }
    } else {
      const newItem: ManagedMerchItem = { ...form, id: `m-${Date.now()}`, addedAt: Date.now() };
      setItems([newItem, ...items]);
      setIsAdding(false);
      try {
        const res = await api.saveMerchandise(newItem);
        if (res?.items) setItems(res.items);
      } catch {
        saveMerchItems([newItem, ...items]);
      }
    }
    setForm(emptyMerch());
  };

  const addTag = () => { if (tagInput.trim() && !form.tags.includes(tagInput.trim())) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(""); } };
  const removeTag = (t: string) => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search merchandise..." className="w-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 shadow-sm" />
        </div>
        <Button variant="primary" onClick={() => { setIsAdding(true); setEditing(null); setForm(emptyMerch()); }} className="h-11 px-6 gap-2 text-xs font-black uppercase tracking-widest whitespace-nowrap bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/25">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 rounded-3xl overflow-hidden shadow-md dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-500 dark:text-muted uppercase tracking-widest">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Fandom</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-muted/80 text-sm font-bold">No items found.</td></tr>
              )}
              {filtered.map(item => (
                <tr key={item.id} className="text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover border border-glass flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/40"; }} />
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[180px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-[10px] font-bold">{item.category}</span></td>
                  <td className="px-6 py-4 text-muted">{item.fandom}</td>
                  <td className="px-6 py-4 font-black text-cyan-600 dark:text-cyan-400">{item.price}</td>
                  <td className="px-6 py-4">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", item.isUpcoming ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20")}>
                      {item.isUpcoming ? "Upcoming" : "Available"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="p-2 hover:bg-main/10 rounded-lg text-muted hover:text-white transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-muted hover:text-red-500 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {(isAdding || editing) && (
          <MerchFormModal
            form={form}
            setForm={setForm}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTag={addTag}
            removeTag={removeTag}
            editing={editing}
            handleSave={handleSave}
            onClose={() => { setIsAdding(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface MediaUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mediaType: "image" | "video";
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

const MediaUploadField = ({
  label,
  value,
  onChange,
  mediaType,
  placeholder,
  required = false,
  helpText,
}: MediaUploadFieldProps) => {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    e.target.value = "";

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await api.uploadMedia({
            name: file.name,
            type: file.type,
            data: base64Data,
          });
          if (res?.url) {
            onChange(res.url);
          } else {
            onChange(base64Data);
          }
        } catch {
          onChange(base64Data);
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  const isVideo = mediaType === "video";
  const isDirectVideo =
    value &&
    (value.startsWith("/uploads/") ||
      value.startsWith("data:video/") ||
      value.startsWith("blob:") ||
      /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(value));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-slate-600 dark:text-muted uppercase tracking-widest flex items-center gap-1.5">
          {isVideo ? <Video className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> : <ImageIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-main/10 p-0.5 rounded-lg border border-glass">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1",
              tab === "upload"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-muted hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Upload className="w-3 h-3" /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={cn(
              "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1",
              tab === "url"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-muted hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Globe className="w-3 h-3" /> Paste URL
          </button>
        </div>
      </div>

      {tab === "upload" ? (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={isVideo ? "video/mp4,video/webm,video/ogg,video/quicktime,video/*" : "image/png,image/jpeg,image/webp,image/gif,image/*"}
            className="hidden"
          />

          {!value ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed border-cyan-500/60 dark:border-cyan-400/60 hover:border-cyan-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-cyan-500/[0.05] dark:bg-cyan-500/[0.08] hover:bg-cyan-500/[0.12] transition-all text-center group shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
                isUploading && "pointer-events-none opacity-60"
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <RefreshCw className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-spin" />
                  <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Uploading {fileName || "file"}...</span>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 transition-all group-hover:scale-110 shadow-sm">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300 group-hover:text-cyan-500 transition-colors">
                      Click to choose {isVideo ? "video / trailer file" : "image / poster"} from computer
                    </p>
                    <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                      {isVideo ? "Supported: MP4, WebM, MOV, MKV (Up to 100MB)" : "Supported: PNG, JPG, JPEG, WebP, GIF"}
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                {isVideo ? (
                  isDirectVideo ? (
                    <div className="w-16 h-12 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-glass">
                      <video src={value} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5" />
                    </div>
                  )
                ) : (
                  <img
                    src={value}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-glass flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/48";
                    }}
                  />
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {fileName || (value.startsWith("data:") ? "Uploaded media file" : value.split("/").pop())}
                  </p>
                  <p className="text-[10px] text-green-400 flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3 h-3" /> Ready & Linked
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-main/10 hover:bg-main/20 text-xs font-bold text-white border border-glass transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setFileName("");
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <input
            type="text"
            required={required && !value}
            value={value}
            onChange={(e) => {
              let url = e.target.value;
              if (mediaType === "image" && (url.includes("youtube.com") || url.includes("youtu.be"))) {
                const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
                if (match && match[1]) {
                  url = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
                }
              }
              onChange(url);
            }}
            placeholder={placeholder || (isVideo ? "https://www.youtube.com/watch?v=... or .mp4 link" : "https://images.unsplash.com/... or any image URL")}
            className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] text-sm font-mono transition-all"
          />
          {value && !isVideo && (
            <div className="flex items-center gap-2 pt-1">
              <img
                src={value}
                alt="Preview"
                className="w-8 h-8 rounded-lg object-cover border border-glass"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-[10px] text-muted truncate">{value}</span>
            </div>
          )}
        </div>
      )}

      {helpText && <p className="text-[10px] text-muted">{helpText}</p>}
    </div>
  );
};

interface MerchFormModalProps {
  form: Omit<ManagedMerchItem, "id" | "addedAt">;
  setForm: React.Dispatch<React.SetStateAction<Omit<ManagedMerchItem, "id" | "addedAt">>>;
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  addTag: () => void;
  removeTag: (t: string) => void;
  editing: ManagedMerchItem | null;
  handleSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

const MerchFormModal = ({ form, setForm, tagInput, setTagInput, addTag, removeTag, editing, handleSave, onClose }: MerchFormModalProps) => {
  if (typeof document === "undefined") return null;
  return createPortal(
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto relative backdrop-blur-2xl text-white"
    >
      <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
      <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-cyan-400" />
        {editing ? "Edit Merchandise Item" : "Add New Merchandise"}
      </h3>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Item title..." className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-slate-900/80 border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-slate-900 transition-all text-sm [&>option]:bg-slate-900 [&>option]:text-white">
              {MERCH_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Fandom</label>
            <select value={form.fandom} onChange={e => setForm(f => ({ ...f, fandom: e.target.value }))} className="w-full bg-slate-900/80 border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-slate-900 transition-all text-sm [&>option]:bg-slate-900 [&>option]:text-white">
              {FANDOMS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Price *</label>
            <input required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$59.99" className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Release Date (optional)</label>
            <input value={form.releaseDate} onChange={e => setForm(f => ({ ...f, releaseDate: e.target.value }))} placeholder="e.g. November 2026" className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm" />
          </div>
          <div className="md:col-span-2">
            <MediaUploadField
              label="Item Product Image"
              mediaType="image"
              value={form.image}
              onChange={(val) => setForm(f => ({ ...f, image: val }))}
              required
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Description *</label>
            <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Item description..." className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm resize-none" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Tags</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag + Enter" className="flex-1 bg-white/[0.06] border border-white/15 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm" />
              <button type="button" onClick={addTag} className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-sm">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map(t => <span key={t} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">{t}<button type="button" onClick={() => removeTag(t)} className="text-zinc-400 hover:text-red-400"><X className="w-3 h-3" /></button></span>)}
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={form.isUpcoming} onChange={e => setForm(f => ({ ...f, isUpcoming: e.target.checked }))} className="w-4 h-4 accent-cyan-500" />
              <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">Mark as Upcoming Release</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-11 text-zinc-300 hover:text-white hover:bg-white/10">Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1 h-11 gap-2"><Save className="w-4 h-4" /> Save Item</Button>
        </div>
      </form>
    </motion.div>
  </div>
  , document.body);
};

// ── Explore Content Manager (CRUD) ────────────────────────────
const EXPLORE_CATS = ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];

const emptyExplore = (): Omit<ManagedExploreItem, "id" | "addedAt"> => ({
  title: "", description: "", image: "", category: "Anime", rating: 8.5, year: new Date().getFullYear(), url: "", trailerUrl: "",
});

const ExploreManager = ({ openAddSignal }: { openAddSignal?: number }) => {
  const [items, setItems] = useState<ManagedExploreItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [editing, setEditing] = useState<ManagedExploreItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyExplore());

  useEffect(() => {
    if (openAddSignal && openAddSignal > 0) {
      setIsAdding(true);
      setEditing(null);
      setForm(emptyExplore());
    }
  }, [openAddSignal]);

  useEffect(() => {
    api.getExplore()
      .then((res) => {
        if (res?.items) setItems(res.items);
      })
      .catch(() => {
        setItems(getExploreItems());
      });
  }, []);

  const filtered = items.filter(i =>
    (filterCat === "all" || i.category === filterCat) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    setItems(items.filter(i => i.id !== id));
    try {
      const res = await api.deleteExplore(id);
      if (res?.items) setItems(res.items);
    } catch {
      saveExploreItems(items.filter(i => i.id !== id));
    }
  };

  const handleEdit = (item: ManagedExploreItem) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, image: item.image, category: item.category, rating: item.rating, year: item.year, url: item.url, trailerUrl: item.trailerUrl || "" });
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const updatedItem = { ...editing, ...form };
      const newItems = items.map(i => i.id === editing.id ? updatedItem : i);
      setItems(newItems);
      saveExploreItems(newItems);
      setEditing(null);
      try {
        const res = await api.saveExplore(updatedItem);
        if (res?.items) {
          setItems(res.items);
          saveExploreItems(res.items);
        }
      } catch (err) {
        console.warn("API saveExplore error:", err);
      }
    } else {
      const newItem: ManagedExploreItem = { ...form, id: `exp-${Date.now()}`, addedAt: Date.now() };
      const newItems = [newItem, ...items];
      setItems(newItems);
      saveExploreItems(newItems);
      setIsAdding(false);
      try {
        const res = await api.saveExplore(newItem);
        if (res?.items) {
          setItems(res.items);
          saveExploreItems(res.items);
        }
      } catch (err) {
        console.warn("API saveExplore error:", err);
      }
    }
    setForm(emptyExplore());
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search explore content..." className="w-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 shadow-sm" />
        </div>
        <Button variant="primary" onClick={() => { setIsAdding(true); setEditing(null); setForm(emptyExplore()); }} className="h-11 px-6 gap-2 text-xs font-black uppercase tracking-widest whitespace-nowrap">
          <Plus className="w-4 h-4" /> Add Content
        </Button>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {["all", ...EXPLORE_CATS].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={cn("px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border capitalize",
              filterCat === cat ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-sm" : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted hover:border-cyan-500/40")}
          >{cat === "all" ? "All" : cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center bg-main/5 border border-dashed border-glass rounded-3xl">
            <Globe className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-muted font-bold text-sm">No content found</p>
          </div>
        )}
        {filtered.map(item => (
          <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-cyan-500/20 hover:border-cyan-500/50 transition-all bg-white dark:bg-slate-950/75 shadow-sm hover:shadow-md"
          >
            <div className="aspect-video relative overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-cyan-500/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest">{item.category}</span>
              <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-amber-400 text-[9px] font-black"><Star className="w-2.5 h-2.5 fill-current" />{item.rating.toFixed(1)}</span>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-muted font-bold mb-1">{item.year}</p>
              <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 mb-1">{item.title}</h4>
              <p className="text-[11px] text-muted line-clamp-2 mb-4">{item.description}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-main/10 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all"><Edit className="w-3.5 h-3.5" />Edit</button>
                <button onClick={() => handleDelete(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-main/10 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 text-xs font-bold transition-all"><Trash2 className="w-3.5 h-3.5" />Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {(isAdding || editing) && (
          <ExploreFormModal
            form={form}
            setForm={setForm}
            editing={editing}
            handleSave={handleSave}
            onClose={() => { setIsAdding(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface ExploreFormModalProps {
  form: Omit<ManagedExploreItem, "id" | "addedAt">;
  setForm: React.Dispatch<React.SetStateAction<Omit<ManagedExploreItem, "id" | "addedAt">>>;
  editing: ManagedExploreItem | null;
  handleSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

const ExploreFormModal = ({ form, setForm, editing, handleSave, onClose }: ExploreFormModalProps) => {
  if (typeof document === "undefined") return null;
  return createPortal(
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto relative backdrop-blur-2xl text-white"
    >
      <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
      <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
        <Globe className="w-5 h-5 text-cyan-400" />
        {editing ? "Edit Content Item" : "Add New Content / Anime"}
      </h3>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. The Exiled Heavy Knight" className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-slate-900/80 border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-slate-900 transition-all text-sm [&>option]:bg-slate-900 [&>option]:text-white">
              {EXPLORE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Year</label>
            <input type="number" min={1990} max={2030} value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || 2024 }))} className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Rating (0–10)</label>
            <input type="number" step="0.1" min={0} max={10} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) || 8.0 }))} className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm" />
          </div>
          <div className="md:col-span-2">
            <MediaUploadField
              label="Cover Poster / Image"
              mediaType="image"
              value={form.image}
              onChange={(val) => setForm(f => ({ ...f, image: val }))}
              required
              placeholder="Paste image link or upload PNG/JPG/WebP from your computer..."
            />
          </div>
          <div className="md:col-span-2">
            <MediaUploadField
              label="Video Trailer / Media Clip"
              mediaType="video"
              value={form.trailerUrl || ""}
              onChange={(val) => setForm(f => ({ ...f, trailerUrl: val }))}
              placeholder="Upload MP4/WebM video from computer or paste YouTube link..."
              helpText="Uploaded MP4/WebM files will play directly in the HD player. YouTube links are also supported."
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">External Info / Watch Link (optional)</label>
            <input type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Description & Lore Story *</label>
            <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Paste story / synopsis copied from any platform..." className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm resize-none" />
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-11 text-zinc-300 hover:text-white hover:bg-white/10">Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1 h-11 gap-2"><Save className="w-4 h-4" /> Save Item</Button>
        </div>
      </form>
    </motion.div>
  </div>
  , document.body);
};

const UserTable = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllUsers()
      .then((res) => {
        if (res?.users) setUsers(res.users);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Registered Users & Community</h3>
          <p className="text-muted text-xs">Node.js Server Database Records</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold border border-cyan-500/25">
          {users.length} Total Users
        </span>
      </div>

      <div className="bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 rounded-3xl overflow-hidden shadow-md dark:shadow-[0_4px_24px_-4px_rgba(6,182,212,0.15)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-500 dark:text-muted uppercase tracking-widest">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Fandoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted text-xs font-bold">
                    Loading users from Node.js database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted text-xs font-bold">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs overflow-hidden">
                          {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider", u.role === "admin" ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30" : "bg-main/10 text-muted")}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", u.isEmailVerified ? "text-green-400" : "text-amber-400")}>
                        {u.isEmailVerified ? "● Verified" : "● Unverified"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.favorites && u.favorites.length > 0 ? (
                          u.favorites.map((f) => (
                            <span key={f} className="px-2 py-0.5 rounded-md bg-bg-main text-muted text-[10px] font-bold">{f}</span>
                          ))
                        ) : (
                          <span className="text-muted/80 text-xs">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<FanSubmission[]>([]);

  useEffect(() => {
    api.getFeedback()
      .then((res) => {
        if (res?.feedback) setFeedbacks(res.feedback);
      })
      .catch(() => {
        setFeedbacks(storage.get<any[]>("FEEDBACK") || []);
      });

    api.getSubmissions()
      .then((res) => {
        if (res?.submissions) setSubmissions(res.submissions);
      })
      .catch(() => {
        setSubmissions(storage.get<FanSubmission[]>("SUBMISSIONS") || []);
      });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      {/* Submissions Moderation Quick View */}
      <section>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
          <ShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" /> User Submissions Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.length > 0 ? (
            submissions.slice(0, 4).map((s, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md flex gap-6">
                {s.image && <img src={s.image} alt={s.title} className="w-28 h-28 rounded-2xl object-cover border border-glass flex-shrink-0" />}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest">{s.type}</span>
                    <span className="text-[10px] text-muted font-bold">{new Date(s.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">{s.title}</h4>
                  <p className="text-[11px] text-muted line-clamp-2">{s.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 py-12 text-center bg-main/5 border border-dashed border-glass rounded-[2.5rem]">
              <p className="text-muted/80 text-xs font-bold uppercase tracking-widest">No submissions recorded yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Existing Feedback List */}
      <section>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
          <MessageSquare className="w-6 h-6 text-cyan-500 dark:text-cyan-400" /> User Feedback Transmission
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbacks.length > 0 ? (
            feedbacks.map((f, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                    f.type === "bug" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                    f.type === "suggestion" ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-600 dark:text-cyan-400" :
                    "bg-blue-500/10 border-blue-500/20 text-blue-500"
                  )}>
                    {f.type}
                  </span>
                  <span className="text-[10px] text-muted font-bold">{new Date(f.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed italic">"{f.message}"</p>
              </div>
            ))
          ) : (
            <div className="md:col-span-3 py-12 text-center bg-main/5 border border-dashed border-glass rounded-[2.5rem]">
              <p className="text-muted/80 text-xs font-bold uppercase tracking-widest">No feedback received yet</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

const SubmissionsModerator = () => {
  const [submissions, setSubmissions] = useState<FanSubmission[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    api.getSubmissions()
      .then((res) => {
        if (res?.submissions) setSubmissions(res.submissions);
      })
      .catch(() => {
        setSubmissions(storage.get<FanSubmission[]>("SUBMISSIONS") || []);
      });
  }, []);

  const updateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    const updated = submissions.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
    setSubmissions(updated);
    try {
      await api.updateSubmissionStatus(id, newStatus);
    } catch {
      storage.set("SUBMISSIONS", updated);
    }
  };

  const deleteSubmission = async (id: string) => {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    try {
      await api.deleteSubmission(id);
    } catch {
      storage.set("SUBMISSIONS", updated);
    }
  };

  const filtered = submissions.filter((s) => filterStatus === "all" || s.status === filterStatus);
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Fan Submissions Moderation Queue
          </h2>
          <p className="text-muted text-xs mt-1">
            Review, approve, or reject fan-submitted articles and character profiles stored in the Node.js database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                filterStatus === status
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "bg-white dark:bg-white/5 text-slate-600 dark:text-muted hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
              )}
            >
              {status} {status === "pending" && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 text-[10px] font-bold uppercase tracking-widest">
                    {item.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-bg-main text-muted border border-glass text-[10px] font-bold uppercase tracking-widest">
                    {item.type}
                  </span>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      item.status === "approved"
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : item.status === "rejected"
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    )}
                  >
                    ● {item.status}
                  </span>
                  <span className="text-[10px] text-muted/80 ml-auto">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-muted text-xs leading-relaxed max-w-3xl">{item.description}</p>

                {item.sourceUrl && (
                  <p className="text-[11px] text-muted">
                    Source: <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">{item.sourceUrl}</a>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.status !== "approved" && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => updateStatus(item.id, "approved")}
                    className="h-10 px-4 text-xs font-bold gap-1 bg-green-600 hover:bg-green-500 text-white"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </Button>
                )}
                {item.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(item.id, "rejected")}
                    className="h-10 px-4 text-xs font-bold gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </Button>
                )}
                <button
                  onClick={() => deleteSubmission(item.id)}
                  className="p-2.5 rounded-xl bg-bg-main border border-glass text-muted hover:text-red-400 transition-colors"
                  title="Delete submission"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center bg-main/5 border border-dashed border-glass rounded-[2.5rem]">
            <CheckCircle className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-muted text-sm font-bold">No submissions in this status.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FaqManager = ({ openAddSignal }: { openAddSignal?: number }) => {
  const [faqs, setFaqs] = useState<ChatFAQ[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (openAddSignal && openAddSignal > 0) {
      setIsAdding(true);
    }
  }, [openAddSignal]);

  useEffect(() => {
    api.getFaqs()
      .then((res) => {
        if (res?.faqs) setFaqs(res.faqs);
      })
      .catch(() => {
        setFaqs(storage.get<ChatFAQ[]>("FAQS") || []);
      });
  }, []);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      const res = await api.createFaq({
        question: newQuestion,
        answer: newAnswer,
        category: newCategory,
      });
      if (res?.faq) setFaqs([res.faq, ...faqs]);
    } catch {
      const newFaq: ChatFAQ = {
        id: Math.random().toString(36).substr(2, 9),
        question: newQuestion,
        answer: newAnswer,
        category: newCategory,
      };
      setFaqs([newFaq, ...faqs]);
    }

    setNewQuestion("");
    setNewAnswer("");
    setIsAdding(false);
  };

  const handleDeleteFaq = async (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
    try {
      await api.deleteFaq(id);
    } catch (err) {
      console.warn("Delete FAQ failed:", err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-main/5 border border-glass">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            AI Chatbot FAQs & Knowledge Base
          </h2>
          <p className="text-muted text-xs mt-1">
            Manage canned answers and frequent questions provided by FanAI assistant across the portal.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAdding(!isAdding)}
          className="h-11 px-5 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> {isAdding ? "Close Form" : "Add New FAQ"}
        </Button>
      </div>

      {/* Add FAQ Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddFaq}
            className="p-8 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/30 shadow-xl space-y-4"
          >
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> New Chatbot Knowledge Trigger
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Question / Prompt</label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g., How do I reset my password?"
                  className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-sm"
                >
                  <option value="General">General</option>
                  <option value="Bookmarks">Bookmarks</option>
                  <option value="Merchandise">Merchandise</option>
                  <option value="Submissions">Submissions</option>
                  <option value="Events">Events</option>
                  <option value="Lore">Lore</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Answer / Chatbot Response</label>
              <textarea
                required
                rows={3}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Detailed answer that FanAI should provide..."
                className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Knowledge Trigger
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FAQ Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="p-6 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 text-[10px] font-bold uppercase tracking-widest">
                  {faq.category || "General"}
                </span>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-main/10 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-base font-black text-white">{faq.question}</h4>
              <p className="text-muted text-xs leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ================= TOP 10 RANKED SHOWS MANAGER =================
const TopShowsManager = ({ openAddSignal }: { openAddSignal?: number }) => {
  const [shows, setShows] = useState<ManagedTopShowItem[]>(() => getTopShows());
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<ManagedTopShowItem>>({
    rank: 1,
    title: "",
    category: "Action, Fantasy",
    views: "5.0M Views",
    rating: 9.5,
    episodes: "24 Episodes",
    image: "",
    badge: "TRENDING",
    trailerUrl: "",
  });

  const showToast = (type: "success" | "error", text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // Sync with backend on mount
  useEffect(() => {
    syncTopShowsFromBackend().then((data) => {
      setShows([...data].sort((a, b) => a.rank - b.rank));
    });
  }, []);

  // React to parent add signal
  useEffect(() => {
    if (openAddSignal && openAddSignal > 0) {
      handleOpenCreate();
    }
  }, [openAddSignal]);

  const handleOpenCreate = () => {
    setEditingId(null);
    const nextRank = Math.min(10, Math.max(1, shows.length + 1));
    setFormData({
      rank: nextRank,
      title: "",
      category: "Action, Fantasy",
      views: "2.4M Views",
      rating: 9.2,
      episodes: "12 Episodes",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
      badge: "HOT",
      trailerUrl: "",
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (show: ManagedTopShowItem) => {
    setEditingId(show.id);
    setFormData({ ...show });
    setIsEditing(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await api.uploadMedia({
            name: file.name,
            type: file.type || "image/jpeg",
            data: base64Data,
          });
          if (res.url) {
            setFormData((prev) => ({ ...prev, image: res.url }));
            showToast("success", "Cover poster uploaded successfully!");
          } else {
            setFormData((prev) => ({ ...prev, image: base64Data }));
          }
        } catch {
          setFormData((prev) => ({ ...prev, image: base64Data }));
          showToast("success", "Poster loaded from device!");
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      showToast("error", "Failed to load image");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      showToast("error", "Please provide a title and cover image!");
      return;
    }

    const newItem: ManagedTopShowItem = {
      id: editingId || `top-show-${Date.now()}`,
      rank: Number(formData.rank) || 1,
      title: formData.title.trim(),
      category: formData.category || "Anime",
      views: formData.views || "1.0M Views",
      rating: Number(formData.rating) || 9.0,
      episodes: formData.episodes ? String(formData.episodes) : "12 Episodes",
      image: formData.image,
      badge: formData.badge?.trim() || "POPULAR",
      trailerUrl: formData.trailerUrl?.trim() || "",
    };

    let updatedList: ManagedTopShowItem[];
    if (editingId) {
      updatedList = shows.map((s) => (s.id === editingId ? newItem : s));
    } else {
      updatedList = [...shows, newItem];
    }

    // Sort by rank
    updatedList.sort((a, b) => a.rank - b.rank);

    setShows(updatedList);
    saveTopShows(updatedList);
    setIsEditing(false);

    try {
      await api.saveTopShow(newItem);
      showToast("success", editingId ? "Ranked show updated successfully!" : "New ranked show added successfully!");
    } catch {
      showToast("success", "Saved locally in cache!");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the Top 10 list?`)) return;

    const updatedList = shows.filter((s) => s.id !== id);
    setShows(updatedList);
    saveTopShows(updatedList);

    try {
      await api.deleteTopShow(id);
      showToast("success", `Deleted "${title}"`);
    } catch {
      showToast("success", "Removed from local list!");
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Reset the Top 10 Ranked Shows back to original default list?")) return;
    saveTopShows(DEFAULT_TOP_SHOWS);
    setShows(DEFAULT_TOP_SHOWS);
    for (const item of DEFAULT_TOP_SHOWS) {
      try {
        await api.saveTopShow(item);
      } catch {
        // continue
      }
    }
    showToast("success", "Reset to original Top 10 shows!");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "p-4 rounded-2xl flex items-center justify-between shadow-lg font-bold text-sm",
              statusMsg.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
            )}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Homepage Top 10 Slider Content</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-muted mt-1">
            Customize the big ranked cards (#1 to #10) displayed in the "Top 10 Most-Watched Shows" slider on the home page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleResetDefaults} className="h-10 px-4 rounded-xl text-xs font-bold gap-2">
            Reset Defaults
          </Button>
          <Button variant="primary" onClick={handleOpenCreate} className="h-10 px-5 rounded-xl text-xs font-black uppercase tracking-wider gap-2">
            <Plus className="w-4 h-4" /> Add Ranked Show
          </Button>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-950/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {editingId ? "Edit Ranked Show" : "Add Show to Top 10"}
                  </h3>
                  <p className="text-xs text-muted">Directly controls the Homepage Rank & Slider preview</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl text-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Rank */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Rank Number (1 - 10)
                  </label>
                  <select
                    value={formData.rank || 1}
                    onChange={(e) => setFormData({ ...formData, rank: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white font-black text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num} className="bg-slate-900 text-white">
                        Rank #{num} {num === 1 ? "👑 (Top Spot)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest">Show / Anime Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solo Leveling: Arise"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Category / Genre */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest">Category / Genres</label>
                  <input
                    type="text"
                    placeholder="e.g. Action, Dark Fantasy"
                    value={formData.category || ""}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Views */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> Views Count
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5.2M Views"
                    value={formData.views || ""}
                    onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" /> Rating (out of 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    placeholder="9.5"
                    value={formData.rating || 9.0}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Episodes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest">Episodes / Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 24 Episodes or 12 Eps"
                    value={formData.episodes || ""}
                    onChange={(e) => setFormData({ ...formData, episodes: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Badge Tag */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. RANK #1, TRENDING, HOT, MUST WATCH"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Video / Trailer URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest">Trailer Link / Video URL</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=... or video embed URL"
                    value={formData.trailerUrl || ""}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Cover Image Selection / Upload */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" /> Poster / Cover Image *
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <input
                      type="text"
                      placeholder="Paste Image URL directly (e.g. https://images.unsplash.com/...)"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500"
                    />

                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 text-xs font-bold transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? "Uploading..." : "Upload from Device"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-muted">Supports JPG, PNG, WEBP high-res posters</span>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="flex justify-center">
                    {formData.image ? (
                      <div className="relative w-28 h-40 rounded-xl overflow-hidden border-2 border-cyan-500/40 shadow-lg group">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-black text-cyan-400">
                          #{formData.rank || 1}
                        </div>
                      </div>
                    ) : (
                      <div className="w-28 h-40 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-muted text-xs p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 opacity-40" />
                        <span>No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl px-5">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="rounded-xl px-7 font-black tracking-wider uppercase">
                  {editingId ? "Save Changes" : "Create Ranked Show"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shows Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {shows.map((show) => (
          <div
            key={show.id}
            className="group relative flex gap-4 p-4 rounded-3xl bg-white/80 dark:bg-slate-950/75 border border-slate-200 dark:border-cyan-500/20 shadow-md hover:border-cyan-500/50 transition-all hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]"
          >
            {/* Rank badge and image */}
            <div className="relative w-24 h-36 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md">
              <img src={show.image} alt={show.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-cyan-500 text-white font-black text-xs shadow-md">
                #{show.rank}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider truncate">
                    {show.badge || `RANK #${show.rank}`}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{show.rating}</span>
                  </div>
                </div>

                <h4 className="text-base font-black text-slate-900 dark:text-white truncate" title={show.title}>
                  {show.title}
                </h4>
                <p className="text-xs text-muted truncate mt-0.5">{show.category}</p>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> {show.views}
                  </span>
                  <span>•</span>
                  <span>{show.episodes}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-white/5">
                <Button
                  variant="outline"
                  onClick={() => handleOpenEdit(show)}
                  className="flex-1 h-8 rounded-xl text-xs font-bold gap-1.5 hover:border-cyan-500/50"
                >
                  <Edit className="w-3.5 h-3.5 text-cyan-400" /> Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(show.id, show.title)}
                  className="h-8 px-2.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30"
                  title="Delete from Top 10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shows.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white/50 dark:bg-slate-950/50 border border-dashed border-slate-300 dark:border-white/10">
          <Flame className="w-12 h-12 text-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No ranked shows found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
            Add items or click "Reset Defaults" to populate the Top 10 slider on the homepage.
          </p>
          <Button variant="primary" onClick={handleResetDefaults} className="rounded-xl">
            Reset to Default Top 10
          </Button>
        </div>
      )}
    </motion.div>
  );
};


