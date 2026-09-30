import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ─── Print stylesheet ───────────────────────────────────────────────────────
// Hides ALL site chrome and isolates the report. Uses visibility tricks
// because some sidebars are plain <div>s (not <aside>) and we can't rely on
// element selectors alone.
function PrintStyles() {
  return (
    <style>{`
      @media print {
        @page { margin: 0.5in; size: letter; }
        html, body { background: white !important; margin: 0 !important; padding: 0 !important; }

        /* Hide every visual element on the page... */
        body * { visibility: hidden !important; }

        /* ...then re-show only the report and its descendants. */
        .printable-report, .printable-report * { visibility: visible !important; }

        /* Pull the report out of any sidebar-padded shell so it fills the page. */
        .printable-report {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* The card itself: drop shadow/border/rounded, full bleed. */
        .report-page {
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: none !important;
        }

        .report-section { break-inside: avoid; page-break-inside: avoid; }
        .report-h1 { font-size: 22pt; }
        .report-h2 { font-size: 13pt; }
        a { color: black !important; text-decoration: none !important; }

        /* Belt-and-suspenders: anything explicitly tagged no-print stays gone. */
        .no-print { display: none !important; }
      }
    `}</style>
  );
}

// ─── Tiny presentational helpers ────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <h2 className="report-h2 font-lora text-lg font-bold text-gray-900 mb-2 mt-6 border-b border-gray-300 pb-1">
      {children}
    </h2>
  );
}

function Bullet({ children }) {
  return (
    <li className="text-sm text-gray-800 flex items-start gap-2 leading-relaxed">
      <span className="mt-1 text-[#3D6B34]">•</span>
      <span>{children}</span>
    </li>
  );
}

function PriorityBadge({ priority }) {
  const { t } = useTranslation();
  const map = {
    high:   { bg: '#FEE2E2', fg: '#991B1B', tKey: 'priority_high'   },
    medium: { bg: '#FEF3C7', fg: '#92400E', tKey: 'priority_medium' },
    low:    { bg: '#DCFCE7', fg: '#166534', tKey: 'priority_low'    },
  };
  const s = map[(priority || '').toLowerCase()] || map.medium;
  return (
    <span
      className="inline-block text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.fg }}
    >
      {t('field_assessment.' + s.tKey)}
    </span>
  );
}

function HealthBadge({ value }) {
  const { t } = useTranslation();
  const map = {
    good:    { bg: '#DCFCE7', fg: '#166534' },
    fair:    { bg: '#FEF3C7', fg: '#92400E' },
    poor:    { bg: '#FEE2E2', fg: '#991B1B' },
    unknown: { bg: '#E5E7EB', fg: '#374151' },
  };
  const key = (value || 'unknown').toLowerCase();
  const s = map[key] || map.unknown;
  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.fg }}
    >
      {t('field_assessment.health_' + (map[key] ? key : 'unknown')).toUpperCase()}
    </span>
  );
}

// ─── Section renderers ──────────────────────────────────────────────────────
function ExecSummary({ summary, confidence }) {
  const { t } = useTranslation();
  return (
    <div className="report-section bg-[#F8F4EA] border border-[#E8DDC2] rounded-xl p-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <h2 className="report-h2 font-lora text-lg font-bold text-gray-900">{t('field_assessment.exec_summary_title')}</h2>
        {confidence && (
          <span className="text-xs text-gray-500 font-mont">
            {t('field_assessment.exec_confidence')} <span className="font-bold uppercase">{confidence}</span>
          </span>
        )}
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-gray-800">{summary}</p>
    </div>
  );
}

function CurrentStatusSection({ data }) {
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <div className="report-section">
      <SectionTitle>{t('field_assessment.current_status_title')}</SectionTitle>
      <div className="flex flex-wrap gap-6 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('field_assessment.label_growth_stage')}</div>
          <div className="text-base font-mont text-gray-900 mt-1">{data.growth_stage || '—'}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('field_assessment.label_overall_health')}</div>
          <div className="mt-1"><HealthBadge value={data.overall_health} /></div>
        </div>
      </div>
      {data.highlights?.length > 0 && (
        <ul className="space-y-1">
          {data.highlights.map((h, i) => <Bullet key={i}>{h}</Bullet>)}
        </ul>
      )}
    </div>
  );
}

function SoilSection({ data }) {
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <div className="report-section">
      <SectionTitle>{t('field_assessment.soil_title')}</SectionTitle>
      {data.summary && <p className="text-sm text-gray-800 mb-3 leading-relaxed">{data.summary}</p>}
      {data.concerns?.length > 0 && (
        <>
          <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mt-3 mb-1">{t('field_assessment.soil_concerns')}</div>
          <ul className="space-y-1 mb-3">
            {data.concerns.map((c, i) => <Bullet key={i}>{c}</Bullet>)}
          </ul>
        </>
      )}
      {data.recommended_amendments?.length > 0 && (
        <>
          <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mt-3 mb-1">{t('field_assessment.soil_amendments')}</div>
          <table className="w-full text-sm border border-gray-200 rounded">
            <thead className="bg-gray-50 text-gray-600 text-left text-xs">
              <tr>
                <th className="px-3 py-2 font-semibold">{t('field_assessment.col_product')}</th>
                <th className="px-3 py-2 font-semibold">{t('field_assessment.col_rate')}</th>
                <th className="px-3 py-2 font-semibold">{t('field_assessment.col_reason')}</th>
              </tr>
            </thead>
            <tbody>
              {data.recommended_amendments.map((a, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-medium">{a.product}</td>
                  <td className="px-3 py-2">{a.rate}</td>
                  <td className="px-3 py-2 text-gray-700">{a.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function WeatherSection({ data }) {
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <div className="report-section">
      <SectionTitle>{t('field_assessment.weather_title')}</SectionTitle>
      {data.summary && <p className="text-sm text-gray-800 mb-3 leading-relaxed">{data.summary}</p>}
      {data.key_risks?.length > 0 && (
        <ul className="space-y-1">
          {data.key_risks.map((r, i) => <Bullet key={i}>{r}</Bullet>)}
        </ul>
      )}
    </div>
  );
}

function PlantStatusSection({ data }) {
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <div className="report-section">
      <SectionTitle>{t('field_assessment.plant_status_title')}</SectionTitle>
      {data.summary && <p className="text-sm text-gray-800 mb-3 leading-relaxed">{data.summary}</p>}
      {data.issues_observed?.length > 0 && (
        <>
          <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mt-3 mb-1">{t('field_assessment.issues_observed')}</div>
          <ul className="space-y-1">
            {data.issues_observed.map((i, k) => <Bullet key={k}>{i}</Bullet>)}
          </ul>
        </>
      )}
    </div>
  );
}

function TreatmentsSection({ items }) {
  const { t } = useTranslation();
  if (!items?.length) return null;
  return (
    <div className="report-section">
      <SectionTitle>{t('field_assessment.treatments_title')}</SectionTitle>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1">
                <div className="font-mont font-semibold text-gray-900">{item.action}</div>
                {item.timing && <div className="text-xs text-gray-500 mt-0.5">{t('field_assessment.timing_label', { timing: item.timing })}</div>}
              </div>
              <PriorityBadge priority={item.priority} />
            </div>
            {item.reason && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{item.reason}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HarvestSection({ data }) {
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <div className="report-section">
      <SectionTitle>{t('field_assessment.harvest_title')}</SectionTitle>
      <p className="text-sm text-gray-800 leading-relaxed">{data.summary}</p>
      {data.applies && data.specific_dates?.length > 0 && (
        <div className="mt-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1">{t('field_assessment.target_dates')}</div>
          <div className="flex flex-wrap gap-2">
            {data.specific_dates.map((d, i) => (
              <span key={i} className="px-3 py-1 rounded-full border border-[#3D6B34] text-[#3D6B34] text-sm font-mont font-semibold">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NextCropsSection({ items }) {
  const { t } = useTranslation();
  if (!items?.length) return null;
  return (
    <div className="report-section">
      <SectionTitle>{t('field_assessment.next_crops_title')}</SectionTitle>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="font-mont font-bold text-gray-900">
              {c.crop}
              {c.variety_hint && <span className="text-gray-500 font-normal text-sm"> · {c.variety_hint}</span>}
            </div>
            {c.best_planting_window && (
              <div className="text-xs text-gray-500 mt-0.5">{t('field_assessment.plant_label', { window: c.best_planting_window })}</div>
            )}
            {c.rationale && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{c.rationale}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function GapsSection({ items }) {
  const { t } = useTranslation();
  if (!items?.length) return null;
  return (
    <div className="report-section">
      <SectionTitle>{t('field_assessment.gaps_title')}</SectionTitle>
      <p className="text-xs text-gray-500 mb-2 italic">{t('field_assessment.gaps_desc')}</p>
      <ul className="space-y-1">
        {items.map((g, i) => <Bullet key={i}>{g}</Bullet>)}
      </ul>
    </div>
  );
}

function ReportHeader({ field, generatedAt }) {
  const { t } = useTranslation();
  return (
    <div className="border-b border-gray-300 pb-4 mb-2">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-[#3D6B34] font-bold">{t('field_assessment.header_label')}</div>
          <h1 className="report-h1 font-lora text-3xl font-bold text-gray-900 mt-1">
            {field?.name || t('field_assessment.header_field_fallback', { id: field?.field_id })}
          </h1>
          <div className="mt-1 text-sm text-gray-600 font-mont">
            {field?.crop_type || t('field_assessment.header_no_crop')}
            {field?.address && <> · {field.address}</>}
            {field?.size_hectares != null && <> · {field.size_hectares} ha</>}
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 font-mont">
          <div>{t('field_assessment.header_prepared_by')} <span className="font-bold text-gray-700">Saige</span></div>
          <div>{generatedAt ? new Date(generatedAt).toLocaleString() : ''}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function FieldAssessmentReport() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const fieldId = searchParams.get('FieldID');
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const peopleId = typeof window !== 'undefined' ? localStorage.getItem('people_id') : null;

  // Latest stored report (or selected historical one).
  const [data, setData]       = useState(null);
  const [history, setHistory] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [error, setError]     = useState(null);
  const [emptyKnown, setEmptyKnown] = useState(false);  // confirmed no stored report
  const [showShare, setShowShare] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => { if (BusinessID) LoadBusiness(BusinessID); }, [BusinessID]);

  async function loadLatest() {
    if (!fieldId) return;
    setLoadingLatest(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/fields/${fieldId}/assessment-report/latest`);
      if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);
      const payload = await res.json();
      if (payload?.report_id) {
        setData(payload);
        setEmptyKnown(false);
      } else {
        setData(null);
        setEmptyKnown(true);
      }
    } catch (e) {
      setError(e.message || t('field_assessment.err_load_latest'));
    } finally {
      setLoadingLatest(false);
    }
  }

  async function loadHistory() {
    if (!fieldId) return;
    try {
      const res = await fetch(`${API_URL}/api/fields/${fieldId}/assessment-report/history?limit=25`);
      if (!res.ok) return;
      const payload = await res.json();
      setHistory(payload?.items || []);
    } catch { /* non-fatal */ }
  }

  async function loadById(reportId) {
    if (!fieldId || !reportId) return;
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/fields/${fieldId}/assessment-report/${reportId}`);
      if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);
      setData(await res.json());
      setEmptyKnown(false);
    } catch (e) {
      setError(e.message || t('field_assessment.err_load'));
    }
  }

  async function generate() {
    if (!fieldId) { setError(t('field_assessment.err_no_field')); return; }
    setGenerating(true);
    setError(null);
    try {
      const url = new URL(`${API_URL}/api/fields/${fieldId}/assessment-report`);
      if (peopleId) url.searchParams.set('people_id', peopleId);
      const res = await fetch(url.toString(), { method: 'POST' });
      if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);
      const payload = await res.json();
      setData(payload);
      setEmptyKnown(false);
      // refresh history list so the new entry shows up at the top
      loadHistory();
    } catch (e) {
      setError(e.message || t('field_assessment.err_generate'));
    } finally {
      setGenerating(false);
    }
  }

  // Load latest + history whenever the field changes.
  useEffect(() => {
    setData(null);
    setEmptyKnown(false);
    setHistory([]);
    if (fieldId) {
      loadLatest();
      loadHistory();
    }
    // eslint-disable-next-line
  }, [fieldId]);

  const report   = data?.report;
  const field    = data?.field;
  const genAt    = data?.generated_at;
  const reportId = data?.report_id;
  const currentIsLatest = history.length > 0 && history[0].report_id === reportId;

  return (
    <AccountLayout
      Business={Business}
      BusinessID={BusinessID}
      PeopleID={peopleId}
      pageTitle={t('field_assessment.page_title')}
      breadcrumbs={[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t('field_assessment.breadcrumb_precision') },
        { label: t('field_assessment.breadcrumb_assessment') },
      ]}
    >
      <PrintStyles />

      <div className="max-w-4xl mx-auto">
        {/* Toolbar — hidden in print */}
        <div className="no-print flex items-center justify-between flex-wrap gap-3 mb-4 print:hidden">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('field_assessment.heading')}</h1>
            <p className="font-mont text-sm text-gray-500">
              {data && currentIsLatest && genAt && (
                <>{t('field_assessment.latest_generated', { when: new Date(genAt).toLocaleString() })}</>
              )}
              {data && !currentIsLatest && genAt && (
                <>{t('field_assessment.viewing_from', { when: new Date(genAt).toLocaleString() })}</>
              )}
              {!data && !loadingLatest && emptyKnown && (
                <>{t('field_assessment.no_assessments')}</>
              )}
              {!data && loadingLatest && <>{t('field_assessment.loading_latest')}</>}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {history.length > 1 && (
              <select
                value={reportId || ''}
                onChange={(e) => loadById(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-mont text-gray-700 bg-white"
                title={t('field_assessment.select_past_title')}
              >
                {history.map((h, i) => {
                  const when = h.generated_at ? new Date(h.generated_at).toLocaleDateString() : '';
                  const tag  = i === 0 ? t('field_assessment.option_latest') : t('field_assessment.option_report', { id: h.report_id });
                  return (
                    <option key={h.report_id} value={h.report_id}>
                      {tag} · {when} · {(h.overall_health || '—').toUpperCase()}
                    </option>
                  );
                })}
              </select>
            )}
            <button
              onClick={generate}
              disabled={generating || !fieldId}
              className="px-4 py-2 rounded-lg bg-[#3D6B34] text-white text-sm font-mont font-semibold hover:bg-[#2F5328] disabled:opacity-50"
            >
              {generating ? t('field_assessment.btn_generating') : t('field_assessment.btn_generate')}
            </button>
            <button
              onClick={() => window.print()}
              disabled={!report}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-mont font-semibold hover:bg-gray-50 disabled:opacity-40"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={() => setShowShare(s => !s)}
              disabled={!report}
              className="px-4 py-2 rounded-lg border border-[#6D8E22] text-[#6D8E22] text-sm font-mont font-semibold hover:bg-green-50 disabled:opacity-40"
            >
              Share with Agronomist
            </button>
          </div>
        </div>

        {/* Share modal */}
        {showShare && report && (
          <div className="no-print mb-4 bg-white border border-[#6D8E22] rounded-xl p-5 print:hidden">
            <div className="font-mont text-sm font-semibold text-gray-700 mb-3">Share Assessment Report</div>
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex flex-col gap-1 flex-1 min-w-48">
                <label className="text-xs font-semibold font-mont text-gray-500">Agronomist email</label>
                <input type="email" value={shareEmail} onChange={e => setShareEmail(e.target.value)}
                  placeholder="agronomist@example.com"
                  className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
              </div>
              <a
                href={`mailto:${shareEmail}?subject=${encodeURIComponent(`Field Assessment Report — ${field?.name || 'Field'}`)}&body=${encodeURIComponent(`Hi,\n\nPlease find the attached field assessment report for ${field?.name || 'our field'}, generated on ${genAt ? new Date(genAt).toLocaleDateString() : 'recently'}.\n\nOverall health: ${report.executive_summary?.overall_health || '—'}\n\nSummary: ${report.executive_summary?.summary || ''}\n\nBest regards`)}`}
                className="px-4 py-2 bg-[#6D8E22] text-white text-sm font-mont font-semibold rounded-lg hover:bg-[#5a7519]"
                onClick={() => setShowShare(false)}
              >
                Open Email
              </a>
              <button onClick={() => setShowShare(false)}
                className="px-3 py-2 text-sm font-mont text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
            <p className="font-mont text-xs text-gray-400 mt-2">Opens your email client with the report summary pre-filled.</p>
          </div>
        )}

        {!fieldId && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-sm">
            {t('field_assessment.no_field')}
          </div>
        )}

        {generating && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
            <div className="animate-pulse">{t('field_assessment.generating_msg')}</div>
            <div className="text-xs mt-2 text-gray-400">{t('field_assessment.generating_hint')}</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
            <div className="font-semibold mb-1">{t('field_assessment.error_title')}</div>
            <div className="font-mono text-xs whitespace-pre-wrap">{error}</div>
          </div>
        )}

        {data && !report && data.raw_text && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-amber-700 text-sm font-semibold mb-2">{t('field_assessment.json_error')}</div>
            <pre className="text-xs whitespace-pre-wrap text-gray-700">{data.raw_text}</pre>
          </div>
        )}

        {report && (
          <div className="printable-report report-page bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-2">
            <ReportHeader field={field} generatedAt={genAt} />
            <ExecSummary summary={report.executive_summary} confidence={report.confidence_overall} />
            <CurrentStatusSection data={report.current_status} />
            <SoilSection data={report.soil_and_nutrients} />
            <WeatherSection data={report.weather_and_climate} />
            <PlantStatusSection data={report.plant_status_assessment} />
            <TreatmentsSection items={report.treatment_recommendations} />
            <HarvestSection data={report.harvest_or_termination_guidance} />
            <NextCropsSection items={report.next_crop_recommendations} />
            <GapsSection items={report.data_gaps} />

            <div className="pt-6 mt-6 border-t border-gray-200 text-[10px] text-gray-400 italic text-center">
              {t('field_assessment.footer')}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
