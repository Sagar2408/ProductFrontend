import React, { useEffect, useState, useContext } from "react";
import apiService from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/stock.css";
import { FaEdit, FaPlus } from "react-icons/fa";

const Stock = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const [updatedData, setUpdatedData] = useState({
    item_code: "",
    item_name: "",
    item_quantity: "",
    item_rate: "",
  });

  const [newProduct, setNewProduct] = useState({
    item_code: "",
    item_name: "",
    item_quantity: "",
    item_rate: "",
  });

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiService.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // ✅ Handle Edit Click
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedData({
      item_code: product.item_code,
      item_name: product.item_name,
      item_quantity: product.item_quantity,
      item_rate: product.item_rate,
    });
  };

  // ✅ Handle Input Change
  const handleChange = (e, type = "edit") => {
    const { name, value } = e.target;
    if (type === "edit")
      setUpdatedData({ ...updatedData, [name]: value });
    else
      setNewProduct({ ...newProduct, [name]: value });
  };

  // ✅ Save Updated Product
  const handleSave = async () => {
    try {
      await apiService.put(`/products/${editingProduct.item_id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI instantly
      setProducts((prev) =>
        prev.map((item) =>
          item.item_id === editingProduct.item_id
            ? { ...item, ...updatedData }
            : item
        )
      );

      setEditingProduct(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product");
    }
  };

  // ✅ Add New Product
  const handleAddProduct = async () => {
    const { item_code, item_name, item_quantity, item_rate } = newProduct;
    if (!item_code || !item_name || !item_quantity || !item_rate) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await apiService.post("/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Add new product to UI instantly
      setProducts((prev) => [res.data.newProduct || res.data, ...prev]);

      setAddingProduct(false);
      setNewProduct({
        item_code: "",
        item_name: "",
        item_quantity: "",
        item_rate: "",
      });
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add product");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="main-content">
      <div className="stock-container">
        <div className="stock-header">
          <h1 className="stock-title">📦 Stock Inventory</h1>
          <button className="add-btn" onClick={() => setAddingProduct(true)}>
            <FaPlus /> Add Product
          </button>
        </div>

        {/* ✅ Product Table */}
        <div className="table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Quantity (kg)</th>
                <th>Rate (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.item_id}>
                    <td>{product.item_code}</td>
                    <td>{product.item_name}</td>
                    <td>{product.item_quantity}</td>
                    <td>{product.item_rate}</td>
                    <td>
                      <FaEdit
                        className="edit-icon"
                        onClick={() => handleEditClick(product)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-products">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Edit Modal */}
        {editingProduct && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Product</h3>
              <input
                type="text"
                name="item_code"
                value={updatedData.item_code}
                onChange={(e) => handleChange(e, "edit")}
                placeholder="Item Code"
              />
              <input
                type="text"
                name="item_name"
                value={updatedData.item_name}
                onChange={(e) => handleChange(e, "edit")}
                placeholder="Item Name"
              />
              <input
                type="number"
                name="item_quantity"
                value={updatedData.item_quantity}
                onChange={(e) => handleChange(e, "edit")}
                placeholder="Quantity"
              />
              <input
                type="number"
                name="item_rate"
                value={updatedData.item_rate}
                onChange={(e) => handleChange(e, "edit")}
                placeholder="Rate"
              />

              <div className="modal-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Add Product Modal */}
        {addingProduct && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Product</h3>
              <input
                type="text"
                name="item_code"
                value={newProduct.item_code}
                onChange={(e) => handleChange(e, "add")}
                placeholder="Item Code"
              />
              <input
                type="text"
                name="item_name"
                value={newProduct.item_name}
                onChange={(e) => handleChange(e, "add")}
                placeholder="Item Name"
              />
              <input
                type="number"
                name="item_quantity"
                value={newProduct.item_quantity}
                onChange={(e) => handleChange(e, "add")}
                placeholder="Quantity (kg)"
              />
              <input
                type="number"
                name="item_rate"
                value={newProduct.item_rate}
                onChange={(e) => handleChange(e, "add")}
                placeholder="Rate (₹)"
              />

              <div className="modal-buttons">
                <button className="save-btn" onClick={handleAddProduct}>
                  Add Product
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setAddingProduct(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
