import React, { useEffect, useState } from "react";
import {
  getAllDepartments,
  createDepartment,
  activateDepartment,
  deactivateDepartment,
} from "../../services/departmentApi";
import DepartmentTable from "../../components/hr/DepartmentTable";

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // LOAD DEPARTMENTS
  // -----------------------------
  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await getAllDepartments();
      setDepartments(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // -----------------------------
  // CREATE DEPARTMENT
  // -----------------------------
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!code || !name) {
      setError("Department code and name are required");
      return;
    }

    try {
      await createDepartment({ code, name });
      setCode("");
      setName("");
      loadDepartments();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  // -----------------------------
  // ACTIVATE / DEACTIVATE
  // -----------------------------
  const toggleDepartment = async (dept) => {
    try {
      dept.active
        ? await deactivateDepartment(dept.id)
        : await activateDepartment(dept.id);

      loadDepartments();
    } catch {
      setError("Status update failed");
    }
  };

  return (
    <div style={styles.page}>
      <h2>Department Master</h2>
      <p style={styles.subtitle}>
        Manage organizational departments (HR owned master data)
      </p>

      {/* ================= CREATE ================= */}
      <div style={styles.card}>
        <h4>Create Department</h4>

        <form onSubmit={handleCreate}>
          <input
            placeholder="Department Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.primaryBtn}>
            Create Department
          </button>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div style={{ marginTop: "2rem" }}>
        <h4>Departments</h4>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <DepartmentTable
            departments={departments}
            onToggle={toggleDepartment}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "1.5rem",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "1rem",
  },
  card: {
    maxWidth: "420px",
    padding: "1.25rem",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  input: {
    width: "100%",
    padding: "0.55rem",
    marginBottom: "0.7rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },
  error: {
    color: "#dc2626",
    fontSize: "0.85rem",
    marginBottom: "0.5rem",
  },
  primaryBtn: {
    padding: "0.5rem 1.2rem",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
