import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  getOutstandingAmount,
  getOverdueInvoiceCount,
  getIssuedInvoiceCount,
  getPaidInvoiceCount,
} from "../services/accountingApi";
import { getPendingOrdersCount } from "../services/salesApi";

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "1rem",
  },
  title: {
    marginBottom: "1rem",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "1.5rem",
  },
  kpiRow: {
    display: "flex",
    gap: "1.5rem",
    fontSize: "0.9rem",
    flexWrap: "wrap",
  },
  tabRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  tab: (active) => ({
    padding: "0.4rem 0.9rem",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    background: active ? "#2563eb" : "#f8fafc",
    color: active ? "#ffffff" : "#334155",
    cursor: "pointer",
    fontSize: "0.85rem",
  }),
  filterRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "0.8rem",
    fontSize: "0.85rem",
  },
  select: {
    padding: "0.35rem",
    fontSize: "0.85rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  th: {
    borderBottom: "1px solid #e5e7eb",
    padding: "0.6rem",
    textAlign: "left",
    background: "#f8fafc",
  },
  td: {
    borderBottom: "1px solid #f1f5f9",
    padding: "0.6rem",
  },
};

/* ================= COMPONENT ================= */

const Reports = () => {
  const [tab, setTab] = useState("sales");
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // KPI state
  const [pendingOrders, setPendingOrders] = useState(0);
  const [issuedCount, setIssuedCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [outstandingAmount, setOutstandingAmount] = useState(0);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [salesStatus, setSalesStatus] = useState("ALL");
  const [invoiceStatus, setInvoiceStatus] = useState("ALL");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [
          ordersRes,
          invoicesRes,
          pendingRes,
          issuedRes,
          paidRes,
          overdueRes,
          outstandingRes,
        ] = await Promise.all([
          api.get("/sales/orders"),
          api.get("/accounting/invoices"),
          getPendingOrdersCount(),
          getIssuedInvoiceCount(),
          getPaidInvoiceCount(),
          getOverdueInvoiceCount(),
          getOutstandingAmount(),
        ]);

        setOrders(ordersRes.data || []);
        setInvoices(invoicesRes.data || []);
        setPendingOrders(pendingRes.data ?? 0);
        setIssuedCount(issuedRes.data ?? 0);
        setPaidCount(paidRes.data ?? 0);
        setOverdueCount(overdueRes.data ?? 0);
        setOutstandingAmount(Number(outstandingRes.data) || 0);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) return <p style={{ padding: "1rem" }}>Loading reports…</p>;

  const inRange = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d)) return false;
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  };

  const filteredOrders = orders.filter((o) => {
    const dateOk = fromDate || toDate ? inRange(o.createdAt) : true;
    const statusOk = salesStatus === "ALL" || o.status === salesStatus;
    return dateOk && statusOk;
  });

  const filteredInvoices = invoices.filter((i) => {
    const dateOk = fromDate || toDate ? inRange(i.issuedAt) : true;
    const statusOk = invoiceStatus === "ALL" || i.status === invoiceStatus;
    return dateOk && statusOk;
  });

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Reports</h2>

      {/* KPI SUMMARY */}
      <div style={styles.card}>
        <div style={styles.kpiRow}>
          <strong>Pending Orders:</strong> {pendingOrders}
          <strong>Issued:</strong> {issuedCount}
          <strong>Paid:</strong> {paidCount}
          <strong>Overdue:</strong> {overdueCount}
          <strong>Outstanding:</strong> ₹ {outstandingAmount.toFixed(2)}
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabRow}>
        <button style={styles.tab(tab === "sales")} onClick={() => setTab("sales")}>
          Sales
        </button>
        <button
          style={styles.tab(tab === "accounting")}
          onClick={() => setTab("accounting")}
        >
          Accounting
        </button>
      </div>

      {/* SALES */}
      {tab === "sales" && (
        <div style={styles.card}>
          <div style={styles.filterRow}>
            <label>
              Status&nbsp;
              <select
                style={styles.select}
                value={salesStatus}
                onChange={(e) => setSalesStatus(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="DRAFT">Draft</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order No</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td style={styles.td}>{o.orderNumber}</td>
                  <td style={styles.td}>{o.customerName}</td>
                  <td style={styles.td}>{o.status}</td>
                  <td style={styles.td}>
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td style={styles.td}>₹ {o.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ACCOUNTING */}
      {tab === "accounting" && (
        <div style={styles.card}>
          <div style={styles.filterRow}>
            <label>
              Status&nbsp;
              <select
                style={styles.select}
                value={invoiceStatus}
                onChange={(e) => setInvoiceStatus(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="DRAFT">Draft</option>
                <option value="ISSUED">Issued</option>
                <option value="PAID">Paid</option>
              </select>
            </label>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Issued</th>
                <th style={styles.th}>Due</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((i) => (
                <tr key={i.id}>
                  <td style={styles.td}>{i.invoiceNumber}</td>
                  <td style={styles.td}>{i.customerName}</td>
                  <td style={styles.td}>{i.status}</td>
                  <td style={styles.td}>
                    {i.issuedAt ? new Date(i.issuedAt).toLocaleDateString() : "-"}
                  </td>
                  <td style={styles.td}>
                    {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td style={styles.td}>₹ {i.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
