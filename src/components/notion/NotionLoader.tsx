import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staticPortfolio } from "@/data/static-portfolio";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 650;
const MAX_WAIT_MS = 3200;
/**
 * localStorage key that marks "user has seen the loader at least once".
 * On repeat visits we skip the loader entirely to remove the 2.5-3 s wait
 * that was the single largest LCP delay on the site.
 */
const LOADER_SEEN_KEY = "portfolio-loaded";

/**
 * Returns true if the loader should be skipped (user has visited before).
 * Pure check — does not write the key. The key is written only when the
 * loader's `dismiss` callback fires (so a half-finished first visit
 * doesn't cause future visits to skip).
 */
export function hasSeenLoader(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(LOADER_SEEN_KEY) === "1";
  } catch {
    // Private mode / disabled storage — behave as if not seen.
    return false;
  }
}

function waitForReady(): Promise<void> {
  return new Promise((resolve) => {
    const done = () => resolve();

    if (document.readyState === "complete") {
      void document.fonts.ready.then(done);
      return;
    }

    window.addEventListener(
      "load",
      () => {
        void document.fonts.ready.then(done);
      },
      { once: true },
    );
  });
}

export function useInitialLoad() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  // Track whether the user has previously seen the loader so we can skip
  // straight to ready on repeat visits.
  const skip = useRef(hasSeenLoader());

  useEffect(() => {
    if (skip.current) {
      setProgress(100);
      setReady(true);
      return;
    }

    let cancelled = false;
    let finished = false;
    const started = performance.now();
    let raf = 0;

    const tick = () => {
      if (cancelled || finished) return;
      const elapsed = performance.now() - started;
      const eased = Math.min(92, 12 + (1 - Math.exp(-elapsed / 900)) * 80);
      setProgress((prev) => Math.max(prev, eased));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setProgress(100);

      const elapsed = performance.now() - started;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

      window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, remaining);
    };

    const maxTimer = window.setTimeout(finish, MAX_WAIT_MS);

    void waitForReady().then(() => {
      window.clearTimeout(maxTimer);
      finish();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(maxTimer);
    };
  }, []);

  return { ready, progress, skip: skip.current };
}

function LoaderProgressBar({
  progress,
  reduceMotion,
  className,
}: {
  progress: number;
  reduceMotion: boolean | null;
  className?: string;
}) {
  const value = Math.round(Math.min(100, Math.max(0, progress)));

  return (
    <div
      className={cn(
        "h-0.5 w-full overflow-hidden rounded-full bg-border/50",
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading progress"
    >
      <div
        className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
        style={{
          width: `${value}%`,
          transition: reduceMotion ? "none" : "width 180ms ease-out",
        }}
      />
    </div>
  );
}

export function NotionLoader({
  exiting,
  progress,
  onDismiss,
  skip = false,
}: {
  exiting: boolean;
  progress: number;
  onDismiss?: () => void;
  /** When true, don't render the loader at all. */
  skip?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const { profile, site } = staticPortfolio;
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    try {
      window.localStorage.setItem(LOADER_SEEN_KEY, "1");
    } catch {
      // Ignore — non-critical.
    }
    onDismiss?.();
  };

  useEffect(() => {
    if (exiting && reduceMotion) dismiss();
  }, [exiting, reduceMotion]);

  if (skip) return null;

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col bg-background",
        exiting ? "pointer-events-none" : "pointer-events-auto",
      )}
      initial={false}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (exiting) dismiss();
      }}
      aria-hidden={exiting}
      aria-busy={!exiting}
      aria-label="Loading workspace"
    >
      <LoaderProgressBar
        progress={progress}
        reduceMotion={reduceMotion}
        className="h-0.5 rounded-none bg-border/40"
      />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex w-full max-w-[160px] flex-col items-center gap-3 text-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-base shadow-sm">
            {profile.pageIcon}
          </span>
          <p className="truncate text-xs font-medium text-foreground">
            {site.workspaceName}
          </p>
          <LoaderProgressBar progress={progress} reduceMotion={reduceMotion} />
          <p className="text-[11px] tabular-nums text-muted-foreground">
            Loading… {Math.round(progress)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}
