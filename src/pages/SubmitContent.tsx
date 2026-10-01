import React, { useState, useRef } from "react";
import { Button } from "../components/common/Button";
import { Send, Image as ImageIcon, Link as LinkIcon, FileText, CheckCircle2, Loader2, Upload, Trash2, RefreshCw } from "lucide-react";
import { storage } from "../utils/localStorage";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function SubmitContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadTab, setUploadTab] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Anime",
    type: "Article",
    description: "",
    image: "",
    sourceUrl: ""
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    setIsUploading(true);

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
            setFormData(prev => ({ ...prev, image: res.url }));
          } else {
            setFormData(prev => ({ ...prev, image: base64Data }));
          }
        } catch {
          setFormData(prev => ({ ...prev, image: base64Data }));
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => setIsUploading(false);
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  const categories = ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"];
  const types = ["Article", "Character Profile", "Event Highlight", "Multimedia"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.createSubmission({
        ...formData,
        category: formData.category as any,
        authorEmail: user?.email || "anonymous@fanhub.plus",
      });
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.warn("Backend submission fallback:", err);
      const submissions = storage.get<any[]>("SUBMISSIONS") || [];
      submissions.push({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        status: "pending",
        timestamp: Date.now()
      });
      storage.set("SUBMISSIONS", submissions);
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 bg-bg-main flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12 rounded-[3rem] bg-main/5 border border-glass max-w-lg mx-auto shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-main mb-4 tracking-tighter">Submission Received!</h2>
          <p className="text-muted mb-10 leading-relaxed">
            Your contribution to the Fan Hub multiverse has been recorded. Our administrators will review and publish it shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setSubmitted(false)} variant="primary" className="h-12 px-8">Submit Another</Button>
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="h-12 px-8">Back to Dashboard</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-16 min-h-screen bg-bg-main">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-main tracking-tighter">
                Fan <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Contribution Portal</span>
              </h1>
              <p className="text-muted text-sm">Share your stories, characters, and highlights with the global community.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest ml-1">Content Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., The Evolution of JRPG Combat"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 rounded-2xl py-4 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl py-4 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all text-sm shadow-sm [&>option]:bg-white dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest ml-1">Content Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl py-4 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all text-sm shadow-sm [&>option]:bg-white dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest ml-1">Cover Image / Artwork *</label>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.05] p-0.5 rounded-lg border border-slate-200 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setUploadTab("upload")}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all",
                        uploadTab === "upload" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-muted hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      📁 Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadTab("url")}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-bold transition-all",
                        uploadTab === "url" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-muted hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      🔗 URL
                    </button>
                  </div>
                </div>

                {uploadTab === "upload" ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/png,image/jpeg,image/webp,image/gif,image/*"
                      className="hidden"
                    />
                    {!formData.image ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "border-2 border-dashed border-cyan-500/60 dark:border-cyan-400/60 hover:border-cyan-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-cyan-500/[0.05] dark:bg-cyan-500/[0.08] hover:bg-cyan-500/[0.12] transition-all text-center group shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
                          isUploading && "pointer-events-none opacity-60"
                        )}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <RefreshCw className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-spin" />
                            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Uploading {uploadFileName || "image"}...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 transition-all group-hover:scale-110 shadow-sm">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 group-hover:text-cyan-500">Click to choose image from device</span>
                            <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">Supported: PNG, JPG, JPEG, WebP, GIF</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-12 h-12 rounded-xl object-cover border border-glass shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{uploadFileName || "Selected image"}</p>
                            <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready for submission
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-main/10 hover:bg-main/20 text-xs font-bold text-slate-900 dark:text-white border border-glass"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(p => ({ ...p, image: "" }));
                              setUploadFileName("");
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-muted group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      required
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 rounded-2xl py-4 pl-12 pr-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all text-sm font-mono shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest ml-1">Source / Portfolio Link (Optional)</label>
                <div className="relative group">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-muted group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                    className="w-full bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 rounded-2xl py-4 pl-12 pr-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest ml-1">Rich Description & Lore Content *</label>
                <textarea
                  required
                  rows={10}
                  placeholder="Share your detailed analysis, guide, or story here..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 rounded-3xl p-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all resize-none leading-relaxed text-sm shadow-sm"
                />
              </div>

              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  By submitting, you agree to our community guidelines. All submissions are moderated for safety and quality before being published to the multiverse hub.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 text-base font-black tracking-widest gap-3 shadow-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:opacity-95 text-white border-none shadow-cyan-500/25"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Publish Content to Community
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
