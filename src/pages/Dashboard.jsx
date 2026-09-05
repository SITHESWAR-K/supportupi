import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserSupportPages, deleteSupportPage } from '../services/pageService';
import { setPageSEO } from '../utils/seo';
import {
  Plus,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setPageSEO({
      title: 'Creator Dashboard',
      description: 'Manage your direct UPI support pages and links.',
    });
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchPages();
    }
  }, [user, authLoading, navigate]);

  const fetchPages = async () => {
    setLoading(true);
    setError('');
    try {
      const userPages = await getUserSupportPages(user.uid);
      setPages(userPages);
    } catch (err) {
      console.error('Error loading pages:', err);
      setError('Could not load your support pages. Please check Firestore setup or rules.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (slug, id) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDelete = async (slugKey, title) => {
    if (!window.confirm(`Are you sure you want to delete the support page "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(slugKey);
    try {
      await deleteSupportPage(slugKey, user.uid);
      setPages((prev) => prev.filter((p) => p.id !== slugKey && p.slugKey !== slugKey));
    } catch (err) {
      console.error('Failed to delete page:', err);
      alert(err.message || 'Failed to delete page');
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', margin: 0 }}>My Support Pages</h1>
            <span className="badge badge-accent font-mono">{pages.length} Active</span>
          </div>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.925rem' }}>
            Manage the direct UPI donation links for your websites and projects.
          </p>
        </div>

        <Link to="/dashboard/create" className="btn btn-primary" style={{ width: 'min(100%, 200px)' }}>
          <Plus size={16} />
          <span>Create New Page</span>
        </Link>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {pages.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: ' clamp(2.5rem, 6vw, 4rem) 1.25rem',
            background: 'var(--surface)',
            border: '2px dashed var(--border)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--accent)',
            }}
          >
            <QrCode size={28} />
          </div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No support pages created yet</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
            Create your first page with your project title and UPI ID. You will get a sharable link like{' '}
            <code className="font-mono">supportupi.web.app/your-title</code> to put on your website!
          </p>
          <Link to="/dashboard/create" className="btn btn-primary">
            <Plus size={16} />
            <span>Create Your First Page</span>
          </Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {pages.map((page) => {
            const displaySlug = page.slug || page.slugKey;
            const isCopied = copiedId === page.id;
            const isDeleting = deletingId === page.id;

            return (
              <div
                key={page.id}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: isDeleting ? 0.4 : 1,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, wordBreak: 'break-word', lineHeight: 1.3 }}>
                      {page.title}
                    </h3>
                    {page.defaultAmount && (
                      <span className="badge badge-neutral font-mono" style={{ flexShrink: 0 }}>
                        ₹{page.defaultAmount}
                      </span>
                    )}
                  </div>

                  {page.description ? (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                      }}
                    >
                      {page.description}
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-faint)', fontStyle: 'italic', marginBottom: '1rem' }}>
                      No description provided.
                    </p>
                  )}

                  {/* URL Slug pill with Copy */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)' }}>/{displaySlug}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(displaySlug, page.id)}
                      className="btn-ghost btn-sm"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flexShrink: 0 }}
                      title="Copy Public Link"
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} style={{ color: 'var(--success)' }} />
                          <span style={{ color: 'var(--success)' }}>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', wordBreak: 'break-all' }}>
                    <strong>UPI ID:</strong> <span className="font-mono">{page.upiId}</span>
                  </div>
                </div>

                {/* Actions footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <Link
                    to={`/${displaySlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <ExternalLink size={13} />
                    <span>View Page</span>
                  </Link>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <Link
                      to={`/dashboard/edit/${page.id}`}
                      className="btn btn-ghost btn-sm"
                      title="Edit this page"
                      style={{ padding: '0.35rem 0.6rem' }}
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(page.id, page.title)}
                      disabled={isDeleting}
                      className="btn btn-danger-ghost btn-sm"
                      title="Delete this page"
                      style={{ padding: '0.35rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
