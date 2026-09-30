import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";

export default function EventCheckIn() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [toast, setToast] = useState('');
  const [kiosk, setKiosk] = useState(() =>
    localStorage.getItem('event_checkin_kiosk') === 'true'
  );
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('event_checkin_kiosk', String(kiosk));
  }, [kiosk]);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    inputRef.current?.focus();
  }, [eventId]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!q.trim()) { setRows([]); return; }
      fetch(`${API}/api/events/${eventId}/checkin/search?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(d => setRows(Array.isArray(d) ? d : []))
        .catch(() => setRows([]));
    }, 250);
    return () => clearTimeout(timerId);
  }, [q, eventId]);

  const toggle = async (r) => {
    const next = !r.CheckedIn;
    await fetch(`${API}/api/events/checkin/${r.Kind}/${r.RegID}`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ CheckedIn: next }),
    });
    setRows(rows.map(x => (x.Kind === r.Kind && x.RegID === r.RegID) ? { ...x, CheckedIn: next } : x));
    setToast(next ? t('event_checkin.toast_checked_in', { name: r.Name }) : t('event_checkin.toast_undone', { name: r.Name }));
    setTimeout(() => setToast(''), 1500);
  };

  const body = (
    <div className={kiosk ? 'min-h-screen bg-[#FAF7EE] py-6 px-4' : 'py-6 px-4'}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <Link to={`/events/${eventId}`} className="text-xs text-gray-500 hover:text-[#3D6B34]">{t('event_checkin.back')}</Link>
          <button
            onClick={() => setKiosk(k => !k)}
            className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
            title={kiosk ? t('event_checkin.kiosk_title_exit') : t('event_checkin.kiosk_title_enter')}>
            {kiosk ? t('event_checkin.kiosk_exit') : t('event_checkin.kiosk_enter')}
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-[#3D6B34] mt-1">{t('event_checkin.heading')}</h1>
        <div className="text-sm text-gray-500 mb-4">{event?.EventName}</div>

        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <input
            ref={inputRef}
            className={inp + ' text-lg py-3'}
            placeholder={t('event_checkin.placeholder')}
            value={q}
            onChange={e => setQ(e.target.value)}
            autoFocus
          />
          <div className="text-xs text-gray-500 mt-2">{t('event_checkin.tip')}</div>
        </div>

        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#3D6B34] text-white text-sm px-4 py-2 rounded-lg shadow z-50">
            {toast}
          </div>
        )}

        <div className="space-y-2">
          {rows.length === 0 && q && (
            <div className="bg-white rounded-xl shadow p-5 text-sm text-gray-500 text-center">{t('event_checkin.no_matches')}</div>
          )}
          {rows.map(r => (
            <div key={`${r.Kind}-${r.RegID}`}
              className={`bg-white rounded-xl shadow p-4 flex items-center justify-between gap-3
                ${r.CheckedIn ? 'border-l-4 border-green-500' : ''}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {r.Kind}
                  </span>
                  <span className="font-medium text-gray-800 truncate">{r.Name}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {r.Email || t('event_checkin.reg_id', { id: r.RegID })}
                  {r.PartySize > 1 && ` · ${t('event_checkin.party_size', { count: r.PartySize })}`}
                  {r.BadgeCode && ` · ${t('event_checkin.badge', { code: r.BadgeCode })}`}
                  {r.EntryNumber && ` · ${t('event_checkin.entry', { num: r.EntryNumber })}`}
                </div>
                {r.PaidStatus && (
                  <div className={`text-xs mt-0.5 ${r.PaidStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                    {r.PaidStatus}
                  </div>
                )}
              </div>
              <button
                onClick={() => toggle(r)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${r.CheckedIn
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-[#3D6B34] text-white hover:bg-[#2d5025]'}`}>
                {r.CheckedIn ? t('event_checkin.btn_checked_in') : t('event_checkin.btn_check_in')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (kiosk) return body;
  return <EventAdminLayout eventId={eventId}>{body}</EventAdminLayout>;
}
