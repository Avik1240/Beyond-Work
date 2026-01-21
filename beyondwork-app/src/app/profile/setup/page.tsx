'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { createUserProfile } from '@/lib/firebase/firestore';
import { useRouter } from 'next/navigation';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];
const SPORTS = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Volleyball', 'Yoga', 'Gym'];

export default function ProfileSetupPage() {
  const { firebaseUser, userProfile, loading } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    city: '',
    interests: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
    if (userProfile) {
      router.push('/dashboard');
    }
  }, [firebaseUser, userProfile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser) return;
    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setError('');
    setSubmitting(true);

    const { error: saveError } = await createUserProfile(firebaseUser.uid, {
      id: firebaseUser.uid,
      name: formData.name,
      email: firebaseUser.email || '',
      company: formData.company,
      city: formData.city,
      interests: formData.interests,
      role: 'USER',
    });

    if (saveError) {
      setError(saveError);
      setSubmitting(false);
    } else {
      router.push('/dashboard');
    }
  };

  const toggleInterest = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(sport)
        ? prev.interests.filter(s => s !== sport)
        : [...prev.interests, sport]
    }));
  };

  if (loading) {
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
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Orientation Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-accent text-sm font-medium">Step 1 of 1</span>
          </div>
          <h1 className="text-3xl font-semibold mb-2 text-text-primary">Welcome to ByondWork</h1>
          <p className="text-text-secondary">Let's set up your profile to get started</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-3 bg-destructive-subtle border border-destructive rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="input-label">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="input-label">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input-field"
                placeholder="e.g., TCS, Infosys, Wipro"
                required
              />
            </div>

            <div>
              <label className="input-label">City *</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select your city</option>
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">What activities are you interested in? *</label>
              <p className="text-text-secondary text-sm mb-3">Select at least one sport or activity</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SPORTS.map(sport => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleInterest(sport)}
                    className={`px-4 py-2 rounded-lg border transition-colors font-medium text-sm ${
                      formData.interests.includes(sport)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-background-subtle text-text-primary border-border hover:border-accent/50'
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 text-base"
              >
                {submitting ? 'Setting up your profile...' : 'Complete Setup & Continue'}
              </button>
              <p className="text-text-secondary text-sm text-center mt-3">
                You'll be redirected to your dashboard after setup
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
