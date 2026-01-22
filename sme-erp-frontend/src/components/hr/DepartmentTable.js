import React from "react";

const DepartmentTable = ({ departments, onToggle }) => {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "0.5rem",
      }}
    >
      <thead>
        <tr>
          <th style={th}>Code</th>
          <th style={th}>Name</th>
          <th style={th}>Status</th>
          <th style={th}>Action</th>
        </tr>
      </thead>

      <tbody>
        {departments.map((dept) => (
          <tr key={dept.id}>
            <td style={td}>{dept.code}</td>
            <td style={td}>{dept.name}</td>
            <td style={td}>
              {dept.active ? "ACTIVE" : "INACTIVE"}
            </td>
            <td style={td}>
              <button
                onClick={() => onToggle(dept)}
                style={{
                  padding: "0.3rem 0.6rem",
                  background: dept.active ? "#fee2e2" : "#dcfce7",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                {dept.active ? "Deactivate" : "Activate"}
              </button>
            </td>
          </tr>
        ))}

        {departments.length === 0 && (
          <tr>
            <td
              colSpan="4"
              style={{
                textAlign: "center",
                padding: "1rem",
                color: "#555",
              }}
            >
              No departments found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

// -----------------------------
// STYLES
// -----------------------------
const th = {
  textAlign: "left",
  padding: "0.5rem",
  borderBottom: "1px solid #e5e7eb",
};

const td = {
  padding: "0.5rem",
  borderBottom: "1px solid #f1f5f9",
};

export default DepartmentTable;
