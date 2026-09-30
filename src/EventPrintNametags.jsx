import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Print-ready nametags for all paid attendees on an event.
 * Layout: 2 columns × 5 rows per Letter sheet (Avery 5163 style, 2" × 4" labels).
 * Source rows: paid cart rows (payer) + all OFNEventCartAttendees.
 */
export default function EventPrintNametags() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [e, carts] = await Promise.all([
          fetch(`${API}/api/events/${eventId}`).then(r => r.json()),
          fetch(`${API}/api/events/${eventId}/carts/paid-with-attendees`, { headers: authHeaders() })
            .then(r => r.ok ? r.json() : []),
        ]);
        setEvent(e);
        const flat = [];
        (Array.isArray(carts) ? carts : []).forEach(c => {
          flat.push({
            FirstName: c.AttendeeFirstName,
            LastName: c.AttendeeLastName,
            Role: 'Registrant',
            NameTagTitle: c.AttendeeBusinessName || '',
          });
          (c.Attendees || []).forEach(a => flat.push(a));
        });
        setRows(flat);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <div className="no-print max-w-3xl mx-auto p-5">
        <h1 className="text-2xl font-semibold text-[#3D6B34] mb-1">{t('event_print_nametags.heading')}</h1>
        <p className="text-sm text-gray-600 mb-4">
          {loading
            ? t('event_print_nametags.loading')
            : t('event_print_nametags.ready', { count: rows.length })}
          {' — '}
          {t('event_print_nametags.print_hint')}
        </p>
        <div className="flex gap-3 mb-4">
          <button onClick={() => window.print()}
            className="px-4 py-2 text-sm rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226]">
            {t('event_print_nametags.btn_print')}
          </button>
          <button onClick={() => window.history.back()}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            {t('event_print_nametags.btn_back')}
          </button>
        </div>
      </div>

      <div className="print-sheet mx-auto bg-white">
        {rows.map((r, i) => (
          <div key={i} className="nametag">
            <div className="event-name">{event?.EventName || ''}</div>
            <div className="person-name">
              {[r.FirstName, r.LastName].filter(Boolean).join(' ') || t('event_print_nametags.guest')}
            </div>
            {r.NameTagTitle && <div className="title">{r.NameTagTitle}</div>}
            {r.Role && r.Role !== 'Registrant' && (
              <div className="role">{r.Role}</div>
            )}
          </div>
        ))}
        {rows.length === 0 && !loading && (
          <div className="text-gray-400 italic p-6 no-print">{t('event_print_nametags.empty')}</div>
        )}
      </div>

      <style>{`
        .print-sheet {
          width: 8.5in;
          display: grid;
          grid-template-columns: repeat(2, 4in);
          grid-auto-rows: 2in;
          gap: 0;
          padding: 0.5in 0.75in;
        }
        .nametag {
          width: 4in;
          height: 2in;
          border: 1px dashed #ccc;
          padding: 0.2in;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          page-break-inside: avoid;
        }
        .nametag .event-name {
          font-size: 10pt;
          color: #3D6B34;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.15in;
        }
        .nametag .person-name {
          font-size: 22pt;
          font-weight: 700;
          color: #222;
          line-height: 1.1;
        }
        .nametag .title {
          font-size: 10pt;
          color: #666;
          margin-top: 0.08in;
        }
        .nametag .role {
          font-size: 9pt;
          color: #7C5CBF;
          text-transform: uppercase;
          margin-top: 0.05in;
        }
        @media print {
          .no-print { display: none !important; }
          .nametag { border: none; }
          .print-sheet { padding: 0.5in 0.75in; }
          @page { size: letter; margin: 0; }
        }
      `}</style>
    </div>
  );
}
