import React, { useEffect, useState } from 'react';
import api from '../api.js';

const TransactionForm = ({ label, action, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ amount: Number(amount), description });
    setAmount('');
    setDescription('');
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '1.5rem'
    }}>
      <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>{label}</h4>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <input 
          type="number" 
          min="0" 
          step="0.01" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="Amount" 
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
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description (optional)"
          style={{
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: 12,
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="submit"
            style={{
              flex: 1,
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
            {action}
          </button>
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              style={{
                padding: '1rem',
                background: '#f5f5f5',
                color: '#666',
                border: 'none',
                borderRadius: 12,
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const AccountDashboard = ({ account, onLogout }) => {
  const [balance, setBalance] = useState(account.balance);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const getTransactionTypeName = (type) => {
    const typeMap = {
      0: 'Deposit',
      1: 'Withdrawal',
      2: 'Balance Check',
      3: 'Login'
    };
    return typeMap[type] || type;
  };

  const loadHistory = async () => {
    const response = await api.get(`/accounts/${account.accountNumber}/transactions`);
    setHistory(response.data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDeposit = async ({ amount, description }) => {
    setError(null);
    try {
      const response = await api.post(`/accounts/${account.accountNumber}/deposit`, { amount, description });
      setBalance(response.data.balance);
      loadHistory();
    } catch (err) {
      setError(err.response?.data ?? 'Unable to process deposit');
    }
  };

  const handleWithdraw = async ({ amount, description }) => {
    setError(null);
    try {
      const response = await api.post(`/accounts/${account.accountNumber}/withdraw`, { amount, description });
      setBalance(response.data.balance);
      loadHistory();
    } catch (err) {
      setError(err.response?.data ?? 'Unable to process withdrawal');
    }
  };

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Purple Card Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        padding: '1.5rem',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.5rem' }}>VISA • Debit</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>{account.userName.toUpperCase()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.5rem' }}>Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>${balance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {error && <div style={{ 
        color: '#d32f2f', 
        padding: '0.75rem', 
        background: '#ffebee', 
        borderRadius: 12,
        fontSize: '0.875rem'
      }}>{error}</div>}

      {/* Action Buttons */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        <button
          onClick={() => setShowWithdrawForm(!showWithdrawForm)}
          style={{
            padding: '1.25rem',
            background: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            color: '#333',
            textAlign: 'left'
          }}
        >
          Withdraw Cash
        </button>
        <button
          onClick={() => setShowDepositForm(!showDepositForm)}
          style={{
            padding: '1.25rem',
            background: '#4CAF50',
            border: 'none',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            color: '#fff',
            textAlign: 'left'
          }}
        >
          Deposit Funds
        </button>
        <button
          onClick={() => setShowTransactions(!showTransactions)}
          style={{
            padding: '1.25rem',
            background: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            color: '#333',
            textAlign: 'left'
          }}
        >
          View Transactions
        </button>
      </div>

      {showWithdrawForm && (
        <TransactionForm 
          label="Withdraw Cash" 
          action="Withdraw" 
          onSubmit={(data) => {
            handleWithdraw(data);
            setShowWithdrawForm(false);
          }}
          onCancel={() => setShowWithdrawForm(false)}
        />
      )}

      {showDepositForm && (
        <TransactionForm 
          label="Deposit Funds" 
          action="Deposit" 
          onSubmit={(data) => {
            handleDeposit(data);
            setShowDepositForm(false);
          }}
          onCancel={() => setShowDepositForm(false)}
        />
      )}

      {showTransactions && (
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '1.5rem'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>Recent Activity</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {history.slice(0, 5).map((item) => (
              <li key={`${item.createdAt}-${item.amount}`} style={{ 
                padding: '0.75rem 0', 
                borderBottom: '1px solid #eee',
                fontSize: '0.875rem'
              }}>
                <strong>{getTransactionTypeName(item.type)}</strong> — ${item.amount?.toFixed(2)} on {new Date(item.createdAt).toLocaleString()}
                {item.description && <span> · {item.description}</span>}
              </li>
            ))}
            {history.length === 0 && <li style={{ color: '#666' }}>No transactions yet.</li>}
          </ul>
        </div>
      )}

      {/* Progress Indicator */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: 12,
        fontSize: '0.75rem',
        color: '#666',
        textAlign: 'center'
      }}>
        Progress: Select action → Confirm amount
      </div>

      <button
        onClick={onLogout}
        style={{
          padding: '0.75rem',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 12,
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          color: '#666'
        }}
      >
        Sign out
      </button>
    </section>
  );
};

export default AccountDashboard;

