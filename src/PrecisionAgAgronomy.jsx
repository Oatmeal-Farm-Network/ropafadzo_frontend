import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, API_URL } from './precisionAgUtils';
import SaigeWidget from './SaigeWidget';

function StatTile({ label, value, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{label}</div>
      <div className="text-2xl font-mont font-bold text-gray-900 mt-1">{value ?? '—'}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function IndexBar({ label, value, lo = 0, hi = 1, color = '#3D6B34' }) {
  if (value == null) return null;
  const pct = Math.max(0, Math.min(1, (value - lo) / (hi - lo))) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span className="font-semibold">{label}</span>
        <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

const TREND_COLORS = { rising: '#15803D', falling: '#B91C1C', flat: '#6B7280' };

function NDVITrendChart({ series, summary, index = 'NDVI' }) {
  const { t } = useTranslation();
  if (!series || series.length < 2) {
    return (
      <div className="text-sm text-gray-500 italic">
        {t('precision_ag_agronomy.ndvi_chart_empty')}
      </div>
    );
  }

  const W = 520, H = 160, padL = 32, padR = 8, padT = 10, padB = 22;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const pts = series
    .filter(p => p.mean != null && p.date)
    .map(p => ({ ...p, t: new Date(p.date).getTime() }));
  if (pts.length < 2) return null;

  const t0 = pts[0].t, t1 = pts[pts.length - 1].t;
  const tSpan = Math.max(1, t1 - t0);
  const ys = pts.map(p => p.mean);
  const yMinRaw = Math.min(...ys);
  const yMaxRaw = Math.max(...ys);
  const yPad = Math.max(0.05, (yMaxRaw - yMinRaw) * 0.15);
  const yMin = Math.max(-0.2, yMinRaw - yPad);
  const yMax = Math.min(1.0,  yMaxRaw + yPad);

  const xOf = t => padL + ((t - t0) / tSpan) * innerW;
  const yOf = v => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.t).toFixed(1)},${yOf(p.mean).toFixed(1)}`).join(' ');
  const trendColor = TREND_COLORS[summary?.trend] || TREND_COLORS.flat;

  const yTicks = [yMin, (yMin + yMax) / 2, yMax];
  const fmtDate = ms => new Date(ms).toISOString().slice(5, 10);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yOf(v)} y2={yOf(v)} stroke="#E5E7EB" strokeDasharray="2 3" />
            <text x={padL - 4} y={yOf(v) + 3} textAnchor="end" fontSize="9" fill="#6B7280">{v.toFixed(2)}</text>
          </g>
        ))}
        <text x={padL} y={H - 6} fontSize="9" fill="#6B7280">{fmtDate(t0)}</text>
        <text x={W - padR} y={H - 6} textAnchor="end" fontSize="9" fill="#6B7280">{fmtDate(t1)}</text>

        <path d={path} fill="none" stroke={trendColor} strokeWidth="1.6" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={xOf(p.t)} cy={yOf(p.mean)} r="2.2" fill={trendColor}>
            <title>{`${p.date?.slice(0, 10)}  ${index} = ${p.mean.toFixed(3)}`}</title>
          </circle>
        ))}
      </svg>

      {summary && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-1">
          <span><span className="font-semibold">{t('precision_ag_agronomy.ndvi_trend_label')}:</span> <span style={{ color: trendColor }}>{summary.trend}</span></span>
          <span><span className="font-semibold">{t('precision_ag_agronomy.ndvi_delta_label')}:</span> {summary.delta_total >= 0 ? '+' : ''}{summary.delta_total.toFixed(3)}</span>
          <span><span className="font-semibold">{t('precision_ag_agronomy.ndvi_per_week_label')}:</span> {summary.slope_per_week >= 0 ? '+' : ''}{summary.slope_per_week.toFixed(4)}</span>
          <span><span className="font-semibold">{t('precision_ag_agronomy.ndvi_samples_label')}:</span> {summary.samples}</span>
        </div>
      )}
    </div>
  );
}

export default function PrecisionAgAgronomy() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const fieldId = searchParams.get('FieldID');
  const BusinessID = searchParams.get('BusinessID');
  const { Business } = useAccount();
  const fields = useFields(BusinessID);
  const field = useMemo(
    () => fields.find(f => String(f.fieldid ?? f.id) === String(fieldId)),
    [fields, fieldId]
  );

  const [agro, setAgro] = useState(null);
  const [recs, setRecs] = useState(null);
  const [ndviSeries, setNdviSeries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function load() {
    if (!fieldId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`${API_URL}/api/fields/${fieldId}/agronomy`).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(`${API_URL}/api/fields/${fieldId}/recommendations`).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(`${API_URL}/api/fields/${fieldId}/indices/series?index=NDVI&days=180`)
        .then(r => (r.ok ? r.json() : null)).catch(() => null),
    ])
      .then(([a, r, s]) => { setAgro(a || null); setRecs(r || null); setNdviSeries(s || null); })
      .catch(e => setError(e.message || t('precision_ag_agronomy.err_load_failed')))
      .finally(() => setLoading(false));
  }
  useEffect(load, [fieldId]);

  const indices = agro?.indices || {};
  const ndvi = typeof indices.NDVI === 'object' ? indices.NDVI?.mean : indices.NDVI;
  const ndre = typeof indices.NDRE === 'object' ? indices.NDRE?.mean : indices.NDRE;
  const ndmi = typeof indices.NDMI === 'object' ? indices.NDMI?.mean : indices.NDMI;
  const evi  = typeof indices.EVI  === 'object' ? indices.EVI?.mean  : indices.EVI;
  const recList = recs?.recommendations || [];
  const cached = agro?._meta?.cached;

  return (
    <AccountLayout
      Business={Business}
      BusinessID={BusinessID}
      PeopleID={typeof window !== 'undefined' ? localStorage.getItem('people_id') : null}
      pageTitle={t('precision_ag_agronomy.page_title')}
      breadcrumbs={[
        { label: t('precision_ag_agronomy.breadcrumb_dashboard'), to: '/dashboard' },
        { label: t('precision_ag_agronomy.breadcrumb_precision_ag') },
        { label: t('precision_ag_agronomy.page_title') },
      ]}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('precision_ag_agronomy.heading')}</h1>
            <p className="font-mont text-sm text-gray-500">
              {t('precision_ag_agronomy.subheading')}
              {field?.name && <> {t('precision_ag_agronomy.subheading_for')} <span className="font-semibold">{field.name}</span></>}.
              {cached && <> · <span className="text-emerald-700">{t('precision_ag_agronomy.cached')}</span></>}
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading || !fieldId}
            className="px-4 py-2 rounded-lg bg-[#3D6B34] text-white text-sm font-mont font-semibold hover:bg-[#2F5328] disabled:opacity-50"
          >
            {loading ? t('precision_ag_agronomy.btn_refreshing') : t('precision_ag_agronomy.btn_refresh')}
          </button>
        </div>

        {!fieldId && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-sm">
            {t('precision_ag_agronomy.no_field_selected')}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">{error}</div>
        )}

        {!loading && fieldId && (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <StatTile
                label={t('precision_ag_agronomy.tile_gdd')}
                value={agro?.gdd?.gdd != null ? Math.round(agro.gdd.gdd) : null}
                sub={agro?.gdd?.start_date ? t('precision_ag_agronomy.tile_gdd_since', { date: agro.gdd.start_date }) : null}
              />
              <StatTile
                label={t('precision_ag_agronomy.tile_growth_stage')}
                value={agro?.growth_stage || null}
              />
              <StatTile
                label={t('precision_ag_agronomy.tile_temperature')}
                value={agro?.weather?.temperature_c != null ? `${agro.weather.temperature_c}°C` : null}
                sub={agro?.weather?.humidity != null ? t('precision_ag_agronomy.tile_humidity', { rh: agro.weather.humidity }) : null}
              />
              <StatTile
                label={t('precision_ag_agronomy.tile_health_score')}
                value={recs?.health_score != null ? recs.health_score : null}
              />
            </div>

            {agro && !agro?.gdd?.gdd && !agro?.growth_stage && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 text-sm font-mont mb-6">
                <span>📅</span>
                <span className="text-amber-800">{t('precision_ag_agronomy.warn_planting_date')} <a href={`/precision-ag/fields?BusinessID=${BusinessID}&FieldID=${fieldId}`} className="font-semibold underline">{t('precision_ag_agronomy.warn_planting_date_link')}</a></span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="font-lora text-lg font-bold text-gray-900 mb-3">{t('precision_ag_agronomy.veg_indices_heading')}</h2>
                <div className="space-y-3">
                  <IndexBar label="NDVI" value={ndvi} color="#3D6B34" />
                  <IndexBar label="NDRE" value={ndre} color="#15803D" lo={0} hi={0.6} />
                  <IndexBar label="NDMI" value={ndmi} color="#0EA5E9" lo={-0.2} hi={0.6} />
                  <IndexBar label="EVI"  value={evi}  color="#84CC16" lo={0} hi={1} />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="font-lora text-lg font-bold text-gray-900 mb-3">{t('precision_ag_agronomy.signals_heading')}</h2>
                <ul className="space-y-2 text-sm">
                  {agro?.irrigation?.recommendation && (
                    <li><span className="font-semibold text-sky-700">💧 {t('precision_ag_agronomy.signal_irrigation')}:</span> {agro.irrigation.recommendation}</li>
                  )}
                  {agro?.disease_risk?.level && (
                    <li><span className="font-semibold text-rose-700">🦠 {t('precision_ag_agronomy.signal_disease_risk')}:</span> {agro.disease_risk.level}</li>
                  )}
                  {!agro?.irrigation && !agro?.disease_risk && (
                    <li className="text-gray-500 italic">{t('precision_ag_agronomy.signals_empty')}</li>
                  )}
                </ul>
              </div>
            </div>

            {agro?.spray_by_product && Object.keys(agro.spray_by_product).some(k => k !== 'general') && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <h2 className="font-lora text-lg font-bold text-gray-900 mb-3">{t('precision_ag_agronomy.spray_heading')}</h2>
                <div className="grid grid-cols-3 gap-3">
                  {['herbicide', 'fungicide', 'insecticide'].map(k => {
                    const v = agro.spray_by_product[k] || {};
                    const dec = v.decision || '—';
                    const color = dec === 'GO' ? '#15803D' : dec === 'MARGINAL' ? '#B45309' : '#B91C1C';
                    const bg    = dec === 'GO' ? '#F0FDF4' : dec === 'MARGINAL' ? '#FFFBEB' : '#FEF2F2';
                    const fails = (v.reasons || []).map(r => `${r.field} ${r.op} ${r.threshold}`).join(', ');
                    const warns = (v.warnings || []).map(r => `${r.field} ${r.op} ${r.threshold}`).join(', ');
                    return (
                      <div key={k} className="rounded-lg border p-3" style={{ borderColor: color, background: bg }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mont text-xs uppercase tracking-wide text-gray-600">{v.label || k}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>{dec}</span>
                        </div>
                        {fails && <div className="text-xs text-gray-700 mt-1"><strong>{t('precision_ag_agronomy.spray_fails')}:</strong> {fails}</div>}
                        {!fails && warns && <div className="text-xs text-gray-600 mt-1"><strong>{t('precision_ag_agronomy.spray_watch')}:</strong> {warns}</div>}
                        {!fails && !warns && <div className="text-xs text-gray-500 mt-1">{t('precision_ag_agronomy.spray_ok')}</div>}
                      </div>
                    );
                  })}
                </div>
                {agro.spray_by_product.herbicide?.notes && (
                  <p className="text-xs text-gray-500 mt-3 italic">
                    {agro.spray_by_product.herbicide.notes}
                  </p>
                )}
              </div>
            )}

            {Array.isArray(agro?.pest_disease_alerts) && agro.pest_disease_alerts.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <h2 className="font-lora text-lg font-bold text-gray-900 mb-3">{t('precision_ag_agronomy.pest_heading')}</h2>
                <ul className="space-y-2.5">
                  {agro.pest_disease_alerts.map((a, i) => {
                    const sev = (a.severity || 'MEDIUM').toUpperCase();
                    const sevColor = sev === 'HIGH' ? '#B91C1C' : sev === 'MEDIUM' ? '#B45309' : '#65A30D';
                    const sevBg    = sev === 'HIGH' ? '#FEF2F2' : sev === 'MEDIUM' ? '#FFFBEB' : '#F7FEE7';
                    return (
                      <li key={i} className="rounded-lg border border-gray-200 p-3" style={{ background: sevBg }}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="font-mont text-sm font-bold text-gray-900">
                            {a.type === 'pest' ? '🐛' : '🦠'} {a.name}
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full text-white"
                            style={{ background: sevColor }}>
                            {sev}
                          </span>
                        </div>
                        <div className="font-mont text-sm text-gray-700">{a.action}</div>
                        {a.why && <div className="font-mont text-xs text-gray-500 mt-1">{t('precision_ag_agronomy.pest_why')}: {a.why}</div>}
                        {a.source && <div className="font-mont text-[10px] text-gray-400 mt-1">{t('precision_ag_agronomy.pest_source')}: {a.source}</div>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-lora text-lg font-bold text-gray-900">{t('precision_ag_agronomy.ndvi_heading')}</h2>
                {ndviSeries?.summary?.last_date && (
                  <span className="text-xs text-gray-500">
                    {t('precision_ag_agronomy.ndvi_last_sample', { date: String(ndviSeries.summary.last_date).slice(0, 10) })}
                  </span>
                )}
              </div>
              <NDVITrendChart series={ndviSeries?.series} summary={ndviSeries?.summary} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-lora text-lg font-bold text-gray-900 mb-3">{t('precision_ag_agronomy.recs_heading')}</h2>
              {recList.length ? (
                <ul className="space-y-2">
                  {recList.map((r, i) => {
                    const txt = typeof r === 'string' ? r : (r?.action || r?.text || r?.title || JSON.stringify(r));
                    return (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-800 leading-relaxed">
                        <span className="text-[#3D6B34] mt-0.5">•</span>
                        <span>{txt}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-sm text-gray-500 italic">{t('precision_ag_agronomy.recs_empty')}</div>
              )}
            </div>
          </>
        )}
      </div>
      <SaigeWidget businessId={BusinessID} fieldId={fieldId} pageContext="Precision Ag — Agronomy" />
    </AccountLayout>
  );
}
