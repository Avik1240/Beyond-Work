'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
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
  rankings: LeaderboardEntry[];
  lastUpdated: Date;
}

export default function GlobalLeaderboardPage() {
  const { firebaseUser, loading: authLoading } = useAuthStore();
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
    if (firebaseUser) {
      fetchLeaderboard();
    }
  }, [firebaseUser, activeSport]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/leaderboards?type=GLOBAL&sportType=${activeSport}`
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
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="card">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-text-primary">Global Leaderboard</h1>
            <p className="text-text-secondary mt-1">Top performers across all companies</p>
          </div>

          {/* Sport Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
            {sportTypes.map(sport => (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={`px-4 py-2 whitespace-nowrap border-b-2 transition ${
                  activeSport === sport
                    ? 'border-accent text-accent font-medium'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : !leaderboard || leaderboard.rankings.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-text-primary font-medium mb-2">No participation data yet</p>
              <p className="text-sm">Leaderboard will update as users complete events</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-card border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leaderboard.rankings.map((entry, index) => (
                    <tr key={entry.userId} className={index < 3 ? 'bg-accent/5' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                          {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                          {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                          <span className="text-sm font-medium text-text-primary">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-text-primary">{entry.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-secondary">{entry.company || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">{entry.eventsAttended}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-accent">{entry.score}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {leaderboard && leaderboard.lastUpdated && (
            <div className="mt-4 text-xs text-text-secondary text-center">
              Last updated: {new Date(leaderboard.lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
