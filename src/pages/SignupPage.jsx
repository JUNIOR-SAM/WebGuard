import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (!fullName.trim()) { setError('Please enter your full name'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } }
      });
      
      if (err) { 
        setError(err.message); 
        setLoading(false); 
        return; 
      }
      
      if (data?.user) {
        // Save the profile in the background
        const { error: profileErr } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          email: email
        });
        
        if (profileErr) {
          console.error("Profile save error:", profileErr);
        }
        
        // FIX: Route manual signups directly to the Login page!
        navigate('/login');
      }
    } catch (unexpectedError) {
      console.error("Unexpected error:", unexpectedError);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        // Google signups go straight to the dashboard!
        redirectTo: `${window.location.origin}/dashboard` 
      }
    });
    if (err) { setError(err.message); setGoogleLoading(false); }
  };

  const inputStyle = {
    backgroundColor: '#0a0e1a', border: '1px solid #374151', borderRadius: '8px',
    color: '#dfe2f3', padding: '12px 16px', fontSize: '14px', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'monospace'
  };

  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ textAlign: 'center' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 10px', display: 'block' }}>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" fill="#00c853" opacity="0.2"/>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5"/>
            <path d="M9 12L11 14L15 10" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{ color: '#3fe56c', fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px', fontFamily: 'monospace' }}>WebGuard</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Create your account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(255,180,171,0.1)', border: '1px solid #ffb4ab40', borderRadius: '8px', padding: '10px 14px', color: '#ffb4ab', fontSize: '13px', fontFamily: 'monospace' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input type="text" placeholder="Oyebode Samuel" value={fullName} onChange={e => setFullName(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input type="email" placeholder="samuel@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
            <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required style={inputStyle} />
          </div>
          <button type="submit" disabled={loading}
            style={{ backgroundColor: '#00c853', color: '#000', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', boxShadow: '0 0 12px rgba(0,200,83,0.3)', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#1f2937' }} />
          <span style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#1f2937' }} />
        </div>

        <button onClick={handleGoogleSignup} disabled={googleLoading}
          style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#dfe2f3', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: googleLoading ? 0.7 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#3fe56c', textDecoration: 'none', fontWeight: '600' }}>Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}