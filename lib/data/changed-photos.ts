import { createClient } from "@/lib/supabase/server";
import type { ChangedPhoto, ChangedPhotoWithRelations, OverlayConfig } from "@/lib/types";

export async function createChangedPhoto(input: {
  photo_id: string;
  costume_id: string;
  result_url: string;
  overlay_metadata: Record<string, unknown>;
}): Promise<ChangedPhoto> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("changed_photos")
    .insert({ ...input, saved: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Uploads a composited result PNG to the `changed-photos` Storage bucket and
 * records the changed_photos row (unsaved preview — see markChangedPhotoSaved).
 */
export async function saveCompositeResult(input: {
  photoId: string;
  costumeId: string;
  overlayConfig: OverlayConfig;
  resultBuffer: Buffer;
}): Promise<ChangedPhoto> {
  const supabase = await createClient();
  const storagePath = `previews/${crypto.randomUUID()}.png`;
  const { error: uploadError } = await supabase.storage
    .from("changed-photos")
    .upload(storagePath, input.resultBuffer, { contentType: "image/png" });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("changed-photos").getPublicUrl(storagePath);

  return createChangedPhoto({
    photo_id: input.photoId,
    costume_id: input.costumeId,
    result_url: urlData.publicUrl,
    overlay_metadata: { ...input.overlayConfig } as unknown as Record<string, unknown>,
  });
}

export async function getChangedPhotoById(id: string): Promise<ChangedPhotoWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("changed_photos")
    .select("*, costume:costumes(*), photo:photos(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as ChangedPhotoWithRelations | null;
}

export async function getSavedGallery(): Promise<ChangedPhotoWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("changed_photos")
    .select("*, costume:costumes(*), photo:photos(*)")
    .eq("saved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ChangedPhotoWithRelations[];
}

export async function markChangedPhotoSaved(id: string): Promise<ChangedPhoto> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("changed_photos")
    .update({ saved: true })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteChangedPhoto(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("changed_photos").delete().eq("id", id);
  if (error) throw error;
}
