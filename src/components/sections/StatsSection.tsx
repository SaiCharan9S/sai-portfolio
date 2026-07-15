import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePortfolio } from "@/context/PortfolioProvider";
import type { HeroStat } from "@/types/portfolio";
import {
  NotionBlock,
  NotionHeading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { useCountUp } from "@/hooks/useCountUp";
import { SECTION_SCROLL_MT, SURFACE_ELEVATED } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Code2, Layers, Server, Sparkles, type LucideIcon } from "lucide-react";

/** Icon per stat id — falls back to Sparkles for anything unrecognized. */
const STAT_ICONS: Record<string, LucideIcon> = {
  experience: Server,
  apis: Code2,
  projects: Layers,
  specialization: Sparkles,
};

function StatCard({ stat, inView }: { stat: HeroStat; inView: boolean }) {
  const animate = stat.animate !== false && !stat.display;
  const count = useCountUp(stat.value, { start: inView && animate });
  const Icon = STAT_ICONS[stat.id] ?? Sparkles;

  const displayValue = stat.display
    ? stat.display
    : `${animate ? count : stat.value}${stat.suffix}`;

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 transition-colors sm:p-5",
        SURFACE_ELEVATED,
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Icon className="h-4.5 w-4.5" aria-hidden />
      </span>
      <p className="text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
        {displayValue}
      </p>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
    </div>
  );
}

export function StatsSection() {
  const { portfolio } = usePortfolio();
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();

  if (portfolio.heroStats.length === 0) return null;

  return (
    <FadeIn>
      <section id="stats" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>By the Numbers</NotionHeading>
          <SectionMeta label="Snapshot" kind="Page" />
        </NotionBlock>

        <motion.div
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          onViewportEnter={() => setInView(true)}
        >
          {portfolio.heroStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} inView={inView} />
          ))}
        </motion.div>
      </section>
    </FadeIn>
  );
}
