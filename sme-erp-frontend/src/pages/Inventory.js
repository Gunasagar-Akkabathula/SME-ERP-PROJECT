import React, { useEffect, useState } from "react";
import api from "../services/api";

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "1rem",
  },
  header: {
    marginBottom: "1rem",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "1.25rem",
  },
  error: {
    color: "#b91c1c",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
  },
  formRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  input: {
    padding: "0.45rem",
    fontSize: "0.85rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    minWidth: "120px",
  },
  primaryBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  secondaryBtn: {
    padding: "5px 10px",
    borderRadius: "6px",
    border: "none",
    background: "#16a34a",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "0.75rem",
    marginLeft: "4px",
  },
  dangerBtn: {
    padding: "5px 10px",
    borderRadius: "6px",
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "0.75rem",
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
  muted: {
    color: "#6b7280",
    fontSize: "0.85rem",
  },
};

/* ================= COMPONENT ================= */

const Inventory = () => {
  const [items, setItems] = useState([]);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const [adjustQty, setAdjustQty] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadItems = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/inventory/items");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(
        typeof e?.response?.data === "string"
          ? e.response.data
          : e?.response?.data?.message || "Inventory access denied"
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // ---------------- CREATE ITEM ----------------
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!sku.trim() || !name.trim()) {
      setError("SKU and Name are required");
      return;
    }

    setSaving(true);
    try {
      await api.post("/inventory/items", {
        sku: sku.trim(),
        name: name.trim(),
        quantity: Number(quantity || 0),
      });

      setSku("");
      setName("");
      setQuantity("");
      await loadItems();
    } catch (e) {
      setError(
        typeof e?.response?.data === "string"
          ? e.response.data
          : e?.response?.data?.message || "Failed to create item"
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------- ADJUST STOCK ----------------
  const handleAdjustStock = async (id) => {
    const qty = Number(adjustQty[id]);
    if (!qty) return;

    try {
      await api.post(`/inventory/items/${id}/adjust`, null, {
        params: { quantity: qty },
      });
      setAdjustQty((prev) => ({ ...prev, [id]: "" }));
      await loadItems();
    } catch (e) {
      setError(
        typeof e?.response?.data === "string"
          ? e.response.data
          : e?.response?.data?.message || "Stock adjustment failed"
      );
    }
  };

  // ---------------- DISABLE ITEM ----------------
  const handleDisable = async (id) => {
    if (!window.confirm("Disable this item?")) return;

    try {
      await api.delete(`/inventory/items/${id}`);
      await loadItems();
    } catch (e) {
      setError(
        typeof e?.response?.data === "string"
          ? e.response.data
          : e?.response?.data?.message || "Failed to disable item"
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Inventory Module</h2>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading inventory…</p>}

      {/* -------- CREATE ITEM -------- */}
      <div style={styles.card}>
        <form onSubmit={handleCreate}>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              style={styles.input}
              placeholder="Opening Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button type="submit" style={styles.primaryBtn} disabled={saving}>
              {saving ? "Saving…" : "Add Item"}
            </button>
          </div>
        </form>
      </div>

      {/* -------- LIST -------- */}
      {!loading && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Adjust</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.td}>
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr
                    key={it.id}
                    style={{
                      opacity: it.active ? 1 : 0.5,
                      background: it.active ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    <td style={styles.td}>{it.id}</td>
                    <td style={styles.td}>{it.sku}</td>
                    <td style={styles.td}>{it.name}</td>
                    <td style={styles.td}>{it.quantity}</td>
                    <td style={styles.td}>
                      {it.active ? "ACTIVE" : "DISABLED"}
                    </td>

                    <td style={styles.td}>
                      {it.active && (
                        <>
                          <input
                            type="number"
                            style={{ ...styles.input, width: "70px" }}
                            value={adjustQty[it.id] || ""}
                            onChange={(e) =>
                              setAdjustQty((prev) => ({
                                ...prev,
                                [it.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            style={styles.secondaryBtn}
                            onClick={() => handleAdjustStock(it.id)}
                          >
                            Apply
                          </button>
                        </>
                      )}
                    </td>

                    <td style={styles.td}>
                      {it.active && it.quantity === 0 && (
                        <button
                          style={styles.dangerBtn}
                          onClick={() => handleDisable(it.id)}
                        >
                          Disable
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
