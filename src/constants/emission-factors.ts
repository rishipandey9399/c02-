export const EMISSION_FACTORS = {
  transport: {
    'car-alone': 4.6,
    carpool: 2.3,
    public: 1.2,
    cycling: 0.1,
  },
  diet: {
    'heavy-meat': 3.3,
    'moderate-meat': 2.5,
    mixed: 2.5,
    vegetarian: 1.7,
    vegan: 1.0,
  },
  energy: {
    'gas-fossil': 3.8,
    mixed: 2.5,
    'electric-grid': 1.8,
    renewable: 0.5,
  },
  flights: {
    none: 0.1,
    occasional: 1.5,
    frequent: 2.8,
    'very-frequent': 5.0,
  },
  goods: 2.0, // baseline
} as const

export type EmissionFactors = typeof EMISSION_FACTORS
