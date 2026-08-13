import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import axios from 'axios';

const NAV = [
  {
    label: 'Dashboard', path: '/dashboard', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    label: 'History', path: '/history', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    label: 'Profile', path: '/profile', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 20C4 17 7.58 15 12 15C16.42 15 20 17 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
];

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [scanError, setScanError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate('/login'); return; }
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single();
      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      } else {
        const meta = data.user.user_metadata?.full_name;
        setUserName(meta ? meta.split(' ')[0] : data.user.email.split('@')[0]);
      }
    };
    getUser();
  }, [navigate]);

  const isValidUrl = (value) => {
    try {
      const withProtocol = value.startsWith('http') ? value : `https://${value}`;
      new URL(withProtocol);
      return withProtocol;
    } catch { return null; }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setScanError('');
    const validUrl = isValidUrl(url);
    if (!validUrl) { setScanError('Please enter a valid URL or domain name'); return; }
    setScanning(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_N8N_WEBHOOK || 'http://localhost:5678'}/webhook/vulnerability-scan`,
        { url: validUrl },
        { timeout: 120000 }
      );
      navigate('/results', { state: { url: validUrl, liveScanData: response.data } });
    } catch (error) {
      console.error('Scan error:', error);
      navigate('/results', { state: { url: validUrl } });
    } finally {
      setScanning(false);
    }
  };

  const handleExport = () => {
    const report = {
      generated: new Date().toISOString(),
      summary: { totalScans: 124, highRisk: 12, mediumRisk: 45, lowRisk: 67 },
      recentScans: recentScans
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url2;
    a.download = `webguard-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url2);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const recentScans = [
    { url: 'https://testphp.vulnweb.com', date: '2026-07-30 14:32', score: 42, level: 'HIGH RISK', color: '#ffb4ab' },
    { url: 'https://example.com', date: '2026-07-29 09:15', score: 76, level: 'MED RISK', color: 'orange' },
    { url: 'https://mysite.com', date: '2026-07-28 16:45', score: 98, level: 'SECURE', color: '#3fe56c' },
  ];

  const SidebarContent = ({ onNavigate }) => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '0 12px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" fill="#00c853" opacity="0.2" />
          <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5" />
          <path d="M9 12L11 14L15 10" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div style={{ color: '#3fe56c', fontWeight: 'bold', fontSize: '15px', fontFamily: 'monospace', lineHeight: '1' }}>WebGuard</div>
          <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace' }}>Console</div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#1f2937', margin: '0 0 12px 0' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV.map((link, i) => (
          <button key={i} onClick={() => { navigate(link.path); onNavigate && onNavigate(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', textAlign: 'left', width: '100%', backgroundColor: link.label === 'Dashboard' ? '#00c853' : 'transparent', color: link.label === 'Dashboard' ? '#000' : '#bbcbb8', fontWeight: link.label === 'Dashboard' ? 'bold' : 'normal', marginBottom: '2px' }}>
            <span style={{ color: link.label === 'Dashboard' ? '#000' : '#bbcbb8' }}>{link.icon}</span>
            {link.label}
          </button>
        ))}
      </div>

      <div style={{ height: '1px', backgroundColor: '#1f2937', margin: '12px 0' }} />

      {/* User Profile Block */}
      <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#0a0e1a', border: '1px solid #1f2937', marginBottom: '8px' }}>
        <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace' }}>Admin User</div>
        <div style={{ color: '#3fe56c', fontSize: '11px', fontFamily: 'monospace' }}>Pro ★</div>
        <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace', marginTop: '2px' }}>Logged in</div>
      </div>

      {/* RED Logout Button (Triggers Modal) */}
      <button onClick={() => { setLogoutModal(true); onNavigate && onNavigate(); }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ef444440', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: '100%', fontWeight: 'bold' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Logout
      </button>
    </>
  );

  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', display: 'flex', fontFamily: 'Geist, sans-serif', color: '#dfe2f3' }}>
      <style>{`
        @media (max-width: 768px) { .desk-sidebar { display: none !important; } .main-area { margin-left: 0 !important; } }
        @media (min-width: 769px) { .mob-bar { display: none !important; } }
        @media (max-width: 600px) { .scan-form { flex-direction: column !important; } .top-grid { grid-template-columns: 1fr !important; } .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        
        /* FIXED: Moved placeholder CSS into the style tag! */
        .scan-form input::placeholder { color: rgba(223, 226, 243, 0.18); }
      `}</style>

      {/* Desktop Sidebar */}
      <nav className="desk-sidebar" style={{ width: '220px', minHeight: '100vh', backgroundColor: '#111827', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', padding: '20px 12px', position: 'fixed', top: 0, left: 0, zIndex: 99, overflowY: 'auto' }}>
        <SidebarContent />
      </nav>

      {/* Mobile Overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 97 }} />}

      {/* Mobile Drawer */}
      <nav style={{ width: '220px', minHeight: '100vh', backgroundColor: '#111827', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', padding: '20px 12px', position: 'fixed', top: 0, left: 0, zIndex: 98, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: '#3fe56c', fontWeight: 'bold', fontFamily: 'monospace' }}>WebGuard</span>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#bbcbb8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>
        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
      </nav>

      {/* Main */}
      <main className="main-area" style={{ marginLeft: '220px', flex: 1, padding: '24px', minHeight: '100vh', overflowY: 'auto' }}>

        {/* Mobile topbar */}
        <div className="mob-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: '1px solid #2D3748', color: '#dfe2f3', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>☰</button>
          <span style={{ color: '#3fe56c', fontWeight: 'bold', fontFamily: 'monospace' }}>WebGuard</span>
          <div style={{ width: 40 }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ color: '#dfe2f3', fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 'bold', margin: '0 0 6px' }}>
              Welcome back, {userName || 'User'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', fontFamily: 'monospace' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00c853', boxShadow: '0 0 6px #00c853', flexShrink: 0 }} />
              System Status: All services operational
            </div>
          </div>
          <button onClick={handleExport}
            style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#dfe2f3', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Export Report
          </button>
        </div>

        {/* Scan + Total Scans */}
        <div className="top-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #00c853, transparent)', opacity: 0.5 }} />
            <h3 style={{ color: '#dfe2f3', fontSize: '15px', fontWeight: 'bold', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#3fe56c" strokeWidth="1.5" />
                <path d="M21 21L16.65 16.65" stroke="#3fe56c" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Initialize New Scan
            </h3>
            <form onSubmit={handleScan} className="scan-form" style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="e.g. example.com or https://example.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onPaste={e => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text');
                  setUrl(pasted.trim());
                }}
                required
                style={{ flex: 1, backgroundColor: '#0a0e1a', border: `1px solid ${scanError ? '#ffb4ab' : '#374151'}`, borderRadius: '8px', color: '#dfe2f3', padding: '11px 14px', fontSize: '13px', outline: 'none', fontFamily: 'monospace' }}
              />
              <button type="submit" disabled={scanning}
                style={{ backgroundColor: '#00c853', border: 'none', color: '#000', padding: '11px 20px', borderRadius: '8px', cursor: scanning ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold', fontFamily: 'monospace', boxShadow: '0 0 12px rgba(0,200,83,0.3)', whiteSpace: 'nowrap', opacity: scanning ? 0.7 : 1 }}>
                {scanning ? '⟳ Scanning...' : '▶ Start Scan'}
              </button>
            </form>
            {scanError && <p style={{ color: '#ffb4ab', fontSize: '12px', fontFamily: 'monospace', margin: '8px 0 0' }}>⚠ {scanError}</p>}
            {scanning && <p style={{ color: '#3fe56c', fontSize: '12px', fontFamily: 'monospace', margin: '10px 0 0' }}>⟳ Running vulnerability assessment... please wait</p>}
            <p style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', margin: '8px 0 0' }}>Accepts domains (example.com) or full URLs (https://example.com)</p>
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Scans</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#bbcae0" strokeWidth="1.5" />
                <path d="M12 8V12L15 15" stroke="#bbcae0" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ color: '#dfe2f3', fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace', lineHeight: 1 }}>124</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <span style={{ color: '#3fe56c', fontSize: '12px', fontFamily: 'monospace' }}>↑ +12% this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
          {[
            { label: '● HIGH RISK FOUND', value: '12', color: '#ffb4ab', icon: '⚠' },
            { label: '● MEDIUM RISK FOUND', value: '45', color: 'orange', icon: '⊕' },
            { label: '● LOW RISK FOUND', value: '67', color: '#3fe56c', icon: 'ℹ' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '40px', opacity: 0.06, color: s.color }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: '11px', fontFamily: 'monospace', marginBottom: '8px' }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Scans */}
        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f1623' }}>
            <h3 style={{ color: '#dfe2f3', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>Recent Scans</h3>
            <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: '#3fe56c', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace' }}>View All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0a0e1a' }}>
                  {['TARGET URL', 'DATE/TIME', 'SECURITY SCORE', 'ACTION'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: i === 3 ? 'right' : 'left', color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: 'normal', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #1f2937' }}>
                    <td style={{ padding: '13px 16px', color: '#dfe2f3', fontSize: '13px', fontFamily: 'monospace' }}>{scan.url}</td>
                    <td style={{ padding: '13px 16px', color: '#6b7280', fontSize: '13px', fontFamily: 'monospace' }}>{scan.date}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ backgroundColor: `${scan.color}20`, color: scan.color, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold', border: `1px solid ${scan.color}40` }}>
                        SCORE: {scan.score} / {scan.level}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                      <button onClick={() => navigate('/results', { state: { url: scan.url } })} style={{ background: 'none', border: 'none', color: '#3fe56c', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace' }}>Details →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {logoutModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '28px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,180,171,0.1)', border: '1px solid #ffb4ab40', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke="#ffb4ab" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 17L21 12L16 7" stroke="#ffb4ab" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M21 12H9" stroke="#ffb4ab" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 style={{ color: '#dfe2f3', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>Sign Out?</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.5 }}>Are you sure you want to log out of WebGuard?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setLogoutModal(false)}
                style={{ flex: 1, backgroundColor: '#1f2937', border: '1px solid #374151', color: '#dfe2f3', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontFamily: 'monospace' }}>
                Cancel
              </button>
              <button onClick={handleLogout}
                style={{ flex: 1, backgroundColor: '#ffb4ab', border: 'none', color: '#000', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}