import { NextResponse } from 'next/server';
import { adminDb, verifyAuthToken } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Verify Firebase token
    const decodedToken = await verifyAuthToken(authHeader);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { communityId } = body;

    if (!communityId) {
      return NextResponse.json(
        { success: false, message: 'Community ID is required' },
        { status: 400 }
      );
    }

    // Get community
    const communityRef = adminDb.collection('communities').doc(communityId);
    const communitySnap = await communityRef.get();

    if (!communitySnap.exists) {
      return NextResponse.json(
        { success: false, message: 'Community not found' },
        { status: 404 }
      );
    }

    const communityData = communitySnap.data();

    // Check if user already joined
    if (communityData?.members?.includes(userId)) {
      return NextResponse.json(
        { success: false, message: 'You are already a member of this community' },
        { status: 400 }
      );
    }

    // Add user to members
    await communityRef.update({
      members: FieldValue.arrayUnion(userId),
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined community',
    });
  } catch (error: any) {
    console.error('Error joining community:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
