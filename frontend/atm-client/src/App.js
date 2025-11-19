import React, { useState } from 'react';
import LoginForm from './components/LoginForm.js';
import AccountDashboard from './components/AccountDashboard.js';
import AdminPage from './components/AdminPage.js';
import AdminLogin from './components/AdminLogin.js';

const App = () => {
  const [account, setAccount] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1rem' }}>
        <h1>ATM Simulator</h1>
        {!account && !showAdmin && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <LoginForm
              onSuccess={(accountInfo) => setAccount(accountInfo)}
            />
          </div>
        )}
        {!account && !showAdmin && (
          <button onClick={() => setShowAdmin(true)} style={{ marginTop: '1rem' }}>
            Admin Panel
          </button>
        )}
        {showAdmin && !adminAuthenticated && (
          <AdminLogin
            onSuccess={() => setAdminAuthenticated(true)}
            onBack={() => {
              setShowAdmin(false);
              setAdminAuthenticated(false);
            }}
          />
        )}
        {showAdmin && adminAuthenticated && (
          <AdminPage
            onBack={() => {
              setShowAdmin(false);
              setAdminAuthenticated(false);
            }}
          />
        )}
        {account && (
          <AccountDashboard account={account} onLogout={() => setAccount(null)} />
        )}
      </section>
    </main>
  );
};

export default App;

