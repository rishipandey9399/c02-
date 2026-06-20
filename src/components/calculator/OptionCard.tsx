'use client'

import { cn } from '@/lib/utils'
import { useCalculatorStore } from '@/stores/calculatorStore'

interface OptionCardProps {
  value: string
  label: string
  description: string
  emissionValue: number
  category: 'transport' | 'diet' | 'energy' | 'flights'
}

export function OptionCard({
  value,
  label,
  description,
  emissionValue,
  category,
}: OptionCardProps) {
  const { answers, selectAnswer } = useCalculatorStore()
  const isSelected = answers[category] === value

  return (
    <div
      className={cn(
        'w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 ease-out cursor-pointer relative overflow-hidden block focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5 ring-1 ring-primary'
          : 'border-border bg-card hover:bg-muted hover:border-muted-foreground/30 shadow-sm'
      )}
    >
      <input
        id={`${category}-${value}`}
        type="radio"
        name={category}
        value={value}
        checked={isSelected}
        onChange={() => selectAnswer(category, value as NonNullable<typeof answers[typeof category]>)}
        aria-describedby={`${category}-${value}-description`}
        className="sr-only"
      />
      
      {/* Absolute label overlay making the whole card clickable */}
      <label
        htmlFor={`${category}-${value}`}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label={label}
      />

      <div className="flex justify-between items-start gap-4 relative z-0">
        <div className="flex-1">
          <span className="font-semibold text-lg font-display block mb-1 text-foreground">
            {label}
          </span>
          <span
            id={`${category}-${value}-description`}
            className="text-sm text-muted-foreground block leading-relaxed"
          >
            {description}
          </span>
        </div>
        <div
          className={cn(
            'flex flex-col items-end shrink-0 py-1 px-3 rounded-lg text-xs font-bold border transition-colors',
            isSelected
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary text-secondary-foreground border-border'
          )}
        >
          <span className="text-base">{emissionValue.toFixed(1)}</span>
          <span className="opacity-80 uppercase tracking-wider text-[9px]">t CO₂e/yr</span>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-bl-lg" />
      )}
    </div>
  )
}
