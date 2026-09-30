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

const TABS = ["Dashboard", "Bins", "Chain of Custody", "Lot View"];
const STAGES = ["filled", "weighed", "transported", "dumped", "washed", "waxed", "sized", "sorted", "packed", "ca_stored", "dispatched"];
const BIN_TYPES = ["standard", "macro", "lug", "half_bin", "pallet_bin", "field_crate"];

const STAGE_COLORS = {
  filled: "bg-green-100 text-green-700",
  weighed: "bg-blue-100 text-blue-700",
  transported: "bg-yellow-100 text-yellow-800",
  dumped: "bg-orange-100 text-orange-700",
  washed: "bg-cyan-100 text-cyan-700",
  waxed: "bg-purple-100 text-purple-700",
  sized: "bg-pink-100 text-pink-700",
  sorted: "bg-indigo-100 text-indigo-700",
  packed: "bg-emerald-100 text-emerald-700",
  ca_stored: "bg-sky-100 text-sky-700",
  dispatched: "bg-gray-100 text-gray-700",
};

function StageBadge({ stage }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STAGE_COLORS[stage] || "bg-gray-100 text-gray-600"}`}>{stage?.replace(/_/g, " ")}</span>;
}

export default function HarvestBins() {
  const [params] = useSearchParams();
  const bid = params.get("BusinessID");
  const [tab, setTab] = useState("Dashboard");
  const [bins, setBins] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [binDetail, setBinDetail] = useState(null);
  const [lotId, setLotId] = useState("");
  const [lotBins, setLotBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddBin, setShowAddBin] = useState(false);
  const [showAddStep, setShowAddStep] = useState(false);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showBulkRegister, setShowBulkRegister] = useState(false);
  const [scanBarcode, setScanBarcode] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterVariety, setFilterVariety] = useState("");

  const [binForm, setBinForm] = useState({ bin_barcode: "", bin_type: "standard", capacity_kg: "", tare_weight_kg: "", lot_id: "", variety: "", block_id: "", notes: "" });
  const [stepForm, setStepForm] = useState({ stage: "weighed", operator_name: "", weight_kg: "", temperature_c: "", location: "", notes: "" });
  const [pkgForm, setPkgForm] = useState({ package_type: "", label_code: "", net_weight_kg: "", grade: "", destination_market: "" });
  const [bulkText, setBulkText] = useState("");

  const loadDashboard = useCallback(async () => {
    const r = await apiFetch("/api/harvest-bins/dashboard");
    if (r.ok) setDashboard(await r.json());
  }, []);

  const loadBins = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStage) params.set("stage", filterStage);
    if (filterVariety) params.set("variety", filterVariety);
    const r = await apiFetch(`/api/harvest-bins/bins?${params}`);
    if (r.ok) setBins(await r.json());
    setLoading(false);
  }, [filterStage, filterVariety]);

  const loadBinDetail = useCallback(async (barcode) => {
    const r = await apiFetch(`/api/harvest-bins/bins/${encodeURIComponent(barcode)}`);
    if (r.ok) setBinDetail(await r.json());
  }, []);

  const loadLotBins = useCallback(async () => {
    if (!lotId) return;
    const r = await apiFetch(`/api/harvest-bins/lot/${lotId}/bins`);
    if (r.ok) setLotBins(await r.json());
  }, [lotId]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => { loadBins(); }, [loadBins]);

  async function createBin() {
    const body = {
      bin_barcode: binForm.bin_barcode, bin_type: binForm.bin_type,
      capacity_kg: binForm.capacity_kg ? parseFloat(binForm.capacity_kg) : null,
      tare_weight_kg: binForm.tare_weight_kg ? parseFloat(binForm.tare_weight_kg) : null,
      lot_id: binForm.lot_id ? parseInt(binForm.lot_id) : null,
      variety: binForm.variety || null, block_id: binForm.block_id || null, notes: binForm.notes || null,
    };
    const r = await apiFetch("/api/harvest-bins/bins", { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddBin(false); setBinForm({ bin_barcode: "", bin_type: "standard", capacity_kg: "", tare_weight_kg: "", lot_id: "", variety: "", block_id: "", notes: "" }); loadBins(); loadDashboard(); }
  }

  async function bulkRegister() {
    const lines = bulkText.trim().split("\n").filter(Boolean);
    const bins_in = lines.map(l => ({ bin_barcode: l.trim(), bin_type: "standard" }));
    const r = await apiFetch("/api/harvest-bins/bins/bulk-register", { method: "POST", body: JSON.stringify({ bins: bins_in }) });
    if (r.ok) { const data = await r.json(); alert(`Created: ${data.created}, Skipped duplicates: ${data.skipped_duplicates}`); setShowBulkRegister(false); setBulkText(""); loadBins(); loadDashboard(); }
  }

  async function recordStep() {
    if (!selectedBin) return;
    const body = {
      stage: stepForm.stage,
      operator_name: stepForm.operator_name || null,
      weight_kg: stepForm.weight_kg ? parseFloat(stepForm.weight_kg) : null,
      temperature_c: stepForm.temperature_c ? parseFloat(stepForm.temperature_c) : null,
      location: stepForm.location || null,
      notes: stepForm.notes || null,
    };
    const r = await apiFetch(`/api/harvest-bins/bins/${encodeURIComponent(selectedBin.BinBarcode)}/step`, { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddStep(false); setStepForm({ stage: "weighed", operator_name: "", weight_kg: "", temperature_c: "", location: "", notes: "" }); loadBinDetail(selectedBin.BinBarcode); loadBins(); loadDashboard(); }
  }

  async function recordPackage() {
    if (!selectedBin) return;
    const body = {
      package_type: pkgForm.package_type || null,
      label_code: pkgForm.label_code || null,
      net_weight_kg: pkgForm.net_weight_kg ? parseFloat(pkgForm.net_weight_kg) : null,
      grade: pkgForm.grade || null,
      destination_market: pkgForm.destination_market || null,
    };
    const r = await apiFetch(`/api/harvest-bins/bins/${encodeURIComponent(selectedBin.BinBarcode)}/package`, { method: "POST", body: JSON.stringify(body) });
    if (r.ok) { setShowAddPackage(false); setPkgForm({ package_type: "", label_code: "", net_weight_kg: "", grade: "", destination_market: "" }); loadBinDetail(selectedBin.BinBarcode); }
  }

  async function handleScan(e) {
    e.preventDefault();
    if (!scanBarcode.trim()) return;
    const r = await apiFetch(`/api/harvest-bins/bins/${encodeURIComponent(scanBarcode.trim())}`);
    if (r.ok) {
      const data = await r.json();
      setSelectedBin(data.bin);
      setBinDetail(data);
      setTab("Chain of Custody");
    } else alert("Bin not found: " + scanBarcode);
    setScanBarcode("");
  }

  function Field({ label, value, onChange, type = "text", step }) {
    return (
      <div>
        <label className="block text-xs text-gray-600 mb-1">{label}</label>
        <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-orange-900">Bin-Level Harvest Traceability</h1>
            <p className="text-sm text-orange-700 mt-0.5">Field → Packhouse chain of custody, 11-stage pipeline</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowBulkRegister(true)} className="bg-white border border-orange-300 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50">Bulk Register</button>
            <button onClick={() => setShowAddBin(true)} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700">+ Add Bin</button>
          </div>
        </div>

        {/* Barcode scanner bar */}
        <form onSubmit={handleScan} className="flex gap-2 mb-6">
          <input value={scanBarcode} onChange={e => setScanBarcode(e.target.value)} placeholder="Scan or type bin barcode…" className="flex-1 border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700">Lookup</button>
        </form>

        {/* Tabs */}
        <div className="flex gap-1 bg-orange-100 rounded-xl p-1 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === t ? "bg-white text-orange-800 shadow" : "text-orange-700 hover:bg-orange-50"}`}>{t}</button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "Dashboard" && dashboard && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-orange-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-orange-800">{dashboard.stats?.total_bins ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">Total Bins</div>
              </div>
              <div className="bg-white rounded-xl border border-orange-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-700">{dashboard.stats?.filled_today ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">Filled Today</div>
              </div>
              <div className="bg-white rounded-xl border border-orange-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-700">{dashboard.stats?.in_ca_storage ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">In CA Storage</div>
              </div>
              <div className="bg-white rounded-xl border border-orange-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-600">{dashboard.stats?.dispatched ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">Dispatched</div>
              </div>
            </div>

            {/* Pipeline kanban */}
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-4" style={{ minWidth: `${STAGES.length * 140}px` }}>
                {dashboard.by_stage?.map(s => (
                  <div key={s.CurrentStage} className="shrink-0 w-32 bg-white rounded-xl border border-orange-100 shadow-sm p-3 text-center">
                    <StageBadge stage={s.CurrentStage} />
                    <div className="text-2xl font-bold text-orange-800 mt-2">{s.BinCount}</div>
                    <div className="text-xs text-gray-500">bins</div>
                    {s.Lots > 0 && <div className="text-xs text-gray-400 mt-1">{s.Lots} lots</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bins */}
        {tab === "Bins" && (
          <div>
            <div className="flex gap-3 mb-4 flex-wrap">
              <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                <option value="">All stages</option>
                {STAGES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
              <input placeholder="Filter by variety…" value={filterVariety} onChange={e => setFilterVariety(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-orange-50 text-orange-800 text-xs uppercase">
                  <tr>{["Barcode", "Type", "Variety", "Block", "Stage", "Location", "Filled At", "Lot ID"].map(h => <th key={h} className="px-3 py-3 text-left whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {bins.map(b => (
                    <tr key={b.BinID} onClick={() => { setSelectedBin(b); loadBinDetail(b.BinBarcode); setTab("Chain of Custody"); }} className="hover:bg-orange-50 cursor-pointer">
                      <td className="px-3 py-2 font-mono font-medium text-orange-800">{b.BinBarcode}</td>
                      <td className="px-3 py-2 capitalize">{b.BinType?.replace(/_/g, " ")}</td>
                      <td className="px-3 py-2">{b.Variety ?? "—"}</td>
                      <td className="px-3 py-2">{b.BlockID ?? "—"}</td>
                      <td className="px-3 py-2"><StageBadge stage={b.CurrentStage} /></td>
                      <td className="px-3 py-2 text-gray-500">{b.CurrentLocation ?? "—"}</td>
                      <td className="px-3 py-2 text-xs text-gray-400">{b.FilledAt ? new Date(b.FilledAt).toLocaleString() : "—"}</td>
                      <td className="px-3 py-2">{b.LotID ?? "—"}</td>
                    </tr>
                  ))}
                  {bins.length === 0 && !loading && <tr><td colSpan={8} className="text-center py-10 text-gray-400">No bins registered</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chain of Custody */}
        {tab === "Chain of Custody" && (
          <div>
            {!selectedBin ? (
              <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-orange-100">Scan a barcode above or click a bin in the Bins tab</div>
            ) : (
              <div className="space-y-5">
                {/* Bin header */}
                <div className="bg-white rounded-xl border border-orange-200 p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-lg font-bold text-orange-800">{selectedBin.BinBarcode}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{selectedBin.BinType?.replace(/_/g, " ")} · {selectedBin.Variety ?? "—"} · Block {selectedBin.BlockID ?? "—"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StageBadge stage={binDetail?.bin?.CurrentStage || selectedBin.CurrentStage} />
                      <button onClick={() => setShowAddStep(true)} className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700">+ Step</button>
                      <button onClick={() => setShowAddPackage(true)} className="text-xs bg-white border border-orange-300 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-50">+ Package</button>
                    </div>
                  </div>
                </div>

                {/* Stage timeline */}
                {binDetail && (
                  <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-5">
                    <h3 className="font-semibold text-orange-900 mb-4">Chain of Custody</h3>
                    <div className="space-y-3">
                      {binDetail.steps?.map((step, i) => (
                        <div key={step.StepID} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-xs font-bold text-orange-700">{i + 1}</div>
                            {i < binDetail.steps.length - 1 && <div className="w-0.5 h-6 bg-orange-200 mt-1" />}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex items-center gap-2">
                              <StageBadge stage={step.Stage} />
                              <span className="text-xs text-gray-400">{step.StepTime ? new Date(step.StepTime).toLocaleString() : ""}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1 space-x-3">
                              {step.OperatorName && <span>👤 {step.OperatorName}</span>}
                              {step.WeightKg && <span>⚖ {step.WeightKg} kg</span>}
                              {step.TemperatureC && <span>🌡 {step.TemperatureC}°C</span>}
                              {step.Location && <span>📍 {step.Location}</span>}
                            </div>
                            {step.Notes && <div className="text-xs text-gray-400 mt-0.5 italic">{step.Notes}</div>}
                          </div>
                          {binDetail.stage_durations?.[i] && (
                            <div className="text-xs text-gray-400 whitespace-nowrap">→ {binDetail.stage_durations[i].hours}h</div>
                          )}
                        </div>
                      ))}
                      {binDetail.steps?.length === 0 && <div className="text-gray-400 text-sm">No steps recorded yet</div>}
                    </div>
                  </div>
                )}

                {/* Packages */}
                {binDetail?.packages?.length > 0 && (
                  <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-5">
                    <h3 className="font-semibold text-orange-900 mb-3">Packages ({binDetail.packages.length})</h3>
                    <div className="space-y-2">
                      {binDetail.packages.map(p => (
                        <div key={p.PackageID} className="flex items-center justify-between text-sm border border-orange-100 rounded-lg px-3 py-2">
                          <span className="font-mono text-orange-800">{p.LabelCode || `PKG-${p.PackageID}`}</span>
                          <span>{p.PackageType}</span>
                          <span>{p.NetWeightKg ? `${p.NetWeightKg} kg` : ""}</span>
                          <span className="text-gray-500">{p.Grade}</span>
                          <span className="text-gray-400">{p.DestinationMarket}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Lot View */}
        {tab === "Lot View" && (
          <div>
            <div className="flex gap-3 mb-5">
              <input placeholder="Enter Lot ID…" value={lotId} onChange={e => setLotId(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48" />
              <button onClick={loadLotBins} disabled={!lotId} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50">Load Lot</button>
            </div>
            {lotBins.length > 0 && (
              <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-orange-50 flex items-center justify-between">
                  <span className="font-semibold text-orange-900">Lot {lotId} — {lotBins.length} bins</span>
                </div>
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-orange-800">
                    <tr>{["Barcode", "Type", "Variety", "Block", "Stage", "Steps", "Last Stage"].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50">
                    {lotBins.map(b => (
                      <tr key={b.BinID} className="hover:bg-orange-50">
                        <td className="px-4 py-2 font-mono text-orange-800">{b.BinBarcode}</td>
                        <td className="px-4 py-2 capitalize">{b.BinType?.replace(/_/g, " ")}</td>
                        <td className="px-4 py-2">{b.Variety ?? "—"}</td>
                        <td className="px-4 py-2">{b.BlockID ?? "—"}</td>
                        <td className="px-4 py-2"><StageBadge stage={b.CurrentStage} /></td>
                        <td className="px-4 py-2">{b.StepCount ?? 0}</td>
                        <td className="px-4 py-2"><StageBadge stage={b.LastStage} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Bin Modal */}
      {showAddBin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">Register Bin</h3>
            <div className="space-y-3">
              <Field label="Bin Barcode *" value={binForm.bin_barcode} onChange={v => setBinForm(f => ({ ...f, bin_barcode: v }))} />
              <div>
                <label className="block text-xs text-gray-600 mb-1">Bin Type</label>
                <select value={binForm.bin_type} onChange={e => setBinForm(f => ({ ...f, bin_type: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {BIN_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Capacity (kg)" value={binForm.capacity_kg} onChange={v => setBinForm(f => ({ ...f, capacity_kg: v }))} type="number" step="0.001" />
                <Field label="Tare Weight (kg)" value={binForm.tare_weight_kg} onChange={v => setBinForm(f => ({ ...f, tare_weight_kg: v }))} type="number" step="0.001" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Variety" value={binForm.variety} onChange={v => setBinForm(f => ({ ...f, variety: v }))} />
                <Field label="Block ID" value={binForm.block_id} onChange={v => setBinForm(f => ({ ...f, block_id: v }))} />
              </div>
              <Field label="Lot ID" value={binForm.lot_id} onChange={v => setBinForm(f => ({ ...f, lot_id: v }))} type="number" />
              <Field label="Notes" value={binForm.notes} onChange={v => setBinForm(f => ({ ...f, notes: v }))} />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddBin(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={createBin} disabled={!binForm.bin_barcode} className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50">Register</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Register Modal */}
      {showBulkRegister && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Bulk Register Bins</h3>
            <p className="text-sm text-gray-500 mb-4">Paste barcodes, one per line. Duplicates will be skipped.</p>
            <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={10} placeholder={"BIN-001\nBIN-002\nBIN-003"} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowBulkRegister(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={bulkRegister} disabled={!bulkText.trim()} className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50">Register All</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Step Modal */}
      {showAddStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">Record Step — {selectedBin?.BinBarcode}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Stage *</label>
                <select value={stepForm.stage} onChange={e => setStepForm(f => ({ ...f, stage: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {STAGES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <Field label="Operator Name" value={stepForm.operator_name} onChange={v => setStepForm(f => ({ ...f, operator_name: v }))} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Weight (kg)" value={stepForm.weight_kg} onChange={v => setStepForm(f => ({ ...f, weight_kg: v }))} type="number" step="0.001" />
                <Field label="Temperature (°C)" value={stepForm.temperature_c} onChange={v => setStepForm(f => ({ ...f, temperature_c: v }))} type="number" step="0.1" />
              </div>
              <Field label="Location" value={stepForm.location} onChange={v => setStepForm(f => ({ ...f, location: v }))} />
              <Field label="Notes" value={stepForm.notes} onChange={v => setStepForm(f => ({ ...f, notes: v }))} />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddStep(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={recordStep} className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">Record Step</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {showAddPackage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">Record Package — {selectedBin?.BinBarcode}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Package Type" value={pkgForm.package_type} onChange={v => setPkgForm(f => ({ ...f, package_type: v }))} />
                <Field label="Label Code" value={pkgForm.label_code} onChange={v => setPkgForm(f => ({ ...f, label_code: v }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Net Weight (kg)" value={pkgForm.net_weight_kg} onChange={v => setPkgForm(f => ({ ...f, net_weight_kg: v }))} type="number" step="0.001" />
                <Field label="Grade" value={pkgForm.grade} onChange={v => setPkgForm(f => ({ ...f, grade: v }))} />
              </div>
              <Field label="Destination Market" value={pkgForm.destination_market} onChange={v => setPkgForm(f => ({ ...f, destination_market: v }))} />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAddPackage(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={recordPackage} className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">Save Package</button>
            </div>
          </div>
        </div>
      )}

      <SaigeWidget businessId={bid} pageContext="Bin-Level Harvest Traceability" />
    </div>
  );
}
