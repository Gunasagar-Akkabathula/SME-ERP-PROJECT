// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const {
    loading,
    currentUser,
    isAdmin,
    isSales,
    isInventory,
    isAccountant,
    isHr,
    isPortalUserOnly,
  } = useAuth();

  const location = useLocation();

  if (loading || !currentUser) return null;

  const isHrUser = isAdmin || isHr;

  const menuItems = [
    { label: "Admin Dashboard", path: "/dashboard", visible: isAdmin },

    { label: "Sales", path: "/sales", visible: isAdmin || isSales },
    { label: "Inventory", path: "/inventory", visible: isAdmin || isInventory },
    { label: "Accounting", path: "/accounting", visible: isAdmin || isAccountant },

    {
      label: "HR",
      path: null,
      visible: isHrUser,
      children: [
        { label: "Employees", path: "/hr/employees" },
        { label: "Departments", path: "/hr/departments" },
      ],
    },

    { label: "My Dashboard", path: "/user", visible: isPortalUserOnly },
    { label: "My Orders", path: "/user/orders", visible: isPortalUserOnly },
    { label: "Invoices", path: "/user/invoices", visible: isPortalUserOnly },

    { label: "Reports", path: "/reports", visible: isAdmin },
  ];

  return (
    <aside style={styles.sidebar}>
      {menuItems
        .filter((item) => item.visible)
        .map((item) => {
          // ================= HR GROUP =================
          if (item.children) {
            return (
              <div key={item.label} style={styles.section}>
                <div style={styles.sectionTitle}>{item.label}</div>

                {item.children.map((child) => {
                  const active = location.pathname === child.path;

                  return (
                    <Link
                      key={child.path}
                      to={child.path}
                      style={{
                        ...styles.link,
                        ...styles.subLink,
                        ...(active ? styles.active : {}),
                      }}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            );
          }

          // ================= NORMAL ITEM =================
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                ...(active ? styles.active : {}),
              }}
            >
              {item.label}
            </Link>
          );
        })}
    </aside>
  );
};

export default Sidebar;

/* ================= STYLES ================= */

const styles = {
  sidebar: {
    width: "220px",
    minHeight: "100vh",
    background: "#f9fafb",
    borderRight: "1px solid #e5e7eb",
    padding: "1rem 0.75rem",
  },
  link: {
    display: "block",
    padding: "0.55rem 0.75rem",
    marginBottom: "0.35rem",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#111827",
    fontSize: "0.95rem",
    transition: "background 0.15s ease",
  },
  subLink: {
    marginLeft: "0.75rem",
    fontSize: "0.9rem",
  },
  active: {
    background: "#e0e7ff",
    fontWeight: 600,
    color: "#1d4ed8",
  },
  section: {
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#6b7280",
    marginBottom: "0.35rem",
    paddingLeft: "0.5rem",
    textTransform: "uppercase",
  },
};
