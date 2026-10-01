import React, { useState } from "react";
import { Button } from "../components/common/Button";
import { Send, Sparkles, MessageSquare, Bug, Lightbulb, HelpCircle } from "lucide-react";
import { storage } from "../utils/localStorage";
import { motion } from "motion/react";
import { cn } from "../utils";

import { api } from "../services/api";

export default function Feedback() {
  const [type, setType] = useState<"bug" | "suggestion" | "query">("suggestion");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createFeedback({ type, message });
    } catch {
      const feedbacks = storage.get<any[]>("FEEDBACK") || [];
      feedbacks.push({ type, message, timestamp: Date.now() });
      storage.set("FEEDBACK", feedbacks);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 bg-bg-main flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12 rounded-[3rem] bg-main/5 border border-glass max-w-lg mx-auto shadow-2xl backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-cyan-500/30">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-main mb-4 tracking-tight">Transmission Received!</h2>
          <p className="text-muted mb-10 leading-relaxed">
            Thank you for helping us build a better universe. Our team will review your feedback shortly.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="h-12 px-8">Send More Feedback</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-bg-main">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black text-main mb-6 tracking-tighter">
              Help Us Build <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent italic">The Future</span>
            </h1>
            <p className="text-muted text-lg">
              Have a suggestion? Found a glitch? Want to see a new universe? <br /> Your feedback is our guiding star.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-4">
              {[
                { id: "bug", label: "Report a Bug", icon: Bug, desc: "Something isn't working right." },
                { id: "suggestion", label: "Make Suggestion", icon: Lightbulb, desc: "Idea to improve the hub." },
                { id: "query", label: "General Query", icon: HelpCircle, desc: "Ask us anything." },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setType(item.id as any)}
                  className={cn(
                    "w-full p-6 rounded-2xl border text-left transition-all group",
                    type === item.id 
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 shadow-lg shadow-cyan-500/20" 
                      : "bg-main/5 border-glass text-muted hover:border-cyan-500/40 hover:text-main"
                  )}
                >
                  <item.icon className={cn("w-6 h-6 mb-4", type === item.id ? "text-cyan-500" : "text-cyan-600 dark:text-cyan-400")} />
                  <h4 className="font-bold mb-1">{item.label}</h4>
                  <p className={cn("text-xs", type === item.id ? "text-cyan-600 dark:text-cyan-300" : "text-muted")}>{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-main/5 border border-glass space-y-6 shadow-xl backdrop-blur-xl">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Your Message</label>
                  <textarea
                    required
                    rows={8}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-main/5 border border-glass rounded-2xl p-6 text-main focus:outline-none focus:border-cyan-500/50 transition-all resize-none leading-relaxed"
                    placeholder={`Tell us more about your ${type}...`}
                  />
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted bg-main/5 border border-glass p-4 rounded-xl">
                  <Sparkles className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <p>Your feedback is synced to the database and used to improve the Fan Hub Plus experience. We appreciate your contribution!</p>
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-black tracking-wide gap-3 shadow-xl shadow-cyan-500/20">
                  <Send className="w-5 h-5" /> Submit Feedback
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
