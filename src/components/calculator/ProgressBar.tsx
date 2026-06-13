'use client'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100))

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        <span>Questionnaire Progress</span>
        <span aria-hidden="true">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps} in questionnaire`}
        className="h-2.5 w-full bg-secondary rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
