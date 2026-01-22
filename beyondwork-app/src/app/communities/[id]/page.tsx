'use client';

import { useState, useEffect, use } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Community } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { firebaseUser, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    if (resolvedParams.id) {
      loadCommunity();
    }
  }, [resolvedParams.id]);

  const loadCommunity = async () => {
    try {
      const communityRef = doc(db, 'communities', resolvedParams.id);
      const communitySnap = await getDoc(communityRef);

      if (communitySnap.exists()) {
        const communityData = {
          id: communitySnap.id,
          ...communitySnap.data(),
          createdAt: communitySnap.data().createdAt?.toDate() || new Date(),
        } as Community;
        setCommunity(communityData);
      } else {
        setError('Community not found');
      }
    } catch (err) {
      console.error('Error loading community:', err);
      setError('Failed to load community');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    if (!firebaseUser || !community) return;

    setJoining(true);
    setError('');

    try {
      const response = await fetch('/api/communities/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`,
        },
        body: JSON.stringify({ communityId: community.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join community');
      }

      // Reload community to show updated members
      await loadCommunity();
      alert('Successfully joined community!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (authLoading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!community || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center card max-w-md">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-destructive mb-6 text-lg font-medium">{error || 'Community not found'}</p>
          <Link href="/communities" className="btn-secondary inline-block">
            Back to Communities
          </Link>
        </div>
      </div>
    );
  }

  const isMember = community.members.includes(firebaseUser.uid);
  const isCreator = community.createdBy === firebaseUser.uid;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/communities"
            className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Communities
          </Link>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 pb-6 border-b border-border">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold mb-3 text-text-primary">{community.name}</h1>
              <span className="inline-block px-3 py-1.5 bg-accent/10 text-accent text-sm rounded-lg font-medium">
                {community.city}
              </span>
            </div>
            {isMember && (
              <span className="px-4 py-2 bg-accent/10 text-accent text-sm rounded-lg font-medium border border-accent/20 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                MEMBER
              </span>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {community.description && (
            <div className="mb-6">
              <h3 className="font-medium text-text-primary mb-2">About</h3>
              <p className="text-text-secondary leading-relaxed">{community.description}</p>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary mb-1">Members</p>
                <p className="text-text-secondary">{community.members.length} {community.members.length === 1 ? 'member' : 'members'}</p>
              </div>
            </div>
          </div>

          {!isCreator && !isMember && (
            <div>
              <button
                onClick={handleJoinCommunity}
                disabled={joining}
                className="btn-primary w-full py-3.5 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {joining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Joining Community...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Join Community
                  </>
                )}
              </button>
              <p className="text-text-secondary text-sm text-center mt-3">Click to become a member</p>
            </div>
          )}

          {isCreator && (
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-accent font-medium mb-1">You're the creator</p>
                  <p className="text-text-secondary text-sm">You created this community. Manage members and settings from your dashboard.</p>
                </div>
              </div>
            </div>
          )}

          {isMember && !isCreator && (
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-accent font-medium mb-1">You're a member!</p>
                  <p className="text-text-secondary text-sm">You're part of this community.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
