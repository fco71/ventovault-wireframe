import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User } from '../types';
import { featureFlags } from '../config/flags';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_EMAIL = 'demo@ventovault.com';
const DEMO_PASSWORD = 'demo123';
const DEMO_STORAGE_KEY = 'ventovault_demo_user';

function buildDefaultUser(id: string, email: string, displayName: string): User {
  return {
    id,
    email,
    displayName,
    createdAt: new Date(),
    balance: 1000,
    verificationTier: 'L30',
    dailyLimit: 10000,
    monthlyLimit: 50000,
  };
}

function toDemoUser(email: string, displayName?: string): User {
  const normalizedEmail = email.trim().toLowerCase();
  const fallbackDisplayName = normalizedEmail.split('@')[0].replace(/[^a-z0-9]/gi, ' ').trim() || 'Demo User';
  const id = `demo_${normalizedEmail.replace(/[^a-z0-9]/gi, '_')}`;

  return buildDefaultUser(
    id,
    normalizedEmail,
    displayName?.trim() || fallbackDisplayName
  );
}

function persistDemoUser(user: User): void {
  localStorage.setItem(
    DEMO_STORAGE_KEY,
    JSON.stringify({ ...user, createdAt: user.createdAt.toISOString() })
  );
}

function getStoredDemoUser(): User | null {
  const raw = localStorage.getItem(DEMO_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as User & { createdAt: string };
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  } catch {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    return null;
  }
}

function clearDemoUser(): void {
  localStorage.removeItem(DEMO_STORAGE_KEY);
}

function getErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' ? code : null;
}

function shouldFallbackToDemo(error: unknown): boolean {
  if (!featureFlags.enableAuthDemoFallback) {
    return false;
  }

  const code = getErrorCode(error);
  if (!code) {
    return false;
  }

  return [
    'auth/configuration-not-found',
    'auth/invalid-api-key',
    'auth/network-request-failed',
    'auth/internal-error',
    'auth/operation-not-allowed',
    'auth/too-many-requests',
  ].includes(code);
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName });

      const userData = buildDefaultUser(
        userCredential.user.uid,
        email,
        displayName
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      clearDemoUser();
      setCurrentUser(userData);
    } catch (error) {
      if (!shouldFallbackToDemo(error)) {
        throw error;
      }

      const demoUser = toDemoUser(email, displayName);
      persistDemoUser(demoUser);
      setFirebaseUser(null);
      setCurrentUser(demoUser);
    }
  };

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (featureFlags.enableAuthDemoFallback && normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const demoUser = toDemoUser(DEMO_EMAIL, 'Demo User');
      persistDemoUser(demoUser);
      setFirebaseUser(null);
      setCurrentUser(demoUser);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      clearDemoUser();
    } catch (error) {
      if (!shouldFallbackToDemo(error)) {
        throw error;
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      const demoUser = toDemoUser(normalizedEmail);
      persistDemoUser(demoUser);
      setFirebaseUser(null);
      setCurrentUser(demoUser);
    }
  };

  const logout = async () => {
    clearDemoUser();
    setCurrentUser(null);

    try {
      await signOut(auth);
    } catch {
      // Demo mode does not require Firebase sign out.
    }

    setFirebaseUser(null);
  };

  useEffect(() => {
    if (!featureFlags.enableAuthDemoFallback) {
      clearDemoUser();
    }

    const storedDemoUser = getStoredDemoUser();
    if (featureFlags.enableAuthDemoFallback && storedDemoUser) {
      setCurrentUser(storedDemoUser);
      setLoading(false);
      return;
    }

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        setLoading(false);
      }
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (nextFirebaseUser) => {
      resolved = true;
      clearTimeout(timeout);

      setFirebaseUser(nextFirebaseUser);

      if (nextFirebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', nextFirebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            setCurrentUser(
              buildDefaultUser(
                nextFirebaseUser.uid,
                nextFirebaseUser.email || 'unknown@example.com',
                nextFirebaseUser.displayName || 'VentoVault User'
              )
            );
          }
        } catch {
          setCurrentUser(
            buildDefaultUser(
              nextFirebaseUser.uid,
              nextFirebaseUser.email || 'unknown@example.com',
              nextFirebaseUser.displayName || 'VentoVault User'
            )
          );
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    firebaseUser,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
