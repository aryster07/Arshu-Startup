import { useState, useEffect } from "react";
import { Mic, Send, Scale, RotateCcw, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { aiService } from "../../services/aiService";
import { isLegalQuery, getNonLegalResponse } from "../../utils/legalQueryValidator";
import { FormattedMessage } from "./FormattedMessage";

const sarcasticLoadingMessages = [
  "Consulting ancient legal scrolls...",
  "Bribing the law library ghost...",
  "Translating legalese to human...",
  "Waking up the lawyers...",
  "Dusting off law books from 1850...",
  "Asking my lawyer friend (he's slow)...",
  "Decoding legal jargon...",
  "Summoning the court spirits...",
  "Reading the fine print...",
  "Consulting with my imaginary legal team...",
  "Searching through case files (the old way)...",
  "Bribing the AI with coffee...",
  "Convincing the algorithm to help...",
  "Teaching the AI about Indian law...",
  "Waiting for legal enlightenment...",
];

const funnyErrorMessages = [
  "Oops! Our AI lawyer just took an unscheduled coffee break ☕",
  "The legal genie went back into the bottle! 🧞‍♂️",
  "Our AI got stage fright in the courtroom 😰",
  "The law books fell on our AI's head... literally 📚💥",
  "AI.exe has stopped working (just like your patience) 🤖",
  "Our digital lawyer ghosted us 👻",
  "The AI went to grab lunch... without telling us 🍔",
  "Houston, we have a legal problem 🚀",
  "The hamster powering our AI stopped running 🐹",
  "Our AI is playing hide and seek (and winning) 🙈",
  "Technical difficulties: AI developed feelings and needs therapy 💭",
  "Error 404: Legal wisdom not found (but we're looking!) 🔍",
];

interface AIResponse {
  text: string;
  provider?: string;
  isPersonalIssue?: boolean;
  legalField?: string | null;
}

interface AILegalAssistantProps {
  onNavigate?: (view: string) => void;
}

export function AILegalAssistant({ onNavigate }: AILegalAssistantProps = {}) {
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [funnyErrorMessage, setFunnyErrorMessage] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceLanguage, setVoiceLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');

  // Detect language from text (basic Hindi detection)
  const detectLanguage = (text: string): 'en-IN' | 'hi-IN' => {
    // Check if text contains Devanagari characters (Hindi)
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text) ? 'hi-IN' : 'en-IN';
  };

  // Check if AI service is configured on mount
  useEffect(() => {
    const configured = aiService.isConfigured();
    setIsConfigured(configured);
    console.log('AI Service configured:', configured);
    console.log('Configured providers:', aiService.getConfiguredProviders());
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = voiceLanguage;

        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const newText = finalTranscript || interimTranscript;
          
          // Auto-detect language from speech and switch if needed
          if (newText.trim()) {
            const detectedLang = detectLanguage(newText);
            if (detectedLang !== voiceLanguage) {
              setVoiceLanguage(detectedLang);
            }
          }

          // Update query with final or interim transcript
          setQuery((prev) => prev + newText);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'no-speech') {
            console.log('No speech detected, continuing...');
          } else {
            setIsListening(false);
          }
        };

        recognitionInstance.onend = () => {
          if (isListening) {
            // Restart if still in listening mode
            recognitionInstance.start();
          }
        };

        setRecognition(recognitionInstance);
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, [voiceLanguage]);

  // Rotating sarcastic loading messages
  useEffect(() => {
    if (isAnalyzing) {
      // Set initial message
      setLoadingMessage(sarcasticLoadingMessages[Math.floor(Math.random() * sarcasticLoadingMessages.length)]);
      
      // Rotate every 3 seconds
      const interval = setInterval(() => {
        setLoadingMessage(sarcasticLoadingMessages[Math.floor(Math.random() * sarcasticLoadingMessages.length)]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    // Save the query for retry functionality
    setLastQuery(query);
    
    // Clear any previous errors and response
    setError(null);
    setResponse(null);

    // Check if the query is legal-related
    const queryCheck = isLegalQuery(query);

    setIsAnalyzing(true);
    
    // Clear the input field immediately
    const currentQuery = query;
    setQuery("");

    // If query is clearly non-legal, respond immediately without calling API
    if (!queryCheck.isLegal && queryCheck.confidence === 'high') {
      setTimeout(() => {
        setResponse({
          text: getNonLegalResponse(),
          provider: 'Law Bandhu Assistant',
        });
        setIsAnalyzing(false);
      }, 500);
      return;
    }

    // For potentially legal queries, call the AI service
    try {
      // Call AI service with automatic fallback
      const apiResponse = await aiService.analyzeLegalQuery(currentQuery);

      setResponse({
        text: apiResponse.text,
        provider: apiResponse.provider,
        isPersonalIssue: apiResponse.isPersonalIssue,
        legalField: apiResponse.legalField,
      });

      if (!apiResponse.success) {
        setError(`Unable to get AI response. ${apiResponse.error || 'Please try again.'}`);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setFunnyErrorMessage(funnyErrorMessages[Math.floor(Math.random() * funnyErrorMessages.length)]);
      console.error('AI Analysis Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewQuery = () => {
    setQuery("");
    setResponse(null);
    setError(null);
    setLastQuery("");
    setFunnyErrorMessage("");
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleRetry = async () => {
    if (lastQuery) {
      setQuery(lastQuery);
      await handleAnalyze();
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      // Stop listening
      recognition.stop();
      setIsListening(false);
    } else {
      // Start listening
      try {
        recognition.lang = voiceLanguage;
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Stop voice input if active
      if (isListening && recognition) {
        recognition.stop();
        setIsListening(false);
      }
      handleAnalyze();
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6" style={{ borderRadius: "16px" }}>
      {/* Header - Centered */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
          <Scale className="w-7 h-7" style={{ color: '#2563eb' }} />
        </div>
        <h2 className="text-slate-900 font-serif-legal mb-1" style={{ fontSize: "18px", fontWeight: 700 }}>
          AI Legal Assistant
        </h2>
        <p className="text-slate-500" style={{ fontSize: "13px" }}>
          Get instant legal guidance powered by AI
        </p>
      </div>

      {/* Configuration Warning */}
      {!isConfigured && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            ⚠️ AI service is not configured. Please add your API keys to the .env file.
          </p>
        </div>
      )}

      {/* Error Display with Retry Button */}
      {error && (
        <div className="mb-4 space-y-4">
          {/* Funny Error Message Card */}
          <div 
            className="relative overflow-hidden"
            style={{ 
              borderRadius: "16px",
              background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
              border: "2px solid #fca5a5",
              boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)"
            }}
          >
            {/* Decorative top bar */}
            <div 
              style={{
                height: "6px",
                background: "linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f87171 100%)",
              }}
            />
            
            <div className="p-8 text-center">
              <div className="mb-4">
                <div className="text-6xl mb-4">😅</div>
                <h3 className="text-xl font-bold text-red-900 mb-3">
                  {funnyErrorMessage || "Oops! Something went wrong"}
                </h3>
                <p className="text-red-700 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleRetry}
              style={{ 
                fontSize: "14px", 
                padding: "12px 28px", 
                borderRadius: "8px",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                border: "2px solid #dc2626",
                fontWeight: "600",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              className="hover:bg-red-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button
              onClick={handleNewQuery}
              style={{ 
                fontSize: "14px", 
                padding: "12px 28px", 
                borderRadius: "8px",
                backgroundColor: "#1e293b",
                color: "#ffffff",
                border: "2px solid #1e293b",
                fontWeight: "600",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              className="hover:bg-slate-900 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Query
            </Button>
          </div>
        </div>
      )}

      {/* AI Response Display */}
      {response && !isAnalyzing && (
        <div className="mb-4 space-y-4">
          {/* Show the user's query */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
              border: "2px solid #cbd5e1",
            }}
          >
            <p className="text-sm font-semibold text-slate-600 mb-1">Your Query:</p>
            <p className="text-base text-slate-900">{lastQuery}</p>
          </div>

          {/* Response Card with Enhanced Styling */}
          <div 
            className="relative overflow-hidden"
            style={{ 
              borderRadius: "16px",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "2px solid #e2e8f0",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
          >
            {/* Decorative top bar */}
            <div 
              style={{
                height: "6px",
                background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)",
              }}
            />
            
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="p-2 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                      boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.3)"
                    }}
                  >
                    <Scale className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Legal Analysis</h3>
                </div>
                
                {/* Recommended Lawyer Type Banner - Show if personal issue */}
                {response.isPersonalIssue && response.legalField && (
                  <div 
                    className="mb-5 p-4 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                      border: "2px solid #3b82f6",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Scale className="w-4 h-4 text-blue-700" />
                      <p className="text-sm font-semibold text-blue-900">
                        Recommended Lawyer Type:
                      </p>
                    </div>
                    <p className="text-base font-bold text-blue-800">
                      {response.legalField} Specialist
                    </p>
                  </div>
                )}
                
                <div className="prose prose-slate max-w-none">
                  <FormattedMessage text={response.text} />
                </div>
              </div>
              {response.provider && (
                <div 
                  className="mt-6 pt-4 text-center"
                  style={{
                    borderTop: "1px solid #e2e8f0"
                  }}
                >
                  <p className="text-xs text-slate-500 font-medium">
                    ⚖️ Powered by {response.provider}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 justify-center items-center flex-wrap">
            {/* Consult a Lawyer Button - Show for personal legal issues */}
            {response.isPersonalIssue && (
              <Button
                onClick={() => {
                  // Navigate to consultant page to find lawyers
                  if (onNavigate) {
                    onNavigate('consultant');
                  }
                }}
                style={{ 
                  fontSize: "14px", 
                  padding: "12px 28px", 
                  borderRadius: "8px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "2px solid #2563eb",
                  fontWeight: "600",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                className="hover:bg-blue-700 transition-colors"
              >
                <Scale className="w-4 h-4 mr-2" />
                Consult a {response.legalField || 'Legal'} Lawyer
              </Button>
            )}

            {/* New Query Button - Always show */}
            <Button
              onClick={handleNewQuery}
              style={{ 
                fontSize: "14px", 
                padding: "12px 28px", 
                borderRadius: "8px",
                backgroundColor: "#1e293b",
                color: "#ffffff",
                border: "2px solid #1e293b",
                fontWeight: "600",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              className="hover:bg-slate-900 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Query
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="mb-4 bg-slate-100 text-slate-900 p-4" style={{ borderRadius: "8px" }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-slate-600" style={{ fontSize: "14px" }}>{loadingMessage}</span>
          </div>
        </div>
      )}

      {/* Input Area - Only show if no response */}
      {!response && !isAnalyzing && (
        <>
          <div className="relative mb-8">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4" style={{ borderRadius: "12px" }}>
              <input
                type="text"
                placeholder="Ask about property law, contracts, family law... (Speak in English or Hindi)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 min-w-0"
                style={{ fontSize: "16px" }}
                disabled={isAnalyzing}
              />
              <button
                onClick={handleVoiceInput}
                className={`p-3 rounded-full shrink-0 transition-all ${
                  isListening 
                    ? "bg-red-600 text-white animate-pulse shadow-lg shadow-red-200" 
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                }`}
                aria-label="Voice input"
                disabled={isAnalyzing}
                title={isListening ? "Stop recording" : "Start voice input"}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </button>
            </div>
            
            <div className="mt-4">
              {isListening ? (
                <p className="text-sm text-red-600 font-medium animate-pulse text-center">
                  🎤 Listening... Speak in English or Hindi (Auto-detected)
                </p>
              ) : (
                <p className="text-xs text-slate-500 text-center">
                  💡 Ask about: Property, Contracts, Family Law, Criminal Law, Employment Rights
                </p>
              )}
            </div>
          </div>

          {/* Get Analysis Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!query.trim() || isAnalyzing}
            style={{ 
              borderRadius: "10px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "2px solid #2563eb",
              fontWeight: "600",
              padding: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            className="w-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 mr-2" />
            Get Legal Analysis
          </Button>
        </>
      )}
    </div>
  );
}
