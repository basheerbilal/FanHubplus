/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/layout/Layout";
import { PageTransition } from "./components/common/PageTransition";
import nprogress from "nprogress";
import "nprogress/nprogress.css";


// Lazy pages
const Home = React.lazy(() => import("./pages/Home"));
const Explore = React.lazy(() => import("./pages/Explore"));
const ContentDetail = React.lazy(() => import("./pages/ContentDetail"));
const Characters = React.lazy(() => import("./pages/Characters"));
const CharacterDetail = React.lazy(() => import("./pages/CharacterDetail"));
const Articles = React.lazy(() => import("./pages/Articles"));
const Events = React.lazy(() => import("./pages/Events"));
const Merchandise = React.lazy(() => import("./pages/Merchandise"));
const ProjectFlow = React.lazy(() => import("./pages/ProjectFlow"));
const AnimeDetail = React.lazy(() => import("./pages/AnimeDetail"));
const AnimeNews = React.lazy(() => import("./pages/AnimeNews"));
const Airing = React.lazy(() => import("./pages/Airing"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const Sitemap = React.lazy(() => import("./pages/Sitemap"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Feedback = React.lazy(() => import("./pages/Feedback"));
const SubmitContent = React.lazy(() => import("./pages/SubmitContent"));
const NotFound = React.lazy(() => import("./pages/NotFound"));


import { PageLoader } from "./components/common/PageLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <PageLoader fullScreen message="Verifying Member Session..." />;
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader fullScreen message="Verifying Admin Clearance..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === "admin" || user.email?.toLowerCase().includes("admin");

  if (!isAdmin) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-bg-main px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-main/5/90 border border-rose-500/30 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-5 text-rose-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Access Denied</h2>
          <p className="text-xs text-muted mb-6 leading-relaxed">
            The Admin Panel is restricted exclusively to authorized administrators. Your account (<span className="text-zinc-200 font-semibold">{user.email}</span>) does not have admin clearance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/dashboard"
              className="flex-1 py-3 px-4 rounded-xl bg-main/10 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider text-center transition-all"
            >
              My Dashboard
            </a>
            <a
              href="/login"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md shadow-cyan-500/25 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Layout>
              <React.Suspense fallback={<LoadingFallback />}>
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/explore/:category" element={<Explore />} />
                    <Route path="/anime" element={<Navigate to="/explore/anime" replace />} />
                    <Route path="/gaming" element={<Navigate to="/explore/gaming" replace />} />
                    <Route path="/movies" element={<Navigate to="/explore/movies" replace />} />
                    <Route path="/tv" element={<Navigate to="/explore/tv-shows" replace />} />
                    <Route path="/tv-shows" element={<Navigate to="/explore/tv-shows" replace />} />
                    <Route path="/comics" element={<Navigate to="/explore/comics" replace />} />
                    <Route path="/manga" element={<Navigate to="/explore/manga" replace />} />
                    <Route path="/k-pop" element={<Navigate to="/explore/k-pop" replace />} />
                    <Route path="/cosplay" element={<Navigate to="/explore/cosplay" replace />} />
                    <Route path="/news" element={<Navigate to="/anime-news" replace />} />
                    <Route path="/content/:id" element={<ContentDetail />} />
                    <Route path="/anime/:id" element={<AnimeDetail />} />
                    <Route path="/anime-news" element={<AnimeNews />} />
                    <Route path="/airing" element={<Airing />} />
                    <Route path="/characters" element={<Characters />} />
                    <Route path="/characters/:id" element={<CharacterDetail />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/merchandise" element={<Merchandise />} />
                    <Route path="/flow" element={<ProjectFlow />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/submit" element={<ProtectedRoute><SubmitContent /></ProtectedRoute>} />
                    <Route path="/submit-content" element={<Navigate to="/submit" replace />} />
                    <Route path="/upload" element={<Navigate to="/submit" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </React.Suspense>
            </Layout>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const LoadingFallback = () => {
  React.useEffect(() => {
    nprogress.start();
    return () => { nprogress.done(); };
  }, []);

  return <PageLoader fullScreen message="Entering Fan Hub+ Multiverse..." />;
};

