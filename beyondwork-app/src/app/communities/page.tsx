'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { CommunityCard } from '@/components/communities/CommunityCard';
import { Community } from '@/types';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/common/EmptyState';
import NetworkError from '@/components/common/NetworkError';
import { Select } from '@/components/ui/Select';

const CITIES = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

export default function CommunitiesPage() {
  const { firebaseUser, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    loadCommunities();
  }, [cityFilter]);

  const loadCommunities = async () => {
    setLoading(true);
    setError(false);
    try {
      const communitiesRef = collection(db, 'communities');
      let q = query(communitiesRef, orderBy('createdAt', 'desc'));

      if (cityFilter !== 'All') {
        q = query(q, where('city', '==', cityFilter));
      }

      const querySnapshot = await getDocs(q);
      const communitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Community[];

      setCommunities(communitiesData);
    } catch (err) {
      console.error('Error loading communities:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">Communities</h1>
            <p className="text-text-secondary mt-1">Connect with like-minded professionals</p>
          </div>
          <Link
            href="/communities/create"
            className="btn-primary"
          >
            Create Community
          </Link>
        </div>

        <div className="mb-6 card">
          <label className="input-label">Filter by City</label>
          <Select
            value={cityFilter}
            onChange={(value) => setCityFilter(value)}
            options={CITIES.map(city => ({ value: city, label: city }))}
            placeholder="Select city"
            searchable={true}
            className="w-full md:w-64"
          />
        </div>

        {error ? (
          <NetworkError onRetry={loadCommunities} />
        ) : loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-text-secondary text-sm">Loading communities...</p>
          </div>
        ) : communities.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={cityFilter !== 'All' ? "search" : "community"}
              title={cityFilter !== 'All' ? `No communities in ${cityFilter}` : "No communities yet"}
              description={
                cityFilter !== 'All'
                  ? "There are no communities in this city yet. Try selecting 'All' or create one to get started."
                  : "Be the first to start a community. Connect with professionals who share your interests."
              }
              actionLabel="Create Community"
              actionHref="/communities/create"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
