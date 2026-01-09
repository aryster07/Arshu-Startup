/**
 * AI Feature - Speech Recognition Hook
 * Handles voice input functionality
 */

import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * Detect if text contains Hindi characters
 */
function detectLanguage(text: string): 'en-IN' | 'hi-IN' {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hi-IN' : 'en-IN';
}

/**
 * Hook for speech recognition with Hindi/English support
 */
export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [voiceLanguage, setVoiceLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    const instance = new SpeechRecognitionAPI();
    instance.continuous = true;
    instance.interimResults = true;
    instance.lang = voiceLanguage;

    instance.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += result + ' ';
        } else {
          interimTranscript += result;
        }
      }

      const newText = finalTranscript || interimTranscript;
      
      if (newText.trim()) {
        const detectedLang = detectLanguage(newText);
        if (detectedLang !== voiceLanguage) {
          setVoiceLanguage(detectedLang);
        }
      }

      setTranscript((prev) => prev + newText);
    };

    instance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    instance.onend = () => {
      if (isListening) {
        instance.start();
      }
    };

    setRecognition(instance);

    return () => {
      instance.stop();
    };
  }, [isSupported, voiceLanguage, isListening]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.lang = voiceLanguage;
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [recognition, isListening, voiceLanguage]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  };
}
