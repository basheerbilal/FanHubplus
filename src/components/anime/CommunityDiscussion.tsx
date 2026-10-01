import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Heart, ThumbsUp, Sparkles, User, ShieldCheck, Flame, MessageCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../utils/localStorage";
import { cn } from "../../utils";
import { motion, AnimatePresence } from "motion/react";

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  role?: string;
  text: string;
  timestamp: number;
  likes: number;
  isLiked?: boolean;
  tag?: "Theory" | "Episode Review" | "General" | "Spoiler";
  isSpoiler?: boolean;
}

const DEFAULT_COMMENTS: Record<number, Comment[]> = {
  182616: [
    {
      id: "c-1",
      author: "ShadowNinja99",
      avatar: "/avatars/eren.webp",
      role: "Member",
      text: "The animation quality for this season is absolutely peak! Studio CloverWorks did justice to every single sword fight choreography.",
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
      likes: 24,
      tag: "Episode Review"
    },
    {
      id: "c-2",
      author: "AnimeOracle",
      avatar: "/avatars/levi.jpg",
      role: "Verified Critic",
      text: "Theory: Tokiyuki's elusiveness will trigger a whole new faction shift by episode 8. Keep your eyes on the retainers.",
      timestamp: Date.now() - 1000 * 60 * 60 * 8,
      likes: 18,
      tag: "Theory"
    },
    {
      id: "c-3",
      author: "SakuraBlossom",
      avatar: "/avatars/sakura.jpg",
      role: "Member",
      text: "The pacing is super engaging and the comedy timing blends so naturally with the dark historical setting.",
      timestamp: Date.now() - 1000 * 60 * 60 * 18,
      likes: 12,
      tag: "General"
    }
  ]
};

export const CommunityDiscussion = ({
  animeId,
  animeTitle,
  isOpenDefault = true
}: {
  animeId: number;
  animeTitle: string;
  isOpenDefault?: boolean;
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = storage.get<Comment[]>(`COMMENTS_${animeId}`);
    if (saved && saved.length > 0) return saved;
    return DEFAULT_COMMENTS[animeId] || [
      {
        id: "c-default-1",
        author: "FandomPioneer",
        avatar: "/avatars/naruto.jpg",
        role: "Community Mod",
        text: `Welcome to the official discussion thread for ${animeTitle}! Share your thoughts, episode ratings, and theories below.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
        likes: 15,
        tag: "General"
      }
    ];
  });

  const [inputText, setInputText] = useState("");
  const [selectedTag, setSelectedTag] = useState<"General" | "Theory" | "Episode Review" | "Spoiler">("General");
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    storage.set(`COMMENTS_${animeId}`, comments);
  }, [comments, animeId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newComment: Comment = {
      id: "c-" + Date.now(),
      author: user?.name || "Anonymous Otaku",
      avatar: user?.avatar || "/avatars/naruto.jpg",
      role: user?.role === "admin" ? "Admin" : "Member",
      text: inputText.trim(),
      timestamp: Date.now(),
      likes: 0,
      tag: selectedTag,
      isSpoiler: selectedTag === "Spoiler"
    };

    setComments(prev => [newComment, ...prev]);
    setInputText("");
  };

  const handleToggleLike = (id: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
          };
        }
        return c;
      })
    );
  };

  const toggleRevealSpoiler = (id: string) => {
    setRevealedSpoilers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tags: Array<"General" | "Theory" | "Episode Review" | "Spoiler"> = [
    "General",
    "Episode Review",
    "Theory",
    "Spoiler"
  ];

  return (
    <div className="w-full">
      {!isOpen ? (
        <div className="p-8 sm:p-12 rounded-[2rem] glass-panel border border-cyan-500/20 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-brand-purple/30">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-main mb-3 tracking-tight">The Conversation Starts Here</h3>
          <p className="text-muted mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            Join {comments.length} fans discussing plot twists, episode rankings, and theories for <span className="text-cyan-400 font-bold">{animeTitle}</span>.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-brand-purple via-blue-600 to-cyan-500 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-purple/30 cursor-pointer inline-flex items-center gap-2.5 text-sm uppercase tracking-wider"
          >
            <MessageCircle className="w-4 h-4" />
            Open Community Panel ({comments.length})
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] glass-panel border border-cyan-500/20 shadow-2xl overflow-hidden p-6 sm:p-10"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-glass mb-8">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-md shadow-brand-purple/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-main tracking-tight flex items-center gap-2">
                  Community Discussion
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                    {comments.length}
                  </span>
                </h3>
                <p className="text-xs text-muted font-medium">Live multiverse fandom thread for {animeTitle}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-muted hover:text-main px-3 py-1.5 rounded-xl bg-main/5 border border-glass self-start sm:self-auto transition-colors"
            >
              Minimize Panel
            </button>
          </div>

          {/* New Comment Box */}
          <form onSubmit={handleAddComment} className="mb-10 bg-main/5 rounded-2xl p-4 sm:p-5 border border-glass">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-brand-purple/40 bg-black/40 shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-purple font-bold text-xs bg-slate-900">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-black text-main">{user ? user.name : "Guest Otaku"}</span>
                <span className="text-[10px] text-muted ml-2">Posting publicly</span>
              </div>
            </div>

            <textarea
              rows={3}
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`What did you think of ${animeTitle}? Share theories, episode hype, or reviews...`}
              className="w-full bg-bg-main/80 border border-glass rounded-xl p-3 text-sm text-main placeholder:text-muted/50 focus:outline-none focus:border-cyan-400/60 transition-all resize-none mb-3"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Tag Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider mr-1">Tag:</span>
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all border",
                      selectedTag === tag
                        ? tag === "Spoiler"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                          : "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                        : "bg-bg-main/50 text-muted border-glass hover:text-main"
                    )}
                  >
                    {tag === "Spoiler" ? "⚠️ Spoiler" : tag === "Theory" ? "🔮 Theory" : tag === "Episode Review" ? "⭐ Review" : tag}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-6 py-2.5 rounded-xl premium-gradient text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-40 disabled:scale-100 transition-all shadow-md shadow-brand-purple/30 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {comments.map((comment) => {
                const isSpoiler = comment.isSpoiler || comment.tag === "Spoiler";
                const isRevealed = revealedSpoilers[comment.id];

                return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 sm:p-5 rounded-2xl bg-main/5 border border-glass hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-glass bg-black/40 shrink-0">
                          {comment.avatar ? (
                            <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-purple font-bold text-xs bg-slate-900">
                              {comment.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-main">{comment.author}</span>
                            {comment.role === "Admin" ? (
                              <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] font-black uppercase tracking-wider border border-violet-500/40">
                                🛡️ Admin
                              </span>
                            ) : comment.role === "Verified Critic" ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-wider border border-amber-500/40">
                                ⭐ Critic
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-muted">
                            {new Date(comment.timestamp).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>

                      {comment.tag && (
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                          comment.tag === "Spoiler"
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : comment.tag === "Theory"
                              ? "bg-violet-500/15 text-violet-400 border-violet-500/30"
                              : "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                        )}>
                          {comment.tag}
                        </span>
                      )}
                    </div>

                    {/* Content / Spoiler Blur */}
                    {isSpoiler && !isRevealed ? (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center my-2">
                        <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-rose-300 mb-2">This comment contains spoilers</p>
                        <button
                          onClick={() => toggleRevealSpoiler(comment.id)}
                          className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                        >
                          Click to Reveal
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-main/90 leading-relaxed mb-4 whitespace-pre-line">
                        {comment.text}
                      </p>
                    )}

                    {/* Reaction / Like */}
                    <div className="flex items-center gap-4 pt-3 border-t border-glass/40">
                      <button
                        onClick={() => handleToggleLike(comment.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                          comment.isLiked
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                            : "bg-main/5 text-muted border-glass hover:text-main"
                        )}
                      >
                        <ThumbsUp className={cn("w-3.5 h-3.5", comment.isLiked && "fill-current")} />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};
