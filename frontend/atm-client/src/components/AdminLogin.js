import React, { useState } from 'react';

const AdminLogin = ({ onSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (username === 'admin' && password === '1234') {
      onSuccess();
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
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
        style={{
          padding: '1rem',
          background: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Login
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

