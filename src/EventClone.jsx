import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

export default function EventClone() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(t('event_clone.err_not_found'))))
      .then(d => {
        setSrc(d);
        setNewName(`${d.EventName} ${t('event_clone.copy_suffix')}`);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      const body = { EventName: newName };
      if (newStart) body.EventStartDate = newStart;
      if (newEnd)   body.EventEndDate = newEnd;
      const r = await fetch(`${API}/api/events/${eventId}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || t('event_clone.err_clone_failed'));
      const { EventID } = await r.json();
      navigate(`/events/${EventID}/dashboard`);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('event_clone.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('event_clone.desc')}</p>
          </div>
          <Link to={`/events/${eventId}/dashboard`} className="text-sm text-gray-500 hover:text-gray-700">
            {t('event_clone.back')}
          </Link>
        </div>

        {loading && <div className="text-sm text-gray-500">{t('event_clone.loading')}</div>}

        {src && (
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="bg-[#f6f8f3] border border-[#3D6B34]/20 rounded-lg px-4 py-3 mb-6">
              <div className="text-xs text-gray-500 uppercase tracking-wide">{t('event_clone.source_label')}</div>
              <div className="font-semibold text-gray-800">{src.EventName}</div>
              <div className="text-xs text-gray-500 mt-1">{src.EventType}</div>
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                {err}
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className={lbl}>{t('event_clone.label_name')}</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)}
                       className={inp} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>{t('event_clone.label_start')}</label>
                  <input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('event_clone.label_end')}</label>
                  <input type="date" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className={inp} />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                <strong>{t('event_clone.what_copied')}</strong> {t('event_clone.what_copied_body')}
              </div>

              <div className="flex justify-end items-center gap-3 pt-2">
                <Link to={`/events/${eventId}/dashboard`}
                      className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 no-underline">
                  {t('event_clone.btn_cancel')}
                </Link>
                <button type="submit" disabled={saving || !newName.trim()}
                        className="bg-[#3D6B34] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#2d5226] disabled:opacity-50">
                  {saving ? t('event_clone.btn_cloning') : t('event_clone.btn_clone')}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </EventAdminLayout>
  );
}
