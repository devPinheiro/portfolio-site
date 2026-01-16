import React from 'react';
import { cn } from '../../lib/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  variant?: 'default' | 'dots' | 'pulse' | 'orbit';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        );

      case 'pulse':
        return (
          <div className={cn("bg-blue-500 rounded-full animate-pulse", sizeClasses[size])}></div>
        );

      case 'orbit':
        return (
          <div className={cn("relative", sizeClasses[size])}>
            <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-1 border-2 border-transparent border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
          </div>
        );

      default:
        return (
          <div className={cn(
            "border-2 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin",
            sizeClasses[size]
          )}></div>
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {renderSpinner()}
      {text && (
        <p className="text-gray-400 text-sm mt-3 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Full-screen loading component
export const FullScreenLoader: React.FC<{ text?: string }> = ({ 
  text = "Loading AI Portfolio..." 
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-6">
          <LoadingSpinner variant="orbit" size="xl" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">🤖 AI Assistant</h2>
        <p className="text-gray-300 animate-pulse">{text}</p>
        
        {/* Progress indicators */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader: React.FC<{ 
  lines?: number;
  className?: string;
}> = ({ 
  lines = 3, 
  className 
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-white/10 rounded animate-pulse",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        ></div>
      ))}
    </div>
  );
};