import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function routes(app) {
  app.get("/", (req, res) => {
    res.send("API running");
  });

  app.get("/health", (req, res) => {
    res.json({ status: "OK" });
  });

  app.get("/books", getBooks);
  app.get("/api/books", getBooks);

  app.post("/books", addBook);
  app.post("/api/books", addBook);

  app.get("/moods", getMoods);
  app.get("/api/moods", getMoods);

  app.get("/moods/:moodId/recommendations", getRecommendations);
  app.get("/api/moods/:moodId/recommendations", getRecommendations);

  app.get("/reviews", getReviews);
  app.get("/api/reviews", getReviews);

  app.post("/reviews", addReview);
  app.post("/api/reviews", addReview);

  app.get("/profiles", getProfiles);
  app.get("/api/profiles", getProfiles);

  app.get("/bookshelf", getBookshelf);
  app.get("/api/bookshelf", getBookshelf);

  app.post("/bookshelf", addToBookshelf);
  app.post("/api/bookshelf", addToBookshelf);

  app.get("/search", searchBooks);
  app.get("/api/search", searchBooks);
}

async function getBooks(req, res) {
  const { data, error } = await supabase
    .from("book")
    .select("*")
    .order("title");

  if (error) return res.status(400).json(error);
  res.json(data);
}

async function addBook(req, res) {
  try {
    const { title, author, genre, isbn, description } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        message: "Title and author are required.",
      });
    }

    let existingBook = null;

    if (isbn) {
      const { data } = await supabase
        .from("book")
        .select("*")
        .eq("isbn", isbn)
        .maybeSingle();

      existingBook = data;
    }

    let book = existingBook;

    if (!book) {
      const bookId = randomUUID();

      const { data, error } = await supabase
        .from("book")
        .insert([
          {
            book_id: bookId,
            title,
            author,
            isbn: isbn || null,
            description: description || null,
          },
        ])
        .select()
        .single();

      if (error) return res.status(400).json(error);
      book = data;
    }

    if (genre) {
      let { data: existingGenre } = await supabase
        .from("genre")
        .select("*")
        .ilike("name", genre)
        .maybeSingle();

      if (!existingGenre) {
        const { data: newGenre, error: genreError } = await supabase
          .from("genre")
          .insert([
            {
              genre_id: randomUUID(),
              name: genre,
              description: `${genre} books`,
            },
          ])
          .select()
          .single();

        if (!genreError) existingGenre = newGenre;
      }

      if (existingGenre) {
        await supabase.from("book_genre").upsert(
          [
            {
              book_id: book.book_id,
              genre_id: existingGenre.genre_id,
            },
          ],
          { onConflict: "book_id,genre_id" }
        );
      }
    }

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({
      message: "Server error while adding book.",
      details: err.message,
    });
  }
}

async function getMoods(req, res) {
  const { data, error } = await supabase
    .from("mood")
    .select("*")
    .order("name");

  if (error) return res.status(400).json(error);
  res.json(data);
}

async function getRecommendations(req, res) {
  const { moodId } = req.params;

  const { data, error } = await supabase
    .from("book_mood")
    .select(`
      mood_id,
      book:book_id (
        book_id,
        title,
        author,
        isbn,
        description
      )
    `)
    .eq("mood_id", moodId);

  if (error) return res.status(400).json(error);

  const books = data.map((row) => row.book).filter(Boolean);

  if (books.length > 0) return res.json(books);

  const fallback = await supabase.from("book").select("*").limit(5);
  if (fallback.error) return res.status(400).json(fallback.error);

  res.json(fallback.data);
}

async function getReviews(req, res) {
  const { data, error } = await supabase
    .from("review")
    .select(`
      review_id,
      user_id,
      book_id,
      star_rating,
      review_text,
      review_date,
      is_public
    `)
    .order("review_date", { ascending: false });

  if (error) return res.status(400).json(error);
  res.json(data);
}

async function addReview(req, res) {
  const { user_id, book_id, star_rating, review_text } = req.body;

  if (!book_id || !review_text) {
    return res.status(400).json({
      message: "book_id and review_text are required.",
    });
  }

  const finalUserId = user_id || "11111111-1111-1111-1111-111111111111";

  const { data, error } = await supabase
    .from("review")
    .insert([
      {
        review_id: randomUUID(),
        user_id: finalUserId,
        book_id,
        star_rating: Number(star_rating) || 5,
        review_text,
        review_date: new Date(),
        is_public: true,
      },
    ])
    .select();

  if (error) return res.status(400).json(error);
  res.status(201).json(data);
}

async function getProfiles(req, res) {
  const { data, error } = await supabase.from("profile").select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
}

async function getBookshelf(req, res) {
  const { data, error } = await supabase
    .from("bookshelf_entry")
    .select(`
      entry_id,
      user_id,
      book_id,
      status,
      start_date,
      finish_date,
      added_at,
      book:book_id (
        book_id,
        title,
        author,
        isbn,
        description
      )
    `);

  if (error) return res.status(400).json(error);
  res.json(data);
}

async function addToBookshelf(req, res) {
  const {
    user_id = "11111111-1111-1111-1111-111111111111",
    book_id,
    status = "want_to_read",
  } = req.body;

  if (!book_id) {
    return res.status(400).json({
      message: "book_id is required.",
    });
  }

  const { data, error } = await supabase
    .from("bookshelf_entry")
    .insert([
      {
        entry_id: randomUUID(),
        user_id,
        book_id,
        status,
        added_at: new Date(),
      },
    ])
    .select();

  if (error) return res.status(400).json(error);
  res.status(201).json(data);
}

async function searchBooks(req, res) {
  const q = req.query.q;

  if (!q) return getBooks(req, res);

  const { data, error } = await supabase
    .from("book")
    .select("*")
    .or(`title.ilike.%${q}%,author.ilike.%${q}%,description.ilike.%${q}%`);

  if (error) return res.status(400).json(error);
  res.json(data);
}

routes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});