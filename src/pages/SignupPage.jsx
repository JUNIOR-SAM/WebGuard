import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  };

  const inputStyle = { backgroundColor: '#1A1F35', border: '1px solid #2D3748', borderRadius: '8px', color: '#dfe2f3', padding: '12px 16px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'monospace' };
  const labelStyle = { color: '#bbcbb8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' };

  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#1A1F35', border: '1px solid #2D3748', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 8px', display: 'block' }}>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" fill="#00c853" opacity="0.2"/>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5"/>
            <path d="M9 12L11 14L15 10" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{ color: '#3fe56c', fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', fontFamily: 'monospace' }}>WebGuard</h1>
          <p style={{ color: '#bbcbb8', fontSize: '14px', margin: 0 }}>Create your account</p>
        </div>
        {error && <div style={{ backgroundColor: 'rgba(255,180,171,0.1)', border: '1px solid #ffb4ab40', borderRadius: '8px', padding: '10px 14px', color: '#ffb4ab', fontSize: '13px', fontFamily: 'monospace' }}>{error}</div>}
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(63,229,108,0.1)', border: '1px solid #3fe56c40', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ color: '#3fe56c', fontSize: '32px', marginBottom: '8px' }}>✓</div>
              <p style={{ color: '#3fe56c', fontSize: '14px', fontFamily: 'monospace', margin: 0 }}>Account created! Check your email to confirm.</p>
            </div>
            <button onClick={() => navigate('/login')} style={{ backgroundColor: '#00c853', color: '#000', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: 'monospace' }}>
              Go to Login →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="samuel@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading}
              style={{ backgroundColor: '#00c853', color: '#000', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', boxShadow: '0 0 12px rgba(0,200,83,0.3)', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>
        )}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#bbcbb8', fontSize: '14px', margin: 0 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#3fe56c', textDecoration: 'none', fontWeight: '600' }}>Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}