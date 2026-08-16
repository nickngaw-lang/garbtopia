// Garbtopia shared domain types — mirrors docs/DATA_MODEL.md

export interface OverlayConfig {
  x: number; // 0..1 fractional horizontal center of costume on photo
  y: number; // 0..1 fractional vertical center of costume on photo
  scale: number; // costume width as a fraction of photo width
  rotation: number; // degrees
}

export interface CostumeCategory {
  id: string;
  name: string;
  display_order: number;
  user_id: string | null;
  created_at: string;
}

export interface Costume {
  id: string;
  name: string;
  culture: string;
  region: string;
  category_id: string | null;
  image_url: string;
  overlay_config: OverlayConfig;
  tags: string[];
  user_id: string | null;
  created_at: string;
}

export interface CostumeWithTryCount extends Costume {
  try_count?: number;
}

export interface Photo {
  id: string;
  image_url: string;
  is_demo: boolean;
  user_id: string | null;
  created_at: string;
}

export interface ChangedPhoto {
  id: string;
  photo_id: string;
  costume_id: string;
  result_url: string;
  overlay_metadata: OverlayConfig | Record<string, unknown>;
  saved: boolean;
  user_id: string | null;
  created_at: string;
}

export interface ChangedPhotoWithRelations extends ChangedPhoto {
  costume: Costume | null;
  photo: Photo | null;
}

export type TouchpointEventType = "page_view" | "costume_try" | "save" | "share" | "delete";
export type TouchpointEntityType = "costume" | "changed_photo" | "photo";

export interface Touchpoint {
  id: string;
  event_type: TouchpointEventType;
  entity_type: TouchpointEntityType | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  user_id: string | null;
  created_at: string;
}
