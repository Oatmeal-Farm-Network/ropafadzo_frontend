import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const SEVERITY_STYLE = {
  critical: { bg: '#FFE4E6', border: '#FB7185', text: '#9F1239', dot: '#E11D48', tKey: 'sev_critical' },
  severe:   { bg: '#FFEDD5', border: '#FB923C', text: '#9A3412', dot: '#F97316', tKey: 'sev_severe'   },
  warn:     { bg: '#FEF3C7', border: '#FBBF24', text: '#92400E', dot: '#F59E0B', tKey: 'sev_warn'     },
};

const KI = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    {children}
  </svg>
);

const KIND_LABEL = {
  heatwave:   { tKey: 'kind_heatwave',   icon: <KI><path d="M8 1v2M8 13v2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M1 8h2M13 8h2M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"/><circle cx="8" cy="8" r="3"/></KI> },
  frost:      { tKey: 'kind_frost',      icon: <KI><line x1="8" y1="1" x2="8" y2="15"/><line x1="1" y1="8" x2="15" y2="8"/><line x1="3.5" y1="3.5" x2="12.5" y2="12.5"/><line x1="12.5" y1="3.5" x2="3.5" y2="12.5"/></KI> },
  cold_snap:  { tKey: 'kind_cold_snap',  icon: <KI><path d="M8 2v12M5 5l3-3 3 3M5 11l3 3 3-3M2 8l3-3-3 3M14 8l-3-3 3 3"/></KI> },
  high_vpd:   { tKey: 'kind_high_vpd',  icon: <KI><path d="M8 14V8"/><path d="M5 10c0-3 3-5 3-8 0 3 3 5 3 8a3 3 0 0 1-6 0z"/><line x1="4" y1="6" x2="12" y2="6" strokeDasharray="1.5 1.5"/></KI> },
  heavy_rain: { tKey: 'kind_heavy_rain', icon: <KI><path d="M3 9a5 5 0 0 1 10 0 3 3 0 0 1 0 6H3a3 3 0 0 1 0-6z"/><line x1="5" y1="13" x2="4" y2="15"/><line x1="8" y1="13" x2="7" y2="15"/><line x1="11" y1="13" x2="10" y2="15"/></KI> },
  high_wind:  { tKey: 'kind_high_wind',  icon: <KI><path d="M2 8h9a2 2 0 1 0-2-2"/><path d="M2 11h6a2 2 0 1 1-2 2"/><path d="M2 5h5a2 2 0 1 0-2-2"/></KI> },
};

const WarnIcon = () => (
  <KI><path d="M8 2L1 14h14z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12.5" r="0.6" fill="currentColor" stroke="none"/></KI>
);

function fmtRelative(t, hours) {
  if (hours == null) return '—';
  if (hours < 1)   return t('climate_forecast.relative_now');
  if (hours < 24)  return t('climate_forecast.relative_hours', { hours });
  const days = Math.floor(hours / 24);
  const rem  = hours % 24;
  return rem === 0
    ? t('climate_forecast.relative_days', { days })
    : t('climate_forecast.relative_days_hours', { days, rem });
}

function fmtClock(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' });
  } catch {
    return iso;
  }
}

function MiniSpark({ rows, valueKey, lo, hi, color }) {
  if (!rows || rows.length === 0) return null;
  const vals = rows.map(r => r?.[valueKey]).filter(v => v != null);
  if (vals.length === 0) return null;
  const min = lo != null ? lo : Math.min(...vals);
  const max = hi != null ? hi : Math.max(...vals);
  const range = max - min || 1;
  const w = 220, h = 36;
  const step = w / Math.max(rows.length - 1, 1);
  const path = rows.map((r, i) => {
    const v = r?.[valueKey];
    if (v == null) return '';
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).filter(Boolean).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function StressEventCard({ ev }) {
  const { t } = useTranslation();
  const style = SEVERITY_STYLE[ev.severity] || SEVERITY_STYLE.warn;
  const kind  = KIND_LABEL[ev.kind] || { tKey: null, icon: <WarnIcon /> };
  return (
    <div className="rounded-lg border p-4" style={{ background: style.bg, borderColor: style.border }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span style={{ color: style.text }}>{kind.icon}</span>
          <div>
            <div className="font-mont font-bold text-sm" style={{ color: style.text }}>
              {kind.tKey ? t('climate_forecast.' + kind.tKey) : ev.kind}
            </div>
            <div className="text-xs" style={{ color: style.text, opacity: 0.85 }}>
              {t('climate_forecast.event_onset_desc', {
                relative: fmtRelative(t, ev.onset_hours_out),
                clock: fmtClock(ev.onset),
                duration: ev.duration_hours,
                peak: ev.peak_value,
                units: ev.units,
              })}
            </div>
          </div>
        </div>
        <span
          className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full"
          style={{ background: style.dot, color: '#fff' }}
        >
          {t('climate_forecast.' + style.tKey)}
        </span>
      </div>
      <p className="mt-3 text-sm" style={{ color: style.text }}>{ev.reason}</p>
      {ev.recommended_actions?.length > 0 && (
        <ul className="mt-3 space-y-1">
          {ev.recommended_actions.map((a, i) => (
            <li key={i} className="text-sm flex items-start gap-2" style={{ color: style.text }}>
              <span className="mt-0.5">→</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Spray-window thresholds by product type ─────────────────────────────────
const SPRAY_PROFILES = {
  herbicide:   { label: 'Herbicide',   windMax: 10, windMin: 3,  tempMin: 50, tempMax: 90, rhMin: 40, rhMax: 90  },
  fungicide:   { label: 'Fungicide',   windMax: 12, windMin: 0,  tempMin: 55, tempMax: 85, rhMin: 50, rhMax: 95  },
  insecticide: { label: 'Insecticide', windMax: 8,  windMin: 0,  tempMin: 60, tempMax: 90, rhMin: 40, rhMax: 80  },
};

function sprayRating(row, profile) {
  if (!row) return 'unknown';
  const { wind_mph, temp_f, rh_pct, precip_in } = row;
  const issues = [];
  if (precip_in != null && precip_in > 0.02) issues.push('rain');
  if (wind_mph  != null && (wind_mph > profile.windMax || wind_mph < profile.windMin)) issues.push('wind');
  if (temp_f    != null && (temp_f   < profile.tempMin || temp_f   > profile.tempMax)) issues.push('temp');
  if (rh_pct    != null && (rh_pct   < profile.rhMin   || rh_pct   > profile.rhMax))   issues.push('RH');
  if (issues.length === 0) return 'go';
  // borderline: one marginal condition (within 15% of threshold)
  const marginalWind = wind_mph != null && wind_mph > profile.windMax * 0.85 && wind_mph <= profile.windMax;
  const marginalRH   = rh_pct  != null && (rh_pct < profile.rhMin * 1.1 || rh_pct > profile.rhMax * 0.95);
  if (issues.length === 1 && (marginalWind || marginalRH) && !issues.includes('rain') && !issues.includes('temp')) return 'marginal';
  return 'hold';
}

const RATING_STYLE = {
  go:      { bg: '#DCFCE7', text: '#15803D', label: 'GO',       dot: '#22C55E' },
  marginal:{ bg: '#FEF9C3', text: '#92400E', label: 'MARGINAL', dot: '#EAB308' },
  hold:    { bg: '#FEE2E2', text: '#991B1B', label: 'HOLD',     dot: '#EF4444' },
  unknown: { bg: '#F3F4F6', text: '#6B7280', label: '—',        dot: '#9CA3AF' },
};

function SprayWindowsPanel({ hourly }) {
  const [product, setProduct] = useState('herbicide');
  const profile = SPRAY_PROFILES[product];
  const next72  = (hourly || []).filter(r => r.hours_out != null && r.hours_out < 72);

  const rated = next72.map(r => ({ ...r, rating: sprayRating(r, profile) }));

  // Find next GO window start
  const nextGo = rated.find(r => r.rating === 'go');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">Spray Windows</h4>
          <p className="text-xs text-gray-400 mt-0.5">Optimized application timing based on forecast conditions</p>
        </div>
        <div className="flex gap-1">
          {Object.entries(SPRAY_PROFILES).map(([key, p]) => (
            <button key={key} onClick={() => setProduct(key)}
              className="px-3 py-1.5 rounded-lg font-mont font-semibold text-xs border transition-all"
              style={{
                background:  product === key ? '#3D6B34' : 'white',
                color:       product === key ? 'white'   : '#374151',
                borderColor: product === key ? '#3D6B34' : '#D1D5DB',
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thresholds reference */}
      <div className="flex gap-4 flex-wrap mb-4 text-xs font-mont text-gray-500 bg-gray-50 rounded-lg px-4 py-2.5">
        <span>Wind {profile.windMin > 0 ? `${profile.windMin}–` : '< '}{profile.windMax} mph</span>
        <span>Temp {profile.tempMin}–{profile.tempMax}°F</span>
        <span>RH {profile.rhMin}–{profile.rhMax}%</span>
        <span>No rain (&gt;0.02″/hr)</span>
      </div>

      {/* Next GO window callout */}
      <div className="mb-4 rounded-lg px-4 py-3 flex items-center gap-3"
        style={{ background: nextGo ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${nextGo ? '#86EFAC' : '#FECACA'}` }}>
        <span className="text-lg">{nextGo ? '✅' : '🚫'}</span>
        <div>
          <div className="font-mont font-bold text-sm" style={{ color: nextGo ? '#15803D' : '#991B1B' }}>
            {nextGo ? `Next GO window: ${fmtClock(nextGo.time)}` : 'No GO windows in next 72 hours'}
          </div>
          {nextGo && (
            <div className="text-xs mt-0.5" style={{ color: '#166534' }}>
              {nextGo.wind_mph?.toFixed(0)} mph wind · {nextGo.temp_f?.toFixed(0)}°F · {nextGo.rh_pct?.toFixed(0)}% RH
            </div>
          )}
        </div>
      </div>

      {/* Hourly timeline — 6-column blocks */}
      {rated.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max pb-1">
            {rated.filter((_, i) => i % 2 === 0).map((r, i) => {
              const s = RATING_STYLE[r.rating];
              return (
                <div key={i} className="flex flex-col items-center gap-1" style={{ minWidth: 40 }}>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-mont font-bold text-[9px] uppercase text-center"
                    style={{ background: s.bg, color: s.text, border: `1.5px solid ${s.dot}` }}
                    title={`${fmtClock(r.time)}: ${s.label}\n${r.wind_mph?.toFixed(0) ?? '?'} mph wind, ${r.temp_f?.toFixed(0) ?? '?'}°F, ${r.rh_pct?.toFixed(0) ?? '?'}% RH`}
                  >
                    {s.label === 'MARGINAL' ? '~' : s.label === 'GO' ? '✓' : s.label === 'HOLD' ? '✗' : '—'}
                  </div>
                  <span className="text-[9px] font-mont text-gray-400 leading-none text-center whitespace-nowrap">
                    {r.time ? new Date(r.time).toLocaleTimeString([], { hour: 'numeric', hour12: true }).toLowerCase() : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 mt-3 flex-wrap">
        {['go', 'marginal', 'hold'].map(k => {
          const s = RATING_STYLE[k];
          return (
            <div key={k} className="flex items-center gap-1.5 text-xs font-mont" style={{ color: s.text }}>
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.dot }} />
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ClimateForecastPanel({ fieldId }) {
  const { t } = useTranslation();
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);
  const [hours, setHours]   = useState(72);

  useEffect(() => {
    if (!fieldId) return;
    setLoad(true);
    setError(null);
    fetch(`${API_URL}/api/fields/${fieldId}/climate-forecast?hours=${hours}`)
      .then(r => r.ok ? r.json() : r.json().then(j => Promise.reject(new Error(j.detail || `HTTP ${r.status}`))))
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoad(false));
  }, [fieldId, hours]);

  if (loading && !data) return <div className="p-6 text-gray-500">{t('climate_forecast.loading')}</div>;
  if (error)            return <div className="p-6 text-red-600">{t('climate_forecast.error_load', { error })}</div>;
  if (!data)            return null;

  const { summary = {}, events = [], hourly = [], crop_profile = {}, source } = data;
  const next72 = hourly.filter(r => r.hours_out < 72);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-lora text-xl font-bold text-gray-900">{t('climate_forecast.heading')}</h3>
            <p className="text-sm text-gray-500 font-mont mt-1">
              {t('climate_forecast.subheading', {
                field_name: data.field_name,
                crop_type: data.crop_type || t('climate_forecast.unknown_crop'),
                horizon_hours: data.horizon_hours,
              })}
            </p>
          </div>
          <div className="flex gap-1 text-xs">
            {[24, 72, 168].map(h => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`px-3 py-1 rounded font-mont font-semibold transition-all ${
                  hours === h ? 'bg-[#3D6B34] text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {h === 168 ? '7d' : `${h}h`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{t('climate_forecast.stat_high')}</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">{summary.max_temp_f ?? '—'}°F</div>
            <MiniSpark rows={next72} valueKey="temp_f" color="#EF4444" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{t('climate_forecast.stat_low')}</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">{summary.min_temp_f ?? '—'}°F</div>
            <MiniSpark rows={next72} valueKey="temp_f" color="#3B82F6" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{t('climate_forecast.stat_peak_vpd')}</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">{summary.max_vpd_kpa ?? '—'}</div>
            <div className="text-[10px] text-gray-400">{t('climate_forecast.vpd_unit')}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{t('climate_forecast.stat_peak_wind')}</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">{summary.max_wind_mph ?? '—'}</div>
            <div className="text-[10px] text-gray-400">{t('climate_forecast.wind_unit')}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{t('climate_forecast.stat_total_rain')}</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">{summary.total_precip_in ?? '—'}″</div>
            <div className="text-[10px] text-gray-400">{t('climate_forecast.rain_unit')}</div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400 italic">
          {t('climate_forecast.source_footer', {
            source,
            tunnel:  crop_profile.tunnel_typical   ? t('climate_forecast.yes') : t('climate_forecast.no'),
            heat:    crop_profile.heat_sensitive    ? t('climate_forecast.yes') : t('climate_forecast.no'),
            frost:   crop_profile.frost_sensitive   ? t('climate_forecast.yes') : t('climate_forecast.no'),
            rain:    crop_profile.rain_split_risk   ? t('climate_forecast.yes') : t('climate_forecast.no'),
          })}
        </p>
      </div>

      {/* Events */}
      <div>
        <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
          {events.length > 0
            ? t(events.length === 1 ? 'climate_forecast.events_predicted_one' : 'climate_forecast.events_predicted_other', { count: events.length })
            : t('climate_forecast.no_events')}
        </h4>
        {events.length === 0 ? (
          <div className="bg-white border border-green-200 rounded-lg p-5 text-sm text-green-800">
            {t('climate_forecast.no_events_desc', { hours: data.horizon_hours })}
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((ev, i) => <StressEventCard key={i} ev={ev} />)}
          </div>
        )}
      </div>

      {/* Spray windows */}
      <SprayWindowsPanel hourly={hourly} />

      {/* Hourly strip — first 72 hours, condensed */}
      {next72.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">{t('climate_forecast.hourly_heading')}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2 pr-3">{t('climate_forecast.col_when')}</th>
                  <th className="py-2 pr-3">{t('climate_forecast.col_temp')}</th>
                  <th className="py-2 pr-3">{t('climate_forecast.col_rh')}</th>
                  <th className="py-2 pr-3">{t('climate_forecast.col_vpd')}</th>
                  <th className="py-2 pr-3">{t('climate_forecast.col_wind')}</th>
                  <th className="py-2 pr-3">{t('climate_forecast.col_rain')}</th>
                </tr>
              </thead>
              <tbody>
                {next72.filter((_, i) => i % 3 === 0).map((r, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-1.5 pr-3 text-gray-600">{fmtClock(r.time)}</td>
                    <td className="py-1.5 pr-3 font-medium">{r.temp_f != null ? `${r.temp_f.toFixed(0)}°F` : '—'}</td>
                    <td className="py-1.5 pr-3">{r.rh_pct != null ? `${r.rh_pct.toFixed(0)}%` : '—'}</td>
                    <td className="py-1.5 pr-3">{r.vpd_kpa != null ? r.vpd_kpa.toFixed(2) : '—'}</td>
                    <td className="py-1.5 pr-3">{r.wind_mph != null ? `${r.wind_mph.toFixed(0)} mph` : '—'}</td>
                    <td className="py-1.5 pr-3">{r.precip_in != null ? `${r.precip_in.toFixed(2)}″` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 italic">
            {t('climate_forecast.hourly_note')}
          </div>
        </div>
      )}
    </div>
  );
}
