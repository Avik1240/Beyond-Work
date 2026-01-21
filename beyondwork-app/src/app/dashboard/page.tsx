'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/common/EmptyState';

export default function DashboardPage() {
  const { firebaseUser, userProfile, loading } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({
    myEvents: 0,
    myCommunities: 0,
    upcomingEvents: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (firebaseUser) {
      fetchUserStats();
    }
  }, [firebaseUser]);

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      const userId = firebaseUser?.uid;

      // Count events user has joined
      const eventsSnapshot = await getDocs(
        query(collection(db, 'events'), where('participants', 'array-contains', userId))
      );
      const myEvents = eventsSnapshot.size;

      // Count communities user has joined
      const communitiesSnapshot = await getDocs(
        query(collection(db, 'communities'), where('members', 'array-contains', userId))
      );
      const myCommunities = communitiesSnapshot.size;

      // Count upcoming events (for quick access)
      const upcomingSnapshot = await getDocs(
        query(
          collection(db, 'events'),
          where('status', '==', 'UPCOMING')
        )
      );
      const upcomingEvents = upcomingSnapshot.size;

      setStats({
        myEvents,
        myCommunities,
        upcomingEvents,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return (
    <DashboardLayout>
      <div>
        {/* Orientation Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Welcome back{userProfile?.name ? `, ${userProfile.name}` : ''}! Track your wellness activities and connect with your community.</p>
        </div>

        {/* Stats Cards */}
        {!loadingStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card text-center">
              <p className="text-4xl font-semibold text-accent mb-1">{stats.myEvents}</p>
              <p className="text-sm text-text-secondary">My Events</p>
            </div>
            <div className="card text-center">
              <p className="text-4xl font-semibold text-accent mb-1">{stats.myCommunities}</p>
              <p className="text-sm text-text-secondary">My Communities</p>
            </div>
            <div className="card text-center">
              <p className="text-4xl font-semibold text-accent mb-1">{stats.upcomingEvents}</p>
              <p className="text-sm text-text-secondary">Upcoming Events</p>
            </div>
          </div>
        )}

        {/* Empty State for New Users */}
        {!loadingStats && stats.myEvents === 0 && stats.myCommunities === 0 && (
          <div className="card mb-8">
            <EmptyState
              icon="calendar"
              title="Welcome to ByondWork!"
              description="You haven't joined any events or communities yet. Start by exploring activities near you or connecting with professionals who share your interests."
              actionLabel="Browse Events"
              actionHref="/events"
            />
          </div>
        )}

        {/* Profile Status */}
        <div className="card mb-8">
          <h3 className="text-lg font-medium mb-3 text-text-primary">Profile Information</h3>
          <div className="space-y-2">
            <p className="text-text-secondary text-sm"><span className="font-medium text-text-primary">Email:</span> {firebaseUser.email}</p>
            {userProfile ? (
              <>
                <p className="text-text-secondary text-sm"><span className="font-medium text-text-primary">Company:</span> {userProfile.company}</p>
                <p className="text-text-secondary text-sm"><span className="font-medium text-text-primary">City:</span> {userProfile.city}</p>
              </>
            ) : (
              <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm text-text-primary mb-2">Your profile is incomplete</p>
                <a href="/profile/setup" className="text-sm font-medium text-accent hover:text-accent/80">
                  Complete your profile →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-text-primary">Quick Actions</h3>
            <p className="text-text-secondary text-sm">Start exploring activities and connect with professionals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="/events" className="card cursor-pointer group">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1 text-text-primary group-hover:text-accent transition-colors">Browse Events</h4>
                  <p className="text-text-secondary text-sm">Find sports activities near you</p>
                </div>
              </div>
              <p className="text-accent text-sm font-medium">Explore events →</p>
            </a>
            
            <a href="/communities" className="card cursor-pointer group">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1 text-text-primary group-hover:text-accent transition-colors">Join Communities</h4>
                  <p className="text-text-secondary text-sm">Connect with like-minded professionals</p>
                </div>
              </div>
              <p className="text-accent text-sm font-medium">Explore communities →</p>
            </a>
            
            <a href="/facilities" className="card cursor-pointer group">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1 text-text-primary group-hover:text-accent transition-colors">Find Facilities</h4>
                  <p className="text-text-secondary text-sm">Discover sports venues</p>
                </div>
              </div>
              <p className="text-accent text-sm font-medium">Browse facilities →</p>
            </a>
            
            <a href="/leaderboard" className="card cursor-pointer group">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1 text-text-primary group-hover:text-accent transition-colors">View Leaderboard</h4>
                  <p className="text-text-secondary text-sm">See top performers</p>
                </div>
              </div>
              <p className="text-accent text-sm font-medium">View rankings →</p>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
