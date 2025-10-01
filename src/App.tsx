import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import SimpleRouter from './routes/SimpleRouter';
import { initializeGeminiService } from './services/geminiService';
import { ToastProvider } from './components/ui/toast';
import ErrorBoundary from './components/ui/ErrorBoundary';

export default function App() {
  // Initialize Gemini AI service on app start
  useEffect(() => {
    try {
      initializeGeminiService();
      console.log('Gemini AI service initialized successfully');
    } catch (error) {
      console.warn('Gemini AI service initialization failed:', error);
      // App will still work without AI features
    }
  }, []);

  return (
    <ErrorBoundary level="page">
      <BrowserRouter>
        <ToastProvider>
          <SimpleRouter />
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}