create extension if not exists "pgcrypto";

create type public.deal_stage as enum (
  'lead',
  'qualified',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost'
);

create type public.activity_type as enum (
  'call',
  'email',
  'meeting',
  'task',
  'note'
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  avatar_url text,
  timezone text not null default 'UTC'
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  domain text,
  industry text,
  size text,
  location text,
  annual_revenue numeric(16, 2) check (annual_revenue is null or annual_revenue >= 0),
  unique (owner_id, name)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text not null,
  phone text,
  title text,
  unique (owner_id, email)
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete restrict,
  contact_id uuid references public.contacts(id) on delete set null,
  name text not null check (char_length(name) between 3 and 200),
  value numeric(16, 2) not null check (value >= 0),
  stage public.deal_stage not null default 'lead',
  probability smallint not null default 10 check (probability between 0 and 100),
  source text not null,
  expected_close_date date,
  closed_at timestamptz,
  lost_reason text
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null references public.deals(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  type public.activity_type not null,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  due_at timestamptz,
  completed_at timestamptz
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  color text not null default '#b8f34a' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  unique (owner_id, name)
);

create table public.deal_tags (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  deal_id uuid not null references public.deals(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  unique (deal_id, tag_id)
);

create index companies_owner_updated_idx on public.companies (owner_id, updated_at desc);
create index companies_owner_name_idx on public.companies (owner_id, name);
create index contacts_owner_company_idx on public.contacts (owner_id, company_id);
create index contacts_owner_name_idx on public.contacts (owner_id, last_name, first_name);
create index deals_owner_stage_idx on public.deals (owner_id, stage);
create index deals_owner_close_idx on public.deals (owner_id, expected_close_date);
create index deals_company_idx on public.deals (company_id);
create index activities_owner_due_idx on public.activities (owner_id, due_at) where completed_at is null;
create index activities_deal_idx on public.activities (deal_id);
create index deal_tags_owner_deal_idx on public.deal_tags (owner_id, deal_id);
create index deal_tags_tag_idx on public.deal_tags (tag_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger companies_set_updated_at before update on public.companies
for each row execute function public.set_updated_at();
create trigger contacts_set_updated_at before update on public.contacts
for each row execute function public.set_updated_at();
create trigger deals_set_updated_at before update on public.deals
for each row execute function public.set_updated_at();
create trigger activities_set_updated_at before update on public.activities
for each row execute function public.set_updated_at();
create trigger tags_set_updated_at before update on public.tags
for each row execute function public.set_updated_at();
create trigger deal_tags_set_updated_at before update on public.deal_tags
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (owner_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.validate_owned_relationships()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_table_name = 'contacts' and not exists (
    select 1 from public.companies c where c.id = new.company_id and c.owner_id = new.owner_id
  ) then
    raise exception 'Company ownership mismatch';
  elsif tg_table_name = 'deals' and (
    not exists (select 1 from public.companies c where c.id = new.company_id and c.owner_id = new.owner_id)
    or (new.contact_id is not null and not exists (
      select 1 from public.contacts c where c.id = new.contact_id and c.owner_id = new.owner_id
    ))
  ) then
    raise exception 'Deal relationship ownership mismatch';
  elsif tg_table_name = 'activities' and (
    not exists (select 1 from public.deals d where d.id = new.deal_id and d.owner_id = new.owner_id)
    or (new.contact_id is not null and not exists (
      select 1 from public.contacts c where c.id = new.contact_id and c.owner_id = new.owner_id
    ))
  ) then
    raise exception 'Activity relationship ownership mismatch';
  elsif tg_table_name = 'deal_tags' and (
    not exists (select 1 from public.deals d where d.id = new.deal_id and d.owner_id = new.owner_id)
    or not exists (select 1 from public.tags t where t.id = new.tag_id and t.owner_id = new.owner_id)
  ) then
    raise exception 'Tag relationship ownership mismatch';
  end if;
  return new;
end;
$$;

create trigger contacts_validate_owner before insert or update on public.contacts
for each row execute function public.validate_owned_relationships();
create trigger deals_validate_owner before insert or update on public.deals
for each row execute function public.validate_owned_relationships();
create trigger activities_validate_owner before insert or update on public.activities
for each row execute function public.validate_owned_relationships();
create trigger deal_tags_validate_owner before insert or update on public.deal_tags
for each row execute function public.validate_owned_relationships();

create or replace view public.monthly_revenue
with (security_invoker = true)
as
select
  owner_id,
  date_trunc('month', closed_at)::date as month,
  coalesce(sum(value), 0)::numeric as revenue,
  count(*)::integer as deals_won
from public.deals
where stage = 'closed_won' and closed_at is not null
group by owner_id, date_trunc('month', closed_at);

create or replace view public.pipeline_by_stage
with (security_invoker = true)
as
select
  owner_id,
  stage,
  count(*)::integer as deals,
  coalesce(sum(value), 0)::numeric as value,
  coalesce(sum(value * probability / 100.0), 0)::numeric as weighted_value
from public.deals
where stage not in ('closed_won', 'closed_lost')
group by owner_id, stage;

create or replace view public.deal_conversion
with (security_invoker = true)
as
select
  owner_id,
  count(*) filter (where stage = 'closed_won')::integer as won,
  count(*) filter (where stage = 'closed_lost')::integer as lost,
  round(
    100.0 * count(*) filter (where stage = 'closed_won')
    / nullif(count(*) filter (where stage in ('closed_won', 'closed_lost')), 0),
    1
  ) as win_rate
from public.deals
group by owner_id;

create or replace view public.average_sales_cycle
with (security_invoker = true)
as
select
  owner_id,
  round(avg(extract(epoch from (closed_at - created_at)) / 86400.0), 1) as average_days
from public.deals
where stage = 'closed_won' and closed_at is not null
group by owner_id;

create or replace function public.get_dashboard_analytics()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with user_deals as (
    select * from public.deals where owner_id = auth.uid()
  ),
  metrics as (
    select
      coalesce(sum(value) filter (where stage not in ('closed_won', 'closed_lost')), 0) as pipeline_value,
      coalesce(sum(value) filter (where stage = 'closed_won' and closed_at >= date_trunc('month', now())), 0) as won_revenue,
      round(
        100.0 * count(*) filter (where stage = 'closed_won')
        / nullif(count(*) filter (where stage in ('closed_won', 'closed_lost')), 0),
        1
      ) as win_rate,
      coalesce(avg(value), 0) as average_deal_size,
      count(*) filter (where stage not in ('closed_won', 'closed_lost')) as open_deals
    from user_deals
  ),
  revenue as (
    select jsonb_agg(jsonb_build_object(
      'month', to_char(month, 'Mon'),
      'revenue', revenue,
      'target', 0
    ) order by month) as data
    from (
      select month, revenue
      from public.monthly_revenue
      where owner_id = auth.uid()
      order by month desc
      limit 6
    ) months
  ),
  pipeline as (
    select jsonb_agg(jsonb_build_object(
      'stage', initcap(replace(stage::text, '_', ' ')),
      'value', value,
      'deals', deals
    )) as data
    from public.pipeline_by_stage
    where owner_id = auth.uid()
  ),
  sources as (
    select jsonb_agg(jsonb_build_object('source', source, 'deals', deals)) as data
    from (
      select source, count(*)::integer as deals
      from user_deals
      group by source
      order by deals desc
    ) source_counts
  ),
  activity_stats as (
    select jsonb_agg(jsonb_build_object(
      'day', to_char(day, 'Dy'),
      'completed', completed
    ) order by day) as data
    from (
      select date_trunc('day', completed_at)::date as day, count(*)::integer as completed
      from public.activities
      where owner_id = auth.uid()
        and completed_at >= current_date - interval '6 days'
      group by date_trunc('day', completed_at)
    ) days
  )
  select jsonb_build_object(
    'metrics', jsonb_build_object(
      'pipelineValue', metrics.pipeline_value,
      'wonRevenue', metrics.won_revenue,
      'winRate', coalesce(metrics.win_rate, 0),
      'averageDealSize', metrics.average_deal_size,
      'openDeals', metrics.open_deals,
      'overdueActivities', (
        select count(*) from public.activities
        where owner_id = auth.uid() and completed_at is null and due_at < now()
      ),
      'pipelineDelta', 0,
      'revenueDelta', 0
    ),
    'monthlyRevenue', coalesce(revenue.data, '[]'::jsonb),
    'pipelineByStage', coalesce(pipeline.data, '[]'::jsonb),
    'dealsBySource', coalesce(sources.data, '[]'::jsonb),
    'activitiesCompleted', coalesce(activity_stats.data, '[]'::jsonb)
  )
  from metrics, revenue, pipeline, sources, activity_stats;
$$;

revoke all on function public.get_dashboard_analytics() from public;
grant execute on function public.get_dashboard_analytics() to authenticated;
