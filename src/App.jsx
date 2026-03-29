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

const IntroScreen = ({ onStart }) => {
  return (
    <div style={{
      backgroundColor: '#020617',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          backgroundColor: '#06b6d415',
          borderRadius: '50%',
          top: '-100px',
          left: '-100px',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          backgroundColor: '#0ea5e915',
          borderRadius: '50%',
          bottom: '50px',
          right: '-50px',
          animation: 'float 8s ease-in-out infinite'
        }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1 }}>
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
          margin: '0 auto 40px'
        }}>
          <p style={{
            color: '#cbd5e1',
            fontSize: '14px',
            lineHeight: '1.8',
            marginBottom: '15px'
          }}>
            Monitor your reef aquarium with real-time parameter tracking. Track your corals, fish, and equipment all in one place.
          </p>
          <p style={{
            color: '#94a3b8',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            • Real-time water parameter monitoring<br/>
            • Coral and fish inventory management<br/>
            • Equipment maintenance tracking<br/>
            • Offline support & cloud sync
          </p>
        </div>

        <button
          onClick={onStart}
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
      </div>
    </div>
  );
};

const TermsScreen = ({ onAccept }) => {
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = React.useRef(null);

  const handleScroll = (e) => {
    const el = e.target;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 100;
    setScrolled(isAtBottom);
  };

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
        maxWidth: '700px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ padding: '25px', borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
          <h2 style={{ color: '#06b6d4', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Terms & Conditions</h2>
          <p style={{ color: '#64748b', margin: '8px 0 0 0', fontSize: '12px' }}>Please read and accept to continue</p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '30px',
            color: '#cbd5e1',
            fontSize: '14px',
            lineHeight: '1.8'
          }}
        >
          <h3 style={{ color: '#06b6d4', marginTop: 0 }}>1. Service Description</h3>
          <p>ReefPulse is a reef aquarium monitoring and management application designed to help aquarium enthusiasts track water parameters, manage livestock, and maintain equipment schedules.</p>

          <h3 style={{ color: '#06b6d4' }}>2. Data Privacy & Storage</h3>
          <p>All your data is stored locally in your browser using local storage. We do not transmit, store, or process any of your personal data on external servers. Your aquarium information, parameter readings, and livestock inventory remain entirely under your control on your device.</p>

          <h3 style={{ color: '#06b6d4' }}>3. Accuracy & Liability Disclaimer</h3>
          <p>ReefPulse provides monitoring tools and suggestions based on entered data. However, parameter readings should ALWAYS be verified with physical testing equipment. The application should be used as a supplementary tool, not as a replacement for proper aquarium testing procedures. Users are solely responsible for maintaining their aquariums.</p>
          <p>The developer assumes NO LIABILITY for aquarium damage, livestock loss, or financial damages resulting from use of ReefPulse.</p>

          <h3 style={{ color: '#06b6d4' }}>4. Offline Functionality</h3>
          <p>ReefPulse works completely offline. All data syncing happens locally on your device. An internet connection is not required for basic functionality.</p>

          <h3 style={{ color: '#06b6d4' }}>5. Equipment & Browser Support</h3>
          <p>ReefPulse is compatible with modern browsers on iOS, Android, and desktop devices. Device storage limitations may apply to historical data retention.</p>

          <h3 style={{ color: '#06b6d4' }}>6. User Responsibilities</h3>
          <p>Users are responsible for the accuracy of data entered into ReefPulse. Users must maintain appropriate backups of important aquarium records if needed. The application is provided "as is" without warranties of any kind.</p>

          <h3 style={{ color: '#06b6d4' }}>7. Modifications</h3>
          <p>ReefPulse may be updated or discontinued at any time. Features and functionality may change without notice.</p>

          <h3 style={{ color: '#06b6d4' }}>8. Agreement</h3>
          <p>By clicking "I Accept", you acknowledge that you have read and understood these terms and conditions, and you agree to use ReefPulse in accordance with them.</p>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #1e293b', color: '#94a3b8', fontSize: '12px', textAlign: 'center' }}>
            {scrolled ? '✓ Ready to accept' : '↓ Scroll to see all terms'}
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #1e293b', backgroundColor: '#0f172a' }}>
          <button
            onClick={onAccept}
            disabled={!scrolled}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: scrolled ? '#06b6d4' : '#475569',
              color: scrolled ? '#020617' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              cursor: scrolled ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '15px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (scrolled) {
                e.target.style.backgroundColor = '#0891b2';
              }
            }}
            onMouseLeave={(e) => {
              if (scrolled) {
                e.target.style.backgroundColor = '#06b6d4';
              }
            }}
          >
            {scrolled ? 'I Accept Terms & Conditions' : 'Scroll to bottom to accept'}
          </button>
        </div>
      </div>
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
  const [screen, setScreen] = useState('intro'); // 'intro' | 'terms' | 'dashboard'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const accepted = await storage.getItem('terms_accepted');
      if (accepted === 'true') {
        setScreen('dashboard');
      } else {
        setScreen('intro');
      }
    } catch (err) {
      console.error('Init error:', err);
      setScreen('intro');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#020617' }}>
    <div style={{ color: '#06b6d4', fontSize: '18px' }}>🐠 Loading...</div>
  </div>;

  if (screen === 'intro') return <IntroScreen onStart={() => setScreen('terms')} />;
  
  if (screen === 'terms') return <TermsScreen onAccept={async () => {
    await storage.setItem('terms_accepted', 'true');
    setScreen('dashboard');
  }} />;

  return <Dashboard />;
}
