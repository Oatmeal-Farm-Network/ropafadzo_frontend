import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ThaiymeChat from './ThaiymeChat';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
function tok() { return localStorage.getItem('access_token'); }
function auth() { return { Authorization: `Bearer ${tok()}` }; }
function get(path) { return fetch(`${API}${path}`, { headers: auth() }).then(r => r.ok ? r.json() : null); }

const fmt = (n, prefix = '$') => {
  if (n == null) return '—';
  const abs = Math.abs(n);
  const str = abs >= 1000 ? `${prefix}${(abs / 1000).toFixed(1)}k` : `${prefix}${abs.toFixed(0)}`;
  return n < 0 ? `-${str}` : str;
};

function MarginBar({ revenue, cost }) {
  const max = Math.max(revenue, cost, 1);
  const revenueW = (revenue / max) * 100;
  const costW = (cost / max) * 100;
  const positive = revenue >= cost;
  return (
    <div className="space-y-1.5">
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-0.5">
          <span>Revenue</span><span>{fmt(revenue)}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${revenueW}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-0.5">
          <span>Cost</span><span>{fmt(cost)}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-400 rounded-full" style={{ width: `${costW}%` }} />
        </div>
      </div>
      <div className={`text-sm font-bold ${positive ? 'text-green-700' : 'text-red-600'}`}>
        Margin: {fmt(revenue - cost)} {positive ? '✓' : '▼'}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, color = 'text-gray-900' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function FarmPL() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const [tab, setTab] = useState('summary');
  const [season, setSeason] = useState(String(new Date().getFullYear()));
  const [seasons, setSeasons] = useState([]);
  const [summary, setSummary] = useState(null);
  const [byCrop, setByCrop] = useState([]);
  const [byField, setByField] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bid) return;
    get(`/api/farm-pl/seasons?business_id=${bid}`).then(rows => {
      if (Array.isArray(rows) && rows.length) setSeasons(rows);
    });
  }, [bid]);

  useEffect(() => {
    if (!bid) return;
    setLoading(true);
    const qs = `?business_id=${bid}&season=${season}`;
    Promise.all([
      get(`/api/farm-pl/summary${qs}`),
      get(`/api/farm-pl/by-crop${qs}`),
      get(`/api/farm-pl/by-field${qs}`),
    ]).then(([s, c, f]) => {
      setSummary(s); setByCrop(Array.isArray(c) ? c : []); setByField(Array.isArray(f) ? f : []);
    }).finally(() => setLoading(false));
  }, [bid, season]);

  const availableSeasons = seasons.length > 0 ? seasons
    : Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));

  const TABS = ['summary', 'by-crop', 'by-field'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Farm P&L Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Revenue, costs, and gross margin aggregated from all data sources</p>
        </div>
        <select value={season} onChange={e => setSeason(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
          {availableSeasons.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="border-b bg-white px-6">
        <div className="flex gap-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'by-crop' ? 'By Crop' : t === 'by-field' ? 'By Field' : 'Summary'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-5xl">
        {loading && <div className="text-gray-400 text-sm">Loading…</div>}

        {!loading && tab === 'summary' && (
          <div className="space-y-5">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard label="Total Revenue" color="text-green-700"
                value={summary ? fmt(summary.revenue.total) : '—'}
                sub="Yield sales + cash inflows" />
              <SummaryCard label="Total Costs"  color="text-red-600"
                value={summary ? fmt(summary.costs.total) : '—'}
                sub="Variable + activity + nutrients" />
              <SummaryCard label="Gross Margin"
                color={summary && summary.gross_margin >= 0 ? 'text-green-700' : 'text-red-600'}
                value={summary ? fmt(summary.gross_margin) : '—'}
                sub={`${season} season`} />
              <SummaryCard label="Margin / ha" color="text-blue-700"
                value={summary?.gross_margin_per_ha != null ? fmt(summary.gross_margin_per_ha) : '—'}
                sub={summary ? `${summary.total_area_ha?.toFixed(1) || '?'} ha total` : ''} />
            </div>

            {/* Revenue breakdown */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Revenue Sources</h4>
                  {[
                    ['Yield Records', summary.revenue.yield_records],
                    ['Cash Flow Income', summary.revenue.cash_flow_income],
                    ['Scale Tickets', summary.revenue.scale_tickets],
                  ].filter(([, v]) => v > 0).map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">{label}</span>
                      <span className="font-medium text-green-700">{fmt(val)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm py-2 font-bold">
                    <span>Total</span><span className="text-green-700">{fmt(summary.revenue.total)}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Cost Sources</h4>
                  {[
                    ['Yield Variable Costs', summary.costs.yield_variable_costs],
                    ['Cash Flow Expenses', summary.costs.cash_flow_expenses],
                    ['Field Activity Costs', summary.costs.field_activity],
                    ['Nutrient Applications', summary.costs.nutrients],
                  ].filter(([, v]) => v > 0).map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">{label}</span>
                      <span className="font-medium text-red-600">{fmt(val)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm py-2 font-bold">
                    <span>Total</span><span className="text-red-600">{fmt(summary.costs.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                ['/yield-records', 'Yield Records'],
                ['/cash-flow', 'Cash Flow'],
                ['/field-activity', 'Field Activity'],
                ['/nutrients', 'Nutrients'],
                ['/reports', 'Export CSV'],
              ].map(([to, label]) => (
                <Link key={to} to={`${to}?BusinessID=${bid}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50">
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === 'by-crop' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {byCrop.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-2">🌾</div>
                <p>No yield records for {season}. <Link to={`/yield-records?BusinessID=${bid}`}
                  className="text-blue-600 hover:underline">Add yield data</Link></p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Crop','Area (ha)','Yield (t)','Revenue','Variable Cost','Gross Margin','Margin/ha','Fields'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {byCrop.map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.crop_name || '—'}</td>
                      <td className="px-4 py-3">{c.area_ha?.toFixed(1)}</td>
                      <td className="px-4 py-3">{c.yield_tonnes?.toFixed(1)}</td>
                      <td className="px-4 py-3 text-green-700 font-medium">{fmt(c.revenue)}</td>
                      <td className="px-4 py-3 text-red-600">{fmt(c.variable_cost)}</td>
                      <td className={`px-4 py-3 font-bold ${c.gross_margin >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {fmt(c.gross_margin)}
                      </td>
                      <td className="px-4 py-3">{fmt(c.avg_margin_per_ha)}</td>
                      <td className="px-4 py-3 text-gray-500">{c.field_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && tab === 'by-field' && (
          <div className="space-y-4">
            {byField.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-2">🗺</div>
                <p>No field-level yield data for {season}.</p>
              </div>
            ) : byField.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{f.field_name || `Field ${f.field_id}`}</h4>
                    <div className="text-xs text-gray-500">{f.area_ha?.toFixed(1)} ha
                      {f.crops?.length > 0 && ` · ${f.crops.map(c => c.crop_name).join(', ')}`}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${f.gross_margin >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {fmt(f.gross_margin)}
                  </div>
                </div>
                <MarginBar revenue={f.revenue} cost={f.total_cost} />
                {f.activity_cost > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Incl. {fmt(f.activity_cost)} field activity costs
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ThaiymeChat pageContext="farm_pl" />
    </div>
  );
}
