import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotReset.css';


const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/reset-password', {
        token,
        email,
        newPassword
      });

      setSuccessMsg('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) return <p>Invalid or missing reset link.</p>;

  return (
    <div className="reset-wrapper">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        <button disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
      </form>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}
    </div>
  );
};

export default ResetPassword;
