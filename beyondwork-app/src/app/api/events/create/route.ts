import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuthToken } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Verify Firebase token
    const decodedToken = await verifyAuthToken(authHeader);
    const createdBy = decodedToken.uid;

    const body = await request.json();
    const { title, sportType, location, city, dateTime, maxParticipants, price } = body;

    // Validation
    if (!title || !sportType || !location || !city || !dateTime) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (maxParticipants < 2) {
      return NextResponse.json(
        { success: false, message: 'Max participants must be at least 2' },
        { status: 400 }
      );
    }

    const eventDateTime = new Date(dateTime);
    if (eventDateTime <= new Date()) {
      return NextResponse.json(
        { success: false, message: 'Event date must be in the future' },
        { status: 400 }
      );
    }

    // Create event
    const eventDoc = await adminDb.collection('events').add({
      title,
      sportType,
      location,
      city,
      dateTime: Timestamp.fromDate(eventDateTime),
      createdBy,
      maxParticipants: parseInt(maxParticipants),
      participants: [],
      price: parseInt(price) || 0,
      status: 'UPCOMING',
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      eventId: eventDoc.id,
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
