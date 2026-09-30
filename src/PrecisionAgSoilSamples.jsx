import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, API_URL } from './precisionAgUtils';

const NUTRIENTS = [
  { key: 'ph',            label: 'pH',     unit: '',     good: [6.0, 7.0],  fmt: v => v?.toFixed(1) },
  { key: 'organic_matter',label: 'OM',     unit: '%',    good: [3.0, 8.0],  fmt: v => v?.toFixed(1) },
  { key: 'nitrogen',      label: 'N',      unit: 'kg/ha',good: [80, 200],   fmt: v => v?.toFixed(0) },
  { key: 'phosphorus',    label: 'P',      unit: 'kg/ha',good: [20, 60],    fmt: v => v?.toFixed(0) },
  { key: 'potassium',     label: 'K',      unit: 'kg/ha',good: [100, 300],  fmt: v => v?.toFixed(0) },
  { key: 'sulfur',        label: 'S',      unit: 'kg/ha',good: [10, 50],    fmt: v => v?.toFixed(0) },
  { key: 'calcium',       label: 'Ca',     unit: 'kg/ha',good: [500, 2000], fmt: v => v?.toFixed(0) },
  { key: 'magnesium',     label: 'Mg',     unit: 'kg/ha',good: [50, 300],   fmt: v => v?.toFixed(0) },
  { key: 'cec',           label: 'CEC',    unit: 'meq',  good: [10, 30],    fmt: v => v?.toFixed(1) },
];

function statusColor(val, good) {
  if (val == null) return '#D1D5DB';
  if (val < good[0]) return '#F97316';
  if (val > good[1]) return '#3B82F6';
  return '#22C55E';
}

function NutrientBar({ val, good, label, unit }) {
  if (val == null) return null;
  const lo = good[0] * 0.5, hi = good[1] * 1.5;
  const pct = Math.min(100, Math.max(0, ((val - lo) / (hi - lo)) * 100));
  const col = statusColor(val, good);
  return (
    <div className="flex items-center gap-2">
      <span className="font-mont text-xs text-gray-500 w-8">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: col }} />
      </div>
      <span className="font-mont text-xs font-bold w-16 text-right" style={{ color: col }}>
        {val.toFixed(label === 'pH' || label === 'OM' || label === 'CEC' ? 1 : 0)}{unit ? ` ${unit}` : ''}
      </span>
    </div>
  );
}

function SampleCard({ sample, onDelete }) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-lora font-bold text-gray-900">{sample.sample_label || t('soil_samples.sample_fallback', { id: sample.sample_id })}</div>
          <div className="font-mont text-xs text-gray-400 mt-0.5">
            {sample.sample_date && new Date(sample.sample_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
            {sample.depth_cm && <span className="ml-2">{t('soil_samples.depth_label', { cm: sample.depth_cm })}</span>}
            {sample.latitude && <span className="ml-2">{sample.latitude.toFixed(4)}, {sample.longitude?.toFixed(4)}</span>}
          </div>
        </div>
        {confirming ? (
          <div className="flex gap-2">
            <button onClick={() => onDelete(sample.sample_id)} className="text-xs px-2 py-1 bg-red-500 text-white rounded font-mont">{t('soil_samples.btn_confirm')}</button>
            <button onClick={() => setConfirming(false)} className="text-xs px-2 py-1 border border-gray-200 rounded font-mont">{t('soil_samples.btn_cancel')}</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="text-xs text-gray-400 hover:text-red-500 font-mont">{t('soil_samples.btn_delete')}</button>
        )}
      </div>
      <div className="space-y-1.5">
        {NUTRIENTS.map(n => <NutrientBar key={n.key} val={sample[n.key]} good={n.good} label={n.label} unit={n.unit} />)}
      </div>
      {sample.notes && <p className="mt-3 font-mont text-xs text-gray-500">{sample.notes}</p>}
    </div>
  );
}

function AddSampleForm({ fieldId, onSaved, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ sample_label: '', sample_date: new Date().toISOString().slice(0,10), depth_cm: '', latitude: '', longitude: '', ph: '', organic_matter: '', nitrogen: '', phosphorus: '', potassium: '', sulfur: '', calcium: '', magnesium: '', cec: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true); setError('');
    const body = { ...form };
    ['ph','organic_matter','nitrogen','phosphorus','potassium','sulfur','calcium','magnesium','cec'].forEach(k => { if (body[k] === '') body[k] = null; else body[k] = parseFloat(body[k]); });
    ['depth_cm'].forEach(k => { if (body[k] === '') body[k] = null; else body[k] = parseInt(body[k]); });
    ['latitude','longitude'].forEach(k => { if (body[k] === '') body[k] = null; else body[k] = parseFloat(body[k]); });
    try {
      const r = await fetch(`${API_URL}/api/fields/${fieldId}/soil-samples`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(await r.text());
      onSaved(await r.json());
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  const numField = (key, label) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold font-mont text-gray-500">{label}</label>
      <input type="number" step="any" value={form[key]} onChange={e => set(key, e.target.value)}
        className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-lora font-bold text-gray-900">{t('soil_samples.form_title')}</h3>
      {error && <div className="text-xs text-red-600 bg-red-50 rounded px-3 py-2 font-mont">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-xs font-semibold font-mont text-gray-500">{t('soil_samples.form_sample_label')}</label>
          <input value={form.sample_label} onChange={e => set('sample_label', e.target.value)} placeholder={t('soil_samples.form_sample_label_placeholder')}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold font-mont text-gray-500">{t('soil_samples.form_date')}</label>
          <input type="date" value={form.sample_date} onChange={e => set('sample_date', e.target.value)}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold font-mont text-gray-500">{t('soil_samples.form_depth')}</label>
          <input type="number" value={form.depth_cm} onChange={e => set('depth_cm', e.target.value)} placeholder="e.g. 20"
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {numField('ph', t('soil_samples.field_ph'))}
        {numField('organic_matter', t('soil_samples.field_om'))}
        {numField('nitrogen', t('soil_samples.field_n'))}
        {numField('phosphorus', t('soil_samples.field_p'))}
        {numField('potassium', t('soil_samples.field_k'))}
        {numField('sulfur', t('soil_samples.field_s'))}
        {numField('calcium', t('soil_samples.field_ca'))}
        {numField('magnesium', t('soil_samples.field_mg'))}
        {numField('cec', t('soil_samples.field_cec'))}
        {numField('latitude', t('soil_samples.field_lat'))}
        {numField('longitude', t('soil_samples.field_lon'))}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold font-mont text-gray-500">{t('soil_samples.form_notes')}</label>
        <input value={form.notes} onChange={e => set('notes', e.target.value)}
          className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-mont text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">{t('soil_samples.btn_cancel')}</button>
        <button onClick={submit} disabled={saving}
          className="px-5 py-2 text-sm font-mont font-semibold bg-[#6D8E22] text-white rounded-lg hover:bg-[#5a7519] disabled:opacity-50">
          {saving ? t('soil_samples.btn_saving') : t('soil_samples.btn_save')}
        </button>
      </div>
    </div>
  );
}

export default function PrecisionAgSoilSamples() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mapLayer, setMapLayer] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef();

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  const load = useCallback(async () => {
    if (!selectedFieldId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/soil-samples`);
      setSamples(r.ok ? await r.json() : []);
    } finally { setLoading(false); }
  }, [selectedFieldId]);
  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/fields/${selectedFieldId}/soil-samples/${id}`, { method: 'DELETE' });
    setSamples(s => s.filter(x => x.sample_id !== id));
  };

  const handleImport = async (file) => {
    if (!file) return;
    setImporting(true); setImportResult(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/soil-samples/import`, { method: 'POST', body: fd });
      const data = await r.json();
      setImportResult(data);
      if (data.imported > 0) load();
    } catch (e) { setImportResult({ imported: 0, errors: [String(e)] }); }
    finally { setImporting(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  // Average each nutrient across all samples
  const avg = {};
  NUTRIENTS.forEach(n => {
    const vals = samples.map(s => s[n.key]).filter(v => v != null);
    avg[n.key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  });

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={t('soil_samples.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to:'/dashboard' }, { label: t('precision_ag_alerts.breadcrumb_precision_ag') }, { label: t('soil_samples.page_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{t('soil_samples.heading')}</h1>
            <p className="font-mont text-sm text-gray-500">{t('soil_samples.subheading')}</p>
          </div>
          <div className="flex gap-2">
            <label className="px-4 py-2 border border-[#6D8E22] text-[#6D8E22] text-sm font-mont font-semibold rounded-lg hover:bg-green-50 cursor-pointer">
              {importing ? t('soil_samples.btn_importing') : t('soil_samples.btn_import_csv')}
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleImport(e.target.files?.[0])} />
            </label>
            <button onClick={() => setShowForm(v => !v)}
              className="px-4 py-2 bg-[#6D8E22] text-white text-sm font-mont font-semibold rounded-lg hover:bg-[#5a7519]">
              {showForm ? t('soil_samples.btn_cancel') : t('soil_samples.btn_add_sample')}
            </button>
          </div>
        </div>

        {importResult && (
          <div className={`rounded-xl border px-4 py-3 font-mont text-sm ${importResult.imported > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {t('soil_samples.import_result', { count: importResult.imported })}
            {importResult.errors?.length > 0 && <span className="ml-2">{t('soil_samples.import_errors', { errors: importResult.errors.join(', ') })}</span>}
          </div>
        )}

        {/* Field selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{t('soil_samples.field_label')}</label>
            <select value={selectedFieldId} onChange={e => { setSelectedFieldId(e.target.value); setShowForm(false); }}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
              {fields.length === 0 && <option value="">{t('soil_samples.no_fields')}</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          <div className="font-mont text-xs text-gray-400 text-xs self-end pb-2">
            {t('soil_samples.csv_hint')}
          </div>
        </div>

        {showForm && (
          <AddSampleForm
            fieldId={selectedFieldId}
            onSaved={s => { setSamples(prev => [s, ...prev]); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Sample location map with toggleable heatmap layers */}
        {samples.some(s => s.latitude && s.longitude) && (() => {
          const geo = samples.filter(s => s.latitude && s.longitude);
          const lats = geo.map(s => s.latitude);
          const lons = geo.map(s => s.longitude);
          const minLat = Math.min(...lats), maxLat = Math.max(...lats);
          const minLon = Math.min(...lons), maxLon = Math.max(...lons);
          const W = 500, H = 200, PL = 20, PR = 20, PT = 16, PB = 16;
          const nx = lon => PL + ((lon - minLon) / Math.max(maxLon - minLon, 0.0001)) * (W - PL - PR);
          const ny = lat => H - PB - ((lat - minLat) / Math.max(maxLat - minLat, 0.0001)) * (H - PT - PB);
          const dotColor = s => {
            if (mapLayer === 'ph'       && s.ph       != null) return statusColor(s.ph,       [6.0, 7.0]);
            if (mapLayer === 'nitrogen' && s.nitrogen != null) return statusColor(s.nitrogen, [80, 200]);
            return '#6D8E22';
          };
          const layers = [
            { key: null,       label: 'Points' },
            { key: 'ph',       label: 'pH' },
            { key: 'nitrogen', label: 'N' },
          ];
          return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="font-mont text-sm font-semibold text-gray-600">
                  {t('soil_samples.map_title', { count: geo.length })}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mont text-gray-400 mr-1">Layer:</span>
                  {layers.map(({ key, label }) => (
                    <button key={String(key)} onClick={() => setMapLayer(key)}
                      className={`px-2.5 py-1 rounded-full text-xs font-mont font-semibold border transition-all ${mapLayer === key ? 'bg-[#6D8E22] border-[#6D8E22] text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220, background: '#F9FAFB', borderRadius: 8 }}>
                <rect width={W} height={H} fill="#F9FAFB" rx="6" />
                {geo.map((s, i) => (
                  <g key={s.sample_id}>
                    <circle cx={nx(s.longitude)} cy={ny(s.latitude)} r="8" fill={dotColor(s)} fillOpacity="0.8" stroke="white" strokeWidth="1.5" />
                    <text x={nx(s.longitude) + 11} y={ny(s.latitude) + 4} fontSize="9" fill="#374151" fontWeight="600">
                      {s.sample_label || `#${i + 1}`}
                      {mapLayer === 'ph'       && s.ph       != null ? ` ${s.ph.toFixed(1)}`       : ''}
                      {mapLayer === 'nitrogen' && s.nitrogen != null ? ` ${s.nitrogen.toFixed(0)}`  : ''}
                    </text>
                  </g>
                ))}
                <text x={PL} y={H - 4} fontSize="8" fill="#9CA3AF">W</text>
                <text x={W - PR - 4} y={H - 4} fontSize="8" fill="#9CA3AF">E</text>
                <text x={PL} y={PT - 2} fontSize="8" fill="#9CA3AF">N</text>
                <text x={PL} y={H - PT + 4} fontSize="8" fill="#9CA3AF">S</text>
              </svg>
              {mapLayer && (
                <div className="mt-2 flex items-center gap-3 text-xs font-mont text-gray-400">
                  <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400" />Low</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400" />Optimal</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400" />High</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Field average summary */}
        {samples.length > 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="font-mont text-sm font-semibold text-gray-600 mb-3">{t('soil_samples.avg_title', { count: samples.length })}</div>
            <div className="space-y-2">
              {NUTRIENTS.map(n => <NutrientBar key={n.key} val={avg[n.key]} good={n.good} label={n.label} unit={n.unit} />)}
            </div>
            <div className="mt-3 flex gap-4 font-mont text-xs text-gray-400">
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400 mr-1" />{t('soil_samples.below_optimal')}</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 mr-1" />{t('soil_samples.optimal')}</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400 mr-1" />{t('soil_samples.above_optimal')}</span>
            </div>
          </div>
        )}

        {/* Sample list */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{t('soil_samples.loading')}</div>
        ) : samples.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3"/><polyline points="9 3 9 7 15 7 15 3"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg></div>
            <div className="font-lora text-xl text-gray-600 mb-2">{t('soil_samples.no_samples_title')}</div>
            <div className="font-mont text-sm text-gray-400">{t('soil_samples.no_samples_body')}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samples.map(s => <SampleCard key={s.sample_id} sample={s} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
