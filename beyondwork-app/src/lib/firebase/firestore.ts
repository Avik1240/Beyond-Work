import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { User } from '@/types';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  EVENTS: 'events',
  FACILITIES: 'facilities',
  BOOKINGS: 'bookings',
  COMMUNITIES: 'communities',
  LEADERBOARDS: 'leaderboards',
};

// Create or update user profile
export const createUserProfile = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now(),
    }, { merge: true });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { data: { id: userSnap.id, ...userSnap.data() } as User, error: null };
    }
    return { data: null, error: 'User not found' };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, updates);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get events by city
export const getEventsByCity = async (city: string) => {
  try {
    const eventsRef = collection(db, COLLECTIONS.EVENTS);
    const q = query(eventsRef, where('city', '==', city));
    const querySnapshot = await getDocs(q);
    
    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { data: events, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Get facilities by city
export const getFacilitiesByCity = async (city: string) => {
  try {
    const facilitiesRef = collection(db, COLLECTIONS.FACILITIES);
    const q = query(facilitiesRef, where('city', '==', city));
    const querySnapshot = await getDocs(q);
    
    const facilities = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { data: facilities, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};
