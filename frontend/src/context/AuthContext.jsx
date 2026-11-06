// frontend/src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  // 🧠 Keep user data in sync with localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // ✅ Login handler
  const login = (data) => {
    const { token, role, name, id } = data;
    if (!token) return;

    localStorage.setItem("token", token);
    setUser({ id, name, role });
    setIsAuthenticated(true);
  };

  // 🚪 Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // 🕒 Auto logout if token expires (optional but safe)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Decode token manually without external lib
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();
      if (expiry < now) {
        logout();
      }
    } catch (err) {
      console.error("Token decode error:", err);
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
