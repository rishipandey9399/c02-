'use client'

import { Calendar, Leaf, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useFootprintHistory } from '@/hooks/useFootprint'
import { CATEGORY_METADATA } from '@/lib/carbon/categories'

export default function HistoryPage() {
  const { data: history = [], isLoading, error } = useFootprintHistory()

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
        <p className="text-sm text-destructive font-semibold">Failed to load footprint history.</p>
        <p className="text-xs text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black font-display text-foreground tracking-tight">
          Emissions History
        </h1>
        <p className="text-sm text-muted-foreground">
          Trace your footprint over time and review details of past check-ins.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="border border-border/60 bg-card/40 rounded-3xl p-12 text-center space-y-6 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">No Calculations Yet</h3>
            <p className="text-xs text-muted-foreground">
              Calculate your footprint baseline first to begin logging your history.
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
        <div className="space-y-6 max-w-4xl">
          <div className="relative border-l border-border pl-6 space-y-8 ml-3">
            {history.map((record, index) => {
              const formattedDate = new Date(record.createdAt || '').toLocaleDateString('default', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })

              const categories = [
                { key: 'transport', val: record.transport },
                { key: 'diet', val: record.diet },
                { key: 'energy', val: record.energy },
                { key: 'flights', val: record.flights },
                { key: 'goods', val: record.goods },
              ] as const

              return (
                <div key={index} className="relative group">
                  {/* Circle Timeline Bullet */}
                  <div className="absolute left-[-31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-primary bg-background flex items-center justify-center transition-all group-hover:scale-110">
                    <Leaf className="w-2.5 h-2.5 fill-primary text-primary" />
                  </div>

                  <div className="bg-card border border-border/60 p-6 rounded-2xl space-y-4 hover:border-border transition-all shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-foreground">{record.total.toFixed(1)}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">t CO₂e/yr</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {categories.map((c) => {
                        const meta = CATEGORY_METADATA[c.key] || { label: c.key, color: '#94a3b8' }
                        return (
                          <div key={c.key} className="space-y-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                              {meta.label}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                              <span className="text-xs font-bold text-foreground">
                                {c.val.toFixed(1)}t
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
