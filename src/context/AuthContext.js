// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    // ✅ Check token and role from localStorage when app reloads
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setUser({ token, role });
    }
    setLoading(false); // ✅ Finish loading after checking
  }, []);

  const login = (token, role) => {
    // ✅ Save user info to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  const logout = () => {
    // ✅ Clear user info on logout
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  // ✅ Prevent render until token check finishes
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
