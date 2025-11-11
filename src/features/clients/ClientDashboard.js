import React, { useEffect, useState, useContext } from "react";
import apiService from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/clientDashboard.css";

const ClientDashboard = () => {
  const { token } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await apiService.get("/bills/my-bills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBills(res.data.bills || []);
        setClientName(res.data.client || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching client bills:", err);
        setError("Failed to load bill history");
        setLoading(false);
      }
    };
    fetchBills();
  }, [token]);

  return (
    <div className="client-dashboard">
      <h1 className="client-title">
        🧾 Welcome, {clientName || "Client"}
      </h1>

      {loading ? (
        <p className="loading">Loading your bill history...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : bills.length === 0 ? (
        <p className="no-bills">No purchase history yet.</p>
      ) : (
        <div className="bill-history-container">
          <h2>Your Purchase History</h2>
          <table className="bill-history-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Item Name</th>
                <th>Rate (₹)</th>
                <th>Quantity (kg)</th>
                <th>CGST (%)</th>
                <th>SGST (%)</th>
                <th>Total (₹)</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.bill_id}>
                  <td>{bill.bill_id}</td>
                  <td>{bill.item_name}</td>
                  <td>{bill.item_rate}</td>
                  <td>{bill.quantity}</td>
                  <td>{bill.cgst}</td>
                  <td>{bill.sgst}</td>
                  <td>{bill.total_amount}</td>
                  <td>{bill.payment_method}</td>
                  <td>
                    {new Date(bill.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
