import api from "./api";

// ----------------------------
// HR KPIs (ADMIN DASHBOARD)
// ----------------------------

export const getHrKpis = () => {
  return api.get("/hr/admin/kpis");
};
