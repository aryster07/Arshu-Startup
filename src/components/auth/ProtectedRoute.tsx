import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'lawyer' | 'admin';
  redirectTo?: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  isApproved?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (!storedUser || !storedToken) {
          setLoading(false);
          return;
        }

        // Verify with backend
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            // Clear invalid data
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
          }
        } else {
          // Token might be expired, try to refresh
          const refreshResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.tokens) {
              localStorage.setItem('accessToken', refreshData.tokens.accessToken);
              setUser(JSON.parse(storedUser));
            } else {
              localStorage.removeItem('user');
              localStorage.removeItem('accessToken');
            }
          } else {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setError('Authentication check failed');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    const loginPath = requiredRole === 'lawyer' ? '/lawyer/auth' : '/client/auth';
    return <Navigate to={redirectTo || loginPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard or access denied page
    const dashboardPath = user.role === 'lawyer' ? '/lawyer/dashboard' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  // Check if lawyer account is approved (if applicable)
  if (user.role === 'lawyer' && user.isApproved === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Account Under Review
          </h2>
          <p className="text-gray-600 mb-4">
            Your lawyer account is currently being reviewed by our team. 
            You'll receive an email notification once your credentials are verified.
          </p>
          <p className="text-sm text-gray-500">
            This process typically takes 24-48 hours.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                window.location.href = '/lawyer/auth';
              }}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Sign out and try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if email is verified (if applicable)
  if (!user.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-4">
            Please check your email ({user.email}) and click the verification link to activate your account.
          </p>
          <div className="space-y-3">
            <button
              onClick={async () => {
                try {
                  await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/auth/resend-verification`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                  });
                  alert('Verification email sent!');
                } catch (error) {
                  alert('Failed to send verification email. Please try again.');
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Resend Verification Email
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                window.location.href = '/';
              }}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;