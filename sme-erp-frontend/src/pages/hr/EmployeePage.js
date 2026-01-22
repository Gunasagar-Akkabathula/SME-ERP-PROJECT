import React, { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  changeEmployeeStatus,
} from "../../services/api";
import { getActiveDepartments } from "../../services/departmentApi";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    joiningDate: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        getEmployees(),
        getActiveDepartments(),
      ]);
      setEmployees(empRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.department || !form.designation) {
      setError("All fields are required");
      return;
    }

    try {
      await createEmployee(form);
      setForm({
        name: "",
        email: "",
        department: "",
        designation: "",
        joiningDate: "",
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await changeEmployeeStatus(id, status);
      loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update employee status"
      );
    }
  };

  return (
    <div style={styles.page}>
      <h2>Employee Management</h2>
      <p style={styles.subtitle}>
        Create and manage employees, lifecycle, and departments
      </p>

      {/* ================= CREATE EMPLOYEE ================= */}
      <div style={styles.card}>
        <h4>Create Employee</h4>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Employee Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate}
            onChange={handleChange}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.primaryBtn}>
            Create Employee
          </button>
        </form>
      </div>

      {/* ================= EMPLOYEE LIST ================= */}
      <div style={{ marginTop: "2rem" }}>
        <h4>Employees</h4>

        {loading ? (
          <p>Loading employees…</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Designation</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td style={styles.td}>{e.name}</td>
                  <td style={styles.td}>{e.email}</td>
                  <td style={styles.td}>{e.department}</td>
                  <td style={styles.td}>{e.designation}</td>
                  <td style={styles.td}>
                    <strong>{e.status}</strong>
                  </td>
                  <td style={styles.td}>
                    {e.status === "ACTIVE" && (
                      <>
                        <button
                          style={styles.warnBtn}
                          onClick={() =>
                            handleStatusChange(e.id, "ON_LEAVE")
                          }
                        >
                          On Leave
                        </button>
                        <button
                          style={styles.grayBtn}
                          onClick={() =>
                            handleStatusChange(e.id, "RESIGNED")
                          }
                        >
                          Resign
                        </button>
                        <button
                          style={styles.dangerBtn}
                          onClick={() =>
                            handleStatusChange(e.id, "TERMINATED")
                          }
                        >
                          Terminate
                        </button>
                      </>
                    )}

                    {e.status === "ON_LEAVE" && (
                      <button
                        style={styles.successBtn}
                        onClick={() =>
                          handleStatusChange(e.id, "ACTIVE")
                        }
                      >
                        Back to Active
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: "1rem" }}>
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeePage;

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
    maxWidth: "520px",
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
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "0.5rem",
  },
  th: {
    textAlign: "left",
    padding: "0.6rem",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  td: {
    padding: "0.6rem",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "0.9rem",
  },
  warnBtn: {
    marginRight: "4px",
    padding: "4px 8px",
    background: "#eab308",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  successBtn: {
    padding: "4px 8px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  grayBtn: {
    marginRight: "4px",
    padding: "4px 8px",
    background: "#9ca3af",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "4px 8px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
