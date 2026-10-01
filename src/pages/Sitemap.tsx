import React from "react";
import { Link } from "react-router-dom";
import { 
  Network, 
  Home, 
  Search, 
  User, 
  ShoppingBag, 
  Calendar, 
  FileText, 
  Users, 
  MessageSquare, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

export default function Sitemap() {
  const sections = [
    {
      title: "Main Experience",
      icon: Home,
      links: [
        { label: "Home / Landing", path: "/", desc: "Hero section, trending content, and quick categories." },
        { label: "Explore All", path: "/explore", desc: "The central hub for all fandom categories." },
        { label: "Live Airing", path: "/airing", desc: "Real-time anime broadcast schedules." },
        { label: "Global News", path: "/anime-news", desc: "Live news feed from the anime industry." },
      ],
    },
    {
      title: "Community & Content",
      icon: Users,
      links: [
        { label: "Character Universe", path: "/characters", desc: "Interactive profiles for iconic heroes and legends." },
        { label: "Featured Articles", path: "/articles", desc: "In-depth stories, analysis, and event highlights." },
        { label: "Event Discovery", path: "/events", desc: "Location-aware fan conventions and meetups." },
      ],
    },
    {
      title: "User Account",
      icon: User,
      links: [
        { label: "Login / Security", path: "/login", desc: "Secure authentication gateway." },
        { label: "Registration", path: "/signup", desc: "Join the community and customize your experience." },
        { label: "Personal Dashboard", path: "/dashboard", desc: "Your watchlist, favorites, and activity history." },
        { label: "Architecture Flow", path: "/flow", desc: "Visual project diagrams and visitor journeys." },
        { label: "Merchandise Vault", path: "/merchandise", desc: "Premium fandom collectibles and apparel showcase." },
        { label: "Feedback Form", path: "/feedback", desc: "Direct channel for bugs and suggestions." },
      ],
    },
    {
      title: "Administration",
      icon: ShieldCheck,
      links: [
        { label: "Admin Center", path: "/admin", desc: "Content management, user roles, and analytics." },
        { label: "AI Knowledge Base", path: "/admin", desc: "Manage chatbot FAQs and context data." },
      ],
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-bg-main">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Network className="w-4 h-4 text-cyan-400" /> Application Structure
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              Fan Hub Plus <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Sitemap</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              A comprehensive map of the fandom universe. Understand the architecture, flow, and features of the platform.
            </p>
          </div>

          {/* Map Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-main/5 border border-glass hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-bg-main border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <section.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.links.map((link) => (
                    <Link 
                      key={link.label}
                      to={link.path}
                      className="group block p-6 rounded-2xl bg-bg-main/50 border border-glass hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                          {link.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs text-muted leading-relaxed group-hover:text-muted transition-colors">
                        {link.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Flow Diagram Hint (SRS Page 5) */}
          <div className="mt-20 p-12 rounded-[4rem] bg-gradient-to-br from-zinc-900 to-black border border-glass text-center">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Architecture & Flow</h3>
            <p className="text-muted max-w-xl mx-auto mb-10 leading-relaxed">
              Fan Hub Plus is built with a decoupled architecture using React for the immersive frontend and Firebase for high-performance data delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Frontend", "API Gateway", "Auth System", "Cloud Storage", "AI Logic"].map((tech) => (
                <div key={tech} className="px-6 py-3 rounded-2xl bg-bg-main border border-glass text-[10px] font-black uppercase tracking-widest text-muted">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
