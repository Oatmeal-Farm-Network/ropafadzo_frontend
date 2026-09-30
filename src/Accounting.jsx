import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import ThaiymeChat from './ThaiymeChat';
import { useAccount } from './AccountContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ─── helpers ────────────────────────────────────────────────────

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
  };
}

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const TABS = ['Dashboard', 'Invoices', 'Customers', 'Vendors', 'Bills', 'Expenses', 'Farmer Payouts', 'Job Costing', 'Accounts', 'Reports', 'Payments'];

const statusColor = {
  Draft: 'bg-gray-100 text-gray-700',
  Sent: 'bg-blue-100 text-blue-700',
  Partial: 'bg-yellow-100 text-yellow-700',
  Paid: 'bg-green-100 text-green-700',
  Void: 'bg-red-100 text-red-700',
  Open: 'bg-blue-100 text-blue-700',
  Overdue: 'bg-red-100 text-red-700',
};

// ─── modals ────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
const btn   = 'px-4 py-2 rounded-lg text-sm font-semibold transition';
const btnGreen  = `${btn} bg-green-700 text-white hover:bg-green-800`;
const btnWhite  = `${btn} border border-gray-300 text-gray-700 hover:bg-gray-50`;

const PAYMENT_TERMS = ['Due on Receipt', 'Net15', 'Net30', 'Net45', 'Net60'];
const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Cash', 'Check', 'ACH', 'Wire Transfer'];

// ─── JOB COSTING ────────────────────────────────────────────────

const JOB_TYPES = ['field', 'crop', 'season', 'project', 'other'];
const COST_CATS = ['Seed & Planting', 'Fertilizer', 'Crop Protection', 'Irrigation', 'Labor', 'Machinery', 'Harvest & Packaging', 'Transport', 'Storage', 'Certification', 'Overhead', 'Other'];

function JobCostingTab({ apiFetch, businessId }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [report, setReport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ JobName: '', JobType: 'field', FieldRef: '', CropName: '', Season: '', StartDate: '', EndDate: '', BudgetAmount: '', Notes: '' });
  const [allocForm, setAllocForm] = useState({ CostCategory: 'Seed & Planting', Description: '', Amount: '', CostDate: new Date().toISOString().split('T')[0] });
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const loadJobs = useCallback(async () => {
    const d = await apiFetch('/jobs');
    setJobs(d || []);
  }, [apiFetch]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const loadDetail = async (job) => {
    setSelectedJob(job);
    const [a, r] = await Promise.all([
      apiFetch(`/jobs/${job.JobID}/allocations`),
      apiFetch(`/jobs/${job.JobID}/report`),
    ]);
    setAllocations(a || []);
    setReport(r || null);
  };

  const createJob = async (e) => {
    e.preventDefault();
    await apiFetch('/jobs', { method: 'POST', body: JSON.stringify({ ...form, BudgetAmount: parseFloat(form.BudgetAmount) || null }) });
    setForm({ JobName: '', JobType: 'field', FieldRef: '', CropName: '', Season: '', StartDate: '', EndDate: '', BudgetAmount: '', Notes: '' });
    setShowForm(false);
    loadJobs();
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this cost job and all its allocations?')) return;
    await apiFetch(`/jobs/${id}`, { method: 'DELETE' });
    if (selectedJob?.JobID === id) { setSelectedJob(null); setAllocations([]); setReport(null); }
    loadJobs();
  };

  const addAllocation = async (e) => {
    e.preventDefault();
    await apiFetch(`/jobs/${selectedJob.JobID}/allocations`, {
      method: 'POST', body: JSON.stringify({ ...allocForm, Amount: parseFloat(allocForm.Amount) }),
    });
    setAllocForm({ CostCategory: 'Seed & Planting', Description: '', Amount: '', CostDate: new Date().toISOString().split('T')[0] });
    loadDetail(selectedJob);
  };

  const deleteAlloc = async (id) => {
    await apiFetch(`/jobs/${selectedJob.JobID}/allocations/${id}`, { method: 'DELETE' });
    loadDetail(selectedJob);
  };

  const seedAgAccounts = async () => {
    setSeeding(true); setSeedMsg('');
    const r = await apiFetch('/seed-ag-accounts', { method: 'POST' });
    setSeedMsg(r?.inserted > 0 ? `Added ${r.inserted} agriculture accounts.` : `All ${r?.skipped || 0} ag accounts already present.`);
    setSeeding(false);
  };

  const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Ag COA seeder banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-green-800 text-sm">Agriculture Chart of Accounts</p>
          <p className="text-xs text-green-700">Add 29 pre-built ag-specific accounts (Crop Revenue, Seed Costs, Equipment Depreciation, etc.) to your COA.</p>
          {seedMsg && <p className="text-xs text-green-600 mt-1 font-medium">{seedMsg}</p>}
        </div>
        <button onClick={seedAgAccounts} disabled={seeding} className={`${btnGreen} shrink-0 text-xs`}>
          {seeding ? 'Adding…' : 'Add Ag Accounts'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Job list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Cost Jobs / Projects</h2>
            <button onClick={() => setShowForm(v => !v)} className={btnGreen}>+ New Job</button>
          </div>

          {showForm && (
            <form onSubmit={createJob} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className="text-xs text-gray-500 mb-1 block">Job Name *</label>
                  <input required className={input} value={form.JobName} onChange={e => setForm(f => ({ ...f, JobName: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <select className={input} value={form.JobType} onChange={e => setForm(f => ({ ...f, JobType: e.target.value }))}>
                    {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Budget ($)</label>
                  <input type="number" step="0.01" className={input} value={form.BudgetAmount} onChange={e => setForm(f => ({ ...f, BudgetAmount: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Crop</label>
                  <input className={input} value={form.CropName} onChange={e => setForm(f => ({ ...f, CropName: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Season</label>
                  <input className={input} placeholder="e.g. 2025 Long Rains" value={form.Season} onChange={e => setForm(f => ({ ...f, Season: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Field / Block Ref</label>
                  <input className={input} value={form.FieldRef} onChange={e => setForm(f => ({ ...f, FieldRef: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                  <input type="date" className={input} value={form.StartDate} onChange={e => setForm(f => ({ ...f, StartDate: e.target.value }))} /></div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className={btnWhite}>Cancel</button>
                <button type="submit" className={btnGreen}>Create</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {jobs.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No cost jobs yet.</p>}
            {jobs.map(j => {
              const budgetPct = j.BudgetAmount ? pct(j.ActualCost, j.BudgetAmount) : null;
              const over = budgetPct != null && budgetPct > 100;
              return (
                <div key={j.JobID}
                  onClick={() => loadDetail(j)}
                  className={`bg-white border rounded-xl p-4 cursor-pointer hover:border-green-400 transition-colors ${selectedJob?.JobID === j.JobID ? 'border-green-500 ring-1 ring-green-300' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{j.JobName}</p>
                      <p className="text-xs text-gray-500">{j.JobType} {j.CropName ? `· ${j.CropName}` : ''} {j.Season ? `· ${j.Season}` : ''}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-sm ${over ? 'text-red-600' : 'text-gray-800'}`}>{fmt(j.ActualCost)}</p>
                      {j.BudgetAmount && <p className="text-xs text-gray-400">of {fmt(j.BudgetAmount)} budget</p>}
                    </div>
                  </div>
                  {budgetPct != null && (
                    <div className="mt-2">
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${over ? 'bg-red-500' : budgetPct > 80 ? 'bg-amber-400' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(budgetPct, 100)}%` }} />
                      </div>
                      <p className={`text-xs mt-0.5 font-medium ${over ? 'text-red-600' : 'text-gray-400'}`}>{budgetPct}% of budget {over ? '(OVER)' : 'used'}</p>
                    </div>
                  )}
                  <div className="flex justify-end mt-2">
                    <button onClick={e => { e.stopPropagation(); deleteJob(j.JobID); }} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Job detail */}
        <div className="space-y-4">
          {!selectedJob ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center text-gray-400 text-sm">Select a job to view costs</div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-1">{selectedJob.JobName}</h3>
                {report && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[
                      { l: 'Budget', v: fmt(report.budget), c: 'text-gray-700' },
                      { l: 'Actual', v: fmt(report.total_actual), c: report.total_actual > report.budget ? 'text-red-600' : 'text-green-700' },
                      { l: 'Variance', v: fmt(report.variance), c: report.variance >= 0 ? 'text-green-700' : 'text-red-600' },
                    ].map(k => (
                      <div key={k.l} className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-0.5">{k.l}</p>
                        <p className={`font-bold text-sm ${k.c}`}>{k.v}</p>
                      </div>
                    ))}
                  </div>
                )}
                {report?.by_category?.length > 0 && (
                  <div className="mt-4 space-y-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">By Category</p>
                    {report.by_category.map(bc => (
                      <div key={bc.category} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{bc.category}</span>
                        <span className="font-semibold text-gray-800">{fmt(bc.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add cost allocation */}
              <form onSubmit={addAllocation} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-gray-700 text-sm">Allocate Cost</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Category *</label>
                    <select required className={input} value={allocForm.CostCategory} onChange={e => setAllocForm(f => ({ ...f, CostCategory: e.target.value }))}>
                      {COST_CATS.map(c => <option key={c}>{c}</option>)}
                    </select></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Amount ($) *</label>
                    <input required type="number" step="0.01" className={input} value={allocForm.Amount} onChange={e => setAllocForm(f => ({ ...f, Amount: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Date *</label>
                    <input required type="date" className={input} value={allocForm.CostDate} onChange={e => setAllocForm(f => ({ ...f, CostDate: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Description</label>
                    <input className={input} value={allocForm.Description} onChange={e => setAllocForm(f => ({ ...f, Description: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end"><button type="submit" className={btnGreen}>Add Cost</button></div>
              </form>

              {/* Allocation list */}
              {allocations.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 border-b">
                      <tr><th className="text-left px-4 py-2">Category</th><th className="text-left px-4 py-2">Description</th><th className="text-left px-4 py-2">Date</th><th className="text-right px-4 py-2">Amount</th><th className="px-4 py-2"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {allocations.map(a => (
                        <tr key={a.AllocationID}>
                          <td className="px-4 py-2.5 font-medium">{a.CostCategory}</td>
                          <td className="px-4 py-2.5 text-gray-500">{a.Description || '—'}</td>
                          <td className="px-4 py-2.5 text-gray-500">{a.CostDate?.split('T')[0]}</td>
                          <td className="px-4 py-2.5 text-right font-semibold">{fmt(a.Amount)}</td>
                          <td className="px-4 py-2.5 text-center">
                            <button onClick={() => deleteAlloc(a.AllocationID)} className="text-red-400 hover:text-red-600 text-xs">×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENTS (Stripe + refund model) ──────────────────────────

function PaymentsTab() {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const authFetch = useCallback(async (path, opts = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
      ...opts,
      headers: { ...authHeaders(), ...(opts.headers || {}) },
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(txt || res.statusText);
    }
    return res.json();
  }, []);

  useEffect(() => {
    authFetch('/api/platform/settings')
      .then(d => { setCfg(d); setLoading(false); })
      .catch(e => { setMsg(e.message); setLoading(false); });
  }, [authFetch]);

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      await authFetch('/api/platform/settings', {
        method: 'PUT',
        body: JSON.stringify(cfg),
      });
      const fresh = await authFetch('/api/platform/settings');
      setCfg(fresh);
      setMsg(t('accounting.msg_saved'));
    } catch (e) {
      setMsg(e.message || 'Save failed');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  if (loading) return <div className="text-sm text-gray-400 p-6">{t('accounting.payments_loading')}</div>;
  if (!cfg) return <div className="text-sm text-red-600 p-6">{t('accounting.payments_error')} {msg}</div>;

  const set = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value }));
  const setB = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.checked }));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">{t('accounting.stripe_heading')}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {t('accounting.stripe_desc')}
              {cfg.StripeConfigured ? ' ' + t('accounting.stripe_is_configured') : ' ' + t('accounting.stripe_not_configured')}
            </p>
          </div>
          <div className={`text-xs px-2 py-1 rounded ${cfg.StripeConfigured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {cfg.StripeConfigured ? t('accounting.stripe_connected') : t('accounting.stripe_not_connected')}
          </div>
        </div>

        {!cfg.IsAdmin && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg p-3 mb-4">
            {t('accounting.stripe_admin_warning')}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('accounting.lbl_publishable_key')}>
            <input className={input} value={cfg.StripePublishableKey || ''} onChange={set('StripePublishableKey')} placeholder="pk_test_..." disabled={!cfg.IsAdmin} />
          </Field>
          <Field label={t('accounting.lbl_secret_key')}>
            <input className={input} value={cfg.StripeSecretKey || cfg.StripeSecretKeyMasked || ''}
              onChange={e => setCfg(c => ({ ...c, StripeSecretKey: e.target.value }))}
              placeholder={cfg.StripeSecretKeyMasked || 'sk_test_...'} disabled={!cfg.IsAdmin} />
            <div className="text-[11px] text-gray-400 mt-1">{t('accounting.secret_key_hint')}</div>
          </Field>
          <Field label={t('accounting.lbl_webhook_secret')}>
            <input className={input} value={cfg.StripeWebhookSecret || cfg.StripeWebhookSecretMasked || ''}
              onChange={e => setCfg(c => ({ ...c, StripeWebhookSecret: e.target.value }))}
              placeholder={cfg.StripeWebhookSecretMasked || 'whsec_...'} disabled={!cfg.IsAdmin} />
          </Field>
          <Field label={t('accounting.lbl_mode')}>
            <label className="flex items-center gap-2 text-sm mt-2">
              <input type="checkbox" checked={!!cfg.StripeTestMode} onChange={setB('StripeTestMode')} disabled={!cfg.IsAdmin} />
              <span>{t('accounting.lbl_test_mode')}</span>
            </label>
          </Field>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-1">{t('accounting.refund_model_heading')}</h2>
        <p className="text-xs text-gray-500 mb-4">{t('accounting.refund_model_desc')}</p>

        <div className="space-y-3 mb-4">
          <label className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer ${cfg.RefundModel === 'immediate_charge' ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
            <input type="radio" name="refundModel" value="immediate_charge"
              checked={cfg.RefundModel === 'immediate_charge'}
              onChange={e => setCfg(c => ({ ...c, RefundModel: e.target.value }))}
              disabled={!cfg.IsAdmin} className="mt-1" />
            <div>
              <div className="font-medium text-sm">{t('accounting.refund_immediate_title')}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t('accounting.refund_immediate_desc')}</div>
            </div>
          </label>
          <label className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer ${cfg.RefundModel === 'manual_capture' ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
            <input type="radio" name="refundModel" value="manual_capture"
              checked={cfg.RefundModel === 'manual_capture'}
              onChange={e => setCfg(c => ({ ...c, RefundModel: e.target.value }))}
              disabled={!cfg.IsAdmin} className="mt-1" />
            <div>
              <div className="font-medium text-sm">{t('accounting.refund_manual_title')}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t('accounting.refund_manual_desc')}</div>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label={t('accounting.lbl_refund_deadline')}>
            <input type="number" className={input} value={cfg.RefundDeadlineDays || 0}
              onChange={e => setCfg(c => ({ ...c, RefundDeadlineDays: Number(e.target.value) || 0 }))}
              disabled={!cfg.IsAdmin} />
            <div className="text-[11px] text-gray-400 mt-1">{t('accounting.refund_deadline_hint')}</div>
          </Field>
          <Field label={t('accounting.lbl_platform_fee')}>
            <input type="number" step="0.01" className={input} value={cfg.PlatformFeePercent || 0}
              onChange={e => setCfg(c => ({ ...c, PlatformFeePercent: Number(e.target.value) || 0 }))}
              disabled={!cfg.IsAdmin} />
          </Field>
          <Field label={t('accounting.lbl_currency')}>
            <input className={input} value={cfg.CurrencyCode || 'USD'} onChange={set('CurrencyCode')} disabled={!cfg.IsAdmin} />
          </Field>
        </div>
      </div>

      {cfg.IsAdmin && (
        <div className="flex items-center justify-end gap-3">
          {msg && <span className="text-sm text-gray-500 mr-auto">{msg}</span>}
          <button onClick={save} disabled={saving} className={btnGreen}>{saving ? t('accounting.btn_saving') : t('accounting.btn_save_payments')}</button>
        </div>
      )}
    </div>
  );
}


// ─── Currency Manager ─────────────────────────────────────────────────────────

function CurrencyManager({ apiFetch }) {
  const [currencies, setCurrencies] = useState([]);
  const [editing, setEditing] = useState(null); // { CurrencyCode, RateToUSD, CurrencyName }
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try { setCurrencies(await apiFetch('/currencies')); setLoaded(true); } catch (_) {}
  }, [apiFetch]);

  useEffect(() => { load(); }, [load]);

  async function saveRate() {
    if (!editing) return;
    setSaving(true);
    await apiFetch(`/currencies/${editing.CurrencyCode}`, {
      method: 'PUT',
      body: JSON.stringify({ rate_to_usd: parseFloat(editing.RateToUSD), currency_name: editing.CurrencyName }),
    });
    setSaving(false);
    setEditing(null);
    load();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold text-gray-900">Exchange Rates</h2>
          <p className="text-xs text-gray-400 mt-0.5">Rates relative to USD. Used for multi-currency invoices and crop margins.</p>
        </div>
        {!loaded && <span className="text-xs text-gray-400">Loading…</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
              <th className="px-4 py-2.5 font-semibold">Code</th>
              <th className="px-4 py-2.5 font-semibold">Currency</th>
              <th className="px-4 py-2.5 font-semibold">Rate (to USD)</th>
              <th className="px-4 py-2.5 font-semibold">Updated</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currencies.map(c => (
              <tr key={c.CurrencyCode} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 font-mono font-bold text-blue-700">{c.CurrencyCode}</td>
                <td className="px-4 py-2.5 text-gray-700">{c.CurrencyName}</td>
                <td className="px-4 py-2.5">
                  {editing?.CurrencyCode === c.CurrencyCode ? (
                    <input type="number" step="0.0001" className="border rounded px-2 py-1 text-sm w-28"
                      value={editing.RateToUSD}
                      onChange={e => setEditing(ed => ({ ...ed, RateToUSD: e.target.value }))} />
                  ) : (
                    <span className="font-mono">{Number(c.RateToUSD).toFixed(4)}</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-gray-400 text-xs">
                  {c.UpdatedAt ? new Date(c.UpdatedAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {editing?.CurrencyCode === c.CurrencyCode ? (
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditing(null)}
                        className="text-xs px-2 py-1 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                      <button onClick={saveRate} disabled={saving}
                        className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                        {saving ? '…' : 'Save'}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing({ CurrencyCode: c.CurrencyCode, RateToUSD: c.RateToUSD, CurrencyName: c.CurrencyName })}
                      className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ─── main component ────────────────────────────────────────────

export default function Accounting() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount();
  const businessId = searchParams.get('BusinessID') || (ctxBusinessID ? String(ctxBusinessID) : null);
  const peopleId   = localStorage.getItem('PeopleID');

  const [tab, setTab] = useState('Dashboard');
  const [business, setBusiness] = useState(null);
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // data states
  const [dashboard, setDashboard]   = useState(null);
  const [invoices, setInvoices]     = useState([]);
  const [customers, setCustomers]   = useState([]);
  const [vendors, setVendors]       = useState([]);
  const [bills, setBills]           = useState([]);
  const [expenses, setExpenses]     = useState([]);
  const [farmerPayouts, setFarmerPayouts] = useState([]);
  const [fpFilter, setFpFilter]     = useState('all');
  const [accounts, setAccounts]     = useState([]);

  // report states
  const [reportType, setReportType]   = useState('profit-loss');
  const [reportData, setReportData]   = useState(null);
  const [reportDates, setReportDates] = useState({
    startDate: `${new Date().getFullYear()}-01-01`,
    endDate: new Date().toISOString().slice(0, 10),
    asOfDate: new Date().toISOString().slice(0, 10),
  });

  // modal states
  const [showInvoiceModal,  setShowInvoiceModal]  = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showVendorModal,   setShowVendorModal]   = useState(false);
  const [showBillModal,     setShowBillModal]      = useState(false);
  const [showExpenseModal,  setShowExpenseModal]   = useState(false);

  const TAB_LABELS = {
    Dashboard: t('accounting.tab_dashboard'),
    Invoices: t('accounting.tab_invoices'),
    Customers: t('accounting.tab_customers'),
    Vendors: t('accounting.tab_vendors'),
    Bills: t('accounting.tab_bills'),
    Expenses: t('accounting.tab_expenses'),
    'Farmer Payouts': 'Farmer Payouts',
    Accounts: t('accounting.tab_accounts'),
    Reports: t('accounting.tab_reports'),
    Payments: t('accounting.tab_payments'),
  };

  // ── fetch helpers ──────────────────────────────────────────

  const apiFetch = useCallback(async (path, opts = {}) => {
    const res = await fetch(`${API_URL}/api/accounting${path}${path.includes('?') ? '&' : '?'}business_id=${businessId}`, {
      ...opts,
      headers: { ...authHeaders(), ...(opts.headers || {}) },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, [businessId]);

  // ── init ──────────────────────────────────────────────────

  useEffect(() => {
    if (!businessId) return;
    (async () => {
      try {
        const biz = await apiFetch('/business-info');
        setBusiness(biz);

        // Check if chart of accounts exists
        const accts = await apiFetch('/accounts');
        setIsSetup(accts.accounts.length > 0);
        setAccounts(accts.accounts);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [businessId, apiFetch]);

  // ── tab data ──────────────────────────────────────────────

  useEffect(() => {
    if (!businessId || !isSetup) return;
    (async () => {
      try {
        if (tab === 'Dashboard') {
          const d = await apiFetch('/dashboard');
          setDashboard(d);
        } else if (tab === 'Invoices') {
          const d = await apiFetch('/invoices');
          setInvoices(d.invoices);
        } else if (tab === 'Customers') {
          const d = await apiFetch('/customers');
          setCustomers(d.customers);
        } else if (tab === 'Vendors') {
          const d = await apiFetch('/vendors');
          setVendors(d.vendors);
        } else if (tab === 'Bills') {
          const d = await apiFetch('/bills');
          setBills(d.bills);
        } else if (tab === 'Expenses') {
          const d = await apiFetch('/expenses');
          setExpenses(d.expenses);
        } else if (tab === 'Farmer Payouts') {
          const d = await apiFetch('/farmer-payouts');
          setFarmerPayouts(d.settlements);
        } else if (tab === 'Accounts') {
          const d = await apiFetch('/accounts');
          setAccounts(d.accounts);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [tab, businessId, isSetup, apiFetch]);

  // ── setup ─────────────────────────────────────────────────

  async function handleSetup() {
    try {
      await apiFetch('/setup', { method: 'POST' });
      const accts = await apiFetch('/accounts');
      setAccounts(accts.accounts);
      setIsSetup(true);
    } catch (e) {
      alert('Setup failed: ' + e.message);
    }
  }

  // ── report fetch ──────────────────────────────────────────

  async function fetchReport() {
    try {
      let path = `/reports/${reportType}`;
      if (['profit-loss', 'cash-flow'].includes(reportType)) {
        path += `?start_date=${reportDates.startDate}&end_date=${reportDates.endDate}`;
      } else {
        path += `?as_of_date=${reportDates.asOfDate}`;
      }
      const d = await apiFetch(path);
      setReportData(d);
    } catch (e) {
      alert('Report failed: ' + e.message);
    }
  }

  // ── renders ───────────────────────────────────────────────

  if (loading) return (
    <AccountLayout BusinessID={businessId} PeopleID={peopleId} pageTitle={t('accounting.page_title')}>
      <div className="p-8 text-gray-500">{t('accounting.loading')}</div>
      <ThaiymeChat businessId={businessId} page="accounting" />
    </AccountLayout>
  );

  if (error) return (
    <AccountLayout BusinessID={businessId} PeopleID={peopleId} pageTitle={t('accounting.page_title')}>
      <div className="p-8 text-red-600">Error: {error}<br />
        <span className="text-sm text-gray-500">{t('accounting.error_access')}</span>
      </div>
    </AccountLayout>
  );

  if (!isSetup) return (
    <AccountLayout BusinessID={businessId} PeopleID={peopleId} pageTitle={t('accounting.page_title')}>
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="flex justify-center mb-4 text-gray-300">
          <svg width="56" height="56" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="3" height="8"/><rect x="6.5" y="3" width="3" height="11"/><rect x="12" y="1" width="3" height="13"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('accounting.setup_title')}</h2>
        <p className="text-gray-500 mb-6">
          {t('accounting.setup_desc', { name: business?.BusinessName })}
        </p>
        <button onClick={handleSetup} className={btnGreen}>{t('accounting.btn_init')}</button>
      </div>
    </AccountLayout>
  );

  return (
    <AccountLayout BusinessID={businessId} PeopleID={peopleId} pageTitle={t('accounting.page_title')}>
      <div className="max-w-full space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-700">{t('accounting.heading', { name: business?.BusinessName })}</h1>
            <p className="text-sm text-gray-500">{t('accounting.subtitle')}</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {TABS.map(tabName => (
            <button key={tabName}
              onClick={() => setTab(tabName)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition
                ${tab === tabName ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {TAB_LABELS[tabName] || tabName}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'Dashboard' && dashboard && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t('accounting.card_ar'),        value: fmt(dashboard.ar?.TotalAR),  sub: t('accounting.open_invoices', { count: dashboard.ar?.OpenCount || 0 }), color: 'text-blue-600' },
                { label: t('accounting.card_overdue_ar'), value: fmt(dashboard.ar?.OverdueAR), sub: t('accounting.past_due'), color: 'text-red-600' },
                { label: t('accounting.card_ap'),        value: fmt(dashboard.ap?.TotalAP),  sub: t('accounting.open_bills', { count: dashboard.ap?.OpenCount || 0 }), color: 'text-orange-600' },
                { label: t('accounting.card_overdue_ap'), value: fmt(dashboard.ap?.OverdueAP), sub: t('accounting.past_due'), color: 'text-red-600' },
              ].map(card => (
                <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Farmer Payouts summary row */}
            {dashboard.farmerPayouts && (dashboard.farmerPayouts.pendingCount > 0 || dashboard.farmerPayouts.paidCount > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs text-amber-700 font-medium mb-1">Pending Farmer Payouts</p>
                  <p className="text-2xl font-bold text-amber-700">{fmt(dashboard.farmerPayouts.pendingTotal)}</p>
                  <p className="text-xs text-amber-600 mt-1">{dashboard.farmerPayouts.pendingCount} settlement{dashboard.farmerPayouts.pendingCount !== 1 ? 's' : ''} awaiting payment</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs text-green-700 font-medium mb-1">Farmer Payouts Paid</p>
                  <p className="text-2xl font-bold text-green-700">{fmt(dashboard.farmerPayouts.paidTotal)}</p>
                  <p className="text-xs text-green-600 mt-1">{dashboard.farmerPayouts.paidCount} settlement{dashboard.farmerPayouts.paidCount !== 1 ? 's' : ''} completed</p>
                </div>
                <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">Recent Settlements</h3>
                    <button onClick={() => setTab('Farmer Payouts')} className="text-xs text-green-700 hover:underline">View all →</button>
                  </div>
                  {dashboard.farmerPayouts.recent.length ? (
                    <table className="w-full text-xs">
                      <tbody>
                        {dashboard.farmerPayouts.recent.slice(0, 4).map(s => (
                          <tr key={s.SettlementID} className="border-b last:border-0">
                            <td className="py-1 text-gray-700 font-medium">{s.FarmerName}</td>
                            <td className="py-1 text-right font-semibold">{fmt(s.NetPayment)}</td>
                            <td className="py-1 pl-2">
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${s.Status === 'Paid' ? 'bg-green-100 text-green-700' : s.Status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                {s.Status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p className="text-xs text-gray-400">No settlements yet.</p>}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Recent Payments */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-3">{t('accounting.recent_payments')}</h3>
                {dashboard.recentPayments?.length ? (
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-gray-400 border-b">
                      <th className="pb-2">{t('accounting.th_customer')}</th><th className="pb-2">{t('accounting.th_date')}</th><th className="pb-2 text-right">{t('accounting.th_amount')}</th>
                    </tr></thead>
                    <tbody>
                      {dashboard.recentPayments.map(p => (
                        <tr key={p.PaymentID} className="border-b last:border-0">
                          <td className="py-1.5 text-gray-700">{p.CustomerName}</td>
                          <td className="py-1.5 text-gray-500">{fmtDate(p.PaymentDate)}</td>
                          <td className="py-1.5 text-right text-green-700 font-medium">{fmt(p.Amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-sm text-gray-400">{t('accounting.no_payments')}</p>}
              </div>

              {/* Overdue Invoices */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-3">{t('accounting.overdue_invoices')}</h3>
                {dashboard.overdueInvoices?.length ? (
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-gray-400 border-b">
                      <th className="pb-2">{t('accounting.th_customer')}</th><th className="pb-2">{t('accounting.th_due')}</th><th className="pb-2 text-right">{t('accounting.th_balance')}</th>
                    </tr></thead>
                    <tbody>
                      {dashboard.overdueInvoices.map(inv => (
                        <tr key={inv.InvoiceID} className="border-b last:border-0">
                          <td className="py-1.5 text-gray-700">{inv.CustomerName}</td>
                          <td className="py-1.5 text-red-500">{fmtDate(inv.DueDate)}</td>
                          <td className="py-1.5 text-right text-red-600 font-medium">{fmt(inv.BalanceDue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-sm text-gray-400">{t('accounting.no_overdue_invoices')}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── INVOICES ── */}
        {tab === 'Invoices' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900">{t('accounting.invoices_heading')}</h2>
              <button onClick={() => setShowInvoiceModal(true)} className={btnGreen}>{t('accounting.btn_new_invoice')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                  {[t('accounting.th_invoice_num'), t('accounting.th_customer'), t('accounting.th_date'), t('accounting.th_due'), t('accounting.th_total'), t('accounting.th_balance'), t('accounting.th_status')].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {invoices.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">{t('accounting.no_invoices')}</td></tr>
                  )}
                  {invoices.map(inv => (
                    <tr key={inv.InvoiceID} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-green-700">{inv.InvoiceNumber}</td>
                      <td className="px-4 py-3">{inv.CustomerName}</td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(inv.InvoiceDate)}</td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(inv.DueDate)}</td>
                      <td className="px-4 py-3">{fmt(inv.TotalAmount)}</td>
                      <td className="px-4 py-3 font-medium">{fmt(inv.BalanceDue)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[inv.Status] || 'bg-gray-100 text-gray-600'}`}>
                          {inv.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {tab === 'Customers' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900">{t('accounting.customers_heading')}</h2>
              <button onClick={() => setShowCustomerModal(true)} className={btnGreen}>{t('accounting.btn_new_customer')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                  {[t('accounting.th_name'), t('accounting.th_email'), t('accounting.th_phone'), t('accounting.th_payment_terms'), t('accounting.th_open_balance')].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {customers.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('accounting.no_customers')}</td></tr>
                  )}
                  {customers.map(c => (
                    <tr key={c.CustomerID} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{c.DisplayName}</td>
                      <td className="px-4 py-3 text-gray-500">{c.Email || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{c.Phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{c.PaymentTerms}</td>
                      <td className="px-4 py-3 font-medium text-blue-700">{fmt(c.OpenBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── VENDORS ── */}
        {tab === 'Vendors' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900">{t('accounting.vendors_heading')}</h2>
              <button onClick={() => setShowVendorModal(true)} className={btnGreen}>{t('accounting.btn_new_vendor')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                  {[t('accounting.th_name'), t('accounting.th_email'), t('accounting.th_phone'), t('accounting.th_payment_terms'), t('accounting.th_open_balance'), t('accounting.th_1099')].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {vendors.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">{t('accounting.no_vendors')}</td></tr>
                  )}
                  {vendors.map(v => (
                    <tr key={v.VendorID} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{v.DisplayName}</td>
                      <td className="px-4 py-3 text-gray-500">{v.Email || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{v.Phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{v.PaymentTerms}</td>
                      <td className="px-4 py-3 font-medium text-orange-700">{fmt(v.OpenBalance)}</td>
                      <td className="px-4 py-3">{v.Is1099 ? '✓' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BILLS ── */}
        {tab === 'Bills' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900">{t('accounting.bills_heading')}</h2>
              <button onClick={() => setShowBillModal(true)} className={btnGreen}>{t('accounting.btn_new_bill')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                  {[t('accounting.th_bill_num'), t('accounting.th_vendor'), t('accounting.th_date'), t('accounting.th_due'), t('accounting.th_total'), t('accounting.th_balance'), t('accounting.th_status')].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {bills.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">{t('accounting.no_bills')}</td></tr>
                  )}
                  {bills.map(b => (
                    <tr key={b.BillID} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-green-700">{b.BillNumber || '—'}</td>
                      <td className="px-4 py-3">{b.VendorName}</td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(b.BillDate)}</td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(b.DueDate)}</td>
                      <td className="px-4 py-3">{fmt(b.TotalAmount)}</td>
                      <td className="px-4 py-3 font-medium">{fmt(b.BalanceDue)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[b.Status] || 'bg-gray-100 text-gray-600'}`}>
                          {b.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EXPENSES ── */}
        {tab === 'Expenses' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900">{t('accounting.expenses_heading')}</h2>
              <button onClick={() => setShowExpenseModal(true)} className={btnGreen}>{t('accounting.btn_new_expense')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                  {[t('accounting.th_date'), t('accounting.th_vendor'), t('accounting.th_method'), t('accounting.th_total'), t('accounting.th_notes')].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {expenses.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('accounting.no_expenses')}</td></tr>
                  )}
                  {expenses.map(e => (
                    <tr key={e.ExpenseID} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{fmtDate(e.ExpenseDate)}</td>
                      <td className="px-4 py-3">{e.VendorName || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{e.PaymentMethod}</td>
                      <td className="px-4 py-3 font-medium">{fmt(e.TotalAmount)}</td>
                      <td className="px-4 py-3 text-gray-400 truncate max-w-xs">{e.Notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FARMER PAYOUTS ── */}
        {tab === 'Farmer Payouts' && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex items-center gap-2">
              {['all', 'Pending', 'Paid', 'Cancelled'].map(f => (
                <button key={f}
                  onClick={() => setFpFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border ${fpFilter === f ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
              <Link to={`/farmer-settlement?BusinessID=${businessId}`}
                className="ml-auto text-xs text-green-700 hover:underline font-medium">
                Open Farmer Settlement →
              </Link>
            </div>

            {/* Summary cards */}
            {(() => {
              const visible = fpFilter === 'all' ? farmerPayouts : farmerPayouts.filter(s => s.Status === fpFilter);
              const totalGross  = visible.reduce((a, s) => a + parseFloat(s.GrossSales  || 0), 0);
              const totalNet    = visible.reduce((a, s) => a + parseFloat(s.NetPayment  || 0), 0);
              const totalComm   = visible.reduce((a, s) => a + parseFloat(s.GrossSales  || 0) * parseFloat(s.CommissionPct || 0) / 100, 0);
              const totalLogis  = visible.reduce((a, s) => a + parseFloat(s.LogisticsCost || 0), 0);
              return (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Gross Sales', value: fmt(totalGross), color: 'text-blue-600' },
                      { label: 'Commission Earned', value: fmt(totalComm), color: 'text-green-700' },
                      { label: 'Logistics Costs', value: fmt(totalLogis), color: 'text-orange-600' },
                      { label: 'Net Owed to Farmers', value: fmt(totalNet), color: 'text-gray-900' },
                    ].map(c => (
                      <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 font-medium mb-1">{c.label}</p>
                        <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{visible.length} settlement{visible.length !== 1 ? 's' : ''}</p>
                      </div>
                    ))}
                  </div>

                  {/* Table */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b bg-gray-50">
                          {['Farmer', 'Date', 'Gross Sales', 'Commission', 'Logistics', 'Other Deductions', 'Net Payment', 'Status', 'Paid On'].map(h => (
                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visible.length === 0 && (
                          <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No settlements found.</td></tr>
                        )}
                        {visible.map(s => {
                          const comm = parseFloat(s.GrossSales || 0) * parseFloat(s.CommissionPct || 0) / 100;
                          return (
                            <tr key={s.SettlementID} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{s.FarmerName}</td>
                              <td className="px-4 py-3 text-gray-500">{fmtDate(s.CreatedAt)}</td>
                              <td className="px-4 py-3 text-blue-700 font-medium">{fmt(s.GrossSales)}</td>
                              <td className="px-4 py-3 text-green-700">{fmt(comm)} <span className="text-gray-400 text-xs">({s.CommissionPct}%)</span></td>
                              <td className="px-4 py-3 text-orange-600">{fmt(s.LogisticsCost)}</td>
                              <td className="px-4 py-3 text-gray-500">{fmt(s.OtherDeductions)}</td>
                              <td className="px-4 py-3 font-bold text-gray-900">{fmt(s.NetPayment)}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  s.Status === 'Paid' ? 'bg-green-100 text-green-700' :
                                  s.Status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                  'bg-gray-100 text-gray-500'}`}>
                                  {s.Status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500">{fmtDate(s.PaidAt)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ── CHART OF ACCOUNTS ── */}
        {tab === 'Accounts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold text-gray-900">{t('accounting.accounts_heading')}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                    {[t('accounting.th_acct_num'), t('accounting.th_acct_name'), t('accounting.th_acct_type'), t('accounting.th_statement'), t('accounting.th_active')].map(h => (
                      <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {accounts.map(a => (
                      <tr key={a.AccountID} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-500">{a.AccountNumber}</td>
                        <td className="px-4 py-3 font-medium">{a.AccountName}</td>
                        <td className="px-4 py-3 text-gray-500">{a.AccountTypeName}</td>
                        <td className="px-4 py-3 text-gray-400">{a.FinancialStatement}</td>
                        <td className="px-4 py-3">{a.IsActive ? '✓' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Currency exchange rates */}
            <CurrencyManager apiFetch={apiFetch} />
          </div>
        )}

        {/* ── REPORTS ── */}
        {tab === 'Reports' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">{t('accounting.reports_heading')}</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  { key: 'profit-loss',   label: t('accounting.report_pl') },
                  { key: 'balance-sheet', label: t('accounting.report_bs') },
                  { key: 'ar-aging',      label: t('accounting.report_ar_aging') },
                  { key: 'ap-aging',      label: t('accounting.report_ap_aging') },
                  { key: 'cash-flow',     label: t('accounting.report_cash_flow') },
                  { key: 'trial-balance', label: t('accounting.report_trial_balance') },
                  { key: 'general-ledger',label: t('accounting.report_general_ledger') },
                ].map(r => (
                  <button key={r.key}
                    onClick={() => { setReportType(r.key); setReportData(null); }}
                    className={`${btn} text-sm ${reportType === r.key ? 'bg-green-700 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Date pickers */}
              {['profit-loss', 'cash-flow'].includes(reportType) && (
                <div className="flex gap-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('accounting.lbl_start_date')}</label>
                    <input type="date" className={input + ' w-auto'} value={reportDates.startDate}
                      onChange={e => setReportDates(d => ({ ...d, startDate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('accounting.lbl_end_date')}</label>
                    <input type="date" className={input + ' w-auto'} value={reportDates.endDate}
                      onChange={e => setReportDates(d => ({ ...d, endDate: e.target.value }))} />
                  </div>
                </div>
              )}
              {['balance-sheet', 'trial-balance'].includes(reportType) && (
                <div className="mb-4">
                  <label className="text-xs text-gray-500 block mb-1">{t('accounting.lbl_as_of_date')}</label>
                  <input type="date" className={input + ' w-auto'} value={reportDates.asOfDate}
                    onChange={e => setReportDates(d => ({ ...d, asOfDate: e.target.value }))} />
                </div>
              )}

              <button onClick={fetchReport} className={btnGreen}>{t('accounting.btn_run_report')}</button>
            </div>

            {/* Report output */}
            {reportData && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                {/* Profit & Loss */}
                {reportType === 'profit-loss' && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      {t('accounting.pl_heading', { start: fmtDate(reportDates.startDate), end: fmtDate(reportDates.endDate) })}
                    </h3>
                    {[
                      { title: t('accounting.section_revenue'), rows: reportData.revenue, total: reportData.totalRevenue, color: 'text-green-700' },
                      { title: t('accounting.section_cogs'), rows: reportData.cogs, total: reportData.totalCOGS, color: 'text-orange-700' },
                      { title: t('accounting.section_expenses'), rows: reportData.expenses, total: reportData.totalExpenses, color: 'text-red-700' },
                    ].map(section => (
                      <div key={section.title} className="mb-4">
                        <p className="font-semibold text-gray-700 mb-1">{section.title}</p>
                        {section.rows.map(r => (
                          <div key={r.AccountNumber} className="flex justify-between text-sm py-0.5 text-gray-600">
                            <span>{r.AccountNumber} — {r.AccountName}</span>
                            <span className={section.color}>{fmt(r.Balance)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-semibold border-t mt-1 pt-1">
                          <span>{t('accounting.total_section', { section: section.title })}</span>
                          <span className={section.color}>{fmt(section.total)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between text-base font-bold border-t-2 pt-2 mt-4">
                      <span>{t('accounting.net_income')}</span>
                      <span className={reportData.netIncome >= 0 ? 'text-green-700' : 'text-red-600'}>{fmt(reportData.netIncome)}</span>
                    </div>
                  </div>
                )}

                {/* Balance Sheet */}
                {reportType === 'balance-sheet' && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{t('accounting.bs_heading', { date: fmtDate(reportDates.asOfDate) })}</h3>
                    {[
                      { title: t('accounting.section_assets'), rows: reportData.assets, total: reportData.totalAssets, color: 'text-blue-700' },
                      { title: t('accounting.section_liabilities'), rows: reportData.liabilities, total: reportData.totalLiabilities, color: 'text-orange-700' },
                      { title: t('accounting.section_equity'), rows: reportData.equity, total: reportData.totalEquity, color: 'text-green-700' },
                    ].map(section => (
                      <div key={section.title} className="mb-4">
                        <p className="font-semibold text-gray-700 mb-1">{section.title}</p>
                        {section.rows.map(r => (
                          <div key={r.AccountNumber} className="flex justify-between text-sm py-0.5 text-gray-600">
                            <span>{r.AccountNumber} — {r.AccountName}</span>
                            <span className={section.color}>{fmt(r.Balance)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-semibold border-t mt-1 pt-1">
                          <span>{t('accounting.total_section', { section: section.title })}</span>
                          <span className={section.color}>{fmt(section.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* AR/AP Aging */}
                {['ar-aging', 'ap-aging'].includes(reportType) && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      {reportType === 'ar-aging' ? t('accounting.ar_aging_heading') : t('accounting.ap_aging_heading')}
                    </h3>
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                        {[reportType === 'ar-aging' ? t('accounting.th_customer') : t('accounting.th_vendor'), t('accounting.th_invoice_bill'), t('accounting.th_due'), t('accounting.th_total'), t('accounting.th_balance'), t('accounting.th_bucket')].map(h => (
                          <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {reportData.aging.map((r, i) => (
                          <tr key={i} className="border-b">
                            <td className="px-3 py-2">{r.CustomerName || r.VendorName}</td>
                            <td className="px-3 py-2 text-gray-500">{r.InvoiceNumber || r.BillNumber}</td>
                            <td className="px-3 py-2 text-gray-500">{fmtDate(r.DueDate)}</td>
                            <td className="px-3 py-2">{fmt(r.TotalAmount)}</td>
                            <td className="px-3 py-2 font-medium">{fmt(r.BalanceDue)}</td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                ${r.AgingBucket === 'Current' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {r.AgingBucket}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Cash Flow */}
                {reportType === 'cash-flow' && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                      {t('accounting.cash_flow_heading', { start: fmtDate(reportDates.startDate), end: fmtDate(reportDates.endDate) })}
                    </h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: t('accounting.cash_in_label'), value: reportData.cashIn, color: 'text-green-700' },
                        { label: t('accounting.bill_payments_label'), value: -reportData.billPayments, color: 'text-red-600' },
                        { label: t('accounting.section_expenses'), value: -reportData.expenses, color: 'text-red-600' },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between">
                          <span className="text-gray-600">{row.label}</span>
                          <span className={row.color + ' font-medium'}>{fmt(row.value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold border-t pt-2 text-base">
                        <span>{t('accounting.net_cash')}</span>
                        <span className={reportData.netCash >= 0 ? 'text-green-700' : 'text-red-600'}>{fmt(reportData.netCash)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trial Balance */}
                {reportType === 'trial-balance' && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{t('accounting.tb_heading', { date: fmtDate(reportDates.asOfDate) })}</h3>
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                        {[t('accounting.th_acct_num'), t('accounting.th_account'), t('accounting.th_acct_type'), t('accounting.th_debits'), t('accounting.th_credits'), t('accounting.th_net')].map(h => (
                          <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {reportData.accounts.map((a, i) => (
                          <tr key={i} className="border-b">
                            <td className="px-3 py-2 font-mono text-gray-400">{a.AccountNumber}</td>
                            <td className="px-3 py-2">{a.AccountName}</td>
                            <td className="px-3 py-2 text-gray-500">{a.AccountType}</td>
                            <td className="px-3 py-2 text-right">{fmt(a.TotalDebits)}</td>
                            <td className="px-3 py-2 text-right">{fmt(a.TotalCredits)}</td>
                            <td className="px-3 py-2 text-right font-medium">{fmt(a.NetBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* General Ledger */}
                {reportType === 'general-ledger' && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{t('accounting.gl_heading')}</h3>
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-xs text-gray-500 border-b bg-gray-50">
                        {[t('accounting.th_date'), t('accounting.th_entry_num'), t('accounting.th_account'), t('accounting.th_description'), t('accounting.th_debit'), t('accounting.th_credit')].map(h => (
                          <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {reportData.entries.map((e, i) => (
                          <tr key={i} className="border-b">
                            <td className="px-3 py-2 text-gray-500">{fmtDate(e.EntryDate)}</td>
                            <td className="px-3 py-2 font-mono">{e.EntryNumber}</td>
                            <td className="px-3 py-2">{e.AccountNumber} {e.AccountName}</td>
                            <td className="px-3 py-2 text-gray-500 max-w-xs truncate">{e.LineDescription || e.JEDescription}</td>
                            <td className="px-3 py-2 text-right">{e.DebitAmount > 0 ? fmt(e.DebitAmount) : ''}</td>
                            <td className="px-3 py-2 text-right">{e.CreditAmount > 0 ? fmt(e.CreditAmount) : ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── JOB COSTING ── */}
        {tab === 'Job Costing' && (
          <JobCostingTab apiFetch={apiFetch} businessId={BusinessID} />
        )}

        {/* ── PAYMENTS / STRIPE SETTINGS ── */}
        {tab === 'Payments' && <PaymentsTab apiFetch={apiFetch} />}
      </div>

      {/* ── MODALS ── */}

      {showCustomerModal && (
        <CustomerModal
          onClose={() => setShowCustomerModal(false)}
          onSave={async data => {
            await apiFetch('/customers', { method: 'POST', body: JSON.stringify(data) });
            const d = await apiFetch('/customers');
            setCustomers(d.customers);
            setShowCustomerModal(false);
          }}
        />
      )}

      {showVendorModal && (
        <VendorModal
          onClose={() => setShowVendorModal(false)}
          onSave={async data => {
            await apiFetch('/vendors', { method: 'POST', body: JSON.stringify(data) });
            const d = await apiFetch('/vendors');
            setVendors(d.vendors);
            setShowVendorModal(false);
          }}
        />
      )}

      {showInvoiceModal && (
        <InvoiceModal
          customers={customers}
          onClose={() => setShowInvoiceModal(false)}
          onSave={async data => {
            await apiFetch('/invoices', { method: 'POST', body: JSON.stringify(data) });
            const d = await apiFetch('/invoices');
            setInvoices(d.invoices);
            setShowInvoiceModal(false);
          }}
          apiFetch={apiFetch}
        />
      )}

      {showBillModal && (
        <BillModal
          vendors={vendors}
          onClose={() => setShowBillModal(false)}
          onSave={async data => {
            await apiFetch('/bills', { method: 'POST', body: JSON.stringify(data) });
            const d = await apiFetch('/bills');
            setBills(d.bills);
            setShowBillModal(false);
          }}
        />
      )}

      {showExpenseModal && (
        <ExpenseModal
          vendors={vendors}
          accounts={accounts}
          onClose={() => setShowExpenseModal(false)}
          onSave={async data => {
            await apiFetch('/expenses', { method: 'POST', body: JSON.stringify(data) });
            const d = await apiFetch('/expenses');
            setExpenses(d.expenses);
            setShowExpenseModal(false);
          }}
        />
      )}
      <ThaiymeChat businessId={businessId} page="accounting" />
    </AccountLayout>
  );
}

// ─── CUSTOMER MODAL ────────────────────────────────────────────

function CustomerModal({ onClose, onSave }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ DisplayName: '', CompanyName: '', FirstName: '', LastName: '', Email: '', Phone: '', BillingAddress1: '', BillingCity: '', BillingState: '', BillingZip: '', PaymentTerms: 'Net30', Notes: '' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <Modal title={t('accounting.modal_new_customer')} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('accounting.lbl_display_name')}><input className={input} value={form.DisplayName} onChange={set('DisplayName')} /></Field>
        <Field label={t('accounting.lbl_company_name')}><input className={input} value={form.CompanyName} onChange={set('CompanyName')} /></Field>
        <Field label={t('accounting.lbl_first_name')}><input className={input} value={form.FirstName} onChange={set('FirstName')} /></Field>
        <Field label={t('accounting.lbl_last_name')}><input className={input} value={form.LastName} onChange={set('LastName')} /></Field>
        <Field label={t('accounting.lbl_email')}><input type="email" className={input} value={form.Email} onChange={set('Email')} /></Field>
        <Field label={t('accounting.lbl_phone')}><input className={input} value={form.Phone} onChange={set('Phone')} /></Field>
        <Field label={t('accounting.lbl_billing_address')}><input className={input} value={form.BillingAddress1} onChange={set('BillingAddress1')} /></Field>
        <Field label={t('accounting.lbl_city')}><input className={input} value={form.BillingCity} onChange={set('BillingCity')} /></Field>
        <Field label={t('accounting.lbl_state')}><input className={input} value={form.BillingState} onChange={set('BillingState')} /></Field>
        <Field label={t('accounting.lbl_zip')}><input className={input} value={form.BillingZip} onChange={set('BillingZip')} /></Field>
        <Field label={t('accounting.lbl_payment_terms')}>
          <select className={input} value={form.PaymentTerms} onChange={set('PaymentTerms')}>
            {PAYMENT_TERMS.map(term => <option key={term}>{term}</option>)}
          </select>
        </Field>
        <Field label={t('accounting.lbl_notes')}><input className={input} value={form.Notes} onChange={set('Notes')} /></Field>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className={btnWhite}>{t('accounting.btn_cancel')}</button>
        <button onClick={() => onSave(form)} className={btnGreen} disabled={!form.DisplayName}>{t('accounting.btn_save_customer')}</button>
      </div>
    </Modal>
  );
}

// ─── VENDOR MODAL ─────────────────────────────────────────────

function VendorModal({ onClose, onSave }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ DisplayName: '', CompanyName: '', FirstName: '', LastName: '', Email: '', Phone: '', Address1: '', City: '', State: '', Zip: '', PaymentTerms: 'Net30', Is1099: false, Notes: '' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <Modal title={t('accounting.modal_new_vendor')} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('accounting.lbl_display_name')}><input className={input} value={form.DisplayName} onChange={set('DisplayName')} /></Field>
        <Field label={t('accounting.lbl_company_name')}><input className={input} value={form.CompanyName} onChange={set('CompanyName')} /></Field>
        <Field label={t('accounting.lbl_first_name')}><input className={input} value={form.FirstName} onChange={set('FirstName')} /></Field>
        <Field label={t('accounting.lbl_last_name')}><input className={input} value={form.LastName} onChange={set('LastName')} /></Field>
        <Field label={t('accounting.lbl_email')}><input type="email" className={input} value={form.Email} onChange={set('Email')} /></Field>
        <Field label={t('accounting.lbl_phone')}><input className={input} value={form.Phone} onChange={set('Phone')} /></Field>
        <Field label={t('accounting.lbl_address')}><input className={input} value={form.Address1} onChange={set('Address1')} /></Field>
        <Field label={t('accounting.lbl_city')}><input className={input} value={form.City} onChange={set('City')} /></Field>
        <Field label={t('accounting.lbl_state')}><input className={input} value={form.State} onChange={set('State')} /></Field>
        <Field label={t('accounting.lbl_zip')}><input className={input} value={form.Zip} onChange={set('Zip')} /></Field>
        <Field label={t('accounting.lbl_payment_terms')}>
          <select className={input} value={form.PaymentTerms} onChange={set('PaymentTerms')}>
            {PAYMENT_TERMS.map(term => <option key={term}>{term}</option>)}
          </select>
        </Field>
        <Field label={t('accounting.lbl_1099_vendor')}>
          <input type="checkbox" checked={form.Is1099} onChange={e => setForm(f => ({ ...f, Is1099: e.target.checked }))} className="mt-2" />
        </Field>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className={btnWhite}>{t('accounting.btn_cancel')}</button>
        <button onClick={() => onSave(form)} className={btnGreen} disabled={!form.DisplayName}>{t('accounting.btn_save_vendor')}</button>
      </div>
    </Modal>
  );
}

// ─── INVOICE MODAL ────────────────────────────────────────────

function InvoiceModal({ customers, onClose, onSave, apiFetch }) {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const due30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const [form, setForm] = useState({ CustomerID: '', InvoiceDate: today, DueDate: due30, PaymentTerms: 'Net30', Notes: '', Lines: [{ Description: '', Quantity: 1, UnitPrice: 0, TaxAmount: 0 }] });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function setLine(i, k, v) {
    setForm(f => { const ls = [...f.Lines]; ls[i] = { ...ls[i], [k]: v }; return { ...f, Lines: ls }; });
  }
  function addLine() { setForm(f => ({ ...f, Lines: [...f.Lines, { Description: '', Quantity: 1, UnitPrice: 0, TaxAmount: 0 }] })); }
  function removeLine(i) { setForm(f => ({ ...f, Lines: f.Lines.filter((_, idx) => idx !== i) })); }

  const subTotal = form.Lines.reduce((s, l) => s + (parseFloat(l.Quantity) * parseFloat(l.UnitPrice || 0)), 0);
  const taxTotal = form.Lines.reduce((s, l) => s + parseFloat(l.TaxAmount || 0), 0);

  return (
    <Modal title={t('accounting.modal_new_invoice')} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label={t('accounting.lbl_customer')}>
          <select className={input} value={form.CustomerID} onChange={set('CustomerID')}>
            <option value="">{t('accounting.opt_select')}</option>
            {customers.map(c => <option key={c.CustomerID} value={c.CustomerID}>{c.DisplayName}</option>)}
          </select>
        </Field>
        <Field label={t('accounting.lbl_payment_terms')}>
          <select className={input} value={form.PaymentTerms} onChange={set('PaymentTerms')}>
            {PAYMENT_TERMS.map(term => <option key={term}>{term}</option>)}
          </select>
        </Field>
        <Field label={t('accounting.lbl_invoice_date')}><input type="date" className={input} value={form.InvoiceDate} onChange={set('InvoiceDate')} /></Field>
        <Field label={t('accounting.lbl_due_date')}><input type="date" className={input} value={form.DueDate} onChange={set('DueDate')} /></Field>
      </div>

      <p className="text-xs font-semibold text-gray-500 mb-2">{t('accounting.section_line_items')}</p>
      <table className="w-full text-sm mb-2">
        <thead><tr className="text-left text-xs text-gray-400 border-b">
          <th className="pb-1 flex-1">{t('accounting.th_description')}</th><th className="pb-1 w-16">{t('accounting.th_qty')}</th><th className="pb-1 w-24">{t('accounting.th_unit_price')}</th><th className="pb-1 w-20">{t('accounting.th_tax')}</th><th className="pb-1 w-8"></th>
        </tr></thead>
        <tbody>
          {form.Lines.map((l, i) => (
            <tr key={i} className="border-b">
              <td className="py-1 pr-2"><input className={input} value={l.Description} onChange={e => setLine(i, 'Description', e.target.value)} placeholder={t('accounting.th_description')} /></td>
              <td className="py-1 pr-2"><input type="number" className={input} value={l.Quantity} onChange={e => setLine(i, 'Quantity', e.target.value)} min="0" /></td>
              <td className="py-1 pr-2"><input type="number" className={input} value={l.UnitPrice} onChange={e => setLine(i, 'UnitPrice', e.target.value)} min="0" step="0.01" /></td>
              <td className="py-1 pr-2"><input type="number" className={input} value={l.TaxAmount} onChange={e => setLine(i, 'TaxAmount', e.target.value)} min="0" step="0.01" /></td>
              <td className="py-1"><button onClick={() => removeLine(i)} className="text-red-400 hover:text-red-600">✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addLine} className="text-sm text-green-700 hover:underline mb-4">{t('accounting.btn_add_line')}</button>

      <div className="text-right text-sm space-y-1 mb-4">
        <div className="text-gray-500">{t('accounting.subtotal_label')} <strong>{new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(subTotal)}</strong></div>
        <div className="text-gray-500">{t('accounting.tax_label')} <strong>{new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(taxTotal)}</strong></div>
        <div className="font-bold text-gray-900">{t('accounting.total_label')} {new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(subTotal + taxTotal)}</div>
      </div>

      <Field label={t('accounting.lbl_notes')}><textarea className={input} rows={2} value={form.Notes} onChange={set('Notes')} /></Field>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className={btnWhite}>{t('accounting.btn_cancel')}</button>
        <button onClick={() => onSave(form)} className={btnGreen} disabled={!form.CustomerID}>{t('accounting.btn_create_invoice')}</button>
      </div>
    </Modal>
  );
}

// ─── BILL MODAL ───────────────────────────────────────────────

function BillModal({ vendors, onClose, onSave }) {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const due30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const [form, setForm] = useState({ VendorID: '', BillNumber: '', BillDate: today, DueDate: due30, Notes: '', Lines: [{ Description: '', Quantity: 1, UnitPrice: 0, TaxAmount: 0 }] });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  function setLine(i, k, v) { setForm(f => { const ls = [...f.Lines]; ls[i] = { ...ls[i], [k]: v }; return { ...f, Lines: ls }; }); }
  function addLine() { setForm(f => ({ ...f, Lines: [...f.Lines, { Description: '', Quantity: 1, UnitPrice: 0, TaxAmount: 0 }] })); }

  return (
    <Modal title={t('accounting.modal_new_bill')} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label={t('accounting.lbl_vendor')}>
          <select className={input} value={form.VendorID} onChange={set('VendorID')}>
            <option value="">{t('accounting.opt_select')}</option>
            {vendors.map(v => <option key={v.VendorID} value={v.VendorID}>{v.DisplayName}</option>)}
          </select>
        </Field>
        <Field label={t('accounting.lbl_bill_number')}><input className={input} value={form.BillNumber} onChange={set('BillNumber')} /></Field>
        <Field label={t('accounting.lbl_bill_date')}><input type="date" className={input} value={form.BillDate} onChange={set('BillDate')} /></Field>
        <Field label={t('accounting.lbl_due_date')}><input type="date" className={input} value={form.DueDate} onChange={set('DueDate')} /></Field>
      </div>
      <p className="text-xs font-semibold text-gray-500 mb-2">{t('accounting.section_line_items')}</p>
      <table className="w-full text-sm mb-2">
        <thead><tr className="text-left text-xs text-gray-400 border-b">
          <th className="pb-1">{t('accounting.th_description')}</th><th className="pb-1 w-16">{t('accounting.th_qty')}</th><th className="pb-1 w-24">{t('accounting.th_unit_price')}</th><th className="pb-1 w-20">{t('accounting.th_tax')}</th>
        </tr></thead>
        <tbody>
          {form.Lines.map((l, i) => (
            <tr key={i} className="border-b">
              <td className="py-1 pr-2"><input className={input} value={l.Description} onChange={e => setLine(i, 'Description', e.target.value)} /></td>
              <td className="py-1 pr-2"><input type="number" className={input} value={l.Quantity} onChange={e => setLine(i, 'Quantity', e.target.value)} /></td>
              <td className="py-1 pr-2"><input type="number" className={input} value={l.UnitPrice} onChange={e => setLine(i, 'UnitPrice', e.target.value)} step="0.01" /></td>
              <td className="py-1 pr-2"><input type="number" className={input} value={l.TaxAmount} onChange={e => setLine(i, 'TaxAmount', e.target.value)} step="0.01" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addLine} className="text-sm text-green-700 hover:underline mb-4">{t('accounting.btn_add_line')}</button>
      <Field label={t('accounting.lbl_notes')}><textarea className={input} rows={2} value={form.Notes} onChange={set('Notes')} /></Field>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className={btnWhite}>{t('accounting.btn_cancel')}</button>
        <button onClick={() => onSave(form)} className={btnGreen} disabled={!form.VendorID}>{t('accounting.btn_create_bill')}</button>
      </div>
    </Modal>
  );
}

// ─── EXPENSE MODAL ────────────────────────────────────────────

function ExpenseModal({ vendors, accounts, onClose, onSave }) {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ VendorID: '', ExpenseDate: today, PaymentMethod: 'Credit Card', Reference: '', Notes: '', Lines: [{ AccountID: '', Description: '', Amount: 0, IsBillable: false }] });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  function setLine(i, k, v) { setForm(f => { const ls = [...f.Lines]; ls[i] = { ...ls[i], [k]: v }; return { ...f, Lines: ls }; }); }
  function addLine() { setForm(f => ({ ...f, Lines: [...f.Lines, { AccountID: '', Description: '', Amount: 0, IsBillable: false }] })); }

  return (
    <Modal title={t('accounting.modal_new_expense')} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label={t('accounting.lbl_vendor_optional')}>
          <select className={input} value={form.VendorID} onChange={set('VendorID')}>
            <option value="">{t('accounting.opt_optional')}</option>
            {vendors.map(v => <option key={v.VendorID} value={v.VendorID}>{v.DisplayName}</option>)}
          </select>
        </Field>
        <Field label={t('accounting.lbl_payment_method')}>
          <select className={input} value={form.PaymentMethod} onChange={set('PaymentMethod')}>
            {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label={t('accounting.lbl_expense_date')}><input type="date" className={input} value={form.ExpenseDate} onChange={set('ExpenseDate')} /></Field>
        <Field label={t('accounting.lbl_reference')}><input className={input} value={form.Reference} onChange={set('Reference')} /></Field>
      </div>
      <p className="text-xs font-semibold text-gray-500 mb-2">{t('accounting.section_expense_lines')}</p>
      <table className="w-full text-sm mb-2">
        <thead><tr className="text-left text-xs text-gray-400 border-b">
          <th className="pb-1">{t('accounting.th_account_col')}</th><th className="pb-1">{t('accounting.th_description')}</th><th className="pb-1 w-24">{t('accounting.th_amount')}</th>
        </tr></thead>
        <tbody>
          {form.Lines.map((l, i) => (
            <tr key={i} className="border-b">
              <td className="py-1 pr-2">
                <select className={input} value={l.AccountID} onChange={e => setLine(i, 'AccountID', e.target.value)}>
                  <option value="">{t('accounting.opt_account')}</option>
                  {accounts.filter(a => a.FinancialStatement === 'Income Statement').map(a => (
                    <option key={a.AccountID} value={a.AccountID}>{a.AccountNumber} {a.AccountName}</option>
                  ))}
                </select>
              </td>
              <td className="py-1 pr-2"><input className={input} value={l.Description} onChange={e => setLine(i, 'Description', e.target.value)} /></td>
              <td className="py-1 pr-2"><input type="number" className={input} value={l.Amount} onChange={e => setLine(i, 'Amount', e.target.value)} step="0.01" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addLine} className="text-sm text-green-700 hover:underline mb-4">{t('accounting.btn_add_line')}</button>
      <Field label={t('accounting.lbl_notes')}><textarea className={input} rows={2} value={form.Notes} onChange={set('Notes')} /></Field>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className={btnWhite}>{t('accounting.btn_cancel')}</button>
        <button onClick={() => onSave(form)} className={btnGreen}>{t('accounting.btn_save_expense')}</button>
      </div>
    </Modal>
  );
}
