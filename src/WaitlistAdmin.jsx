import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

const KIND_KEY_MAP = {
  meal_session:       'meal_session',
  conference_session: 'conference_session',
  tour_slot:          'tour_slot',
  dining_table:       'dining_table',
  halter_class:       'halter_class',
};

const STATUS_COLORS = {
  waiting:  'bg-amber-100 text-amber-700',
  offered:  'bg-blue-100 text-blue-700',
  promoted: 'bg-green-100 text-green-700',
  declined: 'bg-gray-100 text-gray-600',
  expired:  'bg-gray-100 text-gray-500',
};

export default function WaitlistAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/events/${eventId}/waitlist`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setRows(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };
  useEffect(load, [eventId]);

  const promote = async (r) => {
    const res = await fetch(`${API}/api/events/${eventId}/waitlist/promote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ ResourceKind: r.ResourceKind, ResourceID: r.ResourceID }),
    });
    if (!res.ok) { alert(t('waitlist_admin.err_promote_failed')); return; }
    const d = await res.json();
    if (!d.promoted) { alert(d.message || t('waitlist_admin.err_nothing_to_promote')); return; }
    alert(t('waitlist_admin.msg_offered', { email: d.email || t('waitlist_admin.next_person') }));
    load();
  };

  const drop = async (r) => {
    if (!confirm(t('waitlist_admin.confirm_remove', { email: r.Email }))) return;
    await fetch(`${API}/api/events/waitlist/${r.WaitID}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    load();
  };

  const grouped = {};
  rows.forEach(r => {
    const key = `${r.ResourceKind}:${r.ResourceID}`;
    if (!grouped[key]) grouped[key] = { kind: r.ResourceKind, rid: r.ResourceID, rows: [] };
    grouped[key].rows.push(r);
  });

  const visible = filter === 'all'
    ? rows
    : rows.filter(r => r.Status === filter);

  const filters = [
    ['all',      t('waitlist_admin.filter_all', { n: rows.length })],
    ['waiting',  t('waitlist_admin.filter_waiting', { n: rows.filter(r => r.Status === 'waiting').length })],
    ['offered',  t('waitlist_admin.filter_offered', { n: rows.filter(r => r.Status === 'offered').length })],
    ['promoted', t('waitlist_admin.filter_confirmed', { n: rows.filter(r => r.Status === 'promoted').length })],
    ['declined', t('waitlist_admin.filter_declined', { n: rows.filter(r => r.Status === 'declined').length })],
  ];

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold text-[#3D6B34]">{t('waitlist_admin.heading')}</h1>
        <p className="text-sm text-gray-600 mt-1 mb-5">{t('waitlist_admin.intro')}</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {filters.map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`text-xs px-3 py-1.5 rounded-full border ${filter === k
                ? 'bg-[#3D6B34] text-white border-[#3D6B34]'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-500">{t('waitlist_admin.loading')}</div>
        ) : visible.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-sm text-gray-500">
            {filter !== 'all'
              ? t('waitlist_admin.empty_filtered', { filter })
              : t('waitlist_admin.empty')}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(grouped).map(g => {
              const shown = g.rows.filter(r => filter === 'all' || r.Status === filter);
              if (shown.length === 0) return null;
              return (
                <div key={`${g.kind}-${g.rid}`} className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-800">
                      {t(`waitlist_admin.kind_${KIND_KEY_MAP[g.kind] || 'unknown'}`, { defaultValue: g.kind })} <span className="text-gray-400">#{g.rid}</span>
                    </div>
                    <button onClick={() => promote({ ResourceKind: g.kind, ResourceID: g.rid })}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226]">
                      {t('waitlist_admin.btn_offer_next')}
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="text-[10px] uppercase text-gray-500">
                      <tr>
                        <th className="text-left px-4 py-2">{t('waitlist_admin.th_num')}</th>
                        <th className="text-left px-4 py-2">{t('waitlist_admin.th_name')}</th>
                        <th className="text-left px-4 py-2">{t('waitlist_admin.th_email')}</th>
                        <th className="text-left px-4 py-2">{t('waitlist_admin.th_party')}</th>
                        <th className="text-left px-4 py-2">{t('waitlist_admin.th_joined')}</th>
                        <th className="text-left px-4 py-2">{t('waitlist_admin.th_status')}</th>
                        <th className="text-right px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((r, i) => (
                        <tr key={r.WaitID} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-gray-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-2 text-gray-800">{r.Name || '—'}</td>
                          <td className="px-4 py-2 text-gray-600 text-xs">{r.Email || '—'}</td>
                          <td className="px-4 py-2 text-gray-600 text-xs">{r.PartySize}</td>
                          <td className="px-4 py-2 text-gray-500 text-xs">{r.CreatedDate ? new Date(r.CreatedDate).toLocaleString() : ''}</td>
                          <td className="px-4 py-2">
                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-semibold ${STATUS_COLORS[r.Status] || 'bg-gray-100 text-gray-600'}`}>
                              {r.Status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button onClick={() => drop(r)} className="text-xs text-red-600 hover:underline">{t('waitlist_admin.btn_remove')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </EventAdminLayout>
  );
}
