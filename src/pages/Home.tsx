import React from "react";
import { Hero } from "../components/home/Hero";
import { TrendingInFandoms } from "../components/home/TrendingInFandoms";
import { AnimeMangaHighlights } from "../components/home/AnimeMangaHighlights";
import { IconicCharactersSection } from "../components/home/IconicCharactersSection";
import { MultimediaVaultSection } from "../components/home/MultimediaVaultSection";
import { GamingCosplaySection } from "../components/home/GamingCosplaySection";
import { MerchShowcaseSection } from "../components/home/MerchShowcaseSection";
import { MostWatchedShowsSection } from "../components/home/MostWatchedShowsSection";
import { SitemapSection } from "../components/home/SitemapSection";

export default function Home() {
  return (
    <div className="space-y-0 bg-bg-main min-h-screen text-main transition-colors duration-300">
      {/* Cinematic Hero with 2-second auto-cycle */}
      <Hero />

      {/* Row 1: Most-Watched Top 10 Ranked Shows Slider (Directly after Hero) */}
      <MostWatchedShowsSection />

      {/* Row 2: Trending in Fandoms (Matches Image 1 bottom) */}
      <TrendingInFandoms />

      {/* Row 3: Anime & Manga Highlights (Matches Image 2 Section 1) */}
      <AnimeMangaHighlights />

      {/* Row 4: Iconic Character Profiles (Matches Image 2 Section 2) */}
      <IconicCharactersSection />

      {/* Row 5: Multimedia Vault (Trailers & Soundtracks) (Matches Image 2 Section 3) */}
      <MultimediaVaultSection />

      {/* Row 6: Gaming & Cosplay Creations (Matches Image 2 Section 4) */}
      <GamingCosplaySection />

      {/* Row 7: Exclusive Merchandise Showcase (Matches Image 2 Section 5) */}
      <MerchShowcaseSection />

      {/* Mandatory Sitemap Section */}
      <SitemapSection />
    </div>
  );
}
