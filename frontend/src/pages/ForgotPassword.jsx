import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ForgotReset.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:3000/api/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-box">
        <h2>Forgot Password</h2>

        <form onSubmit={handleRequestReset}>
          <label>
            Registered Email<span className="required">*</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <div className="back-to-login">
          Remembered? <Link to="/login">Go to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
