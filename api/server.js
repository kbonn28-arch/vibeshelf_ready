import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// test route
app.get("/", (req, res) => {
  res.send("API running");
});

// GET books
app.get("/books", async (req, res) => {
  const { data, error } = await supabase.from("book").select("*");
  if (error) return res.status(400).json(error);
  res.json(data);
});

// GET moods
app.get("/moods", async (req, res) => {
  const { data, error } = await supabase.from("mood").select("*");
  if (error) return res.status(400).json(error);
  res.json(data);
});

// GET reviews
app.get("/reviews", async (req, res) => {
  const { data, error } = await supabase.from("review").select("*");
  if (error) return res.status(400).json(error);
  res.json(data);
});

// POST review
app.post("/reviews", async (req, res) => {
  const { user_id, book_id, star_rating, review_text } = req.body;

  const { data, error } = await supabase.from("review").insert([
    {
      user_id,
      book_id,
      star_rating,
      review_text,
      review_date: new Date(),
      is_public: true,
    },
  ]);

  if (error) return res.status(400).json(error);
  res.status(201).json(data);
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
