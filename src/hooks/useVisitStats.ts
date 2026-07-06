import { useEffect, useState } from "react";
import { fetchVisitStats, pingVisit } from "@/lib/api";

const SESSION_KEY = "portfolio-visit-session";
const PING_INTERVAL_MS = 45_000;
const LOCAL_TOTAL_KEY = "portfolio-local-total-visits";
const LOCAL_SESSION_SEEN_KEY = "portfolio-local-session-seen";

function getOrCreateSessionId() {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

/** Client-only fallback so the widget still shows something useful when the
 * backend/API isn't reachable (e.g. local dev without the server running). */
function getLocalFallbackStats() {
  const alreadyCountedThisSession = sessionStorage.getItem(
    LOCAL_SESSION_SEEN_KEY,
  );
  let total = Number(localStorage.getItem(LOCAL_TOTAL_KEY) ?? "0");

  if (!alreadyCountedThisSession) {
    total += 1;
    localStorage.setItem(LOCAL_TOTAL_KEY, String(total));
    sessionStorage.setItem(LOCAL_SESSION_SEEN_KEY, "1");
  }

  return { liveVisitors: 1, totalVisits: total };
}

export function useVisitStats() {
  const [stats, setStats] = useState({ liveVisitors: 0, totalVisits: 0 });
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sessionId = getOrCreateSessionId();

    const applyFallback = (err?: unknown) => {
      if (cancelled) return;
      if (import.meta.env.DEV || !err) {
        console.warn(
          "[visit-stats] API unreachable, using local fallback",
          err,
        );
      }
      setStats(getLocalFallbackStats());
      setAvailable(true);
    };

    const refreshStats = () => {
      void fetchVisitStats()
        .then((data) => {
          if (!cancelled) {
            setStats(data);
            setAvailable(true);
          }
        })
        .catch((err: unknown) => applyFallback(err));
    };

    const ping = () => {
      void pingVisit(sessionId)
        .then(refreshStats)
        .catch((err: unknown) => applyFallback(err));
    };

    ping();
    const interval = window.setInterval(ping, PING_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return { ...stats, available };
}
