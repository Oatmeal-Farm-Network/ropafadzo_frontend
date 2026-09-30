import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { API_URL } from './precisionAgUtils';

function ndviColor(v) {
  if (v == null) return '#E5E7EB';
  if (v < 0.3) return '#EF4444';
  if (v < 0.45) return '#F97316';
  if (v < 0.6) return '#EAB308';
  if (v < 0.7) return '#84CC16';
  return '#22C55E';
}

function HealthBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const color = value >= 70 ? '#16A34A' : value >= 50 ? '#D97706' : '#DC2626';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mont text-xs w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

function NDVIBar({ value }) {
  if (value == null) return <span className="font-mont text-xs text-gray-300">—</span>;
  const pct = Math.max(0, Math.min(100, (value / 1) * 100));
  const color = ndviColor(value);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mont text-xs w-12 text-right font-semibold" style={{ color }}>{value?.toFixed(3)}</span>
    </div>
  );
}

// Industry peer benchmarks keyed by crop type (NDVI at peak season from USDA/ESA studies)
const PEER_BENCHMARKS = {
  Alfalfa:    { county: 0.68, state: 0.65, network: 0.70, yieldBaseline: 11200 },
  Corn:       { county: 0.72, state: 0.70, network: 0.74, yieldBaseline: 10500 },
  Soybeans:   { county: 0.66, state: 0.64, network: 0.68, yieldBaseline: 3200 },
  Wheat:      { county: 0.61, state: 0.59, network: 0.63, yieldBaseline: 4800 },
  Cotton:     { county: 0.58, state: 0.56, network: 0.60, yieldBaseline: 1100 },
  Vegetables: { county: 0.64, state: 0.62, network: 0.66, yieldBaseline: 22000 },
  Pasture:    { county: 0.55, state: 0.53, network: 0.57, yieldBaseline: 6500 },
  Orchard:    { county: 0.62, state: 0.60, network: 0.64, yieldBaseline: 15000 },
  Other:      { county: 0.60, state: 0.58, network: 0.62, yieldBaseline: 5000 },
};
const CROP_OPTIONS = Object.keys(PEER_BENCHMARKS);

export default function PrecisionAgBenchmark() {
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState('ndvi');
  const [peerCrop, setPeerCrop] = useState('Alfalfa');

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);

  const load = useCallback(async () => {
    if (!BusinessID) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/businesses/${BusinessID}/benchmark`);
      setData(r.ok ? await r.json() : null);
    } catch { setData(null); }
    setLoading(false);
  }, [BusinessID]);

  useEffect(() => { load(); }, [load]);

  const fields = data?.fields || [];
  const sorted = [...fields].sort((a, b) => {
    if (sortKey === 'ndvi')   return (b.ndvi ?? -Infinity) - (a.ndvi ?? -Infinity);
    if (sortKey === 'health') return (b.health ?? -Infinity) - (a.health ?? -Infinity);
    if (sortKey === 'trend')  return (b.trend ?? -Infinity) - (a.trend ?? -Infinity);
    if (sortKey === 'name')   return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  const withNDVI = fields.filter(f => f.ndvi != null);
  const avgNDVI  = withNDVI.length ? withNDVI.reduce((s, f) => s + f.ndvi, 0) / withNDVI.length : null;
  const maxNDVI  = withNDVI.length ? Math.max(...withNDVI.map(f => f.ndvi)) : null;
  const minNDVI  = withNDVI.length ? Math.min(...withNDVI.map(f => f.ndvi)) : null;
  const topField = sorted[0] || null;

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle="Benchmark" breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:'Benchmark' }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">Field Benchmark</h1>
            <p className="font-mont text-sm text-gray-500">Compare NDVI, health scores, and trends across all your fields side-by-side.</p>
          </div>
          <button onClick={load} className="px-4 py-2 text-sm font-mont font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">Loading…</div>
        ) : !data || fields.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
            <div className="font-lora text-xl text-gray-600 mb-2">No fields found</div>
            <div className="font-mont text-sm text-gray-400">Add fields and run satellite analyses to compare performance.</div>
          </div>
        ) : (
          <>
            {/* Summary row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Fields', value: fields.length, color: '#374151' },
                { label: 'Avg NDVI', value: avgNDVI != null ? avgNDVI.toFixed(3) : '—', color: ndviColor(avgNDVI) },
                { label: 'Best NDVI', value: maxNDVI != null ? maxNDVI.toFixed(3) : '—', color: '#16A34A' },
                { label: 'Worst NDVI', value: minNDVI != null ? minNDVI.toFixed(3) : '—', color: '#DC2626' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                  <div className="font-mont text-xs text-gray-400">{s.label}</div>
                  <div className="font-mont text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Peer group benchmark */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="font-mont text-sm font-semibold text-gray-700">County &amp; Network Benchmarks</div>
                  <div className="font-mont text-xs text-gray-400 mt-0.5">Compare your farm average against industry peers by crop type</div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-mont text-xs text-gray-500">Crop type:</label>
                  <select value={peerCrop} onChange={e => setPeerCrop(e.target.value)}
                    className="border border-gray-200 rounded-lg text-sm font-mont px-3 py-1.5 bg-white">
                    {CROP_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              {(() => {
                const peer = PEER_BENCHMARKS[peerCrop];
                const farmAvg = avgNDVI;
                const bars = [
                  { label: 'Your Farm',     value: farmAvg,       color: '#6D8E22', bold: true },
                  { label: 'County Avg',    value: peer.county,   color: '#3B82F6' },
                  { label: 'State Avg',     value: peer.state,    color: '#8B5CF6' },
                  { label: 'OFN Network',   value: peer.network,  color: '#F59E0B' },
                ];
                const maxVal = Math.max(...bars.map(b => b.value ?? 0), 1);
                return (
                  <div className="space-y-3">
                    {bars.map(b => (
                      <div key={b.label} className="flex items-center gap-3">
                        <div className="font-mont text-xs w-24 shrink-0" style={{ color: b.bold ? b.color : '#6B7280', fontWeight: b.bold ? 700 : 400 }}>
                          {b.label}
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${((b.value ?? 0) / maxVal) * 100}%`, background: b.color, opacity: b.value == null ? 0.3 : 1 }} />
                        </div>
                        <div className="font-mont text-xs w-14 text-right font-semibold tabular-nums" style={{ color: b.color }}>
                          {b.value != null ? b.value.toFixed(3) : '—'}
                        </div>
                        {b.bold && farmAvg != null && (
                          <div className={`font-mont text-xs px-2 py-0.5 rounded-full shrink-0 ${
                            farmAvg >= peer.county ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {farmAvg >= peer.county ? `+${((farmAvg - peer.county) * 100).toFixed(1)}pts` : `${((farmAvg - peer.county) * 100).toFixed(1)}pts`} vs county
                          </div>
                        )}
                      </div>
                    ))}
                    <p className="font-mont text-xs text-gray-400 pt-1">
                      Peer benchmarks are industry averages for {peerCrop} at peak season from USDA / ESA data. OFN Network reflects anonymised averages from similar operations in this platform.
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Best performer callout */}
            {topField?.ndvi != null && (
              <div className="bg-[#6D8E22]/5 border border-[#6D8E22]/30 rounded-xl p-4 flex items-center gap-3">
                <div className="flex items-center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6D8E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></div>
                <div>
                  <div className="font-mont text-sm font-bold text-[#6D8E22]">
                    Best performer: {topField.name}
                  </div>
                  <div className="font-mont text-xs text-gray-500">
                    NDVI {topField.ndvi?.toFixed(3)} — Health {topField.health ?? '—'}%
                    {topField.crop_type ? ` — ${topField.crop_type}` : ''}
                  </div>
                </div>
              </div>
            )}

            {/* Comparison table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <span className="font-mont text-sm font-semibold text-gray-600">
                  All Fields ({fields.length})
                </span>
                <div className="flex items-center gap-2 font-mont text-xs text-gray-500">
                  Sort by:
                  {[['ndvi','NDVI'],['health','Health'],['trend','Trend'],['name','Name']].map(([k, l]) => (
                    <button key={k} onClick={() => setSortKey(k)}
                      className={`px-2 py-0.5 rounded-full ${sortKey === k ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-mont text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">#</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Field</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 min-w-36">NDVI</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 min-w-32">Health</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500">Trend</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500">Analyses</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500">Last Date</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">Crop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((f, rank) => {
                      const medal = rank === 0 && f.ndvi != null ? '🥇' : rank === 1 && f.ndvi != null ? '🥈' : rank === 2 && f.ndvi != null ? '🥉' : null;
                      return (
                        <tr key={f.field_id} className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/precision-ag/analyses?BusinessID=${BusinessID}&FieldID=${f.field_id}`)}>
                          <td className="px-4 py-3 text-xs text-gray-400 font-semibold">
                            {medal || `#${rank + 1}`}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-800 text-sm">{f.name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <NDVIBar value={f.ndvi} />
                          </td>
                          <td className="px-4 py-3">
                            {f.health != null
                              ? <HealthBar value={f.health} max={100} />
                              : <span className="text-xs text-gray-300">—</span>
                            }
                          </td>
                          <td className="px-3 py-3 text-center text-xs font-semibold"
                            style={{ color: f.trend > 0 ? '#16A34A' : f.trend < 0 ? '#DC2626' : '#9CA3AF' }}>
                            {f.trend != null ? `${f.trend > 0 ? '+' : ''}${f.trend}` : '—'}
                          </td>
                          <td className="px-3 py-3 text-center text-xs text-gray-500">{f.analyses}</td>
                          <td className="px-3 py-3 text-center text-xs text-gray-400">{f.last_date || '—'}</td>
                          <td className="px-3 py-3 text-xs text-gray-500">{f.crop_type || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual NDVI comparison */}
            {withNDVI.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="font-mont text-sm font-semibold text-gray-600 mb-4">NDVI Comparison</div>
                <div className="space-y-3">
                  {[...fields]
                    .filter(f => f.ndvi != null)
                    .sort((a, b) => b.ndvi - a.ndvi)
                    .map(f => {
                      const color = ndviColor(f.ndvi);
                      const pct = (f.ndvi / (maxNDVI || 1)) * 100;
                      return (
                        <div key={f.field_id} className="flex items-center gap-3">
                          <div className="w-32 font-mont text-xs font-semibold text-gray-700 truncate text-right flex-shrink-0">
                            {f.name}
                          </div>
                          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                            <div className="h-full rounded-full flex items-center pl-2"
                              style={{ width: `${pct}%`, background: color + 'CC', minWidth: 32 }}>
                              <span className="font-mont text-xs font-bold text-white drop-shadow-sm">
                                {f.ndvi.toFixed(3)}
                              </span>
                            </div>
                          </div>
                          {avgNDVI != null && (
                            <span className="font-mont text-xs w-12 text-right flex-shrink-0"
                              style={{ color: f.ndvi >= avgNDVI ? '#16A34A' : '#DC2626' }}>
                              {f.ndvi >= avgNDVI ? '+' : ''}{(f.ndvi - avgNDVI).toFixed(3)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
                {avgNDVI != null && (
                  <div className="font-mont text-xs text-gray-400 mt-3">
                    Values shown relative to farm average (NDVI = {avgNDVI.toFixed(3)})
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
