import { create } from 'zustand'
import type { TransportChoice, DietChoice, EnergyChoice, FlightsChoice } from '@/types/carbon'
import type { CountryCode } from '@/constants/emission-factors'

interface CalculatorState {
  country: CountryCode
  answers: {
    transport: TransportChoice | null
    diet: DietChoice | null
    energy: EnergyChoice | null
    flights: FlightsChoice | null
  }
  step: number // 0: Welcome, 1: Transport, 2: Diet, 3: Energy, 4: Flights, 5: Results
  setCountry: (country: CountryCode) => void
  selectAnswer: (
    category: 'transport' | 'diet' | 'energy' | 'flights',
    value: string
  ) => void
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  reset: () => void
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  country: 'Global',
  answers: {
    transport: null,
    diet: null,
    energy: null,
    flights: null,
  },
  step: 0,
  setCountry: (country) => set({ country }),
  selectAnswer: (category, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [category]: value,
      },
    })),
  nextStep: () => set((state) => ({ step: Math.min(5, state.step + 1) })),
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  setStep: (step) => set({ step }),
  reset: () =>
    set({
      country: 'Global',
      answers: {
        transport: null,
        diet: null,
        energy: null,
        flights: null,
      },
      step: 0,
    }),
}))

