'use client';

import EmptyState from '@/components/common/EmptyState';
import Link from 'next/link';

interface AccessDeniedProps {
  resource?: string;
  requiredRole?: string;
}

export default function AccessDenied({ 
  resource = 'this resource',
  requiredRole
}: AccessDeniedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="card max-w-lg">
        <EmptyState
          icon="lock"
          title="Access denied"
          description={
            requiredRole 
              ? `You need ${requiredRole} permissions to access ${resource}. Contact your administrator if you need access.`
              : `You don't have permission to access ${resource}. Contact your administrator if you believe this is an error.`
          }
          actionLabel="Go to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
