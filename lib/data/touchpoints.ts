import { createClient } from "@/lib/supabase/server";
import type { Touchpoint, TouchpointEntityType, TouchpointEventType } from "@/lib/types";

/**
 * Logs one touchpoint. Never throws into the caller's happy path — a logging
 * failure should not block the user's actual action (per docs/SECURITY.md
 * "audit principle": every meaningful action is logged, but logging is
 * best-effort and must not be a single point of failure for the app).
 */
export async function logTouchpoint(input: {
  event_type: TouchpointEventType;
  entity_type?: TouchpointEntityType;
  entity_id?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("touchpoints").insert({
      event_type: input.event_type,
      entity_type: input.entity_type ?? null,
      entity_id: input.entity_id ?? null,
      metadata: input.metadata ?? {},
    });
    if (error) console.error("logTouchpoint failed:", error.message);
  } catch (err) {
    console.error("logTouchpoint threw:", err);
  }
}

export async function getRecentTouchpoints(limit = 50): Promise<Touchpoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("touchpoints")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
