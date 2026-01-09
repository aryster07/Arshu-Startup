import { Scale, User, Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface RoleSelectionPageProps {
  onSelectUser: () => void;
  onSelectLawyer: () => void;
  onBack: () => void;
}

export function RoleSelectionPage({ onSelectUser, onSelectLawyer, onBack }: RoleSelectionPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
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
            <div className="inline-flex items-center gap-2 p-4 bg-white rounded-full shadow-lg">
              <Scale className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-slate-900 mb-2 text-3xl font-bold">
            Welcome to Law Bandhu
          </h1>
          <p className="text-slate-600 text-lg">
            How would you like to continue?
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Card */}
          <button
            onClick={onSelectUser}
            className="group bg-white border-2 border-slate-200 hover:border-blue-500 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-left"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <User className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                I'm a User
              </h2>
              <p className="text-slate-600 text-sm">
                Looking for legal help? Find lawyers, get consultations, and manage your cases.
              </p>
            </div>
          </button>

          {/* Lawyer Card */}
          <button
            onClick={onSelectLawyer}
            className="group bg-white border-2 border-slate-200 hover:border-amber-500 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-left"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                <Briefcase className="w-10 h-10 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                I'm a Lawyer
              </h2>
              <p className="text-slate-600 text-sm">
                Join our platform to connect with clients and grow your practice.
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 mt-8 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
