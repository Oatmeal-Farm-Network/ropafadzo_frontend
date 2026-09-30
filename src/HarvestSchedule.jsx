import { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import SaigeWidget from './SaigeWidget';
import { useSearchParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL ?? '';

const STATUSES = ['Planned','In Progress','Completed','Cancelled'];
const STATUS_COLOR = {
  'Planned':    'bg-blue-100 text-blue-800',
  'In Progress':'bg-yellow-100 text-yellow-800',
  'Completed':  'bg-green-100 text-green-800',
  'Cancelled':  'bg-gray-100 text-gray-500',
};

const COLORS = ['#3D6B34','#E8923A','#5B8DB8','#9B5BAA','#D4744A','#4A8B7F','#B85B5B'];

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0,10);
}
function dayLabel(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}
function todayStr() { return new Date().toISOString().slice(0,10); }
function mondayOf(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0,10);
}

// ── Schedule Modal ─────────────────────────────────────────────────────────────
function ScheduleModal({ initial = {}, onClose, onSave }) {
  const [form, setForm] = useState({
    field_name: initial.field_name || '',
    crop_name: initial.crop_name || '',
    variety: initial.variety || '',
    planned_date: initial.planned_date ? initial.planned_date.slice(0,10) : todayStr(),
    estimated_tonnes: initial.estimated_tonnes ?? '',
    actual_tonnes: initial.actual_tonnes ?? '',
    crew_size: initial.crew_size ?? '',
    assigned_crew: initial.assigned_crew || '',
    status: initial.status || 'Planned',
    color: initial.color || '#3D6B34',
    notes: initial.notes || '',
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const isEdit = !!initial.schedule_id;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Harvest Schedule' : 'New Harvest Schedule'}</h2>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.crop_name} onChange={set('crop_name')} placeholder="e.g. Avocado" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.variety} onChange={set('variety')} placeholder="e.g. Hass" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field / Block</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.field_name} onChange={set('field_name')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Date *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.planned_date} onChange={set('planned_date')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Est. Tonnes</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.estimated_tonnes} onChange={set('estimated_tonnes')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actual Tonnes</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.actual_tonnes} onChange={set('actual_tonnes')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crew Size</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.crew_size} onChange={set('crew_size')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Crew</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.assigned_crew} onChange={set('assigned_crew')} placeholder="Names or crew IDs" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Tag</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} onClick={() => setForm(f => ({ ...f, color: c }))} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" value={form.notes} onChange={set('notes')} />
          </div>
        </div>
        <div className="p-6 border-t flex justify-end gap-3 flex-shrink-0">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5227]" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Block Modal ───────────────────────────────────────────────────────────────
function BlockModal({ scheduleId, onClose, onSave }) {
  const [form, setForm] = useState({ block_name:'', area_ha:'', pickers_needed:'', start_time:'', end_time:'', actual_yield_kg:'', notes:'' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b"><h2 className="text-lg font-semibold">Add Block</h2></div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Block Name *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.block_name} onChange={set('block_name')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (ha)</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.area_ha} onChange={set('area_ha')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickers Needed</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.pickers_needed} onChange={set('pickers_needed')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.start_time} onChange={set('start_time')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="time" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.end_time} onChange={set('end_time')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Yield (kg)</label>
            <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.actual_yield_kg} onChange={set('actual_yield_kg')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" value={form.notes} onChange={set('notes')} />
          </div>
        </div>
        <div className="p-6 border-t flex justify-end gap-3">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5227]"
            onClick={() => onSave({ ...form, schedule_id: scheduleId })}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Week Calendar ─────────────────────────────────────────────────────────────
function WeekCalendar({ schedules, weekStart, onEdit }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const byDay = {};
  days.forEach(d => { byDay[d] = []; });
  schedules.forEach(s => {
    const d = s.planned_date?.slice(0,10);
    if (byDay[d]) byDay[d].push(s);
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map(d => (
        <div key={d} className="min-h-[120px]">
          <div className={`text-xs font-medium mb-2 text-center ${d === todayStr() ? 'text-[#3D6B34] font-bold' : 'text-gray-500'}`}>
            {dayLabel(d)}
          </div>
          <div className="space-y-1">
            {byDay[d].map(s => (
              <button key={s.schedule_id} onClick={() => onEdit(s)}
                className="w-full text-left rounded-lg px-2 py-1.5 text-xs text-white font-medium leading-tight hover:opacity-90 transition-opacity"
                style={{ backgroundColor: s.color || '#3D6B34' }}>
                <div className="truncate">{s.crop_name}</div>
                {s.field_name && <div className="truncate opacity-80">{s.field_name}</div>}
                {s.estimated_tonnes && <div className="opacity-80">{s.estimated_tonnes}t est</div>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Schedule List Row ─────────────────────────────────────────────────────────
function ScheduleRow({ s, bid, onEdit, onDelete, onReload }) {
  const [expanded, setExpanded] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [blockModal, setBlockModal] = useState(false);

  const loadBlocks = async () => {
    const data = await fetch(`${API}/api/harvest-schedule/schedules/${s.schedule_id}/blocks?business_id=${bid}`).then(r => r.json());
    setBlocks(data);
    setExpanded(true);
  };

  const addBlock = async form => {
    await fetch(`${API}/api/harvest-schedule/blocks?business_id=${bid}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    setBlockModal(false); loadBlocks();
  };

  const delBlock = async id => {
    await fetch(`${API}/api/harvest-schedule/blocks/${id}?business_id=${bid}`, { method: 'DELETE' });
    loadBlocks();
  };

  return (
    <>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color || '#3D6B34' }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{s.crop_name}{s.variety ? ` — ${s.variety}` : ''}</span>
              {s.field_name && <span className="text-xs text-gray-500">{s.field_name}</span>}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[s.status] || 'bg-gray-100 text-gray-600'}`}>{s.status}</span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mt-1">
              <span>{s.planned_date?.slice(0,10)}</span>
              {s.estimated_tonnes && <span>{s.estimated_tonnes}t estimated</span>}
              {s.actual_tonnes && <span>{s.actual_tonnes}t actual</span>}
              {s.crew_size && <span>{s.crew_size} crew</span>}
              {s.assigned_crew && <span>Crew: {s.assigned_crew}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="text-xs text-gray-400 hover:text-gray-600"
              onClick={() => expanded ? setExpanded(false) : loadBlocks()}>
              {expanded ? 'Hide blocks ▲' : 'Blocks ▼'}
            </button>
            <button className="text-blue-500 hover:underline text-xs" onClick={() => onEdit(s)}>Edit</button>
            <button className="text-red-400 hover:text-red-600 text-xs" onClick={() => onDelete(s.schedule_id)}>Delete</button>
          </div>
        </div>
        {expanded && (
          <div className="border-t bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Harvest Blocks</span>
              <button className="text-xs text-[#3D6B34] hover:underline" onClick={() => setBlockModal(true)}>+ Add Block</button>
            </div>
            {blocks.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">No blocks defined</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500">
                    {['Block','Area (ha)','Pickers','Start','End','Yield (kg)',''].map(h => (
                      <th key={h} className="text-left pb-2 pr-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {blocks.map(b => (
                    <tr key={b.block_id}>
                      <td className="py-2 pr-3 font-medium">{b.block_name}</td>
                      <td className="py-2 pr-3">{b.area_ha ?? '—'}</td>
                      <td className="py-2 pr-3">{b.pickers_needed ?? '—'}</td>
                      <td className="py-2 pr-3">{b.start_time || '—'}</td>
                      <td className="py-2 pr-3">{b.end_time || '—'}</td>
                      <td className="py-2 pr-3">{b.actual_yield_kg ?? '—'}</td>
                      <td className="py-2">
                        <button className="text-red-400 hover:text-red-600" onClick={() => delBlock(b.block_id)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      {blockModal && <BlockModal scheduleId={s.schedule_id} onClose={() => setBlockModal(false)} onSave={addBlock} />}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HarvestSchedule() {
  const [searchParams] = useSearchParams();
  const bid = searchParams.get('BusinessID') || '';
  const [view, setView] = useState('calendar');
  const [weekStart, setWeekStart] = useState(mondayOf(todayStr()));
  const [schedules, setSchedules] = useState([]);
  const [summary, setSummary] = useState({});
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    if (!bid) return;
    fetch(`${API}/api/harvest-schedule/schedules?business_id=${bid}&week_start=${weekStart}`)
      .then(r => r.json()).then(setSchedules);
  }, [bid, weekStart]);

  const loadSummary = useCallback(() => {
    if (!bid) return;
    fetch(`${API}/api/harvest-schedule/summary?business_id=${bid}`).then(r => r.json()).then(setSummary);
  }, [bid]);

  useEffect(() => { load(); loadSummary(); }, [load, loadSummary]);

  const prevWeek = () => setWeekStart(w => addDays(w, -7));
  const nextWeek = () => setWeekStart(w => addDays(w, 7));
  const thisWeek = () => setWeekStart(mondayOf(todayStr()));

  const saveSchedule = async form => {
    if (modal?.schedule_id) {
      await fetch(`${API}/api/harvest-schedule/schedules/${modal.schedule_id}?business_id=${bid}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
    } else {
      await fetch(`${API}/api/harvest-schedule/schedules?business_id=${bid}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
    }
    setModal(null); load(); loadSummary();
  };

  const deleteSchedule = async id => {
    if (!confirm('Delete this harvest schedule?')) return;
    await fetch(`${API}/api/harvest-schedule/schedules/${id}?business_id=${bid}`, { method: 'DELETE' });
    load(); loadSummary();
  };

  const weekLabel = () => {
    const end = addDays(weekStart, 6);
    return `${dayLabel(weekStart)} — ${dayLabel(end)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Harvest Scheduling & Labor Planner</h1>
            <p className="text-sm text-gray-500 mt-1">Plan and track harvest operations, crew assignments, and block yields</p>
          </div>
          <button onClick={() => setModal({})} className="px-4 py-2 bg-[#3D6B34] text-white text-sm rounded-lg hover:bg-[#2d5227]">
            + New Schedule
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'This Week', value: summary.this_week ?? 0, color: 'text-blue-600' },
            { label: 'Est. Tonnes (week)', value: summary.estimated_tonnes_week != null ? `${Number(summary.estimated_tonnes_week).toFixed(1)}t` : '—', color: 'text-green-600' },
            { label: 'Actual Tonnes (month)', value: summary.actual_tonnes_month != null ? `${Number(summary.actual_tonnes_month).toFixed(1)}t` : '—', color: 'text-[#3D6B34]' },
            { label: 'In Progress', value: summary.in_progress ?? 0, color: 'text-yellow-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* View toggle + week nav */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex gap-1 bg-gray-200 rounded-lg p-1">
            {['calendar','list'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${view === v ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}>
                {v === 'calendar' ? '📅 Calendar' : '☰ List'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prevWeek} className="p-2 rounded-lg border bg-white hover:bg-gray-50">←</button>
            <span className="text-sm font-medium text-gray-700 min-w-[240px] text-center">{weekLabel()}</span>
            <button onClick={nextWeek} className="p-2 rounded-lg border bg-white hover:bg-gray-50">→</button>
            <button onClick={thisWeek} className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Today</button>
          </div>
        </div>

        {!bid ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">No business account linked.</div>
        ) : view === 'calendar' ? (
          <div className="bg-white rounded-xl border p-4">
            <WeekCalendar schedules={schedules} weekStart={weekStart} onEdit={s => setModal(s)} />
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.length === 0 && (
              <div className="bg-white rounded-xl border p-8 text-center text-gray-400 text-sm">No schedules for this week</div>
            )}
            {schedules.map(s => (
              <ScheduleRow key={s.schedule_id} s={s} bid={bid}
                onEdit={s => setModal(s)}
                onDelete={deleteSchedule}
                onReload={load} />
            ))}
          </div>
        )}
      </main>
      <SaigeWidget pageContext="Harvest Scheduling & Labor Planner" />
      <Footer />
    </div>
  );
}
