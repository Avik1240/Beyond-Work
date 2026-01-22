'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AccessDenied from '@/components/common/AccessDenied';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CorporateAdminDashboard() {
  const { firebaseUser, userProfile, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalEmployees: 0,
    activeParticipants: 0,
  });

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
    if (!authLoading && firebaseUser && userProfile) {
      // Check if user has CORPORATE_ADMIN role
      const isCorporateAdmin = userProfile.role === 'CORPORATE_ADMIN';
      setIsAuthorized(isCorporateAdmin);
    }
  }, [firebaseUser, authLoading, userProfile, router]);

  if (authLoading || !firebaseUser || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authorized
  if (!isAuthorized) {
    return <AccessDenied resource="corporate admin dashboard" requiredRole="Corporate Admin" />;
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary">Corporate Admin Dashboard</h1>
          <p className="text-text-secondary mt-1">{userProfile?.company}</p>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Events</p>
                <p className="text-3xl font-semibold text-text-primary mt-2">{stats.totalEvents}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Upcoming Events</p>
                <p className="text-3xl font-semibold text-text-primary mt-2">{stats.upcomingEvents}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Employees</p>
                <p className="text-3xl font-semibold text-text-primary mt-2">{stats.totalEmployees}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Active Participants</p>
                <p className="text-3xl font-semibold text-text-primary mt-2">{stats.activeParticipants}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/corporate/events/create"
            className="card hover:border-accent/40 transition cursor-pointer border border-accent/20"
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Create Internal Event</h3>
                <p className="text-sm text-text-secondary">Organize company wellness activities</p>
              </div>
            </div>
          </Link>

          <Link
            href="/corporate/employees"
            className="card hover:border-accent/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Manage Employees</h3>
                <p className="text-sm text-text-secondary">View and invite team members</p>
              </div>
            </div>
          </Link>

          <Link
            href="/corporate/leaderboard"
            className="card hover:border-accent/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Company Leaderboard</h3>
                <p className="text-sm text-text-secondary">View top performers</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Events Section */}
        <div className="card">
          <h2 className="text-xl font-medium text-text-primary mb-4">Recent Internal Events</h2>
          <div className="text-center py-12 text-text-secondary">
            <p>No internal events yet</p>
            <Link
              href="/corporate/events/create"
              className="text-primary-600 hover:underline mt-2 inline-block"
            >
              Create your first event →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
