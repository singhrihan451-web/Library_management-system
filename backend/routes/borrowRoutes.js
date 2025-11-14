const express = require("express");
const router = express.Router();
const Borrow = require("../models/borrow");
const Book = require("../models/book");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Borrow a book
router.put("/:id/borrow", authMiddleware, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    if (book.availableCopies <= 0)
      return res.status(400).json({ success: false, message: "No copies available" });

    const alreadyBorrowed = await Borrow.findOne({ userId, bookId });
    if (alreadyBorrowed)
      return res.status(400).json({ success: false, message: "Already borrowed this book" });

    const newBorrow = new Borrow({ userId, bookId });
    await newBorrow.save();

    book.availableCopies -= 1;
    await book.save();

    res.json({ success: true, message: "Book borrowed successfully!", borrowedBook: newBorrow });
  } catch (err) {
    console.error("❌ Borrow error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ✅ Get user's borrowed books
router.get("/my-borrowed", authMiddleware, async (req, res) => {
  try {
    const borrowedBooks = await Borrow.find({ userId: req.user.id })
      .populate({
        path: "bookId",
        select: "title author coverImage availableCopies",
      })
      .sort({ borrowedAt: -1 });

    res.json(borrowedBooks); // Frontend needs array
  } catch (err) {
    console.error("❌ Fetch borrowed books error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrowed books",
      error: err.message,
    });
  }
});


module.exports = router;
