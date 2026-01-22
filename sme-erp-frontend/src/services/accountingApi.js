// src/services/accountingApi.js
import api from "./api";

// ==============================
// INVOICES
// ==============================

export const getInvoices = () =>
  api.get("/accounting/invoices");

export const createInvoice = (data) =>
  api.post("/accounting/invoices", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const updateInvoice = (id, data) =>
  api.put(`/accounting/invoices/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const issueInvoice = (id) =>
  api.post(`/accounting/invoices/${id}/issue`);

// ==============================
// PAYMENTS
// ==============================

export const getPayments = (invoiceId) =>
  api.get(`/accounting/invoices/${invoiceId}/payments`);

export const addPayment = (invoiceId, amount) =>
  api.post(
    `/accounting/invoices/${invoiceId}/payments`,
    {
      amount: Number(amount),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

// =================================================
// KPI – ADMIN DASHBOARD (BACKEND-DRIVEN)
// =================================================

/** KPI: Issued invoices count */
export const getIssuedInvoiceCount = () =>
  api.get("/accounting/kpi/issued-invoices");

/** KPI: Paid invoices count */
export const getPaidInvoiceCount = () =>
  api.get("/accounting/kpi/paid-invoices");

/** KPI: Overdue invoices count */
export const getOverdueInvoiceCount = () =>
  api.get("/accounting/kpi/overdue-invoices");

/** KPI: Outstanding Accounts Receivable amount */
export const getOutstandingAmount = () =>
  api.get("/accounting/kpi/outstanding-amount");

/** KPI: Invoice aging buckets (0–30 / 31–60 / 60+) */
export const getAgingBuckets = () =>
  api.get("/accounting/kpi/aging-buckets");
