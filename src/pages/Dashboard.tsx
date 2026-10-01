import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { Button } from "../components/common/Button";
import { LogOut, Bookmark, Heart, Star, Clock, Compass, Settings, User, ArrowRight, Loader2, CheckCircle2, AlertCircle, X, Camera, Sparkles, Trash2, ExternalLink, ShieldCheck } from "lucide-react";
import { PageLoader } from "../components/common/PageLoader";
import { Link } from "react-router-dom";
import { cn } from "../utils";
import { useExternalMedia } from "../hooks/useExternalMedia";
import { motion, AnimatePresence } from "motion/react";
import { FandomCategory } from "../types";
import { anilistRequest, FALLBACK_TRENDING_ANIME } from "../services/anilist";

const ALL_FANDOMS: FandomCategory[] = ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];

const PRESET_AVATARS = [
  { name: "Naruto", url: "/avatars/naruto.jpg" },
  { name: "Sakura", url: "/avatars/sakura.jpg" },
  { name: "Levi", url: "/avatars/levi.jpg" },
  { name: "Hinata", url: "/avatars/hinata.jpg" },
  { name: "Goku", url: "/avatars/goku.jpg" },
  { name: "Eren", url: "/avatars/eren.webp" },
  { name: "Zoro", url: "/avatars/zoro.jpg" },
  { name: "Nezuko", url: "/avatars/nezuko.jpg" },
];

export default function Dashboard() {
  const { user, logout, updateUser, verifyOtp, resendOtp } = useAuth();
  const { watchlist, favorites, activities, ratings, toggleFavorite, toggleWatchlist } = useAppContext();
  const { data: trending, loading } = useExternalMedia("all");

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || "");
  const [selectedFandoms, setSelectedFandoms] = useState<FandomCategory[]>(user?.favorites || favorites || []);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);

  // OTP Verification Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Resolve watchlist IDs → actual content objects
  const [watchlistItems, setWatchlistItems] = useState<Array<{
    id: string; title: string; image: string; category: string; year?: number; score?: number; link: string;
  }>>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    if (watchlist.length === 0) { setWatchlistItems([]); return; }
    if (watchlistItems.length === 0) {
      setWatchlistLoading(true);
    }
    const resolve = async () => {
      const items: typeof watchlistItems = [];
      for (const id of watchlist) {
        if (id.startsWith("anime-")) {
          const animeId = parseInt(id.replace("anime-", ""), 10);
          // Try from fallback first (instant), then API
          const fallback = FALLBACK_TRENDING_ANIME.find((a: any) => a.id === animeId);
          if (fallback) {
            items.push({
              id,
              title: (fallback as any).title.english || (fallback as any).title.romaji,
              image: (fallback as any).coverImage.extraLarge || (fallback as any).coverImage.large,
              category: "Anime",
              year: (fallback as any).seasonYear,
              score: (fallback as any).averageScore,
              link: `/anime/${animeId}`,
            });
          } else {
            // Try from trending media
            const found = trending.find((m) => m.id === id);
            if (found) {
              items.push({ id, title: found.title, image: found.image, category: found.category, year: found.year, score: found.rating * 10, link: found.url });
            } else {
              // Fetch from AniList
              try {
                const res: any = await anilistRequest(`query($id:Int){Media(id:$id,type:ANIME){id title{english romaji}coverImage{extraLarge large}averageScore seasonYear}}`, { id: animeId });
                const m = res?.Media;
                if (m) items.push({ id, title: m.title.english || m.title.romaji, image: m.coverImage.extraLarge || m.coverImage.large, category: "Anime", year: m.seasonYear, score: m.averageScore, link: `/anime/${animeId}` });
              } catch {}
            }
          }
        } else {
          const found = trending.find((m) => m.id === id);
          if (found) items.push({ id, title: found.title, image: found.image, category: found.category, year: found.year, score: found.rating * 10, link: found.url });
        }
      }
      setWatchlistItems(items);
      setWatchlistLoading(false);
    };
    resolve();
  }, [watchlist, trending]);

  const recommendedItems = trending.slice(0, 4);

  const stats = [
    { label: "Watchlist", value: watchlist.length, icon: Bookmark, color: "text-cyan-400" },
    { label: "Favorites", value: favorites.length, icon: Heart, color: "text-pink-500" },
    { label: "Reviews", value: ratings.length, icon: Star, color: "text-amber-500" },
    { label: "Activity", value: activities.length, icon: Clock, color: "text-blue-500" },
  ];

  const handleOpenEdit = () => {
    setProfileName(user?.name || "");
    setProfileAvatar(user?.avatar || "");
    setSelectedFandoms(user?.favorites || favorites || []);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: profileName,
      avatar: profileAvatar,
      favorites: selectedFandoms,
    });
    // Sync with favorites context if needed
    setIsEditProfileOpen(false);
  };

  const handleVerify = async () => {
    if (!user?.email) return;
    setOtpLoading(true);
    setOtpError(null);
    setOtpDigits(["", "", "", "", "", ""]);
    try {
      const res = await resendOtp(user.email);
      setDevOtpHint(res.devOtpHint || null);
      setResendCooldown(45);
      setIsOtpModalOpen(true);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setOtpError(err?.message || "Failed to send verification code");
      setIsOtpModalOpen(true);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const next = [...otpDigits];
      chars.forEach((c, idx) => {
        if (idx < 6) next[idx] = c;
      });
      setOtpDigits(next);
      const focusTarget = Math.min(chars.length, 5);
      otpInputRefs.current[focusTarget]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned;
    setOtpDigits(next);

    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    const fullCode = otpDigits.join("");
    if (fullCode.length !== 6) {
      setOtpError("Please enter all 6 digits of your verification code.");
      return;
    }

    setOtpLoading(true);
    setOtpError(null);
    try {
      await verifyOtp(user.email, fullCode);
      setIsOtpModalOpen(false);
      setShowVerificationSuccess(true);
      setTimeout(() => setShowVerificationSuccess(false), 5000);
    } catch (err: any) {
      setOtpError(err?.message || "Invalid or expired verification code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleModalResend = async () => {
    if (!user?.email || resendCooldown > 0 || otpLoading) return;
    setOtpLoading(true);
    setOtpError(null);
    try {
      const res = await resendOtp(user.email);
      setResendCooldown(45);
      if (res.devOtpHint) {
        setDevOtpHint(res.devOtpHint);
      }
    } catch (err: any) {
      setOtpError(err?.message || "Failed to resend code");
    } finally {
      setOtpLoading(false);
    }
  };

  if (loading) {
    return <PageLoader fullScreen message="Loading Dashboard & Watchlist..." />;
  }

  return (
    <div className="pt-24 min-h-screen bg-bg-main text-main">
      <div className="container mx-auto px-4 py-12">
        {/* Verification banner if unverified */}
        {!user?.isEmailVerified && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Your email <span className="font-bold text-main">{user?.email}</span> is not verified yet. Verify now to secure your account.
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleVerify}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 whitespace-nowrap h-9 text-xs"
            >
              Verify Email Now
            </Button>
          </div>
        )}

        {showVerificationSuccess && (
          <div className="mb-8 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">Email verified successfully! You now have a verified badge.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="p-8 rounded-[2rem] glass-panel border-glass text-center">
              <div className="relative w-24 h-24 rounded-full mx-auto mb-6 shadow-xl shadow-brand-purple/20 overflow-hidden group">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-4xl font-black text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <button 
                  onClick={handleOpenEdit}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  title="Change avatar"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>

              <h1 className="text-2xl font-black text-main mb-1">Welcome back, {user?.name.split(" ")[0]} 👋</h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-muted text-xs truncate max-w-[150px]">{user?.email}</span>
                {user?.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                    Unverified
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {user?.role === "admin" && (
                  <Link to="/admin" className="block w-full">
                    <Button 
                      variant="primary" 
                      className="w-full justify-start gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-12 font-bold shadow-md shadow-cyan-500/25"
                    >
                      <ShieldCheck className="w-4 h-4 text-cyan-200" /> Admin Central
                    </Button>
                  </Link>
                )}
                <Link to="/submit" className="block w-full">
                  <Button 
                    variant="primary" 
                    className="w-full justify-start gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:opacity-95 text-white h-12 font-bold shadow-md shadow-pink-500/25 border-none"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" /> Fan Upload & Creations
                  </Button>
                </Link>
                <Button 
                  onClick={handleOpenEdit}
                  variant="outline" 
                  className="w-full justify-start gap-3 border-glass h-12 text-main"
                >
                  <User className="w-4 h-4" /> Edit Profile
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="w-full justify-start gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 h-12"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] glass-panel border-glass">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-muted uppercase tracking-widest">Your Fandoms</h3>
                <button onClick={handleOpenEdit} className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-bold">Edit</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(user?.favorites && user.favorites.length > 0) ? (
                  user.favorites.map(fav => (
                    <span key={fav} className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-xs font-bold">
                      {fav}
                    </span>
                  ))
                ) : favorites.length > 0 ? (
                  favorites.map(fav => (
                    <span key={fav} className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-xs font-bold">
                      {fav}
                    </span>
                  ))
                ) : (
                  <p className="text-muted text-xs italic">No favorite fandoms selected yet.</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(stat => (
                <div key={stat.label} className="p-6 rounded-3xl glass-panel border-glass flex flex-col items-center text-center">
                  <stat.icon className={cn("w-6 h-6 mb-4", stat.color)} />
                  <span className="text-3xl font-black text-main mb-1">{stat.value}</span>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* My Watchlist Section */}
            <section>
              <h2 className="text-2xl font-black text-main mb-6 flex items-center gap-3">
                <Bookmark className="w-6 h-6 text-cyan-400" />
                My Watchlist
                <span className="ml-auto text-sm font-bold text-muted">{watchlist.length} saved</span>
              </h2>

              {watchlistLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: watchlist.length || 4 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] rounded-2xl bg-main/5 animate-pulse border border-glass" />
                  ))}
                </div>
              ) : watchlistItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {watchlistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-glass hover:border-cyan-500/50 transition-all shadow-lg"
                    >
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Category badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest">
                          {item.category}
                        </span>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => toggleWatchlist(item.id)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 text-white"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-[10px] text-muted font-bold mb-0.5">
                          {item.year} {item.score ? `· ⭐ ${(item.score / 10).toFixed(1)}` : ""}
                        </p>
                        <h4 className="text-xs font-black text-white line-clamp-2 leading-tight mb-2">{item.title}</h4>
                        <Link
                          to={item.link}
                          className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          View Details <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center rounded-3xl glass-panel border-glass border-dashed">
                  <Bookmark className="w-10 h-10 text-muted/40 mx-auto mb-4" />
                  <p className="text-muted font-bold text-sm">Your watchlist is empty</p>
                  <p className="text-muted/60 text-xs mt-1 mb-6">Save anime, movies & more to watch later</p>
                  <Link to="/explore" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                    Explore Content
                  </Link>
                </div>
              )}
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-black text-main mb-8 flex items-center gap-3">
                <Clock className="w-6 h-6 text-cyan-400" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map(activity => (
                    <div key={activity.id} className="p-4 rounded-2xl glass-panel border-glass flex items-center justify-between group hover:border-cyan-500/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-main/5 flex items-center justify-center text-muted group-hover:text-cyan-400 transition-colors">
                          {activity.type === "watchlist" ? <Bookmark className="w-4 h-4" /> : 
                           activity.type === "rate" ? <Star className="w-4 h-4" /> : 
                           <Clock className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm text-main">
                            You {activity.type === "watchlist" ? "saved" : activity.type === "rate" ? "rated" : "viewed"}{" "}
                            <span className="font-bold text-cyan-400">{activity.contentTitle}</span>
                          </p>
                          <span className="text-[10px] text-muted uppercase font-bold">{new Date(activity.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-sm italic py-8 text-center border border-glass rounded-2xl">Your activity timeline is empty.</p>
                )}
              </div>
            </section>

            {/* Recommended */}
            {recommendedItems.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-main mb-8 flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-500" />
                  Live Recommendations
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {recommendedItems.map(item => (
                    <div key={item.id} className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-glass">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[8px] font-bold text-brand-purple uppercase tracking-widest">{item.category}</span>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {createPortal(
        <AnimatePresence>
          {isEditProfileOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditProfileOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative shadow-[0_0_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto z-10 my-auto backdrop-blur-2xl text-white"
              >
                <button 
                  onClick={() => setIsEditProfileOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                  <div className="w-11 h-11 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Edit Fan Profile</h3>
                  <p className="text-zinc-400 text-xs mt-1">
                    Customize your identity, avatar, and preferred fandoms.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {/* Display Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-1">Display Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Your username"
                      className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-3 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-sm"
                    />
                  </div>

                  {/* Avatar Selection */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-1">Profile Avatar</label>
                    
                    {/* Preset Avatars - 2 rows of 4 */}
                    <div className="grid grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/15">
                      {PRESET_AVATARS.map((item, idx) => {
                        const isSelected = profileAvatar === item.url;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setProfileAvatar(item.url)}
                            className="flex flex-col items-center gap-1 group py-1 cursor-pointer"
                          >
                            <div className={cn(
                              "w-13 h-13 rounded-full overflow-hidden border-2 transition-all bg-black/40 shadow-md",
                              isSelected ? "border-cyan-400 ring-4 ring-cyan-500/30 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "border-white/20 opacity-70 hover:opacity-100 hover:border-cyan-400/60"
                            )}>
                              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <span className={cn(
                              "text-[9px] uppercase tracking-wide transition-colors font-black",
                              isSelected ? "text-cyan-400" : "text-zinc-400 group-hover:text-white"
                            )}>{item.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Or Custom URL */}
                    <div className="relative">
                      <input
                        type="text"
                        value={profileAvatar}
                        onChange={(e) => setProfileAvatar(e.target.value)}
                        placeholder="Avatar image path or URL..."
                        className="w-full bg-white/[0.06] border border-white/15 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.1] transition-all text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Favorite Fandoms Multiselect */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-1">Favorite Fandoms</label>
                      <span className="text-[10px] text-zinc-400 font-bold">{selectedFandoms.length} selected</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_FANDOMS.map((fandom) => {
                        const isSelected = selectedFandoms.includes(fandom);
                        return (
                          <button
                            type="button"
                            key={fandom}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedFandoms(selectedFandoms.filter((f) => f !== fandom));
                              } else {
                                setSelectedFandoms([...selectedFandoms, fandom]);
                              }
                            }}
                            className={cn(
                              "py-2.5 px-3.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer",
                              isSelected
                                ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                                : "bg-white/[0.04] border-white/10 text-zinc-300 hover:border-white/20 hover:text-white"
                            )}
                          >
                            <span>{fandom}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-white/10">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setIsEditProfileOpen(false)} 
                      className="flex-1 h-11 text-xs text-zinc-300 hover:text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="flex-1 h-11 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:opacity-90 text-white shadow-md shadow-cyan-500/25"
                    >
                      Save Profile
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* OTP Verification Modal Portal */}
      {createPortal(
        <AnimatePresence>
          {isOtpModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                onClick={() => !otpLoading && setIsOtpModalOpen(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border border-cyan-500/30 p-7 shadow-[0_0_60px_rgba(0,0,0,0.9)] z-10 overflow-hidden backdrop-blur-2xl text-white"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Verify Your Email</h3>
                      <p className="text-[11px] text-zinc-400">Enter the 6-digit code sent to your email</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => !otpLoading && setIsOtpModalOpen(false)} 
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-4 text-xs text-zinc-300 bg-white/[0.06] p-3 rounded-xl border border-white/15 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Code sent to: <strong className="text-white">{user?.email}</strong></span>
                </div>

                {devOtpHint && (
                  <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Dev Mode OTP:
                      </div>
                      <div className="font-mono text-sm font-black text-white tracking-widest mt-0.5">{devOtpHint}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const digits = devOtpHint.split("").slice(0, 6);
                        setOtpDigits(digits);
                        otpInputRefs.current[5]?.focus();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold border border-cyan-500/40 transition-colors cursor-pointer"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                {otpError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{otpError}</span>
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="flex gap-2 justify-center my-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onFocus={(e) => e.target.select()}
                        className="w-11 h-13 text-center text-xl font-black bg-white/[0.08] border border-white/20 rounded-xl text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-zinc-400">Didn't receive the code?</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || otpLoading}
                      onClick={handleModalResend}
                      className="text-cyan-400 hover:text-cyan-300 font-bold disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsOtpModalOpen(false)}
                      disabled={otpLoading}
                      className="flex-1 h-11 text-xs text-zinc-300 hover:text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={otpLoading || otpDigits.join("").length !== 6}
                      className="flex-1 h-11 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:opacity-90 text-white border-none shadow-lg shadow-cyan-500/25"
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Verifying...
                        </>
                      ) : (
                        "Verify & Confirm"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
