// ============================================
// Law Bandhu - Application Constants
// ============================================

// Legal Specializations
export const SPECIALIZATIONS = [
  "Corporate Law",
  "Criminal Law",
  "Family Law",
  "Property Law",
  "Tax Law",
  "Cyber Law",
  "Labour Law",
  "IPR Law",
] as const;

// Supported Languages
export const LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Kannada",
] as const;

// Indian Cities
export const LOCATIONS = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
] as const;

// Quick Filter Options
export const QUICK_FILTERS = [
  "Near Me",
  "Top Rated",
  "Available Today",
  "Under ₹500",
] as const;

// Default Filter Values
export const DEFAULT_FILTERS = {
  specializations: [],
  experience: [0, 50],
  rating: 0,
  languages: [],
  location: [],
  consultationFee: [0, 10000],
} as const;

// AI Loading Messages
export const AI_LOADING_MESSAGES = [
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
] as const;

// AI Error Messages
export const AI_ERROR_MESSAGES = [
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
] as const;

// App Metadata
export const APP_CONFIG = {
  name: "Law Bandhu",
  tagline: "Your Trusted Legal Partner",
  description: "Connect with experienced legal professionals instantly",
} as const;
