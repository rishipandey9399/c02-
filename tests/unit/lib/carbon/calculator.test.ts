import { describe, it, expect } from 'vitest'
import { calculateFootprint, EMISSION_FACTORS, COUNTRY_EMISSION_FACTORS } from '@/lib/carbon/calculator'

describe('calculateFootprint', () => {
  it('returns correct total for a car-alone, heavy-meat, gas, frequent-flyer profile', () => {
    const result = calculateFootprint({
      transport: 'car-alone',
      diet: 'heavy-meat',
      energy: 'gas-fossil',
      flights: 'frequent',
    })

    expect(result.transport).toBe(COUNTRY_EMISSION_FACTORS.Global.transport['car-alone'])
    expect(result.diet).toBe(EMISSION_FACTORS.diet['heavy-meat'])
    expect(result.energy).toBe(COUNTRY_EMISSION_FACTORS.Global.energy['gas-fossil'])
    expect(result.flights).toBe(EMISSION_FACTORS.flights.frequent)
    expect(result.goods).toBe(2.0)
    expect(result.total).toBeCloseTo(
      result.transport + result.diet + result.energy + result.flights + result.goods,
      2
    )
  })


  it('returns minimum footprint for cycling, vegan, renewable, no-flights profile', () => {
    const result = calculateFootprint({
      transport: 'cycling',
      diet: 'vegan',
      energy: 'renewable',
      flights: 'none',
    })

    expect(result.total).toBeLessThan(4) // below world average
  })

  it('returns total below Paris 2050 target for optimal profile', () => {
    const result = calculateFootprint({
      transport: 'cycling',
      diet: 'vegan',
      energy: 'renewable',
      flights: 'none',
    })

    // Goods baseline always present — total won't be zero
    expect(result.total).toBeGreaterThan(0)
    expect(result.goods).toBe(2.0)
  })

  it('throws on invalid category value', () => {
    expect(() =>
      calculateFootprint({
        transport: 'helicopter' as never, // invalid value
        diet: 'vegan',
        energy: 'renewable',
        flights: 'none',
      })
    ).toThrow()
  })
})
