import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { useAccount } from './AccountContext';
import PageMeta from './PageMeta';

const API = import.meta.env.VITE_API_URL || '';
const GREEN = '#3D6B34';

function authHeaders() {
  const t = localStorage.getItem('access_token') || '';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` };
}

function statusBadge(status) {
  const map = {
    active: 'bg-green-100 text-green-700',
    expiring_soon: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700',
  };
  const labels = { active: 'Active', expiring_soon: 'Expiring Soon', expired: 'Expired' };
  return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>{labels[status] || status}</span>;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function CertificationsTracker() {
  const { BusinessID } = useAccount();
  const [certs, setCerts] = useState([]);
  const [types, setTypes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank());
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function blank() {
    return { cert_name: '', cert_type: '', issuing_body: '', cert_number: '', issued_date: '', expiry_date: '', notes: '', document_url: '' };
  }

  const load = () => {
    if (!BusinessID) return;
    fetch(`${API}/api/certifications/business/${BusinessID}`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setCerts(Array.isArray(d) ? d : []));
  };
  useEffect(() => {
    fetch(`${API}/api/certifications/types`).then(r => r.json()).then(setTypes);
    load();
  }, [BusinessID]);

  const save = async () => {
    setSaving(true);
    const url = editing ? `${API}/api/certifications/${editing}` : `${API}/api/certifications/business/${BusinessID}`;
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    setSaving(false); setEditing(null); setForm(blank()); setShowForm(false); load();
  };

  const del = async (id) => {
    if (!confirm('Delete this certification?')) return;
    await fetch(`${API}/api/certifications/${id}`, { method: 'DELETE', headers: authHeaders() }); load();
  };

  const startEdit = (c) => {
    setEditing(c.CertID);
    setForm({ cert_name: c.CertName || '', cert_type: c.CertType || '', issuing_body: c.IssuingBody || '', cert_number: c.CertNumber || '', issued_date: c.IssuedDate?.split('T')[0] || '', expiry_date: c.ExpiryDate?.split('T')[0] || '', notes: c.Notes || '', document_url: c.DocumentUrl || '' });
    setShowForm(true);
  };

  const inp = (key, props = {}) => (
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} {...props} />
  );

  const expiring = certs.filter(c => c.ComputedStatus === 'expiring_soon');
  const expired = certs.filter(c => c.ComputedStatus === 'expired');
  const active = certs.filter(c => c.ComputedStatus === 'active');

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <PageMeta title="Certifications Tracker | OFN" noIndex />
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Breadcrumbs items={[{ label: 'Certifications Tracker' }]} />
        <div className="flex items-center justify-between mt-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Certifications Tracker</h1>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(blank()); }} className="px-4 py-2 rounded-lg text-white font-bold text-sm" style={{ backgroundColor: GREEN }}>+ Add Certification</button>
        </div>

        {/* Alerts */}
        {expired.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-4 flex items-center gap-3">
            <span className="text-red-600 font-bold text-sm">⚠ {expired.length} certification{expired.length > 1 ? 's' : ''} expired</span>
          </div>
        )}
        {expiring.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 mb-4">
            <span className="text-yellow-700 font-bold text-sm">⏰ {expiring.length} certification{expiring.length > 1 ? 's' : ''} expiring within 60 days</span>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="font-bold text-gray-800 mb-4">{editing ? 'Edit Certification' : 'Add Certification'}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1">Certification Name *</label>{inp('cert_name', { placeholder: 'e.g. USDA Organic' })}</div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.cert_type} onChange={e => setForm(f => ({ ...f, cert_type: e.target.value }))}>
                  <option value="">Select type…</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Issuing Body</label>{inp('issuing_body', { placeholder: 'e.g. USDA NOP' })}</div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Certificate Number</label>{inp('cert_number')}</div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Issued Date</label>{inp('issued_date', { type: 'date' })}</div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date</label>{inp('expiry_date', { type: 'date' })}</div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Document URL</label>{inp('document_url', { placeholder: 'https://…' })}</div>
              <div className="sm:col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={save} disabled={saving || !form.cert_name} className="px-5 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40" style={{ backgroundColor: GREEN }}>{saving ? 'Saving…' : editing ? 'Update' : 'Add'}</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
            </div>
          </div>
        )}

        {/* Cert cards */}
        {certs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No certifications tracked yet. Add your first one above.</div>
        ) : (
          <div className="space-y-3">
            {[...expired, ...expiring, ...active].map(c => {
              const days = daysUntil(c.ExpiryDate);
              return (
                <div key={c.CertID} className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">{c.CertName}</span>
                        {statusBadge(c.ComputedStatus)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {c.IssuingBody && <span>{c.IssuingBody} · </span>}
                        {c.CertNumber && <span>#{c.CertNumber} · </span>}
                        {c.ExpiryDate && <span>Expires {c.ExpiryDate?.split('T')[0]}</span>}
                        {days !== null && days > 0 && days <= 90 && <span className="ml-2 text-yellow-600 font-semibold">({days} days left)</span>}
                        {days !== null && days <= 0 && <span className="ml-2 text-red-600 font-semibold">({Math.abs(days)} days ago)</span>}
                      </div>
                      {c.Notes && <div className="text-xs text-gray-400 mt-1 truncate">{c.Notes}</div>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {c.DocumentUrl && <a href={c.DocumentUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">View Doc</a>}
                      <button onClick={() => startEdit(c)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Edit</button>
                      <button onClick={() => del(c.CertID)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
