import { QuestionnaireWizard } from '@/components/calculator/QuestionnaireWizard'

export const metadata = {
  title: 'Carbon Footprint Calculator | CarbonTrack',
  description:
    'Answer 4 simple lifestyle questions to calculate your annual carbon footprint and get personalized AI reduction suggestions.',
}

export default function CalculatorPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-tr from-background via-background to-primary/5">
      <div className="w-full max-w-3xl py-8">
        <QuestionnaireWizard />
      </div>
    </div>
  )
}
