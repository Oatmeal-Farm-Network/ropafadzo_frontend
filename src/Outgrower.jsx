import React, { useEffect, useState, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams, Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const API = import.meta.env.VITE_API_URL || '';

const CONTRACT_STATUS = {
  draft: { bg: '#f3f4f6', color: '#374151' },
  active: { bg: '#d1fae5', color: '#065f46' },
  completed: { bg: '#dbeafe', color: '#1e40af' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

const KPI = ({ label, value, sub, color = '#3D6B34' }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-bold" style={{ color }}>{value ?? '—'}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

export default function Outgrower() {
  const [params] = useSearchParams();
  const BusinessID = params.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const [tab, setTab] = useState(params.get('tab') || 'overview');
  const [summary, setSummary] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [farmerForm, setFarmerForm] = useState({ FullName: '', Phone: '', Email: '', Village: '', District: '', TotalAcreage: '', NationalID: '', BankAccount: '', MobileMoneyNumber: '' });
  const [contractForm, setContractForm] = useState({ FarmerID: '', CropName: '', Season: '', PlantingArea: '', TargetQtyKg: '', PricePerKg: '', StartDate: '', EndDate: '', Status: 'draft' });
  const [deliveryForm, setDeliveryForm] = useState({ ContractID: '', FarmerID: '', DeliveryDate: new Date().toISOString().split('T')[0], GrossWeightKg: '', MoistureDeductKg: '', NetWeightKg: '', QualityGrade: 'A', PricePerKg: '', InputDeductions: '', PaymentStatus: 'pending' });

  useEffect(() => { if (BusinessID) LoadBusiness(BusinessID); }, [BusinessID]);

  const load = useCallback(async () => {
    if (!BusinessID) return;
    setLoading(true);
    try {
      const [sRes, fRes, cRes, dRes, dlRes, dbRes] = await Promise.all([
        fetch(`${API}/api/outgrower/summary?business_id=${BusinessID}`),
        fetch(`${API}/api/outgrower/farmers?business_id=${BusinessID}`),
        fetch(`${API}/api/outgrower/contracts?business_id=${BusinessID}`),
        fetch(`${API}/api/outgrower/distributions?business_id=${BusinessID}`),
        fetch(`${API}/api/outgrower/deliveries?business_id=${BusinessID}`),
        fetch(`${API}/api/outgrower/contract-dashboard?business_id=${BusinessID}`),
      ]);
      setSummary(sRes.ok ? await sRes.json() : null);
      setFarmers(fRes.ok ? await fRes.json() : []);
      setContracts(cRes.ok ? await cRes.json() : []);
      setDistributions(dRes.ok ? await dRes.json() : []);
      setDeliveries(dlRes.ok ? await dlRes.json() : []);
      setDashboard(dbRes.ok ? await dbRes.json() : null);
    } catch {} finally { setLoading(false); }
  }, [BusinessID]);

  useEffect(() => { load(); }, [load]);

  const addFarmer = async () => {
    await fetch(`${API}/api/outgrower/farmers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...farmerForm, BusinessID: parseInt(BusinessID), JoinedDate: new Date().toISOString().split('T')[0] }),
    });
    setShowFarmerForm(false);
    setFarmerForm({ FullName: '', Phone: '', Email: '', Village: '', District: '', TotalAcreage: '', NationalID: '', BankAccount: '', MobileMoneyNumber: '' });
    load();
  };

  const addContract = async () => {
    await fetch(`${API}/api/outgrower/contracts`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...contractForm, BusinessID: parseInt(BusinessID), FarmerID: parseInt(contractForm.FarmerID) }),
    });
    setShowContractForm(false);
    setContractForm({ FarmerID: '', CropName: '', Season: '', PlantingArea: '', TargetQtyKg: '', PricePerKg: '', StartDate: '', EndDate: '', Status: 'draft' });
    load();
  };

  const addDelivery = async () => {
    const gross = parseFloat(deliveryForm.GrossWeightKg) || 0;
    const moist = parseFloat(deliveryForm.MoistureDeductKg) || 0;
    const net = gross - moist;
    const ppk = parseFloat(deliveryForm.PricePerKg) || 0;
    const grossPay = net * ppk;
    const deduct = parseFloat(deliveryForm.InputDeductions) || 0;
    const netPay = grossPay - deduct;
    await fetch(`${API}/api/outgrower/deliveries`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...deliveryForm, BusinessID: parseInt(BusinessID),
        ContractID: parseInt(deliveryForm.ContractID), FarmerID: parseInt(deliveryForm.FarmerID),
        NetWeightKg: net, GrossPayment: grossPay, NetPayment: netPay,
      }),
    });
    setShowDeliveryForm(false);
    load();
  };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3D6B34]';
  const labelCls = 'text-xs font-semibold text-gray-500 mb-1 block';
  const TABS = ['overview', 'dashboard', 'farmers', 'contracts', 'distributions', 'deliveries'];

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID}
      pageTitle="Contract Farming / Outgrower"
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Outgrower' }]}>
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Cross-link to Scale Tickets */}
        <div className="flex justify-end">
          <Link to={`/scale-tickets?BusinessID=${BusinessID}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border"
            style={{ background: '#f0fdf4', borderColor: '#86efac', color: '#166534', textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="12" height="9" rx="1"/><path d="M5 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
            Scale Tickets
          </Link>
        </div>

        {/* Summary KPIs */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <KPI label="Active Farmers" value={summary.ActiveFarmers} />
            <KPI label="Total Acreage" value={`${summary.TotalAcreage?.toFixed(1) ?? 0} ac`} />
            <KPI label="Total Contracts" value={summary.TotalContracts} />
            <KPI label="Active Contracts" value={summary.ActiveContracts} color="#065f46" />
            <KPI label="Delivered (kg)" value={summary.TotalDeliveredKg?.toFixed(0)} />
            <KPI label="Total Paid" value={`$${summary.TotalPaid?.toFixed(2)}`} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize ${tab === t ? 'bg-[#3D6B34] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-12 text-gray-400">Loading…</div>}

        {!loading && tab === 'dashboard' && (
          <div className="space-y-5">
            {!dashboard && <p className="text-center py-12 text-gray-400">No contract data found.</p>}
            {dashboard && (
              <>
                {/* Totals strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <KPI label="Contracts" value={dashboard.totals.total_contracts} />
                  <KPI label="Target (kg)" value={dashboard.totals.total_target_kg?.toLocaleString()} />
                  <KPI label="Delivered (kg)" value={dashboard.totals.total_delivered_kg?.toLocaleString()} color="#065f46" />
                  <KPI label="Overall Utilization" value={`${dashboard.totals.overall_utilization_pct}%`}
                    color={dashboard.totals.overall_utilization_pct >= 80 ? '#16a34a' : dashboard.totals.overall_utilization_pct >= 50 ? '#d97706' : '#dc2626'} />
                </div>

                {/* Bar chart */}
                {dashboard.contracts.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <p className="font-bold text-gray-800 mb-4 text-sm">Contract Utilization — Target vs Delivered (kg)</p>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={dashboard.contracts.slice(0, 15).map(c => ({
                        name: `${c.farmer_name.split(' ')[0]} · ${c.crop_name}`,
                        Target: c.target_kg,
                        Delivered: c.delivered_kg,
                      }))} margin={{ top: 0, right: 10, left: 0, bottom: 40 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Bar dataKey="Target" fill="#d1d5db" radius={[3,3,0,0]} />
                        <Bar dataKey="Delivered" radius={[3,3,0,0]}>
                          {dashboard.contracts.slice(0,15).map((c, i) => (
                            <Cell key={i} fill={c.utilization_pct >= 80 ? '#16a34a' : c.utilization_pct >= 50 ? '#d97706' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Contracts table */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                    <p className="font-semibold text-gray-800 text-sm">All Contracts</p>
                    {dashboard.totals.total_pending_payment > 0 && (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                        ${dashboard.totals.total_pending_payment.toLocaleString()} pending payment
                      </span>
                    )}
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Farmer', 'Crop', 'Season', 'Target kg', 'Delivered kg', 'Utilization', 'Status', 'Pending $'].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {dashboard.contracts.map(c => {
                        const uColor = c.utilization_pct >= 80 ? 'text-green-600' : c.utilization_pct >= 50 ? 'text-amber-600' : 'text-red-600';
                        const sStyle = CONTRACT_STATUS[c.contract_status] || { bg: '#f3f4f6', color: '#374151' };
                        return (
                          <tr key={c.contract_id} className="hover:bg-gray-50">
                            <td className="px-3 py-2.5 font-medium text-gray-800">{c.farmer_name}</td>
                            <td className="px-3 py-2.5 text-gray-600">{c.crop_name}</td>
                            <td className="px-3 py-2.5 text-gray-500 text-xs">{c.season || '—'}</td>
                            <td className="px-3 py-2.5 text-gray-700">{c.target_kg.toLocaleString()}</td>
                            <td className="px-3 py-2.5 font-semibold text-gray-800">{c.delivered_kg.toLocaleString()}</td>
                            <td className={`px-3 py-2.5 font-bold ${uColor}`}>{c.utilization_pct}%</td>
                            <td className="px-3 py-2.5">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: sStyle.bg, color: sStyle.color }}>
                                {c.contract_status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              {c.pending_payment_amt > 0
                                ? <span className="text-amber-600 font-semibold">${c.pending_payment_amt.toLocaleString()}</span>
                                : <span className="text-gray-300">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                      {dashboard.contracts.length === 0 && (
                        <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm">No contracts found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {!loading && tab === 'overview' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="font-bold text-gray-800 mb-3">Top Crops by Contract</p>
              {contracts.length === 0 ? <p className="text-gray-400 text-sm">No contracts yet.</p> :
                (() => {
                  const counts = {};
                  contracts.forEach(c => { counts[c.CropName] = (counts[c.CropName] || 0) + 1; });
                  return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,5).map(([crop, n]) => (
                    <div key={crop} className="flex justify-between text-sm py-1 border-b border-gray-50">
                      <span>{crop}</span><span className="font-semibold">{n} contract{n!==1?'s':''}</span>
                    </div>
                  ));
                })()}
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="font-bold text-gray-800 mb-3">Recent Deliveries</p>
              {deliveries.slice(0,5).map(d => (
                <div key={d.DeliveryID} className="flex justify-between text-sm py-1 border-b border-gray-50">
                  <span>{d.FarmerName}</span>
                  <span className="font-semibold">{parseFloat(d.NetWeightKg||0).toFixed(0)} kg · ${parseFloat(d.NetPayment||0).toFixed(2)}</span>
                </div>
              ))}
              {deliveries.length === 0 && <p className="text-gray-400 text-sm">No deliveries yet.</p>}
            </div>
          </div>
        )}

        {!loading && tab === 'farmers' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={() => setShowFarmerForm(v => !v)} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                + Register Farmer
              </button>
            </div>
            {showFarmerForm && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-gray-800">Register Outgrower Farmer</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[['Full Name*', 'FullName'], ['Phone', 'Phone'], ['Email', 'Email'],
                    ['Village', 'Village'], ['District', 'District'], ['Acreage', 'TotalAcreage'],
                    ['National ID', 'NationalID'], ['Bank Account', 'BankAccount'], ['Mobile Money', 'MobileMoneyNumber']].map(([l, k]) => (
                    <div key={k}><label className={labelCls}>{l}</label>
                      <input value={farmerForm[k]} onChange={e => setFarmerForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowFarmerForm(false)} className="text-sm text-gray-600">Cancel</button>
                  <button onClick={addFarmer} className="bg-[#3D6B34] text-white px-5 py-2 rounded-lg text-sm font-semibold">Save</button>
                </div>
              </div>
            )}
            {farmers.map(f => (
              <div key={f.FarmerID} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{f.FullName}</p>
                    <p className="text-xs text-gray-400">{f.Village}{f.District ? `, ${f.District}` : ''} · {f.TotalAcreage ?? '?'} ac</p>
                    <p className="text-xs text-gray-400">{f.Phone} {f.MobileMoneyNumber ? `· ${f.MobileMoneyNumber}` : ''}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800 self-start">{f.Status}</span>
                </div>
              </div>
            ))}
            {farmers.length === 0 && <p className="text-center py-8 text-gray-400">No farmers registered.</p>}
          </div>
        )}

        {!loading && tab === 'contracts' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={() => setShowContractForm(v => !v)} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                + New Contract
              </button>
            </div>
            {showContractForm && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-gray-800">New Contract</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div><label className={labelCls}>Farmer*</label>
                    <select value={contractForm.FarmerID} onChange={e => setContractForm(f => ({ ...f, FarmerID: e.target.value }))} className={inputCls}>
                      <option value="">Select farmer</option>
                      {farmers.map(f => <option key={f.FarmerID} value={f.FarmerID}>{f.FullName}</option>)}
                    </select></div>
                  {[['Crop Name*', 'CropName'], ['Season', 'Season'], ['Target Qty (kg)', 'TargetQtyKg'],
                    ['Price/kg', 'PricePerKg'], ['Start Date', 'StartDate', 'date'], ['End Date', 'EndDate', 'date']].map(([l, k, t='text']) => (
                    <div key={k}><label className={labelCls}>{l}</label>
                      <input type={t} value={contractForm[k]} onChange={e => setContractForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></div>
                  ))}
                  <div><label className={labelCls}>Status</label>
                    <select value={contractForm.Status} onChange={e => setContractForm(f => ({ ...f, Status: e.target.value }))} className={inputCls}>
                      {Object.keys(CONTRACT_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowContractForm(false)} className="text-sm text-gray-600">Cancel</button>
                  <button onClick={addContract} className="bg-[#3D6B34] text-white px-5 py-2 rounded-lg text-sm font-semibold">Save</button>
                </div>
              </div>
            )}
            {contracts.map(c => {
              const s = CONTRACT_STATUS[c.Status] || { bg: '#f3f4f6', color: '#374151' };
              return (
                <div key={c.ContractID} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-bold text-gray-800">{c.CropName}</span>
                      <span className="mx-2 text-gray-400">·</span>
                      <span className="text-sm text-gray-600">{c.FarmerName}</span>
                      <span className="ml-2" style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{c.Status}</span>
                      <p className="text-xs text-gray-400 mt-1">{c.Season} · Target: {c.TargetQtyKg ?? '?'} kg · ${c.PricePerKg}/kg</p>
                    </div>
                    <p className="text-xs text-gray-400">{c.StartDate?.split('T')[0]} – {c.EndDate?.split('T')[0]}</p>
                  </div>
                </div>
              );
            })}
            {contracts.length === 0 && <p className="text-center py-8 text-gray-400">No contracts yet.</p>}
          </div>
        )}

        {!loading && tab === 'deliveries' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={() => setShowDeliveryForm(v => !v)} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                + Record Delivery
              </button>
            </div>
            {showDeliveryForm && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-gray-800">Record Buy-back Delivery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div><label className={labelCls}>Contract*</label>
                    <select value={deliveryForm.ContractID} onChange={e => {
                      const c = contracts.find(c => c.ContractID === parseInt(e.target.value));
                      setDeliveryForm(f => ({ ...f, ContractID: e.target.value, FarmerID: c?.FarmerID || '', PricePerKg: c?.PricePerKg || '' }));
                    }} className={inputCls}>
                      <option value="">Select contract</option>
                      {contracts.filter(c => c.Status === 'active').map(c => (
                        <option key={c.ContractID} value={c.ContractID}>{c.FarmerName} — {c.CropName}</option>
                      ))}
                    </select></div>
                  {[['Date*', 'DeliveryDate', 'date'], ['Gross (kg)', 'GrossWeightKg', 'number'],
                    ['Moisture Deduct (kg)', 'MoistureDeductKg', 'number'], ['Price/kg', 'PricePerKg', 'number'],
                    ['Input Deductions', 'InputDeductions', 'number'], ['Quality Grade', 'QualityGrade', 'text']].map(([l, k, t='text']) => (
                    <div key={k}><label className={labelCls}>{l}</label>
                      <input type={t} value={deliveryForm[k]} onChange={e => setDeliveryForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowDeliveryForm(false)} className="text-sm text-gray-600">Cancel</button>
                  <button onClick={addDelivery} className="bg-[#3D6B34] text-white px-5 py-2 rounded-lg text-sm font-semibold">Save</button>
                </div>
              </div>
            )}
            {deliveries.map(d => (
              <div key={d.DeliveryID} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between">
                <div>
                  <p className="font-bold text-gray-800">{d.FarmerName} <span className="text-gray-400 font-normal">· {d.CropName}</span></p>
                  <p className="text-xs text-gray-400">{d.DeliveryDate?.split('T')[0]} · Net: {parseFloat(d.NetWeightKg||0).toFixed(1)} kg · Grade: {d.QualityGrade}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#3D6B34]">${parseFloat(d.NetPayment||0).toFixed(2)}</p>
                  <p className="text-xs" style={{ color: d.PaymentStatus === 'paid' ? '#065f46' : '#92400e' }}>{d.PaymentStatus}</p>
                </div>
              </div>
            ))}
            {deliveries.length === 0 && <p className="text-center py-8 text-gray-400">No deliveries recorded.</p>}
          </div>
        )}

        {!loading && tab === 'distributions' && (
          <div className="space-y-3">
            {distributions.map(d => (
              <div key={d.DistID} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between">
                <div>
                  <p className="font-bold text-gray-800">{d.InputName} <span className="text-gray-400 font-normal">({d.InputType})</span></p>
                  <p className="text-xs text-gray-400">{d.FarmerName} · {d.DistributedDate?.split('T')[0]} · {d.Quantity} {d.Unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">${parseFloat(d.TotalValue||0).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{d.RecoveryMethod || 'No recovery method'}</p>
                </div>
              </div>
            ))}
            {distributions.length === 0 && <p className="text-center py-8 text-gray-400">No input distributions yet.</p>}
          </div>
        )}
      </div>
          <ThaiymeChat businessId={BusinessID} page="outgrower" />
    </AccountLayout>
  );
}
