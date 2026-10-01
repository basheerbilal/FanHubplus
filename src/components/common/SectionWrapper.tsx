import React from "react";
import { motion } from "motion/react";

interface SectionWrapperProps {
  children: React.ReactNode;
  delay?: number;
}

export const SectionWrapper = ({ children, delay = 0 }: SectionWrapperProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      {children}
    </motion.section>
  );
};
