// src/pages/Hr.js
import React from "react";
import { Link } from "react-router-dom";

const Hr = () => {
  return (
    <div style={styles.page}>
      <h2 style={styles.title}>HR Module</h2>
      <p style={styles.subtitle}>
        Human Resources management – employees, departments, and lifecycle
        operations.
      </p>

      {/* ================= HR ACTION CARDS ================= */}
      <div style={styles.grid}>
        {/* EMPLOYEES */}
        <Link to="/hr/employees" style={styles.card}>
          <h3 style={styles.cardTitle}>Employees</h3>
          <p style={styles.cardDesc}>
            Manage employee records, status, and lifecycle.
          </p>
        </Link>

        {/* DEPARTMENTS */}
        <Link to="/hr/departments" style={styles.card}>
          <h3 style={styles.cardTitle}>Departments</h3>
          <p style={styles.cardDesc}>
            Maintain department master data used across ERP.
          </p>
        </Link>
      </div>

      {/* ================= FOOT NOTE ================= */}
      <p style={styles.note}>
        Employee roles and system access are managed separately via Security
        module.
      </p>
    </div>
  );
};

export default Hr;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "1.5rem",
  },
  title: {
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
  },
  card: {
    display: "block",
    padding: "1.25rem",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#111827",
    background: "#ffffff",
    transition: "all 0.15s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    marginBottom: "0.25rem",
    fontSize: "1.05rem",
  },
  cardDesc: {
    marginTop: "0.25rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  note: {
    marginTop: "2rem",
    fontSize: "0.85rem",
    color: "#6b7280",
  },
};
