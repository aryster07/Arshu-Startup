import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Calendar } from 'lucide-react';
import { LEGAL_DOMAINS, CONSULTATION_TYPES } from '../../constants/dashboard';
import { ConsultationBooking } from '../../types/dashboard';

interface ConsultationFormProps {
  className?: string;
  onSubmit?: (booking: ConsultationBooking) => void;
  isOriginalLayout?: boolean;
}

export function ConsultationForm({ className = "", onSubmit, isOriginalLayout = false }: ConsultationFormProps) {
  const [formData, setFormData] = useState<ConsultationBooking>({
    fullName: '',
    phoneNumber: '',
    legalDomain: LEGAL_DOMAINS.CIVIL,
    consultationType: CONSULTATION_TYPES.VIDEO_CALL,
    preferredDateTime: '',
    caseDescription: ''
  });

  const handleInputChange = (field: keyof ConsultationBooking, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const isFormValid = () => {
    return formData.fullName.trim() && 
           formData.phoneNumber.trim() && 
           formData.preferredDateTime && 
           formData.caseDescription.trim();
  };

  return (
    <div className={className}>
      <div className={isOriginalLayout ? "" : "p-6 border border-slate-200 rounded-lg bg-white shadow-sm"}>
        <h3 className="text-2xl font-semibold text-slate-900 mb-6">
          Book Legal Consultation
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Full Name *
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Phone Number *
              </label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                required
              />
            </div>
          </div>

          {/* Consultation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Legal Domain
              </label>
              <select 
                value={formData.legalDomain}
                onChange={(e) => handleInputChange('legalDomain', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(LEGAL_DOMAINS).map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Consultation Type
              </label>
              <select
                value={formData.consultationType}
                onChange={(e) => handleInputChange('consultationType', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(CONSULTATION_TYPES).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Preferred Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.preferredDateTime}
                onChange={(e) => handleInputChange('preferredDateTime', e.target.value)}
                required
              />
            </div>

            {/* Case Description */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Case Description *
              </label>
              <Textarea
                value={formData.caseDescription}
                onChange={(e) => handleInputChange('caseDescription', e.target.value)}
                placeholder="Briefly describe your legal issue..."
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setFormData({
                fullName: '',
                phoneNumber: '',
                legalDomain: LEGAL_DOMAINS.CIVIL,
                consultationType: CONSULTATION_TYPES.VIDEO_CALL,
                preferredDateTime: '',
                caseDescription: ''
              })}
            >
              {isOriginalLayout ? "Save Draft" : "Clear Form"}
            </Button>
            <Button 
              type="submit"
              disabled={!isFormValid()}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Consultation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}