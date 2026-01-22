import React, { useEffect, useState } from "react";

// ✅ FIXED PATH (inside src/)
import {
  getPendingOrdersCount,
  getTodaySalesTotal,
} from "../services/salesApi";

/**
 * Sales KPI Summary
 * Backend-driven (Admin Dashboard)
 */
const SalesSummary = () => {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKpis = async () => {
      try {
        const [pendingRes, todaySalesRes] = await Promise.all([
          getPendingOrdersCount(),
          getTodaySalesTotal(),
        ]);

        setPendingOrders(pendingRes.data ?? 0);
        setTodaySales(todaySalesRes.data ?? 0);
      } catch (err) {
        console.error("Failed to load Sales KPIs", err);
      } finally {
        setLoading(false);
      }
    };

    loadKpis();
  }, []);

  if (loading) {
    return <p>Loading sales KPIs...</p>;
  }

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3>Sales Overview</h3>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h4>Pending Orders</h4>
          <strong>{pendingOrders}</strong>
        </div>

        <div style={cardStyle}>
          <h4>Today’s Sales</h4>
          <strong>₹ {Number(todaySales).toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

/* ---------- Simple KPI Card Style ---------- */
const cardStyle = {
  padding: "1rem",
  minWidth: "180px",
  borderRadius: "8px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  textAlign: "center",
};

export default SalesSummary;
