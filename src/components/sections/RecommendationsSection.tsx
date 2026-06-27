import { useCallback, useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/context/PortfolioProvider";
import type { Recommendation } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  NotionBlock,
  NotionHeading,
  NotionSubheading,
  SectionMeta,
} from "@/components/notion/NotionBlock";
import { NotionPropertyTable } from "@/components/notion/NotionPropertyTable";
import type { NotionPropertyRow } from "@/components/notion/NotionPropertyTable";
import { FadeIn } from "@/components/notion/FadeIn";
import { Skeleton } from "@/components/ui/skeleton";
import {
  REC_SLIDE,
  RECS_SCROLL,
  SECTION_SCROLL_MT,
  SURFACE_ELEVATED,
} from "@/lib/layout";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function RecommenderAvatar({ item }: { item: Recommendation }) {
  if (item.avatar) {
    return (
      <img
        src={item.avatar}
        alt=""
        className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
      />
    );
  }

  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 text-sm font-semibold text-muted-foreground"
      aria-hidden
    >
      {initials(item.name)}
    </span>
  );
}

function RecommendationDetail({ item }: { item: Recommendation }) {
  const rows: NotionPropertyRow[] = [
    { label: "Role", value: item.role },
    { label: "Date", value: item.date },
    { label: "Relationship", value: item.relationship },
    ...(item.linkedin
      ? [
          {
            label: "LinkedIn",
            value: (
              <a
                href={item.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                View profile
                <ExternalLink className="h-3 w-3" />
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <RecommenderAvatar item={item} />
        <h2 className="text-xl font-bold">{item.name}</h2>
      </div>

      <NotionPropertyTable rows={rows} />

      <div>
        <NotionSubheading>Recommendation</NotionSubheading>
        <p className="text-sm leading-relaxed text-foreground/90">
          {item.text}
        </p>
      </div>

      {item.stack && item.stack.length > 0 && (
        <div>
          <NotionSubheading>Mentioned</NotionSubheading>
          <div className="flex flex-wrap gap-1.5">
            {item.stack.map((tag) => (
              <Badge key={tag} variant="tag">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const REC_CARD_MIN_H = "min-h-[15.5rem] sm:min-h-[16.5rem]";

function RecommendationCard({
  item,
  onClick,
  className,
}: {
  item: Recommendation;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-rec-card
      data-cursor-hint="View recommendation"
      className={cn(
        "flex h-full w-full flex-col rounded-lg border border-border p-4 text-left transition-colors hover:bg-notion-hover",
        REC_CARD_MIN_H,
        SURFACE_ELEVATED,
        className,
      )}
    >
      <div className="flex shrink-0 gap-3">
        <RecommenderAvatar item={item} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.role}</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {item.date}, {item.relationship}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-6 flex-1 text-sm leading-relaxed text-foreground/90">
        {item.text}
      </p>
    </button>
  );
}

function RecommendationSkeletonCard() {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col rounded-lg border border-dashed border-border/80 p-4",
        REC_CARD_MIN_H,
        SURFACE_ELEVATED,
      )}
      aria-label="No recommendations"
    >
      <div className="flex shrink-0 gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-48 max-w-full" />
        </div>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-[88%]" />
        <Skeleton className="h-3 w-[95%]" />
        <Skeleton className="h-3 w-[76%]" />
      </div>
      <p className="pointer-events-none absolute inset-x-4 bottom-4 text-center text-sm text-muted-foreground">
        No recommendations yet.
      </p>
    </div>
  );
}

function RecommendationEmptyState() {
  return (
    <div className="relative">
      <div className={RECS_SCROLL}>
        <div className={REC_SLIDE}>
          <RecommendationSkeletonCard />
        </div>
      </div>
      <div className="mt-3 min-h-[0.375rem]" aria-hidden />
    </div>
  );
}

function RecommendationCarousel({
  items,
  onSelect,
}: {
  items: Recommendation[];
  onSelect: (item: Recommendation) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const showControls = items.length > 1;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;

    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.min(Math.max(0, index), items.length - 1));
  }, [items.length]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.min(Math.max(0, index), items.length - 1);
      el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    },
    [items.length],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({ left: 0, behavior: "auto" });
    setActiveIndex(0);

    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", onScroll);
    window.addEventListener("resize", onScroll);

    const ro = new ResizeObserver(onScroll);
    ro.observe(el);

    onScroll();

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
    };
  }, [items, updateScrollState]);

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < items.length - 1;

  return (
    <div className="relative">
      {showControls && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous recommendation"
            disabled={!canPrev}
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="absolute -left-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full bg-background/95 shadow-sm sm:flex md:-left-3"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next recommendation"
            disabled={!canNext}
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="absolute -right-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full bg-background/95 shadow-sm sm:flex md:-right-3"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      <div className={RECS_SCROLL} ref={scrollRef}>
        {items.map((item) => (
          <div key={item.id} className={REC_SLIDE}>
            <RecommendationCard item={item} onClick={() => onSelect(item)} />
          </div>
        ))}
      </div>

      {showControls ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to recommendation ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === activeIndex
                  ? "w-4 bg-emerald-500 dark:bg-emerald-400"
                  : "w-1.5 bg-border hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 min-h-[0.375rem]" aria-hidden />
      )}
    </div>
  );
}

export function RecommendationsSection() {
  const { portfolio } = usePortfolio();
  const items = portfolio.recommendations;
  const [selected, setSelected] = useState<Recommendation | null>(null);

  return (
    <FadeIn>
      <section id="recommendations" className={SECTION_SCROLL_MT}>
        <NotionBlock>
          <NotionHeading>Recommendations</NotionHeading>
          <SectionMeta label="Carousel" />
        </NotionBlock>

        <div className="mt-4">
          {items.length === 0 ? (
            <RecommendationEmptyState />
          ) : (
            <RecommendationCarousel items={items} onSelect={setSelected} />
          )}
        </div>

        <Sheet
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <SheetContent className="overflow-y-auto sm:max-w-lg">
            <p className="mb-4 text-xs text-muted-foreground">
              Workspace / Recommendations / {selected?.name}
            </p>
            {selected && <RecommendationDetail item={selected} />}
          </SheetContent>
        </Sheet>
      </section>
    </FadeIn>
  );
}
