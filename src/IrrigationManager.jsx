import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = ['Dashboard', 'Zones', 'Log Event', 'Water Budget'];
const IRR_TYPES = ['drip', 'sprinkler', 'pivot', 'flood', 'furrow', 'subsurface', 'micro_spray'];
const WATER_SOURCES = ['bore', 'dam', 'river', 'canal', 'municipal', 'recycled', 'rainwater'];

function tok() { return localStorage.getItem('access_token'); }
function authH() { return { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' }; }

function fmt(n, dec = 1) {
  if (n == null) return '—';
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export default function IrrigationManager() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const initialTab = params.get('tab') || 'Dashboard';
  const [tab, setTab] = useState(TABS.find(t => t.toLowerCase().replace(' ', '-') === initialTab?.toLowerCase().replace(' ', '-')) || 'Dashboard');

  const [zones, setZones] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [waterBudget, setWaterBudget] = useState(null);
  const [budgetFrom, setBudgetFrom] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [budgetTo, setBudgetTo] = useState(new Date().toISOString().slice(0, 10));
  const [showAddZone, setShowAddZone] = useState(false);
  const [showLogEvent, setShowLogEvent] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');

  const fetchZones = useCallback(async () => {
    const r = await fetch(`${API}/api/irrigation/zones`, { headers: authH() });
    if (r.ok) setZones(await r.json());
  }, []);

  const fetchDashboard = useCallback(async () => {
    const r = await fetch(`${API}/api/irrigation/dashboard`, { headers: authH() });
    if (r.ok) setDashboard(await r.json());
  }, []);

  const fetchWaterBudget = useCallback(async () => {
    const r = await fetch(
      `${API}/api/irrigation/water-budget?from_date=${budgetFrom}&to_date=${budgetTo}`,
      { headers: authH() }
    );
    if (r.ok) setWaterBudget(await r.json());
  }, [budgetFrom, budgetTo]);

  useEffect(() => { fetchZones(); }, [fetchZones]);
  useEffect(() => {
    if (tab === 'Dashboard') fetchDashboard();
    else if (tab === 'Water Budget') fetchWaterBudget();
  }, [tab, fetchDashboard, fetchWaterBudget]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Irrigation & Water Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Zones, events, soil moisture, and water budget</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddZone(true)}
            className="text-sm px-3 py-1.5 rounded-lg border border-sky-300 text-sky-700 hover:bg-sky-50">
            + Zone
          </button>
          <button onClick={() => { setTab('Log Event'); setShowLogEvent(true); }}
            className="text-sm px-4 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700">
            Log Event
          </button>
        </div>
      </div>

      <div className="bg-white border-b px-6 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-sky-600 text-sky-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'Dashboard' && <DashboardTab data={dashboard} />}
        {tab === 'Zones' && <ZonesTab zones={zones} onRefresh={fetchZones} />}
        {tab === 'Log Event' && (
          <LogEventTab zones={zones} onSaved={() => { fetchDashboard(); setTab('Dashboard'); }} />
        )}
        {tab === 'Water Budget' && (
          <WaterBudgetTab data={waterBudget} from={budgetFrom} to={budgetTo}
            onFromChange={setBudgetFrom} onToChange={setBudgetTo} onFetch={fetchWaterBudget} />
        )}
      </div>

      {showAddZone && (
        <AddZoneModal onClose={() => setShowAddZone(false)}
          onSaved={() => { setShowAddZone(false); fetchZones(); }} />
      )}

      <SaigeWidget businessId={bid} pageContext="Irrigation & Water Management" />
    </div>
  );
}

function DashboardTab({ data }) {
  if (!data) return <div className="text-gray-400 text-sm">Loading…</div>;
  const { totals, daily } = data;
  const maxKl = daily?.length ? Math.max(...daily.map(d => Number(d.VolumeKl || 0))) : 1;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Zones', value: totals?.TotalZones ?? 0, unit: '' },
          { label: 'Water Used (30d)', value: fmt(totals?.TotalKl30d), unit: 'kL' },
          { label: 'Water Cost (30d)', value: `$${fmt(totals?.TotalCost30d, 2)}`, unit: '' },
          { label: 'Zones w/ Moisture', value: totals?.ZonesWithMoisture ?? 0, unit: '' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-sky-700">{kpi.value}{kpi.unit}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {daily?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Daily Water Use — Last 30 Days (kL)</h3>
          <div className="flex items-end gap-1 h-32">
            {daily.map((d, i) => {
              const h = maxKl > 0 ? (Number(d.VolumeKl || 0) / maxKl) * 100 : 0;
              return (
                <div key={i} title={`${d.Day}: ${fmt(d.VolumeKl, 2)} kL`}
                  className="flex-1 bg-sky-400 rounded-t hover:bg-sky-500 transition-colors"
                  style={{ height: `${Math.max(h, 2)}%` }} />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{daily[0]?.Day}</span>
            <span>{daily[daily.length - 1]?.Day}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ZonesTab({ zones, onRefresh }) {
  if (!zones.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">💧</div>
      <p className="font-medium text-gray-500">No irrigation zones yet</p>
      <p className="text-sm mt-1">Add a zone to start tracking water usage.</p>
    </div>
  );
  return (
    <div className="space-y-3 max-w-3xl">
      {zones.map(z => (
        <div key={z.ZoneID} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-gray-900">{z.ZoneName}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {z.FieldName && `${z.FieldName} · `}
                {z.CropName && `${z.CropName} · `}
                {z.IrrigationType && z.IrrigationType.replace('_', ' ')}
              </div>
              {z.LatestMoisture != null && (
                <div className="text-xs text-blue-600 mt-1">
                  Moisture: {fmt(z.LatestMoisture)}%
                </div>
              )}
            </div>
            <div className="text-right text-xs text-gray-500">
              {z.VolumeKl30d != null && <div className="font-semibold text-sky-700">{fmt(z.VolumeKl30d)} kL (30d)</div>}
              {z.AreaHa != null && <div>{fmt(z.AreaHa)} ha</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LogEventTab({ zones, onSaved }) {
  const [form, setForm] = useState({
    zone_id: zones[0]?.ZoneID || '',
    start_time: new Date().toISOString().slice(0, 16),
    duration_minutes: '',
    volume_applied_l: '',
    depth_mm: '',
    cost_per_kl: '',
    trigger_type: 'manual',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const F = ({ label, name, type = 'text' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name] || ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400" />
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const zoneId = form.zone_id;
      const payload = {
        start_time: form.start_time,
        duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
        volume_applied_l: form.volume_applied_l ? Number(form.volume_applied_l) : null,
        depth_mm: form.depth_mm ? Number(form.depth_mm) : null,
        cost_per_kl: form.cost_per_kl ? Number(form.cost_per_kl) : null,
        trigger_type: form.trigger_type,
        notes: form.notes || null,
      };
      const r = await fetch(`${API}/api/irrigation/zones/${zoneId}/events`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) { setSaved(true); setTimeout(onSaved, 1200); }
    } finally { setSaving(false); }
  };

  if (saved) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">✅</div>
      <p className="font-medium text-gray-700">Event logged successfully!</p>
    </div>
  );

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Zone *</label>
        <select value={form.zone_id} onChange={e => setForm(f => ({ ...f, zone_id: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {zones.map(z => <option key={z.ZoneID} value={z.ZoneID}>{z.ZoneName}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Trigger Type</label>
        <select value={form.trigger_type} onChange={e => setForm(f => ({ ...f, trigger_type: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {['manual', 'scheduled', 'sensor', 'auto'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <F label="Start Time *" name="start_time" type="datetime-local" />
      <div className="grid grid-cols-2 gap-3">
        <F label="Duration (minutes)" name="duration_minutes" type="number" />
        <F label="Volume Applied (L)" name="volume_applied_l" type="number" />
        <F label="Depth (mm)" name="depth_mm" type="number" />
        <F label="Cost per kL ($)" name="cost_per_kl" type="number" />
      </div>
      <F label="Notes" name="notes" />
      <div className="flex justify-end">
        <button onClick={save} disabled={saving || !form.zone_id || !form.start_time}
          className="px-5 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Log Irrigation Event'}
        </button>
      </div>
    </div>
  );
}

function WaterBudgetTab({ data, from, to, onFromChange, onToChange, onFetch }) {
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
          <input type="date" value={from} onChange={e => onFromChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
          <input type="date" value={to} onChange={e => onToChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={onFetch}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700">
          Load
        </button>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-sky-700">{fmt(data.total_kl, 2)} kL</div>
              <div className="text-xs text-gray-500 mt-1">Total Water Used</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-sky-700">${fmt(data.total_cost, 2)}</div>
              <div className="text-xs text-gray-500 mt-1">Total Water Cost</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">Zone</th>
                  <th className="text-left px-4 py-3">Crop</th>
                  <th className="text-right px-4 py-3">Volume (kL)</th>
                  <th className="text-right px-4 py-3">Avg Depth (mm)</th>
                  <th className="text-right px-4 py-3">Cost</th>
                  <th className="text-right px-4 py-3">Events</th>
                </tr>
              </thead>
              <tbody>
                {data.zones?.map((z, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{z.ZoneName}</td>
                    <td className="px-4 py-3 text-gray-500">{z.CropName || '—'}</td>
                    <td className="px-4 py-3 text-right">{fmt(z.TotalKl, 2)}</td>
                    <td className="px-4 py-3 text-right">{z.AvgDepthMm != null ? fmt(z.AvgDepthMm) : '—'}</td>
                    <td className="px-4 py-3 text-right">{z.TotalCost ? `$${fmt(z.TotalCost, 2)}` : '—'}</td>
                    <td className="px-4 py-3 text-right">{z.Events ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function AddZoneModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    zone_name: '', field_id: '', field_name: '', area_ha: '',
    irrigation_type: '', water_source: '', flow_rate_lps: '',
    crop_name: '', soil_type: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const F = ({ label, name, type = 'text' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name] || ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400" />
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        area_ha: form.area_ha ? Number(form.area_ha) : null,
        flow_rate_lps: form.flow_rate_lps ? Number(form.flow_rate_lps) : null,
        irrigation_type: form.irrigation_type || null,
        water_source: form.water_source || null,
      };
      const r = await fetch(`${API}/api/irrigation/zones`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add Irrigation Zone</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <F label="Zone Name *" name="zone_name" />
          <div className="grid grid-cols-2 gap-4">
            <F label="Field ID" name="field_id" />
            <F label="Field Name" name="field_name" />
            <F label="Crop Name" name="crop_name" />
            <F label="Soil Type" name="soil_type" />
            <F label="Area (ha)" name="area_ha" type="number" />
            <F label="Flow Rate (L/s)" name="flow_rate_lps" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Irrigation Type</label>
              <select value={form.irrigation_type} onChange={e => setForm(f => ({ ...f, irrigation_type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Select…</option>
                {IRR_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Water Source</label>
              <select value={form.water_source} onChange={e => setForm(f => ({ ...f, water_source: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Select…</option>
                {WATER_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <F label="Notes" name="notes" />
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.zone_name}
            className="px-5 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Create Zone'}
          </button>
        </div>
      </div>
    </div>
  );
}
