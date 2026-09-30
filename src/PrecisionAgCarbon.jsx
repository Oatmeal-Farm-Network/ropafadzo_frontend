import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, API_URL } from './precisionAgUtils';
import { useTranslation } from 'react-i18next';

function ScoreGauge({ score, t }) {
  const color = score >= 75 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626';
  const label = score >= 75 ? t('precision_ag.gauge_good') : score >= 50 ? t('precision_ag.gauge_fair') : t('precision_ag.gauge_needs_improvement');
  const deg = (score / 100) * 180;
  const rad = (deg - 90) * (Math.PI / 180);
  const needleX = 50 + 35 * Math.cos(rad);
  const needleY = 50 + 35 * Math.sin(rad);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 60" className="w-48">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#FEE2E2" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#FEF3C7" strokeWidth="8" strokeLinecap="round"
          strokeDasharray="62.8" strokeDashoffset="31.4" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#D1FAE5" strokeWidth="8" strokeLinecap="round"
          strokeDasharray="62.8" strokeDashoffset="62.8" />
        <path d={`M 10 50 A 40 40 0 0 1 ${needleX} ${needleY}`}
          fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="50" r="4" fill={color} />
        <text x="50" y="42" textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>{score}</text>
        <text x="50" y="57" textAnchor="middle" fontSize="7" fill="#9CA3AF">{label}</text>
      </svg>
    </div>
  );
}

function OMChart({ history }) {
  if (!history || history.length < 2) return null;
  const W = 520, H = 120, PAD = { l: 40, r: 20, t: 12, b: 28 };
  const vals = history.map(h => h.om_pct).filter(Boolean);
  const minV = Math.max(0, Math.min(...vals) - 0.5);
  const maxV = Math.max(...vals) + 0.5;
  const cx = i => PAD.l + (i / Math.max(history.length - 1, 1)) * (W - PAD.l - PAD.r);
  const cy = v => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);
  const path = history.map((d, i) => d.om_pct ? `${i === 0 ? 'M' : 'L'}${cx(i)},${cy(d.om_pct)}` : '').join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[minV, (minV + maxV) / 2, maxV].map(v => (
        <g key={v}>
          <line x1={PAD.l} y1={cy(v)} x2={W - PAD.r} y2={cy(v)} stroke="#f0f0f0" strokeWidth="1" />
          <text x={PAD.l - 4} y={cy(v) + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">{v.toFixed(1)}%</text>
        </g>
      ))}
      <path d={`${path} L${cx(history.length - 1)},${H - PAD.b} L${cx(0)},${H - PAD.b} Z`}
        fill="#16A34A" fillOpacity="0.1" />
      <path d={path} fill="none" stroke="#16A34A" strokeWidth="2" />
      {history.map((d, i) => d.om_pct ? (
        <circle key={i} cx={cx(i)} cy={cy(d.om_pct)} r="3.5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
      ) : null)}
      {history.map((d, i) => (
        <text key={i} x={cx(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="#9CA3AF">
          {d.date ? d.date.slice(0, 7) : d.label?.slice(0, 6)}
        </text>
      ))}
    </svg>
  );
}

const ROTATION_COLORS = ['#6D8E22','#2563EB','#7C3AED','#D97706','#0891B2','#059669','#DC2626'];

export default function PrecisionAgCarbon() {
  const { t } = useTranslation();
  const pa = k => t(`precision_ag.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [practices, setPractices] = useState({
    noTill:         false,
    coverCrop:      false,
    compost:        false,
    reducedTillage: false,
  });
  const togglePractice = k => setPractices(p => ({ ...p, [k]: !p[k] }));

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  const load = useCallback(async () => {
    if (!selectedFieldId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/carbon`);
      setData(r.ok ? await r.json() : null);
    } catch { setData(null); }
    setLoading(false);
  }, [selectedFieldId]);

  useEffect(() => { load(); }, [load]);

  const selectedField = fields.find(f => String(f.fieldid || f.id) === selectedFieldId);
  const uniqueCrops = data ? [...new Set((data.rotation_history || []).map(r => r.crop).filter(Boolean))] : [];

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={pa('carbon_title')} breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:pa('carbon_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{pa('carbon_title')}</h1>
          <p className="font-mont text-sm text-gray-500">{pa('carbon_desc')}</p>
        </div>

        {/* Field selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="text-xs font-semibold font-mont text-gray-500 block mb-1">{pa('f_field')}</label>
          <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
            {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{pa('loading')}</div>
        ) : !data ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
            <div className="font-lora text-xl text-gray-600">{pa('no_data_available')}</div>
          </div>
        ) : (
          <>
            {/* Score + key metrics */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-wrap gap-8 items-center">
                <div>
                  <div className="font-mont text-sm font-semibold text-gray-600 mb-2 text-center">{pa('sustainability_score')}</div>
                  <ScoreGauge score={data.sustainability_score} t={t} />
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: pa('lbl_soc_stock'),          value: data.latest_soc_MgCha != null ? `${data.latest_soc_MgCha} Mg C/ha` : '—', color: '#16A34A' },
                    { label: pa('lbl_om_trend'),           value: data.om_trend_pct != null ? `${data.om_trend_pct > 0 ? '+' : ''}${data.om_trend_pct}%` : '—',
                                                            color: data.om_trend_pct > 0 ? '#16A34A' : data.om_trend_pct < 0 ? '#DC2626' : '#9CA3AF' },
                    { label: pa('lbl_cover_crop_seasons'), value: data.cover_crop_seasons, color: '#6D8E22' },
                    { label: pa('lbl_crop_diversity'),     value: uniqueCrops.length > 0 ? `${uniqueCrops.length} ${pa('crops_label')}` : '—', color: '#2563EB' },
                    { label: pa('lbl_rotation_records'),   value: data.rotation_history?.length || 0, color: '#7C3AED' },
                    { label: pa('lbl_soil_samples'),       value: data.om_history?.length || 0, color: '#D97706' },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
                      <div className="font-mont text-xs text-gray-400">{s.label}</div>
                      <div className="font-mont text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OM history chart */}
            {data.om_history?.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="font-mont text-sm font-semibold text-gray-600 mb-3">{pa('om_trend_title')}</div>
                {data.om_history.length >= 2
                  ? <OMChart history={data.om_history} />
                  : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {data.om_history.map((s, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg border border-gray-100 p-3">
                          <div className="font-mont text-xs text-gray-400">{s.label || s.date}</div>
                          <div className="font-mont text-xl font-bold text-[#16A34A]">{s.om_pct?.toFixed(1)}%</div>
                          <div className="font-mont text-xs text-gray-400">SOC: {s.soc_stock_MgCha} Mg C/ha</div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 text-center">
                <div className="font-mont text-sm text-gray-400">{pa('no_soil_samples')}</div>
                <div className="font-mont text-xs text-gray-400 mt-1">{pa('add_soil_samples')}</div>
              </div>
            )}

            {/* Crop rotation timeline */}
            {data.rotation_history?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="font-mont text-sm font-semibold text-gray-600 mb-3">{pa('crop_rotation_title')}</div>
                <div className="space-y-2">
                  {data.rotation_history.map((rot, i) => {
                    const color = ROTATION_COLORS[uniqueCrops.indexOf(rot.crop) % ROTATION_COLORS.length] || '#9CA3AF';
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-16 font-mont text-xs font-bold text-gray-500 text-right flex-shrink-0">
                          {rot.season_year}
                        </div>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          <span className="font-mont text-sm font-semibold" style={{ color }}>
                            {rot.crop}{rot.variety ? ` (${rot.variety})` : ''}
                          </span>
                          {rot.is_cover_crop && (
                            <span className="font-mont text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{pa('cover_badge')}</span>
                          )}
                          {rot.yield_amount && (
                            <span className="font-mont text-xs text-gray-400">
                              {pa('lbl_yield')} {rot.yield_amount} {rot.yield_unit}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {uniqueCrops.map((c, i) => (
                    <span key={c} className="font-mont text-xs px-2 py-0.5 rounded-full text-white"
                      style={{ background: ROTATION_COLORS[i % ROTATION_COLORS.length] }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.rotation_history?.length === 0 && (
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 text-center">
                <div className="font-mont text-sm text-gray-400">{pa('no_rotation_records')}</div>
                <div className="font-mont text-xs text-gray-400 mt-1">{pa('add_rotation_records')}</div>
              </div>
            )}

            {/* Carbon credit estimator */}
            {selectedField?.field_size_hectares && data.latest_soc_MgCha != null && (() => {
              const fieldHa = selectedField.field_size_hectares;
              const baseRate = data.om_trend_pct > 0 ? 0.30 : data.om_trend_pct < 0 ? 0.05 : 0.15;
              const practiceBonus = (practices.noTill         ? 0.12 : 0)
                                  + (practices.coverCrop      ? 0.10 : 0)
                                  + (practices.compost        ? 0.06 : 0)
                                  + (practices.reducedTillage ? 0.05 : 0);
              const seqRate = Math.min(baseRate + practiceBonus, 1.0);
              const annualCO2e = seqRate * fieldHa * 3.67;
              const lo = (annualCO2e * 15).toFixed(0);
              const hi = (annualCO2e * 50).toFixed(0);
              const PRACTICE_OPTIONS = [
                { key: 'noTill',         label: 'No-till',         bonus: '+0.12 tC/ha/yr' },
                { key: 'coverCrop',      label: 'Cover crops',     bonus: '+0.10 tC/ha/yr' },
                { key: 'compost',        label: 'Compost applied', bonus: '+0.06 tC/ha/yr' },
                { key: 'reducedTillage', label: 'Reduced tillage', bonus: '+0.05 tC/ha/yr' },
              ];
              return (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="font-mont text-sm font-semibold text-gray-600 mb-3">{pa('carbon_estimator_title')}</div>
                  {/* Practice toggles */}
                  <div className="mb-4">
                    <div className="font-mont text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Practice Adjustments</div>
                    <div className="flex flex-wrap gap-2">
                      {PRACTICE_OPTIONS.map(({ key, label, bonus }) => (
                        <button key={key}
                          onClick={() => togglePractice(key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mont font-semibold border transition-all ${practices[key] ? 'bg-[#16A34A] border-[#16A34A] text-white' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>
                          <span>{practices[key] ? '✓' : '+'}</span>
                          {label}
                          <span className={`font-normal ${practices[key] ? 'text-green-100' : 'text-gray-400'}`}>{bonus}</span>
                        </button>
                      ))}
                    </div>
                    {practiceBonus > 0 && (
                      <div className="mt-2 text-xs font-mont text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 inline-block">
                        Practice boost: +{practiceBonus.toFixed(2)} tC/ha/yr → total rate {seqRate.toFixed(2)} tC/ha/yr
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
                      <div className="font-mont text-xs text-gray-400">{pa('lbl_field_area')}</div>
                      <div className="font-mont text-xl font-bold text-gray-800">{fieldHa.toFixed(1)} ha</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
                      <div className="font-mont text-xs text-gray-400">{pa('lbl_seq_rate')}</div>
                      <div className="font-mont text-xl font-bold text-gray-800">{seqRate.toFixed(2)} tC/ha/yr</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
                      <div className="font-mont text-xs text-gray-400">{pa('lbl_annual_co2e')}</div>
                      <div className="font-mont text-xl font-bold text-[#16A34A]">{annualCO2e.toFixed(1)} t</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 px-3 py-2.5">
                      <div className="font-mont text-xs text-gray-400">{pa('lbl_estimated_value')}</div>
                      <div className="font-mont text-xl font-bold text-[#16A34A]">${lo}–${hi}/yr</div>
                    </div>
                  </div>
                  <p className="font-mont text-xs text-gray-400">
                    Base rate from OM trend ({data.om_trend_pct > 0 ? 'improving' : data.om_trend_pct < 0 ? 'declining' : 'stable'}).
                    Practice bonuses based on IPCC Tier 1 factors. Market range $15–$50/tCO₂e.
                    For verified credits, consult a certified carbon registry program.
                  </p>
                </div>
              );
            })()}

            {/* Carbon methodology note */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="font-mont text-xs text-gray-400">
                SOC (Soil Organic Carbon) estimated as OM% × 0.58 × bulk density (1.3 t/m³) × sample depth.
                Sustainability score reflects cover crop adoption, OM trend, and crop diversity.
                For formal carbon credit verification, use certified lab analysis and accredited methodology.
              </p>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
}
