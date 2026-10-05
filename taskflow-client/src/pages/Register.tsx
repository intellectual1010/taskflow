import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Layers3 } from "lucide-react";
import api from "../api/api";
import type { AuthResponse } from "../types";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post<AuthResponse>(
        "/auth/register",
        form
      );

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
      setError("Unable to create account. The email may already exist.");
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
            Turn ideas
            <br />
            into progress.
          </h1>

          <p>
            Manage projects and move work through a simple,
            focused workflow.
          </p>
        </div>

        <span className="built-with">
          ASP.NET Core 10 • React • PostgreSQL
        </span>
      </section>

      <section className="auth-form-area">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">GET STARTED</span>

          <h2>Create your account</h2>

          <p className="muted">
            Create a workspace and start managing projects.
          </p>

          {error && <div className="error-message">{error}</div>}

          <label>Name</label>
          <input
            placeholder="Your name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Minimum 8 characters"
            minLength={8}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button className="primary-button" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}