import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountSidebar from './AccountSidebar.jsx';
import SaigeWidget from './SaigeWidget.jsx';

const API = '/api/agro-consult';

const VISIT_TYPES = ['General Assessment','Soil Health','Pest & Disease','Irrigation',
  'Fertilisation','Spray Program','Variety Selection','Yield Analysis','Regulatory','Other'];
const CONSULT_STATUSES = ['Scheduled','Completed','Cancelled'];
const REC_PRIORITIES = ['Low','Medium','High','Critical'];
const REC_STATUSES = ['Open','In Progress','Implemented','Declined'];

const VISIT_COLORS = {
  'General Assessment': 'bg-gray-100 text-gray-700',
  'Soil Health':        'bg-amber-100 text-amber-700',
  'Pest & Disease':     'bg-red-100 text-red-700',
  'Irrigation':         'bg-blue-100 text-blue-700',
  'Fertilisation':      'bg-green-100 text-green-700',
  'Spray Program':      'bg-orange-100 text-orange-700',
  'Variety Selection':  'bg-purple-100 text-purple-700',
  'Yield Analysis':     'bg-teal-100 text-teal-700',
  'Regulatory':         'bg-slate-100 text-slate-700',
  'Other':              'bg-gray-100 text-gray-600',
};

const PRIORITY_COLORS = {
  Low:      'bg-gray-100 text-gray-600',
  Medium:   'bg-yellow-100 text-yellow-700',
  High:     'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

const REC_STATUS_COLORS = {
  Open:         'bg-blue-100 text-blue-700',
  'In Progress':'bg-yellow-100 text-yellow-700',
  Implemented:  'bg-green-100 text-green-700',
  Declined:     'bg-gray-100 text-gray-400',
};

function authHdr() {
  const t = localStorage.getItem('access_token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function apiFetch(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...authHdr(), ...(opts.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Modals ────────────────────────────────────────────────────────────────────

function ConsultationModal({ initial, onSave, onClose }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    consultant_name: '', consultant_company: '', consultant_email: '',
    consultant_phone: '', visit_date: today, visit_type: 'General Assessment',
    fields_visited: '', findings: '', recommendations: '',
    follow_up_date: '', status: 'Scheduled', notes: '',
    ...initial,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-semibold text-gray-800">
            {initial?.consultation_id ? 'Edit Consultation' : 'Log Consultation'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Consultant Name *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.consultant_name}
                onChange={e => set('consultant_name', e.target.value)} placeholder="Dr. / Agron. name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company / Firm</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.consultant_company || ''}
                onChange={e => set('consultant_company', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.consultant_email || ''} onChange={e => set('consultant_email', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.consultant_phone || ''} onChange={e => set('consultant_phone', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Visit Date *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.visit_date} onChange={e => set('visit_date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Visit Type</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.visit_type} onChange={e => set('visit_type', e.target.value)}>
                {VISIT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.status} onChange={e => set('status', e.target.value)}>
                {CONSULT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fields / Blocks Visited</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.fields_visited || ''}
              onChange={e => set('fields_visited', e.target.value)}
              placeholder="e.g. Block A, Orchard 3, Greenhouse 2" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Findings</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3}
              value={form.findings || ''} onChange={e => set('findings', e.target.value)}
              placeholder="Observations, pest levels, soil conditions, etc." />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">General Recommendations</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3}
              value={form.recommendations || ''} onChange={e => set('recommendations', e.target.value)}
              placeholder="Summary of advice given" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Follow-up Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.follow_up_date || ''} onChange={e => set('follow_up_date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.notes || ''}
                onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)}
            className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">
            {initial?.consultation_id ? 'Save Changes' : 'Log Consultation'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendationModal({ consultations, initial, onSave, onClose }) {
  const [form, setForm] = useState({
    consultation_id: consultations[0]?.consultation_id || '',
    category: '', description: '', priority: 'Medium',
    due_date: '', status: 'Open', notes: '',
    ...initial,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const CATEGORIES = ['Irrigation','Fertilisation','Pest Control','Disease Management',
    'Pruning','Harvesting','Storage','Certification','Equipment','Other'];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-semibold text-gray-800">
            {initial?.recommendation_id ? 'Edit Recommendation' : 'Add Recommendation'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-3">
          {consultations.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Consultation</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.consultation_id} onChange={e => set('consultation_id', e.target.value)}>
                {consultations.map(c => (
                  <option key={c.consultation_id} value={c.consultation_id}>
                    {c.consultant_name} — {c.visit_date} ({c.visit_type})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.category || ''} onChange={e => set('category', e.target.value)}>
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.priority} onChange={e => set('priority', e.target.value)}>
                {REC_PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3}
              value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What specifically should be done?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.due_date || ''} onChange={e => set('due_date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.notes || ''}
                onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)}
            className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">
            {initial?.recommendation_id ? 'Save' : 'Add Recommendation'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Consultation card with expandable recommendations ─────────────────────────

function ConsultationCard({ consult, businessId, onEdit, onDelete, onAddRec }) {
  const [expanded, setExpanded] = useState(false);
  const [recs, setRecs] = useState(null);

  const loadRecs = useCallback(async () => {
    const data = await apiFetch(
      `${API}/consultations/${consult.consultation_id}/recommendations?business_id=${businessId}`
    );
    setRecs(data);
  }, [consult.consultation_id, businessId]);

  const toggle = () => {
    if (!expanded && recs === null) loadRecs();
    setExpanded(e => !e);
  };

  const updateRecStatus = async (recId, status) => {
    await apiFetch(`${API}/recommendations/${recId}/status?business_id=${businessId}`,
      { method: 'PATCH', body: JSON.stringify({ status }) });
    loadRecs();
  };

  const deleteRec = async (recId) => {
    await apiFetch(`${API}/recommendations/${recId}?business_id=${businessId}`, { method: 'DELETE' });
    loadRecs();
  };

  const isOverdue = (rec) => {
    if (!rec.due_date || rec.status === 'Implemented' || rec.status === 'Declined') return false;
    return new Date(rec.due_date) < new Date();
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{consult.consultant_name}</span>
              {consult.consultant_company && (
                <span className="text-sm text-gray-500">· {consult.consultant_company}</span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${VISIT_COLORS[consult.visit_type] || 'bg-gray-100 text-gray-600'}`}>
                {consult.visit_type}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                ${consult.status === 'Completed' ? 'bg-green-100 text-green-700'
                  : consult.status === 'Cancelled' ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-700'}`}>
                {consult.status}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mt-1 flex-wrap">
              <span>📅 {consult.visit_date}</span>
              {consult.fields_visited && <span>🌾 {consult.fields_visited}</span>}
              {consult.follow_up_date && <span>🔁 Follow-up: {consult.follow_up_date}</span>}
              {consult.rec_count > 0 && (
                <span className={`font-medium ${consult.open_recs > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {consult.rec_count} rec{consult.rec_count !== 1 ? 's' : ''}
                  {consult.open_recs > 0 && ` (${consult.open_recs} open)`}
                </span>
              )}
            </div>
            {consult.findings && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{consult.findings}</p>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={toggle}
              className="text-xs border rounded px-2 py-1 hover:bg-gray-50">
              {expanded ? '▲' : '▼'} Recs
            </button>
            <button onClick={() => onEdit(consult)}
              className="text-xs border rounded px-2 py-1 hover:bg-gray-50">Edit</button>
            <button onClick={() => onDelete(consult.consultation_id)}
              className="text-xs border border-red-200 text-red-500 rounded px-2 py-1 hover:bg-red-50">✕</button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t bg-gray-50 p-3">
          {recs === null ? (
            <div className="text-xs text-gray-400">Loading…</div>
          ) : (
            <>
              {recs.length === 0 ? (
                <div className="text-xs text-gray-400 mb-2">No recommendations yet</div>
              ) : (
                <div className="space-y-2 mb-2">
                  {recs.map(r => (
                    <div key={r.recommendation_id}
                      className={`bg-white rounded-lg border p-2.5 ${isOverdue(r) ? 'border-red-200' : ''}`}>
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-2 flex-wrap items-center">
                            {r.category && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {r.category}
                              </span>
                            )}
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[r.priority] || ''}`}>
                              {r.priority}
                            </span>
                            {isOverdue(r) && (
                              <span className="text-xs text-red-600 font-medium">Overdue</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-800 mt-1">{r.description}</div>
                          {r.due_date && (
                            <div className="text-xs text-gray-400 mt-0.5">Due: {r.due_date}</div>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0 items-start">
                          <select value={r.status}
                            onChange={e => updateRecStatus(r.recommendation_id, e.target.value)}
                            className={`text-xs border rounded px-1.5 py-0.5 ${REC_STATUS_COLORS[r.status] || ''}`}>
                            {REC_STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                          <button onClick={() => deleteRec(r.recommendation_id)}
                            className="text-red-300 hover:text-red-500 text-xs mt-0.5">✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => { onAddRec(consult); }}
                className="text-xs border border-dashed border-green-400 text-green-700 rounded px-3 py-1 hover:bg-green-50">
                + Add Recommendation
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── All-recs tab ──────────────────────────────────────────────────────────────

function AllRecsTab({ businessId, onAddRec }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ business_id: businessId });
    if (statusFilter) params.set('status', statusFilter);
    const data = await apiFetch(`${API}/recommendations?${params}`);
    setRecs(data);
    setLoading(false);
  }, [businessId, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (recId, status) => {
    await apiFetch(`${API}/recommendations/${recId}/status?business_id=${businessId}`,
      { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
  };

  const del = async (recId) => {
    await apiFetch(`${API}/recommendations/${recId}?business_id=${businessId}`, { method: 'DELETE' });
    load();
  };

  const isOverdue = (rec) => {
    if (!rec.due_date || rec.status === 'Implemented' || rec.status === 'Declined') return false;
    return new Date(rec.due_date) < new Date();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap items-center justify-between">
        <div className="flex gap-2">
          {['', 'Open', 'In Progress', 'Implemented'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                ${statusFilter === s ? 'bg-green-700 text-white border-green-700' : 'bg-white hover:bg-gray-50'}`}>
              {s || 'Active'}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500">{recs.length} recommendation{recs.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading…</div>
      ) : recs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-sm">No recommendations found</div>
        </div>
      ) : (
        <div className="space-y-2">
          {recs.map(r => (
            <div key={r.recommendation_id}
              className={`bg-white rounded-xl border p-3 ${isOverdue(r) ? 'border-red-300 bg-red-50' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 flex-wrap items-center mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[r.priority] || ''}`}>
                      {r.priority}
                    </span>
                    {r.category && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.category}</span>
                    )}
                    {isOverdue(r) && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-900">{r.description}</div>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                    <span>👤 {r.consultant_name}</span>
                    <span>📅 Visit: {r.visit_date}</span>
                    {r.due_date && <span>⏰ Due: {r.due_date}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 items-start">
                  <select value={r.status}
                    onChange={e => updateStatus(r.recommendation_id, e.target.value)}
                    className={`text-xs border rounded px-2 py-1 ${REC_STATUS_COLORS[r.status] || ''}`}>
                    {REC_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => del(r.recommendation_id)}
                    className="text-red-300 hover:text-red-500 text-sm">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AgroConsultations() {
  const [searchParams] = useSearchParams();
  const businessId = Number(searchParams.get('BusinessID'));

  const [consultations, setConsultations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('consultations');
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [editingConsult, setEditingConsult] = useState(null);
  const [showRecModal, setShowRecModal] = useState(false);
  const [recConsult, setRecConsult] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [c, s] = await Promise.all([
      apiFetch(`${API}/consultations?business_id=${businessId}`),
      apiFetch(`${API}/summary?business_id=${businessId}`),
    ]);
    setConsultations(c);
    setSummary(s);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { if (businessId) loadData(); }, [loadData, businessId]);

  const saveConsult = async (body) => {
    if (editingConsult) {
      await apiFetch(
        `${API}/consultations/${editingConsult.consultation_id}?business_id=${businessId}`,
        { method: 'PUT', body: JSON.stringify(body) }
      );
    } else {
      await apiFetch(`${API}/consultations?business_id=${businessId}`,
        { method: 'POST', body: JSON.stringify(body) });
    }
    setShowConsultModal(false);
    setEditingConsult(null);
    loadData();
  };

  const deleteConsult = async (id) => {
    if (!window.confirm('Delete this consultation and all its recommendations?')) return;
    await apiFetch(`${API}/consultations/${id}?business_id=${businessId}`, { method: 'DELETE' });
    loadData();
  };

  const saveRec = async (body) => {
    await apiFetch(`${API}/recommendations?business_id=${businessId}`,
      { method: 'POST', body: JSON.stringify(body) });
    setShowRecModal(false);
    setRecConsult(null);
    loadData();
  };

  const openAddRec = (consult) => {
    setRecConsult(consult);
    setShowRecModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AccountSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agronomist Consultations</h1>
              <p className="text-sm text-gray-500 mt-1">Log field visits and track expert recommendations</p>
            </div>
            <button onClick={() => { setEditingConsult(null); setShowConsultModal(true); }}
              className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800">
              + Log Consultation
            </button>
          </div>

          {/* Summary */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { label: 'Total Visits', value: summary.total_consultations, color: 'text-gray-700' },
                { label: 'Last 6 months', value: summary.consultations_6m, color: 'text-blue-600' },
                { label: 'Open Recs', value: summary.open_recs, color: 'text-orange-600' },
                { label: 'Overdue', value: summary.overdue_recs, color: 'text-red-600' },
                { label: 'Upcoming Follow-ups', value: summary.upcoming_followups, color: 'text-purple-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl p-4 border shadow-sm">
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-0 border-b mb-4">
            {[
              { key: 'consultations', label: `Consultations (${consultations.length})` },
              { key: 'recommendations', label: `All Recommendations${summary?.open_recs > 0 ? ` (${summary.open_recs} open)` : ''}` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-sm border-b-2 -mb-px font-medium transition-colors
                  ${tab === t.key ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'consultations' && (
            <>
              {loading ? (
                <div className="text-center py-12 text-gray-400">Loading…</div>
              ) : consultations.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-3">🌱</div>
                  <div className="font-medium">No consultations logged yet</div>
                  <div className="text-sm mt-1">Log your first agronomist visit to get started</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {consultations.map(c => (
                    <ConsultationCard key={c.consultation_id} consult={c} businessId={businessId}
                      onEdit={(c) => { setEditingConsult(c); setShowConsultModal(true); }}
                      onDelete={deleteConsult}
                      onAddRec={openAddRec} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'recommendations' && (
            <AllRecsTab businessId={businessId} onAddRec={openAddRec} />
          )}
        </div>
      </div>

      {showConsultModal && (
        <ConsultationModal initial={editingConsult}
          onSave={saveConsult}
          onClose={() => { setShowConsultModal(false); setEditingConsult(null); }} />
      )}

      {showRecModal && (
        <RecommendationModal
          consultations={recConsult ? [recConsult] : consultations}
          initial={recConsult ? { consultation_id: recConsult.consultation_id } : undefined}
          onSave={saveRec}
          onClose={() => { setShowRecModal(false); setRecConsult(null); }} />
      )}

      <SaigeWidget businessId={businessId} pageContext="Agronomist Consultation Log" />
    </div>
  );
}
