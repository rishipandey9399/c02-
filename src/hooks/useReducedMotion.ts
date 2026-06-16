import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  // Default to true (reduced motion / no animations) to prevent hydration mismatch and flash.
  // We will enable animations in useEffect if the user has NOT requested reduced motion.
  const [reducedMotion, setReducedMotion] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}
