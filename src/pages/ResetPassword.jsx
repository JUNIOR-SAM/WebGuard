import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery mode');
      }
    });
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) setError(err.message);
    else setSuccess(true);
    setLoading(false);
  };

  const inputStyle = {
    backgroundColor: '#0a0e1a', border: '1px solid #374151', borderRadius: '8px',
    color: '#dfe2f3', padding: '12px 16px', fontSize: '14px', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'monospace'
  };

  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ textAlign: 'center' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 10px', display: 'block' }}>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" fill="#00c853" opacity="0.2"/>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5"/>
            <path d="M9 12L11 14L15 10" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{ color: '#3fe56c', fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', fontFamily: 'monospace' }}>WebGuard</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Set new password</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(255,180,171,0.1)', border: '1px solid #ffb4ab40', borderRadius: '8px', padding: '10px 14px', color: '#ffb4ab', fontSize: '13px', fontFamily: 'monospace' }}>
            ⚠ {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(63,229,108,0.1)', border: '1px solid #3fe56c40', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ color: '#3fe56c', fontSize: '32px', marginBottom: '8px' }}>✓</div>
              <p style={{ color: '#3fe56c', fontSize: '14px', fontFamily: 'monospace', margin: 0 }}>
                Password updated successfully!
              </p>
            </div>
            <button onClick={() => navigate('/login')}
              style={{ backgroundColor: '#00c853', color: '#000', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: 'monospace' }}>
              Go to Login →
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>
                New Password
              </label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required style={inputStyle} />
            </div>
            <button type="submit" disabled={loading}
              style={{ backgroundColor: '#00c853', color: '#000', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontFamily: 'monospace', boxShadow: '0 0 12px rgba(0,200,83,0.3)', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Updating...' : 'Update Password →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}