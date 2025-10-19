import { useState } from "react";
import { Scale, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { OAuthButtons } from "../auth/OAuthButtons";
import { OTPVerification } from "../auth/OTPVerification";

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'oauth' | 'otp'>('oauth');



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
            Welcome to Law Bandhu
          </h1>
          <p className="text-slate-600">
            Sign in to access your legal dashboard
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-slate-200 p-8 shadow-lg" style={{ borderRadius: '12px' }}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'oauth' | 'otp')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="oauth">Social Login</TabsTrigger>
              <TabsTrigger value="otp">Email/Phone OTP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="oauth" className="mt-0">
              <OAuthButtons />
            </TabsContent>
            
            <TabsContent value="otp" className="mt-0">
              <OTPVerification />
            </TabsContent>
          </Tabs>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-slate-500 mt-6" style={{ fontSize: '12px' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
