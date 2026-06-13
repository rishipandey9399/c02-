export type TransportChoice = 'car-alone' | 'carpool' | 'public' | 'cycling'
export type DietChoice = 'heavy-meat' | 'moderate-meat' | 'mixed' | 'vegetarian' | 'vegan'
export type EnergyChoice = 'gas-fossil' | 'mixed' | 'electric-grid' | 'renewable'
export type FlightsChoice = 'none' | 'occasional' | 'frequent' | 'very-frequent'

export interface UserAnswers {
  transport: TransportChoice
  diet: DietChoice
  energy: EnergyChoice
  flights: FlightsChoice
}

export interface FootprintResult {
  transport: number  // t CO₂e/yr
  diet: number
  energy: number
  flights: number
  goods: number      // baseline 2.0t
  total: number
  createdAt?: string
  uid?: string
}

export interface AIRecommendation {
  title: string
  detail: string    // 2-3 sentences, personalised
  saving: string    // estimated range, e.g. '~1.8t CO₂e/yr'
  difficulty: 'Easy' | 'Medium' | 'Committed'
  category: 'transport' | 'diet' | 'energy' | 'flights' | 'goods'
  timeframe: string
}

export interface CategoryMetadata {
  id: 'transport' | 'diet' | 'energy' | 'flights' | 'goods'
  label: string
  color: string
  icon: string
}
