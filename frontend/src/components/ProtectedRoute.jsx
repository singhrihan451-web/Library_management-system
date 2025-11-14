import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin }) {
  const raw = localStorage.getItem("user");
  if (!raw) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(raw);
    if (requireAdmin && !user.isAdmin) return <Navigate to="/" replace />;
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
