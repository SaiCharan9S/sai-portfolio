import type { ImgHTMLAttributes } from "react";

/**
 * Renders a `<picture>` with AVIF and WebP sources, falling back to a
 * plain `<img>`. Sources are pre-resized during
 * `scripts/build-image-variants.mjs` and committed to `public/`.
 *
 * Use the `priority` flag for above-the-fold images (LCP candidates):
 * it sets `fetchpriority="high"` and skips `loading="lazy"`.
 */
interface ResponsiveImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  /** Path stem without width/extension, e.g. "sai" or "Sai_banner". */
  base: string;
  /** Final fallback src (the original full-size image). */
  src: string;
  /** Variant widths to advertise in the `srcset`. */
  widths: number[];
  /** Sizes attribute — the standard responsive-image sizes string. */
  sizes: string;
  /** Sets fetchpriority="high" and disables lazy loading. */
  priority?: boolean;
  /** Required alt text for the final <img>. */
  alt: string;
}

export function ResponsiveImage({
  base,
  src,
  widths,
  sizes,
  priority = false,
  alt,
  className,
  width,
  height,
  ...rest
}: ResponsiveImageProps) {
  // Sort widths ascending so srcset matches spec
  const sortedWidths = [...widths].sort((a, b) => a - b);
  const srcSet = sortedWidths
    .map((w) => `/${base}-${w}w.${"{format}"} ${w}w`)
    .join(", ");

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={srcSet.replace(/\{format\}/g, "avif")}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={srcSet.replace(/\{format\}/g, "webp")}
        sizes={sizes}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
        {...rest}
      />
    </picture>
  );
}

/**
 * Props preset for the hero avatar: rendered at ~80px on mobile, ~96px from sm.
 * Uses 240/480 widths; mobile clients download 240w (~3 KB AVIF) instead of
 * the 2 MB source.
 */
export const AVATAR_WIDTHS = [240, 480];
export const AVATAR_SIZES = "(min-width: 640px) 96px, 80px";

/**
 * Props preset for the hero cover banner: spans 100% of the page (max
 * 900px), so 768 covers 360×2 (mobile) and 1280/1920 cover desktop.
 */
export const BANNER_WIDTHS = [768, 1280, 1920];
export const BANNER_SIZES = "(min-width: 768px) 900px, 100vw";
