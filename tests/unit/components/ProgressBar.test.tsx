import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { ProgressBar } from '@/components/calculator/ProgressBar'
import React from 'react'

describe('ProgressBar Component', () => {
  it('renders progress text correctly', () => {
    const html = renderToString(<ProgressBar currentStep={2} totalSteps={4} />)
    expect(html).toContain('Step 2 of 4')
    expect(html).toContain('Questionnaire Progress')
  })

  it('updates aria-valuenow and style width percentage correctly', () => {
    const html = renderToString(<ProgressBar currentStep={3} totalSteps={4} />)
    expect(html).toContain('role="progressbar"')
    expect(html).toContain('aria-valuenow="3"')
    expect(html).toContain('aria-valuemax="4"')
    // Normalise spaces in style to be robust against React formatting
    const normalizedHtml = html.replace(/\s+/g, '')
    expect(normalizedHtml).toContain('width:75%')
  })
})
