// src/components/StatCard.jsx
import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div style={styles.card}>
      <div style={styles.title}>{title}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
};

export default StatCard;

/* ================= STYLES ================= */

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
    minWidth: "160px",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  title: {
    fontSize: "0.85rem",
    color: "#6b7280",
    marginBottom: "0.35rem",
  },
  value: {
    fontSize: "1.6rem",
    fontWeight: 600,
    color: "#111827",
  },
};
