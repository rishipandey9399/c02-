import { describe, it, expect } from 'vitest'
import { buildRecommendationPrompt, buildChatSystemPrompt } from '@/lib/gemini/prompts'
import { sanitiseForPrompt } from '@/lib/gemini/safety'
import type { UserAnswers, FootprintResult } from '@/types/carbon'

describe('Gemini Prompts', () => {
  const mockAnswers: UserAnswers = {
    transport: 'car-alone',
    diet: 'mixed',
    energy: 'gas-fossil',
    flights: 'frequent',
  }

  const mockResult: FootprintResult = {
    transport: 4.6,
    diet: 2.5,
    energy: 3.8,
    flights: 2.8,
    goods: 2.0,
    total: 15.7,
  }

  describe('buildRecommendationPrompt', () => {
    it('should generate a recommendation prompt with profile info and benchmarks', () => {
      const prompt = buildRecommendationPrompt(mockAnswers, mockResult)
      expect(prompt).toContain('USER CARBON PROFILE')
      expect(prompt).toContain('Transport: car-alone → 4.6 t CO₂e/yr')
      expect(prompt).toContain('Diet: mixed → 2.5 t CO₂e/yr')
      expect(prompt).toContain('Home energy: gas-fossil → 3.8 t CO₂e/yr')
      expect(prompt).toContain('Air travel: frequent → 2.8 t CO₂e/yr')
      expect(prompt).toContain('TOTAL: 15.7 t CO₂e/yr')
      expect(prompt).toContain('REQUIRED JSON SCHEMA')
    })
  })

  describe('buildChatSystemPrompt', () => {
    it('should generate a chat system prompt matching total footprint and categories', () => {
      const prompt = buildChatSystemPrompt(mockResult)
      expect(prompt).toContain('15.7 t CO₂e/yr')
      expect(prompt).toContain('Transport 4.6t, Diet 2.5t, Energy 3.8t, Flights 2.8t, Goods 2.0t')
      expect(prompt).toContain('concisely and helpfully')
    })
  })

  describe('sanitiseForPrompt', () => {
    it('should strip HTML angle brackets', () => {
      const input = 'Hello <script>alert("hack")</script> World!'
      const output = sanitiseForPrompt(input)
      expect(output).toBe('Hello scriptalert("hack")/script World!')
    })

    it('should collapse multiple newlines into a maximum of two', () => {
      const input = 'Line 1\n\n\n\nLine 2\n\n\nLine 3'
      const output = sanitiseForPrompt(input)
      expect(output).toBe('Line 1\n\nLine 2\n\nLine 3')
    })

    it('should truncate strings exceeding 500 characters', () => {
      const longString = 'a'.repeat(600)
      const output = sanitiseForPrompt(longString)
      expect(output.length).toBe(500)
    })
  })
})
