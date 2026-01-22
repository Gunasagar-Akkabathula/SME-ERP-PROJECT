// src/pages/ProfilePage.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/ui/StatusBadge";

const ProfilePage = () => {
  const { currentUser, loadCurrentUser } = useAuth();

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  if (!currentUser) {
    return <p style={{ padding: "1rem" }}>Loading profile…</p>;
  }

  const roles = Array.isArray(currentUser.roles)
    ? currentUser.roles.map((r) => r.replace("ROLE_", ""))
    : [];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>My Profile</h2>
        <p style={styles.subtitle}>Account information</p>

        <div style={styles.section}>
          <span style={styles.label}>Username</span>
          <p style={styles.value}>{currentUser.username}</p>
        </div>

        <div style={styles.section}>
          <span style={styles.label}>Roles</span>
          <div style={styles.badges}>
            {roles.map((role) => (
              <StatusBadge key={role} status={role} />
            ))}
          </div>
        </div>

        <p style={styles.note}>
          Your profile information is managed by the system administrator.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    padding: "2rem",
    borderRadius: "10px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  title: {
    marginBottom: "0.25rem",
    fontSize: "1.5rem",
  },
  subtitle: {
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    color: "#64748b",
  },
  section: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    color: "#475569",
    marginBottom: "0.25rem",
  },
  value: {
    fontSize: "0.95rem",
    color: "#111827",
  },
  badges: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginTop: "0.25rem",
  },
  note: {
    marginTop: "1.5rem",
    fontSize: "0.85rem",
    color: "#6b7280",
  },
};
