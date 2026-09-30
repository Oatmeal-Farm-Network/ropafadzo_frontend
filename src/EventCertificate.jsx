import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

export default function EventCertificate() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [sp] = useSearchParams();
  const name = sp.get('name') || '';
  const regId = sp.get('reg') || '';
  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/simple/config`).then(r => r.json()).then(setCfg).catch(() => {});
  }, [eventId]);

  const issueDate = new Date();
  const startDate = event?.EventStartDate ? new Date(event.EventStartDate) : null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto mb-4 print:hidden flex items-center justify-between">
        <Link to={`/events/${eventId}`} className="text-xs text-gray-500 hover:text-[#3D6B34]">{t('event_certificate.back')}</Link>
        <button onClick={() => window.print()} className="px-4 py-2 bg-[#3D6B34] text-white text-sm rounded-lg hover:bg-[#2d5025]">
          {t('event_certificate.btn_print')}
        </button>
      </div>

      {cfg && !cfg.CertificateEnabled ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6 text-center">
          <div className="text-lg font-semibold text-gray-700">{t('event_certificate.cert_disabled_heading')}</div>
          <p className="text-sm text-gray-500 mt-1">{t('event_certificate.cert_disabled_body')}</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white shadow-xl print:shadow-none border-8 border-double border-[#3D6B34] p-12 text-center"
             style={{ aspectRatio: '11 / 8.5', fontFamily: 'Georgia, serif' }}>
          <div className="text-xs uppercase tracking-[0.3em] text-[#819360] mb-2">{t('event_certificate.title')}</div>
          <div className="w-24 h-0.5 bg-[#3D6B34] mx-auto mb-8" />
          <div className="text-sm text-gray-500">{t('event_certificate.this_certifies')}</div>
          <div className="text-4xl font-semibold text-[#3D6B34] my-4">{name || t('event_certificate.attendee_placeholder')}</div>
          <div className="text-sm text-gray-500">{t('event_certificate.completed')}</div>
          <div className="text-2xl font-medium text-gray-800 my-3">{event?.EventName || 'Event'}</div>
          {cfg?.SpeakerName && (
            <div className="text-sm text-gray-600 italic">{t('event_certificate.presented_by', { name: cfg.SpeakerName })}</div>
          )}
          {cfg?.SkillLevel && (
            <div className="text-xs text-gray-500 mt-2">{cfg.SkillLevel}</div>
          )}
          <div className="w-full mt-10 pt-6 border-t border-gray-200 grid grid-cols-3 text-xs text-gray-500">
            <div>
              <div className="font-medium text-gray-700">
                {startDate ? startDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              </div>
              <div>{t('event_certificate.footer_event_date')}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">
                {issueDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div>{t('event_certificate.footer_issued')}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700 font-mono">{regId || '—'}</div>
              <div>{t('event_certificate.footer_ref')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
