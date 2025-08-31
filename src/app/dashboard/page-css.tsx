'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Brain,
  Award,
  ArrowRight,
  Zap
} from 'lucide-react';

interface SkillPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [skillPaths, setSkillPaths] = useState<SkillPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // Simuler le chargement de données
      setTimeout(() => {
        setSkillPaths([
          {
            id: '1',
            title: 'Advanced React Patterns',
            description: 'Master advanced React patterns and techniques',
            progress: 75,
            difficulty: 'Advanced',
            estimatedHours: 40,
            completedLessons: 12,
            totalLessons: 16,
            lastAccessed: '2024-02-10'
          },
          {
            id: '2',
            title: 'Cloud Architecture',
            description: 'Learn cloud architecture principles',
            progress: 30,
            difficulty: 'Intermediate',
            estimatedHours: 60,
            completedLessons: 8,
            totalLessons: 20,
            lastAccessed: '2024-02-08'
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="mb-6">
            <div className="loading-spinner" style={{ width: '2rem', height: '2rem', margin: '1rem 0' }}></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      title: 'Active Skill Paths',
      value: skillPaths.length.toString(),
      icon: BookOpen,
      change: '+2 this month',
      changeType: 'positive' as const
    },
    {
      title: 'Hours Learned',
      value: '156',
      icon: Clock,
      change: '+12 this week',
      changeType: 'positive' as const
    },
    {
      title: 'Completion Rate',
      value: '78%',
      icon: Target,
      change: '+5% vs last month',
      changeType: 'positive' as const
    },
    {
      title: 'Skill Level',
      value: 'Advanced',
      icon: Award,
      change: 'Expert level: 85%',
      changeType: 'neutral' as const
    }
  ];

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-slate-400">Continue your learning journey with AI-powered skill paths</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Icon className="icon-lg text-purple-400" />
                    <div className="ml-4" style={{ flex: 1 }}>
                      <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <span className={`ml-2 text-xs ${
                          stat.changeType === 'positive' ? 'text-green-400' :
                          stat.changeType === 'neutral' ? 'text-slate-400' :
                          'text-slate-400'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skillpaths">My Skill Paths</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription>Your latest learning progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {skillPaths.map((skillPath) => (
                      <div key={skillPath.id} className="flex items-center justify-between p-4 border rounded" style={{ borderColor: 'var(--slate-700)' }}>
                        <div>
                          <div className="text-white font-medium">{skillPath.title}</div>
                          <div className="text-sm text-slate-400">
                            {skillPath.completedLessons}/{skillPath.totalLessons} lessons • {skillPath.progress}% complete
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-20 bg-slate-700 rounded-full" style={{ height: '0.5rem' }}>
                            <div 
                              className="bg-purple-600 rounded-full" 
                              style={{ 
                                height: '100%', 
                                width: `${skillPath.progress}%`,
                                transition: 'width 0.3s ease'
                              }}
                            ></div>
                          </div>
                          <Link href={`/skillpaths/${skillPath.id}`}>
                            <Button variant="outline" size="sm">
                              Continue
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription>Get started with your learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link href="/skillpaths/create">
                      <Button className="w-full btn-primary">
                        <Plus className="icon mr-2" />
                        Create New Skill Path
                      </Button>
                    </Link>
                    <Link href="/skillpaths">
                      <Button variant="outline" className="w-full">
                        <BookOpen className="icon mr-2" />
                        Browse All Paths
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full">
                        <Target className="icon mr-2" />
                        Update Goals
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skillpaths">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">My Skill Paths</CardTitle>
                    <CardDescription>Track your learning progress</CardDescription>
                  </div>
                  <Link href="/skillpaths/create">
                    <Button className="btn-primary">
                      <Plus className="icon mr-2" />
                      Create New
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {skillPaths.map((skillPath) => (
                    <Card key={skillPath.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-white font-semibold mb-2">{skillPath.title}</h3>
                            <p className="text-sm text-slate-400 mb-4">{skillPath.description}</p>
                          </div>
                          <Badge variant={skillPath.difficulty === 'Advanced' ? 'default' : 'secondary'}>
                            {skillPath.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-slate-400">
                            <Clock className="icon-sm mr-1" style={{ display: 'inline' }} />
                            {skillPath.estimatedHours}h
                          </div>
                          <div className="text-sm text-slate-400">
                            {skillPath.completedLessons}/{skillPath.totalLessons} lessons
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-white">{skillPath.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full" style={{ height: '0.5rem' }}>
                            <div 
                              className="bg-purple-600 rounded-full" 
                              style={{ 
                                height: '100%', 
                                width: `${skillPath.progress}%`,
                                transition: 'width 0.3s ease'
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t" style={{ borderTopColor: 'var(--slate-700)' }}>
                          <div className="text-xs text-slate-500">
                            Last accessed: {new Date(skillPath.lastAccessed).toLocaleDateString()}
                          </div>
                          <Link href={`/skillpaths/${skillPath.id}`}>
                            <Button variant="ghost" size="sm" className="text-purple-400">
                              Continue
                              <ArrowRight className="icon-sm ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="icon mr-2" />
                  Create AI-Powered Skill Path
                </CardTitle>
                <CardDescription>Generate personalized learning paths with artificial intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Start Options</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <Link href="/skillpaths/create">
                        <Button className="w-full btn-primary" size="lg">
                          <Zap className="icon mr-2" />
                          Generate Custom Path
                        </Button>
                      </Link>
                      <Link href="/skillpaths">
                        <Button variant="outline" className="w-full" size="lg">
                          <BookOpen className="icon mr-2" />
                          Browse Templates
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Popular Topics</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Next.js'].map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
