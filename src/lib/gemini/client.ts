import 'server-only'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_SAFETY_SETTINGS } from './safety'

const apiKey = process.env.GEMINI_API_KEY

// Initialise client lazily — throws clearly if API key is absent
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export function getGeminiModel(
  modelName: 'gemini-2.0-flash' | 'gemini-2.0-flash-lite' = 'gemini-2.0-flash'
) {
  if (!genAI) {
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
