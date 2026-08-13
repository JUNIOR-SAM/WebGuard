import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const scans = [
  { id:1, date:'2026-07-30 14:32', url:'https://testphp.vulnweb.com', score:42, high:2, medium:1, low:1, level:'High Risk', color:'#ffb4ab' },
  { id:2, date:'2026-07-29 09:15', url:'https://example.com', score:76, high:0, medium:2, low:3, level:'Med Risk', color:'orange' },
  { id:3, date:'2026-07-28 16:45', url:'https://mysite.com', score:98, high:0, medium:0, low:1, level:'Secure', color:'#3fe56c' },
  { id:4, date:'2026-07-27 11:20', url:'https://testsite.org', score:55, high:1, medium:2, low:2, level:'Med Risk', color:'orange' },
  { id:5, date:'2026-07-26 08:00', url:'https://demo.com', score:88, high:0, medium:1, low:0, level:'Low Risk', color:'#3fe56c' },
];

export default function History() {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = scans.filter(s =>
    s.url.toLowerCase().includes(search.toLowerCase()) ||
    s.date.includes(search)
  );

  const navLinks = [
    {label:'Dashboard', path:'/dashboard'},
    {label:'New Scan', path:'/dashboard'},
    {label:'History', path:'/history'},
    {label:'Profile', path:'/profile'}, // Added Profile Link
  ];

  const SidebarContent = () => (
    <>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', padding:'0 12px'}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" fill="#00c853" opacity="0.2"/>
          <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5"/>
          <path d="M9 12L11 14L15 10" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <div style={{color:'#3fe56c', fontWeight:'bold', fontSize:'15px', fontFamily:'monospace', lineHeight:'1'}}>WebGuard</div>
          <div style={{color:'#6b7280', fontSize:'10px', fontFamily:'monospace'}}>Console</div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#1f2937', margin: '0 0 12px 0' }} />

      <div style={{display:'flex', flexDirection:'column', gap:'4px', flex:1}}>
        {navLinks.map((link, i) => (
          <button key={i} onClick={() => { navigate(link.path); setSidebarOpen(false); }}
            style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'13px', fontFamily:'monospace', textAlign:'left', backgroundColor: link.label==='History' ? '#00c853' : 'transparent', color: link.label==='History' ? '#000' : '#bbcbb8', fontWeight: link.label==='History' ? 'bold' : 'normal'}}>
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

      {/* Red Logout Button */}
      <button onClick={() => { navigate('/login'); setSidebarOpen(false); }}
        style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'8px', border:'1px solid #ef444440', cursor:'pointer', fontSize:'13px', fontFamily:'monospace', backgroundColor:'rgba(239, 68, 68, 0.1)', color:'#ef4444', width:'100%', fontWeight:'bold', justifyContent:'center'}}>
        Logout
      </button>
    </>
  );

  return (
    <div style={{backgroundColor:'#0a0e1a', minHeight:'100vh', color:'#dfe2f3', fontFamily:'Geist, sans-serif', display:'flex'}}>
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .history-main { margin-left: 0 !important; }
        }
        @media (min-width: 769px) {
          .mobile-topbar { display: none !important; }
          .mobile-overlay { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <nav className="desktop-sidebar" style={{width:'220px', minHeight:'100vh', backgroundColor:'#111827', borderRight:'1px solid #1f2937', display:'flex', flexDirection:'column', padding:'20px 12px', position:'fixed', top:0, left:0, zIndex:99}}>
        <SidebarContent />
      </nav>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} style={{position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:98}} />
      )}

      {/* Mobile Drawer */}
      <nav className="mobile-drawer" style={{width:'220px', minHeight:'100vh', backgroundColor:'#111827', borderRight:'1px solid #1f2937', display:'flex', flexDirection:'column', padding:'20px 12px', position:'fixed', top:0, left:0, zIndex:99, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition:'transform 0.3s ease'}}>
        <SidebarContent />
      </nav>

      {/* Main */}
      <main className="history-main" style={{marginLeft:'220px', flex:1, padding:'24px'}}>

        {/* Mobile Top Bar */}
        <div className="mobile-topbar" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', paddingBottom:'16px', borderBottom:'1px solid #2D3748'}}>
          <button onClick={() => setSidebarOpen(true)} style={{backgroundColor:'transparent', border:'1px solid #2D3748', color:'#dfe2f3', padding:'8px 12px', borderRadius:'8px', cursor:'pointer', fontSize:'16px'}}>☰</button>
          <span style={{color:'#3fe56c', fontWeight:'bold', fontSize:'16px', fontFamily:'monospace'}}>WebGuard</span>
          <div style={{width:'40px'}} />
        </div>

        {/* Page Header */}
        <div style={{marginBottom:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px'}}>
          <h2 style={{color:'#dfe2f3', fontSize:'clamp(18px, 4vw, 24px)', fontWeight:'bold', margin:'0'}}>Scan History</h2>
          <input
            type="text"
            placeholder="Search by URL or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{backgroundColor:'#111827', border:'1px solid #1f2937', borderRadius:'8px', color:'#dfe2f3', padding:'10px 16px', fontSize:'14px', outline:'none', fontFamily:'monospace', width:'clamp(200px, 40vw, 280px)'}}
          />
        </div>

        {/* Table */}
        <div style={{backgroundColor:'#111827', border:'1px solid #1f2937', borderRadius:'12px', overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', minWidth:'500px'}}>
              <thead>
                <tr style={{backgroundColor:'#0a0e1a'}}>
                  {['Date','Target URL','Score','High','Med','Low','Action'].map((h,i) => (
                    <th key={i} style={{padding:'12px 14px', textAlign:'left', color:'#bbcbb8', fontSize:'12px', fontFamily:'monospace', textTransform:'uppercase', fontWeight:'normal', whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((scan, i) => (
                  <tr key={i} style={{borderTop:'1px solid #1f2937'}}>
                    <td style={{padding:'12px 14px', color:'#bbcbb8', fontSize:'12px', fontFamily:'monospace', whiteSpace:'nowrap'}}>{scan.date}</td>
                    <td style={{padding:'12px 14px', color:'#dfe2f3', fontSize:'13px', fontFamily:'monospace', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{scan.url}</td>
                    <td style={{padding:'12px 14px'}}>
                      <span style={{backgroundColor:`${scan.color}20`, color:scan.color, padding:'3px 8px', borderRadius:'4px', fontSize:'11px', fontFamily:'monospace', fontWeight:'bold', whiteSpace:'nowrap', border:`1px solid ${scan.color}40`}}>
                        {scan.score}/100
                      </span>
                    </td>
                    <td style={{padding:'12px 14px', color:'#ffb4ab', fontSize:'13px', fontFamily:'monospace', fontWeight:'bold', textAlign:'center'}}>{scan.high}</td>
                    <td style={{padding:'12px 14px', color:'orange', fontSize:'13px', fontFamily:'monospace', fontWeight:'bold', textAlign:'center'}}>{scan.medium}</td>
                    <td style={{padding:'12px 14px', color:'#3fe56c', fontSize:'13px', fontFamily:'monospace', fontWeight:'bold', textAlign:'center'}}>{scan.low}</td>
                    <td style={{padding:'12px 14px'}}>
                      <button onClick={() => navigate('/results')} style={{backgroundColor:'transparent', border:'1px solid #374151', color:'#3fe56c', padding:'5px 10px', borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontFamily:'monospace', whiteSpace:'nowrap'}}>
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{textAlign:'center', padding:'40px', color:'#bbcbb8', fontFamily:'monospace'}}>
              No scans found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}