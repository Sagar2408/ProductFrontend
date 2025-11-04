// src/layouts/AdminNavbar.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/adminNavbar.css";

const AdminNavbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <span className="icon-text">SBT</span>
          </div>
          <div className="brand-info">
            <h3 className="welcome-text">Welcome, Admin</h3>
            <p className="subtitle">Shree Balaji Traders</p>
          </div>
        </div>
        
        <div className="navbar-actions">
          <button className="logout-btn" onClick={logout}>
            <svg 
              className="logout-icon" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;