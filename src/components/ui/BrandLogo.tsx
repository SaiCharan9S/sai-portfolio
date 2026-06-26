import { cn } from "@/lib/utils";

interface BrandLogoProps {
  src: string;
  alt?: string;
  size?: "sm" | "md";
  className?: string;
}

const sizeClass = {
  sm: {
    box: "h-4 w-4",
    img: "h-full w-full",
  },
  md: {
    box: "h-9 w-9 rounded-md bg-muted/50 p-1.5",
    img: "h-full w-full",
  },
} as const;

export function BrandLogo({
  src,
  alt = "",
  size = "md",
  className,
}: BrandLogoProps) {
  const sizes = sizeClass[size];

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizes.box,
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          sizes.img,
          "object-contain dark:invert dark:brightness-200",
        )}
      />
    </span>
  );
}

interface SocialLinkButtonProps {
  href: string;
  label: string;
  logo: string;
  hint?: string;
  className?: string;
}

export function SocialLinkButton({
  href,
  label,
  logo,
  hint,
  className,
}: SocialLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      data-cursor-hint={hint ?? `Open ${label}`}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card p-2",
        "transition-colors hover:bg-notion-hover",
        className,
      )}
    >
      <BrandLogo src={logo} alt={label} size="sm" className="h-full w-full" />
    </a>
  );
}
