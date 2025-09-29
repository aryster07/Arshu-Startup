/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GEMINI_MODEL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ENABLE_AI_FEATURES: string
  readonly VITE_ENABLE_VOICE_INPUT: string
  readonly VITE_ENABLE_DOCUMENT_REVIEW: string
  readonly VITE_NODE_ENV: string
  readonly VITE_EMERGENCY_HOTLINE: string
  readonly VITE_SUPPORT_EMAIL: string
  readonly VITE_API_RATE_LIMIT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}