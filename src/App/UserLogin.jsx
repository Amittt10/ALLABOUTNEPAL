import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // React Router navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Login successful');
        navigate('/App'); // Redirect only after successful login
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: server error');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="signup-link">
          Don't have an account? <Link to="/">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
