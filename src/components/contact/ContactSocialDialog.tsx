import { portfolio } from "@/data";
import { SocialLinkButton } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SOCIAL_LOGOS } from "@/lib/social-logos";
import { Share2 } from "lucide-react";

const socialLinks = [
  {
    href: portfolio.site.github,
    label: "GitHub",
    logo: SOCIAL_LOGOS.github,
    hint: "Visit GitHub profile",
  },
  {
    href: portfolio.site.linkedin,
    label: "LinkedIn",
    logo: SOCIAL_LOGOS.linkedin,
    hint: "Visit LinkedIn profile",
  },
  {
    href: portfolio.site.whatsapp,
    label: "WhatsApp",
    logo: SOCIAL_LOGOS.whatsapp,
    hint: "Message on WhatsApp",
  },
  {
    href: portfolio.site.twitter,
    label: "X",
    logo: SOCIAL_LOGOS.x,
    hint: "Visit X profile",
  },
] as const;

export function ContactSocialDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="notion"
          size="icon"
          className="h-9 w-9 shrink-0 shadow-sm"
          aria-label="Contact"
          data-cursor-hint="Open social links"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Contact</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 justify-items-center gap-3 pt-1">
          {socialLinks.map((link) => (
            <SocialLinkButton
              key={link.label}
              href={link.href}
              label={link.label}
              logo={link.logo}
              hint={link.hint}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
