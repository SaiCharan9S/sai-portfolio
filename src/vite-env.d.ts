/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GitHub PAT for DETAILS.md + repo metadata (optional, improves rate limits) */
  readonly VITE_GITHUB_TOKEN?: string;
  /** Portfolio API base URL (optional; dev uses Vite /api proxy) */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
