// Firebase configuration for LawB Platform
// Supports Web, Android, and iOS (via Firebase JS SDK)

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTJ4WrbDCLFb14kTRD1fvkZrE0598IIpQ",
  authDomain: "lawb-6fd3f.firebaseapp.com",
  projectId: "lawb-6fd3f",
  storageBucket: "lawb-6fd3f.firebasestorage.app",
  messagingSenderId: "349486524384",
  appId: "1:349486524384:web:d3059b7d962829a1b1ad85",
  measurementId: "G-37QMZKZTNC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore (NoSQL document database)
export const db = getFirestore(app);

// Realtime Database - set to null (enable later if needed)
export const realtimeDb = null;

// Analytics - set to null (enable later if needed)
export const analytics = null;

// Export the Firebase app instance
export default app;
