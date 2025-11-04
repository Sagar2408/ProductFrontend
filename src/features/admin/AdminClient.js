import React, { useEffect, useState, useContext } from "react";
import apiService from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/adminclient.css";
import { FaEdit } from "react-icons/fa";

const AdminClient = () => {
  const { token } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    companyName: "",
    companyAddress: "",
    contactNumber: "",
  });

  // Fetch all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await apiService.get("/auth/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch clients");
        setLoading(false);
      }
    };
    fetchClients();
  }, [token]);

  // Handle Edit Click
  const handleEditClick = (client) => {
    setEditingClient(client);
    setUpdatedData({
      companyName: client.companyName || "",
      companyAddress: client.companyAddress || "",
      contactNumber: client.contactNumber || "",
    });
  };

  // Handle Input Change
  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // Save Updated Client
  const handleSave = async () => {
    try {
      await apiService.put(`/auth/client/${editingClient.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI instantly
      setClients((prev) =>
        prev.map((client) =>
          client.id === editingClient.id ? { ...client, ...updatedData } : client
        )
      );

      setEditingClient(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update client");
    }
  };

  if (loading) return <p className="loading">Loading clients...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="main-content">
      <div className="clients-container">
        <h1 className="clients-title">Clients</h1>

        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Company Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.email}</td>
                    <td>{client.companyName || "-"}</td>
                    <td>{client.companyAddress || "-"}</td>
                    <td>{client.contactNumber || "-"}</td>
                    <td>
                      <FaEdit
                        className="edit-icon"
                        onClick={() => handleEditClick(client)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-clients">
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingClient && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Client</h3>
              <input
                type="text"
                name="companyName"
                value={updatedData.companyName}
                onChange={handleChange}
                placeholder="Company Name"
              />
              <input
                type="text"
                name="companyAddress"
                value={updatedData.companyAddress}
                onChange={handleChange}
                placeholder="Company Address"
              />
              <input
                type="text"
                name="contactNumber"
                value={updatedData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
              />

              <div className="modal-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingClient(null)}
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

export default AdminClient;