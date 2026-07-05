import { usePortfolio } from "@/context/PortfolioProvider";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

const LABEL = "Contact me";

export const contactMeSurfaceClass =
  "border-emerald-400/60 bg-gradient-to-br from-emerald-50 to-teal-100 dark:border-emerald-500/50 dark:from-emerald-600 dark:to-teal-600";

export const contactMeHoverClass =
  "transition-all duration-200 hover:brightness-105 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] dark:hover:brightness-110";

interface ContactMeButtonProps {
  layout?: "inline" | "full" | "card";
  className?: string;
}

export function ContactMeButton({
  layout = "inline",
  className,
}: ContactMeButtonProps) {
  const { portfolio } = usePortfolio();
  const phone = portfolio.contact.find((c) => c.label === "Phone");
  if (!phone) return null;

  const linkProps = {
    href: phone.href,
    "data-cursor-hint": `Call ${phone.value}`,
  };

  if (layout === "card") {
    return (
      <a
        {...linkProps}
        className={cn(
          "group flex w-full items-center gap-3 rounded-md border p-3 text-left shadow-sm",
          contactMeSurfaceClass,
          contactMeHoverClass,
          className,
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            "bg-black/5 dark:bg-white/15",
          )}
        >
          <Phone className="h-4 w-4 text-black dark:text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-black/60 dark:text-emerald-100/90">
            {LABEL}
          </p>
          <p className="truncate text-sm font-semibold text-black dark:text-white">
            {phone.value}
          </p>
        </div>
      </a>
    );
  }

  return (
    <a
      {...linkProps}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border text-sm font-semibold shadow-sm",
        contactMeSurfaceClass,
        contactMeHoverClass,
        "text-black dark:text-white",
        layout === "full" ? "h-9 w-full justify-start px-3" : "h-9 px-4",
        className,
      )}
    >
      <Phone className="h-4 w-4 shrink-0" />
      {LABEL}
    </a>
  );
}
