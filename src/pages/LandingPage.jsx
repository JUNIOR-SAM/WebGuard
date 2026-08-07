import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{backgroundColor:'#0a0e1a', minHeight:'100vh', color:'#dfe2f3', fontFamily:'Geist, sans-serif'}}>

      {/* Navbar */}
      <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 48px', borderBottom:'1px solid #2D3748', position:'sticky', top:0, backgroundColor:'#0a0e1a', zIndex:100}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" fill="#00c853" opacity="0.2"/>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5"/>
            <path d="M9 12L11 14L15 10" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{color:'#3fe56c', fontWeight:'bold', fontSize:'20px', fontFamily:'monospace'}}>WebGuard</span>
        </div>
        <div style={{display:'flex', gap:'12px'}}>
          <button onClick={() => navigate('/login')} style={{backgroundColor:'transparent', border:'1px solid #2D3748', color:'#dfe2f3', padding:'8px 20px', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontFamily:'monospace'}}>
            Login
          </button>
          <button onClick={() => navigate('/signup')} style={{backgroundColor:'#00c853', border:'none', color:'#000', padding:'8px 20px', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'bold', fontFamily:'monospace', boxShadow:'0 0 12px rgba(0,200,83,0.3)'}}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{textAlign:'center', padding:'100px 24px 80px', maxWidth:'800px', margin:'0 auto'}}>
        <div style={{display:'inline-block', backgroundColor:'#1A1F35', border:'1px solid #2D3748', borderRadius:'20px', padding:'6px 16px', marginBottom:'24px'}}>
          <span style={{color:'#3fe56c', fontSize:'13px', fontFamily:'monospace'}}>⚡ Automated Web Security Scanner</span>
        </div>
        <h1 style={{fontSize:'52px', fontWeight:'bold', lineHeight:'1.15', margin:'0 0 24px 0', color:'#dfe2f3'}}>
          Protect Your Website from{' '}
          <span style={{color:'#3fe56c'}}>Security Vulnerabilities</span>
        </h1>
        <p style={{fontSize:'18px', color:'#bbcbb8', lineHeight:'1.7', marginBottom:'40px', maxWidth:'600px', margin:'0 auto 40px'}}>
          WebGuard automatically scans your web application and detects SQL Injection, XSS, Broken Authentication and Security Misconfiguration    in seconds. Get actionable fix-it code with every finding.
        </p>
        <div style={{display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap'}}>
          <button onClick={() => navigate('/signup')} style={{backgroundColor:'#00c853', border:'none', color:'#000', padding:'14px 32px', borderRadius:'8px', cursor:'pointer', fontSize:'16px', fontWeight:'bold', fontFamily:'monospace', boxShadow:'0 0 16px rgba(0,200,83,0.4)'}}>
            Start Scanning Free →
          </button>
          <button onClick={() => navigate('/login')} style={{backgroundColor:'transparent', border:'1px solid #2D3748', color:'#dfe2f3', padding:'14px 32px', borderRadius:'8px', cursor:'pointer', fontSize:'16px', fontFamily:'monospace'}}>
            Login to Dashboard
          </button>
        </div>
      </section>

      {/* Stats */}
      <section style={{display:'flex', justifyContent:'center', gap:'48px', padding:'40px 24px', borderTop:'1px solid #1A1F35', borderBottom:'1px solid #1A1F35', flexWrap:'wrap'}}>
        {[
          {num:'4', label:'Vulnerability Types Detected'},
          {num:'2-Step', label:'False Positive Verification'},
          {num:'100%', label:'Free to Use'},
        ].map((stat, i) => (
          <div key={i} style={{textAlign:'center'}}>
            <div style={{fontSize:'32px', fontWeight:'bold', color:'#3fe56c', fontFamily:'monospace'}}>{stat.num}</div>
            <div style={{fontSize:'13px', color:'#bbcbb8', marginTop:'4px'}}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{padding:'80px 24px', maxWidth:'1100px', margin:'0 auto'}}>
        <h2 style={{textAlign:'center', fontSize:'32px', fontWeight:'bold', marginBottom:'48px', color:'#dfe2f3'}}>
          What WebGuard Detects
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px'}}>
          {[
            {
              title:'SQL Injection',
              desc:'We test your input fields with real payloads to detect database manipulation vulnerabilities.',
              icon:(
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6C4 4.34 7.58 3 12 3C16.42 3 20 4.34 20 6V18C20 19.66 16.42 21 12 21C7.58 21 4 19.66 4 18V6Z" stroke="#00c853" strokeWidth="1.5"/>
                  <path d="M4 12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12" stroke="#00c853" strokeWidth="1.5"/>
                  <path d="M4 6C4 7.66 7.58 9 12 9C16.42 9 20 7.66 20 6" stroke="#00c853" strokeWidth="1.5"/>
                </svg>
              )
            },
            {
              title:'Cross-Site Scripting (XSS)',
              desc:'We catch malicious script injection attempts that could steal user data or hijack sessions.',
              icon:(
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M8 9L4 12L8 15" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 9L20 12L16 15" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 4L10 20" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            },
            {
              title:'Broken Authentication',
              desc:'We check your session management, cookie flags, and authentication logic for weaknesses.',
              icon:(
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="#00c853" strokeWidth="1.5"/>
                  <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="16" r="1.5" fill="#00c853"/>
                </svg>
              )
            },
            {
              title:'Security Misconfiguration',
              desc:'We scan your HTTP response headers for missing security protections and exposed configurations.',
              icon:(
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5"/>
                  <path d="M12 8V12" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="15" r="1" fill="#00c853"/>
                </svg>
              )
            },
          ].map((feature, i) => (
            <div key={i} style={{backgroundColor:'#1A1F35', border:'1px solid #2D3748', borderRadius:'12px', padding:'24px', display:'flex', flexDirection:'column', gap:'12px'}}>
              {feature.icon}
              <h3 style={{color:'#dfe2f3', fontSize:'16px', fontWeight:'bold', margin:'0'}}>{feature.title}</h3>
              <p style={{color:'#bbcbb8', fontSize:'14px', lineHeight:'1.6', margin:'0'}}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{padding:'80px 24px', backgroundColor:'#0d1117', textAlign:'center'}}>
        <h2 style={{fontSize:'32px', fontWeight:'bold', marginBottom:'48px', color:'#dfe2f3'}}>How It Works</h2>
        <div style={{display:'flex', justifyContent:'center', gap:'32px', flexWrap:'wrap', maxWidth:'900px', margin:'0 auto'}}>
          {[
            {step:'01', title:'Enter URL', desc:'Type your website URL into the WebGuard scanner dashboard.'},
            {step:'02', title:'Run Scan', desc:'WebGuard automatically scans all endpoints for vulnerabilities.'},
            {step:'03', title:'Get Report', desc:'Receive a detailed report with fix-it code for every finding.'},
          ].map((item, i) => (
            <div key={i} style={{flex:'1', minWidth:'220px', maxWidth:'260px'}}>
              <div style={{width:'48px', height:'48px', backgroundColor:'#1A1F35', border:'1px solid #00c853', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'#3fe56c', fontFamily:'monospace', fontWeight:'bold', fontSize:'14px'}}>
                {item.step}
              </div>
              <h3 style={{color:'#dfe2f3', fontSize:'18px', fontWeight:'bold', margin:'0 0 8px'}}>{item.title}</h3>
              <p style={{color:'#bbcbb8', fontSize:'14px', lineHeight:'1.6', margin:'0'}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{textAlign:'center', padding:'80px 24px'}}>
        <h2 style={{fontSize:'36px', fontWeight:'bold', marginBottom:'16px', color:'#dfe2f3'}}>
          Ready to Secure Your Website?
        </h2>
        <p style={{color:'#bbcbb8', fontSize:'16px', marginBottom:'32px'}}>
          Start scanning for free. No credit card required.
        </p>
        <button onClick={() => navigate('/signup')} style={{backgroundColor:'#00c853', border:'none', color:'#000', padding:'16px 40px', borderRadius:'8px', cursor:'pointer', fontSize:'16px', fontWeight:'bold', fontFamily:'monospace', boxShadow:'0 0 16px rgba(0,200,83,0.4)'}}>
          Get Started Free →
        </button>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid #1A1F35', padding:'24px', textAlign:'center', color:'#bbcbb8', fontSize:'13px'}}>
        <span style={{color:'#3fe56c', fontFamily:'monospace', fontWeight:'bold'}}>WebGuard</span>   Securing the web, one scan at a time.
      </footer>

    </div>
  );
}