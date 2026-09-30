import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, API_URL } from './precisionAgUtils';
import { useTranslation } from 'react-i18next';

const URGENCY_STYLE = {
  high:   { bg: '#FEE2E2', text: '#B91C1C', label: 'Irrigate Now',    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  medium: { bg: '#FEF3C7', text: '#92400E', label: 'Consider Soon',   icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  low:    { bg: '#D1FAE5', text: '#065F46', label: 'No Action Needed', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
};

function WaterDeficitChart({ daily }) {
  if (!daily || daily.length === 0) return null;
  const W = 680, H = 160, PAD = { l: 45, r: 20, t: 12, b: 28 };
  const maxDef = Math.max(...daily.map(d => d.cumulative_deficit_in), 0.5);
  const maxPrecip = Math.max(...daily.map(d => d.precip_in), 0.5);

  const cx = i => PAD.l + (i / (daily.length - 1)) * (W - PAD.l - PAD.r);
  const cyDef = v => PAD.t + (1 - v / maxDef) * (H - PAD.t - PAD.b);
  const barH = v => (v / maxPrecip) * ((H - PAD.t - PAD.b) * 0.4);

  const defPath = daily.map((d, i) => `${i === 0 ? 'M' : 'L'}${cx(i)},${cyDef(d.cumulative_deficit_in)}`).join(' ');
  const yticks = [0, 0.5, 1.0, 1.5].filter(v => v <= maxDef + 0.1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
      {yticks.map(v => (
        <g key={v}>
          <line x1={PAD.l} y1={cyDef(v)} x2={W - PAD.r} y2={cyDef(v)} stroke="#f0f0f0" strokeWidth="1" />
          <text x={PAD.l - 4} y={cyDef(v) + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">{v}"</text>
        </g>
      ))}
      {/* Precipitation bars */}
      {daily.map((d, i) => {
        const h = barH(d.precip_in);
        const bw = Math.max(2, (W - PAD.l - PAD.r) / daily.length - 1);
        return (
          <rect key={i}
            x={cx(i) - bw / 2}
            y={H - PAD.b - h}
            width={bw}
            height={h}
            fill="#3B82F6" fillOpacity="0.4" />
        );
      })}
      {/* Deficit line */}
      <path d={`${defPath} L${cx(daily.length - 1)},${H - PAD.b} L${cx(0)},${H - PAD.b} Z`}
        fill="#DC2626" fillOpacity="0.08" />
      <path d={defPath} fill="none" stroke="#DC2626" strokeWidth="2" />
      {/* X ticks */}
      {[0, Math.floor(daily.length / 2), daily.length - 1].map(i => (
        <text key={i} x={cx(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#9CA3AF">
          {daily[i]?.date?.slice(5)}
        </text>
      ))}
      {/* legend */}
      <rect x={PAD.l} y={PAD.t} width={8} height={8} fill="#DC2626" />
      <text x={PAD.l + 11} y={PAD.t + 7} fontSize="9" fill="#6B7280">Cumulative deficit</text>
      <rect x={PAD.l + 110} y={PAD.t} width={8} height={8} fill="#3B82F6" fillOpacity="0.5" />
      <text x={PAD.l + 121} y={PAD.t + 7} fontSize="9" fill="#6B7280">Precipitation</text>
    </svg>
  );
}

export default function PrecisionAgIrrigation() {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  const load = useCallback(async () => {
    if (!selectedFieldId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/irrigation?days=${days}`);
      setData(r.ok ? await r.json() : null);
    } catch { setData(null); }
    setLoading(false);
  }, [selectedFieldId, days]);

  useEffect(() => { load(); }, [load]);

  const urgencyStyle = data ? (URGENCY_STYLE[data.urgency] || URGENCY_STYLE.low) : null;

  // Last 7-day totals
  const last7 = data?.daily?.slice(-7) || [];
  const totalPrecip7  = last7.reduce((s, d) => s + (d.precip_in || 0), 0);
  const totalETC7     = last7.reduce((s, d) => s + (d.etc_in   || 0), 0);
  const totalDeficit7 = last7.reduce((s, d) => s + (d.deficit_in || 0), 0);

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={pa('irrigation_title')} breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:pa('irrigation_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{pa('irrigation_title')}</h1>
          <p className="font-mont text-sm text-gray-500">{pa('irrigation_desc')}</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_field')}</label>
            <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{pa('f_period')}</label>
            <select value={days} onChange={e => setDays(Number(e.target.value))}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={45}>45 days</option>
              <option value={60}>60 days</option>
            </select>
          </div>
          {data && (
            <div className="font-mont text-xs text-gray-400 self-end pb-2">
              {pa('lbl_crop')} {data.crop_type || '—'} — {pa('lbl_kc')} {data.kc}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{pa('loading')}</div>
        ) : !data ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></div>
            <div className="font-lora text-xl text-gray-600">{pa('no_data_available')}</div>
            <div className="font-mont text-sm text-gray-400 mt-1">{pa('no_coords')}</div>
          </div>
        ) : (
          <>
            {/* Recommendation banner */}
            <div className="rounded-xl p-5 flex items-center gap-4"
              style={{ background: urgencyStyle.bg }}>
              <div className="flex items-center">{urgencyStyle.icon}</div>
              <div>
                <div className="font-lora text-xl font-bold" style={{ color: urgencyStyle.text }}>
                  {data.recommendation}
                </div>
                <div className="font-mont text-sm mt-0.5" style={{ color: urgencyStyle.text }}>
                  {pa('lbl_cum_water_deficit')} <strong>{data.cumulative_deficit_in.toFixed(2)}"</strong>
                </div>
              </div>
            </div>

            {/* 7-day summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: pa('precip_7d'),       value: totalPrecip7.toFixed(2) + '"', color: '#2563EB' },
                { label: pa('crop_et_7d'),      value: totalETC7.toFixed(2)    + '"', color: '#D97706' },
                { label: pa('daily_deficit_7d'),value: totalDeficit7.toFixed(2) + '"', color: '#DC2626' },
                { label: pa('crop_coefficient'),value: data.kc,                        color: '#6D8E22' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                  <div className="font-mont text-xs text-gray-400">{s.label}</div>
                  <div className="font-mont text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-mont text-sm font-semibold text-gray-600 mb-3">
                Water Deficit vs Precipitation — {days}-day
              </div>
              <WaterDeficitChart daily={data.daily} />
            </div>

            {/* ET source note */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="font-mont text-xs text-gray-500 font-semibold mb-1">{pa('data_source_notes')}</p>
              <p className="font-mont text-xs text-gray-400">
                ET₀ is sourced from Open-Meteo (ERA5 reanalysis + 7-day forecast). Coverage is global but accuracy
                varies in remote areas — if your field shows implausible values, consider supplementing with
                on-site weather station data. Crop ET (ETc) applies FAO-56 crop coefficients (Kc) to ET₀.
                For fields outside Open-Meteo coverage, the ASCE Penman-Monteith method or a nearby NOAA COOP
                station are suitable alternatives.
              </p>
            </div>

            {/* Table — last 14 days */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
                {pa('daily_breakdown')}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mont">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {[pa('th_date'), pa('th_precip_in'), pa('th_et0_in'), pa('th_etc_in'), pa('th_daily_deficit'), pa('th_cum_deficit')].map(h => (
                        <th key={h} className="px-3 py-2.5 text-xs font-semibold text-gray-500 text-center first:text-left first:px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...(data.daily || [])].reverse().slice(0, 14).map((d, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs font-semibold text-gray-700">{d.date}</td>
                        <td className="px-3 py-2 text-center text-xs text-[#2563EB]">{d.precip_in}</td>
                        <td className="px-3 py-2 text-center text-xs text-gray-500">{d.et0_in}</td>
                        <td className="px-3 py-2 text-center text-xs text-gray-600">{d.etc_in}</td>
                        <td className="px-3 py-2 text-center text-xs" style={{ color: d.deficit_in > 0 ? '#DC2626' : '#16A34A' }}>
                          {d.deficit_in > 0 ? d.deficit_in : '0.000'}
                        </td>
                        <td className="px-3 py-2 text-center text-xs font-semibold"
                          style={{ color: d.cumulative_deficit_in >= 1.5 ? '#DC2626' : d.cumulative_deficit_in >= 0.75 ? '#D97706' : '#16A34A' }}>
                          {d.cumulative_deficit_in}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
}
