import type { FootprintResult, UserAnswers, AIRecommendation } from './carbon'
import type { UserGoal, UserProfile } from './user'

export interface ApiError {
  error: string
  code?: string
  issues?: Record<string, string[]> // Flattened Zod errors
}

export type CalculateRequest = UserAnswers

export interface CalculateResponse {
  id: string
  result: FootprintResult
}

export type RecommendationsRequest = UserAnswers

export interface RecommendationsResponse {
  recommendations: AIRecommendation[]
  footprint: FootprintResult
}

export interface ChatRequest {
  message: string
  footprintContext: FootprintResult
}

export type GoalsListResponse = UserGoal[]

export type GoalCreateRequest = Omit<UserGoal, 'id' | 'uid' | 'createdAt' | 'completed'>

export type GoalUpdateRequest = Partial<Omit<UserGoal, 'id' | 'uid' | 'createdAt'>>

export type ProfileUpdateRequest = Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>
