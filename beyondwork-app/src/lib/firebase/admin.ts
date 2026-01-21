import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

/**
 * Verify Firebase ID token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Decoded token with user info
 */
export async function verifyAuthToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error: any) {
    throw new Error(`Invalid token: ${error.message}`);
  }
}

/**
 * Get user role from Firestore (if not in custom claims)
 * @param userId - User ID
 * @returns User role
 */
export async function getUserRole(userId: string): Promise<string> {
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return 'USER';
    }
    return userDoc.data()?.role || 'USER';
  } catch (error) {
    return 'USER';
  }
}

/**
 * Check if user has required role
 * @param userId - User ID
 * @param requiredRole - Required role
 * @returns True if user has role
 */
export async function hasRole(userId: string, requiredRole: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  
  // Role hierarchy: SUPER_ADMIN > CORPORATE_ADMIN > USER
  const roleHierarchy = ['USER', 'CORPORATE_ADMIN', 'SUPER_ADMIN'];
  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
}
