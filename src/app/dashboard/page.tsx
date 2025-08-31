'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Plus, 
  Settings,
  Users,
  ChartBar,
  Code,
  Zap,
  Target,
  Clock,
  Star
} from 'lucide-react';
import Link from 'next/link';

// Composants Card avec styles professionnels
function Card({ children, className = '', style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>;
}

function CardDescription({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-sm text-slate-400 ${className}`}>{children}</p>;
}

function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

interface SkillPath {
  id: string;
  name: string;
  createdAt: string;
  lessonsCount: number;
  progress: number;
  status: 'draft' | 'published';
}

export default function DashboardPage() {
  const { user } = useUser();
  const [skillPaths, setSkillPaths] = useState<SkillPath[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sommaire, setSommaire] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSkillPaths();
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const stats = await response.json();
        setDashboardStats(stats);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadSkillPaths = async () => {
    try {
      const response = await fetch('/api/skillpaths');
      if (response.ok) {
        const data = await response.json();
        setSkillPaths(data);
      }
    } catch (error) {
      console.error('Error loading skill paths:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSkillPath = async () => {
    if (!sommaire.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/skillpaths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Skill Path - ${new Date().toLocaleDateString()}`,
          sommaire: sommaire.trim(),
        }),
      });

      if (response.ok) {
        const newSkillPath = await response.json();
        setSommaire('');
        loadSkillPaths();
        // Rediriger vers le nouveau skill path
        window.location.href = `/skillpaths/${newSkillPath.id}`;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const stats = dashboardStats ? {
    totalSkillPaths: dashboardStats.overview.totalSkillPaths,
    completedLessons: dashboardStats.overview.completedLessons,
    totalLessons: dashboardStats.overview.totalLessons,
    avgProgress: dashboardStats.overview.completionRate,
    publishedPaths: dashboardStats.overview.publishedSkillPaths,
    draftPaths: dashboardStats.overview.draftSkillPaths
  } : {
    totalSkillPaths: skillPaths.length,
    completedLessons: skillPaths.reduce((acc, sp) => acc + Math.floor(sp.progress * sp.lessonsCount / 100), 0),
    totalLessons: skillPaths.reduce((acc, sp) => acc + sp.lessonsCount, 0),
    avgProgress: skillPaths.length > 0 ? Math.round(skillPaths.reduce((acc, sp) => acc + sp.progress, 0) / skillPaths.length) : 0,
    publishedPaths: skillPaths.filter(sp => sp.status === 'published').length,
    draftPaths: skillPaths.filter(sp => sp.status === 'draft').length
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Header avec animation */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1 className="dashboard-title gradient-text animate-fadeIn">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="dashboard-subtitle">
              Continue your learning journey and track your progress
            </p>
          </div>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "user-avatar",
              }
            }}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="dashboard-tabs">
          <TabsList className="tabs-list">
            <TabsTrigger value="overview" className="tab-trigger">Overview</TabsTrigger>
            <TabsTrigger value="skillpaths" className="tab-trigger">Skill Paths</TabsTrigger>
            <TabsTrigger value="create" className="tab-trigger">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="tab-content">
            {/* Stats Cards avec animations */}
            <div className="stats-grid">
              <Card className="stat-card animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                <div className="stat-header">
                  <span className="stat-label">Total Skill Paths</span>
                  <BookOpen className="stat-icon text-primary" />
                </div>
                <div className="stat-body">
                  <div className="stat-value">{stats.totalSkillPaths}</div>
                  <p className="stat-description">Active learning paths</p>
                </div>
              </Card>

              <Card className="stat-card animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                <div className="stat-header">
                  <span className="stat-label">Lessons Completed</span>
                  <Trophy className="stat-icon text-warning" />
                </div>
                <div className="stat-body">
                  <div className="stat-value">{stats.completedLessons}</div>
                  <p className="stat-description">out of {stats.totalLessons} total</p>
                </div>
              </Card>

              <Card className="stat-card animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                <div className="stat-header">
                  <span className="stat-label">Completion Rate</span>
                  <TrendingUp className="stat-icon text-success" />
                </div>
                <div className="stat-body">
                  <div className="stat-value">{stats.avgProgress}%</div>
                  <p className="stat-description">overall progress</p>
                </div>
              </Card>

              <Card className="stat-card animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                <div className="stat-header">
                  <span className="stat-label">Published Paths</span>
                  <Star className="stat-icon text-warning" />
                </div>
                <div className="stat-body">
                  <div className="stat-value">{stats.publishedPaths}</div>
                  <p className="stat-description">{stats.draftPaths} drafts remaining</p>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="quick-actions-card animate-slideInUp" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Jump into your learning activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="quick-actions-grid">
                  <Button 
                    className="btn-primary-modern"
                    onClick={() => setActiveTab('create')}
                  >
                    <Plus className="btn-icon" />
                    Create New Path
                  </Button>
                  
                  <Button 
                    className="btn-secondary-modern"
                    onClick={() => setActiveTab('skillpaths')}
                  >
                    <BookOpen className="btn-icon" />
                    View All Paths
                  </Button>
                  
                  <Button 
                    className="btn-secondary-modern"
                  >
                    <ChartBar className="btn-icon" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="activity-card">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {skillPaths.slice(0, 3).map((skillPath) => (
                  <div key={skillPath.id} className="activity-item">
                    <div className="activity-icon">
                      <BookOpen />
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-title">{skillPath.name}</h4>
                      <p className="activity-description">
                        {skillPath.progress}% complete • {skillPath.lessonsCount} lessons
                      </p>
                    </div>
                    <Link href={`/skillpaths/${skillPath.id}`}>
                      <Button size="sm" variant="outline" className="quick-action-secondary">
                        Continue
                      </Button>
                    </Link>
                  </div>
                ))}
                {skillPaths.length === 0 && (
                  <p className="activity-description text-center py-8">
                    No skill paths yet. Create your first one to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skillpaths" className="tab-content">
            <Card className="quick-actions-card">
              <CardHeader>
                <CardTitle className="text-white">Your Skill Paths</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage and track your learning paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : skillPaths.length === 0 ? (
                  <div className="empty-state">
                    <BookOpen className="empty-state-icon" />
                    <p className="empty-state-text">No skill paths created yet</p>
                    <Button onClick={() => setActiveTab('create')} className="quick-action-primary">
                      <Plus className="quick-action-icon" />
                      Create Your First Path
                    </Button>
                  </div>
                ) : (
                  <div className="skillpath-grid">
                    {skillPaths.map((skillPath) => (
                      <div key={skillPath.id} className="skillpath-item">
                        <div className="skillpath-header">
                          <div className="skillpath-content">
                            <h3 className="skillpath-title">{skillPath.name}</h3>
                            <div className="skillpath-meta">
                              <span className="skillpath-meta-item">
                                <Clock />
                                Created {new Date(skillPath.createdAt).toLocaleDateString()}
                              </span>
                              <span className="skillpath-meta-item">
                                <BookOpen />
                                {skillPath.lessonsCount} lessons
                              </span>
                              <span className={`skillpath-status ${
                                skillPath.status === 'published' 
                                  ? 'skillpath-status-published' 
                                  : 'skillpath-status-draft'
                              }`}>
                                {skillPath.status}
                              </span>
                            </div>
                          </div>
                          <Link href={`/skillpaths/${skillPath.id}`}>
                            <Button variant="outline" className="quick-action-secondary">
                              View Details
                            </Button>
                          </Link>
                        </div>
                        
                        {skillPath.progress > 0 && (
                          <div className="progress-section">
                            <div className="progress-header">
                              <span className="progress-label">Progress</span>
                              <span className="progress-value">{skillPath.progress}%</span>
                            </div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${skillPath.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="tab-content">
            <Card className="quick-actions-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-400" />
                  Create New Skill Path
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Describe your learning objectives and let AI generate a comprehensive skill path
                </CardDescription>
              </CardHeader>
              <CardContent className="tab-content">
                <div className="form-group">
                  <label className="form-label">
                    Learning Objectives & Course Outline
                  </label>
                  <Textarea
                    placeholder="Describe what you want to learn... (e.g., Advanced React patterns, System Design, Machine Learning fundamentals, etc.)"
                    value={sommaire}
                    onChange={(e) => setSommaire(e.target.value)}
                    rows={8}
                    className="form-textarea"
                  />
                </div>
                
                <div className="form-actions">
                  <Button 
                    onClick={handleCreateSkillPath}
                    disabled={!sommaire.trim() || isCreating}
                    className="create-button"
                    size="lg"
                  >
                    {isCreating ? (
                      <>
                        <div className="spinner create-button-icon"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Brain className="create-button-icon" />
                        Create & Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="pro-tips">
                  <h4 className="pro-tips-title">💡 Pro Tips:</h4>
                  <ul className="pro-tips-list">
                    <li>• Be specific about your current skill level and goals</li>
                    <li>• Include preferred technologies or frameworks</li>
                    <li>• Mention any time constraints or learning preferences</li>
                    <li>• Our AI will create a structured path with lessons, quizzes, and projects</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
