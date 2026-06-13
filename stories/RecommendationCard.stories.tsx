import type { Meta, StoryObj } from '@storybook/react'
import { RecommendationCard } from '@/components/ai/RecommendationCard'

const meta: Meta<typeof RecommendationCard> = {
  title: 'AI/RecommendationCard',
  component: RecommendationCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RecommendationCard>

export const Easy: Story = {
  args: {
    recommendation: {
      title: 'Switch to LEDs',
      detail: 'Replace all halogen or incandescent bulbs in your home with efficient LEDs. This reduces household electricity drain and cuts power bills.',
      saving: '~0.2t CO₂e/yr',
      difficulty: 'Easy',
      category: 'energy',
      timeframe: 'Immediate',
    },
  },
}

export const Committed: Story = {
  args: {
    recommendation: {
      title: 'Transition to Public Transit',
      detail: 'Trade solo car driving for trains, subways, or buses. This has a major impact on reducing single-occupancy vehicle travel emissions.',
      saving: '~3.4t CO₂e/yr',
      difficulty: 'Committed',
      category: 'transport',
      timeframe: 'Within 1 month',
    },
  },
}
