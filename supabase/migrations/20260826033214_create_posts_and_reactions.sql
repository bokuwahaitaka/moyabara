create table public.posts (
  id bigint generated always as identity primary key,
  category text not null,
  body text not null,
  empathy bigint not null default 0,
  same bigint not null default 0,
  reports bigint not null default 0,
  status text not null default 'visible',
  created_at timestamptz not null default now(),
  constraint posts_category_check check (category = any (array['学校','仕事','家族','人間関係','社会','日常','その他'])),
  constraint posts_body_length_check check (char_length(btrim(body)) between 10 and 300),
  constraint posts_empathy_nonnegative_check check (empathy >= 0),
  constraint posts_same_nonnegative_check check (same >= 0),
  constraint posts_reports_nonnegative_check check (reports >= 0),
  constraint posts_status_check check (status = any (array['visible','hidden','removed']))
);

comment on table public.posts is 'Anonymous grievances and community reactions for Moyabara.';

create index posts_visible_created_at_idx on public.posts (created_at desc, id desc)
  where status = 'visible' and reports < 3;
create index posts_visible_category_created_at_idx on public.posts (category, created_at desc, id desc)
  where status = 'visible' and reports < 3;

alter table public.posts enable row level security;
revoke all on table public.posts from anon, authenticated;
grant select, insert on table public.posts to anon, authenticated;
grant usage, select on sequence public.posts_id_seq to anon, authenticated;

create policy "visible posts are public" on public.posts for select to anon, authenticated
  using (status = 'visible' and reports < 3);
create policy "anonymous visitors can create clean posts" on public.posts for insert to anon, authenticated
  with check (
    status = 'visible' and empathy = 0 and same = 0 and reports = 0
    and category = any (array['学校','仕事','家族','人間関係','社会','日常','その他'])
    and char_length(btrim(body)) between 10 and 300
  );

create or replace function public.increment_post_signal(p_post_id bigint, p_signal text)
returns table (id bigint, empathy_count bigint, same_count bigint, report_count bigint)
language plpgsql security definer set search_path = ''
as $$
begin
  if p_signal = 'empathy' then
    return query update public.posts as p set empathy = p.empathy + 1
      where p.id = p_post_id and p.status = 'visible' and p.reports < 3
      returning p.id, p.empathy, p.same, p.reports;
  elsif p_signal = 'same' then
    return query update public.posts as p set same = p.same + 1
      where p.id = p_post_id and p.status = 'visible' and p.reports < 3
      returning p.id, p.empathy, p.same, p.reports;
  elsif p_signal = 'report' then
    return query update public.posts as p set reports = p.reports + 1
      where p.id = p_post_id and p.status = 'visible' and p.reports < 3
      returning p.id, p.empathy, p.same, p.reports;
  else
    raise exception using errcode = '22023', message = 'unsupported signal';
  end if;
end;
$$;
revoke all on function public.increment_post_signal(bigint, text) from public, anon, authenticated;
grant execute on function public.increment_post_signal(bigint, text) to anon, authenticated;
