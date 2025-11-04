import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import womanIllustration from "../../assets/namaste.jpeg"; // Update path as needed

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiService.post("/auth/login", formData);

      if (res.data.token && res.data.role) {
        login(res.data.token, res.data.role);
      } else {
        login(res.data.token, "admin");
      }

      alert("Login successful!");
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Illustration */}
      <div className="login-left">
        <div className="illustration-wrapper">
          <img 
            src={womanIllustration} 
            alt="Woman Illustration" 
            className="woman-illustration"
          />
          <h1 className="company-name">SHREE BALAJI TRADERS</h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Login</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-footer">
            <span 
              className="footer-link" 
              onClick={() => navigate("/signup")}
            >
              Create an account
            </span>
            <span className="footer-link">Forgot your password</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;