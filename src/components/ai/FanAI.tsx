import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Sparkles, X, Send, Trash2, Bot, Info } from "lucide-react";
import { chatWithGemini } from "../../services/gemini";
import { ChatMessage as ChatMessageType, ChatFAQ } from "../../types";
import { ChatMessage } from "./ChatMessage";
import { storage } from "../../utils/localStorage";
import { animeCache } from "../../utils/animeCache";
import { Anime } from "../../types/anime";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../utils";

const SYSTEM_PROMPT = `You are FanAI, the intelligent entertainment assistant inside Fan Hub Plus.
You help users discover content across 8 core categories: Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay.
Fan Hub Plus is a premium fandom gateway. Since persistent server-side storage (Firebase) was declined, we use local synchronization for bookmarks and profiles.

You can:
- recommend content in all 8 categories
- explain fandom lore and characters
- suggest upcoming events or nearby meetups (using the multiverse map)
- explain how to use the site (Sitemap, Project Flow, Admin Dashboard)
- provide onboarding for new users

Always be conversational, concise, and friendly. Use emojis occasionally for flair. 
If a user asks about trending content, refer to the [LIVE_CONTEXT] if provided.`;

export const FanAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>(() => 
    storage.get<ChatMessageType[]>("CHAT") || [
      {
        id: "welcome",
        role: "model",
        text: "Greetings, citizen of the multiverse! I am FanAI. How can I assist your discovery today?",
        timestamp: Date.now(),
      }
    ]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    storage.set("CHAT", messages);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Fetch context
    const trendingContext = animeCache.get<Anime[]>("trending_1_10") || [];
    const newsContext = animeCache.get<any[]>("anime_news") || [];
    
    let liveContext = "";
    if (trendingContext.length > 0) {
      liveContext += "\n[LIVE_TRENDING_ANIME]: " + trendingContext.map(a => a.title.english || a.title.romaji).join(", ");
    }
    if (newsContext.length > 0) {
      liveContext += "\n[LIVE_ANIME_NEWS]: " + newsContext.slice(0, 3).map(n => n.title).join(" | ");
    }

    const fullInstruction = liveContext ? `${SYSTEM_PROMPT}\n\n[LIVE_CONTEXT]:${liveContext}` : SYSTEM_PROMPT;

    const userMessage: ChatMessageType = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithGemini([...messages, userMessage], fullInstruction);
      const aiMessage: ChatMessageType = {
        id: Math.random().toString(36).substr(2, 9),
        role: "model",
        text: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: ChatMessageType = {
        id: "error-" + Date.now(),
        role: "model",
        text: "Apologies, my synaptic link is flickering. Please check your connection or API key.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const welcome = messages[0];
    setMessages([welcome]);
    storage.remove("CHAT");
  };

  const storedFaqs: ChatFAQ[] = storage.get<ChatFAQ[]>("FAQS") || [
    { id: "1", question: "How do I save content to my Watchlist?", answer: "Click the Bookmark / Save icon on any movie, anime, or merchandise card to store it in your Dashboard.", category: "Bookmarks" },
    { id: "2", question: "Can I buy merchandise directly?", answer: "No, Fan Hub Plus is exclusively a discovery showcase and fan lore platform. Transactions, checkouts, and payment processing are not supported.", category: "Merchandise" },
    { id: "3", question: "How can I submit my own fan content?", answer: "Go to the 'Submit Content' page from your dashboard or navbar, fill in details, and our admins will review and publish it.", category: "Submissions" },
    { id: "4", question: "What fandom universes are supported?", answer: "We support 8 major fandom universes: Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay.", category: "General" },
  ];

  const handleFaqClick = (faq: ChatFAQ) => {
    const userMsg: ChatMessageType = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      text: faq.question,
      timestamp: Date.now(),
    };
    const modelMsg: ChatMessageType = {
      id: Math.random().toString(36).substr(2, 9),
      role: "model",
      text: faq.answer,
      timestamp: Date.now() + 50,
    };
    setMessages((prev) => [...prev, userMsg, modelMsg]);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "fixed bottom-24 right-4 sm:bottom-6 sm:right-8 z-[100] w-13 h-13 sm:w-14 sm:h-14 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/50 border border-cyan-300/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300 group",
          isOpen && "opacity-0 pointer-events-none scale-50"
        )}
        title="Open FanAI Assistant"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-950/80">
          <img 
            src="/chatbot-logo.png" 
            alt="FanAI Goku Kanji Logo" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping shadow-lg border border-slate-950" />
        </div>
      </motion.button>

      {/* Chat Panel rendered in Portal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(12px)" }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed bottom-20 right-4 sm:bottom-6 sm:right-8 z-[99999] w-[calc(100vw-2rem)] sm:max-w-[400px] h-[520px] max-h-[75vh] glass-panel rounded-3xl flex flex-col shadow-2xl overflow-hidden border border-cyan-500/30 backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-glass bg-main/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden shadow-md shadow-cyan-500/30 shrink-0">
                    <img 
                      src="/chatbot-logo.png" 
                      alt="FanAI Logo" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-main text-base tracking-tight leading-tight">FanAI</h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Multiverse AI Guide
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={clearChat}
                    className="p-1.5 rounded-lg hover:bg-main/10 text-muted hover:text-rose-400 transition-all"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-main/10 hover:bg-main/20 text-main transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex gap-2.5 items-center mb-2">
                    <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden shrink-0 shadow">
                      <img 
                        src="/chatbot-logo.png" 
                        alt="FanAI Loading" 
                        className="w-full h-full object-cover rounded-full animate-pulse"
                      />
                    </div>
                    <div className="glass px-3.5 py-2.5 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3.5 border-t border-glass bg-main/5">
                <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                  {storedFaqs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => handleFaqClick(faq)}
                      className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-bg-main/80 border border-glass text-[9px] font-semibold text-muted hover:text-cyan-400 hover:border-cyan-500/40 transition-all flex items-center gap-1 shrink-0"
                      title={faq.question}
                    >
                      <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                      <span className="truncate max-w-[140px]">{faq.question}</span>
                    </button>
                  ))}
                </div>

                <div className="relative group mt-1">
                  <input
                    type="text"
                    placeholder="Ask FanAI anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="w-full bg-bg-main/90 border border-glass rounded-xl py-2.5 pl-3.5 pr-11 text-xs text-main placeholder:text-muted/50 focus:outline-none focus:border-cyan-400/60 transition-all shadow-inner"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 disabled:opacity-30 disabled:scale-95 transition-all shadow shadow-cyan-500/25 flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Info className="w-2.5 h-2.5 text-muted/40" />
                  <p className="text-[8px] text-muted/40 font-bold uppercase tracking-wider">
                    FanAI Multiverse Engine
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
