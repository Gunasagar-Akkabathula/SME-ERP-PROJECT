import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedDashboard = () => {
  const {
    isAdmin,
    isSales,
    isInventory,
    isAccountant,
    isHr,
    isPortalUserOnly,
    loading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    let targetPath = null;

    // ERP priority-based landing
    if (isAdmin) targetPath = "/dashboard";
    else if (isSales) targetPath = "/sales";
    else if (isInventory) targetPath = "/inventory";
    else if (isAccountant) targetPath = "/accounting";
    else if (isHr) targetPath = "/hr";
    else if (isPortalUserOnly) targetPath = "/user";
    else targetPath = "/login";

    // 🚨 CRITICAL GUARD (PREVENT LOOP)
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [
    isAdmin,
    isSales,
    isInventory,
    isAccountant,
    isHr,
    isPortalUserOnly,
    loading,
    navigate,
    location.pathname,
  ]);

  return null; // no UI
};

export default RoleBasedDashboard;
