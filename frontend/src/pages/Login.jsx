import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/Auth.css"; // 👈 Add this line for styling

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      const user = {
        token: res.token,
        name: res.user?.name || res.user?.email,
        isAdmin: res.user?.isAdmin || false,
      };
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/books");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <input
              className="input"
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="input"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging..." : "Login"}
          </button>

          <div className="auth-switch">
            Don’t have an account?{" "}
            <a onClick={() => navigate("/register")}>Create one</a>
          </div>
        </form>
      </div>
    </div>
  );
}
