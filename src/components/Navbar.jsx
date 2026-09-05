import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { Plus, LayoutDashboard, LogOut, User as UserIcon, QrCode, Menu, X } from 'lucide-react';

export function Navbar() {
  const { user, logOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header-nav">
        <div className="header-inner">
          <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
            <span className="brand-icon">
              <QrCode size={16} />
            </span>
            <span>SupportUPI</span>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              0% Fee
            </span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Nav Links & Actions */}
          <nav className={`nav-links ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={`btn btn-outline btn-sm ${location.pathname === '/dashboard' ? 'btn-solid' : ''}`}
                >
                  <LayoutDashboard size={14} />
                  <span>My Pages</span>
                </Link>

                <Link
                  to="/dashboard/create"
                  onClick={closeMobileMenu}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>New Page</span>
                </Link>

                <div
                  className="nav-user-profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingLeft: '0.5rem',
                    borderLeft: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border)',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <UserIcon size={16} />
                      </div>
                    )}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {user.displayName ? user.displayName.split(' ')[0] : 'Creator'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn-ghost btn-sm"
                    title="Sign Out"
                    style={{ padding: '0.35rem 0.5rem', color: 'var(--text-muted)' }}
                  >
                    <LogOut size={15} />
                    <span style={{ display: isMobileMenuOpen ? 'inline' : 'none' }}>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Create Support URL
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => navigate('/dashboard')}
      />
    </>
  );
}
