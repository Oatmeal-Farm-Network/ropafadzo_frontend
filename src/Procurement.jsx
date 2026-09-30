import React, { useEffect, useState, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';

const STATUS_STYLE = {
  draft:            { bg: '#f3f4f6', color: '#374151' },
  pending_approval: { bg: '#fef3c7', color: '#92400e' },
  approved:         { bg: '#d1fae5', color: '#065f46' },
  issued:           { bg: '#dbeafe', color: '#1e40af' },
  partial:          { bg: '#fef9c3', color: '#713f12' },
  received:         { bg: '#dcfce7', color: '#166534' },
  rejected:         { bg: '#fee2e2', color: '#991b1b' },
};

const KPI = ({ label, value, color = '#3D6B34' }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
    <p className="text-xl font-bold" style={{ color }}>{value ?? '—'}</p>
  </div>
);

export default function Procurement() {
  const [params] = useSearchParams();
  const BusinessID = params.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [detail, setDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ SupplierName: '', SupplierContact: '', SupplierEmail: '', Category: '', OrderDate: new Date().toISOString().split('T')[0], ExpectedDelivery: '', Currency: 'USD', Notes: '' });
  const [lines, setLines] = useState([{ ItemName: '', Description: '', Category: '', Quantity: '', Unit: '', UnitPrice: '' }]);
  const [receiptForm, setReceiptForm] = useState({ ReceivedDate: new Date().toISOString().split('T')[0], ReceivedBy: '', DeliveryNote: '', Condition: 'good', Notes: '' });
  const [receiptLines, setReceiptLines] = useState([]);

  useEffect(() => { if (BusinessID) LoadBusiness(BusinessID); }, [BusinessID]);

  const load = useCallback(async () => {
    if (!BusinessID) return;
    setLoading(true);
    try {
      const [oRes, sRes] = await Promise.all([
        fetch(`${API}/api/procurement/orders?business_id=${BusinessID}${filterStatus ? `&status=${filterStatus}` : ''}`),
        fetch(`${API}/api/procurement/summary?business_id=${BusinessID}`),
      ]);
      setOrders(oRes.ok ? await oRes.json() : []);
      setSummary(sRes.ok ? await sRes.json() : null);
    } catch {} finally { setLoading(false); }
  }, [BusinessID, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (po) => {
    const r = await fetch(`${API}/api/procurement/orders/${po.POID}?business_id=${BusinessID}`);
    if (r.ok) {
      const d = await r.json();
      setDetail(d);
      setReceiptLines(d.lines.map(l => ({ LineID: l.LineID, ItemName: l.ItemName, OrderedQty: l.Quantity, ReceivedQty: l.Quantity - (l.ReceivedQty || 0) })));
    }
    setTab('detail');
  };

  const submitPO = async () => {
    await fetch(`${API}/api/procurement/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, BusinessID: parseInt(BusinessID), lines }),
    });
    setShowForm(false);
    setLines([{ ItemName: '', Description: '', Category: '', Quantity: '', Unit: '', UnitPrice: '' }]);
    load();
  };

  const approvePO = async () => {
    await fetch(`${API}/api/procurement/orders/${detail.order.POID}/approve`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ BusinessID: parseInt(BusinessID), ApprovedBy: 'Admin' }),
    });
    loadDetail(detail.order);
  };

  const submitReceipt = async () => {
    await fetch(`${API}/api/procurement/orders/${detail.order.POID}/receipts`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...receiptForm, BusinessID: parseInt(BusinessID), lines: receiptLines }),
    });
    loadDetail(detail.order);
    load();
  };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3D6B34]';
  const labelCls = 'text-xs font-semibold text-gray-500 mb-1 block';
  const STATUSES = Object.keys(STATUS_STYLE);

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID}
      pageTitle="Purchase & Procurement"
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Procurement' }]}>
      <div className="max-w-5xl mx-auto space-y-5">

        {summary && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            <KPI label="Total Orders" value={summary.TotalOrders} />
            <KPI label="Pending Approval" value={summary.PendingApproval} color="#92400e" />
            <KPI label="Issued" value={summary.Issued} color="#1e40af" />
            <KPI label="Total Spend" value={`$${parseFloat(summary.TotalSpend||0).toFixed(2)}`} />
            <KPI label="This Month" value={`$${parseFloat(summary.ThisMonthSpend||0).toFixed(2)}`} />
          </div>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2">
            {['orders', ...(detail ? ['detail'] : [])].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize ${tab === t ? 'bg-[#3D6B34] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t === 'detail' ? `PO ${detail?.order?.PONumber}` : t}
              </button>
            ))}
          </div>
          {tab === 'orders' && (
            <div className="flex gap-2">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setShowForm(true)} className="bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
                + New PO
              </button>
            </div>
          )}
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-gray-800">New Purchase Order</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[['Supplier Name*', 'SupplierName'], ['Contact', 'SupplierContact'], ['Email', 'SupplierEmail'],
                ['Category', 'Category'], ['Order Date*', 'OrderDate', 'date'], ['Expected Delivery', 'ExpectedDelivery', 'date'],
                ['Currency', 'Currency']].map(([l, k, t='text']) => (
                <div key={k}><label className={labelCls}>{l}</label>
                  <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></div>
              ))}
            </div>
            <h4 className="font-semibold text-sm text-gray-700 mt-2">Line Items</h4>
            {lines.map((line, i) => (
              <div key={i} className="grid grid-cols-6 gap-2">
                {[['Item Name', 'ItemName'], ['Category', 'Category'], ['Qty', 'Quantity'], ['Unit', 'Unit'], ['Unit Price', 'UnitPrice']].map(([l, k]) => (
                  <input key={k} placeholder={l} value={line[k]}
                    onChange={e => setLines(ls => ls.map((l2, j) => j === i ? { ...l2, [k]: e.target.value } : l2))}
                    className={inputCls + ' text-xs'} />
                ))}
                <button onClick={() => setLines(ls => ls.filter((_, j) => j !== i))} className="text-red-500 text-sm">✕</button>
              </div>
            ))}
            <button onClick={() => setLines(ls => [...ls, { ItemName: '', Description: '', Category: '', Quantity: '', Unit: '', UnitPrice: '' }])}
              className="text-sm text-[#3D6B34] font-semibold">+ Add Line</button>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="text-sm text-gray-600">Cancel</button>
              <button onClick={submitPO} className="bg-[#3D6B34] text-white px-5 py-2 rounded-lg text-sm font-semibold">Submit PO</button>
            </div>
          </div>
        )}

        {tab === 'orders' && !loading && (
          <div className="space-y-3">
            {orders.map(o => {
              const s = STATUS_STYLE[o.Status] || STATUS_STYLE.draft;
              return (
                <div key={o.POID} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-800">{o.PONumber}</span>
                    <span className="ml-2 text-sm text-gray-600">{o.SupplierName}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>{o.Status}</span>
                    <p className="text-xs text-gray-400 mt-1">{o.OrderDate?.split('T')[0]} · {o.Category || 'General'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#3D6B34]">${parseFloat(o.TotalAmount||0).toFixed(2)}</p>
                    <button onClick={() => loadDetail(o)} className="text-xs text-[#3D6B34] font-semibold hover:underline">View →</button>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && <p className="text-center py-12 text-gray-400">No purchase orders yet.</p>}
          </div>
        )}

        {tab === 'detail' && detail && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{detail.order.PONumber}</h3>
                  <p className="text-sm text-gray-500">{detail.order.SupplierName} · {detail.order.SupplierContact}</p>
                  <p className="text-xs text-gray-400">{detail.order.OrderDate?.split('T')[0]} · Expected: {detail.order.ExpectedDelivery?.split('T')[0] || 'TBD'}</p>
                </div>
                <div className="flex gap-2">
                  {detail.order.Status === 'draft' && (
                    <button onClick={() => fetch(`${API}/api/procurement/orders/${detail.order.POID}`, {
                      method: 'PUT', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...detail.order, BusinessID: parseInt(BusinessID), Status: 'pending_approval' }),
                    }).then(() => loadDetail(detail.order))} className="text-xs px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 font-semibold">Submit for Approval</button>
                  )}
                  {detail.order.Status === 'pending_approval' && (
                    <button onClick={approvePO} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-800 font-semibold">Approve</button>
                  )}
                  {detail.order.Status === 'approved' && (
                    <button onClick={() => fetch(`${API}/api/procurement/orders/${detail.order.POID}/issue`, {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ BusinessID: parseInt(BusinessID) }),
                    }).then(() => loadDetail(detail.order))} className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 font-semibold">Issue PO</button>
                  )}
                </div>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-gray-400 border-b">
                  <th className="pb-2">Item</th><th>Category</th><th>Ordered</th><th>Received</th><th>Price</th><th>Total</th>
                </tr></thead>
                <tbody>
                  {detail.lines.map(l => (
                    <tr key={l.LineID} className="border-b border-gray-50">
                      <td className="py-2">{l.ItemName}</td>
                      <td>{l.Category || '—'}</td>
                      <td>{l.Quantity} {l.Unit}</td>
                      <td className={parseFloat(l.ReceivedQty||0) < parseFloat(l.Quantity) ? 'text-amber-700 font-semibold' : 'text-green-700'}>
                        {parseFloat(l.ReceivedQty||0).toFixed(2)}
                      </td>
                      <td>${parseFloat(l.UnitPrice).toFixed(2)}</td>
                      <td className="font-semibold">${parseFloat(l.LineTotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={5} className="pt-2 text-right font-bold">Total:</td>
                    <td className="pt-2 font-bold text-[#3D6B34]">${parseFloat(detail.order.TotalAmount||0).toFixed(2)}</td></tr>
                </tfoot>
              </table>
            </div>

            {['issued', 'partial'].includes(detail.order.Status) && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-gray-800">Record Receipt</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[['Date*', 'ReceivedDate', 'date'], ['Received By', 'ReceivedBy'], ['Delivery Note', 'DeliveryNote'], ['Condition', 'Condition']].map(([l, k, t='text']) => (
                    <div key={k}><label className={labelCls}>{l}</label>
                      <input type={t} value={receiptForm[k]} onChange={e => setReceiptForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></div>
                  ))}
                </div>
                <h4 className="font-semibold text-sm text-gray-700">Received Quantities</h4>
                {receiptLines.map((rl, i) => (
                  <div key={rl.LineID} className="flex items-center gap-3">
                    <span className="text-sm flex-1">{rl.ItemName} (ordered: {rl.OrderedQty})</span>
                    <input type="number" value={rl.ReceivedQty} placeholder="Qty received"
                      onChange={e => setReceiptLines(ls => ls.map((l2, j) => j === i ? { ...l2, ReceivedQty: e.target.value } : l2))}
                      className="w-28 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                  </div>
                ))}
                <div className="flex justify-end">
                  <button onClick={submitReceipt} className="bg-[#3D6B34] text-white px-5 py-2 rounded-lg text-sm font-semibold">Record Receipt</button>
                </div>
              </div>
            )}

            {detail.receipts.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Receipts</h3>
                {detail.receipts.map(r => (
                  <div key={r.ReceiptID} className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span>{r.ReceivedDate?.split('T')[0]} · {r.ReceivedBy}</span>
                    <span className="text-gray-400">{r.Condition} · {r.DeliveryNote}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
          <ThaiymeChat businessId={BusinessID} page="procurement" />
    </AccountLayout>
  );
}
