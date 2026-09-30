import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

export default function EventExportsHub() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const CATEGORY_ORDER = [
    { key: 'reg', title: t('event_exports.cat_reg'), keys: ['registrations-carts', 'simple-registrations',
      'conference-attendees', 'dining-registrations', 'tour-registrations', 'vendor-applications'] },
    { key: 'show', title: t('event_exports.cat_show'), keys: ['halter-entries', 'fleece-entries', 'spinoff-entries', 'fiber-arts-entries',
      'competition-entries'] },
    { key: 'sched', title: t('event_exports.cat_sched'), keys: ['halter-schedule', 'conference-schedule', 'competition-leaderboard'] },
    { key: 'food', title: t('event_exports.cat_food'), keys: ['meal-tickets'] },
    { key: 'comms', title: t('event_exports.cat_comms'), keys: ['mailing-list', 'all-emails'] },
  ];

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/exports/manifest`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then(setManifest)
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [eventId]);

  const byKey = {};
  (manifest?.exports || []).forEach(e => { byKey[e.key] = e; });

  const download = (exp) => {
    const url = `${API}${exp.url}`;
    window.open(url, '_blank');
  };

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold text-[#3D6B34]">{t('event_exports.heading')}</h1>
        <p className="text-sm text-gray-600 mt-1 mb-6">
          {t('event_exports.subheading')}
        </p>

        {loading && <div className="text-sm text-gray-500">{t('event_exports.loading')}</div>}
        {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">{err}</div>}

        {!loading && manifest && CATEGORY_ORDER.map(cat => {
          const items = cat.keys.map(k => byKey[k]).filter(Boolean);
          if (items.length === 0) return null;
          return (
            <div key={cat.key} className="mb-6">
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">{cat.title}</div>
              <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
                {items.map(exp => (
                  <div key={exp.key} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-800">{exp.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5 font-mono truncate">{exp.url}</div>
                    </div>
                    <button onClick={() => download(exp)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226] whitespace-nowrap">
                      {t('event_exports.btn_download')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {!loading && manifest && manifest.exports?.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-500">
            {t('event_exports.no_exports')}
          </div>
        )}

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
          <div className="font-semibold mb-1">{t('event_exports.tip_title')}</div>
          {t('event_exports.tip_body')}
        </div>
      </div>
    </EventAdminLayout>
  );
}
