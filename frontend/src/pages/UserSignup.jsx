// src/pages/UserSignup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import "./Signup.css";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!email || !password) {
      setStatus("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("✅ Signup successful. You can now login.");
        setEmail("");
        setPassword("");
      } else {
        setStatus(`❌ Signup failed: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setStatus("❌ Network error during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container glass-effect">
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Join to explore Nepal's Cultural Heritage</p>

        {status && (
          <p
            className={`signup-status ${
              status.startsWith("✅") ? "status-success" : "status-error"
            }`}
          >
            {status}
          </p>
        )}

        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-input"
          />
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Sign Up"}
          </button>
        </form>

        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
