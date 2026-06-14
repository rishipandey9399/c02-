export const COUNTRY_EMISSION_FACTORS = {
  US: {
    transport: {
      'car-alone': 4.6,
      carpool: 2.3,
      public: 1.2,
      cycling: 0.1,
    },
    energy: {
      'gas-fossil': 3.8,
      mixed: 2.5,
      'electric-grid': 1.8,
      renewable: 0.5,
    },
  },
  EU: {
    transport: {
      'car-alone': 3.8,
      carpool: 1.9,
      public: 0.8,
      cycling: 0.1,
    },
    energy: {
      'gas-fossil': 2.8,
      mixed: 1.8,
      'electric-grid': 1.0,
      renewable: 0.3,
    },
  },
  IN: {
    transport: {
      'car-alone': 2.5,
      carpool: 1.2,
      public: 0.5,
      cycling: 0.1,
    },
    energy: {
      'gas-fossil': 2.2,
      mixed: 2.0,
      'electric-grid': 2.4,
      renewable: 0.4,
    },
  },
  Global: {
    transport: {
      'car-alone': 4.0,
      carpool: 2.0,
      public: 1.0,
      cycling: 0.1,
    },
    energy: {
      'gas-fossil': 3.2,
      mixed: 2.2,
      'electric-grid': 1.6,
      renewable: 0.4,
    },
  },
} as const

export const EMISSION_FACTORS = {
  diet: {
    'heavy-meat': 3.3,
    'moderate-meat': 2.5,
    mixed: 2.5,
    vegetarian: 1.7,
    vegan: 1.0,
  },
  flights: {
    none: 0.1,
    occasional: 1.5,
    frequent: 2.8,
    'very-frequent': 5.0,
  },
  goods: 2.0, // baseline
} as const

export type CountryCode = keyof typeof COUNTRY_EMISSION_FACTORS
export type EmissionFactors = typeof EMISSION_FACTORS
