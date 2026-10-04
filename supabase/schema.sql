create table if not exists public.simulator_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.simulator_progress enable row level security;

drop policy if exists "participant_reads_own_progress" on public.simulator_progress;
create policy "participant_reads_own_progress"
on public.simulator_progress for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "participant_creates_own_progress" on public.simulator_progress;
create policy "participant_creates_own_progress"
on public.simulator_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "participant_updates_own_progress" on public.simulator_progress;
create policy "participant_updates_own_progress"
on public.simulator_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on public.simulator_progress from anon;
grant select, insert, update on public.simulator_progress to authenticated;



-- Merge only the fields changed on the current device. This prevents an older
-- browser tab from deleting answers that were saved from another device.
create or replace function public.save_simulator_progress(p_data jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_data jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    raise exception 'Progress must be a JSON object';
  end if;
  if pg_column_size(p_data) > 500000 then
    raise exception 'Progress payload is too large';
  end if;

  insert into public.simulator_progress as current_progress (user_id, data, updated_at)
  values (v_user_id, p_data, now())
  on conflict (user_id) do update
  set data =
      (coalesce(current_progress.data, '{}'::jsonb) || coalesce(excluded.data, '{}'::jsonb))
      || jsonb_build_object(
        'f', coalesce(current_progress.data->'f', '{}'::jsonb) || coalesce(excluded.data->'f', '{}'::jsonb),
        'ft', coalesce(current_progress.data->'ft', '{}'::jsonb) || coalesce(excluded.data->'ft', '{}'::jsonb),
        'done', coalesce(current_progress.data->'done', '{}'::jsonb) || coalesce(excluded.data->'done', '{}'::jsonb)
      ),
      updated_at = now()
  returning data into v_data;

  return v_data;
end;
$$;

revoke all on function public.save_simulator_progress(jsonb) from public, anon;
grant execute on function public.save_simulator_progress(jsonb) to authenticated;
