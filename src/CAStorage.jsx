import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ThaiymeChat from "./ThaiymeChat";
import SaigeWidget from "./SaigeWidget";

const API = import.meta.env.VITE_API_URL || "";

function apiFetch(path, opts = {}) {
  const token = localStorage.getItem("access_token");
  return fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
  });
}

const TABS = ["Dashboard", "Rooms", "Readings", "Alerts", "Lot Assignments", "Protocols"];

const PROTOCOL_COMMODITIES = [
  "apple", "pear", "kiwifruit", "avocado", "mango", "blueberry", "cherry", "peach",
  "nectarine", "plum", "pomegranate", "grape", "citrus", "persimmon", "lychee",
];

function AlertBadge({ level }) {
  const map = { warning: "bg-yellow-100 text-yellow-800", critical: "bg-red-100 text-red-800", info: "bg-blue-100 text-blue-800" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[level] || "bg-gray-100 text-gray-600"}`}>{level}</span>;
}

function StatusIndicator({ value, target, tol, unit, label }) {
  if (value == null || target == null) return null;
  const diff = Math.abs(value - target);
  const ok = diff <= tol;
  const warn = diff <= tol * 2 && !ok;
  const color = ok ? "text-green-600" : warn ? "text-yellow-600" : "text-red-600";
  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${color}`}>{value}<span className="text-xs font-normal ml-0.5">{unit}</span></div>
      <div className="text-xs text-gray-400">{label} (target {target}{unit})</div>
    </div>
  );
}

export default function CAStorage() {
  const [params] = useSearchParams();
  const bid = params.get("BusinessID");
  const [tab, setTab] = useState("Dashboard");
  const [rooms, setRooms] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [readings, setReadings] = useState([]);
  const [lots, setLots] = useState([]);
  const [protocolResult, setProtocolResult] = useState(null);
  const [protocolQuery, setProtocolQuery] = useState("apple");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddReading, setShowAddReading] = useState(false);
  const [showAddLot, setShowAddLot] = useState(false);
  const [loading, setLoading] = useState(false);

  const [roomForm, setRoomForm] = useState({ room_name: "", commodity: "apple", capacity_tonnes: "", target_o2_pct: "", target_co2_pct: "", target_temp_c: "", target_rh_pct: "", notes: "" });
  const [readingForm, setReadingForm] = useState({ o2_pct: "", co2_pct: "", temp_c: "", rh_pct: "", ethylene_ppm: "", notes: "" });
  const [lotForm, setLotForm] = useState({ lot_number: "", variety: "", net_weight_kg: "", bin_barcodes: "", stored_at: "", expected_out: "", notes: "" });

  const loadRooms = useCallback(async () => {
    setLoading(true);
    const r = await apiFetch("/api/ca-storage/rooms");
    if (r.ok) setRooms(await r.json());
    setLoading(false);
  }, []);

  const loadAlerts = useCallback(async () => {
    const r = await apiFetch("/api/ca-storage/alerts?acknowledged=false");
    if (r.ok) setAlerts(await r.json());
  }, []);

  const loadReadings = useCallback(async (roomId) => {
    const r = await apiFetch(`/api/ca-storage/rooms/${roomId}/readings?limit=50`);
    if (r.ok) setReadings(await r.json());
  }, []);

  const loadLots = useCallback(async (roomId) => {
    const r = await apiFetch(`/api/ca-storage/rooms/${roomId}/lots`);
    if (r.ok) setLots(await r.json());
  }, []);

  useEffect(() => { loadRooms(); loadAlerts(); }, [loadRooms, loadAlerts]);
  useEffect(() => {
    if (selectedRoom) { loadReadings(selectedRoom.RoomID); loadLots(selectedRoom.RoomID); }
  }, [selectedRoom, loadReadings, loadLots]);

  async function createRoom() {
    const body = {
      room_name: roomForm.room_name, commodity: roomForm.commodity,
      capacity_tonnes: roomForm.capacity_tonnes ? parseFloat(roomForm.capacity_tonnes) : null,
      target_o2_pct: roomForm.target_o2_pct ? parseFloat(roomForm.target_o2_pct) : null,
      target_co2_pct: roomForm.target_co2_pct ? parseFloat(roomForm.target_co2_pct) : null,
      target_temp_c: roomForm.target_temp_c ? parseFloat(roomForm.target_temp_c) : null,
      target_rh_pct: roomForm.target_rh_pct ? parseFloat(roomForm.target_rh_pct) : null,
      notes: roomForm.notes || null,
    };
    const r = await apiFetch("/api/ca-storage/rooms", { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddRoom(false); setRoomForm({ room_name: "", commodity: "apple", capacity_tonnes: "", target_o2_pct: "", target_co2_pct: "", target_temp_c: "", target_rh_pct: "", notes: "" }); loadRooms(); }
  }

  async function addReading() {
    if (!selectedRoom) return;
    const body = {
      o2_pct: readingForm.o2_pct ? parseFloat(readingForm.o2_pct) : null,
      co2_pct: readingForm.co2_pct ? parseFloat(readingForm.co2_pct) : null,
      temp_c: readingForm.temp_c ? parseFloat(readingForm.temp_c) : null,
      rh_pct: readingForm.rh_pct ? parseFloat(readingForm.rh_pct) : null,
      ethylene_ppm: readingForm.ethylene_ppm ? parseFloat(readingForm.ethylene_ppm) : null,
      notes: readingForm.notes || null,
    };
    const r = await apiFetch(`/api/ca-storage/rooms/${selectedRoom.RoomID}/readings`, { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddReading(false); setReadingForm({ o2_pct: "", co2_pct: "", temp_c: "", rh_pct: "", ethylene_ppm: "", notes: "" }); loadReadings(selectedRoom.RoomID); loadAlerts(); }
  }

  async function addLot() {
    if (!selectedRoom) return;
    const barcodes = lotForm.bin_barcodes ? lotForm.bin_barcodes.split(",").map(s => s.trim()).filter(Boolean) : [];
    const body = {
      lot_number: lotForm.lot_number,
      variety: lotForm.variety || null,
      net_weight_kg: lotForm.net_weight_kg ? parseFloat(lotForm.net_weight_kg) : null,
      bin_barcodes: barcodes.length ? barcodes : null,
      stored_at: lotForm.stored_at || null,
      expected_out: lotForm.expected_out || null,
      notes: lotForm.notes || null,
    };
    const r = await apiFetch(`/api/ca-storage/rooms/${selectedRoom.RoomID}/lots`, { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddLot(false); setLotForm({ lot_number: "", variety: "", net_weight_kg: "", bin_barcodes: "", stored_at: "", expected_out: "", notes: "" }); loadLots(selectedRoom.RoomID); }
  }

  async function acknowledgeAlert(alertId) {
    await apiFetch(`/api/ca-storage/alerts/${alertId}/acknowledge`, { method: "POST" });
    loadAlerts();
  }

  async function loadProtocol() {
    const r = await apiFetch(`/api/ca-storage/protocol?commodity=${encodeURIComponent(protocolQuery)}`);
    if (r.ok) setProtocolResult(await r.json());
  }

  function Field({ label, value, onChange, type = "text", step, placeholder }) {
    return (
      <div>
        <label className="block text-xs text-gray-600 mb-1">{label}</label>
        <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
      </div>
    );
  }

  const latest = (room) => {
    return readings.filter(r => r.RoomID === room.RoomID)[0];
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-sky-900">CA Cold Storage Management</h1>
            <p className="text-sm text-sky-700 mt-0.5">Controlled atmosphere rooms — O₂, CO₂, temperature & RH monitoring</p>
          </div>
          <button onClick={() => setShowAddRoom(true)} className="bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-800">+ Add Room</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-sky-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === t ? "bg-white text-sky-800 shadow" : "text-sky-700 hover:bg-sky-50"}`}>{t}</button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "Dashboard" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-sky-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-sky-800">{rooms.length}</div>
                <div className="text-xs text-gray-500 mt-1">CA Rooms</div>
              </div>
              <div className="bg-white rounded-xl border border-sky-100 p-4 text-center shadow-sm">
                <div className={`text-2xl font-bold ${alerts.length > 0 ? "text-red-600" : "text-sky-800"}`}>{alerts.length}</div>
                <div className="text-xs text-gray-500 mt-1">Active Alerts</div>
              </div>
              <div className="bg-white rounded-xl border border-sky-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-red-600">{alerts.filter(a => a.AlertLevel === "critical").length}</div>
                <div className="text-xs text-gray-500 mt-1">Critical</div>
              </div>
              <div className="bg-white rounded-xl border border-sky-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">{[...new Set(rooms.map(r => r.Commodity))].length}</div>
                <div className="text-xs text-gray-500 mt-1">Commodities</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => {
                const roomAlerts = alerts.filter(a => a.RoomID === room.RoomID);
                const hasCritical = roomAlerts.some(a => a.AlertLevel === "critical");
                return (
                  <div key={room.RoomID} onClick={() => { setSelectedRoom(room); setTab("Readings"); }} className={`bg-white rounded-xl border shadow-sm p-5 cursor-pointer hover:border-sky-300 transition-colors ${hasCritical ? "border-red-300" : "border-sky-100"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">{room.RoomName}</div>
                        <div className="text-xs text-sky-700 capitalize mt-0.5">{room.Commodity} · {room.CapacityTonnes ? `${room.CapacityTonnes}t` : "capacity TBD"}</div>
                      </div>
                      {hasCritical && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Critical</span>}
                      {!hasCritical && roomAlerts.length > 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{roomAlerts.length} alert</span>}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div><div className="text-sm font-bold text-sky-800">{room.TargetO2Pct ?? "—"}%</div><div className="text-xs text-gray-400">O₂</div></div>
                      <div><div className="text-sm font-bold text-sky-800">{room.TargetCo2Pct ?? "—"}%</div><div className="text-xs text-gray-400">CO₂</div></div>
                      <div><div className="text-sm font-bold text-sky-800">{room.TargetTempC ?? "—"}°C</div><div className="text-xs text-gray-400">Temp</div></div>
                      <div><div className="text-sm font-bold text-sky-800">{room.TargetRhPct ?? "—"}%</div><div className="text-xs text-gray-400">RH</div></div>
                    </div>
                  </div>
                );
              })}
              {rooms.length === 0 && !loading && (
                <div className="col-span-3 text-center py-16 text-gray-400">No CA rooms registered. Click "+ Add Room" to get started.</div>
              )}
            </div>
          </div>
        )}

        {/* Rooms */}
        {tab === "Rooms" && (
          <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-sky-50 text-sky-800 text-xs uppercase">
                <tr>{["Room Name", "Commodity", "Cap (t)", "O₂ %", "CO₂ %", "Temp °C", "RH %", "Notes"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {rooms.map(r => (
                  <tr key={r.RoomID} onClick={() => { setSelectedRoom(r); setTab("Readings"); }} className="hover:bg-sky-50 cursor-pointer">
                    <td className="px-4 py-2 font-medium">{r.RoomName}</td>
                    <td className="px-4 py-2 capitalize">{r.Commodity}</td>
                    <td className="px-4 py-2">{r.CapacityTonnes ?? "—"}</td>
                    <td className="px-4 py-2">{r.TargetO2Pct ?? "—"}</td>
                    <td className="px-4 py-2">{r.TargetCo2Pct ?? "—"}</td>
                    <td className="px-4 py-2">{r.TargetTempC ?? "—"}</td>
                    <td className="px-4 py-2">{r.TargetRhPct ?? "—"}</td>
                    <td className="px-4 py-2 text-gray-500">{r.Notes ?? "—"}</td>
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
                <span className="text-sm text-gray-600">Room:</span>
                <select value={selectedRoom?.RoomID ?? ""} onChange={e => { const r = rooms.find(x => x.RoomID === parseInt(e.target.value)); setSelectedRoom(r || null); }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option value="">Select room…</option>
                  {rooms.map(r => <option key={r.RoomID} value={r.RoomID}>{r.RoomName}</option>)}
                </select>
              </div>
              {selectedRoom && <button onClick={() => setShowAddReading(true)} className="bg-sky-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-sky-800">+ Add Reading</button>}
            </div>

            {selectedRoom && readings.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mb-5">
                <StatusIndicator value={readings[0]?.O2Pct} target={selectedRoom.TargetO2Pct} tol={0.5} unit="%" label="O₂" />
                <StatusIndicator value={readings[0]?.Co2Pct} target={selectedRoom.TargetCo2Pct} tol={0.5} unit="%" label="CO₂" />
                <StatusIndicator value={readings[0]?.TempC} target={selectedRoom.TargetTempC} tol={0.5} unit="°C" label="Temp" />
                <StatusIndicator value={readings[0]?.RhPct} target={selectedRoom.TargetRhPct} tol={3} unit="%" label="RH" />
              </div>
            )}

            {selectedRoom ? (
              <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-sky-50 text-sky-800 text-xs uppercase">
                    <tr>{["Time", "O₂ %", "CO₂ %", "Temp °C", "RH %", "Ethylene ppm", "Notes"].map(h => <th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50">
                    {readings.map(r => (
                      <tr key={r.ReadingID} className="hover:bg-sky-50">
                        <td className="px-3 py-2 text-xs text-gray-400">{r.ReadingTime ? new Date(r.ReadingTime).toLocaleString() : "—"}</td>
                        <td className="px-3 py-2">{r.O2Pct ?? "—"}</td>
                        <td className="px-3 py-2">{r.Co2Pct ?? "—"}</td>
                        <td className="px-3 py-2">{r.TempC ?? "—"}</td>
                        <td className="px-3 py-2">{r.RhPct ?? "—"}</td>
                        <td className="px-3 py-2">{r.EthylenePpm ?? "—"}</td>
                        <td className="px-3 py-2 text-gray-500">{r.Notes ?? ""}</td>
                      </tr>
                    ))}
                    {readings.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-400">No readings yet</td></tr>}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-center py-16 text-gray-400">Select a room to view readings</div>}
          </div>
        )}

        {/* Alerts */}
        {tab === "Alerts" && (
          <div className="space-y-3">
            {alerts.length === 0 && <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-sky-100">No active alerts — all rooms within target parameters</div>}
            {alerts.map(a => (
              <div key={a.AlertID} className="bg-white rounded-xl border border-sky-100 shadow-sm p-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1"><AlertBadge level={a.AlertLevel} /><span className="font-medium text-gray-900">{a.AlertType?.replace(/_/g, " ")}</span></div>
                  <div className="text-sm text-gray-600">{a.Message}</div>
                  <div className="text-xs text-gray-400 mt-1">{a.TriggeredAt ? new Date(a.TriggeredAt).toLocaleString() : ""}</div>
                </div>
                <button onClick={() => acknowledgeAlert(a.AlertID)} className="text-xs text-sky-700 border border-sky-300 px-3 py-1.5 rounded-lg hover:bg-sky-50 ml-4">Acknowledge</button>
              </div>
            ))}
          </div>
        )}

        {/* Lot Assignments */}
        {tab === "Lot Assignments" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Room:</span>
                <select value={selectedRoom?.RoomID ?? ""} onChange={e => { const r = rooms.find(x => x.RoomID === parseInt(e.target.value)); setSelectedRoom(r || null); }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option value="">Select room…</option>
                  {rooms.map(r => <option key={r.RoomID} value={r.RoomID}>{r.RoomName}</option>)}
                </select>
              </div>
              {selectedRoom && <button onClick={() => setShowAddLot(true)} className="bg-sky-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-sky-800">+ Assign Lot</button>}
            </div>
            {selectedRoom ? (
              <div className="space-y-3">
                {lots.map(l => (
                  <div key={l.CARoomLotID} className="bg-white rounded-xl border border-sky-100 shadow-sm p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{l.LotNumber}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{l.Variety ?? ""} · {l.NetWeightKg ? `${(l.NetWeightKg / 1000).toFixed(2)}t` : ""}</div>
                      </div>
                      <div className="text-xs text-right text-gray-400">
                        <div>In: {l.StoredAt ? new Date(l.StoredAt).toLocaleDateString() : "—"}</div>
                        <div>Out: {l.ExpectedOut ? new Date(l.ExpectedOut).toLocaleDateString() : "—"}</div>
                      </div>
                    </div>
                    {l.BinBarcodesJSON && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {JSON.parse(l.BinBarcodesJSON).map(b => (
                          <span key={b} className="text-xs font-mono bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">{b}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {lots.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-sky-100">No lots assigned to this room yet</div>}
              </div>
            ) : <div className="text-center py-16 text-gray-400">Select a room to view lot assignments</div>}
          </div>
        )}

        {/* Protocols */}
        {tab === "Protocols" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6 mb-5">
              <h2 className="text-lg font-semibold text-sky-900 mb-4">CA Storage Protocol Reference</h2>
              <div className="flex gap-3">
                <select value={protocolQuery} onChange={e => setProtocolQuery(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {PROTOCOL_COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={loadProtocol} className="bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-800">Look Up</button>
              </div>
            </div>
            {protocolResult && (
              <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6">
                <h3 className="font-semibold text-sky-900 capitalize text-lg mb-4">{protocolResult.commodity} — Recommended CA Parameters</h3>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {[
                    ["O₂ %", protocolResult.o2_pct, "%"],
                    ["CO₂ %", protocolResult.co2_pct, "%"],
                    ["Temperature", protocolResult.temp_c, "°C"],
                    ["Relative Humidity", protocolResult.rh_pct, "%"],
                    ["Expected Storage Life", protocolResult.expected_life_months, "months"],
                  ].map(([label, val, unit]) => (
                    <div key={label} className="bg-sky-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-sky-800">{val ?? "—"}<span className="text-sm font-normal ml-1 text-gray-500">{unit}</span></div>
                      <div className="text-xs text-gray-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                {protocolResult.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                    <strong>Notes:</strong> {protocolResult.notes}
                  </div>
                )}
              </div>
            )}
            {!protocolResult && (
              <div className="text-center py-8 text-gray-400">Select a commodity and click "Look Up"</div>
            )}
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-sky-900 mb-4">Add CA Room</h3>
            <div className="space-y-3">
              <Field label="Room Name *" value={roomForm.room_name} onChange={v => setRoomForm(f => ({ ...f, room_name: v }))} />
              <div>
                <label className="block text-xs text-gray-600 mb-1">Primary Commodity</label>
                <select value={roomForm.commodity} onChange={e => setRoomForm(f => ({ ...f, commodity: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {PROTOCOL_COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Capacity (tonnes)" value={roomForm.capacity_tonnes} onChange={v => setRoomForm(f => ({ ...f, capacity_tonnes: v }))} type="number" step="0.1" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Target O₂ %" value={roomForm.target_o2_pct} onChange={v => setRoomForm(f => ({ ...f, target_o2_pct: v }))} type="number" step="0.1" />
                <Field label="Target CO₂ %" value={roomForm.target_co2_pct} onChange={v => setRoomForm(f => ({ ...f, target_co2_pct: v }))} type="number" step="0.1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Target Temp (°C)" value={roomForm.target_temp_c} onChange={v => setRoomForm(f => ({ ...f, target_temp_c: v }))} type="number" step="0.1" />
                <Field label="Target RH %" value={roomForm.target_rh_pct} onChange={v => setRoomForm(f => ({ ...f, target_rh_pct: v }))} type="number" step="0.5" />
              </div>
              <Field label="Notes" value={roomForm.notes} onChange={v => setRoomForm(f => ({ ...f, notes: v }))} />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddRoom(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={createRoom} disabled={!roomForm.room_name} className="px-4 py-2 bg-sky-700 text-white text-sm rounded-lg hover:bg-sky-800 disabled:opacity-50">Create Room</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reading Modal */}
      {showAddReading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-sky-900 mb-4">Add Reading — {selectedRoom?.RoomName}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="O₂ %" value={readingForm.o2_pct} onChange={v => setReadingForm(f => ({ ...f, o2_pct: v }))} type="number" step="0.01" />
                <Field label="CO₂ %" value={readingForm.co2_pct} onChange={v => setReadingForm(f => ({ ...f, co2_pct: v }))} type="number" step="0.01" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Temp °C" value={readingForm.temp_c} onChange={v => setReadingForm(f => ({ ...f, temp_c: v }))} type="number" step="0.1" />
                <Field label="RH %" value={readingForm.rh_pct} onChange={v => setReadingForm(f => ({ ...f, rh_pct: v }))} type="number" step="0.5" />
                <Field label="Ethylene ppm" value={readingForm.ethylene_ppm} onChange={v => setReadingForm(f => ({ ...f, ethylene_ppm: v }))} type="number" step="0.1" />
              </div>
              <Field label="Notes" value={readingForm.notes} onChange={v => setReadingForm(f => ({ ...f, notes: v }))} />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddReading(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={addReading} className="px-4 py-2 bg-sky-700 text-white text-sm rounded-lg hover:bg-sky-800">Save Reading</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lot Modal */}
      {showAddLot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-sky-900 mb-4">Assign Lot — {selectedRoom?.RoomName}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Lot Number *" value={lotForm.lot_number} onChange={v => setLotForm(f => ({ ...f, lot_number: v }))} />
                <Field label="Variety" value={lotForm.variety} onChange={v => setLotForm(f => ({ ...f, variety: v }))} />
              </div>
              <Field label="Net Weight (kg)" value={lotForm.net_weight_kg} onChange={v => setLotForm(f => ({ ...f, net_weight_kg: v }))} type="number" step="0.001" />
              <Field label="Bin Barcodes (comma-separated)" value={lotForm.bin_barcodes} onChange={v => setLotForm(f => ({ ...f, bin_barcodes: v }))} placeholder="BIN-001, BIN-002, BIN-003" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stored At" value={lotForm.stored_at} onChange={v => setLotForm(f => ({ ...f, stored_at: v }))} type="datetime-local" />
                <Field label="Expected Out" value={lotForm.expected_out} onChange={v => setLotForm(f => ({ ...f, expected_out: v }))} type="datetime-local" />
              </div>
              <Field label="Notes" value={lotForm.notes} onChange={v => setLotForm(f => ({ ...f, notes: v }))} />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddLot(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={addLot} disabled={!lotForm.lot_number} className="px-4 py-2 bg-sky-700 text-white text-sm rounded-lg hover:bg-sky-800 disabled:opacity-50">Assign Lot</button>
            </div>
          </div>
        </div>
      )}

      <ThaiymeChat pageContext="ca_storage" />
      <SaigeWidget businessId={bid} pageContext="CA Cold Storage Management" />
    </div>
  );
}
