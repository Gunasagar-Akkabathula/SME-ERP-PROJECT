import React, { useState } from "react";
import { addPayment } from "../../services/accountingApi";

const PaymentForm = ({ invoiceId, reload }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ send NUMBER, not object
      await addPayment(invoiceId, Number(amount));
      setAmount("");
      reload();
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginTop: "0.5rem" }}>
      <input
        type="number"
        placeholder="Payment Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Add Payment"}
      </button>
    </form>
  );
};

export default PaymentForm;
