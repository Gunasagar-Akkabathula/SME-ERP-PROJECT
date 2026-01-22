// src/pages/UserInvoices.js
import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==============================
  // LOAD USER INVOICES
  // ==============================
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await api.get("/accounting/my-invoices");
        setInvoices(res.data || []);
      } catch (err) {
        console.error("Failed to load user invoices", err);
        setError("Unable to load invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  if (loading) {
    return <p>Loading your invoices...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>My Invoices</h2>

      {invoices.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          No invoices have been generated yet.
        </p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.invoiceNo}</td>
                <td>{inv.invoiceDate}</td>
                <td>
                  <InvoiceStatusBadge status={inv.status} />
                </td>
                <td>{inv.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ==============================
// INVOICE STATUS BADGE (ERP)
// ==============================
const InvoiceStatusBadge = ({ status }) => {
  const colors = {
    DRAFT: "#fbbf24",
    POSTED: "#3b82f6",
    PAID: "#10b981",
    CANCELLED: "#ef4444",
  };

  return (
    <span
      style={{
        padding: "0.25rem 0.5rem",
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: "600",
        color: "#fff",
        backgroundColor: colors[status] || "#6b7280",
      }}
    >
      {status}
    </span>
  );
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

export default UserInvoices;
