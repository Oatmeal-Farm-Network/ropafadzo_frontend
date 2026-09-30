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

const TABS = ["Sessions", "Analytics", "Piece Rates", "Payroll"];
const GRADE_COLORS = { A: "bg-green-100 text-green-800", B: "bg-yellow-100 text-yellow-800", C: "bg-red-100 text-red-800" };

export default function PickerPerformance() {
  const [tab, setTab] = useState("Sessions");
  const [sessions, setSessions] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [pieceRates, setPieceRates] = useState([]);
  const [payroll, setPayroll] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showNewRate, setShowNewRate] = useState(false);
  const [filters, setFilters] = useState({ employee_id: "", variety: "", from_date: "", to_date: "" });
  const navigate = useNavigate();

  const [sessionForm, setSessionForm] = useState({
    employee_id: "", picking_date: new Date().toISOString().split("T")[0],
    block_id: "", variety: "", total_weight_kg: "", avg_quality_score: "",
    piece_rate_per_kg: "", cycle_number: 1, notes: "",
  });
  const [rateForm, setRateForm] = useState({
    variety: "", quality_grade: "A", price_per_kg: "",
    effective_date: new Date().toISOString().split("T")[0], is_active: true,
  });

  useEffect(() => {
    api("/api/hr/employees").then(setEmployees).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === "Sessions") loadSessions();
    else if (tab === "Analytics") loadAnalytics();
    else if (tab === "Piece Rates") loadRates();
    else if (tab === "Payroll") loadPayroll();
  }, [tab, filters]);

  function loadSessions() {
    setLoading(true);
    const p = new URLSearchParams();
    if (filters.employee_id) p.set("employee_id", filters.employee_id);
    if (filters.variety) p.set("variety", filters.variety);
    if (filters.from_date) p.set("picking_date", filters.from_date);
    api(`/api/picker/sessions?${p}`).then(setSessions).finally(() => setLoading(false));
  }

  function loadAnalytics() {
    setLoading(true);
    const p = new URLSearchParams();
    if (filters.from_date) p.set("from_date", filters.from_date);
    if (filters.to_date) p.set("to_date", filters.to_date);
    if (filters.variety) p.set("variety", filters.variety);
    Promise.all([
      api(`/api/picker/performance?${p}`),
      api(`/api/picker/leaderboard?${filters.from_date ? `picking_date=${filters.from_date}` : ""}`),
    ]).then(([perf, lb]) => { setPerformance(perf); setLeaderboard(lb); }).finally(() => setLoading(false));
  }

  function loadRates() {
    setLoading(true);
    api("/api/picker/piece-rates").then(setPieceRates).finally(() => setLoading(false));
  }

  function loadPayroll() {
    setLoading(true);
    const p = new URLSearchParams();
    if (filters.from_date) p.set("from_date", filters.from_date);
    if (filters.to_date) p.set("to_date", filters.to_date);
    api(`/api/picker/payroll-summary?${p}`).then(setPayroll).finally(() => setLoading(false));
  }

  function submitSession(e) {
    e.preventDefault();
    const body = { ...sessionForm, employee_id: parseInt(sessionForm.employee_id), total_weight_kg: parseFloat(sessionForm.total_weight_kg) || 0, cycle_number: parseInt(sessionForm.cycle_number) || 1 };
    api("/api/picker/sessions", { method: "POST", body: JSON.stringify(body) })
      .then(() => { setShowNewSession(false); loadSessions(); })
      .catch((err) => alert(err.detail || "Error creating session"));
  }

  function submitRate(e) {
    e.preventDefault();
    const body = { ...rateForm, price_per_kg: parseFloat(rateForm.price_per_kg) };
    api("/api/picker/piece-rates", { method: "PUT", body: JSON.stringify(body) })
      .then(() => { setShowNewRate(false); loadRates(); })
      .catch((err) => alert(err.detail || "Error saving rate"));
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Picker Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Track picking sessions, piece-rate wages, and drop-off scans</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="border rounded px-2 py-1 text-sm" value={filters.employee_id} onChange={(e) => setFilters({ ...filters, employee_id: e.target.value })}>
          <option value="">All Pickers</option>
          {employees.map((emp) => <option key={emp.EmployeeID} value={emp.EmployeeID}>{emp.FirstName} {emp.LastName}</option>)}
        </select>
        <input className="border rounded px-2 py-1 text-sm" placeholder="Variety" value={filters.variety} onChange={(e) => setFilters({ ...filters, variety: e.target.value })} />
        <input type="date" className="border rounded px-2 py-1 text-sm" value={filters.from_date} onChange={(e) => setFilters({ ...filters, from_date: e.target.value })} />
        <span className="text-gray-400 self-center text-sm">to</span>
        <input type="date" className="border rounded px-2 py-1 text-sm" value={filters.to_date} onChange={(e) => setFilters({ ...filters, to_date: e.target.value })} />
        <button onClick={() => setFilters({ employee_id: "", variety: "", from_date: "", to_date: "" })} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
      </div>

      {/* SESSIONS TAB */}
      {tab === "Sessions" && (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={() => setShowNewSession(true)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">+ New Session</button>
          </div>
          {loading ? <div className="text-center py-8 text-gray-400">Loading…</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    {["Picker", "Date", "Block", "Variety", "Kg", "Quality", "Rate/kg", "Wage", "Cycle"].map((h) => (
                      <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessions.length === 0 && <tr><td colSpan={9} className="px-3 py-6 text-center text-gray-400">No sessions found</td></tr>}
                  {sessions.map((s) => (
                    <tr key={s.SessionID} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{s.EmployeeName}</td>
                      <td className="px-3 py-2">{s.PickingDate?.split("T")[0] || s.PickingDate}</td>
                      <td className="px-3 py-2">{s.BlockID || "—"}</td>
                      <td className="px-3 py-2">{s.Variety || "—"}</td>
                      <td className="px-3 py-2 font-medium">{Number(s.TotalWeightKg).toFixed(1)}</td>
                      <td className="px-3 py-2">{s.AvgQualityScore ? Number(s.AvgQualityScore).toFixed(1) : "—"}</td>
                      <td className="px-3 py-2">{s.PieceRatePerKg ? `$${Number(s.PieceRatePerKg).toFixed(4)}` : "—"}</td>
                      <td className="px-3 py-2 font-medium text-green-700">{s.WageEarned ? `$${Number(s.WageEarned).toFixed(2)}` : "—"}</td>
                      <td className="px-3 py-2">{s.CycleNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {tab === "Analytics" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Today's Leaderboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {leaderboard.map((p) => (
                <div key={p.EmployeeID} className="border rounded-lg p-3 bg-white shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${p.rank === 1 ? "text-yellow-500" : p.rank === 2 ? "text-gray-400" : p.rank === 3 ? "text-orange-400" : "text-gray-600"}`}>
                      #{p.rank}
                    </span>
                    <span className="font-medium">{p.EmployeeName}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1 text-xs text-gray-500">
                    <div><span className="block font-semibold text-gray-900 text-sm">{Number(p.TotalKg).toFixed(1)} kg</span>Total</div>
                    <div><span className="block font-semibold text-gray-900 text-sm">{p.AvgQuality ? Number(p.AvgQuality).toFixed(1) : "—"}</span>Quality</div>
                    <div><span className="block font-semibold text-green-700 text-sm">${p.TotalWage ? Number(p.TotalWage).toFixed(2) : "0.00"}</span>Wage</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Performance Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>{["Picker", "Variety", "Sessions", "Total Kg", "Avg/Session", "Avg Quality", "Total Wage", "Last Picked"].map((h) => (
                    <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {performance.length === 0 && <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-400">No data</td></tr>}
                  {performance.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{p.EmployeeName}</td>
                      <td className="px-3 py-2">{p.Variety || "—"}</td>
                      <td className="px-3 py-2">{p.Sessions}</td>
                      <td className="px-3 py-2 font-medium">{Number(p.TotalKg).toFixed(1)}</td>
                      <td className="px-3 py-2">{Number(p.AvgKgPerSession).toFixed(1)}</td>
                      <td className="px-3 py-2">{p.AvgQuality ? Number(p.AvgQuality).toFixed(1) : "—"}</td>
                      <td className="px-3 py-2 text-green-700">${p.TotalWage ? Number(p.TotalWage).toFixed(2) : "0.00"}</td>
                      <td className="px-3 py-2">{p.LastPickDate?.split("T")[0] || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PIECE RATES TAB */}
      {tab === "Piece Rates" && (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={() => setShowNewRate(true)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">+ Set Rate</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>{["Variety", "Grade", "Rate/kg", "Effective Date", "Active"].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pieceRates.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">No rates configured</td></tr>}
                {pieceRates.map((r) => (
                  <tr key={r.RateID} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{r.Variety}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${GRADE_COLORS[r.QualityGrade] || "bg-gray-100"}`}>{r.QualityGrade}</span></td>
                    <td className="px-3 py-2">${Number(r.PricePerKg).toFixed(4)}/kg</td>
                    <td className="px-3 py-2">{r.EffectiveDate?.split("T")[0] || r.EffectiveDate}</td>
                    <td className="px-3 py-2">{r.IsActive ? <span className="text-green-600">Active</span> : <span className="text-gray-400">Inactive</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYROLL TAB */}
      {tab === "Payroll" && payroll && (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-green-600 font-medium">Total Payroll</div>
            <div className="text-3xl font-bold text-green-700">${Number(payroll.total_payroll).toFixed(2)}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>{["Picker", "Sessions", "Total Kg", "Gross Wage", "Period"].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payroll.summary.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">No data</td></tr>}
                {payroll.summary.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{r.EmployeeName}</td>
                    <td className="px-3 py-2">{r.Sessions}</td>
                    <td className="px-3 py-2">{Number(r.TotalKg).toFixed(1)}</td>
                    <td className="px-3 py-2 font-medium text-green-700">${Number(r.TotalWage || 0).toFixed(2)}</td>
                    <td className="px-3 py-2 text-gray-500">{r.PeriodStart?.split("T")[0]} – {r.PeriodEnd?.split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "Payroll" && !payroll && !loading && (
        <div className="text-center py-8 text-gray-400">Loading payroll data…</div>
      )}

      {/* New Session Modal */}
      {showNewSession && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">New Picking Session</h2>
            <form onSubmit={submitSession} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Picker *</label>
                  <select required className="w-full border rounded px-2 py-1.5 text-sm" value={sessionForm.employee_id} onChange={(e) => setSessionForm({ ...sessionForm, employee_id: e.target.value })}>
                    <option value="">Select picker…</option>
                    {employees.map((emp) => <option key={emp.EmployeeID} value={emp.EmployeeID}>{emp.FirstName} {emp.LastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                  <input required type="date" className="w-full border rounded px-2 py-1.5 text-sm" value={sessionForm.picking_date} onChange={(e) => setSessionForm({ ...sessionForm, picking_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Block ID</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. B-3" value={sessionForm.block_id} onChange={(e) => setSessionForm({ ...sessionForm, block_id: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Variety</label>
                  <input className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. Albion" value={sessionForm.variety} onChange={(e) => setSessionForm({ ...sessionForm, variety: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Total Weight (kg)</label>
                  <input type="number" step="0.001" className="w-full border rounded px-2 py-1.5 text-sm" value={sessionForm.total_weight_kg} onChange={(e) => setSessionForm({ ...sessionForm, total_weight_kg: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Avg Quality Score</label>
                  <input type="number" step="0.01" min="0" max="10" className="w-full border rounded px-2 py-1.5 text-sm" value={sessionForm.avg_quality_score} onChange={(e) => setSessionForm({ ...sessionForm, avg_quality_score: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Piece Rate ($/kg)</label>
                  <input type="number" step="0.0001" className="w-full border rounded px-2 py-1.5 text-sm" placeholder="Leave blank to auto-fill" value={sessionForm.piece_rate_per_kg} onChange={(e) => setSessionForm({ ...sessionForm, piece_rate_per_kg: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Cycle #</label>
                  <input type="number" min="1" className="w-full border rounded px-2 py-1.5 text-sm" value={sessionForm.cycle_number} onChange={(e) => setSessionForm({ ...sessionForm, cycle_number: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea rows={2} className="w-full border rounded px-2 py-1.5 text-sm" value={sessionForm.notes} onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewSession(false)} className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Save Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Rate Modal */}
      {showNewRate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Set Piece Rate</h2>
            <form onSubmit={submitRate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Variety *</label>
                  <input required className="w-full border rounded px-2 py-1.5 text-sm" value={rateForm.variety} onChange={(e) => setRateForm({ ...rateForm, variety: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Grade *</label>
                  <select required className="w-full border rounded px-2 py-1.5 text-sm" value={rateForm.quality_grade} onChange={(e) => setRateForm({ ...rateForm, quality_grade: e.target.value })}>
                    {["A", "B", "C"].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rate ($/kg) *</label>
                  <input required type="number" step="0.0001" className="w-full border rounded px-2 py-1.5 text-sm" value={rateForm.price_per_kg} onChange={(e) => setRateForm({ ...rateForm, price_per_kg: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Effective Date *</label>
                  <input required type="date" className="w-full border rounded px-2 py-1.5 text-sm" value={rateForm.effective_date} onChange={(e) => setRateForm({ ...rateForm, effective_date: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewRate(false)} className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Save Rate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ThaiymeChat pageContext="picker_performance" />
    </div>
  );
}
