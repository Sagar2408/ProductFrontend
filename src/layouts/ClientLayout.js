import React from "react";
import { useLocation } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";
import ClientNavbar from "./ClientNavbar";
import ClientDashboard from "../features/clients/ClientDashboard";

const ClientLayout = () => {
  const location = useLocation();

  // Check route path
  const isDashboard =
    location.pathname === "/client" || location.pathname === "/client/dashboard";

  return (
    <div className="client-container" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <ClientSidebar />

      {/* Main Section */}
      <div className="client-main" style={{ flex: 1 }}>
        {/* Navbar */}
        <ClientNavbar />

        {/* Page Content */}
        <div className="client-content" style={{ padding: "20px" }}>
          {isDashboard ? (
            <ClientDashboard />
          ) : (
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              Page Not Found
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
