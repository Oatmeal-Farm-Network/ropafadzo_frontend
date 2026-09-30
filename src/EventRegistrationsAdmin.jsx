import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

const statusBadge = {
  draft:              'bg-gray-100 text-gray-700',
  pending_payment:    'bg-yellow-100 text-yellow-800',
  pending_capture:    'bg-blue-100 text-blue-800',
  paid:               'bg-green-100 text-green-800',
  refunded:           'bg-red-100 text-red-800',
  partially_refunded: 'bg-orange-100 text-orange-800',
  cancelled:          'bg-gray-100 text-gray-500',
};

export default function EventRegistrationsAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [carts, setCarts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const statusLabel = (s) => t(`event_registrations_admin.status_${s}`, { defaultValue: s });

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/events/${eventId}/carts`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(rows => { setCarts(Array.isArray(rows) ? rows : []); setLoading(false); })
      .catch(() => { setCarts([]); setLoading(false); });
  };
  useEffect(load, [eventId]);

  const openCart = (cartId) => {
    fetch(`${API}/api/events/cart/${cartId}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(setSelected)
      .catch(() => setSelected(null));
  };

  const totals = carts.reduce((acc, c) => {
    acc.count += 1;
    if (c.Status === 'paid' || c.Status === 'pending_capture') acc.paid += Number(c.Total || 0);
    if (c.Status === 'refunded' || c.Status === 'partially_refunded') acc.refunded += Number(c.AmountRefunded || 0);
    return acc;
  }, { count: 0, paid: 0, refunded: 0 });

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('event_registrations_admin.heading')}</h1>
        <p className="text-sm text-gray-600 mb-6">
          {t('event_registrations_admin.subheading')}
        </p>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <StatCard label={t('event_registrations_admin.stat_total_carts')} value={totals.count} />
          <StatCard label={t('event_registrations_admin.stat_collected')} value={`$${totals.paid.toFixed(2)}`} />
          <StatCard label={t('event_registrations_admin.stat_refunded')} value={`$${totals.refunded.toFixed(2)}`} tone="red" />
        </div>

        {loading ? (
          <div className="text-sm text-gray-500">{t('event_registrations_admin.loading')}</div>
        ) : carts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-600">
            {t('event_registrations_admin.no_registrations')}
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium text-gray-600">
                <tr>
                  <th className="text-left px-4 py-2">{t('event_registrations_admin.col_attendee')}</th>
                  <th className="text-left px-4 py-2">{t('event_registrations_admin.col_contact')}</th>
                  <th className="text-left px-4 py-2">{t('event_registrations_admin.col_items')}</th>
                  <th className="text-right px-4 py-2">{t('event_registrations_admin.col_total')}</th>
                  <th className="text-right px-4 py-2">{t('event_registrations_admin.col_paid')}</th>
                  <th className="text-left px-4 py-2">{t('event_registrations_admin.col_status')}</th>
                  <th className="text-left px-4 py-2">{t('event_registrations_admin.col_date')}</th>
                </tr>
              </thead>
              <tbody>
                {carts.map(c => (
                  <tr
                    key={c.CartID}
                    onClick={() => openCart(c.CartID)}
                    className="border-t cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {c.AttendeeFirstName || ''} {c.AttendeeLastName || ''}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      <div className="truncate max-w-55">{c.AttendeeEmail || ''}</div>
                      <div className="text-xs text-gray-400">{c.AttendeePhone || ''}</div>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{c.ItemCount}</td>
                    <td className="px-4 py-2 text-right text-gray-800">${Number(c.Total || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right text-gray-800">${Number(c.AmountPaid || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[c.Status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabel(c.Status)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">
                      {c.CreatedDate ? new Date(c.CreatedDate).toLocaleDateString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && (
          <CartDetailModal
            cart={selected}
            onClose={() => setSelected(null)}
            onChanged={() => { load(); openCart(selected.CartID); }}
            setErr={setErr}
          />
        )}

        {err && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-sm">
            {err}
            <button className="ml-3 underline" onClick={() => setErr('')}>{t('event_registrations_admin.btn_dismiss')}</button>
          </div>
        )}
      </div>
    </EventAdminLayout>
  );
}

function StatCard({ label, value, tone }) {
  const color = tone === 'red' ? 'text-red-700' : 'text-gray-800';
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function CartDetailModal({ cart, onClose, onChanged, setErr }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState('');
  const [refundAmt, setRefundAmt] = useState('');
  const [showRefund, setShowRefund] = useState(false);

  const statusLabel = (s) => t(`event_registrations_admin.status_${s}`, { defaultValue: s });

  const canCapture = cart.Status === 'pending_capture';
  const canRefund = cart.Status === 'paid' || cart.Status === 'pending_capture' || cart.Status === 'partially_refunded';
  const maxRefund = Number(cart.AmountPaid || 0) - Number(cart.AmountRefunded || 0);

  const doPost = async (path, body) => {
    setBusy(path);
    setErr('');
    try {
      const res = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body || {}),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      onChanged();
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setBusy('');
    }
  };

  const capture = () => doPost(`/api/events/cart/${cart.CartID}/capture`);

  const refund = () => {
    const amt = refundAmt ? Number(refundAmt) : null;
    if (amt !== null && (isNaN(amt) || amt <= 0 || amt > maxRefund)) {
      setErr(t('event_registrations_admin.err_refund_range', { max: maxRefund.toFixed(2) }));
      return;
    }
    doPost(`/api/events/cart/${cart.CartID}/refund`, amt ? { Amount: amt } : {});
    setShowRefund(false);
    setRefundAmt('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start">
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {cart.AttendeeFirstName} {cart.AttendeeLastName}
            </div>
            <div className="text-xs text-gray-500">Cart #{cart.CartID}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">{t('event_registrations_admin.lbl_email')}</span> <span className="text-gray-800">{cart.AttendeeEmail || '—'}</span></div>
            <div><span className="text-gray-500">{t('event_registrations_admin.lbl_phone')}</span> <span className="text-gray-800">{cart.AttendeePhone || '—'}</span></div>
            <div><span className="text-gray-500">{t('event_registrations_admin.lbl_status')}</span>
              <span className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[cart.Status] || 'bg-gray-100 text-gray-700'}`}>
                {statusLabel(cart.Status)}
              </span>
            </div>
            <div><span className="text-gray-500">{t('event_registrations_admin.lbl_stripe')}</span> <span className="text-gray-800 text-xs font-mono">{cart.StripePaymentIntentID || '—'}</span></div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('event_registrations_admin.section_line_items')}</h3>
            {!cart.items || cart.items.length === 0 ? (
              <div className="text-sm text-gray-500 italic">{t('event_registrations_admin.no_items')}</div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-600">
                    <tr>
                      <th className="text-left px-3 py-1.5">{t('event_registrations_admin.col_item')}</th>
                      <th className="text-left px-3 py-1.5">{t('event_registrations_admin.col_feature')}</th>
                      <th className="text-right px-3 py-1.5">{t('event_registrations_admin.col_qty')}</th>
                      <th className="text-right px-3 py-1.5">{t('event_registrations_admin.col_unit')}</th>
                      <th className="text-right px-3 py-1.5">{t('event_registrations_admin.col_line')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map(i => (
                      <tr key={i.LineID} className="border-t">
                        <td className="px-3 py-1.5">{i.Label}</td>
                        <td className="px-3 py-1.5 text-xs text-gray-500">{i.FeatureKey}</td>
                        <td className="px-3 py-1.5 text-right">{i.Quantity}</td>
                        <td className="px-3 py-1.5 text-right">${Number(i.UnitAmount || 0).toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right">${Number(i.LineAmount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="border-t pt-3 space-y-1 text-sm">
            <Row label={t('event_registrations_admin.lbl_subtotal')} value={`$${Number(cart.Subtotal || 0).toFixed(2)}`} />
            <Row label={t('event_registrations_admin.lbl_platform_fee')} value={`$${Number(cart.PlatformFeeAmount || 0).toFixed(2)}`} />
            <Row label={t('event_registrations_admin.lbl_total')} value={`$${Number(cart.Total || 0).toFixed(2)}`} bold />
            <Row label={t('event_registrations_admin.lbl_amount_paid')} value={`$${Number(cart.AmountPaid || 0).toFixed(2)}`} />
            {Number(cart.AmountRefunded || 0) > 0 && (
              <Row label={t('event_registrations_admin.lbl_refunded')} value={`-$${Number(cart.AmountRefunded || 0).toFixed(2)}`} tone="red" />
            )}
          </div>

          {showRefund && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
              <div className="text-sm font-medium text-gray-700">{t('event_registrations_admin.refund_heading')}</div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={maxRefund}
                  value={refundAmt}
                  onChange={e => setRefundAmt(e.target.value)}
                  placeholder={t('event_registrations_admin.refund_placeholder', { max: maxRefund.toFixed(2) })}
                  className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                />
                <button onClick={refund} disabled={busy} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
                  {t('event_registrations_admin.btn_confirm_refund')}
                </button>
                <button onClick={() => { setShowRefund(false); setRefundAmt(''); }} className="px-3 py-1 border border-gray-300 rounded text-sm">
                  {t('event_registrations_admin.btn_cancel')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-3 flex justify-end gap-2">
          {canCapture && (
            <button onClick={capture} disabled={busy} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {busy === `/api/events/cart/${cart.CartID}/capture`
                ? t('event_registrations_admin.btn_capturing')
                : t('event_registrations_admin.btn_capture')}
            </button>
          )}
          {canRefund && !showRefund && (
            <button onClick={() => setShowRefund(true)} className="px-4 py-1.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
              {t('event_registrations_admin.btn_refund')}
            </button>
          )}
          <button onClick={onClose} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            {t('event_registrations_admin.btn_close')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, tone }) {
  const cls = `flex justify-between ${bold ? 'font-bold text-gray-800' : 'text-gray-700'} ${tone === 'red' ? 'text-red-700' : ''}`;
  return (
    <div className={cls}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
