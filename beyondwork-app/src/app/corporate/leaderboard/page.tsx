'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  company: string;
  score: number;
  eventsAttended: number;
}

interface Leaderboard {
  id: string;
  type: string;
  sportType: string;
  company: string;
  rankings: LeaderboardEntry[];
  lastUpdated: Date;
}

export default function CorporateLeaderboardPage() {
  const { firebaseUser, userProfile, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState('ALL');
  const [error, setError] = useState('');

  const sportTypes = ['ALL', 'Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball'];

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  useEffect(() => {
    if (firebaseUser && userProfile?.company) {
      fetchLeaderboard();
    }
  }, [firebaseUser, userProfile, activeSport]);

  const fetchLeaderboard = async () => {
    if (!userProfile?.company) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/leaderboards?type=CORPORATE&sportType=${activeSport}&company=${encodeURIComponent(userProfile.company)}`
      );
      
      const data = await response.json();
      
      if (data.success && data.leaderboards.length > 0) {
        setLeaderboard(data.leaderboards[0]);
      } else {
        setLeaderboard(null);
      }
      
      setError('');
    } catch (err: any) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/corporate"
            className="text-primary-600 hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Corporate Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Company Leaderboard</h1>
            <p className="text-gray-600 mt-1">{userProfile?.company}</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b overflow-x-auto">
            {sportTypes.map(sport => (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={`px-4 py-2 whitespace-nowrap border-b-2 transition ${
                  activeSport === sport
                    ? 'border-primary-600 text-primary-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : !leaderboard || leaderboard.rankings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p>No participation data yet</p>
              <p className="text-sm mt-2">Leaderboard will update as employees join events</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-subtle">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background-card divide-y divide-border">
                  {leaderboard.rankings.map((entry, index) => (
                    <tr key={entry.userId} className={index < 3 ? 'bg-accent/10' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                          {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                          {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                          <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{entry.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{entry.eventsAttended}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-primary-600">{entry.score}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {leaderboard && leaderboard.lastUpdated && (
            <div className="mt-4 text-xs text-gray-500 text-center">
              Last updated: {new Date(leaderboard.lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
