/**
 * AgriERPMobile.jsx — full-screen PWA shell for field workers
 * Route: /agri-erp/mobile?BusinessID=
 * Bottom nav: Home | Work Orders | Pest Log | Harvest | HR
 * All writes use queuedFetch (offline-first via SW bg-sync).
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { queuedFetch, onConnectivityChange } from './offlineQueue';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const hdrs = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

const apiGet = async (path) => {
  const r = await fetch(`${API}${path}`, { headers: hdrs() });
  if (!r.ok) throw new Error(r.status);
  return r.json();
};

const apiPost = async (path, body) => {
  return queuedFetch(`${API}${path}`, {
    method: 'POST',
    headers: hdrs(),
    body: JSON.stringify(body),
    queueWhenOffline: true,
  });
};

// ─── Nav icons ────────────────────────────────────────────────────────────────

function Icon({ d, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const NAV = [
  { key: 'home',    label: 'Home',    d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { key: 'wo',      label: 'Work',    d: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
  { key: 'pest',    label: 'Pest',    d: 'M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zM12 12v10M8 16l-4 4M16 16l4 4' },
  { key: 'harvest', label: 'Harvest', d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { key: 'hr',      label: 'HR',      d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
];

// ─── Shared components ────────────────────────────────────────────────────────

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-4 ${className}`}>
      {children}
    </div>
  );
}

function Badge({ label, color = 'gray' }) {
  const map = {
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    red:   'bg-red-100 text-red-700',
    blue:  'bg-blue-100 text-blue-700',
    gray:  'bg-gray-100 text-gray-600',
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[color] || map.gray}`}>{label}</span>;
}

function FormInput({ label, value, onChange, type = 'text', required, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        required={required}
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options, required, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}{required && ' *'}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
        required={required}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Home tab ─────────────────────────────────────────────────────────────────

function HomeTab({ businessId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;
    Promise.all([
      apiGet(`/api/work-orders/summary/dashboard?business_id=${businessId}`).catch(() => null),
      apiGet(`/api/harvest-lots/summary?business_id=${businessId}`).catch(() => null),
      apiGet(`/api/hr/summary?business_id=${businessId}`).catch(() => null),
    ]).then(([wo, hl, hr]) => {
      setSummary({ wo, hl, hr });
      setLoading(false);
    });
  }, [businessId]);

  if (loading) return <div className="py-16 text-center text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Today's Overview</h2>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Open WOs</p>
          <p className="text-2xl font-bold text-blue-600">{summary?.wo?.open_count ?? '—'}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">In Storage</p>
          <p className="text-2xl font-bold text-green-600">{summary?.hl?.in_storage ?? '—'}</p>
          <p className="text-xs text-gray-400">harvest lots</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Employees</p>
          <p className="text-2xl font-bold text-gray-800">{summary?.hr?.total_employees ?? '—'}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Leave Today</p>
          <p className="text-2xl font-bold text-amber-600">{summary?.hr?.on_leave_today ?? '—'}</p>
        </Card>
      </div>
      <Card>
        <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Quick Tips</p>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• All entries save offline and sync when connected.</li>
          <li>• Tap <span className="font-semibold">Work</span> to log or update work orders.</li>
          <li>• Tap <span className="font-semibold">Pest</span> to record field observations.</li>
          <li>• Tap <span className="font-semibold">Harvest</span> to log incoming lots.</li>
        </ul>
      </Card>
    </div>
  );
}

// ─── Work Orders tab ──────────────────────────────────────────────────────────

const WO_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];
const WO_STATUS_COLOR = { pending: 'amber', in_progress: 'blue', completed: 'green' };

function WorkOrdersTab({ businessId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ Title: '', Description: '', AssignedTo: '', DueDate: '', Priority: 'normal', TaskType: 'general' });

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await apiGet(`/api/work-orders?business_id=${businessId}&status=pending`);
      setOrders(Array.isArray(data) ? data.slice(0, 20) : data.work_orders?.slice(0, 20) || []);
    } catch { setOrders([]); }
    setLoading(false);
  }, [businessId]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await apiPost('/api/work-orders', { ...form, BusinessID: Number(businessId) });
    setSaving(false);
    setSaved(true);
    setShowForm(false);
    setForm({ Title: '', Description: '', AssignedTo: '', DueDate: '', Priority: 'normal', TaskType: 'general' });
    setTimeout(() => setSaved(false), 2500);
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Work Orders</h2>
        <button onClick={() => setShowForm(v => !v)}
          className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">
          + New WO
        </button>
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2">Saved{navigator.onLine ? '' : ' (queued offline)'}!</div>}

      {showForm && (
        <Card>
          <form onSubmit={submit} className="space-y-3">
            <p className="font-semibold text-gray-800 text-sm">New Work Order</p>
            <FormInput label="Title" value={form.Title} onChange={v => setForm(f => ({ ...f, Title: v }))} required />
            <FormInput label="Description" value={form.Description} onChange={v => setForm(f => ({ ...f, Description: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Assigned To" value={form.AssignedTo} onChange={v => setForm(f => ({ ...f, AssignedTo: v }))} />
              <FormInput label="Due Date" value={form.DueDate} onChange={v => setForm(f => ({ ...f, DueDate: v }))} type="date" />
              <FormSelect label="Priority" value={form.Priority} onChange={v => setForm(f => ({ ...f, Priority: v }))}
                options={[{value:'low',label:'Low'},{value:'normal',label:'Normal'},{value:'high',label:'High'},{value:'urgent',label:'Urgent'}]} />
              <FormSelect label="Type" value={form.TaskType} onChange={v => setForm(f => ({ ...f, TaskType: v }))}
                options={[{value:'general',label:'General'},{value:'planting',label:'Planting'},{value:'irrigation',label:'Irrigation'},{value:'harvest',label:'Harvest'},{value:'maintenance',label:'Maintenance'}]} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 px-3 py-2">Cancel</button>
              <button type="submit" disabled={saving}
                className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-xl disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {loading && <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>}
      {!loading && orders.length === 0 && (
        <div className="py-8 text-center text-gray-400 text-sm">No open work orders.</div>
      )}
      {orders.map(wo => (
        <Card key={wo.WOID || wo.woid}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{wo.Title || wo.title}</p>
              {(wo.AssignedTo || wo.assigned_to) && (
                <p className="text-xs text-gray-500 mt-0.5">→ {wo.AssignedTo || wo.assigned_to}</p>
              )}
              {(wo.DueDate || wo.due_date) && (
                <p className="text-xs text-gray-400">{(wo.DueDate || wo.due_date)?.split('T')[0]}</p>
              )}
            </div>
            <Badge label={wo.Status || wo.status || 'pending'} color={WO_STATUS_COLOR[wo.Status || wo.status] || 'gray'} />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Pest Log tab ─────────────────────────────────────────────────────────────

const PEST_SEVERITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];
const SEV_COLOR = { low: 'green', medium: 'amber', high: 'red', critical: 'red' };

function PestLogTab({ businessId }) {
  const [obs, setObs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ pest_name: '', crop_affected: '', field_name: '', severity: 'low', observation_date: today, notes: '', action_taken: '' });

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await apiGet(`/api/farm-kpi/pest-observations?business_id=${businessId}&limit=20`);
      setObs(Array.isArray(data) ? data : data.observations || []);
    } catch { setObs([]); }
    setLoading(false);
  }, [businessId]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await apiPost('/api/farm-kpi/pest-observations', { ...form, business_id: Number(businessId) });
    setSaving(false);
    setSaved(true);
    setShowForm(false);
    setForm({ pest_name: '', crop_affected: '', field_name: '', severity: 'low', observation_date: today, notes: '', action_taken: '' });
    setTimeout(() => setSaved(false), 2500);
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Pest Log</h2>
        <button onClick={() => setShowForm(v => !v)}
          className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">
          + Log Pest
        </button>
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2">Saved{navigator.onLine ? '' : ' (queued offline)'}!</div>}

      {showForm && (
        <Card>
          <form onSubmit={submit} className="space-y-3">
            <p className="font-semibold text-gray-800 text-sm">Record Observation</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Pest / Disease" value={form.pest_name} onChange={v => setForm(f => ({ ...f, pest_name: v }))} required />
              <FormInput label="Crop Affected" value={form.crop_affected} onChange={v => setForm(f => ({ ...f, crop_affected: v }))} />
              <FormInput label="Field / Location" value={form.field_name} onChange={v => setForm(f => ({ ...f, field_name: v }))} />
              <FormSelect label="Severity" value={form.severity} onChange={v => setForm(f => ({ ...f, severity: v }))} options={PEST_SEVERITIES} required />
              <FormInput label="Date" value={form.observation_date} onChange={v => setForm(f => ({ ...f, observation_date: v }))} type="date" className="col-span-2" />
            </div>
            <FormInput label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} />
            <FormInput label="Action Taken" value={form.action_taken} onChange={v => setForm(f => ({ ...f, action_taken: v }))} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 px-3 py-2">Cancel</button>
              <button type="submit" disabled={saving}
                className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-xl disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {loading && <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>}
      {!loading && obs.length === 0 && (
        <div className="py-8 text-center text-gray-400 text-sm">No pest observations recorded.</div>
      )}
      {obs.map((o, i) => (
        <Card key={o.ObsID || o.obs_id || i}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{o.PestName || o.pest_name}</p>
              {(o.CropAffected || o.crop_affected) && (
                <p className="text-xs text-gray-500">Crop: {o.CropAffected || o.crop_affected}</p>
              )}
              {(o.FieldName || o.field_name) && (
                <p className="text-xs text-gray-500">Field: {o.FieldName || o.field_name}</p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">{(o.ObservationDate || o.observation_date)?.split('T')[0]}</p>
            </div>
            <Badge label={o.Severity || o.severity || 'low'} color={SEV_COLOR[o.Severity || o.severity] || 'gray'} />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Harvest tab ──────────────────────────────────────────────────────────────

function HarvestTab({ businessId }) {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ crop_name: '', variety: '', quantity_kg: '', harvest_date: today, field_name: '', quality_grade: 'A', notes: '' });

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await apiGet(`/api/harvest-lots/lots?business_id=${businessId}`);
      setLots(Array.isArray(data) ? data.slice(0, 20) : data.lots?.slice(0, 20) || []);
    } catch { setLots([]); }
    setLoading(false);
  }, [businessId]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await apiPost('/api/harvest-lots/lots', { ...form, business_id: Number(businessId), quantity_kg: parseFloat(form.quantity_kg) || 0 });
    setSaving(false);
    setSaved(true);
    setShowForm(false);
    setForm({ crop_name: '', variety: '', quantity_kg: '', harvest_date: today, field_name: '', quality_grade: 'A', notes: '' });
    setTimeout(() => setSaved(false), 2500);
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Harvest Lots</h2>
        <button onClick={() => setShowForm(v => !v)}
          className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">
          + Log Harvest
        </button>
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2">Saved{navigator.onLine ? '' : ' (queued offline)'}!</div>}

      {showForm && (
        <Card>
          <form onSubmit={submit} className="space-y-3">
            <p className="font-semibold text-gray-800 text-sm">Log Harvest Lot</p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Crop" value={form.crop_name} onChange={v => setForm(f => ({ ...f, crop_name: v }))} required />
              <FormInput label="Variety" value={form.variety} onChange={v => setForm(f => ({ ...f, variety: v }))} />
              <FormInput label="Quantity (kg)" value={form.quantity_kg} onChange={v => setForm(f => ({ ...f, quantity_kg: v }))} type="number" required />
              <FormInput label="Harvest Date" value={form.harvest_date} onChange={v => setForm(f => ({ ...f, harvest_date: v }))} type="date" />
              <FormInput label="Field" value={form.field_name} onChange={v => setForm(f => ({ ...f, field_name: v }))} />
              <FormSelect label="Grade" value={form.quality_grade} onChange={v => setForm(f => ({ ...f, quality_grade: v }))}
                options={['A','B','C','Reject'].map(g => ({ value: g, label: g }))} />
            </div>
            <FormInput label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 px-3 py-2">Cancel</button>
              <button type="submit" disabled={saving}
                className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-xl disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {loading && <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>}
      {!loading && lots.length === 0 && (
        <div className="py-8 text-center text-gray-400 text-sm">No harvest lots found.</div>
      )}
      {lots.map((lot, i) => (
        <Card key={lot.lot_id || lot.LotID || i}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{lot.crop_name || lot.CropName}</p>
              {(lot.field_name || lot.FieldName) && (
                <p className="text-xs text-gray-500">Field: {lot.field_name || lot.FieldName}</p>
              )}
              <p className="text-xs text-gray-500">{(lot.quantity_kg || lot.QuantityKg || 0).toLocaleString()} kg · Grade {lot.quality_grade || lot.QualityGrade}</p>
              <p className="text-xs text-gray-400">{(lot.harvest_date || lot.HarvestDate)?.split('T')[0]}</p>
            </div>
            <Badge label={lot.status || lot.Status || 'in_storage'} color={lot.status === 'shipped' || lot.Status === 'shipped' ? 'green' : 'blue'} />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── HR tab ───────────────────────────────────────────────────────────────────

function HRTab({ businessId }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAttForm, setShowAttForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [attForm, setAttForm] = useState({ employee_id: '', attendance_date: today, status: 'present', check_in: '', check_out: '' });

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await apiGet(`/api/hr/employees?business_id=${businessId}`);
      setEmployees(Array.isArray(data) ? data.slice(0, 30) : data.employees?.slice(0, 30) || []);
    } catch { setEmployees([]); }
    setLoading(false);
  }, [businessId]);

  useEffect(() => { load(); }, [load]);

  const submitAtt = async (e) => {
    e.preventDefault();
    setSaving(true);
    await apiPost('/api/hr/attendance', { ...attForm, business_id: Number(businessId), employee_id: Number(attForm.employee_id) });
    setSaving(false);
    setSaved(true);
    setShowAttForm(false);
    setAttForm({ employee_id: '', attendance_date: today, status: 'present', check_in: '', check_out: '' });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">HR — Attendance</h2>
        <button onClick={() => setShowAttForm(v => !v)}
          className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">
          + Log Attendance
        </button>
      </div>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2">Saved{navigator.onLine ? '' : ' (queued offline)'}!</div>}

      {showAttForm && (
        <Card>
          <form onSubmit={submitAtt} className="space-y-3">
            <p className="font-semibold text-gray-800 text-sm">Log Attendance</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Employee *</label>
                <select value={attForm.employee_id} onChange={e => setAttForm(f => ({ ...f, employee_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" required>
                  <option value="">Select employee</option>
                  {employees.map(em => (
                    <option key={em.employee_id || em.EmployeeID} value={em.employee_id || em.EmployeeID}>
                      {em.full_name || em.FullName}
                    </option>
                  ))}
                </select>
              </div>
              <FormInput label="Date" value={attForm.attendance_date} onChange={v => setAttForm(f => ({ ...f, attendance_date: v }))} type="date" />
              <FormSelect label="Status" value={attForm.status} onChange={v => setAttForm(f => ({ ...f, status: v }))}
                options={[{value:'present',label:'Present'},{value:'absent',label:'Absent'},{value:'late',label:'Late'},{value:'half_day',label:'Half Day'}]} />
              <FormInput label="Check In" value={attForm.check_in} onChange={v => setAttForm(f => ({ ...f, check_in: v }))} type="time" />
              <FormInput label="Check Out" value={attForm.check_out} onChange={v => setAttForm(f => ({ ...f, check_out: v }))} type="time" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAttForm(false)} className="text-sm text-gray-500 px-3 py-2">Cancel</button>
              <button type="submit" disabled={saving}
                className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-xl disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {loading && <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>}
      {!loading && employees.length === 0 && (
        <div className="py-8 text-center text-gray-400 text-sm">No employees found. Add them in the HR Dashboard.</div>
      )}
      {employees.map((em, i) => (
        <Card key={em.employee_id || em.EmployeeID || i}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{em.full_name || em.FullName}</p>
              <p className="text-xs text-gray-500">{em.position || em.Position || 'Field Worker'}</p>
            </div>
            <Badge label={em.employment_status || em.EmploymentStatus || 'active'}
              color={em.employment_status === 'active' || em.EmploymentStatus === 'active' ? 'green' : 'gray'} />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Root shell ───────────────────────────────────────────────────────────────

export default function AgriERPMobile() {
  const [params] = useSearchParams();
  const businessId = params.get('BusinessID');
  const [tab, setTab] = useState('home');
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => onConnectivityChange(setOnline), []);

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="font-bold text-gray-900 text-base">AgriERP Field</div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-red-400'}`} />
          <span className="text-xs text-gray-500">{online ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'home'    && <HomeTab    businessId={businessId} />}
        {tab === 'wo'      && <WorkOrdersTab businessId={businessId} />}
        {tab === 'pest'    && <PestLogTab businessId={businessId} />}
        {tab === 'harvest' && <HarvestTab businessId={businessId} />}
        {tab === 'hr'      && <HRTab      businessId={businessId} />}
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="flex">
          {NAV.map(n => (
            <button key={n.key} onClick={() => setTab(n.key)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${tab === n.key ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icon d={n.d} size={20} />
              <span className="text-[10px] font-semibold">{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
