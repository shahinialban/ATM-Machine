import React, { useEffect, useState } from 'react';
import api from '../api.js';

const AdminPage = ({ onBack }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const getTransactionTypeName = (type) => {
    const typeMap = {
      0: 'Deposit',
      1: 'Withdrawal',
      2: 'Balance Check',
      3: 'Login'
    };
    return typeMap[type] || type;
  };

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
      const response = await api.get('/admin/accounts', {
        headers: {
          'adminUsername': 'admin',
          'adminPassword': '1234'
        }
      });
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
      }, {
        headers: {
          'adminUsername': 'admin',
          'adminPassword': '1234'
        }
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
      await api.delete(`/admin/accounts/${accountNumber}`, {
        headers: {
          'adminUsername': 'admin',
          'adminPassword': '1234'
        }
      });
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
      const response = await api.get(`/admin/accounts/${accountNumber}/recent`, {
        headers: {
          'adminUsername': 'admin',
          'adminPassword': '1234'
        }
      });
      setRecentTransactions(response.data);
      setSelectedAccount(accountNumber);
    } catch (err) {
      setError(err.response?.data ?? 'Failed to load recent transactions');
    }
  };

  return (
    <section style={{ display: 'grid', gap: '1.5rem', background: '#fff', padding: '2rem', borderRadius: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Admin Panel</h2>
        <button 
          onClick={onBack}
          style={{
            padding: '0.75rem 1rem',
            background: '#f5f5f5',
            color: '#666',
            border: 'none',
            borderRadius: 12,
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Back to Login
        </button>
      </header>

      {error && <div style={{ 
        color: '#d32f2f', 
        padding: '0.75rem', 
        background: '#ffebee', 
        borderRadius: 12,
        fontSize: '0.875rem'
      }}>{error}</div>}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>User Accounts</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '0.75rem 1rem',
            background: showAddForm ? '#f5f5f5' : '#4CAF50',
            color: showAddForm ? '#666' : '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showAddForm && (
        <form className="responsive-form" onSubmit={handleAddAccount} style={{ 
          display: 'grid', 
          gap: '1rem', 
          padding: '1.5rem', 
          background: '#f9f9f9', 
          borderRadius: 12 
        }}>
          <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Add New User</h4>
          <input
            type="text"
            placeholder="Account Number"
            value={newAccount.accountNumber}
            onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
            required
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: 12,
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <input
            type="password"
            placeholder="PIN"
            value={newAccount.pin}
            onChange={(e) => setNewAccount({ ...newAccount, pin: e.target.value })}
            required
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: 12,
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <input
            type="text"
            placeholder="User Name (optional)"
            value={newAccount.userName}
            onChange={(e) => setNewAccount({ ...newAccount, userName: e.target.value })}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: 12,
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Initial Balance"
            value={newAccount.balance}
            onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
            required
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: 12,
              fontSize: '1rem',
              outline: 'none'
            }}
          />
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
            Create Account
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
      ) : (
        <div className="responsive-table-container" style={{ overflowX: 'auto', background: '#f9f9f9', borderRadius: 12, padding: '1rem' }}>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>Account Number</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>User Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>Balance</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{account.accountNumber}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{account.userName}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>${account.balance.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleViewRecent(account.accountNumber)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: '#fff',
                        color: '#333',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      View Recent
                    </button>
                    <button 
                      onClick={() => handleDeleteAccount(account.accountNumber)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {accounts.length === 0 && <p style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No accounts found</p>}
        </div>
      )}

      {selectedAccount && (
        <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: 12 }}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>Last 3 Actions for Account: {selectedAccount}</h4>
          {recentTransactions.length === 0 ? (
            <p style={{ color: '#666' }}>No recent transactions</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentTransactions.map((tx, idx) => (
                <li key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee', fontSize: '0.875rem' }}>
                  <strong>{getTransactionTypeName(tx.type)}</strong> — ${tx.amount?.toFixed(2)} on {new Date(tx.createdAt).toLocaleString()}
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

