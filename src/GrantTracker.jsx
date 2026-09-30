import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const STATUS_COLORS = {
  interested: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  submitted: 'bg-purple-100 text-purple-700',
  awarded: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  not_eligible: 'bg-orange-100 text-orange-700',
};

const STATUSES = ['interested', 'in_progress', 'submitted', 'awarded', 'declined', 'not_eligible'];

function fmtDate(d) { return d ? new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : ''; }
function daysUntil(d) { if (!d) return null; return Math.ceil((new Date(d) - new Date()) / 86400000); }

export default function GrantTracker() {
  const { BusinessID } = useAccount();
  const [searchParams] = useSearchParams();
  const [grants, setGrants] = useState([]);
  const [tracked, setTracked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [programType, setProgramType] = useState('');
  const [tab, setTab] = useState(searchParams.get('tab') || 'browse');
  const [selected, setSelected] = useState(null);
  const [trackStatus, setTrackStatus] = useState('interested');
  const [trackNotes, setTrackNotes] = useState('');
  const [tracking, setTracking] = useState(false);
  const [editTracking, setEditTracking] = useState(null);

  const loadGrants = () => {
    const p = new URLSearchParams();
    if (programType) p.set('program_type', programType);
    if (q) p.set('q', q);
    fetch(`${API}/api/grants?${p}`).then(r => r.json()).then(d => { setGrants(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  };

  const loadTracked = () => {
    if (!BusinessID) return;
    fetch(`${API}/api/grants/business/${BusinessID}/tracking`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setTracked(Array.isArray(d) ? d : []));
  };

  useEffect(() => { loadGrants(); loadTracked(); }, [BusinessID, programType]);

  const trackGrant = async (grantId) => {
    if (!BusinessID) return;
    setTracking(true);
    await fetch(`${API}/api/grants/business/${BusinessID}/tracking`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ grant_id: grantId, status: trackStatus, notes: trackNotes }),
    });
    setTracking(false); setSelected(null); setTrackStatus('interested'); setTrackNotes('');
    loadTracked(); setTab('my-tracking');
  };

  const updateTracking = async (trackingId, updates) => {
    await fetch(`${API}/api/grants/business/${BusinessID}/tracking/${trackingId}`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify(updates),
    });
    loadTracked();
  };

  const deleteTracking = async (trackingId) => {
    if (!confirm('Remove from your tracker?')) return;
    await fetch(`${API}/api/grants/business/${BusinessID}/tracking/${trackingId}`, { method: 'DELETE', headers: authHeaders() });
    loadTracked();
  };

  const TYPES = [...new Set(grants.map(g => g.ProgramType).filter(Boolean))];

  return (
    <div style={{ backgroundColor: '#f7f2e8', minHeight: '100vh' }}>
      <PageMeta title="Grant & Program Tracker — Oatmeal Farm Network" description="Find USDA grants, FSA programs, and track your applications." />
      <Header />
      <div style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0) 100%)', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Breadcrumbs items={[{ label: 'Grant & Program Tracker' }]} />
          <h1 className="text-3xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>Grant & Program Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">USDA programs, FSA loans, conservation grants, and more.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6 border-b border-gray-200">
          {['browse', 'my-tracking'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-2 text-sm font-semibold border-b-2 transition -mb-px ${tab === t ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'browse' ? 'Browse Programs' : `My Tracker${tracked.length ? ` (${tracked.length})` : ''}`}
            </button>
          ))}
        </div>

        {tab === 'browse' && (
          <>
            <div className="flex flex-wrap gap-3 mb-5">
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={programType} onChange={e => { setProgramType(e.target.value); }}>
                <option value="">All Types</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white flex-1" style={{ minWidth: 200 }} placeholder="Search programs…" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadGrants()} />
              <button onClick={loadGrants} className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: GREEN }}>Search</button>
            </div>
            {loading ? <p className="text-gray-400">Loading…</p> : (
              <div className="space-y-3">
                {grants.map(g => {
                  const days = daysUntil(g.Deadline);
                  const alreadyTracked = tracked.some(t => t.GrantID === g.GrantID);
                  return (
                    <div key={g.GrantID} className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900">{g.Title}</div>
                          <div className="text-xs text-green-700 font-semibold mt-0.5">{g.Agency}</div>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                            {g.ProgramType && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{g.ProgramType}</span>}
                            {g.MaxAmount && <span>Up to ${Number(g.MaxAmount).toLocaleString()}</span>}
                            {g.Deadline && <span className={days !== null && days <= 30 ? 'text-red-600 font-semibold' : ''}>
                              Deadline: {fmtDate(g.Deadline)}{days !== null && days <= 30 && ` (${days}d left)`}
                            </span>}
                            {g.IsRecurring ? <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Recurring</span> : null}
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{g.Description}</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          {g.ExternalUrl && <a href={g.ExternalUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-center">Details ↗</a>}
                          <button onClick={() => { setSelected(g); setTrackStatus('interested'); setTrackNotes(''); }}
                            className={`text-xs px-3 py-1.5 rounded-lg font-bold text-center ${alreadyTracked ? 'bg-green-50 text-green-700 border border-green-200' : 'text-white'}`}
                            style={!alreadyTracked ? { backgroundColor: GREEN } : {}}>
                            {alreadyTracked ? '✓ Tracked' : 'Track'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === 'my-tracking' && (
          <div className="space-y-3">
            {tracked.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p>No grants tracked yet.</p>
                <button onClick={() => setTab('browse')} className="mt-2 text-green-700 font-semibold hover:underline text-sm">Browse programs →</button>
              </div>
            ) : tracked.map(t => (
              <div key={t.TrackingID} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900">{t.GrantTitle}</div>
                    <div className="text-xs text-green-700 font-semibold">{t.Agency}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <select value={t.Status} onChange={e => updateTracking(t.TrackingID, { status: e.target.value })}
                        className="text-xs border border-gray-200 rounded-full px-2 py-1">
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                      {t.MaxAmount && <span className="text-xs text-gray-500">Up to ${Number(t.MaxAmount).toLocaleString()}</span>}
                      {t.Deadline && <span className="text-xs text-gray-500">Due {fmtDate(t.Deadline)}</span>}
                    </div>
                    {t.Notes && <p className="text-xs text-gray-500 mt-1 truncate">{t.Notes}</p>}
                    {t.Status === 'awarded' && t.AmountReceived && <div className="text-sm font-bold text-green-700 mt-1">Received: ${Number(t.AmountReceived).toLocaleString()}</div>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {t.ExternalUrl && <a href={t.ExternalUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Details</a>}
                    <button onClick={() => deleteTracking(t.TrackingID)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: NAV_BG }}>
              <span className="text-white font-bold text-sm truncate">Track: {selected.Title}</span>
              <button onClick={() => setSelected(null)} className="text-white">✕</button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={trackStatus} onChange={e => setTrackStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3} value={trackNotes} onChange={e => setTrackNotes(e.target.value)} placeholder="Any notes about eligibility, contact person, etc." />
              </div>
              <div className="flex gap-2">
                <button onClick={() => trackGrant(selected.GrantID)} disabled={tracking}
                  className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm disabled:opacity-40"
                  style={{ backgroundColor: GREEN }}>{tracking ? 'Saving…' : 'Add to Tracker'}</button>
                <button onClick={() => setSelected(null)} className="px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
