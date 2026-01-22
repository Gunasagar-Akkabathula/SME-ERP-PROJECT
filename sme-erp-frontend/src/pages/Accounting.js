// src/pages/Accounting.js
import React, { useEffect, useState } from "react";

import {
  getInvoices,
  createInvoice,
  issueInvoice,
} from "../services/accountingApi";

// ✅ UPDATED IMPORT (new component name)
import AccountingSummary from "../components/accounting/AccountingSummary";
import InvoiceForm from "../components/accounting/InvoiceForm";
import InvoiceList from "../components/accounting/InvoiceList";

const Accounting = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- LOAD INVOICES ----------------
  const loadInvoices = async () => {
    try {
      const res = await getInvoices();
      setInvoices(res.data || []);
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // ---------------- CREATE INVOICE ----------------
  const handleCreate = async (invoiceData) => {
    await createInvoice(invoiceData);
    loadInvoices();
  };

  // ---------------- ISSUE INVOICE ----------------
  const handleIssue = async (invoiceId) => {
    await issueInvoice(invoiceId);
    loadInvoices();
  };

  if (loading) {
    return <p>Loading accounting data...</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Accounting Dashboard</h2>

      {/* ✅ SUMMARY (RENAMED COMPONENT) */}
      <AccountingSummary invoices={invoices} />

      {/* CREATE INVOICE */}
      <InvoiceForm onCreate={handleCreate} />

      {/* INVOICE LIST */}
      <InvoiceList
        invoices={invoices}
        onIssue={handleIssue}
        reload={loadInvoices}
      />
    </div>
  );
};

export default Accounting;
