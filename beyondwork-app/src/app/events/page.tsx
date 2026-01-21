'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { Event } from '@/types';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/common/EmptyState';
import NetworkError from '@/components/common/NetworkError';

export default function EventsPage() {
  const { firebaseUser, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', sportType: '' });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    setLoading(true);
    setError(false);
    try {
      const eventsRef = collection(db, 'events');
      
      // Build query based on filters
      let q = query(
        eventsRef,
        where('status', '==', 'UPCOMING'),
        orderBy('dateTime', 'asc')
      );

      const querySnapshot = await getDocs(q);
      let eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate() || new Date(),
      })) as Event[];

      // Apply client-side filtering for city and sportType
      if (filters.city) {
        eventsData = eventsData.filter(event => event.city === filters.city);
      }
      if (filters.sportType) {
        eventsData = eventsData.filter(event => event.sportType === filters.sportType);
      }

      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading events:', err);
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
            <h1 className="text-3xl font-semibold text-text-primary">Discover Events</h1>
            <p className="text-text-secondary mt-1">Find and join sports & wellness activities</p>
          </div>
          <Link
            href="/events/create"
            className="btn-primary"
          >
            Create Event
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <EventFilters onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            {error ? (
              <NetworkError onRetry={loadEvents} />
            ) : loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-text-secondary text-sm">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={filters.city || filters.sportType ? "search" : "calendar"}
                  title={filters.city || filters.sportType ? "No matching events" : "No events yet"}
                  description={
                    filters.city || filters.sportType
                      ? "Try adjusting your filters to see more events, or be the first to organize an activity."
                      : "No one has created an event yet. Be the first to organize a sports activity in your area."
                  }
                  actionLabel="Create Event"
                  actionHref="/events/create"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
