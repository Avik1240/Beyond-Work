import { NextResponse } from 'next/server';
import { adminDb, verifyAuthToken } from '@/lib/firebase/admin';

/**
 * GET /api/leaderboards
 * Query params: type (GLOBAL | CORPORATE), sportType (optional), company (optional for CORPORATE type)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'GLOBAL';
    const sportType = searchParams.get('sportType');
    const company = searchParams.get('company');

    // Build query
    let query = adminDb.collection('leaderboards').where('type', '==', type);

    if (sportType && sportType !== 'ALL') {
      query = query.where('sportType', '==', sportType);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      // Return empty leaderboard if none exists yet
      return NextResponse.json({
        success: true,
        leaderboards: [],
      });
    }

    const leaderboards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{ id: string; rankings?: any[]; [key: string]: any }>;

    // Filter by company for CORPORATE type
    let filteredLeaderboards = leaderboards;
    if (type === 'CORPORATE' && company) {
      filteredLeaderboards = leaderboards.filter(lb => {
        // Check if any ranking entry matches the company
        const rankings = lb.rankings || [];
        return rankings.some((r: any) => r.company === company);
      });
    }

    return NextResponse.json({
      success: true,
      leaderboards: filteredLeaderboards,
    });
  } catch (error: any) {
    console.error('Error fetching leaderboards:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leaderboards/calculate
 * Manually trigger leaderboard calculation (admin only)
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const decodedToken = await verifyAuthToken(authHeader);

    // For now, allow any authenticated user to trigger (in production, restrict to admin)
    await calculateLeaderboards();

    return NextResponse.json({
      success: true,
      message: 'Leaderboards calculated successfully',
    });
  } catch (error: any) {
    console.error('Error calculating leaderboards:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate leaderboards based on event participation
 */
async function calculateLeaderboards() {
  // Get all completed events
  const eventsSnapshot = await adminDb
    .collection('events')
    .where('status', '==', 'COMPLETED')
    .get();

  const userScores: Record<string, {
    userId: string;
    userName: string;
    company: string;
    eventsAttended: number;
    sportTypes: Record<string, number>;
  }> = {};

  // Calculate scores
  for (const eventDoc of eventsSnapshot.docs) {
    const event = eventDoc.data();
    const participants = event.participants || [];
    const sportType = event.sportType;
    const company = event.company;

    for (const participantId of participants) {
      if (!userScores[participantId]) {
        // Fetch user details
        const userDoc = await adminDb.collection('users').doc(participantId).get();
        const userData = userDoc.data();

        userScores[participantId] = {
          userId: participantId,
          userName: userData?.name || 'Unknown',
          company: userData?.company || company || '',
          eventsAttended: 0,
          sportTypes: {},
        };
      }

      userScores[participantId].eventsAttended += 1;
      userScores[participantId].sportTypes[sportType] = 
        (userScores[participantId].sportTypes[sportType] || 0) + 1;
    }
  }

  // Create global leaderboard (overall)
  const globalRankings = Object.values(userScores)
    .map(user => ({
      userId: user.userId,
      userName: user.userName,
      company: user.company,
      score: user.eventsAttended * 10, // 10 points per event
      eventsAttended: user.eventsAttended,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 100); // Top 100

  // Save global leaderboard
  await adminDb.collection('leaderboards').doc('global-overall').set({
    type: 'GLOBAL',
    sportType: 'ALL',
    rankings: globalRankings,
    lastUpdated: new Date(),
  });

  // Create sport-specific global leaderboards
  const sportTypes = new Set<string>();
  eventsSnapshot.docs.forEach(doc => {
    const sportType = doc.data().sportType;
    if (sportType) sportTypes.add(sportType);
  });

  for (const sportType of sportTypes) {
    const sportRankings = Object.values(userScores)
      .filter(user => user.sportTypes[sportType] > 0)
      .map(user => ({
        userId: user.userId,
        userName: user.userName,
        company: user.company,
        score: user.sportTypes[sportType] * 10,
        eventsAttended: user.sportTypes[sportType],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    await adminDb.collection('leaderboards').doc(`global-${sportType.toLowerCase()}`).set({
      type: 'GLOBAL',
      sportType,
      rankings: sportRankings,
      lastUpdated: new Date(),
    });
  }

  // Create corporate leaderboards (by company)
  const companies = new Set<string>();
  Object.values(userScores).forEach(user => {
    if (user.company) companies.add(user.company);
  });

  for (const company of companies) {
    const companyRankings = Object.values(userScores)
      .filter(user => user.company === company)
      .map(user => ({
        userId: user.userId,
        userName: user.userName,
        company: user.company,
        score: user.eventsAttended * 10,
        eventsAttended: user.eventsAttended,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    await adminDb.collection('leaderboards').doc(`corporate-${company.toLowerCase().replace(/\s+/g, '-')}-overall`).set({
      type: 'CORPORATE',
      sportType: 'ALL',
      company,
      rankings: companyRankings,
      lastUpdated: new Date(),
    });

    // Sport-specific corporate leaderboards
    for (const sportType of sportTypes) {
      const companySportRankings = Object.values(userScores)
        .filter(user => user.company === company && user.sportTypes[sportType] > 0)
        .map(user => ({
          userId: user.userId,
          userName: user.userName,
          company: user.company,
          score: user.sportTypes[sportType] * 10,
          eventsAttended: user.sportTypes[sportType],
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);

      if (companySportRankings.length > 0) {
        await adminDb.collection('leaderboards').doc(
          `corporate-${company.toLowerCase().replace(/\s+/g, '-')}-${sportType.toLowerCase()}`
        ).set({
          type: 'CORPORATE',
          sportType,
          company,
          rankings: companySportRankings,
          lastUpdated: new Date(),
        });
      }
    }
  }
}
