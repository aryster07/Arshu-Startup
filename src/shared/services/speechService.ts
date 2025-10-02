export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  language: string;
}

export interface SpeechRecognitionOptions {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private onResultCallback?: (result: SpeechRecognitionResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;
  private currentLanguage: string = 'en-US';

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.currentLanguage;

    // Set up event handlers
    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence || 0.9;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          if (this.onResultCallback) {
            this.onResultCallback({
              transcript: finalTranscript,
              confidence,
              isFinal: true,
              language: this.currentLanguage
            });
          }
        } else {
          interimTranscript += transcript;
          if (this.onResultCallback) {
            this.onResultCallback({
              transcript: interimTranscript,
              confidence,
              isFinal: false,
              language: this.currentLanguage
            });
          }
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition error occurred';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
          break;
        case 'network':
          errorMessage = 'Network error occurred during speech recognition.';
          break;
        case 'language-not-supported':
          errorMessage = 'Selected language not supported for speech recognition.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
    };
  }

  /**
   * Check if speech recognition is supported
   */
  public isSpeechSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if currently listening
   */
  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Start speech recognition
   */
  public startListening(options?: Partial<SpeechRecognitionOptions>): boolean {
    if (!this.isSupported || !this.recognition || this.isListening) {
      return false;
    }

    try {
      // Update settings if provided
      if (options) {
        if (options.language) {
          this.currentLanguage = options.language;
          this.recognition.lang = options.language;
        }
        if (options.continuous !== undefined) {
          this.recognition.continuous = options.continuous;
        }
        if (options.interimResults !== undefined) {
          this.recognition.interimResults = options.interimResults;
        }
        if (options.maxAlternatives !== undefined) {
          this.recognition.maxAlternatives = options.maxAlternatives;
        }
      }

      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback('Failed to start speech recognition');
      }
      return false;
    }
  }

  /**
   * Stop speech recognition
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Set callback for speech recognition results
   */
  public onResult(callback: (result: SpeechRecognitionResult) => void): void {
    this.onResultCallback = callback;
  }

  /**
   * Set callback for speech recognition errors
   */
  public onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Set callback for when speech recognition ends
   */
  public onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  /**
   * Get supported languages
   */
  public getSupportedLanguages(): Array<{ code: string; name: string; speechCode: string }> {
    return [
      { code: 'en', name: 'English', speechCode: 'en-US' },
      { code: 'hi', name: 'हिंदी (Hindi)', speechCode: 'hi-IN' },
      { code: 'en-GB', name: 'English (UK)', speechCode: 'en-GB' },
      { code: 'en-AU', name: 'English (Australia)', speechCode: 'en-AU' }
    ];
  }

  /**
   * Request microphone permissions
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Set language for speech recognition
   */
  public setLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }
  }
}

// Create singleton instance
let speechServiceInstance: SpeechRecognitionService | null = null;

export function getSpeechService(): SpeechRecognitionService {
  if (!speechServiceInstance) {
    speechServiceInstance = new SpeechRecognitionService();
  }
  return speechServiceInstance;
}