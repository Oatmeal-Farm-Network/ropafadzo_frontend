import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
function tok() { return localStorage.getItem('access_token'); }
function auth() { return { 'Content-Type': 'application/json', Authorization: `Bearer ${tok()}` }; }
function get(path) { return fetch(`${API}${path}`, { headers: auth() }).then(r => r.ok ? r.json() : []); }

const CURRENT_YEAR = String(new Date().getFullYear());
const PRODUCT_TYPES = ['Granular fertilizer', 'Liquid fertilizer', 'Organic', 'Lime', 'Micronutrient blend', 'Compost', 'Other'];
const METHODS = ['Broadcast', 'Band', 'Foliar', 'Fertigation', 'Side-dress', 'Top-dress', 'Injection'];

function npkBar(applied, planned, label, color) {
  const pct = planned ? Math.min(100, (applied / planned) * 100) : 0;
  const over = planned && applied > planned;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
        <span>{label}</span>
        <span>{applied.toFixed(1)} / {planned ? planned.toFixed(1) : '?'} kg/ha</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : color}`}
             style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AddPlanModal({ bid, fields, onClose, onSaved }) {
  const [form, setForm] = useState({ field_id: '', field_name: '', crop_name: '', season: CURRENT_YEAR,
    planned_n: '', planned_p: '', planned_k: '', planned_s: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => {
    const upd = { ...form, [k]: v };
    if (k === 'field_id') {
      const f = fields.find(x => String(x.field_id) === String(v));
      if (f) upd.field_name = f.field_name;
    }
    setForm(upd);
  };
  const save = async () => {
    setSaving(true);
    const body = { ...form, field_id: form.field_id || null,
      planned_n: form.planned_n ? +form.planned_n : null, planned_p: form.planned_p ? +form.planned_p : null,
      planned_k: form.planned_k ? +form.planned_k : null, planned_s: form.planned_s ? +form.planned_s : null };
    const r = await fetch(`${API}/api/nutrients/plans?business_id=${bid}`,
      { method: 'POST', headers: auth(), body: JSON.stringify(body) });
    setSaving(false);
    if (r.ok) { onSaved(); onClose(); }
  };
  const row = 'grid grid-cols-2 gap-3';
  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm';
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="font-bold text-gray-900 mb-4">New Nutrient Plan</h3>
        <div className="space-y-3">
          <div className={row}>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Field</label>
              <select className={inp} value={form.field_id} onChange={e => set('field_id', e.target.value)}>
                <option value="">Select field</option>
                {fields.map(f => <option key={f.field_id} value={f.field_id}>{f.field_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Season</label>
              <input className={inp} value={form.season} onChange={e => set('season', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Crop</label>
            <input className={inp} placeholder="e.g. Wheat" value={form.crop_name} onChange={e => set('crop_name', e.target.value)} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['N','P','K','S'].map(n => (
              <div key={n}>
                <label className="block text-xs text-gray-500 mb-1">Planned {n} (kg/ha)</label>
                <input type="number" className={inp} placeholder="0"
                  value={form[`planned_${n.toLowerCase()}`]}
                  onChange={e => set(`planned_${n.toLowerCase()}`, e.target.value)} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Notes</label>
            <textarea className={inp} rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={save} disabled={saving}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddApplicationModal({ bid, fields, onClose, onSaved }) {
  const [form, setForm] = useState({ field_id: '', field_name: '', app_date: new Date().toISOString().slice(0,10),
    product_name: '', product_type: '', n_rate: '', p_rate: '', k_rate: '', s_rate: '',
    application_method: '', area_ha: '', cost_per_ha: '', operator: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => {
    const upd = { ...form, [k]: v };
    if (k === 'field_id') {
      const f = fields.find(x => String(x.field_id) === String(v));
      if (f) upd.field_name = f.field_name;
    }
    setForm(upd);
  };
  const num = k => form[k] ? +form[k] : null;
  const save = async () => {
    setSaving(true);
    const body = { ...form, field_id: form.field_id || null,
      n_rate: num('n_rate'), p_rate: num('p_rate'), k_rate: num('k_rate'), s_rate: num('s_rate'),
      area_ha: num('area_ha'), cost_per_ha: num('cost_per_ha') };
    const r = await fetch(`${API}/api/nutrients/applications?business_id=${bid}`,
      { method: 'POST', headers: auth(), body: JSON.stringify(body) });
    setSaving(false);
    if (r.ok) { onSaved(); onClose(); }
  };
  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm';
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl my-4">
        <h3 className="font-bold text-gray-900 mb-4">Log Nutrient Application</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Field</label>
              <select className={inp} value={form.field_id} onChange={e => set('field_id', e.target.value)}>
                <option value="">Select field</option>
                {fields.map(f => <option key={f.field_id} value={f.field_id}>{f.field_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input type="date" className={inp} value={form.app_date} onChange={e => set('app_date', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Product Name *</label>
            <input className={inp} placeholder="e.g. Urea 46%, DAP" value={form.product_name} onChange={e => set('product_name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Product Type</label>
              <select className={inp} value={form.product_type} onChange={e => set('product_type', e.target.value)}>
                <option value="">Select type</option>
                {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Application Method</label>
              <select className={inp} value={form.application_method} onChange={e => set('application_method', e.target.value)}>
                <option value="">Select method</option>
                {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['n_rate','p_rate','k_rate','s_rate'].map(k => (
              <div key={k}>
                <label className="block text-xs text-gray-500 mb-1">{k.split('_')[0].toUpperCase()} (kg/ha)</label>
                <input type="number" step="0.01" className={inp} placeholder="0" value={form[k]} onChange={e => set(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Area (ha)</label>
              <input type="number" step="0.1" className={inp} value={form.area_ha} onChange={e => set('area_ha', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cost/ha</label>
              <input type="number" step="0.01" className={inp} value={form.cost_per_ha} onChange={e => set('cost_per_ha', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Operator</label>
              <input className={inp} value={form.operator} onChange={e => set('operator', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Notes</label>
            <textarea className={inp} rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={save} disabled={saving || !form.product_name}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Application'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NutrientManagement() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const [tab, setTab] = useState('applications');
  const [plans, setPlans] = useState([]);
  const [applications, setApplications] = useState([]);
  const [fields, setFields] = useState([]);
  const [budget, setBudget] = useState(null);
  const [budgetFieldId, setBudgetFieldId] = useState('');
  const [budgetSeason, setBudgetSeason] = useState(CURRENT_YEAR);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);

  const loadFields = () =>
    fetch(`${API}/api/field-health/fields-overview?business_id=${bid}`, { headers: auth() })
      .then(r => r.ok ? r.json() : []).then(setFields).catch(() => {});

  const loadPlans = () => get(`/api/nutrients/plans?business_id=${bid}`).then(setPlans);
  const loadApps  = () => get(`/api/nutrients/applications?business_id=${bid}`).then(setApplications);

  useEffect(() => { if (!bid) return; loadFields(); loadPlans(); loadApps(); }, [bid]);

  const loadBudget = () => {
    if (!bid || !budgetFieldId) return;
    get(`/api/nutrients/budget?business_id=${bid}&field_id=${budgetFieldId}&season=${budgetSeason}`).then(setBudget);
  };
  useEffect(() => { if (tab === 'budget') loadBudget(); }, [tab, budgetFieldId, budgetSeason]);

  const deletePlan = async id => {
    if (!confirm('Delete this plan?')) return;
    await fetch(`${API}/api/nutrients/plans/${id}?business_id=${bid}`, { method: 'DELETE', headers: auth() });
    loadPlans();
  };
  const deleteApp = async id => {
    if (!confirm('Delete this application?')) return;
    await fetch(`${API}/api/nutrients/applications/${id}?business_id=${bid}`, { method: 'DELETE', headers: auth() });
    loadApps();
  };

  const TABS = ['applications', 'plans', 'budget'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Nutrient Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Plan and track N/P/K/S applications per field and crop</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPlanModal(true)}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
            + New Plan
          </button>
          <button onClick={() => setShowAppModal(true)}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700">
            + Log Application
          </button>
        </div>
      </div>

      <div className="border-b bg-white px-6">
        <div className="flex gap-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'budget' ? 'Budget vs Applied' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-5xl">

        {tab === 'applications' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {applications.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-2">🌱</div>
                <p>No nutrient applications yet.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Date','Field','Product','N','P','K','S','Area (ha)','Cost',''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map(a => (
                    <tr key={a.AppID} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">{a.AppDate}</td>
                      <td className="px-4 py-3">{a.FieldName || '—'}</td>
                      <td className="px-4 py-3 font-medium">{a.ProductName}</td>
                      {['NRate_kg_ha','PRate_kg_ha','KRate_kg_ha','SRate_kg_ha'].map(k => (
                        <td key={k} className="px-4 py-3 text-gray-600">{a[k] != null ? Number(a[k]).toFixed(1) : '—'}</td>
                      ))}
                      <td className="px-4 py-3">{a.AreaHa ?? '—'}</td>
                      <td className="px-4 py-3">{a.TotalCost != null ? `$${Number(a.TotalCost).toFixed(0)}` : '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteApp(a.AppID)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {plans.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-gray-400">
                <div className="text-4xl mb-2">📋</div>
                <p>No nutrient plans yet. Create a plan to set N/P/K targets per field.</p>
              </div>
            ) : plans.map(p => (
              <div key={p.PlanID} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-900">{p.FieldName || 'All fields'}</div>
                    <div className="text-xs text-gray-500">{p.CropName} · {p.Season}</div>
                  </div>
                  <button onClick={() => deletePlan(p.PlanID)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[['N', p.PlannedN_kg_ha,'bg-blue-50 text-blue-700'],
                    ['P', p.PlannedP_kg_ha,'bg-orange-50 text-orange-700'],
                    ['K', p.PlannedK_kg_ha,'bg-purple-50 text-purple-700'],
                    ['S', p.PlannedS_kg_ha,'bg-yellow-50 text-yellow-700']].map(([n, v, cls]) => (
                    <div key={n} className={`rounded-lg p-2 ${cls}`}>
                      <div className="text-xs font-medium">{n}</div>
                      <div className="text-sm font-bold">{v ?? '—'}</div>
                    </div>
                  ))}
                </div>
                {p.Notes && <p className="text-xs text-gray-500 mt-2">{p.Notes}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'budget' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-5">
              <select value={budgetFieldId} onChange={e => setBudgetFieldId(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                <option value="">Select field…</option>
                {fields.map(f => <option key={f.field_id} value={f.field_id}>{f.field_name}</option>)}
              </select>
              <input type="number" value={budgetSeason} onChange={e => setBudgetSeason(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-24" placeholder="Season" />
              <button onClick={loadBudget}
                className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700">
                Load
              </button>
            </div>
            {!budgetFieldId && (
              <div className="text-center py-12 text-gray-400">Select a field to view the nutrient budget.</div>
            )}
            {budget && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">N/P/K/S Progress</h4>
                  {budget.plan ? (
                    <>
                      {npkBar(budget.applied?.N_kg_ha || 0, budget.plan.PlannedN_kg_ha, 'Nitrogen (N)', 'bg-blue-500')}
                      {npkBar(budget.applied?.P_kg_ha || 0, budget.plan.PlannedP_kg_ha, 'Phosphorus (P)', 'bg-orange-500')}
                      {npkBar(budget.applied?.K_kg_ha || 0, budget.plan.PlannedK_kg_ha, 'Potassium (K)', 'bg-purple-500')}
                      {npkBar(budget.applied?.S_kg_ha || 0, budget.plan.PlannedS_kg_ha, 'Sulfur (S)', 'bg-yellow-500')}
                      <div className="text-xs text-gray-500 mt-2">{budget.applied?.application_count || 0} applications this season</div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">No plan for this field / season. Create one in the Plans tab.</p>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Soil Deficiencies</h4>
                  {budget.soil_deficiencies.length === 0 ? (
                    <p className="text-xs text-gray-400">No deficiencies found in latest soil test, or no soil test on record.</p>
                  ) : budget.soil_deficiencies.map((d, i) => (
                    <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-800">{d.nutrient}</span>
                      <span className="text-gray-600">{d.value} {d.unit}</span>
                      <span className="text-red-600 font-medium">{d.rating}</span>
                    </div>
                  ))}
                  <Link to={`/soil-tests?BusinessID=${bid}`}
                    className="block text-xs text-center text-blue-600 hover:underline mt-3">
                    View Soil Tests →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showPlanModal && (
        <AddPlanModal bid={bid} fields={fields} onClose={() => setShowPlanModal(false)}
          onSaved={() => { loadPlans(); }} />
      )}
      {showAppModal && (
        <AddApplicationModal bid={bid} fields={fields} onClose={() => setShowAppModal(false)}
          onSaved={() => { loadApps(); }} />
      )}

      <SaigeWidget businessId={bid} pageContext="Nutrient Management" />
    </div>
  );
}
