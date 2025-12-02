import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm.js';
import AccountDashboard from './components/AccountDashboard.js';
import AdminPage from './components/AdminPage.js';
import AdminLogin from './components/AdminLogin.js';

const App = () => {
  const [account, setAccount] = useState(null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);
  const navigate = useNavigate();

  return (
    <main
      className="responsive-container"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        minHeight: '100vh',
        height: '100vh',
        backgroundColor: '#e5e5e5',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <div
        className="responsive-container"
        style={{
          maxWidth: 420,
          width: '100%',
          background: '#e5e5e5',
          borderRadius: 24,
          padding: '1.5rem',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="responsive-title-container"
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#333',
          }}
        >
          <h1
            className="responsive-title"
            style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}
          >
            ATM Machine
          </h1>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <>
                {!account && (
                  <>
                    <LoginForm
                      onSuccess={(accountInfo) => {
                        setAccount(accountInfo);
                        navigate('/account');
                      }}
                    />
                    <button
                      onClick={() => navigate('/admin')}
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
                        color: '#333',
                      }}
                    >
                      Admin Panel
                    </button>
                  </>
                )}

                {account && (
                  <AccountDashboard
                    account={account}
                    onLogout={() => {
                      setAccount(null);
                      navigate('/');
                    }}
                  />
                )}
              </>
            }
          />

          <Route
            path="/admin"
            element={
              !adminAuthenticated ? (
                <AdminLogin
                  onSuccess={(credentials) => {
                    setAdminCredentials(credentials);
                    setAdminAuthenticated(true);
                  }}
                  onBack={() => {
                    setAdminAuthenticated(false);
                    setAdminCredentials(null);
                    navigate('/');
                  }}
                />
              ) : (
                <AdminPage
                  adminCredentials={adminCredentials}
                  onBack={() => {
                    setAdminAuthenticated(false);
                    setAdminCredentials(null);
                    navigate('/');
                  }}
                />
              )
            }
          />

          <Route
            path="/account"
            element={
              account ? (
                <AccountDashboard
                  account={account}
                  onLogout={() => {
                    setAccount(null);
                    navigate('/');
                  }}
                />
              ) : (
                <LoginForm
                  onSuccess={(accountInfo) => {
                    setAccount(accountInfo);
                    navigate('/account');
                  }}
                />
              )
            }
          />
        </Routes>
      </div>
    </main>
  );
};

export default App;

