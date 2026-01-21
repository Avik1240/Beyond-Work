import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'content' | 'full';
  className?: string;
}

/**
 * PageLayout - Simple wrapper for authenticated pages
 * Provides consistent padding and max-width constraint
 */
export function PageLayout({ 
  children, 
  maxWidth = 'content',
  className = '' 
}: PageLayoutProps) {
  const widthClass = maxWidth === 'content' ? 'max-w-content' : 'max-w-full';
  
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className={`${widthClass} mx-auto px-6 py-8`}>
        {children}
      </div>
    </div>
  );
}
