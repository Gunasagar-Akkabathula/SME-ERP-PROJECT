// src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() =>
    localStorage.getItem("authToken")
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ==============================
  // CLEAR AUTH
  // ==============================
  const clearAuth = useCallback(() => {
    setTokenState(null);
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem("authToken");
  }, []);

  // ==============================
  // SET TOKEN
  // ==============================
  const setToken = useCallback(
    (newToken) => {
      setTokenState(newToken);
      if (newToken) {
        localStorage.setItem("authToken", newToken);
        setAuthToken(newToken);
      } else {
        clearAuth();
      }
    },
    [clearAuth]
  );

  // ==============================
  // LOAD CURRENT USER
  // ==============================
  const loadCurrentUser = useCallback(
    async (providedToken) => {
      const jwt = providedToken || token;
      if (!jwt) return null;

      setAuthToken(jwt);

      try {
        const res = await api.get("/auth/me");
        const data = res.data;

        // 🔑 NORMALIZE ROLES (REMOVE ROLE_ PREFIX)
        const normalizedRoles = (data.authorities || []).map((a) =>
          a.authority.replace("ROLE_", "")
        );

        setCurrentUser({
          username: data.username,
          roles: normalizedRoles,
        });

        return data;
      } catch (error) {
        console.error("Failed to load current user:", error);
        clearAuth();
        navigate("/login", { replace: true });
        return null;
      }
    },
    [token, clearAuth, navigate]
  );

  // ==============================
  // LOGIN
  // ==============================
  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const jwt = res.data.token;

      setToken(jwt);
      await loadCurrentUser(jwt);

      return jwt;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  // ==============================
  // REGISTER
  // ==============================
  const register = async ({ username, email, password, role }) => {
    return api.post("/auth/register", {
      username,
      email,
      password,
      role,
    });
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  // ==============================
  // INIT LOAD
  // ==============================
  useEffect(() => {
    if (token) {
      loadCurrentUser(token).finally(() => setLoading(false));
    } else {
      clearAuth();
      setLoading(false);
    }
  }, [token, loadCurrentUser, clearAuth]);

  // ==============================
  // ROLE HELPERS (ERP UI LOGIC)
  // ==============================
  const roles = currentUser?.roles || [];

  const roleFlags = useMemo(() => {
    const hasRole = (r) => roles.includes(r);

    return {
      isAdmin: hasRole("ADMIN"),
      isSales: hasRole("SALES"),
      isInventory: hasRole("INVENTORY"),
      isAccountant: hasRole("ACCOUNTANT"),
      isHr: hasRole("HR"),

      // Portal user = ONLY USER
      isPortalUserOnly:
        roles.length === 1 && roles.includes("USER"),
    };
  }, [roles]);

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        roles,
        loading,
        login,
        register,
        loadCurrentUser,
        logout,
        ...roleFlags,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
