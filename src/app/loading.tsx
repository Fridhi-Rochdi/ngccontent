'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Loader,
  Sparkles,
  Zap,
  Brain,
  Cpu,
  Database,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

interface LoadingPageProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  autoHide?: boolean;
  onComplete?: () => void;
}

export default function LoadingPage({
  message = "Loading your experience...",
  progress = 0,
  showProgress = true,
  autoHide = false,
  onComplete
}: LoadingPageProps = {}) {
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [currentStep, setCurrentStep] = useState(0);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    color: string;
  }>>([]);

  const loadingSteps = [
    { id: 1, name: 'Initializing AI Engine', icon: Brain, duration: 800, color: 'from-purple-400 to-blue-400' },
    { id: 2, name: 'Loading User Data', icon: Database, duration: 600, color: 'from-blue-400 to-cyan-400' },
    { id: 3, name: 'Preparing Interface', icon: Cpu, duration: 700, color: 'from-cyan-400 to-green-400' },
    { id: 4, name: 'Optimizing Experience', icon: Zap, duration: 500, color: 'from-green-400 to-yellow-400' },
    { id: 5, name: 'Final Touches', icon: Sparkles, duration: 400, color: 'from-yellow-400 to-orange-400' }
  ];

  // Auto-progress simulation
  useEffect(() => {
    if (showProgress && currentProgress < 100) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          const next = Math.min(prev + Math.random() * 3 + 0.5, 100);
          if (next >= 100 && autoHide && onComplete) {
            setTimeout(() => onComplete(), 1000);
          }
          return next;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentProgress, showProgress, autoHide, onComplete]);

  // Step progression
  useEffect(() => {
    const stepIndex = Math.floor((currentProgress / 100) * loadingSteps.length);
    setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1));
  }, [currentProgress, loadingSteps.length]);

  // Particle animation system
  useEffect(() => {
    const generateParticles = () => {
      const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.4 + 0.2,
          speed: Math.random() * 0.8 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen ultra-modern-gradient overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating elements */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/8 to-blue-400/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/6 to-cyan-400/6 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-gradient-to-br from-cyan-400/4 to-purple-400/4 rounded-full blur-3xl animate-pulse"></div>

          {/* Animated particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                animationDelay: `${particle.id * 0.1}s`,
                animationDuration: `${2 + particle.speed}s`
              }}
            ></div>
          ))}

          {/* Rotating rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 border-2 border-gradient-to-r from-purple-400/20 to-transparent rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
            <div className="absolute w-80 h-80 border-2 border-gradient-to-r from-blue-400/20 to-transparent rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            <div className="absolute w-64 h-64 border-2 border-gradient-to-r from-cyan-400/20 to-transparent rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Main Loading Icon */}
            <div className="relative mb-8">
              <div className="p-8 glass-effect rounded-3xl border border-white/10 inline-block">
                <div className="relative">
                  <Loader className="h-16 w-16 text-white animate-spin mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Message */}
            <div className="glass-effect rounded-3xl p-8 mb-8 border border-white/10">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
                {message}
              </h1>
              
              <p className="text-lg text-white/70 mb-6 max-w-xl mx-auto leading-relaxed">
                Please wait while we prepare your personalized experience. This won't take long!
              </p>

              {/* Progress Bar */}
              {showProgress && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-white/80">Progress</span>
                    <span className="text-sm text-white/60">{Math.round(currentProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out loading-progress-glow"
                      style={{width: `${currentProgress}%`}}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Loading Steps */}
            <div className="glass-effect rounded-3xl p-6 mb-8 border border-white/10">
              <div className="space-y-4">
                {loadingSteps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isComplete = index < currentStep;
                  const IconComponent = step.icon;

                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${
                        isActive 
                          ? `bg-gradient-to-r ${step.color}/10 border-white/20 scale-105` 
                          : isComplete
                          ? 'bg-green-500/10 border-green-400/30'
                          : 'bg-gray-500/5 border-gray-400/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border transition-all ${
                          isActive 
                            ? `bg-gradient-to-r ${step.color}/20 border-white/30` 
                            : isComplete
                            ? 'bg-green-500/20 border-green-400/40'
                            : 'bg-gray-500/10 border-gray-400/20'
                        }`}>
                          {isComplete ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <IconComponent className={`h-5 w-5 ${
                              isActive ? 'text-white animate-pulse' : 'text-gray-400'
                            }`} />
                          )}
                        </div>
                        <span className={`font-medium transition-colors ${
                          isActive 
                            ? 'text-white' 
                            : isComplete
                            ? 'text-green-200'
                            : 'text-gray-400'
                        }`}>
                          {step.name}
                        </span>
                      </div>

                      {/* Step Indicator */}
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          </div>
                        )}
                        {isComplete && (
                          <span className="text-green-400 font-medium text-sm">✓</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Loading Tips */}
            <div className="glass-effect rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">Did you know?</h3>
              </div>
              
              <p className="text-white/70 text-left">
                Our AI is analyzing your learning patterns to create a personalized skill path that 
                adapts to your pace and preferences. This ensures you get the most effective learning 
                experience tailored just for you.
              </p>
            </div>

            {/* Loading animation indicator */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
