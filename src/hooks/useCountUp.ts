import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` using requestAnimationFrame (never
 * setInterval, so it stays in sync with the browser's paint cycle and costs
 * nothing when the tab is backgrounded). Only runs once `start` flips true —
 * pair with an IntersectionObserver-based "in view" flag so off-screen stats
 * don't animate before the user scrolls to them.
 */
export function useCountUp(
  target: number,
  { start, duration = 1200 }: { start: boolean; duration?: number },
) {
  const [value, setValue] = useState(0);
  const hasRunRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start || hasRunRef.current) return;
    hasRunRef.current = true;

    // Respect reduced-motion preference: jump straight to the final value.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || target === 0) {
      setValue(target);
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a smooth, natural deceleration.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((target * eased).toFixed(target % 1 !== 0 ? 1 : 0)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [start, target, duration]);

  return value;
}
