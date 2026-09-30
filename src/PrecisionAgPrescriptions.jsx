import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, getIndex, API_URL, CROP_API_URL } from './precisionAgUtils';

const ZONE_METHODS  = ['Equidistant', 'Quantile', 'Natural Breaks'];
const INDEX_OPTIONS = ['NDVI', 'NDRE', 'EVI', 'GNDVI', 'NDWI'];
const UNITS = ['kg/ha', 'L/ha', 'lb/ac', 'gal/ac', 'units/ha'];
const COLS = 32, ROWS = 20;

function zoneColor(zoneIdx, numZones) {
  const pal = ['#A32715','#C86419','#DCB428','#AAD232','#5AA528','#1E6414','#0D3D08'];
  const step = Math.floor((zoneIdx / Math.max(1, numZones - 1)) * (pal.length - 1));
  return pal[Math.min(step, pal.length - 1)];
}

// Real zones from k-means /api/fields/{id}/zones — replaces the prior
// quantile-on-synthetic-cells preview.
function ZoneMapPreview({ fieldId, indexKey, numZones, height = 200 }) {
  const [zoneData, setZoneData] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!fieldId || !indexKey) { setZoneData(null); return; }
    const ctrl = new AbortController();
    setStatus('loading');
    fetch(`${API_URL}/api/fields/${fieldId}/zones?index=${indexKey}&num_zones=${numZones}&grid=48`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { setZoneData(d); setStatus('idle'); })
      .catch(e => { if (e?.name !== 'AbortError') { setZoneData(null); setStatus('error'); } });
    return () => ctrl.abort();
  }, [fieldId, indexKey, numZones]);

  if (status === 'loading') return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-xs rounded-lg bg-gray-50 animate-pulse" style={{ height }}>
      Clustering raster…
    </div>
  );
  if (!zoneData?.grid?.labels) return (
    <div className="flex items-center justify-center text-gray-400 font-mont text-xs rounded-lg bg-gray-50" style={{ height }}>
      {status === 'error' ? 'Zones unavailable' : 'Select a field with a recent analysis'}
    </div>
  );

  const { labels, rows: gRows, cols: gCols } = zoneData.grid;
  const cW = 100 / gCols, cH = 100 / gRows;
  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {labels.flatMap((row, r) => row.map((label, c) => {
          if (label < 0) return <rect key={`${r}-${c}`} x={c*cW} y={r*cH} width={cW+0.1} height={cH+0.1} fill="#F3F4F6" />;
          return <rect key={`${r}-${c}`} x={c*cW} y={r*cH} width={cW+0.1} height={cH+0.1} fill={zoneColor(label, numZones)} />;
        }))}
      </svg>
    </div>
  );
}

function RxCard({ rx, onDelete, fieldId }) {
  const [confirming, setConfirming] = useState(false);
  const totalRate = rx.zone_rates.reduce((s, z) => s + (z.rate || 0), 0);
  const avgRate = rx.zone_rates.length ? (totalRate / rx.zone_rates.length).toFixed(1) : '—';
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-lora font-bold text-gray-900">{rx.name}</div>
          <div className="font-mont text-xs text-gray-400 mt-0.5">
            {rx.product && <span className="mr-3">{rx.product}</span>}
            {rx.index_key && <span className="mr-3">{rx.index_key}</span>}
            {rx.zone_method && <span className="mr-3">{rx.zone_method}</span>}
            {rx.num_zones && <span>{rx.num_zones} zones</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={`${API_URL}/api/fields/${fieldId}/prescriptions/${rx.prescription_id}/export.csv`}
            download
            className="px-3 py-1.5 text-xs font-mont font-semibold border border-[#6D8E22] text-[#6D8E22] rounded-lg hover:bg-green-50">
            ↓ CSV
          </a>
          {confirming ? (
            <>
              <button onClick={() => onDelete(rx.prescription_id)} className="px-3 py-1.5 text-xs font-mont bg-red-500 text-white rounded-lg">Confirm</button>
              <button onClick={() => setConfirming(false)} className="px-3 py-1.5 text-xs font-mont border border-gray-200 rounded-lg">Cancel</button>
            </>
          ) : (
            <button onClick={() => setConfirming(true)} className="text-xs font-mont text-gray-400 hover:text-red-500">Delete</button>
          )}
        </div>
      </div>
      {rx.zone_rates.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mont">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-1.5 text-gray-500 font-semibold">Zone</th>
                <th className="text-center py-1.5 text-gray-500 font-semibold">Rate ({rx.unit || '—'})</th>
                <th className="text-center py-1.5 text-gray-500 font-semibold">Color</th>
              </tr>
            </thead>
            <tbody>
              {rx.zone_rates.map((zr, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td className="py-1.5 font-semibold text-gray-700">Zone {zr.zone + 1}</td>
                  <td className="py-1.5 text-center text-gray-700">{zr.rate ?? '—'}</td>
                  <td className="py-1.5 text-center">
                    <span className="inline-block w-4 h-4 rounded" style={{ background: zoneColor(zr.zone, rx.num_zones) }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 flex gap-4 text-xs font-mont text-gray-400">
        <span>Avg rate: <strong className="text-gray-700">{avgRate} {rx.unit || ''}</strong></span>
        {rx.analysis_date && <span>Based on: <strong className="text-gray-700">{rx.analysis_date}</strong></span>}
        <span className="ml-auto">{new Date(rx.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default function PrecisionAgPrescriptions() {
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const { analyses } = useAnalyses(selectedFieldId);
  const [selectedAnalysisIdx, setSelectedAnalysisIdx] = useState(0);
  const [rxList, setRxList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: '', product: '', unit: 'kg/ha', index_key: 'NDVI', zone_method: 'Equidistant', num_zones: 3, notes: '' });
  const [rates, setRates] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);
  useEffect(() => { setSelectedAnalysisIdx(0); }, [selectedFieldId]);

  // Keep rates array length in sync with num_zones
  useEffect(() => {
    setRates(prev => Array.from({ length: form.num_zones }, (_, i) => ({ zone: i, rate: prev[i]?.rate ?? '' })));
  }, [form.num_zones]);

  const loadRx = useCallback(async () => {
    if (!selectedFieldId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/prescriptions`);
      setRxList(r.ok ? await r.json() : []);
    } finally { setLoading(false); }
  }, [selectedFieldId]);
  useEffect(() => { loadRx(); }, [loadRx]);

  const analysis = analyses[selectedAnalysisIdx] || null;
  const fieldIdNum = parseInt(selectedFieldId) || 1;
  const indexData = getIndex(analysis, form.index_key);

  const [ifThenBase, setIfThenBase] = useState('');

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setRate = (i, v) => setRates(prev => prev.map((r, j) => j === i ? { ...r, rate: v } : r));

  const applyIfThen = () => {
    const base = parseFloat(ifThenBase);
    if (!base || isNaN(base)) return;
    const n = form.num_zones;
    setRates(prev => prev.map((r, i) => {
      const factor = n > 1 ? 1 + 0.4 * (1 - (2 * i) / (n - 1)) : 1;
      return { ...r, rate: (base * factor).toFixed(1) };
    }));
  };

  const submit = async () => {
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    if (rates.some(r => r.rate === '' || r.rate === null)) { setFormError('Enter a rate for every zone.'); return; }
    setSaving(true); setFormError('');
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          num_zones: form.num_zones,
          zone_rates: rates.map(r => ({ zone: r.zone, rate: parseFloat(r.rate) })),
          analysis_date: analysis?.analysis_date?.slice(0, 10) || null,
        }),
      });
      if (!r.ok) throw new Error(await r.text());
      const created = await r.json();
      setRxList(prev => [created, ...prev]);
      setShowForm(false);
    } catch (e) { setFormError(String(e)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/fields/${selectedFieldId}/prescriptions/${id}`, { method: 'DELETE' });
    setRxList(prev => prev.filter(r => r.prescription_id !== id));
  };

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle="Prescriptions" breadcrumbs={[{ label:'Dashboard', to:'/dashboard' }, { label:'Precision Ag' }, { label:'Prescriptions' }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">Variable Rate Prescriptions</h1>
            <p className="font-mont text-sm text-gray-500">Create zone-based application rate maps from satellite vegetation indices. Export as CSV for your equipment.</p>
          </div>
          <button onClick={() => setShowForm(v => !v)}
            className="px-4 py-2 bg-[#6D8E22] text-white text-sm font-mont font-semibold rounded-lg hover:bg-[#5a7519]">
            {showForm ? 'Cancel' : '+ New Prescription'}
          </button>
        </div>

        {/* Field + date selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">Field</label>
            <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
              {fields.length === 0 && <option value="">No fields</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          {analyses.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold font-mont text-gray-500">Analysis Date</label>
              <select value={selectedAnalysisIdx} onChange={e => setSelectedAnalysisIdx(Number(e.target.value))}
                className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-48">
                {analyses.map((a, i) => (
                  <option key={i} value={i}>
                    {new Date(a.analysis_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    {i === 0 ? ' (latest)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Prescription builder */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 font-mont text-sm font-semibold text-gray-600">New Prescription</div>
            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: config */}
              <div className="space-y-4">
                {formError && <div className="text-xs text-red-600 bg-red-50 rounded px-3 py-2 font-mont">{formError}</div>}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs font-semibold font-mont text-gray-500">Prescription Name *</label>
                    <input value={form.name} onChange={e => setF('name', e.target.value)}
                      placeholder="e.g. Spring Nitrogen Application"
                      className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold font-mont text-gray-500">Product</label>
                    <input value={form.product} onChange={e => setF('product', e.target.value)}
                      placeholder="e.g. Urea 46-0-0"
                      className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold font-mont text-gray-500">Unit</label>
                    <select value={form.unit} onChange={e => setF('unit', e.target.value)}
                      className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
                      {UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold font-mont text-gray-500">Index</label>
                    <select value={form.index_key} onChange={e => setF('index_key', e.target.value)}
                      className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
                      {INDEX_OPTIONS.map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold font-mont text-gray-500">Zone Method</label>
                    <select value={form.zone_method} onChange={e => setF('zone_method', e.target.value)}
                      className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
                      {ZONE_METHODS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* Number of zones */}
                <div>
                  <label className="text-xs font-semibold font-mont text-gray-500 block mb-2">Number of Zones</label>
                  <div className="flex gap-2">
                    {[2,3,4,5,6,7].map(n => (
                      <button key={n} onClick={() => setF('num_zones', n)}
                        className="w-9 h-9 rounded-lg text-sm font-mont font-semibold border transition-all"
                        style={{ background: form.num_zones === n ? '#6D8E22' : 'white', borderColor: form.num_zones === n ? '#6D8E22' : '#E5E7EB', color: form.num_zones === n ? 'white' : '#6B7280' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* If-Then rate calculator */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                  <div className="font-mont text-xs font-semibold text-gray-600 mb-2">If-Then Rate Calculator</div>
                  <p className="font-mont text-xs text-gray-400 mb-2">
                    Low-{form.index_key} zones get higher rates, high zones get lower rates. Enter a base rate and auto-fill.
                  </p>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" step="any" placeholder="Base rate"
                      value={ifThenBase} onChange={e => setIfThenBase(e.target.value)}
                      className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-1.5 w-32" />
                    <span className="font-mont text-xs text-gray-400">{form.unit}</span>
                    <button type="button" onClick={applyIfThen}
                      className="px-3 py-1.5 bg-[#6D8E22] text-white text-xs font-mont font-semibold rounded-lg hover:bg-[#5a7519]">
                      Auto-fill Rates
                    </button>
                  </div>
                </div>

                {/* Rate inputs */}
                <div>
                  <label className="text-xs font-semibold font-mont text-gray-500 block mb-2">Application Rate per Zone</label>
                  <div className="space-y-2">
                    {rates.map((r, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="inline-block w-4 h-4 rounded flex-shrink-0" style={{ background: zoneColor(i, form.num_zones) }} />
                        <span className="font-mont text-sm text-gray-600 w-16">Zone {i + 1}</span>
                        <input type="number" min="0" step="any" value={r.rate} onChange={e => setRate(i, e.target.value)}
                          placeholder="0"
                          className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-1.5 w-28" />
                        <span className="font-mont text-xs text-gray-400">{form.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold font-mont text-gray-500">Notes</label>
                  <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={2}
                    className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 resize-none" />
                </div>

                <div className="flex justify-end">
                  <button onClick={submit} disabled={saving}
                    className="px-5 py-2 bg-[#6D8E22] text-white text-sm font-mont font-semibold rounded-lg hover:bg-[#5a7519] disabled:opacity-50">
                    {saving ? 'Saving…' : 'Save Prescription'}
                  </button>
                </div>
              </div>

              {/* Right: zone map preview */}
              <div>
                <div className="font-mont text-xs font-semibold text-gray-500 mb-2">Zone Map Preview</div>
                <ZoneMapPreview fieldId={selectedFieldId} indexKey={form.index_key} numZones={form.num_zones} height={240} />
                <div className="mt-3 flex gap-3 flex-wrap">
                  {Array.from({ length: form.num_zones }, (_, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: zoneColor(i, form.num_zones) }} />
                      <span className="font-mont text-xs text-gray-500">Zone {i + 1}</span>
                    </div>
                  ))}
                </div>
                {selectedFieldId && (
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`${API_URL}/api/fields/${selectedFieldId}/zones/prescription?index=${form.index_key}&num_zones=${form.num_zones}&grid=48&fmt=geojson&units=${encodeURIComponent(form.unit)}${rates.every(r => r.rate !== '') ? `&rates=${rates.map(r => r.rate).join(',')}` : ''}`}
                      download
                      className="flex-1 text-center py-2 rounded-lg font-mont font-bold text-xs border border-[#6D8E22] text-[#6D8E22] hover:bg-green-50">
                      ⬇ GeoJSON Rx
                    </a>
                    <a
                      href={`${API_URL}/api/fields/${selectedFieldId}/zones/prescription?index=${form.index_key}&num_zones=${form.num_zones}&grid=48&fmt=csv&units=${encodeURIComponent(form.unit)}${rates.every(r => r.rate !== '') ? `&rates=${rates.map(r => r.rate).join(',')}` : ''}`}
                      download
                      className="flex-1 text-center py-2 rounded-lg font-mont font-bold text-xs border border-[#6D8E22] text-[#6D8E22] hover:bg-green-50">
                      ⬇ CSV Rx
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Saved prescriptions */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">Loading…</div>
        ) : rxList.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg></div>
            <div className="font-lora text-xl text-gray-600 mb-2">No prescriptions yet</div>
            <div className="font-mont text-sm text-gray-400">Create your first variable rate prescription above.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {rxList.map(rx => <RxCard key={rx.prescription_id} rx={rx} onDelete={handleDelete} fieldId={selectedFieldId} />)}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
