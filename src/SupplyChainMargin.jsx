/**
 * SupplyChainMargin — Margin Optimization.
 * Landed cost vs sale price, by-category margin, low-margin alerts, market price benchmarks.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import TarrigonChat from './TarrigonChat';

const API = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';

function AddMarginModal({ businessId, onClose, onSaved }) {
  const [form, setForm] = useState({ BusinessID: businessId, Currency: 'USD' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.ProductName || !form.PeriodStart) { alert('Product Name and Period Start are required.'); return; }
    setSaving(true);
    const r = await fetch(`${API}/api/esci/margins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (r.ok) onSaved();
    else alert('Failed to save margin record.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold text-gray-900 text-lg">Add Margin Record</h2>
        <div className="grid grid-cols-2 gap-3">
          {[['Product Name *', 'ProductName', 'text'], ['Category', 'ProductCategory', 'text'],
            ['Period Start *', 'PeriodStart', 'date'], ['Period End', 'PeriodEnd', 'date'],
            ['Qty', 'Qty', 'number'], ['Unit', 'Unit', 'text'],
            ['Landed Cost / Unit', 'LandedCostUnit', 'number'], ['Sale Price / Unit', 'SalePriceUnit', 'number'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type={type} value={form[key] || ''} onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]" />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving}
            className="px-4 py-1.5 text-sm text-white rounded-lg disabled:opacity-50"
            style={{ backgroundColor: TEAL }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SupplyChainMargin() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [records, setRecords]         = useState([]);
  const [summary, setSummary]         = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [marginTrend, setMarginTrend] = useState([]);
  const [contractVsMarket, setContractVsMarket] = useState([]);
  const [tab, setTab]                 = useState('overview');
  const [showModal, setShowModal]     = useState(false);
  const [loading, setLoading]         = useState(true);

  const load = useCallback(() => {
    if (!BusinessID) return;
    const h = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };
    Promise.all([
      fetch(`${API}/api/esci/margins?business_id=${BusinessID}`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/margins/summary?business_id=${BusinessID}&days=90`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/market-prices?business_id=${BusinessID}&limit=20`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/analytics/margin-trends?business_id=${BusinessID}&months=6`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/contract-market-comparison?business_id=${BusinessID}`, { headers: h }).then(r => r.ok ? r.json() : []),
    ]).then(([r, s, mp, mt, cvm]) => {
      setRecords(Array.isArray(r) ? r : []);
      setSummary(Array.isArray(s) ? s : []);
      setMarketPrices(Array.isArray(mp) ? mp : []);
      setMarginTrend(Array.isArray(mt) ? mt : []);
      setContractVsMarket(Array.isArray(cvm) ? cvm : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [BusinessID]);

  useEffect(() => { load(); }, [load]);

  const avgMargin = records.length
    ? (records.filter(r => r.MarginPct != null).reduce((s, r) => s + Number(r.MarginPct), 0) /
       records.filter(r => r.MarginPct != null).length).toFixed(1)
    : null;

  return (
    <AccountLayout
      pageTitle="Margin Optimization"
      breadcrumbs={[
        { label: 'Account', to: '/account' },
        { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` },
        { label: 'Margin' },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">Margin Optimization</h1>
            <p className="text-sm text-gray-500">Landed cost vs sale price, by-category analysis</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm text-white rounded-lg" style={{ backgroundColor: TEAL }}>
            + Add Record
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Avg Margin %</div>
            <div className={`text-2xl font-bold mt-1 ${avgMargin != null && avgMargin < 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {avgMargin != null ? `${avgMargin}%` : '—'}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Lines Below 15%</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {records.filter(r => r.MarginPct != null && Number(r.MarginPct) < 15).length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Total Records</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{records.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {[['overview', 'By Category'], ['records', 'All Records'], ['trends', 'Trend'], ['comparison', 'Contract vs Market'], ['market', 'Market Prices']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${tab === id ? 'border-[#1e6b5a] text-[#1e6b5a]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? <div className="text-sm text-gray-400">Loading…</div> : (
          <>
            {tab === 'overview' && (
              summary.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
                  No margin data yet. Add records to see category analysis.
                </div>
              ) : (
                <div className="space-y-2">
                  {summary.map(s => {
                    const pct = s.avg_margin_pct != null ? Number(s.avg_margin_pct) : null;
                    const barW = pct != null ? Math.min(Math.max(pct, 0), 100) : 0;
                    return (
                      <div key={s.ProductCategory || 'uncategorized'} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{s.ProductCategory || 'Uncategorized'}</span>
                          <span className={`text-sm font-semibold ${pct != null && pct < 10 ? 'text-red-600' : pct < 20 ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {pct != null ? `${pct.toFixed(1)}%` : '—'}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-2 rounded-full transition-all"
                            style={{ width: `${barW}%`, backgroundColor: pct < 10 ? '#dc2626' : pct < 20 ? '#d97706' : TEAL }} />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{s.record_count} records</div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {tab === 'records' && (
              records.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">No records yet.</div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-right">Landed Cost</th>
                        <th className="px-4 py-3 text-right">Sale Price</th>
                        <th className="px-4 py-3 text-right">Margin %</th>
                        <th className="px-4 py-3 text-left">Period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {records.map(r => {
                        const mp = r.MarginPct != null ? Number(r.MarginPct) : null;
                        return (
                          <tr key={r.MarginID} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{r.ProductName}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{r.ProductCategory || '—'}</td>
                            <td className="px-4 py-3 text-right">{r.LandedCostUnit != null ? `$${Number(r.LandedCostUnit).toFixed(4)}` : '—'}</td>
                            <td className="px-4 py-3 text-right">{r.SalePriceUnit != null ? `$${Number(r.SalePriceUnit).toFixed(4)}` : '—'}</td>
                            <td className={`px-4 py-3 text-right font-semibold ${mp != null && mp < 10 ? 'text-red-600' : mp < 20 ? 'text-amber-600' : 'text-emerald-700'}`}>
                              {mp != null ? `${mp.toFixed(1)}%` : '—'}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{r.PeriodStart ? r.PeriodStart.slice(0, 10) : '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === 'trends' && (
              marginTrend.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
                  Not enough data for margin trend analysis yet.
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="text-xs font-semibold text-gray-500 mb-3">Monthly Avg Margin % (last 6 months)</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={marginTrend} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} unit="%" />
                      <Tooltip formatter={v => [`${Number(v).toFixed(1)}%`, 'Avg Margin']} />
                      <ReferenceLine y={15} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Alert threshold', fontSize: 10, fill: '#f59e0b' }} />
                      <Line type="monotone" dataKey="avg_margin_pct" stroke="#1e6b5a" strokeWidth={2.5}
                        dot={{ fill: '#1e6b5a', r: 3 }} activeDot={{ r: 5 }} name="Avg Margin %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )
            )}

            {tab === 'comparison' && (
              contractVsMarket.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
                  No contract vs market comparison data available. Add contracts and market prices to see comparisons.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="text-xs font-semibold text-gray-500 mb-3">Contract Price vs Market Price by Commodity</div>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={contractVsMarket} margin={{ top: 5, right: 16, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="commodity" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="contract_price" name="Contract Price" fill="#1e6b5a" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="market_price"   name="Market Price"   fill="#9ca3af" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-4 py-3 text-left">Commodity</th>
                          <th className="px-4 py-3 text-right">Contract Price</th>
                          <th className="px-4 py-3 text-right">Market Price</th>
                          <th className="px-4 py-3 text-right">Variance</th>
                          <th className="px-4 py-3 text-left">Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {contractVsMarket.map((r, i) => {
                          const diff = r.contract_price != null && r.market_price != null
                            ? Number(r.contract_price) - Number(r.market_price) : null;
                          const pct = diff != null && r.market_price ? (diff / r.market_price * 100) : null;
                          return (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{r.commodity}</td>
                              <td className="px-4 py-3 text-right">{r.contract_price != null ? `$${Number(r.contract_price).toFixed(4)}` : '—'}</td>
                              <td className="px-4 py-3 text-right">{r.market_price != null ? `$${Number(r.market_price).toFixed(4)}` : '—'}</td>
                              <td className={`px-4 py-3 text-right font-semibold ${diff == null ? '' : diff > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                                {diff != null ? `${diff > 0 ? '+' : ''}${pct?.toFixed(1)}%` : '—'}
                              </td>
                              <td className="px-4 py-3 text-gray-500">{r.unit || '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}

            {tab === 'market' && (
              marketPrices.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">No market prices on file.</div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Commodity</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-left">Unit</th>
                        <th className="px-4 py-3 text-left">Market</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {marketPrices.map(p => (
                        <tr key={p.PriceID} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{p.Commodity}</td>
                          <td className="px-4 py-3 text-right">${Number(p.PricePerUnit).toFixed(4)}</td>
                          <td className="px-4 py-3 text-gray-500">{p.Unit || '—'}</td>
                          <td className="px-4 py-3 text-gray-500">{p.Market || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{p.PriceDate ? p.PriceDate.slice(0, 10) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}
      </div>

      {showModal && (
        <AddMarginModal
          businessId={BusinessID}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load(); }}
        />
      )}

      <TarrigonChat businessId={BusinessID} page="supply_chain_margin" />
    </AccountLayout>
  );
}
