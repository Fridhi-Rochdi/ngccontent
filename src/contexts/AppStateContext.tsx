'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import LoadingPage from '@/app/loading';

interface AppStateContextType {
  isLoading: boolean;
  isMaintenance: boolean;
  loadingMessage: string;
  loadingProgress: number;
  setLoading: (loading: boolean, message?: string, progress?: number) => void;
  setMaintenance: (maintenance: boolean) => void;
  showLoadingFor: (duration: number, message?: string) => Promise<void>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const setLoading = (loading: boolean, message?: string, progress?: number) => {
    setIsLoading(loading);
    if (message) setLoadingMessage(message);
    if (progress !== undefined) setLoadingProgress(progress);
  };

  const setMaintenance = (maintenance: boolean) => {
    setIsMaintenance(maintenance);
  };

  const showLoadingFor = async (duration: number, message?: string): Promise<void> => {
    return new Promise((resolve) => {
      setLoading(true, message || 'Loading...', 0);
      
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setLoadingProgress(progress);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          setIsLoading(false);
          setLoadingProgress(0);
          resolve();
        }
      }, 50);
    });
  };

  // Check maintenance status from API or config
  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        // In a real app, this would check your maintenance API
        // const response = await fetch('/api/status');
        // const status = await response.json();
        // setMaintenance(status.maintenance);
        
        // For demo purposes, check localStorage or environment
        const maintenanceMode = localStorage.getItem('maintenance_mode') === 'true';
        setMaintenance(maintenanceMode);
      } catch (error) {
        console.log('Could not check maintenance status:', error);
      }
    };

    checkMaintenanceStatus();
  }, []);

  const contextValue: AppStateContextType = {
    isLoading,
    isMaintenance,
    loadingMessage,
    loadingProgress,
    setLoading,
    setMaintenance,
    showLoadingFor
  };

  // Show loading overlay when loading
  if (isLoading) {
    return (
      <LoadingPage 
        message={loadingMessage}
        progress={loadingProgress}
        showProgress={true}
        autoHide={false}
      />
    );
  }

  // Show maintenance page when in maintenance mode
  if (isMaintenance) {
    // Dynamically import the maintenance page to avoid circular dependencies
    const MaintenancePage = React.lazy(() => import('@/app/maintenance'));
    return (
      <React.Suspense fallback={<LoadingPage message="Loading maintenance page..." />}>
        <MaintenancePage />
      </React.Suspense>
    );
  }

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

// Hook for easy loading management
export function useLoading() {
  const { setLoading, showLoadingFor } = useAppState();
  
  const withLoading = async <T,>(
    asyncFunction: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      setLoading(true, message);
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return { withLoading, showLoadingFor };
}

// Hook for maintenance mode management
export function useMaintenance() {
  const { isMaintenance, setMaintenance } = useAppState();
  
  const toggleMaintenance = () => {
    const newState = !isMaintenance;
    setMaintenance(newState);
    localStorage.setItem('maintenance_mode', newState.toString());
  };

  return { isMaintenance, setMaintenance, toggleMaintenance };
}
