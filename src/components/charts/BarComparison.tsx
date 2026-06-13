'use client'

import { cn } from '@/lib/utils'

interface BarComparisonProps {
  total: number
}

export function BarComparison({ total }: BarComparisonProps) {
  const benchmarks = [
    { label: 'Paris 2050 Target', value: 2.0, color: 'bg-emerald-500 dark:bg-emerald-400' },
    { label: 'World Average', value: 4.0, color: 'bg-blue-500 dark:bg-blue-400' },
    {
      label: 'Your Footprint',
      value: total,
      color: 'bg-primary shadow-sm shadow-primary/20',
      isUser: true,
    },
    { label: 'US Average', value: 16.0, color: 'bg-rose-500 dark:bg-rose-400' },
  ]

  const maxVal = Math.max(...benchmarks.map((b) => b.value), 20.0)

  return (
    <div
      className="space-y-4"
      role="img"
      aria-label={`Comparison chart showing your footprint of ${total.toFixed(1)} tonnes compared to Paris 2050 target of 2.0 tonnes, world average of 4.0 tonnes, and US average of 16.0 tonnes.`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-display">
        Benchmark Comparison
      </h3>
      <div className="space-y-4">
        {benchmarks.map((b) => {
          const percent = Math.min(100, (b.value / maxVal) * 100)
          return (
            <div key={b.label} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span
                  className={cn(
                    'font-medium',
                    b.isUser ? 'text-primary font-bold text-sm' : 'text-muted-foreground'
                  )}
                >
                  {b.label} {b.isUser && '(You)'}
                </span>
                <span
                  className={cn(
                    'font-bold',
                    b.isUser ? 'text-primary text-sm font-extrabold' : 'text-foreground'
                  )}
                >
                  {b.value.toFixed(1)} t CO₂e/yr
                </span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-1000 ease-out', b.color)}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
