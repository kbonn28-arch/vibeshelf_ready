import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// health / test routes
app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// GET all books
app.get("/books", async (req, res) => {
  const { data, error } = await supabase.from("book").select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
});

// POST new book
app.post("/books", async (req, res) => {
  const { title, author, genre, isbn, description } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required.",
    });
  }

  const { data, error } = await supabase
    .from("book")
    .insert([
      {
        title,
        author,
        genre,
        isbn,
        description,
      },
    ])
    .select();

  if (error) return res.status(400).json(error);
  res.status(201).json(data);
});

// GET all moods
app.get("/moods", async (req, res) => {
  const { data, error } = await supabase.from("mood").select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
});

// GET recommendations by mood
app.get("/moods/:moodId/recommendations", async (req, res) => {
  const { moodId } = req.params;

  const { data, error } = await supabase
    .from("book_mood")
    .select(`
      mood_id,
      book:book_id (
        book_id,
        title,
        author,
        genre,
        isbn,
        description
      )
    `)
    .eq("mood_id", moodId);

  if (error) return res.status(400).json(error);

  const books = data.map((item) => item.book);
  res.json(books);
});

// GET bookshelf entries
app.get("/bookshelf", async (req, res) => {
  const { data, error } = await supabase
    .from("bookshelf_entry")
    .select(`
      entry_id,
      status,
      start_date,
      finish_date,
      added_at,
      book:book_id (
        book_id,
        title,
        author,
        genre,
        isbn,
        description
      )
    `);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// GET all reviews
app.get("/reviews", async (req, res) => {
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
    `);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// POST new review
app.post("/reviews", async (req, res) => {
  const { user_id, book_id, star_rating, review_text } = req.body;

  if (!user_id || !book_id || !star_rating || !review_text) {
    return res.status(400).json({
      message: "user_id, book_id, star_rating, and review_text are required.",
    });
  }

  const { data, error } = await supabase
    .from("review")
    .insert([
      {
        user_id,
        book_id,
        star_rating,
        review_text,
        review_date: new Date(),
        is_public: true,
      },
    ])
    .select();

  if (error) return res.status(400).json(error);
  res.status(201).json(data);
});

// GET profiles
app.get("/profiles", async (req, res) => {
  const { data, error } = await supabase.from("profile").select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
});

// search books
app.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    const { data, error } = await supabase.from("book").select("*");
    if (error) return res.status(400).json(error);
    return res.json(data);
  }

  const { data, error } = await supabase
    .from("book")
    .select("*")
    .or(`title.ilike.%${q}%,author.ilike.%${q}%,genre.ilike.%${q}%`);

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});