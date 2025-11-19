import React, { useEffect, useState } from 'react';
import api from '../api.js';

const AdminPage = ({ onBack }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const [newAccount, setNewAccount] = useState({
    accountNumber: '',
    pin: '',
    userName: '',
    balance: ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/accounts');
      setAccounts(response.data);
    } catch (err) {
      setError(err.response?.data ?? 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/admin/accounts', {
        accountNumber: newAccount.accountNumber,
        pin: newAccount.pin,
        userName: newAccount.userName || undefined,
        balance: parseFloat(newAccount.balance) || 0
      });
      setNewAccount({ accountNumber: '', pin: '', userName: '', balance: '' });
      setShowAddForm(false);
      loadAccounts();
    } catch (err) {
      setError(err.response?.data ?? 'Failed to create account');
    }
  };

  const handleDeleteAccount = async (accountNumber) => {
    if (!window.confirm(`Are you sure you want to delete account ${accountNumber}?`)) {
      return;
    }
    setError(null);
    try {
      await api.delete(`/admin/accounts/${accountNumber}`);
      loadAccounts();
      if (selectedAccount === accountNumber) {
        setSelectedAccount(null);
        setRecentTransactions([]);
      }
    } catch (err) {
      setError(err.response?.data ?? 'Failed to delete account');
    }
  };

  const handleViewRecent = async (accountNumber) => {
    setError(null);
    try {
      const response = await api.get(`/admin/accounts/${accountNumber}/recent`);
      setRecentTransactions(response.data);
      setSelectedAccount(accountNumber);
    } catch (err) {
      setError(err.response?.data ?? 'Failed to load recent transactions');
    }
  };

  return (
    <section style={{ display: 'grid', gap: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: 8 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Panel</h2>
        <button onClick={onBack}>Back to Login</button>
      </header>

      {error && <div style={{ color: 'red', padding: '0.75rem', background: '#ffe6e6', borderRadius: 4 }}>{error}</div>}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>User Accounts</h3>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAccount} style={{ display: 'grid', gap: '0.75rem', padding: '1rem', background: '#f9f9f9', borderRadius: 4 }}>
          <h4>Add New User</h4>
          <input
            type="text"
            placeholder="Account Number"
            value={newAccount.accountNumber}
            onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="PIN"
            value={newAccount.pin}
            onChange={(e) => setNewAccount({ ...newAccount, pin: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="User Name (optional)"
            value={newAccount.userName}
            onChange={(e) => setNewAccount({ ...newAccount, userName: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Initial Balance"
            value={newAccount.balance}
            onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
            required
          />
          <button type="submit">Create Account</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Account Number</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>User Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Balance</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{account.accountNumber}</td>
                  <td style={{ padding: '0.75rem' }}>{account.userName}</td>
                  <td style={{ padding: '0.75rem' }}>${account.balance.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleViewRecent(account.accountNumber)}>
                      View Recent
                    </button>
                    <button onClick={() => handleDeleteAccount(account.accountNumber)} style={{ background: '#dc3545', color: 'white' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {accounts.length === 0 && <p style={{ padding: '1rem', textAlign: 'center' }}>No accounts found</p>}
        </div>
      )}

      {selectedAccount && (
        <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: 4 }}>
          <h4>Last 3 Actions for Account: {selectedAccount}</h4>
          {recentTransactions.length === 0 ? (
            <p>No recent transactions</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recentTransactions.map((tx, idx) => (
                <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <strong>{tx.type}</strong> — ${tx.amount?.toFixed(2)} on {new Date(tx.createdAt).toLocaleString()}
                  {tx.description && <span> · {tx.description}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminPage;

