'use client'

import { Car, Utensils, Home, Plane, ShoppingBag, Calendar, ArrowUpRight } from 'lucide-react'
import type { AIRecommendation } from '@/types/carbon'
import { cn } from '@/lib/utils'

interface RecommendationCardProps {
  recommendation: AIRecommendation
  onAddGoal?: () => void
}

const CATEGORY_ICONS = {
  transport: Car,
  diet: Utensils,
  energy: Home,
  flights: Plane,
  goods: ShoppingBag,
}

const DIFFICULTY_STYLES = {
  Easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Committed: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
}

export function RecommendationCard({ recommendation, onAddGoal }: RecommendationCardProps) {
  const IconComponent = CATEGORY_ICONS[recommendation.category] || ShoppingBag
  const diffStyle = DIFFICULTY_STYLES[recommendation.difficulty] || DIFFICULTY_STYLES.Easy

  return (
    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Header badges */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-secondary rounded-xl text-primary inline-flex">
              <IconComponent className="w-4 h-4" />
            </span>
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', diffStyle)}>
              {recommendation.difficulty}
            </span>
          </div>
          <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
            {recommendation.saving}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground leading-snug">
            {recommendation.title}
          </h4>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            {recommendation.detail}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Timeframe: {recommendation.timeframe}
        </span>
        <button
          type="button"
          onClick={onAddGoal}
          className="text-primary hover:text-emerald-600 font-semibold flex items-center gap-0.5 group transition-colors text-xs cursor-pointer"
        >
          Add Goal
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
