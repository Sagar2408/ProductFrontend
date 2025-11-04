import React, { useEffect, useState, useContext } from "react";
import apiService from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/stock.css";
import { FaEdit } from "react-icons/fa";

const Stock = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    item_code: "",
    item_name: "",
    item_quantity: "",
    item_rate: "",
  });

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiService.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Handle Edit Click
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedData({
      item_code: product.item_code,
      item_name: product.item_name,
      item_quantity: product.item_quantity,
      item_rate: product.item_rate,
    });
  };

  // Handle Input Change
  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // Save Updated Product
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

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="main-content">
      <div className="stock-container">
        <h1 className="stock-title">Stock Inventory</h1>

        <div className="table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Rate</th>
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

        {/* Edit Modal */}
        {editingProduct && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Product</h3>
              <input
                type="text"
                name="item_code"
                value={updatedData.item_code}
                onChange={handleChange}
                placeholder="Item Code"
              />
              <input
                type="text"
                name="item_name"
                value={updatedData.item_name}
                onChange={handleChange}
                placeholder="Item Name"
              />
              <input
                type="number"
                name="item_quantity"
                value={updatedData.item_quantity}
                onChange={handleChange}
                placeholder="Quantity"
              />
              <input
                type="number"
                name="item_rate"
                value={updatedData.item_rate}
                onChange={handleChange}
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
      </div>
    </div>
  );
};

export default Stock;