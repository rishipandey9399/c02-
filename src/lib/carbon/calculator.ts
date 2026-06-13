import { EMISSION_FACTORS } from '@/constants/emission-factors'
import type { FootprintResult, UserAnswers } from '@/types/carbon'

export { EMISSION_FACTORS } from '@/constants/emission-factors'

export function calculateFootprint(answers: UserAnswers): FootprintResult {
  const transport = EMISSION_FACTORS.transport[answers.transport]
  const diet = EMISSION_FACTORS.diet[answers.diet]
  const energy = EMISSION_FACTORS.energy[answers.energy]
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
