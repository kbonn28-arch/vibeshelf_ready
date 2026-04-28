alter table app_user enable row level security;
alter table profile enable row level security;
alter table book enable row level security;
alter table genre enable row level security;
alter table mood enable row level security;
alter table review enable row level security;

create policy if not exists "Public books are readable" on book for select using (true);
create policy if not exists "Public genres are readable" on genre for select using (true);
create policy if not exists "Public moods are readable" on mood for select using (true);
create policy if not exists "Public profiles are readable" on profile for select using (is_public = true);
create policy if not exists "Public reviews are readable" on review for select using (is_public = true);
