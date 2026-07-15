import { StrictMode, Suspense, lazy, useState } from "react";
import { createRoot } from "react-dom/client";
import { PortfolioProvider } from "@/context/PortfolioProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorGuideProvider } from "@/components/cursor/CursorGuide";
import { EasterEggsInit } from "@/components/easter-eggs/EasterEggsInit";
import { TimeOnSitePulseProvider } from "@/hooks/useTimeOnSitePulse";
import {
  MobileNavBar,
  NotionSidebar,
  useActiveSection,
} from "@/components/notion/NotionSidebar";
import { NotionLoader, useInitialLoad } from "@/components/notion/NotionLoader";
import { SlashCommand } from "@/components/notion/SlashCommand";
import { CommandPaletteProvider } from "@/components/notion/CommandPaletteProvider";
import { NotionDivider } from "@/components/notion/NotionBlock";
import { CalInit } from "@/components/booking/CalInit";
import { PageHeader } from "@/components/sections/PageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageFooter } from "@/components/sections/PageFooter";
import { PAGE_PB, PAGE_X, SECTION_STACK } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { AdminPage } from "@/pages/AdminPage";
import "@/index.css";

// Below-the-fold sections are code-split so the initial bundle only pays for
// what's visible above the fold. Each chunk loads lazily as the user scrolls
// near it, keeping first paint fast without changing what's rendered.
const ProfessionalTimelineSection = lazy(() =>
  import("@/components/sections/ProfessionalTimelineSection").then((m) => ({
    default: m.ProfessionalTimelineSection,
  })),
);
const CurrentlyBuildingSection = lazy(() =>
  import("@/components/sections/CurrentlyBuildingSection").then((m) => ({
    default: m.CurrentlyBuildingSection,
  })),
);
const FeaturedAchievementsSection = lazy(() =>
  import("@/components/sections/FeaturedAchievementsSection").then((m) => ({
    default: m.FeaturedAchievementsSection,
  })),
);
const SkillsSection = lazy(() =>
  import("@/components/sections/SkillsSection").then((m) => ({
    default: m.SkillsSection,
  })),
);
const CertificationsSection = lazy(() =>
  import("@/components/sections/CertificationsSection").then((m) => ({
    default: m.CertificationsSection,
  })),
);
const VolunteerSection = lazy(() =>
  import("@/components/sections/VolunteerSection").then((m) => ({
    default: m.VolunteerSection,
  })),
);
const RecommendationsSection = lazy(() =>
  import("@/components/sections/RecommendationsSection").then((m) => ({
    default: m.RecommendationsSection,
  })),
);
const RecruiterCTASection = lazy(() =>
  import("@/components/sections/RecruiterCTASection").then((m) => ({
    default: m.RecruiterCTASection,
  })),
);

const isAdminRoute =
  window.location.pathname === "/admin" ||
  window.location.pathname === "/admin/";

/** Minimal, non-shifting placeholder shown while a lazy section's chunk
 * loads. Height-neutral so it doesn't cause layout jump once real content
 * mounts. */
function SectionFallback() {
  return (
    <div
      aria-hidden
      className="h-40 w-full animate-pulse rounded-lg bg-muted/20"
    />
  );
}

function AppShell() {
  const activeSection = useActiveSection();

  return (
    <CommandPaletteProvider>
      <div className="min-h-screen md:pl-60">
        <NotionSidebar activeSection={activeSection} />

        <main className="min-h-screen w-full min-w-0">
          <MobileNavBar activeSection={activeSection} />
          <PageHeader />
          <div
            className={cn(
              "mx-auto max-w-[900px]",
              SECTION_STACK,
              PAGE_X,
              PAGE_PB,
            )}
          >
            <NotionDivider />
            <AboutSection />
            <StatsSection />
            <EducationSection />
            <ExperienceSection />
            <Suspense fallback={<SectionFallback />}>
              <ProfessionalTimelineSection />
            </Suspense>
            <ProjectsSection />
            <Suspense fallback={<SectionFallback />}>
              <CurrentlyBuildingSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <FeaturedAchievementsSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <SkillsSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <CertificationsSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <VolunteerSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <RecommendationsSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <RecruiterCTASection />
            </Suspense>
            <ContactSection />
            <PageFooter />
          </div>
        </main>

        <SlashCommand />
      </div>
    </CommandPaletteProvider>
  );
}

function App() {
  const { ready, progress, skip } = useInitialLoad();
  // Repeat visits: `skip` is true and the loader mounts as `null`; the local
  // app shell paints immediately without the overlay flash.
  const [showLoader, setShowLoader] = useState(!skip);

  return (
    <ThemeProvider>
      <TimeOnSitePulseProvider>
        <CursorGuideProvider>
          <EasterEggsInit />
          <CalInit />
          <AppShell />
          {showLoader && (
            <NotionLoader
              exiting={ready}
              progress={progress}
              skip={skip}
              onDismiss={() => setShowLoader(false)}
            />
          )}
        </CursorGuideProvider>
      </TimeOnSitePulseProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isAdminRoute ? (
      <ThemeProvider>
        <AdminPage />
      </ThemeProvider>
    ) : (
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    )}
  </StrictMode>,
);
