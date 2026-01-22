import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

// ================================
// DOMAIN APIs (ERP-style KPIs)
// ================================

// Sales
import { getPendingOrdersCount } from "../services/salesApi";

// Inventory
import { getLowStockCount } from "../services/inventoryApi";

// Accounting
import {
  getOutstandingAmount,
  getOverdueInvoiceCount,
  getIssuedInvoiceCount,
  getPaidInvoiceCount,
  getAgingBuckets,
} from "../services/accountingApi";

// HR
import { getHrKpis } from "../services/hrApi";

// Charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a"];
const HR_COLORS = ["#16a34a", "#eab308", "#f97316", "#dc2626"];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // ================================
  // KPI STATES
  // ================================

  // Sales
  const [pendingOrders, setPendingOrders] = useState(0);

  // Inventory
  const [lowStockCount, setLowStockCount] = useState(0);

  // Accounting
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [overdueInvoices, setOverdueInvoices] = useState(0);
  const [issuedCount, setIssuedCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [aging, setAging] = useState({});

  // HR
  const [hrKpis, setHrKpis] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    resigned: 0,
    terminated: 0,
  });

  // ================================
  // LOAD KPIs
  // ================================
  useEffect(() => {
    const loadKPIs = async () => {
      try {
        const [
          pendingOrdersRes,
          lowStockRes,
          outstandingRes,
          overdueRes,
          issuedRes,
          paidRes,
          agingRes,
          hrKpisRes,
        ] = await Promise.all([
          getPendingOrdersCount(),
          getLowStockCount(),
          getOutstandingAmount(),
          getOverdueInvoiceCount(),
          getIssuedInvoiceCount(),
          getPaidInvoiceCount(),
          getAgingBuckets(),
          getHrKpis(),
        ]);

        // Sales
        setPendingOrders(pendingOrdersRes.data ?? 0);

        // Inventory
        setLowStockCount(lowStockRes.data ?? 0);

        // Accounting
        setOutstandingAmount(outstandingRes.data ?? 0);
        setOverdueInvoices(overdueRes.data ?? 0);
        setIssuedCount(issuedRes.data ?? 0);
        setPaidCount(paidRes.data ?? 0);
        setAging(agingRes.data || {});

        // HR
        setHrKpis(hrKpisRes.data || {});
      } catch (err) {
        console.error("Failed to load admin KPIs", err);
      } finally {
        setLoading(false);
      }
    };

    loadKPIs();
  }, []);

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading dashboard…</p>;
  }

  // ================================
  // CHART DATA
  // ================================

  const agingData = [
    { bucket: "0–30", value: aging["0-30"] || 0 },
    { bucket: "31–60", value: aging["31-60"] || 0 },
    { bucket: "60+", value: aging["60+"] || 0 },
  ];

  const invoiceStatusData = [
    { name: "Issued", value: issuedCount },
    { name: "Paid", value: paidCount },
  ];

  const hrStatusData = [
    { name: "Active", value: hrKpis.active || 0 },
    { name: "On Leave", value: hrKpis.onLeave || 0 },
    { name: "Resigned", value: hrKpis.resigned || 0 },
    { name: "Terminated", value: hrKpis.terminated || 0 },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Admin Dashboard</h2>

      {/* ================= KPI CARDS ================= */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Sales */}
        <StatCard title="Pending Sales Orders" value={pendingOrders} />

        {/* Inventory */}
        <StatCard title="Low Stock Items" value={lowStockCount} />

        {/* Accounting */}
        <StatCard
          title="Outstanding Amount"
          value={`₹ ${Number(outstandingAmount).toFixed(2)}`}
        />
        <StatCard title="Overdue Invoices" value={overdueInvoices} />
        <StatCard title="Issued Invoices" value={issuedCount} />
        <StatCard title="Paid Invoices" value={paidCount} />

        {/* HR */}
        <StatCard title="Total Employees" value={hrKpis.total} />
        <StatCard title="Active Employees" value={hrKpis.active} />
        <StatCard title="On Leave" value={hrKpis.onLeave} />
        <StatCard
          title="Exited Employees"
          value={(hrKpis.resigned || 0) + (hrKpis.terminated || 0)}
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {/* Invoice Aging */}
        <ChartCard title="Invoice Aging (Days)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agingData}>
              <XAxis dataKey="bucket" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Invoice Status */}
        <ChartCard title="Invoice Status">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={invoiceStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {invoiceStatusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* HR Headcount by Status */}
        <ChartCard title="Employee Headcount by Status">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={hrStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {hrStatusData.map((_, index) => (
                  <Cell key={index} fill={HR_COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
