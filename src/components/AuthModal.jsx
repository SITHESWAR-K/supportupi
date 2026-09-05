import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onSuccess }) {
  const { signInWithGoogle, signInWithEmail, registerWithEmail, signInGuest } = useAuth();
  const [tab, setTab] = useState('google'); // 'google' | 'email' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Google Sign In error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Email sign in error:', err);
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await registerWithEmail(email, password, displayName);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInGuest();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Guest login error:', err);
      setError(err.message || 'Failed to sign in as guest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.35rem' }}>Creator Sign In</h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Manage your support pages and URL slugs
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: 'var(--radius-sm)' }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1.25rem',
            gap: '0.5rem',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => { setTab('google'); setError(''); }}
            className={`btn-ghost btn-sm ${tab === 'google' ? 'active' : ''}`}
            style={{
              borderBottom: tab === 'google' ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: 0,
              fontWeight: tab === 'google' ? 700 : 500,
              color: tab === 'google' ? 'var(--text-main)' : 'var(--text-muted)',
            }}
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => { setTab('email'); setError(''); }}
            className={`btn-ghost btn-sm ${tab === 'email' ? 'active' : ''}`}
            style={{
              borderBottom: tab === 'email' ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: 0,
              fontWeight: tab === 'email' ? 700 : 500,
              color: tab === 'email' ? 'var(--text-main)' : 'var(--text-muted)',
            }}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`btn-ghost btn-sm ${tab === 'register' ? 'active' : ''}`}
            style={{
              borderBottom: tab === 'register' ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: 0,
              fontWeight: tab === 'register' ? 700 : 500,
              color: tab === 'register' ? 'var(--text-main)' : 'var(--text-muted)',
            }}
          >
            Register
          </button>
        </div>

        {tab === 'google' && (
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="btn btn-outline"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                border: '1px solid var(--border-strong)',
                marginBottom: '1.25rem',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div style={{ textAlign: 'center', margin: '1rem 0', position: 'relative' }}>
              <div style={{ borderTop: '1px solid var(--border)' }} />
              <span
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--surface)',
                  padding: '0 0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', color: 'var(--text-muted)' }}
            >
              Continue as Anonymous Guest
            </button>
          </div>
        )}

        {tab === 'email' && (
          <form onSubmit={handleEmailSignIn}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In with Email'}
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleEmailRegister}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Turner"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
