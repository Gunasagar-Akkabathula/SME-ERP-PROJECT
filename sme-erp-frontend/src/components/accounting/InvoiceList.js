import React, { useState } from "react";
import PaymentList from "./PaymentList";
import PaymentForm from "./PaymentForm";
import StatusBadge from "../ui/StatusBadge";

const InvoiceList = ({ invoices, onIssue, reload }) => {
  const [expanded, setExpanded] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const togglePayments = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <table
      border="1"
      width="100%"
      cellPadding="8"
      style={{
        borderCollapse: "collapse",
        marginTop: "1rem",
      }}
    >
      <thead style={{ background: "#f3f4f6" }}>
        <tr>
          <th>Invoice No</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Sales Order</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {invoices.map((inv) => (
          <React.Fragment key={inv.id}>
            <tr>
              <td>{inv.invoiceNumber}</td>
              <td>{inv.customerName}</td>
              <td>₹ {inv.totalAmount}</td>

              {/* STATUS BADGE */}
              <td>
                <StatusBadge status={inv.status} />
              </td>

              {/* SALES ORDER REFERENCE */}
              <td>
                {inv.salesOrderId ? `SO-${inv.salesOrderId}` : "-"}
              </td>

              <td>
                {/* ISSUE BUTTON */}
                {inv.status === "DRAFT" && (
                  <button
                    onClick={() => onIssue(inv.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Issue
                  </button>
                )}

                {/* PAYMENTS TOGGLE */}
                <button
                  style={{
                    marginLeft: "6px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => togglePayments(inv.id)}
                >
                  {expanded === inv.id ? "Close" : "Payments"}
                </button>
              </td>
            </tr>

            {/* PAYMENTS SECTION */}
            {expanded === inv.id && (
              <tr style={{ background: "#fafafa" }}>
                <td colSpan="6">
                  {/* ❌ Do NOT allow payment before ISSUE */}
                  {inv.status === "ISSUED" || inv.status === "PAID" ? (
                    <>
                      <PaymentForm
                        invoiceId={inv.id}
                        reload={() => {
                          setReloadKey(Date.now());
                          reload();
                        }}
                      />

                      <PaymentList
                        invoiceId={inv.id}
                        reloadKey={reloadKey}
                      />
                    </>
                  ) : (
                    <p style={{ color: "#6b7280" }}>
                      Invoice must be ISSUED before accepting payments.
                    </p>
                  )}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default InvoiceList;
