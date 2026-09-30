import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
function tok() { return localStorage.getItem('access_token'); }
function auth() { return { Authorization: `Bearer ${tok()}` }; }
function get(path) { return fetch(`${API}${path}`, { headers: auth() }).then(r => r.ok ? r.json() : null); }

const STATUSES = ['Planned', 'Planted', 'Growing', 'Harvested', 'Failed'];
const STATUS_COLOR = {
  Planned:   'bg-blue-100 text-blue-700',
  Planted:   'bg-teal-100 text-teal-700',
  Growing:   'bg-green-100 text-green-700',
  Harvested: 'bg-purple-100 text-purple-700',
  Failed:    'bg-red-100 text-red-700',
};
const CROP_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#84cc16'];

function fmtDate(s) {
  if (!s) return '—';
  const d = new Date(s + 'T12:00:00');
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysSpan(start, end) {
  if (!start || !end) return 0;
  return Math.max(0, Math.ceil((new Date(end) - new Date(start)) / 86400000));
}

// ── Gantt chart ───────────────────────────────────────────────────────────────
function GanttChart({ plans }) {
  if (!plans.length) return null;

  const allDates = plans.flatMap(p => [p.plant_date, p.harvest_date].filter(Boolean));
  if (!allDates.length) return <p className="text-sm text-gray-400 p-4">Add plant and harvest dates to see the calendar.</p>;

  const minD = new Date(Math.min(...allDates.map(d => new Date(d))));
  const maxD = new Date(Math.max(...allDates.map(d => new Date(d))));
  // Pad by 14 days each side
  minD.setDate(minD.getDate() - 14);
  maxD.setDate(maxD.getDate() + 14);
  const totalDays = Math.ceil((maxD - minD) / 86400000);

  const pct = (d) => {
    if (!d) return 0;
    return ((new Date(d) - minD) / (maxD - minD)) * 100;
  };
  const width = (start, end) => {
    if (!start || !end) return 0;
    return Math.max(1, ((new Date(end) - new Date(start)) / (maxD - minD)) * 100);
  };

  // Month labels
  const months = [];
  const cur = new Date(minD);
  cur.setDate(1);
  while (cur <= maxD) {
    months.push({ label: cur.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' }), pct: ((cur - minD) / (maxD - minD)) * 100 });
    cur.setMonth(cur.getMonth() + 1);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
      <div className="min-w-[700px] p-4">
        {/* Month ruler */}
        <div className="relative h-5 mb-3 border-b border-gray-200">
          {months.map((m, i) => (
            <span key={i} className="absolute text-xs text-gray-400"
              style={{ left: `${m.pct}%` }}>
              {m.label}
            </span>
          ))}
        </div>
        {/* Rows */}
        <div className="space-y-2">
          {plans.map(p => (
            <div key={p.plan_id} className="flex items-center gap-3">
              <div className="w-32 shrink-0 text-xs text-gray-700 truncate" title={`${p.crop_name}${p.field_name ? ' · ' + p.field_name : ''}`}>
                {p.crop_name}
                {p.field_name && <span className="text-gray-400"> · {p.field_name}</span>}
              </div>
              <div className="relative flex-1 h-7 bg-gray-50 rounded">
                {(p.plant_date && p.harvest_date) && (
                  <div
                    className="absolute top-0 h-full rounded flex items-center px-2 text-white text-xs font-medium overflow-hidden whitespace-nowrap"
                    style={{
                      left:  `${pct(p.plant_date)}%`,
                      width: `${width(p.plant_date, p.harvest_date)}%`,
                      backgroundColor: p.color || '#3b82f6',
                      minWidth: '4px',
                    }}
                    title={`${p.crop_name}: ${fmtDate(p.plant_date)} → ${fmtDate(p.harvest_date)}`}
                  >
                    {width(p.plant_date, p.harvest_date) > 8 ? p.crop_variety || p.status : ''}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Plan modal ────────────────────────────────────────────────────────────────
function PlanModal({ bid, season, plan, onClose, onSaved }) {
  const [form, setForm] = useState({
    crop_name:    plan?.crop_name    || '',
    crop_variety: plan?.crop_variety || '',
    field_name:   plan?.field_name   || '',
    season:       plan?.season       || season,
    plant_date:   plan?.plant_date   || '',
    harvest_date: plan?.harvest_date || '',
    area_ha:      plan?.area_ha      || '',
    status:       plan?.status       || 'Planned',
    color:        plan?.color        || CROP_COLORS[0],
    notes:        plan?.notes        || '',
  });
  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.crop_name.trim()) return;
    setSaving(true);
    const qs = new URLSearchParams({
      business_id: bid,
      ...Object.fromEntries(Object.entries(form).filter(([, v]) => v !== '')),
    });
    if (plan) {
      await fetch(`${API}/api/crop-planning/plans/${plan.plan_id}?${qs}`, { method: 'PUT', headers: auth() });
    } else {
      await fetch(`${API}/api/crop-planning/plans?${qs}`, { method: 'POST', headers: auth() });
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{plan ? 'Edit Plan' : 'New Crop Plan'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[
            ['Crop *', 'crop_name', 'text', 'e.g. Wheat'],
            ['Variety', 'crop_variety', 'text', 'e.g. Hartog'],
            ['Field', 'field_name', 'text', 'e.g. North Paddock'],
            ['Season', 'season', 'text', 'e.g. 2025'],
            ['Plant Date', 'plant_date', 'date', ''],
            ['Harvest Date', 'harvest_date', 'date', ''],
            ['Area (ha)', 'area_ha', 'number', ''],
          ].map(([label, key, type, ph]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={e => upd(key, e.target.value)}
                placeholder={ph} step={type === 'number' ? '0.1' : undefined}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => upd('status', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bar Colour</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {CROP_COLORS.map(c => (
                <button key={c} onClick={() => upd('color', c)}
                  className={`w-6 h-6 rounded-full border-2 ${form.color === c ? 'border-gray-900' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => upd('notes', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          <button onClick={save} disabled={saving || !form.crop_name.trim()}
            className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CropPlanner() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');

  const [tab, setTab]       = useState('calendar');
  const [season, setSeason] = useState(String(new Date().getFullYear()));
  const [seasons, setSeasons] = useState([]);
  const [plans, setPlans]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal]   = useState(null); // null | 'new' | plan object

  const load = () => {
    if (!bid) return;
    setLoading(true);
    Promise.all([
      get(`/api/crop-planning/plans?business_id=${bid}&season=${season}`),
      get(`/api/crop-planning/seasons?business_id=${bid}`),
    ]).then(([p, s]) => {
      setPlans(Array.isArray(p) ? p : []);
      if (Array.isArray(s) && s.length) setSeasons(s);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [bid, season]);

  const deletePlan = async (id) => {
    if (!window.confirm('Delete this crop plan?')) return;
    await fetch(`${API}/api/crop-planning/plans/${id}`, { method: 'DELETE', headers: auth() });
    load();
  };

  const availableSeasons = seasons.length
    ? seasons
    : Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Crop Planning Calendar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Plan what goes where, when — track planting to harvest</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={season} onChange={e => setSeason(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
            {availableSeasons.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={() => setModal('new')}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700">
            + Add Plan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white px-6">
        <div className="flex gap-6">
          {[['calendar', 'Gantt Calendar'], ['list', 'List View'], ['rotation', 'Field Rotation']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-6xl">
        {loading && <p className="text-gray-400 text-sm">Loading…</p>}

        {!loading && tab === 'calendar' && (
          <div className="space-y-4">
            {plans.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-2">🌱</div>
                <p>No crop plans for {season}.</p>
                <button onClick={() => setModal('new')} className="mt-2 text-blue-600 text-sm hover:underline">
                  Add your first plan →
                </button>
              </div>
            ) : <GanttChart plans={plans} />}
          </div>
        )}

        {!loading && tab === 'list' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {plans.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>No plans for {season}.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Crop', 'Variety', 'Field', 'Plant Date', 'Harvest Date', 'Duration', 'Area (ha)', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {plans.map(p => (
                    <tr key={p.plan_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color || '#3b82f6' }} />
                          <span className="font-medium text-gray-900">{p.crop_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.crop_variety || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{p.field_name || '—'}</td>
                      <td className="px-4 py-3">{fmtDate(p.plant_date)}</td>
                      <td className="px-4 py-3">{fmtDate(p.harvest_date)}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {daysSpan(p.plant_date, p.harvest_date) > 0 ? `${daysSpan(p.plant_date, p.harvest_date)}d` : '—'}
                      </td>
                      <td className="px-4 py-3">{p.area_ha != null ? `${p.area_ha} ha` : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[p.status] || 'bg-gray-100 text-gray-600'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setModal(p)} className="text-xs text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => deletePlan(p.plan_id)} className="text-xs text-red-500 hover:underline">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && tab === 'rotation' && (
          <div className="space-y-3">
            {/* Group by field */}
            {Object.entries(
              plans.reduce((acc, p) => {
                const key = p.field_name || 'No Field Assigned';
                if (!acc[key]) acc[key] = [];
                acc[key].push(p);
                return acc;
              }, {})
            ).map(([field, fplans]) => (
              <div key={field} className="bg-white rounded-2xl border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">{field}</h4>
                <div className="flex flex-wrap gap-2">
                  {fplans.map(p => (
                    <span key={p.plan_id}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: p.color || '#3b82f6' }}>
                      {p.crop_name}{p.crop_variety ? ` (${p.crop_variety})` : ''}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {fplans.length} crop{fplans.length !== 1 ? 's' : ''} planned ·{' '}
                  {fplans.reduce((s, p) => s + (p.area_ha || 0), 0).toFixed(1)} ha total
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <div className="text-center py-16 text-gray-400">No plans for {season}.</div>
            )}
          </div>
        )}

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {[
            ['/yield-records', 'Yield Records'],
            ['/nutrients', 'Nutrient Plans'],
            ['/crop-budget', 'Crop Budget'],
            ['/weather', 'Weather'],
          ].map(([to, label]) => (
            <Link key={to} to={`${to}?BusinessID=${bid}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50">
              {label} →
            </Link>
          ))}
        </div>
      </div>

      {modal && (
        <PlanModal
          bid={bid} season={season}
          plan={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}

      <SaigeWidget businessId={bid} pageContext="Crop Planning Calendar" />
    </div>
  );
}
