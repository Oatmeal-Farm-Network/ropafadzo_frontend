/**
 * SupplyChainForecasting — Demand & Supply Forecasting.
 * Demand forecasts, yield forecasts, gap analysis (shortfalls / surplus).
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import TarrigonChat from './TarrigonChat';

const API = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';

function AddForecastModal({ businessId, type, onClose, onSaved }) {
  const [form, setForm] = useState({ BusinessID: businessId });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isDemand = type === 'demand';

  const save = async () => {
    const url = isDemand ? `${API}/api/esci/demand-forecasts` : `${API}/api/esci/yield-forecasts`;
    setSaving(true);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (r.ok) onSaved();
    else alert('Failed to save forecast.');
  };

  const fields = isDemand
    ? [['Product Name *', 'ProductName', 'text'], ['Category', 'ProductCategory', 'text'],
       ['Customer Segment', 'CustomerSegment', 'text'], ['Period Start *', 'PeriodStart', 'date'],
       ['Period End', 'PeriodEnd', 'date'], ['Forecast Qty *', 'ForecastQty', 'number'],
       ['Unit', 'Unit', 'text'], ['Confidence %', 'ConfidencePct', 'number']]
    : [['Product Name *', 'ProductName', 'text'], ['Season', 'Season', 'text'],
       ['Harvest Start', 'HarvestStart', 'date'], ['Harvest End', 'HarvestEnd', 'date'],
       ['Forecast Qty', 'ForecastQty', 'number'], ['Unit', 'Unit', 'text'],
       ['Actual Qty', 'ActualQty', 'number'], ['Confidence %', 'ConfidencePct', 'number']];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold text-gray-900 text-lg">
          {isDemand ? 'Add Demand Forecast' : 'Add Yield Forecast'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {fields.map(([label, key, type]) => (
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

export default function SupplyChainForecasting() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [demand, setDemand]   = useState([]);
  const [yield_, setYield]    = useState([]);
  const [gaps, setGaps]       = useState(null);
  const [seasonal, setSeasonal] = useState([]);
  const [tab, setTab]         = useState('gaps');
  const [modal, setModal]     = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!BusinessID) return;
    const h = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };
    Promise.all([
      fetch(`${API}/api/esci/demand-forecasts?business_id=${BusinessID}`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/yield-forecasts?business_id=${BusinessID}`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/analytics/seasonal?business_id=${BusinessID}`, { headers: h }).then(r => r.ok ? r.json() : []),
    ]).then(([d, y, sea]) => {
      const demArr = Array.isArray(d) ? d : [];
      const yldArr = Array.isArray(y) ? y : [];
      setDemand(demArr);
      setYield(yldArr);
      setSeasonal(Array.isArray(sea) ? sea : []);

      const supplyMap = {};
      yldArr.forEach(f => {
        const key = (f.ProductName || '').toLowerCase();
        supplyMap[key] = (supplyMap[key] || 0) + (Number(f.ForecastQty) || 0);
      });
      const gapList = demArr.map(df => {
        const key = (df.ProductName || '').toLowerCase();
        const supply = supplyMap[key] || 0;
        const dem = Number(df.ForecastQty) || 0;
        return { product: df.ProductName, unit: df.Unit, demand: dem, supply, gap: dem - supply, shortfall: dem > supply };
      });
      setGaps(gapList.sort((a, b) => b.gap - a.gap));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [BusinessID]);

  useEffect(() => { load(); }, [load]);

  return (
    <AccountLayout
      pageTitle="Demand & Supply Forecasting"
      breadcrumbs={[
        { label: 'Account', to: '/account' },
        { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` },
        { label: 'Forecasting' },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">Demand & Supply Forecasting</h1>
            <p className="text-sm text-gray-500">Gap analysis, shortfall alerts, forecast vs actuals</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setModal('demand')}
              className="px-3 py-2 text-sm text-white rounded-lg" style={{ backgroundColor: TEAL }}>
              + Demand Forecast
            </button>
            <button onClick={() => setModal('yield')}
              className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              + Yield Forecast
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {[['gaps', 'Gap Analysis'], ['demand', 'Demand Forecasts'], ['yield', 'Yield Forecasts'], ['seasonal', 'Seasonal Patterns']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${tab === id ? 'border-[#1e6b5a] text-[#1e6b5a]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? <div className="text-sm text-gray-400">Loading…</div> : (
          <>
            {tab === 'gaps' && (
              !gaps || gaps.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
                  Add demand and yield forecasts to see gap analysis.
                </div>
              ) : (
                <div className="space-y-2">
                  {gaps.map((g, i) => {
                    const gapPct = g.demand > 0 ? Math.round(g.gap / g.demand * 100) : null;
                    return (
                      <div key={i} className={`bg-white border rounded-xl p-4 ${g.shortfall ? 'border-amber-300' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{g.product}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${g.shortfall ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {g.shortfall ? `SHORTFALL ${gapPct != null ? gapPct + '%' : ''}` : 'SURPLUS'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <div>Demand: <span className="font-semibold text-gray-900">{Number(g.demand).toLocaleString()} {g.unit || ''}</span></div>
                          <div>Supply: <span className="font-semibold text-gray-900">{Number(g.supply).toLocaleString()} {g.unit || ''}</span></div>
                          <div>Gap: <span className={`font-semibold ${g.shortfall ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {g.shortfall ? '−' : '+'}{Math.abs(Number(g.gap)).toLocaleString()} {g.unit || ''}
                          </span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {tab === 'demand' && (
              demand.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">No demand forecasts yet.</div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Segment</th>
                        <th className="px-4 py-3 text-left">Period</th>
                        <th className="px-4 py-3 text-right">Forecast</th>
                        <th className="px-4 py-3 text-right">Actual</th>
                        <th className="px-4 py-3 text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {demand.map(d => (
                        <tr key={d.DemandID} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{d.ProductName}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{d.CustomerSegment || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{d.PeriodStart ? d.PeriodStart.slice(0, 10) : '—'}</td>
                          <td className="px-4 py-3 text-right">{Number(d.ForecastQty).toLocaleString()} {d.Unit || ''}</td>
                          <td className="px-4 py-3 text-right">{d.ActualQty != null ? `${Number(d.ActualQty).toLocaleString()} ${d.Unit || ''}` : '—'}</td>
                          <td className="px-4 py-3 text-right text-gray-500">{d.ConfidencePct != null ? `${d.ConfidencePct}%` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === 'yield' && (
              yield_.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">No yield forecasts yet.</div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Supplier</th>
                        <th className="px-4 py-3 text-left">Season</th>
                        <th className="px-4 py-3 text-right">Forecast</th>
                        <th className="px-4 py-3 text-right">Actual</th>
                        <th className="px-4 py-3 text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {yield_.map(f => (
                        <tr key={f.ForecastID} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{f.ProductName}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{f.SupplierName || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{f.Season || '—'}</td>
                          <td className="px-4 py-3 text-right">{f.ForecastQty != null ? `${Number(f.ForecastQty).toLocaleString()} ${f.Unit || ''}` : '—'}</td>
                          <td className="px-4 py-3 text-right">{f.ActualQty != null ? `${Number(f.ActualQty).toLocaleString()} ${f.Unit || ''}` : '—'}</td>
                          <td className="px-4 py-3 text-right text-gray-500">{f.ConfidencePct != null ? `${f.ConfidencePct}%` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
            {tab === 'seasonal' && (
              seasonal.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
                  Not enough data for seasonal pattern analysis yet.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="text-xs font-semibold text-gray-500 mb-3">Avg Demand & Supply by Month (seasonal pattern)</div>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={seasonal} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="avg_demand" name="Avg Demand" fill="#1e6b5a" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="avg_supply" name="Avg Supply" fill="#9ca3af" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-4 py-3 text-left">Month</th>
                          <th className="px-4 py-3 text-right">Avg Demand</th>
                          <th className="px-4 py-3 text-right">Avg Supply</th>
                          <th className="px-4 py-3 text-right">Avg Gap</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {seasonal.map((row, i) => {
                          const gap = (row.avg_demand ?? 0) - (row.avg_supply ?? 0);
                          return (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{row.month}</td>
                              <td className="px-4 py-3 text-right">{row.avg_demand != null ? Number(row.avg_demand).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}</td>
                              <td className="px-4 py-3 text-right">{row.avg_supply != null ? Number(row.avg_supply).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}</td>
                              <td className={`px-4 py-3 text-right font-semibold ${gap > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
                                {gap > 0 ? `−${Math.abs(gap).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `+${Math.abs(gap).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>

      {modal && (
        <AddForecastModal
          businessId={BusinessID}
          type={modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      <TarrigonChat businessId={BusinessID} page="supply_chain_forecasting" />
    </AccountLayout>
  );
}
