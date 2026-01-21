import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Storage and Messaging - Import dynamically to avoid webpack issues
export const getStorageInstance = async () => {
  if (typeof window !== 'undefined') {
    const { getStorage } = await import('firebase/storage');
    return getStorage(app);
  }
  return null;
};

// Initialize messaging only in browser and if supported
export const getMessagingInstance = async () => {
  if (typeof window !== 'undefined') {
    const { getMessaging, isSupported } = await import('firebase/messaging');
    if (await isSupported()) {
      return getMessaging(app);
    }
  }
  return null;
};

export default app;
