'use client';

import { useEffect, useState, use } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Facility } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function FacilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { firebaseUser, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    if (firebaseUser && resolvedParams.id) {
      fetchFacility();
    }
  }, [firebaseUser, resolvedParams.id]);

  const fetchFacility = async () => {
    try {
      setLoading(true);
      const facilityRef = doc(db, 'facilities', resolvedParams.id);
      const facilitySnap = await getDoc(facilityRef);

      if (facilitySnap.exists()) {
        setFacility({
          id: facilitySnap.id,
          ...facilitySnap.data()
        } as Facility);
      }
    } catch (error) {
      console.error('Error fetching facility:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Facility Not Found</h2>
          <Link href="/facilities" className="text-accent hover:underline">
            Back to Facilities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/facilities"
            className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Facilities
          </Link>
        </div>

        <div className="card">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-text-primary mb-2">{facility.name}</h1>
            <p className="text-text-secondary">
              <span className="inline-flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {facility.address}, {facility.city}
              </span>
            </p>
          </div>

          {/* Sports Supported */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-3">Sports Supported</h2>
            <div className="flex flex-wrap gap-2">
              {facility.sportsSupported?.map(sport => (
                <span
                  key={sport}
                  className="px-4 py-2 bg-accent/20 text-accent rounded-lg font-medium"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-text-secondary mb-1">Hourly Rate</p>
                <p className="text-3xl font-bold text-accent">₹{facility.pricePerHour}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-secondary">per hour</p>
                <p className="text-sm text-text-secondary mt-1">+ applicable taxes</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-3">Contact Information</h2>
            <div className="flex items-center gap-2 text-text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{facility.contactInfo}</span>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-text-secondary mb-4">
              To book this facility for your event, please contact the venue directly using the information above.
            </p>
            <div className="flex gap-4">
              <a
                href={`tel:${facility.contactInfo}`}
                className="flex-1 btn-primary text-center"
              >
                Call Now
              </a>
              <Link
                href="/events/create"
                className="flex-1 btn-secondary text-center"
              >
                Create Event Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
