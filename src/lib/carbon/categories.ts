import type { CategoryMetadata } from '@/types/carbon'

export const CATEGORY_METADATA: Record<'transport' | 'diet' | 'energy' | 'flights' | 'goods', CategoryMetadata> = {
  transport: {
    id: 'transport',
    label: 'Transportation',
    color: '#3b82f6', // blue
    icon: 'Car',
  },
  diet: {
    id: 'diet',
    label: 'Food & Diet',
    color: '#10b981', // emerald
    icon: 'Utensils',
  },
  energy: {
    id: 'energy',
    label: 'Home Energy',
    color: '#f59e0b', // amber
    icon: 'Home',
  },
  flights: {
    id: 'flights',
    label: 'Air Travel',
    color: '#8b5cf6', // violet
    icon: 'Plane',
  },
  goods: {
    id: 'goods',
    label: 'Consumer Goods',
    color: '#ec4899', // pink
    icon: 'ShoppingBag',
  },
}
