'use client';

import { Suspense } from 'react';
import EmptyState from '@/components/common/EmptyState';
import { useRouter, useSearchParams } from 'next/navigation';

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'session-expired';

  const messages = {
    'session-expired': {
      title: 'Session expired',
      description: 'Your session has expired for security reasons. Please log in again to continue.',
    },
    'access-denied': {
      title: 'Access denied',
      description: 'You don\'t have permission to access this resource. Contact your administrator if you believe this is an error.',
    },
    'network-error': {
      title: 'Connection lost',
      description: 'We couldn\'t connect to the server. Check your internet connection and try again.',
    },
  };

  const message = messages[reason as keyof typeof messages] || messages['session-expired'];

  return (
    <div className="card max-w-lg">
      <EmptyState
        icon={reason === 'network-error' ? 'network' : reason === 'access-denied' ? 'lock' : 'warning'}
        title={message.title}
        description={message.description}
        actionLabel={reason === 'network-error' ? 'Try Again' : 'Go to Login'}
        onAction={() => {
          if (reason === 'network-error') {
            router.back();
          } else {
            router.push('/login');
          }
        }}
      />
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={
        <div className="card max-w-lg">
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      }>
        <UnauthorizedContent />
      </Suspense>
    </main>
  );
}
