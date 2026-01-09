// Firebase Authentication Service
// Handles all authentication methods for Web, Android, and iOS

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  OAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  User,
  UserCredential,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// ============================================
// Email/Password Authentication
// ============================================

/**
 * Register a new user with email and password
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  
  // Send email verification
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user);
  }
  
  return userCredential;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// ============================================
// Google Authentication
// ============================================

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

/**
 * Sign in with Google (popup method - best for web)
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

/**
 * Sign in with Google (redirect method - better for mobile)
 */
export const signInWithGoogleRedirect = async (): Promise<void> => {
  return signInWithRedirect(auth, googleProvider);
};

/**
 * Get result after Google redirect
 */
export const getGoogleRedirectResult = async (): Promise<UserCredential | null> => {
  return getRedirectResult(auth);
};

// ============================================
// Apple Authentication (for iOS users)
// ============================================

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

/**
 * Sign in with Apple (popup method)
 */
export const signInWithApple = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, appleProvider);
};

/**
 * Sign in with Apple (redirect method - recommended for iOS)
 */
export const signInWithAppleRedirect = async (): Promise<void> => {
  return signInWithRedirect(auth, appleProvider);
};

// ============================================
// Phone Authentication (OTP)
// ============================================

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

/**
 * Initialize reCAPTCHA verifier for phone auth
 * Call this before sending OTP
 */
export const initRecaptcha = (containerId: string): RecaptchaVerifier => {
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will proceed with phone sign-in
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
    }
  });
  return recaptchaVerifier;
};

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
  if (!recaptchaVerifier) {
    throw new Error('reCAPTCHA not initialized. Call initRecaptcha first.');
  }
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  return confirmationResult;
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (otpCode: string): Promise<UserCredential> => {
  if (!confirmationResult) {
    throw new Error('No OTP sent. Call sendOTP first.');
  }
  return confirmationResult.confirm(otpCode);
};

// ============================================
// Session Management
// ============================================

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
  return signOut(auth);
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user's email is verified
 */
export const isEmailVerified = (): boolean => {
  return auth.currentUser?.emailVerified ?? false;
};

/**
 * Resend email verification
 */
export const resendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser);
  }
  throw new Error('No user logged in');
};

// ============================================
// Profile Management
// ============================================

/**
 * Update user profile
 */
export const updateUserProfile = async (data: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  if (auth.currentUser) {
    return updateProfile(auth.currentUser, data);
  }
  throw new Error('No user logged in');
};

// Export auth instance for direct access if needed
export { auth };
