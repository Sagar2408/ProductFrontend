import React from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminDashboard from "../features/admin/Stock";
import AdminClient from "../features/admin/AdminClient";
import Bill from "../features/admin/Bill";
import BillHistory from "../features/admin/BillHistory"

const AdminLayout = () => {
  const location = useLocation();

  const isDashboard =
    location.pathname === "/admin" || location.pathname === "/admin/dashboard";

  return (
    <div
      className="admin-container"
      style={{ display: "flex", minHeight: "100vh" }}
    >
      <AdminSidebar />
      <div className="admin-main" style={{ flex: 1 }}>
        <AdminNavbar />
        <div className="admin-content" style={{ padding: "20px" }}>
          {isDashboard ? (
            <AdminDashboard />
          ) : location.pathname === "/admin/bills" ? (
            <Bill />
          ) : location.pathname === "/admin/clients" ? (
            <AdminClient />
          ) : location.pathname === "/admin/bill-history" ? ( // ✅ new route
            <BillHistory />
          ) : (
            <h2>Page Not Found</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
