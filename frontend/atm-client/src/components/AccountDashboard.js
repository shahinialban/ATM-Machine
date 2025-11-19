import React, { useEffect, useState } from 'react';
import api from '../api.js';

const TransactionForm = ({ label, action, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ amount: Number(amount), description });
    setAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
      <h4>{label}</h4>
      <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" />
      <button type="submit">{action}</button>
    </form>
  );
};

const AccountDashboard = ({ account, onLogout }) => {
  const [balance, setBalance] = useState(account.balance);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

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
    <section style={{ display: 'grid', gap: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: 8 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{account.userName}</h2>
          <p>Account #{account.accountNumber}</p>
        </div>
        <button onClick={onLogout}>Sign out</button>
      </header>
      <div>
        <h3>Current Balance</h3>
        <p style={{ fontSize: '2rem', margin: 0 }}>${balance.toFixed(2)}</p>
      </div>
      {error && <div style={{ color: 'red', padding: '0.75rem', background: '#ffe6e6', borderRadius: 4 }}>{error}</div>}
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <TransactionForm label="Deposit" action="Add Funds" onSubmit={handleDeposit} />
        <TransactionForm label="Withdraw" action="Withdraw" onSubmit={handleWithdraw} />
      </div>
      <section>
        <h3>Recent Activity</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {history.map((item) => (
            <li key={`${item.createdAt}-${item.amount}`} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
              <strong>{item.type}</strong> — ${item.amount?.toFixed(2)} on {new Date(item.createdAt).toLocaleString()}
              {item.description && <span> · {item.description}</span>}
            </li>
          ))}
          {history.length === 0 && <li>No transactions yet.</li>}
        </ul>
      </section>
    </section>
  );
};

export default AccountDashboard;

