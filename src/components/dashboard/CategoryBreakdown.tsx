'use client'

import { DonutChart } from '../charts/DonutChart'

interface CategoryBreakdownProps {
  data: {
    transport: number
    diet: number
    energy: number
    flights: number
    goods: number
  }
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  return (
    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glassmorphism flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Category Breakdown
        </h3>
        <p className="text-xs text-muted-foreground">
          Visual distribution of your yearly carbon impact.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[260px]">
        <DonutChart data={data} />
      </div>
    </div>
  )
}
