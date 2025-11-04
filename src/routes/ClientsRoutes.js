// src/routes/ClientsRoutes.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ClientsRoutes = () => {
  const { user } = useContext(AuthContext);

  // Agar login nahi hai ya role client nahi hai → redirect to login
  if (!user || user.role !== "client") {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<h2>Welcome to Client Dashboard</h2>} />
    </Routes>
  );
};

export default ClientsRoutes;
