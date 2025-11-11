import React, { useEffect, useState, useContext } from "react";
import apiService from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/stock.css"; 
import dayjs from "dayjs";

const BillHistory = () => {
  const { token } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ✅ Fetch Bill History
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await apiService.get("/bills/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBills(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bill history:", err);
        setError("Failed to fetch bill history");
        setLoading(false);
      }
    };
    fetchBills();
  }, [token]);

  // ✅ Filter bills by client or product
  const filteredBills = bills.filter(
    (bill) =>
      bill.client_name.toLowerCase().includes(search.toLowerCase()) ||
      bill.item_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="loading">Loading bill history...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="main-content">
      <div className="stock-container">
        <h1 className="stock-title">📜 Bill History</h1>

        {/* 🔍 Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by client or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* 🧾 Bill Table */}
        <div className="table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Client Name</th>
                <th>Client Email</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Rate (₹/kg)</th>
                <th>Quantity (kg)</th>
                <th>CGST%</th>
                <th>SGST%</th>
                <th>Total (₹)</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill, index) => (
                  <tr key={bill.bill_id}>
                    <td>{index + 1}</td>
                    <td>{bill.client_name}</td>
                    <td>{bill.client_email}</td>
                    <td>{bill.client_phone || "-"}</td>
                    <td>{bill.item_name}</td>
                    <td>{bill.item_rate}</td>
                    <td>{bill.quantity}</td>
                    <td>{bill.cgst}</td>
                    <td>{bill.sgst}</td>
                    <td>₹{bill.total_amount}</td>
                    <td>{bill.payment_method}</td>
                    <td>{dayjs(bill.createdAt).format("DD-MM-YYYY")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="no-products">
                    No bills found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillHistory;
