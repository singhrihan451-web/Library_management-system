// src/services/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach token automatically if user is logged in
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user");
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
    } catch {
      console.warn("⚠️ Invalid user data in localStorage");
    }
  }
  return config;
});

// ✅ BOOK APIs
export async function fetchBooks() {
  const res = await api.get("/books");
  return res.data;
}

export async function fetchBook(id) {
  const res = await api.get(`/books/${id}`);
  return res.data;
}

export async function addBook(payload) {
  const res = await api.post("/books/add", payload);
  return res.data;
}

// ✅ AUTH APIs
export async function registerUser(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await api.post("/auth/login", payload);
  return res.data;
}

// ✅ BORROW APIs
export async function borrowBook(id) {
  // protected route — token handled by interceptor
  const res = await api.put(`/borrow/${id}/borrow`);
  return res.data;
}

export async function getMyBorrowedBooks() {
  const res = await api.get("/borrow/my-borrowed");
  return res.data;
}

export default api;
