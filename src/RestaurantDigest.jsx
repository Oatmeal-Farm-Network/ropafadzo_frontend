// src/RestaurantDigest.jsx
// "Available this week" — restaurants opt in to a weekly digest of farm products available now.
// Route: /restaurant/digest
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useAccount } from './AccountContext';
import PairsleyChat from './PairsleyChat';

const API = import.meta.env.VITE_API_URL || '';

export default function RestaurantDigest() {
  const { t } = useTranslation();
  const { businesses } = useAccount() || {};
  const restaurantBusiness = Array.isArray(businesses)
    ? businesses.find(b => (b.BusinessType || '').toLowerCase() === 'restaurant')
    : null;
  const buyerBusinessId = restaurantBusiness?.BusinessID || null;

  const [sub,       setSub]       = useState(null);
  const [email,     setEmail]     = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [preview,   setPreview]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [sendingNow, setSendingNow] = useState(false);
  const [msg,       setMsg]       = useState('');

  const load = async () => {
    if (!buyerBusinessId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [subRes, prevRes] = await Promise.all([
        fetch(`${API}/api/marketplace/digest-subscription?buyer_business_id=${buyerBusinessId}`),
        fetch(`${API}/api/marketplace/digest-preview?buyer_business_id=${buyerBusinessId}`),
      ]);
      const subData  = subRes.ok ? await subRes.json() : null;
      const prevData = prevRes.ok ? await prevRes.json() : null;
      setSub(subData);
      setPreview(prevData);
      if (subData) {
        setEmail(subData.Email || '');
        setSavedOnly(!!subData.SavedFarmsOnly);
        setFrequency(subData.Frequency || 'weekly');
      } else {
        const fallbackEmail = localStorage.getItem('email') || '';
        setEmail(fallbackEmail);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [buyerBusinessId]);

  const subscribe = async (e) => {
    e?.preventDefault();
    if (!email.trim()) { setMsg(t('restaurant_digest.err_email_required')); return; }
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch(`${API}/api/marketplace/digest-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BuyerBusinessID: buyerBusinessId,
          Email:           email.trim(),
          Frequency:       frequency,
          SavedFarmsOnly:  savedOnly,
          Status:          'active',
        }),
      });
      if (!res.ok) throw new Error();
      setMsg(t('restaurant_digest.msg_saved'));
      load();
    } catch {
      setMsg(t('restaurant_digest.err_save_failed'));
    } finally {
      setSaving(false);
    }
  };

  const unsubscribe = async () => {
    if (!window.confirm(t('restaurant_digest.confirm_unsubscribe'))) return;
    await fetch(`${API}/api/marketplace/digest-subscription?buyer_business_id=${buyerBusinessId}`, { method: 'DELETE' });
    setSub(null);
    setMsg(t('restaurant_digest.msg_unsubscribed'));
  };

  const sendNow = async () => {
    setSendingNow(true);
    setMsg('');
    try {
      const res = await fetch(`${API}/api/marketplace/digest-send-now?buyer_business_id=${buyerBusinessId}`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMsg(t('restaurant_digest.msg_digest_queued', { subject: data.subject, to: data.to, count: data.item_count }) + (data.note ? ` ${data.note}` : ''));
      load();
    } catch {
      setMsg(t('restaurant_digest.err_send_failed'));
    } finally {
      setSendingNow(false);
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Available This Week | Restaurant Email Digest"
        description="Weekly email digest of farm products available now — for restaurant buyers."
      />
      <Header />

      <div className="mx-auto px-4 pt-4 pb-10" style={{ maxWidth: '900px' }}>
        <Breadcrumbs items={[
          { label: t('restaurant_digest.breadcrumb_home'), to: '/' },
          { label: t('restaurant_digest.breadcrumb_marketplaces'), to: '/marketplaces' },
          { label: t('restaurant_digest.breadcrumb_farm_to_table'), to: '/marketplaces/farm-to-table' },
          { label: t('restaurant_digest.breadcrumb_digest') },
        ]} />

        <h1 className="mt-4 text-2xl font-bold text-gray-900" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
          📬 {t('restaurant_digest.heading')}
        </h1>
        <p className="text-sm text-gray-600 mt-1 mb-6">
          {t('restaurant_digest.subheading')}
        </p>

        {!buyerBusinessId ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <p className="text-gray-700 font-semibold">{t('restaurant_digest.no_business')}</p>
            <Link to="/account" className="text-[#3D6B34] underline text-sm">{t('restaurant_digest.btn_go_to_account')}</Link>
          </div>
        ) : loading ? (
          <div className="text-gray-400 text-center py-10">{t('restaurant_digest.loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Subscription form ── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-3">{t('restaurant_digest.sub_heading')}</h2>
              {sub && (
                <p className="text-xs bg-[#e8f0dc] text-[#3D6B34] font-semibold px-3 py-2 rounded mb-3">
                  {t('restaurant_digest.active_status', { date: sub.LastSentAt ? new Date(sub.LastSentAt).toLocaleDateString() : t('restaurant_digest.never') })}
                </p>
              )}
              <form onSubmit={subscribe} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('restaurant_digest.lbl_email')}</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('restaurant_digest.lbl_frequency')}</label>
                  <select value={frequency} onChange={e => setFrequency(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="weekly">{t('restaurant_digest.freq_weekly')}</option>
                    <option value="biweekly">{t('restaurant_digest.freq_biweekly')}</option>
                    <option value="monthly">{t('restaurant_digest.freq_monthly')}</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={savedOnly} onChange={e => setSavedOnly(e.target.checked)} />
                  <span>
                    {t('restaurant_digest.lbl_saved_only')}{' ('}
                    <Link to="/restaurant/farms" className="text-[#3D6B34] underline">{t('restaurant_digest.btn_my_farms')}</Link>
                    {')'}
                  </span>
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  {sub && (
                    <button type="button" onClick={unsubscribe}
                      className="text-xs text-red-500 hover:underline px-2">
                      {t('restaurant_digest.btn_unsubscribe')}
                    </button>
                  )}
                  <button type="submit" disabled={saving}
                    className="px-4 py-2 text-sm font-bold text-white bg-[#3D6B34] hover:bg-[#2d5225] rounded-lg disabled:opacity-60">
                    {saving ? t('restaurant_digest.btn_saving') : sub ? t('restaurant_digest.btn_update') : t('restaurant_digest.btn_subscribe')}
                  </button>
                </div>
              </form>

              {sub && (
                <button onClick={sendNow} disabled={sendingNow}
                  className="mt-4 w-full text-xs font-semibold text-[#3D6B34] border border-[#3D6B34] hover:bg-[#e8f0dc] py-2 rounded-lg disabled:opacity-60">
                  {sendingNow ? t('restaurant_digest.btn_sending') : t('restaurant_digest.btn_send_now')}
                </button>
              )}

              {msg && <p className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded p-2 mt-3">{msg}</p>}
            </div>

            {/* ── Preview ── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-3">{t('restaurant_digest.preview_heading', { n: preview?.item_count ?? 0 })}</h2>
              {!preview || (preview.items || []).length === 0 ? (
                <p className="text-sm text-gray-500">{t('restaurant_digest.preview_empty')}</p>
              ) : (
                <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {preview.items.map((it, idx) => (
                    <li key={idx} className="py-2">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{it.Title}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {it.FarmName}{it.AddressCity ? ` · ${it.AddressCity}, ${it.AddressState}` : ''}
                          </p>
                        </div>
                        <div className="text-xs text-right whitespace-nowrap">
                          {it.WholesalePrice && <span className="text-[#8a6a0a] font-bold">WS ${parseFloat(it.WholesalePrice).toFixed(2)} · </span>}
                          <span className="text-[#3D6B34] font-bold">${parseFloat(it.RetailPrice || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <PairsleyChat businessId={buyerBusinessId} />
    </div>
  );
}
