import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Heart, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span className="brand-icon" style={{ width: '22px', height: '22px', fontSize: '0.75rem' }}>
            <QrCode size={13} />
          </span>
          <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>SupportUPI</strong>
          <span style={{ fontSize: '0.825rem' }}>— Free direct UPI QR payment pages for creators & tools in India.</span>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
          <Link to="/dashboard/create" style={{ color: 'var(--text-muted)' }}>Create URL</Link>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)' }}>
            <ShieldCheck size={14} />
            0% Gateway Fee
          </span>
        </div>
      </div>
    </footer>
  );
}
