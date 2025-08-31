/**
 * Utility functions for safe number rendering in React components
 */

/**
 * Safely convert a value to a number, returning a fallback if invalid
 */
export function safeNumber(value: any, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  
  return fallback;
}

/**
 * Safely render a number value for React children
 */
export function renderNumber(value: any, fallback: number = 0): string {
  return safeNumber(value, fallback).toString();
}

/**
 * Safely render a number with formatting (e.g., "1,234" or "1.2K")
 */
export function formatNumber(value: any, options?: {
  decimals?: number;
  suffix?: string;
  prefix?: string;
  compact?: boolean;
}): string {
  const num = safeNumber(value, 0);
  const { decimals = 0, suffix = '', prefix = '', compact = false } = options || {};
  
  let formatted: string;
  
  if (compact && num >= 1000) {
    if (num >= 1000000) {
      formatted = (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
      formatted = (num / 1000).toFixed(decimals) + 'K';
    } else {
      formatted = num.toFixed(decimals);
    }
  } else {
    formatted = num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
  
  return `${prefix}${formatted}${suffix}`;
}

/**
 * Safely calculate percentage
 */
export function safePercentage(value: any, total: any, fallback: number = 0): number {
  const numValue = safeNumber(value, 0);
  const numTotal = safeNumber(total, 0);
  
  if (numTotal === 0) {
    return fallback;
  }
  
  return Math.round((numValue / numTotal) * 100);
}

/**
 * Safely sum an array of values
 */
export function safeSum(values: any[], accessor?: (item: any) => any): number {
  if (!Array.isArray(values)) {
    return 0;
  }
  
  return values.reduce((total, item) => {
    const value = accessor ? accessor(item) : item;
    return total + safeNumber(value, 0);
  }, 0);
}

/**
 * Safely count items in an array with optional filter
 */
export function safeCount(items: any[], predicate?: (item: any) => boolean): number {
  if (!Array.isArray(items)) {
    return 0;
  }
  
  if (predicate) {
    return items.filter(predicate).length;
  }
  
  return items.length;
}

/**
 * React hook for safe number calculations
 */
export function useSafeNumbers() {
  return {
    safeNumber,
    renderNumber,
    formatNumber,
    safePercentage,
    safeSum,
    safeCount
  };
}
