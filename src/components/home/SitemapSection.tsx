import React from "react";
import { Link } from "react-router-dom";
import { Network, ArrowRight } from "lucide-react";

export const SitemapSection = () => {
  return (
    <section className="py-24 border-t border-glass">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto p-12 rounded-[3.5rem] glass-panel flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left shadow-2xl border-glass">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-[2rem] glass-panel flex items-center justify-center text-brand-purple shadow-xl">
              <Network className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-main tracking-tighter mb-2">Universe Architecture</h2>
              <p className="text-muted text-sm font-medium leading-relaxed max-w-sm">
                View the complete structural map and navigation flow of Fan Hub Plus.
              </p>
            </div>
          </div>
          
          <Link 
            to="/sitemap"
            className="group inline-flex items-center gap-4 px-10 py-5 glass-panel rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-main hover:bg-brand-purple hover:text-white transition-all shadow-xl"
          >
            Open Sitemap
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
