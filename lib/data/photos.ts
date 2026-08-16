import { createClient } from "@/lib/supabase/server";
import type { Photo } from "@/lib/types";

export async function getDemoPhotos(): Promise<Photo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("is_demo", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("photos").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createPhoto(imageUrl: string, isDemo = false): Promise<Photo> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .insert({ image_url: imageUrl, is_demo: isDemo })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Uploads a user photo to the `photos` Supabase Storage bucket and returns
 * its public URL. Storage bucket is created + made public in
 * supabase/migrations/0002_storage_and_saved.sql.
 */
export async function uploadPhotoFile(file: File): Promise<string> {
  const supabase = await createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("photos").upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}
