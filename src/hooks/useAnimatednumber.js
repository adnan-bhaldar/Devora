import { useEffect, useRef, useState } from 'react'

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Returns a number that glides to `target` instead of jumping, in both directions (rising and falling).
 * A new target in the middle of a glide starts from wherever the number is at that moment.
 * With "reduce motion" turned on in the system settings, the number simply jumps.
 */
export default function useAnimatedNumber(target, duration = 900) {
    const goal = target ?? 0
    const [shown, setShown] = useState(goal)
    const current = useRef(goal)

    useEffect(() => {
        if (reducedMotion()) return undefined
        const from = current.current
        if (from === goal) return undefined
        const start = performance.now()
        let frame
        const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration)
            const eased = 1 - (1 - progress) ** 3 // starts fast and settles slowly
            current.current = from + (goal - from) * eased
            setShown(current.current)
            if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [goal, duration])

    return reducedMotion() ? goal : shown
}