import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UpiQrCard } from '../components/UpiQrCard';
import { AuthModal } from '../components/AuthModal';
import { setPageSEO } from '../utils/seo';
import {
  ArrowRight,
  ShieldAlert,
  Percent,
  Zap,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Code2,
  Globe2,
  PenTool,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Interactive sandbox state
  const [demoTitle, setDemoTitle] = useState('Free JSON Tools & API');
  const [demoUpi, setDemoUpi] = useState('myproject@upi');
  const [demoAmount, setDemoAmount] = useState('100');
  const [demoNote] = useState('Server funding for Free JSON API');

  // FAQ Accordion active state
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    setPageSEO({
      title: 'SupportUPI — Free UPI QR Generator | Accept Direct UPI Payments With 0% Fee',
      description:
        'Create a direct UPI support page & dynamic QR code for your website, open-source project, free tool, or portfolio. 0% gateway fees, instant bank settlement, no GSTIN or business registration needed.',
      canonicalUrl: 'https://supportupi.web.app/',
    });
  }, []);

  const handleStart = () => {
    if (user) {
      navigate('/dashboard/create');
    } else {
      setIsAuthOpen(true);
    }
  };

  const faqs = [
    {
      q: 'How can I accept UPI payments on my website without a payment gateway?',
      a: 'SupportUPI creates a dedicated, clean support page for you (supportupi.web.app/your-project) with a verified UPI QR code. Your visitors scan the QR code using Google Pay, PhonePe, Paytm, or BHIM. The payment is transferred directly from their bank to your bank account via the NPCI UPI protocol with zero intermediaries.',
    },
    {
      q: 'Is SupportUPI really 100% free with 0% gateway fee?',
      a: 'Yes, 100% zero fees. Unlike conventional payment gateways (like Razorpay, Cashfree, or Stripe) which deduct 2% to 3% plus 18% GST on every tip, SupportUPI does not sit in the middle of transactions. You receive 100% of the funds directly to your bank account with instant settlement.',
    },
    {
      q: 'Do I need a GST number, registered company, or KYC documents?',
      a: 'No! You do not need a GSTIN, company incorporation, or cumbersome merchant documentation. SupportUPI works with any personal or business UPI ID (VPA) from any Indian bank or UPI app.',
    },
    {
      q: 'Which UPI apps are supported by the generated QR code?',
      a: 'The QR codes follow the official NPCI UPI specifications and work with every Indian UPI app: Google Pay (GPay), PhonePe, Paytm, BHIM, Cred, Amazon Pay, Navi, WhatsApp Pay, and all mobile banking apps (SBI, HDFC, ICICI, Axis, Kotak, etc.).',
    },
    {
      q: 'How do I add SupportUPI to my website or GitHub README?',
      a: 'After creating your page in 60 seconds, you get a clean URL like supportupi.web.app/my-tool. You can add a button on your website, include it in your footer ("Support this tool"), or place a badge in your GitHub repository README.',
    },
    {
      q: 'Can donors enter a custom amount?',
      a: 'Yes! You can specify a suggested default amount (or leave it blank), and visitors can freely customize the amount or scan directly to enter any value inside their UPI app.',
    },
  ];

  return (
    <div className="main-content" style={{ paddingBottom: '4rem' }}>
      {/* Editorial Hero Section */}
      <section className="hero-grid">
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge badge-accent">
              <Percent size={13} />
              0% Gateway Fees · Zero Middlemen · Instant Settlement
            </span>
          </div>

          <h1 style={{ marginBottom: '1.25rem' }}>
            Accept Direct UPI Payments on Your Website.{' '}
            <span style={{ color: 'var(--accent)', textDecoration: 'underline', textDecorationThickness: '3px' }}>
              Zero Gateway Cuts.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              color: 'var(--text-muted)',
              marginBottom: '2rem',
              maxWidth: '540px',
              lineHeight: 1.6,
            }}
          >
            Tired of payment aggregators charging 2–3% fees, demanding business registration & GSTIN, or holding your payouts?
            SupportUPI gives you a custom <strong>supportupi.web.app/{'{your-title}'}</strong> page with clean, instant UPI QR codes.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleStart}
              className="btn btn-primary btn-lg"
              style={{ width: 'min(100%, 260px)' }}
            >
              <span>Create Your Support URL</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="#sandbox"
              className="btn btn-outline btn-lg"
              style={{ width: 'min(100%, 220px)' }}
            >
              Try Live Preview
            </a>
          </div>

          {/* Value Props Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '1.25rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
            }}
          >
            <div>
              <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>
                ₹0.00
              </strong>
              Platform & Transaction Fee
            </div>
            <div>
              <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>
                100%
              </strong>
              Direct to your Bank
            </div>
            <div>
              <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>
                Instant
              </strong>
              No T+3 Day Settlement Delay
            </div>
          </div>
        </div>

        {/* Live Hero QR Card */}
        <div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                right: '12px',
                zIndex: 2,
              }}
            >
              <span className="badge badge-neutral" style={{ background: '#141413', color: '#FAF8F5' }}>
                Live Example
              </span>
            </div>
            <UpiQrCard
              upiId="9159228513@upi"
              payeeName="Sitheswar"
              creatorTitle="SupportUPI"
              defaultAmount="150"
              note="Help keep servers running"
              showAmountEditor={true}
            />
          </div>
        </div>
      </section>

      {/* Supported UPI Apps Showcase */}
      <section style={{ margin: '3rem 0', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Works with every Indian UPI App
        </p>
        <div className="apps-ribbon">
          <span className="app-badge">Google Pay</span>
          <span className="app-badge">PhonePe</span>
          <span className="app-badge">Paytm</span>
          <span className="app-badge">BHIM UPI</span>
          <span className="app-badge">Cred</span>
          <span className="app-badge">Amazon Pay</span>
          <span className="app-badge">Navi</span>
          <span className="app-badge">Any Bank App (SBI, HDFC, ICICI, Axis)</span>
        </div>
      </section>

      {/* Comparison: The Problem with Traditional Gateways */}
      <section style={{ margin: '4.5rem 0', borderTop: '1px solid var(--border)', paddingTop: '3.5rem' }}>
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>
            The Problem We Solve
          </span>
          <h2 style={{ marginBottom: '0.75rem' }}>Why payment gateways fail free tools & independent creators</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            If you run a free utility, open-source repository, portfolio, or community website in India, setting up payment aggregators is unnecessarily painful and expensive.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.5rem',
          }}
        >
          <div className="card" style={{ background: 'var(--bg-subtle)' }}>
            <div style={{ color: 'var(--danger)', marginBottom: '0.75rem' }}>
              <ShieldAlert size={26} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>Traditional Gateways (Razorpay / Stripe)</h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.75 }}>
              <li>Requires formal business registration, GSTIN, and merchant KYC</li>
              <li>Deducts 2% to 3% + 18% GST fee per tip or donation</li>
              <li>Payouts withheld for T+2 or T+3 business days</li>
              <li>Risk of sudden account freeze or merchant dashboard compliance lockouts</li>
            </ul>
          </div>

          <div className="card" style={{ border: '2px solid var(--accent)' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>
              <Zap size={26} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>SupportUPI (Direct Peer-to-Merchant)</h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', fontSize: '0.925rem', lineHeight: 1.75 }}>
              <li><strong>Zero fees forever</strong> — direct NPCI UPI protocol transfer</li>
              <li><strong>Instant bank deposit</strong> — funds arrive immediately in your bank account</li>
              <li><strong>No business registration needed</strong> — works with any personal or merchant UPI ID</li>
              <li><strong>Clean custom URL</strong> — <code>supportupi.web.app/{'{title}'}</code> ready to share</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works in 3 Steps */}
      <section style={{ margin: '4.5rem 0', borderTop: '1px solid var(--border)', paddingTop: '3.5rem' }}>
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>
            Quick Setup
          </span>
          <h2 style={{ marginBottom: '0.75rem' }}>How to accept direct UPI support in 3 simple steps</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Get your live zero-fee support page online in less than 60 seconds.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.5rem',
          }}
        >
          <div className="card">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                marginBottom: '1rem',
                border: '1px solid var(--border)',
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Claim Your Custom Slug</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Pick a unique URL like <code>supportupi.web.app/my-tool</code> that matches your project name.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                marginBottom: '1rem',
                border: '1px solid var(--border)',
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Add Your UPI ID</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Enter any personal or business UPI VPA. Set an optional suggested donation amount and custom message.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                marginBottom: '1rem',
                border: '1px solid var(--border)',
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Embed & Collect</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Place your link on your website, GitHub README badge, newsletter, or social bio to receive 100% of tips.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audiences & Use Cases */}
      <section style={{ margin: '4.5rem 0', borderTop: '1px solid var(--border)', paddingTop: '3.5rem' }}>
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>
            Built For Creators
          </span>
          <h2 style={{ marginBottom: '0.75rem' }}>Who is SupportUPI designed for?</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Empowering builders across India to monetize free services without corporate gatekeeping.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '1.25rem',
          }}
        >
          <div className="card">
            <div style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>
              <Code2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Open Source Developers</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Add a "Support via UPI" badge to your GitHub repository README so users in India can sponsor your libraries.
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>
              <Globe2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Free Web Utilities & APIs</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              If you host free formatters, calculators, converters, or APIs, let grateful users cover your server bills.
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>
              <PenTool size={24} />
            </div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Writers & Bloggers</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              A clean "Buy Me a Chai" Indian alternative for independent journalists, tech bloggers, and tutorial authors.
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Freelancers & Designers</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Share a branded support or advance invoice payment link without paying gateway interchange charges.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Section (Mobile-First) */}
      <section id="sandbox" style={{ margin: '4.5rem 0', borderTop: '1px solid var(--border)', paddingTop: '3.5rem' }}>
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="badge badge-accent">Interactive Sandbox</span>
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Test your support card in real-time</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Type your UPI ID and title below to see how your QR code and public support page dynamically render.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Controls */}
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>Card Customizer</h3>

            <div className="form-group">
              <label className="form-label">Support Page Title</label>
              <input
                type="text"
                value={demoTitle}
                onChange={(e) => setDemoTitle(e.target.value)}
                className="form-input"
                placeholder="e.g. Free Audio Compressor"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your UPI ID (VPA)</label>
              <input
                type="text"
                value={demoUpi}
                onChange={(e) => setDemoUpi(e.target.value)}
                className="form-input font-mono"
                placeholder="e.g. yourname@okaxis"
              />
              <span className="form-helper">Works with GPay, PhonePe, Paytm, or any bank UPI ID</span>
            </div>

            <div className="form-group">
              <label className="form-label">Suggested Amount (₹)</label>
              <input
                type="number"
                value={demoAmount}
                onChange={(e) => setDemoAmount(e.target.value)}
                className="form-input font-mono"
                placeholder="Leave blank for free-form"
              />
              <span className="form-helper">Donors can also edit this freely on your page</span>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={handleStart}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <span>Claim supportupi.web.app/{demoTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'my-url'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Sandbox Live Preview */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time rendering
            </div>
            <UpiQrCard
              upiId={demoUpi}
              payeeName={demoTitle}
              creatorTitle={demoTitle}
              defaultAmount={demoAmount}
              note={demoNote}
              showAmountEditor={true}
            />
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section - High Search Intent */}
      <section style={{ margin: '4.5rem 0', borderTop: '1px solid var(--border)', paddingTop: '3.5rem' }}>
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>
            <HelpCircle size={12} />
            Common Questions
          </span>
          <h2 style={{ marginBottom: '0.75rem' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Everything you need to know about accepting direct, fee-free UPI payments.
          </p>
        </div>

        <div style={{ maxWidth: '780px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="faq-item">
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} style={{ flexShrink: 0 }} />}
                </button>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem',
          textAlign: 'center',
          marginTop: '3.5rem',
        }}
      >
        <h2 style={{ marginBottom: '0.75rem' }}>Ready to collect direct support for your project?</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
          Sign in, register your unique title slug, and start receiving 100% direct tips to your bank account in 60 seconds.
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="btn btn-primary btn-lg"
          style={{ width: 'min(100%, 280px)' }}
        >
          <span>Get Started with SupportUPI</span>
          <ArrowRight size={18} />
        </button>
      </section>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
}
