'use client';

import { useState, useEffect, use } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Event } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { firebaseUser, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [justJoined, setJustJoined] = useState(false);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    if (resolvedParams.id) {
      loadEvent();
    }
  }, [resolvedParams.id]);

  const loadEvent = async () => {
    try {
      const eventRef = doc(db, 'events', resolvedParams.id);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        const eventData = {
          id: eventSnap.id,
          ...eventSnap.data(),
          dateTime: eventSnap.data().dateTime?.toDate() || new Date(),
        } as Event;
        setEvent(eventData);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!firebaseUser || !event) return;

    setJoining(true);
    setError('');

    try {
      const { doc, getDoc, updateDoc, arrayUnion } = await import('firebase/firestore');
      
      const eventRef = doc(db, 'events', resolvedParams.id);
      const eventSnap = await getDoc(eventRef);

      if (!eventSnap.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventSnap.data();

      // Check if user already joined
      if (eventData.participants?.includes(firebaseUser.uid)) {
        throw new Error('You have already joined this event');
      }

      // Check participant limit
      if (eventData.participants?.length >= eventData.maxParticipants) {
        throw new Error('Event is full');
      }

      // Add user to participants
      await updateDoc(eventRef, {
        participants: arrayUnion(firebaseUser.uid),
      });

      // Reload event to show updated participants
      await loadEvent();
      setJustJoined(true);
      // Reset success message after 5 seconds
      setTimeout(() => setJustJoined(false), 5000);
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
          <p className="text-text-secondary">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center card max-w-md">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-destructive mb-6 text-lg font-medium">{error || 'Event not found'}</p>
          <Link href="/events" className="btn-secondary inline-block">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const spotsLeft = event.maxParticipants - event.participants.length;
  const isFull = spotsLeft === 0;
  const hasJoined = event.participants.includes(firebaseUser.uid);
  const isCreator = event.createdBy === firebaseUser.uid;
  const eventDate = new Date(event.dateTime);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
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

        {/* Success Message */}
        {justJoined && (
          <div className="mb-6 card border-accent/20 bg-accent/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-accent mb-1">You're in!</h4>
                <p className="text-text-secondary text-sm">You've successfully joined this event. See you there!</p>
              </div>
            </div>
          </div>
        )}

        {/* Event Card */}
        <div className="card">
          {/* Header with Status Badge */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 pb-6 border-b border-border">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold mb-3 text-text-primary">{event.title}</h1>
              <span className="inline-block px-3 py-1.5 bg-accent/10 text-accent text-sm rounded-lg font-medium">
                {event.sportType}
              </span>
            </div>
            <div className="flex-shrink-0">
              {isFull ? (
                <span className="px-4 py-2 bg-destructive/10 text-destructive text-sm rounded-lg font-medium border border-destructive/20">
                  EVENT FULL
                </span>
              ) : hasJoined ? (
                <span className="px-4 py-2 bg-accent/10 text-accent text-sm rounded-lg font-medium border border-accent/20 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  JOINED
                </span>
              ) : (
                <span className="px-4 py-2 bg-accent/10 text-accent text-sm rounded-lg font-medium border border-accent/20">
                  {spotsLeft} {spotsLeft === 1 ? 'SPOT' : 'SPOTS'} LEFT
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary mb-1">Location</p>
                <p className="text-text-secondary">{event.location}, {event.city}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary mb-1">Date & Time</p>
                <p className="text-text-secondary">
                  {eventDate.toLocaleDateString('en-IN', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                  {' at '}
                  {eventDate.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary mb-1">Participants</p>
                <p className="text-text-secondary">{event.participants.length} / {event.maxParticipants} joined</p>
              </div>
            </div>

            {event.price > 0 && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-1">Price</p>
                  <p className="text-text-secondary">{'\u20B9'}{event.price} per person</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Section */}
          <div>
            {!isCreator && !hasJoined && !isFull && (
              <div>
                <button
                  onClick={handleJoinEvent}
                  disabled={joining}
                  className="btn-primary w-full py-3.5 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {joining ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Joining Event...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Join Event
                    </>
                  )}
                </button>
                <p className="text-text-secondary text-sm text-center mt-3">Click to confirm your participation</p>
              </div>
            )}

            {isCreator && (
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-accent font-medium mb-1">You're the organizer</p>
                    <p className="text-text-secondary text-sm">You created this event. Manage participants and details from your dashboard.</p>
                  </div>
                </div>
              </div>
            )}

            {hasJoined && !isCreator && !justJoined && (
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-accent font-medium mb-1">You're registered!</p>
                    <p className="text-text-secondary text-sm mb-3">You've confirmed your participation in this event.</p>
                    <Link href="/dashboard" className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1">
                      View your events
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {isFull && !hasJoined && !isCreator && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-destructive font-medium mb-1">Event is full</p>
                    <p className="text-text-secondary text-sm mb-3">This event has reached maximum capacity. Browse more events below.</p>
                    <Link href="/events" className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1">
                      Browse other events
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
