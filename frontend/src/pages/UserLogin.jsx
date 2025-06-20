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
      const loginRes = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      const token = loginRes.data.token;
      localStorage.setItem('token', token);

      const profileRes = await axios.get('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(profileRes.data, token);
      navigate('/');
    } catch (err) {
      console.log('Login error:', err.response?.data || err.message);
      const message = err.response?.data?.message || 'Login failed.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-left">
          <h2>Welcome!</h2>
          <p>Create your account.<br />For Free!</p>
          <a href="/register" className="signup-button">Sign Up</a>
        </div>

        <div className="login-right">
          <h3>Login</h3>

          <form onSubmit={handleLogin} className="login-form">
            <label>Username/Email address<span className="required">*</span></label>
            <input
              type="text"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password<span className="required">*</span></label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="forgot-link">
            <a href="/forgot">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
