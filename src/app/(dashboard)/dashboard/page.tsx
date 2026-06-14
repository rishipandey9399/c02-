'use client'

import { Target, ArrowRight, Loader2, Award, Zap } from 'lucide-react'
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
          <h1 className="text-3xl font-black font-display text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.displayName || 'Friend'}. You are tracking well against your goals!
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
