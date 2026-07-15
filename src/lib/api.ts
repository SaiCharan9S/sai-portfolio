const API_BASE = import.meta.env.VITE_API_URL ?? "";

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

export async function fetchPortfolioContent(): Promise<ContentResponse> {
  const res = await fetch(`${API_BASE}/api/content`);
  return parseJson<ContentResponse>(res);
}
