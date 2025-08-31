'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Home, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle,
  Server,
  Wrench,
  MessageCircle,
  Shield,
  Zap,
  Clock
} from 'lucide-react';

export default function ServerError() {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
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
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.2,
          speed: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Simulate retry delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRetrying(false);
    window.location.reload();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleReportIssue = () => {
    // In a real app, this would open a support ticket or feedback form
    window.open('mailto:support@yourapp.com?subject=Server Error Report&body=I encountered a 500 error on the website.', '_blank');
  };

  return (
    <MainLayout>
      <div className="min-h-screen ultra-modern-gradient overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating elements with red tint for error */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-red-400/8 to-orange-400/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-400/6 to-pink-400/6 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-red-400/4 to-orange-400/4 rounded-full blur-3xl animate-pulse"></div>

          {/* Animated particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                animationDelay: `${particle.id * 0.15}s`,
                animationDuration: `${3 + particle.speed}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* 500 Number Display */}
            <div className="relative mb-12">
              <div className="text-[10rem] md:text-[14rem] lg:text-[18rem] font-black leading-none">
                <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                  500
                </span>
              </div>
              <div className="absolute inset-0 text-[10rem] md:text-[14rem] lg:text-[18rem] font-black leading-none opacity-20 blur-sm">
                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  500
                </span>
              </div>
            </div>

            {/* Error Message */}
            <div className="glass-effect rounded-3xl p-8 mb-8 border border-white/10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl border border-red-400/30">
                  <Server className="h-8 w-8 text-red-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent">
                  Server Error
                </h1>
              </div>
              
              <p className="text-xl text-white/70 mb-6 max-w-2xl mx-auto leading-relaxed">
                Something went wrong on our end. Our servers are experiencing some technical difficulties, 
                but our team is already working on fixing this issue.
              </p>

              <div className="flex flex-wrap gap-4 justify-center items-center text-sm text-white/60 mb-8">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span>Error Code: 500</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span>Detected: Just now</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-yellow-400" />
                  <span>Status: Under Investigation</span>
                </div>
              </div>

              {/* Retry Information */}
              {retryCount > 0 && (
                <div className="glass-effect-error border border-red-400/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="text-red-200 font-medium">
                      Retry attempts: {retryCount}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="btn-primary-modern-large group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <RefreshCw className={`h-5 w-5 group-hover:scale-110 transition-transform ${isRetrying ? 'animate-spin' : ''}`} />
                  <span className="font-semibold">
                    {isRetrying ? 'Retrying...' : 'Try Again'}
                  </span>
                </div>
              </button>

              <button
                onClick={handleGoHome}
                className="btn-secondary-modern group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Go Home</span>
                </div>
              </button>

              <button
                onClick={handleGoBack}
                className="btn-outline group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Go Back</span>
                </div>
              </button>

              <button
                onClick={handleReportIssue}
                className="btn-ghost-modern group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Report Issue</span>
                </div>
              </button>
            </div>

            {/* Technical Information */}
            <div className="glass-effect rounded-3xl p-8 border border-white/10 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
                  <Wrench className="h-5 w-5 text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">What Happened?</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 text-left">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Possible Causes
                  </h3>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      High server load or traffic spike
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      Database connection issues
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                      Temporary service maintenance
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    What We're Doing
                  </h3>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      Monitoring system health
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      Investigating root cause
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      Working on immediate fix
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Status Updates */}
            <div className="glass-effect rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Want status updates?
              </h3>
              <p className="text-white/60 text-sm text-center mb-4">
                Follow our status page or contact support for real-time updates on this issue.
              </p>
              <div className="flex gap-3 justify-center">
                <Link 
                  href="https://status.yourapp.com" 
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                >
                  Status Page
                </Link>
                <span className="text-white/40">•</span>
                <Link 
                  href="mailto:support@yourapp.com"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Footer message */}
            <div className="mt-12 text-center">
              <p className="text-white/50 text-sm">
                We apologize for the inconvenience. Our team is working hard to resolve this quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
