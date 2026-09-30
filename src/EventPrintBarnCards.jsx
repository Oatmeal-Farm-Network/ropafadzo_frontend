import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

function fmtDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString(); } catch { return String(d); }
}

/**
 * Print-ready barn cards for halter entries.
 * One card per animal registration, Letter half-page (2 per sheet, landscape-friendly).
 * Shows: animal name, owner/business, classes entered, class codes.
 */
export default function EventPrintBarnCards() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [e, regs] = await Promise.all([
          fetch(`${API}/api/events/${eventId}`).then(r => r.json()),
          fetch(`${API}/api/events/${eventId}/halter/registrations`, { headers: authHeaders() })
            .then(r => r.ok ? r.json() : []),
        ]);
        setEvent(e);
        setRows(Array.isArray(regs) ? regs : []);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <div className="no-print max-w-3xl mx-auto p-5">
        <h1 className="text-2xl font-semibold text-[#3D6B34] mb-1">{t('event_print_barn_cards.heading')}</h1>
        <p className="text-sm text-gray-600 mb-4">
          {loading
            ? t('event_print_barn_cards.loading')
            : t('event_print_barn_cards.animal_count', { n: rows.length, s: rows.length === 1 ? '' : 's' })}
          {' — '}
          {t('event_print_barn_cards.print_instruction')}
        </p>
        <div className="flex gap-3 mb-4">
          <button onClick={() => window.print()}
            className="px-4 py-2 text-sm rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226]">
            {t('event_print_barn_cards.btn_print')}
          </button>
          <button onClick={() => window.history.back()}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            {t('event_print_barn_cards.btn_back')}
          </button>
        </div>
      </div>

      <div className="print-sheet mx-auto bg-white">
        {rows.map((r, i) => (
          <div key={r.RegID || i} className="barn-card">
            <div className="header">
              <div className="event">{event?.EventName || ''}</div>
              <div className="reg-id">Reg #{r.RegID}</div>
            </div>
            <div className="animal-name">{r.AnimalName || r.RegisteredName || '—'}</div>
            {r.RegisteredName && r.AnimalName !== r.RegisteredName && (
              <div className="registered-name">{t('event_print_barn_cards.registered_label')} {r.RegisteredName}</div>
            )}
            <div className="owner">
              <span className="label">{t('event_print_barn_cards.exhibitor_label')}</span>{' '}
              {[r.FirstName, r.LastName].filter(Boolean).join(' ') || '—'}
              {r.BusinessName && <div className="business">{r.BusinessName}</div>}
            </div>
            <div className="details">
              {r.AnimalGender && <span><strong>{t('event_print_barn_cards.sex_label')}</strong> {r.AnimalGender}</span>}
              {r.DateOfBirth && <span><strong>{t('event_print_barn_cards.dob_label')}</strong> {fmtDate(r.DateOfBirth)}</span>}
              {r.EarTagNumber && <span><strong>{t('event_print_barn_cards.tag_label')}</strong> {r.EarTagNumber}</span>}
            </div>
            <div className="classes">
              <div className="label">{t('event_print_barn_cards.classes_label')}</div>
              {(r.classes || []).length === 0 ? (
                <div className="class-none">{t('event_print_barn_cards.class_none')}</div>
              ) : (
                <ul>
                  {(r.classes || []).map(c => (
                    <li key={c.EntryID}>
                      {c.ClassCode && <span className="code">{c.ClassCode}</span>}
                      {' '}{c.ClassName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
        {rows.length === 0 && !loading && (
          <div className="text-gray-400 italic p-6 no-print">{t('event_print_barn_cards.no_registrations')}</div>
        )}
      </div>

      <style>{`
        .print-sheet {
          width: 8.5in;
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: 5.25in;
          gap: 0.25in;
          padding: 0.5in;
        }
        .barn-card {
          border: 2px solid #3D6B34;
          border-radius: 8px;
          padding: 0.3in;
          page-break-inside: avoid;
          display: flex;
          flex-direction: column;
        }
        .barn-card .header {
          display: flex;
          justify-content: space-between;
          font-size: 10pt;
          color: #3D6B34;
          font-weight: 600;
          text-transform: uppercase;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.08in;
          margin-bottom: 0.12in;
        }
        .barn-card .animal-name {
          font-size: 32pt;
          font-weight: 700;
          color: #222;
          line-height: 1;
        }
        .barn-card .registered-name {
          font-size: 10pt;
          color: #666;
          font-style: italic;
          margin-top: 0.04in;
        }
        .barn-card .owner {
          font-size: 13pt;
          margin-top: 0.15in;
          color: #444;
        }
        .barn-card .owner .label { color: #888; font-size: 9pt; text-transform: uppercase; }
        .barn-card .owner .business { font-size: 11pt; color: #666; }
        .barn-card .details {
          font-size: 10pt;
          color: #555;
          margin-top: 0.12in;
          display: flex;
          gap: 0.2in;
          flex-wrap: wrap;
        }
        .barn-card .classes {
          margin-top: 0.15in;
          font-size: 10pt;
        }
        .barn-card .classes .label { color: #888; font-size: 9pt; text-transform: uppercase; }
        .barn-card .classes ul { margin: 0.05in 0 0 0.1in; padding: 0; list-style: disc; }
        .barn-card .classes li { margin-bottom: 0.04in; }
        .barn-card .classes .code {
          display: inline-block;
          background: #3D6B34;
          color: white;
          padding: 1px 5px;
          font-size: 8pt;
          border-radius: 3px;
          font-family: monospace;
        }
        @media print {
          .no-print { display: none !important; }
          @page { size: letter; margin: 0; }
        }
      `}</style>
    </div>
  );
}
