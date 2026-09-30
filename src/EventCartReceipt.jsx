import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

export default function EventCartReceipt() {
  const { t } = useTranslation();
  const { cartId } = useParams();
  const [cart, setCart] = useState(null);
  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const STATUS_LABELS = {
    draft:              t('event_cart_receipt.status_draft'),
    pending_payment:    t('event_cart_receipt.status_pending_payment'),
    pending_capture:    t('event_cart_receipt.status_pending_capture'),
    paid:               t('event_cart_receipt.status_paid'),
    refunded:           t('event_cart_receipt.status_refunded'),
    partially_refunded: t('event_cart_receipt.status_partially_refunded'),
    cancelled:          t('event_cart_receipt.status_cancelled'),
  };

  useEffect(() => {
    fetch(`${API}/api/events/cart/${cartId}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject(t('event_cart_receipt.err_not_found')))
      .then(c => {
        setCart(c);
        return fetch(`${API}/api/events/${c.EventID}`).then(r => r.ok ? r.json() : null);
      })
      .then(e => { setEv(e); setLoading(false); })
      .catch(e => { setErr(String(e)); setLoading(false); });
  }, [cartId]);

  if (loading) {
    return <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center">
      <div className="text-sm text-gray-500">{t('event_cart_receipt.loading')}</div>
    </div>;
  }

  if (err || !cart) {
    return <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow p-6 max-w-md text-center">
        <div className="text-lg font-semibold text-red-600 mb-2">{t('event_cart_receipt.unavailable_title')}</div>
        <p className="text-sm text-gray-600">{err || t('event_cart_receipt.unavailable_body')}</p>
        <Link to="/my-registrations" className="inline-block mt-4 text-sm text-[#3D6B34] hover:underline">
          {t('event_cart_receipt.back_to_regs')}
        </Link>
      </div>
    </div>;
  }

  const eventAddr = ev ? [
    ev.EventLocationName, ev.EventLocationStreet, ev.EventLocationCity,
    ev.EventLocationState, ev.EventLocationZip,
  ].filter(Boolean).join(', ') : '';

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—';

  const paidDate = cart.PaidDate ? new Date(cart.PaidDate).toLocaleString() : '—';
  const refunded = Number(cart.AmountRefunded || 0);

  return (
    <div className="min-h-screen bg-[#FAF7EE] py-8 px-4 print:bg-white print:py-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4 no-print">
          <Link to="/my-registrations" className="text-sm text-[#3D6B34] hover:underline">{t('event_cart_receipt.btn_back')}</Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#3D6B34] text-white rounded-lg text-sm hover:bg-[#2f5226]"
          >
            {t('event_cart_receipt.btn_print')}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden print:shadow-none print:rounded-none">
          <div className="bg-[#3D6B34] text-white px-6 py-5 print:bg-gray-100 print:text-gray-900 print:border-b-4 print:border-[#3D6B34]">
            <div className="text-[10px] uppercase tracking-[0.15em] opacity-80">{t('event_cart_receipt.receipt_label')}</div>
            <div className="text-2xl font-semibold mt-1">{ev?.EventName || 'Event'}</div>
            <div className="text-xs opacity-80 mt-1">
              {t('event_cart_receipt.order_ref', { id: cart.CartID })} · {STATUS_LABELS[cart.Status] || cart.Status}
            </div>
          </div>

          <div className="px-6 py-5 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('event_cart_receipt.section_attendee')}</div>
                <div className="mt-1 font-medium text-gray-800">
                  {cart.AttendeeFirstName} {cart.AttendeeLastName}
                </div>
                <div className="text-xs text-gray-600">{cart.AttendeeEmail}</div>
                {cart.AttendeePhone && <div className="text-xs text-gray-600">{cart.AttendeePhone}</div>}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('event_cart_receipt.section_event')}</div>
                <div className="mt-1 text-gray-800">{fmtDate(ev?.EventStartDate)}</div>
                {eventAddr && <div className="text-xs text-gray-600 mt-1">{eventAddr}</div>}
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">{t('event_cart_receipt.section_line_items')}</div>
            {(!cart.items || cart.items.length === 0) ? (
              <div className="text-sm text-gray-500 italic py-3">{t('event_cart_receipt.no_line_items')}</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase text-gray-500 border-b">
                    <th className="text-left py-1.5 font-semibold">{t('event_cart_receipt.col_item')}</th>
                    <th className="text-right py-1.5 font-semibold">{t('event_cart_receipt.col_qty')}</th>
                    <th className="text-right py-1.5 font-semibold">{t('event_cart_receipt.col_unit')}</th>
                    <th className="text-right py-1.5 font-semibold">{t('event_cart_receipt.col_line')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map(it => (
                    <tr key={it.LineID} className="border-b border-gray-100">
                      <td className="py-2 text-gray-800">
                        <div>{it.Label}</div>
                        <div className="text-[10px] text-gray-400 uppercase">{it.FeatureKey}</div>
                      </td>
                      <td className="py-2 text-right text-gray-700">{it.Quantity}</td>
                      <td className="py-2 text-right text-gray-700">${Number(it.UnitAmount || 0).toFixed(2)}</td>
                      <td className="py-2 text-right text-gray-800 font-medium">${Number(it.LineAmount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-4 space-y-1 text-sm">
              <Row label={t('event_cart_receipt.lbl_subtotal')} value={`$${Number(cart.Subtotal || 0).toFixed(2)}`} />
              <Row label={t('event_cart_receipt.lbl_platform_fee')} value={`$${Number(cart.PlatformFeeAmount || 0).toFixed(2)}`} />
              <div className="border-t border-gray-300 my-2" />
              <Row label={t('event_cart_receipt.lbl_total')} value={`$${Number(cart.Total || 0).toFixed(2)}`} bold />
              <Row label={t('event_cart_receipt.lbl_paid')} value={`$${Number(cart.AmountPaid || 0).toFixed(2)}`} />
              {refunded > 0 && <Row label={t('event_cart_receipt.lbl_refunded')} value={`-$${refunded.toFixed(2)}`} tone="red" />}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t text-xs text-gray-600 space-y-1">
            <div><strong>{t('event_cart_receipt.payment_date_label')}</strong> {paidDate}</div>
            {cart.StripePaymentIntentID && (
              <div className="font-mono text-[10px] text-gray-400">
                {t('event_cart_receipt.stripe_ref_label')} {cart.StripePaymentIntentID}
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-6 no-print">
          {t('event_cart_receipt.help_prefix')}
          {' '}<Link to="/my-registrations" className="text-[#3D6B34] hover:underline">{t('event_cart_receipt.help_link')}</Link>.
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, tone }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold text-gray-900 text-base' : 'text-gray-700'} ${tone === 'red' ? 'text-red-700' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
