# VibeShelf API
This is the local backend API for VibeShelf. It connects to Supabase using the service role key and provides API routes for books, moods, and reviews.
## Run locally
Install dependencies:
```bash
cd api
npm install
cp .env.example .env
npm run dev
```

Set these in `api/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `PORT`.

Run database scripts in Supabase SQL Editor in this order:
1. `db/01_schema.sql`
2. `db/02_seed.sql`
3. optional `db/03_policies.sql`

## Routes
- `GET /health`
- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books`
- `GET /api/moods`
- `GET /api/moods/:moodId/recommendations`
- `GET /api/reviews`
- `POST /api/reviews`
