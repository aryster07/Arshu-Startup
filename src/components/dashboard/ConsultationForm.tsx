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
      <div className={isOriginalLayout ? "" : "p-4 lg:p-6 border border-slate-200 rounded-lg bg-white shadow-sm"}>
        <h3 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-4 lg:mb-6">
          Book Legal Consultation
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          {/* Personal Information - Mobile responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-900 mb-2">
                Full Name *
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className="text-sm lg:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-900 mb-2">
                Phone Number *
              </label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                className="text-sm lg:text-base"
                required
              />
            </div>
          </div>

          {/* Consultation Details - Mobile responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-900 mb-2">
                Legal Domain
              </label>
              <select 
                value={formData.legalDomain}
                onChange={(e) => handleInputChange('legalDomain', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              >
                {Object.values(LEGAL_DOMAINS).map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-900 mb-2">
                Consultation Type
              </label>
              <select
                value={formData.consultationType}
                onChange={(e) => handleInputChange('consultationType', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              >
                {Object.values(CONSULTATION_TYPES).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time - Mobile responsive */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-slate-900 mb-2">
              Preferred Date & Time *
            </label>
            <Input
                type="datetime-local"
                value={formData.preferredDateTime}
                onChange={(e) => handleInputChange('preferredDateTime', e.target.value)}
                className="text-sm lg:text-base"
                required
              />
            </div>

            {/* Case Description - Mobile responsive */}
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-900 mb-2">
                Case Description *
              </label>
              <Textarea
                value={formData.caseDescription}
                onChange={(e) => handleInputChange('caseDescription', e.target.value)}
                placeholder="Briefly describe your legal issue..."
                className="min-h-[80px] lg:min-h-[100px] text-sm lg:text-base"
                required
              />
            </div>

          {/* Action Buttons - Mobile responsive */}
          <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <Button 
              type="button"
              variant="outline"
              className="text-sm lg:text-base"
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
              className="bg-blue-600 hover:bg-blue-700 px-6 lg:px-8 text-sm lg:text-base"
            >
              <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              Book Consultation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}