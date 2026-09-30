// src/BatchTracker.jsx
// Route: /batches?BusinessID=
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AccountSidebar from './AccountSidebar';
import PageMeta from './PageMeta';

const API = import.meta.env.VITE_API_URL || '';
const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || `${API}/saige`;
const ACCENT = '#8B5CF6';
const ACCENT_LIGHT = '#f5f3ff';
const ACCENT_BORDER = '#e9d5ff';

const STATUS_COLORS = {
  planned:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  in_progress: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  complete:    { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  on_hold:     { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
};

const STATUSES = ['planned', 'in_progress', 'complete', 'on_hold'];

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.planned;
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 11, fontWeight: 700, padding: '2px 8px' }}>
      {status?.replace('_', ' ')}
    </span>
  );
}

// ─── Inline Rosemarie chat ────────────────────────────────────────────────────

function RosemariePanel({ businessId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [threadId] = useState(() => {
    const key = `rosemarie_batch_thread_${businessId}`;
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = `rosemarie_${businessId}_batches_${Date.now()}`;
    localStorage.setItem(key, id);
    return id;
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    setInput('');
    setSending(true);
    const next = [...messages, { role: 'user', content: msg }];
    setMessages(next);
    try {
      const r = await fetch(`${SAIGE_API}/rosemarie/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ user_input: msg, thread_id: threadId, business_id: Number(businessId) }),
      });
      const data = await r.json();
      setMessages([...next, { role: 'assistant', content: data.response || 'No response.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Couldn\'t reach the server. Try again.' }]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    'Show my in-progress batches',
    'Log a new batch',
    'What batches completed this month?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: 12, border: `1px solid ${ACCENT_BORDER}`, overflow: 'hidden' }}>
      <div style={{ background: ACCENT, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c0 0-6 6-6 11a6 6 0 0 0 12 0c0-5-6-11-6-11z"/>
        </svg>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Rosemarie</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginLeft: 'auto' }}>Batch assistant</span>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 4px' }}>
        {messages.length === 0 && (
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 12.5, color: '#6b7280', marginBottom: 8 }}>Ask me about your production batches.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => send(s)}
                  style={{ textAlign: 'left', background: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 8, padding: '5px 9px', fontSize: 12, color: '#5b21b6', cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 7 }}>
            <div style={{
              maxWidth: '90%', padding: '7px 11px', borderRadius: 10, fontSize: 13, lineHeight: 1.45, whiteSpace: 'pre-wrap',
              background: m.role === 'user' ? ACCENT : ACCENT_LIGHT,
              color: m.role === 'user' ? '#fff' : '#111827',
              border: m.role === 'user' ? 'none' : `1px solid ${ACCENT_BORDER}`,
              wordBreak: 'break-word',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 7 }}>
            <div style={{ background: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 10, padding: '7px 11px', fontSize: 12, color: '#6b7280' }}>Thinking…</div>
          </div>
        )}
      </div>
      <div style={{ padding: '8px 10px', borderTop: `1px solid ${ACCENT_BORDER}`, display: 'flex', gap: 6 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask Rosemarie…"
          style={{ flex: 1, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 8, padding: '6px 10px', fontSize: 13, outline: 'none' }}
        />
        <button onClick={() => send()} disabled={!input.trim() || sending}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: (!input.trim() || sending) ? 0.5 : 1 }}>
          Send
        </button>
      </div>
    </div>
  );
}

// ─── Batch detail ─────────────────────────────────────────────────────────────

function BatchDetail({ batch, businessId, onRefresh }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState(batch.Notes || '');
  const [savingNotes, setSavingNotes] = useState(false);

  const changeStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      await fetch(`${API}/api/recipes-batches/batches/${batch.BatchID}?business_id=${businessId}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      onRefresh();
    } finally { setUpdatingStatus(false); }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch(`${API}/api/recipes-batches/batches/${batch.BatchID}?business_id=${businessId}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ notes }),
      });
      setEditNotes(false);
      onRefresh();
    } finally { setSavingNotes(false); }
  };

  const deleteBatch = async () => {
    if (!window.confirm('Delete this batch permanently?')) return;
    await fetch(`${API}/api/recipes-batches/batches/${batch.BatchID}?business_id=${businessId}`, { method: 'DELETE', headers: authHeaders() });
    onRefresh(true);
  };

  const dateStr = batch.BatchDate ? String(batch.BatchDate).slice(0, 10) : '—';

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: "'Lora','Times New Roman',serif", margin: 0 }}>
            Batch #{batch.BatchID}
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>{batch.RecipeName || 'No recipe linked'} · {dateStr}</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <StatusBadge status={batch.Status} />
          <button onClick={deleteBatch} style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, background: 'none', border: '1.5px solid #ef4444', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>

      {/* Status controls */}
      <div className="mb-4 p-3 rounded-lg" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Update Status</p>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => {
            const c = STATUS_COLORS[s];
            const active = batch.Status === s;
            return (
              <button key={s} onClick={() => !active && changeStatus(s)} disabled={active || updatingStatus}
                style={{
                  background: active ? c.bg : '#fff', color: active ? c.text : '#374151',
                  border: `1.5px solid ${active ? c.border : '#d1d5db'}`,
                  borderRadius: 7, padding: '4px 12px', fontSize: 12, fontWeight: active ? 700 : 400,
                  cursor: active ? 'default' : 'pointer', opacity: updatingStatus ? 0.6 : 1,
                }}>
                {s.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Batch details */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div style={{ background: ACCENT_LIGHT, borderRadius: 8, padding: '8px 12px', border: `1px solid ${ACCENT_BORDER}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', margin: '0 0 2px', textTransform: 'uppercase' }}>Batch Size</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#5b21b6', margin: 0 }}>
            {batch.BatchSize ? `${Number(batch.BatchSize).toLocaleString()}×` : '1×'} {batch.SizeUnit || ''}
          </p>
        </div>
        <div style={{ background: ACCENT_LIGHT, borderRadius: 8, padding: '8px 12px', border: `1px solid ${ACCENT_BORDER}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', margin: '0 0 2px', textTransform: 'uppercase' }}>Date</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#5b21b6', margin: 0 }}>{dateStr}</p>
        </div>
        <div style={{ background: ACCENT_LIGHT, borderRadius: 8, padding: '8px 12px', border: `1px solid ${ACCENT_BORDER}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', margin: '0 0 2px', textTransform: 'uppercase' }}>Status</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#5b21b6', margin: 0 }}>{(batch.Status || '').replace('_', ' ')}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Notes</span>
          {!editNotes && <button onClick={() => setEditNotes(true)} style={{ fontSize: 11, color: ACCENT, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>}
        </div>
        {editNotes ? (
          <div>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => { setEditNotes(false); setNotes(batch.Notes || ''); }} style={{ fontSize: 12, color: '#6b7280', background: 'none', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveNotes} disabled={savingNotes}
                style={{ fontSize: 12, background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>
                {savingNotes ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: batch.Notes ? '#374151' : '#9ca3af', fontStyle: batch.Notes ? 'normal' : 'italic' }}>
            {batch.Notes || 'No notes yet.'}
          </p>
        )}
      </div>

      {/* Ingredients */}
      {batch.ingredients?.length > 0 && (
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Ingredients</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600, fontSize: 11 }}>Ingredient</th>
                <th style={{ textAlign: 'right', padding: '4px 8px', color: '#6b7280', fontWeight: 600, fontSize: 11 }}>Planned</th>
                <th style={{ textAlign: 'right', padding: '4px 8px', color: '#6b7280', fontWeight: 600, fontSize: 11 }}>Actual</th>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600, fontSize: 11 }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {batch.ingredients.map((ing, i) => {
                const diff = ing.ActualQty != null && ing.PlannedQty != null ? Number(ing.ActualQty) - Number(ing.PlannedQty) : null;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '5px 8px', color: '#111827' }}>{ing.IngredientName}</td>
                    <td style={{ padding: '5px 8px', textAlign: 'right', color: '#374151' }}>{ing.PlannedQty != null ? Number(ing.PlannedQty).toLocaleString() : '—'}</td>
                    <td style={{ padding: '5px 8px', textAlign: 'right' }}>
                      <span style={{ color: diff != null ? (diff > 0 ? '#d97706' : diff < 0 ? '#dc2626' : '#059669') : '#374151' }}>
                        {ing.ActualQty != null ? Number(ing.ActualQty).toLocaleString() : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '5px 8px', color: '#374151' }}>{ing.Unit || ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

// ─── New Batch form ───────────────────────────────────────────────────────────

function NewBatchForm({ businessId, onSaved, onCancel }) {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({ recipe_id: '', batch_date: new Date().toISOString().slice(0, 10), batch_size: '1', size_unit: '', status: 'planned', notes: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`${API}/api/recipes-batches/recipes?business_id=${businessId}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : []).then(setRecipes).catch(() => {});
  }, [businessId]);

  const submit = async () => {
    setSaving(true); setErr('');
    try {
      const r = await fetch(`${API}/api/recipes-batches/batches`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          business_id: Number(businessId),
          recipe_id: form.recipe_id ? Number(form.recipe_id) : null,
          batch_date: form.batch_date,
          batch_size: Number(form.batch_size) || 1,
          size_unit: form.size_unit,
          status: form.status,
          notes: form.notes,
        }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || 'Failed');
      const data = await r.json();
      onSaved(data.batch_id);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400';

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Recipe (optional)</label>
          <select className={inputCls} value={form.recipe_id} onChange={e => setForm(f => ({ ...f, recipe_id: e.target.value }))}>
            <option value="">— No recipe / free-form batch —</option>
            {recipes.map(r => <option key={r.RecipeID} value={r.RecipeID}>{r.RecipeName}{r.Category ? ` (${r.Category})` : ''}</option>)}
          </select>
          {form.recipe_id && <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>Ingredients will be seeded from this recipe at the batch size multiplier.</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Batch Date</label>
          <input type="date" className={inputCls} value={form.batch_date} onChange={e => setForm(f => ({ ...f, batch_date: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Batch Size ×</label>
          <input type="number" min="0.1" step="any" className={inputCls} value={form.batch_size} onChange={e => setForm(f => ({ ...f, batch_size: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Size Unit</label>
          <input className={inputCls} placeholder="e.g. kg, liters, batches" value={form.size_unit} onChange={e => setForm(f => ({ ...f, size_unit: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Initial Status</label>
          <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
          <textarea className={inputCls} rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </div>
      {err && <p className="text-xs text-red-600 mb-3">{err}</p>}
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg">Cancel</button>
        <button onClick={submit} disabled={saving}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Logging…' : 'Log Batch'}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BatchTracker() {
  const [params] = useSearchParams();
  const businessId = params.get('BusinessID') || '';

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  const load = useCallback(async (sf = statusFilter) => {
    if (!businessId) return;
    setLoading(true);
    try {
      const q = sf ? `&status=${encodeURIComponent(sf)}` : '';
      const r = await fetch(`${API}/api/recipes-batches/batches?business_id=${businessId}${q}`, { headers: authHeaders() });
      setBatches(r.ok ? await r.json() : []);
    } catch { setBatches([]); }
    finally { setLoading(false); }
  }, [businessId, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (id) => {
    setDetailLoading(true);
    try {
      const r = await fetch(`${API}/api/recipes-batches/batches/${id}?business_id=${businessId}`, { headers: authHeaders() });
      if (r.ok) setSelected(await r.json());
    } finally { setDetailLoading(false); }
  };

  const handleSaved = (id) => {
    setShowForm(false);
    load();
    loadDetail(id);
  };

  const handleRefresh = (clear = false) => {
    if (clear) setSelected(null);
    else if (selected) loadDetail(selected.BatchID);
    load();
  };

  const ALL_FILTER = [{ label: 'All', value: '' }, ...STATUSES.map(s => ({ label: s.replace('_', ' '), value: s }))];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta title="Batch Tracker | Oatmeal Farm Network" description="Track your artisan production batches." />
      <Header />
      <div className="flex">
        <AccountSidebar />
        <div className="flex-1 min-w-0" style={{ marginLeft: 64 }}>
          <div className="mx-auto px-4 py-6" style={{ maxWidth: 1300 }}>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', fontFamily: "'Lora','Times New Roman',serif", margin: 0 }}>Batch Tracker</h1>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Log and monitor every production run.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setChatOpen(o => !o)}
                  style={{ background: chatOpen ? ACCENT : '#fff', color: chatOpen ? '#fff' : ACCENT, border: `1.5px solid ${ACCENT}`, borderRadius: 8, padding: '7px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  {chatOpen ? 'Hide Rosemarie' : 'Ask Rosemarie'}
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  + Log Batch
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: chatOpen ? '260px 1fr 300px' : '260px 1fr', gap: 16, alignItems: 'start' }}>
              {/* Batch list */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                  <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); load(e.target.value); }}
                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '6px 10px', fontSize: 13, outline: 'none', background: '#fff' }}>
                    {ALL_FILTER.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
                  {loading ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Loading…</div>
                  ) : batches.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No batches found.</div>
                  ) : batches.map(b => {
                    const c = STATUS_COLORS[b.Status] || STATUS_COLORS.planned;
                    return (
                      <button key={b.BatchID} onClick={() => loadDetail(b.BatchID)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                          borderBottom: '1px solid #f3f4f6', background: selected?.BatchID === b.BatchID ? ACCENT_LIGHT : 'transparent',
                          borderLeft: selected?.BatchID === b.BatchID ? `3px solid ${ACCENT}` : '3px solid transparent',
                          cursor: 'pointer', border: 'none',
                          borderBottom: '1px solid #f3f4f6',
                          borderLeft: selected?.BatchID === b.BatchID ? `3px solid ${ACCENT}` : '3px solid transparent',
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>#{b.BatchID} {b.RecipeName || 'No recipe'}</div>
                            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>{String(b.BatchDate || '').slice(0, 10)}</div>
                          </div>
                          <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 5, fontSize: 10, fontWeight: 700, padding: '1px 6px', flexShrink: 0 }}>
                            {(b.Status || '').replace('_', ' ')}
                          </span>
                        </div>
                        {b.BatchSize && <div style={{ fontSize: 11, color: '#8b5cf6', marginTop: 2 }}>{Number(b.BatchSize).toLocaleString()}× {b.SizeUnit || ''}</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail / form */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, minHeight: 400 }}>
                {showForm ? (
                  <>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Log New Batch</h3>
                    <NewBatchForm businessId={businessId} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
                  </>
                ) : selected ? (
                  detailLoading ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 40 }}>Loading…</div>
                  ) : (
                    <BatchDetail batch={selected} businessId={businessId} onRefresh={handleRefresh} />
                  )
                ) : (
                  <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 60 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={ACCENT_BORDER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                    <p style={{ fontSize: 13 }}>Select a batch to view details, or log a new one.</p>
                  </div>
                )}
              </div>

              {/* Rosemarie */}
              {chatOpen && (
                <div style={{ height: 'calc(100vh - 200px)', position: 'sticky', top: 80 }}>
                  <RosemariePanel businessId={businessId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
