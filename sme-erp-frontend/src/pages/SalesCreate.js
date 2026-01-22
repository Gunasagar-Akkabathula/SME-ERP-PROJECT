import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SalesCreate = () => {
  const navigate = useNavigate();

  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [inventoryItemId, setInventoryItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- LOAD INVENTORY (READ-ONLY FOR SALES) ----------------
  useEffect(() => {
    api
      .get("/inventory/items")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setInventory(res.data);
        } else {
          setInventory([]);
        }
      })
      .catch((err) => {
        setError(
          typeof err?.response?.data === "string"
            ? err.response.data
            : err?.response?.data?.message ||
              "You are not authorized to view inventory"
        );
        setInventory([]);
      });
  }, []);

  // ---------------- CREATE SALES ORDER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const qty = Number(quantity);
    const price = Number(unitPrice);

    if (
      !orderNumber.trim() ||
      !customerName.trim() ||
      !inventoryItemId ||
      qty <= 0 ||
      price <= 0
    ) {
      setError("All fields are required. Quantity and price must be > 0");
      return;
    }

    try {
      setLoading(true);

      await api.post("/sales/orders", {
        orderNumber: orderNumber.trim(),
        customerName: customerName.trim(),
        inventoryItemId: Number(inventoryItemId),
        quantity: qty,
        unitPrice: price,
      });

      navigate("/sales");
    } catch (err) {
      setError(
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message ||
            "Failed to create sales order"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalAmount =
    Number(unitPrice) > 0 && Number(quantity) > 0
      ? Number(quantity) * Number(unitPrice)
      : 0;

  return (
    <div style={{ padding: "1rem", maxWidth: "500px" }}>
      <h2>Create Sales Order</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label>Order Number</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Inventory Item</label>
          <select
            value={inventoryItemId}
            onChange={(e) => setInventoryItemId(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">-- Select Item --</option>
            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (Available: {item.quantity})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>Unit Price</label>
          <input
            type="number"
            min="1"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {totalAmount > 0 && (
          <p style={{ fontWeight: "bold" }}>
            Total Amount: ₹ {totalAmount}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Order"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/sales")}
          style={{ marginLeft: "0.5rem", padding: "8px 14px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default SalesCreate;
