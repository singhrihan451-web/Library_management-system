import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BorrowedBooks from "./pages/BorrowedBooks";
export default function App(){
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/books" element={<Books/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
  <Route path="/borrowed" element={<BorrowedBooks />} />
      </Routes>
    </Router>
  );
}
