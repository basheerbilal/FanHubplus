import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Play,
  Pause,
  ExternalLink,
  Tv,
  Film,
  Video,
  Sparkles,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Minimize2,
  Repeat,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerId?: string;
  trailerUrl?: string;
  title: string;
  animeId?: number | string;
  idMal?: number;
  coverImage?: string;
  episodeNumber?: number;
  totalEpisodes?: number;
  onEpisodeChange?: (newEp: number) => void;
}

// ── CUSTOM HIGH-PERFORMANCE VIDEO PLAYER COMPONENT ──────────────────
interface CustomVideoPlayerProps {
  src: string;
  title: string;
  coverImage?: string;
}

const CustomVideoPlayer = ({ src, title, coverImage }: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Format time (00:00)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Update buffered ranges calculation
  const updateBuffer = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const current = video.currentTime;
    for (let i = 0; i < video.buffered.length; i++) {
      if (video.buffered.start(i) <= current && current <= video.buffered.end(i)) {
        const bufferedEnd = video.buffered.end(i);
        const pct = Math.min(100, (bufferedEnd / video.duration) * 100);
        setBufferedPercent(pct);
        return;
      }
    }
  }, []);

  // Controls auto-fade
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 3000);
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch(() => {
            // Auto-fallback with mute if autoplay was blocked by browser
            video.muted = true;
            setIsMuted(true);
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Skip time
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    updateBuffer();
  };

  // Seek on scrubber
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  // Change Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    videoRef.current.muted = newMute;
    if (!newMute && volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
  };

  // Toggle Loop
  const toggleLoop = () => {
    if (!videoRef.current) return;
    const next = !isLooping;
    setIsLooping(next);
    videoRef.current.loop = next;
  };

  // Change Speed
  const handleSpeedSelect = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setShowSpeedMenu(false);
  };

  // Toggle Fullscreen
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      try {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        // Fallback
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === "Space" || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowLeft" || e.key === "j") {
        e.preventDefault();
        skip(-5);
      } else if (e.key === "ArrowRight" || e.key === "l") {
        e.preventDefault();
        skip(5);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, duration, volume, isMuted, isFullscreen]);

  // Handle Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      className="relative w-full h-full bg-black flex items-center justify-center select-none overflow-hidden group"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={coverImage}
        preload="auto"
        playsInline
        crossOrigin="anonymous"
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onLoadStart={() => {
          setIsBuffering(true);
          setHasError(false);
        }}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          setDuration(v.duration);
          updateBuffer();
        }}
        onCanPlay={() => {
          setIsBuffering(false);
          updateBuffer();
        }}
        onCanPlayThrough={() => {
          setIsBuffering(false);
          updateBuffer();
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setCurrentTime(v.currentTime);
          updateBuffer();
        }}
        onProgress={updateBuffer}
        onError={() => {
          setIsBuffering(false);
          setHasError(true);
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (!isLooping) setShowControls(true);
        }}
        autoPlay
      />

      {/* Buffering Spinner Overlay */}
      <AnimatePresence>
        {isBuffering && !hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none z-20"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-5 h-5 text-cyan-400 fill-cyan-400 animate-pulse" />
              </div>
            </div>
            <p className="mt-3 text-xs font-black uppercase tracking-widest text-cyan-300 drop-shadow-md">
              Buffering Ultra HD Stream...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white p-6 text-center z-20">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h4 className="text-base font-bold text-white mb-1">Stream Loading Stalled</h4>
          <p className="text-xs text-muted max-w-sm mb-4">
            Could not stream video packet. Please click reload to refresh stream buffer.
          </p>
          <button
            onClick={() => {
              if (videoRef.current) {
                setHasError(false);
                setIsBuffering(true);
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload Stream
          </button>
        </div>
      )}

      {/* Big Central Play/Pause Flash Button */}
      <AnimatePresence>
        {!isPlaying && !isBuffering && !hasError && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all z-20"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quality & Looping Badge (Top Right) */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20 pointer-events-none">
        {isLooping && (
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-sm">
            <Repeat className="w-3 h-3" /> Loop ON
          </span>
        )}
        <span className="px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          1080p Ultra HD
        </span>
      </div>

      {/* Bottom Custom Controls Bar */}
      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-30 flex flex-col gap-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrubber Progress Bar */}
            <div
              onClick={handleSeek}
              className="relative w-full h-2 hover:h-3 rounded-full bg-white/20 cursor-pointer transition-all flex items-center group/track"
            >
              {/* Buffered Bar */}
              <div
                style={{ width: `${bufferedPercent}%` }}
                className="absolute left-0 top-0 bottom-0 bg-white/35 rounded-full transition-all duration-300"
              />
              {/* Played Bar */}
              <div
                style={{ width: `${progressPercent}%` }}
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              />
              {/* Scrubber Knob */}
              <div
                style={{ left: `${progressPercent}%` }}
                className="absolute -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-cyan-400 shadow-md opacity-0 group-hover/track:opacity-100 transition-opacity"
              />
            </div>

            {/* Bottom Row Controls */}
            <div className="flex items-center justify-between text-white text-xs">
              {/* Left: Play/Pause, Skips, Time */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => skip(-10)}
                  className="p-1.5 text-zinc-300 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => skip(10)}
                  className="p-1.5 text-zinc-300 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-colors"
                  title="Forward 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Time Tracker */}
                <span className="font-mono text-xs text-zinc-300 font-bold ml-1">
                  <span className="text-cyan-400">{formatTime(currentTime)}</span> / {formatTime(duration)}
                </span>
              </div>

              {/* Right: Volume, Speed, Loop, Fullscreen */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Volume Slider */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    title="Mute/Unmute (m)"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-14 sm:w-20 h-1.5 rounded-lg accent-cyan-400 bg-white/20 cursor-pointer"
                  />
                </div>

                {/* Speed Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-zinc-200 transition-colors"
                    title="Playback Speed"
                  >
                    {playbackRate}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 p-1 rounded-xl bg-slate-900 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col gap-0.5 min-w-[70px]">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleSpeedSelect(rate)}
                          className={cn(
                            "px-2.5 py-1 text-left text-xs font-bold rounded-lg transition-colors",
                            playbackRate === rate ? "bg-cyan-500 text-white" : "text-zinc-300 hover:bg-white/10"
                          )}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Loop Toggle */}
                <button
                  onClick={toggleLoop}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isLooping ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/40" : "text-zinc-300 hover:text-white hover:bg-white/10"
                  )}
                  title={isLooping ? "Loop Enabled" : "Enable Loop"}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Fullscreen (f)"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── MAIN TRAILER & FULL EPISODE STREAM MODAL ─────────────────────────
export const TrailerModal = ({ 
  isOpen, 
  onClose, 
  trailerId, 
  trailerUrl, 
  title, 
  animeId, 
  idMal,
  coverImage,
  episodeNumber,
  totalEpisodes,
  onEpisodeChange 
}: TrailerModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [selectedServer, setSelectedServer] = useState<"vidsrc" | "autoembed" | "multiembed" | "trailer">(
    episodeNumber ? "vidsrc" : "trailer"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (episodeNumber) {
      setSelectedServer("vidsrc");
    } else if (trailerId) {
      setSelectedServer("trailer");
    }
  }, [episodeNumber, trailerId]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const cleanTitle = title.replace(/•.*/, "").trim();
  const query = encodeURIComponent(`${cleanTitle} official trailer`);
  const crunchyrollUrl = `https://www.crunchyroll.com/search?q=${encodeURIComponent(cleanTitle)}`;
  const netflixUrl = `https://www.netflix.com/search?q=${encodeURIComponent(cleanTitle)}`;
  const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
  const gogoStreamUrl = `https://anitaku.to/search.html?keyword=${encodeURIComponent(cleanTitle)}`;
  const zoroStreamUrl = `https://hianime.to/search?keyword=${encodeURIComponent(cleanTitle)}`;
  const anilistUrl = animeId ? `https://anilist.co/anime/${animeId}` : `https://anilist.co/search/anime?search=${encodeURIComponent(cleanTitle)}`;

  // Determine effective embed URL or direct video source
  let embedSrc = "";
  let isDirectVideo = false;

  const effectiveId = idMal || animeId || "";
  const epNum = episodeNumber || 1;

  if (selectedServer === "vidsrc" && effectiveId) {
    embedSrc = `https://vidsrc.cc/v2/embed/anime/${effectiveId}/${epNum}`;
  } else if (selectedServer === "autoembed" && effectiveId) {
    embedSrc = `https://autoembed.co/anime/mal/${effectiveId}/${epNum}`;
  } else if (selectedServer === "multiembed" && effectiveId) {
    embedSrc = `https://2embed.cc/embed/anime/${effectiveId}/${epNum}`;
  } else if (
    trailerUrl &&
    (trailerUrl.startsWith("/uploads/") ||
      trailerUrl.startsWith("/api/stream/") ||
      trailerUrl.startsWith("data:video/") ||
      trailerUrl.startsWith("blob:") ||
      /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(trailerUrl))
  ) {
    embedSrc = trailerUrl;
    isDirectVideo = true;
  } else if (trailerId) {
    embedSrc = `https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`;
  } else if (trailerUrl && !trailerUrl.includes("anilist.co") && !trailerUrl.includes("myanimelist.net")) {
    if (trailerUrl.includes("youtube.com/embed/")) {
      embedSrc = `${trailerUrl}?autoplay=1&rel=0&modestbranding=1`;
    } else if (trailerUrl.includes("watch?v=")) {
      const vid = trailerUrl.split("watch?v=")[1]?.split("&")[0];
      embedSrc = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`;
    } else if (trailerUrl.includes("youtu.be/")) {
      const vid = trailerUrl.split("youtu.be/")[1]?.split("?")[0];
      embedSrc = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`;
    } else if (trailerUrl.endsWith(".mp4") || trailerUrl.endsWith(".webm") || trailerUrl.endsWith(".m3u8") || trailerUrl.startsWith("/uploads/")) {
      embedSrc = trailerUrl;
      isDirectVideo = true;
    }
  }

  // Fallback if no server matched
  if (!embedSrc && effectiveId) {
    embedSrc = `https://vidsrc.cc/v2/embed/anime/${effectiveId}/${epNum}`;
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-cyan-500/30 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)] z-10 my-auto"
          >
            {/* Header Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
              <div className="flex items-center gap-3 pr-4 truncate min-w-0">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0 shadow-sm">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="truncate min-w-0">
                  <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate tracking-tight">{title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                      {episodeNumber ? `Episode ${episodeNumber} • Full HD Stream` : "Universe Trailer & Media Stream"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prev / Next Episode Controls inside header */}
              <div className="flex items-center gap-2 shrink-0">
                {episodeNumber && onEpisodeChange && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1">
                    <button
                      type="button"
                      disabled={episodeNumber <= 1}
                      onClick={() => onEpisodeChange(episodeNumber - 1)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      ◀ Prev
                    </button>
                    <span className="text-xs font-black text-cyan-500 px-1">
                      Ep #{episodeNumber}
                    </span>
                    <button
                      type="button"
                      disabled={totalEpisodes ? episodeNumber >= totalEpisodes : false}
                      onClick={() => onEpisodeChange(episodeNumber + 1)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      Next ▶
                    </button>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="p-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-xl text-slate-600 dark:text-white transition-all shrink-0 border border-slate-200 dark:border-white/10"
                  title="Close Player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Server Switcher Toolbar */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto py-2.5 px-4 sm:px-6 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                <span className="text-[11px] font-black text-muted uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
                  <Tv className="w-3.5 h-3.5 text-cyan-500" /> Server:
                </span>
                
                <button
                  type="button"
                  onClick={() => setSelectedServer("vidsrc")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border",
                    selectedServer === "vidsrc"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/25"
                      : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-cyan-500"
                  )}
                >
                  ⚡ Server 1 (VidSrc HD)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedServer("autoembed")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border",
                    selectedServer === "autoembed"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/25"
                      : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-cyan-500"
                  )}
                >
                  🎬 Server 2 (AutoEmbed)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedServer("multiembed")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border",
                    selectedServer === "multiembed"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/25"
                      : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-cyan-500"
                  )}
                >
                  🌐 Server 3 (2Embed)
                </button>

                {trailerId && (
                  <button
                    type="button"
                    onClick={() => setSelectedServer("trailer")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border",
                      selectedServer === "trailer"
                        ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/25"
                        : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-rose-500"
                    )}
                  >
                    ▶ Trailer
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={embedSrc || gogoStreamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-md shadow-cyan-500/25 cursor-pointer"
                  title="Watch full episode in direct clean HD player (no iframe blocking)"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Watch Direct HD ↗
                </a>

                {episodeNumber && onEpisodeChange && (
                  <div className="flex sm:hidden items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={episodeNumber <= 1}
                      onClick={() => onEpisodeChange(episodeNumber - 1)}
                      className="p-1 rounded bg-white dark:bg-white/10 disabled:opacity-30"
                    >
                      ◀
                    </button>
                    <span className="text-[10px] font-black text-cyan-500">#{episodeNumber}</span>
                    <button
                      type="button"
                      disabled={totalEpisodes ? episodeNumber >= totalEpisodes : false}
                      onClick={() => onEpisodeChange(episodeNumber + 1)}
                      className="p-1 rounded bg-white dark:bg-white/10 disabled:opacity-30"
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Video Player Area */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {embedSrc ? (
                isDirectVideo ? (
                  <CustomVideoPlayer
                    src={embedSrc}
                    title={title}
                    coverImage={coverImage}
                  />
                ) : (
                  <iframe
                    key={embedSrc}
                    src={embedSrc}
                    title={`${title} Episode Player`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-cyan-500/10 via-slate-950 to-blue-600/10">
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md scale-105"
                    />
                  )}
                  <div className="relative z-10 max-w-lg space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
                      <Film className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black text-white">{title}</h4>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Select an official streaming service below to watch episodes in full HD with subs & dubs.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={crunchyrollUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all hover:scale-105"
                      >
                        <Tv className="w-4 h-4" /> Crunchyroll <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-105"
                      >
                        <Video className="w-4 h-4" /> YouTube Trailer <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Stream Options Bar */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Available Official Streaming Platforms:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <a
                  href={gogoStreamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
                >
                  ⚡ GogoAnime HD
                </a>
                <a
                  href={zoroStreamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> HiAnime / Zoro
                </a>
                <a
                  href={crunchyrollUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  <Tv className="w-3.5 h-3.5 text-orange-400" /> Crunchyroll
                </a>
                <a
                  href={netflixUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  <Film className="w-3.5 h-3.5 text-rose-500" /> Netflix
                </a>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  <Video className="w-3.5 h-3.5 text-red-500" /> YouTube
                </a>
                <a
                  href={anilistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> AniList
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
