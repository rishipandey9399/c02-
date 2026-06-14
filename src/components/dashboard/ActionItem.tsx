import { Car, Utensils, Home, Plane, ShoppingBag, Zap, ArrowUpRight } from 'lucide-react'
import { CATEGORY_METADATA } from '@/lib/carbon/categories'

interface ActionItemProps {
  title: string
  description: string
  saving: string
  category: 'transport' | 'diet' | 'energy' | 'flights' | 'goods'
  onClickAction?: () => void
}

const CATEGORY_ICONS = {
  transport: Car,
  diet: Utensils,
  energy: Home,
  flights: Plane,
  goods: ShoppingBag,
}

export function ActionItem({
  title,
  description,
  saving,
  category,
  onClickAction,
}: ActionItemProps) {
  const meta = CATEGORY_METADATA[category] || {
    label: category,
    color: '#94a3b8',
  }
  const CategoryIcon = CATEGORY_ICONS[category] || Zap


  return (
    <div className="bg-card border border-border/60 hover:border-border p-4 rounded-2xl flex items-start gap-4 transition-all group shadow-sm">
      <div className="p-2.5 rounded-xl shrink-0 text-white" style={{ backgroundColor: meta.color }}>
        <CategoryIcon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <h4 className="font-bold text-sm text-foreground truncate">{title}</h4>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md shrink-0">
            {saving}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        
        {onClickAction && (
          <button
            type="button"
            onClick={onClickAction}
            className="text-[11px] text-primary hover:text-emerald-600 font-bold flex items-center gap-0.5 pt-1.5 transition-colors cursor-pointer"
          >
            Create Goal
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  )
}
