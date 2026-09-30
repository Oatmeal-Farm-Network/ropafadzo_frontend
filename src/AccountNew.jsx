import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const API_URL      = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const CASSIA_API   = `${import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige'}/cassia`;
const OTF_API      = import.meta.env.VITE_OTF_API_URL || import.meta.env.VITE_API_URL || '';
const FORM_MAX_WIDTH = '860px';

const C = {
  sage:       '#4A5C43',
  sageBg:     '#EEF1EC',
  sageBorder: '#C8D5C2',
  text:       '#111827',
  textSec:    '#6b7280',
  border:     '#e5e7eb',
  green:      '#16a34a',
  red:        '#dc2626',
};

const TIER_LABELS = {
  hobby: 'Hobby (Free)', starter: 'Starter', business: 'Business', enterprise: 'Enterprise',
};
const TIER_COLORS = {
  hobby:      { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
  starter:    { bg: '#dcfce7', color: '#16a34a', border: '#86efac' },
  business:   { bg: '#f3e8ff', color: '#7c3aed', border: '#d8b4fe' },
  enterprise: { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
};

// ── OTF community auto-creation ───────────────────────────────────────────────
async function createOTFCommunity(businessId, businessName, knownPeopleId) {
  try {
    const token    = localStorage.getItem('access_token') || '';
    const peopleId = String(
      knownPeopleId ||
      localStorage.getItem('people_id') ||
      localStorage.getItem('PeopleID') ||
      new URLSearchParams(window.location.search).get('PeopleID') ||
      '0'
    );
    if (!peopleId || peopleId === '0') return;
    await fetch(`${OTF_API}/api/admin/mill/communities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-people-id': peopleId },
      body: JSON.stringify({
        name: `${businessName || 'My Org'} — Over The Fence`,
        linkedBusinessId: businessId,
        isPublic: false,
        iconEmoji: '🌾',
      }),
    });
  } catch {}
}

// ── ThinkingDots ──────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '0.55rem 0.8rem',
      background: C.sageBg, border: `1px solid ${C.sageBorder}`,
      borderRadius: 12, alignSelf: 'flex-start', width: 'fit-content', marginBottom: 8 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: C.sage,
          display: 'inline-block',
          animation: `cassiaThink 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Bubble ────────────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.sage,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
          marginRight: 7, alignSelf: 'flex-end' }}>C</div>
      )}
      <div style={{
        maxWidth: '78%', padding: '0.55rem 0.85rem',
        borderRadius: isUser ? '13px 13px 3px 13px' : '13px 13px 13px 3px',
        fontSize: '0.86rem', lineHeight: 1.55,
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

// ── CheckoutPanel (step 3) ────────────────────────────────────────────────────
function CheckoutPanel({ data, businessId, peopleId, onBack }) {
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [err,    setErr]    = useState('');
  const tc = TIER_COLORS[data?.tier] || TIER_COLORS.starter;

  const handlePay = async () => {
    setPaying(true);
    setErr('');
    try {
      const res = await fetch(`${OTF_API}/api/cassia/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type':   'application/json',
          'x-people-id':    String(peopleId || localStorage.getItem('people_id') || '0'),
          'x-access-level': '1',
          'x-business-id':  String(businessId || '0'),
        },
        body: JSON.stringify({
          tier:         data.tier,
          categories:   data.categories  || [],
          lineItems:    data.line_items  || [],
          monthlyTotal: data.monthly_total || 0,
          successUrl: `${window.location.origin}/account?PeopleID=${peopleId}&BusinessID=${businessId}&subscribed=1`,
          cancelUrl:  `${window.location.origin}/accounts/new`,
        }),
      });
      if (!res.ok) throw new Error('Could not create payment session.');
      const { stripeUrl } = await res.json();
      if (stripeUrl) {
        window.location.href = stripeUrl;
      } else {
        navigate(`/account?PeopleID=${peopleId}&BusinessID=${businessId}&subscribed=1`);
      }
    } catch (e) {
      setErr(e.message);
      setPaying(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Based on your conversation with Cassia, here's the plan she recommends. Review the details below and proceed to checkout.
      </p>

      <div style={{ background: '#fff', border: `1px solid ${C.sageBorder}`, borderRadius: 12, padding: '1.25rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.sage,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Cassia's Recommendation
        </div>

        <span style={{ padding: '3px 12px', borderRadius: 12, fontSize: '0.78rem',
          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
          background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
          display: 'inline-block', marginBottom: 14 }}>
          {TIER_LABELS[data.tier] || data.tier}
        </span>

        {data.line_items?.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginBottom: 12 }}>
            {data.line_items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                fontSize: '0.84rem', color: C.text, marginBottom: 5, gap: 8 }}>
                <span>{item.name}</span>
                <span style={{ fontWeight: 600, color: item.price === 0 ? C.green : C.text, flexShrink: 0 }}>
                  {item.price === 0 ? 'Free' : `$${Number(item.price).toFixed(2)}`}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between',
              borderTop: `1px solid ${C.sageBorder}`, paddingTop: 8, marginTop: 6,
              fontWeight: 700, fontSize: '0.9rem', color: C.sage }}>
              <span>Monthly Total</span>
              <span>{data.monthly_total === 0 ? 'Free' : `$${Number(data.monthly_total).toFixed(2)}/mo`}</span>
            </div>
          </div>
        )}

        {err && <div style={{ fontSize: '0.78rem', color: C.red, marginBottom: 8 }}>{err}</div>}

        <button onClick={handlePay} disabled={paying}
          style={{ width: '100%', padding: '0.7rem', background: C.sage, color: '#fff',
            border: 'none', borderRadius: 9, fontWeight: 700, fontSize: '0.9rem',
            cursor: paying ? 'not-allowed' : 'pointer', opacity: paying ? 0.7 : 1, marginBottom: 8 }}>
          {paying ? 'Processing…'
            : data.monthly_total === 0
              ? 'Activate Free Plan →'
              : `Pay $${Number(data.monthly_total).toFixed(2)}/mo →`}
        </button>
      </div>

      <div className="flex justify-start">
        <button onClick={onBack}
          className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          ← Back to Cassia
        </button>
      </div>
    </div>
  );
}

// ── CassiaStepChat (step 2 — inline chat pre-seeded with step 1 context) ──────
function CassiaStepChat({ form, businessTypes, states, businessId, onPlanReady }) {
  const [threadId] = useState(() => `cassia_new_${crypto.randomUUID()}`);
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState('');
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const seededRef  = useRef(false);

  const buildContextPrimer = useCallback(() => {
    const btName    = businessTypes.find(b => String(b.BusinessTypeID) === String(form.BusinessTypeID))?.BusinessType || form.BusinessTypeID;
    const stateName = states.find(s => String(s.StateIndex) === String(form.StateIndex))?.name || form.StateIndex;
    const lines = [
      '[Account Setup Context — do not repeat this block verbatim to the member]',
      `Business Type: ${btName}`,
      `Business Name: ${form.BusinessName || 'Not specified'}`,
      `Website: ${form.BusinessWebsite || 'Not provided'}`,
      `Location: ${form.AddressCity ? `${form.AddressCity}, ` : ''}${stateName}${form.country ? `, ${form.country}` : ''}`,
      `Phone: ${form.PeoplePhone}`,
    ];
    if (String(form.BusinessTypeID) === '8') {
      lines.push('Member has agreed to livestock handling and sales legal disclaimers.');
    }
    lines.push(
      '',
      'Please greet the member warmly, briefly acknowledge what you know about their operation, ' +
      'then ask 1–2 targeted follow-up questions to better understand their specific needs. ' +
      'Use this to recommend the most appropriate OFN subscription plan from the catalog.'
    );
    return lines.join('\n');
  }, [form, businessTypes, states]);

  const sendToApi = useCallback(async (userInput, showAsUser) => {
    if (showAsUser) setMessages(m => [...m, { role: 'user', content: userInput }]);
    setLoading(true);
    setErr('');
    try {
      const token = localStorage.getItem('access_token') || '';
      const res = await fetch(`${CASSIA_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_input:  userInput,
          thread_id:   threadId,
          business_id: businessId || undefined,
        }),
      });
      if (!res.ok) throw new Error(`Cassia is unavailable (${res.status})`);
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.response || '' }]);
      if (data.action === 'initiate_checkout' && data.data) {
        onPlanReady(data.data);
      }
    } catch (e) {
      setErr(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [threadId, businessId, onPlanReady]);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    sendToApi(buildContextPrimer(), false);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const handleSend = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput('');
    sendToApi(t, true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 460 }}>
      {/* Cassia header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10,
        background: C.sage, borderRadius: '10px 10px 0 0', padding: '0.7rem 1rem', color: '#fff', flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem', fontWeight: 700, color: C.sage }}>C</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cassia</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Your OFN Account Guide</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem',
        background: '#fff', border: `1px solid ${C.sageBorder}`, borderTop: 'none',
        display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 && !loading && (
          <div style={{ color: C.textSec, fontSize: '0.83rem', textAlign: 'center', marginTop: '2rem' }}>
            Connecting with Cassia…
          </div>
        )}
        {messages.map((m, i) => <Bubble key={i} msg={m} />)}
        {loading && <ThinkingDots />}
        {err && <div style={{ color: C.red, fontSize: '0.78rem', padding: '0.25rem 0' }}>{err}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 6, padding: '0.6rem',
        background: C.sageBg, border: `1px solid ${C.sageBorder}`, borderTop: 'none',
        borderRadius: '0 0 10px 10px', flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && input.trim()) { e.preventDefault(); handleSend(); }
          }}
          placeholder="Reply to Cassia… (Enter to send)"
          disabled={loading}
          style={{ flex: 1, border: `1px solid ${C.sageBorder}`, borderRadius: 8,
            padding: '0.5rem 0.75rem', fontSize: '0.85rem', outline: 'none', background: '#fff' }}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}
          style={{ background: C.sage, color: '#fff', border: 'none', borderRadius: 8,
            padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer',
            opacity: (loading || !input.trim()) ? 0.5 : 1 }}>
          Send
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AccountNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step,              setStep]              = useState(1);
  const [businessTypes,     setBusinessTypes]     = useState([]);
  const [countries,         setCountries]         = useState([]);
  const [states,            setStates]            = useState([]);
  const [errors,            setErrors]            = useState({});
  const [submitting,        setSubmitting]        = useState(false);
  const [createdBusinessId, setCreatedBusinessId] = useState(null);
  const [checkoutData,      setCheckoutData]      = useState(null);

  const [form, setForm] = useState({
    BusinessTypeID:         '',
    BusinessName:           '',
    BusinessWebsite:        '',
    AddressStreet:          '',
    AddressApt:             '',
    AddressCity:            '',
    country:                '',
    StateIndex:             '',
    AddressZip:             '',
    PeoplePhone:            '',
    Permission:             true,
    LivestockLegalDisclaimer: false,
    SalesLegalDisclaimer:   false,
  });

  const peopleId = localStorage.getItem('people_id') ||
                   localStorage.getItem('PeopleID') ||
                   new URLSearchParams(window.location.search).get('PeopleID');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }

    fetch(`${API_URL}/api/businesses/types`)
      .then(r => r.json())
      .then(data => setBusinessTypes(Array.isArray(data) ? data : []))
      .catch(() => {});

    fetch(`${API_URL}/api/businesses/countries`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setCountries(list);
        const us = list.find(c => c === 'USA' || c === 'United States');
        if (us) setForm(f => ({ ...f, country: us }));
      })
      .catch(() => {});
  }, [navigate]);

  useEffect(() => {
    if (!form.country) return;
    setStates([]);
    fetch(`${API_URL}/api/businesses/states?country=${encodeURIComponent(form.country)}`)
      .then(r => r.json())
      .then(data => setStates(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [form.country]);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const validateStep1 = () => {
    const e = {};
    if (!form.BusinessTypeID) e.BusinessTypeID = t('account_new.err_type');
    if (!form.StateIndex)     e.StateIndex     = t('account_new.err_state');
    if (String(form.BusinessTypeID) === '8') {
      if (!form.LivestockLegalDisclaimer) e.LivestockLegalDisclaimer = t('account_new.err_livestock_disclaimer');
      if (!form.SalesLegalDisclaimer)     e.SalesLegalDisclaimer     = t('account_new.err_sales_disclaimer');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validateStep1()) return;
    if (createdBusinessId) { setStep(2); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/businesses/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        body: JSON.stringify({ ...form, PeopleID: peopleId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedBusinessId(data.BusinessID);
        createOTFCommunity(data.BusinessID, form.BusinessName || '', peopleId);
        setStep(2);
      } else {
        setErrors({ submit: data.detail || t('account_new.err_generic') });
      }
    } catch {
      setErrors({ submit: t('account_new.err_generic') });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#819360]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClass = 'text-red-600 text-xs mt-1';

  const STEP_LABELS = ['Your Details', 'Chat with Cassia', 'Choose Your Plan'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <PageMeta
        title="Add an Account | Oatmeal Farm Network"
        description="Create a new farm, ranch, or business account on Oatmeal Farm Network."
        noIndex
      />
      <Header />

      <style>{`
        @keyframes cassiaThink {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>

      <div style={{ maxWidth: FORM_MAX_WIDTH, margin: '2rem auto', padding: '0 1rem 3rem' }}>
        <Breadcrumbs items={[
          { label: t('nav.home'), to: '/' },
          { label: t('accounts.heading'), to: '/accounts' },
          { label: t('account_new.breadcrumb') },
        ]} />

        <div className="bg-white rounded-xl shadow border border-gray-100 p-8">

          <h1 className="text-2xl font-bold text-gray-800 mb-2">{STEP_LABELS[step - 1]}</h1>

          {/* 3-step progress indicator */}
          <div className="flex items-center gap-2 mb-7">
            {[1, 2, 3].map((n, i) => (
              <React.Fragment key={n}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${step > n ? 'bg-[#4A5C43] text-white' : step === n ? 'bg-[#4A5C43] text-white ring-4 ring-[#C8D5C2]' : 'bg-gray-200 text-gray-500'}`}>
                  {step > n ? '✓' : n}
                </div>
                {i < 2 && <div className={`flex-1 h-1 rounded ${step > n ? 'bg-[#4A5C43]' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* ── STEP 1: account details ──────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">

              <div>
                <label className={labelClass}>{t('account_new.label_type')}</label>
                <select value={form.BusinessTypeID} onChange={e => update('BusinessTypeID', e.target.value)} className={inputClass}>
                  <option value="">{t('account_new.select_type')}</option>
                  {businessTypes.map(b => (
                    <option key={b.BusinessTypeID} value={b.BusinessTypeID}>{b.BusinessType}</option>
                  ))}
                </select>
                {errors.BusinessTypeID && <p className={errorClass}>{errors.BusinessTypeID}</p>}
              </div>

              <div>
                <label className={labelClass}>
                  {t('account_new.label_name')} <span className="text-gray-400 font-normal">({t('account_new.optional')})</span>
                </label>
                <input type="text" value={form.BusinessName} onChange={e => update('BusinessName', e.target.value)}
                  className={inputClass} placeholder={t('account_new.placeholder_name')} />
              </div>

              <div>
                <label className={labelClass}>
                  {t('account_new.label_website')} <span className="text-gray-400 font-normal">({t('account_new.optional')})</span>
                </label>
                <input type="text" value={form.BusinessWebsite} onChange={e => update('BusinessWebsite', e.target.value)}
                  className={inputClass} placeholder="https://yourwebsite.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t('account_new.label_street')} <span className="text-gray-400 font-normal">({t('account_new.optional')})</span>
                  </label>
                  <input type="text" value={form.AddressStreet} onChange={e => update('AddressStreet', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    {t('account_new.label_apt')} <span className="text-gray-400 font-normal">({t('account_new.optional')})</span>
                  </label>
                  <input type="text" value={form.AddressApt} onChange={e => update('AddressApt', e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t('account_new.label_city')} <span className="text-gray-400 font-normal">({t('account_new.optional')})</span>
                  </label>
                  <input type="text" value={form.AddressCity} onChange={e => update('AddressCity', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    {t('account_new.label_zip')} <span className="text-gray-400 font-normal">({t('account_new.optional')})</span>
                  </label>
                  <input type="text" value={form.AddressZip} onChange={e => update('AddressZip', e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('account_new.label_country')}</label>
                  <select value={form.country} onChange={e => {
                    setForm(f => ({ ...f, country: e.target.value, StateIndex: '' }));
                  }} className={inputClass}>
                    <option value="">{t('account_new.select_country')}</option>
                    {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t('account_new.label_state')}</label>
                  <select value={form.StateIndex} onChange={e => update('StateIndex', e.target.value)}
                    className={inputClass} disabled={!form.country}>
                    <option value="">{form.country ? t('account_new.select_state') : t('account_new.select_country_first')}</option>
                    {states.map(s => <option key={s.StateIndex} value={s.StateIndex}>{s.name}</option>)}
                  </select>
                  {errors.StateIndex && <p className={errorClass}>{errors.StateIndex}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('account_new.label_phone')} <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={form.PeoplePhone}
                  onChange={e => update('PeoplePhone', e.target.value.replace(/[^0-9()-.\s]/g, ''))}
                  className={inputClass} placeholder="(555) 555-5555" />
                {errors.PeoplePhone && <p className={errorClass}>{errors.PeoplePhone}</p>}
              </div>

              {/* ── Permissions / disclaimers ─────────────────────────────── */}
              <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.Permission} onChange={e => update('Permission', e.target.checked)} className="mt-1" />
                {t('account_new.permission_text')}
              </label>

              {String(form.BusinessTypeID) === '8' && (
                <>
                  <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={form.LivestockLegalDisclaimer}
                      onChange={e => update('LivestockLegalDisclaimer', e.target.checked)} className="mt-1" />
                    <span><strong>{t('account_new.livestock_disclaimer_title')}</strong> {t('account_new.livestock_disclaimer_body')}</span>
                  </label>
                  {errors.LivestockLegalDisclaimer && <p className={errorClass}>{errors.LivestockLegalDisclaimer}</p>}

                  <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={form.SalesLegalDisclaimer}
                      onChange={e => update('SalesLegalDisclaimer', e.target.checked)} className="mt-1" />
                    <span><strong>{t('account_new.sales_disclaimer_title')}</strong> {t('account_new.sales_disclaimer_body')}</span>
                  </label>
                  {errors.SalesLegalDisclaimer && <p className={errorClass}>{errors.SalesLegalDisclaimer}</p>}
                </>
              )}

              {errors.submit && (
                <div className="bg-red-50 border border-red-300 text-red-700 rounded px-4 py-3 text-sm">
                  {errors.submit}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button onClick={handleCreateAccount} disabled={submitting} className="regsubmit2">
                  {submitting ? t('account_new.btn_creating') : 'Continue to Cassia →'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Cassia chat ──────────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Cassia already knows what you filled in — just answer her questions and she'll build a personalized plan.
              </p>
              <CassiaStepChat
                form={form}
                businessTypes={businessTypes}
                states={states}
                businessId={createdBusinessId}
                peopleId={peopleId}
                onPlanReady={(data) => { setCheckoutData(data); setStep(3); }}
              />
              <div className="mt-4 flex justify-between items-center">
                <button onClick={() => setStep(1)}
                  className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  ← Back
                </button>
                {checkoutData && (
                  <button onClick={() => setStep(3)} className="regsubmit2">
                    Continue to Plan →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: checkout ─────────────────────────────────────────────── */}
          {step === 3 && checkoutData && (
            <CheckoutPanel
              data={checkoutData}
              businessId={createdBusinessId}
              peopleId={peopleId}
              onBack={() => setStep(2)}
            />
          )}

          {step === 3 && !checkoutData && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No plan selected yet.{' '}
              <button onClick={() => setStep(2)} className="text-[#4A5C43] underline">Go back to Cassia</button>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
