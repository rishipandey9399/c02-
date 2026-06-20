'use client'

import { Sparkles, RefreshCw, Zap, AlertCircle, Share2, CheckCircle2 } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import { RecommendationCard } from '../ai/RecommendationCard'
import { BarComparison } from '../charts/BarComparison'
import { DonutChart } from '../charts/DonutChart'
import { useAuth } from '@/hooks/useAuth'
import { useCalculateFootprint } from '@/hooks/useFootprint'
import { useRecommendations } from '@/hooks/useRecommendations'
import { calculateFootprint } from '@/lib/carbon/calculator'
import { useCalculatorStore } from '@/stores/calculatorStore'

export function ResultsPanel() {
  const { answers, country, reset } = useCalculatorStore()
  const { user } = useAuth()
  const [showAIPlan, setShowAIPlan] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')

  const { mutate, data, isPending, error, isSuccess } = useRecommendations()
  const calculateMutation = useCalculateFootprint()
  const savedRef = useRef(false)

  const answersComplete =
    answers.transport && answers.diet && answers.energy && answers.flights

  useEffect(() => {
    if (user && answersComplete && !savedRef.current) {
      savedRef.current = true
      calculateMutation.mutate({
        transport: answers.transport!,
        diet: answers.diet!,
        energy: answers.energy!,
        flights: answers.flights!,
        country,
      })
    }
  }, [user, answersComplete, answers, country, calculateMutation])

  const result = useMemo(() => {
    if (!answersComplete) {
      return { transport: 0, diet: 0, energy: 0, flights: 0, goods: 0, total: 0 }
    }
    return calculateFootprint({
      transport: answers.transport!,
      diet: answers.diet!,
      energy: answers.energy!,
      flights: answers.flights!,
    }, country)
  }, [answersComplete, answers.transport, answers.diet, answers.energy, answers.flights, country])

  // Dynamic Rule-based Quick Wins
  const quickWins = useMemo(() => {
    if (!answersComplete) return []
    const wins = []
    if (answers.transport === 'car-alone') {
      wins.push({
        title: 'Try Carpooling or Shared Transit',
        description:
          'Sharing your daily commutes or switching to public transit can cut your transportation emissions in half.',
        saving: 'Up to 2.3t CO₂e/yr',
      })
    }
    if (answers.diet === 'heavy-meat') {
      wins.push({
        title: 'Reduce Red Meat Portions',
        description:
          'Cutting back on beef and lamb is one of the highest leverage dietary actions, saving significant crop land emissions.',
        saving: 'Up to 1.5t CO₂e/yr',
      })
    } else if (answers.diet === 'mixed') {
      wins.push({
        title: 'Try Plant-based Days',
        description:
          'Introducing one or two plant-based days per week reduces food chain lifecycle emissions and cuts costs.',
        saving: 'Up to 0.8t CO₂e/yr',
      })
    }
    if (answers.energy === 'gas-fossil') {
      wins.push({
        title: 'Switch to Renewable Energy',
        description:
          'Enrolling in a green utility tariff or installing clean heating switches your home off carbon-intense fossil fuels.',
        saving: 'Up to 2.5t CO₂e/yr',
      })
    }
    if (answers.flights === 'frequent' || answers.flights === 'very-frequent') {
      wins.push({
        title: 'Substitute Short Flights with Rail',
        description:
          'Taking high-speed trains instead of short-haul flights emits up to 10x less carbon and avoids airport travel times.',
        saving: 'Up to 1.5t CO₂e/yr',
      })
    }
    return wins
  }, [answersComplete, answers.transport, answers.diet, answers.energy, answers.flights])

  if (!answersComplete) {
    return (
      <div className="text-center p-6 bg-destructive/10 border border-destructive/20 rounded-2xl" role="alert">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-2" />
        <h3 className="font-bold text-lg">Incomplete Questionnaire</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please fill out all questions before viewing your carbon footprint.
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
        >
          Reset Quiz
        </button>
      </div>
    )
  }

  const handleGetAIPlan = () => {
    setShowAIPlan(true)
    mutate({
      transport: answers.transport!,
      diet: answers.diet!,
      energy: answers.energy!,
      flights: answers.flights!,
      country,
    })
  }

  return (
    <div className="space-y-8 py-4">
      {calculateMutation.error && (
        <div className="max-w-md mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex gap-3 items-start text-left text-xs text-amber-600 dark:text-amber-400" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Failed to save progress</p>
            <p className="opacity-90">We computed your footprint, but could not save it to your history: {calculateMutation.error.message}</p>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="text-center space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary font-display">
          Your Personal Carbon Footprint
        </h2>
        <div className="inline-block relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-25 blur" />
          <div className="relative bg-card border border-border px-8 py-6 rounded-2xl flex flex-col items-center gap-2">
            <span className="text-5xl md:text-6xl font-black text-foreground tracking-tight font-display">
              {result.total.toFixed(1)}
            </span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              tonnes CO₂e / year
            </span>
            {/* Severity Badge */}
            <span className={`text-xs font-bold px-3 py-1 rounded-full mt-1 ${
              result.total <= 3.0
                ? 'bg-emerald-500/10 text-emerald-500'
                : result.total <= 7.0
                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                : 'bg-destructive/10 text-destructive'
            }`}>
              {result.total <= 3.0
                ? '🟢 Low Impact — Near the Paris target!'
                : result.total <= 7.0
                ? '🟡 Moderate Impact — Room to improve'
                : '🔴 High Impact — Action needed'}
            </span>
          </div>
        </div>

        {/* What This Means — Contextual Awareness Card */}
        <div className="max-w-lg mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-5 text-left space-y-3 animate-pulse-glow">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <span>🌍</span> What This Means for the Climate
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">🎯 Paris 2030 Target</span>
              <span className="font-bold text-emerald-500">2.0t</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: '12.5%' }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Global Average</span>
              <span className="font-semibold">4.8t</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-muted-foreground/40 rounded-full" style={{ width: '30%' }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary font-semibold">Your Score</span>
              <span className="text-primary font-bold">{result.total.toFixed(1)}t</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${Math.min((result.total / 16) * 100, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/40 pt-2">
            {result.total <= 2.0
              ? '✅ You are at or below the Paris target. Incredible! Focus on maintaining and inspiring others.'
              : `You need to reduce by ${(result.total - 2.0).toFixed(1)}t CO₂e to reach the Paris target. The AI plan below shows you exactly how.`}
          </p>
        </div>

        {/* Share Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={async () => {
              const text = `My carbon footprint is ${result.total.toFixed(1)}t CO₂e/year (Paris target: 2.0t). Calculate yours at CarbonTrack!`
              try {
                if (navigator.share) {
                  await navigator.share({ title: 'My Carbon Footprint', text })
                } else {
                  await navigator.clipboard.writeText(text)
                  setShareStatus('copied')
                  setTimeout(() => setShareStatus('idle'), 2500)
                }
              } catch {}
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-secondary hover:bg-border transition-colors cursor-pointer"
          >
            {shareStatus === 'copied' ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Copied to clipboard!</>
            ) : (
              <><Share2 className="w-3.5 h-3.5" /> Share My Footprint</>
            )}
          </button>
        </div>

        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          This calculation covers transport, diet, energy, and flights, plus a fixed baseline of
          2.0t for consumer goods.
        </p>
      </div>

      {/* Visualisations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="bg-card/50 border border-border p-6 rounded-2xl">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 font-display">
            Emissions Breakdown
          </h3>
          <DonutChart data={result} />
        </div>
        <div className="bg-card/50 border border-border p-6 rounded-2xl flex flex-col justify-between">
          <BarComparison total={result.total} />
        </div>
      </div>

      {/* Quick Wins (Rule-based) */}
      {quickWins.length > 0 && (
        <section aria-labelledby="quick-wins-heading" className="space-y-4 pt-4">
          <h3 id="quick-wins-heading" className="text-lg font-bold text-foreground font-display flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Your Immediate Quick Wins
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickWins.map((win) => (
              <div
                key={win.title}
                className="bg-card border border-border p-5 rounded-2xl space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-foreground">{win.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {win.description}
                  </p>
                </div>
                <div className="text-xs font-bold text-primary pt-2 flex items-center gap-1">
                  <span>Savings:</span>
                  <span className="px-2 py-0.5 bg-primary/10 rounded-md">{win.saving}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Recommendations Section */}
      <section aria-labelledby="ai-plan-heading" className="space-y-6 border-t border-border pt-8 mt-8">
        <div className="text-center space-y-3">
          <h3 id="ai-plan-heading" className="text-xl font-bold font-display tracking-tight text-foreground">
            Want to reduce your footprint?
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Get 3 high-impact, custom recommendations computed by Google Gemini based on your exact
            lifestyle choices.
          </p>
          {!showAIPlan && (
            <button
              type="button"
              onClick={handleGetAIPlan}
              className="px-6 py-3 font-bold text-white bg-primary hover:bg-emerald-600 rounded-xl shadow-md shadow-primary/10 transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Get My Personalised AI Plan
            </button>
          )}
        </div>

        {/* AI Recommendations Results */}
        {showAIPlan && (
          <div className="space-y-6">
            {isPending && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse" role="status" aria-label="Loading recommendations...">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-card border border-border h-[200px] rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="h-6 w-1/3 bg-muted rounded-md" />
                      <div className="h-4 w-full bg-muted rounded-md" />
                      <div className="h-4 w-3/4 bg-muted rounded-md" />
                    </div>
                    <div className="h-4 w-1/2 bg-muted rounded-md" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center p-6 border border-destructive/20 bg-destructive/10 text-destructive rounded-xl max-w-md mx-auto text-sm" role="alert">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-destructive" />
                <span className="font-semibold block mb-1">Failed to load AI Plan</span>
                {error.message || 'Service is temporarily offline. Please try again.'}
              </div>
            )}

            {isSuccess && data && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.recommendations.map((rec) => (
                    <RecommendationCard key={rec.title} recommendation={rec} />
                  ))}
                </div>
                {!user && (
                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
                    <h4 className="font-bold font-display text-foreground">
                      Save your calculations and track progress?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Sign up for a free CarbonTrack account to save this calculation, track your monthly
                      reductions, set custom goals, and chat with the AI assistant.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <a
                        href="/register"
                        className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                      >
                        Create Free Account
                      </a>
                      <a
                        href="/login"
                        className="px-5 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-border transition-colors"
                      >
                        Sign In
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Restart Button */}
      <div className="flex justify-center pt-8 border-t border-border/60">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Restart Questionnaire
        </button>
      </div>
    </div>
  )
}
