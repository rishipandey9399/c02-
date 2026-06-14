'use client'

import { Target, Trash2, Calendar, CheckSquare, Square, Loader2, Car, Utensils, Home, Plane, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useUpdateGoal, useDeleteGoal } from '@/hooks/useGoals'
import { CATEGORY_METADATA } from '@/lib/carbon/categories'
import type { UserGoal } from '@/types/user'

interface GoalCardProps {
  goal: UserGoal
}

const CATEGORY_ICONS = {
  transport: Car,
  diet: Utensils,
  energy: Home,
  flights: Plane,
  goods: ShoppingBag,
}

export function GoalCard({ goal }: GoalCardProps) {
  const updateMutation = useUpdateGoal()
  const deleteMutation = useDeleteGoal()
  const [deleting, setDeleting] = useState(false)

  const meta = CATEGORY_METADATA[goal.category] || {
    label: goal.category,
    color: '#94a3b8',
  }
  const CategoryIcon = CATEGORY_ICONS[goal.category] || Target


  const handleToggleComplete = async () => {
    try {
      await updateMutation.mutateAsync({
        goalId: goal.id,
        updates: { completed: !goal.completed },
      })
    } catch (err) {
      console.error('Failed to toggle goal completion:', err)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return
    setDeleting(true)
    try {
      await deleteMutation.mutateAsync(goal.id)
    } catch (err) {
      console.error('Failed to delete goal:', err)
      setDeleting(false)
    }
  }

  const formattedDate = new Date(goal.targetDate).toLocaleDateString('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const isLoading = updateMutation.isPending || deleting

  return (
    <div
      className={`bg-card border p-5 rounded-2xl flex flex-col justify-between transition-all relative overflow-hidden ${
        goal.completed
          ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
          : 'border-border/60 hover:border-border shadow-sm'
      }`}
    >
      {/* Category Indicator */}
      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: meta.color }} />

      <div className="space-y-3 pl-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground">
            <CategoryIcon className="w-3 h-3" style={{ color: meta.color }} />
            <span>{meta.label}</span>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              goal.difficulty === 'Easy'
                ? 'bg-emerald-500/10 text-emerald-500'
                : goal.difficulty === 'Medium'
                ? 'bg-blue-500/10 text-blue-500'
                : 'bg-orange-500/10 text-orange-500'
            }`}
          >
            {goal.difficulty}
          </span>
        </div>

        <h4
          className={`font-bold text-sm text-foreground transition-all leading-snug ${
            goal.completed ? 'line-through text-muted-foreground' : ''
          }`}
        >
          {goal.title}
        </h4>
      </div>

      <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between gap-4 pl-2">
        <div className="flex flex-col text-[11px] text-muted-foreground gap-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Target: {formattedDate}
          </span>
          <span className="font-semibold text-primary">
            Saves: {goal.saving.toFixed(1)} t CO₂e/yr
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void handleToggleComplete()}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              goal.completed
                ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20'
                : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/40'
            }`}
            aria-label={goal.completed ? 'Mark goal as active' : 'Mark goal as completed'}
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : goal.completed ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => void handleDelete()}
            className="p-1.5 border border-border/60 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer"
            aria-label="Delete goal"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
