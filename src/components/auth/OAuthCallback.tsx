import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface OAuthCallbackProps {
  userType?: 'client' | 'lawyer';
}

const OAuthCallback: React.FC<OAuthCallbackProps> = ({ userType = 'client' }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract query parameters
        const urlParams = new URLSearchParams(location.search);
        const error = urlParams.get('error');
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        // Check for OAuth errors
        if (error) {
          setStatus('error');
          switch (error) {
            case 'access_denied':
              setMessage('Access was denied. Please try again if you want to continue.');
              break;
            case 'invalid_request':
              setMessage('Invalid request. Please try the authentication process again.');
              break;
            default:
              setMessage(`Authentication error: ${error}`);
          }
          return;
        }

        // If no code, there's an issue
        if (!code) {
          setStatus('error');
          setMessage('No authorization code received. Please try again.');
          return;
        }

        // The OAuth flow should be handled by the backend
        // At this point, the backend should have already processed the OAuth callback
        // and set the appropriate cookies/session data

        // Check if we're authenticated by making a request to get user info
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          
          if (userData.success && userData.user) {
            setUser(userData.user);
            setStatus('success');
            setMessage('Authentication successful! Redirecting to your dashboard...');

            // Store user data locally
            localStorage.setItem('user', JSON.stringify(userData.user));
            if (userData.tokens?.accessToken) {
              localStorage.setItem('accessToken', userData.tokens.accessToken);
            }

            // Redirect based on user role
            setTimeout(() => {
              const dashboardUrl = userData.user.role === 'lawyer' ? '/lawyer/dashboard' : '/dashboard';
              navigate(dashboardUrl);
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Authentication failed. Please try again.');
          }
        } else {
          // Check if the response contains error information
          try {
            const errorData = await response.json();
            setStatus('error');
            setMessage(errorData.error || 'Authentication failed. Please try again.');
          } catch {
            setStatus('error');
            setMessage('Authentication failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Network error occurred. Please check your connection and try again.');
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  const handleRetry = () => {
    // Redirect back to the appropriate auth portal
    const authUrl = userType === 'lawyer' ? '/lawyer/auth' : '/client/auth';
    navigate(authUrl);
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Authentication
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your credentials and set up your account...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            {user && (
              <div className="text-sm text-gray-500 mb-4">
                Welcome, {user.firstName} {user.lastName}!
              </div>
            )}
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Redirecting to dashboard...
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {userType === 'lawyer' ? 'Lawyer' : 'Client'} Authentication
            </h1>
            <p className="text-gray-600 text-sm">
              Secure authentication powered by trusted providers
            </p>
          </div>

          {renderContent()}

          {/* Help Section */}
          {status === 'error' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Need Help?
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Make sure you've allowed cookies in your browser</p>
                <p>• Try using an incognito/private browsing window</p>
                <p>• Check that JavaScript is enabled</p>
                <p>• Contact support if the problem persists</p>
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Having trouble?{' '}
              <a
                href="/contact"
                className="text-blue-600 hover:text-blue-500"
              >
                Contact Support
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OAuthCallback;