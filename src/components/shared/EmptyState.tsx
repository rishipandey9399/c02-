'use client'

import { FolderOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border border-dashed border-border rounded-2xl space-y-4">
      <div className="p-3 bg-secondary rounded-full text-muted-foreground">
        <FolderOpen className="w-8 h-8" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-base font-bold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 bg-primary hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
