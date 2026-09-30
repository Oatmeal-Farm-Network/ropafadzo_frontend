import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SaigeWidget from "./SaigeWidget";

const API = import.meta.env.VITE_API_URL || "";

function api(path, opts = {}) {
  const token = localStorage.getItem("access_token");
  return fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  }).then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))));
}

const TABS = ["Dashboard", "Trends", "Alerts", "Sensors", "Settings"];
const SENSOR_TYPES = ["temperature", "humidity", "light", "moisture", "co2", "ph"];
const SEVERITY_COLORS = { warning: "bg-yellow-100 text-yellow-800 border-yellow-200", critical: "bg-red-100 text-red-800 border-red-200", info: "bg-blue-100 text-blue-800 border-blue-200" };
const TYPE_ICONS = { temperature: "🌡️", humidity: "💧", light: "☀️", moisture: "🌱", co2: "🫧", ph: "⚗️" };

function SensorCard({ sensor }) {
  const minsAgo = sensor.LatestTime ? Math.round((Date.now() - new Date(sensor.LatestTime)) / 60000) : null;
  const stale = minsAgo !== null && minsAgo > 15;
  return (
    <div className={`border rounded-lg p-3 bg-white shadow-sm ${!sensor.IsActive ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg">{TYPE_ICONS[sensor.SensorType] || "📡"}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${stale ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>{stale ? "Stale" : "Live"}</span>
      </div>
      <div className="font-medium text-sm">{sensor.SensorName}</div>
      {sensor.GreenhouseZone && <div className="text-xs text-gray-400">{sensor.GreenhouseZone}</div>}
      <div className="mt-2">
        {sensor.LatestValue !== null && sensor.LatestValue !== undefined
          ? <span className="text-2xl font-bold text-gray-800">{Number(sensor.LatestValue).toFixed(1)}<span className="text-sm font-normal text-gray-500 ml-1">{sensor.Units || ""}</span></span>
          : <span className="text-gray-300 text-sm">No readings</span>}
      </div>
      {minsAgo !== null && <div className="text-xs text-gray-400 mt-1">{minsAgo < 60 ? `${minsAgo}m ago` : `${Math.round(minsAgo / 60)}h ago`}</div>}
    </div>
  );
}

export default function IoTGreenhouse() {
  const [params] = useSearchParams();
  const bid = params.get("BusinessID");
  const [tab, setTab] = useState("Dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewSensor, setShowNewSensor] = useState(false);
  const [showNewThreshold, setShowNewThreshold] = useState(false);
  const [trendsHours, setTrendsHours] = useState(24);
  const [alertFilter, setAlertFilter] = useState("open");
  const navigate = useNavigate();

  const [sensorForm, setSensorForm] = useState({ sensor_name: "", sensor_type: "temperature", location: "", greenhouse_zone: "", units: "", is_active: true });
  const [thresholdForm, setThresholdForm] = useState({ sensor_id: "", variety_name: "", min_value: "", max_value: "", alert_severity: "warning", is_active: true });

  useEffect(() => {
    if (tab === "Dashboard") loadDashboard();
    else if (tab === "Trends") loadTrends();
    else if (tab === "Alerts") loadAlerts();
    else if (tab === "Sensors") loadSensors();
    else if (tab === "Settings") { loadSensors(); loadThresholds(); }
  }, [tab, trendsHours, alertFilter]);

  function loadDashboard() {
    setLoading(true);
    api("/api/iot/dashboard").then(setDashboard).finally(() => setLoading(false));
  }
  function loadTrends() {
    setLoading(true);
    api(`/api/iot/trends?hours=${trendsHours}`).then(setTrends).finally(() => setLoading(false));
  }
  function loadAlerts() {
    setLoading(true);
    const ack = alertFilter === "open" ? "false" : alertFilter === "acked" ? "true" : undefined;
    const p = ack !== undefined ? `?acknowledged=${ack}` : "";
    api(`/api/iot/alerts${p}`).then(setAlerts).finally(() => setLoading(false));
  }
  function loadSensors() {
    setLoading(true);
    api("/api/iot/sensors").then(setSensors).finally(() => setLoading(false));
  }
  function loadThresholds() {
    api("/api/iot/thresholds").then(setThresholds).catch(() => {});
  }

  function ackAlert(alertId) {
    api(`/api/iot/alerts/${alertId}/acknowledge`, { method: "PATCH", body: JSON.stringify({ acknowledged_by: "dashboard" }) })
      .then(loadAlerts).catch((e) => alert(e.detail || "Error"));
  }

  function submitSensor(e) {
    e.preventDefault();
    api("/api/iot/sensors", { method: "POST", body: JSON.stringify(sensorForm) })
      .then(() => { setShowNewSensor(false); loadSensors(); if (tab === "Dashboard") loadDashboard(); })
      .catch((e) => alert(e.detail || "Error"));
  }

  function submitThreshold(e) {
    e.preventDefault();
    const body = { ...thresholdForm, sensor_id: parseInt(thresholdForm.sensor_id), min_value: thresholdForm.min_value ? parseFloat(thresholdForm.min_value) : null, max_value: thresholdForm.max_value ? parseFloat(thresholdForm.max_value) : null };
    api("/api/iot/thresholds", { method: "PUT", body: JSON.stringify(body) })
      .then(() => { setShowNewThreshold(false); loadThresholds(); })
      .catch((e) => alert(e.detail || "Error"));
  }

  // group dashboard sensors by zone
  const byZone = {};
  (dashboard?.sensors || []).forEach((s) => {
    const z = s.GreenhouseZone || "Unassigned";
    if (!byZone[z]) byZone[z] = [];
    byZone[z].push(s);
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IoT Greenhouse Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time micro-climate sensors, threshold alerts, and variety-specific monitoring</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
            {t === "Alerts" && dashboard?.open_alerts > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{dashboard.open_alerts}</span>
            )}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === "Dashboard" && (
        <div>
          {dashboard && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white border rounded-lg p-4 text-center"><div className="text-2xl font-bold">{dashboard.active_sensors}</div><div className="text-xs text-gray-500 mt-1">Active Sensors</div></div>
              <div className="bg-white border rounded-lg p-4 text-center"><div className="text-2xl font-bold">{dashboard.total_sensors}</div><div className="text-xs text-gray-500 mt-1">Total Sensors</div></div>
              <div className={`border rounded-lg p-4 text-center ${dashboard.open_alerts > 0 ? "bg-red-50 border-red-200" : "bg-white"}`}><div className={`text-2xl font-bold ${dashboard.open_alerts > 0 ? "text-red-600" : ""}`}>{dashboard.open_alerts}</div><div className="text-xs text-gray-500 mt-1">Open Alerts</div></div>
            </div>
          )}
          {loading && <div className="text-center py-8 text-gray-400">Loading…</div>}
          {Object.keys(byZone).map((zone) => (
            <div key={zone} className="mb-5">
              <h2 className="font-semibold text-gray-700 mb-2">{zone}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {byZone[zone].map((s) => <SensorCard key={s.SensorID} sensor={s} />)}
              </div>
            </div>
          ))}
          {dashboard && dashboard.sensors.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📡</div>
              <div>No sensors configured yet.</div>
              <button onClick={() => setTab("Sensors")} className="mt-3 text-green-600 underline text-sm">Add a sensor</button>
            </div>
          )}
        </div>
      )}

      {/* TRENDS */}
      {tab === "Trends" && (
        <div>
          <div className="flex gap-2 mb-4">
            {[6, 24, 48, 168].map((h) => (
              <button key={h} onClick={() => setTrendsHours(h)}
                className={`px-3 py-1 rounded text-sm ${trendsHours === h ? "bg-green-600 text-white" : "border text-gray-600 hover:bg-gray-50"}`}>
                {h < 24 ? `${h}h` : h < 168 ? `${h / 24}d` : "7d"}
              </button>
            ))}
          </div>
          {loading && <div className="text-center py-8 text-gray-400">Loading…</div>}
          {trends.map((s) => (
            <div key={s.sensor_id} className="mb-6 border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <span>{TYPE_ICONS[s.SensorType] || "📡"}</span>
                <span className="font-medium">{s.SensorName}</span>
                {s.GreenhouseZone && <span className="text-xs text-gray-400">· {s.GreenhouseZone}</span>}
                <span className="text-xs text-gray-400">({s.readings.length} readings)</span>
              </div>
              <div className="relative h-20 bg-gray-50 rounded overflow-hidden">
                {s.readings.length > 1 && (() => {
                  const vals = s.readings.map((r) => Number(r.value));
                  const mn = Math.min(...vals), mx = Math.max(...vals), range = mx - mn || 1;
                  const pts = s.readings.map((r, i) => {
                    const x = (i / (s.readings.length - 1)) * 100;
                    const y = 100 - ((Number(r.value) - mn) / range) * 80 - 10;
                    return `${x},${y}`;
                  }).join(" ");
                  return (
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polyline points={pts} fill="none" stroke="#16a34a" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    </svg>
                  );
                })()}
                <div className="absolute bottom-1 left-2 text-xs text-gray-400">{s.readings.length > 0 ? `${Number(s.readings[0].value).toFixed(1)} → ${Number(s.readings[s.readings.length - 1].value).toFixed(1)} ${s.Units || ""}` : ""}</div>
              </div>
              <div className="mt-1 text-xs text-gray-400 flex justify-between">
                {s.readings.length > 0 && <>
                  <span>{new Date(s.readings[0].time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span>Min: {Math.min(...s.readings.map((r) => Number(r.value))).toFixed(1)} · Max: {Math.max(...s.readings.map((r) => Number(r.value))).toFixed(1)} {s.Units || ""}</span>
                  <span>{new Date(s.readings[s.readings.length - 1].time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </>}
              </div>
            </div>
          ))}
          {!loading && trends.length === 0 && <div className="text-center py-8 text-gray-400">No trend data in this window</div>}
        </div>
      )}

      {/* ALERTS */}
      {tab === "Alerts" && (
        <div>
          <div className="flex gap-2 mb-4">
            {["open", "acked", "all"].map((f) => (
              <button key={f} onClick={() => setAlertFilter(f)}
                className={`px-3 py-1 rounded text-sm capitalize ${alertFilter === f ? "bg-green-600 text-white" : "border text-gray-600 hover:bg-gray-50"}`}>
                {f === "open" ? "Open" : f === "acked" ? "Acknowledged" : "All"}
              </button>
            ))}
          </div>
          {loading && <div className="text-center py-8 text-gray-400">Loading…</div>}
          <div className="space-y-2">
            {alerts.length === 0 && !loading && <div className="text-center py-8 text-gray-400">No alerts</div>}
            {alerts.map((a) => (
              <div key={a.AlertID} className={`border rounded-lg p-3 flex items-start justify-between gap-3 ${SEVERITY_COLORS[a.Severity] || "bg-white border-gray-200"}`}>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{a.Message}</div>
                  <div className="text-xs mt-0.5 opacity-70">{a.SensorName} · {a.GreenhouseZone || "—"} · {new Date(a.TriggeredAt).toLocaleString()}</div>
                  {a.AcknowledgedAt && <div className="text-xs mt-0.5 opacity-60">Acked by {a.AcknowledgedBy || "user"} at {new Date(a.AcknowledgedAt).toLocaleString()}</div>}
                </div>
                {!a.AcknowledgedAt && (
                  <button onClick={() => ackAlert(a.AlertID)} className="shrink-0 text-xs px-2 py-1 bg-white/60 border rounded hover:bg-white">Acknowledge</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SENSORS */}
      {tab === "Sensors" && (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={() => setShowNewSensor(true)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">+ Add Sensor</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>{["Name", "Type", "Zone", "Location", "Units", "Last Seen", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sensors.length === 0 && <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-400">No sensors</td></tr>}
                {sensors.map((s) => (
                  <tr key={s.SensorID} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{s.SensorName}</td>
                    <td className="px-3 py-2 capitalize">{TYPE_ICONS[s.SensorType]} {s.SensorType}</td>
                    <td className="px-3 py-2">{s.GreenhouseZone || "—"}</td>
                    <td className="px-3 py-2">{s.Location || "—"}</td>
                    <td className="px-3 py-2">{s.Units || "—"}</td>
                    <td className="px-3 py-2 text-gray-400 text-xs">{s.LastSeenAt ? new Date(s.LastSeenAt).toLocaleString() : "Never"}</td>
                    <td className="px-3 py-2">{s.IsActive ? <span className="text-green-600">Active</span> : <span className="text-gray-400">Inactive</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {tab === "Settings" && (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={() => setShowNewThreshold(true)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">+ Add Threshold</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>{["Sensor", "Variety", "Min", "Max", "Severity", "Active"].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {thresholds.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400">No thresholds configured</td></tr>}
                {thresholds.map((t) => (
                  <tr key={t.ThresholdID} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{t.SensorName}</td>
                    <td className="px-3 py-2">{t.VarietyName || "All"}</td>
                    <td className="px-3 py-2">{t.MinValue !== null ? t.MinValue : "—"}</td>
                    <td className="px-3 py-2">{t.MaxValue !== null ? t.MaxValue : "—"}</td>
                    <td className="px-3 py-2 capitalize"><span className={`px-2 py-0.5 rounded text-xs ${SEVERITY_COLORS[t.AlertSeverity] || ""}`}>{t.AlertSeverity}</span></td>
                    <td className="px-3 py-2">{t.IsActive ? <span className="text-green-600">Yes</span> : <span className="text-gray-400">No</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Sensor Modal */}
      {showNewSensor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Sensor</h2>
            <form onSubmit={submitSensor} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sensor Name *</label>
                  <input required className="w-full border rounded px-2 py-1.5 text-sm" value={sensorForm.sensor_name} onChange={(e) => setSensorForm({ ...sensorForm, sensor_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
                  <select required className="w-full border rounded px-2 py-1.5 text-sm" value={sensorForm.sensor_type} onChange={(e) => setSensorForm({ ...sensorForm, sensor_type: e.target.value })}>
                    {SENSOR_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Units</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" placeholder="°C, %, lux…" value={sensorForm.units} onChange={(e) => setSensorForm({ ...sensorForm, units: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. North House" value={sensorForm.greenhouse_zone} onChange={(e) => setSensorForm({ ...sensorForm, greenhouse_zone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. Row 3, East wall" value={sensorForm.location} onChange={(e) => setSensorForm({ ...sensorForm, location: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewSensor(false)} className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Add Sensor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Threshold Modal */}
      {showNewThreshold && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Threshold Alert</h2>
            <form onSubmit={submitThreshold} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sensor *</label>
                  <select required className="w-full border rounded px-2 py-1.5 text-sm" value={thresholdForm.sensor_id} onChange={(e) => setThresholdForm({ ...thresholdForm, sensor_id: e.target.value })}>
                    <option value="">Select sensor…</option>
                    {sensors.map((s) => <option key={s.SensorID} value={s.SensorID}>{s.SensorName} ({s.GreenhouseZone || "No zone"})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Variety (optional)</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" placeholder="All varieties" value={thresholdForm.variety_name} onChange={(e) => setThresholdForm({ ...thresholdForm, variety_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Severity</label>
                  <select className="w-full border rounded px-2 py-1.5 text-sm" value={thresholdForm.alert_severity} onChange={(e) => setThresholdForm({ ...thresholdForm, alert_severity: e.target.value })}>
                    {["info", "warning", "critical"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min Value</label>
                  <input type="number" step="any" className="w-full border rounded px-2 py-1.5 text-sm" value={thresholdForm.min_value} onChange={(e) => setThresholdForm({ ...thresholdForm, min_value: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Value</label>
                  <input type="number" step="any" className="w-full border rounded px-2 py-1.5 text-sm" value={thresholdForm.max_value} onChange={(e) => setThresholdForm({ ...thresholdForm, max_value: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewThreshold(false)} className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Save Threshold</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SaigeWidget businessId={bid} pageContext="IoT Greenhouse Monitoring" />
    </div>
  );
}
