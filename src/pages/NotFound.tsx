import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Home, Compass, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-brand-purple/20 blur-[150px] rounded-full" />
      </div>

      <Ghost className="w-32 h-32 text-zinc-800 mb-8 animate-bounce" />
      
      <h1 className="text-[12rem] font-black text-white leading-none mb-4 tracking-tighter opacity-10 absolute pointer-events-none">404</h1>
      
      <h2 className="text-6xl font-black text-white mb-6 relative z-10">Lost in the Universe?</h2>
      <p className="text-muted text-xl max-w-lg mb-12 relative z-10 leading-relaxed">
        The universe you're looking for doesn't exist or has moved to another dimension. Let's get you back home.
      </p>

      <div className="flex flex-wrap gap-4 relative z-10">
        <Link to="/">
          <Button size="lg" className="h-14 px-10 gap-2">
            <Home className="w-5 h-5" /> Back to Base
          </Button>
        </Link>
        <Link to="/explore">
          <Button variant="outline" size="lg" className="h-14 px-10 gap-2 border-glass">
            <Compass className="w-5 h-5" /> Explore Fandoms
          </Button>
        </Link>
      </div>
    </div>
  );
}
