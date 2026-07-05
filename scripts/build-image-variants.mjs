#!/usr/bin/env node
/**
 * Build AVIF + WebP variants of the hero avatar and cover banner.
 * Run once after adding new source images to `public/`. The output
 * files are committed so production deploys can serve them straight
 * from Vercel's CDN.
 *
 * Source images:
 *   public/sai.jpeg       1254×1254 — hero avatar
 *   public/Sai_banner.png 1983×793  — hero cover banner
 *
 * Variants are written to the same directory; the `ResponsiveImage`
 * component picks them up by naming convention.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "..", "public");

/** AVIF quality — Vercel docs recommend 50 for photographic content. */
const AVIF_QUALITY = 50;
/** WebP quality — 75 is the standard for visually-lossless photographic. */
const WEBP_QUALITY = 75;

/**
 * @typedef {{ src: string; base: string; widths: number[]; keep?: string[] }} Target
 */

/** @type {Target[]} */
const TARGETS = [
  {
    src: "sai.jpeg",
    base: "sai",
    widths: [240, 480],
  },
  {
    src: "Sai_banner.png",
    base: "Sai_banner",
    widths: [768, 1280, 1920],
  },
];

async function buildOneVariant(srcPath, baseName, width, format) {
  const pipeline = sharp(srcPath, { failOn: "none" })
    .resize({
      width,
      withoutEnlargement: true,
      fit: "inside",
    })
    .toFormat(format, {
      ...(format === "avif" ? { quality: AVIF_QUALITY } : {}),
      ...(format === "webp" ? { quality: WEBP_QUALITY } : {}),
    });

  const outPath = join(PUBLIC_DIR, `${baseName}-${width}w.${format}`);
  const buf = await pipeline.toBuffer();
  await writeFile(outPath, buf);
  return outPath;
}

async function main() {
  let totalSaved = 0;
  for (const target of TARGETS) {
    const srcPath = join(PUBLIC_DIR, target.src);
    const srcStat = await readFile(srcPath);
    console.log(
      `\n→ ${target.src} (${(srcStat.byteLength / 1024).toFixed(0)} KB)`,
    );
    for (const width of target.widths) {
      for (const format of ["avif", "webp"]) {
        const out = await buildOneVariant(srcPath, target.base, width, format);
        const outStat = await readFile(out);
        const saved = srcStat.byteLength - outStat.byteLength;
        totalSaved += saved;
        console.log(
          `  ${format.padEnd(4)} ${width}w  ${(outStat.byteLength / 1024)
            .toFixed(0)
            .padStart(5)} KB  ${(saved / 1024).toFixed(0)} KB saved`,
        );
      }
    }
  }
  console.log(
    `\nDone. ${(totalSaved / 1024 / 1024).toFixed(1)} MB saved across all variants.`,
  );
}

await mkdir(PUBLIC_DIR, { recursive: true }).catch(() => {});
await main();
