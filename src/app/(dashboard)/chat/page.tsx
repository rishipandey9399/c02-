'use client'


import { Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { AIChat } from '@/components/ai/AIChat'
import { useFootprintHistory } from '@/hooks/useFootprint'


export default function ChatPage() {
  const { data: history = [], isLoading, error } = useFootprintHistory()

  const latestFootprint = history[0]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-md mx-auto space-y-4">
        <p className="text-sm text-destructive font-semibold">Failed to fetch footprint context.</p>
        <p className="text-xs text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black font-display text-foreground tracking-tight">
          AI Carbon Advisor
        </h1>
        <p className="text-sm text-muted-foreground">
          Chat interactively with Google Gemini to optimize your carbon footprint.
        </p>
      </div>

      {!latestFootprint ? (
        <div className="border border-border/60 bg-card/40 rounded-3xl p-12 text-center space-y-6 max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">Baseline Required</h3>
            <p className="text-xs text-muted-foreground">
              Please take the carbon footprint questionnaire first to provide the AI with context about your lifestyle choices.
            </p>
          </div>
          <Link
            href="/calculator"
            className="inline-flex px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/95 text-xs transition-all"
          >
            Start Calculator
          </Link>
        </div>
      ) : (
        <AIChat footprintContext={latestFootprint} />
      )}
    </div>
  )
}
