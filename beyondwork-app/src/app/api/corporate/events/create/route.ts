import { NextResponse } from 'next/server';
import { adminDb, verifyAuthToken, getUserRole } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Verify Firebase token
    const decodedToken = await verifyAuthToken(authHeader);
    const createdBy = decodedToken.uid;
    
    // Check if user has CORPORATE_ADMIN role
    const userRole = await getUserRole(createdBy);
    if (userRole !== 'CORPORATE_ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Only corporate admins can create internal events' },
        { status: 403 }
      );
    }
    
    // Get user's company
    const userDoc = await adminDb.collection('users').doc(createdBy).get();
    const userData = userDoc.data();
    const company = userData?.company;
    
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company information not found' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, sportType, location, city, dateTime, maxParticipants, price, isInternal } = body;

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

    // Create corporate event
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
      isInternal: isInternal !== false, // Default to true for corporate events
      company: company,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      eventId: eventDoc.id,
    });
  } catch (error: any) {
    console.error('Error creating corporate event:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
