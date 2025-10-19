import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  picture?: string;
  authMethod: 'oauth' | 'otp';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithOAuth: () => void;
  loginWithOTP: (identifier: string, type: 'email' | 'phone') => Promise<void>;
  verifyOTP: (identifier: string, otp: string, type: 'email' | 'phone') => Promise<boolean>;
  logout: () => void;
  error: string | null;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user: auth0User,
    isAuthenticated: auth0Authenticated,
    isLoading: auth0Loading,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Handle Auth0 user
  useEffect(() => {
    if (auth0Authenticated && auth0User) {
      const mappedUser: User = {
        id: auth0User.sub || '',
        email: auth0User.email || '',
        name: auth0User.name || '',
        picture: auth0User.picture,
        authMethod: 'oauth',
      };
      setUser(mappedUser);
      Cookies.set('user', JSON.stringify(mappedUser), { expires: 7 });
    } else if (!auth0Loading) {
      // Check for OTP user in cookies
      const savedUser = Cookies.get('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(auth0Loading);
  }, [auth0User, auth0Authenticated, auth0Loading]);

  const loginWithOAuth = () => {
    loginWithRedirect({
      appState: { returnTo: '/dashboard' },
    });
  };

  const loginWithOTP = async (identifier: string, type: 'email' | 'phone') => {
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = type === 'email' ? '/api/auth/send-email-otp' : '/api/auth/send-otp';
      const payload = type === 'email' ? { email: identifier } : { phone: identifier };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send OTP');
      }

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      setIsLoading(false);
      throw err;
    }
  };

  const verifyOTP = async (identifier: string, otp: string, type: 'email' | 'phone'): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = type === 'email' ? '/api/auth/verify-email-otp' : '/api/auth/verify-otp';
      const payload = type === 'email' 
        ? { email: identifier, otp }
        : { phone: identifier, otp };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // Create user from OTP verification
      const otpUser: User = {
        id: data.userId || identifier,
        email: type === 'email' ? identifier : data.email || '',
        phone: type === 'phone' ? identifier : data.phone,
        name: data.name || identifier,
        authMethod: 'otp',
      };

      setUser(otpUser);
      Cookies.set('user', JSON.stringify(otpUser), { expires: 7 });
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    
    if (auth0Authenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithOAuth,
    loginWithOTP,
    verifyOTP,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
