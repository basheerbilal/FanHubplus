import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { Breadcrumbs } from "./Breadcrumbs";
import { FanAI } from "../ai/FanAI";
import { motion, useScroll, useSpring } from "motion/react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  // Smooth scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Automatically scroll to top on every route navigation
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 selection:text-main relative overflow-x-clip bg-bg-main">
      {/* Top Smooth Scroll Progress Line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 z-[100] origin-left shadow-[0_0_15px_rgba(6,182,212,0.8)]"
        style={{ scaleX }}
      />

      {/* Dynamic Background Glow Blobs for Glassmorphism */}
      <div className="bg-glow">
        <div className="bg-glow-blob -top-[20%] -left-[10%] opacity-25" />
        <div className="bg-glow-blob top-[35%] -right-[15%] [animation-delay:3s] opacity-20" />
        <div className="bg-glow-blob -bottom-[15%] left-[25%] [animation-delay:6s] opacity-25" />
      </div>

      <Navbar />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="pb-20 lg:pb-0 relative z-10"
      >
        {!isAuthPage && location.pathname !== "/" && location.pathname !== "/admin" && (
          <div className="container mx-auto px-6 pt-24 pb-1 relative z-20">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </motion.main>
      {!isAuthPage && <Footer />}
      <MobileNav />
      <FanAI />
    </div>
  );
};
