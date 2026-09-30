/**
 * AggregatorHub — landing page for Food Aggregation tools.
 *
 * Top-level KPI cards across all 4 subdashboards (Farms, Produce, Logistics,
 * Sales) plus tile links to each. Pulls everything from the single
 * GET /api/aggregator/{businessId}/dashboard summary endpoint.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';

const S = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#3D6B34]">
    {children}
  </svg>
);

const TILE_ICONS = {
  farms: <S><path d="M8 14V9"/><path d="M4 6c0-2.5 2-4 4-4s4 1.5 4 4-2 3-4 3-4-.5-4-3z"/></S>,
  produce: <S><path d="M2 5h12l-1.5 7H3.5z"/><path d="M5.5 5L6.5 2M10.5 5l-1-3"/><circle cx="5.5" cy="13.5" r="0.8" fill="currentColor" stroke="none"/><circle cx="10.5" cy="13.5" r="0.8" fill="currentColor" stroke="none"/></S>,
  logistics: <S><rect x="1" y="7" width="10" height="6" rx="1"/><path d="M11 9h2l2 2v2h-4V9z"/><circle cx="4" cy="13.5" r="1.2"/><circle cx="12" cy="13.5" r="1.2"/><line x1="1" y1="4" x2="9" y2="4"/><line x1="3" y1="2" x2="3" y2="7"/><line x1="7" y1="2" x2="7" y2="7"/></S>,
  sales: <S><line x1="5" y1="2" x2="5" y2="14"/><path d="M3 2v4a2 2 0 0 0 4 0V2"/><line x1="11" y1="2" x2="11" y2="14"/><path d="M9 2h3a0 0 0 0 1 0 4v0"/></S>,
  esg: <S><circle cx="8" cy="8" r="6"/><path d="M8 2c-2 1.5-3 3.5-3 6s1 4.5 3 6"/><path d="M8 2c2 1.5 3 3.5 3 6s-1 4.5-3 6"/><line x1="2" y1="8" x2="14" y2="8"/></S>,
  accounting: <S><rect x="2" y="3" width="12" height="10" rx="1"/><line x1="5" y1="7" x2="11" y2="7"/><line x1="5" y1="10" x2="9" y2="10"/><line x1="12" y1="13" x2="12" y2="16"/><line x1="10" y1="15" x2="14" y2="15"/></S>,
};

const fmt$  = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
const fmtKg = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 1 });

export default function AggregatorHub() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const TILES = [
    { slug: 'farms',      icon: TILE_ICONS.farms,      title: t('aggregator_hub.tile_farms'),      desc: t('aggregator_hub.tile_farms_desc') },
    { slug: 'produce',    icon: TILE_ICONS.produce,    title: t('aggregator_hub.tile_produce'),    desc: t('aggregator_hub.tile_produce_desc') },
    { slug: 'logistics',  icon: TILE_ICONS.logistics,  title: t('aggregator_hub.tile_logistics'),  desc: t('aggregator_hub.tile_logistics_desc') },
    { slug: 'sales',      icon: TILE_ICONS.sales,      title: t('aggregator_hub.tile_sales'),      desc: t('aggregator_hub.tile_sales_desc') },
    { slug: 'esg',        icon: TILE_ICONS.esg,        title: t('aggregator_hub.tile_esg'),        desc: t('aggregator_hub.tile_esg_desc') },
    { slug: 'accounting', icon: TILE_ICONS.accounting, title: t('aggregator_hub.tile_accounting'), desc: t('aggregator_hub.tile_accounting_desc') },
  ];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acct, setAcct] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  useEffect(() => {
    if (!BusinessID) return;
    setLoading(true);
    fetch(`${API}/api/aggregator/${BusinessID}/dashboard`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
    fetch(`${API}/api/aggregator/${BusinessID}/accounting/summary`)
      .then(r => r.ok ? r.json() : null)
      .then(setAcct)
      .catch(() => {});
  }, [BusinessID]);

  const syncAccounting = async () => {
    setSyncing(true); setSyncMsg(null);
    try {
      const r = await fetch(`${API}/api/aggregator/${BusinessID}/accounting/sync`, { method: 'POST' });
      if (r.ok) {
        const res = await r.json();
        setSyncMsg(t('aggregator_hub.sync_result', { invoices: res.invoices_created, bills: res.bills_created, customers: res.customers_created, vendors: res.vendors_created }));
        fetch(`${API}/api/aggregator/${BusinessID}/accounting/summary`)
          .then(r2 => r2.ok ? r2.json() : null)
          .then(setAcct);
      } else {
        const err = await r.json().catch(() => ({}));
        setSyncMsg(t('aggregator_hub.sync_error', { detail: err.detail || t('aggregator_hub.sync_failed') }));
      }
    } catch { setSyncMsg(t('aggregator_hub.sync_network_error')); }
    setSyncing(false);
  };

  if (!BusinessID) {
    return (
      <AccountLayout pageTitle={t('aggregator_hub.page_title')}>
        <div className="p-6 text-sm text-gray-500">{t('aggregator_hub.no_business')}</div>
      </AccountLayout>
    );
  }

  const kpi = (label, value, sub) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-[10px] uppercase font-semibold text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );

  const breaches = data?.logistics?.cold_chain_breaches_7d || 0;
  const onHold   = data?.inventory?.items_on_hold || 0;

  return (
    <AccountLayout
      pageTitle={t('aggregator_hub.page_title')}
      breadcrumbs={[{ label: t('aggregator_hub.breadcrumb_account'), to: '/account' }, { label: t('aggregator_hub.page_title') }]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-6">
        <div>
          <h1 className="font-lora text-2xl font-bold text-gray-900">{t('aggregator_hub.heading')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('aggregator_hub.subheading')}
          </p>
        </div>

        {(breaches > 0 || onHold > 0) && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-sm text-amber-900 flex flex-wrap gap-x-4 gap-y-1">
            {breaches > 0 && <span><strong>{breaches}</strong> {t('aggregator_hub.alert_breaches', { count: breaches })}</span>}
            {onHold > 0 && <span><strong>{onHold}</strong> {t('aggregator_hub.alert_on_hold', { count: onHold })}</span>}
          </div>
        )}

        {/* Top-line KPIs (last 30 days) */}
        <div>
          <div className="text-xs uppercase font-semibold text-gray-500 mb-2">{t('aggregator_hub.last_30d')}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to={`/aggregator/farms?BusinessID=${BusinessID}`}
                  className="block hover:ring-2 hover:ring-[#819360] rounded-xl transition">
              {kpi(t('aggregator_hub.kpi_farms'), loading ? '…' : data?.farms?.active ?? 0,
                   t('aggregator_hub.kpi_farms_sub', { count: data?.contracts?.active ?? 0 }))}
            </Link>
            {kpi(t('aggregator_hub.kpi_spend'), loading ? '…' : '$' + fmt$(data?.purchases?.spend_30d),
                 t('aggregator_hub.kpi_spend_sub', { kg: fmtKg(data?.purchases?.kg_30d) }))}
            {kpi(t('aggregator_hub.kpi_inventory'), loading ? '…' : fmtKg(data?.inventory?.current_kg) + ' kg',
                 t('aggregator_hub.kpi_inventory_sub'))}
            {kpi(t('aggregator_hub.kpi_revenue'), loading ? '…' :
                 '$' + fmt$((data?.sales?.b2b_revenue_30d || 0) + (data?.sales?.d2c_revenue_30d || 0)),
                 t('aggregator_hub.kpi_revenue_sub', { count: (data?.sales?.b2b_orders_30d ?? 0) + (data?.sales?.d2c_orders_30d ?? 0) }))}
          </div>
        </div>

        {/* B2B vs D2C breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="font-semibold text-gray-900 mb-1">{t('aggregator_hub.b2b_title')}</div>
            <div className="text-xs text-gray-500 mb-3">{t('aggregator_hub.b2b_sub')}</div>
            <div className="text-2xl font-bold text-gray-900">${fmt$(data?.sales?.b2b_revenue_30d)}</div>
            <div className="text-xs text-gray-500">{t('aggregator_hub.orders_30d', { count: data?.sales?.b2b_orders_30d ?? 0 })}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="font-semibold text-gray-900 mb-1">{t('aggregator_hub.d2c_title')}</div>
            <div className="text-xs text-gray-500 mb-3">{t('aggregator_hub.d2c_sub')}</div>
            <div className="text-2xl font-bold text-gray-900">${fmt$(data?.sales?.d2c_revenue_30d)}</div>
            <div className="text-xs text-gray-500">{t('aggregator_hub.orders_30d', { count: data?.sales?.d2c_orders_30d ?? 0 })}</div>
            {data?.sales?.d2c_by_channel?.length > 0 && (
              <div className="mt-3 space-y-1">
                {data.sales.d2c_by_channel.map(c => (
                  <div key={c.Channel} className="flex justify-between text-xs">
                    <span className="text-gray-700">{c.Channel}</span>
                    <span className="text-gray-500">${fmt$(c.Revenue)} · {c.Orders}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Accounting summary */}
        {acct?.setup && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="font-semibold text-gray-900">{t('aggregator_hub.acct_title')}</div>
              <div className="flex items-center gap-2">
                {(acct.unposted_orders > 0 || acct.unposted_purchases > 0) && (
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                    {t('aggregator_hub.acct_unposted', { orders: acct.unposted_orders, purchases: acct.unposted_purchases })}
                  </span>
                )}
                <button
                  onClick={syncAccounting}
                  disabled={syncing}
                  className="px-3 py-1 text-xs bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50">
                  {syncing ? t('aggregator_hub.acct_syncing') : t('aggregator_hub.acct_sync_btn')}
                </button>
              </div>
            </div>
            {syncMsg && (
              <div className={`text-xs rounded-lg px-3 py-2 ${syncMsg.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {syncMsg}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="border border-gray-100 rounded-xl p-3">
                <div className="text-[10px] uppercase font-semibold text-gray-500">{t('aggregator_hub.acct_ar')}</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">${fmt$(acct.ar?.total)}</div>
                <div className="text-xs text-gray-500">{t('aggregator_hub.acct_invoices', { count: acct.ar?.open_count })}</div>
              </div>
              <div className="border border-gray-100 rounded-xl p-3">
                <div className="text-[10px] uppercase font-semibold text-gray-500">{t('aggregator_hub.acct_ap')}</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">${fmt$(acct.ap?.total)}</div>
                <div className="text-xs text-gray-500">{t('aggregator_hub.acct_bills', { count: acct.ap?.open_count })}</div>
              </div>
              <div className="border border-gray-100 rounded-xl p-3">
                <div className="text-[10px] uppercase font-semibold text-gray-500">{t('aggregator_hub.acct_revenue')}</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">${fmt$(acct.revenue?.total)}</div>
                <div className="text-xs text-gray-500">{t('aggregator_hub.acct_revenue_sub', { b2b: fmt$(acct.revenue?.b2b), d2c: fmt$(acct.revenue?.d2c) })}</div>
              </div>
              <div className="border border-gray-100 rounded-xl p-3">
                <div className="text-[10px] uppercase font-semibold text-gray-500">{t('aggregator_hub.acct_margin')}</div>
                <div className={`text-xl font-bold mt-0.5 ${acct.gross_margin >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>${fmt$(acct.gross_margin)}</div>
                <div className="text-xs text-gray-500">{t('aggregator_hub.acct_margin_sub', { pct: acct.gross_margin_pct, cogs: fmt$(acct.cogs) })}</div>
              </div>
            </div>
          </div>
        )}
        {acct && !acct.setup && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
            {t('aggregator_hub.acct_not_setup')}
          </div>
        )}

        <div>
          <div className="text-xs uppercase font-semibold text-gray-500 mb-2">{t('aggregator_hub.manage_label')}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TILES.map(tile => (
              <Link key={tile.slug}
                    to={tile.slug === 'accounting'
                        ? `/account/accounting?BusinessID=${BusinessID}`
                        : `/aggregator/${tile.slug}?BusinessID=${BusinessID}`}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3 hover:border-[#819360] hover:shadow-sm transition">
                <div className="mt-0.5">{tile.icon}</div>
                <div>
                  <div className="font-semibold text-gray-900">{tile.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{tile.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 italic pt-2">
          {t('aggregator_hub.inputs_footer', { cost: fmt$(data?.inputs?.cost_30d) })}
        </div>
      </div>
    </AccountLayout>
  );
}
