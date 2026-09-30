import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US',
      { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return String(d); }
}

function daysUntil(d) {
  if (!d) return null;
  const target = new Date(d);
  if (isNaN(target)) return null;
  const diff = Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function DashboardEventsCard({ peopleId }) {
  const { t } = useTranslation();
  const { businesses } = useAccount() || {};
  const [data, setData] = useState({ hosting: [], registered: [], pending: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!peopleId) return;
    setLoading(true);
    const attendeePromise = fetch(`${API}/api/my-upcoming-events?people_id=${peopleId}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : { registered: [], pending: [] })
      .catch(() => ({ registered: [], pending: [] }));

    const bizIds = (businesses || []).map(b => b.BusinessID).filter(Boolean);
    const hostingPromise = bizIds.length === 0
      ? Promise.resolve([])
      : Promise.all(bizIds.map(id =>
          fetch(`${API}/api/my-events?business_id=${id}`, { headers: authHeaders() })
            .then(r => r.ok ? r.json() : [])
            .catch(() => [])
        )).then(results => {
          const merged = [].concat(...results.map(r => Array.isArray(r) ? r : []));
          const today = new Date(); today.setHours(0, 0, 0, 0);
          return merged
            .filter(e => !e.EventEndDate || new Date(e.EventEndDate) >= today)
            .sort((a, b) => new Date(a.EventStartDate || 0) - new Date(b.EventStartDate || 0));
        });

    Promise.all([attendeePromise, hostingPromise])
      .then(([attendee, hosting]) => {
        setData({ hosting, registered: attendee.registered || [], pending: attendee.pending || [] });
      })
      .finally(() => setLoading(false));
  }, [peopleId, businesses]);

  const total = (data.hosting?.length || 0) + (data.registered?.length || 0) + (data.pending?.length || 0);

  if (loading) return null;
  if (total === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{t('dash_events.heading')}</h2>
        <Link to="/events" className="text-xs text-[#3D6B34] hover:underline">{t('dash_events.browse_all')}</Link>
      </div>

      {data.pending?.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wide text-amber-700 font-semibold mb-1.5">
            {t('dash_events.pending_heading', { count: data.pending.length })}
          </div>
          {data.pending.map(c => (
            <Link key={c.CartID}
              to={`/events/${c.EventID}/register/wizard?cart=${c.CartID}`}
              className="block border border-amber-200 bg-amber-50 rounded-lg px-3 py-2 mb-2 hover:bg-amber-100">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{c.EventName}</div>
                  <div className="text-xs text-gray-500">
                    {t('dash_events.cart_info', { amount: Number(c.Total || 0).toFixed(2), date: fmtDate(c.CreatedDate) })}
                  </div>
                </div>
                <span className="text-xs text-amber-700 font-semibold whitespace-nowrap ml-2">
                  {t('dash_events.btn_resume')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {data.registered?.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-1.5">
            {t('dash_events.registered_heading')}
          </div>
          {data.registered.slice(0, 4).map(e => {
            const days = daysUntil(e.EventStartDate);
            return (
              <Link key={e.EventID} to={`/events/${e.EventID}`}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 mb-2 hover:border-[#3D6B34]">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{e.EventName}</div>
                  <div className="text-xs text-gray-500">
                    {fmtDate(e.EventStartDate)}
                    {[e.EventLocationCity, e.EventLocationState].filter(Boolean).length > 0 &&
                      ` · ${[e.EventLocationCity, e.EventLocationState].filter(Boolean).join(', ')}`}
                  </div>
                </div>
                {days != null && days >= 0 && days <= 30 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#3D6B34]/10 text-[#3D6B34] font-semibold ml-2 whitespace-nowrap">
                    {t('dash_events.in_days', { days })}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {data.hosting?.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-1.5">
            {t('dash_events.hosting_heading')}
          </div>
          {data.hosting.slice(0, 4).map(e => (
            <Link key={e.EventID} to={`/events/${e.EventID}/admin/dashboard`}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 mb-2 hover:border-[#3D6B34]">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {e.EventName}
                  {!e.IsPublished && <span className="ml-2 text-[10px] text-gray-400 uppercase">{t('dash_events.draft')}</span>}
                </div>
                <div className="text-xs text-gray-500">
                  {fmtDate(e.EventStartDate)} · {t('dash_events.paid_revenue', { paid: e.PaidCartCount || 0, revenue: Number(e.Revenue || 0).toFixed(0) })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
