'use client'

import { OptionCard } from './OptionCard'
import { EMISSION_FACTORS, COUNTRY_EMISSION_FACTORS } from '@/constants/emission-factors'
import { useFocusStep } from '@/hooks/useFocusStep'
import { useCalculatorStore } from '@/stores/calculatorStore'
import type { TransportChoice, DietChoice, EnergyChoice, FlightsChoice } from '@/types/carbon'

interface QuestionStepProps {
  category: 'transport' | 'diet' | 'energy' | 'flights'
  stepIndex: number
}

const QUESTIONS_DATA = {
  transport: {
    question: 'How do you primarily travel for daily commuting?',
    description:
      'Daily transportation choices represent a significant part of your annual carbon output.',
    options: [
      {
        value: 'car-alone',
        label: 'Drive alone',
        description: 'Commute solo in a standard gasoline or diesel vehicle.',
      },
      {
        value: 'carpool',
        label: 'Carpool / Shared ride',
        description: 'Share commutes with others, reducing per-person car emissions.',
      },
      {
        value: 'public',
        label: 'Public transit',
        description: 'Take buses, subways, trains, or city transit systems.',
      },
      {
        value: 'cycling',
        label: 'Cycle / Walk',
        description: 'Active travel modes with near-zero operational emissions.',
      },
    ],
  },
  diet: {
    question: 'Which best describes your eating habits?',
    description:
      'Food production emissions vary dramatically, especially based on meat intake.',
    options: [
      {
        value: 'heavy-meat',
        label: 'Heavy meat-eater',
        description: 'Consume meat (especially beef or lamb) in most daily meals.',
      },
      {
        value: 'mixed',
        label: 'Mixed / Balanced',
        description: 'Eat poultry, pork, or beef a few times per week.',
      },
      {
        value: 'vegetarian',
        label: 'Vegetarian',
        description: 'No meat, but eat dairy, cheese, and eggs.',
      },
      {
        value: 'vegan',
        label: 'Vegan / Plant-based',
        description: 'Consume only plant-based products, with lowest overall food impact.',
      },
    ],
  },
  energy: {
    question: 'What is the primary source of heating/power for your home?',
    description: 'Residential heating and electricity depend highly on the energy mix you use.',
    options: [
      {
        value: 'gas-fossil',
        label: 'Natural gas (Fossil heated)',
        description: 'Large home utilizing a standard gas furnace for heating.',
      },
      {
        value: 'mixed',
        label: 'Mixed / Standard grid',
        description: 'Average home using standard utility grid power and mixed heating.',
      },
      {
        value: 'electric-grid',
        label: 'All-electric grid',
        description: 'All-electric home utilizing standard electrical grid mix.',
      },
      {
        value: 'renewable',
        label: 'Renewable energy',
        description: 'Green tariff electricity, heat pumps, or home solar panels.',
      },
    ],
  },
  flights: {
    question: 'How often do you travel by plane annually?',
    description: 'Aviation generates high high-altitude emissions. Even a single flight is substantial.',
    options: [
      {
        value: 'none',
        label: 'Rarely or Never',
        description: 'Less than one flight per year on average.',
      },
      {
        value: 'occasional',
        label: 'Occasional flyer',
        description: 'Take 1 to 2 short or medium-haul return flights per year.',
      },
      {
        value: 'frequent',
        label: 'Frequent flyer',
        description: 'Take 3 to 5 flights per year, including long-haul flights.',
      },
      {
        value: 'very-frequent',
        label: 'Very frequent / Business',
        description: 'Take 6 or more flights per year or regular long-haul travel.',
      },
    ],
  },
}

export function QuestionStep({ category, stepIndex }: QuestionStepProps) {
  const qData = QUESTIONS_DATA[category]
  const headingRef = useFocusStep(stepIndex)
  const { country } = useCalculatorStore()

  return (
    <section aria-labelledby={`question-${category}-title`} className="space-y-6">
      <div className="space-y-2">
        <h2
          id={`question-${category}-title`}
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-bold font-display tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-0"
        >
          {qData.question}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{qData.description}</p>
      </div>

      <div
        role="radiogroup"
        aria-label={qData.question}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {qData.options.map((opt) => {
          let emissionValue = 0
          if (category === 'transport') {
            emissionValue = COUNTRY_EMISSION_FACTORS[country].transport[opt.value as TransportChoice]
          } else if (category === 'energy') {
            emissionValue = COUNTRY_EMISSION_FACTORS[country].energy[opt.value as EnergyChoice]
          } else if (category === 'diet') {
            emissionValue = EMISSION_FACTORS.diet[opt.value as DietChoice]
          } else if (category === 'flights') {
            emissionValue = EMISSION_FACTORS.flights[opt.value as FlightsChoice]
          }

          return (
            <OptionCard
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              emissionValue={emissionValue}
              category={category}
            />
          )
        })}
      </div>
    </section>
  )
}

