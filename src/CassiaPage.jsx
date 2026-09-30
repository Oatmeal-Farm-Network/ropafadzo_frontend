// CassiaPage.jsx — full-page Cassia customer success agent
// Guides users through account creation + subscription setup.
// Architecture mirrors SaigePage (Gemini, Redis + Firestore memory).
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';

// ── API config ────────────────────────────────────────────────────────────────
// Cassia lives on the same Python backend as Saige — strip "/saige" suffix to
// get the base URL, then append "/cassia".
const CASSIA_API = `${import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige'}/cassia`;
// oatmeal_main Node.js backend — for Stripe checkout
const OTF_API = import.meta.env.VITE_OTF_API_URL || 'http://localhost:3001';

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
  sage:        '#4A5C43',
  sageMid:     '#5D7356',
  sageBg:      '#EEF1EC',
  sageBorder:  '#C8D5C2',
  sageLight:   '#f5f7f4',
  white:       '#ffffff',
  text:        '#111827',
  textSec:     '#6b7280',
  border:      '#e5e7eb',
  green:       '#16a34a',
  greenBg:     '#dcfce7',
  red:         '#dc2626',
};

const TIER_LABELS  = { hobby: 'Hobby (Free)', starter: 'Starter', professional: 'Professional', business: 'Business', enterprise: 'Enterprise' };
const TIER_ANNUAL  = { starter: 700, professional: 1700, enterprise: 4100 };
const TIER_COLORS  = {
  hobby:        { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
  starter:      { bg: '#dcfce7', color: '#16a34a', border: '#86efac' },
  professional: { bg: '#f3e8ff', color: '#7c3aed', border: '#d8b4fe' },
  business:     { bg: '#f3e8ff', color: '#7c3aed', border: '#d8b4fe' },
  enterprise:   { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '0.6rem 0.9rem',
      background: C.sageBg, border: `1px solid ${C.sageBorder}`,
      borderRadius: 14, alignSelf: 'flex-start', width: 'fit-content' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: C.sage,
          display: 'inline-block',
          animation: `cassiaThink 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 8 }}>
      {!isUser && (
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.sage,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
          marginRight: 8, alignSelf: 'flex-end' }}>C</div>
      )}
      <div style={{
        maxWidth: '75%', padding: '0.6rem 0.9rem', borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        fontSize: '0.88rem', lineHeight: 1.55,
        background: isUser ? C.sage : C.sageBg,
        color: isUser ? '#fff' : C.text,
        border: isUser ? 'none' : `1px solid ${C.sageBorder}`,
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

// ── Checkout panel ────────────────────────────────────────────────────────────
function CheckoutPanel({ data, businessId, peopleId, onCancel }) {
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState('');
  const tc = TIER_COLORS[data.tier] || TIER_COLORS.starter;

  const handlePay = async () => {
    setPaying(true);
    setErr('');
    try {
      const annualPrice = data.annual_price || TIER_ANNUAL[data.tier] || 0;
      const res = await fetch(`${CASSIA_API}/checkout`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          tier:         data.tier,
          categories:   data.categories || [],
          lineItems:    data.line_items || [],
          monthlyTotal: data.monthly_total || 0,
          annualPrice,
          businessId:   businessId ? Number(businessId) : null,
          successUrl:   `${window.location.origin}/cassia?subscribed=1&BusinessID=${businessId}`,
          cancelUrl:    `${window.location.origin}/cassia`,
        }),
      });
      if (!res.ok) throw new Error('Could not create payment session.');
      const { stripeUrl } = await res.json();
      if (stripeUrl) {
        // Persist tier + business_type so the DISCOVERY_TRIGGER can read them
        // after Stripe redirects back to this page on a fresh load.
        localStorage.setItem('cassia_pending_tier',  data.tier || 'starter');
        localStorage.setItem('cassia_pending_btype', data.business_type || '');
        window.location.href = stripeUrl;
      } else {
        // Free plan or Stripe not configured — go straight to account
        navigate(`/account?PeopleID=${peopleId}&BusinessID=${businessId}&subscribed=1`);
      }
    } catch (e) {
      setErr(e.message);
      setPaying(false);
    }
  };

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.sageBorder}`, borderRadius: 14,
      padding: '1.25rem', marginTop: 16 }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.sage, textTransform: 'uppercase',
        letterSpacing: '0.06em', marginBottom: 10 }}>Your Plan</div>

      <span style={{ padding: '3px 12px', borderRadius: 12, fontSize: '0.78rem',
        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
        background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
        display: 'inline-block', marginBottom: 12 }}>
        {TIER_LABELS[data.tier] || data.tier}
      </span>

      {data.line_items?.length > 0 && (
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginBottom: 12 }}>
          {data.line_items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', fontSize: '0.83rem', color: C.text, marginBottom: 6, gap: 8 }}>
              <span style={{ flex: 1 }}>
                {item.name}
                {item.note && <span style={{ display: 'block', fontSize: '0.75rem', color: C.textSec }}>{item.note}</span>}
              </span>
              <span style={{ fontWeight: 600, color: item.price === 0 ? C.green : C.text, flexShrink: 0 }}>
                {item.price === 0 ? 'Included' : `$${Number(item.price).toLocaleString()}`}
              </span>
            </div>
          ))}
          {(() => {
            const annual = data.annual_price || TIER_ANNUAL[data.tier] || 0;
            const monthly = data.monthly_total || (annual / 12);
            return (
              <div style={{ borderTop: `1px solid ${C.sageBorder}`, paddingTop: 8, marginTop: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  fontWeight: 700, fontSize: '0.9rem', color: C.sage }}>
                  <span>Annual Total</span>
                  <span>{annual === 0 ? 'Free' : `$${Number(annual).toLocaleString()}/yr`}</span>
                </div>
                {annual > 0 && (
                  <div style={{ fontSize: '0.74rem', color: C.textSec, textAlign: 'right', marginTop: 2 }}>
                    ${monthly.toFixed(2)}/mo equivalent · billed annually
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {err && (
        <div style={{ fontSize: '0.78rem', color: C.red, marginBottom: 8 }}>{err}</div>
      )}

      {(() => {
        const annual = data.annual_price || TIER_ANNUAL[data.tier] || 0;
        return (
          <button onClick={handlePay} disabled={paying}
            style={{ width: '100%', padding: '0.7rem', background: C.sage, color: '#fff',
              border: 'none', borderRadius: 9, fontWeight: 700, fontSize: '0.9rem',
              cursor: paying ? 'not-allowed' : 'pointer', opacity: paying ? 0.7 : 1,
              marginBottom: 8 }}>
            {paying ? 'Processing…'
              : annual === 0
                ? 'Activate Free Plan →'
                : `Pay $${Number(annual).toLocaleString()}/yr →`}
          </button>
        );
      })()}
      <button onClick={onCancel}
        style={{ width: '100%', padding: '0.5rem', background: 'none',
          border: `1px solid ${C.border}`, borderRadius: 9, color: C.textSec,
          fontSize: '0.82rem', cursor: 'pointer' }}>
        ← Go back and adjust
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CassiaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const peopleId = localStorage.getItem('people_id') || localStorage.getItem('PeopleID') || '';

  // Detect post-Stripe return: /cassia?subscribed=1&BusinessID=123
  const subscribedParam  = searchParams.get('subscribed') === '1';
  const bizFromUrl       = searchParams.get('BusinessID') || null;

  const [threadId] = useState(() => `cassia_${crypto.randomUUID()}`);
  const [messages, setMessages] = useState(() =>
    subscribedParam
      ? [] // will be replaced by Cassia's discovery opener
      : [{ role: 'assistant', content: "Hi! I'm Cassia, your Oatmeal Farm Network guide. I can help you set up your organization account and find the right subscription plan for your operation. What type of business are you registering — farm, ranch, restaurant, or something else?" }]
  );
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');
  const [createdBusinessId, setCreatedBusinessId] = useState(bizFromUrl);
  const [checkoutData,      setCheckoutData]      = useState(null);

  const bottomRef          = useRef(null);
  const inputRef           = useRef(null);
  const discoveryTriggered = useRef(false);

  // After Stripe redirects back here, auto-send the discovery trigger once.
  useEffect(() => {
    if (!subscribedParam || !bizFromUrl || discoveryTriggered.current) return;
    discoveryTriggered.current = true;

    // Read and clear the tier/business_type saved just before Stripe redirect.
    const pendingTier  = localStorage.getItem('cassia_pending_tier')  || 'starter';
    const pendingBtype = localStorage.getItem('cassia_pending_btype') || '';
    localStorage.removeItem('cassia_pending_tier');
    localStorage.removeItem('cassia_pending_btype');

    setLoading(true);
    const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken') || '';
    fetch(`${CASSIA_API}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        user_input: [
          '[DISCOVERY_TRIGGER] Stripe checkout confirmed.',
          `BusinessID=${bizFromUrl}.`,
          `SubscriptionTier=${pendingTier}.`,
          pendingBtype ? `BusinessType=${pendingBtype}.` : '',
          'Please begin the discovery interview.',
        ].filter(Boolean).join(' '),
        thread_id:   threadId,
        business_id: bizFromUrl,
      }),
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`Cassia error ${r.status}`)))
      .then(data => {
        setMessages([{ role: 'assistant', content: data.response || '' }]);
      })
      .catch(e => setErr(e.message || 'Could not start discovery. Please refresh.'))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || loading) return;

    const nextMsgs = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMsgs);
    setInput('');
    setLoading(true);
    setErr('');

    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken') || '';
      const res = await fetch(`${CASSIA_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_input:  trimmed,
          thread_id:   threadId,
          business_id: createdBusinessId || undefined,
        }),
      });
      if (!res.ok) throw new Error(`Cassia responded with ${res.status}`);
      const data = await res.json();
      setMessages([...nextMsgs, { role: 'assistant', content: data.response || '' }]);
      if (data.action === 'account_created' && data.data?.business_id) {
        setCreatedBusinessId(data.data.business_id);
      }
      if (data.action === 'initiate_checkout' && data.data) {
        setCheckoutData(data.data);
      }
    } catch (e) {
      setErr(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, messages, threadId, createdBusinessId]);

  const handleSend    = () => sendMessage(input);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const isLoggedIn = !!(localStorage.getItem('access_token') || localStorage.getItem('AccessToken'));
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen font-sans">
        <Header />
        <div style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: C.sage, marginBottom: 12 }}>
            Sign in to continue
          </h2>
          <p style={{ color: C.textSec, marginBottom: 24 }}>
            You need to be signed in to set up your organization account.
          </p>
          <a href="/login" style={{ display: 'inline-block', padding: '0.7rem 1.5rem',
            background: C.sage, color: '#fff', borderRadius: 9, fontWeight: 700,
            textDecoration: 'none' }}>
            Sign In
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: C.sageLight }}>
      <PageMeta
        title="Set Up Your Account | Oatmeal Farm Network"
        description="Chat with Cassia to set up your organization account and choose the right subscription plan."
        noIndex
      />
      <Header />

      <style>{`
        @keyframes cassiaThink {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

        {/* Top bar */}
        <div style={{ padding: '0.65rem 1.5rem', background: '#fff',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.sage,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>C</div>
          <div>
            <div style={{ fontWeight: 700, color: C.sage, fontSize: '0.95rem', lineHeight: 1.2 }}>Cassia</div>
            <div style={{ fontSize: '0.7rem', color: C.textSec }}>Account Setup Guide</div>
          </div>
          {createdBusinessId && (
            <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 12,
              background: '#dcfce7', color: C.green, border: '1px solid #86efac',
              fontSize: '0.75rem', fontWeight: 700 }}>
              ✓ Account #{createdBusinessId} created
            </span>
          )}
          <a href="/accounts" style={{
            marginLeft: createdBusinessId ? '0.5rem' : 'auto',
            fontSize: '0.78rem', color: C.textSec, textDecoration: 'none',
          }}>
            ← My Accounts
          </a>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem',
          maxWidth: 820, width: '100%', margin: '0 auto', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column' }}>
          {messages.map((m, i) => <Bubble key={i} msg={m} />)}
          {loading && <ThinkingDots />}
          {checkoutData && (
            <CheckoutPanel
              data={checkoutData}
              businessId={createdBusinessId}
              peopleId={peopleId}
              onCancel={() => setCheckoutData(null)}
            />
          )}
          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {err && (
          <div style={{ padding: '0.5rem 1.5rem', background: '#fef2f2',
            borderTop: `1px solid #fca5a5`, color: C.red, fontSize: '0.8rem',
            maxWidth: 820, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            {err}
          </div>
        )}

        {/* Input bar */}
        <div style={{ background: '#fff', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ maxWidth: 820, margin: '0 auto', padding: '0.75rem 1.5rem' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reply… (Enter to send)"
                disabled={loading}
                rows={1}
                style={{
                  flex: 1, resize: 'none', border: `1px solid ${C.sageBorder}`,
                  borderRadius: 10, padding: '0.6rem 0.85rem', fontSize: '0.88rem',
                  outline: 'none', background: '#fff', lineHeight: 1.5,
                  maxHeight: 120, overflowY: 'auto', fontFamily: 'inherit',
                }}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
              <button onClick={handleSend} disabled={loading || !input.trim()}
                style={{
                  padding: '0.6rem 1.1rem', background: C.sage, color: '#fff',
                  border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem',
                  cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !input.trim()) ? 0.5 : 1, flexShrink: 0,
                }}>
                Send
              </button>
            </div>
            <div style={{ marginTop: 6, fontSize: '0.68rem', color: C.textSec }}>
              Cassia uses AI to guide your account setup. Payments are processed by Stripe.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
