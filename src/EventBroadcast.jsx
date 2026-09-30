import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";

export default function EventBroadcast() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/broadcast/recipients`)
      .then(r => r.json()).then(d => setRecipients(d.recipients || []))
      .catch(() => {});
  }, [eventId]);

  const send = async () => {
    if (!subject || !bodyHtml) return;
    if (!confirm(t('event_broadcast.confirm_send', { count: recipients.length }))) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/api/events/${eventId}/broadcast/send`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ Subject: subject, Body: bodyHtml }),
      });
      const d = await res.json();
      setResult(d);
      if (res.ok) { setSubject(''); setBodyHtml(''); }
    } finally {
      setSending(false);
    }
  };

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link to={`/events/${eventId}/manage`} className="text-xs text-gray-500 hover:text-[#3D6B34]">← Back to manage</Link>
        <h1 className="text-3xl font-semibold text-[#3D6B34] mt-2 mb-1">{t('event_broadcast.heading')}</h1>
        <div className="text-sm text-gray-500 mb-6">{event?.EventName}</div>

        <div className="bg-white rounded-xl shadow p-5 mb-4">
          <div className="text-sm font-medium mb-2">{t('event_broadcast.recipients_label', { count: recipients.length })}</div>
          {recipients.length === 0 ? (
            <div className="text-xs text-gray-500">{t('event_broadcast.no_recipients')}</div>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-auto">
              {recipients.map(r => (
                <span key={r.Email} className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                  {r.Name || r.Email}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('event_broadcast.label_subject')}</label>
            <input className={inp} value={subject}
              placeholder={t('event_broadcast.placeholder_subject')}
              onChange={e => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t('event_broadcast.label_message')} <code>{'{{name}}'}</code> {t('event_broadcast.label_message_hint')}
            </label>
            <textarea rows={10} className={inp} value={bodyHtml}
              placeholder={'Hi {{name}},\n\n...'}
              onChange={e => setBodyHtml(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Link to={`/events/${eventId}/manage`}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
              {t('event_broadcast.btn_cancel')}
            </Link>
            <button onClick={send} disabled={sending || !subject || !bodyHtml || recipients.length === 0}
              className="px-4 py-2 bg-[#3D6B34] text-white text-sm rounded-lg hover:bg-[#2d5025] disabled:opacity-50">
              {sending ? t('event_broadcast.btn_sending') : t('event_broadcast.btn_send', { count: recipients.length })}
            </button>
          </div>
          {result && (
            <div className={`text-sm mt-2 ${result.sent > 0 ? 'text-green-700' : 'text-red-600'}`}>
              {t('event_broadcast.result_sent', { count: result.sent || 0 })}
              {result.failed > 0 && ` · ${t('event_broadcast.result_failed', { count: result.failed })}`}
              {result.message && ` · ${result.message}`}
            </div>
          )}
        </div>
      </div>
    </EventAdminLayout>
  );
}
