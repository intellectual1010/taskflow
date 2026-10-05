import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Layers3 } from "lucide-react";
import api from "../api/api";
import type { AuthResponse } from "../types";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-brand">
        <div>
          <div className="brand">
            <Layers3 size={30} />
            <span>TaskFlow</span>
          </div>

          <h1>
            Organize work.
            <br />
            Ship faster.
          </h1>

          <p>
            A modern project management platform powered by ASP.NET Core,
            React and PostgreSQL.
          </p>
        </div>

        <span className="built-with">
          C# • .NET • React • PostgreSQL
        </span>
      </section>

      <section className="auth-form-area">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">WELCOME BACK</span>

          <h2>Sign in to TaskFlow</h2>

          <p className="muted">
            Enter your credentials to access your workspace.
          </p>

          {error && <div className="error-message">{error}</div>}

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </div>
  );
}