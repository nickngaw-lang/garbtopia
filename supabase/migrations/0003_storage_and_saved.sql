-- Sprint 2: save/gallery flow needs a `saved` flag on changed_photos, plus
-- Storage buckets for user photo uploads and composited results.
-- Idempotent — safe to re-run.

alter table changed_photos add column if not exists saved boolean not null default false;
create index if not exists changed_photos_saved_created_at_idx
  on changed_photos (saved, created_at desc);

-- Storage buckets (public, demo-first permissive — matches v1 RLS posture
-- documented in docs/SECURITY.md; lock down in the Sprint 4 auth migration).
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('changed-photos', 'changed-photos', true)
on conflict (id) do nothing;

drop policy if exists "photos_bucket_v1_read" on storage.objects;
create policy "photos_bucket_v1_read" on storage.objects
  for select using (bucket_id = 'photos');

drop policy if exists "photos_bucket_v1_write" on storage.objects;
create policy "photos_bucket_v1_write" on storage.objects
  for insert with check (bucket_id = 'photos');

drop policy if exists "photos_bucket_v1_delete" on storage.objects;
create policy "photos_bucket_v1_delete" on storage.objects
  for delete using (bucket_id = 'photos');

drop policy if exists "changed_photos_bucket_v1_read" on storage.objects;
create policy "changed_photos_bucket_v1_read" on storage.objects
  for select using (bucket_id = 'changed-photos');

drop policy if exists "changed_photos_bucket_v1_write" on storage.objects;
create policy "changed_photos_bucket_v1_write" on storage.objects
  for insert with check (bucket_id = 'changed-photos');

drop policy if exists "changed_photos_bucket_v1_delete" on storage.objects;
create policy "changed_photos_bucket_v1_delete" on storage.objects
  for delete using (bucket_id = 'changed-photos');
