import React, { useState } from 'react';
import axios from 'axios';
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
      <h2>Forgot Password</h2>
      <form onSubmit={handleRequestReset}>
        <input
          type="email"
          placeholder="Your registered email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </div>
  );
};

export default ForgotPassword;
