import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    // Simple admin validation - you can enhance this
    if (formData.email === "admin@gadgets.com" && formData.password === "admin123") {
      const adminUser = { 
        email: formData.email, 
        name: "Admin", 
        role: "admin" 
      };
      login(adminUser);
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="logo-container">
            <div className="logo-icon">🔐</div>
            <h1>Admin Portal</h1>
            <p>GADGETORY MART</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <div className="input-container">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Admin Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="admin-login-btn">
            <span className="btn-icon">🚀</span>
            Access Admin Panel
          </button>
        </form>
        
        <div className="admin-login-footer">
          <div className="back-link" onClick={() => navigate("/")}>
            <span>←</span> Back to Main Site
          </div>
          <div className="divider"></div>
          <div className="demo-credentials">
            <div className="demo-header">Demo Credentials</div>
            <div className="demo-info">
              <span>📧 admin@gadgets.com</span>
              <span>🔑 admin123</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

export default AdminLogin;