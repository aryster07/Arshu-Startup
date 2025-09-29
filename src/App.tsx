import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import SimpleRouter from './routes/SimpleRouter';
import { initializeGeminiService } from './services/geminiService';

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
    <BrowserRouter>
      <SimpleRouter />
    </BrowserRouter>
  );
}