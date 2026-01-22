// src/components/accounting/InvoiceForm.jsx
import React, { useState } from "react";

const InvoiceForm = ({ onCreate }) => {
  const [form, setForm] = useState({
    invoiceNumber: "",
    customerName: "",
    totalAmount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    await onCreate(form);
    setForm({ invoiceNumber: "", customerName: "", totalAmount: "" });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: "1rem" }}>
      <h4>Create Invoice</h4>

      <input
        name="invoiceNumber"
        placeholder="Invoice No"
        value={form.invoiceNumber}
        onChange={handleChange}
        required
      />

      <input
        name="customerName"
        placeholder="Customer Name"
        value={form.customerName}
        onChange={handleChange}
        required
      />

      <input
        name="totalAmount"
        type="number"
        placeholder="Amount"
        value={form.totalAmount}
        onChange={handleChange}
        required
      />

      <button type="submit">Create</button>
    </form>
  );
};

export default InvoiceForm;
