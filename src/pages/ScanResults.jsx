import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const findings = [
  {
    type: 'SQL Injection',
    endpoint: '/login',
    severity: 'HIGH',
    color: '#ffb4ab',
    bg: 'rgba(255,180,171,0.08)',
    status: 'OPEN',
    description: 'Vulnerability allows an attacker to execute arbitrary SQL commands on the database, potentially leading to unauthorized access or data exfiltration.',
    evidence: `POST /login HTTP/1.1\nHost: target-prod-env.com\nContent-Type: application/json\n\n{"username":"admin' OR '1'='1","password":"test"}`,
    fix: `// VULNERABLE\nconst query = "SELECT * FROM users WHERE email = '" + email + "'";\n\n// SECURE — parameterized queries\nconst query = "SELECT * FROM users WHERE email = ?";\ndb.execute(query, [email]);`
  },
  {
    type: 'Cross-Site Scripting (XSS)',
    endpoint: '/search',
    severity: 'HIGH',
    color: '#ffb4ab',
    bg: 'rgba(255,180,171,0.08)',
    status: 'OPEN',
    description: 'Reflected XSS on the site parameters. User input is not properly sanitized before being reflected in the HTML response.',
    evidence: `GET /search?q=<script>alert(1)</script>\nHost: target-prod-env.com`,
    fix: `// VULNERABLE\ndocument.getElementById("out").innerHTML = userInput;\n\n// SECURE\nconst safe = document.createTextNode(userInput);\ndocument.getElementById("out").appendChild(safe);`
  },
  {
    type: 'Missing Security Headers',
    endpoint: 'All pages',
    severity: 'LOW',
    color: '#3fe56c',
    bg: 'rgba(63,229,108,0.08)',
    status: 'OPEN',
    description: 'Strict-Transport-Security (HSTS) header is not set on the main domain response.',
    evidence: `HTTP/1.1 200 OK\nContent-Type: text/html\n# Missing: Strict-Transport-Security\n# Missing: X-Frame-Options\n# Missing: Content-Security-Policy`,
    fix: `// Add to your server config\nres.setHeader("Strict-Transport-Security", "max-age=31536000");\nres.setHeader("X-Frame-Options", "DENY");\nres.setHeader("Content-Security-Policy", "default-src 'self'");`
  },
];

export default function ScanResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(null);
  const scannedUrl = location.state?.url || 'target-prod-env.com';
  const score = 42;
  const scoreColor = score >= 70 ? '#3fe56c' : score >= 50 ? 'orange' : '#ef4444';

  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', color: '#dfe2f3', fontFamily: 'Geist, sans-serif', display: 'flex' }}>
      <style>{`
        @media (max-width: 768px) { .res-sidebar { display: none !important; } .res-main { margin-left: 0 !important; } }
        .finding-card:hover { border-color: rgba(255,255,255,0.15) !important; }
      `}</style>

      {/* Sidebar */}
      <nav className="res-sidebar" style={{ width: '220px', minHeight: '100vh', backgroundColor: '#111827', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', padding: '20px 12px', position: 'fixed', top: 0, left: 0, zIndex: 99 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', padding: '0 12px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" fill="#00c853" opacity="0.2"/>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5"/>
            <path d="M9 12L11 14L15 10" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ color: '#3fe56c', fontWeight: 'bold', fontSize: '14px', fontFamily: 'monospace' }}>WebGuard</div>
            <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace' }}>Console</div>
            <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace' }}>Enterprise Security</div>
          </div>
        </div>
        <div style={{ height: '1px', backgroundColor: '#1f2937', margin: '12px 0' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'New Scan', path: '/dashboard' },
            { label: 'History', path: '/history' },
            { label: 'Profile', path: '/profile' },
          ].map((link, i) => (
            <button key={i} onClick={() => navigate(link.path)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', textAlign: 'left', width: '100%', backgroundColor: link.label === 'New Scan' ? '#00c853' : 'transparent', color: link.label === 'New Scan' ? '#000' : '#bbcbb8', fontWeight: link.label === 'New Scan' ? 'bold' : 'normal', marginBottom: '2px' }}>
              {link.label}
            </button>
          ))}
        </div>
        <div style={{ height: '1px', backgroundColor: '#1f2937', margin: '12px 0' }} />
        <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#0a0e1a', border: '1px solid #1f2937' }}>
          <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace' }}>Admin User</div>
          <div style={{ color: '#3fe56c', fontSize: '11px', fontFamily: 'monospace' }}>Pro ★</div>
          <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace', marginTop: '2px' }}>Logged in</div>
        </div>
        <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', backgroundColor: 'transparent', color: '#bbcbb8', width: '100%', marginTop: '8px' }}>
          Logout
        </button>
      </nav>

      {/* Main */}
      <main className="res-main" style={{ marginLeft: '220px', flex: 1, padding: '24px', overflowY: 'auto' }}>

        {/* Back + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← BACK TO HISTORY
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ color: '#dfe2f3', fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 'bold', margin: '0 0 6px', fontFamily: 'monospace' }}>
              Scan Results: {scannedUrl}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace' }}>📅 2026-10-26 13:21:05 UTC</span>
              <span style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace' }}>⏱ 48s</span>
            </div>
          </div>
          <button style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#dfe2f3', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ↓ DOWNLOAD PDF REPORT
          </button>
        </div>

        {/* Score + Threat Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '16px', marginBottom: '20px' }}>
          {/* Score */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Posture</div>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: `4px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: `0 0 20px ${scoreColor}40` }}>
              <span style={{ fontSize: '26px', fontWeight: 'bold', color: scoreColor, fontFamily: 'monospace', lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'monospace' }}>/ 100</span>
            </div>
            <div style={{ color: scoreColor, fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>● CRITICAL STATUS</div>
            <div style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', textAlign: 'center' }}>Immediate remediation required</div>
          </div>

          {/* Threat Summary */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' }}>
            <div style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Threat Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { label: 'TOTAL', value: '8', color: '#dfe2f3' },
                { label: 'HIGH', value: '3', color: '#ef4444' },
                { label: 'MEDIUM', value: '2', color: 'orange' },
                { label: 'LOW', value: '3', color: '#3fe56c' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '12px 8px', backgroundColor: '#0a0e1a', borderRadius: '8px', border: '1px solid #1f2937' }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'monospace', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Findings */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ color: '#dfe2f3', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>Identified Vulnerabilities</h3>
          <button style={{ background: 'none', border: '1px solid #374151', color: '#bbcbb8', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace' }}>▼ FILTER</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {findings.map((f, i) => (
            <div key={i} className="finding-card" style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
              {/* Finding Header */}
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: f.bg, color: f.color, padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold', border: `1px solid ${f.color}40` }}>{f.severity}</span>
                  <span style={{ color: '#dfe2f3', fontSize: '15px', fontWeight: 'bold' }}>{f.type} in {f.endpoint}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#ef4444', fontSize: '11px', fontFamily: 'monospace' }}>● {f.status}</span>
                  <span style={{ color: '#6b7280', fontSize: '16px' }}>{expanded === i ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded Content */}
              {expanded === i && (
                <div style={{ borderTop: '1px solid #1f2937', padding: '20px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px' }}>{f.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '16px' }}>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Evidence / Payload</div>
                      <pre style={{ backgroundColor: '#0a0e1a', border: '1px solid #1f2937', borderRadius: '8px', padding: '12px', color: '#f87171', fontSize: '11px', fontFamily: 'monospace', overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{f.evidence}</pre>
                    </div>
                    <div>
                      <div style={{ color: '#3fe56c', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Recommended Fix (Node.js/React)</div>
                      <pre style={{ backgroundColor: '#0a0e1a', border: '1px solid #1f2937', borderRadius: '8px', padding: '12px', color: '#86efac', fontSize: '11px', fontFamily: 'monospace', overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{f.fix}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #1f2937' }}>
          <span style={{ color: '#3fe56c', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '13px' }}>WebGuard</span>
          <span style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace' }}> — Securing the web, one scan at a time.</span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px' }}>
            {['Privacy Policy', 'Terms of Service', 'Contact Support'].map((t, i) => (
              <span key={i} style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', cursor: 'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}