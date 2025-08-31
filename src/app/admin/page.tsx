'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Settings, 
  Activity, 
  Shield,
  TrendingUp,
  UserPlus,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  lastActive: string;
}

interface SkillPath {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  generatedBy: string;
  status: 'active' | 'draft';
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [skillPaths, setSkillPaths] = useState<SkillPath[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (isLoaded && isAdmin) {
      // Mock data - replace with actual API calls
      setUsers([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'member',
          createdAt: '2024-01-15',
          lastActive: '2024-02-10'
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'admin',
          createdAt: '2024-01-10',
          lastActive: '2024-02-12'
        }
      ]);

      setSkillPaths([
        {
          id: '1',
          title: 'Advanced React Patterns',
          description: 'Master advanced React patterns and techniques',
          createdAt: '2024-02-01',
          generatedBy: 'john@example.com',
          status: 'active'
        },
        {
          id: '2',
          title: 'Cloud Architecture',
          description: 'Learn cloud architecture principles',
          createdAt: '2024-02-05',
          generatedBy: 'jane@example.com',
          status: 'draft'
        }
      ]);

      setLoading(false);
    }
  }, [isLoaded, isAdmin]);

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6">
              <div className="h-64 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Card className="bg-slate-800 border-slate-700 max-w-md">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <CardTitle className="text-white">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6">
              <div className="h-64 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Skill Paths',
      value: skillPaths.filter(sp => sp.status === 'active').length.toString(),
      icon: BookOpen,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: Activity,
      change: 'Stable',
      changeType: 'neutral' as const
    },
    {
      title: 'Admin Actions',
      value: '23',
      icon: Settings,
      change: 'Today',
      changeType: 'neutral' as const
    }
  ];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Manage users, content, and system settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Icon className="h-8 w-8 text-purple-400" />
                    <div className="ml-4 flex-1">
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

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              Users
            </TabsTrigger>
            <TabsTrigger value="skillpaths" className="data-[state=active]:bg-purple-600">
              Skill Paths
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-600">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription>View and manage user accounts</CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <div className="text-sm text-slate-400">
                          Last active: {new Date(user.lastActive).toLocaleDateString()}
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skillpaths">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Skill Path Management</CardTitle>
                <CardDescription>Monitor and moderate generated skill paths</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillPaths.map((skillPath) => (
                    <div key={skillPath.id} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{skillPath.title}</div>
                        <div className="text-sm text-slate-400 mt-1">{skillPath.description}</div>
                        <div className="text-xs text-slate-500 mt-2">
                          Generated by {skillPath.generatedBy} on {new Date(skillPath.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={skillPath.status === 'active' ? 'default' : 'secondary'}>
                          {skillPath.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">AI Generation Limits</div>
                      <div className="text-sm text-slate-400">Configure daily generation limits per user</div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Content Moderation</div>
                      <div className="text-sm text-slate-400">Set up automatic content filtering</div>
                    </div>
                    <Button variant="outline">Settings</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Backup & Recovery</div>
                      <div className="text-sm text-slate-400">Schedule automated backups</div>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">API Rate Limits</div>
                      <div className="text-sm text-slate-400">Configure API usage limits</div>
                    </div>
                    <Button variant="outline">Configure</Button>
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
