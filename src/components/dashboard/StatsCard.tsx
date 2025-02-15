import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  type: 'currency' | 'percentage' | 'number';
  isLoading?: boolean;
  error?: string | null;
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  type,
  isLoading = false,
  error = null
}: StatsCardProps) {
  const isPositive = change >= 0;
  const changeText = type === 'percentage' ? `${Math.abs(change)}%` : Math.abs(change).toFixed(2);

  if (isLoading) {
    return (
      <div className="glass p-6 rounded-xl hover-card animate-pulse">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-secondary/50 rounded"></div>
          <div className="h-8 w-32 bg-secondary/50 rounded"></div>
          <div className="h-4 w-20 bg-secondary/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-6 rounded-xl hover-card border-error/20">
        <div className="space-y-2">
          <h3 className="text-text-secondary text-sm">{title}</h3>
          <div className="flex items-center space-x-2 text-error">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Failed to load data</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs text-accent hover:text-accent-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-xl hover-card">
      <div className="space-y-2">
        <h3 className="text-text-secondary text-sm">{title}</h3>
        <p className="text-2xl font-bold gradient-text">{value}</p>
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositive ? (
              <ArrowUpIcon className="w-4 h-4" />
            ) : (
              <ArrowDownIcon className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{changeText}</span>
          </div>
          <span className="text-text-secondary text-sm">vs last period</span>
        </div>
      </div>
    </div>
  );
} 