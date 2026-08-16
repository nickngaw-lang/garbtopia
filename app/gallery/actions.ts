"use server";

import { revalidatePath } from "next/cache";
import { deleteChangedPhoto, getChangedPhotoById } from "@/lib/data/changed-photos";
import { logTouchpoint } from "@/lib/data/touchpoints";

export type DeleteState = { error: string | null };

export async function deleteGalleryItem(
  _prevState: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  const id = String(formData.get("changedPhotoId") ?? "");
  if (!id) return { error: "Missing item." };

  try {
    const existing = await getChangedPhotoById(id);
    await deleteChangedPhoto(id);
    await logTouchpoint({
      event_type: "delete",
      entity_type: "changed_photo",
      entity_id: id,
      metadata: { before_state: existing ? { result_url: existing.result_url, costume_id: existing.costume_id } : null },
    });
    revalidatePath("/gallery");
    return { error: null };
  } catch (err) {
    console.error("deleteGalleryItem failed:", err);
    return { error: "Delete failed. Check your connection and try again." };
  }
}
