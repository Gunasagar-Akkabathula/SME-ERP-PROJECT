// src/pages/UserOrders.js
import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==============================
  // LOAD USER ORDERS
  // ==============================
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get("/sales/my-orders");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to load user orders", err);
        setError("Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          You don’t have any orders yet.
        </p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNo}</td>
                <td>{order.orderDate}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>{order.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ==============================
// STATUS BADGE (ERP STYLE)
// ==============================
const StatusBadge = ({ status }) => {
  const colors = {
    DRAFT: "#fbbf24",
    CONFIRMED: "#3b82f6",
    INVOICED: "#10b981",
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

export default UserOrders;
