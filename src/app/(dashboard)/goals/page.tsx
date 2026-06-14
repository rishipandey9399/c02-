'use client'

import { Target, Plus, X, Loader2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import { GoalCard } from '@/components/dashboard/GoalCard'
import {
  useGoalsList,
  useCreateGoal,
} from '@/hooks/useGoals'

export default function GoalsPage() {
  const { data: goals = [], isLoading, error } = useGoalsList()
  const createMutation = useCreateGoal()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'transport' | 'diet' | 'energy' | 'flights' | 'goods'>('transport')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Committed'>('Easy')
  const [saving, setSaving] = useState('1.0')
  const [targetDate, setTargetDate] = useState('')

  const activeGoals = useMemo(() => goals.filter((g) => !g.completed), [goals])
  const completedGoals = useMemo(() => goals.filter((g) => g.completed), [goals])

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !targetDate) return

    try {
      await createMutation.mutateAsync({
        title,
        category,
        difficulty,
        saving: parseFloat(saving) || 0,
        targetDate,
      })
      // Reset form & close modal
      setTitle('')
      setCategory('transport')
      setDifficulty('Easy')
      setSaving('1.0')
      setTargetDate('')
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to create goal:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-foreground tracking-tight">
            Reduction Goals
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan, monitor, and accomplish carbon reduction targets.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Goal
        </button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs max-w-md">
          {error.message}
        </div>
      )}

      {/* Goal creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full relative space-y-6 shadow-2xl glassmorphism animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-display text-foreground">Add New Goal</h3>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Goal Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Commute by bike 3x a week"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as "transport" | "diet" | "energy" | "flights" | "goods")}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="transport">Transport</option>
                    <option value="diet">Diet</option>
                    <option value="energy">Energy</option>
                    <option value="flights">Flights</option>
                    <option value="goods">Goods</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="difficulty" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value as "Easy" | "Medium" | "Committed")}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Committed">Committed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="saving" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Annual CO2 Saving (t)
                  </label>
                  <input
                    id="saving"
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={saving}
                    onChange={(e) => setSaving(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="targetDate" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Target Date
                  </label>
                  <input
                    id="targetDate"
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-muted-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/95 transition-all text-xs flex items-center justify-center gap-1 shadow-md shadow-primary/10 cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grid: Active Goals */}
      <section aria-labelledby="active-goals-heading" className="space-y-4">
        <h2 id="active-goals-heading" className="text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Active Targets ({activeGoals.length})
        </h2>

        {activeGoals.length === 0 ? (
          <div className="border border-border/60 bg-card/40 rounded-3xl p-12 text-center max-w-xl">
            <p className="text-sm text-muted-foreground">You don&apos;t have any active carbon goals right now. Use the button above to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </section>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <section aria-labelledby="completed-goals-heading" className="space-y-4 border-t border-border/40 pt-8 mt-8">
          <h2 id="completed-goals-heading" className="text-base font-bold uppercase tracking-wider text-muted-foreground">
            Completed Targets ({completedGoals.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
