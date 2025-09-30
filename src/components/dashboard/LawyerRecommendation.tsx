import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Star, MapPin, Clock, DollarSign, Phone, MessageCircle } from 'lucide-react';
import { getLawyersBySpecialization, Lawyer } from '../../constants/legal/lawyers';

interface LawyerRecommendationProps {
  specialization: string;
  className?: string;
}

export function LawyerRecommendation({ specialization, className = "" }: LawyerRecommendationProps) {
  const [showLawyers, setShowLawyers] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);

  console.log('👨‍⚖️ LawyerRecommendation component rendered with specialization:', specialization);

  const lawyers = getLawyersBySpecialization(specialization);
  console.log('📋 Found lawyers for specialization:', lawyers.length, 'lawyers');

  const handleShowLawyers = () => {
    console.log('🔍 Showing lawyers for:', specialization);
    setShowLawyers(true);
  };

  const handleContactLawyer = (lawyer: Lawyer) => {
    // In a real app, this would open a contact form or initiate communication
    alert(`Contact ${lawyer.name}: This feature will be implemented to connect you directly with the lawyer.`);
  };

  if (!showLawyers) {
    return (
      <div className={`mt-4 p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2 mb-3">
          <Users className="h-5 w-5 text-green-600" />
          <h5 className="font-medium text-green-900">Expert Legal Assistance Recommended</h5>
        </div>
        <p className="text-green-800 mb-3">
          Based on your case analysis, we recommend consulting with a <strong>{specialization}</strong> for professional legal guidance.
        </p>
        <Button
          onClick={handleShowLawyers}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <Users className="h-4 w-4 mr-2" />
          Find Expert {specialization}s ({lawyers.length} Available)
        </Button>
      </div>
    );
  }

  return (
    <div className={`mt-4 ${className}`}>
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <h5 className="font-medium text-green-900">Available {specialization}s</h5>
          </div>
          <Badge variant="outline" className="text-green-700 border-green-300">
            {lawyers.length} Experts Found
          </Badge>
        </div>

        <div className="space-y-4">
          {lawyers.slice(0, 3).map((lawyer) => (
            <Card key={lawyer.id} className="p-4 bg-white border border-green-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h6 className="font-semibold text-slate-900">{lawyer.name}</h6>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-600">{lawyer.rating}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{lawyer.experience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{lawyer.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>₹{lawyer.consultationFee} consultation</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs">
                        {lawyer.cases_won} cases won
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-slate-700">{lawyer.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {lawyer.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {lawyer.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{lawyer.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleContactLawyer(lawyer)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Contact Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLawyer(lawyer)}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {lawyers.length > 3 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All {lawyers.length} {specialization}s
            </Button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-xs text-green-700">
            💡 <strong>Pro Tip:</strong> Book a consultation to discuss your case in detail and get personalized legal strategy.
          </p>
        </div>
      </Card>
    </div>
  );
}