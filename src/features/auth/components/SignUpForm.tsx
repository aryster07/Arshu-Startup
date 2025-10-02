import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

interface SignUpFormProps {
  onNavigate?: (screen: string) => void;
  onSignIn?: () => void;
}

export default function SignUpForm({ onNavigate, onSignIn }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Account Setup

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Validate personal info
      if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.city) {
        setStep(2);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement registration logic here
    console.log('Sign up form submitted:', formData);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to verification or dashboard
      onNavigate?.('dashboard');
    }, 1000);
  };

  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Join Law Bandhu</h1>
          <p className="text-slate-600">Create your account to access legal services</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            1
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            2
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="h-12"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="h-12"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              Continue
            </Button>
          </form>
        )}

        {/* Step 2: Account Setup */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <p className={`text-sm mt-1 ${isPasswordValid ? 'text-green-600' : 'text-red-600'}`}>
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`text-sm mt-1 ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-4 text-sm text-slate-500">or</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSignIn}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </Card>
    </div>
  );
}