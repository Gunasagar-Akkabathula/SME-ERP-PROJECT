import React, { useEffect, useState } from "react";
import { getPayments } from "../../services/accountingApi";

const PaymentList = ({ invoiceId, reloadKey }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!invoiceId) return;

    setLoading(true);
    setError(null);

    getPayments(invoiceId)
      .then((res) => {
        setPayments(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load payments", err);
        setError("Failed to load payments");
      })
      .finally(() => setLoading(false));
  }, [invoiceId, reloadKey]); // 👈 reloadKey lets parent refresh list

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (payments.length === 0) {
    return <p>No payments yet.</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        marginTop: "0.5rem",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={th}>Amount</th>
          <th style={th}>Paid At</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id}>
            <td style={td}>₹ {p.amount}</td>
            <td style={td}>
              {p.paidAt
                ? new Date(p.paidAt).toLocaleString()
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/* ---------- styles ---------- */
const th = {
  border: "1px solid #d1d5db",
  padding: "6px",
  background: "#f3f4f6",
  textAlign: "left",
};

const td = {
  border: "1px solid #d1d5db",
  padding: "6px",
};

export default PaymentList;
