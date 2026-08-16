import { createClient } from "@/lib/supabase/server";
import type { Costume, CostumeCategory, CostumeWithTryCount } from "@/lib/types";

export async function getCategories(): Promise<CostumeCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("costume_categories")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getCostumes(categoryId?: string): Promise<Costume[]> {
  const supabase = await createClient();
  let query = supabase.from("costumes").select("*").order("created_at", { ascending: true });
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/**
 * Costumes ranked by try-count over the last 7 days, via the
 * costume_popularity SQL view (see supabase/migrations/0003_popularity.sql).
 * Falls back to plain costume order (try_count 0) if the view isn't there yet.
 */
export async function getCostumesRankedByPopularity(
  categoryId?: string,
): Promise<CostumeWithTryCount[]> {
  const supabase = await createClient();

  const { data: popularity, error: popError } = await supabase
    .from("costume_popularity")
    .select("costume_id, try_count");

  const costumes = await getCostumes(categoryId);

  if (popError || !popularity) {
    return costumes.map((c) => ({ ...c, try_count: 0 }));
  }

  const countMap = new Map<string, number>(
    popularity.map((p: { costume_id: string; try_count: number }) => [p.costume_id, p.try_count]),
  );

  return costumes
    .map((c) => ({ ...c, try_count: countMap.get(c.id) ?? 0 }))
    .sort((a, b) => (b.try_count ?? 0) - (a.try_count ?? 0));
}

export async function getCostumeById(id: string): Promise<Costume | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("costumes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCostume(input: {
  name: string;
  culture: string;
  region: string;
  category_id: string;
  image_url: string;
  overlay_config?: Costume["overlay_config"];
  tags?: string[];
}): Promise<Costume> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("costumes").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateCostume(
  id: string,
  patch: Partial<Pick<Costume, "name" | "culture" | "region" | "category_id" | "image_url" | "overlay_config" | "tags">>,
): Promise<Costume> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("costumes").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCostume(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("costumes").delete().eq("id", id);
  if (error) throw error;
}

export async function createCategory(name: string, displayOrder = 0): Promise<CostumeCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("costume_categories")
    .insert({ name, display_order: displayOrder })
    .select()
    .single();
  if (error) throw error;
  return data;
}
