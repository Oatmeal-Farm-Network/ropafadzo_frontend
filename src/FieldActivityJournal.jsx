import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';
import { queuedFetch } from './offlineQueue';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = ['Log', 'Timeline', 'By Field', 'Summary'];
const ACTIVITY_TYPES = [
  'planting', 'cultivation', 'fertilising', 'spraying', 'harvesting',
  'irrigation', 'scouting', 'mowing', 'pruning', 'thinning',
  'spreading', 'sampling', 'fumigation', 'pest_control', 'maintenance', 'other',
];
const TYPE_COLORS = {
  planting: 'bg-green-100 text-green-800',
  cultivation: 'bg-amber-100 text-amber-800',
  fertilising: 'bg-lime-100 text-lime-800',
  spraying: 'bg-red-100 text-red-700',
  harvesting: 'bg-yellow-100 text-yellow-800',
  irrigation: 'bg-sky-100 text-sky-800',
  scouting: 'bg-orange-100 text-orange-800',
  mowing: 'bg-teal-100 text-teal-800',
  maintenance: 'bg-purple-100 text-purple-800',
};

function tok() { return localStorage.getItem('access_token'); }
function authH() { return { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' }; }

function TypeBadge({ type }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
      TYPE_COLORS[type] || 'bg-gray-100 text-gray-600'
    }`}>{type.replace('_', ' ')}</span>
  );
}

export default function FieldActivityJournal() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const initialTab = params.get('tab') || 'Log';
  const [tab, setTab] = useState(TABS.find(t => t.toLowerCase() === initialTab.toLowerCase()) || 'Log');

  const [activities, setActivities] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [byField, setByField] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [timelineDays, setTimelineDays] = useState(90);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const qs = filterType ? `?activity_type=${filterType}&limit=200` : '?limit=200';
      const r = await fetch(`${API}/api/field-activity/activities${qs}`, { headers: authH() });
      if (r.ok) setActivities(await r.json());
    } finally { setLoading(false); }
  }, [filterType]);

  const fetchTimeline = useCallback(async () => {
    const r = await fetch(`${API}/api/field-activity/timeline?days=${timelineDays}`, { headers: authH() });
    if (r.ok) setTimeline((await r.json()).dates || []);
  }, [timelineDays]);

  const fetchByField = useCallback(async () => {
    const r = await fetch(`${API}/api/field-activity/by-field`, { headers: authH() });
    if (r.ok) setByField(await r.json());
  }, []);

  const fetchSummary = useCallback(async () => {
    const r = await fetch(`${API}/api/field-activity/summary`, { headers: authH() });
    if (r.ok) setSummary(await r.json());
  }, []);

  useEffect(() => {
    if (tab === 'Log') fetchActivities();
    else if (tab === 'Timeline') fetchTimeline();
    else if (tab === 'By Field') fetchByField();
    else if (tab === 'Summary') fetchSummary();
  }, [tab, fetchActivities, fetchTimeline, fetchByField, fetchSummary]);

  const deleteActivity = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    await fetch(`${API}/api/field-activity/activities/${id}`, { method: 'DELETE', headers: authH() });
    fetchActivities();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Field Activity Journal</h1>
          <p className="text-sm text-gray-500 mt-0.5">Unified log of all field operations — planting, cultivation, harvesting, and more</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="text-sm px-4 py-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800">
          + Log Activity
        </button>
      </div>

      <div className="bg-white border-b px-6 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-teal-700 text-teal-800' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'Log' && (
          <LogTab activities={activities} loading={loading}
            filterType={filterType} onFilterChange={setFilterType}
            onDelete={deleteActivity} />
        )}
        {tab === 'Timeline' && (
          <TimelineTab groups={timeline} days={timelineDays} onDaysChange={setTimelineDays} onRefresh={fetchTimeline} />
        )}
        {tab === 'By Field' && <ByFieldTab data={byField} />}
        {tab === 'Summary' && <SummaryTab summary={summary} />}
      </div>

      {showAdd && (
        <AddActivityModal onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); if (tab === 'Log') fetchActivities(); else fetchTimeline(); }} />
      )}

      <SaigeWidget businessId={bid} pageContext="Field Activity Journal" />
    </div>
  );
}

function LogTab({ activities, loading, filterType, onFilterChange, onDelete }) {
  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-3">
        <select value={filterType} onChange={e => onFilterChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48">
          <option value="">All Types</option>
          {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <span className="text-sm text-gray-400">{activities.length} records</span>
      </div>

      {loading ? <div className="text-gray-400 text-sm">Loading…</div> : !activities.length ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium text-gray-500">No activities logged yet</p>
          <p className="text-sm mt-1">Start logging field operations to build your farm history.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Field</th>
                <th className="text-left px-4 py-3">Crop</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-right px-4 py-3">Area (ha)</th>
                <th className="text-right px-4 py-3">Cost</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {activities.map(a => (
                <tr key={a.ActivityID} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{a.ActivityDate}</td>
                  <td className="px-4 py-3"><TypeBadge type={a.ActivityType} /></td>
                  <td className="px-4 py-3 font-medium text-gray-900">{a.FieldName || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{a.CropName || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{a.Description || '—'}</td>
                  <td className="px-4 py-3 text-right">{a.AreaHa != null ? Number(a.AreaHa).toFixed(1) : '—'}</td>
                  <td className="px-4 py-3 text-right">{a.CostTotal != null ? `$${Number(a.CostTotal).toFixed(0)}` : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onDelete(a.ActivityID)}
                      className="text-xs text-red-400 hover:text-red-600">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TimelineTab({ groups, days, onDaysChange, onRefresh }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <select value={days} onChange={e => { onDaysChange(Number(e.target.value)); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {[30, 60, 90, 180, 365].map(d => <option key={d} value={d}>Last {d} days</option>)}
        </select>
        <button onClick={onRefresh} className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600">
          Refresh
        </button>
      </div>

      {!groups.length ? (
        <div className="text-center py-12 text-gray-400">No activities in this period.</div>
      ) : (
        <div className="space-y-4">
          {groups.map(g => (
            <div key={g.date}>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{g.date}</div>
              <div className="space-y-2 pl-3 border-l-2 border-gray-200">
                {g.activities.map(a => (
                  <div key={a.ActivityID} className="bg-white rounded-lg border border-gray-100 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <TypeBadge type={a.ActivityType} />
                          {a.FieldName && <span className="text-sm font-medium text-gray-800">{a.FieldName}</span>}
                          {a.CropName && <span className="text-xs text-gray-400">{a.CropName}</span>}
                        </div>
                        {a.Description && <p className="text-xs text-gray-600 mt-1">{a.Description}</p>}
                        {a.OperatorName && <p className="text-xs text-gray-400 mt-0.5">By {a.OperatorName}</p>}
                      </div>
                      <div className="text-xs text-gray-400 text-right shrink-0">
                        {a.AreaHa != null && <div>{Number(a.AreaHa).toFixed(1)} ha</div>}
                        {a.CostTotal != null && <div>${Number(a.CostTotal).toFixed(0)}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ByFieldTab({ data }) {
  if (!data.length) return (
    <div className="text-center py-16 text-gray-400">
      <p className="font-medium">No field data for current year.</p>
    </div>
  );
  return (
    <div className="max-w-3xl bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="text-left px-4 py-3">Field</th>
            <th className="text-left px-4 py-3">Latest Activity</th>
            <th className="text-right px-4 py-3">Total</th>
            <th className="text-right px-4 py-3">Plantings</th>
            <th className="text-right px-4 py-3">Sprays</th>
            <th className="text-right px-4 py-3">Harvests</th>
          </tr>
        </thead>
        <tbody>
          {data.map((f, i) => (
            <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{f.FieldName || f.FieldID || '—'}</td>
              <td className="px-4 py-3 text-gray-500">{f.LatestActivity || '—'}</td>
              <td className="px-4 py-3 text-right font-semibold">{f.TotalActivities}</td>
              <td className="px-4 py-3 text-right text-green-700">{f.Plantings || 0}</td>
              <td className="px-4 py-3 text-right text-red-600">{f.Sprays || 0}</td>
              <td className="px-4 py-3 text-right text-yellow-700">{f.Harvests || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SummaryTab({ summary }) {
  if (!summary) return <div className="text-gray-400 text-sm">Loading…</div>;
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{summary.total}</div>
          <div className="text-xs text-gray-500 mt-1">Total Activities ({summary.year})</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">
            ${Number(summary.total_cost || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total Recorded Costs</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">By Activity Type</h3>
        <div className="space-y-2">
          {summary.by_type?.map((t, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TypeBadge type={t.ActivityType} />
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <span>{t.Count} activities</span>
                {t.TotalAreaHa > 0 && <span>{Number(t.TotalAreaHa).toFixed(1)} ha</span>}
                {t.TotalCost > 0 && <span className="text-gray-900">${Number(t.TotalCost).toFixed(0)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddActivityModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    activity_date: new Date().toISOString().slice(0, 10),
    activity_type: 'cultivation',
    field_id: '', field_name: '', crop_name: '',
    description: '', operator_name: '', equipment_used: '',
    area_ha: '', units_applied: '', unit_type: '',
    rate_per_ha: '', product_name: '', cost_total: '',
    weather_conditions: '', start_time: '', end_time: '',
    duration_hours: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [queued, setQueued] = useState(false);

  const F = ({ label, name, type = 'text' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name] || ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const nums = ['area_ha', 'units_applied', 'rate_per_ha', 'cost_total', 'duration_hours'];
      const payload = { ...form };
      nums.forEach(k => { payload[k] = payload[k] !== '' ? Number(payload[k]) : null; });
      ['field_id', 'field_name', 'crop_name', 'description', 'operator_name', 'equipment_used',
       'unit_type', 'product_name', 'weather_conditions', 'start_time', 'end_time', 'notes',
      ].forEach(k => { if (!payload[k]) payload[k] = null; });

      const r = await queuedFetch(`${API}/api/field-activity/activities`, {
        method: 'POST',
        headers: authH(),
        body: JSON.stringify(payload),
        queueWhenOffline: true,
      });
      if (r.status === 201 || r.status === 202) {
        if (r.status === 202) setQueued(true);
        else onSaved();
      }
    } finally { setSaving(false); }
  };

  if (queued) return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm">
        <div className="text-4xl mb-3">📶</div>
        <p className="font-semibold text-gray-800">Activity queued for sync</p>
        <p className="text-sm text-gray-500 mt-1">It will be saved automatically when you're back online.</p>
        <button onClick={onSaved} className="mt-4 px-5 py-2 rounded-lg bg-teal-700 text-white text-sm hover:bg-teal-800">
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Log Field Activity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <F label="Date *" name="activity_date" type="date" />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Activity Type *</label>
              <select value={form.activity_type} onChange={e => setForm(f => ({ ...f, activity_type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <F label="Field ID" name="field_id" />
            <F label="Field Name" name="field_name" />
            <F label="Crop Name" name="crop_name" />
            <F label="Operator" name="operator_name" />
            <F label="Equipment Used" name="equipment_used" />
            <F label="Weather" name="weather_conditions" />
            <F label="Area (ha)" name="area_ha" type="number" />
            <F label="Cost Total ($)" name="cost_total" type="number" />
            <F label="Product Name" name="product_name" />
            <F label="Units Applied" name="units_applied" type="number" />
            <F label="Unit Type" name="unit_type" />
            <F label="Rate per ha" name="rate_per_ha" type="number" />
            <F label="Start Time" name="start_time" />
            <F label="End Time" name="end_time" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={2} value={form.description || ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea rows={2} value={form.notes || ''}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
          </div>
          {!navigator.onLine && (
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              You're offline — this activity will be queued and synced when connectivity returns.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.activity_date}
            className="px-5 py-2 rounded-lg bg-teal-700 text-white text-sm hover:bg-teal-800 disabled:opacity-50">
            {saving ? 'Saving…' : navigator.onLine ? 'Log Activity' : 'Queue Activity'}
          </button>
        </div>
      </div>
    </div>
  );
}
