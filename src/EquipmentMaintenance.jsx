import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = ['Fleet', 'Due Now', 'Service History', 'Fuel Log'];
const SERVICE_TYPES = ['oil_change', 'filter_change', 'grease_service', 'tyre_rotation', 'brake_service',
  'hydraulic_service', 'belt_replacement', 'major_overhaul', 'pre_season', 'repair', 'other'];
const FUEL_TYPES = ['diesel', 'petrol', 'lpg', 'electric', 'hybrid'];

function tok() { return localStorage.getItem('access_token'); }
function authH() { return { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' }; }

function fmt(n, dec = 0) {
  if (n == null) return '—';
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function StatusBadge({ status }) {
  const map = {
    overdue: 'bg-red-100 text-red-700',
    due_soon: 'bg-orange-100 text-orange-700',
    ok: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status?.replace('_', ' ') || '—'}
    </span>
  );
}

export default function EquipmentMaintenance() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const initialTab = params.get('tab') || 'Fleet';
  const [tab, setTab] = useState(TABS.find(t => t.toLowerCase().replace(' ', '-') === initialTab?.toLowerCase().replace(' ', '-')) || 'Fleet');

  const [fleet, setFleet] = useState([]);
  const [dueAlerts, setDueAlerts] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [fuelHistory, setFuelHistory] = useState([]);
  const [showAddEquip, setShowAddEquip] = useState(false);
  const [showLogService, setShowLogService] = useState(false);
  const [showLogFuel, setShowLogFuel] = useState(false);

  const fetchFleet = useCallback(async () => {
    const [fleetR, dashR, alertsR] = await Promise.all([
      fetch(`${API}/api/equipment-maintenance/fleet`, { headers: authH() }),
      fetch(`${API}/api/equipment-maintenance/dashboard`, { headers: authH() }),
      fetch(`${API}/api/equipment-maintenance/due-alerts`, { headers: authH() }),
    ]);
    if (fleetR.ok) setFleet(await fleetR.json());
    if (dashR.ok) setDashboard(await dashR.json());
    if (alertsR.ok) setDueAlerts(await alertsR.json());
  }, []);

  const fetchEquipHistory = useCallback(async (eid) => {
    const [svcR, fuelR] = await Promise.all([
      fetch(`${API}/api/equipment-maintenance/fleet/${eid}/service`, { headers: authH() }),
      fetch(`${API}/api/equipment-maintenance/fleet/${eid}/fuel`, { headers: authH() }),
    ]);
    if (svcR.ok) setServiceHistory(await svcR.json());
    if (fuelR.ok) setFuelHistory(await fuelR.json());
  }, []);

  useEffect(() => { fetchFleet(); }, [fetchFleet]);
  useEffect(() => {
    if (selectedEquip) fetchEquipHistory(selectedEquip);
  }, [selectedEquip, fetchEquipHistory]);

  const equip = fleet.find(e => e.EquipmentID === selectedEquip);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Equipment Maintenance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fleet tracking, service records, and fuel log</p>
        </div>
        {dashboard && (
          <div className="flex items-center gap-4 mr-4 text-sm">
            {dashboard.counts?.overdue > 0 && (
              <span className="text-red-600 font-semibold">{dashboard.counts.overdue} Overdue</span>
            )}
            {dashboard.counts?.due_soon > 0 && (
              <span className="text-orange-600 font-semibold">{dashboard.counts.due_soon} Due Soon</span>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={() => setShowAddEquip(true)}
            className="text-sm px-3 py-1.5 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50">
            + Equipment
          </button>
          <button onClick={() => setShowLogService(true)}
            className="text-sm px-4 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
            Log Service
          </button>
        </div>
      </div>

      <div className="bg-white border-b px-6 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          {tab === 'Fleet' && (
            <FleetTab fleet={fleet} selected={selectedEquip} onSelect={setSelectedEquip}
              onAddFuel={() => setShowLogFuel(true)} />
          )}
          {tab === 'Due Now' && <DueTab alerts={dueAlerts} />}
          {tab === 'Service History' && (
            <HistoryTab fleet={fleet} equip={equip} selectedId={selectedEquip}
              onSelectEquip={setSelectedEquip} history={serviceHistory} />
          )}
          {tab === 'Fuel Log' && (
            <FuelTab fleet={fleet} equip={equip} selectedId={selectedEquip}
              onSelectEquip={setSelectedEquip} history={fuelHistory}
              onAdd={() => setShowLogFuel(true)} />
          )}
        </div>
      </div>

      {showAddEquip && (
        <AddEquipModal onClose={() => setShowAddEquip(false)}
          onSaved={() => { setShowAddEquip(false); fetchFleet(); }} />
      )}
      {showLogService && (
        <LogServiceModal fleet={fleet} defaultEquip={selectedEquip}
          onClose={() => setShowLogService(false)}
          onSaved={() => { setShowLogService(false); fetchFleet(); if (selectedEquip) fetchEquipHistory(selectedEquip); }} />
      )}
      {showLogFuel && (
        <LogFuelModal fleet={fleet} defaultEquip={selectedEquip}
          onClose={() => setShowLogFuel(false)}
          onSaved={() => { setShowLogFuel(false); fetchFleet(); if (selectedEquip) fetchEquipHistory(selectedEquip); }} />
      )}

      <SaigeWidget businessId={bid} pageContext="Equipment Maintenance Tracker" />
    </div>
  );
}

function FleetTab({ fleet, selected, onSelect, onAddFuel }) {
  if (!fleet.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">🚜</div>
      <p className="font-medium text-gray-500">No equipment registered yet</p>
      <p className="text-sm mt-1">Add your first piece of equipment to start tracking maintenance.</p>
    </div>
  );
  return (
    <div className="space-y-3 max-w-3xl">
      {fleet.map(e => (
        <div key={e.EquipmentID}
          onClick={() => onSelect(e.EquipmentID === selected ? null : e.EquipmentID)}
          className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
            selected === e.EquipmentID ? 'border-purple-400 ring-1 ring-purple-300' : 'border-gray-200'
          }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{e.EquipmentName}</span>
                {e.Make && <span className="text-xs text-gray-400">{e.Make} {e.Model || ''}</span>}
                <StatusBadge status={e.ServiceStatus} />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {e.CurrentHours != null && `${fmt(e.CurrentHours, 1)} h`}
                {e.CurrentKm != null && ` · ${fmt(e.CurrentKm, 0)} km`}
                {e.LastServiceDate && ` · Last service: ${e.LastServiceDate}`}
              </div>
              {e.NextServiceDate && (
                <div className={`text-xs mt-1 ${
                  e.ServiceStatus === 'overdue' ? 'text-red-600 font-semibold' :
                  e.ServiceStatus === 'due_soon' ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  Next service: {e.NextServiceDate}
                </div>
              )}
            </div>
            <div className="text-right text-xs text-gray-500">
              {e.FuelLitres30d != null && <div>{fmt(e.FuelLitres30d, 1)} L (30d fuel)</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DueTab({ alerts }) {
  if (!alerts.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">✅</div>
      <p className="font-medium text-gray-600">All equipment is up to date</p>
    </div>
  );
  return (
    <div className="space-y-3 max-w-2xl">
      {alerts.map(e => (
        <div key={e.EquipmentID} className="bg-white rounded-xl border border-orange-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-gray-900">{e.EquipmentName}</div>
              <div className="text-xs text-gray-500">{e.Make} {e.Model}</div>
              {e.NextServiceDate && (
                <div className="text-xs text-orange-700 mt-1 font-semibold">Service due: {e.NextServiceDate}</div>
              )}
              {e.NextServiceHours != null && (
                <div className="text-xs text-orange-600">At {fmt(e.NextServiceHours, 0)} h (current: {fmt(e.CurrentHours, 1)} h)</div>
              )}
            </div>
            <StatusBadge status={e.Status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryTab({ fleet, equip, selectedId, onSelectEquip, history }) {
  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Select Equipment</label>
        <select value={selectedId || ''} onChange={e => onSelectEquip(Number(e.target.value) || null)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72">
          <option value="">Choose equipment…</option>
          {fleet.map(e => <option key={e.EquipmentID} value={e.EquipmentID}>{e.EquipmentName}</option>)}
        </select>
      </div>
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Hours</th>
                <th className="text-right px-4 py-3">Cost</th>
                <th className="text-left px-4 py-3">By</th>
              </tr>
            </thead>
            <tbody>
              {history.map(s => (
                <tr key={s.ServiceID} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{s.ServiceDate}</td>
                  <td className="px-4 py-3 capitalize">{s.ServiceType.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-right">{s.HoursAtService != null ? fmt(s.HoursAtService, 1) : '—'}</td>
                  <td className="px-4 py-3 text-right">{s.TotalCost != null ? `$${fmt(s.TotalCost, 2)}` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.PerformedBy || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedId && !history.length && (
        <p className="text-sm text-gray-400">No service records for this equipment yet.</p>
      )}
    </div>
  );
}

function FuelTab({ fleet, equip, selectedId, onSelectEquip, history, onAdd }) {
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Select Equipment</label>
          <select value={selectedId || ''} onChange={e => onSelectEquip(Number(e.target.value) || null)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72">
            <option value="">Choose equipment…</option>
            {fleet.map(e => <option key={e.EquipmentID} value={e.EquipmentID}>{e.EquipmentName}</option>)}
          </select>
        </div>
        <button onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700">
          + Log Fuel
        </button>
      </div>
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Litres</th>
                <th className="text-right px-4 py-3">$/L</th>
                <th className="text-right px-4 py-3">Total Cost</th>
                <th className="text-left px-4 py-3">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {history.map(f => (
                <tr key={f.FuelID} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{f.LogDate}</td>
                  <td className="px-4 py-3 text-right">{fmt(f.Litres, 1)}</td>
                  <td className="px-4 py-3 text-right">{f.CostPerLitre != null ? `$${fmt(f.CostPerLitre, 3)}` : '—'}</td>
                  <td className="px-4 py-3 text-right">{f.TotalCost != null ? `$${fmt(f.TotalCost, 2)}` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{f.Supplier || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddEquipModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    equipment_name: '', make: '', model: '', year_manufactured: '',
    serial_number: '', registration_number: '', fuel_type: '',
    current_hours: '', current_km: '', purchase_date: '',
    purchase_price: '', service_interval_hours: '', service_interval_days: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const F = ({ label, name, type = 'text' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name] || ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const nums = ['year_manufactured', 'current_hours', 'current_km', 'purchase_price', 'service_interval_hours', 'service_interval_days'];
      const payload = { ...form };
      nums.forEach(k => { if (payload[k] !== '') payload[k] = Number(payload[k]); else delete payload[k]; });
      if (!payload.fuel_type) delete payload.fuel_type;
      const r = await fetch(`${API}/api/equipment-maintenance/fleet`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add Equipment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-3">
          <F label="Equipment Name *" name="equipment_name" />
          <div className="grid grid-cols-2 gap-3">
            <F label="Make" name="make" />
            <F label="Model" name="model" />
            <F label="Year" name="year_manufactured" type="number" />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fuel Type</label>
              <select value={form.fuel_type} onChange={e => setForm(f => ({ ...f, fuel_type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Select…</option>
                {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <F label="Serial Number" name="serial_number" />
            <F label="Registration" name="registration_number" />
            <F label="Current Hours" name="current_hours" type="number" />
            <F label="Current Km" name="current_km" type="number" />
            <F label="Purchase Date" name="purchase_date" type="date" />
            <F label="Purchase Price ($)" name="purchase_price" type="number" />
            <F label="Service Interval (h)" name="service_interval_hours" type="number" />
            <F label="Service Interval (days)" name="service_interval_days" type="number" />
          </div>
          <F label="Notes" name="notes" />
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.equipment_name}
            className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Add Equipment'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LogServiceModal({ fleet, defaultEquip, onClose, onSaved }) {
  const [form, setForm] = useState({
    equipment_id: defaultEquip || fleet[0]?.EquipmentID || '',
    service_date: new Date().toISOString().slice(0, 10),
    service_type: 'oil_change',
    hours_at_service: '', km_at_service: '',
    description: '', parts_used: '',
    parts_cost: '', labour_hours: '', labour_cost: '',
    performed_by: '', next_service_hours: '',
    next_service_date: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const F = ({ label, name, type = 'text' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name] || ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const eid = form.equipment_id;
      const nums = ['hours_at_service', 'km_at_service', 'parts_cost', 'labour_hours', 'labour_cost', 'next_service_hours'];
      const payload = { ...form };
      delete payload.equipment_id;
      nums.forEach(k => { payload[k] = payload[k] !== '' ? Number(payload[k]) : null; });
      payload.next_service_date = payload.next_service_date || null;
      const r = await fetch(`${API}/api/equipment-maintenance/fleet/${eid}/service`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Log Service Record</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Equipment *</label>
            <select value={form.equipment_id} onChange={e => setForm(f => ({ ...f, equipment_id: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {fleet.map(e => <option key={e.EquipmentID} value={e.EquipmentID}>{e.EquipmentName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Service Type *</label>
            <select value={form.service_type} onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {SERVICE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Service Date *" name="service_date" type="date" />
            <F label="Performed By" name="performed_by" />
            <F label="Hours at Service" name="hours_at_service" type="number" />
            <F label="Km at Service" name="km_at_service" type="number" />
            <F label="Parts Cost ($)" name="parts_cost" type="number" />
            <F label="Labour Cost ($)" name="labour_cost" type="number" />
            <F label="Next Service (h)" name="next_service_hours" type="number" />
            <F label="Next Service Date" name="next_service_date" type="date" />
          </div>
          <F label="Description" name="description" />
          <F label="Parts Used" name="parts_used" />
          <F label="Notes" name="notes" />
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.equipment_id || !form.service_date}
            className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Service Record'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LogFuelModal({ fleet, defaultEquip, onClose, onSaved }) {
  const [form, setForm] = useState({
    equipment_id: defaultEquip || fleet[0]?.EquipmentID || '',
    log_date: new Date().toISOString().slice(0, 10),
    litres: '', cost_per_litre: '',
    hours_at_fill: '', km_at_fill: '',
    fuel_type: '', supplier: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const F = ({ label, name, type = 'text' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name] || ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400" />
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const eid = form.equipment_id;
      const payload = {
        log_date: form.log_date,
        litres: Number(form.litres),
        cost_per_litre: form.cost_per_litre ? Number(form.cost_per_litre) : null,
        hours_at_fill: form.hours_at_fill ? Number(form.hours_at_fill) : null,
        km_at_fill: form.km_at_fill ? Number(form.km_at_fill) : null,
        fuel_type: form.fuel_type || null,
        supplier: form.supplier || null,
        notes: form.notes || null,
      };
      const r = await fetch(`${API}/api/equipment-maintenance/fleet/${eid}/fuel`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Log Fuel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Equipment *</label>
            <select value={form.equipment_id} onChange={e => setForm(f => ({ ...f, equipment_id: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {fleet.map(e => <option key={e.EquipmentID} value={e.EquipmentID}>{e.EquipmentName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Date *" name="log_date" type="date" />
            <F label="Litres *" name="litres" type="number" />
            <F label="Cost/L ($)" name="cost_per_litre" type="number" />
            <F label="Supplier" name="supplier" />
            <F label="Hours at Fill" name="hours_at_fill" type="number" />
            <F label="Km at Fill" name="km_at_fill" type="number" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fuel Type</label>
            <select value={form.fuel_type} onChange={e => setForm(f => ({ ...f, fuel_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select…</option>
              {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <F label="Notes" name="notes" />
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.equipment_id || !form.litres}
            className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Log Fuel'}
          </button>
        </div>
      </div>
    </div>
  );
}
