import { useEffect, useRef } from 'react'

export function useFocusStep(step: number) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  return headingRef
}
