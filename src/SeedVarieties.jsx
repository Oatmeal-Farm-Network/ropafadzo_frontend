import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SaigeWidget from './SaigeWidget';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
function tok() { return localStorage.getItem('access_token'); }
function auth() { return { Authorization: `Bearer ${tok()}` }; }
function get(path) { return fetch(`${API}${path}`, { headers: auth() }).then(r => r.ok ? r.json() : null); }

function fmtDate(s) {
  if (!s) return '—';
  return new Date(s + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(s) {
  if (!s) return null;
  return Math.ceil((new Date(s) - new Date()) / 86400000);
}

function ExpiryBadge({ date }) {
  const d = daysUntil(date);
  if (d === null) return null;
  if (d < 0)   return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Expired</span>;
  if (d <= 60)  return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">Exp in {d}d</span>;
  return <span className="text-xs text-gray-400">{fmtDate(date)}</span>;
}

function Stars({ rating }) {
  if (!rating) return <span className="text-gray-300">—</span>;
  return <span title={`${rating}/5`}>{Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
  ))}</span>;
}

function LotModal({ bid, onClose, onSaved }) {
  const [f, setF] = useState({ crop_name: '', variety: '', supplier: '', lot_number: '', purchase_date: '', quantity_kg: '', price_per_kg: '', germination_rate: '', test_date: '', expiry_date: '', storage_location: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const upd = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    if (!f.crop_name.trim()) return;
    setSaving(true);
    const qs = new URLSearchParams({ business_id: bid, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '')) });
    await fetch(`${API}/api/seeds/lots?${qs}`, { method: 'POST', headers: auth() });
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Add Seed Lot</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {[
            ['Crop *', 'crop_name', 'text', 'e.g. Wheat'],
            ['Variety', 'variety', 'text', 'e.g. Mace'],
            ['Supplier', 'supplier', 'text', ''],
            ['Lot Number', 'lot_number', 'text', ''],
            ['Purchase Date', 'purchase_date', 'date', ''],
            ['Quantity (kg)', 'quantity_kg', 'number', ''],
            ['Price/kg ($)', 'price_per_kg', 'number', ''],
            ['Germination %', 'germination_rate', 'number', ''],
            ['Test Date', 'test_date', 'date', ''],
            ['Expiry Date', 'expiry_date', 'date', ''],
            ['Storage Location', 'storage_location', 'text', 'e.g. Shed B'],
          ].map(([label, key, type, ph]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={f[key]} onChange={e => upd(key, e.target.value)}
                placeholder={ph} step={type === 'number' ? '0.01' : undefined}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={f.notes} onChange={e => upd('notes', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
          <button onClick={save} disabled={saving || !f.crop_name.trim()}
            className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Add Lot'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrialModal({ bid, lots, onClose, onSaved }) {
  const [f, setF] = useState({ crop_name: '', variety: '', lot_id: '', field_name: '', season: String(new Date().getFullYear()), plant_date: '', harvest_date: '', area_ha: '', yield_tonnes_ha: '', grade_a_pct: '', rating: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const upd = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    if (!f.crop_name.trim()) return;
    setSaving(true);
    const qs = new URLSearchParams({ business_id: bid, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v !== '')) });
    await fetch(`${API}/api/seeds/trials?${qs}`, { method: 'POST', headers: auth() });
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Record Variety Trial</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {[
            ['Crop *', 'crop_name', 'text', ''],
            ['Variety', 'variety', 'text', ''],
            ['Field', 'field_name', 'text', ''],
            ['Season', 'season', 'text', ''],
            ['Plant Date', 'plant_date', 'date', ''],
            ['Harvest Date', 'harvest_date', 'date', ''],
            ['Area (ha)', 'area_ha', 'number', ''],
            ['Yield (t/ha)', 'yield_tonnes_ha', 'number', ''],
            ['Grade A %', 'grade_a_pct', 'number', ''],
            ['Rating (1-5)', 'rating', 'number', ''],
          ].map(([label, key, type, ph]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} value={f[key]} onChange={e => upd(key, e.target.value)}
                placeholder={ph} min={key === 'rating' ? 1 : undefined} max={key === 'rating' ? 5 : undefined}
                step={type === 'number' ? '0.01' : undefined}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Seed Lot (optional)</label>
            <select value={f.lot_id} onChange={e => upd('lot_id', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
              <option value="">— None —</option>
              {lots.map(l => <option key={l.lot_id} value={l.lot_id}>{l.crop_name} {l.variety} ({l.lot_number || l.lot_id})</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={f.notes} onChange={e => upd('notes', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
          <button onClick={save} disabled={saving || !f.crop_name.trim()}
            className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Record Trial'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SeedVarieties() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');

  const [tab, setTab]         = useState('lots');
  const [lots, setLots]       = useState([]);
  const [trials, setTrials]   = useState([]);
  const [perf, setPerf]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal]     = useState(null);

  const load = () => {
    if (!bid) return;
    setLoading(true);
    Promise.all([
      get(`/api/seeds/lots?business_id=${bid}`),
      get(`/api/seeds/trials?business_id=${bid}`),
      get(`/api/seeds/performance?business_id=${bid}`),
    ]).then(([l, t, p]) => {
      setLots(Array.isArray(l) ? l : []);
      setTrials(Array.isArray(t) ? t : []);
      setPerf(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [bid]);

  const deleteLot = async (id) => {
    if (!window.confirm('Delete this seed lot?')) return;
    await fetch(`${API}/api/seeds/lots/${id}`, { method: 'DELETE', headers: auth() });
    load();
  };

  const deleteTrial = async (id) => {
    if (!window.confirm('Delete this trial?')) return;
    await fetch(`${API}/api/seeds/trials/${id}`, { method: 'DELETE', headers: auth() });
    load();
  };

  const maxYield = perf.length ? Math.max(...perf.map(p => p.avg_yield || 0), 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Seed & Variety Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track seed lots, record variety trials, and compare performance</p>
        </div>
        <div className="flex gap-2">
          {tab === 'lots' && <button onClick={() => setModal('lot')} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700">+ Add Lot</button>}
          {tab === 'trials' && <button onClick={() => setModal('trial')} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700">+ Record Trial</button>}
        </div>
      </div>

      <div className="border-b bg-white px-6">
        <div className="flex gap-6">
          {[['lots', 'Seed Lots'], ['trials', 'Variety Trials'], ['performance', 'Performance']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-5xl">
        {loading && <p className="text-gray-400 text-sm">Loading…</p>}

        {/* Seed Lots */}
        {!loading && tab === 'lots' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {lots.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-2">🌾</div>
                <p>No seed lots yet.</p>
                <button onClick={() => setModal('lot')} className="mt-2 text-blue-600 text-sm hover:underline">Add your first lot →</button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Crop', 'Variety', 'Supplier', 'Lot #', 'Qty (kg)', 'Germ %', 'Expiry', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lots.map(l => (
                    <tr key={l.lot_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{l.crop_name}</td>
                      <td className="px-4 py-3 text-gray-600">{l.variety || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{l.supplier || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{l.lot_number || '—'}</td>
                      <td className="px-4 py-3">{l.remaining_kg != null ? `${l.remaining_kg} / ${l.quantity_kg || '?'}` : l.quantity_kg || '—'}</td>
                      <td className="px-4 py-3">
                        {l.germination_rate != null ? (
                          <span className={`text-xs font-medium ${l.germination_rate >= 85 ? 'text-green-700' : l.germination_rate >= 70 ? 'text-yellow-700' : 'text-red-600'}`}>
                            {l.germination_rate}%
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3"><ExpiryBadge date={l.expiry_date} /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteLot(l.lot_id)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Variety Trials */}
        {!loading && tab === 'trials' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {trials.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-2">🧪</div>
                <p>No variety trials recorded yet.</p>
                <button onClick={() => setModal('trial')} className="mt-2 text-blue-600 text-sm hover:underline">Record your first trial →</button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Season', 'Crop', 'Variety', 'Field', 'Yield (t/ha)', 'Grade A %', 'Rating', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trials.map(t => (
                    <tr key={t.trial_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{t.season || '—'}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{t.crop_name}</td>
                      <td className="px-4 py-3 text-gray-600">{t.variety || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{t.field_name || '—'}</td>
                      <td className="px-4 py-3 font-medium text-green-700">{t.yield_tonnes_ha != null ? t.yield_tonnes_ha.toFixed(2) : '—'}</td>
                      <td className="px-4 py-3">{t.grade_a_pct != null ? `${t.grade_a_pct}%` : '—'}</td>
                      <td className="px-4 py-3"><Stars rating={t.rating} /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteTrial(t.trial_id)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Performance */}
        {!loading && tab === 'performance' && (
          <div className="space-y-3">
            {perf.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-2">📊</div>
                <p>Record variety trials with yield data to see performance comparisons.</p>
              </div>
            ) : perf.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">{p.variety || p.crop_name}</span>
                    <span className="text-xs text-gray-500 ml-2">{p.crop_name} · {p.trials} trial{p.trials !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700">{p.avg_yield?.toFixed(2)} t/ha</div>
                    {p.avg_rating && <Stars rating={Math.round(p.avg_rating)} />}
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full"
                    style={{ width: `${((p.avg_yield || 0) / maxYield) * 100}%` }} />
                </div>
                <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
                  {p.avg_grade_a != null && <span>Grade A: {p.avg_grade_a.toFixed(1)}%</span>}
                  {p.last_harvest && <span>Last harvested: {fmtDate(p.last_harvest)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {[['/crop-planning', 'Crop Planner'], ['/yield-records', 'Yield Records'], ['/soil-tests', 'Soil Tests']].map(([to, label]) => (
            <Link key={to} to={`${to}?BusinessID=${bid}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50">
              {label} →
            </Link>
          ))}
        </div>
      </div>

      {modal === 'lot'   && <LotModal   bid={bid} onClose={() => setModal(null)} onSaved={load} />}
      {modal === 'trial' && <TrialModal bid={bid} lots={lots} onClose={() => setModal(null)} onSaved={load} />}

      <SaigeWidget businessId={bid} pageContext="Seed & Variety Management" />
    </div>
  );
}
