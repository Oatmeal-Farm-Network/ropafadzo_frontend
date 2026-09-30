import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = ['Tests', 'By Field', 'Trends', 'Deficiency Report'];
const NUTRIENTS = ['pH', 'EC', 'OC', 'N_total', 'P_Colwell', 'P_Bray', 'K', 'Ca', 'Mg', 'Na', 'S',
  'Zn', 'B', 'Mn', 'Fe', 'Cu', 'Mo', 'CEC', 'ESP', 'SAR'];
const SAMPLE_TYPES = ['composite', 'single_point', 'grid', 'zone_management'];

function tok() { return localStorage.getItem('access_token'); }
function authH() { return { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' }; }

function RatingBadge({ rating }) {
  const map = {
    very_low: 'bg-red-100 text-red-700',
    low: 'bg-orange-100 text-orange-700',
    optimal: 'bg-green-100 text-green-700',
    high: 'bg-blue-100 text-blue-700',
    very_high: 'bg-purple-100 text-purple-700',
    unknown: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[rating] || map.unknown}`}>
      {rating?.replace('_', ' ') || '—'}
    </span>
  );
}

export default function SoilTestRecords() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const initialTab = params.get('tab') || 'Tests';
  const [tab, setTab] = useState(TABS.find(t => t.toLowerCase().replace(' ', '-') === initialTab?.toLowerCase().replace(' ', '-')) || 'Tests');

  const [tests, setTests] = useState([]);
  const [byField, setByField] = useState([]);
  const [trends, setTrends] = useState(null);
  const [deficiencies, setDeficiencies] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDetail, setTestDetail] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [trendField, setTrendField] = useState('');
  const [trendNutrient, setTrendNutrient] = useState('pH');
  const [loading, setLoading] = useState(false);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/soil-tests/tests?limit=100`, { headers: authH() });
      if (r.ok) setTests(await r.json());
    } finally { setLoading(false); }
  }, []);

  const fetchByField = useCallback(async () => {
    const r = await fetch(`${API}/api/soil-tests/by-field`, { headers: authH() });
    if (r.ok) setByField(await r.json());
  }, []);

  const fetchTrends = useCallback(async () => {
    const qs = new URLSearchParams();
    if (trendField) qs.set('field_id', trendField);
    if (trendNutrient) qs.set('nutrient', trendNutrient);
    const r = await fetch(`${API}/api/soil-tests/trends?${qs}`, { headers: authH() });
    if (r.ok) setTrends(await r.json());
  }, [trendField, trendNutrient]);

  const fetchDeficiencies = useCallback(async () => {
    const r = await fetch(`${API}/api/soil-tests/deficiency-report`, { headers: authH() });
    if (r.ok) setDeficiencies(await r.json());
  }, []);

  const fetchDetail = useCallback(async (id) => {
    const r = await fetch(`${API}/api/soil-tests/tests/${id}`, { headers: authH() });
    if (r.ok) setTestDetail(await r.json());
  }, []);

  useEffect(() => {
    if (tab === 'Tests') fetchTests();
    else if (tab === 'By Field') fetchByField();
    else if (tab === 'Trends') fetchTrends();
    else if (tab === 'Deficiency Report') fetchDeficiencies();
  }, [tab]);

  useEffect(() => {
    if (tab === 'Trends') fetchTrends();
  }, [trendField, trendNutrient]);

  useEffect(() => {
    if (selectedTest) fetchDetail(selectedTest);
    else setTestDetail(null);
  }, [selectedTest, fetchDetail]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Soil Test Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">Lab results, nutrient ratings, trends, and amendment recommendations</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="text-sm px-4 py-1.5 rounded-lg bg-amber-700 text-white hover:bg-amber-800">
          + Add Test
        </button>
      </div>

      <div className="bg-white border-b px-6 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-amber-700 text-amber-800' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          {tab === 'Tests' && (
            <TestsTab tests={tests} loading={loading} selected={selectedTest} onSelect={setSelectedTest} />
          )}
          {tab === 'By Field' && <ByFieldTab data={byField} />}
          {tab === 'Trends' && (
            <TrendsTab trends={trends} fieldId={trendField} nutrient={trendNutrient}
              fields={byField} onFieldChange={setTrendField} onNutrientChange={setTrendNutrient} />
          )}
          {tab === 'Deficiency Report' && <DeficiencyTab deficiencies={deficiencies} />}
        </div>

        {selectedTest && testDetail && (
          <TestDetailPanel detail={testDetail} onClose={() => setSelectedTest(null)} />
        )}
      </div>

      {showAdd && (
        <AddTestModal onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); fetchTests(); }} />
      )}

      <SaigeWidget businessId={bid} pageContext="Soil Test Records" />
    </div>
  );
}

function TestsTab({ tests, loading, selected, onSelect }) {
  if (loading) return <div className="text-gray-400 text-sm">Loading…</div>;
  if (!tests.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">🧪</div>
      <p className="font-medium text-gray-500">No soil tests yet</p>
      <p className="text-sm mt-1">Add your first lab result to get started.</p>
    </div>
  );
  return (
    <div className="space-y-2 max-w-3xl">
      {tests.map(t => (
        <div key={t.TestID}
          onClick={() => onSelect(t.TestID === selected ? null : t.TestID)}
          className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
            selected === t.TestID ? 'border-amber-400 ring-1 ring-amber-300' : 'border-gray-200'
          }`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{t.FieldName || 'Unknown Field'}</span>
                {t.CropName && <span className="text-xs text-gray-400">— {t.CropName}</span>}
                {t.LowCount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    {t.LowCount} deficient
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t.SampleDate} · {t.LabName || 'No lab'} · {t.SampleType || 'composite'}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {t.ResultCount ?? 0} nutrients tested · Depth: {t.DepthCmTop}–{t.DepthCmBottom} cm
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ByFieldTab({ data }) {
  if (!data.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">🌱</div>
      <p className="font-medium text-gray-500">No field data yet</p>
    </div>
  );
  return (
    <div className="max-w-3xl bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="text-left px-4 py-3">Field</th>
            <th className="text-left px-4 py-3">Latest Test</th>
            <th className="text-right px-4 py-3">Total Tests</th>
            <th className="text-right px-4 py-3">Deficiencies</th>
          </tr>
        </thead>
        <tbody>
          {data.map((f, i) => (
            <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{f.FieldName || f.FieldID || '—'}</div>
              </td>
              <td className="px-4 py-3 text-gray-500">{f.LatestTestDate || '—'}</td>
              <td className="px-4 py-3 text-right">{f.TotalTests}</td>
              <td className="px-4 py-3 text-right">
                {f.DeficiencyCount > 0 ? (
                  <span className="text-red-600 font-semibold">{f.DeficiencyCount}</span>
                ) : (
                  <span className="text-green-600">0</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendsTab({ trends, fields, fieldId, nutrient, onFieldChange, onNutrientChange }) {
  const data = trends?.trends?.[nutrient] || [];
  const vals = data.map(r => Number(r.Value));
  const minV = vals.length ? Math.min(...vals) : 0;
  const maxV = vals.length ? Math.max(...vals) : 1;
  const range = maxV - minV || 1;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Field</label>
          <select value={fieldId} onChange={e => onFieldChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48">
            <option value="">All Fields</option>
            {fields.map((f, i) => (
              <option key={i} value={f.FieldID}>{f.FieldName || f.FieldID}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nutrient</label>
          <select value={nutrient} onChange={e => onNutrientChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40">
            {NUTRIENTS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">{nutrient} over time</h3>
          <div className="flex items-end gap-2 h-40 px-2">
            {data.map((r, i) => {
              const h = ((Number(r.Value) - minV) / range) * 100;
              return (
                <div key={i} className="flex flex-col items-center flex-1 min-w-0"
                  title={`${r.SampleDate}: ${r.Value} ${r.Unit || ''} (${r.Rating || '?'})`}>
                  <div className={`w-full rounded-t transition-all ${
                    r.Rating === 'optimal' ? 'bg-green-400' :
                    r.Rating === 'low' || r.Rating === 'very_low' ? 'bg-red-400' :
                    r.Rating === 'high' || r.Rating === 'very_high' ? 'bg-blue-400' : 'bg-gray-300'
                  }`} style={{ height: `${Math.max(h, 3)}%` }} />
                  <div className="text-xs text-gray-400 mt-1 truncate w-full text-center"
                    style={{ fontSize: '10px' }}>
                    {r.SampleDate?.slice(0, 7)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 space-y-1">
            {data.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                <span>{r.SampleDate} · {r.FieldName}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.Value} {r.Unit || ''}</span>
                  <RatingBadge rating={r.Rating} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>No trend data for {nutrient}.</p>
        </div>
      )}
    </div>
  );
}

function DeficiencyTab({ deficiencies }) {
  if (!deficiencies.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">✅</div>
      <p className="font-medium text-gray-600">No deficiencies found</p>
      <p className="text-sm mt-1">Latest tests per field show all nutrients in acceptable range.</p>
    </div>
  );
  return (
    <div className="space-y-3 max-w-3xl">
      <p className="text-sm text-gray-500">Latest test per field — nutrients rated Low or Very Low only.</p>
      {deficiencies.map((d, i) => (
        <div key={i} className="bg-white rounded-xl border border-orange-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{d.Nutrient}</span>
                <RatingBadge rating={d.Rating} />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {d.FieldName} {d.CropName ? `· ${d.CropName}` : ''} · {d.SampleDate}
              </div>
              <div className="text-xs text-gray-700 mt-1">
                Value: {d.Value} {d.Unit || ''}
              </div>
              {d.Recommendation && (
                <div className="text-xs text-blue-700 mt-1">{d.Recommendation}</div>
              )}
              {d.AmendmentProductSuggested && (
                <div className="text-xs text-green-700 mt-0.5">
                  Suggested: {d.AmendmentProductSuggested}
                  {d.AmendmentRatePerHa != null && ` @ ${d.AmendmentRatePerHa} ${d.AmendmentRateUnit || ''}/ha`}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TestDetailPanel({ detail, onClose }) {
  return (
    <div className="w-96 shrink-0 bg-white border-l border-gray-200 overflow-auto p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Test Detail</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>
      <div className="text-sm space-y-1 text-gray-600 mb-4">
        <div><span className="font-medium">Field:</span> {detail.FieldName || '—'}</div>
        <div><span className="font-medium">Sample Date:</span> {detail.SampleDate}</div>
        <div><span className="font-medium">Lab:</span> {detail.LabName || '—'}</div>
        <div><span className="font-medium">Ref:</span> {detail.LabReference || '—'}</div>
        <div><span className="font-medium">Type:</span> {detail.SampleType || '—'}</div>
        <div><span className="font-medium">Depth:</span> {detail.DepthCmTop}–{detail.DepthCmBottom} cm</div>
        {detail.CropName && <div><span className="font-medium">Crop:</span> {detail.CropName}</div>}
        {detail.Notes && <div className="pt-2 text-gray-500 italic">{detail.Notes}</div>}
      </div>

      {detail.deficiencies?.length > 0 && (
        <div className="mb-3 p-3 bg-red-50 rounded-lg">
          <p className="text-xs font-semibold text-red-700 mb-1">Deficiencies ({detail.deficiencies.length})</p>
          {detail.deficiencies.map(r => (
            <div key={r.ResultID} className="text-xs text-red-600">{r.Nutrient}: {r.Value} {r.Unit || ''} ({r.Rating.replace('_', ' ')})</div>
          ))}
        </div>
      )}

      <h4 className="font-semibold text-gray-800 text-sm mb-2">All Results</h4>
      <div className="space-y-1">
        {detail.results?.map(r => (
          <div key={r.ResultID} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
            <span className="font-medium text-gray-700">{r.Nutrient}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{r.Value} {r.Unit || ''}</span>
              <RatingBadge rating={r.Rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddTestModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    field_id: '', field_name: '', sample_date: new Date().toISOString().slice(0, 10),
    lab_name: '', lab_reference: '', sample_type: 'composite',
    depth_cm_top: 0, depth_cm_bottom: 30, crop_name: '',
    target_yield: '', gps_lat: '', gps_lon: '', notes: '',
  });
  const [results, setResults] = useState([]);
  const [saving, setSaving] = useState(false);

  const F = ({ label, name, type = 'text' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name] ?? ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
    </div>
  );

  const addResult = () => setResults(r => [...r, { nutrient: 'pH', value: '', unit: '', recommendation: '' }]);
  const updateResult = (i, field, val) => setResults(r => r.map((x, j) => j === i ? { ...x, [field]: val } : x));
  const removeResult = (i) => setResults(r => r.filter((_, j) => j !== i));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        depth_cm_top: Number(form.depth_cm_top),
        depth_cm_bottom: Number(form.depth_cm_bottom),
        gps_lat: form.gps_lat ? Number(form.gps_lat) : null,
        gps_lon: form.gps_lon ? Number(form.gps_lon) : null,
        results: results.map(r => ({
          ...r,
          value: Number(r.value),
          unit: r.unit || null,
          recommendation: r.recommendation || null,
        })).filter(r => !isNaN(r.value) && r.nutrient),
      };
      const r = await fetch(`${API}/api/soil-tests/tests`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add Soil Test</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <F label="Sample Date *" name="sample_date" type="date" />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sample Type</label>
              <select value={form.sample_type} onChange={e => setForm(f => ({ ...f, sample_type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {SAMPLE_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <F label="Field ID" name="field_id" />
            <F label="Field Name" name="field_name" />
            <F label="Lab Name" name="lab_name" />
            <F label="Lab Reference" name="lab_reference" />
            <F label="Depth Top (cm)" name="depth_cm_top" type="number" />
            <F label="Depth Bottom (cm)" name="depth_cm_bottom" type="number" />
            <F label="Crop Name" name="crop_name" />
            <F label="Target Yield" name="target_yield" />
            <F label="GPS Lat" name="gps_lat" type="number" />
            <F label="GPS Lon" name="gps_lon" type="number" />
          </div>
          <F label="Notes" name="notes" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Nutrient Results</label>
              <button onClick={addResult}
                className="text-xs px-3 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100">
                + Add Nutrient
              </button>
            </div>
            {results.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600">Result {i + 1}</span>
                  <button onClick={() => removeResult(i)} className="text-xs text-red-500">Remove</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nutrient</label>
                    <select value={r.nutrient} onChange={e => updateResult(i, 'nutrient', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs">
                      {NUTRIENTS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Value *</label>
                    <input type="number" value={r.value} onChange={e => updateResult(i, 'value', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Unit</label>
                    <input value={r.unit} onChange={e => updateResult(i, 'unit', e.target.value)}
                      placeholder="mg/kg, %…"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-500 mb-1">Recommendation</label>
                  <input value={r.recommendation} onChange={e => updateResult(i, 'recommendation', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.sample_date}
            className="px-5 py-2 rounded-lg bg-amber-700 text-white text-sm hover:bg-amber-800 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
