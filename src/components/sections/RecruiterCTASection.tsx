import { FadeIn } from "@/components/notion/FadeIn";
import { Badge } from "@/components/ui/badge";
import { scrollToSection } from "@/lib/utils";
import { SECTION_SCROLL_MT, SURFACE_ELEVATED } from "@/lib/layout";
import { interactive } from "@/lib/interactions";
import { cn } from "@/lib/utils";
import { MapPin, Rocket, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Rocket, label: "Immediate Joiner" },
  { icon: MapPin, label: "Open to Bengaluru and Remote roles" },
];

const CORE_STACK = ["Python", "Django", "PostgreSQL", "AWS", "Docker"];

export function RecruiterCTASection() {
  return (
    <FadeIn>
      <section id="hire-me" className={SECTION_SCROLL_MT}>
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.07] via-card to-card p-6 text-center sm:p-10",
            SURFACE_ELEVATED,
          )}
        >
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
            <Badge
              variant="status"
              className="gap-1.5 border-emerald-300 bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Open to opportunities
            </Badge>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Looking for Python Backend Developer opportunities
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <Icon
                    className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
              {CORE_STACK.map((tech) => (
                <Badge key={tech} variant="tag" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              data-cursor-hint="Jump to contact section"
              className={cn(
                "mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-md active:scale-[0.98]",
                interactive,
              )}
            >
              <Rocket className="h-4 w-4" aria-hidden />
              Hire Me
            </button>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
