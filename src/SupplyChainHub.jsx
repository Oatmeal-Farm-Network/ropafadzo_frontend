/**
 * SupplyChainHub — landing page for Enterprise Supply Chain Intelligence.
 * KPI cards + tile links to 5 sub-modules + Tarrigon AI chat.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import TarrigonChat from './TarrigonChat';

const API = import.meta.env.VITE_API_URL || '';

const TEAL = '#1e6b5a';
const TEAL_LIGHT = '#e8f5f1';

const S = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"
    style={{ color: TEAL }}>
    {children}
  </svg>
);

const ICONS = {
  visibility: <S><circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/></S>,
  quality:    <S><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></S>,
  margin:     <S><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></S>,
  forecasting:<S><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></S>,
  exceptions: <S><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></S>,
  settings:   <S><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></S>,
};

const TILES = [
  { slug: 'visibility',     icon: ICONS.visibility,  title: 'Visibility',          desc: 'Farm → DC → shelf. Shipment tracking, carrier status, on-time rates.' },
  { slug: 'quality',        icon: ICONS.quality,     title: 'Quality & Yield',      desc: 'Inspection results, quality grades, yield forecasts vs actuals.' },
  { slug: 'margin',         icon: ICONS.margin,      title: 'Margin Optimization',  desc: 'Landed cost vs sale price, by-category margin analysis, low-margin alerts.' },
  { slug: 'forecasting',   icon: ICONS.forecasting, title: 'Demand & Supply',      desc: 'Demand forecasts vs supply forecasts, gap analysis by product.' },
  { slug: 'exceptions',    icon: ICONS.exceptions,  title: 'Exception Management', desc: 'Quality failures, temperature breaches, volume shortfalls, delays.' },
  { slug: 'scorecard',     icon: ICONS.settings,    title: 'Supplier Scorecards',  desc: 'Composite performance scores: delivery, quality, exception load.' },
  { slug: 'control-tower', icon: ICONS.forecasting, title: 'Control Tower',        desc: 'Live operational command center — shipments, exceptions, gaps.' },
];

const fmt = (n) => Number(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 1 });

function KpiCard({ label, value, sub, alert }) {
  return (
    <div className={`bg-white border rounded-xl p-4 ${alert ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="text-[10px] uppercase font-semibold text-gray-500">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${alert ? 'text-red-600' : 'text-gray-900'}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function SupplyChainHub() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [qualityTrend, setQualityTrend] = useState([]);
  const [excTrend, setExcTrend]   = useState([]);

  useEffect(() => {
    if (!BusinessID) return;
    setLoading(true);
    const h = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };
    Promise.all([
      fetch(`${API}/api/esci/dashboard?business_id=${BusinessID}`, { headers: h })
        .then(r => r.ok ? r.json() : null),
      fetch(`${API}/api/esci/analytics/quality-trends?business_id=${BusinessID}&weeks=8`, { headers: h })
        .then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/analytics/exception-trends?business_id=${BusinessID}&weeks=8`, { headers: h })
        .then(r => r.ok ? r.json() : []),
    ]).then(([d, qt, et]) => {
      setData(d);
      setQualityTrend(Array.isArray(qt) ? qt : []);
      setExcTrend(Array.isArray(et) ? et : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [BusinessID]);

  if (!BusinessID) {
    return (
      <AccountLayout pageTitle="Supply Chain Intelligence">
        <div className="p-6 text-sm text-gray-500">Select a business account to continue.</div>
      </AccountLayout>
    );
  }

  const v = loading ? null : data;
  const criticalAlert = v && (v.exceptions_critical > 0 || v.shipments_overdue > 0);

  return (
    <AccountLayout
      pageTitle="Supply Chain Intelligence"
      breadcrumbs={[{ label: 'Account', to: '/account' }, { label: 'Supply Chain' }]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-6">
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900">Supply Chain Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">
            Farm to shelf — powered by Tarrigon AI
          </p>
        </div>

        {criticalAlert && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-sm text-red-900 flex flex-wrap gap-x-4 gap-y-1">
            {v.exceptions_critical > 0 && (
              <span><strong>{v.exceptions_critical}</strong> critical exception{v.exceptions_critical !== 1 ? 's' : ''} open</span>
            )}
            {v.shipments_overdue > 0 && (
              <span><strong>{v.shipments_overdue}</strong> overdue shipment{v.shipments_overdue !== 1 ? 's' : ''}</span>
            )}
          </div>
        )}

        {/* KPI strip */}
        <div>
          <div className="text-xs uppercase font-semibold text-gray-500 mb-2">Key Indicators</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard
              label="Active Suppliers"
              value={loading ? '…' : fmt(v?.suppliers_active)}
              sub={`${fmt(v?.contracts_active)} contracts`}
            />
            <KpiCard
              label="In Transit"
              value={loading ? '…' : fmt(v?.shipments_in_transit)}
              sub={`${fmt(v?.shipments_due_7d)} due this week`}
            />
            <KpiCard
              label="Quality Pass Rate (30d)"
              value={loading ? '…' : (v?.quality_pass_rate_pct != null ? `${v.quality_pass_rate_pct}%` : '—')}
              sub={`${fmt(v?.quality_tests_30d)} tests`}
            />
            <KpiCard
              label="Avg Margin (90d)"
              value={loading ? '…' : (v?.avg_margin_pct_90d != null ? `${v.avg_margin_pct_90d}%` : '—')}
              sub="landed cost basis"
            />
          </div>
        </div>

        {/* Exception/overdue strip */}
        {v && (
          <div className="grid grid-cols-2 gap-3">
            <KpiCard
              label="Open Exceptions"
              value={fmt(v.exceptions_open)}
              sub={v.exceptions_critical > 0 ? `${v.exceptions_critical} critical` : 'none critical'}
              alert={v.exceptions_critical > 0}
            />
            <KpiCard
              label="Overdue Shipments"
              value={fmt(v.shipments_overdue)}
              sub="past expected date"
              alert={v.shipments_overdue > 0}
            />
          </div>
        )}

        {/* Trend sparklines */}
        {(qualityTrend.length > 0 || excTrend.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {qualityTrend.length > 0 && (
              <Link to={`/supply-chain/quality?BusinessID=${BusinessID}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-gray-600">Quality Pass Rate (8 weeks)</div>
                  {qualityTrend.length > 0 && (
                    <span className="text-xs font-bold" style={{ color: TEAL }}>
                      {qualityTrend[qualityTrend.length - 1]?.pass_rate != null
                        ? `${Number(qualityTrend[qualityTrend.length - 1].pass_rate).toFixed(0)}%` : '—'}
                    </span>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={qualityTrend} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="qGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TEAL} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={TEAL} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip formatter={v => [`${Number(v).toFixed(1)}%`, 'Pass Rate']} labelFormatter={l => `Wk: ${l}`} />
                    <Area type="monotone" dataKey="pass_rate" stroke={TEAL} strokeWidth={2} fill="url(#qGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Link>
            )}
            {excTrend.length > 0 && (
              <Link to={`/supply-chain/exceptions?BusinessID=${BusinessID}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-gray-600">Exceptions (8 weeks)</div>
                  {excTrend.length > 0 && (
                    <span className="text-xs font-bold text-amber-600">
                      {excTrend[excTrend.length - 1]?.total ?? '—'} this week
                    </span>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={excTrend} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip formatter={v => [v, 'Exceptions']} labelFormatter={l => `Wk: ${l}`} />
                    <Area type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} fill="url(#eGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Link>
            )}
          </div>
        )}

        {/* Module tiles */}
        <div>
          <div className="text-xs uppercase font-semibold text-gray-500 mb-2">Modules</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TILES.map(tile => (
              <Link
                key={tile.slug}
                to={`/supply-chain/${tile.slug}?BusinessID=${BusinessID}`}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3 hover:border-[#1e6b5a] hover:shadow-sm transition"
              >
                <div className="mt-0.5">{tile.icon}</div>
                <div>
                  <div className="font-semibold text-gray-900">{tile.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{tile.desc}</div>
                </div>
              </Link>
            ))}
            <Link
              to={`/supply-chain/settings?BusinessID=${BusinessID}`}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3 hover:border-[#1e6b5a] hover:shadow-sm transition"
            >
              <div className="mt-0.5">{ICONS.settings}</div>
              <div>
                <div className="font-semibold text-gray-900">Settings</div>
                <div className="text-xs text-gray-600 mt-0.5">Configure thresholds, alerts, currency, and email notifications.</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <TarrigonChat businessId={BusinessID} page="supply_chain_hub" />
    </AccountLayout>
  );
}
