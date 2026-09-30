/**
 * SupplyChainControlTower — Single-screen operational command center.
 * Active shipments, open exceptions by severity, demand gaps, quality KPI.
 * Auto-refreshes every 30 seconds.
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import TarrigonChat from './TarrigonChat';

const API  = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';
const REFRESH_INTERVAL = 30_000;

const SEV_COLORS = {
  critical: { bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-700',    badge: 'bg-red-600' },
  high:     { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-500' },
  medium:   { bg: 'bg-amber-50',  border: 'border-amber-300',  text: 'text-amber-700',  badge: 'bg-amber-500' },
  low:      { bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-600',   badge: 'bg-gray-400' },
};

const STATUS_COLOR = {
  pending:    'bg-gray-100 text-gray-700',
  in_transit: 'bg-blue-100 text-blue-700',
  received:   'bg-emerald-100 text-emerald-700',
  rejected:   'bg-red-100 text-red-700',
  overdue:    'bg-red-100 text-red-800 font-semibold',
};

function SectionHeader({ title, count, countColor, link, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase text-gray-600">{title}</span>
        {count != null && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full text-white ${countColor || 'bg-gray-400'}`}>
            {count}
          </span>
        )}
      </div>
      {link && (
        <Link to={link} className="text-xs text-[#1e6b5a] hover:underline">{linkLabel || 'View all'} →</Link>
      )}
    </div>
  );
}

function Ticker({ lastRefresh, onRefresh, refreshing }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(Math.floor((Date.now() - lastRefresh) / 1000));
    }, 5000);
    setElapsed(0);
    return () => clearInterval(t);
  }, [lastRefresh]);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      {refreshing ? (
        <span>Refreshing…</span>
      ) : (
        <span>Updated {elapsed < 10 ? 'just now' : `${elapsed}s ago`}</span>
      )}
      <button onClick={onRefresh} title="Refresh now" className="hover:text-gray-600 transition">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={refreshing ? 'animate-spin' : ''}>
          <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      </button>
    </div>
  );
}

export default function SupplyChainControlTower() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [kpis, setKpis]           = useState(null);
  const [shipments, setShipments] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [gaps, setGaps]           = useState([]);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [refreshing, setRefreshing]   = useState(false);

  const intervalRef = useRef(null);

  const load = useCallback(async () => {
    if (!BusinessID) return;
    setRefreshing(true);
    const token = localStorage.getItem('access_token');
    const h = { Authorization: `Bearer ${token}` };
    try {
      const [kpiRes, shipRes, excRes, demRes, yldRes] = await Promise.all([
        fetch(`${API}/api/esci/dashboard?business_id=${BusinessID}`, { headers: h }),
        fetch(`${API}/api/esci/shipments?business_id=${BusinessID}&limit=30`, { headers: h }),
        fetch(`${API}/api/esci/exceptions?business_id=${BusinessID}&status=open&limit=50`, { headers: h }),
        fetch(`${API}/api/esci/demand-forecasts?business_id=${BusinessID}`, { headers: h }),
        fetch(`${API}/api/esci/yield-forecasts?business_id=${BusinessID}`, { headers: h }),
      ]);
      const [kpiData, shipData, excData, demData, yldData] = await Promise.all([
        kpiRes.ok ? kpiRes.json() : null,
        shipRes.ok ? shipRes.json() : [],
        excRes.ok ? excRes.json() : [],
        demRes.ok ? demRes.json() : [],
        yldRes.ok ? yldRes.json() : [],
      ]);

      setKpis(kpiData);
      setShipments(Array.isArray(shipData) ? shipData : []);
      setExceptions(Array.isArray(excData) ? excData : []);

      // Compute demand gaps client-side
      const supplyMap = {};
      (Array.isArray(yldData) ? yldData : []).forEach(f => {
        const key = (f.ProductName || '').toLowerCase();
        supplyMap[key] = (supplyMap[key] || 0) + (Number(f.ForecastQty) || 0);
      });
      const gapList = (Array.isArray(demData) ? demData : []).map(df => {
        const key = (df.ProductName || '').toLowerCase();
        const sup = supplyMap[key] || 0;
        const dem = Number(df.ForecastQty) || 0;
        return { product: df.ProductName, unit: df.Unit, demand: dem, supply: sup, gap: dem - sup, shortfall: dem > sup };
      }).filter(g => g.shortfall).sort((a, b) => b.gap - a.gap);
      setGaps(gapList);
    } catch {}
    setRefreshing(false);
    setLastRefresh(Date.now());
  }, [BusinessID]);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [load]);

  const today = new Date().toISOString().slice(0, 10);
  const inTransit = shipments.filter(s => s.Status === 'in_transit');
  const overdue   = shipments.filter(s =>
    ['pending', 'in_transit'].includes(s.Status) &&
    s.ExpectedDate && s.ExpectedDate.slice(0, 10) < today
  );
  const dueToday  = shipments.filter(s =>
    ['pending', 'in_transit'].includes(s.Status) &&
    s.ExpectedDate && s.ExpectedDate.slice(0, 10) === today
  );

  const excBySev = { critical: [], high: [], medium: [], low: [] };
  exceptions.forEach(e => {
    const k = e.Severity || 'low';
    (excBySev[k] || (excBySev.low)).push(e);
  });

  return (
    <AccountLayout
      pageTitle="Control Tower"
      breadcrumbs={[
        { label: 'Account', to: '/account' },
        { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` },
        { label: 'Control Tower' },
      ]}
    >
      <div className="max-w-7xl mx-auto p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">Control Tower</h1>
            <p className="text-sm text-gray-500">Live operational view — auto-refreshes every 30s</p>
          </div>
          <Ticker lastRefresh={lastRefresh} onRefresh={load} refreshing={refreshing} />
        </div>

        {/* KPI strip */}
        {kpis && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'In Transit',        value: kpis.shipments_in_transit,  alert: false },
              { label: 'Overdue',           value: kpis.shipments_overdue,     alert: kpis.shipments_overdue > 0 },
              { label: 'Open Exceptions',   value: kpis.exceptions_open,       alert: kpis.exceptions_critical > 0 },
              { label: 'Critical',          value: kpis.exceptions_critical,   alert: kpis.exceptions_critical > 0 },
              { label: 'Quality Pass (30d)', value: kpis.quality_pass_rate_pct != null ? `${kpis.quality_pass_rate_pct}%` : '—',
                alert: kpis.quality_pass_rate_pct != null && kpis.quality_pass_rate_pct < 80 },
            ].map(({ label, value, alert }) => (
              <div key={label} className={`bg-white border rounded-xl p-3 ${alert ? 'border-red-300' : 'border-gray-200'}`}>
                <div className="text-[10px] uppercase font-semibold text-gray-500">{label}</div>
                <div className={`text-xl font-bold mt-0.5 ${alert ? 'text-red-600' : 'text-gray-900'}`}>{value ?? '—'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Main grid: 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Shipments column ── */}
          <div className="space-y-4">
            {/* Overdue */}
            <div className="bg-white border border-red-200 rounded-xl p-4">
              <SectionHeader title="Overdue Shipments" count={overdue.length}
                countColor={overdue.length > 0 ? 'bg-red-600' : 'bg-gray-400'}
                link={`/supply-chain/visibility?BusinessID=${BusinessID}`} />
              {overdue.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">None overdue.</div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {overdue.slice(0, 8).map(s => (
                    <div key={s.ShipmentID} className="flex items-center justify-between text-xs gap-2">
                      <span className="font-medium text-gray-900 truncate">{s.ProductName}</span>
                      <span className="text-red-600 shrink-0">{s.ExpectedDate?.slice(0, 10) || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Due today */}
            <div className="bg-white border border-amber-200 rounded-xl p-4">
              <SectionHeader title="Due Today" count={dueToday.length}
                countColor={dueToday.length > 0 ? 'bg-amber-500' : 'bg-gray-400'}
                link={`/supply-chain/visibility?BusinessID=${BusinessID}`} />
              {dueToday.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">Nothing due today.</div>
              ) : (
                <div className="space-y-2">
                  {dueToday.slice(0, 5).map(s => (
                    <div key={s.ShipmentID} className="flex items-center justify-between text-xs gap-2">
                      <span className="font-medium text-gray-900 truncate">{s.ProductName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLOR[s.Status] || ''}`}>{s.Status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* In transit timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <SectionHeader title="In Transit" count={inTransit.length}
                countColor="bg-blue-500"
                link={`/supply-chain/visibility?BusinessID=${BusinessID}`} />
              {inTransit.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">No shipments in transit.</div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {inTransit.slice(0, 10).map(s => {
                    const isLate = s.ExpectedDate && s.ExpectedDate.slice(0, 10) < today;
                    return (
                      <div key={s.ShipmentID} className="text-xs">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900 truncate">{s.ProductName}</span>
                          <span className={isLate ? 'text-red-600' : 'text-gray-500'}>
                            {s.ExpectedDate?.slice(0, 10) || '—'}
                          </span>
                        </div>
                        {s.SupplierName && <div className="text-gray-400 truncate">{s.SupplierName}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Exceptions column ── */}
          <div className="space-y-3">
            <SectionHeader title="Open Exceptions" count={exceptions.length}
              countColor={excBySev.critical.length > 0 ? 'bg-red-600' : 'bg-amber-500'}
              link={`/supply-chain/exceptions?BusinessID=${BusinessID}`} />

            {['critical', 'high', 'medium', 'low'].map(sev => {
              const list = excBySev[sev];
              if (list.length === 0) return null;
              const c = SEV_COLORS[sev];
              return (
                <div key={sev} className={`border rounded-xl p-3 ${c.bg} ${c.border}`}>
                  <div className={`text-[10px] uppercase font-bold mb-2 ${c.text} flex items-center gap-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${c.badge}`} />
                    {sev} ({list.length})
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {list.slice(0, 6).map(e => (
                      <div key={e.ExceptionID} className="bg-white/70 rounded-lg px-2.5 py-1.5 text-xs">
                        <div className="font-medium text-gray-900 line-clamp-1">{e.Title}</div>
                        {e.SupplierName && <div className="text-gray-500 text-[10px]">{e.SupplierName}</div>}
                      </div>
                    ))}
                    {list.length > 6 && (
                      <div className={`text-[10px] ${c.text} text-center`}>+{list.length - 6} more</div>
                    )}
                  </div>
                </div>
              );
            })}

            {exceptions.length === 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <div className="text-emerald-700 text-sm font-medium">All clear</div>
                <div className="text-emerald-600 text-xs mt-1">No open exceptions</div>
              </div>
            )}
          </div>

          {/* ── Right column: Quality + Gaps ── */}
          <div className="space-y-4">
            {/* Quality KPI */}
            {kpis && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <SectionHeader title="Quality (30 days)"
                  link={`/supply-chain/quality?BusinessID=${BusinessID}`} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Pass Rate</div>
                    <div className={`text-2xl font-bold mt-0.5 ${kpis.quality_pass_rate_pct != null && kpis.quality_pass_rate_pct < 80 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {kpis.quality_pass_rate_pct != null ? `${kpis.quality_pass_rate_pct}%` : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Tests</div>
                    <div className="text-2xl font-bold text-gray-900 mt-0.5">{kpis.quality_tests_30d ?? '—'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Avg margin */}
            {kpis?.avg_margin_pct_90d != null && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <SectionHeader title="Avg Margin (90d)"
                  link={`/supply-chain/margin?BusinessID=${BusinessID}`} />
                <div className={`text-2xl font-bold mt-1 ${kpis.avg_margin_pct_90d < 10 ? 'text-red-600' : kpis.avg_margin_pct_90d < 20 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {kpis.avg_margin_pct_90d.toFixed(1)}%
                </div>
              </div>
            )}

            {/* Demand gaps */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <SectionHeader title="Demand Shortfalls" count={gaps.length}
                countColor={gaps.length > 0 ? 'bg-amber-500' : 'bg-gray-400'}
                link={`/supply-chain/forecasting?BusinessID=${BusinessID}`} />
              {gaps.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">No shortfalls detected.</div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {gaps.slice(0, 8).map((g, i) => {
                    const pct = g.demand > 0 ? Math.round(g.gap / g.demand * 100) : null;
                    return (
                      <div key={i} className="text-xs bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">{g.product}</span>
                          <span className="text-amber-700 font-semibold">{pct != null ? `−${pct}%` : ''}</span>
                        </div>
                        <div className="text-gray-500 mt-0.5">
                          Gap: {Math.abs(g.gap).toLocaleString()} {g.unit || ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TarrigonChat businessId={BusinessID} page="supply_chain_control_tower" />
    </AccountLayout>
  );
}
