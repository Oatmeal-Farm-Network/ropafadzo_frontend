import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThaiymeChat from "./ThaiymeChat";

const API = import.meta.env.VITE_API_URL || "";

function api(path, opts = {}) {
  const token = localStorage.getItem("access_token");
  return fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  }).then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))));
}

const TABS = ["Lots", "Timeline", "Compliance", "Reports", "Alerts"];
const STAGES = ["field_harvested", "cooling_entry", "cooling_exit", "packhouse_entry", "packhouse_graded", "dispatch"];
const STAGE_LABELS = {
  field_harvested: "Field Harvest",
  cooling_entry: "Cooling Entry",
  cooling_exit: "Cooling Exit",
  packhouse_entry: "Packhouse In",
  packhouse_graded: "Packhouse Graded",
  dispatch: "Dispatch",
};
const STAGE_COLORS = {
  field_harvested: "bg-green-500",
  cooling_entry: "bg-blue-400",
  cooling_exit: "bg-blue-600",
  packhouse_entry: "bg-purple-400",
  packhouse_graded: "bg-purple-600",
  dispatch: "bg-gray-600",
};
const COMPLIANCE_TYPES = ["fertilizer", "pesticide", "water", "harvest", "other"];

export default function PerishableTrace() {
  const [tab, setTab] = useState("Lots");
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [lotTimeline, setLotTimeline] = useState(null);
  const [compliance, setCompliance] = useState([]);
  const [overdueList, setOverdueList] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [reportParams, setReportParams] = useState({ from_date: "", to_date: "", lot_id: "" });
  const navigate = useNavigate();

  const [checkpointForm, setCheckpointForm] = useState({
    lot_id: "", stage: "field_harvested", checkpoint_time: "",
    temperature_c: "", location: "", recorded_by: "", notes: "",
  });
  const [complianceForm, setComplianceForm] = useState({
    lot_id: "", record_type: "fertilizer", product_name: "",
    application_date: new Date().toISOString().split("T")[0],
    application_rate: "", withholding_days: "", operator_name: "", field_block: "", notes: "",
  });
  const [complianceFilters, setComplianceFilters] = useState({ from_date: "", to_date: "", record_type: "" });

  useEffect(() => {
    if (tab === "Lots") loadLots();
    else if (tab === "Compliance") loadCompliance();
    else if (tab === "Alerts") loadOverdue();
  }, [tab, complianceFilters]);

  function loadLots() {
    setLoading(true);
    // use harvest lots endpoint to get lot list
    api("/api/harvest-lots").then((data) => {
      setLots(Array.isArray(data) ? data : data.lots || []);
    }).catch(() => setLots([])).finally(() => setLoading(false));
  }

  function loadTimeline(lotId) {
    setLoading(true);
    api(`/api/trace/lot/${lotId}`).then((data) => {
      setLotTimeline(data);
      setSelectedLot(lotId);
      setTab("Timeline");
    }).finally(() => setLoading(false));
  }

  function loadCompliance() {
    setLoading(true);
    const p = new URLSearchParams();
    if (complianceFilters.from_date) p.set("from_date", complianceFilters.from_date);
    if (complianceFilters.to_date) p.set("to_date", complianceFilters.to_date);
    if (complianceFilters.record_type) p.set("record_type", complianceFilters.record_type);
    api(`/api/trace/compliance-records?${p}`).then(setCompliance).finally(() => setLoading(false));
  }

  function loadOverdue() {
    setLoading(true);
    api("/api/trace/overdue").then(setOverdueList).finally(() => setLoading(false));
  }

  function generateReport() {
    setLoading(true);
    const body = {};
    if (reportParams.lot_id) body.lot_id = parseInt(reportParams.lot_id);
    if (reportParams.from_date) body.from_date = reportParams.from_date;
    if (reportParams.to_date) body.to_date = reportParams.to_date;
    api("/api/trace/report", { method: "POST", body: JSON.stringify(body) })
      .then(setReport).finally(() => setLoading(false));
  }

  function submitCheckpoint(e) {
    e.preventDefault();
    const body = { ...checkpointForm, lot_id: parseInt(checkpointForm.lot_id), temperature_c: checkpointForm.temperature_c ? parseFloat(checkpointForm.temperature_c) : null, checkpoint_time: checkpointForm.checkpoint_time || undefined };
    api("/api/trace/checkpoint", { method: "POST", body: JSON.stringify(body) })
      .then(() => {
        setShowCheckpoint(false);
        if (selectedLot) loadTimeline(selectedLot);
      }).catch((e) => alert(e.detail || "Error"));
  }

  function submitCompliance(e) {
    e.preventDefault();
    const body = { ...complianceForm, lot_id: complianceForm.lot_id ? parseInt(complianceForm.lot_id) : null, withholding_days: complianceForm.withholding_days ? parseInt(complianceForm.withholding_days) : null };
    api("/api/trace/compliance-records", { method: "POST", body: JSON.stringify(body) })
      .then(() => { setShowCompliance(false); if (tab === "Compliance") loadCompliance(); })
      .catch((e) => alert(e.detail || "Error"));
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perishable Traceability</h1>
          <p className="text-sm text-gray-500 mt-1">Cooling tunnel → packhouse stage tracking, compliance records, and reports</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
            {t === "Alerts" && overdueList.length > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">{overdueList.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* LOTS */}
      {tab === "Lots" && (
        <div>
          <div className="flex justify-end gap-2 mb-3">
            <button onClick={() => setShowCheckpoint(true)} className="border px-4 py-2 rounded text-sm hover:bg-gray-50">+ Add Checkpoint</button>
          </div>
          {loading && <div className="text-center py-8 text-gray-400">Loading…</div>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>{["Lot ID", "Variety", "Block", "Harvest Date", "Weight (kg)", "Status", ""].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lots.length === 0 && <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-400">No harvest lots found. Create lots in the Harvest Lots module first.</td></tr>}
                {lots.map((l) => (
                  <tr key={l.LotID} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">#{l.LotID}</td>
                    <td className="px-3 py-2">{l.Variety || "—"}</td>
                    <td className="px-3 py-2">{l.FieldBlock || "—"}</td>
                    <td className="px-3 py-2">{l.HarvestDate?.split("T")[0] || "—"}</td>
                    <td className="px-3 py-2">{l.TotalWeightKg ? Number(l.TotalWeightKg).toFixed(1) : "—"}</td>
                    <td className="px-3 py-2"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{l.Status || "Active"}</span></td>
                    <td className="px-3 py-2">
                      <button onClick={() => loadTimeline(l.LotID)} className="text-green-600 hover:underline text-xs">View Timeline</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      {tab === "Timeline" && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setTab("Lots")} className="text-sm text-gray-500 hover:text-gray-700">← All Lots</button>
            {selectedLot && <span className="text-sm text-gray-600">Lot #{selectedLot}</span>}
            <button onClick={() => setShowCheckpoint(true)} className="ml-auto border px-3 py-1.5 rounded text-sm hover:bg-gray-50">+ Add Checkpoint</button>
          </div>
          {loading && <div className="text-center py-8 text-gray-400">Loading…</div>}
          {lotTimeline && (
            <div className="space-y-6">
              {lotTimeline.lot && (
                <div className="border rounded-lg p-4 bg-white">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><span className="text-gray-500">Variety:</span> <span className="font-medium">{lotTimeline.lot.Variety || "—"}</span></div>
                    <div><span className="text-gray-500">Block:</span> <span className="font-medium">{lotTimeline.lot.FieldBlock || "—"}</span></div>
                    <div><span className="text-gray-500">Weight:</span> <span className="font-medium">{lotTimeline.lot.TotalWeightKg ? Number(lotTimeline.lot.TotalWeightKg).toFixed(1) + " kg" : "—"}</span></div>
                  </div>
                </div>
              )}

              {/* Stage progress bar */}
              <div className="flex gap-1">
                {STAGES.map((stage) => {
                  const cp = lotTimeline.checkpoints.find((c) => c.Stage === stage);
                  return (
                    <div key={stage} className="flex-1 text-center">
                      <div className={`h-2 rounded mb-1 ${cp ? STAGE_COLORS[stage] : "bg-gray-200"}`} />
                      <div className="text-xs text-gray-500 leading-tight">{STAGE_LABELS[stage]}</div>
                      {cp && <div className="text-xs font-medium text-gray-700 mt-0.5">{new Date(cp.CheckpointTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>}
                    </div>
                  );
                })}
              </div>

              {/* Checkpoints */}
              <div>
                <h2 className="font-semibold text-gray-800 mb-2">Checkpoints</h2>
                <div className="space-y-2">
                  {lotTimeline.checkpoints.length === 0 && <div className="text-sm text-gray-400">No checkpoints yet</div>}
                  {lotTimeline.checkpoints.map((cp) => (
                    <div key={cp.CheckpointID} className="border rounded-lg p-3 bg-white flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${STAGE_COLORS[cp.Stage] || "bg-gray-400"}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{STAGE_LABELS[cp.Stage] || cp.Stage}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {new Date(cp.CheckpointTime).toLocaleString()}
                          {cp.TemperatureC !== null && cp.TemperatureC !== undefined && <span className="ml-2">· {cp.TemperatureC}°C</span>}
                          {cp.Location && <span className="ml-2">· {cp.Location}</span>}
                          {cp.RecordedBy && <span className="ml-2">· {cp.RecordedBy}</span>}
                        </div>
                        {cp.Notes && <div className="text-xs text-gray-400 mt-0.5">{cp.Notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage gaps */}
              {lotTimeline.stage_gaps.length > 0 && (
                <div>
                  <h2 className="font-semibold text-gray-800 mb-2">Stage Durations</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {lotTimeline.stage_gaps.map((g, i) => (
                      <div key={i} className={`border rounded p-2 text-sm ${g.hours > 4 && g.from_stage.includes("cooling") ? "border-red-300 bg-red-50" : "bg-white"}`}>
                        <div className="text-xs text-gray-500">{STAGE_LABELS[g.from_stage]} → {STAGE_LABELS[g.to_stage]}</div>
                        <div className={`font-semibold ${g.hours > 4 ? "text-red-600" : "text-gray-800"}`}>{g.hours}h</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing stages */}
              {lotTimeline.missing_stages.length > 0 && (
                <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                  <div className="text-sm font-medium text-orange-700 mb-1">Missing Stages</div>
                  <div className="flex flex-wrap gap-2">
                    {lotTimeline.missing_stages.map((s) => (
                      <span key={s} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{STAGE_LABELS[s] || s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* COMPLIANCE */}
      {tab === "Compliance" && (
        <div>
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <select className="border rounded px-2 py-1 text-sm" value={complianceFilters.record_type} onChange={(e) => setComplianceFilters({ ...complianceFilters, record_type: e.target.value })}>
              <option value="">All Types</option>
              {COMPLIANCE_TYPES.map((t) => <option key={t} className="capitalize">{t}</option>)}
            </select>
            <input type="date" className="border rounded px-2 py-1 text-sm" value={complianceFilters.from_date} onChange={(e) => setComplianceFilters({ ...complianceFilters, from_date: e.target.value })} />
            <span className="text-gray-400 text-sm">to</span>
            <input type="date" className="border rounded px-2 py-1 text-sm" value={complianceFilters.to_date} onChange={(e) => setComplianceFilters({ ...complianceFilters, to_date: e.target.value })} />
            <button onClick={() => setShowCompliance(true)} className="ml-auto bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">+ Add Record</button>
          </div>
          {loading && <div className="text-center py-8 text-gray-400">Loading…</div>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>{["Type", "Product", "Applied", "Lot", "Block", "Rate", "Withholding", "Operator"].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {compliance.length === 0 && <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-400">No compliance records</td></tr>}
                {compliance.map((r) => (
                  <tr key={r.RecordID} className="hover:bg-gray-50">
                    <td className="px-3 py-2 capitalize"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{r.RecordType}</span></td>
                    <td className="px-3 py-2 font-medium">{r.ProductName || "—"}</td>
                    <td className="px-3 py-2">{r.ApplicationDate?.split("T")[0] || r.ApplicationDate}</td>
                    <td className="px-3 py-2">{r.LotID ? `#${r.LotID}` : "—"}</td>
                    <td className="px-3 py-2">{r.FieldBlock || "—"}</td>
                    <td className="px-3 py-2">{r.ApplicationRate || "—"}</td>
                    <td className="px-3 py-2">{r.WithholdingDays != null ? `${r.WithholdingDays} days` : "—"}</td>
                    <td className="px-3 py-2">{r.OperatorName || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTS */}
      {tab === "Reports" && (
        <div>
          <div className="border rounded-lg p-4 bg-white mb-5">
            <h2 className="font-semibold text-gray-800 mb-3">Generate Compliance Report</h2>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Lot ID (optional)</label>
                <input type="number" className="border rounded px-2 py-1.5 text-sm w-28" value={reportParams.lot_id} onChange={(e) => setReportParams({ ...reportParams, lot_id: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                <input type="date" className="border rounded px-2 py-1.5 text-sm" value={reportParams.from_date} onChange={(e) => setReportParams({ ...reportParams, from_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                <input type="date" className="border rounded px-2 py-1.5 text-sm" value={reportParams.to_date} onChange={(e) => setReportParams({ ...reportParams, to_date: e.target.value })} />
              </div>
              <button onClick={generateReport} disabled={loading} className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50">
                {loading ? "Generating…" : "Generate"}
              </button>
            </div>
          </div>

          {report && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="border rounded-lg p-4 text-center"><div className="text-2xl font-bold">{report.total_lots}</div><div className="text-xs text-gray-500 mt-1">Total Lots</div></div>
                <div className="border rounded-lg p-4 text-center bg-green-50 border-green-200"><div className="text-2xl font-bold text-green-700">{report.compliant_lots}</div><div className="text-xs text-gray-500 mt-1">Compliant</div></div>
                <div className={`border rounded-lg p-4 text-center ${report.non_compliant_lots > 0 ? "bg-red-50 border-red-200" : ""}`}><div className={`text-2xl font-bold ${report.non_compliant_lots > 0 ? "text-red-600" : ""}`}>{report.non_compliant_lots}</div><div className="text-xs text-gray-500 mt-1">Non-Compliant</div></div>
              </div>

              {report.lots.map((lot) => (
                <div key={lot.lot_id} className={`border rounded-lg p-4 mb-3 ${!lot.compliant ? "border-red-300 bg-red-50" : "bg-white"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Lot #{lot.lot_id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${lot.compliant ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {lot.compliant ? "Compliant" : "Issues Found"}
                    </span>
                  </div>
                  {lot.withholding_issues.length > 0 && (
                    <div className="text-sm text-red-700 mb-2">
                      <strong>Withholding issues:</strong>
                      {lot.withholding_issues.map((w, i) => (
                        <div key={i} className="text-xs mt-0.5">· {w.product}: required {w.required_days} days, only {w.actual_days} days elapsed</div>
                      ))}
                    </div>
                  )}
                  {lot.missing_stages.length > 0 && (
                    <div className="text-sm text-orange-600 text-xs">
                      Missing stages: {lot.missing_stages.map((s) => STAGE_LABELS[s] || s).join(", ")}
                    </div>
                  )}
                  <div className="mt-2 flex gap-2 text-xs text-gray-500">
                    <span>{lot.checkpoints.length} checkpoints</span>
                    <span>·</span>
                    <span>{lot.compliance_records.length} compliance records</span>
                  </div>
                </div>
              ))}
              <div className="text-xs text-gray-400 mt-2">Generated at {new Date(report.generated_at).toLocaleString()}</div>
            </div>
          )}
        </div>
      )}

      {/* ALERTS */}
      {tab === "Alerts" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Overdue Lots</h2>
            <button onClick={loadOverdue} className="text-sm text-green-600 hover:underline">Refresh</button>
          </div>
          {loading && <div className="text-center py-8 text-gray-400">Loading…</div>}
          {overdueList.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">✅</div>
              <div>No overdue lots</div>
            </div>
          )}
          <div className="space-y-2">
            {overdueList.map((r) => (
              <div key={`${r.LotID}-${r.Stage}`} className="border border-orange-300 rounded-lg p-3 bg-orange-50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Lot #{r.LotID}</span>
                  <span className="text-xs text-orange-700 font-medium">{r.hours_stuck}h stuck</span>
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Stage: <strong>{STAGE_LABELS[r.Stage] || r.Stage}</strong>
                  {r.TemperatureC !== null && <span className="ml-2">· {r.TemperatureC}°C</span>}
                  {r.Location && <span className="ml-2">· {r.Location}</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Since {new Date(r.CheckpointTime).toLocaleString()}</div>
                <button onClick={() => loadTimeline(r.LotID)} className="mt-2 text-xs text-green-600 hover:underline">View Timeline →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkpoint Modal */}
      {showCheckpoint && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Record Checkpoint</h2>
            <form onSubmit={submitCheckpoint} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Lot ID *</label>
                  <input required type="number" className="w-full border rounded px-2 py-1.5 text-sm" value={checkpointForm.lot_id} onChange={(e) => setCheckpointForm({ ...checkpointForm, lot_id: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stage *</label>
                  <select required className="w-full border rounded px-2 py-1.5 text-sm" value={checkpointForm.stage} onChange={(e) => setCheckpointForm({ ...checkpointForm, stage: e.target.value })}>
                    {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Time (blank = now)</label>
                  <input type="datetime-local" className="w-full border rounded px-2 py-1.5 text-sm" value={checkpointForm.checkpoint_time} onChange={(e) => setCheckpointForm({ ...checkpointForm, checkpoint_time: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Temperature (°C)</label>
                  <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5 text-sm" value={checkpointForm.temperature_c} onChange={(e) => setCheckpointForm({ ...checkpointForm, temperature_c: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" value={checkpointForm.location} onChange={(e) => setCheckpointForm({ ...checkpointForm, location: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Recorded By</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" value={checkpointForm.recorded_by} onChange={(e) => setCheckpointForm({ ...checkpointForm, recorded_by: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea rows={2} className="w-full border rounded px-2 py-1.5 text-sm" value={checkpointForm.notes} onChange={(e) => setCheckpointForm({ ...checkpointForm, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCheckpoint(false)} className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Record Checkpoint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compliance Modal */}
      {showCompliance && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Add Compliance Record</h2>
            <form onSubmit={submitCompliance} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Record Type *</label>
                  <select required className="w-full border rounded px-2 py-1.5 text-sm" value={complianceForm.record_type} onChange={(e) => setComplianceForm({ ...complianceForm, record_type: e.target.value })}>
                    {COMPLIANCE_TYPES.map((t) => <option key={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Lot ID (optional)</label>
                  <input type="number" className="w-full border rounded px-2 py-1.5 text-sm" value={complianceForm.lot_id} onChange={(e) => setComplianceForm({ ...complianceForm, lot_id: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" value={complianceForm.product_name} onChange={(e) => setComplianceForm({ ...complianceForm, product_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Application Date *</label>
                  <input required type="date" className="w-full border rounded px-2 py-1.5 text-sm" value={complianceForm.application_date} onChange={(e) => setComplianceForm({ ...complianceForm, application_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Application Rate</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. 2L/ha" value={complianceForm.application_rate} onChange={(e) => setComplianceForm({ ...complianceForm, application_rate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Withholding Days</label>
                  <input type="number" className="w-full border rounded px-2 py-1.5 text-sm" value={complianceForm.withholding_days} onChange={(e) => setComplianceForm({ ...complianceForm, withholding_days: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Operator Name</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" value={complianceForm.operator_name} onChange={(e) => setComplianceForm({ ...complianceForm, operator_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Field Block</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" value={complianceForm.field_block} onChange={(e) => setComplianceForm({ ...complianceForm, field_block: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea rows={2} className="w-full border rounded px-2 py-1.5 text-sm" value={complianceForm.notes} onChange={(e) => setComplianceForm({ ...complianceForm, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCompliance(false)} className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ThaiymeChat pageContext="perishable_traceability" />
    </div>
  );
}
