import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TABS = ['Records', 'vs Budget', 'Season Summary'];
const CURRENT_YEAR = String(new Date().getFullYear());

function tok() { return localStorage.getItem('access_token'); }
function authH() { return { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' }; }
function fmt(n, dec = 2) {
  if (n == null || isNaN(Number(n))) return '—';
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function VarianceBadge({ pct }) {
  if (pct == null) return <span className="text-gray-400 text-xs">—</span>;
  const pos = pct >= 0;
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pos ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {pos ? '+' : ''}{pct}%
    </span>
  );
}

export default function YieldRecords() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const initialTab = params.get('tab') || 'Records';
  const [tab, setTab] = useState(TABS.find(t => t.toLowerCase().replace(' ', '-') === initialTab.toLowerCase().replace(' ', '-')) || 'Records');

  const [records, setRecords] = useState([]);
  const [vsBudget, setVsBudget] = useState(null);
  const [seasonSummary, setSeasonSummary] = useState([]);
  const [season, setSeason] = useState(CURRENT_YEAR);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/yield-records/records?season=${season}`, { headers: authH() });
      if (r.ok) setRecords(await r.json());
    } finally { setLoading(false); }
  }, [season]);

  const fetchVsBudget = useCallback(async () => {
    const r = await fetch(`${API}/api/yield-records/vs-budget?season=${season}`, { headers: authH() });
    if (r.ok) setVsBudget(await r.json());
  }, [season]);

  const fetchSeasonSummary = useCallback(async () => {
    const r = await fetch(`${API}/api/yield-records/season-summary`, { headers: authH() });
    if (r.ok) setSeasonSummary(await r.json());
  }, []);

  useEffect(() => {
    if (tab === 'Records') fetchRecords();
    else if (tab === 'vs Budget') fetchVsBudget();
    else if (tab === 'Season Summary') fetchSeasonSummary();
  }, [tab, fetchRecords, fetchVsBudget, fetchSeasonSummary]);

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this yield record?')) return;
    await fetch(`${API}/api/yield-records/records/${id}`, { method: 'DELETE', headers: authH() });
    fetchRecords();
  };

  const seasonOptions = Array.from({ length: 6 }, (_, i) => String(new Date().getFullYear() - i));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Yield & Production Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">Actual harvest yields vs. budgeted targets by field and crop</p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <select value={season} onChange={e => setSeason(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
              {seasonOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="text-sm px-4 py-1.5 rounded-lg bg-yellow-700 text-white hover:bg-yellow-800">
            + Add Record
          </button>
        </div>
      </div>

      <div className="bg-white border-b px-6 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-yellow-700 text-yellow-800' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'Records' && <RecordsTab records={records} loading={loading} onDelete={deleteRecord} />}
        {tab === 'vs Budget' && <VsBudgetTab data={vsBudget} />}
        {tab === 'Season Summary' && <SeasonSummaryTab rows={seasonSummary} />}
      </div>

      {showAdd && (
        <AddYieldModal onClose={() => setShowAdd(false)} defaultSeason={season}
          onSaved={() => { setShowAdd(false); fetchRecords(); }} />
      )}

      <SaigeWidget businessId={bid} pageContext="Yield & Production Records" />
    </div>
  );
}

function RecordsTab({ records, loading, onDelete }) {
  if (loading) return <div className="text-gray-400 text-sm">Loading…</div>;
  if (!records.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">🌾</div>
      <p className="font-medium text-gray-500">No yield records for this season</p>
      <p className="text-sm mt-1">Add your first harvest result to track production performance.</p>
    </div>
  );
  return (
    <div className="max-w-5xl bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="text-left px-4 py-3">Field</th>
            <th className="text-left px-4 py-3">Crop / Variety</th>
            <th className="text-right px-4 py-3">Area (ha)</th>
            <th className="text-right px-4 py-3">Actual Tonnes</th>
            <th className="text-right px-4 py-3">Actual t/ha</th>
            <th className="text-right px-4 py-3">Budget t/ha</th>
            <th className="text-center px-4 py-3">Variance</th>
            <th className="text-right px-4 py-3">Revenue</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {records.map(r => {
            const varPct = (r.BudgetedYieldTonnesHa && r.ActualYieldTonnesHa)
              ? Math.round((Number(r.ActualYieldTonnesHa) - Number(r.BudgetedYieldTonnesHa)) / Number(r.BudgetedYieldTonnesHa) * 100 * 10) / 10
              : null;
            return (
              <tr key={r.YieldID} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.FieldName || '—'}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{r.CropName}</div>
                  {r.VarietyName && <div className="text-xs text-gray-400">{r.VarietyName}</div>}
                </td>
                <td className="px-4 py-3 text-right">{fmt(r.AreaHa, 1)}</td>
                <td className="px-4 py-3 text-right font-semibold">{fmt(r.ActualYieldTonnes, 1)}</td>
                <td className="px-4 py-3 text-right">{fmt(r.ActualYieldTonnesHa, 2)}</td>
                <td className="px-4 py-3 text-right text-gray-400">{r.BudgetedYieldTonnesHa ? fmt(r.BudgetedYieldTonnesHa, 2) : '—'}</td>
                <td className="px-4 py-3 text-center"><VarianceBadge pct={varPct} /></td>
                <td className="px-4 py-3 text-right">{r.GrossRevenue ? `$${fmt(r.GrossRevenue, 0)}` : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onDelete(r.YieldID)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VsBudgetTab({ data }) {
  if (!data) return <div className="text-gray-400 text-sm">Loading…</div>;
  const { season, records } = data;
  if (!records?.length) return (
    <div className="text-center py-16 text-gray-400">
      <p>No yield records for {season}.</p>
    </div>
  );
  return (
    <div className="space-y-4 max-w-4xl">
      <p className="text-sm text-gray-500">
        Actual yield vs. budgeted target for {season}. Variance calculated as (actual − budget) ÷ budget × 100.
      </p>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">Field</th>
              <th className="text-left px-4 py-3">Crop</th>
              <th className="text-right px-4 py-3">Area (ha)</th>
              <th className="text-right px-4 py-3">Budget t/ha</th>
              <th className="text-right px-4 py-3">Actual t/ha</th>
              <th className="text-center px-4 py-3">Variance</th>
              <th className="text-right px-4 py-3">GM/ha ($)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.FieldName || '—'}</td>
                <td className="px-4 py-3">{r.CropName}</td>
                <td className="px-4 py-3 text-right">{fmt(r.AreaHa, 1)}</td>
                <td className="px-4 py-3 text-right text-gray-400">
                  {r.budgeted_yield_tonnes_ha > 0 ? fmt(r.budgeted_yield_tonnes_ha, 2) : '—'}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {r.actual_yield_tonnes_ha > 0 ? fmt(r.actual_yield_tonnes_ha, 2) : '—'}
                </td>
                <td className="px-4 py-3 text-center"><VarianceBadge pct={r.variance_pct} /></td>
                <td className="px-4 py-3 text-right">{r.GrossMarginPerHa ? fmt(r.GrossMarginPerHa, 0) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SeasonSummaryTab({ rows }) {
  if (!rows.length) return (
    <div className="text-center py-16 text-gray-400">
      <p>No production records yet.</p>
    </div>
  );
  const seasons = [...new Set(rows.map(r => r.Season))].sort().reverse();
  return (
    <div className="space-y-6 max-w-3xl">
      {seasons.map(s => {
        const seasonRows = rows.filter(r => r.Season === s);
        return (
          <div key={s} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <span className="font-bold text-gray-800">{s} Season</span>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2">Crop</th>
                  <th className="text-right px-4 py-2">Fields</th>
                  <th className="text-right px-4 py-2">Total ha</th>
                  <th className="text-right px-4 py-2">Total t</th>
                  <th className="text-right px-4 py-2">Avg t/ha</th>
                  <th className="text-right px-4 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {seasonRows.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{r.CropName}</td>
                    <td className="px-4 py-2 text-right text-gray-500">{r.Fields}</td>
                    <td className="px-4 py-2 text-right">{fmt(r.TotalAreaHa, 1)}</td>
                    <td className="px-4 py-2 text-right font-semibold">{fmt(r.TotalTonnes, 1)}</td>
                    <td className="px-4 py-2 text-right">{r.AvgTonnesHa ? fmt(r.AvgTonnesHa, 2) : '—'}</td>
                    <td className="px-4 py-2 text-right">{r.TotalRevenue > 0 ? `$${fmt(r.TotalRevenue, 0)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function AddYieldModal({ onClose, onSaved, defaultSeason }) {
  const [form, setForm] = useState({
    season: defaultSeason,
    field_id: '', field_name: '', crop_name: '', variety_name: '',
    area_ha: '', planted_date: '', harvest_start_date: '', harvest_end_date: '',
    budgeted_yield_tonnes_ha: '', actual_yield_tonnes: '', actual_yield_tonnes_ha: '',
    grade1_pct: '', grade2_pct: '', reject_pct: '',
    price_per_tonne: '', gross_revenue: '', total_variable_cost: '', gross_margin_per_ha: '',
    scale_ticket_ref: '', quality_notes: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const F = ({ label, name, type = 'text' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name] || ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500" />
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const nums = ['area_ha', 'budgeted_yield_tonnes_ha', 'actual_yield_tonnes', 'actual_yield_tonnes_ha',
        'grade1_pct', 'grade2_pct', 'reject_pct', 'price_per_tonne',
        'gross_revenue', 'total_variable_cost', 'gross_margin_per_ha'];
      const dates = ['planted_date', 'harvest_start_date', 'harvest_end_date'];
      const payload = { ...form };
      nums.forEach(k => { payload[k] = payload[k] !== '' ? Number(payload[k]) : null; });
      dates.forEach(k => { if (!payload[k]) payload[k] = null; });
      ['field_id', 'field_name', 'variety_name', 'scale_ticket_ref', 'quality_notes', 'notes'].forEach(k => {
        if (!payload[k]) payload[k] = null;
      });
      const r = await fetch(`${API}/api/yield-records/records`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add Yield Record</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <F label="Season *" name="season" />
            <F label="Crop Name *" name="crop_name" />
            <F label="Field ID" name="field_id" />
            <F label="Field Name" name="field_name" />
            <F label="Variety" name="variety_name" />
            <F label="Area (ha)" name="area_ha" type="number" />
            <F label="Planted Date" name="planted_date" type="date" />
            <F label="Harvest Start" name="harvest_start_date" type="date" />
            <F label="Harvest End" name="harvest_end_date" type="date" />
            <F label="Budget t/ha" name="budgeted_yield_tonnes_ha" type="number" />
            <F label="Actual Tonnes" name="actual_yield_tonnes" type="number" />
            <F label="Actual t/ha" name="actual_yield_tonnes_ha" type="number" />
            <F label="Price/Tonne ($)" name="price_per_tonne" type="number" />
            <F label="Gross Revenue ($)" name="gross_revenue" type="number" />
            <F label="Variable Cost ($)" name="total_variable_cost" type="number" />
            <F label="GM/ha ($)" name="gross_margin_per_ha" type="number" />
            <F label="Grade 1 %" name="grade1_pct" type="number" />
            <F label="Grade 2 %" name="grade2_pct" type="number" />
            <F label="Reject %" name="reject_pct" type="number" />
            <F label="Scale Ticket Ref" name="scale_ticket_ref" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Quality Notes</label>
            <textarea rows={2} value={form.quality_notes || ''}
              onChange={e => setForm(f => ({ ...f, quality_notes: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea rows={2} value={form.notes || ''}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.season || !form.crop_name}
            className="px-5 py-2 rounded-lg bg-yellow-700 text-white text-sm hover:bg-yellow-800 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
}
