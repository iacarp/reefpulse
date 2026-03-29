import React, { useState, useEffect } from 'react';

const storage = {
  getItem: (key) => Promise.resolve(typeof window !== 'undefined' ? localStorage.getItem(key) : null),
  setItem: (key, value) => Promise.resolve(typeof window !== 'undefined' && localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(typeof window !== 'undefined' && localStorage.removeItem(key))
};

const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const currentEmail = await storage.getItem('currentUser');
      if (currentEmail) {
        const userData = await storage.getItem(`user_${currentEmail}`);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (err) {
      console.error('Init error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('All fields required');
      return;
    }

    try {
      if (isLogin) {
        const userData = await storage.getItem(`user_${email}`);
        if (!userData) {
          setError('User not found');
          return;
        }
        const user = JSON.parse(userData);
        const passwordHash = await hashPassword(password);
        if (passwordHash !== user.passwordHash) {
          setError('Invalid password');
          return;
        }
      } else {
        const existing = await storage.getItem(`user_${email}`);
        if (existing) {
          setError('User already exists');
          return;
        }
        const passwordHash = await hashPassword(password);
        const userData = {
          email,
          passwordHash,
          createdAt: new Date().toISOString(),
          method: 'local'
        };
        await storage.setItem(`user_${email}`, JSON.stringify(userData));
      }

      await storage.setItem('currentUser', email);
      setUser({ email });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#020617' }}>
        <div style={{ color: '#06b6d4', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        backgroundColor: '#020617',
        flexDirection: 'column'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#06b6d4', marginBottom: '20px', fontSize: '32px' }}>🐠 ReefPulse</h1>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Welcome, {user.email}!</p>
          <button
            onClick={() => {
              storage.removeItem('currentUser');
              setUser(null);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      backgroundColor: '#020617',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        border: '1px solid #1e293b'
      }}>
        <h1 style={{ color: '#06b6d4', marginBottom: '10px', fontSize: '28px', textAlign: 'center' }}>
          🐠 ReefPulse
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px', textAlign: 'center', fontSize: '14px' }}>
          Reef Aquarium Intelligence
        </p>

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />

          {error && (
            <div style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#7f1d1d',
              color: '#fca5a5',
              borderRadius: '6px',
              fontSize: '12px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#06b6d4',
              color: '#020617',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              color: '#06b6d4',
              border: '1px solid #06b6d4',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isLogin ? 'Need account? Register' : 'Have account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
