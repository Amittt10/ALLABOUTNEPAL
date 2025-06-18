import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { AuthContext } from '../context/AuthContext';

const UserLogin = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg('');

  try {
    // Step 1: Login & get token
    const loginRes = await axios.post('http://localhost:3000/api/login', {
      email,
      password,
    });

    const token = loginRes.data.token;
    localStorage.setItem('token', token); // optional, login() will also do this

    // Step 2: Fetch full user info with token
    const profileRes = await axios.get('http://localhost:3000/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Step 3: Save user & token to context
    login(profileRes.data, token);
    navigate('/');
  } catch (err) {
  console.log('Login error:', err.response?.data || err.message); // ✅ Add this line
  const message = err.response?.data?.message || 'Login failed.';
  setErrorMsg(message);
}
finally {
    setLoading(false);
  }
};


  return (
    <div className="login-page">
      <div className="login-container glass-effect">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>

        <form onSubmit={handleLogin} className="login-form">
          {errorMsg && <div className="error-message">{errorMsg}</div>}

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="signup-link">
          Don’t have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
