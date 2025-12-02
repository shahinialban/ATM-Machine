import React, { useState } from 'react';
import api from '../api.js';

const AdminLogin = ({ onSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate credentials by attempting to access an admin endpoint
      await api.get('/admin/accounts', {
        headers: {
          'adminUsername': username,
          'adminPassword': password
        }
      });
      
      // If successful, pass credentials to parent component
      onSuccess({ username, password });
    } catch (err) {
      setError(err.response?.data ?? 'Invalid admin credentials');
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
      <h2 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: 600 }}>Admin Login</h2>
      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#666', fontWeight: 500 }}>Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <span style={{ fontSize: '0.875rem', color: '#666', fontWeight: 500 }}>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {loading ? 'Signing in...' : 'Login'}
      </button>
      {error && <div style={{ 
        color: '#d32f2f', 
        padding: '0.75rem', 
        background: '#ffebee', 
        borderRadius: 8,
        fontSize: '0.875rem'
      }}>{error}</div>}
      <button 
        type="button" 
        onClick={onBack}
        style={{
          padding: '0.75rem',
          background: '#f5f5f5',
          color: '#666',
          border: 'none',
          borderRadius: 12,
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        Back
      </button>
    </form>
  );
};

export default AdminLogin;

