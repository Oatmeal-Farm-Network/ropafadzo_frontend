import React, { useState, useEffect, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const SHIP_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  pending_docs: 'bg-amber-100 text-amber-800',
  inspected: 'bg-blue-100 text-blue-800',
  cleared: 'bg-green-100 text-green-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-teal-100 text-teal-800',
  rejected: 'bg-red-100 text-red-800',
};

function Badge({ text, color }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{text}</span>;
}

function KpiCard({ label, value, sub, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ExportCompliance() {
  const [params] = useSearchParams();
  const businessId = params.get('BusinessID');
  const authHdr = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };

  const [tab, setTab] = useState('shipments');
  const [summary, setSummary] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [selectedShip, setSelectedShip] = useState(null);
  const [shipDetail, setShipDetail] = useState(null);
  const [certs, setCerts] = useState([]);
  const [recalls, setRecalls] = useState([]);
  const [margins, setMargins] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');

  const [showShipForm, setShowShipForm] = useState(false);
  const [deliverModal, setDeliverModal] = useState(null);
  const [shipForm, setShipForm] = useState({ commodity: '', destination_country: '', buyer_name: '', vessel_ref: '', estimated_departure: '', quantity_kg: '', unit_price_usd: '', currency: 'USD', notes: '' });
  const [phytoForm, setPhytoForm] = useState({ cert_number: '', issuing_authority: '', issue_date: '', expiry_date: '', commodity: '', notes: '' });
  const [customsForm, setCustomsForm] = useState({ doc_type: 'bill_of_lading', doc_number: '', issuing_country: '', issue_date: '', notes: '' });
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({ cert_type: '', cert_number: '', issuing_body: '', issue_date: '', expiry_date: '', notes: '' });
  const [showRecallForm, setShowRecallForm] = useState(false);
  const [recallForm, setRecallForm] = useState({ lot_ref: '', commodity: '', reason: '', units_affected: '', recall_date: '' });
  const [showMarginForm, setShowMarginForm] = useState(false);
  const [marginForm, setMarginForm] = useState({ crop: '', season: '', field_ref: '', yield_kg: '', price_per_kg: '', variable_cost_usd: '', fixed_cost_usd: '', currency: 'USD', notes: '' });

  const load = useCallback(async () => {
    if (!businessId) return;
    try {
      const [sRes, shRes, cRes, rRes, mRes] = await Promise.all([
        fetch(`${API}/api/export-compliance/summary?business_id=${businessId}`, { headers: authHdr }),
        fetch(`${API}/api/export-compliance/shipments?business_id=${businessId}${filterStatus ? `&status=${filterStatus}` : ''}`, { headers: authHdr }),
        fetch(`${API}/api/export-compliance/compliance-certs?business_id=${businessId}`, { headers: authHdr }),
        fetch(`${API}/api/export-compliance/recalls?business_id=${businessId}`, { headers: authHdr }),
        fetch(`${API}/api/export-compliance/crop-margins?business_id=${businessId}`, { headers: authHdr }),
      ]);
      if (sRes.ok) setSummary(await sRes.json());
      if (shRes.ok) setShipments(await shRes.json());
      if (cRes.ok) setCerts(await cRes.json());
      if (rRes.ok) setRecalls(await rRes.json());
      if (mRes.ok) setMargins(await mRes.json());
    } catch {}
  }, [businessId, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const loadShipDetail = async (s) => {
    setSelectedShip(s);
    setTab('ship-detail');
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API}/api/export-compliance/shipments/${s.shipment_id}/phyto-certs?business_id=${businessId}`, { headers: authHdr }),
        fetch(`${API}/api/export-compliance/shipments/${s.shipment_id}/customs-docs?business_id=${businessId}`, { headers: authHdr }),
      ]);
      setShipDetail({
        phyto: pRes.ok ? await pRes.json() : [],
        customs: cRes.ok ? await cRes.json() : [],
      });
    } catch {}
  };

  const createShipment = async (e) => {
    e.preventDefault();
    const body = {
      ...shipForm,
      quantity_kg: parseFloat(shipForm.quantity_kg) || 0,
      unit_price_usd: parseFloat(shipForm.unit_price_usd) || 0,
    };
    await fetch(`${API}/api/export-compliance/shipments?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    setShipForm({ commodity: '', destination_country: '', buyer_name: '', vessel_ref: '', estimated_departure: '', quantity_kg: '', unit_price_usd: '', currency: 'USD', notes: '' });
    setShowShipForm(false);
    load();
  };

  const updateStatus = async (id, status, extra = {}) => {
    await fetch(`${API}/api/export-compliance/shipments/${id}/status?business_id=${businessId}`, {
      method: 'PUT', headers: { ...authHdr, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra }),
    });
    load();
    if (selectedShip?.shipment_id === id) setSelectedShip(s => ({ ...s, status }));
  };

  const confirmDeliver = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await updateStatus(deliverModal.shipment_id, 'delivered', {
      actual_arrival_date: fd.get('actual_arrival_date') || null,
    });
    setDeliverModal(null);
  };

  const addPhyto = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/export-compliance/shipments/${selectedShip.shipment_id}/phyto-certs?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(phytoForm),
    });
    setPhytoForm({ cert_number: '', issuing_authority: '', issue_date: '', expiry_date: '', commodity: '', notes: '' });
    loadShipDetail(selectedShip);
  };

  const addCustomsDoc = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/export-compliance/shipments/${selectedShip.shipment_id}/customs-docs?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(customsForm),
    });
    setCustomsForm({ doc_type: 'bill_of_lading', doc_number: '', issuing_country: '', issue_date: '', notes: '' });
    loadShipDetail(selectedShip);
  };

  const createCert = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/export-compliance/compliance-certs?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(certForm),
    });
    setCertForm({ cert_type: '', cert_number: '', issuing_body: '', issue_date: '', expiry_date: '', notes: '' });
    setShowCertForm(false);
    load();
  };

  const deleteCert = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    await fetch(`${API}/api/export-compliance/compliance-certs/${id}?business_id=${businessId}`, { method: 'DELETE', headers: authHdr });
    load();
  };

  const createRecall = async (e) => {
    e.preventDefault();
    const body = { ...recallForm, units_affected: parseInt(recallForm.units_affected) || 0 };
    await fetch(`${API}/api/export-compliance/recalls?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    setRecallForm({ lot_ref: '', commodity: '', reason: '', units_affected: '', recall_date: '' });
    setShowRecallForm(false);
    load();
  };

  const resolveRecall = async (id) => {
    const resolution = window.prompt('Resolution notes:');
    if (resolution === null) return;
    await fetch(`${API}/api/export-compliance/recalls/${id}/resolve?business_id=${businessId}`, {
      method: 'PUT', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify({ resolution_notes: resolution }),
    });
    load();
  };

  const createMargin = async (e) => {
    e.preventDefault();
    const body = {
      ...marginForm,
      yield_kg: parseFloat(marginForm.yield_kg) || 0,
      price_per_kg: parseFloat(marginForm.price_per_kg) || 0,
      variable_cost_usd: parseFloat(marginForm.variable_cost_usd) || 0,
      fixed_cost_usd: parseFloat(marginForm.fixed_cost_usd) || 0,
    };
    await fetch(`${API}/api/export-compliance/crop-margins?business_id=${businessId}`, {
      method: 'POST', headers: { ...authHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    setMarginForm({ crop: '', season: '', field_ref: '', yield_kg: '', price_per_kg: '', variable_cost_usd: '', fixed_cost_usd: '', currency: 'USD', notes: '' });
    setShowMarginForm(false);
    load();
  };

  const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400';
  const tabs = ['shipments', 'ship-detail', 'certifications', 'recalls', 'margins'];

  return (
    <AccountLayout pageTitle="Export Compliance">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Export Compliance & Traceability</h1>
            <p className="text-sm text-gray-500">Customs paperwork, phytosanitary certs, compliance docs, recall management, and crop margins</p>
          </div>
          <a
            href={`${API}/api/export-compliance/export?business_id=${businessId}`}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ↓ Export Shipments CSV
          </a>
        </div>

        {/* KPI strip */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <KpiCard label="Total Shipments" value={summary.total_shipments} />
            <KpiCard label="Cleared" value={summary.cleared} color="text-green-600" />
            <KpiCard label="Pending Docs" value={summary.pending_docs} color="text-amber-600" />
            <KpiCard label="Active Recalls" value={summary.active_recalls} color={summary.active_recalls > 0 ? 'text-red-600' : 'text-gray-800'} />
            <KpiCard label="Compliance Certs" value={summary.compliance_certs} />
            <KpiCard label="Avg Margin %" value={summary.avg_margin_pct != null ? `${summary.avg_margin_pct.toFixed(1)}%` : '—'} color="text-blue-600" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
          {[
            ['shipments', 'Shipments'],
            ['ship-detail', selectedShip ? `Ship: ${selectedShip.shipment_ref}` : 'Detail'],
            ['certifications', 'Certifications'],
            ['recalls', 'Recalls'],
            ['margins', 'Crop Margins'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Shipments tab ── */}
        {tab === 'shipments' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {['', 'draft', 'pending_docs', 'inspected', 'cleared', 'shipped', 'delivered', 'rejected'].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterStatus === s ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowShipForm(v => !v)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                + New Shipment
              </button>
            </div>

            {showShipForm && (
              <form onSubmit={createShipment} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-800">New Export Shipment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Commodity *</label>
                    <input required className={inputCls} value={shipForm.commodity} onChange={e => setShipForm(f => ({ ...f, commodity: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Destination Country *</label>
                    <input required className={inputCls} value={shipForm.destination_country} onChange={e => setShipForm(f => ({ ...f, destination_country: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Buyer Name</label>
                    <input className={inputCls} value={shipForm.buyer_name} onChange={e => setShipForm(f => ({ ...f, buyer_name: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Vessel / Flight Ref</label>
                    <input className={inputCls} value={shipForm.vessel_ref} onChange={e => setShipForm(f => ({ ...f, vessel_ref: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Est. Departure</label>
                    <input type="date" className={inputCls} value={shipForm.estimated_departure} onChange={e => setShipForm(f => ({ ...f, estimated_departure: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Quantity (kg)</label>
                    <input type="number" step="0.01" className={inputCls} value={shipForm.quantity_kg} onChange={e => setShipForm(f => ({ ...f, quantity_kg: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Unit Price (USD/kg)</label>
                    <input type="number" step="0.001" className={inputCls} value={shipForm.unit_price_usd} onChange={e => setShipForm(f => ({ ...f, unit_price_usd: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Currency</label>
                    <input className={inputCls} value={shipForm.currency} onChange={e => setShipForm(f => ({ ...f, currency: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Notes</label>
                    <input className={inputCls} value={shipForm.notes} onChange={e => setShipForm(f => ({ ...f, notes: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowShipForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Create Shipment</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Ref', 'Commodity', 'Destination', 'Buyer', 'Departure', 'Qty (kg)', 'Value USD', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shipments.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-gray-400 text-sm">No shipments yet</td></tr>}
                  {shipments.map(s => (
                    <tr key={s.shipment_id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 font-mono text-xs text-blue-600">{s.shipment_ref}</td>
                      <td className="px-3 py-3 font-medium">{s.commodity}</td>
                      <td className="px-3 py-3 text-gray-600">{s.destination_country}</td>
                      <td className="px-3 py-3 text-gray-600">{s.buyer_name || '—'}</td>
                      <td className="px-3 py-3 text-gray-600">{s.estimated_departure ? s.estimated_departure.substring(0,10) : '—'}</td>
                      <td className="px-3 py-3 text-gray-600">{s.quantity_kg != null ? s.quantity_kg.toLocaleString() : '—'}</td>
                      <td className="px-3 py-3 text-gray-600">{s.total_value_usd != null ? `$${s.total_value_usd.toLocaleString()}` : '—'}</td>
                      <td className="px-3 py-3"><Badge text={s.status} color={SHIP_COLORS[s.status] || 'bg-gray-100 text-gray-600'} /></td>
                      <td className="px-3 py-3 flex gap-1 flex-wrap">
                        <button onClick={() => loadShipDetail(s)} className="text-blue-600 hover:underline text-xs">Docs</button>
                        {s.status === 'draft' && <button onClick={() => updateStatus(s.shipment_id, 'pending_docs')} className="text-amber-600 hover:underline text-xs">→ Pending</button>}
                        {s.status === 'pending_docs' && <button onClick={() => updateStatus(s.shipment_id, 'inspected')} className="text-blue-600 hover:underline text-xs">→ Inspected</button>}
                        {s.status === 'inspected' && <button onClick={() => updateStatus(s.shipment_id, 'cleared')} className="text-green-600 hover:underline text-xs">→ Clear</button>}
                        {s.status === 'cleared' && <button onClick={() => updateStatus(s.shipment_id, 'shipped')} className="text-purple-600 hover:underline text-xs">→ Ship</button>}
                        {s.status === 'shipped' && <button onClick={() => setDeliverModal(s)} className="text-teal-600 hover:underline text-xs font-semibold">→ Deliver</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Shipment Detail (Docs) tab ── */}
        {tab === 'ship-detail' && selectedShip && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedShip.shipment_ref}</h2>
                  <p className="text-sm text-gray-500">{selectedShip.commodity} → {selectedShip.destination_country} {selectedShip.buyer_name ? `· ${selectedShip.buyer_name}` : ''}</p>
                </div>
                <Badge text={selectedShip.status} color={SHIP_COLORS[selectedShip.status] || 'bg-gray-100 text-gray-600'} />
              </div>
            </div>

            {/* Phytosanitary Certs */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-semibold text-gray-800">Phytosanitary Certificates</h3>
              <form onSubmit={addPhyto} className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                <div><label className="text-xs text-gray-500 mb-1 block">Cert Number *</label>
                  <input required className={inputCls} value={phytoForm.cert_number} onChange={e => setPhytoForm(f => ({ ...f, cert_number: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Issuing Authority</label>
                  <input className={inputCls} value={phytoForm.issuing_authority} onChange={e => setPhytoForm(f => ({ ...f, issuing_authority: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Issue Date</label>
                  <input type="date" className={inputCls} value={phytoForm.issue_date} onChange={e => setPhytoForm(f => ({ ...f, issue_date: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Expiry Date</label>
                  <input type="date" className={inputCls} value={phytoForm.expiry_date} onChange={e => setPhytoForm(f => ({ ...f, expiry_date: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Commodity on Cert</label>
                  <input className={inputCls} value={phytoForm.commodity} onChange={e => setPhytoForm(f => ({ ...f, commodity: e.target.value }))} /></div>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Cert</button>
              </form>
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100">
                  <tr><th className="text-left py-2">Cert #</th><th className="text-left py-2">Authority</th><th className="text-left py-2">Issue</th><th className="text-left py-2">Expiry</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(shipDetail?.phyto || []).map((p, i) => (
                    <tr key={i}>
                      <td className="py-2 font-mono text-xs">{p.cert_number}</td>
                      <td className="py-2 text-gray-600">{p.issuing_authority || '—'}</td>
                      <td className="py-2 text-gray-600">{p.issue_date ? p.issue_date.substring(0,10) : '—'}</td>
                      <td className="py-2 text-gray-600">{p.expiry_date ? p.expiry_date.substring(0,10) : '—'}</td>
                    </tr>
                  ))}
                  {!shipDetail?.phyto?.length && <tr><td colSpan={4} className="py-3 text-center text-gray-400 text-xs">No certs added</td></tr>}
                </tbody>
              </table>
            </div>

            {/* Customs Docs */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="font-semibold text-gray-800">Customs Documents</h3>
              <form onSubmit={addCustomsDoc} className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                <div><label className="text-xs text-gray-500 mb-1 block">Doc Type</label>
                  <select className={inputCls} value={customsForm.doc_type} onChange={e => setCustomsForm(f => ({ ...f, doc_type: e.target.value }))}>
                    {['bill_of_lading', 'commercial_invoice', 'packing_list', 'certificate_of_origin', 'health_certificate', 'fumigation_cert', 'other'].map(t => (
                      <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                    ))}
                  </select></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Doc Number</label>
                  <input className={inputCls} value={customsForm.doc_number} onChange={e => setCustomsForm(f => ({ ...f, doc_number: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Issuing Country</label>
                  <input className={inputCls} value={customsForm.issuing_country} onChange={e => setCustomsForm(f => ({ ...f, issuing_country: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Issue Date</label>
                  <input type="date" className={inputCls} value={customsForm.issue_date} onChange={e => setCustomsForm(f => ({ ...f, issue_date: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Notes</label>
                  <input className={inputCls} value={customsForm.notes} onChange={e => setCustomsForm(f => ({ ...f, notes: e.target.value }))} /></div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Add Doc</button>
              </form>
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 border-b border-gray-100">
                  <tr><th className="text-left py-2">Type</th><th className="text-left py-2">Doc #</th><th className="text-left py-2">Country</th><th className="text-left py-2">Date</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(shipDetail?.customs || []).map((d, i) => (
                    <tr key={i}>
                      <td className="py-2 capitalize">{d.doc_type?.replace(/_/g, ' ')}</td>
                      <td className="py-2 font-mono text-xs">{d.doc_number || '—'}</td>
                      <td className="py-2 text-gray-600">{d.issuing_country || '—'}</td>
                      <td className="py-2 text-gray-600">{d.issue_date ? d.issue_date.substring(0,10) : '—'}</td>
                    </tr>
                  ))}
                  {!shipDetail?.customs?.length && <tr><td colSpan={4} className="py-3 text-center text-gray-400 text-xs">No documents added</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'ship-detail' && !selectedShip && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <p>Select a shipment to view its documents.</p>
          </div>
        )}

        {/* ── Certifications tab ── */}
        {tab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Compliance Certifications</h2>
              <button onClick={() => setShowCertForm(v => !v)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                + Add Certification
              </button>
            </div>

            {showCertForm && (
              <form onSubmit={createCert} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-800">New Certification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Cert Type *</label>
                    <input required className={inputCls} placeholder="e.g. GlobalG.A.P., USDA Organic, FSSC 22000" value={certForm.cert_type} onChange={e => setCertForm(f => ({ ...f, cert_type: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Cert Number</label>
                    <input className={inputCls} value={certForm.cert_number} onChange={e => setCertForm(f => ({ ...f, cert_number: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Issuing Body</label>
                    <input className={inputCls} value={certForm.issuing_body} onChange={e => setCertForm(f => ({ ...f, issuing_body: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Issue Date</label>
                    <input type="date" className={inputCls} value={certForm.issue_date} onChange={e => setCertForm(f => ({ ...f, issue_date: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Expiry Date</label>
                    <input type="date" className={inputCls} value={certForm.expiry_date} onChange={e => setCertForm(f => ({ ...f, expiry_date: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Notes</label>
                    <input className={inputCls} value={certForm.notes} onChange={e => setCertForm(f => ({ ...f, notes: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowCertForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Save Certification</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certs.length === 0 && <p className="text-sm text-gray-400 col-span-3">No compliance certifications yet. Add GlobalG.A.P., USDA Organic, FSSC 22000, and others.</p>}
              {certs.map(c => {
                const isExpired = c.expiry_date && new Date(c.expiry_date) < new Date();
                const expiringSoon = !isExpired && c.expiry_date && (new Date(c.expiry_date) - new Date()) < 30 * 86400000;
                return (
                  <div key={c.cert_id} className={`bg-white rounded-xl border p-4 ${isExpired ? 'border-red-200' : expiringSoon ? 'border-amber-200' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{c.cert_type}</p>
                        {c.issuing_body && <p className="text-xs text-gray-500">{c.issuing_body}</p>}
                      </div>
                      {isExpired ? <Badge text="Expired" color="bg-red-100 text-red-800" />
                        : expiringSoon ? <Badge text="Expiring" color="bg-amber-100 text-amber-800" />
                        : <Badge text="Active" color="bg-green-100 text-green-800" />}
                    </div>
                    {c.cert_number && <p className="text-xs font-mono text-gray-600 mb-1">{c.cert_number}</p>}
                    <div className="text-xs text-gray-500 mb-3">
                      {c.issue_date && <span>Issued: {c.issue_date.substring(0,10)}</span>}
                      {c.expiry_date && <span className="ml-2">Expires: {c.expiry_date.substring(0,10)}</span>}
                    </div>
                    {c.notes && <p className="text-xs text-gray-500 mb-2">{c.notes}</p>}
                    <button onClick={() => deleteCert(c.cert_id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Recalls tab ── */}
        {tab === 'recalls' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Recall Management</h2>
              <button onClick={() => setShowRecallForm(v => !v)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                + Log Recall
              </button>
            </div>

            {showRecallForm && (
              <form onSubmit={createRecall} className="bg-white rounded-xl border border-red-200 p-5 space-y-4">
                <h3 className="font-semibold text-red-700">New Recall Event</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Lot / Batch Ref *</label>
                    <input required className={inputCls} value={recallForm.lot_ref} onChange={e => setRecallForm(f => ({ ...f, lot_ref: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Commodity *</label>
                    <input required className={inputCls} value={recallForm.commodity} onChange={e => setRecallForm(f => ({ ...f, commodity: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Recall Date</label>
                    <input type="date" className={inputCls} value={recallForm.recall_date} onChange={e => setRecallForm(f => ({ ...f, recall_date: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Units Affected</label>
                    <input type="number" className={inputCls} value={recallForm.units_affected} onChange={e => setRecallForm(f => ({ ...f, units_affected: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><label className="text-xs text-gray-500 mb-1 block">Reason *</label>
                    <input required className={inputCls} value={recallForm.reason} onChange={e => setRecallForm(f => ({ ...f, reason: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowRecallForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Log Recall</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Recall Ref', 'Lot Ref', 'Commodity', 'Reason', 'Units', 'Date', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recalls.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm">No recalls recorded</td></tr>}
                  {recalls.map(r => (
                    <tr key={r.recall_id} className={`hover:bg-gray-50 ${r.status === 'active' ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs">{r.recall_ref}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.lot_ref}</td>
                      <td className="px-4 py-3 font-medium">{r.commodity}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{r.reason}</td>
                      <td className="px-4 py-3 text-gray-600">{r.units_affected?.toLocaleString() || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{r.recall_date ? r.recall_date.substring(0,10) : '—'}</td>
                      <td className="px-4 py-3"><Badge text={r.status} color={r.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} /></td>
                      <td className="px-4 py-3">
                        {r.status === 'active' && <button onClick={() => resolveRecall(r.recall_id)} className="text-green-600 hover:underline text-xs">Resolve</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Crop Margins tab ── */}
        {tab === 'margins' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Crop Margin vs. Operational Cost</h2>
              <button onClick={() => setShowMarginForm(v => !v)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                + Add Record
              </button>
            </div>

            {showMarginForm && (
              <form onSubmit={createMargin} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-gray-800">New Crop Margin Record</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Crop *</label>
                    <input required className={inputCls} value={marginForm.crop} onChange={e => setMarginForm(f => ({ ...f, crop: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Season</label>
                    <input className={inputCls} placeholder="e.g. 2025-26 Long Rains" value={marginForm.season} onChange={e => setMarginForm(f => ({ ...f, season: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Field / Block Ref</label>
                    <input className={inputCls} value={marginForm.field_ref} onChange={e => setMarginForm(f => ({ ...f, field_ref: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Yield (kg)</label>
                    <input type="number" step="0.01" className={inputCls} value={marginForm.yield_kg} onChange={e => setMarginForm(f => ({ ...f, yield_kg: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Price / kg (USD)</label>
                    <input type="number" step="0.001" className={inputCls} value={marginForm.price_per_kg} onChange={e => setMarginForm(f => ({ ...f, price_per_kg: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Variable Cost (USD)</label>
                    <input type="number" step="0.01" className={inputCls} value={marginForm.variable_cost_usd} onChange={e => setMarginForm(f => ({ ...f, variable_cost_usd: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Fixed Cost (USD)</label>
                    <input type="number" step="0.01" className={inputCls} value={marginForm.fixed_cost_usd} onChange={e => setMarginForm(f => ({ ...f, fixed_cost_usd: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Currency</label>
                    <input className={inputCls} value={marginForm.currency} onChange={e => setMarginForm(f => ({ ...f, currency: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Notes</label>
                    <input className={inputCls} value={marginForm.notes} onChange={e => setMarginForm(f => ({ ...f, notes: e.target.value }))} /></div>
                </div>
                <p className="text-xs text-gray-400">Revenue = Yield × Price. Gross Margin = Revenue − Variable − Fixed. Auto-calculated on save.</p>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowMarginForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Save Record</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Crop', 'Season', 'Field', 'Yield (kg)', 'Revenue USD', 'Total Cost USD', 'Gross Margin', 'Margin %'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {margins.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm">No margin records yet</td></tr>}
                  {margins.map(m => {
                    const pct = m.margin_pct;
                    const pctColor = pct >= 30 ? 'text-green-600' : pct >= 10 ? 'text-amber-600' : 'text-red-600';
                    return (
                      <tr key={m.margin_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{m.crop}</td>
                        <td className="px-4 py-3 text-gray-600">{m.season || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{m.field_ref || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{m.yield_kg != null ? m.yield_kg.toLocaleString() : '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{m.revenue_usd != null ? `$${m.revenue_usd.toLocaleString()}` : '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{m.total_cost_usd != null ? `$${m.total_cost_usd.toLocaleString()}` : '—'}</td>
                        <td className="px-4 py-3 font-semibold">{m.gross_margin_usd != null ? `$${m.gross_margin_usd.toLocaleString()}` : '—'}</td>
                        <td className={`px-4 py-3 font-bold ${pctColor}`}>{pct != null ? `${parseFloat(pct).toFixed(1)}%` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Delivery confirmation modal ── */}
      {deliverModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Confirm Delivery</h3>
            <p className="text-sm text-gray-600">
              <span className="font-mono text-blue-600">{deliverModal.shipment_ref}</span> — {deliverModal.commodity}
            </p>
            <p className="text-xs text-gray-500">A revenue invoice will be created in Accounting for <strong>${(deliverModal.total_value_usd || 0).toLocaleString()}</strong>.</p>
            <form onSubmit={confirmDeliver} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Actual Arrival Date</label>
                <input type="date" name="actual_arrival_date" className={inputCls}
                  defaultValue={new Date().toISOString().slice(0, 10)} />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setDeliverModal(null)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700">Confirm Delivery</button>
              </div>
            </form>
          </div>
        </div>
      )}

          <ThaiymeChat businessId={businessId} page="export-compliance" />
    </AccountLayout>
  );
}
