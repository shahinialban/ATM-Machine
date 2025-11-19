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
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem', background: '#fff', padding: '1.5rem', borderRadius: 8 }}>
      <h2>Admin Login</h2>
      <label>
        <span>Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Login</button>
      {error && <small style={{ color: 'red' }}>{error}</small>}
      <button type="button" onClick={onBack} style={{ marginTop: '0.5rem' }}>
        Back
      </button>
    </form>
  );
};

export default AdminLogin;

