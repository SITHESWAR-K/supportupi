import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode, ShieldCheck, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

export function UpiQrCard({
  upiId = '',
  payeeName = '',
  defaultAmount = '',
  note = '',
  creatorTitle = '',
  showAmountEditor = true,
  className = '',
}) {
  const [amount, setAmount] = useState(defaultAmount ? String(defaultAmount) : '');
  const [copied, setCopied] = useState(false);

  // Quick donation suggestions
  const quickAmounts = useMemo(() => {
    const base = [50, 100, 200, 500];
    const def = Number(defaultAmount);
    if (def && !base.includes(def)) {
      return [def, ...base.filter((a) => a !== def)].sort((a, b) => a - b).slice(0, 4);
    }
    return base;
  }, [defaultAmount]);

  // Construct NPCI standard upi://pay URI
  const upiUri = useMemo(() => {
    const cleanUpi = (upiId || '').trim();
    if (!cleanUpi) return '';

    const params = new URLSearchParams();
    params.set('pa', cleanUpi);
    params.set('pn', (payeeName || creatorTitle || 'Creator').trim());
    params.set('cu', 'INR');

    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      params.set('am', numAmount.toFixed(2));
    }

    if (note && note.trim()) {
      params.set('tn', note.trim());
    }

    return `upi://pay?${params.toString()}`;
  }, [upiId, payeeName, creatorTitle, amount, note]);

  const handleCopyUpi = async () => {
    if (!upiId) return;
    try {
      await navigator.clipboard.writeText(upiId.trim());
      setCopied(true);
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#C85A32', '#1E5E3A', '#141413'],
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy UPI ID:', err);
    }
  };

  const handleQuickAmount = (val) => {
    setAmount(String(val));
  };

  const handleClearAmount = () => {
    setAmount('');
  };

  return (
    <div className={`card ${className}`} style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            <QrCode size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>Scan & Support</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Direct · Zero Gateway Cut</div>
          </div>
        </div>
        <span className="badge badge-success" style={{ flexShrink: 0 }}>
          <ShieldCheck size={12} />
          Direct UPI
        </span>
      </div>

      {/* QR Code Container */}
      <div className="qr-container" style={{ width: '100%', marginBottom: '1.25rem' }}>
        <div className="qr-code-frame">
          {upiUri ? (
            <QRCodeSVG
              value={upiUri}
              size={195}
              level="M"
              includeMargin={true}
              style={{ display: 'block', maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
            />
          ) : (
            <div
              style={{
                width: '195px',
                height: '195px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F6F5F2',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                textAlign: 'center',
                padding: '1rem',
              }}
            >
              Enter a valid UPI ID to generate QR
            </div>
          )}
        </div>

        {/* Amount display badge below QR */}
        <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
          {amount && parseFloat(amount) > 0 ? (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#141413' }}>
              ₹{parseFloat(amount).toLocaleString('en-IN')}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#66635F' }}>
              Any amount (scan to enter amount in app)
            </div>
          )}
        </div>
      </div>

      {/* 1-Tap Copy UPI ID Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 0.85rem',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '1rem',
          gap: '0.5rem',
        }}
      >
        <div style={{ overflow: 'hidden', minWidth: 0 }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Recipient UPI ID
          </div>
          <div
            className="font-mono"
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: 'var(--text-main)',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {upiId || 'not-configured@upi'}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyUpi}
          className="btn btn-outline btn-sm"
          style={{
            borderColor: copied ? 'var(--success)' : 'var(--border)',
            color: copied ? 'var(--success)' : 'var(--text-main)',
            flexShrink: 0,
            padding: '0.4rem 0.75rem',
          }}
          title="Copy UPI ID"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile helper tip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.775rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          background: 'var(--surface)',
          padding: '0.4rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px dashed var(--border)',
        }}
      >
        <Smartphone size={14} style={{ flexShrink: 0, color: 'var(--accent)' }} />
        <span>Visiting on mobile? Tap <strong>Copy</strong> and paste into GPay / PhonePe / Paytm.</span>
      </div>

      {/* Amount Editor (if enabled) */}
      {showAmountEditor && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Adjust Amount (₹)
            </label>
            {amount && (
              <button
                type="button"
                onClick={handleClearAmount}
                className="btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
            <span
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--text-muted)',
              }}
            >
              ₹
            </span>
            <input
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="form-input font-mono"
              style={{ paddingLeft: '2rem', fontSize: '1rem', fontWeight: 600 }}
            />
          </div>

          {/* Quick amount buttons */}
          <div className="amount-pills">
            {quickAmounts.map((qVal) => (
              <button
                key={qVal}
                type="button"
                className={`amount-pill ${Number(amount) === qVal ? 'active' : ''}`}
                onClick={() => handleQuickAmount(qVal)}
              >
                ₹{qVal}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Note info if provided */}
      {note && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.6rem 0.75rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--accent)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            wordBreak: 'break-word',
          }}
        >
          <strong style={{ color: 'var(--text-main)' }}>Transaction Note:</strong> {note}
        </div>
      )}

      {/* App compatibility badge */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          lineHeight: 1.4,
        }}
      >
        Compatible with <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, <strong>BHIM</strong>, and all UPI apps.
      </div>
    </div>
  );
}
