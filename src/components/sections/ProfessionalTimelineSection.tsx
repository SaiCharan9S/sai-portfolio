import { motion, useReducedMotion } from "framer-motion";
import {
  NotionBlock,
  NotionHeading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { PROFESSIONAL_JOURNEY } from "@/data/professional-journey";
import { SECTION_SCROLL_MT, SURFACE_ELEVATED } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function ProfessionalTimelineSection() {
  const reduceMotion = useReducedMotion();

  return (
    <FadeIn>
      <section id="journey" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>Professional Timeline</NotionHeading>
          <SectionMeta label="Journey" kind="Page" />
        </NotionBlock>

        <div className="relative mt-6 pl-8 sm:pl-10">
          {/* Vertical spine */}
          <div className="absolute bottom-2 left-[9px] top-2 w-px bg-border sm:left-[13px]" />

          <div className="flex flex-col gap-6">
            {PROFESSIONAL_JOURNEY.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={reduceMotion ? undefined : { opacity: 0, x: -16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className="relative"
              >
                {/* Year marker dot */}
                <span
                  className="absolute -left-8 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-500 bg-background sm:-left-10 sm:h-6 sm:w-6"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                <div
                  className={cn(
                    "rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md",
                    SURFACE_ELEVATED,
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg" aria-hidden>
                      {milestone.icon}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {milestone.year}
                    </span>
                  </div>
                  <p className="mt-2 font-semibold leading-snug">
                    {milestone.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
