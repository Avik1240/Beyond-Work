'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Facility } from '@/types';

export default function FacilitiesPage() {
  const { firebaseUser, userProfile, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSport, setSelectedSport] = useState('');

  const cities = ['All Cities', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
  const sports = ['All Sports', 'Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Swimming'];

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    if (firebaseUser) {
      // Set default city from user profile
      if (userProfile?.city && !selectedCity) {
        setSelectedCity(userProfile.city);
      }
      fetchFacilities();
    }
  }, [firebaseUser, userProfile, selectedCity, selectedSport]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const facilitiesRef = collection(db, 'facilities');
      let q = query(facilitiesRef);

      if (selectedCity && selectedCity !== 'All Cities') {
        q = query(facilitiesRef, where('city', '==', selectedCity));
      }

      const snapshot = await getDocs(q);
      let facilitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Facility[];

      // Filter by sport client-side (since array-contains doesn't work with multiple filters)
      if (selectedSport && selectedSport !== 'All Sports') {
        facilitiesData = facilitiesData.filter(facility =>
          facility.sportsSupported?.includes(selectedSport)
        );
      }

      setFacilities(facilitiesData);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
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

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">Sports Facilities</h1>
            <p className="text-text-secondary mt-1">Discover venues for your sports activities</p>
          </div>
          <Link
            href="/dashboard"
            className="btn-secondary inline-block text-center"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field w-full"
              >
                {cities.map(city => (
                  <option key={city} value={city === 'All Cities' ? '' : city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">
                Sport
              </label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="input-field w-full"
              >
                {sports.map(sport => (
                  <option key={sport} value={sport === 'All Sports' ? '' : sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading facilities...</p>
          </div>
        ) : facilities.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No facilities found</h3>
            <p className="text-text-secondary">
              {selectedCity || selectedSport
                ? 'Try adjusting your filters'
                : 'No facilities available yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map(facility => (
              <Link
                key={facility.id}
                href={`/facilities/${facility.id}`}
                className="card hover:border-accent/40 transition cursor-pointer group"
              >
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-2 group-hover:text-accent transition-colors">{facility.name}</h3>
                  <p className="text-text-secondary text-sm mb-4">{facility.address}</p>

                  <div className="mb-4">
                    <p className="text-xs text-text-secondary mb-2">Sports Supported:</p>
                    <div className="flex flex-wrap gap-2">
                      {facility.sportsSupported?.slice(0, 3).map(sport => (
                        <span
                          key={sport}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-lg font-medium"
                        >
                          {sport}
                        </span>
                      ))}
                      {facility.sportsSupported && facility.sportsSupported.length > 3 && (
                        <span className="px-2 py-1 bg-background-card text-text-secondary text-xs rounded-lg">
                          +{facility.sportsSupported.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm text-text-secondary flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {facility.city}
                    </span>
                    <span className="text-lg font-semibold text-accent">
                      {'\u20B9'}{facility.pricePerHour}/hr
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
