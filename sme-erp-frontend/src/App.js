// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Hr from "./pages/Hr";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import SalesCreate from "./pages/SalesCreate";
import Accounting from "./pages/Accounting";
import Reports from "./pages/Reports";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import UserOrders from "./pages/UserOrders";
import UserInvoices from "./pages/UserInvoices";
import UserCreateOrder from "./pages/UserCreateOrder";
import RoleBasedDashboard from "./pages/RoleBasedDashboard";

// 🔹 NEW HR PAGES
import EmployeePage from "./pages/hr/EmployeePage";
import DepartmentPage from "./pages/hr/DepartmentPage";

import { AuthProvider, useAuth } from "./context/AuthContext";

/* ================= PAGE WRAPPER ================= */
const PageWrapper = ({ children }) => {
  return (
    <div style={{ animation: "fadeIn 0.25s ease-in" }}>
      {children}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { token, currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading application...
      </div>
    );
  }

  if (!token || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles) {
    return <PageWrapper>{children}</PageWrapper>;
  }

  const userRoles = (currentUser.roles || []).map((r) =>
    r.replace("ROLE_", "")
  );

  if (!allowedRoles.some((role) => userRoles.includes(role))) {
    return <Navigate to="/post-login" replace />;
  }

  return <PageWrapper>{children}</PageWrapper>;
};

/* ================= LAYOUT ================= */
const Layout = ({ children }) => (
  <div>
    <Navbar />
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "1rem" }}>{children}</main>
    </div>
  </div>
);

/* ================= APP ================= */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ---------- PUBLIC ---------- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ---------- POST LOGIN ---------- */}
          <Route
            path="/post-login"
            element={
              <ProtectedRoute>
                <RoleBasedDashboard />
              </ProtectedRoute>
            }
          />

          {/* ---------- ADMIN ---------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ---------- HR ---------- */}
          {/* Optional HR landing page (old UI) */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <Layout>
                  <Hr />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* HR - Employees */}
          <Route
            path="/hr/employees"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <Layout>
                  <EmployeePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* HR - Departments */}
          <Route
            path="/hr/departments"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <Layout>
                  <DepartmentPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ---------- INVENTORY ---------- */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={["INVENTORY", "ADMIN"]}>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ---------- SALES ---------- */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute allowedRoles={["SALES", "ADMIN"]}>
                <Layout>
                  <Sales />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales/create"
            element={
              <ProtectedRoute allowedRoles={["SALES", "ADMIN"]}>
                <Layout>
                  <SalesCreate />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ---------- ACCOUNTING ---------- */}
          <Route
            path="/accounting"
            element={
              <ProtectedRoute allowedRoles={["ACCOUNTANT", "ADMIN"]}>
                <Layout>
                  <Accounting />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ---------- USER PORTAL ---------- */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/orders"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserOrders />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/orders/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserCreateOrder />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/invoices"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserInvoices />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ---------- REPORTS ---------- */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ---------- PROFILE ---------- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/post-login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
