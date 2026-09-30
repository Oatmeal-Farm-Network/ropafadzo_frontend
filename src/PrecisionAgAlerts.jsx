import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, useAnalyses, getIndex, API_URL } from './precisionAgUtils';

const SEV_COLOR = {
  Critical: { bg: '#F9E8EE', text: '#6B1229', dot: '#9B1B4B' },
  High:     { bg: '#FCE7F3', text: '#9D174D', dot: '#DB2777' },
  Medium:   { bg: '#FEF9C3', text: '#854D0E', dot: '#CA8A04' },
  Low:      { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
};

const SI = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const TYPE_ICON = {
  Health: (
    <SI><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></SI>
  ),
  'NDVI Decline': (
    <SI>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </SI>
  ),
  Scouting: (
    <SI>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </SI>
  ),
  Pest: (
    <SI>
      <circle cx="12" cy="11" r="4"/>
      <path d="M12 7V4"/>
      <path d="M8.5 9.5L5 7"/>
      <path d="M15.5 9.5L19 7"/>
      <path d="M8.5 14L5 17"/>
      <path d="M15.5 14L19 17"/>
    </SI>
  ),
  Disease: (
    <SI>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      <path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12"/>
    </SI>
  ),
  Weed: (
    <SI>
      <path d="M17 8C8 10 5.9 16.17 3.82 20.99"/>
      <path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/>
      <path d="M17 8c0 6-5 9-5 9"/>
    </SI>
  ),
  Irrigation: (
    <SI><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></SI>
  ),
  Nutrient: (
    <SI>
      <path d="M12 22V12"/>
      <path d="M12 12C12 7 8 4 4 4c0 4 2 8 8 8z"/>
      <path d="M12 12c0-5 4-8 8-8c0 4-2 8-8 8z"/>
    </SI>
  ),
};

const DEFAULT_ICON = (
  <SI>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </SI>
);

function AlertCard({ alert, onDismiss }) {
  const { t } = useTranslation();
  const sev = SEV_COLOR[alert.severity] || SEV_COLOR.Low;
  const icon = TYPE_ICON[alert.type] || DEFAULT_ICON;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: sev.bg, color: sev.dot }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mont text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: sev.bg, color: sev.text }}>
            {t('precision_ag_alerts.sev_' + alert.severity.toLowerCase(), { defaultValue: alert.severity })}
          </span>
          <span className="font-mont text-xs text-gray-500">
            {t('precision_ag_alerts.type_' + alert.type.toLowerCase().replace(/\s+/g, '_'), { defaultValue: alert.type })}
          </span>
          <span className="font-mont text-xs text-gray-400 ml-auto">{alert.date}</span>
        </div>
        <p className="font-mont text-sm text-gray-800 mt-1">{alert.message}</p>
        {alert.source && (
          <p className="font-mont text-xs text-gray-400 mt-0.5 capitalize">
            {t('precision_ag_alerts.source_label', { source: alert.source.replace('_', ' ') })}
          </p>
        )}
      </div>
      <button onClick={() => onDismiss(alert.alert_id)}
        className="text-gray-300 hover:text-gray-500 text-lg leading-none flex-shrink-0 mt-0.5"
        title={t('precision_ag_alerts.dismiss_title')}>
        ×
      </button>
    </div>
  );
}

// ─── Change Detection ─────────────────────────────────────────────────────────
const CD_INDICES = ['NDVI', 'NDRE', 'EVI', 'NDWI'];
const CD_THRESHOLD = 0.06; // significant single-index change

const COMPOUND_RULES = [
  { keys: ['NDVI', 'NDRE'], label: 'N-deficiency / Disease onset',    icon: '🍃', severity: 'High'   },
  { keys: ['NDVI', 'NDWI'], label: 'Drought stress',                  icon: '🌵', severity: 'High'   },
  { keys: ['NDVI', 'EVI'],  label: 'General canopy decline',           icon: '📉', severity: 'Medium' },
  { keys: ['NDRE', 'NDWI'], label: 'Nutrient & water co-stress',      icon: '⚠️', severity: 'High'   },
];

function detectAnomalies(newer, older) {
  if (!newer || !older) return [];
  const deltas = CD_INDICES.map(idx => {
    const v1 = getIndex(newer, idx)?.mean;
    const v2 = getIndex(older, idx)?.mean;
    if (v1 == null || v2 == null) return null;
    return { idx, delta: v1 - v2, v1, v2 };
  }).filter(Boolean);

  const declining = deltas.filter(d => d.delta < -CD_THRESHOLD);
  const rising    = deltas.filter(d => d.delta >  CD_THRESHOLD);

  const anomalies = [];
  for (const rule of COMPOUND_RULES) {
    const matched = rule.keys.every(k => declining.some(d => d.idx === k));
    if (matched) {
      const deltas_ = rule.keys.map(k => deltas.find(d => d.idx === k));
      anomalies.push({ ...rule, deltas: deltas_, type: 'compound' });
    }
  }
  // Single-index severe drop (> 2× threshold) not already covered
  const coveredKeys = new Set(anomalies.flatMap(a => a.keys));
  for (const d of declining) {
    if (!coveredKeys.has(d.idx) && Math.abs(d.delta) > CD_THRESHOLD * 2) {
      anomalies.push({
        keys: [d.idx], label: `${d.idx} significant decline`, icon: '📊',
        severity: Math.abs(d.delta) > 0.15 ? 'High' : 'Medium',
        deltas: [d], type: 'single',
      });
    }
  }
  // Notable recovery
  for (const d of rising) {
    if (d.delta > CD_THRESHOLD * 1.5) {
      anomalies.push({
        keys: [d.idx], label: `${d.idx} recovery / improvement`, icon: '✅',
        severity: 'Low', deltas: [d], type: 'recovery',
      });
    }
  }
  return anomalies;
}

function DeltaBar({ delta, maxAbs = 0.3 }) {
  const pct = Math.min(Math.abs(delta) / maxAbs, 1) * 100;
  const color = delta < 0 ? '#EF4444' : '#22C55E';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: color,
            left: delta < 0 ? 'auto' : '50%',
            right: delta < 0 ? `${50 - pct / 2}%` : 'auto',
          }}
        />
        <div className="absolute left-1/2 top-0 w-px h-full bg-gray-300" />
      </div>
      <span className="font-mono text-xs font-bold w-14 text-right" style={{ color }}>
        {delta > 0 ? '+' : ''}{delta.toFixed(3)}
      </span>
    </div>
  );
}

function ChangeDetectionPanel({ fieldId, onGenerateAlert }) {
  const { analyses } = useAnalyses(fieldId);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(false);

  const newer = analyses[0] || null;
  const older = analyses[1] || null;
  const anomalies = detectAnomalies(newer, older);

  const allDeltas = CD_INDICES.map(idx => {
    const v1 = newer ? getIndex(newer, idx)?.mean : null;
    const v2 = older ? getIndex(older, idx)?.mean : null;
    return { idx, delta: v1 != null && v2 != null ? v1 - v2 : null, v1, v2 };
  });

  const [generateError, setGenerateError] = useState('');

  const handleGenerate = async (anomaly) => {
    setGenerating(true);
    setGenerateError('');
    try {
      const res = await fetch(`${API_URL}/api/fields/${fieldId}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        body: JSON.stringify({
          type: anomaly.label,
          severity: anomaly.severity,
          message: `Change detection: ${anomaly.label}. Indices: ${anomaly.deltas.map(d => `${d.idx} ${d.delta > 0 ? '+' : ''}${d.delta.toFixed(3)}`).join(', ')}`,
          source: 'change_detection',
        }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setGenerated(true);
      onGenerateAlert?.();
      setTimeout(() => setGenerated(false), 3000);
    } catch (err) {
      setGenerateError('Could not create alert. Please try again.');
    }
    setGenerating(false);
  };

  if (!newer || !older) return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Change Detection</h3>
      <p className="font-mont text-sm text-gray-400">Needs at least 2 analyses for this field.</p>
    </div>
  );

  const d1 = new Date(newer.analysis_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const d2 = new Date(older.analysis_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-mont text-sm font-bold text-gray-700 uppercase tracking-wide">Change Detection</h3>
          <p className="font-mont text-xs text-gray-400 mt-0.5">
            Multi-index delta: <span className="font-semibold text-gray-600">{d2}</span> → <span className="font-semibold text-[#3D6B34]">{d1}</span>
          </p>
        </div>
        {anomalies.length > 0 && (
          <span className="px-2 py-1 rounded-full text-xs font-mont font-bold bg-red-100 text-red-700 border border-red-200">
            {anomalies.filter(a => a.type !== 'recovery').length} anomal{anomalies.filter(a => a.type !== 'recovery').length === 1 ? 'y' : 'ies'} detected
          </span>
        )}
      </div>

      {/* Delta bars */}
      <div className="space-y-2">
        {allDeltas.map(({ idx, delta, v1 }) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-gray-500 w-14 shrink-0">{idx}</span>
            {delta != null ? (
              <div className="flex-1"><DeltaBar delta={delta} /></div>
            ) : (
              <span className="font-mont text-xs text-gray-300 italic">no data</span>
            )}
            {v1 != null && (
              <span className="font-mono text-xs text-gray-400 w-14 text-right shrink-0">{v1.toFixed(3)}</span>
            )}
          </div>
        ))}
      </div>

      {/* Anomaly cards */}
      {anomalies.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-gray-100">
          <div className="font-mont text-xs font-semibold text-gray-500 uppercase tracking-wide">Detected anomalies</div>
          {generateError && (
            <div className="text-xs font-mont text-red-600 bg-red-50 rounded px-3 py-2">{generateError}</div>
          )}
          {anomalies.map((a, i) => {
            const sevColor = SEV_COLOR[a.severity] || SEV_COLOR.Low;
            return (
              <div key={i} className="rounded-lg border p-3 flex items-start justify-between gap-3"
                style={{ background: sevColor.bg, borderColor: sevColor.dot + '50' }}>
                <div className="flex items-start gap-2">
                  <span className="text-base">{a.icon}</span>
                  <div>
                    <div className="font-mont text-sm font-bold" style={{ color: sevColor.text }}>{a.label}</div>
                    <div className="font-mono text-xs mt-0.5" style={{ color: sevColor.text, opacity: 0.75 }}>
                      {a.deltas.map(d => `${d.idx}: ${d.delta > 0 ? '+' : ''}${d.delta.toFixed(3)}`).join('  ·  ')}
                    </div>
                  </div>
                </div>
                {a.type !== 'recovery' && (
                  <button
                    onClick={() => handleGenerate(a)}
                    disabled={generating}
                    className="shrink-0 px-3 py-1.5 rounded-lg font-mont font-semibold text-xs border transition-all disabled:opacity-50"
                    style={{ background: 'white', color: sevColor.text, borderColor: sevColor.dot + '80' }}>
                    {generated ? '✓ Created' : generating ? '…' : 'Create alert'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {anomalies.length === 0 && (
        <div className="flex items-center gap-2 text-sm font-mont text-green-700 bg-green-50 rounded-lg px-4 py-3 border border-green-200">
          <span>✅</span>
          <span>No multi-layer anomalies between these two dates.</span>
        </div>
      )}
    </div>
  );
}

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || '/saige';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

function PushSubscriptionButton() {
  const [status, setStatus] = useState('idle'); // idle|requesting|subscribing|active|denied|unsupported|error

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported'); return;
    }
    if (Notification.permission === 'denied') { setStatus('denied'); return; }
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready
        .then(reg => reg.pushManager.getSubscription())
        .then(sub => { if (sub) setStatus('active'); })
        .catch(() => {});
    }
  }, []);

  const subscribe = async () => {
    setStatus('requesting');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { setStatus('denied'); return; }
      setStatus('subscribing');
      const keyRes = await fetch(`${SAIGE_API}/push/public-key`);
      const { public_key } = await keyRes.json();
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(public_key),
      });
      const peopleId = localStorage.getItem('people_id') || localStorage.getItem('PeopleID') || '';
      const token = localStorage.getItem('access_token');
      await fetch(`${SAIGE_API}/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: peopleId,
          subscription: sub.toJSON(),
          tags: ['precision_ag_alerts'],
        }),
      });
      setStatus('active');
    } catch (err) {
      console.warn('[push] subscribe failed:', err);
      setStatus(Notification.permission === 'denied' ? 'denied' : 'error');
    }
  };

  if (status === 'unsupported') return null;
  if (status === 'active') return (
    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200 font-mont text-sm text-green-700">
      <span>🔔</span> Push alerts active
    </div>
  );
  if (status === 'denied') return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 font-mont text-xs text-gray-500">
      Notifications blocked — enable in browser settings
    </div>
  );
  if (status === 'error') return (
    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-200 font-mont text-xs text-red-600">
      Push setup failed — try again
    </div>
  );
  return (
    <button onClick={subscribe} disabled={status === 'requesting' || status === 'subscribing'}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-mont font-semibold text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60">
      <span>🔔</span> {status === 'requesting' ? 'Requesting…' : status === 'subscribing' ? 'Subscribing…' : 'Enable push alerts'}
    </button>
  );
}

export default function PrecisionAgAlerts() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('ag_dismissed_alerts') || '[]')); }
    catch { return new Set(); }
  });

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  const load = useCallback(async () => {
    if (!selectedFieldId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/alerts`);
      const data = r.ok ? await r.json() : { alerts: [] };
      setAlerts(data.alerts || []);
    } catch { setAlerts([]); }
    setLoading(false);
  }, [selectedFieldId]);

  useEffect(() => { load(); }, [load]);

  const dismiss = (id) => {
    const next = new Set([...dismissed, id]);
    setDismissed(next);
    localStorage.setItem('ag_dismissed_alerts', JSON.stringify([...next]));
  };

  const visible = alerts.filter(a => !dismissed.has(a.alert_id));
  const bySeverity = (s) => visible.filter(a => a.severity === s);

  const counts = {
    Critical: bySeverity('Critical').length,
    High:     bySeverity('High').length,
    Medium:   bySeverity('Medium').length,
    Low:      bySeverity('Low').length,
  };

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={t('precision_ag_alerts.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to:'/dashboard' }, { label: t('precision_ag_alerts.breadcrumb_precision_ag') }, { label: t('precision_ag_alerts.page_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{t('precision_ag_alerts.heading')}</h1>
            <p className="font-mont text-sm text-gray-500">{t('precision_ag_alerts.subheading')}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <PushSubscriptionButton />
            <button onClick={load} className="px-4 py-2 text-sm font-mont font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
              {t('precision_ag_alerts.btn_refresh')}
            </button>
          </div>
        </div>

        {/* Field selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="text-xs font-semibold font-mont text-gray-500 block mb-1">{t('precision_ag_alerts.field_label')}</label>
          <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
            {fields.length === 0 && <option value="">{t('precision_ag_alerts.no_fields')}</option>}
            {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
          </select>
        </div>

        {/* Change detection */}
        {selectedFieldId && (
          <ChangeDetectionPanel fieldId={selectedFieldId} onGenerateAlert={load} />
        )}

        {/* Summary pills */}
        {!loading && visible.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {['Critical','High','Medium','Low'].map(sev => {
              const c = SEV_COLOR[sev];
              return (
                <div key={sev} className="rounded-xl border p-3 text-center"
                  style={{ background: c.bg + '80', borderColor: c.dot + '40' }}>
                  <div className="font-mont text-2xl font-bold" style={{ color: c.text }}>{counts[sev]}</div>
                  <div className="font-mont text-xs" style={{ color: c.text }}>
                    {t('precision_ag_alerts.sev_' + sev.toLowerCase(), { defaultValue: sev })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{t('precision_ag_alerts.loading')}</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <div className="font-lora text-xl text-gray-600 mb-2">{t('precision_ag_alerts.no_alerts_title')}</div>
            <div className="font-mont text-sm text-gray-400">{t('precision_ag_alerts.no_alerts_body')}</div>
          </div>
        ) : (
          <div className="space-y-3">
            {['Critical','High','Medium','Low'].flatMap(sev =>
              bySeverity(sev).map(a => <AlertCard key={a.alert_id} alert={a} onDismiss={dismiss} />)
            )}
            {dismissed.size > 0 && (
              <button onClick={() => {
                setDismissed(new Set());
                localStorage.removeItem('ag_dismissed_alerts');
              }} className="font-mont text-xs text-gray-400 hover:text-gray-600 underline">
                {t('precision_ag_alerts.restore_dismissed', { count: dismissed.size })}
              </button>
            )}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
