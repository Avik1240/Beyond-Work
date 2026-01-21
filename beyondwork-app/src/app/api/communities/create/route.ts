import { NextResponse } from 'next/server';
import { adminDb, verifyAuthToken } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Verify Firebase token
    const decodedToken = await verifyAuthToken(authHeader);
    const createdBy = decodedToken.uid;

    const body = await request.json();
    const { name, city, description } = body;

    // Validation
    if (!name || !city) {
      return NextResponse.json(
        { success: false, message: 'Name and city are required' },
        { status: 400 }
      );
    }

    // Create community
    const communityDoc = await adminDb.collection('communities').add({
      name,
      city,
      description: description || '',
      createdBy,
      members: [createdBy], // Creator is automatically a member
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      communityId: communityDoc.id,
    });
  } catch (error: any) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
