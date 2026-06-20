'use client'

import { ArrowLeft, ArrowRight, Sparkles, Globe } from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import { QuestionStep } from './QuestionStep'
import { ResultsPanel } from './ResultsPanel'
import type { CountryCode } from '@/constants/emission-factors'
import { useCalculatorStore } from '@/stores/calculatorStore'

export function QuestionnaireWizard() {
  const { answers, country, setCountry, step, nextStep, prevStep } = useCalculatorStore()

  const categoriesOrder: ('transport' | 'diet' | 'energy' | 'flights')[] = [
    'transport',
    'diet',
    'energy',
    'flights',
  ]

  const currentCategory = step > 0 && step <= 4 ? categoriesOrder[step - 1] : null
  const isAnswered = currentCategory ? answers[currentCategory] !== null : false

  return (
    <div className="w-full max-w-3xl mx-auto bg-card border border-border p-6 md:p-8 rounded-3xl shadow-xl shadow-foreground/[0.02] overflow-hidden glassmorphism">
      {step > 0 && step <= 4 && (
        <div className="mb-8">
          <ProgressBar currentStep={step} totalSteps={4} />
        </div>
      )}

      <div className="relative min-h-[350px] flex flex-col justify-between">
        <div key={step} className="animate-fade-slide-in motion-reduce:animate-none">
          {step === 0 && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  100% Personalised
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-foreground leading-tight">
                  Calculate Your <span className="text-primary">Carbon Footprint</span>
                </h1>
                <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  In 60 seconds, discover where you stand &mdash; and get a personalised AI roadmap to reach the{' '}
                  <strong className="text-foreground">IPCC 2.0t target</strong>.
                </p>
              </div>

              {/* Did You Know? IPCC Callout */}
              <div className="max-w-lg mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 items-start animate-pulse-glow">
                <span className="text-2xl shrink-0 mt-0.5">🌍</span>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground">Did You Know?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The average person emits{' '}
                    <strong className="text-foreground">8.5t CO₂e/year</strong>, but the IPCC
                    says we need to reach{' '}
                    <strong className="text-primary">2.0t by 2030</strong> to limit warming to
                    1.5°C. That&apos;s a 76% reduction &mdash; and your choices are the fastest
                    path there.
                  </p>
                </div>
              </div>

              {/* Country Selection */}
              <div className="max-w-xs mx-auto space-y-2 text-center pt-2">
                <label
                  htmlFor="country-selector"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-4 h-4 text-primary" />
                  Select Region / Grid Scale
                </label>
                <select
                  id="country-selector"
                  value={country}
                  onChange={(e) => setCountry(e.target.value as CountryCode)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-semibold"
                >
                  <option value="Global">Global Average Factors</option>
                  <option value="US">United States (High Transport / High Grid)</option>
                  <option value="EU">Europe (Medium Transport / Low Grid)</option>
                  <option value="IN">India (Low Transport / High Grid)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-4 font-bold text-white bg-primary hover:bg-emerald-600 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2 group text-base cursor-pointer"
                >
                  Discover My Impact
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step > 0 && step <= 4 && currentCategory && (
            <div className="py-2">
              <QuestionStep category={currentCategory} stepIndex={step} />
            </div>
          )}

          {step === 5 && (
            <div>
              <ResultsPanel />
            </div>
          )}
        </div>

        {step > 0 && step <= 4 && (
          <div className="flex justify-between items-center pt-8 border-t border-border mt-8">
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-3 font-semibold text-foreground bg-secondary hover:bg-border border border-border rounded-xl transition-colors flex items-center gap-2 text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              disabled={!isAnswered}
              onClick={nextStep}
              className="px-6 py-3 font-bold text-white bg-primary hover:bg-emerald-600 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md shadow-primary/10 cursor-pointer"
            >
              {step === 4 ? 'See My Footprint' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
