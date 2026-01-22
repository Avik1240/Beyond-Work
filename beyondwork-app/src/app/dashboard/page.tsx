'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/common/EmptyState';
import { EventCard } from '@/components/events/EventCard';
import { CommunityCard } from '@/components/communities/CommunityCard';
import Link from 'next/link';
import type { Event, Community } from '@/types';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DashboardPage() {
  const { firebaseUser, userProfile, loading } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({
    myEvents: 0,
    myCommunities: 0,
    upcomingEvents: 0,
  });
  const [myUpcomingEvents, setMyUpcomingEvents] = useState<Event[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [allMyEvents, setAllMyEvents] = useState<Event[]>([]);
  const [sportTypeData, setSportTypeData] = useState<any[]>([]);
  const [monthlyActivityData, setMonthlyActivityData] = useState<any[]>([]);
  const [activityStreak, setActivityStreak] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (firebaseUser) {
      fetchUserStats();
      fetchMyUpcomingEvents();
      fetchRecommendedEvents();
      fetchMyCommunities();
      fetchAnalyticsData();
    }
  }, [firebaseUser]);

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      const userId = firebaseUser?.uid;

      // Count events user has joined
      const eventsSnapshot = await getDocs(
        query(collection(db, 'events'), where('participants', 'array-contains', userId))
      );
      const myEvents = eventsSnapshot.size;

      // Count communities user has joined
      const communitiesSnapshot = await getDocs(
        query(collection(db, 'communities'), where('members', 'array-contains', userId))
      );
      const myCommunities = communitiesSnapshot.size;

      // Count upcoming events (for quick access)
      const upcomingSnapshot = await getDocs(
        query(
          collection(db, 'events'),
          where('status', '==', 'UPCOMING')
        )
      );
      const upcomingEvents = upcomingSnapshot.size;

      setStats({
        myEvents,
        myCommunities,
        upcomingEvents,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchMyUpcomingEvents = async () => {
    try {
      setLoadingEvents(true);
      const userId = firebaseUser?.uid;
      
      // Fetch events user has joined, filter and sort client-side to avoid composite index
      const eventsSnapshot = await getDocs(
        query(
          collection(db, 'events'), 
          where('participants', 'array-contains', userId)
        )
      );

      const events = eventsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateTime: doc.data().dateTime?.toDate() || new Date(),
        }) as any)
        .filter((event: any) => event.status === 'UPCOMING')
        .sort((a: any, b: any) => a.dateTime.getTime() - b.dateTime.getTime())
        .slice(0, 3) as Event[];

      setMyUpcomingEvents(events);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchRecommendedEvents = async () => {
    try {
      // Get events in user's city or all events, filter client-side
      let eventsQuery;
      
      if (userProfile?.city) {
        eventsQuery = query(
          collection(db, 'events'),
          where('city', '==', userProfile.city),
          where('status', '==', 'UPCOMING')
        );
      } else {
        eventsQuery = query(
          collection(db, 'events'),
          where('status', '==', 'UPCOMING')
        );
      }

      const snapshot = await getDocs(eventsQuery);
      const events = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateTime: doc.data().dateTime?.toDate() || new Date(),
        }) as any)
        .filter((event: any) => !event.participants?.includes(firebaseUser?.uid || ''))
        .sort((a: any, b: any) => a.dateTime.getTime() - b.dateTime.getTime())
        .slice(0, 3) as Event[];

      setRecommendedEvents(events);
    } catch (error) {
      console.error('Error fetching recommended events:', error);
    }
  };

  const fetchMyCommunities = async () => {
    try {
      setLoadingCommunities(true);
      const userId = firebaseUser?.uid;
      
      const communitiesSnapshot = await getDocs(
        query(
          collection(db, 'communities'),
          where('members', 'array-contains', userId),
          limit(3)
        )
      );

      const communities = communitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Community[];

      setMyCommunities(communities);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoadingCommunities(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const userId = firebaseUser?.uid;
      
      // Fetch all user's events for analytics
      const eventsSnapshot = await getDocs(
        query(collection(db, 'events'), where('participants', 'array-contains', userId))
      );

      const events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate() || new Date(),
      })) as Event[];

      setAllMyEvents(events);

      // Calculate sport type distribution
      const sportCounts: { [key: string]: number } = {};
      events.forEach(event => {
        const sport = event.sportType || 'Other';
        sportCounts[sport] = (sportCounts[sport] || 0) + 1;
      });

      const sportData = Object.entries(sportCounts).map(([name, value]) => ({
        name,
        value,
      }));
      setSportTypeData(sportData);

      // Calculate monthly activity for last 6 months
      const now = new Date();
      const monthlyData: { [key: string]: number } = {};
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthlyData[monthKey] = 0;
      }

      events.forEach(event => {
        const eventDate = new Date(event.dateTime);
        const monthKey = eventDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey]++;
        }
      });

      const monthlyChartData = Object.entries(monthlyData).map(([month, count]) => ({
        month,
        events: count,
      }));
      setMonthlyActivityData(monthlyChartData);

      // Calculate activity streak (simplified - days with events in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentEvents = events.filter(event => 
        new Date(event.dateTime) >= thirtyDaysAgo
      );
      setActivityStreak(recentEvents.length);

      // Fetch user rank from leaderboard (if available)
      try {
        const leaderboardResponse = await fetch(`/api/leaderboards?type=GLOBAL&sportType=ALL`);
        const leaderboardData = await leaderboardResponse.json();
        
        if (leaderboardData.success && leaderboardData.leaderboards.length > 0) {
          const rankings = leaderboardData.leaderboards[0].rankings;
          const userIndex = rankings.findIndex((entry: any) => entry.userId === userId);
          if (userIndex !== -1) {
            setUserRank(userIndex + 1);
          }
        }
      } catch (error) {
        console.error('Error fetching rank:', error);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 text-text-primary">
            Welcome back{userProfile?.name ? `, ${userProfile.name}` : ''}!
          </h1>
          <p className="text-text-secondary">Here's what's happening with your wellness journey</p>
        </div>

        {/* Stats Cards */}
        {!loadingStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">My Events</p>
                  <p className="text-3xl font-semibold text-accent">{stats.myEvents}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">My Communities</p>
                  <p className="text-3xl font-semibold text-accent">{stats.myCommunities}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Available Events</p>
                  <p className="text-3xl font-semibold text-accent">{stats.upcomingEvents}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Incomplete Warning */}
        {!userProfile && (
          <div className="card mb-8 border-accent/20 bg-accent/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-accent mb-1">Complete Your Profile</h4>
                <p className="text-text-secondary text-sm mb-3">Set up your profile to get personalized event recommendations and connect with professionals in your area.</p>
                <Link href="/profile/setup" className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1">
                  Complete profile now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section - Only show if user has activity */}
        {/* Temporarily hidden - Analytics charts */}
        {false && !loadingStats && stats.myEvents > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Your Activity Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Sport Type Distribution */}
              {sportTypeData.length > 0 && (
                <div className="card bg-gradient-to-br from-background-card to-background-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text-primary">Sport Preferences</h3>
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative" style={{ minHeight: '300px' }}>
                    <Chart
                      options={{
                        chart: {
                          type: 'donut',
                          background: 'transparent',
                          fontFamily: 'inherit',
                        },
                        labels: sportTypeData.map(d => d.name),
                        colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#EF4444', '#F97316'],
                        theme: {
                          mode: 'dark',
                        },
                        legend: {
                          position: 'bottom',
                          horizontalAlign: 'center',
                          labels: {
                            colors: '#9CA3AF',
                            useSeriesColors: false
                          },
                          fontSize: '13px',
                          itemMargin: {
                            horizontal: 8,
                            vertical: 5
                          },
                        },
                        dataLabels: {
                          enabled: true,
                          style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            colors: ['#fff']
                          },
                          dropShadow: {
                            enabled: false
                          }
                        },
                        plotOptions: {
                          pie: {
                            donut: {
                              size: '70%',
                              labels: {
                                show: true,
                                name: {
                                  show: true,
                                  fontSize: '14px',
                                  color: '#9CA3AF',
                                  offsetY: -10
                                },
                                value: {
                                  show: true,
                                  fontSize: '24px',
                                  fontWeight: 600,
                                  color: '#10B981',
                                  offsetY: 0,
                                  formatter: (val: any) => val
                                },
                                total: {
                                  show: true,
                                  label: 'Total Events',
                                  fontSize: '13px',
                                  color: '#9CA3AF',
                                  formatter: () => {
                                    const total = sportTypeData.reduce((acc, curr) => acc + curr.value, 0);
                                    return `${total}`;
                                  }
                                }
                              }
                            }
                          }
                        },
                        stroke: {
                          width: 0
                        },
                        tooltip: {
                          theme: 'dark',
                          style: {
                            fontSize: '12px',
                          },
                          y: {
                            formatter: (val: any) => `${val} events`
                          }
                        }
                      }}
                      series={sportTypeData.map(d => d.value)}
                      type="donut"
                      height={320}
                    />
                  </div>
                  <p className="text-text-secondary text-xs text-center mt-4 pt-4 border-t border-border">
                    Your activity breakdown by sport type
                  </p>
                </div>
              )}

              {/* Monthly Activity Trend */}
              {monthlyActivityData.length > 0 && (
                <div className="card bg-gradient-to-br from-background-card to-background-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text-primary">Activity Trend</h3>
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <Chart
                    options={{
                      chart: {
                        type: 'bar',
                        background: 'transparent',
                        toolbar: {
                          show: false,
                        },
                        fontFamily: 'inherit',
                        zoom: {
                          enabled: false
                        }
                      },
                      theme: {
                        mode: 'dark',
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 10,
                          columnWidth: '65%',
                          distributed: false,
                          dataLabels: {
                            position: 'top',
                          },
                        }
                      },
                      dataLabels: {
                        enabled: true,
                        formatter: (val: any) => val > 0 ? val : '',
                        offsetY: -20,
                        style: {
                          fontSize: '11px',
                          colors: ['#9CA3AF'],
                          fontWeight: 600
                        }
                      },
                      xaxis: {
                        categories: monthlyActivityData.map(d => d.month),
                        labels: {
                          style: {
                            colors: '#9CA3AF',
                            fontSize: '12px'
                          }
                        },
                        axisBorder: {
                          show: false
                        },
                        axisTicks: {
                          show: false
                        }
                      },
                      yaxis: {
                        labels: {
                          style: {
                            colors: '#9CA3AF',
                            fontSize: '12px'
                          },
                          formatter: (val: any) => Math.floor(val).toString()
                        }
                      },
                      colors: ['#10B981'],
                      fill: {
                        type: 'gradient',
                        gradient: {
                          shade: 'dark',
                          type: 'vertical',
                          shadeIntensity: 0.5,
                          gradientToColors: ['#059669'],
                          inverseColors: false,
                          opacityFrom: 1,
                          opacityTo: 0.8,
                          stops: [0, 100]
                        }
                      },
                      grid: {
                        borderColor: '#374151',
                        strokeDashArray: 3,
                        padding: {
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 10
                        }
                      },
                      tooltip: {
                        theme: 'dark',
                        style: {
                          fontSize: '12px',
                        },
                        y: {
                          formatter: (val: any) => `${val} events`
                        }
                      }
                    }}
                    series={[{
                      name: 'Events',
                      data: monthlyActivityData.map(d => d.events)
                    }]}
                    type="bar"
                    height={320}
                  />
                  <p className="text-text-secondary text-xs text-center mt-4 pt-4 border-t border-border">
                    Events joined in the last 6 months
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Activity Streak */}
              <div className="card border-l-4 border-accent bg-gradient-to-br from-accent/10 via-background-card to-background-card hover:from-accent/15 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                    <div className="text-3xl">🔥</div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-accent mb-1">{activityStreak}</p>
                    <p className="text-sm text-text-secondary">Events in last 30 days</p>
                  </div>
                </div>
              </div>

              {/* User Rank */}
              {userRank && (
                <div className="card border-l-4 border-yellow-500 bg-gradient-to-br from-yellow-500/10 via-background-card to-background-card hover:from-yellow-500/15 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                      <div className="text-3xl">🏆</div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-yellow-500 mb-1">#{userRank}</p>
                      <p className="text-sm text-text-secondary">Global Rank</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Hours (calculated estimate) */}
              <div className="card border-l-4 border-blue-500 bg-gradient-to-br from-blue-500/10 via-background-card to-background-card hover:from-blue-500/15 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <div className="text-3xl">⏱️</div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-500 mb-1">{allMyEvents.length * 2}h</p>
                    <p className="text-sm text-text-secondary">Estimated Active Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Upcoming Events */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">My Upcoming Events</h2>
              <p className="text-text-secondary text-sm">Events you've registered for</p>
            </div>
            {myUpcomingEvents.length > 0 && (
              <Link href="/events" className="text-accent text-sm font-medium hover:underline">
                View all
              </Link>
            )}
          </div>
          
          {loadingEvents ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-text-secondary text-sm">Loading your events...</p>
            </div>
          ) : myUpcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myUpcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="card">
              <EmptyState
                icon="calendar"
                title="No upcoming events"
                description="You haven't joined any events yet. Browse available events and start participating!"
                actionLabel="Browse Events"
                actionHref="/events"
              />
            </div>
          )}
        </div>

        {/* Recommended Events */}
        {recommendedEvents.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Recommended For You</h2>
                <p className="text-text-secondary text-sm">
                  {userProfile?.city ? `Events near ${userProfile.city}` : 'Popular events you might like'}
                </p>
              </div>
              <Link href="/events" className="text-accent text-sm font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* My Communities */}
        {myCommunities.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">My Communities</h2>
                <p className="text-text-secondary text-sm">Communities you're part of</p>
              </div>
              <Link href="/communities" className="text-accent text-sm font-medium hover:underline">
                View all
              </Link>
            </div>
            
            {loadingCommunities ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-text-secondary text-sm">Loading communities...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCommunities.map(community => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Get Started Section for New Users */}
        {!loadingStats && !loadingEvents && stats.myEvents === 0 && stats.myCommunities === 0 && (
          <div className="card border-accent/20">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Get Started with ByondWork</h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Start your wellness journey by joining events, connecting with communities, and discovering sports facilities near you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/events" className="btn-primary">
                  Browse Events
                </Link>
                <Link href="/communities" className="btn-secondary">
                  Explore Communities
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
