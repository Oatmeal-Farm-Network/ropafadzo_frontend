import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = ['Records', 'Active Threats', 'Alerts', 'Summary'];
const CATEGORIES = ['pest', 'disease', 'weed', 'nutrient_deficiency', 'other'];
const SEV_LABELS = { 0: 'None', 1: 'Trace', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Critical' };
const SEV_COLORS = {
  0: 'bg-gray-100 text-gray-500',
  1: 'bg-gray-100 text-gray-600',
  2: 'bg-yellow-100 text-yellow-700',
  3: 'bg-orange-100 text-orange-700',
  4: 'bg-red-100 text-red-700',
  5: 'bg-red-200 text-red-900',
};

function tok() { return localStorage.getItem('access_token'); }
function authH() { return { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' }; }

function SevBadge({ severity }) {
  const sev = Number(severity ?? 0);
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEV_COLORS[sev] || SEV_COLORS[0]}`}>
      {SEV_LABELS[sev] ?? sev}
    </span>
  );
}

export default function ScoutingLog() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const initialTab = params.get('tab') || 'Records';
  const [tab, setTab] = useState(TABS.includes(initialTab) ? initialTab : 'Records');

  const [records, setRecords] = useState([]);
  const [threats, setThreats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const fetchRecords = useCallback(async () => {
    if (!bid) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/scouting/records?limit=100`, { headers: authH() });
      if (r.ok) setRecords(await r.json());
    } finally { setLoading(false); }
  }, [bid]);

  const fetchThreats = useCallback(async () => {
    const r = await fetch(`${API}/api/scouting/active-threats`, { headers: authH() });
    if (r.ok) setThreats(await r.json());
  }, []);

  const fetchAlerts = useCallback(async () => {
    const r = await fetch(`${API}/api/scouting/alerts`, { headers: authH() });
    if (r.ok) setAlerts(await r.json());
  }, []);

  const fetchSummary = useCallback(async () => {
    const r = await fetch(`${API}/api/scouting/summary`, { headers: authH() });
    if (r.ok) setSummary(await r.json());
  }, []);

  const fetchDetail = useCallback(async (id) => {
    const r = await fetch(`${API}/api/scouting/records/${id}`, { headers: authH() });
    if (r.ok) setSelectedDetail(await r.json());
  }, []);

  const ackAlert = async (alertId) => {
    await fetch(`${API}/api/scouting/alerts/${alertId}/acknowledge`, { method: 'PATCH', headers: authH() });
    fetchAlerts();
  };

  useEffect(() => {
    if (tab === 'Records') fetchRecords();
    else if (tab === 'Active Threats') fetchThreats();
    else if (tab === 'Alerts') fetchAlerts();
    else if (tab === 'Summary') fetchSummary();
  }, [tab, fetchRecords, fetchThreats, fetchAlerts, fetchSummary]);

  useEffect(() => {
    if (selected) fetchDetail(selected);
    else setSelectedDetail(null);
  }, [selected, fetchDetail]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pest & Disease Scouting</h1>
          <p className="text-sm text-gray-500 mt-0.5">Field observations, threat monitoring, and spray decision support</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/spray-applications?BusinessID=${bid}`}
            className="text-sm px-3 py-1.5 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors">
            Spray Log
          </Link>
          <button onClick={() => setShowAdd(true)}
            className="text-sm px-4 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors">
            + New Record
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-amber-600 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          {tab === 'Records' && (
            <RecordsTab records={records} loading={loading} selected={selected}
              onSelect={setSelected} onRefresh={fetchRecords} />
          )}
          {tab === 'Active Threats' && <ThreatsTab threats={threats} />}
          {tab === 'Alerts' && <AlertsTab alerts={alerts} onAck={ackAlert} />}
          {tab === 'Summary' && <SummaryTab summary={summary} />}
        </div>

        {/* Detail panel */}
        {selected && selectedDetail && (
          <DetailPanel detail={selectedDetail} onClose={() => setSelected(null)}
            onComplete={async () => {
              await fetch(`${API}/api/scouting/records/${selected}/complete`, { method: 'PATCH', headers: authH() });
              fetchDetail(selected);
              fetchRecords();
            }}
            bid={bid}
          />
        )}
      </div>

      {showAdd && (
        <AddRecordModal onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); fetchRecords(); }} />
      )}

      <SaigeWidget businessId={bid} pageContext="Pest & Disease Scouting" />
    </div>
  );
}

function RecordsTab({ records, loading, selected, onSelect, onRefresh }) {
  if (loading) return <div className="text-gray-400 text-sm">Loading…</div>;
  if (!records.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">🔍</div>
      <p className="font-medium text-gray-500">No scouting records yet</p>
      <p className="text-sm mt-1">Add your first field observation to get started.</p>
    </div>
  );
  return (
    <div className="space-y-2">
      {records.map(r => {
        const maxSev = Number(r.MaxSeverity ?? 0);
        return (
          <div key={r.RecordID}
            onClick={() => onSelect(r.RecordID === selected ? null : r.RecordID)}
            className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
              selected === r.RecordID ? 'border-amber-400 ring-1 ring-amber-300' : 'border-gray-200'
            }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">
                    {r.FieldName || 'Unknown Field'}
                  </span>
                  {r.CropName && <span className="text-xs text-gray-500">— {r.CropName}</span>}
                  {r.SprayRecommended ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">⚠ Spray Recommended</span>
                  ) : null}
                  {r.IsComplete ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Complete</span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {r.ScoutingDate} · {r.ScoutName || 'Unknown scout'} · {r.ObsCount ?? 0} observation{r.ObsCount !== 1 ? 's' : ''}
                </div>
              </div>
              <SevBadge severity={maxSev} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ThreatsTab({ threats }) {
  if (!threats.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">✅</div>
      <p className="font-medium text-gray-600">No active high-severity threats</p>
      <p className="text-sm mt-1">No severity ≥ Moderate observations in the last 30 days.</p>
    </div>
  );
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-4">Observations rated Moderate–Critical from the last 30 days.</p>
      {threats.map((t, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-gray-900 text-sm">{t.PestOrDisease}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {t.FieldName} {t.CropName ? `· ${t.CropName}` : ''} · {t.ScoutingDate}
              </div>
              <div className="text-xs text-gray-400 capitalize mt-0.5">{t.Category.replace('_', ' ')}</div>
              {t.PercentAffected != null && (
                <div className="text-xs text-orange-600 mt-1">{t.PercentAffected}% affected</div>
              )}
            </div>
            <SevBadge severity={t.Severity} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertsTab({ alerts, onAck }) {
  if (!alerts.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">🔔</div>
      <p className="font-medium text-gray-600">No unacknowledged alerts</p>
    </div>
  );
  return (
    <div className="space-y-3">
      {alerts.map(a => (
        <div key={a.AlertID} className="bg-white rounded-xl border border-red-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-red-800 text-sm">{a.PestOrDisease}</div>
              <div className="text-xs text-gray-500 mt-0.5">{a.FieldName} · <SevBadge severity={a.Severity} /></div>
              <div className="text-xs text-gray-400 mt-1">{new Date(a.AlertedAt).toLocaleString()}</div>
            </div>
            <button onClick={() => onAck(a.AlertID)}
              className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
              Acknowledge
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryTab({ summary }) {
  if (!summary) return <div className="text-gray-400 text-sm">Loading…</div>;
  const { year, totals, top_pests } = summary;
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Records', value: totals.total_records },
          { label: 'Spray Recommended', value: totals.spray_recommended },
          { label: 'Pending', value: totals.pending },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{kpi.value ?? 0}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Top Pests / Diseases — {year}</h3>
        {top_pests && top_pests.length > 0 ? (
          <div className="space-y-2">
            {top_pests.slice(0, 10).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-800">{p.PestOrDisease}</span>
                  <span className="text-xs text-gray-400 ml-2 capitalize">{p.Category.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <SevBadge severity={p.MaxSeverity} />
                  <span className="text-xs text-gray-500">{p.Occurrences}×</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No data yet for {year}.</p>
        )}
      </div>
    </div>
  );
}

function DetailPanel({ detail, onClose, onComplete, bid }) {
  return (
    <div className="w-96 shrink-0 bg-white border-l border-gray-200 overflow-auto p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Record Detail</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>

      <div className="text-sm space-y-1 text-gray-600 mb-4">
        <div><span className="font-medium">Field:</span> {detail.FieldName || '—'}</div>
        <div><span className="font-medium">Crop:</span> {detail.CropName || '—'}</div>
        <div><span className="font-medium">Date:</span> {detail.ScoutingDate}</div>
        <div><span className="font-medium">Scout:</span> {detail.ScoutName || '—'}</div>
        <div><span className="font-medium">Growth Stage:</span> {detail.GrowthStage || '—'}</div>
        <div><span className="font-medium">Weather:</span> {detail.WeatherConditions || '—'}</div>
        {detail.Notes && <div className="pt-2 border-t text-gray-500 italic">{detail.Notes}</div>}
      </div>

      <h4 className="font-semibold text-gray-800 text-sm mb-2">Observations</h4>
      <div className="space-y-2 mb-4">
        {detail.observations?.map(o => (
          <div key={o.ObsID} className="bg-gray-50 rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800">{o.PestOrDisease}</span>
              <SevBadge severity={o.Severity} />
            </div>
            <div className="text-gray-500 capitalize">{o.Category.replace('_', ' ')}</div>
            {o.PercentAffected != null && <div className="text-orange-600">{o.PercentAffected}% affected</div>}
            {o.ActionRecommended && <div className="text-blue-700 mt-1">{o.ActionRecommended}</div>}
            {o.RequiresSpray ? <div className="text-red-600 font-semibold mt-1">⚠ Spray Required</div> : null}
          </div>
        ))}
        {!detail.observations?.length && <p className="text-xs text-gray-400">No observations.</p>}
      </div>

      {!detail.IsComplete && (
        <div className="space-y-2">
          <button onClick={onComplete}
            className="w-full py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700">
            Mark Complete
          </button>
          {detail.SprayRecommended && (
            <Link to={`/spray-applications?BusinessID=${bid}`}
              className="block w-full py-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 text-sm text-center hover:bg-amber-100">
              → Log Spray Application
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function AddRecordModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    scouting_date: new Date().toISOString().slice(0, 10),
    field_id: '', field_name: '', crop_name: '', growth_stage: '',
    scout_name: '', weather_conditions: '', area_scouted: '', notes: '',
  });
  const [obs, setObs] = useState([]);
  const [saving, setSaving] = useState(false);

  const F = ({ label, name, type = 'text', as }) => {
    const input = as === 'textarea'
      ? <textarea rows={2} value={form[name] || ''}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400" />
      : <input type={type} value={form[name] || ''}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400" />;
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        {input}
      </div>
    );
  };

  const addObs = () => setObs(o => [...o, {
    category: 'pest', pest_or_disease: '', severity: 0,
    count_per_unit: '', count_unit: '', percent_affected: '',
    action_threshold: '', action_recommended: '', requires_spray: false,
  }]);

  const updateObs = (i, field, val) => setObs(o => o.map((x, j) => j === i ? { ...x, [field]: val } : x));
  const removeObs = (i) => setObs(o => o.filter((_, j) => j !== i));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        observations: obs.map(o => ({
          ...o,
          severity: Number(o.severity),
          count_per_unit: o.count_per_unit !== '' ? Number(o.count_per_unit) : null,
          percent_affected: o.percent_affected !== '' ? Number(o.percent_affected) : null,
        })),
      };
      const r = await fetch(`${API}/api/scouting/records`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">New Scouting Record</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <F label="Scouting Date *" name="scouting_date" type="date" />
            <F label="Scout Name" name="scout_name" />
            <F label="Field ID" name="field_id" />
            <F label="Field Name" name="field_name" />
            <F label="Crop Name" name="crop_name" />
            <F label="Growth Stage" name="growth_stage" />
            <F label="Area Scouted" name="area_scouted" />
            <F label="Weather Conditions" name="weather_conditions" />
          </div>
          <F label="Notes" name="notes" as="textarea" />

          {/* Observations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Observations</label>
              <button onClick={addObs} className="text-xs px-3 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100">
                + Add Observation
              </button>
            </div>
            {obs.map((o, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Observation {i + 1}</span>
                  <button onClick={() => removeObs(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                    <select value={o.category} onChange={e => updateObs(i, 'category', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pest / Disease *</label>
                    <input value={o.pest_or_disease} onChange={e => updateObs(i, 'pest_or_disease', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Severity (0–5)</label>
                    <select value={o.severity} onChange={e => updateObs(i, 'severity', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs">
                      {Object.entries(SEV_LABELS).map(([v, l]) => <option key={v} value={v}>{v} — {l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">% Affected</label>
                    <input type="number" value={o.percent_affected} onChange={e => updateObs(i, 'percent_affected', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Action Recommended</label>
                  <input value={o.action_recommended} onChange={e => updateObs(i, 'action_recommended', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={o.requires_spray}
                    onChange={e => updateObs(i, 'requires_spray', e.target.checked)} />
                  Requires Spray Application
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.scouting_date}
            className="px-5 py-2 rounded-lg bg-amber-600 text-white text-sm hover:bg-amber-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
}
