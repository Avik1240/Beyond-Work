'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Booking {
  id: string;
  eventId: string;
  facilityId: string;
  amount: number;
  paymentStatus: string;
  createdAt: any;
  event: any;
  facility: any;
}

export default function BookingsPage() {
  const { firebaseUser, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    if (firebaseUser) {
      fetchBookings();
    }
  }, [firebaseUser]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await firebaseUser?.getIdToken();
      
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError('Failed to load bookings');
      console.error(err);
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
            <h1 className="text-3xl font-semibold text-text-primary">My Bookings</h1>
            <p className="text-text-secondary mt-1">View your facility bookings and payment status</p>
          </div>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <p className="text-text-secondary">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="card p-12 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No bookings yet</h3>
            <p className="text-text-secondary mb-4">You haven't made any facility bookings</p>
            <Link
              href="/facilities"
              className="btn-primary inline-block"
            >
              Browse Facilities
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {booking.facility?.name || 'Unknown Facility'}
                    </h3>
                    <p className="text-text-secondary text-sm mb-1">
                      For event: {booking.event?.title || 'Unknown Event'}
                    </p>
                    <p className="text-text-secondary text-sm">
                      📍 {booking.facility?.address}, {booking.facility?.city}
                    </p>
                    <p className="text-text-secondary text-sm mt-2">
                      Booked on: {new Date(booking.createdAt?._seconds * 1000 || booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {booking.amount > 0 && (
                      <p className="text-2xl font-bold text-accent mb-2">
                        ₹{booking.amount}
                      </p>
                    )}
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      booking.paymentStatus === 'COMPLETED'
                        ? 'bg-green-900/30 text-green-400'
                        : booking.paymentStatus === 'PENDING'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                    {booking.paymentStatus === 'PENDING' && (
                      <p className="text-xs text-text-secondary mt-2">
                        Pay at venue
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex gap-2">
                  <Link
                    href={`/events/${booking.eventId}`}
                    className="btn-secondary text-sm"
                  >
                    View Event
                  </Link>
                  <Link
                    href={`/facilities/${booking.facilityId}`}
                    className="btn-secondary text-sm"
                  >
                    View Facility
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
