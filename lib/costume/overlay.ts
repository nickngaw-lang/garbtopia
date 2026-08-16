import sharp from "sharp";
import { readFile } from "fs/promises";
import path from "path";
import type { OverlayConfig } from "@/lib/types";

/**
 * Loads image bytes for either an absolute URL (Supabase Storage, external
 * host) or a path served from /public (e.g. "/costumes/kimono.svg" for our
 * seeded demo assets). Reading /public assets straight off disk avoids
 * needing a self-fetch over HTTP (which needs an absolute base URL) from
 * inside a server action.
 */
export async function loadImageBuffer(url: string): Promise<Buffer> {
  if (/^https?:\/\//i.test(url)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image (${res.status}): ${url}`);
    return Buffer.from(await res.arrayBuffer());
  }
  const relative = url.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relative);
  return readFile(filePath);
}

const DEFAULT_CONFIG: OverlayConfig = { x: 0.5, y: 0.35, scale: 0.6, rotation: 0 };

/**
 * Composites a costume image onto a photo per the costume's overlay_config.
 * v1 is a static placement (no segmentation) — Sharp resizes + rotates the
 * costume PNG/SVG and lays it on top of the photo at a fractional
 * x/y/scale position. Returns a PNG buffer.
 */
export async function compositeCostumeOnPhoto(
  photoBuffer: Buffer,
  costumeBuffer: Buffer,
  config: Partial<OverlayConfig> = {},
): Promise<Buffer> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const basePhoto = sharp(photoBuffer).rotate(); // auto-orient by EXIF
  const photoMeta = await basePhoto.metadata();
  const width = photoMeta.width ?? 800;
  const height = photoMeta.height ?? 1200;

  const targetCostumeWidth = Math.max(1, Math.round(width * cfg.scale));

  let costumeResized = await sharp(costumeBuffer, { density: 300 })
    .resize({ width: targetCostumeWidth })
    .toBuffer();

  if (cfg.rotation) {
    costumeResized = await sharp(costumeResized)
      .rotate(cfg.rotation, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
  }

  const costumeMeta = await sharp(costumeResized).metadata();
  const costumeWidth = costumeMeta.width ?? targetCostumeWidth;
  const costumeHeight = costumeMeta.height ?? targetCostumeWidth;

  const left = clamp(Math.round(width * cfg.x - costumeWidth / 2), -costumeWidth, width);
  const top = clamp(Math.round(height * cfg.y - costumeHeight / 2), -costumeHeight, height);

  const result = await sharp(photoBuffer)
    .rotate()
    .resize({ width, height })
    .composite([{ input: costumeResized, left, top }])
    .png()
    .toBuffer();

  return result;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
