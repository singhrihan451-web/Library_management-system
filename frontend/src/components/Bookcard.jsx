import React from "react";

export default function BookCard({ book, onBorrow }) {
  // ✅ Safe image handling
  const imageUrl =
    book.coverImage?.trim() ||
    book.image?.trim() ||
    "https://via.placeholder.com/150x200?text=No+Image";

  const handleDetails = () => {
    alert(book.description || "No description available.");
  };

  // ✅ Button disable logic (if copies are unavailable)
  const isUnavailable = book.availableCopies !== undefined && book.availableCopies <= 0;

  return (
    <div
      className="book-card border rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden bg-white"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Book Cover */}
      <img
        src={imageUrl}
        alt={book.title}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          borderBottom: "1px solid #ddd",
        }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150x200?text=No+Image";
        }}
      />

      {/* Book Info */}
      <div className="p-3">
        <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">
          by {book.author || "Unknown"}
        </p>

        {book.availableCopies !== undefined && (
          <p
            className={`text-sm ${
              isUnavailable ? "text-red-500" : "text-green-600"
            }`}
          >
            {isUnavailable
              ? "No copies available"
              : `${book.availableCopies} copies available`}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div
        className="flex justify-between p-3 border-t bg-gray-50"
        style={{ marginTop: "auto" }}
      >
        <button
          className="btn btn-primary bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          onClick={() => onBorrow(book)}
          disabled={isUnavailable}
        >
          {isUnavailable ? "Unavailable" : "Borrow"}
        </button>

        <button
          className="btn btn-secondary bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300 transition"
          onClick={handleDetails}
        >
          Details
        </button>
      </div>
    </div>
  );
}
