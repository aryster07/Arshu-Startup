import React from 'react';
import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Textarea } from '../../../shared/components/ui/textarea';
import { Badge } from '../../../shared/components/ui/badge';
import { Send, Volume2 } from 'lucide-react';

interface LegalInputFormProps {
  analysisText: string;
  onAnalysisTextChange: (text: string) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  speechError: string | null;
  nonLegalMessage: string;
}

export default function LegalInputForm({
  analysisText,
  onAnalysisTextChange,
  onSubmit,
  isAnalyzing,
  isListening,
  transcript,
  interimTranscript,
  confidence,
  speechError,
  nonLegalMessage
}: LegalInputFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="legal-issue" className="block text-sm font-medium text-slate-700 mb-2">
            Describe your legal issue or question
            <span className="text-xs text-slate-500 ml-2">(Ctrl+Enter to analyze)</span>
          </label>
          <Textarea
            id="legal-issue"
            value={analysisText}
            onChange={(e) => onAnalysisTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Please describe your legal concern in detail. For example: 'My landlord is not returning my security deposit despite giving proper notice...' or 'I was terminated from my job without proper notice...'"
            className="min-h-[120px] resize-none"
            disabled={isAnalyzing}
          />
          
          {/* Speech Recognition Status */}
          {isListening && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-blue-600 animate-pulse" />
                  <span className="text-sm font-medium text-blue-700">Listening...</span>
                </div>
                {confidence > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Confidence: {Math.round(confidence * 100)}%
                  </Badge>
                )}
              </div>
              
              {transcript && (
                <div className="text-sm text-slate-700 bg-white p-2 rounded border">
                  <span className="font-medium">Recognized: </span>
                  {transcript}
                  {interimTranscript && (
                    <span className="text-slate-400 italic"> {interimTranscript}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Speech Error */}
          {speechError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              Speech recognition error: {speechError}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!analysisText.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing Your Legal Rights...
            </div>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Analyze Legal Rights
              <span className="text-xs ml-2 opacity-75">(Ctrl+Enter)</span>
            </>
          )}
        </Button>
      </form>

      {/* Non-Legal Content Warning */}
      {nonLegalMessage && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-start space-x-2">
            <div className="text-orange-600">⚠️</div>
            <div>
              <h4 className="font-medium text-orange-800 mb-1">Legal Content Required</h4>
              <p className="text-sm text-orange-700">{nonLegalMessage}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}