import { useState, useEffect } from "react";
import { Scale, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OAuthButton } from "../auth/OAuthButton";
import { OTPInput } from "../auth/OTPInput";

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthPage({ onBack, onSuccess }: AuthPageProps) {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = () => {
    if (emailOrPhone) {
      setStep('otp');
      setResendTimer(30);
    }
  };

  const handleVerifyOTP = (otp: string) => {
    // Mock verification
    console.log('Verifying OTP:', otp);
    setTimeout(() => {
      onSuccess();
    }, 500);
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      // Resend OTP logic here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 p-4 bg-white rounded-full shadow-lg" style={{ borderRadius: '9999px' }}>
              <Scale className="w-10 h-10 text-primary" style={{ color: '#2563eb' }} />
            </div>
          </div>
          
          <h1 className="text-slate-900 mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>
            {step === 'login' ? 'Welcome to Law Bandhu' : 'Verify Your Account'}
          </h1>
          <p className="text-slate-600">
            {step === 'login' 
              ? 'Sign in to access your legal dashboard'
              : `We've sent a 6-digit code to ${emailOrPhone}`
            }
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-slate-200 p-8 shadow-lg" style={{ borderRadius: '12px' }}>
          {step === 'login' ? (
            <div className="space-y-6">
              {/* OAuth Buttons */}
              <div className="space-y-3">
                <OAuthButton provider="google" onClick={() => onSuccess()} />
                <OAuthButton provider="apple" onClick={() => onSuccess()} />
                <OAuthButton provider="meta" onClick={() => onSuccess()} />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-slate-500" style={{ fontSize: '14px' }}>OR</span>
                </div>
              </div>

              {/* Email/Phone Input */}
              <div className="space-y-2">
                <label className="text-slate-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Email or Phone Number
                </label>
                <Input
                  type="text"
                  placeholder="Enter your email or phone"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  style={{ borderRadius: '8px' }}
                />
              </div>

              {/* Send OTP Button */}
              <Button
                onClick={handleSendOTP}
                className="w-full bg-primary hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderRadius: '8px' }}
                disabled={!emailOrPhone}
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* OTP Input */}
              <OTPInput onComplete={handleVerifyOTP} />

              {/* Verify Button */}
              <Button
                onClick={() => handleVerifyOTP('123456')}
                className="w-full bg-primary hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderRadius: '8px' }}
              >
                Verify and Continue
              </Button>

              {/* Resend Link */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-slate-500" style={{ fontSize: '14px' }}>
                    Resend code in <span style={{ fontWeight: 600 }}>{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-primary hover:underline"
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Back to Login */}
              <button
                onClick={() => setStep('login')}
                className="w-full text-slate-600 hover:text-slate-900 transition-colors"
                style={{ fontSize: '14px' }}
              >
                Change email/phone number
              </button>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-slate-500 mt-6" style={{ fontSize: '12px' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
