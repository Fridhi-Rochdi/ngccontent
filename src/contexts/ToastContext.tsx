'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X,
  Zap
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, action?: Toast['action']) => void;
  error: (title: string, message?: string, action?: Toast['action']) => void;
  warning: (title: string, message?: string, action?: Toast['action']) => void;
  info: (title: string, message?: string, action?: Toast['action']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration (default 5 seconds)
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'success', title, message, action });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'error', title, message, action });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'warning', title, message, action });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'info', title, message, action });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'glass-effect-success border-green-400/30';
      case 'error':
        return 'glass-effect border-red-400/30';
      case 'warning':
        return 'glass-effect-warning border-yellow-400/30';
      case 'info':
        return 'glass-effect-info border-blue-400/30';
      default:
        return 'glass-effect border-gray-400/30';
    }
  };

  return (
    <div 
      className={`${getStyles()} rounded-2xl p-4 transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-full`}
      style={{
        animation: 'slideInFromRight 0.3s ease-out'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white mb-1">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-sm text-white/70 leading-relaxed">
              {toast.message}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Utility hook for common toast patterns
export function useToastActions() {
  const toast = useToast();

  const showSaveSuccess = useCallback(() => {
    toast.success('Saved successfully', 'Your changes have been saved.');
  }, [toast]);

  const showSaveError = useCallback((error?: string) => {
    toast.error('Save failed', error || 'Failed to save your changes. Please try again.');
  }, [toast]);

  const showDeleteSuccess = useCallback(() => {
    toast.success('Deleted successfully', 'The item has been removed.');
  }, [toast]);

  const showDeleteError = useCallback(() => {
    toast.error('Delete failed', 'Failed to delete the item. Please try again.');
  }, [toast]);

  const showNetworkError = useCallback(() => {
    toast.error('Network error', 'Check your connection and try again.', {
      label: 'Retry',
      onClick: () => window.location.reload()
    });
  }, [toast]);

  const showMaintenanceWarning = useCallback(() => {
    toast.warning('Maintenance scheduled', 'System maintenance is scheduled for tonight at 2 AM UTC.');
  }, [toast]);

  return {
    showSaveSuccess,
    showSaveError,
    showDeleteSuccess,
    showDeleteError,
    showNetworkError,
    showMaintenanceWarning
  };
}
