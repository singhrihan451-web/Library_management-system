const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    description: { type: String },
    coverImage: { type: String },
    availableCopies: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
