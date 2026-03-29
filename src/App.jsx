import React, { useState, useEffect } from 'react';

const storage = {
  getItem: (key) => Promise.resolve(typeof window !== 'undefined' ? localStorage.getItem(key) : null),
  setItem: (key, value) => Promise.resolve(typeof window !== 'undefined' && localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(typeof window !== 'undefined' && localStorage.removeItem(key))
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

const TermsModal = ({ onAccept, onCancel }) => {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.7)'
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
            color: '#cbd5e1',
            fontSize: '13px',
            lineHeight: '1.6'
          }}
        >
          <p><strong style={{ color: '#06b6d4' }}>ReefPulse Terms & Conditions</strong></p>
          <p>By using ReefPulse, you agree to these terms:</p>
          
          <p><strong style={{ color: '#06b6d4' }}>1. Data Privacy</strong><br/>All data stored locally. No external servers.</p>
          
          <p><strong style={{ color: '#06b6d4' }}>2. Accuracy</strong><br/>Always verify parameters with physical testing.</p>
          
          <p><strong style={{ color: '#06b6d4' }}>3. Liability</strong><br/>We are not responsible for aquarium damage or livestock loss.</p>
          
          <p><strong style={{ color: '#06b6d4' }}>4. Offline</strong><br/>Works completely offline on your device.</p>
          
          <p><strong style={{ color: '#06b6d4' }}>5. Support</strong><br/>Compatible with iOS, Android, and desktop browsers.</p>

          <p style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #1e293b' }}>By accepting, you agree to these terms.</p>
        </div>

        <div style={{ padding: '15px', borderTop: '1px solid #1e293b', display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: '1px solid #334155',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            disabled={!scrolled}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: scrolled ? '#06b6d4' : '#475569',
              color: scrolled ? '#020617' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              cursor: scrolled ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            {scrolled ? 'I Accept' : 'Scroll to accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

const IntroScreen = ({ onAcceptTerms }) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div style={{
      backgroundColor: '#020617',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      <div style={{
        fontSize: '80px',
        marginBottom: '20px',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        🐠
      </div>
      
      <h1 style={{
        color: '#06b6d4',
        fontSize: '48px',
        fontWeight: 'bold',
        margin: '20px 0',
        letterSpacing: '2px'
      }}>
        ReefPulse
      </h1>
      
      <p style={{
        color: '#94a3b8',
        fontSize: '16px',
        marginBottom: '30px',
        letterSpacing: '3px',
        fontWeight: '600'
      }}>
        REEF AQUARIUM INTELLIGENCE
      </p>

      <div style={{
        maxWidth: '500px',
        margin: '0 auto 50px'
      }}>
        <p style={{
          color: '#cbd5e1',
          fontSize: '14px',
          lineHeight: '1.8',
          marginBottom: '15px'
        }}>
          Monitor your reef aquarium with real-time parameter tracking
        </p>
      </div>

      <button
        onClick={() => setShowTerms(true)}
        style={{
          padding: '14px 40px',
          backgroundColor: '#06b6d4',
          color: '#020617',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s',
          boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#0891b2';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#06b6d4';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
        }}
      >
        Get Started
      </button>

      {showTerms && (
        <TermsModal
          onAccept={() => {
            setShowTerms(false);
            onAcceptTerms();
          }}
          onCancel={() => setShowTerms(false)}
        />
      )}
    </div>
  );
};

const Dashboard = () => {
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
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const acc = await storage.getItem('terms_accepted');
      setAccepted(acc === 'true');
    } catch (err) {
      console.error('Init error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#020617' }}>
    <div style={{ color: '#06b6d4', fontSize: '18px' }}>🐠 Loading...</div>
  </div>;

  if (!accepted) return <IntroScreen onAcceptTerms={async () => {
    await storage.setItem('terms_accepted', 'true');
    setAccepted(true);
  }} />;

  return <Dashboard />;
}
