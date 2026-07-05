import { usePortfolio } from "@/context/PortfolioProvider";
import {
  NotionBlock,
  NotionHeading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { motion, useReducedMotion } from "framer-motion";
import { SECTION_SCROLL_MT, SURFACE_ELEVATED } from "@/lib/layout";
import { cn } from "@/lib/utils";

/**
 * Featured achievement card — bento-style tile with a glowing gradient
 * border, animated icon, and a corner accent that fades in on hover.
 */
function AchievementCard({
  icon,
  text,
  index,
}: {
  icon: string;
  text: string;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: Math.min(index, 8) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className="group relative"
    >
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-xl border border-border/70 bg-card p-4",
          "transition-all duration-300",
          "hover:border-emerald-400/60 hover:shadow-[0_8px_30px_-12px_rgba(16,185,129,0.35)]",
          SURFACE_ELEVATED,
        )}
      >
        {/* Animated gradient sheen on hover */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            "bg-[linear-gradient(135deg,rgba(16,185,129,0.08)_0%,rgba(99,102,241,0.06)_50%,rgba(236,72,153,0.08)_100%)]",
          )}
        />

        {/* Top corner accent — fades in on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-emerald-400/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative flex items-start gap-3">
          {/* Icon medallion */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              "bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-pink-500/15",
              "ring-1 ring-emerald-500/20",
              "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]",
            )}
          >
            <span aria-hidden className="text-xl leading-none drop-shadow-sm">
              {icon}
            </span>
          </div>

          <p className="flex-1 text-sm leading-relaxed text-foreground/90">
            {text}
          </p>
        </div>

        {/* Bottom progress-bar-like accent — animates from 0 → full width on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 bottom-0 h-px overflow-hidden"
        >
          <div
            className={cn(
              "h-full w-0 bg-gradient-to-r from-emerald-400 via-sky-400 to-pink-400",
              "transition-[width] duration-700 ease-out group-hover:w-full",
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedAchievementsSection() {
  const { portfolio } = usePortfolio();

  return (
    <FadeIn>
      <section id="featured-achievements" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>Featured Achievements</NotionHeading>
          <SectionMeta label="Grid" />
        </NotionBlock>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {portfolio.featuredAchievements.map((item, index) => (
            <AchievementCard
              key={item.id}
              icon={item.icon}
              text={item.text}
              index={index}
            />
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
