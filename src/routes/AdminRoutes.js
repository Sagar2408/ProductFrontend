// src/routes/AdminRoutes.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminLayout from "../layouts/AdminLayout";

const AdminRoutes = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* /admin/* ke andar ye sab accessible hoga */}
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
};

export default AdminRoutes;
