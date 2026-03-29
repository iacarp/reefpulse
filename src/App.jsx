import React, { useState, useEffect } from 'react';

const storage = {
  getItem: (key) => Promise.resolve(typeof window !== 'undefined' ? localStorage.getItem(key) : null),
  setItem: (key, value) => Promise.resolve(typeof window !== 'undefined' && localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(typeof window !== 'undefined' && localStorage.removeItem(key))
};

const hashPassword = async (password) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return btoa(password);
  }
};

const ELEMENT_DATA = {
  po4: { symbol: 'PO₄', name: 'Phosphate', color: '#10b981', bg: '#10b98115', ideal: [0.02, 0.1] },
  ca: { symbol: 'Ca', name: 'Calcium', color: '#8b5cf6', bg: '#8b5cf615', ideal: [400, 450] },
  mg: { symbol: 'Mg', name: 'Magnesium', color: '#f59e0b', bg: '#f59e0b15', ideal: [1250, 1350] },
  alk: { symbol: 'Alk', name: 'Alkalinity', color: '#0ea5e9', bg: '#0ea5e915', ideal: [7, 11] },
  no3: { symbol: 'NO₃', name: 'Nitrate', color: '#ef4444', bg: '#ef444415', ideal: [0, 20] },
};

const CORAL_DATABASE = [
  { id: 'eu1', name: 'Euphyllia Coral', type: 'LPS', icon: '🪸' },
];

const FISH_DATABASE = [
  { id: 'clown1', name: 'Clownfish #1', type: 'fish', icon: '🐠' },
  { id: 'clown2', name: 'Clownfish #2', type: 'fish', icon: '🐠' },
];

const sClr = (val, ideal) => {
  if (val == null || val === '') return '#64748b';
  const n = parseFloat(val);
  if (isNaN(n)) return '#64748b';
  if (n >= ideal[0] && n <= ideal[1]) return '#10b981';
  const r = ideal[1] - ideal[0];
  return (n < ideal[0] - r * 0.3 || n > ideal[1] + r * 0.3) ? '#ef4444' : '#f59e0b';
};

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

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
        const userData = { email, passwordHash, createdAt: new Date().toISOString(), method: 'local' };
        await storage.setItem(`user_${email}`, JSON.stringify(userData));
      }

      await storage.setItem('currentUser', email);
      onLoginSuccess({ email });
    } catch (err) {
      setError(err.message);
    }
  };

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
        padding: '40px',
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        border: '1px solid #1e293b'
      }}>
        <h1 style={{ color: '#06b6d4', fontSize: '40px', textAlign: 'center', margin: '0 0 10px 0' }}>🐠</h1>
        <h2 style={{ color: '#06b6d4', marginBottom: '5px', fontSize: '24px', textAlign: 'center', margin: '0 0 20px 0' }}>ReefPulse</h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px', textAlign: 'center', fontSize: '14px' }}>Reef Aquarium Intelligence</p>

        <form onSubmit={handleAuth}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{
            width: '100%', padding: '12px', marginBottom: '15px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9', fontSize: '14px'
          }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{
            width: '100%', padding: '12px', marginBottom: '15px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9', fontSize: '14px'
          }} />

          {error && <div style={{ padding: '12px', marginBottom: '15px', backgroundColor: '#7f1d1d', color: '#fca5a5', borderRadius: '6px', fontSize: '13px' }}>{error}</div>}

          <button type="submit" style={{
            width: '100%', padding: '12px', marginBottom: '15px', backgroundColor: '#06b6d4', color: '#020617', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
          }}>
            {isLogin ? 'Login' : 'Register'}
          </button>

          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{
            width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#06b6d4', border: '1px solid #06b6d4', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
          }}>
            {isLogin ? 'Need account? Register' : 'Have account? Login'}
          </button>
        </form>

        <div style={{ marginTop: '25px', paddingTop: '25px', borderTop: '1px solid #1e293b', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '11px', margin: '0 0 6px 0', fontWeight: '600' }}>DEMO</p>
          <p style={{ color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace', margin: 0 }}>test@reef.local / test123</p>
        </div>
      </div>
    </div>
  );
};

const TermsScreen = ({ email, onAccept }) => {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div style={{
      backgroundColor: '#020617',
      color: '#f1f5f9',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #1e293b' }}>
          <h2 style={{ color: '#06b6d4', margin: 0, fontSize: '18px' }}>Terms & Conditions</h2>
        </div>

        <div
          onScroll={(e) => {
            const el = e.target;
            const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
            setScrolled(atBottom);
          }}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            color: '#94a3b8',
            fontSize: '13px',
            lineHeight: '1.6'
          }}
        >
          <p><strong style={{ color: '#06b6d4' }}>ReefPulse Terms & Conditions</strong></p>
          <p>By using ReefPulse, you agree to the following terms:</p>
          
          <p><strong style={{ color: '#06b6d4' }}>1. Data Privacy</strong><br/>Your data is stored locally in your browser. No data is sent to external servers.</p>
          
          <p><strong style={{ color: '#06b6d4' }}>2. Accuracy</strong><br/>ReefPulse provides monitoring tools. Always verify parameters with physical tests.</p>
          
          <p><strong style={{ color: '#06b6d4' }}>3. Liability</strong><br/>ReefPulse is provided "as is". The developer is not responsible for aquarium damage or livestock loss.</p>
          
          <p><strong style={{ color: '#06b6d4' }}>4. Offline Use</strong><br/>ReefPulse works offline. Features sync when connectivity returns.</p>
          
          <p><strong style={{ color: '#06b6d4' }}>5. Account</strong><br/>User is responsible for maintaining account security and password confidentiality.</p>
          
          <p style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #1e293b' }}>By clicking "I Accept", you agree to these terms and conditions.</p>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #1e293b' }}>
          <button
            onClick={onAccept}
            disabled={!scrolled}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: scrolled ? '#06b6d4' : '#475569',
              color: scrolled ? '#020617' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              cursor: scrolled ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {scrolled ? 'I Accept' : 'Scroll to accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user }) => {
  const [lastEntry] = useState({
    po4: 0.05,
    ca: 425,
    mg: 1300,
    alk: 8.5,
    no3: 15
  });

  return (
    <div style={{
      backgroundColor: '#020617',
      color: '#f1f5f9',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        border: '1px solid #1e293b'
      }}>
        <div style={{ fontSize: '32px' }}>🐠</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#06b6d4', margin: 0, fontSize: '24px' }}>ReefPulse</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '11px', letterSpacing: '1px' }}>REEF AQUARIUM INTELLIGENCE</p>
        </div>
        <button onClick={() => { storage.removeItem('currentUser'); storage.removeItem(`terms_accepted_${user.email}`); window.location.reload(); }} style={{
          backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
        }}>
          Logout
        </button>
      </div>

      {/* Periodic Table */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', margin: '0 0 12px 0' }}>⚗️ KEY PARAMETERS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {Object.entries(ELEMENT_DATA).map(([key, elem]) => {
            const val = lastEntry[key];
            const color = sClr(val, elem.ideal);
            const dec = key === 'po4' ? 3 : 1;
            const status = color === '#10b981' ? '✓ OK' : color === '#f59e0b' ? '⚠ WARN' : '✗ CRIT';

            return (
              <div key={key} style={{
                backgroundColor: elem.bg,
                borderRadius: '10px',
                padding: '12px',
                border: `2px solid ${color}`,
                textAlign: 'center'
              }}>
                <div style={{ color: elem.color, fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{elem.symbol}</div>
                <div style={{ color, fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{val.toFixed(dec)}</div>
                <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '6px' }}>ppm</div>
                <div style={{ padding: '3px 6px', borderRadius: '12px', backgroundColor: color === '#10b981' ? '#10b98120' : color === '#f59e0b' ? '#f59e0b20' : '#ef444420', fontSize: '10px', fontWeight: '600', color: color === '#10b981' ? '#34d399' : color === '#f59e0b' ? '#fbbf24' : '#f87171' }}>
                  {status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Corals */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', margin: '0 0 12px 0' }}>🪸 YOUR CORALS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {CORAL_DATABASE.map(coral => (
            <div key={coral.id} style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{coral.icon}</div>
              <h3 style={{ color: '#06b6d4', margin: '0 0 4px 0', fontSize: '14px' }}>{coral.name}</h3>
              <p style={{ color: '#64748b', margin: 0, fontSize: '11px' }}>{coral.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fish */}
      <div>
        <h2 style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', margin: '0 0 12px 0' }}>🐠 YOUR FISH</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {FISH_DATABASE.map(fish => (
            <div key={fish.id} style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{fish.icon}</div>
              <h3 style={{ color: '#06b6d4', margin: '0 0 4px 0', fontSize: '14px' }}>{fish.name}</h3>
              <p style={{ color: '#64748b', margin: 0, fontSize: '11px' }}>{fish.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const currentEmail = await storage.getItem('currentUser');
      if (currentEmail) {
        setUser({ email: currentEmail });
        const accepted = await storage.getItem(`terms_accepted_${currentEmail}`);
        setTermsAccepted(accepted === 'true');
      }
    } catch (err) {
      console.error('Init error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#020617' }}>
    <div style={{ color: '#06b6d4', fontSize: '18px' }}>🐠 Loading...</div>
  </div>;

  if (!user) return <LoginScreen onLoginSuccess={(u) => {
    setUser(u);
    setTermsAccepted(false);
  }} />;

  if (!termsAccepted) return <TermsScreen email={user.email} onAccept={async () => {
    await storage.setItem(`terms_accepted_${user.email}`, 'true');
    setTermsAccepted(true);
  }} />;

  return <Dashboard user={user} />;
}
