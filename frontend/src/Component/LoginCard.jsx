// src/components/LoginCard.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "./LoginCard.css";

const LoginCard = ({ onSuccess }) => {
  const { login, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setStatus("❌ Please enter email and password.");
      return;
    }

    setLoading(true);
    const success = await login(form.email, form.password);
    setLoading(false);

    if (success) {
      setStatus("✅ Login successful!");
      if (onSuccess) {
        onSuccess(); // e.g., close modal
      } else {
        navigate("/"); // fallback redirect
      }
    } else {
      setStatus(authError || "❌ Invalid credentials.");
    }
  };

  return (
    <div className="login-card">
      <h2>Login for further access!</h2>

      {(status || authError) && (
        <p
          className={`login-status ${
            (status.startsWith("✅") || authError === null) ? "status-success" : "status-error"
          }`}
        >
          {status || authError}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
          autoComplete="username"
        />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            autoComplete="current-password"
            className="password-input"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Login"}
        </button>
      </form>

      <p className="new-user-text">
        New here? <Link to="/register" className="register-link">Create an account</Link>
      </p>
    </div>
  );
};

export default LoginCard;
