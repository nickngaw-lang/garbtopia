-- Garbtopia schema (demo-first, idempotent)

create table if not exists costume_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order int not null default 0,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table costume_categories enable row level security;
drop policy if exists "costume_categories_v1_read" on costume_categories;
create policy "costume_categories_v1_read" on costume_categories for select using (true);
drop policy if exists "costume_categories_v1_write" on costume_categories;
create policy "costume_categories_v1_write" on costume_categories for all using (true) with check (true);

create table if not exists costumes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  culture text not null,
  region text not null,
  category_id uuid references costume_categories(id) on delete cascade,
  image_url text not null,
  overlay_config jsonb not null default '{"x":0.5,"y":0.35,"scale":0.6,"rotation":0}'::jsonb,
  tags text[] default '{}',
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table costumes enable row level security;
drop policy if exists "costumes_v1_read" on costumes;
create policy "costumes_v1_read" on costumes for select using (true);
drop policy if exists "costumes_v1_write" on costumes;
create policy "costumes_v1_write" on costumes for all using (true) with check (true);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  is_demo boolean not null default false,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table photos enable row level security;
drop policy if exists "photos_v1_read" on photos;
create policy "photos_v1_read" on photos for select using (true);
drop policy if exists "photos_v1_write" on photos;
create policy "photos_v1_write" on photos for all using (true) with check (true);

create table if not exists changed_photos (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid references photos(id) on delete cascade,
  costume_id uuid references costumes(id) on delete cascade,
  result_url text not null,
  overlay_metadata jsonb default '{}'::jsonb,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table changed_photos enable row level security;
drop policy if exists "changed_photos_v1_read" on changed_photos;
create policy "changed_photos_v1_read" on changed_photos for select using (true);
drop policy if exists "changed_photos_v1_write" on changed_photos;
create policy "changed_photos_v1_write" on changed_photos for all using (true) with check (true);

create table if not exists touchpoints (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table touchpoints enable row level security;
drop policy if exists "touchpoints_v1_read" on touchpoints;
create policy "touchpoints_v1_read" on touchpoints for select using (true);
drop policy if exists "touchpoints_v1_write" on touchpoints;
create policy "touchpoints_v1_write" on touchpoints for all using (true) with check (true);

-- Seed: categories
insert into costume_categories (id, name, display_order) values
  ('11111111-1111-1111-1111-111111111111', 'Asian', 1),
  ('22222222-2222-2222-2222-222222222222', 'African', 2),
  ('33333333-3333-3333-3333-333333333333', 'Indigenous Americas', 3)
on conflict (id) do nothing;

-- Seed: costumes
insert into costumes (id, name, culture, region, category_id, image_url, tags) values
  ('aaaa1111-aaaa-1111-aaaa-1111aaaaaaaa', 'Kimono', 'Japanese', 'East Asia', '11111111-1111-1111-1111-111111111111', 'https://example.com/costumes/kimono.png', array['ceremonial','silk']),
  ('aaaa2222-aaaa-2222-aaaa-2222aaaaaaaa', 'Hanbok', 'Korean', 'East Asia', '11111111-1111-1111-1111-111111111111', 'https://example.com/costumes/hanbok.png', array['ceremonial','elegant']),
  ('aaaa3333-aaaa-3333-aaaa-3333aaaaaaaa', 'Sari', 'Indian', 'South Asia', '11111111-1111-1111-1111-111111111111', 'https://example.com/costumes/sari.png', array['festive','silk']),
  ('bbbb1111-bbbb-1111-bbbb-1111bbbbbbbb', 'Kente Cloth', 'Ghanaian', 'West Africa', '22222222-2222-2222-2222-222222222222', 'https://example.com/costumes/kente.png', array['ceremonial','woven']),
  ('bbbb2222-bbbb-2222-bbbb-2222bbbbbbbb', 'Maasai Shuka', 'Maasai', 'East Africa', '22222222-2222-2222-2222-222222222222', 'https://example.com/costumes/maasai_shuka.png', array['traditional','red']),
  ('cccc1111-cccc-1111-cccc-1111cccccccc', 'Plains Headdress', 'Lakota', 'North America', '33333333-3333-3333-3333-333333333333', 'https://example.com/costumes/plains_headdress.png', array['ceremonial','feather'])
on conflict (id) do nothing;

-- Seed: demo photos
insert into photos (id, image_url, is_demo) values
  ('dddd1111-dddd-1111-dddd-1111dddddddd', 'https://example.com/demo/person1.jpg', true),
  ('dddd2222-dddd-2222-dddd-2222dddddddd', 'https://example.com/demo/person2.jpg', true),
  ('dddd3333-dddd-3333-dddd-3333dddddddd', 'https://example.com/demo/person3.jpg', true)
on conflict (id) do nothing;

-- Seed: touchpoints (demo activity)
insert into touchpoints (event_type, entity_type, entity_id, metadata) values
  ('costume_try', 'costume', 'aaaa1111-aaaa-1111-aaaa-1111aaaaaaaa', '{"source_page":"/costumes"}'),
  ('costume_try', 'costume', 'aaaa2222-aaaa-2222-aaaa-2222aaaaaaaa', '{"source_page":"/costumes"}'),
  ('costume_try', 'costume', 'bbbb1111-bbbb-1111-bbbb-1111bbbbbbbb', '{"source_page":"/costumes"}'),
  ('page_view', null, null, '{"page":"/"}'),
  ('page_view', null, null, '{"page":"/costumes"}'),
  ('save', 'changed_photo', null, '{"costume":"Kimono"}')
on conflict do nothing;