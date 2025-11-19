import React, { useState } from 'react';
import api from '../api.js';

const LoginForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ accountNumber: '', pin: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/accounts/login', {
        accountNumber: form.accountNumber,
        pin: form.pin
      });
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data ?? 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem', background: '#fff', padding: '1.5rem', borderRadius: 8 }}>
      <label>
        <span>Account Number</span>
        <input name="accountNumber" value={form.accountNumber} onChange={handleChange} required />
      </label>
      <label>
        <span>PIN</span>
        <input name="pin" type="password" value={form.pin} onChange={handleChange} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      {error && <small style={{ color: 'red' }}>{error}</small>}
    </form>
  );
};

export default LoginForm;

