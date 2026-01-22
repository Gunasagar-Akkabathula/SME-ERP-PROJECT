import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/ui/StatusBadge";

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  primaryBtn: {
    padding: "8px 14px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  th: {
    textAlign: "left",
    padding: "0.6rem",
    borderBottom: "1px solid #e5e7eb",
    background: "#f8fafc",
  },
  td: {
    padding: "0.6rem",
    borderBottom: "1px solid #f1f5f9",
  },
  confirmBtn: (enabled) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: enabled ? "#16a34a" : "#9ca3af",
    color: "#ffffff",
    cursor: enabled ? "pointer" : "not-allowed",
    fontSize: "0.8rem",
  }),
  hint: {
    fontSize: "0.7rem",
    color: "#6b7280",
    marginTop: "2px",
  },
  empty: {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  error: {
    color: "#b91c1c",
    fontSize: "0.9rem",
  },
};

/* ================= COMPONENT ================= */

const Sales = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [inventoryMap, setInventoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/sales/orders");
        const data = res.data || [];
        setOrders(data);

        data.forEach((order) => {
          if (order.inventoryItemId && !inventoryMap[order.inventoryItemId]) {
            fetchInventory(order.inventoryItemId);
          }
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load sales orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInventory = async (itemId) => {
    try {
      const res = await api.get(`/inventory/items/${itemId}`);
      setInventoryMap((prev) => ({
        ...prev,
        [itemId]: res.data,
      }));
    } catch {
      console.error("Failed to load inventory");
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      await api.post(`/sales/orders/${orderId}/confirm`);
      const res = await api.get("/sales/orders");
      setOrders(res.data || []);
    } catch (err) {
      const msg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Order confirmation failed";
      alert(msg);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Sales Dashboard</h2>
        <button
          onClick={() => navigate("/sales/create")}
          style={styles.primaryBtn}
        >
          + Create Sales Order
        </button>
      </div>

      {loading && <p>Loading orders…</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p style={styles.empty}>
          No sales orders found. Create a new order to begin the sales flow.
        </p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Order No</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Available</th>
                <th style={styles.th}>Ordered</th>
                <th style={styles.th}>Remaining</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const inventory = inventoryMap[order.inventoryItemId];
                const available = inventory?.quantity;
                const remaining =
                  available !== undefined
                    ? available - order.quantity
                    : "-";

                const canConfirm =
                  order.status === "DRAFT" &&
                  available !== undefined &&
                  available >= order.quantity;

                let disableReason = "";
                if (order.status !== "DRAFT") {
                  disableReason = "Already confirmed";
                } else if (available < order.quantity) {
                  disableReason = "Insufficient stock";
                }

                return (
                  <tr key={order.id}>
                    <td style={styles.td}>{order.id}</td>
                    <td style={styles.td}>{order.orderNumber}</td>
                    <td style={styles.td}>{order.customerName}</td>
                    <td style={styles.td}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={styles.td}>{available ?? "-"}</td>
                    <td style={styles.td}>{order.quantity}</td>
                    <td style={styles.td}>{remaining}</td>
                    <td style={styles.td}>
                      <button
                        disabled={!canConfirm}
                        onClick={() => confirmOrder(order.id)}
                        title={!canConfirm ? disableReason : "Confirm order"}
                        style={styles.confirmBtn(canConfirm)}
                      >
                        Confirm
                      </button>
                      {!canConfirm && (
                        <div style={styles.hint}>{disableReason}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Sales;
