// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { axiosInstance, setAuthToken } from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/login', { email, password });
      login(res.data.token);
      navigate('/admin/heritage');
    } catch {
      setError('Invalid credentials');
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
        <button type="submit" style={{ marginTop: 10 }}>Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
