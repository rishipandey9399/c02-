import 'server-only'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_SAFETY_SETTINGS } from './safety'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey && process.env.NODE_ENV !== 'test') {
  throw new Error('GEMINI_API_KEY is required but not set')
}

// Initialise client lazily or handle undefined key in tests
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export function getGeminiModel(
  modelName: 'gemini-2.0-flash' | 'gemini-2.0-flash-lite' = 'gemini-2.0-flash'
) {
  if (!genAI) {
    if (process.env.NODE_ENV === 'test') {
      // Return a basic mock structure if in tests and genAI is not initialised
      return {
        generateContent: () => Promise.resolve({ response: { text: () => '{}' } }),
        startChat: () => ({ sendMessageStream: () => Promise.resolve({ stream: [] }) }),
      } as unknown as ReturnType<GoogleGenerativeAI['getGenerativeModel']>
    }
    throw new Error('Generative AI client not initialised. GEMINI_API_KEY is missing.')
  }

  return genAI.getGenerativeModel({
    model: modelName,
    safetySettings: GEMINI_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  })
}
