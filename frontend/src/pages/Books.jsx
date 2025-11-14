import React, { useEffect, useState } from "react";
import { fetchBooks } from "../services/api";
import BookCard from "../components/BookCard";
import BorrowModal from "../shared/BorrowModal";
import "../index.css";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, book: null, needLogin: false });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks();
        setBooks(data || []);
      } catch (err) {
        console.error("❌ Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const handleBorrow = (book) => {
    console.log("Borrow clicked:", book.title); // 👈 Debug line

    try {
      const raw = localStorage.getItem("user");

      if (!raw) {
        console.log("No user found → need login");
        setModal({ open: true, book, needLogin: true });
        return;
      }

      const user = JSON.parse(raw);

      if (!user?.token) {
        console.log("User has no token → need login");
        setModal({ open: true, book, needLogin: true });
        return;
      }

      console.log("Opening BorrowModal for:", book.title);
      setModal({ open: true, book, needLogin: false });
    } catch (err) {
      console.error("Error handling borrow:", err);
    }
  };

  const closeModal = () => {
    setModal({ open: false, book: null, needLogin: false });
  };

  return (
    <div className="container books-page">
      <div className="page-header">
        <h1>📚 All Books</h1>
        <p>Explore the full collection and borrow your favorite books!</p>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length > 0 ? (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onBorrow={handleBorrow} />
          ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}

      {/* ✅ BorrowModal opens correctly */}
      {modal.open && (
        <BorrowModal
          modal={modal}
          onClose={closeModal}
          onBorrowSuccess={() => {
            // Refresh book list after successful borrow
            fetchBooks().then((data) => setBooks(data || []));
          }}
        />
      )}
    </div>
  );
}
