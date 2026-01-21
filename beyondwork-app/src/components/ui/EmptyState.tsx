import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

/**
 * EmptyState - Reusable component for empty states
 * Shows when lists have no items or filters return no results
 */
export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  actionHref,
  icon 
}: EmptyStateProps) {
  return (
    <div className="card text-center py-12">
      {icon && (
        <div className="mb-4 flex justify-center text-text-tertiary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="text-accent hover:text-accent/80 font-medium text-sm"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

/**
 * LoadingState - Reusable loading skeleton
 */
export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  );
}
