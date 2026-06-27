import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildStaticPortfolio } from "@/data/static-portfolio";
import { fetchPortfolioContent } from "@/lib/api";
import type { Portfolio } from "@/types/portfolio";

type ContentSource = "static" | "mongodb";

interface PortfolioContextValue {
  portfolio: Portfolio;
  source: ContentSource;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function isPortfolio(value: unknown): value is Portfolio {
  if (!value || typeof value !== "object") return false;
  const keys = [
    "profile",
    "experience",
    "projects",
    "skills",
    "education",
    "certifications",
    "achievements",
    "volunteer",
    "recommendations",
    "contact",
    "heroStats",
    "sections",
    "site",
  ];
  return keys.every((key) => key in value);
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>(buildStaticPortfolio);
  const [source, setSource] = useState<ContentSource>("static");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void fetchPortfolioContent()
      .then((response) => {
        if (cancelled) return;
        if (!isPortfolio(response.portfolio)) {
          throw new Error("Invalid portfolio payload");
        }
        setPortfolio(response.portfolio);
        setSource(response.source === "mongodb" ? "mongodb" : "static");
      })
      .catch((error) => {
        if (!cancelled) {
          console.warn("[portfolio] Using static JSON fallback", error);
          setPortfolio(buildStaticPortfolio());
          setSource("static");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ portfolio, source, loading }),
    [portfolio, source, loading],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
