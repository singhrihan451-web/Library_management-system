import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../index.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="nav-left" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <div className="logo">📚 <span className="logo-text">Library System</span></div>
      </div>

      <nav className="nav-links">
        <Link className={location.pathname === "/" ? "active" : ""} to="/">Home</Link>
        <Link className={location.pathname === "/books" ? "active" : ""} to="/books">Books</Link>
        <Link className={location.pathname === "/Borrowed" ? "active" : ""} to="/Borrowed">Borrowed Books</Link>

        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className={location.pathname === "/login" ? "active" : ""} to="/login">Login</Link>
            <Link className={location.pathname === "/register" ? "active" : ""} to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
