import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import { auth, db } from './firebase';
import { cleanFirestoreData } from './utils/cleanFirestoreData';

// Mock User type to replace firebase/auth User
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  register: (email: string, password: string, extraData?: { displayName?: string; role?: string; phoneNumber?: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const logFirebaseError = (context: string, error: unknown) => {
    if (error instanceof FirebaseError) {
      console.error(`${context} (${error.code}): ${error.message}`);
      return;
    }
    console.error(context, error);
  };

  const syncUserProfile = async (uid: string, fallbackUser?: MockUser | null) => {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      setProfile({
        uid,
        email: data.email || fallbackUser?.email || '',
        displayName: data.displayName || fallbackUser?.displayName || '',
        role: data.role || 'customer',
        phoneNumber: data.phoneNumber,
        photoURL: data.photoURL || fallbackUser?.photoURL || null,
        addresses: data.addresses || [],
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      });
      return;
    }

    const fallbackProfile: UserProfile = {
      uid,
      email: fallbackUser?.email || '',
      displayName: fallbackUser?.displayName || fallbackUser?.email || 'User',
      role: 'customer',
      phoneNumber: '',
      photoURL: fallbackUser?.photoURL || null,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    await setDoc(userDocRef, cleanFirestoreData({
      ...fallbackProfile,
      createdAt: serverTimestamp(),
    }), { merge: true });
    setProfile(fallbackProfile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          return;
        }

        const currentUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email || 'User',
          photoURL: firebaseUser.photoURL,
        };
        setUser(currentUser);
        await syncUserProfile(firebaseUser.uid, currentUser);
      } catch (error) {
        logFirebaseError('Failed to sync auth state', error);
      } finally {
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (
    email: string,
    password: string,
    extraData: { displayName?: string; role?: string; phoneNumber?: string } = {}
  ) => {
    setLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = credentials.user;

      const newProfile: UserProfile = {
        uid: createdUser.uid,
        email: email,
        displayName: extraData.displayName || createdUser.displayName || email.split('@')[0],
        role: (extraData.role as UserProfile['role']) || 'customer',
        phoneNumber: extraData.phoneNumber || '',
        photoURL: createdUser.photoURL || null,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', createdUser.uid), cleanFirestoreData({
        ...newProfile,
        createdAt: serverTimestamp(),
      }), { merge: true });

      setUser({
        uid: createdUser.uid,
        email: createdUser.email || email,
        displayName: newProfile.displayName,
        photoURL: createdUser.photoURL || null,
      });
      setProfile(newProfile);
    } catch (error) {
      logFirebaseError('Registration failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credentials.user;
      const currentUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || email.split('@')[0],
        photoURL: firebaseUser.photoURL,
      };
      setUser(currentUser);
      await syncUserProfile(firebaseUser.uid, currentUser);
    } catch (error) {
      logFirebaseError('Login failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      logFirebaseError('Logout failed', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthReady, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
