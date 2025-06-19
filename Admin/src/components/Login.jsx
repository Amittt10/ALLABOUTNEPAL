import React, { useState } from 'react';
import axiosInstance, { setAuthToken } from '../api/axiosConfig';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/login', { email, password });
      const token = res.data.token;
      setAuthToken(token);
      localStorage.setItem('adminToken', token);
      onLogin();
    } catch (err) {
      setError('Login failed: Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
        />
        <label>Password</label>
        <input
          type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default Login;
