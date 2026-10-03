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
using (auth.uid() = user_id);

drop policy if exists "participant_creates_own_progress" on public.simulator_progress;
create policy "participant_creates_own_progress"
on public.simulator_progress for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "participant_updates_own_progress" on public.simulator_progress;
create policy "participant_updates_own_progress"
on public.simulator_progress for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

revoke all on public.simulator_progress from anon;
grant select, insert, update on public.simulator_progress to authenticated;

