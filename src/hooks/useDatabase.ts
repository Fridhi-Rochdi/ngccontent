'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { useLoading } from '@/contexts/AppStateContext';

// Type definitions for database operations
export interface SkillPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  estimatedHours: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalSkillPaths: number;
  completedSkillPaths: number;
  totalHours: number;
  currentStreak: number;
  joinDate: Date;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Custom hook for database operations
export function useDatabase() {
  const toast = useToast();
  const { withLoading } = useLoading();
  const [isConnected, setIsConnected] = useState(true); // In real app, check actual connection

  // Generic API call function
  const apiCall = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> => {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API call failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };

  // Skill Paths Operations
  const createSkillPath = useCallback(async (skillPath: Omit<SkillPath, 'id' | 'createdAt' | 'updatedAt'>) => {
    return withLoading(async () => {
      const result = await apiCall<SkillPath>('/api/skillpaths', {
        method: 'POST',
        body: JSON.stringify(skillPath),
      });

      if (result.success) {
        toast.success('Skill Path Created!', 'Your new skill path has been created successfully.');
        return result.data;
      } else {
        toast.error('Creation Failed', result.error || 'Failed to create skill path');
        throw new Error(result.error);
      }
    }, 'Creating your skill path...');
  }, [withLoading, toast, apiCall]);

  const updateSkillPath = useCallback(async (id: string, updates: Partial<SkillPath>) => {
    return withLoading(async () => {
      const result = await apiCall<SkillPath>(`/api/skillpaths/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (result.success) {
        toast.success('Updated Successfully!', 'Your skill path has been updated.');
        return result.data;
      } else {
        toast.error('Update Failed', result.error || 'Failed to update skill path');
        throw new Error(result.error);
      }
    }, 'Updating skill path...');
  }, [withLoading, toast, apiCall]);

  const deleteSkillPath = useCallback(async (id: string) => {
    return withLoading(async () => {
      const result = await apiCall(`/api/skillpaths/${id}`, {
        method: 'DELETE',
      });

      if (result.success) {
        toast.success('Deleted Successfully!', 'The skill path has been removed.');
        return true;
      } else {
        toast.error('Delete Failed', result.error || 'Failed to delete skill path');
        throw new Error(result.error);
      }
    }, 'Deleting skill path...');
  }, [withLoading, toast, apiCall]);

  const getSkillPaths = useCallback(async (userId?: string) => {
    return withLoading(async () => {
      const endpoint = userId ? `/api/skillpaths?userId=${userId}` : '/api/skillpaths';
      const result = await apiCall<SkillPath[]>(endpoint);

      if (result.success) {
        return result.data || [];
      } else {
        toast.error('Load Failed', result.error || 'Failed to load skill paths');
        throw new Error(result.error);
      }
    }, 'Loading skill paths...');
  }, [withLoading, toast, apiCall]);

  const getSkillPath = useCallback(async (id: string) => {
    return withLoading(async () => {
      const result = await apiCall<SkillPath>(`/api/skillpaths/${id}`);

      if (result.success) {
        return result.data;
      } else {
        toast.error('Load Failed', result.error || 'Failed to load skill path');
        throw new Error(result.error);
      }
    }, 'Loading skill path...');
  }, [withLoading, toast, apiCall]);

  // Generate AI Content
  const generateSkillPathContent = useCallback(async (id: string, prompt: string) => {
    return withLoading(async () => {
      const result = await apiCall(`/api/skillpaths/${id}/generate`, {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });

      if (result.success) {
        toast.success('Content Generated!', 'AI has created new content for your skill path.');
        return result.data;
      } else {
        toast.error('Generation Failed', result.error || 'Failed to generate content');
        throw new Error(result.error);
      }
    }, 'Generating AI content...');
  }, [withLoading, toast, apiCall]);

  // User Statistics
  const getUserStats = useCallback(async (userId: string) => {
    return withLoading(async () => {
      const result = await apiCall<UserStats>(`/api/user/stats?userId=${userId}`);

      if (result.success) {
        return result.data;
      } else {
        toast.error('Stats Load Failed', result.error || 'Failed to load user statistics');
        throw new Error(result.error);
      }
    }, 'Loading your statistics...');
  }, [withLoading, toast, apiCall]);

  // Dashboard Statistics
  const getDashboardStats = useCallback(async () => {
    return withLoading(async () => {
      const result = await apiCall('/api/dashboard/stats');

      if (result.success) {
        return result.data;
      } else {
        toast.error('Dashboard Load Failed', result.error || 'Failed to load dashboard data');
        throw new Error(result.error);
      }
    }, 'Loading dashboard...');
  }, [withLoading, toast, apiCall]);

  // Connection Management
  const checkConnection = useCallback(async () => {
    try {
      const result = await apiCall('/api/health');
      setIsConnected(result.success);
      return result.success;
    } catch (error) {
      setIsConnected(false);
      return false;
    }
  }, [apiCall]);

  const reconnect = useCallback(async () => {
    return withLoading(async () => {
      const connected = await checkConnection();
      if (connected) {
        toast.success('Reconnected!', 'Database connection restored.');
      } else {
        toast.error('Connection Failed', 'Unable to reconnect to database.');
      }
      return connected;
    }, 'Reconnecting...');
  }, [withLoading, toast, checkConnection]);

  // Bulk operations
  const bulkDeleteSkillPaths = useCallback(async (ids: string[]) => {
    return withLoading(async () => {
      const result = await apiCall('/api/skillpaths/bulk-delete', {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
      });

      if (result.success) {
        toast.success('Bulk Delete Complete!', `Successfully deleted ${ids.length} skill paths.`);
        return true;
      } else {
        toast.error('Bulk Delete Failed', result.error || 'Failed to delete skill paths');
        throw new Error(result.error);
      }
    }, `Deleting ${ids.length} skill paths...`);
  }, [withLoading, toast, apiCall]);

  const exportSkillPaths = useCallback(async (format: 'json' | 'csv' = 'json') => {
    return withLoading(async () => {
      const result = await apiCall(`/api/skillpaths/export?format=${format}`);

      if (result.success) {
        // Create download link
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: format === 'json' ? 'application/json' : 'text/csv'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `skillpaths-export.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Export Complete!', `Your skill paths have been exported as ${format.toUpperCase()}.`);
        return result.data;
      } else {
        toast.error('Export Failed', result.error || 'Failed to export skill paths');
        throw new Error(result.error);
      }
    }, 'Exporting skill paths...');
  }, [withLoading, toast, apiCall]);

  return {
    // Connection status
    isConnected,
    checkConnection,
    reconnect,
    
    // Skill Path operations
    createSkillPath,
    updateSkillPath,
    deleteSkillPath,
    getSkillPaths,
    getSkillPath,
    generateSkillPathContent,
    
    // Statistics
    getUserStats,
    getDashboardStats,
    
    // Bulk operations
    bulkDeleteSkillPaths,
    exportSkillPaths,
    
    // Raw API access
    apiCall,
  };
}

// Hook for form handling with database integration
export function useDatabaseForm<T extends Record<string, any>>(
  initialData: T,
  onSubmit: (data: T) => Promise<any>,
  validationRules?: Record<keyof T, (value: any) => string | null>
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    if (!validationRules) return true;
    
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field as keyof T](formData[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [formData, validationRules]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validate()) {
      toast.warning('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(formData);
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, onSubmit, toast]);

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    validate,
    reset,
  };
}
