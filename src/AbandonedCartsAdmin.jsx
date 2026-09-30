import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AbandonedCartsAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(24);
  const [busy, setBusy] = useState(null);
  const [bulkResult, setBulkResult] = useState(null);

  function timeAgo(iso) {
    if (!iso) return '';
    const dt = new Date(iso);
    if (isNaN(dt)) return String(iso);
    const mins = Math.floor((Date.now() - dt.getTime()) / 60000);
    if (mins < 60) return t('abandoned_carts.time_m', { n: mins });
    if (mins < 1440) return t('abandoned_carts.time_h', { n: Math.floor(mins / 60) });
    return t('abandoned_carts.time_d', { n: Math.floor(mins / 1440) });
  }

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/events/${eventId}/carts/abandoned?hours=${hours}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setRows(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };
  useEffect(load, [eventId, hours]);

  const sendOne = async (c) => {
    setBusy(c.CartID);
    try {
      const res = await fetch(`${API}/api/events/cart/${c.CartID}/send-reminder`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!res.ok) {
        const errText = await res.text();
        alert(t('abandoned_carts.alert_failed', { err: errText }));
      } else {
        load();
      }
    } finally {
      setBusy(null);
    }
  };

  const sendAll = async () => {
    if (!confirm(t('abandoned_carts.confirm_send_all', { hours }))) return;
    setBusy('all'); setBulkResult(null);
    try {
      const res = await fetch(`${API}/api/events/${eventId}/carts/send-all-reminders?hours=${hours}`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!res.ok) { alert(t('abandoned_carts.alert_bulk_failed')); return; }
      setBulkResult(await res.json());
      load();
    } finally { setBusy(null); }
  };

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold text-[#3D6B34]">{t('abandoned_carts.heading')}</h1>
        <p className="text-sm text-gray-600 mt-1 mb-5">{t('abandoned_carts.desc')}</p>

        <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">{t('abandoned_carts.label_older_than')}</label>
            <select value={hours} onChange={e => setHours(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm">
              <option value={1}>{t('abandoned_carts.opt_1h')}</option>
              <option value={6}>{t('abandoned_carts.opt_6h')}</option>
              <option value={24}>{t('abandoned_carts.opt_24h')}</option>
              <option value={72}>{t('abandoned_carts.opt_3d')}</option>
              <option value={168}>{t('abandoned_carts.opt_1w')}</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            {t('abandoned_carts.eligible', { count: rows.length })}
          </div>
          <div className="flex-1" />
          <button onClick={sendAll} disabled={busy === 'all' || rows.length === 0}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226] disabled:opacity-50">
            {busy === 'all' ? t('abandoned_carts.btn_sending') : t('abandoned_carts.btn_send_all')}
          </button>
        </div>

        {bulkResult && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded p-3 text-sm mb-4">
            {t('abandoned_carts.bulk_result', { sent: bulkResult.sent, failed: bulkResult.failed, candidates: bulkResult.candidates })}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-500">{t('abandoned_carts.loading')}</div>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-sm text-gray-500">
            {t('abandoned_carts.empty', { hours })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2">{t('abandoned_carts.th_cart')}</th>
                  <th className="text-left px-4 py-2">{t('abandoned_carts.th_attendee')}</th>
                  <th className="text-left px-4 py-2">{t('abandoned_carts.th_email')}</th>
                  <th className="text-right px-4 py-2">{t('abandoned_carts.th_total')}</th>
                  <th className="text-left px-4 py-2">{t('abandoned_carts.th_started')}</th>
                  <th className="text-left px-4 py-2">{t('abandoned_carts.th_last_reminder')}</th>
                  <th className="text-right px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(c => (
                  <tr key={c.CartID} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-mono text-xs text-gray-500">#{c.CartID}</td>
                    <td className="px-4 py-2 text-gray-800">
                      {[c.AttendeeFirstName, c.AttendeeLastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-4 py-2 text-gray-600 text-xs">{c.AttendeeEmail}</td>
                    <td className="px-4 py-2 text-right text-gray-800">${Number(c.Total || 0).toFixed(2)}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">{timeAgo(c.CreatedDate)}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">
                      {c.LastReminderSent ? timeAgo(c.LastReminderSent) : <span className="text-gray-400 italic">{t('abandoned_carts.never')}</span>}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => sendOne(c)}
                        disabled={busy === c.CartID}
                        className="text-xs text-[#3D6B34] hover:underline disabled:opacity-50">
                        {busy === c.CartID ? t('abandoned_carts.btn_sending') : (c.LastReminderSent ? t('abandoned_carts.btn_resend') : t('abandoned_carts.btn_send_reminder'))}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </EventAdminLayout>
  );
}
