import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, getIndex, API_URL } from './precisionAgUtils';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-100 px-4 py-3 flex flex-col gap-0.5">
      <span className="font-mont text-xs text-gray-400">{label}</span>
      <span className="font-mont text-lg font-bold" style={{ color: color || '#374151' }}>{value}</span>
      {sub && <span className="font-mont text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

function HealthBadge({ score }) {
  const { t } = useTranslation();
  if (score == null) return <span className="text-gray-300">—</span>;
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626';
  const labelKey = score >= 70 ? 'health_good' : score >= 50 ? 'health_fair' : 'health_poor';
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mont font-bold"
      style={{ background: color + '18', color }}>
      {score}% {t('ag_reports.' + labelKey)}
    </span>
  );
}

const LAYER_OPTIONS = [
  { key: 'NDVI',         label: 'NDVI',          getValue: a => getIndex(a, 'NDVI')?.mean },
  { key: 'NDRE',         label: 'NDRE',          getValue: a => getIndex(a, 'NDRE')?.mean },
  { key: 'EVI',          label: 'EVI',            getValue: a => getIndex(a, 'EVI')?.mean },
  { key: 'GNDVI',        label: 'GNDVI',          getValue: a => getIndex(a, 'GNDVI')?.mean },
  { key: 'NDWI',         label: 'NDWI',           getValue: a => getIndex(a, 'NDWI')?.mean },
  { key: 'health_score', label: 'Health Score',   getValue: a => a.health_score },
  { key: 'cloud_percent',label: 'Cloud Cover %',  getValue: a => a.cloud_percent },
];

function pearsonR(xs, ys) {
  const n = xs.length;
  if (n < 2) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const dx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const dy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return dx * dy > 0 ? num / (dx * dy) : 0;
}

function CorrelationPlot({ points, labelA, labelB }) {
  if (points.length < 2) return null;
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const W = 520, H = 200, PL = 44, PR = 16, PT = 14, PB = 34;
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = maxX - minX || 1, spanY = maxY - minY || 1;
  const px = x => PL + ((x - minX) / spanX) * (W - PL - PR);
  const py = y => PT + (1 - (y - minY) / spanY) * (H - PT - PB);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  const slope = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0)
              / xs.reduce((s, x) => s + (x - mx) ** 2, 0.001);
  const intercept = my - slope * mx;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const v = minY + t * spanY;
        return (
          <g key={t}>
            <line x1={PL} y1={py(v)} x2={W - PR} y2={py(v)} stroke="#F3F4F6" strokeWidth="1" />
            <text x={PL - 4} y={py(v) + 3} textAnchor="end" fontSize="8" fill="#9CA3AF">{v.toFixed(2)}</text>
          </g>
        );
      })}
      {[0, 0.5, 1].map(t => (
        <text key={t} x={px(minX + t * spanX)} y={H - 6} textAnchor="middle" fontSize="8" fill="#9CA3AF">
          {(minX + t * spanX).toFixed(2)}
        </text>
      ))}
      <text x={W / 2} y={H} textAnchor="middle" fontSize="9" fill="#6B7280">{labelA}</text>
      <text x={8} y={H / 2} textAnchor="middle" fontSize="9" fill="#6B7280" transform={`rotate(-90,8,${H / 2})`}>{labelB}</text>
      <line
        x1={px(minX)} y1={py(intercept + slope * minX)}
        x2={px(maxX)} y2={py(intercept + slope * maxX)}
        stroke="#6D8E22" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6"
      />
      {points.map((p, i) => (
        <circle key={i} cx={px(p.x)} cy={py(p.y)} r="5" fill="#6D8E22" fillOpacity="0.75" stroke="white" strokeWidth="1.5">
          <title>{new Date(p.date).toLocaleDateString()} — {labelA}: {p.x.toFixed(3)}, {labelB}: {p.y.toFixed(3)}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function PrecisionAgReports() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const { analyses, loading } = useAnalyses(selectedFieldId);
  const [scouts, setScouts] = useState([]);
  const [soilSamples, setSoilSamples] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [sections, setSections] = useState({ satellite: true, soil: true, scouting: true });
  const [reportLayerA, setReportLayerA] = useState('NDVI');
  const [reportLayerB, setReportLayerB] = useState('NDRE');

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  const load = useCallback(async () => {
    if (!selectedFieldId) return;
    const [sr, ss] = await Promise.all([
      fetch(`${API_URL}/api/fields/${selectedFieldId}/scouts`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/api/fields/${selectedFieldId}/soil-samples`).then(r => r.ok ? r.json() : []),
    ]);
    setScouts(sr);
    setSoilSamples(ss);
  }, [selectedFieldId]);
  useEffect(() => { load(); }, [load]);

  const selectedField = fields.find(f => String(f.fieldid || f.id) === selectedFieldId);
  const latest = analyses[0] || null;
  const ndviMean = getIndex(latest, 'NDVI')?.mean;

  const emailLatest = async () => {
    if (!selectedFieldId) return;
    setEmailing(true);
    try {
      const peopleId = typeof window !== 'undefined' ? localStorage.getItem('people_id') : null;
      const url = `${API_URL}/api/fields/${selectedFieldId}/email-analysis${peopleId ? `?people_id=${peopleId}` : ''}`;
      const r = await fetch(url, { method: 'POST' });
      if (!r.ok) throw new Error(await r.text());
      alert(t('ag_reports.alert_emailed'));
    } catch (e) {
      alert(t('ag_reports.alert_email_failed', { error: e.message }));
    } finally {
      setEmailing(false);
    }
  };

  const downloadExcel = async () => {
    setDownloading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/report.xlsx`);
      if (!r.ok) throw new Error(await r.text());
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `field_${selectedFieldId}_report.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(t('ag_reports.alert_download_failed', { error: e.message }));
    } finally {
      setDownloading(false);
    }
  };

  // Trend: avg NDVI last 30 days vs prior 30 days
  const now = new Date();
  const recent = analyses.filter(a => (now - new Date(a.analysis_date)) / 86400000 <= 30);
  const prior  = analyses.filter(a => { const d = (now - new Date(a.analysis_date)) / 86400000; return d > 30 && d <= 60; });
  const avgRecent = recent.length ? recent.reduce((s, a) => s + (getIndex(a,'NDVI')?.mean ?? 0), 0) / recent.length : null;
  const avgPrior  = prior.length  ? prior.reduce((s, a)  => s + (getIndex(a,'NDVI')?.mean ?? 0), 0) / prior.length  : null;
  const trend = avgRecent != null && avgPrior != null ? avgRecent - avgPrior : null;

  // Soil averages
  const soilAvg = (key) => {
    const vals = soilSamples.map(s => s[key]).filter(v => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={t('ag_reports.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to:'/dashboard' }, { label: t('precision_ag_alerts.breadcrumb_precision_ag') }, { label: t('ag_reports.page_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{t('ag_reports.heading')}</h1>
            <p className="font-mont text-sm text-gray-500">{t('ag_reports.subheading')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={emailLatest} disabled={!selectedFieldId || emailing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#6D8E22] text-[#6D8E22] text-sm font-mont font-semibold rounded-lg hover:bg-[#f5f8eb] disabled:opacity-50">
              {emailing ? t('ag_reports.btn_sending') : (
                <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="12" height="9" rx="1"/><path d="M2 4l6 5 6-5"/></svg> {t('ag_reports.btn_email')}</>
              )}
            </button>
            <button onClick={downloadExcel} disabled={!selectedFieldId || downloading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#6D8E22] text-white text-sm font-mont font-semibold rounded-lg hover:bg-[#5a7519] disabled:opacity-50">
              {downloading ? t('ag_reports.btn_preparing') : (
                <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v9"/><polyline points="5 8 8 11 11 8"/><line x1="2" y1="14" x2="14" y2="14"/></svg> {t('ag_reports.btn_download')}</>
              )}
            </button>
          </div>
        </div>

        {/* Field selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{t('ag_reports.field_label')}</label>
            <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
              {fields.length === 0 && <option value="">{t('ag_reports.no_fields')}</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          {selectedField && (
            <div className="font-mont text-xs text-gray-400 self-end pb-2">
              {selectedField.crop_type && <span className="mr-3">{t('ag_reports.crop_label', { crop: selectedField.crop_type })}</span>}
              {selectedField.field_size_hectares && <span>{selectedField.field_size_hectares.toFixed(1)} ha</span>}
            </div>
          )}
        </div>

        {/* Section toggles */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-6 flex-wrap">
          <span className="font-mont text-xs font-semibold text-gray-500">{t('ag_reports.sections_label')}</span>
          {[['satellite', t('ag_reports.sec_satellite')],['soil', t('ag_reports.sec_soil')],['scouting', t('ag_reports.sec_scouting')]].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sections[k]} onChange={e => setSections(p => ({ ...p, [k]: e.target.checked }))}
                className="accent-[#6D8E22]" />
              <span className="font-mont text-xs text-gray-600">{l}</span>
            </label>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{t('ag_reports.loading')}</div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label={t('ag_reports.stat_analyses')} value={analyses.length} sub={t('ag_reports.stat_analyses_sub')} />
              <StatCard label={t('ag_reports.stat_health')} value={latest ? <HealthBadge score={latest.health_score} /> : '—'} />
              <StatCard
                label={t('ag_reports.stat_ndvi_trend')}
                value={trend != null ? `${trend > 0 ? '+' : ''}${trend.toFixed(3)}` : '—'}
                color={trend != null ? (trend > 0 ? '#16A34A' : trend < 0 ? '#DC2626' : '#9CA3AF') : '#9CA3AF'}
                sub={trend != null ? (trend > 0 ? t('ag_reports.trend_improving') : trend < 0 ? t('ag_reports.trend_declining') : t('ag_reports.trend_stable')) : t('ag_reports.trend_no_data')}
              />
              <StatCard label={t('ag_reports.stat_scouts')} value={scouts.length} sub={t('ag_reports.stat_scouts_sub', { count: scouts.filter(s => s.severity === 'High' || s.severity === 'Critical').length })} />
            </div>

            {/* Latest satellite analysis */}
            {sections.satellite && latest && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
                  {t('ag_reports.latest_analysis_title')}{' '}
                  <span className="font-normal text-gray-400">
                    {new Date(latest.analysis_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                  </span>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {['NDVI','NDRE','EVI','GNDVI','NDWI'].map(k => {
                    const d = getIndex(latest, k);
                    return (
                      <div key={k} className="flex flex-col gap-0.5">
                        <span className="font-mont text-xs text-gray-400">{k}</span>
                        <span className="font-mont text-xl font-bold text-gray-800">{d?.mean?.toFixed(3) ?? '—'}</span>
                        {d && <span className="font-mont text-xs text-gray-400">{t('ag_reports.index_range', { min: d.min?.toFixed(2), max: d.max?.toFixed(2) })}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Analysis history mini-table */}
            {sections.satellite && analyses.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
                  {t('ag_reports.history_title', { count: analyses.length })}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-mont">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-2.5 text-gray-500 font-semibold text-xs">{t('ag_reports.th_date')}</th>
                        <th className="text-center px-3 py-2.5 text-gray-500 font-semibold text-xs">NDVI</th>
                        <th className="text-center px-3 py-2.5 text-gray-500 font-semibold text-xs">NDRE</th>
                        <th className="text-center px-3 py-2.5 text-gray-500 font-semibold text-xs">EVI</th>
                        <th className="text-center px-3 py-2.5 text-gray-500 font-semibold text-xs">{t('ag_reports.th_health')}</th>
                        <th className="text-center px-3 py-2.5 text-gray-500 font-semibold text-xs">{t('ag_reports.th_cloud')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyses.slice(0, 12).map((a, i) => (
                        <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-700 font-semibold text-xs">
                            {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                          </td>
                          {['NDVI','NDRE','EVI'].map(k => (
                            <td key={k} className="px-3 py-2 text-center text-gray-600 text-xs">{getIndex(a,k)?.mean?.toFixed(3)??'—'}</td>
                          ))}
                          <td className="px-3 py-2 text-center text-xs"><HealthBadge score={a.health_score} /></td>
                          <td className="px-3 py-2 text-center text-gray-400 text-xs">{a.cloud_percent?.toFixed(1)??'—'}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Soil samples summary */}
            {sections.soil && soilSamples.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="font-mont text-sm font-semibold text-gray-600 mb-3">
                  {t('ag_reports.soil_title', { count: soilSamples.length })}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {[
                    { key:'ph',            label: t('ag_reports.soil_ph'),   fmt: v => v?.toFixed(1) },
                    { key:'organic_matter',label: t('ag_reports.soil_om'),   fmt: v => v?.toFixed(1) },
                    { key:'nitrogen',      label: t('ag_reports.soil_n'),    fmt: v => v?.toFixed(0) },
                    { key:'phosphorus',    label: t('ag_reports.soil_p'),    fmt: v => v?.toFixed(0) },
                    { key:'potassium',     label: t('ag_reports.soil_k'),    fmt: v => v?.toFixed(0) },
                  ].map(n => {
                    const v = soilAvg(n.key);
                    return (
                      <div key={n.key} className="bg-gray-50 rounded-lg border border-gray-100 px-3 py-2">
                        <div className="font-mont text-xs text-gray-400">{n.label}</div>
                        <div className="font-mont text-lg font-bold text-gray-800">{v != null ? n.fmt(v) : '—'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scouting summary */}
            {sections.scouting && scouts.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="font-mont text-sm font-semibold text-gray-600 mb-3">
                  {t('ag_reports.scout_title', { count: scouts.length })}
                </div>
                <div className="space-y-2">
                  {scouts.slice(0, 5).map(s => (
                    <div key={s.scout_id} className="flex items-center gap-3 text-sm font-mont">
                      <span className="text-gray-400 w-24 text-xs flex-shrink-0">
                        {new Date(s.observed_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                      </span>
                      <span className="text-gray-700">{t('scouting.cat_' + s.category.toLowerCase(), { defaultValue: s.category })}</span>
                      {s.severity && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: {Low:'#D1FAE5',Medium:'#FEF3C7',High:'#FEE2E2',Critical:'#FEE2E2'}[s.severity] || '#F3F4F6',
                                   color: {Low:'#065F46',Medium:'#92400E',High:'#B91C1C',Critical:'#7F1D1D'}[s.severity] || '#6B7280' }}>
                          {t('scouting.sev_' + s.severity.toLowerCase(), { defaultValue: s.severity })}
                        </span>
                      )}
                      <span className="text-gray-500 text-xs truncate">{s.notes}</span>
                    </div>
                  ))}
                  {scouts.length > 5 && (
                    <div className="font-mont text-xs text-gray-400">{t('ag_reports.scout_more', { count: scouts.length - 5 })}</div>
                  )}
                </div>
              </div>
            )}

            {/* Custom Correlation Report Builder */}
            {analyses.length >= 2 && (() => {
              const cfgA = LAYER_OPTIONS.find(l => l.key === reportLayerA);
              const cfgB = LAYER_OPTIONS.find(l => l.key === reportLayerB);
              const points = analyses
                .map(a => ({ x: cfgA?.getValue(a), y: cfgB?.getValue(a), date: a.analysis_date }))
                .filter(p => p.x != null && p.y != null);
              const r = points.length >= 2 ? pearsonR(points.map(p => p.x), points.map(p => p.y)) : null;
              const rLabel = r == null ? '—'
                : Math.abs(r) >= 0.7 ? `${r.toFixed(2)} (strong)`
                : Math.abs(r) >= 0.4 ? `${r.toFixed(2)} (moderate)`
                : `${r.toFixed(2)} (weak)`;
              const rColor = r == null ? '#9CA3AF' : Math.abs(r) >= 0.7 ? '#16A34A' : Math.abs(r) >= 0.4 ? '#D97706' : '#9CA3AF';
              return (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
                    <span className="font-mont text-sm font-semibold text-gray-600">Custom Correlation Report</span>
                    <span className="font-mont text-xs text-gray-400">{analyses.length} analyses</span>
                  </div>
                  <div className="px-5 pt-4 pb-3 flex items-center gap-3 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-mont font-semibold text-gray-500">Layer A (X axis)</label>
                      <select value={reportLayerA} onChange={e => setReportLayerA(e.target.value)}
                        className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-1.5">
                        {LAYER_OPTIONS.filter(l => l.key !== reportLayerB).map(l => (
                          <option key={l.key} value={l.key}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-mont font-semibold text-gray-500">Layer B (Y axis)</label>
                      <select value={reportLayerB} onChange={e => setReportLayerB(e.target.value)}
                        className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-1.5">
                        {LAYER_OPTIONS.filter(l => l.key !== reportLayerA).map(l => (
                          <option key={l.key} value={l.key}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                    {r != null && (
                      <div className="ml-auto flex flex-col items-end">
                        <span className="font-mont text-xs text-gray-400">Pearson r</span>
                        <span className="font-mont text-xl font-bold" style={{ color: rColor }}>{rLabel}</span>
                      </div>
                    )}
                  </div>
                  <div className="px-5 pb-5">
                    {points.length < 2 ? (
                      <div className="text-center py-8 font-mont text-sm text-gray-400">Not enough data points for these layers</div>
                    ) : (
                      <>
                        <CorrelationPlot points={points} labelA={cfgA?.label} labelB={cfgB?.label} />
                        <p className="font-mont text-xs text-gray-400 mt-2">
                          Each point is one satellite analysis pass. Dashed line shows the linear trend.
                          {r != null && Math.abs(r) >= 0.7 && ` Strong correlation — ${cfgA?.label} is a reliable proxy for ${cfgB?.label} on this field.`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Empty state */}
            {analyses.length === 0 && soilSamples.length === 0 && scouts.length === 0 && (
              <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                <div className="font-lora text-xl text-gray-600 mb-2">{t('ag_reports.no_data_title')}</div>
                <div className="font-mont text-sm text-gray-400">
                  {t('ag_reports.no_data_body')}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
