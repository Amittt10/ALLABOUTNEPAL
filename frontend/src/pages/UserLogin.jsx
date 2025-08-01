import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { showCustomToast } from "./utils/showCustomToast"; // Custom toast utility
import "./Login.css";

const UserLogin = ({ onSuccess }) => {
  const { login, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path and any saved review form data from location.state
  const redirectFromState = location.state?.from?.pathname || "/";
  const savedForm = location.state?.reviewForm || null;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("verified") === "success") {
      showCustomToast(
        "✅ VERIFIED_SUCCESS",
        "Your email has been successfully verified!",
        "Go to your profile",
        "/profile"
      );
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);

    setLoading(false);
    if (success) {
      showCustomToast("✅ LOGIN_SUCCESS", "You have logged in successfully!");
      // Redirect back with saved form data so ReviewSection can restore it
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectFromState, {
          replace: true,
          state: { reviewForm: savedForm },
        });
      }
    } else {
      showCustomToast(
        "LOGIN_FAILED",
        "Invalid email or password. Please try again.",
        "Forgot password?",
        "/forgot"
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-right">
          <h3>Login Form</h3>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Username/Email address<span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />

            <label>
              Password<span className="required">*</span>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="forgot-link">
              <Link to="/forgot">Forgot password?</Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <div className="signup-text">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
