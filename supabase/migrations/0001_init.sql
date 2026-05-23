-- =============================================================
-- 일기 (Ilgi) — 초기 스키마 + RLS
-- v1.0 ~ v1.1 모두 포함. v1.0 UI는 habits/habit_logs만 사용하나
-- 향후 확장을 위해 모든 테이블을 한 번에 생성한다.
-- =============================================================

-- ===== 1) 목표 =====
create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 120),
  description text,
  target_date date,
  status      text not null default 'active'
              check (status in ('active','done','archived')),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists goals_user_id_idx on public.goals (user_id);

-- ===== 2) 마일스톤 =====
create table if not exists public.milestones (
  id          uuid primary key default gen_random_uuid(),
  goal_id     uuid not null references public.goals(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  done        boolean not null default false,
  due_date    date,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists milestones_goal_id_idx on public.milestones (goal_id);

-- ===== 3) 주간 루틴 (요일 패턴) =====
create table if not exists public.routines (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null,
  weekdays     smallint[] not null default '{}',   -- 0=일 .. 6=토
  start_time   time,
  duration_min int,
  goal_id      uuid references public.goals(id) on delete set null,
  color        text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists routines_user_id_idx on public.routines (user_id);

-- ===== 4) 일일 시간표 인스턴스 =====
create table if not exists public.schedule_blocks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,
  start_time  time not null,
  end_time    time,
  title       text not null,
  routine_id  uuid references public.routines(id) on delete set null,
  goal_id     uuid references public.goals(id) on delete set null,
  status      text not null default 'planned'
              check (status in ('planned','done','skipped')),
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists schedule_blocks_user_date_idx on public.schedule_blocks (user_id, date);

-- ===== 5) 습관 =====
create table if not exists public.habits (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  title          text not null check (char_length(title) between 1 and 60),
  emoji          text,
  frequency      text not null default 'daily'
                 check (frequency in ('daily','weekdays')),
  weekdays       smallint[] not null default '{0,1,2,3,4,5,6}',
  target_per_day int not null default 1,
  goal_id        uuid references public.goals(id) on delete set null,
  active         boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  archived_at    timestamptz
);
create index if not exists habits_user_id_idx on public.habits (user_id);

-- ===== 6) 습관 로그 =====
-- note 컬럼은 v1.1의 "일기 한 줄" 기능용. v1.0 스키마에 미리 둔다.
create table if not exists public.habit_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  habit_id   uuid not null references public.habits(id) on delete cascade,
  date       date not null,
  count      int  not null default 1,
  note       text,
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);
create index if not exists habit_logs_user_date_idx on public.habit_logs (user_id, date);

-- =============================================================
-- updated_at 자동 갱신 트리거 (goals만 — 나머지는 immutable에 가까움)
-- =============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_goals_updated_at on public.goals;
create trigger trg_goals_updated_at
  before update on public.goals
  for each row execute function public.set_updated_at();

-- =============================================================
-- Row Level Security (RLS) — 모든 테이블 동일 패턴
-- 본인 데이터만 SELECT/INSERT/UPDATE/DELETE 가능
-- =============================================================

-- goals
alter table public.goals enable row level security;
drop policy if exists "goals_select_own" on public.goals;
drop policy if exists "goals_insert_own" on public.goals;
drop policy if exists "goals_update_own" on public.goals;
drop policy if exists "goals_delete_own" on public.goals;
create policy "goals_select_own" on public.goals for select using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals for insert with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals for delete using (auth.uid() = user_id);

-- milestones
alter table public.milestones enable row level security;
drop policy if exists "milestones_select_own" on public.milestones;
drop policy if exists "milestones_insert_own" on public.milestones;
drop policy if exists "milestones_update_own" on public.milestones;
drop policy if exists "milestones_delete_own" on public.milestones;
create policy "milestones_select_own" on public.milestones for select using (auth.uid() = user_id);
create policy "milestones_insert_own" on public.milestones for insert with check (auth.uid() = user_id);
create policy "milestones_update_own" on public.milestones for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "milestones_delete_own" on public.milestones for delete using (auth.uid() = user_id);

-- routines
alter table public.routines enable row level security;
drop policy if exists "routines_select_own" on public.routines;
drop policy if exists "routines_insert_own" on public.routines;
drop policy if exists "routines_update_own" on public.routines;
drop policy if exists "routines_delete_own" on public.routines;
create policy "routines_select_own" on public.routines for select using (auth.uid() = user_id);
create policy "routines_insert_own" on public.routines for insert with check (auth.uid() = user_id);
create policy "routines_update_own" on public.routines for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "routines_delete_own" on public.routines for delete using (auth.uid() = user_id);

-- schedule_blocks
alter table public.schedule_blocks enable row level security;
drop policy if exists "schedule_blocks_select_own" on public.schedule_blocks;
drop policy if exists "schedule_blocks_insert_own" on public.schedule_blocks;
drop policy if exists "schedule_blocks_update_own" on public.schedule_blocks;
drop policy if exists "schedule_blocks_delete_own" on public.schedule_blocks;
create policy "schedule_blocks_select_own" on public.schedule_blocks for select using (auth.uid() = user_id);
create policy "schedule_blocks_insert_own" on public.schedule_blocks for insert with check (auth.uid() = user_id);
create policy "schedule_blocks_update_own" on public.schedule_blocks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "schedule_blocks_delete_own" on public.schedule_blocks for delete using (auth.uid() = user_id);

-- habits
alter table public.habits enable row level security;
drop policy if exists "habits_select_own" on public.habits;
drop policy if exists "habits_insert_own" on public.habits;
drop policy if exists "habits_update_own" on public.habits;
drop policy if exists "habits_delete_own" on public.habits;
create policy "habits_select_own" on public.habits for select using (auth.uid() = user_id);
create policy "habits_insert_own" on public.habits for insert with check (auth.uid() = user_id);
create policy "habits_update_own" on public.habits for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits_delete_own" on public.habits for delete using (auth.uid() = user_id);

-- habit_logs
alter table public.habit_logs enable row level security;
drop policy if exists "habit_logs_select_own" on public.habit_logs;
drop policy if exists "habit_logs_insert_own" on public.habit_logs;
drop policy if exists "habit_logs_update_own" on public.habit_logs;
drop policy if exists "habit_logs_delete_own" on public.habit_logs;
create policy "habit_logs_select_own" on public.habit_logs for select using (auth.uid() = user_id);
create policy "habit_logs_insert_own" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "habit_logs_update_own" on public.habit_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habit_logs_delete_own" on public.habit_logs for delete using (auth.uid() = user_id);

-- =============================================================
-- 완료. 모든 테이블 RLS 활성화 + 본인 데이터만 정책 적용 완료.
-- =============================================================
