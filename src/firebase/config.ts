import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const requiredFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const missingFirebaseConfigKeys = Object.entries(requiredFirebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingFirebaseConfigKeys.length === 0;

// Suppress Firebase warnings in demo mode
if (!isFirebaseConfigured) {
  console.info(
    '📋 Running in DEMO MODE - Firebase not configured. Using mock authentication.\n' +
    'Missing keys: ' + missingFirebaseConfigKeys.join(', ')
  );
}

const firebaseConfig = {
  apiKey: requiredFirebaseConfig.apiKey || 'demo-api-key',
  authDomain: requiredFirebaseConfig.authDomain || 'demo.firebaseapp.com',
  projectId: requiredFirebaseConfig.projectId || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: requiredFirebaseConfig.appId || '1:000000000000:web:demo0000000000000',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

let app: any;
let auth: any;
let db: any;
let storage: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  // Suppress Firebase initialization errors in demo mode
  if (!isFirebaseConfigured) {
    console.info('⚠️ Firebase initialization skipped - running in demo mode');
  } else {
    console.error('Firebase initialization error:', error);
  }
}

export { auth, db, storage };
export default app;
