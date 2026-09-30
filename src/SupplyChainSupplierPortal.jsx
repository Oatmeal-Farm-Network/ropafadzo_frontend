/**
 * SupplyChainSupplierPortal — Public supplier self-service portal.
 * No auth required. Token passed via URL: /supply-chain/portal/:token
 * Suppliers can view their active shipments, submit quality tests, submit events.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const API  = import.meta.env.VITE_API_URL || '';
const TEAL = '#1e6b5a';

function TarrigonIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill={TEAL} />
      <path d="M13 20c0-2.2 1.8-4 4-4h2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M27 20c0 2.2-1.8 4-4 4h-2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="11" y="16" width="8" height="8" rx="4" stroke="white" strokeWidth="2.2" fill="none"/>
      <rect x="21" y="16" width="8" height="8" rx="4" stroke="white" strokeWidth="2.2" fill="none"/>
      <path d="M20 10 C18 12 17 14 20 15 C23 14 22 12 20 10Z" fill="white" opacity="0.7"/>
    </svg>
  );
}

function SubmitQualityModal({ shipments, token, onClose, onSaved }) {
  const [form, setForm] = useState({ PassFail: 'pass' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.ShipmentID) { setError('Please select a shipment.'); return; }
    setSaving(true); setError('');
    try {
      const r = await fetch(`${API}/api/esci/supplier-portal/${token}/quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.detail || `Error ${r.status}`);
      }
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold text-gray-900 text-lg">Submit Quality Test</h2>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Shipment *</label>
            <select value={form.ShipmentID || ''} onChange={e => set('ShipmentID', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]">
              <option value="">— select —</option>
              {shipments.map(s => (
                <option key={s.ShipmentID} value={s.ShipmentID}>
                  {s.ProductName} #{s.ShipmentID} ({s.Status})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Result *</label>
            <select value={form.PassFail} onChange={e => set('PassFail', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Grade</label>
            <select value={form.Grade || ''} onChange={e => set('Grade', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
              <option value="">—</option>
              {['A', 'B', 'C', 'D', 'F'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          {[['Defect %', 'DefectPct'], ['Brix Level', 'BrixLevel'], ['Moisture %', 'MoisturePct']].map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type="number" step="0.1" value={form[key] || ''} onChange={e => set(key, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea value={form.Notes || ''} onChange={e => set('Notes', e.target.value)} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="px-4 py-1.5 text-sm text-white rounded-lg disabled:opacity-50"
            style={{ backgroundColor: TEAL }}>
            {saving ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmitEventModal({ shipments, token, onClose, onSaved }) {
  const [form, setForm] = useState({ EventType: 'departed' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.ShipmentID) { setError('Please select a shipment.'); return; }
    setSaving(true); setError('');
    try {
      const r = await fetch(`${API}/api/esci/supplier-portal/${token}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.detail || `Error ${r.status}`);
      }
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold text-gray-900 text-lg">Submit Shipment Event</h2>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Shipment *</label>
            <select value={form.ShipmentID || ''} onChange={e => set('ShipmentID', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e6b5a]">
              <option value="">— select —</option>
              {shipments.map(s => (
                <option key={s.ShipmentID} value={s.ShipmentID}>
                  {s.ProductName} #{s.ShipmentID}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Event Type *</label>
            <select value={form.EventType} onChange={e => set('EventType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
              {['departed', 'in_transit', 'arrived', 'customs_hold', 'delayed', 'delivered'].map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
            <input type="text" value={form.Location || ''} onChange={e => set('Location', e.target.value)}
              placeholder="e.g. Port of Oakland"
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea value={form.Notes || ''} onChange={e => set('Notes', e.target.value)} rows={3}
              placeholder="Any additional details…"
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="px-4 py-1.5 text-sm text-white rounded-lg disabled:opacity-50"
            style={{ backgroundColor: TEAL }}>
            {saving ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_BADGE = {
  pending:    'bg-gray-100 text-gray-700',
  in_transit: 'bg-blue-100 text-blue-700',
  received:   'bg-emerald-100 text-emerald-700',
  rejected:   'bg-red-100 text-red-700',
};

export default function SupplyChainSupplierPortal() {
  const { token } = useParams();

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [modal, setModal]     = useState(null);
  const [toast, setToast]     = useState('');

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API}/api/esci/supplier-portal/${token}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { setData(d); setLoading(false); })
      .catch(e => {
        setError(e === 401 || e === 403 ? 'This portal link is invalid or has expired.'
          : e === 404 ? 'Portal not found.'
          : 'Unable to load portal. Please try again.');
        setLoading(false);
      });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <TarrigonIcon size={48} />
          <p className="text-gray-500 text-sm">Loading supplier portal…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow p-8 max-w-md w-full text-center space-y-4">
          <TarrigonIcon size={48} />
          <h2 className="font-semibold text-gray-900 text-lg">Portal Unavailable</h2>
          <p className="text-sm text-gray-500">{error || 'Portal data could not be loaded.'}</p>
          <p className="text-xs text-gray-400">
            Contact your buyer to request a new portal link.
          </p>
        </div>
      </div>
    );
  }

  const shipments = Array.isArray(data.shipments) ? data.shipments : [];
  const supplier  = data.supplier || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <TarrigonIcon size={36} />
        <div>
          <h1 className="font-semibold text-gray-900 leading-none">{supplier.SupplierName || 'Supplier Portal'}</h1>
          <p className="text-xs text-gray-500 mt-0.5">OatmealFarmNetwork Supply Chain Portal</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-3xl mx-auto p-5 space-y-6">
        {/* Supplier info */}
        {(supplier.Country || supplier.Region || supplier.CertifiedOrganic) && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-600 flex flex-wrap gap-4">
            {supplier.Country && <span>Country: <strong className="text-gray-900">{supplier.Country}</strong></span>}
            {supplier.Region && <span>Region: <strong className="text-gray-900">{supplier.Region}</strong></span>}
            {supplier.CertifiedOrganic && <span className="text-emerald-700 font-medium">Certified Organic</span>}
            {supplier.CertifiedGAP && <span className="text-emerald-700 font-medium">GAP Certified</span>}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setModal('quality')}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl shadow"
            style={{ backgroundColor: TEAL }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Submit Quality Test
          </button>
          <button
            onClick={() => setModal('event')}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-xl border border-gray-300 bg-white hover:bg-gray-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Submit Shipment Update
          </button>
        </div>

        {/* Shipments */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Your Shipments</h2>
          {shipments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
              No active shipments on file.
            </div>
          ) : (
            <div className="space-y-2">
              {shipments.map(s => {
                const today = new Date().toISOString().slice(0, 10);
                const isOverdue = ['pending', 'in_transit'].includes(s.Status) &&
                  s.ExpectedDate && s.ExpectedDate.slice(0, 10) < today;
                return (
                  <div key={s.ShipmentID}
                    className={`bg-white border rounded-xl p-4 ${isOverdue ? 'border-red-200' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900">{s.ProductName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[s.Status] || 'bg-gray-100 text-gray-700'}`}>
                            {s.Status?.replace(/_/g, ' ')}
                          </span>
                          {isOverdue && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">OVERDUE</span>
                          )}
                        </div>
                        {s.ShipmentRef && (
                          <div className="text-xs text-gray-500 mt-0.5">Ref: {s.ShipmentRef}</div>
                        )}
                      </div>
                      <div className="text-right shrink-0 text-xs text-gray-500">
                        <div>Qty: {s.OrderedQty != null ? `${Number(s.OrderedQty).toLocaleString()} ${s.Unit || ''}` : '—'}</div>
                        {s.ExpectedDate && (
                          <div className={`mt-0.5 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                            Expected: {s.ExpectedDate.slice(0, 10)}
                          </div>
                        )}
                      </div>
                    </div>
                    {s.DestLocation && (
                      <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {s.DestLocation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-4">
          Powered by OatmealFarmNetwork · Tarrigon Supply Chain Intelligence
        </div>
      </div>

      {modal === 'quality' && (
        <SubmitQualityModal
          shipments={shipments.filter(s => !['received', 'rejected'].includes(s.Status))}
          token={token}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); showToast('Quality test submitted successfully.'); load(); }}
        />
      )}

      {modal === 'event' && (
        <SubmitEventModal
          shipments={shipments.filter(s => !['received', 'rejected'].includes(s.Status))}
          token={token}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); showToast('Shipment update submitted successfully.'); load(); }}
        />
      )}
    </div>
  );
}
