import { portfolio } from "@/data";
import { CalBookingButton } from "@/components/booking/CalBookingButton";
import { PropertyPill } from "@/components/notion/PropertyPill";
import { SocialLinkButton } from "@/components/ui/BrandLogo";
import { SOCIAL_LOGOS } from "@/lib/social-logos";
import { FileText } from "lucide-react";

export function PageHeader() {
  const { profile, site } = portfolio;

  return (
    <section id="hero" className="scroll-mt-4">
      <div className="relative h-44 w-full sm:h-52 md:h-60">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${encodeURI(site.coverImage)}")` }}
          role="img"
          aria-label="SK Sahil Parvez banner"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-[900px] px-6 sm:px-12">
        <div className="relative -mt-12 sm:-mt-14">
          <div className="mb-4 inline-flex rounded-md bg-background p-1.5 text-5xl leading-none shadow-sm ring-1 ring-border">
            {profile.pageIcon}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">{profile.title}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {profile.tagline}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {profile.properties.map((prop) => (
              <PropertyPill
                key={prop.label}
                label={prop.label}
                value={prop.value}
                type={prop.type}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <CalBookingButton />
            <a
              href={site.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hint="View CV on Google Drive"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#DC2626] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <FileText className="h-4 w-4" />
              CV
            </a>
            <SocialLinkButton
              href={site.github}
              label="GitHub"
              logo={SOCIAL_LOGOS.github}
              hint="Visit GitHub profile"
            />
            <SocialLinkButton
              href={site.linkedin}
              label="LinkedIn"
              logo={SOCIAL_LOGOS.linkedin}
              hint="Visit LinkedIn profile"
            />
            <SocialLinkButton
              href={site.whatsapp}
              label="WhatsApp"
              logo={SOCIAL_LOGOS.whatsapp}
              hint="Message on WhatsApp"
            />
            <SocialLinkButton
              href={site.twitter}
              label="X"
              logo={SOCIAL_LOGOS.x}
              hint="Visit X profile"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
