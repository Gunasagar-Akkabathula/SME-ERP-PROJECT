import React, { useEffect, useState } from "react";

import {
  getIssuedInvoiceCount,
  getPaidInvoiceCount,
  getOverdueInvoiceCount,
  getOutstandingAmount,
  getAgingBuckets,
} from "../../services/accountingApi";

const cardStyle = {
  padding: "1rem",
  borderRadius: "8px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  minWidth: "160px",
  textAlign: "center",
};

const barContainer = {
  display: "flex",
  alignItems: "flex-end",
  gap: "12px",
  height: "120px",
  marginTop: "1rem",
};

const barStyle = (height, color) => ({
  width: "60px",
  height,
  background: color,
  borderRadius: "6px 6px 0 0",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  color: "#fff",
  fontWeight: "bold",
});

const AccountingSummary = () => {
  const [issued, setIssued] = useState(0);
  const [paid, setPaid] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [aging, setAging] = useState({
    "0-30": 0,
    "31-60": 0,
    "60+": 0,
  });

  useEffect(() => {
    loadKpis();
  }, []);

  const loadKpis = async () => {
    try {
      const [
        issuedRes,
        paidRes,
        overdueRes,
        outstandingRes,
        agingRes,
      ] = await Promise.all([
        getIssuedInvoiceCount(),
        getPaidInvoiceCount(),
        getOverdueInvoiceCount(),
        getOutstandingAmount(),
        getAgingBuckets(),
      ]);

      setIssued(issuedRes.data);
      setPaid(paidRes.data);
      setOverdue(overdueRes.data);
      setOutstanding(outstandingRes.data);
      setAging(agingRes.data);

    } catch (err) {
      console.error("Failed to load accounting KPIs", err);
    }
  };

  const max = Math.max(issued, paid, overdue, 1);
  const scale = (value) => `${(value / max) * 100}%`;

  return (
    <>
      {/* KPI SUMMARY CARDS */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={cardStyle}>
          <h4>Issued</h4>
          <strong>{issued}</strong>
        </div>

        <div style={cardStyle}>
          <h4>Paid</h4>
          <strong>{paid}</strong>
        </div>

        <div style={cardStyle}>
          <h4>Overdue</h4>
          <strong>{overdue}</strong>
        </div>

        <div style={cardStyle}>
          <h4>Outstanding</h4>
          <strong>₹ {outstanding.toFixed(2)}</strong>
        </div>
      </div>

      {/* BAR CHART */}
      <div>
        <h3>Invoices (KPI)</h3>

        <div style={barContainer}>
          <div>
            <div style={barStyle(scale(issued), "#3b82f6")}>
              {issued}
            </div>
            <small>Issued</small>
          </div>

          <div>
            <div style={barStyle(scale(paid), "#16a34a")}>
              {paid}
            </div>
            <small>Paid</small>
          </div>

          <div>
            <div style={barStyle(scale(overdue), "#dc2626")}>
              {overdue}
            </div>
            <small>Overdue</small>
          </div>
        </div>
      </div>

      {/* AGING BUCKETS */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Aging Buckets</h3>
        <ul>
          <li>0–30 days: {aging["0-30"]}</li>
          <li>31–60 days: {aging["31-60"]}</li>
          <li>60+ days: {aging["60+"]}</li>
        </ul>
      </div>
    </>
  );
};

export default AccountingSummary;
