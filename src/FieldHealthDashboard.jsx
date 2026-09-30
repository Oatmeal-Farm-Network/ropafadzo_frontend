import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
function tok() { return localStorage.getItem('access_token'); }
function auth() { return { Authorization: `Bearer ${tok()}` }; }

const EVENT_COLORS = {
  spray:     { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500',  label: 'Spray' },
  scouting:  { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500', label: 'Scouting' },
  irrigation:{ bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500',   label: 'Irrigation' },
  activity:  { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500', label: 'Activity' },
  nutrient:  { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: 'Nutrient' },
};

function severityColor(s) {
  if (!s) return 'bg-gray-100 text-gray-600';
  if (s >= 5) return 'bg-red-100 text-red-700';
  if (s >= 3) return 'bg-orange-100 text-orange-700';
  return 'bg-green-100 text-green-700';
}
function severityLabel(s) {
  if (!s) return 'None';
  if (s >= 5) return 'Critical';
  if (s >= 4) return 'High';
  if (s >= 3) return 'Moderate';
  return 'Low';
}
function soilColor(r) {
  if (!r) return 'bg-gray-100 text-gray-600';
  const l = (r || '').toLowerCase();
  if (l.includes('excel')) return 'bg-green-100 text-green-700';
  if (l.includes('good'))  return 'bg-lime-100 text-lime-700';
  if (l.includes('fair'))  return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}
function relDate(d) {
  if (!d) return '—';
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 30)  return `${diff}d ago`;
  return new Date(d).toLocaleDateString();
}

function FieldCard({ field, bid, onSelect }) {
  const sev = field.scouting_severity;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
         onClick={() => onSelect(field)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 truncate">{field.field_name}</h3>
        {field.active_alert_count > 0 && (
          <span className="shrink-0 ml-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {field.active_alert_count} alert{field.active_alert_count > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-gray-500 mb-0.5">Pest Pressure</div>
          <span className={`px-2 py-0.5 rounded-full font-medium ${severityColor(sev)}`}>
            {severityLabel(sev)}
          </span>
        </div>
        <div>
          <div className="text-gray-500 mb-0.5">Soil Health</div>
          <span className={`px-2 py-0.5 rounded-full font-medium ${soilColor(field.soil_rating)}`}>
            {field.soil_rating || 'No test'}
          </span>
        </div>
        {field.phi_active_count > 0 && (
          <div className="col-span-2">
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              ⚠ {field.phi_active_count} PHI active
            </span>
          </div>
        )}
        <div>
          <div className="text-gray-500">Last Activity</div>
          <div className="text-gray-700">{relDate(field.last_activity_date)}</div>
          {field.last_activity_type && (
            <div className="text-gray-500 capitalize">{field.last_activity_type}</div>
          )}
        </div>
        <div>
          <div className="text-gray-500">Last Irrigation</div>
          <div className="text-gray-700">{relDate(field.last_irrigation_date)}</div>
          {field.last_irrigation_mm && (
            <div className="text-gray-500">{field.last_irrigation_mm} mm</div>
          )}
        </div>
      </div>
      <div className="mt-3 text-xs text-blue-600 hover:underline">View field detail →</div>
    </div>
  );
}

function TimelineEvent({ ev }) {
  const c = EVENT_COLORS[ev.event_type] || EVENT_COLORS.activity;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${c.dot}`} />
        <div className="w-px flex-1 bg-gray-200 mt-1" />
      </div>
      <div className="pb-4 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.text}`}>{c.label}</span>
          <span className="text-xs text-gray-500">{ev.event_date}</span>
          {ev.field_name && <span className="text-xs text-gray-400 truncate">{ev.field_name}</span>}
        </div>
        <div className="text-sm font-medium text-gray-900">{ev.title}</div>
        {ev.detail && <div className="text-xs text-gray-500 mt-0.5">{ev.detail}</div>}
      </div>
    </div>
  );
}

function FieldDetail({ field, bid, onBack }) {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/field-health/summary?business_id=${bid}&field_id=${field.field_id}`, { headers: auth() })
      .then(r => r.ok ? r.json() : null).then(setSummary).catch(() => {});
  }, [field.field_id, bid]);

  return (
    <div>
      <button onClick={onBack} className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1">
        ← All Fields
      </button>
      <h2 className="text-lg font-bold text-gray-900 mb-4">{field.field_name}</h2>
      {!summary ? (
        <div className="text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Active Alerts */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Active Scouting Alerts</h4>
            {summary.active_alerts.length === 0 ? (
              <p className="text-xs text-gray-400">No active alerts</p>
            ) : summary.active_alerts.map((a, i) => (
              <div key={i} className="flex items-center gap-2 py-1 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0
                  ${a.severity >= 5 ? 'bg-red-100 text-red-700' : a.severity >= 3 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {a.severity}
                </span>
                <span className="text-gray-800">{a.pest_name || 'Unknown pest'}</span>
              </div>
            ))}
          </div>

          {/* Soil Test */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Latest Soil Test</h4>
            {!summary.soil_test ? (
              <p className="text-xs text-gray-400">No soil tests on record</p>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-2">{summary.soil_test.test_date} · {summary.soil_test.lab_name}</div>
                <div className="grid grid-cols-2 gap-1">
                  {(summary.soil_test.results || []).map((r, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5 border-b border-gray-100">
                      <span className="text-gray-600">{r.nutrient}</span>
                      <span className={`font-medium ${r.rating === 'Low' || r.rating === 'Very Low' ? 'text-red-600' : 'text-gray-800'}`}>
                        {r.value} {r.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Recent Sprays */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Recent Spray Applications</h4>
            {summary.spray_applications.length === 0 ? (
              <p className="text-xs text-gray-400">No spray records</p>
            ) : summary.spray_applications.map((s, i) => (
              <div key={i} className="py-1 border-b border-gray-100 last:border-0 text-xs">
                <div className="font-medium text-gray-800">{s.ProductName || s.product_name}</div>
                <div className="text-gray-500">
                  {s.ApplicationDate || s.application_date}
                  {(s.PHI_Days || s.phi_days) && ` · PHI: ${s.PHI_Days || s.phi_days}d`}
                </div>
              </div>
            ))}
          </div>

          {/* Irrigation & Nutrients */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Water & Nutrients (90d)</h4>
            {summary.irrigation_90d ? (
              <div className="text-xs text-gray-700 mb-2">
                <span className="font-medium">{summary.irrigation_90d.total_mm} mm</span> applied in{' '}
                {summary.irrigation_90d.events} irrigation event{summary.irrigation_90d.events !== 1 ? 's' : ''}
              </div>
            ) : (
              <div className="text-xs text-gray-400 mb-2">No irrigation events</div>
            )}
            {summary.nutrients_ytd && (
              <div className="grid grid-cols-4 gap-1 mt-2">
                {['N','P','K','S'].map(n => (
                  <div key={n} className="text-center bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-500">{n}</div>
                    <div className="text-sm font-bold text-gray-900">
                      {(summary.nutrients_ytd[`${n}_kg_ha`] || 0).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">kg/ha</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FieldHealthDashboard() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const [tab, setTab] = useState('overview');
  const [fields, setFields] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [timelineDays, setTimelineDays] = useState(90);
  const [tlFieldId, setTlFieldId] = useState('');

  useEffect(() => {
    if (!bid) return;
    fetch(`${API}/api/field-health/fields-overview?business_id=${bid}`, { headers: auth() })
      .then(r => r.ok ? r.json() : []).then(setFields).catch(() => {});
  }, [bid]);

  const loadTimeline = useCallback(() => {
    if (!bid) return;
    setLoading(true);
    const qs = new URLSearchParams({ business_id: bid, days: timelineDays });
    if (tlFieldId) qs.set('field_id', tlFieldId);
    fetch(`${API}/api/field-health/timeline?${qs}`, { headers: auth() })
      .then(r => r.ok ? r.json() : []).then(setTimeline)
      .catch(() => {}).finally(() => setLoading(false));
  }, [bid, timelineDays, tlFieldId]);

  useEffect(() => { if (tab === 'timeline') loadTimeline(); }, [tab, loadTimeline]);

  const tabs = ['overview', 'timeline'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Field Health Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Unified view of all field activity — scouting, spray, irrigation, soil, nutrients</p>
      </div>

      <div className="border-b bg-white px-6">
        <div className="flex gap-6">
          {tabs.map(t => (
            <button key={t} onClick={() => { setTab(t); setSelectedField(null); }}
              className={`py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-6xl">

        {tab === 'overview' && !selectedField && (
          <>
            {fields.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🌾</div>
                <p>No field data yet. Log spray applications, scouting records, or field activities to see health cards here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {fields.map(f => (
                  <FieldCard key={f.field_id} field={f} bid={bid} onSelect={setSelectedField} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'overview' && selectedField && (
          <FieldDetail field={selectedField} bid={bid} onBack={() => setSelectedField(null)} />
        )}

        {tab === 'timeline' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-5">
              <select value={tlFieldId} onChange={e => setTlFieldId(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                <option value="">All Fields</option>
                {fields.map(f => <option key={f.field_id} value={f.field_id}>{f.field_name}</option>)}
              </select>
              <select value={timelineDays} onChange={e => setTimelineDays(+e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                {[30,60,90,180,365].map(d => <option key={d} value={d}>Last {d} days</option>)}
              </select>
              <button onClick={loadTimeline}
                className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700">
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-gray-400 text-sm">Loading…</div>
            ) : timeline.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">📋</div>
                <p>No events in the selected period.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex flex-wrap gap-3 mb-4 text-xs">
                  {Object.entries(EVENT_COLORS).map(([k, c]) => (
                    <span key={k} className={`px-2 py-1 rounded-full ${c.bg} ${c.text} font-medium`}>{c.label}</span>
                  ))}
                </div>
                <div>
                  {timeline.map((ev, i) => <TimelineEvent key={i} ev={ev} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <SaigeWidget businessId={bid} pageContext="Field Health Dashboard" />
    </div>
  );
}
