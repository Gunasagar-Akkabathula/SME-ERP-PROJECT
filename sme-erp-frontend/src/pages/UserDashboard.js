// src/pages/UserDashboard.js
import React from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>My Dashboard</h2>

      <p style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
        Welcome to your account portal. Here you can track your orders,
        invoices, and manage your profile.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* My Orders */}
        <div style={cardStyle}>
          <h4>My Orders</h4>
          <p style={descStyle}>
            View and track your sales orders and their status.
          </p>
          <Link to="/user/orders">View Orders →</Link>
        </div>

        {/* Invoices */}
        <div style={cardStyle}>
          <h4>Invoices</h4>
          <p style={descStyle}>
            Check invoices generated for your orders.
          </p>
          <Link to="/user/invoices">View Invoices →</Link>
        </div>

        {/* Payments */}
        <div style={cardStyle}>
          <h4>Payments</h4>
          <p style={descStyle}>
            Review payment history and pending payments.
          </p>
          <Link to="/user/payments">View Payments →</Link>
        </div>

        {/* Profile */}
        <div style={cardStyle}>
          <h4>My Profile</h4>
          <p style={descStyle}>
            Update your personal details and credentials.
          </p>
          <Link to="/profile">Go to Profile →</Link>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#ffffff",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const descStyle = {
  fontSize: "0.9rem",
  color: "#6b7280",
  marginBottom: "0.75rem",
};

export default UserDashboard;
