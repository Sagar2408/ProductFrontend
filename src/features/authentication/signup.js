import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import "../../styles/signup.css";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import womanIllustration from "../../assets/namaste.jpeg";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiService.post("/auth/register", formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert("Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Side - Illustration */}
      <div className="signup-left">
        <div className="illustration-wrapper">
          <img 
            src={womanIllustration} 
            alt="Woman Illustration" 
            className="woman-illustration"
          />
          <h1 className="company-name">SHREE BALAJI TRADERS</h1>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="signup-right">
        <div className="signup-card">
          <h2 className="signup-title">Create Account</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaUserTag className="input-icon" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="signup-footer">
            <span 
              className="footer-link" 
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;