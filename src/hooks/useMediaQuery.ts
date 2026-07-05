import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query. Returns `true` while the query matches.
 * Defaults to `false` during SSR and on the first render before the effect
 * runs (to keep server-rendered markup stable).
 *
 * Usage:
 *   const isMobile = useMediaQuery("(max-width: 639px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const list = window.matchMedia(query);
    setMatches(list.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
