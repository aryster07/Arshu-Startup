import { useState } from "react";
import { Scale, ArrowLeft, Loader2, Upload, Camera, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface LawyerProfileData {
  name: string;
  specialization: string[];
  jurisdiction: string;
  barCouncilId: string;
  yearsOfExperience: number;
  education: string;
  languages: string[];
  consultationFee: number;
  bio: string;
  officeAddress: string;
  profilePicture?: string;
}

interface LawyerProfileSetupProps {
  onComplete: (data: LawyerProfileData) => void;
  onBack: () => void;
  isLoading?: boolean;
  initialData?: Partial<LawyerProfileData>;
}

const SPECIALIZATIONS = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Corporate Law",
  "Tax Law",
  "Real Estate",
  "Intellectual Property",
  "Labor Law",
  "Immigration",
  "Constitutional Law",
  "Environmental Law",
  "Consumer Protection",
];

const JURISDICTIONS = [
  "Supreme Court of India",
  "Delhi High Court",
  "Mumbai High Court",
  "Kolkata High Court",
  "Chennai High Court",
  "Karnataka High Court",
  "Hyderabad High Court",
  "Allahabad High Court",
  "Punjab & Haryana High Court",
  "Gujarat High Court",
  "Rajasthan High Court",
  "Kerala High Court",
  "District Courts",
  "Other",
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Urdu",
];

export function LawyerProfileSetup({ onComplete, onBack, isLoading, initialData }: LawyerProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<string | null>(initialData?.profilePicture || null);
  const [formData, setFormData] = useState<Partial<LawyerProfileData>>({
    name: initialData?.name || "",
    specialization: initialData?.specialization || [],
    jurisdiction: initialData?.jurisdiction || "",
    barCouncilId: initialData?.barCouncilId || "",
    yearsOfExperience: initialData?.yearsOfExperience || 0,
    education: initialData?.education || "",
    languages: initialData?.languages || [],
    consultationFee: initialData?.consultationFee || 500,
    bio: initialData?.bio || "",
    officeAddress: initialData?.officeAddress || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, profilePicture: "Image must be less than 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        setErrors({ ...errors, profilePicture: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
  };

  const toggleSpecialization = (spec: string) => {
    const current = formData.specialization || [];
    if (current.includes(spec)) {
      setFormData({ ...formData, specialization: current.filter((s) => s !== spec) });
    } else if (current.length < 3) {
      setFormData({ ...formData, specialization: [...current, spec] });
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = formData.languages || [];
    if (current.includes(lang)) {
      setFormData({ ...formData, languages: current.filter((l) => l !== lang) });
    } else {
      setFormData({ ...formData, languages: [...current, lang] });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.barCouncilId?.trim()) {
      newErrors.barCouncilId = "Bar Council ID is required";
    }
    if (!formData.jurisdiction) {
      newErrors.jurisdiction = "Jurisdiction is required";
    }
    if ((formData.specialization || []).length === 0) {
      newErrors.specialization = "Select at least one specialization";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.yearsOfExperience || formData.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = "Valid experience is required";
    }
    if (!formData.education?.trim()) {
      newErrors.education = "Education is required";
    }
    if ((formData.languages || []).length === 0) {
      newErrors.languages = "Select at least one language";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...formData,
      profilePicture: profilePicture || undefined,
    } as LawyerProfileData);
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {step > 1 ? "Previous Step" : "Back"}
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 p-4 bg-white rounded-full shadow-lg">
              <Scale className="w-10 h-10 text-amber-600" />
            </div>
          </div>
          
          <h1 className="text-slate-900 mb-2 text-2xl font-bold">
            Set Up Your Lawyer Profile
          </h1>
          <p className="text-slate-600">
            Step {step} of 3 - {step === 1 ? "Basic Information" : step === 2 ? "Professional Details" : "Final Touches"}
          </p>

          {/* Progress Bar */}
          <div className="flex gap-2 justify-center mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s <= step ? "bg-amber-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <>
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg overflow-hidden">
                      {profilePicture ? (
                        <img 
                          src={profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : formData.name?.trim() ? (
                        <span className="text-white text-2xl font-bold">
                          {getInitials(formData.name)}
                        </span>
                      ) : (
                        <Camera className="w-10 h-10 text-white/70" />
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-amber-600 transition-colors">
                      <Upload className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {profilePicture && (
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                </div>
                {errors.profilePicture && (
                  <p className="text-center text-red-500 text-sm">{errors.profilePicture}</p>
                )}
                <p className="text-center text-slate-500 text-sm mb-6">
                  Upload a professional photo (optional)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barCouncilId">Bar Council ID *</Label>
                    <Input
                      id="barCouncilId"
                      placeholder="e.g., DL/1234/2020"
                      value={formData.barCouncilId}
                      onChange={(e) => setFormData({ ...formData, barCouncilId: e.target.value })}
                      className={errors.barCouncilId ? "border-red-500" : ""}
                    />
                    {errors.barCouncilId && <p className="text-red-500 text-xs">{errors.barCouncilId}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Jurisdiction *</Label>
                  <Select
                    value={formData.jurisdiction}
                    onValueChange={(value) => setFormData({ ...formData, jurisdiction: value })}
                  >
                    <SelectTrigger className={errors.jurisdiction ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your primary jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      {JURISDICTIONS.map((j) => (
                        <SelectItem key={j} value={j}>
                          {j}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jurisdiction && <p className="text-red-500 text-xs">{errors.jurisdiction}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Specializations * (Select up to 3)</Label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALIZATIONS.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          (formData.specialization || []).includes(spec)
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                  {errors.specialization && <p className="text-red-500 text-xs">{errors.specialization}</p>}
                </div>
              </>
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      max="60"
                      placeholder="Years of practice"
                      value={formData.yearsOfExperience || ""}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                      className={errors.yearsOfExperience ? "border-red-500" : ""}
                    />
                    {errors.yearsOfExperience && <p className="text-red-500 text-xs">{errors.yearsOfExperience}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fee">Consultation Fee (₹) *</Label>
                    <Input
                      id="fee"
                      type="number"
                      min="0"
                      placeholder="Fee per consultation"
                      value={formData.consultationFee || ""}
                      onChange={(e) => setFormData({ ...formData, consultationFee: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education *</Label>
                  <Input
                    id="education"
                    placeholder="e.g., LLB from Delhi University, LLM from NLU"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className={errors.education ? "border-red-500" : ""}
                  />
                  {errors.education && <p className="text-red-500 text-xs">{errors.education}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Languages Spoken *</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          (formData.languages || []).includes(lang)
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  {errors.languages && <p className="text-red-500 text-xs">{errors.languages}</p>}
                </div>
              </>
            )}

            {/* Step 3: Final Touches */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell potential clients about your experience and approach..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                  <p className="text-xs text-slate-500">
                    A good bio helps clients understand your expertise
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Office Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your office address..."
                    value={formData.officeAddress}
                    onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                    rows={2}
                  />
                </div>

                {/* Summary */}
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-3">Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-600">Name:</div>
                    <div className="font-medium">{formData.name}</div>
                    <div className="text-slate-600">Bar Council ID:</div>
                    <div className="font-medium">{formData.barCouncilId}</div>
                    <div className="text-slate-600">Jurisdiction:</div>
                    <div className="font-medium">{formData.jurisdiction}</div>
                    <div className="text-slate-600">Experience:</div>
                    <div className="font-medium">{formData.yearsOfExperience} years</div>
                    <div className="text-slate-600">Fee:</div>
                    <div className="font-medium">₹{formData.consultationFee}</div>
                    <div className="text-slate-600">Specializations:</div>
                    <div className="font-medium">{(formData.specialization || []).join(", ")}</div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step < 3 ? (
                <Button 
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-6 bg-amber-500 hover:bg-amber-600"
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="flex-1 py-6 bg-amber-500 hover:bg-amber-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    "Complete Profile"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-slate-500 mt-6 text-xs">
          Your profile will be verified before it appears in search results
        </p>
      </div>
    </div>
  );
}
