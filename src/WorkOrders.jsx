import React, { useEffect, useState, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams, Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { queuedFetch } from './offlineQueue';

const API = import.meta.env.VITE_API_URL || '';

const PRIORITY_COLORS = { low: '#6b7280', normal: '#1d4ed8', high: '#d97706', urgent: '#dc2626' };
const STATUS_COLORS = {
  open: { bg: '#f3f4f6', color: '#374151' },
  in_progress: { bg: '#dbeafe', color: '#1e40af' },
  completed: { bg: '#d1fae5', color: '#065f46' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
  on_hold: { bg: '#fef3c7', color: '#92400e' },
};

const TASK_TYPES = ['Planting', 'Harvesting', 'Irrigation', 'Spraying', 'Weeding', 'Pruning', 'Fertilizing',
  'Land Preparation', 'Machinery Maintenance', 'Scouting', 'Transport', 'Packaging', 'Greenhouse', 'Other'];

const KPI = ({ label, value, color = '#374151' }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-bold" style={{ color }}>{value ?? '—'}</p>
  </div>
);

export default function WorkOrders() {
  const [params] = useSearchParams();
  const BusinessID = params.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const [tab, setTab] = useState('list');
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [detail, setDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ TaskType: 'Planting', Title: '', Description: '', Priority: 'normal', Status: 'open', AssignedTo: '', DueDate: '', EstimatedHours: '', EstimatedCost: '', Location: '', Notes: '' });
  const [laborForm, setLaborForm] = useState({ WorkerName: '', WorkDate: new Date().toISOString().split('T')[0], HoursWorked: '', HourlyRate: '' });
  const [machineryForm, setMachineryForm] = useState({ MachineName: '', UsageDate: new Date().toISOString().split('T')[0], HoursUsed: '', CostPerHour: '', FuelUsed: '' });
  const [materialForm, setMaterialForm] = useState({ MaterialName: '', Category: '', Quantity: '', Unit: '', UnitCost: '' });
  const [ghForm, setGhForm] = useState({ GreenhouseName: '', TempCelsius: '', HumidityPct: '', CO2PPM: '', IrrigationOn: false, HeatingOn: false, VentilationOn: false });
  const [ghReadings, setGhReadings] = useState([]);
  const [advisories, setAdvisories] = useState({ weather_alerts: [], pest_observations: [] });

  useEffect(() => { if (BusinessID) LoadBusiness(BusinessID); }, [BusinessID]);

  const load = useCallback(async () => {
    if (!BusinessID) return;
    setLoading(true);
    try {
      const [wRes, sRes, aRes] = await Promise.all([
        fetch(`${API}/api/work-orders?business_id=${BusinessID}${filterStatus ? `&status=${filterStatus}` : ''}`),
        fetch(`${API}/api/work-orders/summary/dashboard?business_id=${BusinessID}`),
        fetch(`${API}/api/work-orders/advisories?business_id=${BusinessID}`),
      ]);
      setOrders(wRes.ok ? await wRes.json() : []);
      setSummary(sRes.ok ? await sRes.json() : null);
      if (aRes.ok) setAdvisories(await aRes.json());
    } catch {} finally { setLoading(false); }
  }, [BusinessID, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (wo) => {
    const [wRes, ghRes] = await Promise.all([
      fetch(`${API}/api/work-orders/${wo.WOID}?business_id=${BusinessID}`),
      fetch(`${API}/api/work-orders/greenhouse/readings?business_id=${BusinessID}&limit=10`),
    ]);
    if (wRes.ok) setDetail(await wRes.json());
    setGhReadings(ghRes.ok ? await ghRes.json() : []);
    setTab('detail');
  };

  const createWO = async (pestObsId = null) => {
    await fetch(`${API}/api/work-orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, BusinessID: parseInt(BusinessID), ...(pestObsId ? { PestObsID: pestObsId } : {}) }),
    });
    setShowForm(false);
    setForm({ TaskType: 'Planting', Title: '', Description: '', Priority: 'normal', Status: 'open', AssignedTo: '', DueDate: '', EstimatedHours: '', EstimatedCost: '', Location: '', Notes: '', _pestObsId: null });
    load();
  };

  const createWOFromPest = (pest) => {
    setForm({
      TaskType: 'Spraying',
      Title: `Treat ${pest.PestName} on ${pest.CropName || pest.FieldName || 'field'}`,
      Description: `Pest: ${pest.PestName} (${pest.PestType}). Severity: ${pest.SeverityLevel}. Affected area: ${pest.AffectedArea ?? '?'} ha. Notes: ${pest.Notes || '—'}`,
      Priority: pest.SeverityLevel === 'critical' ? 'urgent' : pest.SeverityLevel === 'high' ? 'high' : 'normal',
      Status: 'open',
      AssignedTo: '',
      DueDate: '',
      EstimatedHours: '',
      EstimatedCost: '',
      Location: pest.FieldName || '',
      Notes: '',
      _pestObsId: pest.ObsID,
    });
    setShowForm(true);
    setTab('list');
  };

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` };

  const addLabor = async () => {
    await queuedFetch(`${API}/api/work-orders/${detail.work_order.WOID}/labor`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ ...laborForm, BusinessID: parseInt(BusinessID) }),
      queueWhenOffline: true,
    });
    const r = await fetch(`${API}/api/work-orders/${detail.work_order.WOID}?business_id=${BusinessID}`, { headers: authHeaders });
    if (r.ok) setDetail(await r.json());
    setLaborForm({ WorkerName: '', WorkDate: new Date().toISOString().split('T')[0], HoursWorked: '', HourlyRate: '' });
  };

  const addMaterial = async () => {
    await queuedFetch(`${API}/api/work-orders/${detail.work_order.WOID}/materials`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ ...materialForm, BusinessID: parseInt(BusinessID) }),
      queueWhenOffline: true,
    });
    const r = await fetch(`${API}/api/work-orders/${detail.work_order.WOID}?business_id=${BusinessID}`, { headers: authHeaders });
    if (r.ok) setDetail(await r.json());
    setMaterialForm({ MaterialName: '', Category: '', Quantity: '', Unit: '', UnitCost: '' });
  };

  const addGhReading = async () => {
    await fetch(`${API}/api/work-orders/greenhouse/readings`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ghForm, BusinessID: parseInt(BusinessID) }),
    });
    const r = await fetch(`${API}/api/work-orders/greenhouse/readings?business_id=${BusinessID}&limit=10`);
    setGhReadings(r.ok ? await r.json() : []);
  };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3D6B34]';
  const labelCls = 'text-xs font-semibold text-gray-500 mb-1 block';

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID}
      pageTitle="Work Orders & Field Crews"
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Work Orders' }]}>
      <div className="max-w-5xl mx-auto space-y-5">

        {summary && (
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
            <KPI label="Total" value={summary.Total} />
            <KPI label="Open" value={summary.Open} color="#374151" />
            <KPI label="In Progress" value={summary.InProgress} color="#1e40af" />
            <KPI label="Completed" value={summary.Completed} color="#065f46" />
            <KPI label="Overdue" value={summary.Overdue} color="#dc2626" />
            <KPI label="Est. Cost" value={`$${parseFloat(summary.TotalEstimatedCost||0).toFixed(0)}`} />
            <KPI label="Actual Cost" value={`$${parseFloat(summary.TotalActualCost||0).toFixed(0)}`} color="#3D6B34" />
          </div>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {['list', 'advisories', 'greenhouse', ...(detail ? ['detail'] : [])].map(t => {
              const alertCount = advisories.weather_alerts.length + advisories.pest_observations.filter(p => !p.WorkOrderID).length;
              const label = t === 'detail' ? `WO: ${detail?.work_order?.Title?.slice(0,20)}`
                : t === 'greenhouse' ? 'Greenhouse'
                : t === 'advisories' ? `Advisories${alertCount > 0 ? ` (${alertCount})` : ''}`
                : 'Work Orders';
              return (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-[#3D6B34] text-white' : t === 'advisories' && alertCount > 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {label}
                </button>
              );
            })}
          </div>
          <Link to={`/iot-greenhouse?BusinessID=${BusinessID}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 ml-auto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h4M18 12h4M12 2v4M12 18v4"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
            IoT Sensors
          </Link>
          {tab === 'list' && (
            <div className="flex gap-2">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                <option value="">All</option>
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setShowForm(true)} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                + New Work Order
              </button>
            </div>
          )}
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-gray-800">New Work Order</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><label className={labelCls}>Task Type</label>
                <select value={form.TaskType} onChange={e => setForm(f => ({ ...f, TaskType: e.target.value }))} className={inputCls}>
                  {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select></div>
              <div className="col-span-2"><label className={labelCls}>Title*</label>
                <input value={form.Title} onChange={e => setForm(f => ({ ...f, Title: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Priority</label>
                <select value={form.Priority} onChange={e => setForm(f => ({ ...f, Priority: e.target.value }))} className={inputCls}>
                  {['low', 'normal', 'high', 'urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                </select></div>
              <div><label className={labelCls}>Assigned To</label>
                <input value={form.AssignedTo} onChange={e => setForm(f => ({ ...f, AssignedTo: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Due Date</label>
                <input type="date" value={form.DueDate} onChange={e => setForm(f => ({ ...f, DueDate: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Est. Hours</label>
                <input type="number" value={form.EstimatedHours} onChange={e => setForm(f => ({ ...f, EstimatedHours: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Est. Cost ($)</label>
                <input type="number" value={form.EstimatedCost} onChange={e => setForm(f => ({ ...f, EstimatedCost: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Location</label>
                <input value={form.Location} onChange={e => setForm(f => ({ ...f, Location: e.target.value }))} className={inputCls} /></div>
              <div className="col-span-3"><label className={labelCls}>Description</label>
                <textarea value={form.Description} onChange={e => setForm(f => ({ ...f, Description: e.target.value }))} className={inputCls} rows={2} /></div>
            </div>
            {/* Weather advisory banner for outdoor spray/fertilize WOs */}
            {['Spraying', 'Fertilizing'].includes(form.TaskType) && advisories.weather_alerts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                <span className="font-semibold">⚠ Weather Advisory:</span>{' '}
                {advisories.weather_alerts[0].Title} — {advisories.weather_alerts[0].Message}
                {advisories.weather_alerts[0].RecommendedAction && (
                  <span className="block mt-0.5 text-xs text-amber-700">Recommended: {advisories.weather_alerts[0].RecommendedAction}</span>
                )}
              </div>
            )}
            {form._pestObsId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm text-blue-800">
                <span className="font-semibold">Linked to pest observation #{form._pestObsId}.</span> This work order will be marked as treatment-started on save.
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="text-sm text-gray-600">Cancel</button>
              <button onClick={() => createWO(form._pestObsId || null)} className="bg-[#3D6B34] text-white px-5 py-2 rounded-lg text-sm font-semibold">Create</button>
            </div>
          </div>
        )}

        {tab === 'list' && !loading && (
          <div className="space-y-3">
            {orders.map(wo => {
              const s = STATUS_COLORS[wo.Status] || STATUS_COLORS.open;
              const isOverdue = wo.DueDate && new Date(wo.DueDate) < new Date() && wo.Status !== 'completed';
              return (
                <div key={wo.WOID} className={`bg-white border rounded-xl p-4 flex justify-between items-center ${isOverdue ? 'border-red-200' : 'border-gray-200'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{wo.Title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>{wo.Status}</span>
                      <span className="text-xs font-bold" style={{ color: PRIORITY_COLORS[wo.Priority] }}>{wo.Priority}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{wo.TaskType} {wo.Location ? `· ${wo.Location}` : ''} {wo.AssignedTo ? `· ${wo.AssignedTo}` : ''} {wo.DueDate ? `· Due: ${wo.DueDate?.split('T')[0]}` : ''}</p>
                    {isOverdue && <p className="text-xs text-red-600 font-semibold">Overdue</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-600">${parseFloat(wo.ActualCost||0).toFixed(0)} / ${parseFloat(wo.EstimatedCost||0).toFixed(0)}</p>
                    <button onClick={() => loadDetail(wo)} className="text-xs text-[#3D6B34] font-semibold hover:underline">Manage →</button>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && <p className="text-center py-12 text-gray-400">No work orders.</p>}
          </div>
        )}

        {tab === 'advisories' && (
          <div className="space-y-5">
            {/* Weather Alerts */}
            <div>
              <h2 className="font-bold text-gray-800 mb-3">Weather Alerts</h2>
              {advisories.weather_alerts.length === 0 ? (
                <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-6 text-center">No active weather alerts.</p>
              ) : (
                <div className="space-y-3">
                  {advisories.weather_alerts.map(w => (
                    <div key={w.WeatherAlertID} className={`bg-white border rounded-xl p-4 ${w.Severity === 'critical' ? 'border-red-300' : 'border-amber-200'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${w.Severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{w.Severity}</span>
                            <span className="text-xs text-gray-400 capitalize">{w.AlertType?.replace(/_/g, ' ')}</span>
                            {w.CropName && <span className="text-xs text-gray-400">· {w.CropName}</span>}
                          </div>
                          <p className="font-semibold text-gray-800">{w.Title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{w.Message}</p>
                          {w.RecommendedAction && (
                            <p className="text-xs text-blue-700 mt-1.5 font-medium">Recommended: {w.RecommendedAction}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 ml-4 shrink-0">{w.CreatedAt ? new Date(w.CreatedAt).toLocaleDateString() : ''}</p>
                      </div>
                      {w.ValidUntil && (
                        <p className="text-xs text-gray-400 mt-2">Valid until {new Date(w.ValidUntil).toLocaleString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pest Observations */}
            <div>
              <h2 className="font-bold text-gray-800 mb-3">Active Pest Observations</h2>
              {advisories.pest_observations.length === 0 ? (
                <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl p-6 text-center">No active pest observations.</p>
              ) : (
                <div className="space-y-3">
                  {advisories.pest_observations.map(p => {
                    const sevColor = p.SeverityLevel === 'critical' ? 'bg-red-100 text-red-700 border-red-300'
                      : p.SeverityLevel === 'high' ? 'bg-orange-100 text-orange-700 border-orange-300'
                      : p.SeverityLevel === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200';
                    return (
                      <div key={p.ObsID} className={`bg-white border rounded-xl p-4 ${p.SeverityLevel === 'critical' ? 'border-red-300' : p.SeverityLevel === 'high' ? 'border-orange-200' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sevColor}`}>{p.SeverityLevel}</span>
                              <span className="text-xs text-gray-500 capitalize">{p.PestType}</span>
                              {p.Status === 'treatment_started' && (
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Treatment started</span>
                              )}
                            </div>
                            <p className="font-semibold text-gray-800">{p.PestName}{p.CropName ? ` on ${p.CropName}` : ''}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {p.FieldName && `Field: ${p.FieldName} · `}
                              {p.ObservationDate ? new Date(p.ObservationDate).toLocaleDateString() : ''}
                              {p.AffectedArea ? ` · ${p.AffectedArea} ha affected` : ''}
                            </p>
                            {p.Notes && <p className="text-sm text-gray-600 mt-1">{p.Notes}</p>}
                            {p.WorkOrderID && (
                              <p className="text-xs text-blue-600 mt-1">→ Linked to WO #{p.WorkOrderID}</p>
                            )}
                          </div>
                          {!p.WorkOrderID && (
                            <button onClick={() => createWOFromPest(p)}
                              className="shrink-0 bg-[#3D6B34] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2d5226] whitespace-nowrap">
                              + Treatment WO
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'greenhouse' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-gray-800">Log Greenhouse Reading</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['Greenhouse Name', 'GreenhouseName'], ['Temp (°C)', 'TempCelsius', 'number'],
                  ['Humidity (%)', 'HumidityPct', 'number'], ['CO₂ (ppm)', 'CO2PPM', 'number']].map(([l, k, t='text']) => (
                  <div key={k}><label className={labelCls}>{l}</label>
                    <input type={t} value={ghForm[k]} onChange={e => setGhForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></div>
                ))}
              </div>
              <div className="flex gap-4">
                {[['Irrigation On', 'IrrigationOn'], ['Heating On', 'HeatingOn'], ['Ventilation On', 'VentilationOn']].map(([l, k]) => (
                  <label key={k} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="checkbox" checked={ghForm[k]} onChange={e => setGhForm(f => ({ ...f, [k]: e.target.checked }))} />
                    {l}
                  </label>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={addGhReading} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">Log Reading</button>
              </div>
            </div>
            {ghReadings.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-400">
                      <tr><th className="text-left px-4 py-2">Greenhouse</th><th>Time</th><th>Temp</th><th>Humidity</th><th>CO₂</th><th>Irrigation</th><th>Heating</th></tr>
                    </thead>
                    <tbody>
                      {ghReadings.map(r => (
                        <tr key={r.ReadingID} className="border-t border-gray-50">
                          <td className="px-4 py-2 font-medium">{r.GreenhouseName}</td>
                          <td className="px-4 py-2 text-gray-400">{new Date(r.ReadingTime).toLocaleString()}</td>
                          <td className="px-4 py-2">{r.TempCelsius ?? '—'}°C</td>
                          <td className="px-4 py-2">{r.HumidityPct ?? '—'}%</td>
                          <td className="px-4 py-2">{r.CO2PPM ?? '—'}</td>
                          <td className="px-4 py-2">{r.IrrigationOn ? '✓' : '—'}</td>
                          <td className="px-4 py-2">{r.HeatingOn ? '✓' : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'detail' && detail && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{detail.work_order.Title}</h3>
                  <p className="text-sm text-gray-500">{detail.work_order.TaskType} · {detail.work_order.Location || 'No location'}</p>
                  {detail.work_order.Description && <p className="text-xs text-gray-400 mt-1">{detail.work_order.Description}</p>}
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm">Est: ${parseFloat(detail.work_order.EstimatedCost||0).toFixed(2)}</p>
                  <p className="font-bold text-[#3D6B34]">Actual: ${parseFloat(detail.work_order.ActualCost||0).toFixed(2)}</p>
                </div>
              </div>
              {/* Change status */}
              <div className="flex gap-2 flex-wrap">
                {Object.keys(STATUS_COLORS).map(s => (
                  <button key={s} onClick={() => queuedFetch(`${API}/api/work-orders/${detail.work_order.WOID}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
                    body: JSON.stringify({ ...detail.work_order, Status: s, BusinessID: parseInt(BusinessID) }),
                    queueWhenOffline: true,
                  }).then(() => loadDetail(detail.work_order))}
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${detail.work_order.Status === s ? 'ring-2 ring-offset-1 ring-[#3D6B34]' : ''}`}
                    style={{ backgroundColor: STATUS_COLORS[s].bg, color: STATUS_COLORS[s].color }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Labor */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-gray-800">Labor</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['Worker Name', 'WorkerName'], ['Date', 'WorkDate', 'date'], ['Hours', 'HoursWorked', 'number'], ['$/hr', 'HourlyRate', 'number']].map(([l, k, t='text']) => (
                  <div key={k}><label className={labelCls}>{l}</label>
                    <input type={t} value={laborForm[k]} onChange={e => setLaborForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></div>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={addLabor} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">+ Log Labor</button>
              </div>
              {detail.labor.length > 0 && (
                <table className="w-full text-sm">
                  <thead><tr className="text-xs text-gray-400 border-b">
                    <th className="text-left pb-1">Worker</th><th>Date</th><th>Hours</th><th>$/hr</th><th>Total</th>
                  </tr></thead>
                  <tbody>
                    {detail.labor.map(l => (
                      <tr key={l.LaborID} className="border-b border-gray-50">
                        <td className="py-1.5">{l.WorkerName}</td>
                        <td>{l.WorkDate?.split('T')[0]}</td>
                        <td>{l.HoursWorked}</td>
                        <td>{l.HourlyRate ?? '—'}</td>
                        <td className="font-semibold">${parseFloat(l.TotalCost||0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Materials */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-gray-800">Materials Used</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[['Material Name', 'MaterialName'], ['Category', 'Category'], ['Qty', 'Quantity', 'number'], ['Unit', 'Unit'], ['$/unit', 'UnitCost', 'number']].map(([l, k, t='text']) => (
                  <div key={k}><label className={labelCls}>{l}</label>
                    <input type={t} value={materialForm[k]} onChange={e => setMaterialForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></div>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={addMaterial} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">+ Add Material</button>
              </div>
              {detail.materials.length > 0 && (
                <table className="w-full text-sm">
                  <thead><tr className="text-xs text-gray-400 border-b">
                    <th className="text-left pb-1">Material</th><th>Category</th><th>Qty</th><th>Cost</th>
                  </tr></thead>
                  <tbody>
                    {detail.materials.map(m => (
                      <tr key={m.MaterialID} className="border-b border-gray-50">
                        <td className="py-1.5">{m.MaterialName}</td>
                        <td>{m.Category || '—'}</td>
                        <td>{m.Quantity} {m.Unit}</td>
                        <td className="font-semibold">${parseFloat(m.TotalCost||0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
          <ThaiymeChat businessId={BusinessID} page="work-orders" />
    </AccountLayout>
  );
}
