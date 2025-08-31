'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  BookOpen, 
  TrendingUp, 
  Zap,
  Star,
  AlertTriangle,
  RefreshCw,
  Navigation,
  Sparkles
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [isAutoRedirect, setIsAutoRedirect] = useState(true);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
  }>>([]);

  // Particle animation system
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          speed: Math.random() * 0.5 + 0.1
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Auto redirect countdown
  useEffect(() => {
    if (!isAutoRedirect) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoRedirect, router]);

  const handleStopRedirect = () => {
    setIsAutoRedirect(false);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <MainLayout>
      <div className="min-h-screen ultra-modern-gradient overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating elements */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/8 to-purple-400/8 rounded-full blur-3xl animate-pulse"></div>

          {/* Animated particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                animationDelay: `${particle.id * 0.1}s`,
                animationDuration: `${2 + particle.speed}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* 404 Number Display */}
            <div className="relative mb-12">
              <div className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black leading-none">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                  404
                </span>
              </div>
              <div className="absolute inset-0 text-[12rem] md:text-[16rem] lg:text-[20rem] font-black leading-none opacity-20 blur-sm">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  404
                </span>
              </div>
            </div>

            {/* Error Message */}
            <div className="glass-effect rounded-3xl p-8 mb-8 border border-white/10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl border border-red-400/30">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Page Not Found
                </h1>
              </div>
              
              <p className="text-xl text-white/70 mb-6 max-w-2xl mx-auto leading-relaxed">
                Oops! The page you're looking for seems to have vanished into the digital void. 
                But don't worry, we'll help you find your way back to the amazing content.
              </p>

              <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-white/60 mb-8">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Error Code: 404</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Response Time: Instant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Status: Not Found</span>
                </div>
              </div>

              {/* Auto-redirect countdown */}
              {isAutoRedirect && (
                <div className="glass-effect-success border border-green-400/30 rounded-2xl p-4 mb-8">
                  <div className="flex items-center justify-center gap-3">
                    <RefreshCw className="h-5 w-5 text-green-400 animate-spin" />
                    <p className="text-green-200 font-medium">
                      Redirecting to home page in {countdown} seconds...
                    </p>
                    <button
                      onClick={handleStopRedirect}
                      className="btn-ghost-modern text-xs px-3 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <button
                onClick={handleGoHome}
                className="btn-primary-modern-large group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Go Home</span>
                </div>
              </button>

              <button
                onClick={handleGoBack}
                className="btn-secondary-modern group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Go Back</span>
                </div>
              </button>

              <button
                onClick={handleRefresh}
                className="btn-outline group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <RefreshCw className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Refresh</span>
                </div>
              </button>

              <Link href="/skillpaths" className="btn-ghost-modern group relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Navigation className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Explore</span>
                </div>
              </Link>
            </div>

            {/* Suggested Pages */}
            <div className="glass-effect rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
                  <Sparkles className="h-5 w-5 text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">Popular Destinations</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard" className="suggestion-card group">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                      <TrendingUp className="h-5 w-5 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors">
                        Dashboard
                      </h3>
                      <p className="text-sm text-white/60">Track your progress</p>
                    </div>
                  </div>
                </Link>

                <Link href="/skillpaths" className="suggestion-card group">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
                      <BookOpen className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors">
                        Skill Paths
                      </h3>
                      <p className="text-sm text-white/60">Discover learning paths</p>
                    </div>
                  </div>
                </Link>

                <Link href="/generator" className="suggestion-card group">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                      <Zap className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-green-200 transition-colors">
                        AI Generator
                      </h3>
                      <p className="text-sm text-white/60">Create with AI</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Footer message */}
            <div className="mt-12 text-center">
              <p className="text-white/50 text-sm">
                Lost? No problem! Every expert was once a beginner who refused to give up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
