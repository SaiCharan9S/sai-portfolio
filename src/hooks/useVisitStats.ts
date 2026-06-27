import { useEffect, useState } from "react";
import { fetchVisitStats, pingVisit } from "@/lib/api";

const SESSION_KEY = "portfolio-visit-session";
const PING_INTERVAL_MS = 45_000;

function getOrCreateSessionId() {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function useVisitStats() {
  const [stats, setStats] = useState({ liveVisitors: 0, totalVisits: 0 });
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sessionId = getOrCreateSessionId();

    const refreshStats = () => {
      void fetchVisitStats()
        .then((data) => {
          if (!cancelled) {
            setStats(data);
            setAvailable(true);
          }
        })
        .catch(() => {
          if (!cancelled) setAvailable(false);
        });
    };

    const ping = () => {
      void pingVisit(sessionId)
        .then(refreshStats)
        .catch(() => {
          if (!cancelled) setAvailable(false);
        });
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
