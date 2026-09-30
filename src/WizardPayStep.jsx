import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

// Loads https://js.stripe.com/v3/ exactly once and returns window.Stripe.
function loadStripeJs() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Stripe) return Promise.resolve(window.Stripe);
  const existing = document.getElementById('stripe-js');
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(window.Stripe));
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.id = 'stripe-js';
    s.src = 'https://js.stripe.com/v3/';
    s.onload = () => resolve(window.Stripe);
    s.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(s);
  });
}

export default function WizardPayStep({ cartId, total, eventId, hostBusinessId, onPaid, onBack }) {
  const { t } = useTranslation();
  const cardMountRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | submitting | error | done
  const [err, setErr] = useState('');
  const [pubKey, setPubKey] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [zero, setZero] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Cross-sell state
  const [crossSell, setCrossSell] = useState([]);

  // Promo state
  const [cartTotals, setCartTotals] = useState({ Subtotal: total, DiscountAmount: 0, Total: total, PromoCode: null });
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const [promoBusy, setPromoBusy] = useState(false);

  const refreshCart = async () => {
    try {
      const r = await fetch(`${API}/api/events/cart/${cartId}`, { headers: authHeaders() });
      if (!r.ok) return;
      const c = await r.json();
      setCartTotals({
        Subtotal: Number(c.Subtotal || 0),
        DiscountAmount: Number(c.DiscountAmount || 0),
        Total: Number(c.Total || 0),
        PromoCode: c.PromoCode || null,
      });
    } catch {}
  };

  // On mount, try to auto-apply an early-bird code if one is eligible.
  useEffect(() => {
    if (!eventId) { refreshCart(); return; }
    (async () => {
      try {
        const r = await fetch(`${API}/api/events/${eventId}/promo-codes/auto-apply`, { headers: authHeaders() });
        if (r.ok) {
          const candidates = await r.json();
          if (Array.isArray(candidates) && candidates.length > 0) {
            await fetch(`${API}/api/events/cart/${cartId}/promo-code`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...authHeaders() },
              body: JSON.stringify({ Code: candidates[0].Code }),
            });
            setPromoMsg(t('wizard_pay.promo_early_bird', { code: candidates[0].Code }));
          }
        }
      } catch {}
      refreshCart();
    })();
  }, [cartId, eventId]);

  // Load marketplace cross-sell listings from the event host
  useEffect(() => {
    if (!hostBusinessId) return;
    (async () => {
      try {
        const r = await fetch(`${API}/api/marketplace/seller/listings?business_id=${hostBusinessId}`);
        if (!r.ok) return;
        const data = await r.json();
        const active = (Array.isArray(data) ? data : [])
          .filter(x => x && x.IsActive && (x.QuantityAvailable || 0) > 0)
          .slice(0, 4);
        setCrossSell(active);
      } catch {}
    })();
  }, [hostBusinessId]);

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoBusy(true); setPromoMsg('');
    try {
      const r = await fetch(`${API}/api/events/cart/${cartId}/promo-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ Code: promoInput.trim() }),
      });
      if (!r.ok) {
        const txt = await r.text();
        setPromoMsg(txt || t('wizard_pay.promo_invalid'));
      } else {
        const data = await r.json();
        setPromoMsg(t('wizard_pay.promo_applied', { amt: Number(data.DiscountAmount || 0).toFixed(2) }));
        setPromoInput('');
        await refreshCart();
        setReloadKey(k => k + 1);
      }
    } finally {
      setPromoBusy(false);
    }
  };

  const removePromo = async () => {
    setPromoBusy(true); setPromoMsg('');
    try {
      await fetch(`${API}/api/events/cart/${cartId}/promo-code`, {
        method: 'DELETE', headers: authHeaders(),
      });
      setPromoMsg(t('wizard_pay.promo_removed'));
      await refreshCart();
      setReloadKey(k => k + 1);
    } finally {
      setPromoBusy(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sRes = await fetch(`${API}/api/platform/settings`, { headers: authHeaders() });
        if (!sRes.ok) throw new Error(t('wizard_pay.err_load_settings'));
        const settings = await sRes.json();
        const pk = settings.StripePublishableKey;
        if (!pk) throw new Error(t('wizard_pay.err_stripe_key_missing'));

        const piRes = await fetch(`${API}/api/events/cart/${cartId}/payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({}),
        });
        if (!piRes.ok) {
          const txt = await piRes.text();
          throw new Error(txt || t('wizard_pay.err_payment_intent'));
        }
        const pi = await piRes.json();
        if (cancelled) return;

        if (pi.zero === true || pi.Status === 'paid') {
          setZero(true);
          setStatus('ready');
          return;
        }

        setPubKey(pk);
        setClientSecret(pi.clientSecret);

        const Stripe = await loadStripeJs();
        if (cancelled) return;
        const s = Stripe(pk);
        const el = s.elements({ clientSecret: pi.clientSecret });
        const card = el.create('payment', { layout: 'tabs' });
        setStripe(s);
        setElements(el);
        setCardElement(card);
        setStatus('ready');
      } catch (e) {
        if (!cancelled) {
          setErr(String(e.message || e));
          setStatus('error');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [cartId, reloadKey]);

  useEffect(() => {
    if (cardElement && cardMountRef.current && status === 'ready' && !zero) {
      cardElement.mount(cardMountRef.current);
    }
    return () => {
      if (cardElement) try { cardElement.unmount(); } catch {}
    };
  }, [cardElement, status, zero]);

  const submit = async () => {
    if (zero) {
      setStatus('submitting');
      try {
        const res = await fetch(`${API}/api/events/cart/${cartId}/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error(await res.text());
        setStatus('done');
        onPaid && onPaid();
      } catch (e) {
        setErr(String(e.message || e));
        setStatus('error');
      }
      return;
    }

    if (!stripe || !elements) return;
    setStatus('submitting'); setErr('');
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      if (error) {
        setErr(error.message || t('wizard_pay.err_payment_failed'));
        setStatus('ready');
        return;
      }
      const res = await fetch(`${API}/api/events/cart/${cartId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ PaymentIntentID: paymentIntent?.id }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('done');
      onPaid && onPaid();
    } catch (e) {
      setErr(String(e.message || e));
      setStatus('error');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('wizard_pay.heading')}</h3>
        <p className="text-sm text-gray-600">
          {t('wizard_pay.subheading')}
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1.5">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{t('wizard_pay.subtotal')}</span>
          <span>${Number(cartTotals.Subtotal || 0).toFixed(2)}</span>
        </div>
        {cartTotals.DiscountAmount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-700">
            <span>{t('wizard_pay.discount')} {cartTotals.PromoCode && <span className="font-mono text-xs">({cartTotals.PromoCode})</span>}</span>
            <span>-${Number(cartTotals.DiscountAmount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-1 border-t border-gray-300">
          <span className="text-sm font-medium text-gray-700">{t('wizard_pay.amount_due')}</span>
          <span className="text-xl font-bold text-gray-800">${Number(cartTotals.Total || total || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">{t('wizard_pay.promo_heading')}</div>
        {cartTotals.PromoCode ? (
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-mono font-medium">{cartTotals.PromoCode}</span>
              <span className="text-green-700 ml-2">{t('wizard_pay.promo_code_applied')}</span>
            </div>
            <button onClick={removePromo} disabled={promoBusy}
              className="text-xs text-red-600 hover:underline">{t('wizard_pay.btn_remove_promo')}</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input className="border rounded px-3 py-1.5 text-sm flex-1 font-mono uppercase"
              placeholder={t('wizard_pay.promo_placeholder')}
              value={promoInput}
              onChange={e => setPromoInput(e.target.value.toUpperCase())}
              onKeyDown={e => { if (e.key === 'Enter') applyPromo(); }} />
            <button onClick={applyPromo} disabled={promoBusy || !promoInput.trim()}
              className="text-sm px-3 py-1.5 rounded bg-gray-800 text-white disabled:opacity-50">
              {t('wizard_pay.btn_apply_promo')}
            </button>
          </div>
        )}
        {promoMsg && <div className="text-xs text-gray-600 mt-2">{promoMsg}</div>}
      </div>

      {status === 'loading' && (
        <div className="text-sm text-gray-500 py-6 text-center">{t('wizard_pay.preparing')}</div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          {err || t('wizard_pay.err_generic')}
        </div>
      )}

      {status !== 'loading' && status !== 'error' && zero && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
          {t('wizard_pay.zero_charge')}
        </div>
      )}

      {status !== 'loading' && !zero && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div ref={cardMountRef} />
        </div>
      )}

      {status === 'ready' && err && !zero && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">{err}</div>
      )}

      {crossSell.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-700">{t('wizard_pay.cross_sell_heading')}</div>
            <span className="text-xs text-gray-400">{t('wizard_pay.cross_sell_timing')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {crossSell.map(item => (
              <Link
                key={item.ListingID}
                to={`/marketplace/${item.ListingID}`}
                target="_blank"
                rel="noopener"
                className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
              >
                {item.ImageURL ? (
                  <img src={item.ImageURL} alt={item.Title}
                    className="w-full h-24 object-cover"
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-2xl">
                    {item.ProductType === 'meat' ? '🥩' : item.ProductType === 'processed_food' ? '🫙' : '🥕'}
                  </div>
                )}
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-800 line-clamp-2" title={item.Title}>
                    {item.Title}
                  </div>
                  <div className="text-sm font-bold text-[#3D6B34] mt-1">
                    ${Number(item.UnitPrice || 0).toFixed(2)}<span className="text-xs font-normal text-gray-500">/{item.UnitLabel || 'unit'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {t('wizard_pay.cross_sell_note')}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          disabled={status === 'submitting'}
          className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {t('wizard_pay.btn_back')}
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={status !== 'ready'}
          className="px-6 py-2 text-sm rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226] disabled:opacity-50"
        >
          {status === 'submitting'
            ? t('wizard_pay.btn_processing')
            : zero
              ? t('wizard_pay.btn_complete')
              : t('wizard_pay.btn_pay', { amt: Number(cartTotals.Total || total || 0).toFixed(2) })}
        </button>
      </div>
    </div>
  );
}
