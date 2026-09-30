import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, getIndex, API_URL } from './precisionAgUtils';
import { useTranslation } from 'react-i18next';

// ─── Line chart (shared by index and weather panels) ─────────────────────────
function LineChart({ series, xLabels, height = 280, yAxisLabel = 'Value' }) {
  const PL = 56, PR = 24, PT = 20, PB = 56;
  const W = 900, H = height;
  const cW = W - PL - PR, cH = H - PT - PB;
  const allV = series.flatMap(s => s.values.filter(v => v != null));
  if (!allV.length) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-sm" style={{ height }}>No data</div>
  );
  const lo = Math.min(...allV), hi = Math.max(...allV);
  const span = hi - lo || 0.1, pad = span * 0.12;
  const yLo = lo - pad, yHi = hi + pad, ySpan = yHi - yLo;
  const n = Math.max(...series.map(s => s.values.length));
  const px = i => PL + (n > 1 ? (i / (n - 1)) * cW : cW / 2);
  const py = v => PT + cH - ((v - yLo) / ySpan) * cH;
  const labelEvery = Math.max(1, Math.ceil(n / 9));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {[0,1,2,3,4,5].map(i => {
        const v = yLo + (i / 5) * ySpan;
        return <g key={i}>
          <line x1={PL} y1={py(v)} x2={W-PR} y2={py(v)} stroke="#F3F4F6" strokeWidth="1" />
          <text x={PL-8} y={py(v)+4} textAnchor="end" fontSize="11" fill="#9CA3AF">{v.toFixed(2)}</text>
        </g>;
      })}
      {xLabels?.map((lbl, i) => {
        if (i % labelEvery !== 0 && i !== n - 1) return null;
        return <g key={i}>
          <line x1={px(i)} y1={PT+cH} x2={px(i)} y2={PT+cH+4} stroke="#D1D5DB" strokeWidth="1" />
          <text x={px(i)} y={PT+cH+18} textAnchor="middle" fontSize="9" fill="#9CA3AF">{lbl}</text>
        </g>;
      })}
      <text x={14} y={H/2} textAnchor="middle" fontSize="10" fill="#9CA3AF" transform={`rotate(-90,14,${H/2})`}>{yAxisLabel}</text>
      <line x1={PL} y1={PT} x2={PL} y2={PT+cH} stroke="#E5E7EB" strokeWidth="1" />
      <line x1={PL} y1={PT+cH} x2={W-PR} y2={PT+cH} stroke="#E5E7EB" strokeWidth="1" />
      {series.map((s, si) => {
        if (s.bars) {
          return <g key={si}>
            {s.values.map((v, i) => {
              if (v == null) return null;
              const bH = Math.max(2, ((v - yLo) / ySpan) * cH);
              const bW = Math.max(2, cW / n - 1);
              return <rect key={i} x={px(i) - bW/2} y={py(v)} width={bW} height={bH} fill={s.color} opacity="0.6" rx="1" />;
            })}
          </g>;
        }
        const pts = s.values.map((v, i) => v != null ? [px(i), py(v)] : null);
        const segs = []; let seg = [];
        pts.forEach(p => { if (p) seg.push(p); else if (seg.length) { segs.push(seg); seg = []; } });
        if (seg.length) segs.push(seg);
        return <g key={si}>
          {s.dashed
            ? segs.map((sg, j) => <path key={j} d={sg.map(([x,y],k) => `${k===0?'M':'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')}
                fill="none" stroke={s.color} strokeWidth="2" strokeDasharray="6,3" strokeLinecap="round" strokeLinejoin="round" />)
            : segs.map((sg, j) => <path key={j} d={sg.map(([x,y],k) => `${k===0?'M':'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')}
                fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />)
          }
          {pts.map((p, i) => p && !s.dashed && <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="white" stroke={s.color} strokeWidth="2.5" />)}
        </g>;
      })}
      {series.map((s, i) => <g key={i} transform={`translate(${PL+20+i*140},${H-12})`}>
        {s.bars
          ? <rect x="0" y="-5" width="14" height="8" fill={s.color} opacity="0.7" rx="1" />
          : <line x1="0" y1="0" x2="18" y2="0" stroke={s.color} strokeWidth={s.dashed ? 2 : 2.5} strokeDasharray={s.dashed ? '5,3' : undefined} strokeLinecap="round" />
        }
        {!s.bars && <circle cx="9" cy="0" r="3.5" fill="white" stroke={s.color} strokeWidth="2" />}
        <text x="22" y="4" fontSize="10" fill="#6B7280">{s.label}</text>
      </g>)}
    </svg>
  );
}

const INDEX_OPTIONS = [
  { key: 'NDVI',   label: 'NDVI',   color: '#84CC16' },
  { key: 'NDRE',   label: 'NDRE',   color: '#3B82F6' },
  { key: 'EVI',    label: 'EVI',    color: '#F59E0B' },
  { key: 'GNDVI',  label: 'GNDVI',  color: '#10B981' },
  { key: 'NDWI',   label: 'NDWI',   color: '#6366F1' },
  { key: 'health', label: 'Health', color: '#EC4899' },
];

function useWeather(fieldId, enabled) {
  const [weather, setWeather] = useState(null);
  const [loadingW, setLoadingW] = useState(false);
  useEffect(() => {
    if (!fieldId || !enabled) { setWeather(null); return; }
    setLoadingW(true);
    fetch(`${API_URL}/api/fields/${fieldId}/weather?days=60`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setWeather(d); setLoadingW(false); })
      .catch(() => setLoadingW(false));
  }, [fieldId, enabled]);
  return { weather, loadingW };
}

export default function PrecisionAgCropStatus() {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const { analyses, loading } = useAnalyses(selectedFieldId);
  const [selectedIndices, setSelectedIndices] = useState(['NDVI']);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [showWeather, setShowWeather] = useState(false);
  // Season comparison
  const [compareYear, setCompareYear] = useState('');

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  const { weather, loadingW } = useWeather(selectedFieldId, showWeather);

  const toggleIndex = key =>
    setSelectedIndices(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const filtered = analyses.filter(a => {
    const d = new Date(a.analysis_date);
    if (dateFrom && d < new Date(dateFrom)) return false;
    if (dateTo   && d > new Date(dateTo))   return false;
    return true;
  });
  const sorted = [...filtered].reverse();

  // Season comparison: analyses from compareYear
  const compareAnalyses = useMemo(() => {
    if (!compareYear || !analyses.length) return [];
    return [...analyses.filter(a => new Date(a.analysis_date).getFullYear() === parseInt(compareYear))].reverse();
  }, [analyses, compareYear]);

  const currentYear = new Date().getFullYear();
  const availableYears = useMemo(() => {
    const years = new Set(analyses.map(a => new Date(a.analysis_date).getFullYear()));
    return [...years].sort((a, b) => b - a);
  }, [analyses]);

  const xLabels = sorted.map(a => {
    const d = new Date(a.analysis_date);
    return `${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}`;
  });

  const series = selectedIndices.map(key => {
    const opt = INDEX_OPTIONS.find(o => o.key === key);
    return {
      label: opt.label, color: opt.color,
      values: sorted.map(a => key === 'health'
        ? (a.health_score != null ? a.health_score / 100 : null)
        : (getIndex(a, key)?.mean ?? null)),
    };
  });

  // Add compare series (dashed)
  if (compareYear && compareAnalyses.length && selectedIndices.length > 0) {
    const key = selectedIndices[0];
    const opt = INDEX_OPTIONS.find(o => o.key === key);
    series.push({
      label: `${opt.label} ${compareYear}`,
      color: opt.color,
      dashed: true,
      values: sorted.map(a => {
        const aMonth = new Date(a.analysis_date).getMonth();
        const aDay   = new Date(a.analysis_date).getDate();
        const match  = compareAnalyses.find(c => {
          const cd = new Date(c.analysis_date);
          return Math.abs(cd.getMonth() - aMonth) <= 1 && Math.abs(cd.getDate() - aDay) <= 7;
        });
        return match ? (key === 'health' ? (match.health_score != null ? match.health_score / 100 : null) : (getIndex(match, key)?.mean ?? null)) : null;
      }),
    });
  }

  const selectedField = fields.find(f => String(f.fieldid || f.id) === selectedFieldId);

  // Weather series aligned to analysis dates
  const weatherSeries = useMemo(() => {
    if (!weather?.daily || !sorted.length) return [];
    const daily = weather.daily;
    const tempMax = sorted.map(a => {
      const ad = a.analysis_date.slice(0, 10);
      const w = daily.find(d => d.date === ad);
      return w?.temp_max ?? null;
    });
    const tempMin = sorted.map(a => {
      const ad = a.analysis_date.slice(0, 10);
      const w = daily.find(d => d.date === ad);
      return w?.temp_min ?? null;
    });
    const precip = sorted.map(a => {
      const ad = a.analysis_date.slice(0, 10);
      const w = daily.find(d => d.date === ad);
      return w?.precip ?? null;
    });
    return [
      { label: 'Temp Max (°F)', color: '#EF4444', values: tempMax },
      { label: 'Temp Min (°F)', color: '#93C5FD', values: tempMin },
      { label: 'Precip (in)',   color: '#3B82F6', values: precip, bars: true },
    ];
  }, [weather, sorted]);

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={pa('crop_status_title')}
      breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:pa('crop_status_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{pa('crop_status_title')}</h1>
            <p className="font-mont text-sm text-gray-500">{pa('crop_status_desc')}</p>
          </div>
          <a href={`${API_URL}/api/fields/${selectedFieldId}/report.xlsx`} download
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-mont text-gray-600 hover:bg-gray-50">
            ↓ Download Excel
          </a>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_field')}</label>
            <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
              {fields.length === 0 && <option value="">No fields</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_from')}</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_to')}</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
          </div>
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="px-3 py-2 text-xs font-mont text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">{pa('btn_clear')}</button>
          )}
        </div>

        {/* Index pills + controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold font-mont text-gray-500 mr-1">{pa('f_index')}</span>
          {INDEX_OPTIONS.map(opt => {
            const active = selectedIndices.includes(opt.key);
            return (
              <button key={opt.key} onClick={() => toggleIndex(opt.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mont font-semibold border transition-all"
                style={{ background: active ? opt.color+'22':'white', borderColor: active ? opt.color:'#E5E7EB', color: active ? opt.color:'#9CA3AF' }}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: active ? opt.color:'#D1D5DB' }} />
                {opt.label}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-4 flex-wrap">
            {/* Season compare */}
            {availableYears.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mont text-gray-500">{pa('f_compare_year')}</span>
                <select value={compareYear} onChange={e => setCompareYear(e.target.value)}
                  className="border border-gray-200 rounded-lg text-xs font-mont px-2 py-1.5">
                  <option value="">{pa('opt_none')}</option>
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={showWeather} onChange={e => setShowWeather(e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <span className="text-xs font-mont text-gray-500">{pa('f_weather_overlay')}</span>
            </label>
          </div>
        </div>

        {/* Main chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{pa('loading_analyses')}</div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-24">
              <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 4.9A10 10 0 1 0 19.1 19.1"/><path d="M16.24 7.76A6 6 0 1 0 7.76 16.24"/><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><line x1="12" y1="12" x2="21" y2="21"/></svg></div>
              <div className="font-lora text-xl text-gray-600 mb-2">{pa('no_analysis_data')}</div>
              <div className="font-mont text-sm text-gray-400">
                {fields.length === 0 ? pa('no_fields_account') : pa('run_analysis_trends')}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="font-mont text-sm font-semibold text-gray-600">
                  {selectedField?.name} · {sorted.length} observation{sorted.length !== 1 ? 's' : ''}
                  {compareYear && <span className="ml-2 text-gray-400 font-normal">vs. {compareYear} (dashed)</span>}
                </span>
                <span className="font-mont text-xs text-gray-400">
                  {new Date(sorted[0].analysis_date).toLocaleDateString()} – {new Date(sorted[sorted.length-1].analysis_date).toLocaleDateString()}
                </span>
              </div>
              <LineChart series={series} xLabels={xLabels} height={280} yAxisLabel="Index" />
            </>
          )}
        </div>

        {/* Weather chart */}
        {showWeather && sorted.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="font-mont text-sm font-semibold text-gray-600 mb-4">{pa('weather_title')}</div>
            {loadingW ? (
              <div className="flex items-center justify-center py-12 text-gray-400 font-mont text-sm animate-pulse">{pa('fetching_weather')}</div>
            ) : weatherSeries.length > 0 && weatherSeries.some(s => s.values.some(v => v != null)) ? (
              <LineChart series={weatherSeries} xLabels={xLabels} height={200} yAxisLabel="°F / in" />
            ) : (
              <div className="text-center py-12 font-mont text-sm text-gray-400">
                {pa('weather_unavailable')}
              </div>
            )}
            <p className="mt-2 font-mont text-xs text-gray-400">{pa('weather_source')}</p>
          </div>
        )}

        {/* History table */}
        {sorted.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">{pa('analysis_history')}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mont">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">{pa('th_date')}</th>
                    {['NDVI','NDRE','EVI','GNDVI','NDWI'].map(k => (
                      <th key={k} className="text-center px-3 py-3 text-gray-500 font-semibold">{k}</th>
                    ))}
                    <th className="text-center px-3 py-3 text-gray-500 font-semibold">{pa('th_health')}</th>
                    <th className="text-center px-3 py-3 text-gray-500 font-semibold">{pa('th_cloud_pct')}</th>
                    {showWeather && weather && <th className="text-center px-3 py-3 text-gray-500 font-semibold">{pa('th_temp_max')}</th>}
                    {showWeather && weather && <th className="text-center px-3 py-3 text-gray-500 font-semibold">{pa('th_precip')}</th>}
                  </tr>
                </thead>
                <tbody>
                  {[...sorted].reverse().map((a, i) => {
                    const prev  = [...sorted].reverse()[i+1];
                    const nNow  = getIndex(a,'NDVI')?.mean;
                    const nPrev = prev ? getIndex(prev,'NDVI')?.mean : null;
                    const trend = nNow && nPrev ? (nNow > nPrev ? '↑' : nNow < nPrev ? '↓' : '→') : '';
                    const tC    = trend==='↑' ? '#16A34A' : trend==='↓' ? '#DC2626' : '#9CA3AF';
                    const wDay  = weather?.daily?.find(d => d.date === a.analysis_date?.slice(0,10));
                    return (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-semibold text-gray-800">
                          {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                          {trend && <span className="ml-2 text-xs" style={{color:tC}}>{trend}</span>}
                        </td>
                        {['NDVI','NDRE','EVI','GNDVI','NDWI'].map(k => (
                          <td key={k} className="px-3 py-2.5 text-center text-gray-700">{getIndex(a,k)?.mean?.toFixed(3)??'—'}</td>
                        ))}
                        <td className="px-3 py-2.5 text-center font-bold"
                          style={{color: a.health_score>=70?'#16A34A':a.health_score>=50?'#D97706':'#DC2626'}}>
                          {a.health_score??'—'}%
                        </td>
                        <td className="px-3 py-2.5 text-center text-gray-400">{a.cloud_percent?.toFixed(1)??'—'}%</td>
                        {showWeather && weather && <td className="px-3 py-2.5 text-center text-gray-500">{wDay?.temp_max != null ? `${wDay.temp_max.toFixed(0)}°F` : '—'}</td>}
                        {showWeather && weather && <td className="px-3 py-2.5 text-center text-gray-500">{wDay?.precip != null ? `${wDay.precip.toFixed(2)}"` : '—'}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
