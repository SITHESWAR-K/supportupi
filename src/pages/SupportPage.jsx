import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSupportPageBySlug } from '../services/pageService';
import { UpiQrCard } from '../components/UpiQrCard';
import { setPageSEO } from '../utils/seo';
import {
  ShieldCheck,
  User,
  Heart,
  AlertCircle,
  QrCode,
  ArrowRight,
} from 'lucide-react';

export function SupportPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    setLoading(true);
    setNotFound(false);
    setError('');

    try {
      const data = await getSupportPageBySlug(slug);
      if (!data) {
        setNotFound(true);
        setPageSEO({
          title: `Page Not Found — SupportUPI`,
          description: `The requested support page could not be found.`,
        });
      } else {
        setPage(data);
        setPageSEO({
          title: `Support ${data.title} — Direct UPI (0% Fee)`,
          description: data.description || `Send direct, zero-fee support to ${data.title} via Google Pay, PhonePe, Paytm, or BHIM UPI.`,
          canonicalUrl: `https://supportupi.web.app/${slug}`,
        });
      }
    } catch (err) {
      console.error('Error fetching support page:', err);
      setError('Could not load this support page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading support page...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '5rem 1rem', maxWidth: '560px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--text-muted)',
          }}
        >
          <QrCode size={30} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', marginBottom: '0.75rem' }}>Support Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
          The support link <code className="font-mono">supportupi.web.app/{slug}</code> has not been claimed yet.
          If this is your project or website, you can claim this exact URL right now!
        </p>
        <Link to="/dashboard/create" className="btn btn-primary btn-lg">
          <span>Claim /{slug} Now</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '5rem 1rem', maxWidth: '480px' }}>
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={24} style={{ marginBottom: '0.5rem' }} />
          <div>{error}</div>
        </div>
        <button type="button" onClick={loadPage} className="btn btn-outline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ maxWidth: '880px', paddingBottom: '4.5rem' }}>
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', margin: '0.5rem 0 2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge badge-accent">
            <Heart size={12} fill="currentColor" />
            Support Free Service
          </span>
          <span className="badge badge-success">
            <ShieldCheck size={12} />
            0% Intermediary Cuts
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: '0.75rem', wordBreak: 'break-word' }}>
          {page.title}
        </h1>

        {/* Creator Attribution */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 0.85rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
            maxWidth: '100%',
          }}
        >
          {page.ownerPhoto ? (
            <img
              src={page.ownerPhoto}
              alt={page.ownerName}
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={12} />
            </div>
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Created by <strong style={{ color: 'var(--text-main)' }}>{page.ownerName || 'Creator'}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Description & QR Card */}
      <div className="support-grid">
        {/* Left: Message from creator */}
        {page.description && (
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Why Support {page.title}?</span>
            </h3>
            <div
              style={{
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {page.description}
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              <p style={{ margin: 0 }}>
                💡 100% of your contribution goes directly to the creator's bank account via NPCI UPI. No gateway takes a cut.
              </p>
            </div>
          </div>
        )}

        {/* Right: Live Interactive UPI QR Card */}
        <div style={{ margin: '0 auto', width: '100%', maxWidth: '420px' }}>
          <UpiQrCard
            upiId={page.upiId}
            payeeName={page.ownerName || page.title}
            creatorTitle={page.title}
            defaultAmount={page.defaultAmount}
            note={page.note}
            showAmountEditor={true}
          />
        </div>
      </div>

      {/* Powered by SupportUPI footer watermark */}
      <div style={{ textAlign: 'center', marginTop: '3.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
        <span>Do you build a free tool or website? </span>
        <Link to="/" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}>
          Create your own free UPI support page on SupportUPI
        </Link>
      </div>
    </div>
  );
}
