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
      <div className="signup-wrapper">
        <div className="signup-left-panel">
          <h1>Welcome!</h1>
          <p>Create your account.<br />For Free!</p>
          <Link to="/login">
            <button className="signup-left-button">Login</button>
          </Link>
        </div>

        <div className="signup-right-panel">
          <h2>Sign Up</h2>

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
            <label>
              Email Address <span className="required">*</span>
              <input
                type="email"
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="signup-input"
              />
            </label>

            <label>
              Password <span className="required">*</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="signup-input"
              />
            </label>

            <button type="submit" className="signup-submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
