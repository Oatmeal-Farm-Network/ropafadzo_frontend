/**
 * SupplyChainExceptions — Exception Management.
 * Live exception feed, severity triage, resolution notes, assignment, escalation rules.
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import TarrigonChat from './TarrigonChat';

const authH = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` });

const API = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';

const SEV_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high:     'bg-orange-100 text-orange-800 border-orange-300',
  medium:   'bg-amber-100 text-amber-800 border-amber-300',
  low:      'bg-gray-100 text-gray-700 border-gray-200',
};
const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const ETYPE_LABELS = {
  quality_fail:      'Quality Failure',
  temp_breach:       'Temperature Breach',
  volume_shortfall:  'Volume Shortfall',
  delay:             'Delivery Delay',
  other:             'Other',
};

function SevBadge({ severity }) {
  return (
    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${SEV_COLORS[severity] || SEV_COLORS.low}`}>
      {severity || 'unknown'}
    </span>
  );
}

function ExceptionDetail({ ex, businessId, onClose, onUpdated }) {
  const [note, setNote]       = useState('');
  const [assignTo, setAssignTo] = useState(ex.AssignedTo || '');
  const [newSev, setNewSev]   = useState(ex.Severity || '');
  const [saving, setSaving]   = useState(false);
  const [detail, setDetail]   = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/esci/exceptions/${ex.ExceptionID}`, { headers: authH() })
      .then(r => r.ok ? r.json() : null)
      .then(setDetail);
  }, [ex.ExceptionID]);

  const resolve = async () => {
    setSaving(true);
    await fetch(`${API}/api/esci/exceptions/${ex.ExceptionID}`, {
      method: 'PATCH',
      headers: authH(),
      body: JSON.stringify({ Status: 'resolved' }),
    });
    setSaving(false);
    onUpdated();
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    await fetch(`${API}/api/esci/exceptions/${ex.ExceptionID}/notes`, {
      method: 'POST',
      headers: authH(),
      body: JSON.stringify({ BusinessID: parseInt(businessId), NoteText: note }),
    });
    setNote('');
    setSaving(false);
    fetch(`${API}/api/esci/exceptions/${ex.ExceptionID}`, { headers: authH() })
      .then(r => r.ok ? r.json() : null).then(setDetail);
  };

  const assign = async () => {
    if (!assignTo.trim()) return;
    setSaving(true);
    await fetch(`${API}/api/esci/exceptions/${ex.ExceptionID}`, {
      method: 'PATCH',
      headers: authH(),
      body: JSON.stringify({ AssignedTo: assignTo.trim() }),
    });
    setSaving(false);
    setActiveAction(null);
    onUpdated();
  };

  const updateSeverity = async () => {
    if (!newSev || newSev === ex.Severity) return;
    setSaving(true);
    await fetch(`${API}/api/esci/exceptions/${ex.ExceptionID}`, {
      method: 'PATCH',
      headers: authH(),
      body: JSON.stringify({ Severity: newSev }),
    });
    setSaving(false);
    setActiveAction(null);
    onUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SevBadge severity={ex.Severity} />
                <span className="text-xs text-gray-500">{ETYPE_LABELS[ex.ExceptionType] || ex.ExceptionType}</span>
              </div>
              <h2 className="font-semibold text-gray-900">{ex.Title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>
          {ex.Detail && <p className="text-sm text-gray-600 mt-2">{ex.Detail}</p>}
          <div className="text-xs text-gray-400 mt-2 flex flex-wrap gap-x-3 gap-y-0.5">
            {ex.SupplierName && <span>Supplier: {ex.SupplierName}</span>}
            {ex.ShipmentProduct && <span>Product: {ex.ShipmentProduct}</span>}
            <span>Detected: {ex.DetectedAt ? ex.DetectedAt.slice(0, 16).replace('T', ' ') : '—'}</span>
            {ex.AssignedTo && <span className="text-emerald-700">Assigned: {ex.AssignedTo}</span>}
          </div>
          {/* Quick-action buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button onClick={() => setActiveAction(activeAction === 'assign' ? null : 'assign')}
              className={`text-xs px-2.5 py-1 rounded-lg border transition ${activeAction === 'assign' ? 'border-[#1e6b5a] text-[#1e6b5a] bg-[#e8f5f1]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              Assign
            </button>
            <button onClick={() => setActiveAction(activeAction === 'severity' ? null : 'severity')}
              className={`text-xs px-2.5 py-1 rounded-lg border transition ${activeAction === 'severity' ? 'border-amber-400 text-amber-700 bg-amber-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              Change Severity
            </button>
          </div>
          {activeAction === 'assign' && (
            <div className="flex items-center gap-2 mt-2">
              <input type="text" value={assignTo} onChange={e => setAssignTo(e.target.value)}
                placeholder="Name or email…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]" />
              <button onClick={assign} disabled={saving || !assignTo.trim()}
                className="px-3 py-1.5 text-xs text-white rounded-lg disabled:opacity-50"
                style={{ backgroundColor: TEAL }}>
                {saving ? '…' : 'Assign'}
              </button>
            </div>
          )}
          {activeAction === 'severity' && (
            <div className="flex items-center gap-2 mt-2">
              <select value={newSev} onChange={e => setNewSev(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                {['critical', 'high', 'medium', 'low'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={updateSeverity} disabled={saving || newSev === ex.Severity}
                className="px-3 py-1.5 text-xs text-white rounded-lg disabled:opacity-50"
                style={{ backgroundColor: TEAL }}>
                {saving ? '…' : 'Update'}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {detail?.notes?.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase">Notes</div>
              {detail.notes.map(n => (
                <div key={n.NoteID} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="text-gray-800">{n.NoteText}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.AuthorName || 'Team'} · {n.CreatedAt ? n.CreatedAt.slice(0, 16).replace('T', ' ') : ''}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder="Add a resolution note…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a] resize-none" />
            <div className="flex justify-end mt-1">
              <button onClick={addNote} disabled={!note.trim() || saving}
                className="px-3 py-1.5 text-xs text-white rounded-lg disabled:opacity-50"
                style={{ backgroundColor: TEAL }}>
                Add Note
              </button>
            </div>
          </div>
        </div>

        {ex.Status !== 'resolved' && (
          <div className="p-4 border-t border-gray-200">
            <button onClick={resolve} disabled={saving}
              className="w-full py-2 text-sm font-medium text-white rounded-xl disabled:opacity-50"
              style={{ backgroundColor: TEAL }}>
              {saving ? 'Resolving…' : 'Mark Resolved'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SupplyChainExceptions() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [exceptions, setExceptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('open');
  const [sevFilter, setSevFilter]       = useState('');
  const [selected, setSelected]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [liveCount, setLiveCount]       = useState(0);
  const [mainTab, setMainTab]           = useState('list');
  const [escRules, setEscRules]         = useState([]);
  const [escLoading, setEscLoading]     = useState(false);
  const [escForm, setEscForm]           = useState({ AutoSeverity: 'high', TriggerAfterHours: 24 });
  const [escSaving, setEscSaving]       = useState(false);
  const sseRef = useRef(null);

  const load = useCallback(() => {
    if (!BusinessID) return;
    let url = `${API}/api/esci/exceptions?business_id=${BusinessID}&limit=100`;
    if (statusFilter) url += `&status=${statusFilter}`;
    if (sevFilter) url += `&severity=${sevFilter}`;
    fetch(url)
      .then(r => r.ok ? r.json() : [])
      .then(d => { setExceptions(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [BusinessID, statusFilter, sevFilter]);

  useEffect(() => { load(); }, [load]);

  // SSE live feed for new exceptions
  useEffect(() => {
    if (!BusinessID) return;
    const since = new Date().toISOString();
    const es = new EventSource(`${API}/api/esci/stream/exceptions?business_id=${BusinessID}&since=${since}`);
    sseRef.current = es;
    es.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.stream === 'closed' || d.error) return;
        if (d.ExceptionID) {
          setLiveCount(c => c + 1);
          setExceptions(prev => [d, ...prev.filter(ex => ex.ExceptionID !== d.ExceptionID)]);
        }
      } catch {}
    };
    return () => es.close();
  }, [BusinessID]);

  const loadEscRules = useCallback(() => {
    if (!BusinessID) return;
    setEscLoading(true);
    fetch(`${API}/api/esci/escalation-rules?business_id=${BusinessID}`, { headers: authH() })
      .then(r => r.ok ? r.json() : [])
      .then(d => { setEscRules(Array.isArray(d) ? d : []); setEscLoading(false); })
      .catch(() => setEscLoading(false));
  }, [BusinessID]);

  useEffect(() => { if (mainTab === 'escalation') loadEscRules(); }, [mainTab, loadEscRules]);

  const saveEscRule = async () => {
    if (!BusinessID) return;
    setEscSaving(true);
    await fetch(`${API}/api/esci/escalation-rules`, {
      method: 'POST',
      headers: authH(),
      body: JSON.stringify({ ...escForm, BusinessID: parseInt(BusinessID) }),
    });
    setEscSaving(false);
    setEscForm({ AutoSeverity: 'high', TriggerAfterHours: 24 });
    loadEscRules();
  };

  const deleteEscRule = async (id) => {
    await fetch(`${API}/api/esci/escalation-rules/${id}`, { method: 'DELETE', headers: authH() });
    loadEscRules();
  };

  const runEscalation = async () => {
    await fetch(`${API}/api/esci/escalation-rules/run?business_id=${BusinessID}`, { method: 'POST', headers: authH() });
    load();
  };

  const counts = {
    critical: exceptions.filter(e => e.Severity === 'critical').length,
    high:     exceptions.filter(e => e.Severity === 'high').length,
    medium:   exceptions.filter(e => e.Severity === 'medium').length,
    low:      exceptions.filter(e => e.Severity === 'low').length,
  };

  return (
    <AccountLayout
      pageTitle="Exception Management"
      breadcrumbs={[
        { label: 'Account', to: '/account' },
        { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` },
        { label: 'Exceptions' },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">Exception Management</h1>
            <p className="text-sm text-gray-500">
              Quality failures, delays, temperature breaches
              {liveCount > 0 && <span className="ml-2 text-xs text-emerald-700 font-medium">· {liveCount} new since page load</span>}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1">
          {[['list', 'Exception Feed'], ['escalation', 'Escalation Rules']].map(([id, label]) => (
            <button key={id} onClick={() => setMainTab(id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${mainTab === id ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              style={mainTab === id ? { backgroundColor: TEAL } : {}}>
              {label}
            </button>
          ))}
        </div>

        {mainTab === 'escalation' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">Escalation Rules</div>
                <button onClick={runEscalation}
                  className="px-3 py-1.5 text-xs text-white rounded-lg"
                  style={{ backgroundColor: TEAL }}>
                  Run Escalation Now
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Rules automatically escalate open exceptions after a set time. Click "Run Escalation Now" to apply pending escalations immediately.
              </p>

              {/* Add rule form */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                <div className="text-xs font-semibold text-gray-600 uppercase">Add Rule</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Trigger After (hours)</label>
                    <input type="number" min="1" value={escForm.TriggerAfterHours || ''}
                      onChange={e => setEscForm(f => ({ ...f, TriggerAfterHours: parseInt(e.target.value) || 24 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Escalate To Severity</label>
                    <select value={escForm.AutoSeverity}
                      onChange={e => setEscForm(f => ({ ...f, AutoSeverity: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                      {['critical', 'high', 'medium', 'low'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Only for Severity (optional)</label>
                    <select value={escForm.TriggerSeverity || ''}
                      onChange={e => setEscForm(f => ({ ...f, TriggerSeverity: e.target.value || null }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                      <option value="">Any</option>
                      {['critical', 'high', 'medium', 'low'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Only for Type (optional)</label>
                    <select value={escForm.TriggerType || ''}
                      onChange={e => setEscForm(f => ({ ...f, TriggerType: e.target.value || null }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                      <option value="">Any</option>
                      {['quality_failure', 'delay', 'volume_shortfall', 'temperature_breach', 'documentation_missing', 'supplier_dispute', 'other'].map(t => (
                        <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={saveEscRule} disabled={escSaving}
                    className="px-4 py-1.5 text-sm text-white rounded-lg disabled:opacity-50"
                    style={{ backgroundColor: TEAL }}>
                    {escSaving ? 'Saving…' : 'Add Rule'}
                  </button>
                </div>
              </div>

              {/* Existing rules */}
              {escLoading ? (
                <div className="text-sm text-gray-400">Loading rules…</div>
              ) : escRules.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4">No escalation rules configured.</div>
              ) : (
                <div className="space-y-2">
                  {escRules.map(r => (
                    <div key={r.RuleID} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
                      <div className="text-sm text-gray-800">
                        Escalate to <strong>{r.AutoSeverity}</strong> after <strong>{r.TriggerAfterHours}h</strong>
                        {r.TriggerSeverity ? <span className="text-gray-500"> · only {r.TriggerSeverity}</span> : ''}
                        {r.TriggerType ? <span className="text-gray-500"> · only {r.TriggerType?.replace(/_/g, ' ')}</span> : ''}
                        {!r.IsActive && <span className="text-gray-400 ml-2">(inactive)</span>}
                      </div>
                      <button onClick={() => deleteEscRule(r.RuleID)}
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded transition">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {mainTab === 'list' && (
        <>
        {/* Severity KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SEVERITIES.map(sev => (
            <button key={sev} onClick={() => setSevFilter(sevFilter === sev ? '' : sev)}
              className={`text-left bg-white border rounded-xl p-3 transition hover:shadow-sm ${sevFilter === sev ? 'ring-2 ring-[#1e6b5a]' : 'border-gray-200'}`}>
              <div className="text-[10px] uppercase font-semibold text-gray-500">{sev}</div>
              <div className={`text-2xl font-bold mt-0.5 ${sev === 'critical' ? 'text-red-600' : sev === 'high' ? 'text-orange-600' : 'text-gray-900'}`}>
                {counts[sev]}
              </div>
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          {['open', 'resolved', ''].map(s => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-xs rounded-full border transition ${statusFilter === s ? 'text-white border-[#1e6b5a]' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
              style={statusFilter === s ? { backgroundColor: TEAL } : {}}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Exception list */}
        {loading ? (
          <div className="text-sm text-gray-400">Loading…</div>
        ) : exceptions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
            {statusFilter === 'open' ? 'No open exceptions.' : 'No exceptions found.'}
          </div>
        ) : (
          <div className="space-y-2">
            {exceptions.map(ex => (
              <div key={ex.ExceptionID}
                onClick={() => setSelected(ex)}
                className={`bg-white border rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:shadow-sm transition
                  ${ex.Severity === 'critical' ? 'border-red-300' : ex.Severity === 'high' ? 'border-orange-300' : 'border-gray-200'}`}>
                <div className="shrink-0 mt-0.5"><SevBadge severity={ex.Severity} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{ex.Title}</span>
                    <span className="text-xs text-gray-400">{ETYPE_LABELS[ex.ExceptionType] || ex.ExceptionType}</span>
                    {ex.Status === 'resolved' && (
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Resolved</span>
                    )}
                  </div>
                  {ex.Detail && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ex.Detail}</p>}
                  <div className="text-xs text-gray-400 mt-1">
                    {ex.SupplierName && <span>{ex.SupplierName} · </span>}
                    {ex.DetectedAt ? ex.DetectedAt.slice(0, 16).replace('T', ' ') : ''}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-gray-300 mt-1">
                  <path d="M6 4l4 4-4 4"/>
                </svg>
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </div>

      {selected && (
        <ExceptionDetail
          ex={selected}
          businessId={BusinessID}
          onClose={() => setSelected(null)}
          onUpdated={() => { setSelected(null); load(); }}
        />
      )}

      <TarrigonChat businessId={BusinessID} page="supply_chain_exceptions" />
    </AccountLayout>
  );
}
