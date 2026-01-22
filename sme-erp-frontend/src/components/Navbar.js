// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout(); // clears token + currentUser and navigates to /login
  };

  return (
    <nav style={styles.navbar}>
      {/* LEFT: BRAND */}
      <div style={styles.brand}>
        SME <span style={{ color: "#60a5fa" }}>ERP</span>
      </div>

      {/* RIGHT: USER INFO */}
      <div style={styles.right}>
        {currentUser ? (
          <>
            <span style={styles.userText}>
              Logged in as{" "}
              <strong style={styles.username}>
                {currentUser.username}
              </strong>
            </span>

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.loginBtn}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

/* ================= STYLES ================= */

const styles = {
  navbar: {
    height: "56px",
    padding: "0 1rem",
    background: "#0f172a", // slate-900
    color: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #1e293b",
  },
  brand: {
    fontSize: "1.05rem",
    fontWeight: 600,
    letterSpacing: "0.3px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.9rem",
  },
  userText: {
    color: "#cbd5f5",
  },
  username: {
    color: "#f8fafc",
    fontWeight: 600,
  },
  logoutBtn: {
    padding: "0.35rem 0.75rem",
    background: "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  loginBtn: {
    padding: "0.35rem 0.75rem",
    background: "#2563eb",
    borderRadius: "6px",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "0.85rem",
  },
};
