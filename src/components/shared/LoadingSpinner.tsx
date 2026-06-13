'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <div
        role="status"
        aria-label="Loading"
        className={cn(
          'animate-spin rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent',
          SIZE_CLASSES[size],
          className
        )}
      />
    </div>
  )
}
