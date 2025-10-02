import React from 'react';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { 
  Shield, 
  Users, 
  FileText, 
  Scale, 
  BookOpen,
  Mic,
  MicOff,
  Languages
} from 'lucide-react';

interface LegalCategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
  isListening: boolean;
  isSpeechSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  supportedLanguages: Array<{ code: string; name: string; nativeName: string }>;
}

const legalCategories = [
  { id: 'criminal', name: 'Criminal Law', icon: <Shield className="h-5 w-5" /> },
  { id: 'civil', name: 'Civil Rights', icon: <Users className="h-5 w-5" /> },
  { id: 'consumer', name: 'Consumer Law', icon: <FileText className="h-5 w-5" /> },
  { id: 'employment', name: 'Labor Law', icon: <Scale className="h-5 w-5" /> },
  { id: 'property', name: 'Property Law', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'family', name: 'Family Law', icon: <Users className="h-5 w-5" /> }
];

export default function LegalCategorySelector({
  selectedCategory,
  onCategorySelect,
  selectedLanguage,
  onLanguageSelect,
  isListening,
  isSpeechSupported,
  onStartListening,
  onStopListening,
  supportedLanguages
}: LegalCategorySelectorProps) {
  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Languages className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-slate-700">Language</span>
        </div>
        <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Speech Recognition Button */}
      {isSpeechSupported && (
        <div className="flex justify-center">
          <Button
            onClick={isListening ? onStopListening : onStartListening}
            variant={isListening ? "destructive" : "outline"}
            size="lg"
            className={`transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </>
            )}
          </Button>
        </div>
      )}

      {/* Legal Categories */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Legal Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {legalCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                {category.icon}
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            </button>
          ))}
        </div>
        {selectedCategory && (
          <div className="mt-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Selected: {legalCategories.find(cat => cat.id === selectedCategory)?.name}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}