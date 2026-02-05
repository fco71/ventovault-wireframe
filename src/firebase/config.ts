import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx7WCWtCebZl03bGf259P4IX72s9X-2Vs",
  authDomain: "ventovault-wireframe.firebaseapp.com",
  projectId: "ventovault-wireframe",
  storageBucket: "ventovault-wireframe.firebasestorage.app",
  messagingSenderId: "1080044897239",
  appId: "1:1080044897239:web:2e4d3590f6bd472b5ac192",
  measurementId: "G-PFWXR6E080"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
