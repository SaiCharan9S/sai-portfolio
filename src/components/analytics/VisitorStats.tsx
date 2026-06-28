import { Users } from "lucide-react";
import { useVisitStats } from "@/hooks/useVisitStats";
import { cn } from "@/lib/utils";

export function VisitorStats({
  variant = "sidebar",
  className,
}: {
  variant?: "sidebar" | "hero";
  className?: string;
}) {
  const { liveVisitors, totalVisits, available } = useVisitStats();

  if (!available) return null;

  const totalLabel = totalVisits === 1 ? "total visit" : "total visits";

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tabular-nums text-muted-foreground",
          className,
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {liveVisitors} viewing
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3 opacity-50" aria-hidden />
          {totalVisits.toLocaleString()} {totalLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5 text-[10px] tabular-nums text-muted-foreground",
        className,
      )}
    >
      <span className="inline-flex min-w-0 items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        <span className="truncate">{liveVisitors} online</span>
      </span>
      <span className="text-muted-foreground/30">·</span>
      <span className="inline-flex min-w-0 items-center gap-1 truncate">
        <Users className="h-2.5 w-2.5 shrink-0 opacity-50" aria-hidden />
        {totalVisits.toLocaleString()} {totalLabel}
      </span>
    </div>
  );
}
