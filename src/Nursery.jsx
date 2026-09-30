import React, { useEffect, useState, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';

const STATUS_COLORS = {
  germinating: { bg: '#fef9c3', color: '#854d0e' },
  growing:     { bg: '#d1fae5', color: '#065f46' },
  ready:       { bg: '#dbeafe', color: '#1e40af' },
  transplanted:{ bg: '#f3e8ff', color: '#6b21a8' },
  failed:      { bg: '#fee2e2', color: '#991b1b' },
};

const STATUSES = ['germinating', 'growing', 'ready', 'transplanted', 'failed'];

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, fontSize: '0.65rem', fontWeight: 700,
      padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {status}
    </span>
  );
}

export default function Nursery() {
  const [params] = useSearchParams();
  const BusinessID = params.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const [tab, setTab] = useState('batches');
  const [batches, setBatches] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [logs, setLogs] = useState([]);
  const [qcChecks, setQcChecks] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ CropName: '', Variety: '', PlantingDate: '', ExpectedTransplantDate: '',
    Quantity: '', Unit: 'seedlings', Substrate: '', Location: '', Status: 'germinating', Notes: '' });
  const [logForm, setLogForm] = useState({ LoggedDate: new Date().toISOString().split('T')[0],
    HeightCm: '', GerminationPct: '', HealthScore: '', Notes: '', LoggedBy: '' });
  const [qcForm, setQcForm] = useState({ CheckDate: new Date().toISOString().split('T')[0],
    PassFail: 'pass', Issues: '', CheckedBy: '', ReadyToTransplant: false });

  useEffect(() => { if (BusinessID) LoadBusiness(BusinessID); }, [BusinessID]);

  const load = useCallback(async () => {
    if (!BusinessID) return;
    setLoading(true);
    try {
      const [bRes, sRes] = await Promise.all([
        fetch(`${API}/api/nursery/batches?business_id=${BusinessID}${filterStatus ? `&status=${filterStatus}` : ''}`),
        fetch(`${API}/api/nursery/summary?business_id=${BusinessID}`),
      ]);
      setBatches(bRes.ok ? await bRes.json() : []);
      setSummary(sRes.ok ? await sRes.json() : null);
    } catch {} finally { setLoading(false); }
  }, [BusinessID, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (batch) => {
    setSelected(batch);
    setTab('detail');
    const [lRes, qRes, iRes] = await Promise.all([
      fetch(`${API}/api/nursery/batches/${batch.BatchID}/growth-logs`),
      fetch(`${API}/api/nursery/batches/${batch.BatchID}/qc`),
      fetch(`${API}/api/nursery/batches/${batch.BatchID}/inputs`),
    ]);
    setLogs(lRes.ok ? await lRes.json() : []);
    setQcChecks(qRes.ok ? await qRes.json() : []);
    setInputs(iRes.ok ? await iRes.json() : []);
  };

  const addBatch = async () => {
    await fetch(`${API}/api/nursery/batches`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, BusinessID: parseInt(BusinessID) }),
    });
    setShowAdd(false);
    setForm({ CropName: '', Variety: '', PlantingDate: '', ExpectedTransplantDate: '',
      Quantity: '', Unit: 'seedlings', Substrate: '', Location: '', Status: 'germinating', Notes: '' });
    load();
  };

  const addLog = async () => {
    await fetch(`${API}/api/nursery/batches/${selected.BatchID}/growth-logs`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logForm),
    });
    const r = await fetch(`${API}/api/nursery/batches/${selected.BatchID}/growth-logs`);
    setLogs(r.ok ? await r.json() : []);
    setLogForm({ LoggedDate: new Date().toISOString().split('T')[0], HeightCm: '', GerminationPct: '', HealthScore: '', Notes: '', LoggedBy: '' });
  };

  const addQC = async () => {
    await fetch(`${API}/api/nursery/batches/${selected.BatchID}/qc`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(qcForm),
    });
    const r = await fetch(`${API}/api/nursery/batches/${selected.BatchID}/qc`);
    setQcChecks(r.ok ? await r.json() : []);
    setQcForm({ CheckDate: new Date().toISOString().split('T')[0], PassFail: 'pass', Issues: '', CheckedBy: '', ReadyToTransplant: false });
  };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3D6B34]';
  const labelCls = 'text-xs font-semibold text-gray-500 mb-1 block';

  const KPI = ({ label, value, color = '#3D6B34' }) => (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value ?? '—'}</p>
    </div>
  );

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID}
      pageTitle="Nursery & Early Growth"
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Nursery' }]}>
      <div className="max-w-5xl mx-auto space-y-5">

        {/* KPI strip */}
        {summary && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <KPI label="Total Batches" value={summary.TotalBatches} />
            <KPI label="Germinating" value={summary.Germinating} color="#854d0e" />
            <KPI label="Growing" value={summary.Growing} color="#065f46" />
            <KPI label="Ready" value={summary.ReadyToTransplant} color="#1e40af" />
            <KPI label="Transplanted" value={summary.Transplanted} color="#6b21a8" />
            <KPI label="Total Seedlings" value={summary.TotalSeedlings ? Math.round(summary.TotalSeedlings) : 0} />
          </div>
        )}

        {/* Tabs + actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['batches', ...(selected ? ['detail'] : [])].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${tab === t ? 'bg-[#3D6B34] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t === 'detail' ? `${selected?.CropName} Detail` : 'Batches'}
              </button>
            ))}
          </div>
          {tab === 'batches' && (
            <div className="flex gap-2 items-center">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setShowAdd(true)}
                className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#2e5228]">
                + New Batch
              </button>
            </div>
          )}
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-gray-800">New Nursery Batch</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[['Crop Name*', 'CropName', 'text'], ['Variety', 'Variety', 'text'],
                ['Quantity', 'Quantity', 'number'], ['Unit', 'Unit', 'text'],
                ['Planting Date*', 'PlantingDate', 'date'], ['Expected Transplant', 'ExpectedTransplantDate', 'date'],
                ['Substrate', 'Substrate', 'text'], ['Location', 'Location', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className={inputCls} />
                </div>
              ))}
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.Status} onChange={e => setForm(f => ({ ...f, Status: e.target.value }))} className={inputCls}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea value={form.Notes} onChange={e => setForm(f => ({ ...f, Notes: e.target.value }))}
                className={inputCls} rows={2} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={addBatch} className="bg-[#3D6B34] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#2e5228]">
                Save Batch
              </button>
            </div>
          </div>
        )}

        {/* Batches list */}
        {tab === 'batches' && (
          loading ? <div className="text-center py-12 text-gray-400">Loading…</div> :
          batches.length === 0 ? <div className="text-center py-12 text-gray-400">No nursery batches yet.</div> :
          <div className="space-y-3">
            {batches.map(b => (
              <div key={b.BatchID} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-800 mr-2">{b.CropName}</span>
                  {b.Variety && <span className="text-sm text-gray-500 mr-2">· {b.Variety}</span>}
                  <StatusBadge status={b.Status} />
                  <p className="text-xs text-gray-400 mt-1">
                    Planted: {b.PlantingDate?.split('T')[0]} · {b.Quantity} {b.Unit}
                    {b.Location && ` · ${b.Location}`}
                    {b.ExpectedTransplantDate && ` · Transplant: ${b.ExpectedTransplantDate?.split('T')[0]}`}
                  </p>
                </div>
                <button onClick={() => loadDetail(b)}
                  className="text-sm text-[#3D6B34] font-semibold hover:underline">
                  View →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Detail tab */}
        {tab === 'detail' && selected && (
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[['Crop', selected.CropName], ['Variety', selected.Variety || '—'],
                ['Status', selected.Status], ['Quantity', `${selected.Quantity ?? '—'} ${selected.Unit || ''}`],
                ['Planted', selected.PlantingDate?.split('T')[0]], ['Transplant', selected.ExpectedTransplantDate?.split('T')[0] || '—'],
                ['Substrate', selected.Substrate || '—'], ['Location', selected.Location || '—']].map(([l, v]) => (
                <div key={l}><span className="text-gray-500 text-xs">{l}</span><p className="font-semibold">{v}</p></div>
              ))}
            </div>

            {/* Growth Logs */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-gray-800">Growth Logs</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[['Date', 'LoggedDate', 'date'], ['Height (cm)', 'HeightCm', 'number'],
                  ['Germination %', 'GerminationPct', 'number'], ['Health Score', 'HealthScore', 'number'],
                  ['Notes', 'Notes', 'text'], ['Logged By', 'LoggedBy', 'text']].map(([label, key, type]) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input type={type} value={logForm[key]} onChange={e => setLogForm(f => ({ ...f, [key]: e.target.value }))}
                      className={inputCls} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={addLog} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                  + Log Growth
                </button>
              </div>
              {logs.length === 0 ? <p className="text-gray-400 text-sm">No growth logs yet.</p> :
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-gray-400 border-b">
                    <th className="py-1.5">Date</th><th>Height</th><th>Germ%</th><th>Score</th><th>By</th>
                  </tr></thead>
                  <tbody>
                    {logs.map(l => (
                      <tr key={l.LogID} className="border-b border-gray-50">
                        <td className="py-1.5">{l.LoggedDate?.split('T')[0]}</td>
                        <td>{l.HeightCm ?? '—'}</td>
                        <td>{l.GerminationPct ?? '—'}</td>
                        <td>{l.HealthScore ?? '—'}</td>
                        <td>{l.LoggedBy || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
            </div>

            {/* QC Checks */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-gray-800">QC Checks</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div><label className={labelCls}>Date</label>
                  <input type="date" value={qcForm.CheckDate} onChange={e => setQcForm(f => ({ ...f, CheckDate: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Result</label>
                  <select value={qcForm.PassFail} onChange={e => setQcForm(f => ({ ...f, PassFail: e.target.value }))} className={inputCls}>
                    <option value="pass">Pass</option><option value="fail">Fail</option><option value="conditional">Conditional</option>
                  </select></div>
                <div><label className={labelCls}>Checked By</label>
                  <input type="text" value={qcForm.CheckedBy} onChange={e => setQcForm(f => ({ ...f, CheckedBy: e.target.value }))} className={inputCls} /></div>
                <div className="col-span-2"><label className={labelCls}>Issues Found</label>
                  <input type="text" value={qcForm.Issues} onChange={e => setQcForm(f => ({ ...f, Issues: e.target.value }))} className={inputCls} /></div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" checked={qcForm.ReadyToTransplant} onChange={e => setQcForm(f => ({ ...f, ReadyToTransplant: e.target.checked }))} />
                  <span className="text-sm">Ready to transplant</span>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={addQC} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                  + Add QC Check
                </button>
              </div>
              {qcChecks.length === 0 ? <p className="text-gray-400 text-sm">No QC checks yet.</p> :
                <div className="space-y-2">
                  {qcChecks.map(q => (
                    <div key={q.CheckID} className={`flex items-center justify-between rounded-lg px-3 py-2 ${q.PassFail === 'pass' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div>
                        <span className="font-semibold text-sm">{q.CheckDate?.split('T')[0]}</span>
                        <span className="mx-2 text-xs">{q.PassFail?.toUpperCase()}</span>
                        {q.Issues && <span className="text-xs text-gray-500">{q.Issues}</span>}
                      </div>
                      {q.ReadyToTransplant && <span className="text-xs text-blue-600 font-semibold">✓ Ready</span>}
                    </div>
                  ))}
                </div>}
            </div>
          </div>
        )}
      </div>
          <ThaiymeChat businessId={BusinessID} page="nursery" />
    </AccountLayout>
  );
}
