create extension if not exists "pgcrypto";

do $$ begin
  create type reading_status as enum ('want_to_read','currently_reading','finished','paused','dropped','re_reading');
exception when duplicate_object then null; end $$;

do $$ begin
  create type recommendation_status as enum ('shown','skipped','not_interested','saved');
exception when duplicate_object then null; end $$;

create table if not exists app_user (
  user_id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists profile (
  profile_id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references app_user(user_id) on delete cascade,
  username text not null unique,
  bio text,
  is_public boolean not null default true
);

create table if not exists book (
  book_id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  isbn text unique,
  genre text,
  cover_image text,
  description text
);

create table if not exists genre (
  genre_id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

create table if not exists mood (
  mood_id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null
);

create table if not exists book_genre (
  book_id uuid not null references book(book_id) on delete cascade,
  genre_id uuid not null references genre(genre_id) on delete cascade,
  primary key (book_id, genre_id)
);

create table if not exists book_mood (
  book_id uuid not null references book(book_id) on delete cascade,
  mood_id uuid not null references mood(mood_id) on delete cascade,
  rule_note text default 'no more than two moods per book',
  primary key (book_id, mood_id)
);

create or replace function enforce_two_moods_per_book()
returns trigger as $$
begin
  if (select count(*) from book_mood where book_id = new.book_id) >= 2 then
    raise exception 'Each book can have no more than two moods';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_two_moods_per_book on book_mood;
create trigger trg_two_moods_per_book
before insert on book_mood
for each row execute function enforce_two_moods_per_book();

create table if not exists bookshelf_entry (
  entry_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(user_id) on delete cascade,
  book_id uuid not null references book(book_id) on delete cascade,
  status reading_status not null default 'want_to_read',
  start_date date,
  finish_date date,
  added_at timestamptz not null default now(),
  unique(user_id, book_id)
);

create table if not exists review (
  review_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(user_id) on delete cascade,
  book_id uuid not null references book(book_id) on delete cascade,
  star_rating int not null check (star_rating between 1 and 5),
  review_text text not null,
  review_date timestamptz not null default now(),
  is_public boolean not null default true,
  unique(user_id, book_id)
);

create table if not exists recommendation (
  recommendation_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(user_id) on delete cascade,
  book_id uuid not null references book(book_id) on delete cascade,
  mood_id uuid not null references mood(mood_id) on delete cascade,
  recommended_at timestamptz not null default now(),
  session_id text not null,
  status recommendation_status not null default 'shown'
);

create or replace view book_with_rating as
select
  b.*,
  coalesce(round(avg(r.star_rating)::numeric, 2), 0) as average_rating,
  count(r.review_id) as review_count
from book b
left join review r on r.book_id = b.book_id and r.is_public = true
group by b.book_id;
