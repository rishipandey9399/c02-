import type { Meta, StoryObj } from '@storybook/react'
import { OptionCard } from '@/components/calculator/OptionCard'

const meta: Meta<typeof OptionCard> = {
  title: 'Calculator/OptionCard',
  component: OptionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof OptionCard>

export const Default: Story = {
  args: {
    value: 'car-alone',
    label: 'Drive alone',
    description: 'Commute solo in a standard gasoline or diesel vehicle.',
    emissionValue: 4.6,
    category: 'transport',
  },
}
