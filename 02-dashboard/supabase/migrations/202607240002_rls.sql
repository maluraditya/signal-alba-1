alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.deals enable row level security;
alter table public.activities enable row level security;
alter table public.tags enable row level security;
alter table public.deal_tags enable row level security;

create policy "profiles_select_own" on public.profiles
for select to authenticated using ((select auth.uid()) = owner_id);
create policy "profiles_insert_own" on public.profiles
for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "profiles_update_own" on public.profiles
for update to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
create policy "profiles_delete_own" on public.profiles
for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "companies_select_own" on public.companies
for select to authenticated using ((select auth.uid()) = owner_id);
create policy "companies_insert_own" on public.companies
for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "companies_update_own" on public.companies
for update to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
create policy "companies_delete_own" on public.companies
for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "contacts_select_own" on public.contacts
for select to authenticated using ((select auth.uid()) = owner_id);
create policy "contacts_insert_own" on public.contacts
for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "contacts_update_own" on public.contacts
for update to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
create policy "contacts_delete_own" on public.contacts
for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "deals_select_own" on public.deals
for select to authenticated using ((select auth.uid()) = owner_id);
create policy "deals_insert_own" on public.deals
for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "deals_update_own" on public.deals
for update to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
create policy "deals_delete_own" on public.deals
for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "activities_select_own" on public.activities
for select to authenticated using ((select auth.uid()) = owner_id);
create policy "activities_insert_own" on public.activities
for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "activities_update_own" on public.activities
for update to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
create policy "activities_delete_own" on public.activities
for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "tags_select_own" on public.tags
for select to authenticated using ((select auth.uid()) = owner_id);
create policy "tags_insert_own" on public.tags
for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "tags_update_own" on public.tags
for update to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
create policy "tags_delete_own" on public.tags
for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "deal_tags_select_own" on public.deal_tags
for select to authenticated using ((select auth.uid()) = owner_id);
create policy "deal_tags_insert_own" on public.deal_tags
for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "deal_tags_update_own" on public.deal_tags
for update to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);
create policy "deal_tags_delete_own" on public.deal_tags
for delete to authenticated using ((select auth.uid()) = owner_id);
