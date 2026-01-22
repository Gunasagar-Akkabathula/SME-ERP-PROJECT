import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register({
        username,
        email,
        password,
        role,
      });

      setSuccess("Registration successful. Redirecting to login…");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register to access the ERP system</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Username */}
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            disabled={loading}
          />

          {/* Email */}
          <label style={styles.label}>Email</label>
          <input
            type="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={loading}
          />

          {/* Password */}
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            disabled={loading}
          />

          {/* Role */}
          <label style={styles.label}>Role</label>
          <select
            style={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={loading}
          >
            <option value="USER">USER</option>
            <option value="SALES">SALES</option>
            <option value="HR">HR</option>
            <option value="INVENTORY">INVENTORY</option>
            <option value="ACCOUNTANT">ACCOUNTANT</option>
          </select>

          {/* Feedback */}
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          {/* Submit */}
          <button
            type="submit"
            style={{
              ...styles.submit,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

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
    maxWidth: "440px",
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
    background: "#ffffff",
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
  success: {
    background: "#dcfce7",
    color: "#166534",
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
