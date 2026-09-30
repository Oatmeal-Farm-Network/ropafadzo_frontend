import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ThaiymeChat from './ThaiymeChat';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = ['Forecast', 'Entries'];
const CATEGORIES = ['Grain Sales', 'Contract Revenue', 'Livestock', 'Other Income',
  'Seed & Chemicals', 'Fertiliser', 'Fuel', 'Labour', 'Machinery', 'Repairs',
  'Rates & Insurance', 'Finance', 'Other Expense'];

function tok() { return localStorage.getItem('access_token'); }
function authH() { return { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' }; }

function fmt(n, dec = 0) {
  if (n == null || isNaN(Number(n))) return '—';
  const abs = Math.abs(Number(n));
  const sign = Number(n) < 0 ? '-' : '';
  return `${sign}$${abs.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
}

function netColor(net) {
  if (net > 0) return 'text-green-700';
  if (net < 0) return 'text-red-600';
  return 'text-gray-500';
}

export default function CashFlowForecast() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const initialTab = params.get('tab') === 'entries' ? 'Entries' : 'Forecast';
  const [tab, setTab] = useState(initialTab);

  const [forecast, setForecast] = useState(null);
  const [entries, setEntries] = useState([]);
  const [months, setMonths] = useState(12);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const fetchForecast = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/cash-flow/forecast?months=${months}`, { headers: authH() });
      if (r.ok) setForecast(await r.json());
    } finally { setLoading(false); }
  }, [months]);

  const fetchEntries = useCallback(async () => {
    const r = await fetch(`${API}/api/cash-flow/entries`, { headers: authH() });
    if (r.ok) setEntries(await r.json());
  }, []);

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    await fetch(`${API}/api/cash-flow/entries/${id}`, { method: 'DELETE', headers: authH() });
    fetchEntries();
    fetchForecast();
  };

  useEffect(() => {
    if (tab === 'Forecast') fetchForecast();
    else if (tab === 'Entries') fetchEntries();
  }, [tab, fetchForecast, fetchEntries]);

  const today = new Date().toISOString().slice(0, 7);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Cash Flow Forecasting</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            6-month actuals + {months}-month projections from grain sales, contracts, crop budgets & manual entries
          </p>
        </div>
        <div className="flex items-center gap-3">
          {tab === 'Forecast' && (
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-600">Months:</label>
              <select value={months} onChange={e => setMonths(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm">
                {[3, 6, 12, 18, 24].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
          <button onClick={() => setShowAdd(true)}
            className="text-sm px-4 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800">
            + Manual Entry
          </button>
        </div>
      </div>

      <div className="bg-white border-b px-6 flex gap-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'Forecast' && (
          <ForecastTab forecast={forecast} loading={loading} today={today} />
        )}
        {tab === 'Entries' && (
          <EntriesTab entries={entries} onDelete={deleteEntry} />
        )}
      </div>

      {showAdd && (
        <AddEntryModal onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); fetchEntries(); fetchForecast(); }} />
      )}

      <ThaiymeChat pageContext="cash_flow_forecast" />
    </div>
  );
}

function ForecastTab({ forecast, loading, today }) {
  if (loading) return <div className="text-gray-400 text-sm">Loading forecast…</div>;
  if (!forecast) return null;

  const { months: monthsList, summary } = forecast;
  const maxBar = Math.max(...monthsList.map(m => Math.max(m.inflow, m.outflow)), 1);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-xl font-bold text-green-700">{fmt(summary.total_inflow, 0)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Inflow</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-xl font-bold text-red-600">{fmt(summary.total_outflow, 0)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Outflow</div>
        </div>
        <div className={`bg-white rounded-xl border border-gray-200 p-4 text-center`}>
          <div className={`text-xl font-bold ${netColor(summary.net)}`}>{fmt(summary.net, 0)}</div>
          <div className="text-xs text-gray-500 mt-1">Net Position</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-x-auto">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">Monthly Inflow vs Outflow</h3>
        <div className="flex gap-2 items-end" style={{ minWidth: `${monthsList.length * 48}px`, height: '120px' }}>
          {monthsList.map((m) => {
            const inH = (m.inflow / maxBar) * 100;
            const outH = (m.outflow / maxBar) * 100;
            const isPast = m.month <= today;
            return (
              <div key={m.month} className="flex flex-col items-center flex-1 min-w-0 gap-0.5"
                title={`${m.month}\nInflow: ${fmt(m.inflow)}\nOutflow: ${fmt(m.outflow)}\nNet: ${fmt(m.net)}`}>
                <div className="flex items-end gap-0.5 w-full" style={{ height: '100px' }}>
                  <div className={`flex-1 rounded-t ${isPast ? 'bg-green-400' : 'bg-green-200'}`}
                    style={{ height: `${Math.max(inH, 1)}%` }} />
                  <div className={`flex-1 rounded-t ${isPast ? 'bg-red-400' : 'bg-red-200'}`}
                    style={{ height: `${Math.max(outH, 1)}%` }} />
                </div>
                <div className="text-gray-400 text-center w-full" style={{ fontSize: '9px' }}>
                  {m.month.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-400"/><span>Inflow (actual)</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-200"/><span>Inflow (projected)</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-400"/><span>Outflow (actual)</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-200"/><span>Outflow (projected)</span></div>
        </div>
      </div>

      {/* Month-by-month table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">Month</th>
              <th className="text-right px-4 py-3">Inflow</th>
              <th className="text-right px-4 py-3">Outflow</th>
              <th className="text-right px-4 py-3">Net</th>
              <th className="text-right px-4 py-3">Running Balance</th>
            </tr>
          </thead>
          <tbody>
            {monthsList.map((m) => {
              const isPast = m.month <= today;
              return (
                <tr key={m.month} className={`border-t border-gray-100 hover:bg-gray-50 ${!isPast ? 'opacity-70' : ''}`}>
                  <td className="px-4 py-2">
                    <span className="font-medium text-gray-900">{m.month}</span>
                    {!isPast && <span className="ml-2 text-xs text-blue-500">projected</span>}
                  </td>
                  <td className="px-4 py-2 text-right text-green-700">{m.inflow > 0 ? fmt(m.inflow) : '—'}</td>
                  <td className="px-4 py-2 text-right text-red-600">{m.outflow > 0 ? fmt(m.outflow) : '—'}</td>
                  <td className={`px-4 py-2 text-right font-semibold ${netColor(m.net)}`}>{fmt(m.net)}</td>
                  <td className={`px-4 py-2 text-right ${netColor(m.running_balance)}`}>{fmt(m.running_balance)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EntriesTab({ entries, onDelete }) {
  if (!entries.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">📋</div>
      <p className="font-medium text-gray-500">No manual entries yet</p>
      <p className="text-sm mt-1">Add entries to supplement forecast data from grain sales and contracts.</p>
    </div>
  );
  return (
    <div className="max-w-3xl bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Category</th>
            <th className="text-left px-4 py-3">Description</th>
            <th className="text-right px-4 py-3">Amount</th>
            <th className="text-left px-4 py-3">Type</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.EntryID} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">{e.EntryDate}</td>
              <td className="px-4 py-3 text-gray-600">{e.Category}</td>
              <td className="px-4 py-3 text-gray-500">{e.Description || '—'}</td>
              <td className={`px-4 py-3 text-right font-medium ${Number(e.Amount) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {fmt(e.Amount, 2)}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  e.EntryType === 'actual' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
                }`}>{e.EntryType}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onDelete(e.EntryID)}
                  className="text-xs text-red-400 hover:text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddEntryModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    entry_date: new Date().toISOString().slice(0, 10),
    category: 'Other Income',
    description: '',
    amount: '',
    entry_type: 'actual',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        entry_date: form.entry_date,
        category: form.category,
        description: form.description || null,
        amount: Number(form.amount),
        entry_type: form.entry_type,
      };
      const r = await fetch(`${API}/api/cash-flow/entries`, {
        method: 'POST', headers: authH(), body: JSON.stringify(payload),
      });
      if (r.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add Cash Flow Entry</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
              <input type="date" value={form.entry_date}
                onChange={e => setForm(f => ({ ...f, entry_date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select value={form.entry_type} onChange={e => setForm(f => ({ ...f, entry_type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="actual">Actual</option>
                <option value="projected">Projected</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Amount * (positive = income, negative = expense)</label>
            <input type="number" step="0.01" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="e.g. 12500 or -3400"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.entry_date || form.amount === ''}
            className="px-5 py-2 rounded-lg bg-emerald-700 text-white text-sm hover:bg-emerald-800 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
