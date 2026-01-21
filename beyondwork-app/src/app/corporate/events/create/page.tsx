'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CreateCorporateEventForm } from '@/components/corporate/CreateCorporateEventForm';
import Link from 'next/link';

export default function CreateCorporateEventPage() {
  const { firebaseUser, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, loading, router]);

  if (loading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/corporate"
            className="text-primary-600 hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Corporate Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-2">Create Internal Event</h1>
          <p className="text-gray-600 mb-6">Organize wellness activities for your team</p>
          
          <CreateCorporateEventForm />
        </div>
      </div>
    </main>
  );
}
