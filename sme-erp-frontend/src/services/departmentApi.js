import api from "./api";

// =====================================
// DEPARTMENT MASTER – HR SERVICE APIs
// =====================================

// -------- READ --------

// Get all departments (active + inactive) – HR/Admin view
export const getAllDepartments = () => {
  return api.get("/hr/departments");
};

// Get only active departments – dropdowns, assignments
export const getActiveDepartments = () => {
  return api.get("/hr/departments/active");
};

// Get department by code
export const getDepartmentByCode = (code) => {
  return api.get(`/hr/departments/${code}`);
};

// -------- CREATE --------

// Create new department (HR only)
export const createDepartment = (data) => {
  // data = { code, name }
  return api.post("/hr/departments", data);
};

// -------- UPDATE --------

// Update department name (HR only)
export const updateDepartmentName = (id, data) => {
  // data = { name }
  return api.put(`/hr/departments/${id}`, data);
};

// -------- LIFECYCLE --------

// Activate department
export const activateDepartment = (id) => {
  return api.patch(`/hr/departments/${id}/activate`);
};

// Deactivate department
export const deactivateDepartment = (id) => {
  return api.patch(`/hr/departments/${id}/deactivate`);
};
