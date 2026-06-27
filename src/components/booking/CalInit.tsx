import { useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioProvider";
import { initCalNamespaces } from "@/lib/cal";

export function CalInit() {
  const { portfolio } = usePortfolio();

  useEffect(() => {
    void initCalNamespaces(portfolio.site.calLinks);
  }, [portfolio.site.calLinks]);

  return null;
}
