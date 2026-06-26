import type { ReactNode } from "react";
import { portfolio } from "@/data";
import { Button } from "@/components/ui/button";
import { PropertyPill } from "@/components/notion/PropertyPill";
import { FileText, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

function SocialButton({
  href,
  label,
  icon,
  className,
  hint,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  className: string;
  hint: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      data-cursor-hint={hint}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition-opacity hover:opacity-90",
        className,
      )}
    >
      {icon}
    </a>
  );
}

export function PageHeader({ onBookCall }: { onBookCall: () => void }) {
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

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={onBookCall} data-cursor-hint="Schedule a meeting">
              📅 Book a call
            </Button>
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
            <SocialButton
              href={site.github}
              label="GitHub"
              hint="Visit GitHub profile"
              icon={<Github className="h-4 w-4" />}
              className="bg-[#24292f]"
            />
            <SocialButton
              href={site.linkedin}
              label="LinkedIn"
              hint="Visit LinkedIn profile"
              icon={<Linkedin className="h-4 w-4" />}
              className="bg-[#0A66C2]"
            />
            <SocialButton
              href={site.whatsapp}
              label="WhatsApp"
              hint="Message on WhatsApp"
              icon={
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              }
              className="bg-[#25D366]"
            />
            <SocialButton
              href={site.twitter}
              label="X"
              hint="Visit X profile"
              icon={
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              }
              className="bg-black dark:bg-white dark:text-black"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
