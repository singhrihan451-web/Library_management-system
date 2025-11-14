import React, { useState } from "react";

export default function BorrowModal({ modal, onClose, onBorrowSuccess }) {
  const [loading, setLoading] = useState(false);
  const { book, needLogin } = modal;

  // ✅ Borrow confirm handler
  const handleBorrowConfirm = async () => {
    try {
      setLoading(true);

      const rawUser = localStorage.getItem("user");
      if (!rawUser) {
        alert("⚠️ Please log in first.");
        return;
      }

      const user = JSON.parse(rawUser);
      const token = user?.token;
      if (!token) {
        alert("⚠️ Login expired, please log in again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/borrow/${book._id}/borrow`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Book borrowed successfully!");
        if (onBorrowSuccess) onBorrowSuccess(); // refresh book list
        onClose(); // close modal
      } else {
        alert(`❌ ${data.message || "Failed to borrow book"}`);
      }
    } catch (err) {
      console.error("❌ Borrow error:", err);
      alert("Server error while borrowing book.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Guard: if book null
  if (!book) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // ensures click works!
      }}
      onClick={onClose} // click outside to close
    >
      <div
        className="modal"
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()} // prevent backdrop click close
      >
        <h2 style={{ marginBottom: "10px" }}>
          {needLogin ? "🔐 Login Required" : "Confirm Borrow"}
        </h2>

        {needLogin ? (
          <p>You must log in to borrow this book.</p>
        ) : (
          <p>
            Are you sure you want to borrow{" "}
            <strong>{book?.title}</strong> by {book?.author || "Unknown"}?
          </p>
        )}

        <div
          className="modal-actions"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button onClick={onClose} className="btn cancel" style={{ padding: "8px 16px" }}>
            Cancel
          </button>

          {!needLogin && (
            <button
              onClick={handleBorrowConfirm}
              disabled={loading}
              className="btn primary"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Borrowing..." : "Confirm Borrow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
