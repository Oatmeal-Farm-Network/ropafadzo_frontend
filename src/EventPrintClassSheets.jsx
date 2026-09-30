import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

/**
 * Print-ready judge's class sheets — one page per halter class.
 * Columns: back#, animal name, exhibitor, placement (blank), notes (blank).
 */
export default function EventPrintClassSheets() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [entriesByClass, setEntriesByClass] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [e, cls] = await Promise.all([
          fetch(`${API}/api/events/${eventId}`).then(r => r.json()),
          fetch(`${API}/api/events/${eventId}/halter/classes`).then(r => r.ok ? r.json() : []),
        ]);
        setEvent(e);
        const classList = Array.isArray(cls) ? cls : [];
        setClasses(classList);

        const byClass = {};
        await Promise.all(classList.map(async c => {
          try {
            const rows = await fetch(`${API}/api/events/${eventId}/halter/classes/${c.ClassID}/entries`,
              { headers: authHeaders() }).then(r => r.ok ? r.json() : []);
            byClass[c.ClassID] = rows;
          } catch {
            byClass[c.ClassID] = [];
          }
        }));
        setEntriesByClass(byClass);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  const populated = classes.filter(c => (entriesByClass[c.ClassID] || []).length > 0);
  const classNoun = (n) => n === 1 ? t('event_print_class_sheets.class_one') : t('event_print_class_sheets.class_many');

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <div className="no-print max-w-3xl mx-auto p-5">
        <h1 className="text-2xl font-semibold text-[#3D6B34] mb-1">{t('event_print_class_sheets.heading')}</h1>
        <p className="text-sm text-gray-600 mb-4">
          {loading
            ? t('event_print_class_sheets.loading')
            : t('event_print_class_sheets.classes_with_entries', {
                n: populated.length,
                noun: classNoun(populated.length),
                total: classes.length,
              })}
          {' — '}
          {t('event_print_class_sheets.print_instruction')}
        </p>
        <div className="flex gap-3 mb-4">
          <button onClick={() => window.print()}
            className="px-4 py-2 text-sm rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226]">
            {t('event_print_class_sheets.btn_print')}
          </button>
          <button onClick={() => window.history.back()}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            {t('event_print_class_sheets.btn_back')}
          </button>
        </div>
      </div>

      <div className="print-area mx-auto bg-white">
        {populated.map(c => {
          const entries = entriesByClass[c.ClassID] || [];
          return (
            <div key={c.ClassID} className="class-sheet">
              <div className="sheet-header">
                <div className="event-name">{event?.EventName || ''}</div>
                <div className="date">{t('event_print_class_sheets.sheet_judge_line')}</div>
              </div>
              <div className="class-title">
                {c.ClassCode && <span className="code">{c.ClassCode}</span>}
                {' '}{c.ClassName}
              </div>
              <div className="class-meta">
                {c.Breed && <span><strong>{t('event_print_class_sheets.breed_label')}</strong> {c.Breed}</span>}
                {c.Gender && <span><strong>{t('event_print_class_sheets.sex_label')}</strong> {c.Gender}</span>}
                {c.AgeGroup && <span><strong>{t('event_print_class_sheets.age_label')}</strong> {c.AgeGroup}</span>}
                <span><strong>{t('event_print_class_sheets.entries_label')}</strong> {entries.length}</span>
              </div>

              <table className="entries">
                <thead>
                  <tr>
                    <th style={{ width: '0.6in' }}>{t('event_print_class_sheets.col_back_num')}</th>
                    <th>{t('event_print_class_sheets.col_animal')}</th>
                    <th>{t('event_print_class_sheets.col_exhibitor')}</th>
                    <th style={{ width: '0.9in' }}>{t('event_print_class_sheets.col_place')}</th>
                    <th style={{ width: '1.8in' }}>{t('event_print_class_sheets.col_notes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((en, i) => (
                    <tr key={en.EntryID}>
                      <td className="back-num">{en.BackNumber || i + 1}</td>
                      <td>
                        <div className="animal-name">{en.AnimalName || '—'}</div>
                        {en.RegisteredName && <div className="reg-name">{en.RegisteredName}</div>}
                      </td>
                      <td>
                        {[en.FirstName, en.LastName].filter(Boolean).join(' ')}
                        {en.BusinessName && <div className="business">{en.BusinessName}</div>}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                  {[...Array(Math.max(0, 3 - (entries.length % 3)))].map((_, i) => (
                    <tr key={`b-${i}`} className="blank">
                      <td>&nbsp;</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="signature">
                {t('event_print_class_sheets.judge_signature')}
              </div>
            </div>
          );
        })}
        {populated.length === 0 && !loading && (
          <div className="text-gray-400 italic p-6 no-print">{t('event_print_class_sheets.no_classes')}</div>
        )}
      </div>

      <style>{`
        .print-area { width: 8.5in; }
        .class-sheet {
          width: 8.5in;
          min-height: 10.5in;
          padding: 0.5in;
          page-break-after: always;
          page-break-inside: avoid;
          display: flex;
          flex-direction: column;
        }
        .class-sheet:last-child { page-break-after: auto; }
        .sheet-header {
          display: flex;
          justify-content: space-between;
          font-size: 9pt;
          color: #666;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.08in;
          margin-bottom: 0.1in;
        }
        .sheet-header .event-name { color: #3D6B34; font-weight: 700; text-transform: uppercase; }
        .class-title {
          font-size: 22pt;
          font-weight: 700;
          color: #222;
          margin-top: 0.1in;
        }
        .class-title .code {
          background: #3D6B34;
          color: white;
          font-family: monospace;
          font-size: 14pt;
          padding: 2px 8px;
          border-radius: 4px;
          vertical-align: middle;
          margin-right: 0.1in;
        }
        .class-meta {
          display: flex;
          gap: 0.25in;
          font-size: 10pt;
          color: #555;
          margin-top: 0.08in;
          margin-bottom: 0.2in;
        }
        table.entries {
          width: 100%;
          border-collapse: collapse;
          font-size: 11pt;
        }
        table.entries th, table.entries td {
          border: 1px solid #888;
          padding: 0.1in 0.08in;
          text-align: left;
          vertical-align: top;
        }
        table.entries th {
          background: #f1f5ef;
          font-size: 9pt;
          text-transform: uppercase;
          color: #3D6B34;
        }
        table.entries td.back-num {
          text-align: center;
          font-weight: 700;
          font-size: 14pt;
        }
        table.entries .animal-name { font-weight: 600; }
        table.entries .reg-name { font-size: 9pt; color: #888; font-style: italic; }
        table.entries .business { font-size: 9pt; color: #666; }
        table.entries tr.blank td { height: 0.35in; }
        .signature {
          margin-top: 0.4in;
          font-size: 10pt;
          color: #555;
        }
        @media print {
          .no-print { display: none !important; }
          @page { size: letter; margin: 0; }
        }
      `}</style>
    </div>
  );
}
