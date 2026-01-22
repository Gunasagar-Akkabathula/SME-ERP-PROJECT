import React from "react";

const colors = {
  DRAFT: "#9ca3af",
  ISSUED: "#2563eb",
  PAID: "#16a34a",
  CONFIRMED: "#059669",
  ACTIVE: "#16a34a",
  INACTIVE: "#dc2626",
};

const StatusBadge = ({ status }) => {
  const bg = colors[status] || "#6b7280";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        color: "white",
        backgroundColor: bg,
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
