'use client';

import React, { ReactNode, useState } from 'react';
import { 
  Loader, 
  Check, 
  X, 
  AlertTriangle,
  Database,
  Zap,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  Save,
  Eye,
  Settings
} from 'lucide-react';
import { useDatabase } from '@/hooks/useDatabase';
import { useToast } from '@/contexts/ToastContext';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'success' 
  | 'warning' 
  | 'ghost'
  | 'outline';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type DatabaseAction = 
  | 'create'
  | 'update' 
  | 'delete'
  | 'fetch'
  | 'generate'
  | 'export'
  | 'import'
  | 'refresh'
  | 'save'
  | 'custom';

interface DynamicButtonProps {
  // Basic props
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  
  // Database action props
  action?: DatabaseAction;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  
  // Callbacks
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  onClick?: () => void | Promise<void>;
  
  // Confirmation
  requireConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
  
  // UI customization
  icon?: ReactNode;
  loadingText?: string;
  successText?: string;
  
  // Analytics
  trackEvent?: string;
}

export function DynamicButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading: externalLoading = false,
  className = '',
  action,
  endpoint,
  method = 'POST',
  data,
  onSuccess,
  onError,
  onClick,
  requireConfirmation = false,
  confirmationTitle,
  confirmationMessage,
  icon,
  loadingText,
  successText,
  trackEvent
}: DynamicButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { apiCall } = useDatabase();
  const toast = useToast();

  const isLoading = externalLoading || internalLoading;

  // Get default icon based on action
  const getDefaultIcon = () => {
    if (icon) return icon;
    
    switch (action) {
      case 'create': return <Plus className="h-4 w-4" />;
      case 'update': return <Edit className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      case 'fetch': return <Eye className="h-4 w-4" />;
      case 'generate': return <Zap className="h-4 w-4" />;
      case 'export': return <Download className="h-4 w-4" />;
      case 'import': return <Upload className="h-4 w-4" />;
      case 'refresh': return <RefreshCw className="h-4 w-4" />;
      case 'save': return <Save className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  // Get button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2 font-medium 
      rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 
      focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 
      disabled:cursor-not-allowed overflow-hidden group
    `;

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg'
    };

    const variantStyles = {
      primary: `
        bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 
        text-white shadow-lg hover:shadow-xl focus:ring-purple-500
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-400 before:to-blue-400 
        before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20
      `,
      secondary: `
        bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 
        text-white shadow-lg hover:shadow-xl focus:ring-gray-500
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 
        text-white shadow-lg hover:shadow-xl focus:ring-red-500
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-400 before:to-pink-400 
        before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20
      `,
      success: `
        bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 
        text-white shadow-lg hover:shadow-xl focus:ring-green-500
      `,
      warning: `
        bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 
        text-white shadow-lg hover:shadow-xl focus:ring-yellow-500
      `,
      ghost: `
        text-gray-300 hover:text-white hover:bg-white/10 focus:ring-gray-500
      `,
      outline: `
        border border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-500 
        focus:ring-gray-500
      `
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  };

  // Handle confirmation dialog
  const showConfirmation = (callback: () => void) => {
    if (window.confirm(confirmationMessage || 'Are you sure you want to continue?')) {
      callback();
    }
  };

  // Handle database action
  const handleDatabaseAction = async () => {
    if (!endpoint && !onClick) return;

    setInternalLoading(true);

    try {
      let result;

      if (endpoint) {
        result = await apiCall(endpoint, {
          method,
          ...(data && { body: JSON.stringify(data) })
        });

        if (!result.success) {
          throw new Error(result.error || 'Operation failed');
        }
      }

      if (onClick) {
        result = await onClick();
      }

      // Show success state briefly
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      if (onSuccess) {
        onSuccess(result);
      }

      // Track analytics event
      if (trackEvent && typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', trackEvent, {
          action_type: action,
          endpoint: endpoint
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      if (onError) {
        onError(errorMessage);
      } else {
        toast.error('Operation Failed', errorMessage);
      }
    } finally {
      setInternalLoading(false);
    }
  };

  const handleClick = () => {
    if (disabled || isLoading) return;

    const executeAction = () => {
      if (action && (endpoint || onClick)) {
        handleDatabaseAction();
      } else if (onClick) {
        onClick();
      }
    };

    if (requireConfirmation) {
      showConfirmation(executeAction);
    } else {
      executeAction();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={getButtonStyles()}
      type="button"
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {/* Icon */}
        <div className="flex-shrink-0">
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : showSuccess ? (
            <Check className="h-4 w-4" />
          ) : (
            getDefaultIcon()
          )}
        </div>

        {/* Text */}
        <span className="whitespace-nowrap">
          {isLoading && loadingText ? (
            loadingText
          ) : showSuccess && successText ? (
            successText
          ) : (
            children || 'Button'
          )}
        </span>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
}

// Pre-configured button variants for common actions
export const CreateButton = (props: Omit<DynamicButtonProps, 'action' | 'variant'>) => (
  <DynamicButton {...props} action="create" variant="primary" />
);

export const UpdateButton = (props: Omit<DynamicButtonProps, 'action' | 'variant'>) => (
  <DynamicButton {...props} action="update" variant="secondary" />
);

export const DeleteButton = (props: Omit<DynamicButtonProps, 'action' | 'variant'>) => (
  <DynamicButton 
    {...props} 
    action="delete" 
    variant="danger" 
    requireConfirmation={true}
    confirmationMessage="Are you sure you want to delete this item? This action cannot be undone."
  />
);

export const SaveButton = (props: Omit<DynamicButtonProps, 'action' | 'variant'>) => (
  <DynamicButton {...props} action="save" variant="success" />
);

export const RefreshButton = (props: Omit<DynamicButtonProps, 'action' | 'variant'>) => (
  <DynamicButton {...props} action="refresh" variant="ghost" />
);

export const ExportButton = (props: Omit<DynamicButtonProps, 'action' | 'variant'>) => (
  <DynamicButton {...props} action="export" variant="outline" />
);

export const GenerateButton = (props: Omit<DynamicButtonProps, 'action' | 'variant'>) => (
  <DynamicButton {...props} action="generate" variant="primary" />
);
