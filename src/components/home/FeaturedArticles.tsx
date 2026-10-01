import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, User, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { fetchLatestAnimeNews } from "../../services/animeNews";
import { NewsArticle } from "../../types/anime";

export const FeaturedArticles = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const news = await fetchLatestAnimeNews();
      setArticles(news);
      setLoading(false);
    };
    loadNews();
  }, []);

  if (loading) {
    return (
      <section className="py-24 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-brand-purple animate-spin" />
      </section>
    );
  }

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  if (!mainArticle) return null;

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] glass-panel flex items-center justify-center text-cyan-500">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Live Highlights</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter leading-none">Editorial Feed</h2>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Large Article */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 group"
          >
            <a href={mainArticle.url} target="_blank" rel="noopener noreferrer" className="block h-full">
              <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden glass-panel mb-8">
                <img 
                  src={mainArticle.image} 
                  alt={mainArticle.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-8 left-8">
                  <span className="px-5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    Live Highlight
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-6 text-muted text-xs font-bold uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    {mainArticle.source}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    {new Date(mainArticle.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="text-muted/30">·</div>
                  <div className="text-cyan-500 font-bold">{mainArticle.animeTitle || "Fandom"}</div>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-main tracking-tighter mb-6 group-hover:text-cyan-400 transition-colors leading-tight">
                  {mainArticle.title}
                </h3>
                <p className="text-xl text-muted mb-8 max-w-2xl leading-relaxed">
                  {mainArticle.description}
                </p>
                <div className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-main group-hover:translate-x-2 transition-transform">
                  Read Live Article
                  <ArrowRight className="w-5 h-5 text-cyan-500" />
                </div>
              </div>
            </a>
          </motion.div>

          {/* Side Small Articles */}
          <div className="lg:col-span-5 space-y-8">
            {sideArticles.map((article, i) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-4 rounded-[2rem] glass-card"
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex gap-6 items-start">
                  <div className="w-24 sm:w-32 aspect-square rounded-2xl overflow-hidden shrink-0 glass-panel">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                      <span className="text-cyan-500 font-bold">{article.source}</span>
                      <span className="text-muted/30">·</span>
                      <span className="text-muted">{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-lg font-bold text-main tracking-tight group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2 leading-tight">
                      {article.title}
                    </h4>
                    <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
