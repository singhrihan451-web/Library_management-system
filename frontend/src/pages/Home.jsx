import React, { useEffect, useState } from "react";
import { fetchBooks } from "../services/api";
import BookCard from "../components/BookCard";
import BorrowModal from "../shared/BorrowModal";
import "../index.css";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowModal, setBorrowModal] = useState({
    open: false,
    book: null,
    needLogin: false,
  });

  useEffect(() => {
    setLoading(true);
    fetchBooks()
      .then((data) => setBooks(data || []))
      .catch((err) => console.error("Error fetching books:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleBorrowClicked = (book) => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      setBorrowModal({ open: true, book, needLogin: true });
      return;
    }
    const user = JSON.parse(raw);
    if (!user.token) {
      setBorrowModal({ open: true, book, needLogin: true });
      return;
    }
    setBorrowModal({ open: true, book, needLogin: false });
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1>📚 Welcome to the Library</h1>
        <p>Browse our collection and borrow your favorite books anytime!</p>
      </section>

      {/* Books Section */}
      <h2 className="section-title">Popular Books</h2>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length > 0 ? (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onBorrow={handleBorrowClicked} />
          ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}

      {borrowModal.open && (
        <BorrowModal
          modal={borrowModal}
          onClose={() => setBorrowModal({ open: false, book: null })}
        />
      )}
    </div>
  );
}
