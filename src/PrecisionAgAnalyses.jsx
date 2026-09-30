import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import BiomassPanel from './BiomassPanel';
import MaturityPanel from './MaturityPanel';
import ClimateForecastPanel from './ClimateForecastPanel';
import { useRaster, API_URL, CROP_API_URL } from './precisionAgUtils';
import SaigeWidget from './SaigeWidget';

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}


// ─── Color scales ─────────────────────────────────────────────────────────────
function ndviColor(t) {
  // t in [0,1]: red → amber → lime → dark green
  if (t < 0.15) return 'rgb(160,30,30)';
  if (t < 0.30) return 'rgb(200,100,30)';
  if (t < 0.45) return 'rgb(220,180,40)';
  if (t < 0.60) return 'rgb(170,210,50)';
  if (t < 0.75) return 'rgb(90,165,40)';
  return 'rgb(30,100,20)';
}

// ─── LineChart ────────────────────────────────────────────────────────────────
function LineChart({ series, xLabels, height = 200, yMin, yMax, stretch = false }) {
  const PL = 44, PR = 14, PT = 14, PB = 38;
  const W = 560, H = height;
  const cW = W - PL - PR, cH = H - PT - PB;
  const allV = series.flatMap(s => s.values.filter(v => v != null));
  if (!allV.length) return null;
  const lo = yMin ?? Math.min(...allV);
  const hi = yMax ?? Math.max(...allV);
  const span = hi - lo || 1;
  const n = Math.max(...series.map(s => s.values.length));
  const px = i => PL + (n > 1 ? (i / (n - 1)) * cW : cW / 2);
  const py = v => PT + cH - ((v - lo) / span) * cH;
  const ticks = [lo, lo + span * 0.25, lo + span * 0.5, lo + span * 0.75, hi];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
      className="w-full block"
      style={stretch ? { height: '100%', width: '100%' } : { height }}
    >
      {ticks.map((v, i) => (
        <g key={i}>
          <line x1={PL} y1={py(v)} x2={W - PR} y2={py(v)} stroke="#E5E7EB" strokeWidth="1" />
          <text x={PL - 5} y={py(v) + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{v.toFixed(2)}</text>
        </g>
      ))}
      {xLabels?.map((lbl, i) => (
        <text key={i} x={px(i)} y={H - PB + 18} textAnchor="middle" fontSize="9" fill="#9CA3AF">{lbl}</text>
      ))}
      {series.map((s, si) => {
        const pts = s.values.map((v, i) => v != null ? [px(i), py(v)] : null).filter(Boolean);
        if (!pts.length) return null;
        const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill="white" stroke={s.color} strokeWidth="2" />)}
          </g>
        );
      })}
      {series.map((s, i) => (
        <g key={i} transform={`translate(${PL + i * 95}, ${H - 5})`}>
          <line x1="0" y1="0" x2="14" y2="0" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" />
          <text x="18" y="4" fontSize="9" fill="#6B7280">{s.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── BarChart ─────────────────────────────────────────────────────────────────
function BarChart({ values, labels, colors, height = 160, showValues = true }) {
  const PL = 12, PR = 12, PT = 18, PB = 38;
  const W = 560, H = height;
  const cW = W - PL - PR, cH = H - PT - PB;
  const maxV = Math.max(...values, 0.001);
  const n = values.length;
  const slot = cW / n;
  const barW = Math.max(8, slot * 0.6);
  const defaultColor = '#6D8E22';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <line x1={PL} y1={PT + cH} x2={W - PR} y2={PT + cH} stroke="#E5E7EB" strokeWidth="1" />
      {values.map((v, i) => {
        const bH = (v / maxV) * cH;
        const x = PL + i * slot + slot / 2 - barW / 2;
        const y = PT + cH - bH;
        const col = Array.isArray(colors) ? (colors[i] || defaultColor) : (colors || defaultColor);
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bH} fill={col} rx="3" />
            {labels?.[i] && (
              <text x={x + barW / 2} y={PT + cH + 14} textAnchor="middle" fontSize="9" fill="#9CA3AF">{labels[i]}</text>
            )}
            {showValues && v > 0 && (
              <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="9" fill="#6B7280">{v % 1 === 0 ? v : v.toFixed(1)}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── ScatterPlot ──────────────────────────────────────────────────────────────
function ScatterPlot({ points, xLabel, yLabel, height = 220 }) {
  const PL = 48, PR = 14, PT = 14, PB = 40;
  const W = 560, H = height;
  const cW = W - PL - PR, cH = H - PT - PB;
  if (!points.length) return null;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rX = maxX - minX || 1, rY = maxY - minY || 1;
  const cx = x => PL + ((x - minX) / rX) * cW;
  const cy = y => PT + cH - ((y - minY) / rY) * cH;
  // Linear regression
  const n = points.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  const num = points.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const den = points.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  const slope = den ? num / den : 0;
  const intercept = my - slope * mx;
  const rLine = [[minX, slope * minX + intercept], [maxX, slope * maxX + intercept]];
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {ticks.map((f, i) => {
        const v = minY + f * rY;
        const y = cy(v);
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            <text x={PL - 5} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{v.toFixed(1)}</text>
          </g>
        );
      })}
      {ticks.map((f, i) => {
        const v = minX + f * rX;
        const x = cx(v);
        return (
          <text key={i} x={x} y={H - PB + 16} textAnchor="middle" fontSize="10" fill="#9CA3AF">{v.toFixed(2)}</text>
        );
      })}
      {n > 1 && (
        <line
          x1={cx(rLine[0][0])} y1={cy(rLine[0][1])}
          x2={cx(rLine[1][0])} y2={cy(rLine[1][1])}
          stroke="#6D8E22" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.6"
        />
      )}
      {points.map((p, i) => (
        <circle key={i} cx={cx(p.x)} cy={cy(p.y)} r="5.5" fill="#6D8E22" fillOpacity="0.7" stroke="white" strokeWidth="1.5" />
      ))}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#6B7280">{xLabel}</text>
      <text x={10} y={H / 2} textAnchor="middle" fontSize="10" fill="#6B7280" transform={`rotate(-90,10,${H / 2})`}>{yLabel}</text>
    </svg>
  );
}

// ─── VegetationZoneMap (real raster from /api/fields/{id}/raster/{index}) ─────
function VegetationZoneMap({ indexName, fieldId, description }) {
  const { data, loading, error } = useRaster(fieldId, indexName, 48);

  if (loading) {
    return (
      <div className="rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-mont text-sm animate-pulse" style={{ height: 180 }}>
        Loading {indexName} raster…
      </div>
    );
  }
  if (error || !data?.grid?.values) {
    return (
      <div className="rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-mont text-sm" style={{ height: 180 }}>
        {error ? `${indexName} raster unavailable` : `Run an analysis to generate the ${indexName} spatial map`}
      </div>
    );
  }

  const { values, rows, cols } = data.grid;
  const min  = data.raster?.min  ?? 0;
  const max  = data.raster?.max  ?? 1;
  const mean = data.raster?.mean ?? (min + max) / 2;
  const range = (max - min) || 0.01;

  // Real zone percentages from actual cell values
  const flat = values.flat().filter(v => v != null);
  const lo = mean - (mean - min) * 0.5;
  const hi = mean + (max - mean) * 0.5;
  const zLow  = flat.filter(v => v < lo).length / flat.length * 100;
  const zMed  = flat.filter(v => v >= lo && v <= hi).length / flat.length * 100;
  const zHigh = flat.filter(v => v > hi).length / flat.length * 100;

  return (
    <div>
      <div className="rounded-lg overflow-hidden border border-gray-200 mb-2"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, height: 140 }}>
        {values.flatMap((row, r) => row.map((v, c) => (
          v == null
            ? <div key={`${r}-${c}`} style={{ background: '#F3F4F6' }} />
            : <div key={`${r}-${c}`} style={{ background: ndviColor((v - min) / range) }} title={`${indexName} ${v.toFixed(3)}`} />
        )))}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-3 rounded" style={{ background: 'linear-gradient(to right, rgb(160,30,30), rgb(220,180,40), rgb(170,210,50), rgb(30,100,20))' }} />
      </div>
      <div className="flex justify-between text-xs text-gray-400 font-mont mb-2">
        <span>Low {min.toFixed(2)}</span>
        <span>Mean {mean.toFixed(3)}</span>
        <span>High {max.toFixed(2)}</span>
      </div>
      <div className="flex gap-2 text-xs font-mont">
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgb(160,30,30)', color: 'white' }}>Stressed {zLow.toFixed(0)}%</span>
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgb(170,210,50)', color: '#333' }}>Average {zMed.toFixed(0)}%</span>
        <span className="px-2 py-0.5 rounded" style={{ background: 'rgb(30,100,20)', color: 'white' }}>High {zHigh.toFixed(0)}%</span>
        <span className="ml-auto text-gray-400">{flat.length} px</span>
      </div>
      {description && <p className="text-xs text-gray-400 font-mont mt-2">{description}</p>}
    </div>
  );
}

// ─── Wind rose (Open-Meteo hourly, aggregated into 8 compass sectors) ──────
function WindRose({ fieldId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fieldId) return;
    setLoading(true);
    const ctrl = new AbortController();
    fetch(`${API_URL}/api/fields/${fieldId}/wind?days=30`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`))
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { if (e?.name !== 'AbortError') { setError(String(e)); setLoading(false); } });
    return () => ctrl.abort();
  }, [fieldId]);

  if (loading) return <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 text-center text-gray-400 font-mont text-sm animate-pulse">Loading wind data…</div>;
  if (error || !data) return <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 text-center text-gray-400 font-mont text-sm">Wind data unavailable {error ? `(${error})` : ''}</div>;
  if (data.samples === 0) return <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 text-center text-gray-400 font-mont text-sm">No wind samples in the last {data.days} days.</div>;

  const sectors = data.sectors || [];
  const matrix  = data.matrix  || [];
  const binLabels = data.bin_labels || [];
  // Bin colors — calm to strongest
  const binColors = ['#E5E7EB','#A7F3D0','#6EE7B7','#FBBF24','#F97316','#DC2626'];

  // SVG geometry
  const W = 360, H = 360, cx = W / 2, cy = H / 2;
  const rMax = 130;
  const rGrid = 30;
  const sectorAngle = 360 / 8;
  // Largest stack height (sum across bins for one sector) sets the scale
  const maxStack = Math.max(1, ...sectors.map(s => s.count || 0));

  // Compass labels
  const compass = ['N','NE','E','SE','S','SW','W','NW'];

  // Build stacked sectors as concentric arcs per bin
  const polarPath = (r1, r2, ang1, ang2) => {
    const toRad = a => (a - 90) * Math.PI / 180;
    const x1 = cx + r1 * Math.cos(toRad(ang1));
    const y1 = cy + r1 * Math.sin(toRad(ang1));
    const x2 = cx + r2 * Math.cos(toRad(ang1));
    const y2 = cy + r2 * Math.sin(toRad(ang1));
    const x3 = cx + r2 * Math.cos(toRad(ang2));
    const y3 = cy + r2 * Math.sin(toRad(ang2));
    const x4 = cx + r1 * Math.cos(toRad(ang2));
    const y4 = cy + r1 * Math.sin(toRad(ang2));
    const large = (ang2 - ang1) > 180 ? 1 : 0;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} A ${r2} ${r2} 0 ${large} 1 ${x3.toFixed(1)} ${y3.toFixed(1)} L ${x4.toFixed(1)} ${y4.toFixed(1)} A ${r1} ${r1} 0 ${large} 0 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* SVG wind rose */}
        <div className="flex justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
            {/* concentric grid rings */}
            {[0.25, 0.5, 0.75, 1.0].map((t, i) => (
              <circle key={i} cx={cx} cy={cy} r={rMax * t} fill="none" stroke="#E5E7EB" strokeDasharray="2 3" />
            ))}
            {/* spoke radials */}
            {Array.from({ length: 8 }).map((_, i) => {
              const ang = i * sectorAngle;
              const toRad = a => (a - 90) * Math.PI / 180;
              const x = cx + rMax * Math.cos(toRad(ang));
              const y = cy + rMax * Math.sin(toRad(ang));
              return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#F3F4F6" />;
            })}
            {/* compass labels */}
            {compass.map((lbl, i) => {
              const ang = i * sectorAngle;
              const toRad = a => (a - 90) * Math.PI / 180;
              const x = cx + (rMax + 18) * Math.cos(toRad(ang));
              const y = cy + (rMax + 18) * Math.sin(toRad(ang));
              return <text key={i} x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">{lbl}</text>;
            })}
            {/* sector stacks: each sector renders bins outward from center */}
            {matrix.map((bins, sectorIdx) => {
              const ang1 = sectorIdx * sectorAngle - sectorAngle / 2;
              const ang2 = ang1 + sectorAngle - 4;   // 4° padding
              let cumR = 0;
              return bins.map((count, binIdx) => {
                if (count === 0) return null;
                const r1 = (cumR / maxStack) * rMax;
                cumR += count;
                const r2 = (cumR / maxStack) * rMax;
                return (
                  <path key={`${sectorIdx}-${binIdx}`}
                    d={polarPath(Math.max(2, r1), r2, ang1, ang2)}
                    fill={binColors[binIdx] || '#9CA3AF'}
                    opacity={0.9}>
                    <title>{`${compass[sectorIdx]} · ${binLabels[binIdx]} kph · ${count} hrs`}</title>
                  </path>
                );
              });
            })}
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="#9CA3AF">{data.samples} hrs</text>
          </svg>
        </div>

        {/* Stats + legend */}
        <div className="space-y-3">
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <div className="text-xs font-mont uppercase text-amber-700 font-semibold">Predominant wind</div>
            <div className="text-2xl font-lora font-bold text-gray-900 mt-1">
              {data.predominant} <span className="text-sm font-mont text-gray-500">({data.predominant_pct}% of hours)</span>
            </div>
            <div className="text-xs text-gray-500 font-mont mt-1">
              Calm hours (&lt;5 kph): {data.calm_pct}% · {data.days}-day window
            </div>
          </div>

          {/* Speed legend */}
          <div>
            <div className="text-xs font-mont uppercase text-gray-500 font-semibold mb-1.5">Speed (kph)</div>
            <div className="flex flex-wrap gap-2 text-xs font-mont text-gray-600">
              {binLabels.map((b, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ background: binColors[i] }} />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-sector summary */}
          <div>
            <div className="text-xs font-mont uppercase text-gray-500 font-semibold mb-1.5">By sector</div>
            <table className="w-full text-xs font-mont">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left py-1">Dir</th>
                  <th className="text-right py-1">Hours</th>
                  <th className="text-right py-1">% Time</th>
                  <th className="text-right py-1">Mean kph</th>
                  <th className="text-right py-1">Max kph</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map(s => (
                  <tr key={s.label} className={s.label === data.predominant ? 'bg-amber-50' : ''}>
                    <td className="py-0.5 font-semibold text-gray-700">{s.label}</td>
                    <td className="text-right text-gray-600">{s.count}</td>
                    <td className="text-right text-gray-600">{s.frequency_pct}%</td>
                    <td className="text-right text-gray-600">{s.mean_speed}</td>
                    <td className="text-right text-gray-600">{s.max_speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs font-mont text-gray-400 italic">
            Data: Open-Meteo hourly wind at 10 m, last {data.days} days. For
            spray drift documentation, this captures predominant patterns —
            an on-farm anemometer is still useful for instantaneous compliance.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── DataRequired panel ───────────────────────────────────────────────────────
function DataRequired({ icon, title, description, integrations }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
      <div className="flex items-start gap-3">
        <div className="flex items-center text-gray-500">{icon}</div>
        <div className="flex-1">
          <div className="font-lora font-bold text-gray-700 mb-1">{title}</div>
          <p className="font-mont text-sm text-gray-500 mb-3">{description}</p>
          {integrations?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {integrations.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mont text-gray-600">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── GDD Progress ─────────────────────────────────────────────────────────────
function GddProgress({ current, target, label }) {
  const pct = Math.min(100, target ? (current / target) * 100 : 0);
  const color = pct < 33 ? '#3B82F6' : pct < 66 ? '#F59E0B' : '#6D8E22';
  return (
    <div>
      <div className="flex justify-between text-xs font-mont text-gray-500 mb-1">
        <span>{label}</span>
        <span>{Math.round(current)} / {target} GDD</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div className="h-4 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-xs font-mont text-gray-400 mt-1">{pct.toFixed(0)}% to estimated maturity</div>
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ values }) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="w-full h-8">
      <polyline fill="none" stroke="#6D8E22" strokeWidth="4" points={points} />
    </svg>
  );
}

// ─── HealthDonut ──────────────────────────────────────────────────────────────
function HealthDonut({ score }) {
  const color = score >= 70 ? '#21D727' : score >= 50 ? '#FFA500' : '#ED1A1A';
  const label = score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Poor';
  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: `conic-gradient(${color} ${score}%, #D9D9D9 0%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white' }} />
      </div>
      <div className="font-mont text-xs font-semibold text-center" style={{ color }}>{score}% · {label}</div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, bg = 'white' }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4" style={{ background: bg }}>
      <div className="text-xs font-mont font-semibold text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-lora font-bold text-gray-900">{value ?? 'N/A'}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

// ─── TabBtn ───────────────────────────────────────────────────────────────────
function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-lg font-mont text-sm font-semibold whitespace-nowrap transition-all"
      style={{ background: active ? '#819360' : '#E8EDE0', color: active ? 'white' : '#3a5a00' }}
    >
      {label}
    </button>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return <h3 className="font-lora font-bold text-gray-900 text-lg mb-3 mt-6 first:mt-0">{children}</h3>;
}

// ─── IndexBar ─────────────────────────────────────────────────────────────────
function IndexBar({ label, value, lo = 0, hi = 1, color = '#3D6B34' }) {
  if (value == null) return null;
  const pct = Math.max(0, Math.min(1, (value - lo) / (hi - lo))) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span className="font-semibold font-mont">{label}</span>
        <span className="font-mont">{typeof value === 'number' ? value.toFixed(2) : value}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── NDVITrendChart ───────────────────────────────────────────────────────────
const NDVI_TREND_COLORS = { rising: '#15803D', falling: '#B91C1C', flat: '#6B7280' };

function NDVITrendChart({ series, summary, index = 'NDVI' }) {
  if (!series || series.length < 2) {
    return <div className="text-sm text-gray-500 italic">Not enough data yet — satellite passes accumulate over 180 days.</div>;
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
  const yMinRaw = Math.min(...ys), yMaxRaw = Math.max(...ys);
  const yPad = Math.max(0.05, (yMaxRaw - yMinRaw) * 0.15);
  const yMin = Math.max(-0.2, yMinRaw - yPad);
  const yMax = Math.min(1.0, yMaxRaw + yPad);

  const xOf = t => padL + ((t - t0) / tSpan) * innerW;
  const yOf = v => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.t).toFixed(1)},${yOf(p.mean).toFixed(1)}`).join(' ');
  const trendColor = NDVI_TREND_COLORS[summary?.trend] || NDVI_TREND_COLORS.flat;
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
          <span><span className="font-semibold">Trend:</span> <span style={{ color: trendColor }}>{summary.trend}</span></span>
          <span><span className="font-semibold">Total change:</span> {summary.delta_total >= 0 ? '+' : ''}{summary.delta_total?.toFixed(3)}</span>
          <span><span className="font-semibold">Per week:</span> {summary.slope_per_week >= 0 ? '+' : ''}{summary.slope_per_week?.toFixed(4)}</span>
          <span><span className="font-semibold">Samples:</span> {summary.samples}</span>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: MAPS
// ════════════════════════════════════════════════════════════════════════════════
function MapsTab({ latest, analyses, fieldId }) {
  const getIndex = (a, name) => a?.vegetation_indices?.find(i => i.index_type === name);
  const indices = [
    { key: 'NDVI', label: 'NDVI — Normalized Difference Vegetation Index', desc: 'Measures overall greenness and plant biomass. Values 0.4–0.8 indicate healthy active vegetation.' },
    { key: 'NDRE', label: 'NDRE — Normalized Difference Red Edge', desc: 'Detects nitrogen stress in dense canopies and late-season crops. Better than NDVI for high-biomass fields.' },
    { key: 'EVI', label: 'EVI — Enhanced Vegetation Index', desc: 'Reduced soil background influence. More accurate than NDVI in high-canopy-density conditions.' },
    { key: 'GNDVI', label: 'GNDVI — Green NDVI', desc: 'Sensitive to chlorophyll concentration. Useful for distinguishing crop stress from crop density differences.' },
  ];
  if (!latest) {
    return (
      <div className="text-center py-16 rounded-xl bg-gray-50 border border-gray-100">
        <div className="mb-3 flex justify-center text-gray-400"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/><path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"/></svg></div>
        <div className="font-lora text-xl text-gray-700 mb-1">No satellite data yet</div>
        <div className="font-mont text-sm text-gray-400">Click "Run Analysis" to generate spatial variability maps</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="font-mont text-sm text-blue-700">
          <strong>Sentinel-2 Spatial Analysis</strong> — These maps visualize the statistical distribution of spectral index values across your field from the latest satellite pass ({new Date(latest.analysis_date).toLocaleDateString()}). Zones are derived from the field-wide min/mean/max pixel values returned by Sentinel Hub.
        </p>
      </div>

      {indices.map(({ key, label, desc }) => (
        <div key={key}>
          <SectionTitle>{label}</SectionTitle>
          <VegetationZoneMap
            indexName={key}
            fieldId={typeof fieldId === 'number' ? fieldId : parseInt(fieldId)}
            description={desc}
          />
        </div>
      ))}

      <div>
        <SectionTitle>MSAVI — Modified Soil Adjusted Vegetation Index</SectionTitle>
        <VegetationZoneMap
          indexName="MSAVI"
          fieldId={typeof fieldId === 'number' ? fieldId : parseInt(fieldId)}
          description="Best for early-season crops where bare soil signal interferes with vegetation readings. Real MSAVI from the Sentinel-2 evalscript (Qi et al. 1994)."
        />
      </div>

      <div>
        <SectionTitle>Variable Rate Prescription (VRT) Map</SectionTitle>
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>}
          title="VRT Prescription Layer"
          description="Combines vegetation index zones with field history and agronomic targets to generate equipment prescription files (ISO-XML / Shape). Requires integration with your variable-rate applicator or precision planter."
          integrations={['John Deere Operations Center', 'Climate FieldView', 'AgLeader SMS', 'Trimble Ag Software', 'CNH AFS Connect']}
        />
      </div>

      <div>
        <SectionTitle>Topography & Elevation Map</SectionTitle>
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20l7-14 4 8 3-5 4 11H3z"/></svg>}
          title="Elevation & Slope Data"
          description="3D contour maps showing drainage patterns, slope gradient, and water-pooling risk zones. Requires field survey data or LiDAR DEM integration."
          integrations={['USGS 3DEP LiDAR', 'Drone survey (DJI Terra)', 'John Deere Terrain Compensation', 'Custom DEM upload']}
        />
      </div>

      <div>
        <SectionTitle>Yield Map</SectionTitle>
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></svg>}
          title="Yield Monitor Data"
          description="Color-coded spatial distribution of harvest weight per acre. Requires a calibrated yield monitor connected to your combine and synced after harvest."
          integrations={['John Deere Harvest Lab', 'Precision Planting YieldSense', 'AgLeader Integra', 'Climate FieldView yield import']}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: GROWTH
// ════════════════════════════════════════════════════════════════════════════════
function GrowthTab({ analyses, agronomy }) {
  const getIndex = (a, name) => a?.vegetation_indices?.find(i => i.index_type === name);
  const sorted = [...analyses].reverse(); // oldest first
  const dates = sorted.map(a => new Date(a.analysis_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

  const vegSeries = [
    { label: 'NDVI', color: '#6D8E22', values: sorted.map(a => getIndex(a, 'NDVI')?.mean ?? null) },
    { label: 'NDRE', color: '#2196F3', values: sorted.map(a => getIndex(a, 'NDRE')?.mean ?? null) },
    { label: 'EVI',  color: '#FF9800', values: sorted.map(a => getIndex(a, 'EVI')?.mean ?? null) },
  ].filter(s => s.values.some(v => v != null));

  const healthSeries = [
    { label: 'Health Score', color: '#6D8E22', values: sorted.map(a => a.health_score) },
  ];

  // GDD targets per crop (approximate)
  const gddTargets = { corn: 2700, wheat: 2500, oats: 1800, soybeans: 2400, sorghum: 2600 };
  const cropKey = agronomy?.growth_stage?.model?.toLowerCase() || '';
  const cropTarget = Object.entries(gddTargets).find(([k]) => cropKey.includes(k))?.[1] || 2400;
  const currentGdd = agronomy?.gdd?.gdd;

  return (
    <div className="space-y-8">
      {vegSeries.length >= 1 ? (
        <div>
          <SectionTitle>Vegetation Index Trend</SectionTitle>
          <p className="text-sm text-gray-500 font-mont mb-3">
            Seasonal NDVI/NDRE/EVI trajectory from Sentinel-2 analysis history. Compares current vs prior observations.
          </p>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div style={{ height: 220 }}>
              <LineChart series={vegSeries} xLabels={dates} height={220} yMin={0} yMax={1} stretch={true} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <div className="mb-2 flex justify-center text-gray-400"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
          <div className="font-lora text-gray-700">Run multiple analyses to build a vegetation trend chart</div>
        </div>
      )}

      {analyses.length >= 2 && (
        <div>
          <SectionTitle>Field Health Score Over Time</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div style={{ height: 180 }}>
              <LineChart series={healthSeries} xLabels={dates} height={180} yMin={0} yMax={100} stretch={true} />
            </div>
          </div>
        </div>
      )}

      <div>
        <SectionTitle>Growing Degree Units (GDU)</SectionTitle>
        {currentGdd != null ? (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <GddProgress current={currentGdd} target={cropTarget} label={`${agronomy.growth_stage?.model || 'Crop'} GDD Progress`} />
            <div className="grid grid-cols-3 gap-3 mt-4">
              <StatCard label="Accumulated GDD" value={Math.round(currentGdd)} sub={`Base ${agronomy.gdd.base_temp_c}°C`} bg="#f0f5e8" />
              <StatCard label="Growth Stage" value={agronomy.growth_stage?.stage ?? 'N/A'} sub={agronomy.growth_stage?.model} />
              <StatCard label="Est. Remaining" value={currentGdd < cropTarget ? `${Math.round(cropTarget - currentGdd)} GDD` : 'Mature'} />
            </div>
          </div>
        ) : (
          <DataRequired
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>}
            title="GDD Calculation Requires Crop + Planting Date"
            description="Set the crop type and planting date in Edit Field to enable growing degree unit tracking and maturity forecasting."
            integrations={['Edit Field to add crop & planting date']}
          />
        )}
      </div>

      <div>
        <SectionTitle>Emergence Uniformity</SectionTitle>
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0 0 6"/><rect x="9" y="8" width="6" height="8" rx="1"/><path d="M7 15v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2"/></svg>}
          title="Planter Monitor Required"
          description="Emergence uniformity charts (% of plants emerged on Day 1 vs Day 5 vs Day 10) require row-by-row seed sensor data from a precision planting monitor."
          integrations={['Precision Planting 20|20', 'John Deere SeedStar', 'Kinze Harvest Command', 'AgLeader SureDrive']}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: SOIL
// ════════════════════════════════════════════════════════════════════════════════
function SoilTab({ agronomy }) {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="font-mont text-sm text-amber-700">
          Soil analytics require physical lab sampling or in-field sensor networks. Once integrated, this tab will display spatial heatmaps and depth-profile charts.
        </p>
      </div>

      <SectionTitle>Soil Nutrient Heatmaps</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>, title: 'Soil pH Map', desc: 'Spatial distribution of soil acidity. Optimal range 6.0–7.0 for most row crops. pH imbalance limits nutrient uptake even when fertility is adequate.' },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, title: 'Phosphorus (P) Map', desc: 'Identifies low-P zones that limit early root development. Used to generate VRT P application prescriptions to avoid over/under-application.' },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 0-6 6-6 11a6 6 0 0 0 12 0c0-5-6-11-6-11z"/></svg>, title: 'Potassium (K) Map', desc: 'K drives water regulation, enzyme activation, and standability. Deficiency appears as marginal leaf scorch on older leaves.' },
          { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></svg>, title: 'Organic Matter (OM) Map', desc: 'Higher OM indicates better water holding capacity, CEC, and biological activity. Target >3% for most corn-belt soils.' },
        ].map(({ icon, title, desc }) => (
          <DataRequired key={title} icon={icon} title={title} description={desc}
            integrations={['Soil sampling lab (A&L, Ward, Midwest Labs)', 'Veris MSP3 on-the-go sensor', 'CDFA-accredited lab']} />
        ))}
      </div>

      <SectionTitle>Soil Moisture Profile</SectionTitle>
      <DataRequired
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 0-6 6-6 11a6 6 0 0 0 12 0c0-5-6-11-6-11z"/></svg>}
        title="Soil Moisture Probes Required"
        description="Multi-depth soil moisture charts (4″, 12″, 24″, 36″) show plant-available water at each root zone layer. Used to optimize irrigation timing and amount."
        integrations={['Sentek EnviroSCAN', 'Campbell Scientific CS650', 'METER Group TEROS', 'John Deere Water Management']}
      />

      <SectionTitle>Soil Temperature</SectionTitle>
      {agronomy?.gdd ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="font-mont text-sm text-gray-600 mb-3">
            Soil temperature is tracked via GDD accumulation (base {agronomy.gdd.base_temp_c}°C). For precise planting window decisions, install a dedicated soil thermometer at 2″ depth.
          </p>
          <StatCard label="GDD Accumulated (proxy for soil warmth)" value={`${Math.round(agronomy.gdd.gdd)} GDD`} sub={`Base ${agronomy.gdd.base_temp_c}°C`} bg="#f0f5e8" />
        </div>
      ) : (
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>}
          title="Soil Temperature Sensor Required"
          description="Precise 2″ soil temperature determines the optimal planting window (e.g., corn needs ≥50°F for 3 consecutive days). Required for accurate GDD base calculation."
          integrations={['METER Group 5TM', 'Davis Instruments', 'WatchDog weather station', 'In-cab soil temp monitor']}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: WEATHER (enhanced)
// ════════════════════════════════════════════════════════════════════════════════
function WeatherTab({ weather, field }) {
  const formatHour = (timeStr) => {
    const d = new Date(timeStr);
    const h = d.getHours();
    if (h === 0) return '12a';
    if (h === 12) return 'Noon';
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  if (!field.latitude || !field.longitude) {
    return (
      <div className="text-center py-16 rounded-xl bg-gray-50">
        <div className="mb-3 flex justify-center text-gray-400"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <div className="font-lora text-xl text-gray-700">Field coordinates required</div>
        <div className="font-mont text-sm text-gray-400 mt-1">Edit this field and add GPS coordinates to enable weather data</div>
      </div>
    );
  }

  if (!weather?.current) {
    return (
      <div className="text-center py-16 rounded-xl bg-gray-50">
        <div className="mb-3 flex justify-center text-gray-400"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg></div>
        <div className="font-lora text-xl text-gray-700">Weather data unavailable</div>
        <div className="font-mont text-sm text-gray-400 mt-1">Could not load weather for this field's location</div>
      </div>
    );
  }

  const daily = weather.daily || [];
  const hourly = weather.hourly || [];

  const dayLabels = daily.map(d => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[new Date(d.date).getDay()];
  });

  // Temperature trend from daily forecasts (°F)
  const highTemps = daily.map(d => d.high_f ?? null);
  const lowTemps  = daily.map(d => d.low_f  ?? null);
  const tempSeries = [
    { label: 'High °F', color: '#EF4444', values: highTemps },
    { label: 'Low °F',  color: '#3B82F6', values: lowTemps  },
  ].filter(s => s.values.some(v => v != null));

  // Stress thresholds in °F
  const heatThreshold = 95;  // >95°F heat stress for most row crops
  const coldThreshold = 41;  // <41°F cold/frost risk
  const heatDays = highTemps.filter(t => t != null && t > heatThreshold).length;
  const coldDays = lowTemps.filter(t => t != null && t < coldThreshold).length;

  // Hourly temp bar chart
  const hourlyTemps  = hourly.map(h => h.temp_f ?? 0);
  const hourlyLabels = hourly.map(h => formatHour(h.time));

  return (
    <div className="space-y-8">
      {/* Current conditions */}
      <div>
        <SectionTitle>Current Conditions{weather.location ? ` — ${weather.location.city}, ${weather.location.state}` : ''}</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard label="Temperature" value={`${Math.round(weather.current.temp_f ?? 0)}°F`} sub={weather.current.condition} bg="#DEECFF" />
          {weather.current.feelslike_f != null && (
            <StatCard label="Feels Like" value={`${Math.round(weather.current.feelslike_f)}°F`} bg="#C8F2F4" />
          )}
          <StatCard label="Wind" value={`${Math.round(weather.current.wind_mph ?? 0)} mph${weather.current.wind_dir ? ` ${weather.current.wind_dir}` : ''}`} bg="#D2F0DB" />
          <StatCard label="Humidity" value={weather.current.humidity != null ? `${Math.round(weather.current.humidity)}%` : 'N/A'} bg="#F4E9FF" />
        </div>
        {weather.today && (
          <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex gap-6 text-sm font-mont text-gray-600">
            <span>Today High: <strong>{Math.round(weather.today.high_f)}°F</strong></span>
            <span>Today Low: <strong>{Math.round(weather.today.low_f)}°F</strong></span>
          </div>
        )}
      </div>

      {/* Hourly forecast */}
      {hourly.length > 0 && (
        <div>
          <SectionTitle>Hourly Forecast</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 p-4 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {hourly.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1 px-2">
                  <span className="text-xs text-gray-400 font-mont">{formatHour(h.time)}</span>
                  {h.icon && <img src={h.icon} alt="" className="w-8 h-8" />}
                  <span className="text-sm font-mont font-semibold text-gray-700">{Math.round(h.temp_f)}°F</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Daily forecast */}
      {daily.length > 0 && (
        <div>
          <SectionTitle>Daily Forecast</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {daily.map((d, i) => {
              const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col items-center gap-1">
                  <span className="text-xs font-mont font-semibold text-gray-500">{days[new Date(d.date).getDay()]}</span>
                  {d.icon && <img src={d.icon} alt="" className="w-9 h-9" />}
                  <span className="text-sm font-mont font-bold text-red-500">H: {Math.round(d.high_f)}°</span>
                  <span className="text-sm font-mont text-blue-500">L: {Math.round(d.low_f)}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Crop stress risk */}
      <div>
        <SectionTitle>Crop Stress Risk ({daily.length}-Day Window)</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-xl border p-4 ${heatDays > 0 ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-white'}`}>
            <div className="text-xs font-mont font-semibold text-gray-500 mb-1">Heat Stress Days (&gt;{heatThreshold}°F)</div>
            <div className={`text-3xl font-lora font-bold ${heatDays > 0 ? 'text-red-600' : 'text-gray-900'}`}>{heatDays}</div>
            <div className="text-xs text-gray-400 mt-1">{heatDays > 0 ? 'Monitor for pollen viability & yield drag' : 'No heat stress forecast'}</div>
          </div>
          <div className={`rounded-xl border p-4 ${coldDays > 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-100 bg-white'}`}>
            <div className="text-xs font-mont font-semibold text-gray-500 mb-1">Cold/Frost Risk Days (&lt;{coldThreshold}°F)</div>
            <div className={`text-3xl font-lora font-bold ${coldDays > 0 ? 'text-blue-600' : 'text-gray-900'}`}>{coldDays}</div>
            <div className="text-xs text-gray-400 mt-1">{coldDays > 0 ? 'Check frost protection & germination risk' : 'No frost risk forecast'}</div>
          </div>
        </div>
      </div>

      {/* Wind direction rose (real Open-Meteo hourly data, 30d default) */}
      <div>
        <SectionTitle>Wind Direction Rose</SectionTitle>
        <WindRose fieldId={field?.fieldid || field?.id} />
      </div>

      {/* Temperature trend */}
      {tempSeries.length > 0 && daily.length >= 2 && (
        <div>
          <SectionTitle>Temperature Trend — {daily.length}-Day Forecast (°F)</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 p-4 h-[480px]">
            <LineChart series={tempSeries} xLabels={dayLabels} stretch />
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: OPERATIONS
// ════════════════════════════════════════════════════════════════════════════════
function OperationsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="font-mont text-sm text-gray-600">
          Operational efficiency analytics require machine-generated sensor data from precision planting and harvest equipment. Connect your equipment platform to unlock these charts.
        </p>
      </div>

      <SectionTitle>Planter Performance</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></svg>}
          title="Singulation Chart"
          description="Bar chart showing % of rows with skips (0 seeds) and doubles (2 seeds) vs singulated (1 seed). Target: >98% singulation. Identifies worn discs or incorrect seed sizing."
          integrations={['Precision Planting 20|20 SeedSense', 'John Deere SeedStar 3 HP', 'Kinze Harvest Command']}
        />
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
          title="Downforce / Gauge Wheel Pressure"
          description="Graph showing per-row downforce in pounds throughout the field. Ensures correct seeding depth across varying soil types. Low downforce = shallow seed placement."
          integrations={['Precision Planting DeltaForce', 'John Deere Active Pneumatic Downforce', 'Ag Leader SureDrive']}
        />
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
          title="Speed vs Applied Rate Histogram"
          description="Shows what % of the field was planted at target speed and target seeding rate. Identifies headland speed violations that affect emergence uniformity."
          integrations={['John Deere Operations Center', 'Climate FieldView', 'Ag Leader InCommand']}
        />
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 6H3"/><path d="M21 12H3"/><path d="M21 18H3"/></svg>}
          title="Seeding Depth Uniformity"
          description="Row-by-row depth consistency (target ± 0.25″). Uneven depth leads to uneven emergence and significant yield loss in corn."
          integrations={['Precision Planting vDrive', 'John Deere ExactEmerge', 'AGCO RD2 Row Unit']}
        />
      </div>

      <SectionTitle>Fleet & Fuel Analytics</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V8l8-6 8 6v14"/><path d="M10 22V16h4v6"/><path d="M3 8h18"/></svg>}
          title="Fuel Consumption & Idle Time"
          description="Pie/bar charts breaking down active field work vs idle time per operator. Used to calculate cost per acre and identify inefficiencies in field logistics."
          integrations={['John Deere Operations Center', 'CNH AFS Connect', 'AGCO Fuse', 'Samsara fleet telematics']}
        />
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          title="Field Efficiency Report"
          description="Total acres/hour, headland time %, and overlap % — shows applicator or planter efficiency and estimates savings from guidance improvements."
          integrations={['John Deere Operations Center', 'Trimble Ag Software', 'Raven Precision']}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: ECONOMICS
// ════════════════════════════════════════════════════════════════════════════════
function calcHaFromGeojson(geojsonStr) {
  try {
    const geom = typeof geojsonStr === 'string' ? JSON.parse(geojsonStr) : geojsonStr;
    const coords = geom.type === 'Polygon' ? geom.coordinates[0]
                 : geom.type === 'Feature'  ? geom.geometry.coordinates[0]
                 : null;
    if (!coords || coords.length < 3) return null;
    const centerLat = (coords.reduce((s, c) => s + c[1], 0) / coords.length) * Math.PI / 180;
    const mPerLat = 111320;
    const mPerLon = 111320 * Math.cos(centerLat);
    let area = 0;
    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
      area += (coords[j][0] * mPerLon + coords[i][0] * mPerLon) * (coords[j][1] * mPerLat - coords[i][1] * mPerLat);
    }
    const ha = Math.abs(area) / 2 / 10000;
    return ha > 0 ? ha : null;
  } catch { return null; }
}

function EconomicsTab({ field, analyses }) {
  // Prefer manually entered size, fall back to boundary polygon area
  const manualHa = field.field_size_hectares ? parseFloat(field.field_size_hectares) : null;
  const boundaryHa = field.boundary_geojson ? calcHaFromGeojson(field.boundary_geojson) : null;
  const ha = manualHa ?? boundaryHa;
  const haSource = manualHa ? 'entered' : boundaryHa ? 'calculated from boundary' : null;
  const crop = (field.crop_type || '').toLowerCase();

  // Industry-average cost estimates per hectare (USD)
  const costPerHa = crop.includes('corn') ? 850
    : crop.includes('wheat') ? 480
    : crop.includes('soy') ? 560
    : crop.includes('oat') ? 420
    : 600; // generic

  // Yield estimates t/ha for break-even calculation
  const yieldPerHa = crop.includes('corn') ? 10
    : crop.includes('wheat') ? 4.5
    : crop.includes('soy') ? 3.2
    : crop.includes('oat') ? 3.8
    : 5;

  const totalCost = ha ? ha * costPerHa : null;

  // Break-even chart: profit at various prices per tonne
  const prices = [100, 150, 200, 250, 300, 350, 400, 450, 500];
  const profitPerHa = ha
    ? prices.map(p => (p * yieldPerHa - costPerHa))
    : null;

  const breakevenPrice = costPerHa / yieldPerHa;

  return (
    <div className="space-y-8">
      {ha ? (
        <>
          <div>
            <SectionTitle>Input Cost Estimate</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Field Size" value={`${ha.toFixed(2)} ha`} sub={haSource} bg="#f0f5e8" />
              <StatCard label="Est. Cost / ha" value={`$${costPerHa}`} sub={`${crop || 'generic'} avg`} />
              <StatCard label="Total Input Cost" value={`$${totalCost?.toLocaleString()}`} sub="seed + fert + chem + fuel" />
              <StatCard label="Break-even Price" value={`$${breakevenPrice.toFixed(0)}/t`} sub={`at ${yieldPerHa} t/ha yield`} />
            </div>
            <p className="text-xs text-gray-400 font-mont mt-2">
              * Cost estimates based on regional industry averages. Connect your input records for precise actuals.
            </p>
          </div>

          <div>
            <SectionTitle>Break-Even Price Sensitivity Chart</SectionTitle>
            <p className="text-sm text-gray-500 font-mont mb-3">
              Profit/loss per hectare at various market prices (t) — assuming {yieldPerHa} t/ha estimated yield.
              Break-even at <strong>${breakevenPrice.toFixed(0)}/t</strong>.
            </p>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <BarChart
                values={profitPerHa.map(Math.abs)}
                labels={prices.map(p => `$${p}`)}
                colors={profitPerHa.map(v => v >= 0 ? '#6D8E22' : '#EF4444')}
                height={180}
                showValues={false}
              />
              <div className="flex gap-4 mt-2 text-xs font-mont">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#819360' }} /> Profit</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#EF4444' }} /> Loss</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          title="Field Size Required for Economic Analysis"
          description="Draw a boundary polygon on the map when editing this field — the area will be calculated automatically. Or enter the size manually in hectares."
          integrations={['Edit Field → Draw boundary on map', 'Edit Field → Field Size (hectares)']}
        />
      )}

      <div>
        <SectionTitle>Profit / Loss Zone Map</SectionTitle>
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>}
          title="Yield Monitor Required"
          description="Spatial profit/loss map subtracts localized input costs from yield monitor data to show which zones of the field lost money. Identifies management zones for input optimization."
          integrations={['Combine yield monitor', 'Climate FieldView yield layers', 'John Deere Harvest Lab']}
        />
      </div>

      <div>
        <SectionTitle>Yield vs. Variety Comparison</SectionTitle>
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>}
          title="Multi-Variety Trial Data Required"
          description="Side-by-side bar charts comparing hybrid/variety performance under identical conditions. Requires strip trial data with variety boundaries tagged in the yield monitor."
          integrations={['Seed company trial portal', 'Climate FieldView strip trial', 'Encirca variety tracking']}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: ANALYTICS
// ════════════════════════════════════════════════════════════════════════════════
function AnalyticsTab({ analyses, recommendations }) {
  const getIndex = (a, name) => a?.vegetation_indices?.find(i => i.index_type === name);

  // NDVI vs Health Score scatter
  const scatterPoints = analyses
    .map(a => ({ x: getIndex(a, 'NDVI')?.mean ?? null, y: a.health_score, label: new Date(a.analysis_date).toLocaleDateString() }))
    .filter(p => p.x != null);

  // Multi-analysis comparison table
  const sorted = [...analyses].reverse();

  return (
    <div className="space-y-8">
      {scatterPoints.length >= 2 ? (
        <div>
          <SectionTitle>Correlation: NDVI vs Health Score</SectionTitle>
          <p className="text-sm text-gray-500 font-mont mb-3">
            Each point represents one satellite analysis. Dashed line shows the linear trend.
            A tight upward correlation confirms NDVI as a reliable health proxy for this field.
          </p>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <ScatterPlot
              points={scatterPoints}
              xLabel="NDVI Mean"
              yLabel="Health Score"
              height={240}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <div className="mb-2 flex justify-center text-gray-400"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg></div>
          <div className="font-lora text-gray-700">Run at least 2 analyses to generate correlation plots</div>
        </div>
      )}

      <div>
        <SectionTitle>Multi-Analysis Comparison</SectionTitle>
        {sorted.length === 0 ? (
          <p className="text-gray-400 font-mont text-sm">No analyses yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm font-mont">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Date</th>
                  <th className="text-center px-3 py-3 text-gray-500 font-semibold">Health</th>
                  <th className="text-center px-3 py-3 text-gray-500 font-semibold">NDVI</th>
                  <th className="text-center px-3 py-3 text-gray-500 font-semibold">NDRE</th>
                  <th className="text-center px-3 py-3 text-gray-500 font-semibold">EVI</th>
                  <th className="text-center px-3 py-3 text-gray-500 font-semibold">Cloud %</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a, i) => {
                  const ndvi = getIndex(a, 'NDVI')?.mean;
                  const ndre = getIndex(a, 'NDRE')?.mean;
                  const evi  = getIndex(a, 'EVI')?.mean;
                  const prev = sorted[i - 1];
                  const prevNdvi = prev ? getIndex(prev, 'NDVI')?.mean : null;
                  const trend = ndvi && prevNdvi ? (ndvi > prevNdvi ? '↑' : ndvi < prevNdvi ? '↓' : '→') : '—';
                  const trendColor = trend === '↑' ? 'text-green-600' : trend === '↓' ? 'text-red-500' : 'text-gray-400';
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-semibold">
                        {new Date(a.analysis_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {a.health_score != null ? (
                          <span className={`font-bold ${a.health_score >= 70 ? 'text-green-600' : a.health_score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                            {a.health_score}%
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center text-gray-700">{ndvi?.toFixed(3) ?? '—'} <span className={`text-xs ${trendColor}`}>{trend}</span></td>
                      <td className="px-3 py-3 text-center text-gray-700">{ndre?.toFixed(3) ?? '—'}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{evi?.toFixed(3) ?? '—'}</td>
                      <td className="px-3 py-3 text-center text-gray-400">{a.cloud_percent?.toFixed(1) ?? '—'}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <SectionTitle>AI Recommendations</SectionTitle>
        {recommendations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <div className="mb-2 flex justify-center text-gray-400"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg></div>
            <div className="font-lora text-gray-700">No recommendations yet — run an analysis to generate AI-powered recommendations</div>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-lora font-bold text-gray-900">{rec.title}</div>
                  <div className="flex items-center gap-2">
                    {rec.estimated_savings && <span className="font-mont font-bold text-green-600 text-sm">${rec.estimated_savings} saved</span>}
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {rec.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="font-mont text-sm text-gray-600">{rec.description}</p>
                {rec.recommendation_type && <div className="mt-2 text-xs text-gray-400 font-mont">Type: {rec.recommendation_type}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionTitle>Multi-Year Layer Comparison</SectionTitle>
        <DataRequired
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          title="Historical Yield Map Archive Required"
          description="Side-by-side or overlay comparison of NDVI/yield maps across seasons (e.g., 2022 vs 2023 vs 2024) identifies persistent problem areas that don't respond to annual management changes."
          integrations={['Yield monitor archive (John Deere Ops Center)', 'Climate FieldView historical layers', 'Custom GeoTIFF upload']}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: HISTOGRAMS — bins real raster values from /api/fields/{id}/raster/{index}
// ════════════════════════════════════════════════════════════════════════════════
function IndexHistogram({ indexName, fieldId, color = '#6D8E22', height = 130 }) {
  const { data, loading, error } = useRaster(fieldId, indexName, 48);

  if (loading) return (
    <div className="flex items-center justify-center text-gray-400 text-xs font-mont animate-pulse" style={{ height }}>
      Loading raster…
    </div>
  );
  if (error || !data?.grid?.values) return (
    <div className="flex items-center justify-center text-gray-400 text-xs font-mont" style={{ height }}>
      {error ? 'Raster unavailable' : 'No data — run an analysis first'}
    </div>
  );

  const values = data.grid.values.flat().filter(v => v != null);
  if (values.length === 0) return (
    <div className="flex items-center justify-center text-gray-400 text-xs font-mont" style={{ height }}>
      No valid pixels
    </div>
  );

  const min  = data.raster?.min  ?? Math.min(...values);
  const max  = data.raster?.max  ?? Math.max(...values);
  const mean = data.raster?.mean ?? values.reduce((s, v) => s + v, 0) / values.length;
  const range = (max - min) || 0.01;

  const BINS = 24;
  const step = range / BINS;
  const bins = Array(BINS).fill(0);
  values.forEach(v => {
    const idx = Math.min(BINS - 1, Math.max(0, Math.floor((v - min) / step)));
    bins[idx]++;
  });

  const maxBin = Math.max(...bins, 1);
  const W = 400, H = height;
  const PL = 8, PR = 8, PT = 10, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const binW = cW / BINS;
  const meanX = PL + ((mean - min) / range) * cW;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
        {bins.map((count, i) => {
          const binCenter = min + (i + 0.5) * step;
          const c = binCenter < mean ? '#F97316' : color;
          const bH = Math.max(1, (count / maxBin) * cH);
          return (
            <rect key={i} x={PL + i * binW + 0.5} y={PT + cH - bH} width={Math.max(1, binW - 1)} height={bH} fill={c} rx="1">
              <title>{`${binCenter.toFixed(3)}: ${count} px`}</title>
            </rect>
          );
        })}
        <line x1={meanX} y1={PT} x2={meanX} y2={PT + cH} stroke="#111827" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x={PL} y={H - 6} fontSize="9" fill="#9CA3AF">{min.toFixed(2)}</text>
        <text x={meanX} y={H - 6} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="bold">{mean.toFixed(2)}</text>
        <text x={W - PR} y={H - 6} textAnchor="end" fontSize="9" fill="#9CA3AF">{max.toFixed(2)}</text>
      </svg>
      <div className="flex gap-4 mt-1 text-xs font-mont text-gray-500 flex-wrap">
        <span>Min <strong>{min.toFixed(3)}</strong></span>
        <span>Mean <strong style={{ color }}>{mean.toFixed(3)}</strong></span>
        <span>Max <strong>{max.toFixed(3)}</strong></span>
        <span>Range <strong>{range.toFixed(3)}</strong></span>
        <span className="ml-auto text-gray-400">{values.length} px</span>
      </div>
    </div>
  );
}

function HistogramGradientBar({ min, max }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs font-mont text-gray-400">{min.toFixed(2)}</span>
      <div className="flex-1 h-3 rounded" style={{ background: 'linear-gradient(to right, rgb(160,30,30), rgb(220,180,40), rgb(90,165,40), rgb(30,100,20))' }} />
      <span className="text-xs font-mont text-gray-400">{max.toFixed(2)}</span>
    </div>
  );
}

const HISTOGRAM_INDEX_CONFIGS = [
  { key: 'NDVI',  label: 'NDVI',  color: '#6D8E22', desc: 'Normalized Difference Vegetation Index — overall greenness and biomass' },
  { key: 'NDRE',  label: 'NDRE',  color: '#3B82F6', desc: 'Normalized Difference Red Edge — nitrogen stress, late-season crops' },
  { key: 'EVI',   label: 'EVI',   color: '#F59E0B', desc: 'Enhanced Vegetation Index — reduced soil background signal' },
  { key: 'GNDVI', label: 'GNDVI', color: '#10B981', desc: 'Green NDVI — chlorophyll concentration and crop stress' },
  { key: 'NDWI',  label: 'NDWI',  color: '#6366F1', desc: 'Normalized Difference Water Index — canopy water content' },
];

function HistogramsTab({ analyses, fieldId }) {
  const [selectedAnalysisIdx, setSelectedAnalysisIdx] = useState(0);
  const getIndex = (a, name) => a?.vegetation_indices?.find(i => i.index_type === name);

  if (analyses.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
        <div className="mb-4 flex justify-center text-gray-400"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg></div>
        <div className="font-lora text-xl text-gray-600 mb-2">No analysis data</div>
        <div className="font-mont text-sm text-gray-400">Run an analysis on this field to generate histogram data.</div>
      </div>
    );
  }

  const analysis = analyses[selectedAnalysisIdx] || null;
  const fieldIdNum = parseInt(fieldId) || 1;

  return (
    <div className="space-y-5">
      <div>
        <p className="font-mont text-sm text-gray-500">
          Pixel-value distributions for each vegetation index — per satellite pass. Spot outliers and track season-over-season shifts.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold font-mont text-gray-500">Analysis Date</label>
          <select value={selectedAnalysisIdx} onChange={e => setSelectedAnalysisIdx(Number(e.target.value))}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-[180px]">
            {analyses.map((a, i) => (
              <option key={i} value={i}>
                {new Date(a.analysis_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {i === 0 ? ' (latest)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {analysis && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-6 flex-wrap">
          <div className="text-sm font-mont text-gray-600">
            <span className="font-semibold text-gray-800">
              {new Date(analysis.analysis_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {analysis.cloud_percent != null && <span className="ml-3 text-gray-400">Cloud cover: {analysis.cloud_percent.toFixed(1)}%</span>}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="w-3 h-3 rounded-sm" style={{ background: '#F97316' }} />
            <span className="text-xs font-mont text-gray-500">Below mean</span>
            <span className="w-3 h-3 rounded-sm ml-2" style={{ background: '#6D8E22' }} />
            <span className="text-xs font-mont text-gray-500">Above mean</span>
            <span className="text-xs font-mont text-gray-400 ml-2">— Mean value</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {HISTOGRAM_INDEX_CONFIGS.map(cfg => {
          const idxData = getIndex(analysis, cfg.key);
          return (
            <div key={cfg.key} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="font-lora font-bold text-gray-900 text-base">{cfg.label}</div>
                {idxData && (
                  <span className="font-mont text-sm font-bold" style={{ color: cfg.color }}>
                    {idxData.mean.toFixed(3)}
                  </span>
                )}
              </div>
              <p className="font-mont text-xs text-gray-400 mb-3">{cfg.desc}</p>
              <IndexHistogram indexName={cfg.key} fieldId={fieldIdNum} color={cfg.color} height={130} />
              {idxData && <HistogramGradientBar min={idxData.min} max={idxData.max} />}
            </div>
          );
        })}
      </div>

      {analyses.length >= 2 && (() => {
        const ndviStats = analyses.map(a => ({ a, idx: getIndex(a, 'NDVI') })).filter(x => x.idx);
        if (ndviStats.length < 2) return null;
        const overallMin = Math.min(...ndviStats.map(s => s.idx.min));
        const overallMax = Math.max(...ndviStats.map(s => s.idx.max));
        const range = overallMax - overallMin || 0.01;
        return (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">
              NDVI Range Per Analysis (real stats from each scene)
            </div>
            <div className="p-5 space-y-2">
              {ndviStats.map(({ a, idx }, i) => {
                const minPct  = ((idx.min  - overallMin) / range) * 100;
                const meanPct = ((idx.mean - overallMin) / range) * 100;
                const maxPct  = ((idx.max  - overallMin) / range) * 100;
                const widthPct = maxPct - minPct;
                const active = i === selectedAnalysisIdx;
                return (
                  <div key={i} className={`flex items-center gap-3 rounded-lg p-2 ${active ? 'bg-green-50 border border-[#6D8E22]' : 'border border-transparent'}`}>
                    <div className="font-mont text-xs font-semibold text-gray-600 w-28 shrink-0">
                      {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    </div>
                    <div className="flex-1 relative h-5 bg-gray-100 rounded">
                      <div className="absolute top-0 h-full rounded"
                        style={{ left: `${minPct}%`, width: `${widthPct}%`, background: 'linear-gradient(to right, rgba(160,30,30,0.4), rgba(90,165,40,0.4))' }} />
                      <div className="absolute top-0 h-full w-0.5 bg-gray-900" style={{ left: `${meanPct}%` }} title={`Mean ${idx.mean.toFixed(3)}`} />
                    </div>
                    <div className="font-mont text-xs text-gray-500 w-16 text-right tabular-nums">
                      {idx.mean.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB: AGRONOMY
// ════════════════════════════════════════════════════════════════════════════════
function AgronomyTab({ agronomy, ndviSeries, onEdit }) {
  if (!agronomy) {
    return (
      <div className="text-center py-16 rounded-xl bg-gray-50 border border-gray-100">
        <div className="font-lora text-xl text-gray-700 mb-1">No agronomy data</div>
        <div className="font-mont text-sm text-gray-400">Click "Run Analysis" to generate agronomy data</div>
      </div>
    );
  }

  const indices = agronomy.indices || {};
  const ndvi = typeof indices.NDVI === 'object' ? indices.NDVI?.mean : indices.NDVI;
  const ndre = typeof indices.NDRE === 'object' ? indices.NDRE?.mean : indices.NDRE;
  const ndmi = typeof indices.NDMI === 'object' ? indices.NDMI?.mean : indices.NDMI;
  const evi  = typeof indices.EVI  === 'object' ? indices.EVI?.mean  : indices.EVI;

  const hasSpray = agronomy.spray_by_product && Object.keys(agronomy.spray_by_product).some(k => k !== 'general');
  const pestAlerts = Array.isArray(agronomy.pest_disease_alerts) ? agronomy.pest_disease_alerts : [];

  return (
    <div className="space-y-8">
      {/* Planting date nudge */}
      {!agronomy.gdd && !agronomy.growth_stage && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 text-sm font-mont">
          <span>📅</span>
          <span className="text-amber-800">
            GDD and growth stage require a planting date.{' '}
            <button onClick={onEdit} className="font-semibold underline">Set crop &amp; planting date in field settings →</button>
          </span>
        </div>
      )}

      {/* Vegetation index bars + Signals — side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionTitle>Vegetation Indices</SectionTitle>
          {[ndvi, ndre, ndmi, evi].every(v => v == null) ? (
            <p className="text-sm text-gray-400 italic">No index data — run an analysis first</p>
          ) : (
            <div className="space-y-3">
              <IndexBar label="NDVI" value={ndvi} color="#3D6B34" />
              <IndexBar label="NDRE" value={ndre} color="#15803D" lo={0} hi={0.6} />
              <IndexBar label="NDMI" value={ndmi} color="#0EA5E9" lo={-0.2} hi={0.6} />
              <IndexBar label="EVI"  value={evi}  color="#84CC16" lo={0} hi={1} />
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionTitle>Signals</SectionTitle>
          <ul className="space-y-2 text-sm">
            {agronomy.irrigation?.recommendation && (
              <li><span className="font-semibold text-sky-700">💧 Irrigation:</span> {agronomy.irrigation.recommendation}</li>
            )}
            {agronomy.disease_risk?.level && (
              <li><span className="font-semibold text-rose-700">🦠 Disease Risk:</span> {agronomy.disease_risk.level}</li>
            )}
            {!agronomy.irrigation?.recommendation && !agronomy.disease_risk?.level && (
              <li className="text-gray-500 italic">No active signals</li>
            )}
          </ul>
        </div>
      </div>

      {/* Spray by product */}
      {hasSpray && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionTitle>Spray Decision by Product</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            {['herbicide', 'fungicide', 'insecticide'].map(k => {
              const v = agronomy.spray_by_product[k] || {};
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
                  {fails && <div className="text-xs text-gray-700 mt-1"><strong>Fails:</strong> {fails}</div>}
                  {!fails && warns && <div className="text-xs text-gray-600 mt-1"><strong>Watch:</strong> {warns}</div>}
                  {!fails && !warns && <div className="text-xs text-gray-500 mt-1">All conditions met</div>}
                </div>
              );
            })}
          </div>
          {agronomy.spray_by_product.herbicide?.notes && (
            <p className="text-xs text-gray-500 mt-3 italic">{agronomy.spray_by_product.herbicide.notes}</p>
          )}
        </div>
      )}

      {/* Pest & disease alerts */}
      {pestAlerts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <SectionTitle>Pest &amp; Disease Alerts</SectionTitle>
          <ul className="space-y-2.5">
            {pestAlerts.map((a, i) => {
              const sev = (a.severity || 'MEDIUM').toUpperCase();
              const sevColor = sev === 'HIGH' ? '#B91C1C' : sev === 'MEDIUM' ? '#B45309' : '#65A30D';
              const sevBg    = sev === 'HIGH' ? '#FEF2F2' : sev === 'MEDIUM' ? '#FFFBEB' : '#F7FEE7';
              return (
                <li key={i} className="rounded-lg border border-gray-200 p-3" style={{ background: sevBg }}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="font-mont text-sm font-bold text-gray-900">
                      {a.type === 'pest' ? '🐛' : '🦠'} {a.name}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full text-white" style={{ background: sevColor }}>
                      {sev}
                    </span>
                  </div>
                  <div className="font-mont text-sm text-gray-700">{a.action}</div>
                  {a.why && <div className="font-mont text-xs text-gray-500 mt-1">Why: {a.why}</div>}
                  {a.source && <div className="font-mont text-[10px] text-gray-400 mt-1">Source: {a.source}</div>}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* NDVI 180-day trend */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>NDVI Trend — 180 Days</SectionTitle>
          {ndviSeries?.summary?.last_date && (
            <span className="text-xs text-gray-500">
              Last sample: {String(ndviSeries.summary.last_date).slice(0, 10)}
            </span>
          )}
        </div>
        <NDVITrendChart series={ndviSeries?.series} summary={ndviSeries?.summary} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// FieldDetail
// ════════════════════════════════════════════════════════════════════════════════
function FieldDetail({ field, businessId, onBack, onEdit, onJournal, initialTab }) {
  const [tab, setTab] = useState(initialTab || 'overview');
  const [analyses, setAnalyses] = useState([]);
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [agronomy, setAgronomy] = useState(null);
  const [ndviSeries, setNdviSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [dismissedSatBanner, setDismissedSatBanner] = useState(false);

  const fieldId = field.fieldid || field.id;

  useEffect(() => { loadAll(); }, [fieldId]);

  async function loadAll() {
    setLoading(true);
    // Phase 1: fast DB-only queries — show existing data immediately
    const [analysesRes, ndviSeriesRes] = await Promise.all([
      safeFetch(`${CROP_API_URL}/api/fields/${fieldId}/analyses?limit=20`),
      safeFetch(`${CROP_API_URL}/api/fields/${fieldId}/indices/series?index=NDVI&days=180`),
    ]);
    setAnalyses(analysesRes?.analyses || []);
    setNdviSeries(ndviSeriesRes || null);
    setLoading(false);

    // Phase 2: slower external-API calls load in the background after the page renders
    const weatherUrl = (field.latitude && field.longitude)
      ? `${API_URL}/api/weather?lat=${field.latitude}&lon=${field.longitude}`
      : null;
    const [weatherRes, recsRes, alertsRes, agronomyRes] = await Promise.all([
      weatherUrl ? safeFetch(weatherUrl) : Promise.resolve(null),
      safeFetch(`${CROP_API_URL}/api/fields/${fieldId}/recommendations`),
      safeFetch(`${CROP_API_URL}/api/fields/${fieldId}/alerts?status=open`),
      safeFetch(`${CROP_API_URL}/api/fields/${fieldId}/agronomy`),
    ]);
    setWeather(weatherRes || null);
    setRecommendations(recsRes?.recommendations || []);
    setAlerts(alertsRes?.alerts || []);
    setAgronomy(agronomyRes || null);
  }

  async function triggerAnalysis() {
    setAnalyzing(true);
    try {
      await fetch(`${CROP_API_URL}/api/fields/${fieldId}/analyze`, { method: 'POST' });
      setTimeout(loadAll, 5000);
    } catch {}
    finally { setAnalyzing(false); }
  }

  const latest = analyses[0];
  const getIndex = (a, name) => a?.vegetation_indices?.find(i => i.index_type === name);
  const daysOld = latest ? Math.floor((Date.now() - new Date(latest.analysis_date)) / 86400000) : null;
  const SATELLITE_TABS = new Set(['overview', 'maps', 'histograms', 'growth', 'analytics']);
  const satStale = !latest || daysOld > 14;

  const TABS = [
    { id: 'overview',    label: 'Overview' },
    { id: 'maps',        label: 'Satellite Maps' },
    { id: 'histograms',  label: 'Histograms' },
    { id: 'growth',      label: 'Crop Growth' },
    { id: 'agronomy',    label: 'Agronomy' },
    { id: 'maturity',    label: 'Maturity' },
    { id: 'soil',        label: 'Soil & Nutrients' },
    { id: 'weather',     label: 'Weather' },
    { id: 'climate',     label: 'Climate Forecast' },
    // { id: 'operations',  label: 'Operations' },  // hidden temporarily
    { id: 'economics',   label: 'Economics' },
    { id: 'analytics',   label: 'Analytics' },
  ];

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={onBack} className="text-[#6D8E22] font-mont text-sm font-semibold flex items-center gap-1 mb-3 hover:opacity-70">
            ← Back to Fields
          </button>
          <h1 className="font-lora text-3xl font-bold text-gray-900">{field.name}</h1>
          {field.address && <p className="text-gray-500 font-mont text-sm mt-1 flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {field.address}</p>}
          <div className="flex gap-4 mt-2 text-sm text-gray-500 font-mont">
            {field.crop_type && <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M17 8c0 2.5-2 4-5 4S7 10.5 7 8c0-3 2.5-5 5-5s5 2 5 5z"/></svg> {field.crop_type}</span>}
            {field.field_size_hectares && <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3H3v18"/><path d="m21 9-6 6-4-4-4 4"/></svg> {field.field_size_hectares} ha</span>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={onEdit} className="px-4 py-2.5 rounded-lg font-mont font-semibold text-sm transition-all border border-[#6D8E22] text-[#6D8E22] hover:bg-[#f0f5e8] inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Field
          </button>
          <button onClick={onJournal} className="px-4 py-2.5 rounded-lg font-mont font-semibold text-sm transition-all border border-gray-300 text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Journal
          </button>
          <button onClick={triggerAnalysis} disabled={analyzing} className="px-4 py-2.5 rounded-lg font-mont font-semibold text-white text-sm transition-all disabled:opacity-50" style={{ background: '#819360' }}>
            {analyzing ? 'Analyzing…' : '▶ Run Analysis'}
          </button>
        </div>
      </div>

      {/* Alerts — show only on satellite-relevant tabs */}
      {alerts.length > 0 && ['overview', 'maps', 'histograms', 'growth', 'analytics'].includes(tab) && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 mb-6">
          <div className="font-lora font-bold text-red-700 mb-2 flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {alerts.length} Active Alert{alerts.length > 1 ? 's' : ''}</div>
          {alerts.map((a, i) => <div key={i} className="text-sm text-red-700 font-mont">{a.message || a.alert_type}</div>)}
        </div>
      )}

      {/* Tab bar — scrollable on mobile */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {TABS.map(t => <TabBtn key={t.id} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />)}
      </div>

      {/* Satellite freshness banner — dismissible on satellite tabs, tiny chip elsewhere */}
      {satStale && !loading && (
        dismissedSatBanner ? (
          <div className="inline-flex items-center gap-1.5 text-xs font-mont text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/></svg>
            {!latest ? 'No satellite data' : `Satellite data ${daysOld}d old`}
          </div>
        ) : SATELLITE_TABS.has(tab) ? (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" style={{ color: '#B45309' }}><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/><path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"/></svg>
            <div className="flex-1 font-mont text-sm text-amber-800">
              {!latest
                ? <>No satellite analysis yet — <button onClick={triggerAnalysis} className="font-semibold underline">Run Analysis →</button></>
                : <><strong>Satellite data is {daysOld} days old.</strong> Results may not reflect current conditions. <button onClick={triggerAnalysis} className="font-semibold underline">Run a new analysis →</button></>
              }
            </div>
            <button onClick={() => setDismissedSatBanner(true)}
              className="shrink-0 text-amber-500 hover:text-amber-700 text-xl leading-none font-light" title="Dismiss">×</button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-xs font-mont text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/></svg>
            {!latest ? 'No satellite data' : `Satellite ${daysOld}d old`}
          </div>
        )
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm">Loading field data…</div>
      ) : (
        <>
          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {latest ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Health Score" value={latest.health_score != null ? `${latest.health_score}%` : 'N/A'} sub={latest.status} bg="#f0f5e8" />
                  <StatCard label="NDVI" value={getIndex(latest, 'NDVI')?.mean?.toFixed(2) ?? 'N/A'} sub={`Range ${getIndex(latest, 'NDVI')?.min?.toFixed(2) ?? '?'} – ${getIndex(latest, 'NDVI')?.max?.toFixed(2) ?? '?'}`} />
                  <StatCard label="Last Analysis" value={new Date(latest.analysis_date).toLocaleDateString()} sub={`Cloud ${latest.cloud_percent?.toFixed(1) ?? '?'}%`} />
                  <StatCard label="Analyses Run" value={analyses.length} sub="total records" />
                </div>
              ) : (
                <div className="text-center py-16 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-center mb-3"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 4.9A10 10 0 1 0 19.1 19.1"/><path d="M16.24 7.76A6 6 0 1 0 7.76 16.24"/><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><line x1="12" y1="12" x2="21" y2="21"/></svg></div>
                  <div className="font-lora text-xl text-gray-700 mb-1">No analysis data yet</div>
                  <div className="font-mont text-sm text-gray-400">Click "Run Analysis" to get started</div>
                </div>
              )}

              {latest && (
                <div>
                  <h3 className="font-lora font-bold text-gray-900 text-lg mb-1">Vegetation Indices</h3>
                  <p className="font-mont text-xs text-gray-400 mb-3">
                    As of {new Date(latest.analysis_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                    {latest.cloud_percent > 20 && <span className="ml-2 text-amber-600 inline-flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg> {latest.cloud_percent.toFixed(0)}% cloud cover</span>}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {['NDVI', 'NDRE', 'EVI', 'GNDVI', 'NDWI'].map(name => {
                      const idx = getIndex(latest, name);
                      return (
                        <div key={name} className="rounded-xl border border-gray-100 p-3 bg-white">
                          <div className="text-xs font-mont font-semibold text-gray-400 mb-1">{name}</div>
                          <div className="text-xl font-lora font-bold text-gray-900">{idx ? idx.mean.toFixed(2) : '—'}</div>
                          {idx && <div className="text-xs text-gray-400">{idx.min.toFixed(2)} – {idx.max.toFixed(2)}</div>}
                        </div>
                      );
                    })}
                  </div>
                  {analyses.length >= 2 && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="rounded-xl border border-gray-100 bg-white p-3">
                        <div className="text-xs font-mont font-semibold text-gray-400 mb-1">NDVI Trend</div>
                        <Sparkline values={[...analyses].reverse().map(a => getIndex(a, 'NDVI')?.mean).filter(v => v != null)} />
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-white p-3">
                        <div className="text-xs font-mont font-semibold text-gray-400 mb-1">NDRE Trend</div>
                        <Sparkline values={[...analyses].reverse().map(a => getIndex(a, 'NDRE')?.mean).filter(v => v != null)} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {agronomy && (
                <div>
                  <h3 className="font-lora font-bold text-gray-900 text-lg mb-3">Agronomy Snapshot</h3>
                  {!agronomy.gdd && !agronomy.growth_stage && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 text-sm font-mont mb-3">
                      <span className="flex items-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                      <span className="text-amber-800">GDD and growth stage require a planting date.{' '}
                        <button onClick={onEdit} className="font-semibold underline">Set crop & planting date in field settings →</button>
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <StatCard label="GDD (°C·days)" value={agronomy.gdd ? Math.round(agronomy.gdd.gdd) : 'Not set'} sub={agronomy.gdd ? `Base ${agronomy.gdd.base_temp_c}°C` : 'Add crop + planting date'} />
                    <StatCard label="Growth Stage" value={agronomy.growth_stage?.stage ?? 'Not set'} sub={agronomy.growth_stage?.model} />
                    <StatCard label="Spray Decision" value={agronomy.spray_decision?.decision ?? 'N/A'} sub={agronomy.spray_decision?.reasons?.join(', ')} />
                    <StatCard label="Irrigation" value={agronomy.irrigation_advice?.status ?? 'N/A'} />
                    <StatCard label="Disease Risk" value={agronomy.disease_risk?.risk ?? 'N/A'} />
                    <StatCard label="Confidence" value={agronomy.confidence ?? 'N/A'} sub={agronomy.freshness_days != null ? `${agronomy.freshness_days}d ago` : null} />
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-lora font-bold text-gray-900 text-lg mb-3">Biomass Estimate</h3>
                <BiomassPanel fieldId={fieldId} />
              </div>

              {recommendations.length > 0 && (
                <div>
                  <h3 className="font-lora font-bold text-gray-900 text-lg mb-3">Top Recommendations</h3>
                  <div className="space-y-3">
                    {recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-mont font-semibold text-gray-900 text-sm">{rec.title}</div>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-mont">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'maps'       && <MapsTab latest={latest} analyses={analyses} fieldId={fieldId} />}
          {tab === 'histograms' && <HistogramsTab analyses={analyses} fieldId={fieldId} />}
          {tab === 'growth'     && <GrowthTab analyses={analyses} agronomy={agronomy} />}
          {tab === 'agronomy'   && <AgronomyTab agronomy={agronomy} ndviSeries={ndviSeries} onEdit={onEdit} />}
          {tab === 'maturity'   && <MaturityPanel fieldId={fieldId} businessId={businessId} />}
          {tab === 'soil'       && <SoilTab agronomy={agronomy} />}
          {tab === 'weather'    && <WeatherTab weather={weather} field={field} />}
          {tab === 'climate'    && <ClimateForecastPanel fieldId={fieldId} />}
          {/* {tab === 'operations' && <OperationsTab />} */}
          {tab === 'economics'  && <EconomicsTab field={field} analyses={analyses} />}
          {tab === 'analytics'  && <AnalyticsTab analyses={analyses} recommendations={recommendations} />}
        </>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function PrecisionAgAnalyses() {
  const [searchParams] = useSearchParams();
  const BusinessID = (() => {
    const raw = searchParams.get('BusinessID');
    if (!raw || raw === 'null' || raw === 'undefined') return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();
  const FieldID    = searchParams.get('FieldID');
  const tabParam   = searchParams.get('tab') || undefined;
  const PeopleID   = localStorage.getItem('PeopleID');
  const { Business, LoadBusiness } = useAccount();
  const [field, setField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);

  useEffect(() => {
    if (!FieldID || !BusinessID) return;
    fetch(`${API_URL}/api/fields?business_id=${BusinessID}`)
      .then(r => r.json())
      .then(fields => {
        const found = fields.find(f => String(f.fieldid) === String(FieldID) || String(f.id) === String(FieldID));
        if (found) setField(found);
      })
      .catch(() => {});
  }, [FieldID, BusinessID]);

  if (!Business) return <div className="p-8 text-gray-500 font-mont">Loading…</div>;

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={PeopleID} pageTitle="Field Analyses" breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Precision Ag' }, { label: 'Fields', to: `/precision-ag/fields?BusinessID=${BusinessID}` }, { label: 'Analyses' }]}>
      <div className="max-w-full mx-auto">
        {field ? (
          <FieldDetail
            field={field}
            businessId={BusinessID}
            initialTab={tabParam}
            onBack={() => navigate(`/precision-ag/fields?BusinessID=${BusinessID}`)}
            onEdit={() => navigate(`/precision-ag/fields?BusinessID=${BusinessID}&view=edit-field&FieldID=${FieldID}`)}
            onJournal={() => navigate(`/oatsense/notes?BusinessID=${BusinessID}&FieldID=${FieldID}`)}
          />
        ) : (
          <div className="text-center py-24">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M17 8c0 2.5-2 4-5 4S7 10.5 7 8c0-3 2.5-5 5-5s5 2 5 5z"/><line x1="12" y1="22" x2="4" y2="22"/><line x1="12" y1="22" x2="20" y2="22"/></svg></div>
            <div className="font-lora text-2xl text-gray-700 mb-2">Field Analysis</div>
            <div className="font-mont text-sm text-gray-400">Select a field from the Fields page to view its analysis</div>
            <button
              onClick={() => navigate(`/precision-ag/fields?BusinessID=${BusinessID}`)}
              className="mt-6 px-5 py-2.5 rounded-lg text-white font-mont font-semibold text-sm"
              style={{ background: '#819360' }}
            >
              Go to Fields
            </button>
          </div>
        )}
      </div>
      <SaigeWidget businessId={BusinessID} fieldId={FieldID} pageContext="Precision Ag — Analyses" />
    </AccountLayout>
  );
}
