import React, { useEffect, useState, useContext } from "react";
import apiService from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/bill.css";

const Bill = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [billData, setBillData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    item_id: "",
    item_name: "",
    item_rate: "",
    quantity: "",
    cgst: 0,
    sgst: 0,
    total_amount: "",
    payment_method: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiService.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [token]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData((prev) => ({ ...prev, [name]: value }));

    // 🔍 Trigger search for client name typing
    if (name === "client_name") {
      setShowSuggestions(true);
      if (value.trim().length >= 1) {
        fetchClientSuggestions(value);
      } else {
        setClientSuggestions([]);
      }
    }
  };

  // ✅ Fetch client suggestions from backend
  const fetchClientSuggestions = async (query) => {
    try {
      setLoadingClients(true);
      const res = await apiService.get(`/clients/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientSuggestions(res.data || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setClientSuggestions([]);
    } finally {
      setLoadingClients(false);
    }
  };

  // ✅ When client selected from dropdown
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setShowSuggestions(false);
    setBillData((prev) => ({
      ...prev,
      client_name: client.name,
      client_email: client.email || "",
      client_phone: client.contactNumber || "",
    }));
  };

  // ✅ When product selected
  const handleProductSelect = (e) => {
    const selectedId = e.target.value;
    const selectedProduct = products.find(
      (prod) => prod.item_id === parseInt(selectedId)
    );
    if (selectedProduct) {
      setBillData((prev) => ({
        ...prev,
        item_id: selectedProduct.item_id,
        item_name: selectedProduct.item_name,
        item_rate: selectedProduct.item_rate,
      }));
    }
  };

  // ✅ Calculate Total Amount
  useEffect(() => {
    const qty = parseFloat(billData.quantity) || 0;
    const rate = parseFloat(billData.item_rate) || 0;
    const cgst = parseFloat(billData.cgst) || 0;
    const sgst = parseFloat(billData.sgst) || 0;

    const baseAmount = qty * rate;
    const total = baseAmount + (baseAmount * (cgst + sgst)) / 100;

    setBillData((prev) => ({
      ...prev,
      total_amount: total.toFixed(2),
    }));
  }, [billData.quantity, billData.item_rate, billData.cgst, billData.sgst]);

  // ✅ Submit Bill
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.post("/bill/add", billData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Bill generated successfully!");
      resetForm();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Bill creation failed:", err);
      setMessage("❌ Failed to generate bill");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setBillData({
      client_name: "",
      client_email: "",
      client_phone: "",
      item_id: "",
      item_name: "",
      item_rate: "",
      quantity: "",
      cgst: 0,
      sgst: 0,
      total_amount: "",
      payment_method: "",
    });
    setSelectedClient(null);
    setClientSuggestions([]);
  };

  return (
    <div className="main-content">
      <div className="stock-container">
        <h1 className="stock-title">🧾 Create Bill</h1>

        {message && <p className="message">{message}</p>}

        <form className="bill-form" onSubmit={handleSubmit}>
          {/* Client Name Field */}
          <div className="form-group">
            <label>Client Name *</label>
            <input
              type="text"
              name="client_name"
              value={billData.client_name}
              onChange={handleChange}
              placeholder="Type client name..."
              onFocus={() => setShowSuggestions(true)}
              autoComplete="off"
              required
            />

            {/* Suggestions */}
            {showSuggestions && (
              <div className="suggestions-container">
                {loadingClients && (
                  <p className="loading-text">Searching...</p>
                )}

                {!loadingClients &&
                  clientSuggestions.length > 0 && (
                    <ul className="suggestion-list">
                      {clientSuggestions.map((client) => (
                        <li
                          key={client.id}
                          onClick={() => handleClientSelect(client)}
                          className="suggestion-item"
                        >
                          {client.name} —{" "}
                          {client.contactNumber || "No phone"}
                        </li>
                      ))}
                    </ul>
                  )}

                {!loadingClients &&
                  billData.client_name &&
                  clientSuggestions.length === 0 && (
                    <p className="no-results">No client found</p>
                  )}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Client Email</label>
            <input
              type="email"
              name="client_email"
              value={billData.client_email}
              onChange={handleChange}
              placeholder="Enter or auto-filled"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Client Phone</label>
            <input
              type="text"
              name="client_phone"
              value={billData.client_phone}
              onChange={handleChange}
              placeholder="Enter or auto-filled"
            />
          </div>

          {/* Product */}
          <div className="form-group">
            <label>Select Product *</label>
            <select
              name="item_id"
              value={billData.item_id}
              onChange={handleProductSelect}
              required
            >
              <option value="">Choose a product</option>
              {products.map((p) => (
                <option key={p.item_id} value={p.item_id}>
                  {p.item_name}
                </option>
              ))}
            </select>
          </div>

          {/* Rate */}
          <div className="form-group">
            <label>Rate (per kg)</label>
            <input
              type="text"
              name="item_rate"
              value={billData.item_rate}
              placeholder="Auto-filled"
              readOnly
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity (kg)</label>
            <input
              type="number"
              name="quantity"
              value={billData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity in kg"
              step="0.01"
              required
            />
          </div>

          {/* CGST */}
          <div className="form-group">
            <label>CGST (%)</label>
            <input
              type="number"
              name="cgst"
              value={billData.cgst}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          {/* SGST */}
          <div className="form-group">
            <label>SGST (%)</label>
            <input
              type="number"
              name="sgst"
              value={billData.sgst}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          {/* Total */}
          <div className="form-group">
            <label>Total Amount (₹)</label>
            <input
              type="text"
              name="total_amount"
              value={billData.total_amount}
              readOnly
              placeholder="Auto-calculated"
            />
          </div>

          {/* Payment */}
          <div className="form-group">
            <label>Payment Method *</label>
            <select
              name="payment_method"
              value={billData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="save-btn">
            Generate Bill
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bill;
