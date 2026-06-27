import { useEffect, useState } from "react";
import { usePortfolio } from "@/context/PortfolioProvider";
import codolioSnapshot from "@/data/content/codolio-snapshot.json";
import {
  buildCpSectionData,
  buildStaticCpSectionData,
  fetchCodolioProfile,
} from "@/lib/codolio";
import type { CpSectionData } from "@/types/portfolio";

interface UseCodolioStatsResult {
  data: CpSectionData;
  loading: boolean;
  error: string | null;
  source: "live" | "snapshot" | "static";
}

function buildFromSnapshot(
  achievements: Parameters<typeof buildCpSectionData>[0],
): CpSectionData | null {
  if (!codolioSnapshot?.data) return null;
  return buildCpSectionData(achievements, {
    status: { success: true },
    data: codolioSnapshot.data,
  } as Parameters<typeof buildCpSectionData>[1]);
}

export function useCodolioStats(): UseCodolioStatsResult {
  const { portfolio } = usePortfolio();
  const { achievements } = portfolio;
  const staticData = buildStaticCpSectionData(achievements);
  const [data, setData] = useState<CpSectionData>(staticData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"live" | "snapshot" | "static">(
    "static",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const raw = await fetchCodolioProfile();
        if (cancelled) return;
        setData(buildCpSectionData(achievements, raw));
        setSource("live");
      } catch (err) {
        if (cancelled) return;
        const snapshotData = buildFromSnapshot(achievements);
        if (snapshotData) {
          setData(snapshotData);
          setSource("snapshot");
        } else {
          setData(buildStaticCpSectionData(achievements));
          setSource("static");
        }
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [achievements]);

  return { data, loading, error, source };
}
