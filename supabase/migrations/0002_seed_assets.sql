-- 0001_init.sql seeded costumes/photos with placeholder example.com URLs
-- (no real image behind them). Point them at the real static assets shipped
-- in /public, and tune each costume's overlay_config for where that garment
-- actually sits on a frontal photo (chest-level wrap vs. head-level
-- headdress). Idempotent — safe to re-run.

update photos set image_url = '/demo/person1.svg' where id = 'dddd1111-dddd-1111-dddd-1111dddddddd';
update photos set image_url = '/demo/person2.svg' where id = 'dddd2222-dddd-2222-dddd-2222dddddddd';
update photos set image_url = '/demo/person3.svg' where id = 'dddd3333-dddd-3333-dddd-3333dddddddd';

update costumes set image_url = '/costumes/kimono.svg',
  overlay_config = '{"x":0.5,"y":0.46,"scale":0.92,"rotation":0}'::jsonb
  where id = 'aaaa1111-aaaa-1111-aaaa-1111aaaaaaaa';

update costumes set image_url = '/costumes/hanbok.svg',
  overlay_config = '{"x":0.5,"y":0.5,"scale":0.85,"rotation":0}'::jsonb
  where id = 'aaaa2222-aaaa-2222-aaaa-2222aaaaaaaa';

update costumes set image_url = '/costumes/sari.svg',
  overlay_config = '{"x":0.5,"y":0.5,"scale":0.85,"rotation":0}'::jsonb
  where id = 'aaaa3333-aaaa-3333-aaaa-3333aaaaaaaa';

update costumes set image_url = '/costumes/kente.svg',
  overlay_config = '{"x":0.56,"y":0.5,"scale":0.75,"rotation":0}'::jsonb
  where id = 'bbbb1111-bbbb-1111-bbbb-1111bbbbbbbb';

update costumes set image_url = '/costumes/maasai_shuka.svg',
  overlay_config = '{"x":0.5,"y":0.46,"scale":0.8,"rotation":0}'::jsonb
  where id = 'bbbb2222-bbbb-2222-bbbb-2222bbbbbbbb';

update costumes set image_url = '/costumes/plains_headdress.svg',
  overlay_config = '{"x":0.5,"y":0.16,"scale":0.55,"rotation":0}'::jsonb
  where id = 'cccc1111-cccc-1111-cccc-1111cccccccc';
