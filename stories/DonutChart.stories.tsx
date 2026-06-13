import type { Meta, StoryObj } from '@storybook/react'
import { DonutChart } from '@/components/charts/DonutChart'

const meta: Meta<typeof DonutChart> = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DonutChart>

export const Default: Story = {
  args: {
    data: {
      transport: 4.6,
      diet: 2.5,
      energy: 3.8,
      flights: 2.8,
      goods: 2.0,
    },
  },
}
