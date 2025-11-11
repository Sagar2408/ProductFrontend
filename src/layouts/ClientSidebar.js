import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/adminSidebar.css"; // ✅ create similar to adminSidebar.css

const ClientSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/client/dashboard",
      name: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
    },
    {
      path: "/client/bill-history",
      name: "Bill History",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 3v18h18" />
          <path d="M8 13h8M8 9h8M8 17h8M16 21V3" />
        </svg>
      ),
    },
    {
      path: "/client/request-product",
      name: "Request Product",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="client-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">SBT</div>
          <div className="logo-text">
            <h2 className="sidebar-title">Shree Balaji Traders</h2>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-links">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              <Link to={item.path}>
                <span className="link-icon">{item.icon}</span>
                <span className="link-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-decoration"></div>
      </div>
    </aside>
  );
};

export default ClientSidebar;
