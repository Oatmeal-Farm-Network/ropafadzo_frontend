/**
 * AggregatorSales — B2B accounts + orders, plus D2C orders across channels.
 *
 * Three tabs:
 *  - B2B Accounts : Reliance / Star Bazaar / restaurant chains / institutions
 *  - B2B Orders   : POs against those accounts with invoice + payment status
 *  - D2C Orders   : own storefront + Zepto / Swiggy / Blinkit / Amazon, etc.
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

const BUYER_TYPES   = ['retail', 'restaurant', 'distributor', 'institution'];
const ACCOUNT_STATS = ['active', 'on_hold', 'churned'];
const B2B_STATUSES  = ['placed', 'picking', 'dispatched', 'delivered', 'cancelled'];
const PAY_STATUSES  = ['unpaid', 'partial', 'paid'];
const D2C_CHANNELS  = ['own_app', 'zepto', 'swiggy', 'blinkit', 'amazon', 'other'];
const D2C_STATUSES  = ['placed', 'picking', 'out_for_delivery', 'delivered', 'refunded'];

const CHANNEL_ICON = {
  own_app: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  zepto:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  swiggy:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  blinkit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  amazon:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  other:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
};

const fmt$  = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
const todayISO = () => new Date().toISOString().slice(0, 10);

// ─────────────────────────────────────────────────────────────────
// B2B Accounts
// ─────────────────────────────────────────────────────────────────
function AccountForm({ acct, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(acct || {
    BuyerName: '', BuyerType: 'retail',
    ContactName: '', ContactPhone: '', ContactEmail: '',
    DeliveryAddress: '', NetTermsDays: 30, CreditLimit: '',
    Status: 'active', Notes: '',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2"><label className={lbl}>{t('agg_sales.label_buyer_name')}</label><input className={inp} placeholder={t('agg_sales.placeholder_buyer_name')} value={s.BuyerName} onChange={set('BuyerName')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_type')}</label>
          <select className={inp} value={s.BuyerType} onChange={set('BuyerType')}>
            {BUYER_TYPES.map(x => <option key={x} value={x}>{t('agg_sales.buyer_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_sales.label_contact_name')}</label><input className={inp} value={s.ContactName || ''} onChange={set('ContactName')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_phone')}</label><input className={inp} value={s.ContactPhone || ''} onChange={set('ContactPhone')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_email')}</label><input className={inp} value={s.ContactEmail || ''} onChange={set('ContactEmail')} /></div>
        <div className="md:col-span-3"><label className={lbl}>{t('agg_sales.label_delivery_address')}</label><input className={inp} value={s.DeliveryAddress || ''} onChange={set('DeliveryAddress')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_net_terms')}</label><input className={inp} type="number" value={s.NetTermsDays ?? 30} onChange={setNum('NetTermsDays')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_credit_limit')}</label><input className={inp} type="number" step="0.01" value={s.CreditLimit ?? ''} onChange={setNum('CreditLimit')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_status')}</label>
          <select className={inp} value={s.Status} onChange={set('Status')}>
            {ACCOUNT_STATS.map(x => <option key={x} value={x}>{t('agg_sales.acct_status_' + x, { defaultValue: x })}</option>)}
          </select></div>
      </div>
      <div><label className={lbl}>{t('agg_sales.label_notes')}</label><textarea className={inp} rows={2} value={s.Notes || ''} onChange={set('Notes')} /></div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('agg_sales.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} disabled={!s.BuyerName} className={btn}>{t('agg_sales.btn_save')}</button>
      </div>
    </div>
  );
}

function B2BAccountsTab({ businessId }) {
  const { t } = useTranslation();
  const [list, setList]    = useState([]);
  const [editing, setEdit] = useState(null);
  const [adding, setAdd]   = useState(false);

  const refresh = () => { fetch(`${API}/api/aggregator/${businessId}/b2b/accounts`).then(r => r.json()).then(setList); };
  useEffect(() => { refresh(); }, [businessId]);

  const save = async (a) => {
    const isEdit = !!a.AccountID;
    const url = isEdit ? `${API}/api/aggregator/b2b/accounts/${a.AccountID}` : `${API}/api/aggregator/${businessId}/b2b/accounts`;
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(a) });
    if (r.ok) { setEdit(null); setAdd(false); refresh(); } else alert(t('agg_sales.err_save'));
  };
  const del = async (id) => {
    if (!window.confirm(t('agg_sales.confirm_delete_account'))) return;
    await fetch(`${API}/api/aggregator/b2b/accounts/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm text-gray-500">{t('agg_sales.account_count', { count: list.length })}</span>
        <button onClick={() => setAdd(true)} className={btn}>{t('agg_sales.btn_add_account')}</button>
      </div>
      {adding && <AccountForm onSave={save} onCancel={() => setAdd(false)} />}
      {list.length === 0 && <div className="text-sm text-gray-500 italic">{t('agg_sales.no_accounts')}</div>}

      <div className="space-y-2">
        {list.map(a => editing?.AccountID === a.AccountID ? (
          <AccountForm key={a.AccountID} acct={editing} onSave={save} onCancel={() => setEdit(null)} />
        ) : (
          <div key={a.AccountID} className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
            <div className="shrink-0 flex items-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-gray-900">{a.BuyerName}</strong>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold uppercase">
                  {t('agg_sales.buyer_' + a.BuyerType, { defaultValue: a.BuyerType })}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${a.Status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                  {t('agg_sales.acct_status_' + a.Status, { defaultValue: a.Status })}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {a.ContactName && `${a.ContactName} · `}
                {a.ContactPhone}
                {a.NetTermsDays != null && ` · net ${a.NetTermsDays}d`}
                {a.CreditLimit != null && ` · credit $${fmt$(a.CreditLimit)}`}
              </div>
              {a.DeliveryAddress && <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{a.DeliveryAddress}</div>}
            </div>
            <button onClick={() => setEdit(a)} className={btnGhost}>{t('agg_sales.btn_edit')}</button>
            <button onClick={() => del(a.AccountID)} className="text-xs text-red-600 hover:underline">{t('agg_sales.btn_delete')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// B2B Orders
// ─────────────────────────────────────────────────────────────────
function B2BOrderForm({ order, accounts, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(order || {
    AccountID: accounts[0]?.AccountID || '', OrderDate: todayISO(),
    CropType: '', QuantityKg: '', PricePerKg: '', TotalValue: '',
    DeliveryDate: '', Status: 'placed',
    InvoiceNumber: '', PaymentStatus: 'unpaid', Notes: '',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  useEffect(() => {
    if (s.QuantityKg != null && s.PricePerKg != null && s.QuantityKg !== '' && s.PricePerKg !== '') {
      const computed = Number(s.QuantityKg) * Number(s.PricePerKg);
      if (!Number.isNaN(computed)) setS(prev => ({ ...prev, TotalValue: computed }));
    }
  }, [s.QuantityKg, s.PricePerKg]);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('agg_sales.label_account')}</label>
          <select className={inp} value={s.AccountID} onChange={set('AccountID')}>
            <option value="">{t('agg_sales.select_account')}</option>
            {accounts.map(a => <option key={a.AccountID} value={a.AccountID}>{a.BuyerName}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_sales.label_order_date')}</label><input className={inp} type="date" value={s.OrderDate || ''} onChange={set('OrderDate')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_delivery_date')}</label><input className={inp} type="date" value={s.DeliveryDate || ''} onChange={set('DeliveryDate')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_crop')}</label><input className={inp} value={s.CropType || ''} onChange={set('CropType')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_qty_kg')}</label><input className={inp} type="number" step="0.01" value={s.QuantityKg ?? ''} onChange={setNum('QuantityKg')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_price_kg')}</label><input className={inp} type="number" step="0.01" value={s.PricePerKg ?? ''} onChange={setNum('PricePerKg')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_total')}</label><input className={inp} type="number" step="0.01" value={s.TotalValue ?? ''} onChange={setNum('TotalValue')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_status')}</label>
          <select className={inp} value={s.Status} onChange={set('Status')}>
            {B2B_STATUSES.map(x => <option key={x} value={x}>{t('agg_sales.b2b_status_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_sales.label_payment')}</label>
          <select className={inp} value={s.PaymentStatus} onChange={set('PaymentStatus')}>
            {PAY_STATUSES.map(x => <option key={x} value={x}>{t('agg_sales.pay_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div className="md:col-span-2"><label className={lbl}>{t('agg_sales.label_invoice_num')}</label><input className={inp} value={s.InvoiceNumber || ''} onChange={set('InvoiceNumber')} /></div>
      </div>
      <div><label className={lbl}>{t('agg_sales.label_notes')}</label><textarea className={inp} rows={2} value={s.Notes || ''} onChange={set('Notes')} /></div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('agg_sales.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} disabled={!s.AccountID} className={btn}>{t('agg_sales.btn_save')}</button>
      </div>
    </div>
  );
}

function B2BOrdersTab({ businessId, accounts }) {
  const { t } = useTranslation();
  const [list, setList]    = useState([]);
  const [editing, setEdit] = useState(null);
  const [adding, setAdd]   = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);
  const [syncOk, setSyncOk]  = useState(true);

  const refresh = () => { fetch(`${API}/api/aggregator/${businessId}/b2b/orders`).then(r => r.json()).then(setList); };
  useEffect(() => { refresh(); }, [businessId]);

  const save = async (o) => {
    const isEdit = !!o.OrderID;
    const url = isEdit ? `${API}/api/aggregator/b2b/orders/${o.OrderID}` : `${API}/api/aggregator/${businessId}/b2b/orders`;
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(o) });
    if (r.ok) { setEdit(null); setAdd(false); refresh(); } else alert(t('agg_sales.err_save'));
  };
  const del = async (id) => {
    if (!window.confirm(t('agg_sales.confirm_delete_order'))) return;
    await fetch(`${API}/api/aggregator/b2b/orders/${id}`, { method: 'DELETE' });
    refresh();
  };
  const sync = async () => {
    setSyncing(true); setSyncMsg(null);
    const r = await fetch(`${API}/api/aggregator/${businessId}/accounting/sync`, { method: 'POST' }).catch(() => null);
    if (r?.ok) {
      const res = await r.json();
      setSyncOk(true);
      setSyncMsg(t('agg_sales.sync_posted', { count: res.invoices_created }));
      refresh();
    } else {
      const err = await r?.json().catch(() => ({}));
      setSyncOk(false);
      setSyncMsg(err?.detail || t('agg_sales.sync_failed'));
    }
    setSyncing(false);
  };

  const total      = list.reduce((acc, r) => acc + Number(r.TotalValue || 0), 0);
  const unpaid     = list.filter(r => r.PaymentStatus !== 'paid').reduce((acc, r) => acc + Number(r.TotalValue || 0), 0);
  const unposted   = list.filter(r => !r.AccountingInvoiceID && r.Status !== 'cancelled').length;
  const statusColor = (st) => st === 'delivered' ? 'bg-emerald-100 text-emerald-800'
                            : st === 'dispatched' ? 'bg-blue-100 text-blue-800'
                            : st === 'cancelled' ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-700';

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded-xl p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div><div className="text-[10px] uppercase text-gray-500 font-semibold">{t('agg_sales.stat_orders')}</div><div className="text-xl font-bold">{list.length}</div></div>
        <div><div className="text-[10px] uppercase text-gray-500 font-semibold">{t('agg_sales.stat_total_billed')}</div><div className="text-xl font-bold">${fmt$(total)}</div></div>
        <div><div className="text-[10px] uppercase text-gray-500 font-semibold">{t('agg_sales.stat_ar')}</div><div className={`text-xl font-bold ${unpaid > 0 ? 'text-amber-600' : ''}`}>${fmt$(unpaid)}</div></div>
        <div><div className="text-[10px] uppercase text-gray-500 font-semibold">{t('agg_sales.stat_unposted')}</div><div className={`text-xl font-bold ${unposted > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{unposted}</div></div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm text-gray-500">{t('agg_sales.b2b_sales_orders')}</span>
        <div className="flex items-center gap-2">
          {unposted > 0 && (
            <button onClick={sync} disabled={syncing} className="px-3 py-1.5 text-sm border border-[#3D6B34] text-[#3D6B34] rounded-lg hover:bg-[#f0f7ec] disabled:opacity-50">
              {syncing ? t('agg_sales.btn_posting') : t('agg_sales.btn_post_to_accounting', { count: unposted })}
            </button>
          )}
          <button onClick={() => setAdd(true)} disabled={accounts.length === 0} className={btn}>{t('agg_sales.btn_new_b2b_order')}</button>
        </div>
      </div>
      {syncMsg && (
        <div className={`text-xs rounded-lg px-3 py-2 ${!syncOk ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {syncMsg}
        </div>
      )}
      {accounts.length === 0 && <div className="text-sm text-gray-500 italic">{t('agg_sales.add_account_first')}</div>}
      {adding && <B2BOrderForm accounts={accounts} onSave={save} onCancel={() => setAdd(false)} />}

      <div className="space-y-2">
        {list.map(o => editing?.OrderID === o.OrderID ? (
          <B2BOrderForm key={o.OrderID} order={editing} accounts={accounts} onSave={save} onCancel={() => setEdit(null)} />
        ) : (
          <div key={o.OrderID} className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
            <div className="shrink-0 flex items-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-gray-900">{o.BuyerName || `Account #${o.AccountID}`}</strong>
                {o.CropType && <span className="text-sm text-gray-700">— {o.CropType}</span>}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${statusColor(o.Status)}`}>
                  {t('agg_sales.b2b_status_' + o.Status, { defaultValue: o.Status })}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${o.PaymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : o.PaymentStatus === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                  {t('agg_sales.pay_' + o.PaymentStatus, { defaultValue: o.PaymentStatus })}
                </span>
                {o.AccountingInvoiceID
                  ? <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold uppercase">{t('agg_sales.inv_badge', { id: o.AccountingInvoiceID })}</span>
                  : o.Status !== 'cancelled' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold uppercase">{t('agg_sales.badge_unposted')}</span>
                }
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {o.QuantityKg != null && `${o.QuantityKg} kg`}
                {o.PricePerKg != null && ` @ $${fmt$(o.PricePerKg)}/kg`}
                {o.TotalValue != null && ` = $${fmt$(o.TotalValue)}`}
                {o.OrderDate && ` · ${(o.OrderDate || '').slice(0,10)}`}
                {o.DeliveryDate && ` → ${t('agg_sales.text_deliver', { date: (o.DeliveryDate || '').slice(0,10) })}`}
                {o.InvoiceNumber && ` · INV ${o.InvoiceNumber}`}
              </div>
            </div>
            <button onClick={() => setEdit(o)} className={btnGhost}>{t('agg_sales.btn_edit')}</button>
            <button onClick={() => del(o.OrderID)} className="text-xs text-red-600 hover:underline">{t('agg_sales.btn_delete')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// D2C Orders
// ─────────────────────────────────────────────────────────────────
function D2COrderForm({ order, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(order || {
    Channel: 'own_app', ExternalOrderID: '',
    CustomerName: '', CustomerPhone: '', DeliveryAddress: '',
    CropType: '', QuantityKg: '', TotalValue: '',
    OrderDate: new Date().toISOString().slice(0,16),
    DeliverySLAMinutes: 30, Status: 'placed',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('agg_sales.label_channel')}</label>
          <select className={inp} value={s.Channel} onChange={set('Channel')}>
            {D2C_CHANNELS.map(x => <option key={x} value={x}>{t('agg_sales.channel_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_sales.label_channel_order_num')}</label><input className={inp} value={s.ExternalOrderID || ''} onChange={set('ExternalOrderID')} placeholder={t('agg_sales.placeholder_channel_order')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_status')}</label>
          <select className={inp} value={s.Status} onChange={set('Status')}>
            {D2C_STATUSES.map(x => <option key={x} value={x}>{t('agg_sales.d2c_status_' + x, { defaultValue: x })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_sales.label_customer_name')}</label><input className={inp} value={s.CustomerName || ''} onChange={set('CustomerName')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_customer_phone')}</label><input className={inp} value={s.CustomerPhone || ''} onChange={set('CustomerPhone')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_sla_min')}</label><input className={inp} type="number" value={s.DeliverySLAMinutes ?? ''} onChange={setNum('DeliverySLAMinutes')} /></div>
        <div className="md:col-span-3"><label className={lbl}>{t('agg_sales.label_delivery_address')}</label><input className={inp} value={s.DeliveryAddress || ''} onChange={set('DeliveryAddress')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_crop')}</label><input className={inp} value={s.CropType || ''} onChange={set('CropType')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_qty_kg_short')}</label><input className={inp} type="number" step="0.01" value={s.QuantityKg ?? ''} onChange={setNum('QuantityKg')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_total')}</label><input className={inp} type="number" step="0.01" value={s.TotalValue ?? ''} onChange={setNum('TotalValue')} /></div>
        <div><label className={lbl}>{t('agg_sales.label_order_time')}</label><input className={inp} type="datetime-local" value={(s.OrderDate || '').slice(0,16)} onChange={set('OrderDate')} /></div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('agg_sales.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} className={btn}>{t('agg_sales.btn_save')}</button>
      </div>
    </div>
  );
}

function D2COrdersTab({ businessId }) {
  const { t } = useTranslation();
  const [list, setList]    = useState([]);
  const [editing, setEdit] = useState(null);
  const [adding, setAdd]   = useState(false);
  const [channelF, setCh]  = useState('');

  const refresh = () => {
    const qs = channelF ? `?channel=${channelF}` : '';
    fetch(`${API}/api/aggregator/${businessId}/d2c/orders${qs}`).then(r => r.json()).then(setList);
  };
  useEffect(() => { refresh(); }, [businessId, channelF]);

  const save = async (o) => {
    const isEdit = !!o.OrderID;
    const url = isEdit ? `${API}/api/aggregator/d2c/orders/${o.OrderID}` : `${API}/api/aggregator/${businessId}/d2c/orders`;
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(o) });
    if (r.ok) { setEdit(null); setAdd(false); refresh(); } else alert(t('agg_sales.err_save'));
  };
  const del = async (id) => {
    if (!window.confirm(t('agg_sales.confirm_delete_order'))) return;
    await fetch(`${API}/api/aggregator/d2c/orders/${id}`, { method: 'DELETE' });
    refresh();
  };

  const byChannel = list.reduce((acc, r) => {
    const ch = r.Channel || 'other';
    if (!acc[ch]) acc[ch] = { count: 0, revenue: 0 };
    acc[ch].count   += 1;
    acc[ch].revenue += Number(r.TotalValue || 0);
    return acc;
  }, {});

  const statusColor = (st) => st === 'delivered' ? 'bg-emerald-100 text-emerald-800'
                          : st === 'out_for_delivery' ? 'bg-blue-100 text-blue-800'
                          : st === 'refunded' ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-700';

  return (
    <div className="space-y-3">
      {Object.keys(byChannel).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <div className="text-[10px] uppercase text-gray-500 font-semibold mb-2">{t('agg_sales.by_channel')}</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.entries(byChannel).map(([ch, v]) => (
              <div key={ch} className="border border-gray-100 rounded-lg p-2 text-xs">
                <div className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="text-gray-500">{CHANNEL_ICON[ch] || CHANNEL_ICON.other}</span>
                  {t('agg_sales.channel_' + ch, { defaultValue: ch })}
                </div>
                <div className="text-gray-500">{v.count} · ${fmt$(v.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <select className={inp + ' max-w-xs'} value={channelF} onChange={e => setCh(e.target.value)}>
          <option value="">{t('agg_sales.filter_all_channels')}</option>
          {D2C_CHANNELS.map(c => <option key={c} value={c}>{t('agg_sales.channel_' + c, { defaultValue: c })}</option>)}
        </select>
        <span className="text-sm text-gray-500">{t('agg_sales.order_count', { count: list.length })}</span>
        <div className="flex-1" />
        <button onClick={() => setAdd(true)} className={btn}>{t('agg_sales.btn_record_d2c')}</button>
      </div>
      {adding && <D2COrderForm onSave={save} onCancel={() => setAdd(false)} />}
      {list.length === 0 && <div className="text-sm text-gray-500 italic">{t('agg_sales.no_d2c_orders')}</div>}

      <div className="space-y-2">
        {list.map(o => editing?.OrderID === o.OrderID ? (
          <D2COrderForm key={o.OrderID} order={editing} onSave={save} onCancel={() => setEdit(null)} />
        ) : (
          <div key={o.OrderID} className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
            <div className="shrink-0 text-gray-500">{CHANNEL_ICON[o.Channel] || CHANNEL_ICON.other}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-gray-900">{t('agg_sales.channel_' + o.Channel, { defaultValue: o.Channel })}</strong>
                {o.ExternalOrderID && <span className="text-xs text-gray-500">#{o.ExternalOrderID}</span>}
                {o.CustomerName && <span className="text-sm text-gray-700">— {o.CustomerName}</span>}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${statusColor(o.Status)}`}>
                  {t('agg_sales.d2c_status_' + o.Status, { defaultValue: o.Status })}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {o.CropType && `${o.CropType} · `}
                {o.QuantityKg != null && `${o.QuantityKg} kg · `}
                {o.TotalValue != null && `$${fmt$(o.TotalValue)}`}
                {o.DeliverySLAMinutes != null && ` · SLA ${o.DeliverySLAMinutes}m`}
              </div>
              {o.DeliveryAddress && <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{o.DeliveryAddress}</div>}
            </div>
            <button onClick={() => setEdit(o)} className={btnGhost}>{t('agg_sales.btn_edit')}</button>
            <button onClick={() => del(o.OrderID)} className="text-xs text-red-600 hover:underline">{t('agg_sales.btn_delete')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────
export default function AggregatorSales() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;
  const [tab, setTab] = useState('b2b_accounts');
  const [accounts, setAccounts] = useState([]);

  const TABS = [
    { key: 'b2b_accounts', label: t('agg_sales.tab_b2b_accounts') },
    { key: 'b2b_orders',   label: t('agg_sales.tab_b2b_orders') },
    { key: 'd2c',          label: t('agg_sales.tab_d2c') },
  ];

  useEffect(() => {
    if (!BusinessID) return;
    fetch(`${API}/api/aggregator/${BusinessID}/b2b/accounts`).then(r => r.json()).then(setAccounts);
  }, [BusinessID, tab]);

  if (!BusinessID) {
    return (
      <AccountLayout pageTitle={t('agg_sales.page_title')}>
        <div className="p-6 text-sm text-gray-500">{t('agg_sales.no_business')}</div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      pageTitle={t('agg_sales.page_title')}
      breadcrumbs={[
        { label: t('agg_sales.breadcrumb_account'), to: '/account' },
        { label: t('agg_sales.breadcrumb_aggregation'), to: `/aggregator?BusinessID=${BusinessID}` },
        { label: t('agg_sales.page_title') },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('agg_sales.page_title')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('agg_sales.subheading')}</p>
          </div>
          <Link to={`/aggregator?BusinessID=${BusinessID}`} className={btnGhost}>{t('agg_sales.btn_hub')}</Link>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            {TABS.map(tabItem => (
              <button key={tabItem.key}
                      onClick={() => setTab(tabItem.key)}
                      className={`px-4 py-2 text-sm font-medium ${tab === tabItem.key
                        ? 'border-b-2 border-[#3D6B34] text-[#3D6B34]'
                        : 'text-gray-500 hover:text-gray-700'}`}>
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'b2b_accounts' && <B2BAccountsTab businessId={BusinessID} />}
        {tab === 'b2b_orders'   && <B2BOrdersTab businessId={BusinessID} accounts={accounts} />}
        {tab === 'd2c'          && <D2COrdersTab businessId={BusinessID} />}
      </div>
    </AccountLayout>
  );
}
