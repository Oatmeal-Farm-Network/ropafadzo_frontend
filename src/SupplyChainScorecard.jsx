/**
 * SupplyChainScorecard — Supplier performance scorecards with composite scoring.
 * Delivery 40% + Quality 40% + Exception load 20%.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import TarrigonChat from './TarrigonChat';

const API  = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';

function scoreColor(s) {
  if (s == null) return '#9ca3af';
  if (s >= 80) return '#1e6b5a';
  if (s >= 60) return '#d97706';
  return '#dc2626';
}

function ScoreBar({ label, value, weight }) {
  const pct = value != null ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-0.5">
        <span>{label} <span className="text-gray-400">({weight})</span></span>
        <span style={{ color: scoreColor(value) }} className="font-semibold">
          {value != null ? value.toFixed(0) : '—'}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: scoreColor(value) }} />
      </div>
    </div>
  );
}

function SupplierCard({ s, expanded, onToggle }) {
  const score = s.composite_score;
  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition ${score != null && score < 60 ? 'border-red-300' : score < 80 ? 'border-amber-200' : 'border-gray-200'}`}>
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3">
          {/* Score circle */}
          <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-lg"
            style={{ backgroundColor: scoreColor(score) }}>
            {score != null ? score.toFixed(0) : '—'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900">{s.SupplierName}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {s.Country && <span>{s.Country}</span>}
              {s.Region && <span> · {s.Region}</span>}
              {(s.CertifiedOrganic || s.CertifiedGAP || s.GlobalGAP) && (
                <span className="ml-1">
                  {s.CertifiedOrganic ? ' · Organic' : ''}
                  {s.CertifiedGAP ? ' · GAP' : ''}
                  {s.GlobalGAP ? ' · GlobalGAP' : ''}
                </span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-gray-400">{s.total_shipments || 0} shipments</div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" className={`ml-auto transition-transform ${expanded ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {/* Sub-score bars */}
        <div className="mt-3 space-y-1.5">
          <ScoreBar label="Delivery" value={s.delivery_score} weight="40%" />
          <ScoreBar label="Quality"  value={s.quality_score}  weight="40%" />
          <ScoreBar label="Exceptions" value={s.exception_score} weight="20%" />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
          <div>
            <div className="text-gray-500">Received</div>
            <div className="font-semibold text-gray-900">{s.received_count ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-500">Rejected</div>
            <div className="font-semibold text-red-600">{s.rejected_count ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-500">Quality Tests</div>
            <div className="font-semibold text-gray-900">{s.quality_tests ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-500">Quality Failures</div>
            <div className="font-semibold text-red-600">{s.quality_fails ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-500">Avg Delay (days)</div>
            <div className="font-semibold text-gray-900">
              {s.avg_delay_days != null ? Number(s.avg_delay_days).toFixed(1) : '—'}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Open Exceptions</div>
            <div className="font-semibold text-amber-600">{s.open_exceptions ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-500">On-Time Rate</div>
            <div className="font-semibold text-gray-900">
              {s.on_time_pct != null ? `${Number(s.on_time_pct).toFixed(0)}%` : '—'}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Quality Pass Rate</div>
            <div className="font-semibold text-gray-900">
              {s.quality_pass_pct != null ? `${Number(s.quality_pass_pct).toFixed(0)}%` : '—'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-md text-xs">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      <p style={{ color: scoreColor(d.composite_score) }}>Composite: {d.composite_score?.toFixed(0) ?? '—'}</p>
      <p className="text-gray-500">Delivery: {d.delivery_score?.toFixed(0) ?? '—'}</p>
      <p className="text-gray-500">Quality: {d.quality_score?.toFixed(0) ?? '—'}</p>
      <p className="text-gray-500">Exceptions: {d.exception_score?.toFixed(0) ?? '—'}</p>
    </div>
  );
};

export default function SupplyChainScorecard() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);
  const [view, setView]           = useState('cards');
  const [sort, setSort]           = useState('score');

  const load = useCallback(() => {
    if (!BusinessID) return;
    setLoading(true);
    fetch(`${API}/api/esci/scorecard?business_id=${BusinessID}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    })
      .then(r => r.ok ? r.json() : { suppliers: [] })
      .then(d => {
        setSuppliers(Array.isArray(d?.suppliers) ? d.suppliers : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [BusinessID]);

  useEffect(() => { load(); }, [load]);

  const sorted = [...suppliers].sort((a, b) => {
    if (sort === 'score') return (b.composite_score ?? 0) - (a.composite_score ?? 0);
    if (sort === 'name')  return (a.SupplierName || '').localeCompare(b.SupplierName || '');
    if (sort === 'risk')  return (a.composite_score ?? 100) - (b.composite_score ?? 100);
    return 0;
  });

  const chartData = sorted.map(s => ({
    name: s.SupplierName?.split(' ')[0] || `#${s.SupplierID}`,
    composite_score: s.composite_score,
    delivery_score:  s.delivery_score,
    quality_score:   s.quality_score,
    exception_score: s.exception_score,
  }));

  const atRisk    = suppliers.filter(s => s.composite_score != null && s.composite_score < 60).length;
  const avgScore  = suppliers.length
    ? (suppliers.filter(s => s.composite_score != null).reduce((a, s) => a + s.composite_score, 0) /
       suppliers.filter(s => s.composite_score != null).length)
    : null;

  return (
    <AccountLayout
      pageTitle="Supplier Scorecards"
      breadcrumbs={[
        { label: 'Account', to: '/account' },
        { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` },
        { label: 'Scorecards' },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">Supplier Scorecards</h1>
            <p className="text-sm text-gray-500">Composite score: Delivery 40% · Quality 40% · Exceptions 20%</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Suppliers</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{suppliers.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Avg Score</div>
            <div className="text-2xl font-bold mt-1" style={{ color: scoreColor(avgScore) }}>
              {avgScore != null ? avgScore.toFixed(0) : '—'}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] uppercase font-semibold text-gray-500">At Risk (&lt;60)</div>
            <div className={`text-2xl font-bold mt-1 ${atRisk > 0 ? 'text-red-600' : 'text-gray-900'}`}>{atRisk}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1">
            {['cards', 'chart'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 text-xs rounded-full border transition ${view === v ? 'text-white border-[#1e6b5a]' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                style={view === v ? { backgroundColor: TEAL } : {}}>
                {v === 'cards' ? 'Cards' : 'Chart'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto text-xs text-gray-500">
            Sort:
            {[['score', 'Best First'], ['risk', 'At Risk First'], ['name', 'Name']].map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)}
                className={`px-2 py-1 rounded border transition ${sort === k ? 'text-white border-[#1e6b5a]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                style={sort === k ? { backgroundColor: TEAL } : {}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Loading scorecards…</div>
        ) : suppliers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
            No active suppliers found. Add suppliers to see scorecards.
          </div>
        ) : view === 'chart' ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-gray-500 mb-3">Composite Score by Supplier</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="composite_score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={scoreColor(entry.composite_score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map(s => (
              <SupplierCard
                key={s.SupplierID}
                s={s}
                expanded={expanded === s.SupplierID}
                onToggle={() => setExpanded(expanded === s.SupplierID ? null : s.SupplierID)}
              />
            ))}
          </div>
        )}
      </div>

      <TarrigonChat businessId={BusinessID} page="supply_chain_scorecard" />
    </AccountLayout>
  );
}
