"use server";

import { markChangedPhotoSaved, getChangedPhotoById } from "@/lib/data/changed-photos";
import { logTouchpoint } from "@/lib/data/touchpoints";
import { revalidatePath } from "next/cache";

export type SaveState = { error: string | null; saved: boolean };

export async function saveChangedPhoto(
  _prevState: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const id = String(formData.get("changedPhotoId") ?? "");
  if (!id) return { error: "Missing result.", saved: false };

  try {
    const existing = await getChangedPhotoById(id);
    if (!existing) return { error: "That result no longer exists.", saved: false };

    await markChangedPhotoSaved(id);
    await logTouchpoint({
      event_type: "save",
      entity_type: "changed_photo",
      entity_id: id,
      metadata: { costume_id: existing.costume_id },
    });
    revalidatePath("/gallery");
    return { error: null, saved: true };
  } catch (err) {
    console.error("saveChangedPhoto failed:", err);
    return { error: "Save failed. Check your connection and try again.", saved: false };
  }
}
