import React, { useEffect, useState } from "react";
import { getHrKpis } from "../../services/hrApi";
import StatCard from "../ui/StatCard";

const HrSummary = () => {
  const [kpis, setKpis] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getHrKpis()
      .then((res) => setKpis(res.data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>Failed to load HR KPIs</p>;
  }

  if (!kpis) {
    return <p>Loading HR data...</p>;
  }

  return (
    <>
      <StatCard title="Total Employees" value={kpis.total} />
      <StatCard title="Active Employees" value={kpis.active} />
      <StatCard title="On Leave" value={kpis.onLeave} />
      <StatCard title="Exited Employees" value={kpis.resigned + kpis.terminated} />
    </>
  );
};

export default HrSummary;
