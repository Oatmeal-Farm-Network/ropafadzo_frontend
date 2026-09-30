/**
 * SupplyChainQuality — Quality & Yield Intelligence.
 * Quality test results, yield forecasts vs actuals, supplier quality scorecards.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import TarrigonChat from './TarrigonChat';

const API = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';

const PF_COLORS = { pass: 'text-emerald-700', fail: 'text-red-600' };

function AddTestModal({ businessId, shipments, onClose, onSaved }) {
  const [form, setForm] = useState({ BusinessID: businessId, PassFail: 'pass' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.ShipmentID) { alert('Select a shipment.'); return; }
    setSaving(true);
    const r = await fetch(`${API}/api/esci/quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (r.ok) onSaved();
    else alert('Failed to save quality test.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold text-gray-900 text-lg">Record Quality Test</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Shipment *</label>
            <select value={form.ShipmentID || ''} onChange={e => set('ShipmentID', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]">
              <option value="">— select —</option>
              {shipments.map(s => <option key={s.ShipmentID} value={s.ShipmentID}>{s.ProductName} #{s.ShipmentID}</option>)}
            </select>
          </div>
          {[['Pass/Fail', 'PassFail', ['pass', 'fail']], ['Grade', 'Grade', ['A', 'B', 'C', 'D', 'F']]].map(([label, key, opts]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <select value={form[key] || ''} onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          {[['Defect %', 'DefectPct'], ['Brix Level', 'BrixLevel'], ['Moisture %', 'MoisturePct']].map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type="number" step="0.1" value={form[key] || ''} onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
            </div>
          ))}
          {[['Pesticide Result', 'PesticideResult'], ['Microbial Result', 'MicrobialResult']].map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <select value={form[key] || ''} onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                <option value="">—</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="not_tested">Not Tested</option>
              </select>
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea value={form.Notes || ''} onChange={e => set('Notes', e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none resize-none" />
          </div>
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

export default function SupplyChainQuality() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [tests, setTests]         = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [qualityTrend, setQualityTrend] = useState([]);
  const [seasonal, setSeasonal]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab]             = useState('tests');
  const [loading, setLoading]     = useState(true);

  const load = useCallback(() => {
    if (!BusinessID) return;
    const h = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };
    Promise.all([
      fetch(`${API}/api/esci/quality?business_id=${BusinessID}&limit=50`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/yield-forecasts?business_id=${BusinessID}`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/shipments?business_id=${BusinessID}&limit=200`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/analytics/quality-trends?business_id=${BusinessID}&weeks=12`, { headers: h }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/analytics/seasonal?business_id=${BusinessID}`, { headers: h }).then(r => r.ok ? r.json() : []),
    ]).then(([t, f, s, qt, sea]) => {
      setTests(Array.isArray(t) ? t : []);
      setForecasts(Array.isArray(f) ? f : []);
      setShipments(Array.isArray(s) ? s : []);
      setQualityTrend(Array.isArray(qt) ? qt : []);
      setSeasonal(Array.isArray(sea) ? sea : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [BusinessID]);

  useEffect(() => { load(); }, [load]);

  const passRate = tests.length ? Math.round(tests.filter(t => t.PassFail === 'pass').length / tests.length * 100) : null;

  return (
    <AccountLayout
      pageTitle="Quality & Yield"
      breadcrumbs={[
        { label: 'Account', to: '/account' },
        { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` },
        { label: 'Quality & Yield' },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">Quality & Yield Intelligence</h1>
            <p className="text-sm text-gray-500">Inspection results, grades, yield forecasts</p>
          </div>
          <div className="flex gap-2">
            {tab === 'tests' && (
              <button onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm text-white rounded-lg" style={{ backgroundColor: TEAL }}>
                + Record Test
              </button>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Tests (shown)</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{tests.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Pass Rate</div>
            <div className={`text-2xl font-bold mt-0.5 ${passRate != null && passRate < 80 ? 'text-red-600' : 'text-emerald-700'}`}>
              {passRate != null ? `${passRate}%` : '—'}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Failures</div>
            <div className="text-2xl font-bold text-red-600 mt-0.5">{tests.filter(t => t.PassFail === 'fail').length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="text-[10px] uppercase font-semibold text-gray-500">Yield Forecasts</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{forecasts.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {[['tests', 'Quality Tests'], ['forecasts', 'Yield Forecasts'], ['trends', 'Trends'], ['seasonal', 'Seasonal']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${tab === id ? 'border-[#1e6b5a] text-[#1e6b5a]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Quality Tests tab */}
        {tab === 'tests' && (
          loading ? <div className="text-sm text-gray-400">Loading…</div> :
          tests.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
              No quality tests recorded yet.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Tested</th>
                    <th className="px-4 py-3 text-center">Result</th>
                    <th className="px-4 py-3 text-center">Grade</th>
                    <th className="px-4 py-3 text-right">Defect %</th>
                    <th className="px-4 py-3 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tests.map(t => (
                    <tr key={t.TestID} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{t.ProductName}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{t.SupplierName || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{t.TestedAt ? t.TestedAt.slice(0, 10) : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold text-xs ${PF_COLORS[t.PassFail] || ''}`}>
                          {(t.PassFail || '').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-900">{t.Grade || '—'}</td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {t.DefectPct != null ? `${Number(t.DefectPct).toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{t.Notes || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Yield Forecasts tab */}
        {tab === 'forecasts' && (
          loading ? <div className="text-sm text-gray-400">Loading…</div> :
          forecasts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
              No yield forecasts yet.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Season</th>
                    <th className="px-4 py-3 text-right">Forecast Qty</th>
                    <th className="px-4 py-3 text-right">Actual Qty</th>
                    <th className="px-4 py-3 text-right">Confidence</th>
                    <th className="px-4 py-3 text-left">Harvest Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {forecasts.map(f => {
                    const variance = f.ActualQty != null && f.ForecastQty
                      ? Math.round((f.ActualQty - f.ForecastQty) / f.ForecastQty * 100)
                      : null;
                    return (
                      <tr key={f.ForecastID} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{f.ProductName}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{f.SupplierName || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{f.Season || '—'}</td>
                        <td className="px-4 py-3 text-right">
                          {f.ForecastQty != null ? `${Number(f.ForecastQty).toLocaleString()} ${f.Unit || ''}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {f.ActualQty != null ? (
                            <span className={variance != null ? (variance >= 0 ? 'text-emerald-700' : 'text-red-600') : ''}>
                              {Number(f.ActualQty).toLocaleString()} {f.Unit || ''}
                              {variance != null && <span className="text-xs ml-1">({variance > 0 ? '+' : ''}{variance}%)</span>}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {f.ConfidencePct != null ? `${f.ConfidencePct}%` : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {f.HarvestStart ? f.HarvestStart.slice(0, 10) : '—'}
                          {f.HarvestEnd ? ` → ${f.HarvestEnd.slice(0, 10)}` : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

        {/* Trends tab */}
        {tab === 'trends' && (
          qualityTrend.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
              Not enough data for trend analysis yet.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="text-xs font-semibold text-gray-500">Weekly Quality Pass Rate (%)</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={qualityTrend} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={v => [`${Number(v).toFixed(1)}%`, 'Pass Rate']} />
                  <Line type="monotone" dataKey="pass_rate" stroke="#1e6b5a" strokeWidth={2.5}
                    dot={{ fill: '#1e6b5a', r: 3 }} activeDot={{ r: 5 }} name="Pass Rate" />
                  {qualityTrend[0]?.total != null && (
                    <Line type="monotone" dataKey="total" stroke="#9ca3af" strokeWidth={1.5}
                      dot={false} name="Tests" yAxisId={0} />
                  )}
                </LineChart>
              </ResponsiveContainer>
              <div className="text-xs font-semibold text-gray-500 pt-2">Weekly Failure Count</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={qualityTrend} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="failures" fill="#ef4444" radius={[3, 3, 0, 0]} name="Failures" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        )}

        {/* Seasonal tab */}
        {tab === 'seasonal' && (
          seasonal.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
              Not enough data for seasonal analysis yet.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-gray-500 mb-3">Avg Quality Pass Rate by Month</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={seasonal} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={v => [`${Number(v).toFixed(1)}%`, 'Pass Rate']} />
                  <Bar dataKey="avg_pass_rate" fill="#1e6b5a" radius={[4, 4, 0, 0]} name="Avg Pass Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        )}

      {showModal && (
        <AddTestModal
          businessId={BusinessID}
          shipments={shipments}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load(); }}
        />
      )}

      <TarrigonChat businessId={BusinessID} page="supply_chain_quality" />
    </AccountLayout>
  );
}
