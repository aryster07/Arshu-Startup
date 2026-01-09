import { useState } from "react";
import { Scale, ArrowLeft, Loader2, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface UserProfileSetupProps {
  onComplete: (data: { name: string }) => void;
  onBack: () => void;
  isLoading?: boolean;
  initialName?: string;
}

export function UserProfileSetup({ onComplete, onBack, isLoading, initialName = "" }: UserProfileSetupProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    onComplete({ name: name.trim() });
  };

  // Generate initials for avatar preview
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            Back
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 p-4 bg-white rounded-full shadow-lg">
              <Scale className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-slate-900 mb-2 text-2xl font-bold">
            Complete Your Profile
          </h1>
          <p className="text-slate-600">
            Just a few details to get you started
          </p>
        </div>

        {/* Profile Preview */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              {name.trim() ? (
                <span className="text-white text-2xl font-bold">
                  {getInitials(name)}
                </span>
              ) : (
                <User className="w-10 h-10 text-white/70" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="text-lg py-6"
                autoFocus
              />
              <p className="text-xs text-slate-500">
                This name will be visible to lawyers you consult with
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-lg"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 mt-6 text-xs">
          You can update your profile details later in Settings
        </p>
      </div>
    </div>
  );
}
