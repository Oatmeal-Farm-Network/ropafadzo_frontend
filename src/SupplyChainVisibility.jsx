/**
 * SupplyChainVisibility — End-to-end shipment tracking (Farm → Shelf).
 * Shows shipment list with status, add/edit/delete, status event trail.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import TarrigonChat from './TarrigonChat';

const API = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';

const STATUS_COLORS = {
  pending:    'bg-gray-100 text-gray-700',
  in_transit: 'bg-blue-100 text-blue-800',
  received:   'bg-emerald-100 text-emerald-800',
  rejected:   'bg-red-100 text-red-700',
};

const STATUSES = ['pending', 'in_transit', 'received', 'rejected'];

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {(status || '').replace('_', ' ')}
    </span>
  );
}

function ShipmentModal({ businessId, shipment, suppliers, onClose, onSaved }) {
  const [form, setForm] = useState(shipment || {
    BusinessID: businessId, Status: 'pending', Currency: 'USD',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const method = shipment?.ShipmentID ? 'PATCH' : 'POST';
    const url = shipment?.ShipmentID
      ? `${API}/api/esci/shipments/${shipment.ShipmentID}`
      : `${API}/api/esci/shipments`;
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (r.ok) onSaved();
    else alert('Failed to save shipment.');
  };

  const field = (label, key, type = 'text', opts = null) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {opts ? (
        <select value={form[key] || ''} onChange={e => set(key, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]">
          {opts.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key] || ''} onChange={e => set(key, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold text-gray-900 text-lg">
          {shipment?.ShipmentID ? 'Edit Shipment' : 'New Shipment'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {field('Product Name *', 'ProductName')}
          {field('Category', 'ProductCategory')}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Supplier</label>
            <select value={form.SupplierID || ''} onChange={e => set('SupplierID', e.target.value || null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]">
              <option value="">— none —</option>
              {suppliers.map(s => <option key={s.SupplierID} value={s.SupplierID}>{s.SupplierName}</option>)}
            </select>
          </div>
          {field('Status', 'Status', 'text', STATUSES)}
          {field('Expected Date', 'ExpectedDate', 'date')}
          {field('Received Date', 'ReceivedDate', 'date')}
          {field('Ordered Qty', 'OrderedQty', 'number')}
          {field('Received Qty', 'ReceivedQty', 'number')}
          {field('Unit', 'Unit')}
          {field('Unit Cost', 'UnitCost', 'number')}
          {field('Carrier', 'CarrierName')}
          {field('Tracking #', 'TrackingNum')}
          {field('Origin', 'OriginLocation')}
          {field('Destination', 'DestLocation')}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving}
            className="px-4 py-1.5 text-sm text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: TEAL }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SupplyChainVisibility() {
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;

  const [shipments, setShipments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!BusinessID) return;
    const qs = statusFilter ? `&status=${statusFilter}` : '';
    Promise.all([
      fetch(`${API}/api/esci/shipments?business_id=${BusinessID}${qs}`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/suppliers?business_id=${BusinessID}`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/esci/visibility?business_id=${BusinessID}&days=90`).then(r => r.ok ? r.json() : null),
    ]).then(([s, sup, v]) => {
      setShipments(Array.isArray(s) ? s : []);
      setSuppliers(Array.isArray(sup) ? sup : []);
      setSummary(v);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [BusinessID, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const deleteShipment = async (id) => {
    if (!confirm('Delete this shipment?')) return;
    await fetch(`${API}/api/esci/shipments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    });
    load();
  };

  return (
    <AccountLayout
      pageTitle="Supply Chain Visibility"
      breadcrumbs={[
        { label: 'Account', to: '/account' },
        { label: 'Supply Chain', to: `/supply-chain?BusinessID=${BusinessID}` },
        { label: 'Visibility' },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">Supply Chain Visibility</h1>
            <p className="text-sm text-gray-500">Farm → DC → Shelf</p>
          </div>
          <button onClick={() => setModal({})}
            className="px-4 py-2 text-sm text-white rounded-lg"
            style={{ backgroundColor: TEAL }}>
            + New Shipment
          </button>
        </div>

        {/* Summary strip */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(summary.by_status || []).map(s => (
              <button key={s.Status}
                onClick={() => setStatusFilter(statusFilter === s.Status ? '' : s.Status)}
                className={`text-left bg-white border rounded-xl p-3 hover:shadow-sm transition ${statusFilter === s.Status ? 'border-[#1e6b5a]' : 'border-gray-200'}`}>
                <div className="text-[10px] uppercase font-semibold text-gray-500">{(s.Status || '').replace('_', ' ')}</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">{s.n}</div>
              </button>
            ))}
            {summary.on_time_pct != null && (
              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="text-[10px] uppercase font-semibold text-gray-500">On-Time Rate (90d)</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">{summary.on_time_pct}%</div>
              </div>
            )}
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Filter:</span>
          {['', ...STATUSES].map(s => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-xs rounded-full border transition ${statusFilter === s ? 'text-white' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
              style={statusFilter === s ? { backgroundColor: TEAL, borderColor: TEAL } : {}}>
              {s ? s.replace('_', ' ') : 'All'}
            </button>
          ))}
        </div>

        {/* Shipment table */}
        {loading ? (
          <div className="text-sm text-gray-400">Loading…</div>
        ) : shipments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
            No shipments found. <button onClick={() => setModal({})} className="underline" style={{ color: TEAL }}>Add one</button>.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Expected</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Cost</th>
                  <th className="px-4 py-3 text-left">Quality</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map(s => (
                  <tr key={s.ShipmentID} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.ProductName}</div>
                      {s.ShipmentRef && <div className="text-xs text-gray-400">{s.ShipmentRef}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.SupplierName || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.Status} /></td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.ExpectedDate ? s.ExpectedDate.slice(0, 10) : '—'}
                      {s.ReceivedDate && <div className="text-xs text-gray-400">Rcvd {s.ReceivedDate.slice(0, 10)}</div>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.OrderedQty != null ? Number(s.OrderedQty).toLocaleString() : '—'}
                      {s.Unit && <span className="text-gray-400"> {s.Unit}</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.TotalCost != null ? `$${Number(s.TotalCost).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {s.LatestQuality && (
                        <span className={`text-xs font-semibold ${s.LatestQuality === 'pass' ? 'text-emerald-700' : 'text-red-600'}`}>
                          {s.LatestGrade || s.LatestQuality}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setModal(s)} className="text-xs text-gray-400 hover:text-gray-700">Edit</button>
                        <button onClick={() => deleteShipment(s.ShipmentID)} className="text-xs text-red-400 hover:text-red-600">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== null && (
        <ShipmentModal
          businessId={BusinessID}
          shipment={modal?.ShipmentID ? modal : null}
          suppliers={suppliers}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      <TarrigonChat businessId={BusinessID} page="supply_chain_visibility" />
    </AccountLayout>
  );
}
