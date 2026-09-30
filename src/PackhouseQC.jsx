import React, { useState, useEffect, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const STATUS_COLORS = {
  open: 'bg-blue-100 text-blue-800',
  grading: 'bg-amber-100 text-amber-800',
  packaging: 'bg-purple-100 text-purple-800',
  dispatched: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const GRADE_COLORS = {
  A: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-amber-100 text-amber-800',
  reject: 'bg-red-100 text-red-800',
};

function Badge({ text, color }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{text}</span>;
}

function KpiCard({ label, value, sub, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function PackhouseQC() {
  const [params] = useSearchParams();
  const businessId = params.get('BusinessID');
  const authHdr = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };

  const [tab, setTab] = useState('batches');
  const [summary, setSummary] = useState(null);
  const [batches, setBatches] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchDetail, setBatchDetail] = useState(null);

  // forms
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchForm, setBatchForm] = useState({ commodity: '', variety: '', field_ref: '', harvest_date: '', gross_weight_kg: '', notes: '' });
  const [gradingForm, setGradingForm] = useState({ grade: 'A', weight_kg: '', bin_count: '', notes: '' });
  const [packForm, setPackForm] = useState({ pack_type: '', pack_count: '', net_weight_kg: '', destination: '', notes: '' });
  const [tplForm, setTplForm] = useState({ template_name: '', commodity: '', criteria: '' });
  const [inspForm, setInspForm] = useState({ template_id: '', inspector: '', overall_result: 'pass', findings: '', notes: '' });
  const [showTplForm, setShowTplForm] = useState(false);

  const load = useCallback(async () => {
    if (!businessId) return;
    try {
      const [sRes, bRes, tRes] = await Promise.all([
        fetch(`${API}/api/packhouse/summary?business_id=${businessId}`, { headers: authHdr }),
        fetch(`${API}/api/packhouse/batches?business_id=${businessId}${filterStatus ? `&status=${filterStatus}` : ''}`, { headers: authHdr }),
        fetch(`${API}/api/packhouse/qc-templates?business_id=${businessId}`, { headers: authHdr }),
      ]);
      if (sRes.ok) setSummary(await sRes.json());
      if (bRes.ok) setBatches(await bRes.json());
      if (tRes.ok) setTemplates(await tRes.json());
    } catch {}
  }, [businessId, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const loadBatchDetail = async (b) => {
    setSelectedBatch(b);
    setTab('detail');
    try {
      const [gRes, iRes, pRes] = await Promise.all([
        fetch(`${API}/api/packhouse/batches/${b.batch_id}/grading?business_id=${businessId}`, { headers: authHdr }),
        fetch(`${API}/api/packhouse/batches/${b.batch_id}/inspections?business_id=${businessId}`, { headers: authHdr }),
        fetch(`${API}/api/packhouse/batches/${b.batch_id}/packaging?business_id=${businessId}`, { headers: authHdr }),
      ]);
      setBatchDetail({
        grading: gRes.ok ? await gRes.json() : [],
        inspections: iRes.ok ? await iRes.json() : [],
        packaging: pRes.ok ? await pRes.json() : [],
      });
    } catch {}
  };

  const createBatch = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/packhouse/batches?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...batchForm, gross_weight_kg: parseFloat(batchForm.gross_weight_kg) || 0 }),
    });
    setBatchForm({ commodity: '', variety: '', field_ref: '', harvest_date: '', gross_weight_kg: '', notes: '' });
    setShowBatchForm(false);
    load();
  };

  const updateStatus = async (batchId, status) => {
    await fetch(`${API}/api/packhouse/batches/${batchId}/status?business_id=${businessId}`, {
      method: 'PUT', headers: { ...authHdr, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
    if (selectedBatch?.batch_id === batchId) setSelectedBatch(b => ({ ...b, status }));
  };

  const addGrading = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/packhouse/batches/${selectedBatch.batch_id}/grading?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...gradingForm, weight_kg: parseFloat(gradingForm.weight_kg) || 0, bin_count: parseInt(gradingForm.bin_count) || 0 }),
    });
    setGradingForm({ grade: 'A', weight_kg: '', bin_count: '', notes: '' });
    loadBatchDetail(selectedBatch);
  };

  const addPackaging = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/packhouse/batches/${selectedBatch.batch_id}/packaging?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...packForm, pack_count: parseInt(packForm.pack_count) || 0, net_weight_kg: parseFloat(packForm.net_weight_kg) || 0 }),
    });
    setPackForm({ pack_type: '', pack_count: '', net_weight_kg: '', destination: '', notes: '' });
    loadBatchDetail(selectedBatch);
  };

  const addInspection = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/packhouse/batches/${selectedBatch.batch_id}/inspections?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...inspForm, template_id: inspForm.template_id ? parseInt(inspForm.template_id) : null }),
    });
    setInspForm({ template_id: '', inspector: '', overall_result: 'pass', findings: '', notes: '' });
    loadBatchDetail(selectedBatch);
  };

  const createTemplate = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/packhouse/qc-templates?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_name: tplForm.template_name, commodity: tplForm.commodity, criteria_json: tplForm.criteria }),
    });
    setTplForm({ template_name: '', commodity: '', criteria: '' });
    setShowTplForm(false);
    load();
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    await fetch(`${API}/api/packhouse/qc-templates/${id}?business_id=${businessId}`, { method: 'DELETE', headers: authHdr });
    load();
  };

  const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400';

  return (
    <AccountLayout pageTitle="Packhouse & QC">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Packhouse & QC Inspection</h1>
            <p className="text-sm text-gray-500">Sorting, grading, packaging workflows and quality control</p>
          </div>
          <a
            href={`${API}/api/packhouse-qc/export?business_id=${businessId}`}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ↓ Export CSV
          </a>
        </div>

        {/* KPI strip */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <KpiCard label="Total Batches" value={summary.total_batches} />
            <KpiCard label="Open" value={summary.open} color="text-blue-600" />
            <KpiCard label="Grading" value={summary.grading} color="text-amber-600" />
            <KpiCard label="Packaging" value={summary.packaging} color="text-purple-600" />
            <KpiCard label="Dispatched" value={summary.dispatched} color="text-green-600" />
            <KpiCard label="Total Input (kg)" value={summary.total_input_kg != null ? summary.total_input_kg.toLocaleString() : '—'} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {['batches', 'templates', 'detail'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'detail' ? (selectedBatch ? `Batch: ${selectedBatch.batch_ref}` : 'Detail') : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Batches tab ── */}
        {tab === 'batches' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {['', 'open', 'grading', 'packaging', 'dispatched', 'rejected'].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterStatus === s ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowBatchForm(v => !v)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                + New Batch
              </button>
            </div>

            {showBatchForm && (
              <form onSubmit={createBatch} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-800">New Packhouse Batch</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Commodity *</label>
                    <input required className={inputCls} value={batchForm.commodity} onChange={e => setBatchForm(f => ({ ...f, commodity: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Variety</label>
                    <input className={inputCls} value={batchForm.variety} onChange={e => setBatchForm(f => ({ ...f, variety: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Field / Lot Ref</label>
                    <input className={inputCls} value={batchForm.field_ref} onChange={e => setBatchForm(f => ({ ...f, field_ref: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Harvest Date</label>
                    <input type="date" className={inputCls} value={batchForm.harvest_date} onChange={e => setBatchForm(f => ({ ...f, harvest_date: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Gross Weight (kg)</label>
                    <input type="number" step="0.01" className={inputCls} value={batchForm.gross_weight_kg} onChange={e => setBatchForm(f => ({ ...f, gross_weight_kg: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Notes</label>
                    <input className={inputCls} value={batchForm.notes} onChange={e => setBatchForm(f => ({ ...f, notes: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowBatchForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Create Batch</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Batch Ref', 'Commodity', 'Variety', 'Harvest Date', 'Input (kg)', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {batches.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">No batches found</td></tr>
                  )}
                  {batches.map(b => (
                    <tr key={b.batch_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-blue-600">{b.batch_ref}</td>
                      <td className="px-4 py-3 font-medium">{b.commodity}</td>
                      <td className="px-4 py-3 text-gray-600">{b.variety || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{b.harvest_date ? b.harvest_date.substring(0, 10) : '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{b.gross_weight_kg != null ? b.gross_weight_kg.toLocaleString() : '—'}</td>
                      <td className="px-4 py-3"><Badge text={b.status} color={STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'} /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => loadBatchDetail(b)} className="text-blue-600 hover:underline text-xs mr-2">View</button>
                        {b.status === 'open' && <button onClick={() => updateStatus(b.batch_id, 'grading')} className="text-amber-600 hover:underline text-xs mr-2">→ Grade</button>}
                        {b.status === 'grading' && <button onClick={() => updateStatus(b.batch_id, 'packaging')} className="text-purple-600 hover:underline text-xs mr-2">→ Package</button>}
                        {b.status === 'packaging' && <button onClick={() => updateStatus(b.batch_id, 'dispatched')} className="text-green-600 hover:underline text-xs">→ Dispatch</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Templates tab ── */}
        {tab === 'templates' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">QC Inspection Templates</h2>
              <button onClick={() => setShowTplForm(v => !v)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                + New Template
              </button>
            </div>

            {showTplForm && (
              <form onSubmit={createTemplate} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-800">New QC Template</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Template Name *</label>
                    <input required className={inputCls} value={tplForm.template_name} onChange={e => setTplForm(f => ({ ...f, template_name: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Commodity</label>
                    <input className={inputCls} value={tplForm.commodity} onChange={e => setTplForm(f => ({ ...f, commodity: e.target.value }))} /></div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Criteria (JSON or free text)</label>
                  <textarea rows={4} className={inputCls} placeholder='e.g. {"size":"60-80mm","brix":"12+","defects":"<2%"}' value={tplForm.criteria} onChange={e => setTplForm(f => ({ ...f, criteria: e.target.value }))} />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowTplForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Save Template</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.length === 0 && <p className="text-sm text-gray-400 col-span-3">No templates yet. Create one to standardize QC inspections.</p>}
              {templates.map(t => (
                <div key={t.template_id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{t.template_name}</p>
                      {t.commodity && <p className="text-xs text-gray-500 mt-0.5">{t.commodity}</p>}
                    </div>
                    <button onClick={() => deleteTemplate(t.template_id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                  </div>
                  {t.criteria_json && (
                    <div className="mt-2 bg-gray-50 rounded p-2 text-xs font-mono text-gray-600 overflow-auto max-h-24">
                      {typeof t.criteria_json === 'string' ? t.criteria_json : JSON.stringify(t.criteria_json, null, 2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Detail tab ── */}
        {tab === 'detail' && selectedBatch && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedBatch.batch_ref}</h2>
                  <p className="text-sm text-gray-500">{selectedBatch.commodity} {selectedBatch.variety ? `— ${selectedBatch.variety}` : ''}</p>
                </div>
                <Badge text={selectedBatch.status} color={STATUS_COLORS[selectedBatch.status] || 'bg-gray-100 text-gray-600'} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                <div><span className="text-gray-500">Harvest Date</span><p className="font-medium">{selectedBatch.harvest_date ? selectedBatch.harvest_date.substring(0,10) : '—'}</p></div>
                <div><span className="text-gray-500">Gross Weight</span><p className="font-medium">{selectedBatch.gross_weight_kg != null ? `${selectedBatch.gross_weight_kg} kg` : '—'}</p></div>
                <div><span className="text-gray-500">Field Ref</span><p className="font-medium">{selectedBatch.field_ref || '—'}</p></div>
                <div><span className="text-gray-500">Notes</span><p className="font-medium">{selectedBatch.notes || '—'}</p></div>
              </div>
            </div>

            {/* Grading */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-semibold text-gray-800">Sorting & Grading</h3>
              <form onSubmit={addGrading} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                <div><label className="text-xs text-gray-500 mb-1 block">Grade</label>
                  <select className={inputCls} value={gradingForm.grade} onChange={e => setGradingForm(f => ({ ...f, grade: e.target.value }))}>
                    {['A','B','C','reject'].map(g => <option key={g}>{g}</option>)}
                  </select></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Weight (kg)</label>
                  <input type="number" step="0.01" className={inputCls} value={gradingForm.weight_kg} onChange={e => setGradingForm(f => ({ ...f, weight_kg: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Bin Count</label>
                  <input type="number" className={inputCls} value={gradingForm.bin_count} onChange={e => setGradingForm(f => ({ ...f, bin_count: e.target.value }))} /></div>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Grade</button>
              </form>
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100">
                  <tr><th className="text-left py-2">Grade</th><th className="text-left py-2">Weight (kg)</th><th className="text-left py-2">Bins</th><th className="text-left py-2">Notes</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(batchDetail?.grading || []).map((g, i) => (
                    <tr key={i}>
                      <td className="py-2"><Badge text={g.grade} color={GRADE_COLORS[g.grade] || 'bg-gray-100 text-gray-600'} /></td>
                      <td className="py-2">{g.weight_kg}</td>
                      <td className="py-2">{g.bin_count ?? '—'}</td>
                      <td className="py-2 text-gray-500">{g.notes || '—'}</td>
                    </tr>
                  ))}
                  {!batchDetail?.grading?.length && <tr><td colSpan={4} className="py-4 text-center text-gray-400 text-xs">No grades recorded</td></tr>}
                </tbody>
              </table>
            </div>

            {/* QC Inspection */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-semibold text-gray-800">QC Inspections</h3>
              <form onSubmit={addInspection} className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                <div><label className="text-xs text-gray-500 mb-1 block">Template</label>
                  <select className={inputCls} value={inspForm.template_id} onChange={e => setInspForm(f => ({ ...f, template_id: e.target.value }))}>
                    <option value="">— None —</option>
                    {templates.map(t => <option key={t.template_id} value={t.template_id}>{t.template_name}</option>)}
                  </select></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Inspector</label>
                  <input className={inputCls} value={inspForm.inspector} onChange={e => setInspForm(f => ({ ...f, inspector: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Result</label>
                  <select className={inputCls} value={inspForm.overall_result} onChange={e => setInspForm(f => ({ ...f, overall_result: e.target.value }))}>
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                    <option value="conditional">Conditional</option>
                  </select></div>
                <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">Findings (JSON or free text)</label>
                  <input className={inputCls} value={inspForm.findings} onChange={e => setInspForm(f => ({ ...f, findings: e.target.value }))} /></div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Inspection</button>
              </form>
              <div className="space-y-2">
                {(batchDetail?.inspections || []).map((ins, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 text-sm">
                    <Badge text={ins.overall_result} color={ins.overall_result === 'pass' ? 'bg-green-100 text-green-800' : ins.overall_result === 'fail' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'} />
                    <div className="flex-1">
                      <p className="text-gray-600">{ins.inspector || 'Unknown inspector'} · {ins.inspected_at ? ins.inspected_at.substring(0,10) : ''}</p>
                      {ins.notes && <p className="text-gray-500 text-xs">{ins.notes}</p>}
                    </div>
                  </div>
                ))}
                {!batchDetail?.inspections?.length && <p className="text-xs text-gray-400">No inspections recorded</p>}
              </div>
            </div>

            {/* Packaging */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-semibold text-gray-800">Packaging</h3>
              <form onSubmit={addPackaging} className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                <div><label className="text-xs text-gray-500 mb-1 block">Pack Type</label>
                  <input className={inputCls} placeholder="e.g. 5kg box" value={packForm.pack_type} onChange={e => setPackForm(f => ({ ...f, pack_type: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Pack Count</label>
                  <input type="number" className={inputCls} value={packForm.pack_count} onChange={e => setPackForm(f => ({ ...f, pack_count: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Net Weight (kg)</label>
                  <input type="number" step="0.01" className={inputCls} value={packForm.net_weight_kg} onChange={e => setPackForm(f => ({ ...f, net_weight_kg: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Destination</label>
                  <input className={inputCls} value={packForm.destination} onChange={e => setPackForm(f => ({ ...f, destination: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Notes</label>
                  <input className={inputCls} value={packForm.notes} onChange={e => setPackForm(f => ({ ...f, notes: e.target.value }))} /></div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Packaging</button>
              </form>
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100">
                  <tr><th className="text-left py-2">Pack Type</th><th className="text-left py-2">Count</th><th className="text-left py-2">Net (kg)</th><th className="text-left py-2">Destination</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(batchDetail?.packaging || []).map((p, i) => (
                    <tr key={i}>
                      <td className="py-2">{p.pack_type}</td>
                      <td className="py-2">{p.pack_count}</td>
                      <td className="py-2">{p.net_weight_kg}</td>
                      <td className="py-2 text-gray-500">{p.destination || '—'}</td>
                    </tr>
                  ))}
                  {!batchDetail?.packaging?.length && <tr><td colSpan={4} className="py-4 text-center text-gray-400 text-xs">No packaging recorded</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'detail' && !selectedBatch && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <p>Select a batch from the Batches tab to view details.</p>
          </div>
        )}
      </div>
          <ThaiymeChat businessId={businessId} page="packhouse-qc" />
    </AccountLayout>
  );
}
