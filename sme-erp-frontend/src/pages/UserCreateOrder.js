// src/pages/UserCreateOrder.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const UserCreateOrder = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([
    { productName: "", quantity: 1, price: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==============================
  // HANDLE ITEM CHANGE
  // ==============================
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // ==============================
  // ADD / REMOVE ITEM
  // ==============================
  const addItem = () => {
    setItems([...items, { productName: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // ==============================
  // SUBMIT ORDER (DRAFT)
  // ==============================
  const submitOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.post("/sales/orders", {
        items,
        source: "PORTAL", // helpful for ERP audits
      });

      // After creation, go back to orders list
      navigate("/user/orders");
    } catch (err) {
      console.error("Failed to create order", err);
      setError("Unable to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Place New Order</h2>

      <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
        Your order will be submitted as <strong>DRAFT</strong> and reviewed by
        our sales team.
      </p>

      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <input
            placeholder="Product name"
            value={item.productName}
            onChange={(e) =>
              updateItem(index, "productName", e.target.value)
            }
          />

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              updateItem(index, "quantity", Number(e.target.value))
            }
          />

          <input
            type="number"
            min="0"
            value={item.price}
            onChange={(e) =>
              updateItem(index, "price", Number(e.target.value))
            }
          />

          {items.length > 1 && (
            <button onClick={() => removeItem(index)}>✕</button>
          )}
        </div>
      ))}

      <button onClick={addItem} style={{ marginBottom: "1rem" }}>
        + Add Item
      </button>

      <br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={submitOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Submit Order"}
      </button>
    </div>
  );
};

export default UserCreateOrder;
