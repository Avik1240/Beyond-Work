'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { onAuthChange } from '@/lib/firebase/auth';
import { getUserProfile } from '@/lib/firebase/firestore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setFirebaseUser, setUserProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        const { data, error } = await getUserProfile(firebaseUser.uid);
        if (data) {
          setUserProfile(data);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setUserProfile, setLoading]);

  return <>{children}</>;
}
