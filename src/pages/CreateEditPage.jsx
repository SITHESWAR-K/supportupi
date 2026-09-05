import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  createSupportPage,
  updateSupportPage,
  getSupportPageBySlug,
  checkSlugAvailability,
  sanitizeSlug,
  validateUpiId,
} from '../services/pageService';
import { UpiQrCard } from '../components/UpiQrCard';
import { setPageSEO } from '../utils/seo';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Save,
  Eye,
  Edit3,
} from 'lucide-react';

export function CreateEditPage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams(); // if present, in edit mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [upiId, setUpiId] = useState('');
  const [defaultAmount, setDefaultAmount] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');

  // Mobile preview toggle (useful on small screens)
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'preview'

  // Validation & Availability state
  const [slugStatus, setSlugStatus] = useState({ state: 'idle', message: '' }); // 'idle' | 'checking' | 'available' | 'taken' | 'invalid'
  const [upiStatus, setUpiStatus] = useState({ valid: true, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-slug generation from title if not manually customized
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  useEffect(() => {
    setPageSEO({
      title: isEditMode ? 'Edit Support Page' : 'Create New Support Page',
      description: 'Configure your direct zero-fee UPI QR code recipient page and custom slug.',
    });
  }, [isEditMode]);

  // Initial Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Load existing data if edit mode
  useEffect(() => {
    if (isEditMode && user) {
      loadPageData();
    }
  }, [isEditMode, id, user]);

  const loadPageData = async () => {
    setPageLoading(true);
    setErrorMessage('');
    try {
      const page = await getSupportPageBySlug(id);
      if (!page) {
        setErrorMessage('Support page not found.');
        return;
      }
      if (page.ownerUid !== user.uid) {
        setErrorMessage('You do not have permission to edit this page.');
        return;
      }

      setTitle(page.title || '');
      setSlug(page.slug || page.slugKey || '');
      setUpiId(page.upiId || '');
      setDefaultAmount(page.defaultAmount ? String(page.defaultAmount) : '');
      setNote(page.note || '');
      setDescription(page.description || '');
      setIsSlugTouched(true);
    } catch (err) {
      console.error('Error fetching page for edit:', err);
      setErrorMessage('Failed to load page data.');
    } finally {
      setPageLoading(false);
    }
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugTouched) {
      const autoSlug = sanitizeSlug(val);
      setSlug(autoSlug);
    }
  };

  const handleSlugChange = (e) => {
    setIsSlugTouched(true);
    setSlug(e.target.value);
  };

  // Debounced check for slug availability
  useEffect(() => {
    const clean = sanitizeSlug(slug);
    if (!clean) {
      setSlugStatus({ state: 'idle', message: '' });
      return;
    }

    if (clean.length < 2) {
      setSlugStatus({ state: 'invalid', message: 'Slug must be at least 2 characters.' });
      return;
    }

    setSlugStatus({ state: 'checking', message: 'Checking availability...' });
    const timer = setTimeout(async () => {
      try {
        const available = await checkSlugAvailability(clean, isEditMode ? id : null);
        if (available) {
          setSlugStatus({
            state: 'available',
            message: `✓ Available: supportupi.web.app/${clean}`,
          });
        } else {
          setSlugStatus({
            state: 'taken',
            message: `✗ The slug "${clean}" is already taken by another creator.`,
          });
        }
      } catch (err) {
        console.error('Slug check failed', err);
        setSlugStatus({ state: 'available', message: `supportupi.web.app/${clean}` });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [slug, isEditMode, id]);

  // Validate UPI ID on change
  useEffect(() => {
    if (!upiId) {
      setUpiStatus({ valid: true, message: '' });
      return;
    }
    const isValid = validateUpiId(upiId);
    setUpiStatus({
      valid: isValid,
      message: isValid ? '' : 'Format should be username@bank (e.g. name@okhdfcbank)',
    });
  }, [upiId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanSlug = sanitizeSlug(slug);
    if (!cleanSlug) {
      setErrorMessage('Please provide a valid slug or title.');
      return;
    }

    if (slugStatus.state === 'taken') {
      setErrorMessage(`The slug "${cleanSlug}" is already taken. Please choose another.`);
      return;
    }

    if (!validateUpiId(upiId)) {
      setErrorMessage('Please enter a valid UPI ID (e.g. yourname@okhdfcbank).');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title || cleanSlug,
        slug: cleanSlug,
        upiId: upiId.trim(),
        defaultAmount: defaultAmount || null,
        note: note.trim(),
        description: description.trim(),
      };

      if (isEditMode) {
        await updateSupportPage(id, payload, user);
      } else {
        await createSupportPage(payload, user);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage(err.message || 'Failed to save support page.');
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading page details...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: '1.75rem' }}>
        <Link
          to="/dashboard"
          className="btn-ghost btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to My Pages</span>
        </Link>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', margin: 0 }}>
          {isEditMode ? 'Edit Support Page' : 'Create New Support Page'}
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: '0.35rem 0 0', fontSize: '0.925rem' }}>
          Configure your direct UPI recipient card and custom URL slug.
        </p>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '1rem',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mobile Tab Switcher: Form vs Preview on screens < 960px */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.5rem',
        }}
        className="mobile-only-tabs"
      >
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className={`btn btn-sm ${mobileTab === 'form' ? 'btn-solid' : 'btn-outline'}`}
        >
          <Edit3 size={14} />
          <span>Edit Form</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`btn btn-sm ${mobileTab === 'preview' ? 'btn-solid' : 'btn-outline'}`}
        >
          <Eye size={14} />
          <span>Preview QR Card</span>
        </button>
      </div>

      {/* Responsive Grid Layout */}
      <div className="create-edit-grid">
        {/* Form Column */}
        <div style={{ display: mobileTab === 'form' ? 'block' : undefined }}>
          <form onSubmit={handleSubmit} className="card">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                <span>Service / Website Title</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Free Audio Tools"
                className="form-input"
              />
              <span className="form-helper">The name of your free tool or service.</span>
            </div>

            {/* Responsive Slug (URL) */}
            <div className="form-group">
              <label className="form-label">
                <span>Custom URL Slug</span>
                <span className="form-label-optional">Unique per creator</span>
              </label>
              
              <div className="url-input-group">
                <span className="url-input-prefix">
                  supportupi.web.app/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="my-free-project"
                  className="form-input font-mono url-input-field"
                />
              </div>

              {/* Slug status message */}
              <div style={{ marginTop: '0.35rem' }}>
                {slugStatus.state === 'checking' && (
                  <span className="form-helper" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Loader2 size={12} className="animate-spin" /> Checking availability...
                  </span>
                )}
                {slugStatus.state === 'available' && (
                  <span style={{ fontSize: '0.775rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={13} /> {slugStatus.message}
                  </span>
                )}
                {slugStatus.state === 'taken' && (
                  <span style={{ fontSize: '0.775rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <XCircle size={13} /> {slugStatus.message}
                  </span>
                )}
              </div>
            </div>

            {/* UPI ID */}
            <div className="form-group">
              <label className="form-label">
                <span>Recipient UPI ID (VPA)</span>
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. creator@okhdfcbank"
                className="form-input font-mono"
              />
              {upiStatus.valid ? (
                <span className="form-helper">Funds will go directly to this bank account with 0% fee.</span>
              ) : (
                <span className="form-error">{upiStatus.message}</span>
              )}
            </div>

            {/* Default Amount */}
            <div className="form-group">
              <label className="form-label">
                <span>Default Amount (₹)</span>
                <span className="form-label-optional">Optional · Visitor can adjust freely</span>
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={defaultAmount}
                onChange={(e) => setDefaultAmount(e.target.value)}
                placeholder="e.g. 100"
                className="form-input font-mono"
              />
              <span className="form-helper">Pre-filled suggested amount on your support page.</span>
            </div>

            {/* Note */}
            <div className="form-group">
              <label className="form-label">
                <span>Transaction Note</span>
                <span className="form-label-optional">Optional</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Server hosting contribution"
                className="form-input"
              />
              <span className="form-helper">Encoded inside the UPI QR code note parameter.</span>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                <span>Description / Message to Donors</span>
                <span className="form-label-optional">Optional</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain why you built this free service and how donations help keep it online..."
                className="form-textarea"
              />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={submitting || slugStatus.state === 'taken'}
                className="btn btn-primary"
                style={{ flex: '1 1 180px' }}
              >
                <Save size={16} />
                <span>{submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Page'}</span>
              </button>

              <Link to="/dashboard" className="btn btn-outline" style={{ flex: '1 1 120px' }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div style={{ position: 'sticky', top: '5.5rem', display: mobileTab === 'preview' ? 'block' : undefined }}>
          <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
            <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
              Live Visitor Preview
            </span>
          </div>

          <UpiQrCard
            upiId={upiId || 'your-upi-id@bank'}
            payeeName={title || 'Creator'}
            creatorTitle={title || 'Your Free Service'}
            defaultAmount={defaultAmount}
            note={note}
            showAmountEditor={true}
          />
        </div>
      </div>
    </div>
  );
}
