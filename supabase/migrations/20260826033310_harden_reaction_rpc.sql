create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

drop function public.increment_post_signal(bigint, text);

create function private.increment_post_signal_internal(p_post_id bigint, p_signal text)
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
revoke all on function private.increment_post_signal_internal(bigint, text) from public, anon, authenticated;
grant execute on function private.increment_post_signal_internal(bigint, text) to anon, authenticated;

create function public.increment_post_signal(p_post_id bigint, p_signal text)
returns table (id bigint, empathy_count bigint, same_count bigint, report_count bigint)
language sql security invoker set search_path = ''
as $$
  select * from private.increment_post_signal_internal(p_post_id, p_signal);
$$;
revoke all on function public.increment_post_signal(bigint, text) from public, anon, authenticated;
grant execute on function public.increment_post_signal(bigint, text) to anon, authenticated;
