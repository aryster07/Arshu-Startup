import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Menu, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getOAuthUrl } from '../../config/api';
import ClientAuthPortalPC from './ClientAuthPortalPC';

// Social media icons for login
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const ClientAuthPortal: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Default to Sign In
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Check if screen is desktop size
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // If desktop, show PC version
  if (isDesktop) {
    return <ClientAuthPortalPC />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Registration specific validation
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!agreeToTerms) {
        newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isLogin) {
        setSuccess('Sign in successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/client/dashboard';
        }, 2000);
      } else {
        setSuccess('Registration successful! Please check your email for verification.');
      }
    } catch (error) {
      setErrors({ submit: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 lg:px-8 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-bold">LB</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">LawB</span>
          <span className="hidden sm:inline text-sm text-gray-500 ml-2">Professional Legal Services</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
          <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
          <a href="/team" className="text-gray-600 hover:text-gray-900 transition-colors">Team</a>
          <a href="/works" className="text-gray-600 hover:text-gray-900 transition-colors">Works</a>
          <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
          <div className="relative group">
            <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1">
              <span>Services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-8 lg:py-16">
        {/* Form Container */}
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {isLogin 
                ? 'Access your LawB account'
                : 'Create your client account to get started with LawB services.'
              }
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-green-800 text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-800 text-sm">{errors.submit}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Registration only) */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-0 relative !bg-white ${errors.fullName ? 'border-red-300' : ''}`}
                    placeholder="Full Name"
                    style={{ height: '48px', paddingLeft: '40px' }}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-0 relative !bg-white ${errors.email ? 'border-red-300' : ''}`}
                  placeholder="Email address"
                  style={{ height: '48px', paddingLeft: '40px' }}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Number (Registration only) */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-0 relative !bg-white ${errors.phoneNumber ? 'border-red-300' : ''}`}
                    placeholder="Phone Number"
                    style={{ height: '48px', paddingLeft: '40px' }}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-0 relative !bg-white ${errors.password ? 'border-red-300' : ''}`}
                  placeholder="Password"
                  style={{ height: '48px', paddingLeft: '40px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (Registration only) */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-0 relative !bg-white ${errors.confirmPassword ? 'border-red-300' : ''}`}
                    placeholder="Confirm Password"
                    style={{ height: '48px', paddingLeft: '40px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Terms and Conditions (Registration only) */}
            {!isLogin && (
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isLogin ? 'Signing In...' : 'Signing Up...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>

          {/* Toggle Form */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                className="ml-2 text-blue-600 hover:underline font-medium"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setSuccess('');
                  setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    confirmPassword: ''
                  });
                  setAgreeToTerms(false);
                }}
              >
                {isLogin ? 'Sign up here' : 'Log in here'}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="text-center text-sm text-gray-500">
            Or Continue With Account
          </div>

          {/* Social Login */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => window.location.href = getOAuthUrl('google', 'client')}
            >
              <GoogleIcon />
            </button>
            <button
              type="button"
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#000" d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.463-2.001 4.568C14.568 13.728 13.252 14.4 12 14.4s-2.568-.672-3.567-1.672c-1.105-1.105-1.832-2.71-2.001-4.568-.016-.182-.032-.364-.032-.546 0-.182.016-.364.032-.546.169-1.858.896-3.463 2.001-4.568C9.432 2.472 10.748 1.8 12 1.8s2.568.672 3.567 1.672c1.105 1.105 1.832 2.71 2.001 4.568.016.182.032.364.032.546 0 .182-.016.364-.032.546z"/>
              </svg>
            </button>
            <button
              type="button"
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => window.location.href = getOAuthUrl('apple', 'client')}
            >
              <AppleIcon />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-gray-900 text-sm font-bold">LB</span>
            </div>
            <div>
              <span className="text-lg font-semibold">LawB</span>
              <p className="text-sm text-gray-400">Professional Legal Services</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-8 max-w-md">
            Professional legal solutions platform connecting clients with certified legal professionals. 
            Expert guidance for comprehensive legal assistance across all practice areas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Legal Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Legal Rights Assessment</li>
                <li>Consumer Protection</li>
                <li>Legal Notice Drafting</li>
                <li>Legal Consultation</li>
                <li>Emergency Legal Services</li>
                <li>About Our Firm</li>
              </ul>
            </div>

            {/* Professional Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Professional Contact</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <div>
                    <p className="text-sm text-gray-400">24/7 Legal Hotline</p>
                    <p className="font-medium">+91 6230244977</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <div>
                    <p className="text-sm text-gray-400">Professional Email</p>
                    <p className="font-medium">arshrana762@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-400">Service Jurisdiction</p>
                    <p className="font-medium">India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional space for layout */}
            <div></div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-400">
                © 2024 Law Bandhu (LawB). Professional Legal Services. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="/privacy" className="hover:text-white">Privacy Policy</a>
                <a href="/terms" className="hover:text-white">Terms of Service</a>
                <a href="/legal" className="hover:text-white">Legal Disclaimer</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientAuthPortal;