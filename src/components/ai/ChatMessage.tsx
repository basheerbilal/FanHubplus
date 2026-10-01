import React from "react";
import { ChatMessage as ChatMessageType } from "../../types";
import { cn } from "../../utils";
import { motion } from "motion/react";
import { User, Sparkles } from "lucide-react";

export const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  const isModel = message.role === "model";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex gap-3 mb-6",
        isModel ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-lg p-0.5",
        isModel ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/30" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-muted"
      )}>
        {isModel ? (
          <img src="/chatbot-logo.png" alt="FanAI" className="w-full h-full object-cover rounded-full" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>
      
      <div className={cn(
        "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
        isModel 
          ? "bg-main/5 border border-glass text-main rounded-tl-none" 
          : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-500/20"
      )}>
        {message.text}
        <div className={cn(
          "text-[10px] mt-2 font-medium opacity-50 uppercase tracking-widest",
          isModel ? "text-muted" : "text-cyan-100"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};
