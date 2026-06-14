'use client'

import { Leaf, TrendingDown, TrendingUp } from 'lucide-react'



interface FootprintSummaryProps {
  total: number
  benchmarkValue?: number // e.g. 8.5t average
}

export function FootprintSummary({ total, benchmarkValue = 8.5 }: FootprintSummaryProps) {
  const percentDiff = Math.round(((benchmarkValue - total) / benchmarkValue) * 100)
  const isLower = percentDiff >= 0

  return (
    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden glassmorphism flex flex-col justify-between h-full">
      {/* Decorative Aura */}
      <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Current Footprint
          </span>
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Leaf className="w-4 h-4 fill-primary/5" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-black font-display text-foreground tracking-tight">
              {total.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-muted-foreground uppercase">t CO₂e/yr</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on your latest lifestyle check-in.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-border/40 mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isLower ? (
            <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 bg-destructive/10 text-destructive rounded-lg shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          )}
          <div className="text-xs">
            <span className="font-bold text-foreground block">
              {isLower ? `${percentDiff}% Lower` : `${Math.abs(percentDiff)}% Higher`}
            </span>
            <span className="text-muted-foreground">than national average ({benchmarkValue}t)</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              total <= 4.0
                ? 'bg-emerald-500/10 text-emerald-500'
                : total <= 8.0
                ? 'bg-yellow-500/10 text-yellow-500'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {total <= 4.0 ? 'Low Carbon' : total <= 8.0 ? 'Moderate' : 'High Carbon'}
          </span>
        </div>
      </div>
    </div>
  )
}
