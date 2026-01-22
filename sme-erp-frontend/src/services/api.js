import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // API Gateway
});

// ==============================
// JWT HANDLING
// ==============================
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ✅ Auto-apply token on refresh
const storedToken = localStorage.getItem("authToken");
if (storedToken) {
  setAuthToken(storedToken);
}

// ==============================
// AUTH APIs
// ==============================
export const registerUser = (payload) => {
  return api.post("/auth/register", payload);
};

export const loginUser = (payload) => {
  return api.post("/auth/login", payload);
};

// ==============================
// HR APIs
// ==============================
export const getEmployees = () => api.get("/hr/employees");

export const createEmployee = (employee) =>
  api.post("/hr/employees", employee);

export const updateEmployee = (id, employee) =>
  api.put(`/hr/employees/${id}`, employee);

export const deleteEmployee = (id) =>
  api.delete(`/hr/employees/${id}`);

// ✅ EMPLOYEE LIFECYCLE
export const changeEmployeeStatus = (id, status) =>
  api.patch(`/hr/employees/${id}/status`, { status });

// ✅ HR KPIs (ADMIN DASHBOARD)
export const getHrKpis = () =>
  api.get("/hr/admin/kpis");

// ==============================
// INVENTORY APIs
// ==============================
export const getInventoryItems = () => api.get("/inventory/items");

export const createInventoryItem = (item) =>
  api.post("/inventory/items", item);

export const updateInventoryItem = (id, item) =>
  api.put(`/inventory/items/${id}`, item);

export const deleteInventoryItem = (id) =>
  api.delete(`/inventory/items/${id}`);

export default api;
