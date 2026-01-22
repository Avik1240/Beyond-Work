'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CreateEventForm } from '@/components/events/CreateEventForm';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CreateEventPage() {
  const { firebaseUser, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, loading, router]);

  if (loading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/events"
            className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </Link>
        </div>

        <div className="card">
          <h1 className="text-3xl font-semibold mb-2 text-text-primary">Create New Event</h1>
          <p className="text-text-secondary mb-6">Organize a sports or wellness activity</p>
          
          <CreateEventForm />
        </div>
      </div>
    </DashboardLayout>
  );
}
