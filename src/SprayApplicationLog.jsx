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

const TABS = ["Applications", "Products", "PHI Calendar", "Summary"];
const METHODS = ["ground_boom", "air_blast", "aerial", "banded", "hand_spray", "drip_injection", "fertigation"];
const EPA_STATUSES = ["registered", "restricted_use", "organic_approved", "discontinued"];

function Badge({ children, color = "blue" }) {
  const map = { blue: "bg-blue-100 text-blue-800", green: "bg-green-100 text-green-800", red: "bg-red-100 text-red-800", yellow: "bg-yellow-100 text-yellow-800", gray: "bg-gray-100 text-gray-600", purple: "bg-purple-100 text-purple-800" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[color] || map.gray}`}>{children}</span>;
}

function epaColor(status) {
  return { registered: "green", restricted_use: "red", organic_approved: "green", discontinued: "gray" }[status] || "gray";
}

function daysToPHI(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  return diff;
}

export default function SprayApplicationLog() {
  const [params] = useSearchParams();
  const bid = params.get("BusinessID");
  const [tab, setTab] = useState("Applications");
  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState([]);
  const [phiCalendar, setPhiCalendar] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddApp, setShowAddApp] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [appDetail, setAppDetail] = useState(null);

  const [appForm, setAppForm] = useState({
    application_date: new Date().toISOString().split("T")[0],
    field_name: "", crop_name: "", growth_stage: "", area_treated_ha: "",
    application_method: "", equipment_used: "", operator_name: "",
    weather_temp_c: "", weather_wind_kph: "", weather_humidity_pct: "", weather_conditions: "",
    total_water_used_l: "", water_volume_per_ha_l: "",
    pest_targeted: "", crop_observations: "", notes: "",
    products: [],
  });

  const [productForm, setProductForm] = useState({
    product_name: "", active_ingredient: "", registration_number: "",
    epa_status: "registered", product_type: "", manufacturer_name: "",
    phi_days: "", rei_hours: "", default_rate_per_ha: "", default_rate_unit: "L/ha", notes: "",
  });

  const [appProductLine, setAppProductLine] = useState({ product_id: "", product_name_override: "", rate_per_ha: "", rate_unit: "L/ha", total_amount_used: "", total_amount_unit: "L", batch_lot_number: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const [appsR, prodsR] = await Promise.all([
      apiFetch("/api/spray/applications"),
      apiFetch("/api/spray/products"),
    ]);
    if (appsR.ok) setApplications(await appsR.json());
    if (prodsR.ok) setProducts(await prodsR.json());
    setLoading(false);
  }, []);

  const loadPHI = useCallback(async () => {
    const r = await apiFetch("/api/spray/phi-calendar");
    if (r.ok) setPhiCalendar(await r.json());
  }, []);

  const loadSummary = useCallback(async () => {
    const r = await apiFetch("/api/spray/summary");
    if (r.ok) setSummary(await r.json());
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (tab === "PHI Calendar") loadPHI(); else if (tab === "Summary") loadSummary(); }, [tab, loadPHI, loadSummary]);

  async function loadAppDetail(appId) {
    const r = await apiFetch(`/api/spray/applications/${appId}`);
    if (r.ok) setAppDetail(await r.json());
  }

  function addProductLine() {
    if (!appProductLine.product_id && !appProductLine.product_name_override) return;
    const line = {
      product_id: appProductLine.product_id ? parseInt(appProductLine.product_id) : null,
      product_name_override: appProductLine.product_name_override || null,
      rate_per_ha: appProductLine.rate_per_ha ? parseFloat(appProductLine.rate_per_ha) : null,
      rate_unit: appProductLine.rate_unit,
      total_amount_used: appProductLine.total_amount_used ? parseFloat(appProductLine.total_amount_used) : null,
      total_amount_unit: appProductLine.total_amount_unit,
      batch_lot_number: appProductLine.batch_lot_number || null,
    };
    setAppForm(f => ({ ...f, products: [...f.products, line] }));
    setAppProductLine({ product_id: "", product_name_override: "", rate_per_ha: "", rate_unit: "L/ha", total_amount_used: "", total_amount_unit: "L", batch_lot_number: "" });
  }

  async function submitApp() {
    const body = {
      ...appForm,
      area_treated_ha: appForm.area_treated_ha ? parseFloat(appForm.area_treated_ha) : null,
      weather_temp_c: appForm.weather_temp_c ? parseFloat(appForm.weather_temp_c) : null,
      weather_wind_kph: appForm.weather_wind_kph ? parseFloat(appForm.weather_wind_kph) : null,
      weather_humidity_pct: appForm.weather_humidity_pct ? parseFloat(appForm.weather_humidity_pct) : null,
      total_water_used_l: appForm.total_water_used_l ? parseFloat(appForm.total_water_used_l) : null,
      water_volume_per_ha_l: appForm.water_volume_per_ha_l ? parseFloat(appForm.water_volume_per_ha_l) : null,
    };
    const r = await apiFetch("/api/spray/applications", { method: "POST", body: JSON.stringify(body) });
    if (r.ok) {
      setShowAddApp(false);
      setAppForm({ application_date: new Date().toISOString().split("T")[0], field_name: "", crop_name: "", growth_stage: "", area_treated_ha: "", application_method: "", equipment_used: "", operator_name: "", weather_temp_c: "", weather_wind_kph: "", weather_humidity_pct: "", weather_conditions: "", total_water_used_l: "", water_volume_per_ha_l: "", pest_targeted: "", crop_observations: "", notes: "", products: [] });
      load();
    } else {
      const e = await r.json().catch(() => ({}));
      alert(e.detail || "Failed to save application");
    }
  }

  async function submitProduct() {
    const body = {
      ...productForm,
      phi_days: productForm.phi_days ? parseInt(productForm.phi_days) : null,
      rei_hours: productForm.rei_hours ? parseInt(productForm.rei_hours) : null,
      default_rate_per_ha: productForm.default_rate_per_ha ? parseFloat(productForm.default_rate_per_ha) : null,
    };
    const r = await apiFetch("/api/spray/products", { method: "POST", body: JSON.stringify(body) });
    if (r.ok) {
      setShowAddProduct(false);
      setProductForm({ product_name: "", active_ingredient: "", registration_number: "", epa_status: "registered", product_type: "", manufacturer_name: "", phi_days: "", rei_hours: "", default_rate_per_ha: "", default_rate_unit: "L/ha", notes: "" });
      load();
    }
  }

  async function markComplete(appId) {
    const r = await apiFetch(`/api/spray/applications/${appId}/complete`, { method: "PATCH" });
    if (r.ok) load();
  }

  const F = ({ label, value, onChange, type = "text", step, required, as: As = "input", children }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && " *"}</label>
      {As === "select" ? (
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full border rounded-lg px-2.5 py-1.5 text-sm">{children}</select>
      ) : (
        <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} className="w-full border rounded-lg px-2.5 py-1.5 text-sm" required={required} />
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spray & Chemical Application Log</h1>
          <p className="text-sm text-gray-500 mt-1">Record spray events, manage your chemical library, and track PHI/REI compliance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddProduct(true)} className="border border-green-300 text-green-700 px-3 py-1.5 rounded-lg text-sm hover:bg-green-50">+ Product</button>
          <button onClick={() => setShowAddApp(true)} className="bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-800">+ Log Application</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? "border-green-700 text-green-800" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{t}</button>
        ))}
      </div>

      {/* Applications tab */}
      {tab === "Applications" && (
        <div className="space-y-3">
          {loading && <div className="text-center py-10 text-gray-400 text-sm animate-pulse">Loading…</div>}
          {!loading && applications.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="text-4xl mb-3">🌿</div>
              <div className="font-semibold text-gray-600">No spray applications yet</div>
              <div className="text-sm text-gray-400 mt-1">Click "+ Log Application" to record your first spray event</div>
            </div>
          )}
          {applications.map(a => {
            const phi = daysToPHI(a.PHIDate);
            return (
              <div key={a.ApplicationID} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm cursor-pointer"
                onClick={() => { setSelectedApp(a); loadAppDetail(a.ApplicationID); }}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="font-semibold text-gray-800">{a.FieldName || `Field ${a.FieldID || "—"}`} — {a.CropName || "Crop unknown"}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{a.ApplicationDate} · {a.ApplicationMethod?.replace(/_/g, " ") || "—"} · {a.AreaTreatedHa ? `${a.AreaTreatedHa} ha` : ""} · {a.ProductCount} product{a.ProductCount !== 1 ? "s" : ""}</div>
                    {a.PestTargeted && <div className="text-xs text-gray-500 mt-0.5">Target: {a.PestTargeted}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {phi !== null && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${phi < 0 ? "bg-green-100 text-green-700" : phi <= 7 ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                        PHI: {phi < 0 ? "Cleared" : `${phi}d`}
                      </span>
                    )}
                    {a.IsComplete ? <Badge color="green">Complete</Badge> : <Badge color="yellow">Pending</Badge>}
                    {!a.IsComplete && (
                      <button onClick={e => { e.stopPropagation(); markComplete(a.ApplicationID); }}
                        className="text-xs px-2 py-1 border border-green-300 text-green-700 rounded hover:bg-green-50">Mark Done</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products tab */}
      {tab === "Products" && (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Product Name", "Active Ingredient", "EPA Status", "PHI (days)", "REI (hrs)", "Default Rate"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.ProductID} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{p.ProductName}</td>
                  <td className="px-4 py-2 text-gray-600 text-xs">{p.ActiveIngredient || "—"}</td>
                  <td className="px-4 py-2"><Badge color={epaColor(p.EpaStatus)}>{p.EpaStatus?.replace(/_/g, " ") || "—"}</Badge></td>
                  <td className="px-4 py-2 text-center">{p.PHIDays ?? "—"}</td>
                  <td className="px-4 py-2 text-center">{p.REIHours ?? "—"}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{p.DefaultRatePerHa ? `${p.DefaultRatePerHa} ${p.DefaultRateUnit || ""}` : "—"}</td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400">No products in library — click "+ Product" to add</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* PHI Calendar */}
      {tab === "PHI Calendar" && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            Pre-harvest intervals (PHI) for sprays applied this season. Green = cleared for harvest. Orange = &lt;7 days to clearance.
          </div>
          {phiCalendar.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No upcoming PHI dates — check back once you log applications with chemical products that have PHI data.</div>}
          {phiCalendar.map(e => {
            const phi = daysToPHI(e.PHIDate);
            return (
              <div key={e.ApplicationID} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-semibold text-gray-800">{e.FieldName || "Field"} — {e.CropName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Applied: {e.ApplicationDate} · Target: {e.PestTargeted || "—"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">PHI Date</div>
                    <div className="font-medium text-gray-800">{e.PHIDate}</div>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${phi !== null && phi < 0 ? "bg-green-100 text-green-800" : phi !== null && phi <= 7 ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}>
                    {phi !== null ? (phi < 0 ? "✓ Cleared" : `${phi} days`) : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {tab === "Summary" && summary && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              ["Applications", summary.totals?.TotalApplications ?? 0, ""],
              ["Area Treated", summary.totals?.TotalAreaHa?.toFixed(1) ?? 0, "ha"],
              ["Fields Sprayed", summary.totals?.FieldsSpayed ?? 0, ""],
              ["Unique Products", summary.totals?.UniqueProducts ?? 0, ""],
              ["Chemical Cost", `$${(summary.totals?.TotalChemicalCost || 0).toLocaleString()}`, ""],
            ].map(([label, val, unit]) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{val}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span></div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm text-gray-700">Usage by Product</div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{["Product", "Uses", "Total Amount", "Total Cost"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(summary.by_product || []).map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{p.ProductName || "Unknown"}</td>
                    <td className="px-4 py-2 text-center">{p.Uses}</td>
                    <td className="px-4 py-2">{p.TotalAmount ? `${p.TotalAmount} ${p.TotalAmountUnit || ""}` : "—"}</td>
                    <td className="px-4 py-2">{p.TotalCost ? `$${p.TotalCost.toLocaleString()}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application detail panel */}
      {selectedApp && appDetail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-800">{appDetail.FieldName || "Application"} — {appDetail.ApplicationDate}</div>
                <div className="text-xs text-gray-500">{appDetail.CropName} · {appDetail.ApplicationMethod?.replace(/_/g, " ")}</div>
              </div>
              <button onClick={() => { setSelectedApp(null); setAppDetail(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Area Treated", appDetail.AreaTreatedHa ? `${appDetail.AreaTreatedHa} ha` : "—"],
                  ["Operator", appDetail.OperatorName || "—"],
                  ["Temperature", appDetail.WeatherTempC ? `${appDetail.WeatherTempC}°C` : "—"],
                  ["Wind", appDetail.WeatherWindKph ? `${appDetail.WeatherWindKph} kph` : "—"],
                  ["Humidity", appDetail.WeatherHumidityPct ? `${appDetail.WeatherHumidityPct}%` : "—"],
                  ["Water Used", appDetail.TotalWaterUsedL ? `${appDetail.TotalWaterUsedL} L` : "—"],
                  ["Pest/Target", appDetail.PestTargeted || "—"],
                  ["PHI Clearance", appDetail.PHIDate || "—"],
                  ["REI Expiry", appDetail.REIExpiry ? new Date(appDetail.REIExpiry).toLocaleString() : "—"],
                ].map(([k, v]) => (
                  <div key={k}><span className="text-xs text-gray-400 block">{k}</span><span className="font-medium text-gray-700">{v}</span></div>
                ))}
              </div>
              {appDetail.products?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Products Applied</div>
                  {appDetail.products.map((p, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2 text-sm">
                      <div className="font-medium">{p.LibraryName || p.ProductNameOverride || `Product ${p.ProductID}`}</div>
                      <div className="text-xs text-gray-500 mt-1">{p.ActiveIngredient || ""}{p.RatePerHa ? ` · ${p.RatePerHa} ${p.RateUnit}/ha` : ""}{p.BatchLotNumber ? ` · Lot: ${p.BatchLotNumber}` : ""}</div>
                    </div>
                  ))}
                </div>
              )}
              {appDetail.Notes && <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{appDetail.Notes}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddApp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Log Spray Application</h2>
              <button onClick={() => setShowAddApp(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <F label="Application Date *" value={appForm.application_date} onChange={v => setAppForm(f => ({...f, application_date: v}))} type="date" required />
                <F label="Field Name" value={appForm.field_name} onChange={v => setAppForm(f => ({...f, field_name: v}))} />
                <F label="Crop" value={appForm.crop_name} onChange={v => setAppForm(f => ({...f, crop_name: v}))} />
                <F label="Growth Stage" value={appForm.growth_stage} onChange={v => setAppForm(f => ({...f, growth_stage: v}))} />
                <F label="Area (ha)" value={appForm.area_treated_ha} onChange={v => setAppForm(f => ({...f, area_treated_ha: v}))} type="number" step="0.01" />
                <F label="Method" value={appForm.application_method} onChange={v => setAppForm(f => ({...f, application_method: v}))} as="select">
                  <option value="">— select —</option>
                  {METHODS.map(m => <option key={m} value={m}>{m.replace(/_/g, " ")}</option>)}
                </F>
                <F label="Operator" value={appForm.operator_name} onChange={v => setAppForm(f => ({...f, operator_name: v}))} />
                <F label="Equipment" value={appForm.equipment_used} onChange={v => setAppForm(f => ({...f, equipment_used: v}))} />
                <F label="Temp (°C)" value={appForm.weather_temp_c} onChange={v => setAppForm(f => ({...f, weather_temp_c: v}))} type="number" step="0.1" />
                <F label="Wind (kph)" value={appForm.weather_wind_kph} onChange={v => setAppForm(f => ({...f, weather_wind_kph: v}))} type="number" step="0.1" />
                <F label="Humidity (%)" value={appForm.weather_humidity_pct} onChange={v => setAppForm(f => ({...f, weather_humidity_pct: v}))} type="number" step="0.1" />
                <F label="Conditions" value={appForm.weather_conditions} onChange={v => setAppForm(f => ({...f, weather_conditions: v}))} />
                <F label="Water Used (L)" value={appForm.total_water_used_l} onChange={v => setAppForm(f => ({...f, total_water_used_l: v}))} type="number" step="1" />
                <F label="Water / ha (L)" value={appForm.water_volume_per_ha_l} onChange={v => setAppForm(f => ({...f, water_volume_per_ha_l: v}))} type="number" step="1" />
                <div className="col-span-2"><F label="Pest / Disease Targeted" value={appForm.pest_targeted} onChange={v => setAppForm(f => ({...f, pest_targeted: v}))} /></div>
                <div className="col-span-2"><F label="Observations" value={appForm.crop_observations} onChange={v => setAppForm(f => ({...f, crop_observations: v}))} /></div>
                <div className="col-span-2"><F label="Notes" value={appForm.notes} onChange={v => setAppForm(f => ({...f, notes: v}))} /></div>
              </div>

              {/* Product lines */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Products Applied</div>
                {appForm.products.map((p, i) => (
                  <div key={i} className="bg-green-50 rounded-lg px-3 py-2 text-xs mb-1 flex justify-between items-center">
                    <span>{products.find(x => x.ProductID === p.product_id)?.ProductName || p.product_name_override || `Product ${p.product_id}`} — {p.rate_per_ha} {p.rate_unit}</span>
                    <button onClick={() => setAppForm(f => ({...f, products: f.products.filter((_, j) => j !== i)}))} className="text-red-400 hover:text-red-600 ml-2">✕</button>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <select className="border rounded px-2 py-1.5 text-sm" value={appProductLine.product_id} onChange={e => setAppProductLine(l => ({...l, product_id: e.target.value}))}>
                    <option value="">— From library —</option>
                    {products.map(p => <option key={p.ProductID} value={p.ProductID}>{p.ProductName}</option>)}
                  </select>
                  <input placeholder="Or enter name" className="border rounded px-2 py-1.5 text-sm" value={appProductLine.product_name_override} onChange={e => setAppProductLine(l => ({...l, product_name_override: e.target.value}))} />
                  <input placeholder="Rate" type="number" step="any" className="border rounded px-2 py-1.5 text-sm" value={appProductLine.rate_per_ha} onChange={e => setAppProductLine(l => ({...l, rate_per_ha: e.target.value}))} />
                  <input placeholder="Unit (L/ha, kg/ha…)" className="border rounded px-2 py-1.5 text-sm" value={appProductLine.rate_unit} onChange={e => setAppProductLine(l => ({...l, rate_unit: e.target.value}))} />
                  <input placeholder="Total used" type="number" step="any" className="border rounded px-2 py-1.5 text-sm" value={appProductLine.total_amount_used} onChange={e => setAppProductLine(l => ({...l, total_amount_used: e.target.value}))} />
                  <input placeholder="Batch / lot #" className="border rounded px-2 py-1.5 text-sm" value={appProductLine.batch_lot_number} onChange={e => setAppProductLine(l => ({...l, batch_lot_number: e.target.value}))} />
                </div>
                <button onClick={addProductLine} className="mt-2 text-xs border border-green-300 text-green-700 px-3 py-1 rounded hover:bg-green-50">+ Add Product Line</button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddApp(false)} className="px-4 py-2 text-sm text-gray-600 border rounded-lg">Cancel</button>
                <button onClick={submitApp} className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">Save Application</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Add Chemical Product</h2>
              <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <div className="col-span-2"><F label="Product Name *" value={productForm.product_name} onChange={v => setProductForm(f => ({...f, product_name: v}))} required /></div>
              <div className="col-span-2"><F label="Active Ingredient(s)" value={productForm.active_ingredient} onChange={v => setProductForm(f => ({...f, active_ingredient: v}))} /></div>
              <F label="Registration #" value={productForm.registration_number} onChange={v => setProductForm(f => ({...f, registration_number: v}))} />
              <F label="Manufacturer" value={productForm.manufacturer_name} onChange={v => setProductForm(f => ({...f, manufacturer_name: v}))} />
              <F label="EPA Status" value={productForm.epa_status} onChange={v => setProductForm(f => ({...f, epa_status: v}))} as="select">
                {EPA_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </F>
              <F label="Product Type" value={productForm.product_type} onChange={v => setProductForm(f => ({...f, product_type: v}))} />
              <F label="PHI (days)" value={productForm.phi_days} onChange={v => setProductForm(f => ({...f, phi_days: v}))} type="number" />
              <F label="REI (hours)" value={productForm.rei_hours} onChange={v => setProductForm(f => ({...f, rei_hours: v}))} type="number" />
              <F label="Default Rate / ha" value={productForm.default_rate_per_ha} onChange={v => setProductForm(f => ({...f, default_rate_per_ha: v}))} type="number" step="any" />
              <F label="Rate Unit" value={productForm.default_rate_unit} onChange={v => setProductForm(f => ({...f, default_rate_unit: v}))} />
              <div className="col-span-2"><F label="Notes" value={productForm.notes} onChange={v => setProductForm(f => ({...f, notes: v}))} /></div>
              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddProduct(false)} className="px-4 py-2 text-sm text-gray-600 border rounded-lg">Cancel</button>
                <button onClick={submitProduct} className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800">Save Product</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SaigeWidget businessId={bid} pageContext="Spray & Chemical Application Log" />
    </div>
  );
}
