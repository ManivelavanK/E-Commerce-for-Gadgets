import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import "./Auth.css";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "", name: "", role: "user", resetToken: "", newPassword: "" });
  const [resetStep, setResetStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.pathname === "/register") {
      setMode("register");
    } else {
      setMode("login");
    }
  }, [location.pathname]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    const nameRegex = /^[a-zA-Z\s]{2,}$/;

    if (mode === "register" && !nameRegex.test(formData.name)) {
      alert("Name must contain only letters and be at least 2 characters");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (mode !== "forgot" && !passwordRegex.test(formData.password)) {
      alert("Password must be at least 8 characters with letters and numbers");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (mode === "register") {
        const data = await authAPI.register(formData);
        
        if (data && (data.token || data.success)) {
          alert("Registration successful! Please login with your credentials.");
          setMode("login");
          setFormData({ email: formData.email, password: "", name: "", role: "user" });
          navigate("/login");
        } else {
          alert(data?.message || "Registration failed. Please try again.");
        }
      } else if (mode === "login") {
        const data = await authAPI.login({ 
          email: formData.email, 
          password: formData.password, 
          role: formData.role 
        });
        
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          login(data);
          window.scrollTo(0, 0);
          navigate(data.user?.role === "admin" || data.role === "admin" ? "/admin" : "/home");
          setFormData({ email: "", password: "", name: "", role: "user" });
        } else {
          alert(data?.message || "Login failed. Please check your credentials.");
        }
      } else if (mode === "forgot") {
        if (resetStep === 1) {
          const data = await authAPI.forgotPassword(formData.email);
          alert(`Reset token: ${data.resetToken}\nCopy this token for the next step.`);
          setResetStep(2);
        } else {
          await authAPI.resetPassword(formData.resetToken, formData.newPassword);
          alert("Password reset successful! Please login with your new password.");
          setMode("login");
          setResetStep(1);
          setFormData({ email: "", password: "", name: "", role: "user", resetToken: "", newPassword: "" });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert("Network error. Please check if the server is running.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src="https://imgs.search.brave.com/2M1Jiq1jnIQlHRhqWYceaF7DBH13QTwqcF8OFYCmMrI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzUv/NzIxLzI3Mi9zbWFs/bC90b3Atdmlldy1v/ZmdyYXBoZXItcy12/aWRlb2dyYXBoZXIt/cy1vci12aWRlby1i/bG9nZ2VyLXMtd29y/a3BsYWNlLWRpZ2l0/YWwtZ2FkZ2V0cy1s/eWluZy1vbi1ibHVl/LXRhYmxlLWZsYXQt/bGF5LXBob3RvLmpw/Zw" alt="Workspace" />
        <div className="shop-name-overlay">MANI'S GADGETS</div>
      </div>
      
      <div className="auth-form-wrapper">
        <div className="auth-form">
          <h2>{mode === "login" ? "Welcome Back" : mode === "register" ? "Create Account" : "Reset Password"}</h2>
          
          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            {mode === "login" && (
              <div className="role-selector">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">👤 User Login</option>
                  <option value="admin">🔐 Admin Login</option>
                </select>
              </div>
            )}
            
            {mode === "forgot" && resetStep === 2 && (
              <>
                <input
                  type="text"
                  name="resetToken"
                  placeholder="Reset Token"
                  value={formData.resetToken}
                  onChange={handleChange}
                  required
                />
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </>
            )}
            
            {mode !== "forgot" && (
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            )}
            
            <button type="submit" className="auth-btn">
              {mode === "login" ? "Login" : mode === "register" ? "Register" : resetStep === 1 ? "Send Reset Token" : "Reset Password"}
            </button>
          </form>
          
          {mode === "login" && (
            <>
              <p className="auth-link" onClick={() => setMode("forgot")}>Forgot Password?</p>
              <p className="auth-switch">
                Don't have an account? <span onClick={() => setMode("register")}>Sign Up</span>
              </p>
            </>
          )}
          
          {mode === "register" && (
            <p className="auth-switch">
              Already have an account? <span onClick={() => setMode("login")}>Login</span>
            </p>
          )}
          
          {mode === "forgot" && (
            <p className="auth-switch">
              Remember password? <span onClick={() => setMode("login")}>Login</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
