'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Settings } from 'lucide-react';

// Composants Card simples
function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>;
}

function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`pb-2 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <h3 className={`font-semibold ${className}`}>{children}</h3>;
}

function CardDescription({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-sm ${className}`}>{children}</p>;
}

function Badge({ children, className = '', variant = 'default' }: { children: React.ReactNode, className?: string, variant?: string }) {
  const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClass = variant === 'secondary' ? 'bg-slate-700 text-slate-300' : 'bg-purple-600 text-white';
  return <span className={`${baseClass} ${variantClass} ${className}`}>{children}</span>;
}

interface UserStats {
  skillPathsCompleted: number;
  skillPathsTotal: number;
  currentlyLearning: number;
  hoursStudied: number;
  lessonsCompleted: number;
  totalLessons: number;
  progressPercentage: number;
  recentActivity: Array<{
    id: string;
    name: string;
    createdAt: string;
    status: string;
  }>;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadUserStats();
    }
  }, [isLoaded, user]);

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!isLoaded || isLoadingStats) {
    return (
      <MainLayout>
        <div className="skillpaths-container">
          <div className="loading-state">
            <div className="loading-title"></div>
            <div className="skillpaths-grid">
              <div className="loading-card"></div>
              <div className="loading-card"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const userRole = user?.publicMetadata?.role as string || 'member';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  return (
    <MainLayout>
      <div className="profile-container">
        {/* Header avec animation */}
        <div className="profile-header">
          <h1 className="profile-title gradient-text">Profile</h1>
          <p className="profile-subtitle">Manage your account settings and preferences</p>
        </div>

        <div className="profile-grid">
          {/* Profile Information avec animation */}
          <Card className="card-modern animate-slideInUp">
            <CardHeader>
              <CardTitle className="card-title">
                <User className="card-icon" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal information and account details</CardDescription>
            </CardHeader>
            <CardContent className="profile-info-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <User className="avatar-icon" />
                </div>
                <div className="profile-details">
                  <h3 className="profile-name">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <div className="profile-role">
                    <Badge className={`role-badge ${userRole === 'admin' ? 'role-admin' : 'role-member'}`}>
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="profile-meta">
                <div className="profile-meta-item">
                  <Mail className="meta-icon" />
                  <span className="meta-text">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
                <div className="profile-meta-item">
                  <Calendar className="meta-icon" />
                  <span className="meta-text">Member since {memberSince}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings avec animation */}
          <Card className="card-modern animate-slideInUp" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="card-title">
                <Settings className="card-icon" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="settings-content">
              <div className="settings-buttons">
                <Button className="settings-button hover-scale">
                  Update Profile Information
                </Button>
                <Button className="settings-button hover-scale">
                  Change Password
                </Button>
                <Button className="settings-button hover-scale">
                  Email Preferences
                </Button>
                <Button className="settings-button hover-scale">
                  Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Learning Progress avec animation */}
          <Card className="card-modern progress-card animate-slideInUp" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle className="card-title">Learning Progress</CardTitle>
              <CardDescription>Your skill development journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="progress-stats">
                <div className="progress-stat animate-countUp">
                  <div className="stat-number stat-primary">
                    {userStats?.skillPathsCompleted || 0}
                  </div>
                  <div className="stat-label">Skill Paths Completed</div>
                </div>
                <div className="progress-stat animate-countUp" style={{animationDelay: '0.2s'}}>
                  <div className="stat-number stat-info">
                    {userStats?.currentlyLearning || 0}
                  </div>
                  <div className="stat-label">Currently Learning</div>
                </div>
                <div className="progress-stat animate-countUp" style={{animationDelay: '0.4s'}}>
                  <div className="stat-number stat-success">
                    {userStats?.hoursStudied || 0}
                  </div>
                  <div className="stat-label">Hours Studied</div>
                </div>
              </div>
              
              {/* Nouvelle section pour les statistiques avancées */}
              {userStats && userStats.totalLessons > 0 && (
                <div className="progress-details">
                  <div className="progress-bar-container">
                    <div className="progress-bar-label">
                      <span>Overall Progress</span>
                      <span>{userStats.progressPercentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill"
                        style={{width: `${userStats.progressPercentage}%`}}
                      />
                    </div>
                  </div>
                  <div className="lesson-stats">
                    <span className="lesson-stat">
                      {userStats.lessonsCompleted} / {userStats.totalLessons} lessons completed
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
