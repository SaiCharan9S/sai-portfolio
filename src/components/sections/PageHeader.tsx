import { usePortfolio } from "@/context/PortfolioProvider";
import { ContactMeButton } from "@/components/contact/ContactMeButton";
import { getDisplayStatus } from "@/lib/easter-eggs/status";
import { ContactSocialDialog } from "@/components/contact/ContactSocialDialog";
import { ShareMenu } from "@/components/contact/ShareMenu";
import { VisitorStats } from "@/components/analytics/VisitorStats";
import { PropertyPill } from "@/components/notion/PropertyPill";
import {
  HERO_AVATAR_OFFSET,
  HERO_COVER,
  HERO_TITLE,
  PAGE_X,
  PROPERTY_PILL_GRID,
} from "@/lib/layout";
import { cn } from "@/lib/utils";
import { FileText, RefreshCw, Rocket, Eye, Download } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const HERO_ACTION_CLASS =
  "h-9 min-w-[10.25rem] justify-center px-4 text-sm font-semibold shadow-sm";

export function PageHeader() {
  const { portfolio } = usePortfolio();
  const { profile, site } = portfolio;
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const resumeMenuRef = useRef<HTMLDivElement>(null);

  // Derive a sensible download filename from the CV path (e.g. "Sai-Charan-S-Resume.pdf")
  const resumeFileName = site.cvPath.split("/").pop() ?? "resume.pdf";

  useEffect(() => {
    if (!resumeMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!resumeMenuRef.current?.contains(event.target as Node)) {
        setResumeMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setResumeMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [resumeMenuOpen]);

  return (
    <section id="hero" className="scroll-mt-4">
      <div className={HERO_COVER}>
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${encodeURI(site.coverImage)}")` }}
          role="img"
          aria-label="Sai Charan S banner"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className={cn("mx-auto max-w-[900px]", PAGE_X)}>
        <div className={HERO_AVATAR_OFFSET}>
          <button
            type="button"
            onClick={() => setAvatarOpen(true)}
            data-cursor-hint="View profile photo"
            aria-label={`Open larger view of ${profile.name}'s profile photo`}
            className="group mb-4 inline-flex overflow-hidden rounded-md bg-background p-1 shadow-sm ring-1 ring-border transition-all duration-200 hover:-translate-y-0.5 hover:ring-emerald-400/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            {profile.avatar ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-sm sm:h-24 sm:w-24">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="absolute left-1/2 top-1/2 h-[108%] w-[108%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[center_22%] transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <span className="p-1.5 text-5xl leading-none">
                {profile.pageIcon}
              </span>
            )}
          </button>

          <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
            <AnimatePresence>
              {avatarOpen && (
                <DialogContent
                  forceMount
                  className="border-0 bg-transparent p-0 shadow-none sm:max-w-none sm:rounded-none"
                  onClick={() => setAvatarOpen(false)}
                >
                  <DialogTitle className="sr-only">
                    {profile.name} — profile photo
                  </DialogTitle>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => setAvatarOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative"
                    >
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="max-h-[85vh] max-w-[85vw] rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
                        />
                      ) : (
                        <span className="flex h-48 w-48 items-center justify-center rounded-2xl bg-background text-8xl shadow-2xl ring-1 ring-white/10">
                          {profile.pageIcon}
                        </span>
                      )}
                      <p className="mt-3 text-center text-sm font-medium text-white/90">
                        {profile.name}
                      </p>
                    </motion.div>
                  </motion.div>
                </DialogContent>
              )}
            </AnimatePresence>
          </Dialog>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className={cn(HERO_TITLE, "text-foreground")}>
              {profile.name}
            </h1>
            <Badge
              variant="status"
              className="h-7 gap-1.5 border-emerald-300 bg-emerald-100/80 px-2.5 text-xs font-semibold text-emerald-800 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_2px_8px_-2px_rgba(16,185,129,0.4)] dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
              title="Available to join immediately"
            >
              <span aria-hidden className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
              </span>
              <Rocket
                className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300"
                aria-hidden
              />
              Immediate Joiner
            </Badge>
          </div>
          <p className="mt-1 text-lg text-muted-foreground">{profile.title}</p>
          {site.lastUpdated ? (
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <RefreshCw className="h-3 w-3" aria-hidden />
              Updated {site.lastUpdated}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">
            {profile.tagline}
          </p>

          <div className="mt-3 md:hidden">
            <VisitorStats variant="hero" />
          </div>

          <div className={cn("mt-6", PROPERTY_PILL_GRID)}>
            {profile.properties.map((prop, index) => (
              <motion.div
                key={prop.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <PropertyPill
                  label={prop.label}
                  value={
                    prop.type === "status"
                      ? getDisplayStatus(prop.value)
                      : prop.value
                  }
                  type={prop.type}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <ContactMeButton className={HERO_ACTION_CLASS} />
            <div ref={resumeMenuRef} className="relative">
              <Button
                type="button"
                aria-haspopup="menu"
                aria-expanded={resumeMenuOpen}
                aria-label="Resume options"
                data-cursor-hint="Resume options"
                onClick={() => setResumeMenuOpen((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-md bg-[#DC2626] text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] ${HERO_ACTION_CLASS}`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                Resume
              </Button>

              <div
                role="menu"
                aria-label="Resume actions"
                className={cn(
                  "absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[10rem] rounded-lg border border-border bg-background p-1 shadow-lg",
                  "origin-top-left transition-all duration-150",
                  resumeMenuOpen
                    ? "pointer-events-auto scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0",
                )}
              >
                <a
                  role="menuitem"
                  href={site.cvPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hint="View resume in new tab"
                  onClick={() => setResumeMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-notion-hover"
                >
                  <Eye
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span>View</span>
                </a>
                <a
                  role="menuitem"
                  href={site.cvPath}
                  download={resumeFileName}
                  data-cursor-hint="Download resume"
                  onClick={() => setResumeMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-notion-hover"
                >
                  <Download
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span>Download</span>
                </a>
              </div>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <ShareMenu />
              <ContactSocialDialog />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
