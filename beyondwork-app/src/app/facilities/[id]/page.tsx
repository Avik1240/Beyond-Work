'use client';

import { useEffect, useState, use } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Facility } from '@/types';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Facility Not Found</h2>
          <Link href="/facilities" className="text-primary-600 hover:underline">
            Back to Facilities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/facilities"
            className="text-primary-600 hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Facilities
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{facility.name}</h1>
            <p className="text-gray-600">
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
            <h2 className="text-xl font-semibold mb-3">Sports Supported</h2>
            <div className="flex flex-wrap gap-2">
              {facility.sportsSupported?.map(sport => (
                <span
                  key={sport}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                <p className="text-3xl font-bold text-primary-600">₹{facility.pricePerHour}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">per hour</p>
                <p className="text-sm text-gray-600 mt-1">+ applicable taxes</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{facility.contactInfo}</span>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 mb-4">
              To book this facility for your event, please contact the venue directly using the information above.
            </p>
            <div className="flex gap-4">
              <a
                href={`tel:${facility.contactInfo}`}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-center font-medium"
              >
                Call Now
              </a>
              <Link
                href="/events/create"
                className="flex-1 px-6 py-3 bg-white border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition text-center font-medium"
              >
                Create Event Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
