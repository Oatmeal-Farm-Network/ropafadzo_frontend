import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SaigeWidget from "./SaigeWidget";

const API = import.meta.env.VITE_API_URL || "";
const tok = () => localStorage.getItem("access_token");
const api = (path, opts = {}) => fetch(`${API}${path}`, { ...opts, headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}`, ...(opts.headers || {}) } }).then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)));

const TABS = ["Dashboard", "Accumulation", "Forecast", "Cultivars", "Season History"];
const MODELS = ["simple", "utah"];
const MODEL_DESC = { simple: "Simple: hours 32–45°F", utah: "Utah: weighted units with heat negation" };
const CONFIDENCE_COLORS = { high: "bg-green-100 text-green-800", medium: "bg-yellow-100 text-yellow-800", low: "bg-orange-100 text-orange-800", insufficient_data: "bg-gray-100 text-gray-500" };

export default function ChillingHours() {
  const [params] = useSearchParams();
  const bid = params.get("BusinessID");
  const [tab, setTab] = useState("Dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [accumulation, setAccumulation] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [cultivars, setCultivars] = useState([]);
  const [seasonHistory, setSeasonHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewCultivar, setShowNewCultivar] = useState(false);
  const [showIngest, setShowIngest] = useState(false);
  const [model, setModel] = useState("simple");
  const [season, setSeason] = useState(new Date().getFullYear().toString());
  const [fieldId, setFieldId] = useState("");
  const navigate = useNavigate();

  const [showWeatherImport, setShowWeatherImport] = useState(false);
  const [weatherForm, setWeatherForm] = useState({ lat: "", lon: "", days: 14, model: "simple" });
  const [weatherImporting, setWeatherImporting] = useState(false);

  const [cultivarForm, setCultivarForm] = useState({ crop_type: "", cultivar_name: "", required_chill_hours: "", base_chill_temp_f: 32, max_chill_temp_f: 45, bloom_gdd_after_dormancy: "", model: "simple", notes: "" });
  const [ingestForm, setIngestForm] = useState({ reading_date: new Date().toISOString().split("T")[0], min_temp_f: "", max_temp_f: "", model: "simple" });

  useEffect(() => {
    if (tab === "Dashboard") loadDashboard();
    else if (tab === "Accumulation") loadAccumulation();
    else if (tab === "Forecast") loadForecast();
    else if (tab === "Cultivars") loadCultivars();
    else if (tab === "Season History") loadHistory();
  }, [tab, season, model, fieldId]);

  const loadDashboard = () => { setLoading(true); api(`/api/chill/dashboard?season=${season}`).then(setDashboard).finally(() => setLoading(false)); };
  const loadAccumulation = () => { setLoading(true); const p = new URLSearchParams({ season, model }); if (fieldId) p.set("field_id", fieldId); api(`/api/chill/accumulation?${p}`).then(setAccumulation).finally(() => setLoading(false)); };
  const loadForecast = () => { setLoading(true); const p = new URLSearchParams(); if (fieldId) p.set("field_id", fieldId); p.set("season", season); api(`/api/chill/forecast?${p}`).then(d => setForecasts(d.forecasts || [])).finally(() => setLoading(false)); };
  const loadCultivars = () => { setLoading(true); api("/api/chill/cultivars").then(setCultivars).finally(() => setLoading(false)); };
  const loadHistory = () => { setLoading(true); const p = fieldId ? `?field_id=${fieldId}` : ""; api(`/api/chill/season-comparison${p}`).then(setSeasonHistory).finally(() => setLoading(false)); };

  const submitCultivar = e => {
    e.preventDefault();
    const body = { ...cultivarForm, required_chill_hours: parseFloat(cultivarForm.required_chill_hours), base_chill_temp_f: parseFloat(cultivarForm.base_chill_temp_f), max_chill_temp_f: parseFloat(cultivarForm.max_chill_temp_f), bloom_gdd_after_dormancy: cultivarForm.bloom_gdd_after_dormancy ? parseFloat(cultivarForm.bloom_gdd_after_dormancy) : null };
    api("/api/chill/cultivars", { method: "POST", body: JSON.stringify(body) }).then(() => { setShowNewCultivar(false); loadCultivars(); }).catch(e => alert(e.detail || "Error"));
  };

  const submitIngest = e => {
    e.preventDefault();
    const body = { readings: [{ ...ingestForm, min_temp_f: parseFloat(ingestForm.min_temp_f), max_temp_f: parseFloat(ingestForm.max_temp_f), field_id: fieldId || null, season }] };
    api("/api/chill/readings", { method: "POST", body: JSON.stringify(body) }).then(() => { setShowIngest(false); if (tab === "Accumulation") loadAccumulation(); else loadDashboard(); }).catch(e => alert(e.detail || "Error"));
  };

  const submitWeatherImport = e => {
    e.preventDefault();
    const p = new URLSearchParams({ lat: weatherForm.lat, lon: weatherForm.lon, days: weatherForm.days, model: weatherForm.model });
    if (fieldId) p.set("field_id", fieldId);
    if (season) p.set("season", season);
    setWeatherImporting(true);
    api(`/api/chill/import-from-weather?${p}`, { method: "POST" })
      .then(r => { setShowWeatherImport(false); alert(`Imported ${r.imported} days of chill data from weather history.`); if (tab === "Accumulation") loadAccumulation(); else loadDashboard(); })
      .catch(e => alert(e.detail || "Import failed"))
      .finally(() => setWeatherImporting(false));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chilling Hours & Bloom Forecast</h1>
          <p className="text-sm text-gray-500 mt-1">Track dormancy chill units and predict bloom dates for stone fruit, pome fruit, and nuts</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select className="border rounded px-2 py-1.5 text-sm" value={season} onChange={e => setSeason(e.target.value)}>
          {[0, 1, 2, 3].map(i => { const y = new Date().getFullYear() - i; return <option key={y}>{y}</option>; })}
        </select>
        <select className="border rounded px-2 py-1.5 text-sm" value={model} onChange={e => setModel(e.target.value)}>
          {MODELS.map(m => <option key={m} value={m}>{MODEL_DESC[m]}</option>)}
        </select>
        <input className="border rounded px-2 py-1.5 text-sm" placeholder="Field ID (optional)" value={fieldId} onChange={e => setFieldId(e.target.value)} />
        <button onClick={() => setShowWeatherImport(true)} className="ml-auto bg-sky-600 text-white px-3 py-1.5 rounded text-sm hover:bg-sky-700">⛅ Fetch from Weather</button>
        <button onClick={() => setShowIngest(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">+ Add Daily Reading</button>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{t}</button>
        ))}
      </div>

      {tab === "Dashboard" && dashboard && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {dashboard.fields.map(f => (
              <div key={f.FieldID} className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="text-xs text-gray-500 mb-1">{f.FieldID}</div>
                <div className="text-2xl font-bold text-blue-700">{Number(f.TotalUnits).toFixed(0)}</div>
                <div className="text-xs text-gray-500">chill units · {f.Days} days</div>
                <div className="text-xs text-gray-400 mt-1">{f.FirstDate?.split("T")[0]} → {f.LastDate?.split("T")[0]}</div>
                <div className="mt-2 space-y-1">
                  {dashboard.cultivars.map(c => {
                    const pct = Math.min(100, (Number(f.TotalUnits) / Number(c.RequiredChillHours)) * 100);
                    return (
                      <div key={c.CultivarID}>
                        <div className="flex justify-between text-xs text-gray-500 mb-0.5"><span>{c.CultivarName}</span><span>{pct.toFixed(0)}%</span></div>
                        <div className="h-1.5 bg-gray-200 rounded"><div className={`h-full rounded ${pct >= 100 ? "bg-green-500" : "bg-blue-400"}`} style={{ width: `${pct}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {dashboard.fields.length === 0 && <div className="text-center py-10 text-gray-400">No readings for {season}. Add daily temperature readings to start tracking.</div>}
        </div>
      )}

      {tab === "Accumulation" && accumulation && (
        <div>
          <div className="border rounded-lg p-4 bg-white mb-4 flex gap-6">
            <div><div className="text-3xl font-bold text-blue-700">{Number(accumulation.total_chill_units).toFixed(1)}</div><div className="text-xs text-gray-500">Total chill units ({accumulation.season})</div></div>
            <div><div className="text-2xl font-bold text-gray-700">{accumulation.readings.length}</div><div className="text-xs text-gray-500">Days with readings</div></div>
          </div>
          {accumulation.readings.length > 1 && (
            <div className="border rounded-lg p-4 bg-white mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Cumulative Accumulation</div>
              <div className="relative h-28 bg-gray-50 rounded overflow-hidden">
                {(() => {
                  const vals = accumulation.readings.map(r => Number(r.CumulativeUnits));
                  const mn = Math.min(0, ...vals), mx = Math.max(...vals), range = mx - mn || 1;
                  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${100 - ((v - mn) / range) * 80 - 10}`).join(" ");
                  return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></svg>;
                })()}
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>{["Date", "Min °F", "Max °F", "Avg °F", "Day Units", "Cumulative"].map(h => <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...accumulation.readings].reverse().map(r => (
                  <tr key={r.ReadingDate} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{r.ReadingDate?.split("T")[0] || r.ReadingDate}</td>
                    <td className="px-3 py-2">{Number(r.MinTempF).toFixed(1)}</td>
                    <td className="px-3 py-2">{Number(r.MaxTempF).toFixed(1)}</td>
                    <td className="px-3 py-2">{Number(r.AvgTempF).toFixed(1)}</td>
                    <td className={`px-3 py-2 font-medium ${Number(r.ChillUnitsDay) > 0 ? "text-blue-700" : "text-red-400"}`}>{Number(r.ChillUnitsDay).toFixed(1)}</td>
                    <td className="px-3 py-2 font-bold text-blue-800">{Number(r.CumulativeUnits).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Forecast" && (
        <div className="space-y-3">
          {forecasts.length === 0 && <div className="text-center py-10 text-gray-400">No cultivars configured. Add cultivars to see bloom forecasts.</div>}
          {forecasts.map(f => (
            <div key={f.cultivar_id} className="border rounded-lg p-4 bg-white flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{f.cultivar_name} <span className="text-sm text-gray-500 font-normal">({f.crop_type})</span></div>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-blue-700 font-medium">{Number(f.current_chill_units).toFixed(0)} / {Number(f.required_chill_units).toFixed(0)} units</span>
                  {f.chill_deficit > 0 && <span className="text-gray-500">Deficit: {Number(f.chill_deficit).toFixed(0)}</span>}
                </div>
                <div className="mt-1.5 h-2 bg-gray-200 rounded-full"><div className={`h-full rounded-full ${f.chill_deficit <= 0 ? "bg-green-500" : "bg-blue-400"}`} style={{ width: `${Math.min(100, (f.current_chill_units / f.required_chill_units) * 100)}%` }} /></div>
              </div>
              <div className="text-right">
                {f.chill_deficit <= 0
                  ? <div className="text-green-600 font-semibold">✓ Dormancy requirement met</div>
                  : f.dormancy_break_in_days !== null
                    ? <div><div className="text-lg font-bold text-gray-800">~{f.dormancy_break_in_days}d to break</div><div className="text-xs text-gray-500">Bloom est. {f.projected_bloom_date}</div></div>
                    : <div className="text-gray-400">Insufficient data</div>}
                <div className="mt-1"><span className={`text-xs px-2 py-0.5 rounded ${CONFIDENCE_COLORS[f.confidence] || ""}`}>{f.confidence}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Cultivars" && (
        <div>
          <div className="flex justify-end mb-3"><button onClick={() => setShowNewCultivar(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">+ Add Cultivar</button></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>{["Crop", "Cultivar", "Required Units", "Temp Range (°F)", "Bloom GDD", "Model"].map(h => <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cultivars.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400">No cultivars configured</td></tr>}
                {cultivars.map(c => (
                  <tr key={c.CultivarID} className="hover:bg-gray-50">
                    <td className="px-3 py-2 capitalize">{c.CropType}</td>
                    <td className="px-3 py-2 font-medium">{c.CultivarName}</td>
                    <td className="px-3 py-2 text-blue-700 font-medium">{Number(c.RequiredChillHours).toFixed(0)}</td>
                    <td className="px-3 py-2">{Number(c.BaseChillTempF).toFixed(0)}–{Number(c.MaxChillTempF).toFixed(0)}°F</td>
                    <td className="px-3 py-2">{c.BloomGDDAfterDormancy ? Number(c.BloomGDDAfterDormancy).toFixed(0) : "—"}</td>
                    <td className="px-3 py-2 capitalize">{c.Model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Season History" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>{["Season", "Total Units", "Days", "Start", "End"].map(h => <th key={h} className="px-3 py-2 font-medium text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {seasonHistory.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400">No history</td></tr>}
              {seasonHistory.map(s => (
                <tr key={s.Season} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{s.Season}</td>
                  <td className="px-3 py-2 text-blue-700 font-bold">{Number(s.TotalUnits).toFixed(1)}</td>
                  <td className="px-3 py-2">{s.Days}</td>
                  <td className="px-3 py-2">{s.SeasonStart?.split("T")[0]}</td>
                  <td className="px-3 py-2">{s.SeasonEnd?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showWeatherImport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-1">Import from Weather History</h2>
            <p className="text-xs text-gray-500 mb-4">Pulls daily high/low temperatures from Open-Meteo for your coordinates and computes chill units automatically.</p>
            <form onSubmit={submitWeatherImport} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Latitude *</label><input required type="number" step="any" className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. 38.52" value={weatherForm.lat} onChange={e => setWeatherForm({ ...weatherForm, lat: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Longitude *</label><input required type="number" step="any" className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. -121.74" value={weatherForm.lon} onChange={e => setWeatherForm({ ...weatherForm, lon: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Days of history</label>
                  <select className="w-full border rounded px-2 py-1.5 text-sm" value={weatherForm.days} onChange={e => setWeatherForm({ ...weatherForm, days: Number(e.target.value) })}>
                    {[7, 14, 30, 60, 90].map(d => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
                  <select className="w-full border rounded px-2 py-1.5 text-sm" value={weatherForm.model} onChange={e => setWeatherForm({ ...weatherForm, model: e.target.value })}>
                    {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowWeatherImport(false)} className="px-4 py-2 text-sm text-gray-600 border rounded">Cancel</button>
                <button type="submit" disabled={weatherImporting} className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-50">{weatherImporting ? "Importing…" : "Import"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIngest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Add Daily Temperature Reading</h2>
            <form onSubmit={submitIngest} className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Date</label><input required type="date" className="w-full border rounded px-2 py-1.5 text-sm" value={ingestForm.reading_date} onChange={e => setIngestForm({ ...ingestForm, reading_date: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Min Temp (°F)</label><input required type="number" step="0.1" className="w-full border rounded px-2 py-1.5 text-sm" value={ingestForm.min_temp_f} onChange={e => setIngestForm({ ...ingestForm, min_temp_f: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Max Temp (°F)</label><input required type="number" step="0.1" className="w-full border rounded px-2 py-1.5 text-sm" value={ingestForm.max_temp_f} onChange={e => setIngestForm({ ...ingestForm, max_temp_f: e.target.value })} /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Model</label><select className="w-full border rounded px-2 py-1.5 text-sm" value={ingestForm.model} onChange={e => setIngestForm({ ...ingestForm, model: e.target.value })}>{MODELS.map(m => <option key={m}>{m}</option>)}</select></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowIngest(false)} className="px-4 py-2 text-sm text-gray-600 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewCultivar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Cultivar</h2>
            <form onSubmit={submitCultivar} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Crop Type *</label><input required className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. Apple" value={cultivarForm.crop_type} onChange={e => setCultivarForm({ ...cultivarForm, crop_type: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Cultivar Name *</label><input required className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. Honeycrisp" value={cultivarForm.cultivar_name} onChange={e => setCultivarForm({ ...cultivarForm, cultivar_name: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Required Chill Units *</label><input required type="number" step="1" className="w-full border rounded px-2 py-1.5 text-sm" value={cultivarForm.required_chill_hours} onChange={e => setCultivarForm({ ...cultivarForm, required_chill_hours: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Model</label><select className="w-full border rounded px-2 py-1.5 text-sm" value={cultivarForm.model} onChange={e => setCultivarForm({ ...cultivarForm, model: e.target.value })}>{MODELS.map(m => <option key={m}>{m}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Min Chill Temp (°F)</label><input type="number" step="0.1" className="w-full border rounded px-2 py-1.5 text-sm" value={cultivarForm.base_chill_temp_f} onChange={e => setCultivarForm({ ...cultivarForm, base_chill_temp_f: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Max Chill Temp (°F)</label><input type="number" step="0.1" className="w-full border rounded px-2 py-1.5 text-sm" value={cultivarForm.max_chill_temp_f} onChange={e => setCultivarForm({ ...cultivarForm, max_chill_temp_f: e.target.value })} /></div>
                <div className="col-span-2"><label className="block text-xs font-medium text-gray-600 mb-1">GDD After Dormancy Break (optional)</label><input type="number" step="0.1" className="w-full border rounded px-2 py-1.5 text-sm" value={cultivarForm.bloom_gdd_after_dormancy} onChange={e => setCultivarForm({ ...cultivarForm, bloom_gdd_after_dormancy: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewCultivar(false)} className="px-4 py-2 text-sm text-gray-600 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save Cultivar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <SaigeWidget businessId={bid} pageContext="Chilling Hour & Bloom Forecast" />
    </div>
  );
}
