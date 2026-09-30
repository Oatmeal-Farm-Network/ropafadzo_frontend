/**
 * AggregatorESG — automated, audit-ready proof of sustainable practices.
 *
 * Four tabs:
 *  - Live snapshot : auto-aggregated metrics from existing tables
 *  - Manual metrics : CRUD for everything we don't track automatically
 *  - Generate report : pick a period, snapshot live + manual into a saved record
 *  - Saved reports : list previous snapshots, view HTML, download PDF, delete
 *
 * The live snapshot pulls from OFNAggregator{Farm,Purchase,Input,Logistics,
 * Inventory} + OFNESGSensorReading. PDF and HTML are server-rendered so
 * audit-time numbers always match generation-time numbers.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const CATEGORIES = ['environmental', 'social', 'governance'];

const S = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    {children}
  </svg>
);

const ICONS = {
  environmental: <S><path d="M3 13c1-5 4-8 9-9"/><path d="M3 13c2-3 5-5 9-6"/></S>,
  social:        <S><circle cx="5.5" cy="5" r="2"/><circle cx="10.5" cy="5" r="2"/><path d="M1 14c0-2.5 1.8-3.5 4.5-3.5h5c2.7 0 4.5 1 4.5 3.5"/></S>,
  governance:    <S><line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="6" x2="14" y2="6"/><path d="M2 6l2.5 4.5a2.5 2.5 0 0 0 4.5 0L11.5 6"/><path d="M7 6l2.5 4.5a2.5 2.5 0 0 0 4.5 0L16.5 6"/></S>,
  sourcing:      <S><path d="M8 14V9"/><path d="M4 6c0-2.5 2-4 4-4s4 1.5 4 4-2 3-4 3-4-.5-4-3z"/></S>,
  procurement:   <S><path d="M2 5l6-3 6 3v6l-6 3-6-3V5z"/><path d="M8 2v12"/><path d="M2 5l6 3 6-3"/></S>,
  inputs:        <S><path d="M14 2l-1.5 1.5L11 2l-1.5 1.5"/><path d="M5 9l4-4 1 1-4 4-1-1z"/><circle cx="4" cy="12" r="1.5"/></S>,
  coldchain:     <S><line x1="8" y1="1" x2="8" y2="15"/><line x1="1" y1="8" x2="15" y2="8"/><line x1="3.5" y1="3.5" x2="12.5" y2="12.5"/><line x1="12.5" y1="3.5" x2="3.5" y2="12.5"/></S>,
  waste:         <S><polyline points="2 4 4 4 14 4"/><path d="M5 4V2.5h6V4"/><path d="M4 4l1 9h6l1-9"/></S>,
  sensors:       <S><circle cx="8" cy="11" r="1.2" fill="currentColor" stroke="none"/><path d="M5.2 8.5a4 4 0 0 1 5.6 0"/><path d="M2.5 6a8 8 0 0 1 11 0"/></S>,
  clipboard:     <S><rect x="4" y="3" width="8" height="11" rx="1"/><path d="M6 3V2h4v1"/><line x1="6" y1="7" x2="10" y2="7"/><line x1="6" y1="9.5" x2="10" y2="9.5"/></S>,
  document:      <S><path d="M4 2h6l4 4v10H4V2z"/><polyline points="10 2 10 6 14 6"/><line x1="6" y1="9" x2="10" y2="9"/><line x1="6" y1="11.5" x2="9" y2="11.5"/></S>,
  paperclip:     <S><path d="M13 5L7 11a2.5 2.5 0 0 1-3.5-3.5l6-6a1.5 1.5 0 0 1 2.1 2.1L5.5 9.7a.5.5 0 0 1-.7-.7L11 3"/></S>,
  check:         <S><circle cx="8" cy="8" r="6"/><polyline points="5 8 7 10 11 6"/></S>,
  download:      <S><path d="M8 2v9"/><polyline points="5 8 8 11 11 8"/><line x1="2" y1="14" x2="14" y2="14"/></S>,
};

const CAT_SVG = {
  environmental: ICONS.environmental,
  social:        ICONS.social,
  governance:    ICONS.governance,
};
const SUGGESTED_KEYS = {
  environmental: [
    ['renewable_energy_pct', '% of operations on renewable energy', '%'],
    ['water_recycled_pct',   '% of process water recycled', '%'],
    ['ghg_offset_t',         'GHG offsets purchased (tCO₂e)', 'tCO2e'],
    ['plastic_diverted_kg',  'Plastic diverted from landfill (kg)', 'kg'],
    ['organic_acres_pct',    '% sourcing acres certified organic', '%'],
  ],
  social: [
    ['fair_wage_premium_paid', 'Fair-wage premium paid above market', '$'],
    ['training_hours_provided','Farmer training hours provided', 'hours'],
    ['workforce_local_pct',    '% of workforce hired locally', '%'],
    ['safety_incidents',       'Recordable safety incidents', 'count'],
  ],
  governance: [
    ['eu_csrd_status',         'EU CSRD reporting status', ''],
    ['ethifinance_rating',     'EthiFinance rating', ''],
    ['iso_14001_certified',    'ISO 14001 certified (Y/N)', ''],
    ['supplier_audits_done',   'Supplier audits completed in period', 'count'],
    ['board_independence_pct', '% of board members independent', '%'],
  ],
};

const fmt$  = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
const fmtKg = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 1 });
const fmtPct = (n) => n == null ? 'n/a' : `${Number(n).toFixed(1)}%`;
const isoDate = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const ninetyDaysAgo = new Date(today.getTime() - 90 * 86400_000);

// ─────────────────────────────────────────────────────────────────
// Live snapshot (read-only, recomputed for the chosen period)
// ─────────────────────────────────────────────────────────────────
function LiveTab({ businessId }) {
  const { t } = useTranslation();
  const [start, setStart] = useState(isoDate(ninetyDaysAgo));
  const [end,   setEnd]   = useState(isoDate(today));
  const [data,  setData]  = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    fetch(`${API}/api/esg/${businessId}/live?start=${start}&end=${end}`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false); });
  };
  useEffect(() => { refresh(); }, [businessId, start, end]);

  if (loading) return <div className="text-sm text-gray-500">{t('aggregator_esg.loading')}</div>;

  const live = data?.live || {};
  const src = live.sourcing || {};
  const proc = live.procurement || {};
  const inputs = live.inputs_to_farms || {};
  const cold = live.cold_chain || {};
  const waste = live.waste || {};
  const sensors = (live.sensors || {}).by_type || [];
  const manual = data?.manual_metrics || [];

  const card = (title, icon, children) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3 text-[#3D6B34]">
        {icon}
        <strong className="text-gray-900">{title}</strong>
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  );
  const kv = (label, value, sub) => (
    <div className="flex justify-between gap-4">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900 text-right">{value}{sub && <div className="text-[10px] text-gray-500 font-normal">{sub}</div>}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 flex-wrap">
        <div><label className={lbl}>{t('aggregator_esg.lbl_period_start')}</label><input className={inp} type="date" value={start} onChange={e => setStart(e.target.value)} /></div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_period_end')}</label><input className={inp} type="date" value={end} onChange={e => setEnd(e.target.value)} /></div>
        <button onClick={refresh} className={btnGhost}>{t('aggregator_esg.btn_refresh')}</button>
        <div className="flex-1" />
        <span className="text-xs text-gray-500">{t('aggregator_esg.live_note')}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {card(t('aggregator_esg.card_sourcing'), ICONS.sourcing, <>
          {kv(t('aggregator_esg.kv_active_farms'),    src.active_farms ?? 0)}
          {kv(t('aggregator_esg.kv_certified_farms'), `${src.farms_certified ?? 0} (${src.certified_pct ?? 0}%)`)}
          {(src.certifications || []).length > 0 && (
            <div className="pt-2 border-t border-gray-100 mt-2">
              {src.certifications.map(c => (
                <div key={c.Certification} className="flex justify-between text-xs">
                  <span className="text-gray-700">{c.Certification}</span>
                  <span className="text-gray-500">{c.N} {t('aggregator_esg.farm_plural', { n: c.N })}</span>
                </div>
              ))}
            </div>
          )}
        </>)}

        {card(t('aggregator_esg.card_procurement'), ICONS.procurement, <>
          {kv(t('aggregator_esg.kv_purchase_records'),   proc.purchase_count ?? 0)}
          {kv(t('aggregator_esg.kv_qty_received'),        `${fmtKg(proc.kg_received)} kg`)}
          {kv(t('aggregator_esg.kv_spend'),               `$${fmt$(proc.spend)}`)}
          {kv(t('aggregator_esg.kv_residue_passed'),      proc.residue_passed ?? 0)}
          {kv(t('aggregator_esg.kv_residue_failed'),      proc.residue_failed ?? 0, t('aggregator_esg.lower_is_better'))}
          {kv(t('aggregator_esg.kv_residue_pass_rate'),   fmtPct(proc.residue_pass_rate_pct))}
        </>)}

        {card(t('aggregator_esg.card_inputs'), ICONS.inputs, <>
          {(inputs.by_type || []).length > 0
            ? (inputs.by_type || []).map(r => (
                <div key={r.InputType} className="flex justify-between text-xs">
                  <span className="text-gray-700">{r.InputType}</span>
                  <span className="text-gray-500">{r.N} · ${fmt$(r.Spend)}</span>
                </div>
              ))
            : <div className="text-xs text-gray-500 italic">{t('aggregator_esg.no_inputs')}</div>}
          <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between font-semibold">
            <span className="text-gray-700">{t('aggregator_esg.kv_total_invested')}</span>
            <span className="text-gray-900">${fmt$(inputs.total_spend)}</span>
          </div>
        </>)}

        {card(t('aggregator_esg.card_cold_chain'), ICONS.coldchain, <>
          {kv(t('aggregator_esg.kv_dispatches'),      cold.dispatches ?? 0)}
          {kv(t('aggregator_esg.kv_cold_breaches'),   cold.breaches ?? 0, t('aggregator_esg.lower_is_better'))}
          {kv(t('aggregator_esg.kv_integrity_rate'),  fmtPct(cold.integrity_pct))}
        </>)}

        {card(t('aggregator_esg.card_waste'), ICONS.waste, <>
          {kv(t('aggregator_esg.kv_items_quarantined'), waste.items_quarantined_or_discarded ?? 0)}
          {kv(t('aggregator_esg.kv_kg_quarantined'),    fmtKg(waste.kg_quarantined_or_discarded))}
        </>)}

        {card(t('aggregator_esg.card_sensors'), ICONS.sensors, <>
          {sensors.length > 0
            ? sensors.map(r => (
                <div key={r.sensor_type} className="flex justify-between text-xs">
                  <span className="text-gray-700">{r.sensor_type}</span>
                  <span className="text-gray-500">{r.readings} · avg {Number(r.avg).toFixed(2)}, range {Number(r.min).toFixed(2)}–{Number(r.max).toFixed(2)}</span>
                </div>
              ))
            : <div className="text-xs text-gray-500 italic">{t('aggregator_esg.no_sensors', { businessId })}</div>}
        </>)}
      </div>

      {manual.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-[#3D6B34]">
            {ICONS.clipboard}
            <strong className="text-gray-900">{t('aggregator_esg.manual_metrics_heading')}</strong>
            <span className="text-xs text-gray-500">({manual.length})</span>
          </div>
          <div className="space-y-2">
            {manual.map(m => (
              <div key={m.MetricID} className="flex items-start gap-2 text-sm border-b border-gray-100 pb-2">
                <span className="text-[#3D6B34] mt-0.5">{CAT_SVG[m.Category] || ICONS.clipboard}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{m.Label}</div>
                  <div className="text-xs text-gray-500">
                    {m.Value} {m.Unit && <span className="text-gray-400">{m.Unit}</span>}
                    {m.PeriodStart && <span> · {(m.PeriodStart || '').slice(0,10)} → {(m.PeriodEnd || '').slice(0,10)}</span>}
                    {m.EvidenceURL && <> · <a href={m.EvidenceURL} target="_blank" rel="noreferrer" className="text-[#3D6B34] hover:underline">{t('aggregator_esg.evidence_link')}</a></>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Manual metrics CRUD
// ─────────────────────────────────────────────────────────────────
function MetricForm({ metric, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(metric || {
    Category: 'environmental', MetricKey: '', Label: '',
    Value: '', NumericValue: '', Unit: '',
    PeriodStart: '', PeriodEnd: '',
    EvidenceURL: '', Notes: '',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  const pickSuggestion = (key, label, unit) => setS(prev => ({ ...prev, MetricKey: key, Label: label, Unit: unit }));
  const sugg = SUGGESTED_KEYS[s.Category] || [];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('aggregator_esg.lbl_category')}</label>
          <select className={inp} value={s.Category} onChange={set('Category')}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select></div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_metric_key')}</label><input className={inp} placeholder="renewable_energy_pct" value={s.MetricKey} onChange={set('MetricKey')} /></div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_unit')}</label><input className={inp} placeholder="% / $ / kg / hours" value={s.Unit || ''} onChange={set('Unit')} /></div>
        <div className="md:col-span-3"><label className={lbl}>{t('aggregator_esg.lbl_label')}</label><input className={inp} placeholder="% of operations on renewable energy" value={s.Label} onChange={set('Label')} /></div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_value')}</label><input className={inp} placeholder="85% / Yes / ISO 14001" value={s.Value || ''} onChange={set('Value')} /></div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_numeric')}</label><input className={inp} type="number" step="0.0001" value={s.NumericValue ?? ''} onChange={setNum('NumericValue')} /></div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_evidence_url')}</label><input className={inp} placeholder="https://… link to certificate / audit doc" value={s.EvidenceURL || ''} onChange={set('EvidenceURL')} /></div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_period_start')}</label><input className={inp} type="date" value={s.PeriodStart || ''} onChange={set('PeriodStart')} /></div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_period_end')}</label><input className={inp} type="date" value={s.PeriodEnd || ''} onChange={set('PeriodEnd')} /></div>
        <div className="md:col-span-3"><label className={lbl}>{t('aggregator_esg.lbl_notes')}</label><textarea className={inp} rows={2} value={s.Notes || ''} onChange={set('Notes')} /></div>
      </div>
      {!metric && sugg.length > 0 && (
        <div className="text-xs text-gray-500">
          <div className="mb-1">{t('aggregator_esg.quick_fill')}</div>
          <div className="flex flex-wrap gap-1.5">
            {sugg.map(([k, l, u]) => (
              <button key={k} type="button" onClick={() => pickSuggestion(k, l, u)}
                      className="border border-gray-200 rounded-full px-2 py-0.5 hover:border-[#819360]">
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('aggregator_esg.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} disabled={!s.MetricKey || !s.Label} className={btn}>{t('aggregator_esg.btn_save')}</button>
      </div>
    </div>
  );
}

function MetricsTab({ businessId }) {
  const { t } = useTranslation();
  const [list, setList]    = useState([]);
  const [editing, setEdit] = useState(null);
  const [adding, setAdd]   = useState(false);
  const [filter, setFilt]  = useState('');

  const refresh = () => {
    const qs = filter ? `?category=${filter}` : '';
    fetch(`${API}/api/esg/${businessId}/metrics${qs}`).then(r => r.json()).then(setList);
  };
  useEffect(() => { refresh(); }, [businessId, filter]);

  const save = async (m) => {
    const isEdit = !!m.MetricID;
    const url = isEdit ? `${API}/api/esg/metrics/${m.MetricID}` : `${API}/api/esg/${businessId}/metrics`;
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(m) });
    if (r.ok) { setEdit(null); setAdd(false); refresh(); } else alert(t('aggregator_esg.err_save_failed'));
  };
  const del = async (id) => {
    if (!window.confirm(t('aggregator_esg.confirm_delete_metric'))) return;
    await fetch(`${API}/api/esg/metrics/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <select className={inp + ' max-w-xs'} value={filter} onChange={e => setFilt(e.target.value)}>
          <option value="">{t('aggregator_esg.filter_all_categories')}</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="text-sm text-gray-500">{t('aggregator_esg.metric_count', { n: list.length, s: list.length === 1 ? '' : 's' })}</span>
        <div className="flex-1" />
        <button onClick={() => setAdd(true)} className={btn}>{t('aggregator_esg.btn_add_metric')}</button>
      </div>
      {adding && <MetricForm onSave={save} onCancel={() => setAdd(false)} />}
      {list.length === 0 && <div className="text-sm text-gray-500 italic">{t('aggregator_esg.no_metrics')}</div>}

      <div className="space-y-2">
        {list.map(m => editing?.MetricID === m.MetricID ? (
          <MetricForm key={m.MetricID} metric={editing} onSave={save} onCancel={() => setEdit(null)} />
        ) : (
          <div key={m.MetricID} className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
            <div className="shrink-0 text-[#3D6B34] mt-0.5">{CAT_SVG[m.Category] || ICONS.clipboard}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-gray-900">{m.Label}</strong>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">{m.Category}</span>
                <code className="text-[10px] text-gray-400">{m.MetricKey}</code>
              </div>
              <div className="text-xs text-gray-700 mt-0.5">
                <strong>{m.Value || '—'}</strong>
                {m.Unit && <span className="text-gray-500"> {m.Unit}</span>}
                {m.PeriodStart && <span className="text-gray-500"> · {(m.PeriodStart || '').slice(0,10)} → {(m.PeriodEnd || '').slice(0,10)}</span>}
              </div>
              {m.EvidenceURL && (
                <div className="text-xs text-gray-500 mt-0.5">
                  <span className="inline-flex items-center gap-1"><span className="text-[#3D6B34]">{ICONS.paperclip}</span><a href={m.EvidenceURL} target="_blank" rel="noreferrer" className="text-[#3D6B34] hover:underline">{m.EvidenceURL}</a></span>
                </div>
              )}
              {m.Notes && <div className="text-xs text-gray-500 mt-0.5">{m.Notes}</div>}
            </div>
            <button onClick={() => setEdit(m)} className={btnGhost}>{t('aggregator_esg.btn_edit')}</button>
            <button onClick={() => del(m.MetricID)} className="text-xs text-red-600 hover:underline">{t('aggregator_esg.btn_delete')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Generate report
// ─────────────────────────────────────────────────────────────────
function GenerateTab({ businessId, onSaved }) {
  const { t } = useTranslation();
  const [s, setS] = useState({
    Title: '',
    PeriodStart: isoDate(ninetyDaysAgo),
    PeriodEnd:   isoDate(today),
    Signatory: '',
    SignatureDate: isoDate(today),
    Notes: '',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async () => {
    setBusy(true);
    const r = await fetch(`${API}/api/esg/${businessId}/reports/generate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    });
    if (r.ok) {
      const j = await r.json();
      setResult(j);
      onSaved?.();
    } else { alert(t('aggregator_esg.err_generate_failed')); }
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="text-sm text-gray-700">{t('aggregator_esg.generate_desc')}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className={lbl}>{t('aggregator_esg.lbl_title')}</label><input className={inp} placeholder="Q1 2026 ESG Report" value={s.Title} onChange={set('Title')} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl}>{t('aggregator_esg.lbl_period_start')}</label><input className={inp} type="date" value={s.PeriodStart} onChange={set('PeriodStart')} /></div>
            <div><label className={lbl}>{t('aggregator_esg.lbl_period_end')}</label><input className={inp} type="date" value={s.PeriodEnd} onChange={set('PeriodEnd')} /></div>
          </div>
          <div><label className={lbl}>{t('aggregator_esg.lbl_signatory')}</label><input className={inp} placeholder="Jane Doe, ESG Officer" value={s.Signatory} onChange={set('Signatory')} /></div>
          <div><label className={lbl}>{t('aggregator_esg.lbl_signature_date')}</label><input className={inp} type="date" value={s.SignatureDate} onChange={set('SignatureDate')} /></div>
        </div>
        <div><label className={lbl}>{t('aggregator_esg.lbl_notes_auditor')}</label><textarea className={inp} rows={2} value={s.Notes} onChange={set('Notes')} /></div>
        <div className="flex justify-end">
          <button onClick={submit} disabled={busy} className={btn}>{busy ? t('aggregator_esg.btn_generating') : t('aggregator_esg.btn_generate')}</button>
        </div>
      </div>

      {result && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700">
            {ICONS.check}
            <strong className="text-emerald-900">{t('aggregator_esg.saved_as_report', { id: result.ReportID })}</strong>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href={`${API}/api/esg/reports/${result.ReportID}/pdf`} target="_blank" rel="noreferrer" className={btn + ' inline-flex items-center gap-1.5'}>{ICONS.download} {t('aggregator_esg.btn_download_pdf')}</a>
            <a href={`${API}/api/esg/reports/${result.ReportID}/html`} target="_blank" rel="noreferrer" className={btnGhost}>{t('aggregator_esg.btn_view_html')}</a>
            <a href={`${API}/api/esg/reports/${result.ReportID}`} target="_blank" rel="noreferrer" className={btnGhost}>{t('aggregator_esg.btn_view_json')}</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Saved reports list
// ─────────────────────────────────────────────────────────────────
function ReportsTab({ businessId, refreshKey }) {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const refresh = () => { fetch(`${API}/api/esg/${businessId}/reports`).then(r => r.json()).then(setList); };
  useEffect(() => { refresh(); }, [businessId, refreshKey]);

  const del = async (id) => {
    if (!window.confirm(t('aggregator_esg.confirm_delete_report'))) return;
    await fetch(`${API}/api/esg/reports/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="space-y-2">
      {list.length === 0 && <div className="text-sm text-gray-500 italic">{t('aggregator_esg.no_reports')}</div>}
      {list.map(r => (
        <div key={r.ReportID} className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
          <div className="shrink-0 text-[#3D6B34] mt-0.5">{ICONS.document}</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900">{r.Title || t('aggregator_esg.report_num', { n: r.ReportID })}</div>
            <div className="text-xs text-gray-600 mt-0.5">
              {t('aggregator_esg.report_period')} {(r.PeriodStart || '').slice(0,10)} → {(r.PeriodEnd || '').slice(0,10)}
              {' · '}{t('aggregator_esg.report_generated')} {(r.GeneratedDate || '').slice(0,10)}
              {r.Signatory && <> · {t('aggregator_esg.report_signed_by')} <strong>{r.Signatory}</strong></>}
            </div>
          </div>
          <a href={`${API}/api/esg/reports/${r.ReportID}/pdf`} target="_blank" rel="noreferrer" className={btn}>{t('aggregator_esg.btn_pdf')}</a>
          <a href={`${API}/api/esg/reports/${r.ReportID}/html`} target="_blank" rel="noreferrer" className={btnGhost}>{t('aggregator_esg.btn_html')}</a>
          <button onClick={() => del(r.ReportID)} className="text-xs text-red-600 hover:underline">{t('aggregator_esg.btn_delete')}</button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────
const TAB_KEYS = [
  { key: 'live',     labelKey: 'tab_live' },
  { key: 'metrics',  labelKey: 'tab_metrics' },
  { key: 'generate', labelKey: 'tab_generate' },
  { key: 'reports',  labelKey: 'tab_reports' },
];

export default function AggregatorESG() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;
  const [tab, setTab] = useState('live');
  const [reportsRefresh, setReportsRefresh] = useState(0);

  if (!BusinessID) {
    return (
      <AccountLayout pageTitle={t('aggregator_esg.page_title')}>
        <div className="p-6 text-sm text-gray-500">{t('aggregator_esg.no_business')}</div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      pageTitle={t('aggregator_esg.page_title')}
      breadcrumbs={[
        { label: t('aggregator_esg.breadcrumb_account'), to: '/account' },
        { label: t('aggregator_esg.breadcrumb_aggregation'), to: `/aggregator?BusinessID=${BusinessID}` },
        { label: t('aggregator_esg.breadcrumb_esg') },
      ]}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('aggregator_esg.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('aggregator_esg.subheading')}</p>
          </div>
          <Link to={`/aggregator?BusinessID=${BusinessID}`} className={btnGhost}>{t('aggregator_esg.btn_hub')}</Link>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            {TAB_KEYS.map(tabItem => (
              <button key={tabItem.key} onClick={() => setTab(tabItem.key)}
                      className={`px-4 py-2 text-sm font-medium ${tab === tabItem.key
                        ? 'border-b-2 border-[#3D6B34] text-[#3D6B34]'
                        : 'text-gray-500 hover:text-gray-700'}`}>
                {t(`aggregator_esg.${tabItem.labelKey}`)}
              </button>
            ))}
          </div>
        </div>

        {tab === 'live'     && <LiveTab businessId={BusinessID} />}
        {tab === 'metrics'  && <MetricsTab businessId={BusinessID} />}
        {tab === 'generate' && <GenerateTab businessId={BusinessID} onSaved={() => setReportsRefresh(x => x + 1)} />}
        {tab === 'reports'  && <ReportsTab businessId={BusinessID} refreshKey={reportsRefresh} />}
      </div>
    </AccountLayout>
  );
}
