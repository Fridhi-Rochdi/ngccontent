'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Wrench,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield,
  RefreshCw,
  Calendar,
  Mail,
  ExternalLink
} from 'lucide-react';

export default function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
  }>>([]);

  // Maintenance schedule (example data)
  const maintenanceEnd = new Date('2025-08-27T18:00:00');
  const timeRemaining = maintenanceEnd.getTime() - currentTime.getTime();
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));
  const minutesRemaining = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Particle animation system
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.2,
          speed: Math.random() * 0.4 + 0.1
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleNotifyMe = () => {
    // In a real app, this would open an email subscription form
    window.open('mailto:notifications@yourapp.com?subject=Notify me when maintenance is complete&body=Please send me an email when the maintenance is complete.', '_blank');
  };

  const maintenanceTasks = [
    { id: 1, name: 'Database optimization', status: 'completed', duration: '45 min' },
    { id: 2, name: 'Server security updates', status: 'in-progress', duration: '30 min' },
    { id: 3, name: 'Performance improvements', status: 'pending', duration: '60 min' },
    { id: 4, name: 'API upgrades', status: 'pending', duration: '40 min' },
    { id: 5, name: 'Final testing', status: 'pending', duration: '20 min' }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen ultra-modern-gradient overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating elements with orange/yellow tint for maintenance */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-400/8 to-yellow-400/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-400/6 to-orange-400/6 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-gradient-to-br from-orange-400/4 to-amber-400/4 rounded-full blur-3xl animate-pulse"></div>

          {/* Animated particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                animationDelay: `${particle.id * 0.2}s`,
                animationDuration: `${4 + particle.speed}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Maintenance Icon */}
            <div className="relative mb-8">
              <div className="p-8 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl border border-orange-400/30 inline-block">
                <Wrench className="h-24 w-24 text-orange-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            {/* Main Message */}
            <div className="glass-effect rounded-3xl p-8 mb-8 border border-white/10">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent mb-4">
                Scheduled Maintenance
              </h1>
              
              <p className="text-xl text-white/70 mb-6 max-w-2xl mx-auto leading-relaxed">
                We're currently performing scheduled maintenance to improve your experience. 
                We'll be back online soon with enhanced performance and new features.
              </p>

              {/* Countdown Timer */}
              <div className="flex justify-center items-center gap-6 mb-8">
                <div className="glass-effect-success border border-green-400/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-green-400" />
                    <div className="text-left">
                      <div className="text-2xl font-bold text-white">
                        {hoursRemaining}h {minutesRemaining}m
                      </div>
                      <div className="text-sm text-green-200">Estimated completion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="glass-effect rounded-3xl p-8 mb-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
                  <Zap className="h-5 w-5 text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">Maintenance Progress</h2>
              </div>

              <div className="space-y-4">
                {maintenanceTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      task.status === 'completed' 
                        ? 'bg-green-500/10 border-green-400/30' 
                        : task.status === 'in-progress'
                        ? 'bg-orange-500/10 border-orange-400/30'
                        : 'bg-gray-500/10 border-gray-400/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      {task.status === 'in-progress' && (
                        <RefreshCw className="h-5 w-5 text-orange-400 animate-spin" />
                      )}
                      {task.status === 'pending' && (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        task.status === 'completed' 
                          ? 'text-green-200' 
                          : task.status === 'in-progress'
                          ? 'text-orange-200'
                          : 'text-gray-300'
                      }`}>
                        {task.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <span>{task.duration}</span>
                      {task.status === 'completed' && (
                        <span className="text-green-400 font-medium">✓ Complete</span>
                      )}
                      {task.status === 'in-progress' && (
                        <span className="text-orange-400 font-medium">In Progress...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white/80">Overall Progress</span>
                  <span className="text-sm text-white/60">20% Complete</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-300" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <button
                onClick={handleRefresh}
                className="btn-primary-modern group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                  <span className="font-semibold">Check Status</span>
                </div>
              </button>

              <button
                onClick={handleNotifyMe}
                className="btn-secondary-modern group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Notify Me</span>
                </div>
              </button>

              <a
                href="https://status.yourapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Status Page</span>
                </div>
              </a>
            </div>

            {/* Additional Information */}
            <div className="glass-effect rounded-3xl p-6 border border-white/10">
              <div className="grid gap-6 md:grid-cols-2 text-left">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    Scheduled Details
                  </h3>
                  <div className="space-y-2 text-sm text-white/70">
                    <p><span className="font-medium">Started:</span> 14:00 UTC</p>
                    <p><span className="font-medium">Expected End:</span> 18:00 UTC</p>
                    <p><span className="font-medium">Duration:</span> ~4 hours</p>
                    <p><span className="font-medium">Type:</span> Planned maintenance</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    What's Being Improved
                  </h3>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Enhanced security measures</li>
                    <li>• Faster page load times</li>
                    <li>• New AI-powered features</li>
                    <li>• Bug fixes and optimizations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer message */}
            <div className="mt-8 text-center">
              <p className="text-white/50 text-sm">
                Thank you for your patience. We're making things better for you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
