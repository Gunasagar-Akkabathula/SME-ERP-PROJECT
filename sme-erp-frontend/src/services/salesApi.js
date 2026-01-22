// src/services/salesApi.js
import api from "./api";

// ================================
// SALES KPIs (ADMIN / REPORTS)
// ================================

/**
 * KPI: Pending sales orders (DRAFT)
 */
export const getPendingOrdersCount = () => {
  return api.get("/sales/kpi/pending-orders");
};

/**
 * KPI: Today's confirmed sales total
 * (optional / future-ready)
 */
export const getTodaySalesTotal = () => {
  return api.get("/sales/kpi/today-sales");
};
