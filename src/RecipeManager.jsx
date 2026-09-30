// src/RecipeManager.jsx
// Route: /recipes?BusinessID=
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import AccountSidebar from './AccountSidebar';
import PageMeta from './PageMeta';

const API = import.meta.env.VITE_API_URL || '';
const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || `${API}/saige`;
const ACCENT = '#8B5CF6';
const ACCENT_LIGHT = '#f5f3ff';
const ACCENT_BORDER = '#e9d5ff';

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Inline Rosemarie chat panel ──────────────────────────────────────────────

function RosemariePanel({ businessId, context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [threadId] = useState(() => {
    const key = `rosemarie_recipe_thread_${businessId}`;
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = `rosemarie_${businessId}_recipes_${Date.now()}`;
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
      setMessages([...next, { role: 'assistant', content: 'I couldn\'t reach the server. Try again.' }]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    'Show me my recipes',
    'Help me write a new recipe',
    'What\'s the best ratio for sourdough?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: 12, border: `1px solid ${ACCENT_BORDER}`, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: ACCENT, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c0 0-6 6-6 11a6 6 0 0 0 12 0c0-5-6-11-6-11z"/>
        </svg>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Rosemarie</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginLeft: 'auto' }}>Recipe assistant</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 4px' }}>
        {messages.length === 0 && (
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 12.5, color: '#6b7280', marginBottom: 8 }}>
              Ask me about your recipes, formulas, or artisan production.
            </p>
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
            <div style={{ background: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 10, padding: '7px 11px', fontSize: 12, color: '#6b7280' }}>
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
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

// ─── Recipe form ──────────────────────────────────────────────────────────────

function RecipeForm({ initial, businessId, onSaved, onCancel }) {
  const blank = { recipe_name: '', category: '', description: '', yield_qty: '', yield_unit: '', batch_size_note: '', ingredients: [], steps: [] };
  // Map the API's PascalCase recipe onto the snake_case form shape. Without this,
  // Edit left every field undefined (fields didn't populate) and form.recipe_name.trim()
  // crashed on save.
  const toForm = (r) => (r && r.RecipeID) ? {
    recipe_name:     r.RecipeName     || '',
    category:        r.Category        || '',
    description:     r.Description      || '',
    yield_qty:       r.YieldQty != null ? String(r.YieldQty) : '',
    yield_unit:      r.YieldUnit        || '',
    batch_size_note: r.BatchSizeNote    || '',
    ingredients: (r.ingredients || []).map(x => ({
      ingredient_name: x.IngredientName || '',
      quantity:        x.Quantity != null ? String(x.Quantity) : '',
      unit:            x.Unit || '',
      notes:           x.Notes || '',
    })),
    steps: (r.steps || []).map(s => ({ step_number: s.StepNumber, step_text: s.StepText || '' })),
  } : blank;
  const [form, setForm] = useState(toForm(initial));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addIngredient = () => setForm(f => ({ ...f, ingredients: [...f.ingredients, { ingredient_name: '', quantity: '', unit: '', notes: '' }] }));
  const removeIngredient = (i) => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, j) => j !== i) }));
  const setIng = (i, k, v) => setForm(f => ({ ...f, ingredients: f.ingredients.map((x, j) => j === i ? { ...x, [k]: v } : x) }));

  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, { step_number: f.steps.length + 1, step_text: '' }] }));
  const removeStep = (i) => setForm(f => ({ ...f, steps: f.steps.filter((_, j) => j !== i).map((s, j) => ({ ...s, step_number: j + 1 })) }));
  const setStep = (i, v) => setForm(f => ({ ...f, steps: f.steps.map((s, j) => j === i ? { ...s, step_text: v } : s) }));

  const submit = async () => {
    if (!form.recipe_name.trim()) { setErr('Recipe name is required.'); return; }
    setSaving(true); setErr('');
    try {
      const isEdit = !!initial?.RecipeID;
      const url = isEdit
        ? `${API}/api/recipes-batches/recipes/${initial.RecipeID}?business_id=${businessId}`
        : `${API}/api/recipes-batches/recipes`;
      const payload = {
        ...form,
        business_id: Number(businessId),
        yield_qty: form.yield_qty ? Number(form.yield_qty) : null,
        ingredients: form.ingredients.map(x => ({ ...x, quantity: x.quantity ? Number(x.quantity) : null })),
      };
      const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || 'Save failed');
      const data = await r.json();
      onSaved(isEdit ? initial.RecipeID : data.recipe_id);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '2px 4px' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Recipe Name *</label>
          <input className={inputCls} value={form.recipe_name} onChange={e => setField('recipe_name', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <input className={inputCls} placeholder="e.g. Bread, Cheese, Jam, Sausage" value={form.category} onChange={e => setField('category', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Yield Quantity</label>
          <input className={inputCls} type="number" min="0" step="any" value={form.yield_qty} onChange={e => setField('yield_qty', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Yield Unit</label>
          <input className={inputCls} placeholder="e.g. loaves, kg, jars" value={form.yield_unit} onChange={e => setField('yield_unit', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Batch Size Note</label>
          <input className={inputCls} placeholder="e.g. 'Base recipe for 10L vat'" value={form.batch_size_note} onChange={e => setField('batch_size_note', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Description / Notes</label>
          <textarea className={inputCls} rows={3} value={form.description} onChange={e => setField('description', e.target.value)} />
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={labelCls} style={{ margin: 0 }}>Ingredients</span>
          <button onClick={addIngredient} style={{ color: ACCENT, fontSize: 12, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add ingredient</button>
        </div>
        {form.ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2 mb-2 items-start">
            <input className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Ingredient name" value={ing.ingredient_name} onChange={e => setIng(i, 'ingredient_name', e.target.value)} />
            <input className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-xs" type="number" min="0" step="any" placeholder="Qty" value={ing.quantity} onChange={e => setIng(i, 'quantity', e.target.value)} />
            <input className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Unit" value={ing.unit} onChange={e => setIng(i, 'unit', e.target.value)} />
            <input className="w-32 border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Notes" value={ing.notes} onChange={e => setIng(i, 'notes', e.target.value)} />
            <button onClick={() => removeIngredient(i)} style={{ color: '#ef4444', fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', paddingTop: 4 }}>×</button>
          </div>
        ))}
        {form.ingredients.length === 0 && (
          <p className="text-xs text-gray-400">No ingredients yet.</p>
        )}
      </div>

      {/* Steps */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={labelCls} style={{ margin: 0 }}>Steps</span>
          <button onClick={addStep} style={{ color: ACCENT, fontSize: 12, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add step</button>
        </div>
        {form.steps.map((step, i) => (
          <div key={i} className="flex gap-2 mb-2 items-start">
            <span style={{ width: 22, fontSize: 12, color: '#6b7280', paddingTop: 6, flexShrink: 0 }}>{step.step_number}.</span>
            <textarea className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs" rows={2} placeholder="Step description" value={step.step_text} onChange={e => setStep(i, e.target.value)} />
            <button onClick={() => removeStep(i)} style={{ color: '#ef4444', fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', paddingTop: 4 }}>×</button>
          </div>
        ))}
        {form.steps.length === 0 && (
          <p className="text-xs text-gray-400">No steps yet.</p>
        )}
      </div>

      {err && <p className="text-xs text-red-600 mb-3">{err}</p>}
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
        <button onClick={submit} disabled={saving}
          style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : 'Save Recipe'}
        </button>
      </div>
    </div>
  );
}

// ─── Recipe detail ────────────────────────────────────────────────────────────

function RecipeDetail({ recipe, businessId, onEdit, onArchive, onStartBatch }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', fontFamily: "'Lora','Times New Roman',serif" }}>{recipe.RecipeName}</h2>
          {recipe.Category && <span style={{ background: ACCENT_LIGHT, color: ACCENT, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '2px 8px', marginTop: 4, display: 'inline-block' }}>{recipe.Category}</span>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onStartBatch(recipe)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            Log Batch
          </button>
          <button onClick={() => onEdit(recipe)} style={{ background: '#fff', color: ACCENT, border: `1.5px solid ${ACCENT}`, borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            Edit
          </button>
          <button onClick={() => onArchive(recipe.RecipeID)} style={{ background: '#fff', color: '#ef4444', border: '1.5px solid #ef4444', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            Archive
          </button>
        </div>
      </div>

      {(recipe.YieldQty || recipe.YieldUnit) && (
        <div className="mb-3 p-3 rounded-lg" style={{ background: ACCENT_LIGHT, border: `1px solid ${ACCENT_BORDER}` }}>
          <span style={{ fontSize: 13, color: '#5b21b6' }}>
            <b>Yield:</b> {recipe.YieldQty ? `${Number(recipe.YieldQty).toLocaleString()} ` : ''}{recipe.YieldUnit || ''}
            {recipe.BatchSizeNote ? ` — ${recipe.BatchSizeNote}` : ''}
          </span>
        </div>
      )}

      {recipe.Description && (
        <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.6, marginBottom: 16 }}>{recipe.Description}</p>
      )}

      {recipe.ingredients?.length > 0 && (
        <section className="mb-5">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Ingredients</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600, fontSize: 11 }}>Ingredient</th>
                <th style={{ textAlign: 'right', padding: '4px 8px', color: '#6b7280', fontWeight: 600, fontSize: 11 }}>Qty</th>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600, fontSize: 11 }}>Unit</th>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600, fontSize: 11 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {recipe.ingredients.map((ing, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '5px 8px', color: '#111827' }}>{ing.IngredientName}</td>
                  <td style={{ padding: '5px 8px', textAlign: 'right', color: '#374151' }}>{ing.Quantity != null ? Number(ing.Quantity).toLocaleString() : '—'}</td>
                  <td style={{ padding: '5px 8px', color: '#374151' }}>{ing.Unit || ''}</td>
                  <td style={{ padding: '5px 8px', color: '#6b7280', fontSize: 12 }}>{ing.Notes || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {recipe.steps?.length > 0 && (
        <section>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Method</h3>
          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {recipe.steps.map(step => (
              <li key={step.StepNumber} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: ACCENT, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.StepNumber}
                </span>
                <span style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.55, paddingTop: 2 }}>{step.StepText}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

// ─── Quick batch modal ────────────────────────────────────────────────────────

function QuickBatchModal({ recipe, businessId, onLogged, onClose }) {
  const [form, setForm] = useState({ batch_date: new Date().toISOString().slice(0, 10), batch_size: '1', size_unit: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setSaving(true); setErr('');
    try {
      const r = await fetch(`${API}/api/recipes-batches/batches`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          business_id: Number(businessId),
          recipe_id: recipe.RecipeID,
          batch_date: form.batch_date,
          batch_size: Number(form.batch_size) || 1,
          size_unit: form.size_unit,
          notes: form.notes,
        }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || 'Failed');
      const data = await r.json();
      onLogged(data.batch_id);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 'min(440px, 95vw)', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Log Batch: {recipe.RecipeName}</h3>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Ingredients will be seeded from the recipe at the batch size multiplier.</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Batch Date</label>
            <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.batch_date} onChange={e => setForm(f => ({ ...f, batch_date: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Batch Size ×</label>
            <input type="number" min="0.1" step="any" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.batch_size} onChange={e => setForm(f => ({ ...f, batch_size: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Size Unit</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. kg, liters" value={form.size_unit} onChange={e => setForm(f => ({ ...f, size_unit: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Optional" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>
        {err && <p className="text-xs text-red-600 mb-3">{err}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg">Cancel</button>
          <button onClick={submit} disabled={saving}
            style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Logging…' : 'Log Batch'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RecipeManager() {
  const [params] = useSearchParams();
  const businessId = params.get('BusinessID') || '';

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [batchTarget, setBatchTarget] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);

  const load = useCallback(async (q = '') => {
    if (!businessId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/recipes-batches/recipes?business_id=${businessId}${q ? `&q=${encodeURIComponent(q)}` : ''}`, { headers: authHeaders() });
      setRecipes(r.ok ? await r.json() : []);
    } catch { setRecipes([]); }
    finally { setLoading(false); }
  }, [businessId]);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (id) => {
    setDetailLoading(true);
    try {
      const r = await fetch(`${API}/api/recipes-batches/recipes/${id}?business_id=${businessId}`, { headers: authHeaders() });
      if (r.ok) setSelected(await r.json());
    } finally { setDetailLoading(false); }
  };

  const handleArchive = async (id) => {
    if (!window.confirm('Archive this recipe? It will be hidden but not deleted.')) return;
    await fetch(`${API}/api/recipes-batches/recipes/${id}?business_id=${businessId}`, { method: 'DELETE', headers: authHeaders() });
    setSelected(null);
    load(search);
  };

  const handleSaved = (id) => {
    setShowForm(false); setEditing(null);
    load(search);
    loadDetail(id);
  };

  const handleBatchLogged = () => {
    setBatchTarget(null);
    window.location.href = `/batches?BusinessID=${businessId}`;
  };

  const filtered = recipes.filter(r =>
    !search || r.RecipeName?.toLowerCase().includes(search.toLowerCase()) || r.Category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta title="Recipe Manager | Oatmeal Farm Network" description="Manage your artisan food recipes and production formulas." />
      <Header />
      <div className="flex">
        <AccountSidebar />
        <div className="flex-1 min-w-0" style={{ marginLeft: 64 }}>
          <div className="mx-auto px-4 py-6" style={{ maxWidth: 1300 }}>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', fontFamily: "'Lora','Times New Roman',serif", margin: 0 }}>Recipe Manager</h1>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Your artisan formulas, ingredients, and production methods.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setChatOpen(o => !o)}
                  style={{ background: chatOpen ? ACCENT : '#fff', color: chatOpen ? '#fff' : ACCENT, border: `1.5px solid ${ACCENT}`, borderRadius: 8, padding: '7px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  {chatOpen ? 'Hide Rosemarie' : 'Ask Rosemarie'}
                </button>
                <button
                  onClick={() => { setEditing(null); setShowForm(true); }}
                  style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  + New Recipe
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: chatOpen ? '260px 1fr 300px' : '260px 1fr', gap: 16, alignItems: 'start' }}>
              {/* Recipe list */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search recipes…"
                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '6px 10px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
                  {loading ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Loading…</div>
                  ) : filtered.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                      {search ? 'No matches.' : 'No recipes yet. Add your first one!'}
                    </div>
                  ) : filtered.map(r => (
                    <button key={r.RecipeID} onClick={() => loadDetail(r.RecipeID)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                        borderBottom: '1px solid #f3f4f6', background: selected?.RecipeID === r.RecipeID ? ACCENT_LIGHT : 'transparent',
                        borderLeft: selected?.RecipeID === r.RecipeID ? `3px solid ${ACCENT}` : '3px solid transparent',
                        cursor: 'pointer', border: 'none', borderBottom: '1px solid #f3f4f6',
                        borderLeft: selected?.RecipeID === r.RecipeID ? `3px solid ${ACCENT}` : '3px solid transparent',
                      }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{r.RecipeName}</div>
                      {r.Category && <div style={{ fontSize: 11, color: '#8b5cf6', marginTop: 2 }}>{r.Category}</div>}
                      {r.YieldQty && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>Yield: {Number(r.YieldQty).toLocaleString()} {r.YieldUnit || ''}</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail / form panel */}
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, minHeight: 400 }}>
                {showForm ? (
                  <>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{editing ? 'Edit Recipe' : 'New Recipe'}</h3>
                    <RecipeForm
                      initial={editing ? { ...editing, ingredients: editing.ingredients?.map(x => ({ ingredient_name: x.IngredientName, quantity: x.Quantity, unit: x.Unit, notes: x.Notes })) || [], steps: editing.steps?.map(x => ({ step_number: x.StepNumber, step_text: x.StepText })) || [] } : null}
                      businessId={businessId}
                      onSaved={handleSaved}
                      onCancel={() => { setShowForm(false); setEditing(null); }}
                    />
                  </>
                ) : selected ? (
                  detailLoading ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 40 }}>Loading…</div>
                  ) : (
                    <RecipeDetail
                      recipe={selected} businessId={businessId}
                      onEdit={r => { setEditing(r); setShowForm(true); }}
                      onArchive={handleArchive}
                      onStartBatch={setBatchTarget}
                    />
                  )
                ) : (
                  <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 60 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={ACCENT_BORDER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    <p style={{ fontSize: 13 }}>Select a recipe to view details, or add a new one.</p>
                  </div>
                )}
              </div>

              {/* Rosemarie chat */}
              {chatOpen && (
                <div style={{ height: 'calc(100vh - 200px)', position: 'sticky', top: 80 }}>
                  <RosemariePanel businessId={businessId} context={selected?.RecipeName} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {batchTarget && (
        <QuickBatchModal
          recipe={batchTarget} businessId={businessId}
          onLogged={handleBatchLogged}
          onClose={() => setBatchTarget(null)}
        />
      )}

      <Footer />
    </div>
  );
}
