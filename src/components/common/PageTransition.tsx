import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// Configure nprogress
nprogress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1
});

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    nprogress.start();
    
    // Slight delay to ensure progress bar is visible on fast loads
    const timer = setTimeout(() => {
      nprogress.done();
    }, 300);

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
        transition={{ 
          duration: 0.5, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
