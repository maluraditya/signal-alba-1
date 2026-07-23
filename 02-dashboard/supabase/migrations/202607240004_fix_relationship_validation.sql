create or replace function public.validate_owned_relationships()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  row_data jsonb := to_jsonb(new);
  row_owner_id uuid := (row_data ->> 'owner_id')::uuid;
  row_company_id uuid;
  row_contact_id uuid;
  row_deal_id uuid;
  row_tag_id uuid;
begin
  if tg_table_name = 'contacts' then
    row_company_id := (row_data ->> 'company_id')::uuid;
    if not exists (
      select 1 from public.companies c
      where c.id = row_company_id and c.owner_id = row_owner_id
    ) then
      raise exception 'Company ownership mismatch';
    end if;
  elsif tg_table_name = 'deals' then
    row_company_id := (row_data ->> 'company_id')::uuid;
    row_contact_id := nullif(row_data ->> 'contact_id', '')::uuid;
    if not exists (
      select 1 from public.companies c
      where c.id = row_company_id and c.owner_id = row_owner_id
    ) or (
      row_contact_id is not null and not exists (
        select 1 from public.contacts c
        where c.id = row_contact_id and c.owner_id = row_owner_id
      )
    ) then
      raise exception 'Deal relationship ownership mismatch';
    end if;
  elsif tg_table_name = 'activities' then
    row_deal_id := (row_data ->> 'deal_id')::uuid;
    row_contact_id := nullif(row_data ->> 'contact_id', '')::uuid;
    if not exists (
      select 1 from public.deals d
      where d.id = row_deal_id and d.owner_id = row_owner_id
    ) or (
      row_contact_id is not null and not exists (
        select 1 from public.contacts c
        where c.id = row_contact_id and c.owner_id = row_owner_id
      )
    ) then
      raise exception 'Activity relationship ownership mismatch';
    end if;
  elsif tg_table_name = 'deal_tags' then
    row_deal_id := (row_data ->> 'deal_id')::uuid;
    row_tag_id := (row_data ->> 'tag_id')::uuid;
    if not exists (
      select 1 from public.deals d
      where d.id = row_deal_id and d.owner_id = row_owner_id
    ) or not exists (
      select 1 from public.tags t
      where t.id = row_tag_id and t.owner_id = row_owner_id
    ) then
      raise exception 'Tag relationship ownership mismatch';
    end if;
  end if;
  return new;
end;
$$;
