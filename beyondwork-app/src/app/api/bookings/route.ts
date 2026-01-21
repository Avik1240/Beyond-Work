import { NextResponse } from 'next/server';
import { adminDb, verifyAuthToken } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Verify Firebase token
    const decodedToken = await verifyAuthToken(authHeader);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { eventId, facilityId, amount } = body;

    // Validation
    if (!eventId || !facilityId) {
      return NextResponse.json(
        { success: false, message: 'Event ID and Facility ID are required' },
        { status: 400 }
      );
    }

    // Verify event exists
    const eventDoc = await adminDb.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Verify facility exists
    const facilityDoc = await adminDb.collection('facilities').doc(facilityId).get();
    if (!facilityDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Facility not found' },
        { status: 404 }
      );
    }

    // Create booking
    const bookingDoc = await adminDb.collection('bookings').add({
      userId,
      eventId,
      facilityId,
      amount: amount || 0,
      paymentStatus: 'PENDING', // For MVP, all payments are offline
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      bookingId: bookingDoc.id,
      message: 'Booking created successfully. Payment to be made offline at venue.',
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get bookings for a user
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Verify Firebase token
    const decodedToken = await verifyAuthToken(authHeader);
    const userId = decodedToken.uid;

    const bookingsSnapshot = await adminDb
      .collection('bookings')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const bookings = [];
    for (const doc of bookingsSnapshot.docs) {
      const bookingData = doc.data();
      
      // Fetch event and facility details
      const eventDoc = await adminDb.collection('events').doc(bookingData.eventId).get();
      const facilityDoc = await adminDb.collection('facilities').doc(bookingData.facilityId).get();

      bookings.push({
        id: doc.id,
        ...bookingData,
        event: eventDoc.exists ? { id: eventDoc.id, ...eventDoc.data() } : null,
        facility: facilityDoc.exists ? { id: facilityDoc.id, ...facilityDoc.data() } : null,
      });
    }

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
