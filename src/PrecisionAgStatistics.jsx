import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { CROP_API_URL } from './precisionAgUtils';
import SaigeWidget from './SaigeWidget';

// ─── shared palette ───────────────────────────────────────────────────────────
const GREEN  = '#3D6B34';
const AMBER  = '#D97706';
const RED    = '#DC2626';
const BLUE   = '#2563EB';
const PURPLE = '#7C3AED';
const GRAY   = '#6B7280';

// ─── API helper ───────────────────────────────────────────────────────────────
async function postStats(path, body) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${CROP_API_URL}/api/statistics/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── parse CSV / space / newline separated numbers ───────────────────────────
function parseNumbers(raw) {
  return raw
    .split(/[\s,;\n]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const n = parseFloat(s);
      if (isNaN(n)) throw new Error(`"${s}" is not a number`);
      return n;
    });
}

// ─── Inline SVG charts ────────────────────────────────────────────────────────
const PL = 46, PR = 14, PT = 16, PB = 38;
const W  = 600;

function chartPath(pts) {
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

function ControlChart({ title, values, cl, ucl, lcl, violations = [], color = GREEN, height = 200 }) {
  const H = height, cW = W - PL - PR, cH = H - PT - PB;
  const all = [...values, ucl, lcl].filter(v => v != null);
  const lo  = Math.min(...all), hi = Math.max(...all);
  const span = hi - lo || 1;
  const n = values.length;
  const px = i => PL + (n > 1 ? (i / (n - 1)) * cW : cW / 2);
  const py = v => PT + cH - ((v - lo) / span) * cH;
  const ticks = [lo, lo + span * 0.5, hi];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-2">{title}</p>
      <div style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full block" style={{ height: '100%' }}>
          {ticks.map((v, i) => (
            <g key={i}>
              <line x1={PL} y1={py(v)} x2={W - PR} y2={py(v)} stroke="#E5E7EB" strokeWidth="1" />
              <text x={PL - 4} y={py(v) + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">{v.toFixed(2)}</text>
            </g>
          ))}
          {/* Control limit lines */}
          {[{ v: ucl, label: 'UCL', col: RED }, { v: cl, label: 'CL', col: GRAY }, { v: lcl, label: 'LCL', col: BLUE }].map(({ v, label, col }) => (
            v != null && (
              <g key={label}>
                <line x1={PL} y1={py(v)} x2={W - PR} y2={py(v)} stroke={col} strokeWidth="1.2" strokeDasharray={label === 'CL' ? undefined : '5,3'} />
                <text x={W - PR + 3} y={py(v) + 4} fontSize="8" fill={col}>{label}</text>
              </g>
            )
          ))}
          {/* Data line */}
          <path d={chartPath(values.map((v, i) => [px(i), py(v)]))} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Points — violations in red */}
          {values.map((v, i) => (
            <circle key={i} cx={px(i)} cy={py(v)} r="4"
              fill={violations.includes(i) ? RED : 'white'}
              stroke={violations.includes(i) ? RED : color}
              strokeWidth="2" />
          ))}
        </svg>
      </div>
    </div>
  );
}

function ScatterChart({ title, points, xLabel = 'PC1', yLabel = 'PC2', height = 260 }) {
  const H = height, cW = W - PL - PR, cH = H - PT - PB;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const xLo = Math.min(...xs), xHi = Math.max(...xs);
  const yLo = Math.min(...ys), yHi = Math.max(...ys);
  const xSpan = xHi - xLo || 1, ySpan = yHi - yLo || 1;
  const px = v => PL + ((v - xLo) / xSpan) * cW;
  const py = v => PT + cH - ((v - yLo) / ySpan) * cH;
  const colors = [GREEN, BLUE, AMBER, PURPLE, RED, '#06B6D4', '#EC4899'];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-2">{title}</p>
      <div style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full block" style={{ height: '100%' }}>
          <line x1={PL} y1={PT} x2={PL} y2={H - PB} stroke="#E5E7EB" strokeWidth="1" />
          <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="#E5E7EB" strokeWidth="1" />
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill={GRAY}>{xLabel}</text>
          <text x={10} y={H / 2} textAnchor="middle" fontSize="10" fill={GRAY} transform={`rotate(-90, 10, ${H / 2})`}>{yLabel}</text>
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={px(p.x)} cy={py(p.y)} r="5" fill={colors[i % colors.length]} opacity="0.85" />
              <text x={px(p.x) + 7} y={py(p.y) + 4} fontSize="8" fill="#374151">{p.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function ForecastChart({ historical, fitted, forecast, height = 240 }) {
  const H = height, cW = W - PL - PR, cH = H - PT - PB;
  const allY = [...historical.values, ...fitted, ...forecast.values, ...forecast.upper_95, ...forecast.lower_95];
  const lo = Math.min(...allY), hi = Math.max(...allY);
  const span = hi - lo || 1;
  const nHist = historical.values.length;
  const nTotal = nHist + forecast.values.length;
  const px = i => PL + (i / (nTotal - 1)) * cW;
  const py = v => PT + cH - ((v - lo) / span) * cH;

  const histPts  = historical.values.map((v, i) => [px(i), py(v)]);
  const fittedPts = fitted.map((v, i) => [px(i), py(v)]);
  const fcPts    = forecast.values.map((v, i) => [px(nHist + i), py(v)]);
  const upperPts = forecast.upper_95.map((v, i) => [px(nHist + i), py(v)]);
  const lowerPts = forecast.lower_95.map((v, i) => [px(nHist + i), py(v)]);

  // CI band polygon
  const bandPts = [...upperPts, ...[...lowerPts].reverse()];
  const bandD   = bandPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + 'Z';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-2">Forecast</p>
      <div style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full block" style={{ height: '100%' }}>
          <path d={bandD} fill={BLUE} fillOpacity="0.1" />
          <path d={chartPath(fittedPts)} fill="none" stroke={GRAY} strokeWidth="1.5" strokeDasharray="4,3" />
          <path d={chartPath(histPts)} fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
          <path d={chartPath(fcPts)} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6,3" />
          {histPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={GREEN} />)}
          {fcPts.map(([x, y], i)  => <circle key={i} cx={x} cy={y} r="3" fill={BLUE} />)}
          {/* Divider */}
          <line x1={px(nHist - 0.5)} y1={PT} x2={px(nHist - 0.5)} y2={H - PB} stroke={GRAY} strokeWidth="1" strokeDasharray="4,2" />
          <text x={PL + 8} y={PT + 12} fontSize="9" fill={GREEN}>Historical</text>
          <text x={px(nHist) + 4} y={PT + 12} fontSize="9" fill={BLUE}>Forecast</text>
        </svg>
      </div>
    </div>
  );
}

function BarChart({ title, items, valueKey = 'effect', labelKey = 'name', color = GREEN, height = 220 }) {
  const sorted = [...items].slice(0, 10);
  const maxV = Math.max(...sorted.map(d => Math.abs(d[valueKey]))) || 1;
  const H = height, barH = Math.min(28, (H - 40) / sorted.length - 4);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">{title}</p>
      <div className="space-y-1">
        {sorted.map((item, i) => {
          const v = item[valueKey];
          const pct = Math.abs(v) / maxV * 100;
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="text-gray-600 truncate" style={{ minWidth: 120, maxWidth: 140 }}>{item[labelKey]}</span>
              <div className="flex-1 bg-gray-100 rounded-full overflow-hidden" style={{ height: 12 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: v >= 0 ? color : RED, borderRadius: 4 }} />
              </div>
              <span className="font-mono text-gray-700" style={{ minWidth: 56, textAlign: 'right' }}>{v.toFixed(4)}</span>
              {item.pct != null && <span className="text-gray-400" style={{ minWidth: 44 }}>{item.pct}%</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold" style={{ color: color || GREEN }}>{value ?? '—'}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

function ErrorBanner({ msg }) {
  return msg ? (
    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{msg}</div>
  ) : null;
}

function RunBtn({ onClick, loading, label = 'Run Analysis' }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition-opacity"
      style={{ background: GREEN, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
    >
      {loading ? 'Running…' : label}
    </button>
  );
}

function TextareaInput({ label, hint, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2"
        style={{ '--tw-ring-color': GREEN }}
      />
    </div>
  );
}

function NumberInput({ label, value, onChange, step = 'any', min, max }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type="number" step={step} min={min} max={max}
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'spc',        label: 'SPC',         sub: 'Control Charts & Capability' },
  { id: 'doe',        label: 'DOE',         sub: 'Factorial Design' },
  { id: 'shelf',      label: 'Shelf Life',  sub: 'Arrhenius Model' },
  { id: 'pca',        label: 'PCA',         sub: 'Multivariate Analysis' },
  { id: 'forecast',   label: 'Forecasting', sub: 'Time-Series & Regression' },
];

// ─── SPC Tab ─────────────────────────────────────────────────────────────────
function SPCTab() {
  const [raw, setRaw]       = useState('12.1, 11.8, 12.3, 12.0, 11.9, 12.4, 11.7, 12.2, 12.5, 11.6, 12.1, 12.0');
  const [usl, setUsl]       = useState('12.8');
  const [lsl, setLsl]       = useState('11.2');
  const [label, setLabel]   = useState('Brix Level');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');

  const run = useCallback(async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const values = parseNumbers(raw);
      const body = {
        values, label,
        usl: usl !== '' ? parseFloat(usl) : undefined,
        lsl: lsl !== '' ? parseFloat(lsl) : undefined,
      };
      const r = await postStats('spc', body);
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [raw, usl, lsl, label]);

  const cap = result?.capability;
  const cpkColor = cap?.cpk == null ? GRAY : cap.cpk >= 1.33 ? GREEN : cap.cpk >= 1.0 ? AMBER : RED;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Input Data</h3>
        <TextareaInput label="Measurements" hint="Paste numbers separated by commas, spaces, or new lines." value={raw} onChange={setRaw} rows={3} />
        <div className="grid grid-cols-3 gap-4">
          <NumberInput label="Upper Spec Limit (USL)" value={usl} onChange={setUsl} />
          <NumberInput label="Lower Spec Limit (LSL)" value={lsl} onChange={setLsl} />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Measurement Label</label>
            <input value={label} onChange={e => setLabel(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex justify-end"><RunBtn onClick={run} loading={loading} /></div>
        <ErrorBanner msg={error} />
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Mean" value={result.summary.mean} />
            <StatCard label="Std Dev" value={result.summary.std_dev} />
            <StatCard label="Cpk" value={cap?.cpk ?? '—'} sub={cap?.cpk >= 1.33 ? 'Capable' : cap?.cpk >= 1.0 ? 'Marginal' : 'Not Capable'} color={cpkColor} />
            <StatCard label="Cp" value={cap?.cp ?? '—'} color={cap?.cp >= 1.33 ? GREEN : AMBER} />
          </div>
          <ControlChart
            title={`${label} — Individuals Chart (${result.summary.n} points)`}
            values={result.x_chart.values}
            cl={result.x_chart.cl} ucl={result.x_chart.ucl} lcl={result.x_chart.lcl}
            violations={result.violations}
            color={GREEN} height={220}
          />
          <ControlChart
            title="Moving Range Chart"
            values={result.mr_chart.values}
            cl={result.mr_chart.cl} ucl={result.mr_chart.ucl} lcl={result.mr_chart.lcl}
            color={BLUE} height={160}
          />
          {result.violations.length > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              ⚠ {result.violations.length} out-of-control point{result.violations.length > 1 ? 's' : ''} detected at index{result.violations.length > 1 ? 'es' : ''}: {result.violations.join(', ')}. Investigate for assignable causes.
            </div>
          )}
          {result.violations.length === 0 && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              ✓ Process is statistically stable — no Western Electric Rule violations detected.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── DOE Tab ─────────────────────────────────────────────────────────────────
const DOE_PLACEHOLDER = `Factor,Low,High
Water_Freq,1,3
Nutrients,low,high
Temperature,20,28`;

function DOETab() {
  const [factorsRaw, setFactorsRaw] = useState(DOE_PLACEHOLDER);
  const [runsRaw, setRunsRaw]       = useState('-1,-1,-1,4.2\n+1,-1,-1,5.1\n-1,+1,-1,4.8\n+1,+1,-1,5.7\n-1,-1,+1,4.5\n+1,-1,+1,5.4\n-1,+1,+1,5.0\n+1,+1,+1,6.2');
  const [respName, setRespName]     = useState('Yield (kg/plant)');
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState('');

  const run = useCallback(async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      // Parse factors: CSV header row then data rows
      const fLines = factorsRaw.trim().split('\n').filter(Boolean);
      const factors = fLines
        .filter(l => !l.toLowerCase().startsWith('factor'))
        .map(l => {
          const [name, low, high] = l.split(',').map(s => s.trim());
          return { name, low: parseFloat(low), high: parseFloat(high) };
        });

      // Parse runs: each row = k coded values + response (last column)
      const k = factors.length;
      const runs = runsRaw.trim().split('\n').filter(Boolean).map(line => {
        const parts = line.split(',').map(s => parseFloat(s.trim()));
        return { coded: parts.slice(0, k).map(v => Math.sign(v) || 1), response: parts[k] };
      });

      const r = await postStats('doe', { factors, runs, response_name: respName });
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [factorsRaw, runsRaw, respName]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Experiment Setup</h3>
        <div className="grid grid-cols-2 gap-4">
          <TextareaInput
            label="Factors (Name, Low, High — one per line)"
            hint="Skip the header row shown here if you prefer."
            value={factorsRaw} onChange={setFactorsRaw} rows={5}
          />
          <TextareaInput
            label="Runs (coded -1/+1 per factor, then response)"
            hint="One row per run. Last column = measured response."
            value={runsRaw} onChange={setRunsRaw} rows={5}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Response Variable Name</label>
          <input value={respName} onChange={e => setRespName(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-64" />
        </div>
        <div className="flex justify-end"><RunBtn onClick={run} loading={loading} /></div>
        <ErrorBanner msg={error} />
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Grand Mean" value={result.grand_mean} />
            <StatCard label="R²" value={result.anova.r_squared} color={result.anova.r_squared >= 0.8 ? GREEN : AMBER} />
            <StatCard label="Runs" value={result.anova.n_runs} />
            <StatCard label="Factors" value={result.anova.n_factors} />
          </div>
          <BarChart
            title={`Effects on ${result.response_name} (largest → smallest)`}
            items={result.effects}
            valueKey="effect" labelKey="name"
          />
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">ANOVA Table</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Source', 'Effect', 'SS', '% Contribution'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.effects.map((e, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 pr-4 font-medium text-gray-700">{e.name}</td>
                    <td className="py-1.5 pr-4 font-mono">{e.effect.toFixed(4)}</td>
                    <td className="py-1.5 pr-4 font-mono">{e.ss?.toFixed(4) ?? '—'}</td>
                    <td className="py-1.5 pr-4 font-mono">{e.pct != null ? `${e.pct}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Shelf-Life Tab ───────────────────────────────────────────────────────────
function ShelfLifeTab() {
  const [obsRaw, setObsRaw]       = useState('4,21\n10,14\n20,7\n30,3.5');
  const [threshold, setThreshold] = useState('0.5');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState('');

  const run = useCallback(async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const observations = obsRaw.trim().split('\n').filter(Boolean).map(line => {
        const [tc, days] = line.split(/[,\t]/).map(s => parseFloat(s.trim()));
        return { temperature_c: tc, days_to_failure: days };
      });
      const predict_temps_c = Array.from({ length: 22 }, (_, i) => i * 2);
      const r = await postStats('shelf-life', { observations, threshold: parseFloat(threshold), predict_temps_c });
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [obsRaw, threshold]);

  // Shelf-life curve chart
  const ShelfCurve = ({ preds, height = 220 }) => {
    const H = height, cW = W - PL - PR, cH = H - PT - PB;
    const xs = preds.map(p => p.temperature_c);
    const ys = preds.map(p => p.shelf_life_days).filter(Boolean);
    if (!ys.length) return null;
    const xLo = Math.min(...xs), xHi = Math.max(...xs);
    const yLo = 0, yHi = Math.max(...ys);
    const xSpan = xHi - xLo || 1, ySpan = yHi - yLo || 1;
    const px = v => PL + ((v - xLo) / xSpan) * cW;
    const py = v => PT + cH - ((v - yLo) / ySpan) * cH;
    const pts = preds.filter(p => p.shelf_life_days).map(p => [px(p.temperature_c), py(p.shelf_life_days)]);
    const xTicks = [xLo, xLo + xSpan * 0.5, xHi];
    const yTicks = [0, yHi * 0.5, yHi];

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Predicted Shelf Life vs Storage Temperature</p>
        <div style={{ height }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full block" style={{ height: '100%' }}>
            {yTicks.map((v, i) => (
              <g key={i}>
                <line x1={PL} y1={py(v)} x2={W - PR} y2={py(v)} stroke="#E5E7EB" strokeWidth="1" />
                <text x={PL - 4} y={py(v) + 4} textAnchor="end" fontSize="9" fill="#9CA3AF">{v.toFixed(0)}d</text>
              </g>
            ))}
            {xTicks.map((v, i) => (
              <text key={i} x={px(v)} y={H - PB + 16} textAnchor="middle" fontSize="9" fill="#9CA3AF">{v}°C</text>
            ))}
            <path d={chartPath(pts)} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />
            {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={BLUE} />)}
            <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill={GRAY}>Temperature (°C)</text>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Arrhenius Shelf-Life Model</h3>
        <p className="text-xs text-gray-500">Enter observed shelf-life at different storage temperatures. The model fits an Arrhenius equation to predict shelf life across any temperature range.</p>
        <div className="grid grid-cols-2 gap-4">
          <TextareaInput
            label="Observations (Temperature °C, Days to Failure)"
            hint="One pair per line: 4,21 means 4°C → 21 days shelf life."
            value={obsRaw} onChange={setObsRaw} rows={5}
          />
          <div className="space-y-4">
            <NumberInput label="Quality Threshold (fraction 0–1)" value={threshold} onChange={setThreshold} step="0.05" min="0.05" max="0.99" />
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
              <strong>Threshold</strong> = the quality fraction at end-of-life. 0.5 = 50% of initial quality. Typical values: 0.5 for appearance, 0.7 for nutritional content.
            </div>
          </div>
        </div>
        <div className="flex justify-end"><RunBtn onClick={run} loading={loading} /></div>
        <ErrorBanner msg={error} />
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard label="Activation Energy" value={`${result.arrhenius.Ea_kJ_per_mol} kJ/mol`} sub="Higher = more temperature-sensitive" />
            <StatCard label="Model R²" value={result.arrhenius.r_squared} color={result.arrhenius.r_squared >= 0.9 ? GREEN : AMBER} />
            <StatCard label="Threshold" value={`${(result.arrhenius.threshold * 100).toFixed(0)}%`} sub="Quality acceptance limit" color={BLUE} />
          </div>
          <ShelfCurve preds={result.predictions} />
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Reference</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 4, 10, 20].map(tc => {
                const pred = result.predictions.find(p => p.temperature_c === tc);
                return pred ? (
                  <div key={tc} className="text-center bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{tc}°C</div>
                    <div className="text-xl font-bold" style={{ color: tc <= 4 ? GREEN : tc <= 10 ? AMBER : RED }}>
                      {pred.shelf_life_days?.toFixed(1) ?? '—'}d
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── PCA Tab ─────────────────────────────────────────────────────────────────
function PCATab() {
  const [varNames, setVarNames] = useState('NDVI, EVI, SAVI, NDRE');
  const [samplesRaw, setSamplesRaw] = useState(
    'Field A, 0.72, 0.55, 0.61, 0.41\nField B, 0.58, 0.44, 0.50, 0.33\nField C, 0.81, 0.63, 0.70, 0.50\nField D, 0.65, 0.49, 0.56, 0.38\nField E, 0.44, 0.34, 0.40, 0.26\nField F, 0.77, 0.60, 0.66, 0.46'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  const run = useCallback(async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const variables = varNames.split(',').map(s => s.trim()).filter(Boolean);
      const samples = samplesRaw.trim().split('\n').filter(Boolean).map(line => {
        const parts = line.split(',').map(s => s.trim());
        return { name: parts[0], values: parts.slice(1).map(Number) };
      });
      const r = await postStats('pca', { variables, samples });
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [varNames, samplesRaw]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Principal Component Analysis</h3>
        <p className="text-xs text-gray-500">Compare fields or batches across multiple quality dimensions simultaneously. PCA reveals which samples are similar and which variables drive the differences.</p>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Variables (comma-separated)</label>
          <input value={varNames} onChange={e => setVarNames(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <TextareaInput
          label="Samples (Name, val1, val2, … — one per line)"
          hint="First column = sample name; remaining columns = one value per variable."
          value={samplesRaw} onChange={setSamplesRaw} rows={7}
        />
        <div className="flex justify-end"><RunBtn onClick={run} loading={loading} /></div>
        <ErrorBanner msg={error} />
      </div>

      {result && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="PC1 Variance" value={`${(result.explained_variance[0] * 100).toFixed(1)}%`} color={GREEN} />
            <StatCard label="PC2 Variance" value={`${(result.explained_variance[1] * 100).toFixed(1)}%`} color={BLUE} />
            <StatCard label="Cumulative" value={`${(result.cumulative_variance * 100).toFixed(1)}%`} color={PURPLE} />
          </div>
          <ScatterChart
            title="Sample Scores (PC1 vs PC2)"
            points={result.pc_scores.map(s => ({ x: s.pc1, y: s.pc2, label: s.name }))}
            xLabel={`PC1 (${(result.explained_variance[0] * 100).toFixed(1)}%)`}
            yLabel={`PC2 (${(result.explained_variance[1] * 100).toFixed(1)}%)`}
          />
          <ScatterChart
            title="Variable Loadings (contribution to each PC)"
            points={result.loadings.map(l => ({ x: l.pc1, y: l.pc2, label: l.variable }))}
            xLabel="PC1 Loading" yLabel="PC2 Loading"
            height={220}
          />
          <BarChart
            title="PC1 Loadings (variable importance)"
            items={result.loadings.sort((a, b) => Math.abs(b.pc1) - Math.abs(a.pc1))}
            valueKey="pc1" labelKey="variable" color={GREEN}
          />
        </>
      )}
    </div>
  );
}

// ─── Forecasting Tab ──────────────────────────────────────────────────────────
function ForecastingTab() {
  const [mode, setMode] = useState('timeseries');
  // Time-series state
  const [tsValues, setTsValues] = useState('42, 45, 48, 50, 47, 52, 55, 53, 58, 60, 57, 63');
  const [tsDates, setTsDates]   = useState('Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec');
  const [periods, setPeriods]   = useState('6');
  const [alpha, setAlpha]       = useState('0.3');
  const [beta, setBeta]         = useState('0.1');
  // Regression state
  const [yVals, setYVals]   = useState('4.2, 5.1, 4.8, 5.7, 4.5, 5.4, 5.0, 6.2, 5.8, 6.5');
  const [yName, setYName]   = useState('Yield (kg)');
  const [xDefs, setXDefs]   = useState('Temp_avg: 24,26,25,27,23,25,24,28,27,29\nRainfall_mm: 85,90,88,92,80,86,83,95,91,97');

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  const runTS = useCallback(async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const values = parseNumbers(tsValues);
      const dates  = tsDates.split(',').map(s => s.trim()).filter(Boolean);
      const r = await postStats('timeseries', {
        values, dates: dates.length === values.length ? dates : values.map((_, i) => `T${i + 1}`),
        forecast_periods: parseInt(periods),
        alpha: parseFloat(alpha),
        beta: parseFloat(beta),
      });
      setResult({ type: 'timeseries', data: r });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [tsValues, tsDates, periods, alpha, beta]);

  const runReg = useCallback(async () => {
    setError(''); setResult(null); setLoading(true);
    try {
      const y_variable = { name: yName, values: parseNumbers(yVals) };
      const x_variables = xDefs.trim().split('\n').filter(Boolean).map(line => {
        const colonIdx = line.indexOf(':');
        const name = line.slice(0, colonIdx).trim();
        const values = parseNumbers(line.slice(colonIdx + 1));
        return { name, values };
      });
      const r = await postStats('regression', { y_variable, x_variables });
      setResult({ type: 'regression', data: r });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [yVals, yName, xDefs]);

  const tsData = result?.type === 'timeseries' ? result.data : null;
  const regData = result?.type === 'regression' ? result.data : null;

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-2">
        {[{ id: 'timeseries', label: 'Time-Series Forecast' }, { id: 'regression', label: 'Regression Analysis' }].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setResult(null); setError(''); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: mode === m.id ? GREEN : '#F3F4F6', color: mode === m.id ? '#fff' : '#374151' }}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'timeseries' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Holt Double Exponential Smoothing</h3>
          <p className="text-xs text-gray-500">Captures level + linear trend. Ideal for harvest volume, demand, or any metric with a consistent upward/downward drift.</p>
          <TextareaInput label="Values (chronological)" value={tsValues} onChange={setTsValues} rows={2} />
          <TextareaInput label="Period Labels (optional, comma-separated)" value={tsDates} onChange={setTsDates} rows={1} />
          <div className="grid grid-cols-3 gap-4">
            <NumberInput label="Forecast periods" value={periods} onChange={setPeriods} step="1" min="1" max="60" />
            <NumberInput label="α (level smoothing)" value={alpha} onChange={setAlpha} step="0.05" min="0.01" max="0.99" />
            <NumberInput label="β (trend smoothing)" value={beta} onChange={setBeta} step="0.05" min="0.01" max="0.99" />
          </div>
          <div className="flex justify-end"><RunBtn onClick={runTS} loading={loading} /></div>
          <ErrorBanner msg={error} />
        </div>
      )}

      {mode === 'regression' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Multiple Linear Regression</h3>
          <p className="text-xs text-gray-500">Correlate environmental or management variables with a quality or yield outcome. Identify which inputs have the strongest impact.</p>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Response Variable Name</label>
            <input value={yName} onChange={e => setYName(e.target.value)} className="w-64 rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <TextareaInput label="Response (Y) values" value={yVals} onChange={setYVals} rows={2} />
          <TextareaInput
            label="Predictor (X) variables — Name: val1, val2, … (one per line)"
            value={xDefs} onChange={setXDefs} rows={4}
          />
          <div className="flex justify-end"><RunBtn onClick={runReg} loading={loading} /></div>
          <ErrorBanner msg={error} />
        </div>
      )}

      {tsData && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Trend" value={tsData.model.overall_trend} color={tsData.model.trend > 0 ? GREEN : RED} />
            <StatCard label="Trend / Period" value={tsData.model.trend.toFixed(4)} />
            <StatCard label="RMSE" value={tsData.model.rmse} />
            <StatCard label="Forecast Periods" value={tsData.forecast.values.length} color={BLUE} />
          </div>
          <ForecastChart historical={tsData.historical} fitted={tsData.fitted} forecast={tsData.forecast} />
        </>
      )}

      {regData && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="R²" value={regData.r_squared} color={regData.r_squared >= 0.8 ? GREEN : AMBER} sub={`Adj. R² = ${regData.r_squared_adj}`} />
            <StatCard label="RMSE" value={regData.rmse} />
            <StatCard label="n" value={regData.n} />
            <StatCard label="df (residual)" value={regData.df_residual} />
          </div>
          <BarChart
            title="Regression Coefficients (effect on outcome)"
            items={regData.coefficients.filter(c => c.variable !== '(Intercept)')}
            valueKey="coefficient" labelKey="variable"
          />
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Coefficient Table</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Variable', 'Coefficient', 'Std Error', 't-stat'].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regData.coefficients.map((c, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 pr-4 font-medium text-gray-700">{c.variable}</td>
                    <td className="py-1.5 pr-4 font-mono">{c.coefficient.toFixed(6)}</td>
                    <td className="py-1.5 pr-4 font-mono">{c.std_error.toFixed(6)}</td>
                    <td className="py-1.5 pr-4 font-mono">{c.t_stat.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PrecisionAgStatistics() {
  const [searchParams] = useSearchParams();
  const fieldId    = searchParams.get('FieldID');
  const businessId = searchParams.get('BusinessID');
  const [tab, setTab] = useState('spc');

  return (
    <AccountLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Lora, serif' }}>
            Statistical Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            SPC · DOE · Shelf-Life Modeling · Multivariate Analysis · Forecasting
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 flex-wrap mb-6 bg-gray-100 rounded-xl p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === t.id ? '#fff' : 'transparent',
                color: tab === t.id ? GREEN : '#6B7280',
                boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <div>{t.label}</div>
              <div className="text-xs font-normal opacity-75 hidden sm:block">{t.sub}</div>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'spc'      && <SPCTab />}
        {tab === 'doe'      && <DOETab />}
        {tab === 'shelf'    && <ShelfLifeTab />}
        {tab === 'pca'      && <PCATab />}
        {tab === 'forecast' && <ForecastingTab />}
      </div>
      <SaigeWidget fieldId={fieldId} businessId={businessId} pageContext="Statistical Analysis" />
    </AccountLayout>
  );
}
