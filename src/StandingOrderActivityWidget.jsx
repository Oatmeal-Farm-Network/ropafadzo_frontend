// src/StandingOrderActivityWidget.jsx
// Compact dashboard card showing standing-order activity for one business.
// Used by both farm sellers (role="farm") and restaurant buyers (role="buyer").
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

export default function StandingOrderActivityWidget({ businessId, role = 'farm' }) {
  const { t } = useTranslation();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState('');

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`${API}/api/marketplace/standing-orders/activity?business_id=${businessId}&role=${role}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { if (!cancelled) setData(d); })
      .catch(()  => { if (!cancelled) setErr(t('standing_order_widget.err_load')); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [businessId, role]);

  const ordersPath = role === 'farm' ? '/farm/standing-orders' : '/restaurant/standing-orders';
  const otherLabel = role === 'farm' ? t('standing_order_widget.party_buyer') : t('standing_order_widget.party_farm');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
          🔁 {t('standing_order_widget.heading')}
        </h3>
        <Link to={ordersPath} className="text-xs text-[#3D6B34] hover:underline font-semibold">
          {t('standing_order_widget.view_all')}
        </Link>
      </div>

      {loading ? (
        <div className="text-xs text-gray-400 py-3 text-center">{t('standing_order_widget.loading')}</div>
      ) : err ? (
        <div className="text-xs text-red-500 py-3 text-center">{err}</div>
      ) : !data || data.stats.active === 0 && data.stats.fulfilled_30d === 0 ? (
        <div className="text-xs text-gray-400 py-3 text-center italic">
          {t('standing_order_widget.empty')}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <Stat label={t('standing_order_widget.stat_active')}   value={data.stats.active} />
            <Stat label={t('standing_order_widget.stat_overdue')}  value={data.stats.overdue} accent={data.stats.overdue > 0 ? '#dc2626' : null} />
            <Stat label={t('standing_order_widget.stat_next_7d')}  value={data.stats.upcoming_7d} />
            <Stat label={t('standing_order_widget.stat_done_30d')} value={data.stats.fulfilled_30d} />
          </div>

          {data.upcoming.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-1">
                {t('standing_order_widget.section_upcoming')}
              </div>
              <ul className="space-y-1">
                {data.upcoming.slice(0, 5).map(o => (
                  <UpcomingRow key={o.StandingOrderID} order={o} otherLabel={otherLabel} />
                ))}
              </ul>
            </div>
          )}

          {data.recent.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-1">
                {t('standing_order_widget.section_recent')}
              </div>
              <ul className="space-y-1">
                {data.recent.slice(0, 3).map(r => (
                  <RecentRow key={r.FulfillmentID} row={r} otherLabel={otherLabel} />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold leading-tight" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function UpcomingRow({ order: o, otherLabel }) {
  const { t } = useTranslation();
  const overdue = o.Status === 'overdue';
  const date = o.NextDeliveryDate
    ? new Date(o.NextDeliveryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '—';
  const when = overdue
    ? t('standing_order_widget.overdue')
    : o.DaysUntil === 0 ? t('standing_order_widget.today')
    : o.DaysUntil === 1 ? t('standing_order_widget.tomorrow')
    : `${date}`;
  return (
    <li className="flex items-center justify-between text-xs gap-2">
      <span className="truncate grow text-gray-700">
        <span className="font-semibold">{o.ProductTitle || t('standing_order_widget.default_order')}</span>
        <span className="text-gray-500"> — {otherLabel}: {o.OtherPartyName || '—'}</span>
      </span>
      <span className={`shrink-0 font-semibold ${overdue ? 'text-red-600' : 'text-[#3D6B34]'}`}>
        {when}
      </span>
    </li>
  );
}

function RecentRow({ row: r, otherLabel }) {
  const { t } = useTranslation();
  const date = r.DeliveredAt
    ? new Date(r.DeliveredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '—';
  return (
    <li className="flex items-center justify-between text-xs gap-2">
      <span className="truncate grow text-gray-700">
        ✅ <span className="font-semibold">{r.ProductTitle || t('standing_order_widget.default_delivered')}</span>
        <span className="text-gray-500"> — {otherLabel}: {r.OtherPartyName || '—'}</span>
      </span>
      <span className="shrink-0 text-gray-500">{date}</span>
    </li>
  );
}
