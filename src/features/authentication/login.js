import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import womanIllustration from "../../assets/namaste.jpeg";

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

      // ✅ Extract user & token from backend response
      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // ✅ Save login info in context
      login(token, user.role);

      // ✅ Role-based redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "client") {
        navigate("/client/dashboard");
      } else {
        navigate("/login");
      }

      alert("Login successful!");
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
