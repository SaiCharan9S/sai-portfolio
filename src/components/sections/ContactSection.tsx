import { portfolio } from "@/data";
import { CalBookingButton } from "@/components/booking/CalBookingButton";
import { BookmarkBlock } from "@/components/notion/BookmarkBlock";
import { NotionBlock, NotionHeading } from "@/components/notion/NotionBlock";
import { FadeIn } from "@/components/notion/FadeIn";

export function ContactSection() {
  return (
    <FadeIn>
      <section id="contact" className="scroll-mt-8 pt-12 pb-16">
        <NotionBlock>
          <NotionHeading>Contact</NotionHeading>
          <p className="mt-1 text-xs text-muted-foreground">Bookmarks</p>
        </NotionBlock>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {portfolio.contact.map((link) => (
            <BookmarkBlock
              key={link.label}
              href={link.href}
              label={link.label}
              value={link.value}
              logo={link.logo}
            />
          ))}
          <CalBookingButton layout="card" />
        </div>

        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Last updated {portfolio.site.lastUpdated} · Built with React &
          shadcn/ui
        </footer>
      </section>
    </FadeIn>
  );
}
