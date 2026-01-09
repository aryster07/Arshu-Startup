// ============================================
// AI Service - Perplexity API Provider
// ============================================

import type { AIResponse } from '../../types';

const PERPLEXITY_MODELS = [
  'llama-3.1-sonar-small-128k-chat',
  'llama-3.1-sonar-large-128k-chat',
  'sonar-small-chat',
  'sonar'
] as const;

const SYSTEM_PROMPT = `You are a specialized Legal Assistant for Law Bandhu platform in India. 

RULES:
1. ONLY answer legal questions (law, rights, procedures, court, legal advice)
2. If question is NOT legal, respond: "I apologize, but I can only help with legal matters. Please ask a legal question."
3. Keep responses clear, professional, and under 500 words
4. Use bullet points for better readability
5. Remind users to consult a qualified lawyer for their specific case

For legal queries, provide helpful guidance on:
- Property, Contract, Family, Criminal, Employment, Consumer, Civil, Corporate, Cyber, IP Law
- Legal procedures, documentation, rights, liabilities`;

export async function callPerplexityAPI(query: string, apiKey: string): Promise<AIResponse> {
  for (const model of PERPLEXITY_MODELS) {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: query }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (model === PERPLEXITY_MODELS[PERPLEXITY_MODELS.length - 1]) {
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        continue;
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response structure');
      }
      
      return {
        text: data.choices[0].message.content,
        provider: 'Law Bandhu Assistant',
        success: true
      };
    } catch (error) {
      if (model === PERPLEXITY_MODELS[PERPLEXITY_MODELS.length - 1]) {
        return {
          text: '',
          provider: 'Perplexity',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  }
  
  return {
    text: '',
    provider: 'Perplexity',
    success: false,
    error: 'All models failed'
  };
}
