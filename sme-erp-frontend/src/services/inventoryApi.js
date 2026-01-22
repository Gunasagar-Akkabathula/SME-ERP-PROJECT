// src/services/inventoryApi.js
import api from "./api";

// ================================
// INVENTORY KPIs (ADMIN / REPORTS)
// ================================

/**
 * KPI: Low Stock Items
 * ERP rule:
 * active = true AND quantity < reorderLevel
 */
export const getLowStockCount = () =>
  api.get("/inventory/kpi/low-stock");
