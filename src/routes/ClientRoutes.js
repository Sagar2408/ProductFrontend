// src/routes/ClientRoutes.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ClientLayout from "../layouts/ClientLayout";

const ClientRoutes = () => {
  const { user } = useContext(AuthContext);

  // ❌ If user not logged in or not a client → redirect
  if (!user || user.role !== "client") {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow all client pages under /client/*
  return (
    <Routes>
      <Route path="/*" element={<ClientLayout />} />
    </Routes>
  );
};

export default ClientRoutes;
