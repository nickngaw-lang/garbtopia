-- Sprint 3: popularity ranking — costumes ranked by costume_try touchpoints
-- in the last 7 days. Idempotent — safe to re-run.

create or replace view costume_popularity as
select
  costumes.id as costume_id,
  count(touchpoints.id) filter (
    where touchpoints.event_type = 'costume_try'
      and touchpoints.created_at >= now() - interval '7 days'
  ) as try_count
from costumes
left join touchpoints
  on touchpoints.entity_type = 'costume'
  and touchpoints.entity_id = costumes.id
group by costumes.id;
