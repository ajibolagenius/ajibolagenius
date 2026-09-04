-- Allow the owner to manage blog_posts (notes & articles)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'blog_posts' and policyname = 'owner all blog_posts'
  ) then
    create policy "owner all blog_posts"
      on public.blog_posts for all
      using (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com')
      with check (auth.jwt() ->> 'email' = 'ajibolaakelebe@gmail.com');
  end if;
end $$;
