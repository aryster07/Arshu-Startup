import { useState, useEffect, useCallback } from 'react';
import { getSpeechService, SpeechRecognitionResult } from '../services/speechService';
import { getGeminiService } from '../services/geminiService';

interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  autoDetectLanguage?: boolean;
}

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setLanguage: (lang: string) => void;
  currentLanguage: string;
  confidence: number;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(options.language || 'en-US');
  const [confidence, setConfidence] = useState(0);

  const speechService = getSpeechService();

  useEffect(() => {
    setIsSupported(speechService.isSpeechSupported());
  }, [speechService]);

  useEffect(() => {
    // Set up speech recognition callbacks
    speechService.onResult(async (result: SpeechRecognitionResult) => {
      if (result.isFinal) {
        setTranscript(prev => prev + result.transcript);
        setInterimTranscript('');
        setConfidence(result.confidence);

        // Auto-detect language if enabled
        if (options.autoDetectLanguage && result.transcript.trim()) {
          try {
            const geminiService = getGeminiService();
            const detectedLang = await geminiService.detectLanguage(result.transcript);
            if (detectedLang !== currentLanguage.split('-')[0]) {
              const newSpeechLang = detectedLang === 'hi' ? 'hi-IN' : 'en-US';
              setCurrentLanguage(newSpeechLang);
              speechService.setLanguage(newSpeechLang);
            }
          } catch (error) {
            console.warn('Language detection failed:', error);
          }
        }
      } else {
        setInterimTranscript(result.transcript);
      }
    });

    speechService.onError((errorMessage: string) => {
      setError(errorMessage);
      setIsListening(false);
    });

    speechService.onEnd(() => {
      setIsListening(false);
    });

    return () => {
      // Cleanup is handled by the speech service
    };
  }, [speechService, options.autoDetectLanguage, currentLanguage]);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    setError(null);
    
    // Request microphone permissions first
    const hasPermission = await speechService.requestPermissions();
    if (!hasPermission) {
      setError('Microphone access denied. Please allow microphone permissions.');
      return;
    }

    const started = speechService.startListening({
      language: currentLanguage,
      continuous: options.continuous ?? true,
      interimResults: options.interimResults ?? true,
      maxAlternatives: 1
    });

    if (started) {
      setIsListening(true);
      setError(null);
    } else {
      setError('Failed to start speech recognition');
    }
  }, [isSupported, currentLanguage, options.continuous, options.interimResults, speechService]);

  const stopListening = useCallback(() => {
    speechService.stopListening();
    setIsListening(false);
  }, [speechService]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setConfidence(0);
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
    speechService.setLanguage(lang);
  }, [speechService]);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage,
    currentLanguage,
    confidence
  };
}

// Language utilities
export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', geminiCode: 'en' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)', flag: '🇮🇳', geminiCode: 'hi' }
];

export function getLanguageByCode(code: string) {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
}

export function getGeminiLanguageCode(speechCode: string): string {
  const lang = getLanguageByCode(speechCode);
  return lang?.geminiCode || 'en';
}