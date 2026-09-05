import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Key, Check, AlertCircle, X } from 'lucide-react';

export function FirebaseConfigNotice() {
  const { isConfigured, firebaseConfig, updateFirebaseConfig } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(firebaseConfig?.apiKey || '');
  const [appId, setAppId] = useState(firebaseConfig?.appId || '');
  const [success, setSuccess] = useState(false);

  // If already configured and modal is closed, don't show prompt
  if (isConfigured && !isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey) return;
    updateFirebaseConfig({ apiKey, appId });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* Small floating badge if config is missing */}
      {!isConfigured && (
        <aside
          aria-label="Configuration notice"
          style={{
            background: 'var(--accent-faint)',
            borderBottom: '1px solid var(--border)',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            color: 'var(--text-main)',
          }}
        >
          <span>
            ⚙️ <strong>Local Setup Notice:</strong> Add your Firebase Web API key to connect live Auth & Firestore.
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
          >
            Configure Key
          </button>
        </aside>
      )}

      {/* Configuration Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Firebase Web Config</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-ghost"
                style={{ padding: '0.25rem' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              When deployed to <code>supportupi.web.app</code>, Firebase Hosting injects this automatically.
              For local dev (localhost), paste your Firebase Web <code>apiKey</code> below:
            </p>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Firebase API Key</label>
                <input
                  type="text"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value.trim())}
                  placeholder="AIzaSy..."
                  className="form-input font-mono"
                />
              </div>

              <div className="form-group">
                <label className="form-label">App ID (Optional)</label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value.trim())}
                  placeholder="1:768765535383:web:..."
                  className="form-input font-mono"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {success ? 'Saved!' : 'Save Configuration'}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="btn btn-outline">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
