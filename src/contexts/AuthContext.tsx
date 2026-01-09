import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  signInWithGoogle,
  signInWithApple,
  signInWithEmail,
  registerWithEmail,
  sendOTP,
  verifyOTP,
  initRecaptcha,
  logout as firebaseLogout,
  resetPassword,
} from '../services/authService';
import {
  setDocument,
} from '../services/databaseService';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  picture?: string;
  emailVerified?: boolean;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // OAuth methods
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithOAuth: () => Promise<void>; // Generic OAuth (defaults to Google)
  // Email/Password methods
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  // OTP methods
  loginWithOTP: (identifier: string, type: 'email' | 'phone') => Promise<void>;
  verifyOTP: (identifier: string, otp: string, type: 'email' | 'phone') => Promise<boolean>;
  // Session methods
  login: () => void; // Legacy MVP login
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Convert Firebase User to our User type
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
  phone: firebaseUser.phoneNumber || undefined,
  picture: firebaseUser.photoURL || undefined,
  emailVerified: firebaseUser.emailVerified,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);

  // Handle redirect result (for mobile OAuth)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect sign-in successful:', result.user.email);
          // Auth state listener will handle the user
        }
      } catch (err: any) {
        console.error('Redirect sign-in error:', err);
        setError(err.message || 'Failed to complete sign-in');
        setIsLoading(false);
      }
    };
    
    handleRedirectResult();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    try {
      console.log('Setting up Firebase auth listener...');
      
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        console.log('Auth state changed:', fbUser ? 'User logged in' : 'No user');
        
        if (fbUser) {
          setFirebaseUser(fbUser);
          const mappedUser = mapFirebaseUser(fbUser);
          setUser(mappedUser);
          
          // Save/update user in Firestore (optional, don't block auth)
          try {
            await setDocument('users', fbUser.uid, {
              email: mappedUser.email,
              name: mappedUser.name,
              phone: mappedUser.phone || null,
              picture: mappedUser.picture || null,
              emailVerified: mappedUser.emailVerified,
              lastLogin: new Date(),
            }, true);
          } catch (err) {
            console.warn('Error saving user to database:', err);
          }
        } else {
          setFirebaseUser(null);
          setUser(null);
        }
        setIsLoading(false);
      }, (authError) => {
        console.error('Auth state error:', authError);
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Failed to set up Firebase auth:', err);
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Initialize reCAPTCHA for phone auth
  useEffect(() => {
    // Add a hidden div for reCAPTCHA
    if (!document.getElementById('recaptcha-container')) {
      const div = document.createElement('div');
      div.id = 'recaptcha-container';
      document.body.appendChild(div);
    }
  }, []);

  const clearError = () => setError(null);

  // Google OAuth
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Auth state listener will handle the rest
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  // Apple OAuth
  const loginWithApple = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithApple();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Apple');
      setIsLoading(false);
    }
  };

  // Generic OAuth (defaults to Google)
  const loginWithOAuth = async () => {
    await loginWithGoogle();
  };

  // Email/Password login
  const handleLoginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  // Email/Password registration
  const handleRegisterWithEmail = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerWithEmail(email, password, name);
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  // Password reset
  const handleResetPassword = async (email: string) => {
    setError(null);
    try {
      await resetPassword(email);
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Send OTP (phone or email simulation)
  const loginWithOTP = async (identifier: string, type: 'email' | 'phone') => {
    setIsLoading(true);
    setError(null);
    try {
      if (type === 'phone') {
        // Initialize reCAPTCHA if not done
        if (!recaptchaInitialized) {
          initRecaptcha('recaptcha-container');
          setRecaptchaInitialized(true);
        }
        
        // Format phone number if needed (add +91 for India if not present)
        let phoneNumber = identifier;
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = '+91' + phoneNumber.replace(/\D/g, '');
        }
        
        await sendOTP(phoneNumber);
      } else {
        // For email OTP, we'll use password reset flow or magic link
        // Firebase doesn't have native email OTP, so we'll send a password reset
        throw new Error('Email OTP is not yet implemented. Please use phone OTP or social login.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (_identifier: string, otp: string, type: 'email' | 'phone'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      if (type === 'phone') {
        await verifyOTP(otp);
        return true;
      } else {
        throw new Error('Email OTP verification not implemented');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy MVP login (for quick testing)
  const login = () => {
    const mockUser: User = {
      id: 'demo-user',
      email: 'demo@lawbandhu.com',
      name: 'Demo User',
    };
    setUser(mockUser);
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseLogout();
      setUser(null);
      setFirebaseUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        error,
        loginWithGoogle,
        loginWithApple,
        loginWithOAuth,
        loginWithEmail: handleLoginWithEmail,
        registerWithEmail: handleRegisterWithEmail,
        resetPassword: handleResetPassword,
        loginWithOTP,
        verifyOTP: handleVerifyOTP,
        login,
        logout,
        clearError,
      }}
    >
      {children}
      {/* Hidden reCAPTCHA container for phone auth */}
      <div id="recaptcha-container" style={{ display: 'none' }} />
    </AuthContext.Provider>
  );
};

// Helper function to convert Firebase error codes to user-friendly messages
function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/invalid-verification-code':
      return 'Invalid OTP code. Please try again.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number with country code.';
    default:
      return 'An error occurred. Please try again.';
  }
}
