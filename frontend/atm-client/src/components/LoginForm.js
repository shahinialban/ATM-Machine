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
    <form className="responsive-form" onSubmit={handleSubmit} style={{ 
      display: 'grid', 
      gap: '1rem', 
      background: '#fff', 
      padding: '2rem', 
      borderRadius: 16 
    }}>
      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#666', fontWeight: 500 }}>Account Number</span>
        <input 
          name="accountNumber" 
          value={form.accountNumber} 
          onChange={handleChange} 
          required
          style={{
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: 12,
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </label>
      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#666', fontWeight: 500 }}>PIN</span>
        <input 
          name="pin" 
          type="password" 
          value={form.pin} 
          onChange={handleChange} 
          required
          style={{
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: 12,
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </label>
      <button 
        type="submit" 
        disabled={loading}
        style={{
          padding: '1rem',
          background: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontSize: '1rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      {error && <div style={{ 
        color: '#d32f2f', 
        padding: '0.75rem', 
        background: '#ffebee', 
        borderRadius: 8,
        fontSize: '0.875rem'
      }}>{error}</div>}
    </form>
  );
};

export default LoginForm;

