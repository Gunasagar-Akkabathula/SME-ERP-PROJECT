// src/components/ChartCard.jsx
import React from "react";

const ChartCard = ({ title, children }) => {
  return (
    <div style={styles.card}>
      {/* HEADER */}
      <div style={styles.header}>{title}</div>

      {/* CONTENT */}
      <div style={styles.content}>{children}</div>
    </div>
  );
};

export default ChartCard;

/* ================= STYLES ================= */

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  header: {
    marginBottom: "0.75rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#111827",
  },
  content: {
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
