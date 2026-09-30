import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#3D6B34]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

const EMPTY = {
  SessionName: '',
  SessionDate: '',
  SessionTime: '',
  Price: 0,
  MaxTickets: '',
  Description: '',
  DisplayOrder: 0,
};

export default function EventMealsAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [ev, setEv] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState(null);
  const [showTickets, setShowTickets] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`)
      .then(r => r.ok ? r.json() : null)
      .then(setEv).catch(() => setEv(null));
  }, [eventId]);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/events/${eventId}/meals/sessions`, { headers: authHeaders() }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/events/${eventId}/meals/tickets`, { headers: authHeaders() }).then(r => r.ok ? r.json() : []),
    ]).then(([s, tix]) => {
      setSessions(Array.isArray(s) ? s : []);
      setTickets(Array.isArray(tix) ? tix : []);
      setLoading(false);
    }).catch(() => { setLoading(false); });
  };
  useEffect(load, [eventId]);

  const save = async () => {
    if (!editing?.SessionName?.trim()) { setErr(t('event_meals_admin.err_name_required')); return; }
    setErr('');
    try {
      const isNew = !editing.SessionID;
      const url = isNew
        ? `${API}/api/events/${eventId}/meals/sessions`
        : `${API}/api/events/meals/sessions/${editing.SessionID}`;
      const body = {
        SessionName:  editing.SessionName.trim(),
        SessionDate:  editing.SessionDate || null,
        SessionTime:  editing.SessionTime || null,
        Price:        Number(editing.Price || 0),
        MaxTickets:   editing.MaxTickets === '' ? null : Number(editing.MaxTickets),
        Description:  editing.Description || null,
        DisplayOrder: Number(editing.DisplayOrder || 0),
      };
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setEditing(null);
      load();
    } catch (e) {
      setErr(String(e.message || e));
    }
  };

  const seedDefaults = async () => {
    try {
      const res = await fetch(`${API}/api/events/${eventId}/meals/sessions/seed-defaults`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!res.ok) throw new Error(await res.text());
      load();
    } catch (e) {
      setErr(String(e.message || e));
    }
  };

  const remove = async (sessionId) => {
    if (!confirm(t('event_meals_admin.confirm_delete'))) return;
    try {
      const res = await fetch(`${API}/api/events/meals/sessions/${sessionId}`, {
        method: 'DELETE', headers: authHeaders(),
      });
      if (!res.ok) throw new Error(await res.text());
      load();
    } catch (e) {
      setErr(String(e.message || e));
    }
  };

  const totals = tickets.reduce((acc, tkt) => {
    acc.count += Number(tkt.Quantity || 0);
    acc.revenue += Number(tkt.LineAmount || 0);
    return acc;
  }, { count: 0, revenue: 0 });

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('event_meals_admin.heading')}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {t('event_meals_admin.subheading')}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {sessions.length === 0 && (
              <button
                onClick={seedDefaults}
                className="px-4 py-2 border border-amber-500 text-amber-700 rounded-lg text-sm hover:bg-amber-50"
                title="Adds Saturday Lunch, Banquet, and Sunday Brunch as a starting point"
              >
                {t('event_meals_admin.btn_seed_defaults')}
              </button>
            )}
            {ev?.BusinessID && (
              <button
                onClick={() => setShowCopy(true)}
                className="px-4 py-2 border border-[#3D6B34] text-[#3D6B34] rounded-lg text-sm hover:bg-[#3D6B34]/5"
              >
                {t('event_meals_admin.btn_copy')}
              </button>
            )}
            <button
              onClick={() => setEditing({ ...EMPTY })}
              className="px-4 py-2 bg-[#3D6B34] text-white rounded-lg text-sm hover:bg-[#2f5226]"
            >
              {t('event_meals_admin.btn_add_session')}
            </button>
          </div>
        </div>

        {err && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 mb-4">
            {err}
            <button onClick={() => setErr('')} className="ml-3 underline">{t('event_meals_admin.btn_dismiss')}</button>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <StatCard label={t('event_meals_admin.stat_sessions')} value={sessions.length} />
          <StatCard label={t('event_meals_admin.stat_tickets')} value={totals.count} />
          <StatCard label={t('event_meals_admin.stat_revenue')} value={`$${totals.revenue.toFixed(2)}`} />
        </div>

        {loading ? (
          <div className="text-sm text-gray-500">{t('event_meals_admin.loading')}</div>
        ) : sessions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-600">
            {t('event_meals_admin.no_sessions')}
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s.SessionID} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800">{s.SessionName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {s.SessionDate ? new Date(s.SessionDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : t('event_meals_admin.no_date')}
                    {s.SessionTime ? ` • ${s.SessionTime}` : ''}
                  </div>
                  {s.Description && (
                    <div className="text-xs text-gray-600 mt-1">{s.Description}</div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-semibold text-gray-800">${Number(s.Price || 0).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    {s.MaxTickets
                      ? t('event_meals_admin.sold_of', { n: s.SoldCount || 0, max: s.MaxTickets })
                      : t('event_meals_admin.sold_count', { n: s.SoldCount || 0 })}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setEditing({ ...s, SessionDate: s.SessionDate ? String(s.SessionDate).slice(0,10) : '' })}
                    className="text-xs text-[#3D6B34] hover:underline">{t('event_meals_admin.btn_edit')}</button>
                  <button onClick={() => remove(s.SessionID)}
                    className="text-xs text-red-600 hover:underline">{t('event_meals_admin.btn_delete')}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => setShowTickets(!showTickets)}
            className="text-sm font-semibold text-gray-700 hover:text-[#3D6B34]"
          >
            {showTickets ? '▼' : '▶'} {t('event_meals_admin.tickets_toggle', { n: tickets.length })}
          </button>
          {showTickets && tickets.length > 0 && (
            <div className="mt-3 overflow-x-auto border border-gray-200 rounded-lg bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-600">
                  <tr>
                    <th className="text-left px-3 py-2">{t('event_meals_admin.col_attendee')}</th>
                    <th className="text-left px-3 py-2">{t('event_meals_admin.col_session')}</th>
                    <th className="text-left px-3 py-2">{t('event_meals_admin.col_dietary')}</th>
                    <th className="text-right px-3 py-2">{t('event_meals_admin.col_qty')}</th>
                    <th className="text-right px-3 py-2">{t('event_meals_admin.col_total')}</th>
                    <th className="text-left px-3 py-2">{t('event_meals_admin.col_status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(tkt => (
                    <tr key={tkt.TicketID} className="border-t">
                      <td className="px-3 py-2">{tkt.AttendeeName || '—'}</td>
                      <td className="px-3 py-2">{tkt.SessionName}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">{tkt.DietaryNotes || ''}</td>
                      <td className="px-3 py-2 text-right">{tkt.Quantity}</td>
                      <td className="px-3 py-2 text-right">${Number(tkt.LineAmount || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 text-xs">{tkt.PaidStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editing && (
          <SessionEditor
            session={editing}
            onChange={setEditing}
            onSave={save}
            onCancel={() => { setEditing(null); setErr(''); }}
          />
        )}

        {showCopy && ev?.BusinessID && (
          <CopyFromEventModal
            currentEventId={Number(eventId)}
            businessId={ev.BusinessID}
            onClose={() => setShowCopy(false)}
            onCopied={() => { setShowCopy(false); load(); }}
            setErr={setErr}
          />
        )}
      </div>
    </EventAdminLayout>
  );
}

function CopyFromEventModal({ currentEventId, businessId, onClose, onCopied, setErr }) {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState(null);
  const [preview, setPreview] = useState([]);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/my-events?business_id=${businessId}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(rows => {
        const list = (Array.isArray(rows) ? rows : []).filter(e => e.EventID !== currentEventId);
        setEvents(list);
        setLoading(false);
      })
      .catch(() => { setEvents([]); setLoading(false); });
  }, [businessId, currentEventId]);

  useEffect(() => {
    if (!picked) { setPreview([]); return; }
    fetch(`${API}/api/events/${picked}/meals/sessions`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(rows => setPreview(Array.isArray(rows) ? rows : []))
      .catch(() => setPreview([]));
  }, [picked]);

  const sessionNoun = (n) => n === 1 ? t('event_meals_admin.session_one') : t('event_meals_admin.session_many');

  const doCopy = async () => {
    if (!picked) return;
    setCopying(true);
    try {
      const res = await fetch(`${API}/api/events/${currentEventId}/meals/sessions/copy-from/${picked}`, {
        method: 'POST', headers: authHeaders(),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.copied === 0) {
        setErr(t('event_meals_admin.copy_err_none'));
      }
      onCopied();
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{t('event_meals_admin.copy_modal_heading')}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {t('event_meals_admin.copy_modal_desc')}
          </p>
        </div>
        <div className="px-6 py-4 space-y-3">
          {loading ? (
            <div className="text-sm text-gray-500">{t('event_meals_admin.copy_loading')}</div>
          ) : events.length === 0 ? (
            <div className="text-sm text-gray-500 italic">{t('event_meals_admin.copy_no_events')}</div>
          ) : (
            <div>
              <label className={lbl}>{t('event_meals_admin.copy_lbl_source')}</label>
              <select className={inp} value={picked || ''} onChange={e => setPicked(e.target.value ? Number(e.target.value) : null)}>
                <option value="">{t('event_meals_admin.copy_choose')}</option>
                {events.map(e => (
                  <option key={e.EventID} value={e.EventID}>
                    {e.EventName}
                    {e.EventStartDate ? ` (${new Date(e.EventStartDate).toLocaleDateString()})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {picked && (
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="text-xs font-medium text-gray-600 mb-2">
                {t('event_meals_admin.copy_will_copy', { n: preview.length, noun: sessionNoun(preview.length) })}
              </div>
              {preview.length === 0 ? (
                <div className="text-xs text-gray-500 italic">{t('event_meals_admin.copy_no_sessions_src')}</div>
              ) : (
                <ul className="space-y-1 text-sm">
                  {preview.map(s => (
                    <li key={s.SessionID} className="flex justify-between gap-2">
                      <span className="text-gray-800 truncate">{s.SessionName}</span>
                      <span className="text-gray-500 text-xs shrink-0">${Number(s.Price || 0).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white">
            {t('event_meals_admin.btn_cancel')}
          </button>
          <button
            onClick={doCopy}
            disabled={!picked || copying || preview.length === 0}
            className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2f5226] disabled:opacity-50"
          >
            {copying
              ? t('event_meals_admin.btn_copying')
              : t('event_meals_admin.btn_copy_n', { n: preview.length || '', noun: sessionNoun(preview.length) })}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-gray-800 mt-1">{value}</div>
    </div>
  );
}

function SessionEditor({ session, onChange, onSave, onCancel }) {
  const { t } = useTranslation();
  const set = (k) => (e) => onChange({ ...session, [k]: e.target.value });
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {session.SessionID ? t('event_meals_admin.editor_heading_edit') : t('event_meals_admin.editor_heading_add')}
          </h3>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div>
            <label className={lbl}>{t('event_meals_admin.lbl_name')}</label>
            <input className={inp} value={session.SessionName} onChange={set('SessionName')} placeholder={t('event_meals_admin.placeholder_name')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>{t('event_meals_admin.lbl_date')}</label>
              <input type="date" className={inp} value={session.SessionDate || ''} onChange={set('SessionDate')} />
            </div>
            <div>
              <label className={lbl}>{t('event_meals_admin.lbl_time')}</label>
              <input className={inp} value={session.SessionTime || ''} onChange={set('SessionTime')} placeholder={t('event_meals_admin.placeholder_time')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>{t('event_meals_admin.lbl_price')}</label>
              <input type="number" step="0.01" min="0" className={inp} value={session.Price} onChange={set('Price')} />
            </div>
            <div>
              <label className={lbl}>{t('event_meals_admin.lbl_max_tickets')}</label>
              <input type="number" min="1" className={inp} value={session.MaxTickets ?? ''} onChange={set('MaxTickets')} placeholder={t('event_meals_admin.placeholder_unlimited')} />
            </div>
          </div>
          <div>
            <label className={lbl}>{t('event_meals_admin.lbl_description')}</label>
            <textarea className={inp} rows={3} value={session.Description || ''} onChange={set('Description')}
              placeholder={t('event_meals_admin.placeholder_desc')} />
          </div>
          <div>
            <label className={lbl}>{t('event_meals_admin.lbl_display_order')}</label>
            <input type="number" className={inp} value={session.DisplayOrder || 0} onChange={set('DisplayOrder')} />
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white">
            {t('event_meals_admin.btn_cancel')}
          </button>
          <button onClick={onSave} className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2f5226]">
            {t('event_meals_admin.btn_save')}
          </button>
        </div>
      </div>
    </div>
  );
}
