import {
  NotionBlock,
  NotionHeading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";
import { Badge } from "@/components/ui/badge";
import {
  CURRENTLY_BUILDING,
  type BuildStatus,
} from "@/data/currently-building";
import { SECTION_SCROLL_MT, SURFACE_ELEVATED } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Badge styling per status — reuses the amber/emerald convention already
 * established for project "in progress" vs "shipped" states, plus a neutral
 * slate tone for anything still in the planning stage. */
const STATUS_STYLES: Record<BuildStatus, string> = {
  Planning:
    "border-slate-300/60 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  "In Progress":
    "border-amber-300/60 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  Completed:
    "border-emerald-300/60 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
};

function BuildingCard({ item }: { item: (typeof CURRENTLY_BUILDING)[number] }) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-300 ease-out",
        SURFACE_ELEVATED,
        "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-80",
          item.coverGradient,
        )}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-xl shadow-sm",
              item.coverGradient,
            )}
            aria-hidden
          >
            {item.icon}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight group-hover:text-primary">
              {item.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {item.tagline}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn("shrink-0 text-[10px]", STATUS_STYLES[item.status])}
        >
          {item.status}
        </Badge>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground/90">
        {item.description}
      </p>

      <div className="mt-auto flex flex-wrap gap-1 border-t border-border/60 pt-3 mt-3">
        {item.stack.map((tech) => (
          <Badge key={tech} variant="tag" className="text-[10px]">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function CurrentlyBuildingSection() {
  return (
    <FadeIn>
      <section id="currently-building" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <div className="flex flex-wrap items-center gap-2">
            <NotionHeading>Currently Building</NotionHeading>
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          </div>
          <SectionMeta label="Side projects" />
        </NotionBlock>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CURRENTLY_BUILDING.map((item) => (
            <BuildingCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
