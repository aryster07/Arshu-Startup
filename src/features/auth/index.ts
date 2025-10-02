// Auth components
export { default as AuthContainer } from './components/AuthContainer';
export { default as SignInForm } from './components/SignInForm';
export { default as SignUpForm } from './components/SignUpForm';
export { default as ForgotPasswordForm } from './components/ForgotPasswordForm';

// Auth types (for future use)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  role?: 'client' | 'lawyer' | 'admin';
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
}

// Auth service interface (for future implementation)
export interface AuthService {
  signIn(credentials: SignInCredentials): Promise<User>;
  signUp(data: SignUpData): Promise<User>;
  signOut(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<string>;
}