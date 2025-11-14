const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// Create book (admin)
router.post('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    b.availableCopies = b.totalCopies || 1;
    const book = await Book.create(b);
    res.json(book);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update book (admin)
router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete (admin)
router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// List/search books (public)
router.get('/', async (req, res) => {
  try {
    const { q, author, genre } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (genre) filter.genre = genre;
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

const handleBorrow = async (bookId) => {
  const userId = localStorage.getItem("userId"); // store this when logging in
  try {
    await API.post("/books/borrow", { userId, bookId });
    alert("Book borrowed successfully!");
  } catch (err) {
    alert(err.response?.data?.message || "Error borrowing book");
  }
};

module.exports = router;
