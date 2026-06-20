'use client'

import { Check, Leaf, Trophy } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'



interface Habit {
  id: string
  label: string
  saving: number // kg CO2e saved per occurrence
  category: 'diet' | 'transport' | 'energy' | 'goods'
}

const DAILY_HABITS: Habit[] = [
  { id: 'diet-plant', label: 'Eat plant-based meals today', saving: 4.5, category: 'diet' },
  { id: 'transport-transit', label: 'Commute via transit / walk / bike', saving: 6.2, category: 'transport' },
  { id: 'energy-thermostat', label: 'Set thermostat to 68°F / 20°C', saving: 3.1, category: 'energy' },
  { id: 'goods-secondhand', label: 'Buy secondhand / zero purchase', saving: 2.5, category: 'goods' },
  { id: 'goods-waste', label: 'Avoid single-use plastics entirely', saving: 1.0, category: 'goods' },
]

export function HabitTracker() {
  const { user } = useAuth()
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const dateKey = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [])

  const storageKey = useMemo(() => {
    const prefix = user ? `carbontrack-habits-${user.uid}` : 'carbontrack-habits-anonymous'
    return `${prefix}-${dateKey}`
  }, [user, dateKey])

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setCheckedIds(JSON.parse(saved) as string[])
      } else {
        setCheckedIds([])
      }
    } catch (err) {
      console.error('Failed to load habits from localStorage:', err)
    } finally {
      setIsLoaded(true)
    }
  }, [storageKey])

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedIds))
    } catch (err) {
      console.error('Failed to save habits to localStorage:', err)
    }
  }, [checkedIds, storageKey, isLoaded])

  const totalSavedToday = useMemo(() => {
    return DAILY_HABITS
      .filter((h) => checkedIds.includes(h.id))
      .reduce((acc, curr) => acc + curr.saving, 0)
  }, [checkedIds])

  const toggleHabit = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const completionPercent = Math.round((checkedIds.length / DAILY_HABITS.length) * 100)

  return (
    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glassmorphism flex flex-col justify-between h-[340px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Daily Green Actions
            </h3>
            <p className="text-xs text-muted-foreground">
              Track your daily sustainable habits.
            </p>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Trophy className="w-4 h-4" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="text-primary font-bold">{completionPercent}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Checkbox list */}
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {DAILY_HABITS.map((habit) => {
            const isChecked = checkedIds.includes(habit.id)
            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                  isChecked
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground'
                    : 'bg-background hover:bg-secondary/40 border-border/50 text-muted-foreground'
                }`}
              >
                <span className="truncate">{habit.label}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-muted-foreground rounded">
                    +{habit.saving.toFixed(1)}kg
                  </span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-border'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Carbon offset equivalent info */}
      <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">Impact Today:</span>
        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
          <Leaf className="w-3.5 h-3.5 fill-emerald-500/10" />
          {totalSavedToday.toFixed(1)} kg CO₂e saved
        </span>
      </div>
    </div>
  )
}
