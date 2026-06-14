import { EMISSION_FACTORS, COUNTRY_EMISSION_FACTORS, type CountryCode } from '@/constants/emission-factors'
import type { FootprintResult, UserAnswers } from '@/types/carbon'

export { EMISSION_FACTORS, COUNTRY_EMISSION_FACTORS } from '@/constants/emission-factors'

export function calculateFootprint(answers: UserAnswers, country: CountryCode = 'Global'): FootprintResult {
  const countryFactors = COUNTRY_EMISSION_FACTORS[country] || COUNTRY_EMISSION_FACTORS.Global
  
  const transport = countryFactors.transport[answers.transport]
  const diet = EMISSION_FACTORS.diet[answers.diet]
  const energy = countryFactors.energy[answers.energy]
  const flights = EMISSION_FACTORS.flights[answers.flights]
  const goods = EMISSION_FACTORS.goods

  if (
    transport === undefined ||
    diet === undefined ||
    energy === undefined ||
    flights === undefined
  ) {
    throw new Error('Invalid questionnaire answers')
  }

  const total = transport + diet + energy + flights + goods

  return {
    transport,
    diet,
    energy,
    flights,
    goods,
    total: parseFloat(total.toFixed(2)),
  }
}

