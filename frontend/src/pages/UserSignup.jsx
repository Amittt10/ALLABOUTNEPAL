import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

const UserSignup = () => {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { fullname, username, email, password, confirmPassword } = form;
    if (!fullname || !username || !email || !password || !confirmPassword) {
      toast.error("❌ Please fill in all fields.", { theme: "dark", autoClose: 4000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match.", { theme: "dark", autoClose: 4000 });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Signup successful. Please check your email to verify your account.", {
          theme: "dark",
          autoClose: 4000,
        });

        setForm({
          fullname: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // ⏳ Wait and redirect to login page
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      } else {
        toast.error(`❌ Signup failed: ${data.message || data.error}`, {
          theme: "dark",
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.error("❌ Network error during signup.", { theme: "dark", autoClose: 4000 });
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

          <form onSubmit={handleSignup} className="signup-form">
            <label>Full Name<span className="required">*</span>
              <input className="signup-input" name="fullname" type="text" value={form.fullname} onChange={handleChange} required />
            </label>

            <label>Username<span className="required">*</span>
              <input name="username" type="text" value={form.username} onChange={handleChange} required />
            </label>

            <label>Email<span className="required">*</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>

            <label>Password<span className="required">*</span>
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </label>

            <label>Confirm Password<span className="required">*</span>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
            </label>

            <button type="submit" className="signup-submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
            </button>

            <div className="signup-login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
