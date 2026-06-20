'use client'

import { Target, ArrowRight, Loader2, Award, Zap, Leaf } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { ActionItem } from '@/components/dashboard/ActionItem'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { FootprintSummary } from '@/components/dashboard/FootprintSummary'
import { GoalCard } from '@/components/dashboard/GoalCard'
import { HabitTracker } from '@/components/dashboard/HabitTracker'
import { ProgressChart } from '@/components/dashboard/ProgressChart'
import { useAuth } from '@/hooks/useAuth'
import { useFootprintHistory } from '@/hooks/useFootprint'
import { useGoalsList } from '@/hooks/useGoals'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  // Fetch Footprint History & Goals
  const { data: history = [], isLoading: historyLoading } = useFootprintHistory()
  const { data: goals = [], isLoading: goalsLoading } = useGoalsList()

  const latestFootprint = history[0]
  const activeGoals = useMemo(() => goals.filter((g) => !g.completed), [goals])

  // Computed Quick Wins based on latest footprint selections (emulated from inputs if available)
  const quickWins = useMemo(() => {
    if (!latestFootprint) return []
    const wins = []
    
    // Check which category is highest or has high emissions
    if (latestFootprint.transport > 2.0) {
      wins.push({
        title: 'Try Carpooling or Shared Transit',
        description: 'Sharing your daily commutes or switching to public transit can cut your transportation emissions in half.',
        saving: 'Save ~2.3t CO₂e/yr',
        category: 'transport' as const,
      })
    }
    if (latestFootprint.diet > 2.0) {
      wins.push({
        title: 'Reduce Red Meat Portions',
        description: 'Cutting back on beef and lamb is one of the highest leverage dietary actions, saving significant crop land emissions.',
        saving: 'Save ~1.5t CO₂e/yr',
        category: 'diet' as const,
      })
    }
    if (latestFootprint.energy > 2.0) {
      wins.push({
        title: 'Switch to Renewable Energy',
        description: 'Enrolling in a green utility tariff or installing clean heating switches your home off carbon-intense fossil fuels.',
        saving: 'Save ~2.5t CO₂e/yr',
        category: 'energy' as const,
      })
    }
    if (latestFootprint.flights > 2.0) {
      wins.push({
        title: 'Substitute Short Flights with Rail',
        description: 'Taking high-speed trains instead of short-haul flights emits up to 10x less carbon and avoids airport travel times.',
        saving: 'Save ~1.5t CO₂e/yr',
        category: 'flights' as const,
      })
    }

    return wins.slice(0, 3) // show top 3
  }, [latestFootprint])

  const isLoading = historyLoading || goalsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // If user has not filled calculator, show baseline prompt
  if (!latestFootprint) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black font-display text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.displayName || 'Friend'}. Let&apos;s start your carbon reduction journey.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-primary/20 rounded-3xl p-8 text-center space-y-6 max-w-3xl mx-auto shadow-sm">
          <Award className="w-16 h-16 text-primary mx-auto stroke-[1.5]" />
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold font-display text-foreground">
              Calculate Your Baseline Footprint
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We need a baseline calculation to show your dashboard. Take our 60-second questionnaire to calculate your carbon score and set goals.
            </p>
          </div>

          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:scale-[1.03]"
          >
            Start Calculator
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-foreground tracking-tight flex items-center gap-2">
            <Leaf className="w-7 h-7 text-primary" />
            Your Carbon Journey
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {user?.displayName || 'Friend'}. Every action you take moves the needle on the 2.0t Paris target.
          </p>
        </div>
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] text-sm shrink-0"
        >
          New Calculation
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Paris Target Progress Bar */}
      {latestFootprint && (() => {
        const target = 2.0
        const current = latestFootprint.total
        const gap = Math.max(current - target, 0)
        const isOnTarget = current <= target
        return (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Progress Toward Paris 2030 Target
              </h2>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isOnTarget
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : current <= 5
                  ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {isOnTarget ? '✅ On Target!' : `${gap.toFixed(1)}t to go`}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Your footprint: <strong className="text-foreground">{current.toFixed(1)}t CO₂e/yr</strong></span>
                <span>Target: <strong className="text-primary">2.0t</strong></span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isOnTarget ? 'bg-emerald-500' : current <= 5 ? 'bg-yellow-500' : 'bg-destructive'
                  }`}
                  style={{ width: `${Math.min((current / 16) * 100, 100)}%` }}
                />
                {/* Target marker at 2.0t/16t = 12.5% */}
                <div className="absolute top-0 bottom-0 flex items-center" style={{ left: '12.5%' }}>
                  <div className="w-0.5 h-full bg-emerald-500/80" />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                The green line marks the <strong className="text-foreground">IPCC 2.0t Paris target</strong>.
                {isOnTarget
                  ? ' You have reached it — keep maintaining this level!'
                  : ' Use the AI recommendations below to close the gap.'}
              </p>
            </div>
          </div>
        )
      })()}

      {/* Daily Climate Tip */}
      {(() => {
        const tips = [
          { emoji: '🌱', text: 'Swapping one beef meal per week for legumes saves ~50kg CO₂e annually — equivalent to driving 200km less.' },
          { emoji: '⚡', text: 'Switching to a green energy tariff is the single easiest way to cut 2+ tonnes from your footprint instantly.' },
          { emoji: '🚆', text: 'Taking the train instead of a 1-hour flight saves ~90% of the carbon emissions for that journey.' },
          { emoji: '🌡️', text: 'Lowering your thermostat by just 1°C can reduce your heating emissions by 5–10% each year.' },
          { emoji: '🛒', text: 'Buying second-hand instead of new cuts the carbon footprint of clothing and electronics by up to 80%.' },
          { emoji: '♻️', text: 'Composting food waste prevents methane emissions — food in landfill is 28× more potent than CO₂ over 100 years.' },
          { emoji: '🌳', text: 'A single mature tree absorbs ~22kg CO₂ per year. Planting 10 trees offsets roughly 220kg of your footprint.' },
          { emoji: '🚗', text: 'EVs emit 50–70% less CO₂ over their lifetime than petrol cars, even accounting for battery manufacturing.' },
          { emoji: '✈️', text: 'Flying business class has a footprint 3× higher than economy due to the larger physical space consumed.' },
          { emoji: '💡', text: 'LED bulbs use 75% less energy than incandescent bulbs and last 25× longer — a small change with real impact.' },
        ]
        const today = new Date()
        const tipIndex = (today.getDate() + today.getMonth()) % tips.length
        const tip = tips[tipIndex]!
        return (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 items-start">
            <span className="text-2xl shrink-0 mt-0.5">{tip.emoji}</span>
            <div>
              <p className="text-xs font-bold text-foreground mb-1">Today&apos;s Climate Tip</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
            </div>
          </div>
        )
      })()}

      {/* Grid: Footprint Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <FootprintSummary total={latestFootprint.total} />
        </div>
        <div className="md:col-span-7">
          <CategoryBreakdown data={latestFootprint} />
        </div>
      </div>

      {/* Grid: Habit Tracker & Historical Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habit tracker */}
        <div className="lg:col-span-5">
          <HabitTracker />
        </div>
        {/* Historical chart */}
        <div className="lg:col-span-7">
          <ProgressChart history={history.map((h) => ({ date: h.createdAt || new Date().toISOString(), total: h.total }))} />
        </div>
      </div>

      {/* Active Goals & Quick Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-border/40 pt-8">
        {/* Goals List Preview */}
        <section aria-labelledby="active-goals-heading" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 id="active-goals-heading" className="text-lg font-bold text-foreground font-display flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Active Goals
            </h3>
            <Link href="/goals" className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
              Manage Goals <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeGoals.length === 0 ? (
            <div className="border border-border/60 bg-card/40 rounded-3xl p-8 text-center space-y-4">
              <p className="text-sm text-muted-foreground">You don&apos;t have any active carbon reduction goals.</p>
              <Link
                href="/goals"
                className="inline-flex px-4 py-2 bg-secondary hover:bg-border text-foreground border border-border text-xs font-bold rounded-xl transition-all"
              >
                Set a Goal
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeGoals.slice(0, 4).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </section>

        {/* Quick Wins recommendations */}
        <section aria-labelledby="quick-wins-heading" className="space-y-4">
          <h3 id="quick-wins-heading" className="text-lg font-bold text-foreground font-display flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Recommended Action Plan
          </h3>

          {quickWins.length === 0 ? (
            <div className="border border-border/60 bg-card/40 rounded-3xl p-8 text-center">
              <p className="text-sm text-muted-foreground">Great job! Your carbon score is already optimized.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quickWins.map((win, idx) => (
                <ActionItem
                  key={idx}
                  title={win.title}
                  description={win.description}
                  saving={win.saving}
                  category={win.category}
                  onClickAction={() => router.push('/goals')}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      className={props.className}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
