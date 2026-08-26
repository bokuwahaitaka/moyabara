alter table public.posts
  add column theme text not null default 'guchi';

alter table public.posts
  add constraint posts_theme_check
  check (theme = any (array[
    'guchi',
    'confession',
    'close_call',
    'unsaid',
    'gratitude',
    'misunderstanding',
    'tiny_secret'
  ]));

create index posts_visible_theme_created_at_idx
  on public.posts (theme, created_at desc, id desc)
  where status = 'visible' and reports < 3;

drop policy "anonymous visitors can create clean posts" on public.posts;

create policy "anonymous visitors can create clean posts"
  on public.posts
  for insert
  to anon, authenticated
  with check (
    status = 'visible'
    and empathy = 0
    and same = 0
    and reports = 0
    and category = any (array['学校','仕事','家族','人間関係','社会','日常','その他'])
    and theme = any (array[
      'guchi',
      'confession',
      'close_call',
      'unsaid',
      'gratitude',
      'misunderstanding',
      'tiny_secret'
    ])
    and char_length(btrim(body)) between 10 and 300
  );

comment on column public.posts.theme is
  'Safe story lane selected by the author; third-party secret exposure is not allowed.';
