import { usePortfolio } from "@/context/PortfolioProvider";
import { ContactMeButton } from "@/components/contact/ContactMeButton";
import { getDisplayStatus } from "@/lib/easter-eggs/status";
import { ContactSocialDialog } from "@/components/contact/ContactSocialDialog";
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
import { FileText, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const HERO_ACTION_CLASS =
  "h-9 min-w-[10.25rem] justify-center px-4 text-sm font-semibold shadow-sm";

export function PageHeader() {
  const { portfolio } = usePortfolio();
  const { profile, site } = portfolio;

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
          <div className="mb-4 inline-flex overflow-hidden rounded-md bg-background p-1 shadow-sm ring-1 ring-border">
            {profile.avatar ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-sm sm:h-24 sm:w-24">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="absolute left-1/2 top-1/2 h-[108%] w-[108%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[center_22%]"
                />
              </div>
            ) : (
              <span className="p-1.5 text-5xl leading-none">
                {profile.pageIcon}
              </span>
            )}
          </div>

          <h1 className={cn(HERO_TITLE, "text-foreground")}>{profile.name}</h1>
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
            <a
              href={site.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hint="View resume"
              className={`inline-flex items-center gap-2 rounded-md bg-[#DC2626] text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] ${HERO_ACTION_CLASS}`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              Resume
            </a>
            <div className="ml-auto shrink-0">
              <ContactSocialDialog />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
