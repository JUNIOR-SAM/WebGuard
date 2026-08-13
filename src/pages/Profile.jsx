import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ full_name: '', email: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate('/login'); return; }
      setUser(data.user);
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (prof) setProfile({ full_name: prof.full_name || '', email: data.user.email });
      else setProfile({ full_name: data.user.user_metadata?.full_name || '', email: data.user.email });
    };
    getProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    const { error: err } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: profile.full_name, email: profile.email });
    if (err) setError(err.message);
    else setMessage('Profile updated successfully!');
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) setError(err.message);
    else { setMessage('Password changed successfully!'); setNewPassword(''); setConfirmPassword(''); }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const inputStyle = { backgroundColor: '#0a0e1a', border: '1px solid #374151', borderRadius: '8px', color: '#dfe2f3', padding: '11px 14px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'monospace' };
  const labelStyle = { color: '#6b7280', fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' };

  const NAV = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <div style={{ backgroundColor: '#0a0e1a', minHeight: '100vh', display: 'flex', fontFamily: 'Geist, sans-serif', color: '#dfe2f3' }}>
      <style>{`
        @media (max-width: 768px) { .prof-sidebar { display: none !important; } .prof-main { margin-left: 0 !important; } }
        @media (min-width: 769px) { .prof-mob { display: none !important; } }
      `}</style>

      {/* Desktop Sidebar */}
      <nav className="prof-sidebar" style={{ width: '220px', minHeight: '100vh', backgroundColor: '#111827', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', padding: '20px 12px', position: 'fixed', top: 0, left: 0, zIndex: 99 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', padding: '0 12px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" fill="#00c853" opacity="0.2"/>
            <path d="M12 2L3 6V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V6L12 2Z" stroke="#00c853" strokeWidth="1.5"/>
            <path d="M9 12L11 14L15 10" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ color: '#3fe56c', fontWeight: 'bold', fontSize: '14px', fontFamily: 'monospace' }}>WebGuard</div>
            <div style={{ color: '#6b7280', fontSize: '10px', fontFamily: 'monospace' }}>Enterprise Security</div>
          </div>
        </div>
        <div style={{ height: '1px', backgroundColor: '#1f2937', margin: '12px 0' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV.map((link, i) => (
            <button key={i} onClick={() => navigate(link.path)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', textAlign: 'left', width: '100%', backgroundColor: link.label === 'Profile' ? '#00c853' : 'transparent', color: link.label === 'Profile' ? '#000' : '#bbcbb8', fontWeight: link.label === 'Profile' ? 'bold' : 'normal' }}>
              {link.label}
            </button>
          ))}
        </div>
        <div style={{ height: '1px', backgroundColor: '#1f2937', margin: '12px 0' }} />
        <button onClick={() => setLogoutModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', backgroundColor: 'transparent', color: '#bbcbb8', width: '100%' }}>
          Logout
        </button>
      </nav>

      {/* Mobile Overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 97 }} />}

      {/* Main */}
      <main className="prof-main" style={{ marginLeft: '220px', flex: 1, padding: '24px', overflowY: 'auto' }}>

        {/* Mobile bar */}
        <div className="prof-mob" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: '1px solid #374151', color: '#dfe2f3', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>☰</button>
          <span style={{ color: '#3fe56c', fontWeight: 'bold', fontFamily: 'monospace' }}>WebGuard</span>
          <div style={{ width: 40 }} />
        </div>

        <h2 style={{ color: '#dfe2f3', fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', margin: '0 0 24px' }}>Profile Settings</h2>

        {message && <div style={{ backgroundColor: 'rgba(63,229,108,0.1)', border: '1px solid #3fe56c40', borderRadius: '8px', padding: '12px 16px', color: '#3fe56c', fontSize: '13px', fontFamily: 'monospace', marginBottom: '16px' }}>✓ {message}</div>}
        {error && <div style={{ backgroundColor: 'rgba(255,180,171,0.1)', border: '1px solid #ffb4ab40', borderRadius: '8px', padding: '12px 16px', color: '#ffb4ab', fontSize: '13px', fontFamily: 'monospace', marginBottom: '16px' }}>⚠ {error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          {/* Profile Info */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ color: '#dfe2f3', fontSize: '16px', fontWeight: 'bold', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#3fe56c" strokeWidth="1.5"/>
                <path d="M4 20C4 17 7.58 15 12 15C16.42 15 20 17 20 20" stroke="#3fe56c" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Personal Information
            </h3>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', backgroundColor: '#0a0e1a', borderRadius: '8px', border: '1px solid #1f2937' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#00c853', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold', color: '#000', fontFamily: 'monospace', flexShrink: 0 }}>
                {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ color: '#dfe2f3', fontWeight: 'bold', fontSize: '15px' }}>{profile.full_name || 'User'}</div>
                <div style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace' }}>{profile.email}</div>
                <div style={{ color: '#3fe56c', fontSize: '11px', fontFamily: 'monospace', marginTop: '2px' }}>● Active Account</div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} placeholder="Your full name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={profile.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
                <p style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'monospace', margin: '4px 0 0' }}>Email cannot be changed</p>
              </div>
              <button type="submit" disabled={loading}
                style={{ backgroundColor: '#00c853', color: '#000', fontWeight: 'bold', padding: '11px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ color: '#dfe2f3', fontSize: '16px', fontWeight: 'bold', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#3fe56c" strokeWidth="1.5"/>
                <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="#3fe56c" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Change Password
            </h3>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
              </div>
              <button type="submit" disabled={loading}
                style={{ backgroundColor: '#1f2937', color: '#dfe2f3', fontWeight: 'bold', padding: '11px', borderRadius: '8px', border: '1px solid #374151', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ color: '#dfe2f3', fontSize: '16px', fontWeight: 'bold', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#3fe56c" strokeWidth="1.5"/>
                <path d="M12 8V12" stroke="#3fe56c" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#3fe56c"/>
              </svg>
              Account Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Account Status', value: '● Active', color: '#3fe56c' },
                { label: 'Plan', value: 'Free Tier', color: '#dfe2f3' },
                { label: 'Member Since', value: user ? new Date(user.created_at).toLocaleDateString() : '—', color: '#dfe2f3' },
                { label: 'Last Sign In', value: user ? new Date(user.last_sign_in_at).toLocaleDateString() : '—', color: '#dfe2f3' },
                { label: 'Total Scans', value: '124', color: '#dfe2f3' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #1f2937' : 'none' }}>
                  <span style={{ color: '#6b7280', fontSize: '13px', fontFamily: 'monospace' }}>{item.label}</span>
                  <span style={{ color: item.color, fontSize: '13px', fontFamily: 'monospace', fontWeight: 'bold' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Danger Zone */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(255,180,171,0.05)', border: '1px solid #ffb4ab20', borderRadius: '8px' }}>
              <h4 style={{ color: '#ffb4ab', fontSize: '13px', fontFamily: 'monospace', margin: '0 0 8px' }}>⚠ Danger Zone</h4>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 12px' }}>Once you log out, you will need your credentials to access your account again.</p>
              <button onClick={() => setLogoutModal(true)}
                style={{ backgroundColor: 'transparent', border: '1px solid #ffb4ab40', color: '#ffb4ab', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace' }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {logoutModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '28px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ color: '#dfe2f3', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>Sign Out?</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px' }}>Are you sure you want to log out of WebGuard?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setLogoutModal(false)} style={{ flex: 1, backgroundColor: '#1f2937', border: '1px solid #374151', color: '#dfe2f3', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontFamily: 'monospace' }}>Cancel</button>
              <button onClick={handleLogout} style={{ flex: 1, backgroundColor: '#ffb4ab', border: 'none', color: '#000', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}