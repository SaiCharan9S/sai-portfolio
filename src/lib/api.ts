const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface VisitStats {
  liveVisitors: number;
  totalVisits: number;
}

export interface ContentResponse {
  portfolio: Record<string, unknown>;
  source: string;
  updatedAt: string | null;
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function fetchVisitStats(): Promise<VisitStats> {
  const res = await fetch(`${API_BASE}/api/visits/stats`);
  return parseJson<VisitStats>(res);
}

export async function pingVisit(sessionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/visits/ping`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) {
    throw new Error("Visit ping failed");
  }
}

export async function fetchPortfolioContent(): Promise<ContentResponse> {
  const res = await fetch(`${API_BASE}/api/content`);
  return parseJson<ContentResponse>(res);
}
