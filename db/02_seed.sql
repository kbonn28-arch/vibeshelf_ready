insert into app_user (user_id, email, password_hash, created_at, last_login_at) values
('11111111-1111-1111-1111-111111111111','maya@example.com','demo_hash_1',now(),now()),
('22222222-2222-2222-2222-222222222222','jordan@example.com','demo_hash_2',now(),now()),
('33333333-3333-3333-3333-333333333333','riley@example.com','demo_hash_3',now(),now())
on conflict (email) do nothing;

insert into profile (user_id, username, bio, is_public) values
('11111111-1111-1111-1111-111111111111','MayaReads','Fantasy reader who likes emotional stories.',true),
('22222222-2222-2222-2222-222222222222','JordanShelf','Reads thrillers and quick weekend books.',true),
('33333333-3333-3333-3333-333333333333','RileyPages','Tracks books for school and fun.',true)
on conflict (username) do nothing;

insert into genre (genre_id, name, description) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','Fantasy','Magic, quests, and imagined worlds.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','Mystery','Clues, suspense, and solving problems.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','Romance','Relationship-driven stories.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','Self-Help','Personal growth and practical advice.')
on conflict (name) do nothing;

insert into mood (mood_id, name, description) values
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1','Cozy','Comforting books for a calm mood.'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','Adventurous','Fast-moving books with discovery and action.'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3','Reflective','Thoughtful books for deeper thinking.'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4','Romantic','Books focused on love and connection.')
on conflict (name) do nothing;

insert into book (book_id, title, author, isbn, genre, cover_image, description) values
('cccccccc-cccc-cccc-cccc-ccccccccccc1','The Midnight Library','Matt Haig','9780525559474','Fiction','https://placehold.co/240x360?text=Midnight+Library','A reflective story about choices and second chances.'),
('cccccccc-cccc-cccc-cccc-ccccccccccc2','The Hobbit','J.R.R. Tolkien','9780547928227','Fantasy','https://placehold.co/240x360?text=The+Hobbit','A classic adventure through Middle-earth.'),
('cccccccc-cccc-cccc-cccc-ccccccccccc3','Book Lovers','Emily Henry','9780593334836','Romance','https://placehold.co/240x360?text=Book+Lovers','A funny romance about books, work, and unexpected connection.'),
('cccccccc-cccc-cccc-cccc-ccccccccccc4','Atomic Habits','James Clear','9780735211292','Self-Help','https://placehold.co/240x360?text=Atomic+Habits','A practical guide to building better habits.'),
('cccccccc-cccc-cccc-cccc-ccccccccccc5','The Guest List','Lucy Foley','9780062868930','Mystery','https://placehold.co/240x360?text=Guest+List','A suspenseful mystery set around a wedding.')
on conflict (isbn) do nothing;

insert into book_genre (book_id, genre_id) values
('cccccccc-cccc-cccc-cccc-ccccccccccc2','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'),
('cccccccc-cccc-cccc-cccc-ccccccccccc5','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'),
('cccccccc-cccc-cccc-cccc-ccccccccccc3','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3'),
('cccccccc-cccc-cccc-cccc-ccccccccccc4','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4')
on conflict do nothing;

insert into book_mood (book_id, mood_id) values
('cccccccc-cccc-cccc-cccc-ccccccccccc1','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3'),
('cccccccc-cccc-cccc-cccc-ccccccccccc2','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'),
('cccccccc-cccc-cccc-cccc-ccccccccccc3','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4'),
('cccccccc-cccc-cccc-cccc-ccccccccccc4','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3'),
('cccccccc-cccc-cccc-cccc-ccccccccccc5','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2')
on conflict do nothing;

insert into bookshelf_entry (user_id, book_id, status, start_date, finish_date) values
('11111111-1111-1111-1111-111111111111','cccccccc-cccc-cccc-cccc-ccccccccccc2','currently_reading','2026-04-01',null),
('11111111-1111-1111-1111-111111111111','cccccccc-cccc-cccc-cccc-ccccccccccc3','want_to_read',null,null),
('22222222-2222-2222-2222-222222222222','cccccccc-cccc-cccc-cccc-ccccccccccc5','finished','2026-03-10','2026-03-18')
on conflict do nothing;

insert into review (user_id, book_id, star_rating, review_text, is_public) values
('11111111-1111-1111-1111-111111111111','cccccccc-cccc-cccc-cccc-ccccccccccc2',5,'This felt adventurous and easy to get into.',true),
('22222222-2222-2222-2222-222222222222','cccccccc-cccc-cccc-cccc-ccccccccccc5',4,'Good suspense and a fast pace.',true),
('33333333-3333-3333-3333-333333333333','cccccccc-cccc-cccc-cccc-ccccccccccc4',5,'Helpful and simple advice for routines.',true)
on conflict do nothing;

insert into recommendation (user_id, book_id, mood_id, session_id, status) values
('11111111-1111-1111-1111-111111111111','cccccccc-cccc-cccc-cccc-ccccccccccc1','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3','demo-session-1','shown'),
('22222222-2222-2222-2222-222222222222','cccccccc-cccc-cccc-cccc-ccccccccccc5','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','demo-session-2','shown'),
('33333333-3333-3333-3333-333333333333','cccccccc-cccc-cccc-cccc-ccccccccccc3','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4','demo-session-3','saved');
