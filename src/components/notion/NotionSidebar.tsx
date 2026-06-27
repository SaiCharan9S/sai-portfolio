import { useEffect, useState } from "react";
import { portfolio } from "@/data";
import { CalBookingButton } from "@/components/booking/CalBookingButton";
import { SocialLinkButton } from "@/components/ui/BrandLogo";
import { scrollToSection } from "@/lib/utils";
import { SOCIAL_LOGOS } from "@/lib/social-logos";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";

interface NotionSidebarProps {
  activeSection: string;
}

function SidebarNav({
  activeSection,
  onNavigate,
}: NotionSidebarProps & { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 p-2">
      {portfolio.sections.map((section) => (
        <button
          key={section.id}
          data-cursor-hint={`Go to ${section.label}`}
          onClick={() => {
            scrollToSection(section.id);
            onNavigate?.();
          }}
          className={cn(
            "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
            activeSection === section.id
              ? "bg-notion-hover font-medium text-foreground"
              : "text-muted-foreground hover:bg-notion-hover hover:text-foreground",
          )}
        >
          <span className="text-base leading-none">{section.icon}</span>
          <span className="truncate">{section.label}</span>
        </button>
      ))}
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="grid w-full grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => theme === "dark" && toggleTheme()}
        data-cursor-hint="Switch to light mode"
        aria-pressed={theme === "light"}
        className={cn(
          "flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all",
          theme === "light"
            ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        Light
      </button>
      <button
        type="button"
        onClick={() => theme === "light" && toggleTheme()}
        data-cursor-hint="Switch to dark mode"
        aria-pressed={theme === "dark"}
        className={cn(
          "flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all",
          theme === "dark"
            ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Moon className="h-3.5 w-3.5" />
        Dark
      </button>
    </div>
  );
}

function SidebarFooter() {
  const { site } = portfolio;

  const socialLinks = [
    { href: site.github, label: "GitHub", logo: SOCIAL_LOGOS.github },
    { href: site.linkedin, label: "LinkedIn", logo: SOCIAL_LOGOS.linkedin },
    { href: site.whatsapp, label: "WhatsApp", logo: SOCIAL_LOGOS.whatsapp },
    { href: site.twitter, label: "X", logo: SOCIAL_LOGOS.x },
  ] as const;

  return (
    <div className="shrink-0 space-y-2.5 border-t border-border p-3">
      <div className="grid w-full grid-cols-4 justify-items-center gap-1">
        {socialLinks.map((link) => (
          <SocialLinkButton
            key={link.label}
            href={link.href}
            label={link.label}
            logo={link.logo}
            hint={`Visit ${link.label}`}
          />
        ))}
      </div>
      <CalBookingButton layout="full" />
      <ThemeToggle />
    </div>
  );
}

/** Fixed left sidebar — desktop only */
export function NotionSidebar({ activeSection }: NotionSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col overflow-hidden border-r border-border bg-notion-sidebar md:flex">
      <div className="shrink-0 border-b border-border px-4 py-4">
        <p className="text-xs font-medium text-muted-foreground">Workspace</p>
        <p className="mt-0.5 truncate text-sm font-semibold">
          {portfolio.site.workspaceName}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        <SidebarNav activeSection={activeSection} />
      </div>
      <SidebarFooter />
    </aside>
  );
}

/** Top bar + slide-out nav — mobile only */
export function MobileNavBar({ activeSection }: NotionSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex h-full w-[min(100vw-2rem,18rem)] flex-col p-0"
        >
          <div className="shrink-0 border-b border-border px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">
              Workspace
            </p>
            <p className="mt-0.5 font-semibold">
              {portfolio.site.workspaceName}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto py-2">
            <SidebarNav
              activeSection={activeSection}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
          <div className="mt-auto">
            <SidebarFooter />
          </div>
        </SheetContent>
      </Sheet>
      <span className="truncate text-sm font-semibold">
        {portfolio.profile.pageIcon} Sahil
      </span>
      <div className="flex shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const ids = portfolio.sections.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return activeSection;
}
