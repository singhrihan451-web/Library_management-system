import React, { useEffect, useState } from "react";

export default function BorrowedBooks() {
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) return alert("Please log in first");

        const user = JSON.parse(rawUser);
        const token = user?.token;
        if (!token) return alert("Login expired, please log in again");

        const res = await fetch("http://localhost:5000/api/borrow/my-borrowed", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("📘 Borrowed books:", data);
        const booksArray = Array.isArray(data) ? data : data.borrowedBooks || [];

        setBorrowed(booksArray);
      } catch (err) {
        console.error("Error fetching borrowed books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  return (
    <div className="container borrowed-books-page" style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>📚 Borrowed Books</h1>

      {loading ? (
        <p>Loading...</p>
      ) : borrowed.length === 0 ? (
        <p style={{ fontSize: "16px" }}>You haven't borrowed any books yet.</p>
      ) : (
        <div className="borrowed-grid" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {borrowed.map((item) => {
            const book = item.bookId;

            const date = item.borrowedAt
              ? new Date(item.borrowedAt).toLocaleDateString()
              : "N/A";

            // ✅ Image URL logic (external + local both work)
            const imageUrl = book?.coverImage
              ? book.coverImage.startsWith("http")
                ? book.coverImage
                : `http://localhost:5000/${book.coverImage}`
              : "https://via.placeholder.com/150x200?text=No+Image";

            return (
              <div
                key={item._id}
                className="borrowed-card"
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "16px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  alignItems: "center",
                }}
              >
                {/* ✅ Book Image */}
                <img
                  src={imageUrl}
                  alt={book?.title || "Book cover"}
                  style={{
                    width: "90px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150x200?text=No+Image")
                  }
                />

                {/* ✅ Book Info */}
                <div>
                  <h3 style={{ marginBottom: "6px" }}>
                    {book?.title || "Untitled"}
                  </h3>

                  <p style={{ marginBottom: "4px" }}>
                    <strong>Author:</strong> {book?.author || "Unknown"}
                  </p>

                  <p style={{ marginBottom: "4px", color: "#555" }}>
                    <strong>Borrowed on:</strong> {date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
