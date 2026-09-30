import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SaigeWidget from "./SaigeWidget";

const API = import.meta.env.VITE_API_URL || "";

function apiFetch(path, opts = {}) {
  const token = localStorage.getItem("access_token");
  return fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
  });
}

const TABS = ["Dashboard", "Bins", "Readings", "Alerts", "Aeration", "Equilibrium"];
const COMMODITIES = ["wheat", "corn", "canola", "barley", "sorghum", "rice", "oats", "rye", "soybeans", "sunflower"];

function AlertBadge({ level }) {
  const colors = { warning: "bg-yellow-100 text-yellow-800", critical: "bg-red-100 text-red-800", info: "bg-blue-100 text-blue-800" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[level] || "bg-gray-100 text-gray-700"}`}>{level}</span>;
}

function StatCard({ label, value, unit, color = "text-amber-700" }) {
  return (
    <div className="bg-white rounded-xl border border-amber-100 p-4 text-center shadow-sm">
      <div className={`text-2xl font-bold ${color}`}>{value ?? "—"}<span className="text-sm font-normal ml-1 text-gray-500">{unit}</span></div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function GrainBinMonitor() {
  const [params] = useSearchParams();
  const bid = params.get("BusinessID");
  const [tab, setTab] = useState("Dashboard");
  const [bins, setBins] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [readings, setReadings] = useState([]);
  const [aeration, setAeration] = useState([]);
  const [eqResult, setEqResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddBin, setShowAddBin] = useState(false);
  const [showAddReading, setShowAddReading] = useState(false);
  const [showAddAeration, setShowAddAeration] = useState(false);
  const [eqForm, setEqForm] = useState({ commodity: "wheat", temp_c: "15", rh_pct: "65" });
  const [binForm, setBinForm] = useState({ bin_name: "", commodity: "wheat", capacity_tonnes: "", diameter_m: "", height_m: "", latitude: "", longitude: "", notes: "" });
  const [readingForm, setReadingForm] = useState({ probe_label: "", temp_c: "", moisture_pct: "", rh_pct: "", co2_ppm: "", notes: "" });
  const [aerationForm, setAerationForm] = useState({ action: "start", operator_name: "", notes: "" });

  const loadBins = useCallback(async () => {
    setLoading(true);
    const r = await apiFetch("/api/grain-bin/bins");
    if (r.ok) setBins(await r.json());
    setLoading(false);
  }, []);

  const loadAlerts = useCallback(async () => {
    const r = await apiFetch("/api/grain-bin/alerts?acknowledged=false");
    if (r.ok) setAlerts(await r.json());
  }, []);

  const loadReadings = useCallback(async (binId) => {
    const r = await apiFetch(`/api/grain-bin/bins/${binId}/readings?limit=50`);
    if (r.ok) setReadings(await r.json());
  }, []);

  const loadAeration = useCallback(async (binId) => {
    const r = await apiFetch(`/api/grain-bin/bins/${binId}/aeration`);
    if (r.ok) setAeration(await r.json());
  }, []);

  useEffect(() => { loadBins(); loadAlerts(); }, [loadBins, loadAlerts]);
  useEffect(() => {
    if (selectedBin) { loadReadings(selectedBin.BinID); loadAeration(selectedBin.BinID); }
  }, [selectedBin, loadReadings, loadAeration]);

  async function createBin() {
    const body = {
      bin_name: binForm.bin_name, commodity: binForm.commodity,
      capacity_tonnes: binForm.capacity_tonnes ? parseFloat(binForm.capacity_tonnes) : null,
      diameter_m: binForm.diameter_m ? parseFloat(binForm.diameter_m) : null,
      height_m: binForm.height_m ? parseFloat(binForm.height_m) : null,
      latitude: binForm.latitude ? parseFloat(binForm.latitude) : null,
      longitude: binForm.longitude ? parseFloat(binForm.longitude) : null,
      notes: binForm.notes || null,
    };
    const r = await apiFetch("/api/grain-bin/bins", { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddBin(false); setBinForm({ bin_name: "", commodity: "wheat", capacity_tonnes: "", diameter_m: "", height_m: "", latitude: "", longitude: "", notes: "" }); loadBins(); }
  }

  async function addReading() {
    if (!selectedBin) return;
    const body = {
      probe_label: readingForm.probe_label || null,
      temp_c: readingForm.temp_c ? parseFloat(readingForm.temp_c) : null,
      moisture_pct: readingForm.moisture_pct ? parseFloat(readingForm.moisture_pct) : null,
      rh_pct: readingForm.rh_pct ? parseFloat(readingForm.rh_pct) : null,
      co2_ppm: readingForm.co2_ppm ? parseFloat(readingForm.co2_ppm) : null,
      notes: readingForm.notes || null,
    };
    const r = await apiFetch(`/api/grain-bin/bins/${selectedBin.BinID}/readings`, { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddReading(false); setReadingForm({ probe_label: "", temp_c: "", moisture_pct: "", rh_pct: "", co2_ppm: "", notes: "" }); loadReadings(selectedBin.BinID); loadAlerts(); }
  }

  async function addAeration() {
    if (!selectedBin) return;
    const body = { action: aerationForm.action, operator_name: aerationForm.operator_name || null, notes: aerationForm.notes || null };
    const r = await apiFetch(`/api/grain-bin/bins/${selectedBin.BinID}/aeration`, { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddAeration(false); setAerationForm({ action: "start", operator_name: "", notes: "" }); loadAeration(selectedBin.BinID); }
  }

  async function acknowledgeAlert(alertId) {
    await apiFetch(`/api/grain-bin/alerts/${alertId}/acknowledge`, { method: "POST" });
    loadAlerts();
  }

  async function calcEquilibrium() {
    const r = await apiFetch(`/api/grain-bin/equilibrium?commodity=${eqForm.commodity}&temp_c=${eqForm.temp_c}&rh_pct=${eqForm.rh_pct}`);
    if (r.ok) setEqResult(await r.json());
  }

  const latestByBin = bins.map(b => {
    const binAlerts = alerts.filter(a => a.BinID === b.BinID);
    return { ...b, alertCount: binAlerts.length, criticalCount: binAlerts.filter(a => a.AlertLevel === "critical").length };
  });

  function Field({ label, value, onChange, type = "text", step }) {
    return (
      <div>
        <label className="block text-xs text-gray-600 mb-1">{label}</label>
        <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Grain Bin & Silo Monitor</h1>
            <p className="text-sm text-amber-700 mt-0.5">Temperature, moisture, CO₂ — Chung-Pfost EMC equilibrium alerts</p>
          </div>
          <button onClick={() => setShowAddBin(true)} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700">+ Add Bin</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-amber-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === t ? "bg-white text-amber-800 shadow" : "text-amber-700 hover:bg-amber-50"}`}>{t}</button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "Dashboard" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Bins" value={bins.length} />
              <StatCard label="Active Alerts" value={alerts.length} color={alerts.length > 0 ? "text-red-600" : "text-amber-700"} />
              <StatCard label="Critical Alerts" value={alerts.filter(a => a.AlertLevel === "critical").length} color="text-red-700" />
              <StatCard label="Commodities" value={[...new Set(bins.map(b => b.Commodity))].length} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestByBin.map(bin => (
                <div key={bin.BinID} onClick={() => { setSelectedBin(bin); setTab("Readings"); }} className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm cursor-pointer hover:border-amber-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{bin.BinName}</div>
                      <div className="text-xs text-amber-700 capitalize">{bin.Commodity}</div>
                    </div>
                    {bin.criticalCount > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{bin.criticalCount} critical</span>}
                    {bin.criticalCount === 0 && bin.alertCount > 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{bin.alertCount} alert</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mt-3">
                    <div><div className="text-lg font-bold text-amber-800">{bin.CapacityTonnes ?? "—"}</div><div className="text-xs text-gray-500">t cap</div></div>
                    <div><div className="text-lg font-bold text-blue-700">{bin.DiameterM ?? "—"}</div><div className="text-xs text-gray-500">m Ø</div></div>
                    <div><div className="text-lg font-bold text-green-700">{bin.HeightM ?? "—"}</div><div className="text-xs text-gray-500">m tall</div></div>
                  </div>
                </div>
              ))}
              {bins.length === 0 && !loading && (
                <div className="col-span-3 text-center py-12 text-gray-500">No bins registered yet. Click "+ Add Bin" to get started.</div>
              )}
            </div>
          </div>
        )}

        {/* Bins */}
        {tab === "Bins" && (
          <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-amber-50 text-amber-800 text-xs uppercase">
                <tr>{["Bin Name", "Commodity", "Capacity (t)", "Diameter (m)", "Height (m)", "Notes"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {bins.map(b => (
                  <tr key={b.BinID} onClick={() => { setSelectedBin(b); setTab("Readings"); }} className="hover:bg-amber-50 cursor-pointer">
                    <td className="px-4 py-3 font-medium">{b.BinName}</td>
                    <td className="px-4 py-3 capitalize">{b.Commodity}</td>
                    <td className="px-4 py-3">{b.CapacityTonnes ?? "—"}</td>
                    <td className="px-4 py-3">{b.DiameterM ?? "—"}</td>
                    <td className="px-4 py-3">{b.HeightM ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{b.Notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Readings */}
        {tab === "Readings" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Bin:</span>
                <select value={selectedBin?.BinID ?? ""} onChange={e => { const b = bins.find(x => x.BinID === parseInt(e.target.value)); setSelectedBin(b || null); }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option value="">Select a bin…</option>
                  {bins.map(b => <option key={b.BinID} value={b.BinID}>{b.BinName} ({b.Commodity})</option>)}
                </select>
              </div>
              {selectedBin && <button onClick={() => setShowAddReading(true)} className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-700">+ Add Reading</button>}
            </div>
            {selectedBin ? (
              <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-amber-50 text-amber-800 text-xs uppercase">
                    <tr>{["Time", "Probe", "Temp °C", "Moisture %", "RH %", "CO₂ ppm", "Notes"].map(h => <th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-amber-50">
                    {readings.map(r => (
                      <tr key={r.ReadingID} className="hover:bg-amber-50">
                        <td className="px-3 py-2 text-gray-500 text-xs">{r.ReadingTime ? new Date(r.ReadingTime).toLocaleString() : "—"}</td>
                        <td className="px-3 py-2">{r.ProbeLabel ?? "—"}</td>
                        <td className="px-3 py-2">{r.TempC ?? "—"}</td>
                        <td className="px-3 py-2">{r.MoisturePct ?? "—"}</td>
                        <td className="px-3 py-2">{r.RhPct ?? "—"}</td>
                        <td className="px-3 py-2">{r.Co2Ppm ?? "—"}</td>
                        <td className="px-3 py-2 text-gray-500">{r.Notes ?? ""}</td>
                      </tr>
                    ))}
                    {readings.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-400">No readings recorded yet</td></tr>}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-center py-16 text-gray-400">Select a bin above to view readings</div>}
          </div>
        )}

        {/* Alerts */}
        {tab === "Alerts" && (
          <div className="space-y-3">
            {alerts.length === 0 && <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-amber-100">No active alerts — all bins within safe parameters</div>}
            {alerts.map(a => (
              <div key={a.AlertID} className="bg-white rounded-xl border border-amber-100 shadow-sm p-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1"><AlertBadge level={a.AlertLevel} /><span className="font-medium text-gray-900">{a.AlertType?.replace(/_/g, " ")}</span></div>
                  <div className="text-sm text-gray-600">{a.Message}</div>
                  <div className="text-xs text-gray-400 mt-1">{a.TriggeredAt ? new Date(a.TriggeredAt).toLocaleString() : ""}</div>
                </div>
                <button onClick={() => acknowledgeAlert(a.AlertID)} className="text-xs text-amber-700 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-50 ml-4">Acknowledge</button>
              </div>
            ))}
          </div>
        )}

        {/* Aeration */}
        {tab === "Aeration" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Bin:</span>
                <select value={selectedBin?.BinID ?? ""} onChange={e => { const b = bins.find(x => x.BinID === parseInt(e.target.value)); setSelectedBin(b || null); }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option value="">Select a bin…</option>
                  {bins.map(b => <option key={b.BinID} value={b.BinID}>{b.BinName}</option>)}
                </select>
              </div>
              {selectedBin && <button onClick={() => setShowAddAeration(true)} className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-700">Log Aeration Event</button>}
            </div>
            {selectedBin ? (
              <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-amber-50 text-amber-800 text-xs uppercase">
                    <tr>{["Time", "Action", "Fan Status", "Duration (hr)", "Operator", "Notes"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-amber-50">
                    {aeration.map(a => (
                      <tr key={a.LogID} className="hover:bg-amber-50">
                        <td className="px-4 py-2 text-xs text-gray-500">{a.LogTime ? new Date(a.LogTime).toLocaleString() : "—"}</td>
                        <td className="px-4 py-2 capitalize font-medium">{a.Action}</td>
                        <td className="px-4 py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${a.FanStatus === "on" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{a.FanStatus}</span></td>
                        <td className="px-4 py-2">{a.DurationHours ?? "—"}</td>
                        <td className="px-4 py-2">{a.OperatorName ?? "—"}</td>
                        <td className="px-4 py-2 text-gray-500">{a.Notes ?? ""}</td>
                      </tr>
                    ))}
                    {aeration.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No aeration events logged</td></tr>}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-center py-16 text-gray-400">Select a bin to view aeration history</div>}
          </div>
        )}

        {/* Equilibrium Calculator */}
        {tab === "Equilibrium" && (
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-amber-900 mb-1">EMC Equilibrium Calculator</h2>
              <p className="text-sm text-gray-500 mb-5">Uses the Chung-Pfost equation to predict equilibrium moisture content at ambient temperature and relative humidity.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Commodity</label>
                  <select value={eqForm.commodity} onChange={e => setEqForm(f => ({ ...f, commodity: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Temperature (°C)</label>
                    <input type="number" step="0.1" value={eqForm.temp_c} onChange={e => setEqForm(f => ({ ...f, temp_c: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Relative Humidity (%)</label>
                    <input type="number" step="0.5" min="10" max="99" value={eqForm.rh_pct} onChange={e => setEqForm(f => ({ ...f, rh_pct: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <button onClick={calcEquilibrium} className="w-full bg-amber-600 text-white py-2.5 rounded-lg font-medium hover:bg-amber-700">Calculate</button>
              </div>
              {eqResult && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center"><div className="text-2xl font-bold text-amber-800">{eqResult.emc_pct?.toFixed(2)}%</div><div className="text-xs text-gray-500 mt-1">Equilibrium Moisture</div></div>
                    <div className="text-center"><div className="text-2xl font-bold text-green-700">{eqResult.safe_storage_pct?.toFixed(1)}%</div><div className="text-xs text-gray-500 mt-1">Safe Storage Target</div></div>
                  </div>
                  <div className={`mt-4 text-center text-sm font-medium py-2 rounded-lg ${eqResult.aeration_recommended ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                    {eqResult.aeration_recommended ? "⚠ Aeration recommended — ambient EMC is favorable for drying" : "✓ Conditions not favorable for aeration — hold"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Bin Modal */}
      {showAddBin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Add Grain Bin / Silo</h3>
            <div className="space-y-3">
              <Field label="Bin Name *" value={binForm.bin_name} onChange={v => setBinForm(f => ({ ...f, bin_name: v }))} />
              <div>
                <label className="block text-xs text-gray-600 mb-1">Commodity</label>
                <select value={binForm.commodity} onChange={e => setBinForm(f => ({ ...f, commodity: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Capacity (t)" value={binForm.capacity_tonnes} onChange={v => setBinForm(f => ({ ...f, capacity_tonnes: v }))} type="number" step="0.1" />
                <Field label="Diameter (m)" value={binForm.diameter_m} onChange={v => setBinForm(f => ({ ...f, diameter_m: v }))} type="number" step="0.1" />
                <Field label="Height (m)" value={binForm.height_m} onChange={v => setBinForm(f => ({ ...f, height_m: v }))} type="number" step="0.1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitude" value={binForm.latitude} onChange={v => setBinForm(f => ({ ...f, latitude: v }))} type="number" step="0.0001" />
                <Field label="Longitude" value={binForm.longitude} onChange={v => setBinForm(f => ({ ...f, longitude: v }))} type="number" step="0.0001" />
              </div>
              <Field label="Notes" value={binForm.notes} onChange={v => setBinForm(f => ({ ...f, notes: v }))} />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddBin(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={createBin} disabled={!binForm.bin_name} className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50">Create Bin</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reading Modal */}
      {showAddReading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Add Sensor Reading — {selectedBin?.BinName}</h3>
            <div className="space-y-3">
              <Field label="Probe Label" value={readingForm.probe_label} onChange={v => setReadingForm(f => ({ ...f, probe_label: v }))} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Temperature (°C)" value={readingForm.temp_c} onChange={v => setReadingForm(f => ({ ...f, temp_c: v }))} type="number" step="0.1" />
                <Field label="Moisture (%)" value={readingForm.moisture_pct} onChange={v => setReadingForm(f => ({ ...f, moisture_pct: v }))} type="number" step="0.01" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Relative Humidity (%)" value={readingForm.rh_pct} onChange={v => setReadingForm(f => ({ ...f, rh_pct: v }))} type="number" step="0.5" />
                <Field label="CO₂ (ppm)" value={readingForm.co2_ppm} onChange={v => setReadingForm(f => ({ ...f, co2_ppm: v }))} type="number" />
              </div>
              <Field label="Notes" value={readingForm.notes} onChange={v => setReadingForm(f => ({ ...f, notes: v }))} />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddReading(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={addReading} className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">Save Reading</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Aeration Modal */}
      {showAddAeration && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Log Aeration Event</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Action</label>
                <select value={aerationForm.action} onChange={e => setAerationForm(f => ({ ...f, action: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="start">Start Fans</option>
                  <option value="stop">Stop Fans</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Operator Name</label>
                <input value={aerationForm.operator_name} onChange={e => setAerationForm(f => ({ ...f, operator_name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                <input value={aerationForm.notes} onChange={e => setAerationForm(f => ({ ...f, notes: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddAeration(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={addAeration} className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">Save</button>
            </div>
          </div>
        </div>
      )}

      <SaigeWidget businessId={bid} pageContext="Grain Bin & Silo Monitoring" />
    </div>
  );
}
