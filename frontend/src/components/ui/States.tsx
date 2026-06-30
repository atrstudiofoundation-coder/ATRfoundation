import React from 'react';
import { AlertTriangle, RefreshCw, Inbox, Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  label = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-3 ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]}`} />
      {label && <p className="text-xs font-mono font-medium text-muted-foreground tracking-wider uppercase animate-pulse">{label}</p>}
    </div>
  );
};

export interface SkeletonCardProps {
  count?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1, className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className={`bg-card border border-border/70 rounded-card p-6 shadow-universal space-y-4 animate-pulse ${className}`}
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-secondary rounded-md w-1/4"></div>
            <div className="h-6 bg-secondary rounded-full w-16"></div>
          </div>
          <div className="h-6 bg-secondary rounded-md w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-secondary/70 rounded-md w-full"></div>
            <div className="h-3 bg-secondary/70 rounded-md w-5/6"></div>
          </div>
          <div className="pt-4 border-t border-border/50 flex justify-between items-center">
            <div className="h-4 bg-secondary rounded-md w-1/3"></div>
            <div className="h-8 bg-secondary rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Your learning journey will appear here.',
  description = 'Check back soon as we publish curriculum details and reference standards.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 px-6 bg-card border border-border/60 rounded-card shadow-universal space-y-4 max-w-lg mx-auto ${className}`}>
      <div className="h-14 w-14 rounded-[14px] bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
        <Icon className="w-7 h-7 opacity-70" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-button shadow-universal hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this section. Please try again or contact support if the issue persists.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-6 sm:p-8 bg-destructive/5 border border-destructive/20 rounded-card shadow-universal space-y-4 max-w-xl mx-auto text-center ${className}`}>
      <div className="h-12 w-12 rounded-[14px] bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-destructive font-display">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground border border-border/80 text-xs font-semibold rounded-button shadow-sm inline-flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Request
        </button>
      )}
    </div>
  );
};
