import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const GREEN = '#3D6B34';
const NAV_BG = '#516234';

function authHeaders() {
  const t = localStorage.getItem('access_token') || '';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` };
}

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '';
}

function Badge({ label, color = 'gray' }) {
  const map = {
    green:  'bg-green-100 text-green-700',
    blue:   'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red:    'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    gray:   'bg-gray-100 text-gray-600',
  };
  return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${map[color] || map.gray}`}>{label}</span>;
}

function SectionTitle({ children }) {
  return <h2 className="text-base font-bold text-gray-800 mb-3" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>{children}</h2>;
}

function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>{children}</div>;
}

function ModalWrap({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-10" style={{ backgroundColor: NAV_BG }}>
          <span className="text-white font-bold text-sm truncate">{title}</span>
          <button onClick={onClose} className="text-white text-lg leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'contracts',    label: 'Contracts' },
  { id: 'payments',     label: 'Payment Plans' },
  { id: 'workshares',   label: 'Work Shares' },
  { id: 'boxbot',       label: 'BoxBot' },
  { id: 'vacations',    label: 'Vacation Holds' },
  { id: 'sites',        label: 'Pickup Sites' },
  { id: 'progress',     label: 'Crop Progress' },
  { id: 'newsletters',  label: 'Newsletters' },
  { id: 'harvest',      label: 'Harvest Allocation' },
  { id: 'labels',       label: 'Box Labels' },
];

export default function CSAAdvanced() {
  const { BusinessID } = useAccount();
  const [tab, setTab] = useState('contracts');

  if (!BusinessID) return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-20 text-center text-gray-500">
        <p className="font-semibold">Please log in and select a business to use CSA Advanced tools.</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <PageMeta title="CSA Advanced Tools — Oatmeal Farm Network" description="Membership contracts, BoxBot allocation, vacation holds, pickup sites, newsletters, and more." />
      <Header />
      <div style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0) 100%)', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Breadcrumbs items={[{ label: 'CSA Advanced' }]} />
          <h1 className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>CSA Advanced Tools</h1>
          <p className="text-gray-500 text-sm mt-1">Membership logic, BoxBot allocation, vacation holds, pickup sites, newsletters, and harvest planning.</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 transition -mb-px ${tab === t.id ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {tab === 'contracts'   && <ContractsTab bid={BusinessID} />}
        {tab === 'payments'    && <PaymentsTab bid={BusinessID} />}
        {tab === 'workshares'  && <WorkSharesTab bid={BusinessID} />}
        {tab === 'boxbot'      && <BoxBotTab bid={BusinessID} />}
        {tab === 'vacations'   && <VacationHoldsTab bid={BusinessID} />}
        {tab === 'sites'       && <PickupSitesTab bid={BusinessID} />}
        {tab === 'progress'    && <CropProgressTab bid={BusinessID} />}
        {tab === 'newsletters' && <NewslettersTab bid={BusinessID} />}
        {tab === 'harvest'     && <HarvestAllocationTab bid={BusinessID} />}
        {tab === 'labels'      && <BoxLabelsTab bid={BusinessID} />}
      </div>
      <Footer />
    </div>
  );
}


// ─── CONTRACTS ────────────────────────────────────────────────────────────────

function ContractsTab({ bid }) {
  const [contracts, setContracts] = useState([]);
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState({ season_year: new Date().getFullYear(), terms_text: '', people_id: '' });
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/contracts`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setContracts(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/api/csa-advanced/${bid}/contracts`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(form),
    });
    setSaving(false); setModal(false); setForm({ season_year: new Date().getFullYear(), terms_text: '', people_id: '' });
    load();
  };

  const sign = async (id) => {
    await fetch(`${API}/api/csa-advanced/contracts/${id}/sign`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ signature_data: 'web-click-accepted' }),
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Archive this contract?')) return;
    await fetch(`${API}/api/csa-advanced/contracts/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Shared Risk/Reward Contracts</SectionTitle>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>+ New Contract</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Digital agreements where members explicitly accept lower yields in exchange for supporting upfront farm costs.</p>
      {contracts.length === 0 ? <div className="text-center py-16 text-gray-400">No contracts yet.</div> : (
        <div className="space-y-3">
          {contracts.map(c => (
            <Card key={c.ContractID} className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900 text-sm">{c.MemberFullName || `Member #${c.PeopleID}`}</div>
                <div className="text-xs text-gray-400 mt-0.5">Season {c.SeasonYear}</div>
                {c.SignedAt
                  ? <Badge label={`Signed ${fmtDate(c.SignedAt)}`} color="green" />
                  : <Badge label="Awaiting Signature" color="yellow" />}
                {c.TermsText && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{c.TermsText}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {!c.SignedAt && <button onClick={() => sign(c.ContractID)} className="text-xs px-3 py-1.5 rounded-lg font-bold text-white" style={{ backgroundColor: GREEN }}>Mark Signed</button>}
                <button onClick={() => remove(c.ContractID)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Archive</button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {modal && (
        <ModalWrap title="New Member Contract" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">People ID (member)</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" value={form.people_id} onChange={e => setForm(f => ({ ...f, people_id: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Season Year</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" value={form.season_year} onChange={e => setForm(f => ({ ...f, season_year: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Contract Terms</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={6}
                placeholder="By joining this CSA, the member agrees to accept variations in yield due to weather, pests, and other farming realities. In exchange for upfront payment, the farm commits to..."
                value={form.terms_text} onChange={e => setForm(f => ({ ...f, terms_text: e.target.value }))} /></div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Saving…' : 'Create Contract'}</button>
              <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}


// ─── PAYMENT PLANS ────────────────────────────────────────────────────────────

function PaymentsTab({ bid }) {
  const [plans, setPlans]   = useState([]);
  const [modal, setModal]   = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm]     = useState({ plan_type: 'installment', total_amount: '', season_year: new Date().getFullYear(), people_id: '', notes: '', installments: [] });
  const [saving, setSaving] = useState(false);
  const [instRows, setInstRows] = useState([{ due_date: '', amount: '' }]);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/payment-plans`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setPlans(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const save = async () => {
    setSaving(true);
    const payload = { ...form, installments: instRows.filter(r => r.due_date && r.amount) };
    await fetch(`${API}/api/csa-advanced/${bid}/payment-plans`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(payload),
    });
    setSaving(false); setModal(false); load();
  };

  const payInst = async (planId, instId, amt) => {
    await fetch(`${API}/api/csa-advanced/payment-plans/${planId}/installments/${instId}/pay`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify({ paid_amount: amt }),
    });
    load();
  };

  const TYPE_LABELS = { lump_sum: 'Lump Sum', buy_down: 'Buy-Down Credits', installment: 'Installment Plan' };
  const STATUS_COLOR = { active: 'blue', paid: 'green', overdue: 'red' };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Upfront Payment Plans</SectionTitle>
        <button onClick={() => { setModal(true); setInstRows([{ due_date: '', amount: '' }]); }} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>+ New Plan</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Lump-sum seasonal payments, buy-down credits, or installment plans that start before the first harvest.</p>
      {plans.length === 0 ? <div className="text-center py-16 text-gray-400">No payment plans yet.</div> : (
        <div className="space-y-3">
          {plans.map(p => (
            <Card key={p.PlanID}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{p.MemberFullName || `Member #${p.PeopleID}`}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge label={TYPE_LABELS[p.PlanType] || p.PlanType} color="blue" />
                    <Badge label={p.Status} color={STATUS_COLOR[p.Status] || 'gray'} />
                    <span className="text-xs text-gray-500">Season {p.SeasonYear}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-bold text-gray-900">${Number(p.PaidAmount || 0).toFixed(2)}</span>
                    <span className="text-gray-400"> / ${Number(p.TotalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 max-w-xs">
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: GREEN, width: `${Math.min(100, (p.PaidAmount / p.TotalAmount) * 100)}%` }} />
                  </div>
                </div>
                <button onClick={() => setDetail(detail?.PlanID === p.PlanID ? null : p)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0">
                  {detail?.PlanID === p.PlanID ? 'Hide' : 'Installments'}
                </button>
              </div>
              {detail?.PlanID === p.PlanID && (
                <div className="mt-4 border-t border-gray-100 pt-3 space-y-2">
                  {(p.installments || []).map(i => (
                    <div key={i.InstallmentID} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-700">Due {fmtDate(i.DueDate)}</span>
                        <span className="text-gray-500 ml-2">${Number(i.Amount).toFixed(2)}</span>
                      </div>
                      {i.PaidAt
                        ? <Badge label={`Paid ${fmtDate(i.PaidAt)}`} color="green" />
                        : <button onClick={() => payInst(p.PlanID, i.InstallmentID, i.Amount)} className="text-xs px-2 py-1 rounded text-white font-semibold" style={{ backgroundColor: GREEN }}>Mark Paid</button>}
                    </div>
                  ))}
                  {p.installments?.length === 0 && <p className="text-xs text-gray-400">No installments on this plan.</p>}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      {modal && (
        <ModalWrap title="New Payment Plan" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">People ID</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" value={form.people_id} onChange={e => setForm(f => ({ ...f, people_id: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Plan Type</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={form.plan_type} onChange={e => setForm(f => ({ ...f, plan_type: e.target.value }))}>
                <option value="lump_sum">Lump Sum (full season upfront)</option>
                <option value="buy_down">Buy-Down Credits (debit-style)</option>
                <option value="installment">Installment Plan</option>
              </select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Total Amount ($)</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" value={form.total_amount} onChange={e => setForm(f => ({ ...f, total_amount: e.target.value }))} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Season Year</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="number" value={form.season_year} onChange={e => setForm(f => ({ ...f, season_year: e.target.value }))} /></div>
            </div>
            {form.plan_type === 'installment' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Installment Schedule</label>
                {instRows.map((r, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="date" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={r.due_date} onChange={e => { const rows = [...instRows]; rows[i].due_date = e.target.value; setInstRows(rows); }} />
                    <input type="number" placeholder="$" className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={r.amount} onChange={e => { const rows = [...instRows]; rows[i].amount = e.target.value; setInstRows(rows); }} />
                    {instRows.length > 1 && <button onClick={() => setInstRows(instRows.filter((_, j) => j !== i))} className="text-red-500 px-1">✕</button>}
                  </div>
                ))}
                <button onClick={() => setInstRows([...instRows, { due_date: '', amount: '' }])} className="text-xs text-green-700 hover:underline">+ Add installment</button>
              </div>
            )}
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Saving…' : 'Create Plan'}</button>
              <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}


// ─── WORK SHARES ─────────────────────────────────────────────────────────────

function WorkSharesTab({ bid }) {
  const [workShares, setWorkShares] = useState([]);
  const [modal, setModal]   = useState(false);
  const [logModal, setLogModal] = useState(null);
  const [logs, setLogs]     = useState([]);
  const [form, setForm]     = useState({ member_name: '', required_hours: '', discount_pct: '', season_year: new Date().getFullYear(), notes: '' });
  const [logForm, setLogForm] = useState({ log_date: '', hours_worked: '', task_description: '', approved_by: '' });
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/work-shares`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setWorkShares(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const openLogs = (ws) => {
    setLogModal(ws);
    fetch(`${API}/api/csa-advanced/work-shares/${ws.WorkShareID}/logs`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setLogs(Array.isArray(d) ? d : []));
  };

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/api/csa-advanced/${bid}/work-shares`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(form),
    });
    setSaving(false); setModal(false); load();
  };

  const addLog = async () => {
    if (!logForm.log_date || !logForm.hours_worked) return;
    await fetch(`${API}/api/csa-advanced/work-shares/${logModal.WorkShareID}/logs`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(logForm),
    });
    setLogForm({ log_date: '', hours_worked: '', task_description: '', approved_by: '' });
    openLogs(logModal); load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this work share record?')) return;
    await fetch(`${API}/api/csa-advanced/work-shares/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Work Share Tracking</SectionTitle>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>+ Add Working Member</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Track members who receive discounted shares in exchange for farm labor hours.</p>
      {workShares.length === 0 ? <div className="text-center py-16 text-gray-400">No work-share members.</div> : (
        <div className="space-y-3">
          {workShares.map(ws => {
            const pct = ws.RequiredHours > 0 ? Math.min(100, (ws.LoggedHours / ws.RequiredHours) * 100) : 0;
            return (
              <Card key={ws.WorkShareID} className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{ws.MemberName}</div>
                  <div className="text-xs text-gray-400">Season {ws.SeasonYear} · {ws.DiscountPct}% discount</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-xs">
                      <div className="h-2 rounded-full" style={{ backgroundColor: GREEN, width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{ws.LoggedHours} / {ws.RequiredHours} hrs</span>
                    {ws.LoggedHours >= ws.RequiredHours && <Badge label="Complete" color="green" />}
                  </div>
                  {ws.Notes && <p className="text-xs text-gray-500 mt-1">{ws.Notes}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openLogs(ws)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Log Hours</button>
                  <button onClick={() => remove(ws.WorkShareID)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {modal && (
        <ModalWrap title="Add Working Member" onClose={() => setModal(false)}>
          <div className="space-y-3">
            {[['member_name','Member Name','text'], ['required_hours','Required Hours','number'], ['discount_pct','Share Discount (%)','number'], ['season_year','Season Year','number']].map(([key, label, type]) => (
              <div key={key}><label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                <input type={type} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} /></div>
            ))}
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Saving…' : 'Add Member'}</button>
              <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        </ModalWrap>
      )}
      {logModal && (
        <ModalWrap title={`Log Hours — ${logModal.MemberName}`} onClose={() => setLogModal(null)}>
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={logForm.log_date} onChange={e => setLogForm(f => ({ ...f, log_date: e.target.value }))} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Hours</label>
                <input type="number" step="0.5" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={logForm.hours_worked} onChange={e => setLogForm(f => ({ ...f, hours_worked: e.target.value }))} /></div>
            </div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Task</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={logForm.task_description} onChange={e => setLogForm(f => ({ ...f, task_description: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Approved By</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={logForm.approved_by} onChange={e => setLogForm(f => ({ ...f, approved_by: e.target.value }))} /></div>
            <button onClick={addLog} className="w-full py-2 rounded-lg text-white font-bold text-sm" style={{ backgroundColor: GREEN }}>Log Entry</button>
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="text-xs font-semibold text-gray-500 mb-2">Hour Log</div>
            {logs.length === 0 ? <p className="text-xs text-gray-400">No hours logged yet.</p> : logs.map(l => (
              <div key={l.LogID} className="flex items-start justify-between text-sm gap-3">
                <div><span className="font-semibold">{l.HoursWorked} hrs</span> — {l.TaskDescription}</div>
                <span className="text-xs text-gray-400 shrink-0">{fmtDate(l.LogDate)}</span>
              </div>
            ))}
          </div>
        </ModalWrap>
      )}
    </div>
  );
}


// ─── BOXBOT ───────────────────────────────────────────────────────────────────

function BoxBotTab({ bid }) {
  const [runs, setRuns] = useState([]);
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [harvest, setHarvest] = useState([{ crop: '', qty: '', unit: 'lbs' }]);
  const [weekOf, setWeekOf] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/boxbot/runs`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setRuns(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const openDetail = (run) => {
    fetch(`${API}/api/csa-advanced/${bid}/boxbot/runs/${run.RunID}`, { headers: authHeaders() })
      .then(r => r.json()).then(setDetail);
  };

  const run = async () => {
    const validHarvest = harvest.filter(h => h.crop && h.qty);
    if (!validHarvest.length || !weekOf) return;
    setRunning(true);
    const res = await fetch(`${API}/api/csa-advanced/${bid}/boxbot/run`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ harvest: validHarvest, week_of: weekOf }),
    });
    const data = await res.json();
    setRunning(false); setResult(data); setModal(false); load();
  };

  const confirm = async (runId) => {
    await fetch(`${API}/api/csa-advanced/${bid}/boxbot/runs/${runId}/confirm`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({}),
    });
    load(); if (detail?.RunID === runId) openDetail({ RunID: runId });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>BoxBot — Automated Share Balancing</SectionTitle>
        <button onClick={() => { setModal(true); setResult(null); }} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>Run BoxBot</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Enter the week's harvest. BoxBot distributes produce across members respecting allergies and preferences, balancing full vs. half shares.</p>
      {result && (
        <Card className="mb-4 border-green-200 bg-green-50">
          <div className="text-green-800 font-bold text-sm mb-2">BoxBot run complete — {result.allocations?.length ?? 0} boxes allocated</div>
          <div className="text-xs text-gray-500">Review the run below and confirm when ready to print labels.</div>
        </Card>
      )}
      {runs.length === 0 ? <div className="text-center py-16 text-gray-400">No BoxBot runs yet.</div> : (
        <div className="space-y-3">
          {runs.map(r => (
            <Card key={r.RunID}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Week of {fmtDate(r.WeekOf)}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge label={r.Status} color={r.Status === 'confirmed' ? 'green' : 'yellow'} />
                    <span className="text-xs text-gray-400">{fmtDate(r.CreatedAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openDetail(r)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">View</button>
                  {r.Status !== 'confirmed' && <button onClick={() => confirm(r.RunID)} className="text-xs px-3 py-1.5 rounded-lg text-white font-bold" style={{ backgroundColor: GREEN }}>Confirm</button>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {detail && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onClick={() => setDetail(null)}>
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 sticky top-0" style={{ backgroundColor: NAV_BG }}>
              <span className="text-white font-bold">BoxBot Run — Week of {fmtDate(detail.WeekOf)}</span>
              <button onClick={() => setDetail(null)} className="text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">HARVEST INPUT</div>
                <div className="flex flex-wrap gap-2">
                  {(detail.harvest || []).map((h, i) => <Badge key={i} label={`${h.crop} — ${h.qty} ${h.unit}`} color="blue" />)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">ALLOCATIONS ({detail.allocations?.length})</div>
                <div className="space-y-2">
                  {(detail.allocations || []).map((a, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-3">
                      <div className="font-semibold text-sm text-gray-900">{a.member_name} <span className="text-xs text-gray-400 font-normal">({a.share_type})</span></div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(a.items || []).map((item, j) => <Badge key={j} label={`${item.crop} ${item.qty}${item.unit}`} color="gray" />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {detail.Status !== 'confirmed' && (
                <button onClick={() => confirm(detail.RunID)} className="w-full py-3 rounded-xl text-white font-bold" style={{ backgroundColor: GREEN }}>Confirm & Generate Labels</button>
              )}
            </div>
          </div>
        </div>
      )}
      {modal && (
        <ModalWrap title="Run BoxBot" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Week Of</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={weekOf} onChange={e => setWeekOf(e.target.value)} /></div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">This Week's Harvest</label>
              {harvest.map((h, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input placeholder="Crop" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={h.crop} onChange={e => { const rows = [...harvest]; rows[i].crop = e.target.value; setHarvest(rows); }} />
                  <input placeholder="Qty" type="number" className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={h.qty} onChange={e => { const rows = [...harvest]; rows[i].qty = e.target.value; setHarvest(rows); }} />
                  <input placeholder="Unit" className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={h.unit} onChange={e => { const rows = [...harvest]; rows[i].unit = e.target.value; setHarvest(rows); }} />
                  {harvest.length > 1 && <button onClick={() => setHarvest(harvest.filter((_, j) => j !== i))} className="text-red-400">✕</button>}
                </div>
              ))}
              <button onClick={() => setHarvest([...harvest, { crop: '', qty: '', unit: 'lbs' }])} className="text-xs text-green-700 hover:underline">+ Add crop</button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={run} disabled={running} className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{running ? 'Running…' : 'Run BoxBot'}</button>
              <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}


// ─── VACATION HOLDS ───────────────────────────────────────────────────────────

function VacationHoldsTab({ bid }) {
  const [holds, setHolds] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ member_name: '', hold_week: '', disposition: 'donate', credit_value: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/vacation-holds`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setHolds(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/api/csa-advanced/${bid}/vacation-holds`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(form),
    });
    setSaving(false); setModal(false); load();
  };

  const remove = async (id) => {
    await fetch(`${API}/api/csa-advanced/vacation-holds/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  const DISP_LABELS = { donate: 'Donate to Food Bank', double_credit: 'Double Credit Next Week', addon_credit: 'Add-On Credit' };
  const DISP_COLOR  = { donate: 'green', double_credit: 'blue', addon_credit: 'purple' };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Vacation Holds</SectionTitle>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>+ Add Hold</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Members can pause a box for a week — donate it, receive double credit next week, or apply the value toward add-on items.</p>
      {holds.length === 0 ? <div className="text-center py-16 text-gray-400">No vacation holds.</div> : (
        <div className="space-y-3">
          {holds.map(h => (
            <Card key={h.HoldID} className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900 text-sm">{h.MemberName}</div>
                <div className="text-xs text-gray-400 mt-0.5">Week skipped: {fmtDate(h.HoldWeek)}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge label={DISP_LABELS[h.Disposition] || h.Disposition} color={DISP_COLOR[h.Disposition] || 'gray'} />
                  {h.CreditValue && <span className="text-xs text-gray-500">Credit: ${Number(h.CreditValue).toFixed(2)}</span>}
                  {h.AppliedAt && <Badge label={`Applied ${fmtDate(h.AppliedAt)}`} color="green" />}
                </div>
                {h.Notes && <p className="text-xs text-gray-500 mt-1">{h.Notes}</p>}
              </div>
              <button onClick={() => remove(h.HoldID)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 shrink-0">Remove</button>
            </Card>
          ))}
        </div>
      )}
      {modal && (
        <ModalWrap title="Add Vacation Hold" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Member Name</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.member_name} onChange={e => setForm(f => ({ ...f, member_name: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Skip Week (date of box)</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.hold_week} onChange={e => setForm(f => ({ ...f, hold_week: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">What to do with this share</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={form.disposition} onChange={e => setForm(f => ({ ...f, disposition: e.target.value }))}>
                <option value="donate">Donate to local food bank</option>
                <option value="double_credit">Double credit the following week</option>
                <option value="addon_credit">Apply value to add-on items</option>
              </select></div>
            {form.disposition !== 'donate' && (
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Credit Value ($)</label>
                <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.credit_value} onChange={e => setForm(f => ({ ...f, credit_value: e.target.value }))} /></div>
            )}
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Saving…' : 'Add Hold'}</button>
              <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}


// ─── PICKUP SITES ─────────────────────────────────────────────────────────────

function PickupSitesTab({ bid }) {
  const [sites, setSites]       = useState([]);
  const [modal, setModal]       = useState(false);
  const [signin, setSignin]     = useState(null);
  const [signinData, setSigninData] = useState([]);
  const [signinDate, setSigninDate] = useState('');
  const [form, setForm]         = useState({ site_name: '', address: '', city: '', state_province: '', contact_name: '', contact_phone: '', special_instructions: '' });
  const [saving, setSaving]     = useState(false);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/pickup-sites`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setSites(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/api/csa-advanced/${bid}/pickup-sites`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(form),
    });
    setSaving(false); setModal(false); load();
  };

  const remove = async (id) => {
    if (!confirm('Deactivate this pickup site?')) return;
    await fetch(`${API}/api/csa-advanced/pickup-sites/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  const openSignin = async (site, d) => {
    setSignin(site); setSigninDate(d);
    const res = await fetch(`${API}/api/csa-advanced/${bid}/pickup-sites/${site.SiteID}/signin?delivery_date=${d}`, { headers: authHeaders() });
    const data = await res.json();
    setSigninData(Array.isArray(data) ? data : []);
  };

  const markSignin = async (row) => {
    await fetch(`${API}/api/csa-advanced/${bid}/pickup-sites/${signin.SiteID}/signin`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ subscription_id: row.SubscriptionID, people_id: row.PeopleID, member_name: row.MemberName, delivery_date: signinDate }),
    });
    openSignin(signin, signinDate);
  };

  const seed = async () => {
    if (!signinDate) return;
    await fetch(`${API}/api/csa-advanced/${bid}/pickup-sites/${signin.SiteID}/signin/seed`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify({ delivery_date: signinDate }),
    });
    openSignin(signin, signinDate);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Pickup / Drop Sites</SectionTitle>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>+ Add Site</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Manage community drop sites with sign-in sheets and site-specific pickup instructions.</p>
      {sites.length === 0 ? <div className="text-center py-16 text-gray-400">No pickup sites yet.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sites.map(s => (
            <Card key={s.SiteID}>
              <div className="font-bold text-gray-900">{s.SiteName}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.Address}{s.City ? `, ${s.City}` : ''}{s.StateProvince ? `, ${s.StateProvince}` : ''}</div>
              {s.ContactName && <div className="text-xs text-gray-500 mt-1">{s.ContactName} · {s.ContactPhone}</div>}
              <div className="text-xs text-green-700 font-semibold mt-1">{s.MemberCount} members assigned</div>
              {s.SpecialInstructions && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{s.SpecialInstructions}</p>}
              <div className="flex gap-2 mt-3">
                <div className="flex gap-2 flex-1">
                  <input type="date" className="border border-gray-200 rounded-lg px-2 py-1 text-xs flex-1" value={signinDate} onChange={e => setSigninDate(e.target.value)} />
                  <button onClick={() => openSignin(s, signinDate)} className="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 whitespace-nowrap">Sign-in Sheet</button>
                </div>
                <button onClick={() => remove(s.SiteID)} className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {signin && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onClick={() => setSignin(null)}>
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 sticky top-0" style={{ backgroundColor: NAV_BG }}>
              <span className="text-white font-bold">Sign-in — {signin.SiteName}</span>
              <button onClick={() => setSignin(null)} className="text-white">✕</button>
            </div>
            <div className="p-5">
              <div className="flex gap-2 mb-4">
                <input type="date" className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1" value={signinDate} onChange={e => setSigninDate(e.target.value)} />
                <button onClick={seed} className="px-3 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>Seed Sheet</button>
              </div>
              {signinData.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No sign-in data. Click "Seed Sheet" to populate from assignments.</p> : (
                <div className="space-y-2">
                  {signinData.map(r => (
                    <div key={r.SigninID} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-3 py-2">
                      <span className="font-medium text-gray-800">{r.MemberName}</span>
                      {r.SignedIn
                        ? <Badge label={`Signed in ${r.SignInTime ? new Date(r.SignInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`} color="green" />
                        : <button onClick={() => markSignin(r)} className="text-xs px-3 py-1 rounded-lg text-white font-bold" style={{ backgroundColor: GREEN }}>Sign In</button>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {modal && (
        <ModalWrap title="Add Pickup Site" onClose={() => setModal(false)}>
          <div className="space-y-3">
            {[['site_name','Site Name'], ['address','Street Address'], ['city','City'], ['state_province','State/Province'], ['contact_name','Contact Person'], ['contact_phone','Contact Phone']].map(([key, label]) => (
              <div key={key}><label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} /></div>
            ))}
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Special Instructions for Members</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3} value={form.special_instructions} onChange={e => setForm(f => ({ ...f, special_instructions: e.target.value }))} placeholder="e.g. Boxes are on the back porch. Ring bell on arrival. Volunteer: Jane Smith." /></div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Saving…' : 'Add Site'}</button>
              <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}


// ─── CROP PROGRESS ────────────────────────────────────────────────────────────

function CropProgressTab({ bid }) {
  const [posts, setPosts]   = useState([]);
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState({ crop_name: '', caption: '', photo_url: '', is_public: true });
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/crop-progress`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setPosts(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/api/csa-advanced/${bid}/crop-progress`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(form),
    });
    setSaving(false); setModal(false); load();
  };

  const remove = async (id) => {
    await fetch(`${API}/api/csa-advanced/crop-progress/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Crop Progress Photo Feed</SectionTitle>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>+ New Post</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Behind-the-scenes updates showing members the growth of the crops they've invested in. Can be posted by Rosemarie or Thaiyme agents.</p>
      {posts.length === 0 ? <div className="text-center py-16 text-gray-400">No progress posts yet.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map(p => (
            <Card key={p.ProgressID} className="flex flex-col">
              {p.PhotoURL && <img src={p.PhotoURL} alt={p.CropName} className="w-full h-40 object-cover rounded-lg mb-3" />}
              <div className="font-bold text-gray-900 text-sm">{p.CropName}</div>
              {p.PostedByAgent && <div className="text-[11px] text-green-700 font-semibold">{p.PostedByAgent}</div>}
              <p className="text-xs text-gray-600 mt-1 flex-1">{p.Caption}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{fmtDate(p.PostedAt)}</span>
                <div className="flex items-center gap-2">
                  <Badge label={p.IsPublic ? 'Public' : 'Private'} color={p.IsPublic ? 'green' : 'gray'} />
                  <button onClick={() => remove(p.ProgressID)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {modal && (
        <ModalWrap title="New Crop Progress Post" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Crop Name</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.crop_name} onChange={e => setForm(f => ({ ...f, crop_name: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Caption</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={4} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Describe what's happening in the field this week..." /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Photo URL</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} placeholder="https://..." /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pub" checked={form.is_public} onChange={e => setForm(f => ({ ...f, is_public: e.target.checked }))} />
              <label htmlFor="pub" className="text-sm text-gray-700">Visible to all members</label>
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Posting…' : 'Post Update'}</button>
              <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}


// ─── NEWSLETTERS ─────────────────────────────────────────────────────────────

function NewslettersTab({ bid }) {
  const [sends, setSends]   = useState([]);
  const [preview, setPreview] = useState(null);
  const [harvest, setHarvest] = useState([{ crop: '', qty: '', unit: 'lbs' }]);
  const [weekOf, setWeekOf] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/newsletters`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setSends(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const buildPreview = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/csa-advanced/${bid}/newsletters/preview`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ harvest: harvest.filter(h => h.crop), week_of: weekOf, subject }),
    });
    const data = await res.json();
    setPreview(data); setLoading(false);
  };

  const send = async () => {
    setSending(true);
    await fetch(`${API}/api/csa-advanced/${bid}/newsletters/send`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ harvest: harvest.filter(h => h.crop), week_of: weekOf, subject, body: preview?.body }),
    });
    setSending(false); setPreview(null); load();
  };

  return (
    <div>
      <SectionTitle>"What's In The Box" Newsletters</SectionTitle>
      <p className="text-sm text-gray-500 mb-5">Auto-generate member newsletters from the week's harvest list, including produce variety and quantity details.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="font-semibold text-gray-700 text-sm mb-3">Compose Newsletter</div>
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Week Of</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={weekOf} onChange={e => setWeekOf(e.target.value)} /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Subject (optional)</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Auto-generated if blank" /></div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">This Week's Harvest</label>
              {harvest.map((h, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input placeholder="Crop" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={h.crop} onChange={e => { const rows = [...harvest]; rows[i].crop = e.target.value; setHarvest(rows); }} />
                  <input placeholder="Qty" type="number" className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={h.qty} onChange={e => { const rows = [...harvest]; rows[i].qty = e.target.value; setHarvest(rows); }} />
                  <input placeholder="Unit" className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-sm" value={h.unit} onChange={e => { const rows = [...harvest]; rows[i].unit = e.target.value; setHarvest(rows); }} />
                  {harvest.length > 1 && <button onClick={() => setHarvest(harvest.filter((_, j) => j !== i))} className="text-red-400">✕</button>}
                </div>
              ))}
              <button onClick={() => setHarvest([...harvest, { crop: '', qty: '', unit: 'lbs' }])} className="text-xs text-green-700 hover:underline">+ Add crop</button>
            </div>
            <button onClick={buildPreview} disabled={loading} className="w-full py-2.5 rounded-lg font-bold text-sm border-2 transition disabled:opacity-40" style={{ color: GREEN, borderColor: GREEN }}>
              {loading ? 'Generating…' : 'Generate Preview'}
            </button>
          </div>
        </Card>
        {preview && (
          <Card className="flex flex-col">
            <div className="font-semibold text-gray-700 text-sm mb-2">Preview</div>
            <div className="text-xs font-semibold text-gray-500">Subject: {preview.subject}</div>
            <div className="text-xs text-gray-400 mb-3">To: {preview.recipient_count} active members</div>
            <div className="text-sm text-gray-700 border border-gray-100 rounded-lg p-3 flex-1 overflow-y-auto max-h-64"
              dangerouslySetInnerHTML={{ __html: preview.body }} />
            <button onClick={send} disabled={sending} className="mt-3 w-full py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>
              {sending ? 'Sending…' : `Send to ${preview.recipient_count} Members`}
            </button>
          </Card>
        )}
      </div>
      {sends.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-semibold text-gray-600 mb-3">Previous Sends</div>
          <div className="space-y-2">
            {sends.map(s => (
              <div key={s.SendID} className="flex items-center justify-between text-sm bg-white rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <span className="font-medium text-gray-800">{s.Subject}</span>
                  <span className="text-gray-400 ml-2 text-xs">Week of {fmtDate(s.WeekOf)}</span>
                </div>
                <span className="text-xs text-gray-400">{s.RecipientCount} recipients · {fmtDate(s.SentAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── HARVEST ALLOCATION ───────────────────────────────────────────────────────

function HarvestAllocationTab({ bid }) {
  const [allocs, setAllocs] = useState([]);
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState({ week_of: '', crop_name: '', estimated_yield: '', yield_unit: 'lbs', full_share_qty: '', half_share_qty: '', addon_qty: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [autoCalc, setAutoCalc] = useState(true);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/harvest-allocations`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setAllocs(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`${API}/api/csa-advanced/${bid}/harvest-allocations`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...form, auto_calc: autoCalc }),
    });
    const data = await res.json();
    if (data.full_share_qty && autoCalc) {
      // Show auto-calc result feedback
    }
    setSaving(false); setModal(false); load();
  };

  const confirm = async (id) => {
    await fetch(`${API}/api/csa-advanced/harvest-allocations/${id}`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ confirmed_at: new Date().toISOString() }),
    });
    load();
  };

  const remove = async (id) => {
    await fetch(`${API}/api/csa-advanced/harvest-allocations/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  };

  const weeks = [...new Set(allocs.map(a => a.WeekOf))].sort().reverse();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle>Harvest Estimates vs. Allocation</SectionTitle>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>+ Add Crop</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Compare maturity-engine yield predictions with your member count to calculate exactly how much goes in each Full Share vs. Half Share.</p>
      {allocs.length === 0 ? <div className="text-center py-16 text-gray-400">No harvest allocations yet.</div> : weeks.map(wk => (
        <div key={wk} className="mb-6">
          <div className="text-sm font-bold text-gray-600 mb-2">Week of {fmtDate(wk)}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl border border-gray-200 overflow-hidden">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>{['Crop','Est. Yield','Full Share','Half Share','Add-On','Shares','Confirmed',''].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allocs.filter(a => a.WeekOf === wk).map(a => (
                  <tr key={a.AllocationID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{a.CropName}</td>
                    <td className="px-4 py-3 text-gray-600">{a.EstimatedYield} {a.YieldUnit}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: GREEN }}>{a.FullShareQty} {a.YieldUnit}</td>
                    <td className="px-4 py-3 text-gray-600">{a.HalfShareQty} {a.YieldUnit}</td>
                    <td className="px-4 py-3 text-gray-600">{a.AddOnQty || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{a.TotalFullShares}F / {a.TotalHalfShares}H</td>
                    <td className="px-4 py-3">{a.ConfirmedAt ? <Badge label="Confirmed" color="green" /> : <button onClick={() => confirm(a.AllocationID)} className="text-xs text-green-700 hover:underline">Confirm</button>}</td>
                    <td className="px-4 py-3"><button onClick={() => remove(a.AllocationID)} className="text-xs text-red-500 hover:underline">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {modal && (
        <ModalWrap title="Add Harvest Allocation" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Week Of</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.week_of} onChange={e => setForm(f => ({ ...f, week_of: e.target.value }))} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Crop</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.crop_name} onChange={e => setForm(f => ({ ...f, crop_name: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Estimated Yield</label>
                <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.estimated_yield} onChange={e => setForm(f => ({ ...f, estimated_yield: e.target.value }))} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Unit</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.yield_unit} onChange={e => setForm(f => ({ ...f, yield_unit: e.target.value }))} /></div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" id="ac" checked={autoCalc} onChange={e => setAutoCalc(e.target.checked)} />
              <label htmlFor="ac" className="text-gray-700">Auto-calculate per-share quantities from member count</label>
            </div>
            {!autoCalc && (
              <div className="grid grid-cols-3 gap-3">
                {[['full_share_qty','Full Share'], ['half_share_qty','Half Share'], ['addon_qty','Add-On']].map(([key, label]) => (
                  <div key={key}><label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} /></div>
                ))}
              </div>
            )}
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Saving…' : 'Add Crop'}</button>
              <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        </ModalWrap>
      )}
    </div>
  );
}


// ─── BOX LABELS ───────────────────────────────────────────────────────────────

function BoxLabelsTab({ bid }) {
  const [runs, setRuns]     = useState([]);
  const [detail, setDetail] = useState(null);
  const [weekOf, setWeekOf] = useState('');
  const [generating, setGenerating] = useState(false);

  const load = () =>
    fetch(`${API}/api/csa-advanced/${bid}/box-labels`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setRuns(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, [bid]);

  const generate = async () => {
    if (!weekOf) return;
    setGenerating(true);
    const res = await fetch(`${API}/api/csa-advanced/${bid}/box-labels/generate`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify({ week_of: weekOf }),
    });
    const data = await res.json();
    setDetail(data); setGenerating(false); load();
  };

  const openRun = (run) => {
    fetch(`${API}/api/csa-advanced/${bid}/box-labels/${run.LabelRunID}`, { headers: authHeaders() })
      .then(r => r.json()).then(setDetail);
  };

  const printLabels = () => window.print();

  return (
    <div>
      <SectionTitle>Box Labels</SectionTitle>
      <p className="text-sm text-gray-500 mb-4">Generate printable labels from confirmed BoxBot runs. Each label shows member name, address, share type, and any add-ons.</p>
      <div className="flex gap-3 mb-6">
        <input type="date" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={weekOf} onChange={e => setWeekOf(e.target.value)} />
        <button onClick={generate} disabled={generating || !weekOf} className="px-4 py-2 rounded-lg text-white text-sm font-bold disabled:opacity-40" style={{ backgroundColor: GREEN }}>
          {generating ? 'Generating…' : 'Generate Labels'}
        </button>
      </div>
      {detail && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-800 text-sm">Week of {fmtDate(detail.WeekOf)} — {detail.label_count || detail.LabelCount} labels</span>
            <button onClick={printLabels} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">🖨 Print</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 print:grid-cols-4">
            {(detail.labels || []).map((lbl, i) => (
              <div key={i} className="bg-white border-2 border-gray-900 rounded-lg p-3 print:border print:p-2 text-xs">
                <div className="font-bold text-sm text-gray-900">{lbl.member_name}</div>
                <div className="text-gray-500 font-semibold text-[10px] uppercase mt-0.5">{lbl.share_type} share</div>
                {lbl.address && (
                  <div className="text-gray-600 mt-1 text-[11px]">{lbl.address.line1}<br/>{lbl.address.city}, {lbl.address.state} {lbl.address.zip}</div>
                )}
                <div className="border-t border-gray-200 mt-1.5 pt-1.5">
                  {(lbl.items || []).slice(0, 4).map((item, j) => (
                    <div key={j} className="text-gray-700">· {item.crop} {item.qty}{item.unit}</div>
                  ))}
                  {(lbl.items || []).length > 4 && <div className="text-gray-400">+{lbl.items.length - 4} more</div>}
                </div>
                {(lbl.addons || []).length > 0 && (
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <div className="font-bold text-[10px] text-gray-500">ADD-ONS</div>
                    {lbl.addons.map((a, j) => <div key={j} className="text-gray-700">+ {a}</div>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {runs.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-gray-600 mb-2">Previous Label Runs</div>
          <div className="space-y-2">
            {runs.map(r => (
              <div key={r.LabelRunID} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3 text-sm">
                <span className="font-medium text-gray-800">Week of {fmtDate(r.WeekOf)}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs">{r.LabelCount} labels · {fmtDate(r.GeneratedAt)}</span>
                  <button onClick={() => openRun(r)} className="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">Load</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
