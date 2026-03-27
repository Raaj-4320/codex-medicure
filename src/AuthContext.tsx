import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import { auth, db, firebaseConfig } from './firebase';
import { cleanFirestoreData } from './utils/cleanFirestoreData';

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
  register: (
    email: string,
    password: string,
    extraData?: { displayName?: string; role?: string; phoneNumber?: string }
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
  register: async () => { },
  login: async () => { },
  logout: async () => { },
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

  const ensureSellerPharmacy = async (seller: {
    uid: string;
    displayName: string;
    email: string;
    phoneNumber?: string;
  }) => {
    try {
      console.log('[PHARMACY][ENSURE][START]', seller.uid);
      console.log('[ENSURE] Function called for UID:', seller.uid);
      console.log('[PHARMACY][ENSURE][CHECK_EXISTING]');
      console.log('[ENSURE] Checking existing pharmacy...');
      const pharmacyRef = doc(db, 'pharmacies', seller.uid);
      const existing = await getDoc(pharmacyRef);
      console.log('[PHARMACY][ENSURE][DOC_EXISTS]', existing.exists());
      console.log('[PHARMACY][ENSURE][DOC_DATA]', existing.data());
      console.log('[ENSURE] Existing doc:', existing.exists(), existing.data());
      if (existing.exists()) {
        console.log('[PHARMACY][ENSURE][RESULT]', 'already_exists');
        return;
      }

      console.log('[PHARMACY][ENSURE][CREATE_START]');
      console.log('[ENSURE] Creating pharmacy...');
      await setDoc(
        pharmacyRef,
        cleanFirestoreData({
          id: seller.uid,
          ownerId: seller.uid,
          sellerId: seller.uid,
          name: `${seller.displayName}'s Pharmacy`,
          description: '',
          address: {},
          contactNumber: seller.phoneNumber || '',
          email: seller.email,
          operatingHours: '09:00-21:00',
          verificationStatus: 'pending',
          status: 'pending',
          deliveryAvailable: true,
          pickupAvailable: true,
          minOrderValue: 0,
          deliveryFee: 0,
          rating: 0,
          reviewCount: 0,
          image: '',
          createdAt: serverTimestamp(),
        }),
        { merge: true },
      );
      console.log('[PHARMACY][ENSURE][CREATE_DONE]');
      console.log('[ENSURE] Pharmacy created');

      const verify = await getDoc(pharmacyRef);
      console.log('[PHARMACY][ENSURE][VERIFY]', verify.exists(), verify.data());
      console.log('[ENSURE] Verification result:', verify.exists(), verify.data());
      if (!verify.exists()) {
        throw new Error('Pharmacy write verification failed');
      }
    } catch (error) {
      console.error('[PHARMACY][ENSURE][ERROR]', error);
      console.error('[ENSURE ERROR]', error);
      throw error;
    }
  };

  // ✅ SAFE PROFILE SYNC (NO CRASH)
  const syncUserProfile = async (uid: string, fallbackUser?: MockUser | null) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();

        setProfile({
          uid,
          email: data.email || fallbackUser?.email || '',
          displayName: data.displayName || fallbackUser?.displayName || '',
          role: data.role || 'customer',
          phoneNumber: data.phoneNumber || '',
          photoURL: data.photoURL || fallbackUser?.photoURL || null,
          addresses: data.addresses || [],
          createdAt:
            data.createdAt?.toDate?.()?.toISOString?.() ||
            new Date().toISOString(),
        });

        return;
      }

      // ✅ fallback creation (SAFE)
      const fallbackProfile: UserProfile = {
        uid,
        email: fallbackUser?.email || '',
        displayName:
          fallbackUser?.displayName || fallbackUser?.email || 'User',
        role: 'customer',
        phoneNumber: '',
        photoURL: fallbackUser?.photoURL || null,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      await setDoc(
        userDocRef,
        cleanFirestoreData({
          ...fallbackProfile,
          createdAt: serverTimestamp(),
        }),
        { merge: true }
      );

      setProfile(fallbackProfile);
    } catch (error) {
      console.error('[ERROR][SYNC_USER_PROFILE]', error);
      // ✅ CRITICAL FIX: do NOT crash app
      console.warn('Profile sync failed → using fallback');

      setProfile({
        uid,
        email: fallbackUser?.email || '',
        displayName: fallbackUser?.displayName || 'User',
        role: 'customer',
        phoneNumber: '',
        photoURL: null,
        addresses: [],
        createdAt: new Date().toISOString(),
      });
    }
  };

  // ✅ AUTH STATE LISTENER (SAFE)
  useEffect(() => {
    console.log('[AUTH][STATE] Listening to auth state...');
    console.log('[FIREBASE CONFIG]', firebaseConfig.projectId);
    if (localStorage.getItem('admin') === 'true') {
      setUser({
        uid: 'admin-static',
        email: 'raj.golakiya0@gmail.com',
        displayName: 'Admin',
        photoURL: null,
      });

      setProfile({
        uid: 'admin-static',
        email: 'raj.golakiya0@gmail.com',
        displayName: 'Admin',
        role: 'admin',
        phoneNumber: '',
        photoURL: null,
        addresses: [],
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      setIsAuthReady(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      console.log('[AUTH][STATE] User:', firebaseUser);

      try {
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          return;
        }

        const currentUser: MockUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName:
            firebaseUser.displayName ||
            firebaseUser.email ||
            'User',
          photoURL: firebaseUser.photoURL || null,
        };

        setUser(currentUser);

        // ✅ SAFE CALL (won’t break if permission fails)
        await syncUserProfile(firebaseUser.uid, currentUser);
        const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const role = profileDoc.exists() ? profileDoc.data().role : 'customer';
        if (role === 'seller') {
          console.log('[ENSURE] Triggered from auth-state listener for UID:', firebaseUser.uid);
          await ensureSellerPharmacy({
            uid: firebaseUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
          });
        }
      } catch (error) {
        console.error('[ERROR][AUTH_STATE_CHANGE]', error);
        logFirebaseError('Failed to sync auth state', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ REGISTER (CLEAN + SAFE)
  const register = async (
    email: string,
    password: string,
    extraData: { displayName?: string; role?: string; phoneNumber?: string } = {}
  ) => {
    setLoading(true);

    try {
      console.log('[AUTH][REGISTER][START]', email);
      console.log('[REGISTER] Start');
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const createdUser = credentials.user;
      console.log('[AUTH][REGISTER][SUCCESS]', createdUser.uid);
      console.log('[REGISTER] User created UID:', createdUser.uid);

      const newProfile: UserProfile = {
        uid: createdUser.uid,
        email,
        displayName:
          extraData.displayName ||
          createdUser.displayName ||
          email.split('@')[0],
        role: (extraData.role as UserProfile['role']) || 'customer',
        phoneNumber: extraData.phoneNumber || '',
        photoURL: createdUser.photoURL || null,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      await setDoc(
        doc(db, 'users', createdUser.uid),
        cleanFirestoreData({
          ...newProfile,
          createdAt: serverTimestamp(),
        }),
        { merge: true }
      );

      if (newProfile.role === 'seller') {
        console.log('[ENSURE] Triggered from register flow for UID:', newProfile.uid);
        await ensureSellerPharmacy(newProfile);
      }

      setUser({
        uid: createdUser.uid,
        email: createdUser.email || email,
        displayName: newProfile.displayName,
        photoURL: createdUser.photoURL || null,
      });

      setProfile(newProfile);
    } catch (error) {
      console.error('[AUTH][REGISTER][ERROR]', error);
      logFirebaseError('Registration failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      console.log('[AUTH][LOGIN][START]', email);
      // ✅ STATIC ADMIN LOGIN (ADD THIS BLOCK)
      if (email === 'raj.golakiya0@gmail.com' && password === '123') {
        const adminUser: MockUser = {
          uid: 'admin-static',
          email: 'raj.golakiya0@gmail.com',
          displayName: 'Admin',
          photoURL: null,
        };

        const adminProfile: UserProfile = {
          uid: 'admin-static',
          email: 'raj.golakiya0@gmail.com',
          displayName: 'Admin',
          role: 'admin',
          phoneNumber: '',
          photoURL: null,
          addresses: [],
          createdAt: new Date().toISOString(),
        };

        setUser(adminUser);
        setProfile(adminProfile);
        // 🔥 Prevent Firebase override
        localStorage.setItem('admin', 'true');

        return;
      }

      // ✅ NORMAL FIREBASE LOGIN
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = credentials.user;
      console.log('[AUTH][LOGIN][SUCCESS]', firebaseUser.uid);
      console.log('[AUTH] currentUser:', firebaseUser);

      const currentUser: MockUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName:
          firebaseUser.displayName || email.split('@')[0],
        photoURL: firebaseUser.photoURL || null,
      };

      setUser(currentUser);
      await syncUserProfile(firebaseUser.uid, currentUser);
      const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const role = profileDoc.exists() ? profileDoc.data().role : 'customer';
      if (role === 'seller') {
        console.log('[ENSURE] Triggered from login flow for UID:', firebaseUser.uid);
        await ensureSellerPharmacy({
          uid: firebaseUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
        });
      }

      const manualCheck = await getDoc(doc(db, 'pharmacies', firebaseUser.uid));
      console.log('[MANUAL CHECK]', manualCheck.exists(), manualCheck.data());
      console.log('[DEBUG][DIRECT_FIRESTORE]', manualCheck.exists(), manualCheck.data());

    } catch (error) {
      console.error('[AUTH][LOGIN][ERROR]', error);
      logFirebaseError('Login failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  
const logout = async () => {
  try {
    localStorage.removeItem('admin'); // ✅ important
    await signOut(auth);
    setUser(null);
    setProfile(null);
  } catch (error) {
    logFirebaseError('Logout failed', error);
    throw error;
  }
};

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAuthReady, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
