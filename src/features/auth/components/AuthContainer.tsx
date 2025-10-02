import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthScreen = 'signin' | 'signup' | 'forgot-password';

interface AuthContainerProps {
  initialScreen?: AuthScreen;
  onNavigate?: (screen: string) => void;
}

export default function AuthContainer({ initialScreen = 'signin', onNavigate }: AuthContainerProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>(initialScreen);

  const handleScreenChange = (screen: AuthScreen) => {
    setCurrentScreen(screen);
  };

  const handleNavigate = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  switch (currentScreen) {
    case 'signup':
      return (
        <SignUpForm
          onNavigate={handleNavigate}
          onSignIn={() => handleScreenChange('signin')}
        />
      );
    
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          onNavigate={handleNavigate}
          onBackToSignIn={() => handleScreenChange('signin')}
        />
      );
    
    case 'signin':
    default:
      return (
        <SignInForm
          onNavigate={handleNavigate}
          onSignUp={() => handleScreenChange('signup')}
          onForgotPassword={() => handleScreenChange('forgot-password')}
        />
      );
  }
}