import React, { useState } from 'react';
import LoginForm from './components/LoginForm.js';
import AccountDashboard from './components/AccountDashboard.js';

const App = () => {
  const [account, setAccount] = useState(null);

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: '#f7f7f7' }}>
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1rem' }}>
        <h1>ATM Simulator</h1>
        {!account && (
          <LoginForm
            onSuccess={(accountInfo) => setAccount(accountInfo)}
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

