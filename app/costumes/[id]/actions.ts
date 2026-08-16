"use server";

import { redirect } from "next/navigation";
import { getCostumeById } from "@/lib/data/costumes";
import { getPhotoById, createPhoto, uploadPhotoFile } from "@/lib/data/photos";
import { saveCompositeResult } from "@/lib/data/changed-photos";
import { logTouchpoint } from "@/lib/data/touchpoints";
import { compositeCostumeOnPhoto, loadImageBuffer } from "@/lib/costume/overlay";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);

export type TryCostumeState = { error: string | null };

export async function tryCostume(
  _prevState: TryCostumeState,
  formData: FormData,
): Promise<TryCostumeState> {
  const costumeId = String(formData.get("costumeId") ?? "");
  const demoPhotoId = String(formData.get("photoOption") ?? "");
  const file = formData.get("photoFile") as File | null;

  if (!costumeId) return { error: "Missing costume." };

  const costume = await getCostumeById(costumeId);
  if (!costume) return { error: "That costume no longer exists." };

  let photoId = demoPhotoId;

  if (file && file.size > 0) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return { error: "Please upload a JPG or PNG image." };
    }
    if (file.size > 8 * 1024 * 1024) {
      return { error: "Image is too large. Please upload something under 8MB." };
    }

    let width: number | undefined;
    let height: number | undefined;
    try {
      const sharp = (await import("sharp")).default;
      const buf = Buffer.from(await file.arrayBuffer());
      const meta = await sharp(buf).metadata();
      width = meta.width;
      height = meta.height;
    } catch {
      return { error: "Couldn't read that image. Try a different file." };
    }

    if (width && height && width > height * 1.15) {
      return { error: "Please upload a frontal (portrait-orientation) photo." };
    }

    let publicUrl: string;
    try {
      publicUrl = await uploadPhotoFile(file);
    } catch {
      return { error: "Upload failed. Check your connection and try again." };
    }
    const photo = await createPhoto(publicUrl, false);
    photoId = photo.id;
  }

  if (!photoId) {
    return { error: "Pick a demo photo or upload your own first." };
  }

  const photo = await getPhotoById(photoId);
  if (!photo) return { error: "That photo no longer exists." };

  let resultRowId: string;
  try {
    const [photoBuffer, costumeBuffer] = await Promise.all([
      loadImageBuffer(photo.image_url),
      loadImageBuffer(costume.image_url),
    ]);
    const composited = await compositeCostumeOnPhoto(photoBuffer, costumeBuffer, costume.overlay_config);

    const row = await saveCompositeResult({
      photoId: photo.id,
      costumeId: costume.id,
      overlayConfig: costume.overlay_config,
      resultBuffer: composited,
    });
    resultRowId = row.id;
  } catch (err) {
    console.error("tryCostume compositing failed:", err);
    return { error: "Couldn't apply that costume. Try another photo." };
  }

  await logTouchpoint({
    event_type: "costume_try",
    entity_type: "costume",
    entity_id: costume.id,
    metadata: { photo_id: photo.id, source_page: `/costumes/${costume.id}` },
  });

  redirect(`/result/${resultRowId}`);
}
