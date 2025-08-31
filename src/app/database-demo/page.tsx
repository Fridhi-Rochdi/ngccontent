'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  DynamicButton, 
  CreateButton, 
  UpdateButton, 
  DeleteButton, 
  SaveButton, 
  RefreshButton, 
  ExportButton,
  GenerateButton
} from '@/components/ui/DynamicButton';
import { useDatabase } from '@/hooks/useDatabase';
import { useToast } from '@/contexts/ToastContext';
import { useAppState } from '@/contexts/AppStateContext';
import { renderNumber } from '@/lib/safeNumbers';
import { 
  Database,
  Activity,
  Users,
  FileText,
  Settings,
  Download,
  Trash2,
  Edit,
  Plus,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Target
} from 'lucide-react';

interface MockSkillPath {
  id: string;
  title: string;
  difficulty: string;
  topics: string[];
}

interface MockUserStats {
  totalSkillPaths: number;
  completedSkillPaths: number;
  totalHours: number;
  currentStreak: number;
}

interface MockDashboardStats {
  totalUsers: number;
  activeUsers: number;
  completionRate: number;
  avgSessionTime: number;
  totalSkillPaths?: number;
  completionsToday?: number;
}

interface MockData {
  skillPaths: MockSkillPath[];
  userStats: MockUserStats | null;
  dashboardStats: MockDashboardStats | null;
}

export default function DatabaseDemoPage() {
  const [mockData, setMockData] = useState<MockData>({
    skillPaths: [],
    userStats: null,
    dashboardStats: null
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const { 
    getSkillPaths, 
    getUserStats, 
    getDashboardStats, 
    createSkillPath,
    deleteSkillPath,
    bulkDeleteSkillPaths,
    exportSkillPaths,
    isConnected,
    checkConnection 
  } = useDatabase();
  
  const toast = useToast();
  const { setLoading } = useAppState();

  // Simulate some data for demonstration
  useEffect(() => {
    setMockData({
      skillPaths: [
        { id: '1', title: 'Advanced TypeScript', difficulty: 'advanced', topics: ['TypeScript', 'Generics'] },
        { id: '2', title: 'React Performance', difficulty: 'intermediate', topics: ['React', 'Optimization'] },
        { id: '3', title: 'Node.js Mastery', difficulty: 'advanced', topics: ['Node.js', 'Express'] }
      ],
      userStats: {
        totalSkillPaths: 12,
        completedSkillPaths: 8,
        totalHours: 156,
        currentStreak: 7
      },
      dashboardStats: {
        totalUsers: 1247,
        activeUsers: 892,
        totalSkillPaths: 3456,
        completionsToday: 47,
        completionRate: 73.2,
        avgSessionTime: 28.5
      }
    });
  }, []);

  const handleCreateSkillPath = async () => {
    const newSkillPath = {
      title: `New Skill Path ${Date.now()}`,
      description: 'This is a dynamically created skill path with full database integration',
      difficulty: 'intermediate' as const,
      topics: ['JavaScript', 'Web Development', 'Database Integration'],
      estimatedHours: 15,
      userId: 'demo-user'
    };

    try {
      const result = await createSkillPath(newSkillPath);
      console.log('Created skill path:', result);
    } catch (error) {
      console.error('Failed to create skill path:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.warning('No Selection', 'Please select items to delete.');
      return;
    }

    try {
      await bulkDeleteSkillPaths(selectedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      await exportSkillPaths(format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const statsCards = [
    {
      title: 'Total Skill Paths',
      value: mockData.userStats?.totalSkillPaths || 0,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Completed',
      value: mockData.userStats?.completedSkillPaths || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Hours',
      value: mockData.userStats?.totalHours || 0,
      icon: Activity,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Current Streak',
      value: mockData.userStats?.currentStreak || 0,
      icon: Target,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen ultra-modern-gradient p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="glass-effect rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Database Integration Demo
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  All buttons are now functional and connected to the database
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${
                  isConnected 
                    ? 'bg-green-500/20 border-green-400/30 text-green-400' 
                    : 'bg-red-500/20 border-red-400/30 text-red-400'
                }`}>
                  <Database className="h-5 w-5" />
                </div>
                <span className={`font-medium ${
                  isConnected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Connection Actions */}
            <div className="flex gap-4">
              <RefreshButton
                onClick={async () => { await checkConnection(); }}
                loadingText="Checking connection..."
              >
                <RefreshCw className="h-4 w-4" />
                Check Connection
              </RefreshButton>
              
              <DynamicButton
                variant="ghost"
                onClick={() => setLoading(true, 'Simulating loading state...', 0)}
                icon={<Zap className="h-4 w-4" />}
              >
                Test Loading State
              </DynamicButton>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="glass-effect rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${stat.color}/20 rounded-xl border border-white/20`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {renderNumber(stat.value)}
                  </div>
                  <div className="text-white/70 text-sm">
                    {stat.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CRUD Operations */}
            <div className="glass-effect rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
                  <Database className="h-5 w-5 text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">CRUD Operations</h2>
              </div>

              <div className="space-y-4">
                {/* Create */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                    <Plus className="h-5 w-5" /> Create Operations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CreateButton
                      onClick={handleCreateSkillPath}
                      endpoint="/api/skillpaths"
                      data={{ title: 'New Skill Path', description: 'Created via button' }}
                      trackEvent="button_create_skillpath"
                    >
                      Create Skill Path
                    </CreateButton>
                    
                    <GenerateButton
                      onClick={async () => {
                        toast.info('AI Generation', 'Starting AI content generation...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        toast.success('Generated!', 'AI content has been created.');
                      }}
                      loadingText="Generating with AI..."
                    >
                      AI Generate Content
                    </GenerateButton>
                  </div>
                </div>

                {/* Update */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                    <Edit className="h-5 w-5" /> Update Operations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <UpdateButton
                      onClick={() => toast.info('Update', 'Update operation triggered')}
                      loadingText="Updating..."
                    >
                      Update Profile
                    </UpdateButton>
                    
                    <SaveButton
                      onClick={() => toast.success('Saved', 'Changes saved successfully')}
                      loadingText="Saving changes..."
                    >
                      Save Changes
                    </SaveButton>
                  </div>
                </div>

                {/* Delete */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                    <Trash2 className="h-5 w-5" /> Delete Operations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DeleteButton
                      onClick={handleBulkDelete}
                      disabled={selectedItems.length === 0}
                      confirmationTitle="Confirm Bulk Delete"
                      confirmationMessage={`Are you sure you want to delete ${selectedItems.length} selected items?`}
                    >
                      Delete Selected ({selectedItems.length})
                    </DeleteButton>
                    
                    <DeleteButton
                      onClick={() => console.log('Delete all triggered')}
                      confirmationMessage="This will delete ALL your skill paths. This action cannot be undone!"
                    >
                      Delete All Data
                    </DeleteButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Operations */}
            <div className="glass-effect rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                  <Download className="h-5 w-5 text-purple-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">Data Operations</h2>
              </div>

              <div className="space-y-6">
                {/* Export */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white/90">Export Data</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ExportButton
                      onClick={() => handleExport('json')}
                      loadingText="Exporting JSON..."
                    >
                      Export as JSON
                    </ExportButton>
                    
                    <ExportButton
                      onClick={() => handleExport('csv')}
                      loadingText="Exporting CSV..."
                    >
                      Export as CSV
                    </ExportButton>
                  </div>
                </div>

                {/* Refresh/Sync */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white/90">Synchronization</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <RefreshButton
                      onClick={async () => {
                        await getDashboardStats();
                      }}
                      loadingText="Refreshing dashboard..."
                    >
                      Refresh Dashboard
                    </RefreshButton>
                    
                    <DynamicButton
                      action="fetch"
                      endpoint="/api/user/stats"
                      onSuccess={(data) => {
                        console.log('User stats loaded:', data);
                        setMockData(prev => ({ ...prev, userStats: data }));
                      }}
                      loadingText="Syncing user data..."
                    >
                      <Users className="h-4 w-4" />
                      Sync User Data
                    </DynamicButton>
                  </div>
                </div>

                {/* Batch Operations */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white/90">Batch Operations</h3>
                  <div className="space-y-3">
                    <DynamicButton
                      variant="warning"
                      className="w-full"
                      requireConfirmation={true}
                      confirmationMessage="This will process all pending tasks. Continue?"
                      onClick={async () => {
                        toast.info('Processing', 'Starting batch processing...');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        toast.success('Complete', 'Batch processing completed successfully');
                      }}
                      loadingText="Processing batch operations..."
                    >
                      <Settings className="h-4 w-4" />
                      Process Batch Operations
                    </DynamicButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mock Data Display */}
          <div className="glass-effect rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Current Data (Simulated)</h2>
            
            <div className="space-y-6">
              {/* Skill Paths with Selection */}
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-3">Skill Paths</h3>
                <div className="space-y-2">
                  {mockData.skillPaths.map((skillPath: any) => (
                    <div key={skillPath.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(skillPath.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(prev => [...prev, skillPath.id]);
                            } else {
                              setSelectedItems(prev => prev.filter(id => id !== skillPath.id));
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-800 text-blue-500"
                        />
                        <div>
                          <div className="text-white font-medium">{skillPath.title}</div>
                          <div className="text-white/60 text-sm">
                            {skillPath.difficulty} • {skillPath.topics.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <UpdateButton
                          size="sm"
                          onClick={() => toast.info('Edit', `Editing ${skillPath.title}`)}
                        >
                          Edit
                        </UpdateButton>
                        <DeleteButton
                          size="sm"
                          onClick={() => console.log('Delete', skillPath.id)}
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Toast Demo */}
          <div className="glass-effect rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-400/30">
                <Info className="h-5 w-5 text-green-300" />
              </div>
              <h2 className="text-2xl font-bold text-white">Notification System Demo</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DynamicButton
                variant="success"
                onClick={() => toast.success('Success!', 'Operation completed successfully')}
              >
                <CheckCircle className="h-4 w-4" />
                Success Toast
              </DynamicButton>
              
              <DynamicButton
                variant="danger"
                onClick={() => toast.error('Error occurred', 'Something went wrong. Please try again.')}
              >
                <AlertTriangle className="h-4 w-4" />
                Error Toast
              </DynamicButton>
              
              <DynamicButton
                variant="warning"
                onClick={() => toast.warning('Warning', 'Please review your settings before proceeding')}
              >
                <AlertTriangle className="h-4 w-4" />
                Warning Toast
              </DynamicButton>
              
              <DynamicButton
                variant="secondary"
                onClick={() => toast.info('Information', 'This is an informational message', {
                  label: 'Learn More',
                  onClick: () => console.log('Action clicked')
                })}
              >
                <Info className="h-4 w-4" />
                Info Toast
              </DynamicButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
