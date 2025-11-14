const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// ✅ 1. Add a new book
router.post("/add", async (req, res) => {
  try {
    const { title, author, genre, description, coverImage, availableCopies } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and Author are required" });
    }

    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      return res.status(400).json({ message: "Book already exists" });
    }

    const newBook = new Book({
      title,
      author,
      genre: genre || "",
      description: description || "",
      coverImage: coverImage || "",
      availableCopies: availableCopies || 5,
    });

    await newBook.save();
    return res.status(201).json({ message: "✅ Book added successfully!", book: newBook });
  } catch (err) {
    console.error("❌ Error adding book:", err.message);
    res.status(500).json({ message: "Error adding book", error: err.message });
  }
});

// ✅ 2. Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error("❌ Error fetching books:", err.message);
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
});

module.exports = router;
