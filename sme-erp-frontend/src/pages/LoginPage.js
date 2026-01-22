import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      // navigation handled by useEffect
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid username or password");
      setLoading(false);
    }
  };

  // ✅ Navigate only when auth context is ready
  useEffect(() => {
    if (currentUser) {
      navigate("/post-login", { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>ERP Login</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Username */}
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            disabled={loading}
          />

          {/* Password */}
          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              style={{ ...styles.input, marginBottom: 0 }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.showBtn}
              disabled={loading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Error */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Submit */}
          <button
            type="submit"
            style={{
              ...styles.submit,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "2rem",
    borderRadius: "10px",
    background: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "0.25rem",
    fontSize: "1.6rem",
    textAlign: "center",
  },
  subtitle: {
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  label: {
    fontSize: "0.85rem",
    color: "#334155",
  },
  input: {
    padding: "0.6rem",
    fontSize: "0.9rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    outline: "none",
    marginBottom: "0.8rem",
  },
  passwordWrapper: {
    position: "relative",
    marginBottom: "0.8rem",
  },
  showBtn: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "0.8rem",
    color: "#2563eb",
  },
  submit: {
    marginTop: "0.8rem",
    padding: "0.7rem",
    fontSize: "0.95rem",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "0.5rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    marginBottom: "0.5rem",
  },
  footer: {
    marginTop: "1.5rem",
    fontSize: "0.85rem",
    textAlign: "center",
    color: "#475569",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 500,
  },
};
