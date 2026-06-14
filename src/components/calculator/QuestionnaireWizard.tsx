'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import { QuestionStep } from './QuestionStep'
import { ResultsPanel } from './ResultsPanel'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useCalculatorStore } from '@/stores/calculatorStore'

export function QuestionnaireWizard() {
  const { answers, step, nextStep, prevStep } = useCalculatorStore()
  const prefersReducedMotion = useReducedMotion()

  const categoriesOrder: ('transport' | 'diet' | 'energy' | 'flights')[] = [
    'transport',
    'diet',
    'energy',
    'flights',
  ]

  const currentCategory = step > 0 && step <= 4 ? categoriesOrder[step - 1] : null
  const isAnswered = currentCategory ? answers[currentCategory] !== null : false

  const transitionSettings = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: 'easeInOut' }

  return (
    <div className="w-full max-w-3xl mx-auto bg-card border border-border p-6 md:p-8 rounded-3xl shadow-xl shadow-foreground/[0.02] overflow-hidden glassmorphism">
      {step > 0 && step <= 4 && (
        <div className="mb-8">
          <ProgressBar currentStep={step} totalSteps={4} />
        </div>
      )}

      <div className="relative min-h-[350px] flex flex-col justify-between">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={transitionSettings}
              className="space-y-6 py-6"
            >
              <div className="text-center space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  100% Personalised
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-foreground leading-tight">
                  Calculate Your <span className="text-primary">Carbon Footprint</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Discover your footprint across the 4 main areas of personal consumption, and get
                  a tailored AI reduction plan in under 3 minutes.
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-4 font-bold text-white bg-primary hover:bg-emerald-600 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2 group text-base cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step > 0 && step <= 4 && currentCategory && (
            <motion.div
              key={currentCategory}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={transitionSettings}
              className="py-2"
            >
              <QuestionStep category={currentCategory} stepIndex={step} />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="results"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionSettings}
            >
              <ResultsPanel />
            </motion.div>
          )}
        </AnimatePresence>

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
              {step === 4 ? 'See my footprint' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
