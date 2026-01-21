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
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Get event
    const eventRef = adminDb.collection('events').doc(eventId);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    const eventData = eventSnap.data();

    // Check if user already joined
    if (eventData?.participants?.includes(userId)) {
      return NextResponse.json(
        { success: false, message: 'You have already joined this event' },
        { status: 400 }
      );
    }

    // Check participant limit
    if (eventData?.participants?.length >= eventData?.maxParticipants) {
      return NextResponse.json(
        { success: false, message: 'Event is full' },
        { status: 400 }
      );
    }

    // Add user to participants
    await eventRef.update({
      participants: FieldValue.arrayUnion(userId),
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined event',
    });
  } catch (error: any) {
    console.error('Error joining event:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
