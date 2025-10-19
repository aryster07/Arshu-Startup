import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { OTPInput } from './OTPInput';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Mail, Phone } from 'lucide-react';

type OTPType = 'email' | 'phone';

export const OTPVerification = () => {
  const { loginWithOTP, verifyOTP, error, isLoading } = useAuth();
  const [otpType, setOtpType] = useState<OTPType>('email');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (otpType === 'email' && !identifier.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (otpType === 'phone' && identifier.length < 10) {
      setLocalError('Please enter a valid phone number');
      return;
    }

    try {
      await loginWithOTP(identifier, otpType);
      setOtpSent(true);
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (otp.length !== 6) {
      setLocalError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const success = await verifyOTP(identifier, otp, otpType);
      if (!success) {
        setLocalError('Invalid OTP. Please try again.');
      }
      // Success handled by AuthContext - will navigate automatically
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp('');
    setLocalError(null);
  };

  return (
    <div className="space-y-6">
      {/* OTP Type Selection */}
      {!otpSent && (
        <div className="flex gap-3 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setOtpType('email')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              otpType === 'email'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setOtpType('phone')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              otpType === 'phone'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            Phone
          </button>
        </div>
      )}

      {/* Error Display */}
      {(error || localError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Enter Email/Phone */}
      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">
              {otpType === 'email' ? 'Email Address' : 'Phone Number'}
            </Label>
            <Input
              id="identifier"
              type={otpType === 'email' ? 'email' : 'tel'}
              placeholder={
                otpType === 'email' ? 'Enter your email' : '+91 1234567890'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              {otpType === 'email'
                ? 'We\'ll send a 6-digit code to your email'
                : 'We\'ll send a 6-digit code to your phone'}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </Button>
        </form>
      ) : (
        /* Step 2: Verify OTP */
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label>Enter 6-Digit OTP</Label>
            <p className="text-sm text-gray-600">
              OTP sent to <span className="font-medium">{identifier}</span>
            </p>
            <OTPInput value={otp} onChange={setOtp} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={resetForm}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Change {otpType === 'email' ? 'email' : 'phone'}
            </button>
            <button
              type="button"
              onClick={handleSendOTP}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
