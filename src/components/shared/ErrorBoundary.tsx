'use client'

import { AlertCircle } from 'lucide-react'
import React, { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught render error:', error, errorInfo)
  }

  public override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-destructive/10 border border-destructive/20 rounded-2xl space-y-3 max-w-md mx-auto my-6" role="alert">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">Something went wrong</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected interface error occurred. Please refresh the page or try again.
              </p>
            </div>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-primary hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
