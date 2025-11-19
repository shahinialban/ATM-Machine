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
    <main style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      minHeight: '100vh', 
      backgroundColor: '#e5e5e5',
      padding: '2rem 1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        maxWidth: 420, 
        width: '100%',
        background: '#e5e5e5',
        borderRadius: 24,
        padding: '2rem'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: '#333'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>ATM Machine</h1>
        </div>
        {!account && !showAdmin && (
          <LoginForm
            onSuccess={(accountInfo) => setAccount(accountInfo)}
          />
        )}
        {!account && !showAdmin && (
          <button 
            onClick={() => setShowAdmin(true)} 
            style={{ 
              marginTop: '1rem',
              width: '100%',
              padding: '1rem',
              background: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              color: '#333'
            }}
          >
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
      </div>
    </main>
  );
};

export default App;

