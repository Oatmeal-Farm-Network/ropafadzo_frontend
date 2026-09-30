import React, { useEffect, useState, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams } from 'react-router-dom';
import AccountLayout from './AccountLayout';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const hdrs = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` });
const apiFetch = async (path, opts) => {
  const r = await fetch(`${API}${path}`, { headers: hdrs(), ...opts });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
};

const I = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IcoPlus  = () => <I size={15}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>;
const IcoEdit  = () => <I size={14}><path d="M11 4H4a2 2 0 0 0-2 2v14h14v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></I>;
const IcoTrash = () => <I size={14}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></I>;
const IcoChart = () => <I size={15}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></I>;

const fmt = (n) => n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

const statusColors = {
  draft:    { bg: '#f3f4f6', color: '#374151' },
  active:   { bg: '#dbeafe', color: '#1d4ed8' },
  complete: { bg: '#dcfce7', color: '#166534' },
};

const LINE_CATEGORIES = ['Seed','Fertilizer','Chemicals','Fuel','Labor','Equipment','Irrigation','Custom Work','Insurance','Rent','Marketing','Other'];

export default function CropBudget() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const [budgets, setBudgets] = useState([]);
  const [sel, setSel]         = useState(null);
  const [variance, setVariance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView]       = useState('list'); // list | detail | variance
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState({});
  const [lineForm, setLineForm] = useState({ category: 'Seed', description: '', line_type: 'expense', budgeted_qty: '', budgeted_unit: '', budgeted_rate: '', budgeted_amt: '' });
  const [yearFilter, setYearFilter] = useState('');

  const load = useCallback(async () => {
    if (!bid) return;
    setLoading(true);
    try {
      const d = await apiFetch(`/api/crop-budgets/budgets?business_id=${bid}${yearFilter ? '&crop_year=' + yearFilter : ''}`);
      setBudgets(d);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [bid, yearFilter]);

  const loadDetail = useCallback(async (id) => {
    try {
      const d = await apiFetch(`/api/crop-budgets/budgets/${id}?business_id=${bid}`);
      setSel(d);
    } catch (e) { console.error(e); }
  }, [bid]);

  const loadVariance = useCallback(async (id) => {
    try {
      const d = await apiFetch(`/api/crop-budgets/budgets/${id}/variance?business_id=${bid}`);
      setVariance(d);
    } catch (e) { console.error(e); }
  }, [bid]);

  useEffect(() => { load(); }, [load]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const lf = (k, v) => setLineForm(p => ({ ...p, [k]: v }));
  const openModal = (type, data = {}) => { setModal({ type }); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  const saveBudget = async () => {
    try {
      if (form.budget_id) {
        await apiFetch(`/api/crop-budgets/budgets/${form.budget_id}`, { method: 'PUT', body: JSON.stringify({ ...form, business_id: bid }) });
      } else {
        await apiFetch('/api/crop-budgets/budgets', { method: 'POST', body: JSON.stringify({ ...form, business_id: bid }) });
      }
      load();
      closeModal();
    } catch (e) { alert('Save failed'); }
  };

  const deleteBudget = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await apiFetch(`/api/crop-budgets/budgets/${id}?business_id=${bid}`, { method: 'DELETE' });
      load();
      setSel(null);
      setView('list');
    } catch (e) { alert('Delete failed'); }
  };

  const addLine = async () => {
    if (!sel) return;
    try {
      await apiFetch(`/api/crop-budgets/budgets/${sel.budget_id}/lines`, {
        method: 'POST', body: JSON.stringify({ ...lineForm, business_id: bid }),
      });
      loadDetail(sel.budget_id);
      setLineForm({ category: 'Seed', description: '', line_type: 'expense', budgeted_qty: '', budgeted_unit: '', budgeted_rate: '', budgeted_amt: '' });
    } catch (e) { alert('Add line failed'); }
  };

  const deleteLine = async (lineId) => {
    try {
      await apiFetch(`/api/crop-budgets/lines/${lineId}`, { method: 'DELETE' });
      loadDetail(sel.budget_id);
    } catch (e) { alert('Failed'); }
  };

  const openDetail = async (b) => {
    await loadDetail(b.budget_id);
    setView('detail');
  };

  const openVariance = async (id) => {
    await loadVariance(id);
    setView('variance');
  };

  const varColor = (v) => v == null ? '#374151' : v > 0 ? '#dc2626' : v < 0 ? '#16a34a' : '#374151';

  const years = [...new Set(budgets.map(b => b.crop_year))].sort((a, b) => b - a);

  return (
    <AccountLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            {view !== 'list' && (
              <button onClick={() => { setView('list'); setSel(null); setVariance(null); }} style={{ ...btnStyle('#6b7280'), marginBottom: 8, fontSize: 12 }}>← Back</button>
            )}
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
              {view === 'list' ? 'Crop Budgeting & Actuals' : view === 'variance' ? `Variance: ${variance?.crop_name} ${variance?.crop_year}` : `${sel?.crop_name} ${sel?.crop_year}`}
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Plan income and expenses per crop; compare budget vs actuals.</p>
          </div>
          {view === 'list' && (
            <button onClick={() => openModal('budget')} style={btnStyle('#16a34a')}>
              <IcoPlus /> New Budget
            </button>
          )}
          {view === 'detail' && sel && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openVariance(sel.budget_id)} style={btnStyle('#7c3aed')}>
                <IcoChart /> Variance
              </button>
              <button onClick={() => openModal('budget', { ...sel })} style={btnStyle('#2563eb')}><IcoEdit /> Edit</button>
              <button onClick={() => deleteBudget(sel.budget_id)} style={btnStyle('#dc2626')}><IcoTrash /> Delete</button>
            </div>
          )}
        </div>

        {/* ── LIST ── */}
        {view === 'list' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <select style={selStyle} value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
              {budgets.map(b => {
                const margin = b.budgeted_margin;
                return (
                  <div key={b.budget_id} onClick={() => openDetail(b)} style={{
                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20, cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }} onMouseOver={e => e.currentTarget.style.borderColor = '#16a34a'} onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{b.crop_name}</div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{b.crop_year}{b.season ? ` · ${b.season}` : ''}{b.field_name ? ` · ${b.field_name}` : ''}</div>
                      </div>
                      <span style={{ ...statusColors[b.status], borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{b.status}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, fontSize: 13 }}>
                      <div style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 12px' }}>
                        <div style={{ color: '#6b7280', fontSize: 11 }}>BUDGETED COST</div>
                        <div style={{ fontWeight: 700, color: '#dc2626' }}>${fmt(b.budgeted_cost)}</div>
                      </div>
                      <div style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 12px' }}>
                        <div style={{ color: '#6b7280', fontSize: 11 }}>BUDGETED REVENUE</div>
                        <div style={{ fontWeight: 700, color: '#16a34a' }}>${fmt(b.budgeted_revenue)}</div>
                      </div>
                      <div style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 12px', gridColumn: '1/-1' }}>
                        <div style={{ color: '#6b7280', fontSize: 11 }}>BUDGETED MARGIN</div>
                        <div style={{ fontWeight: 700, color: margin >= 0 ? '#16a34a' : '#dc2626', fontSize: 16 }}>${fmt(margin)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div style={{ gridColumn: '1/-1', color: '#6b7280', textAlign: 'center', padding: 48 }}>
                  No crop budgets yet. Create your first to plan your season.
                </div>
              )}
            </div>
          </>
        )}

        {/* ── DETAIL ── */}
        {view === 'detail' && sel && (
          <div>
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Budgeted Revenue', val: `$${fmt(sel.budgeted_revenue)}`, color: '#16a34a' },
                { label: 'Actual Revenue', val: `$${fmt(sel.actual_revenue)}`, color: '#2563eb' },
                { label: 'Budgeted Cost', val: `$${fmt(sel.budgeted_cost)}`, color: '#dc2626' },
                { label: 'Actual Cost', val: `$${fmt(sel.actual_cost)}`, color: '#d97706' },
                { label: 'Budgeted Margin', val: `$${fmt(sel.budgeted_margin)}`, color: sel.budgeted_margin >= 0 ? '#16a34a' : '#dc2626' },
                { label: 'Actual Margin', val: `$${fmt(sel.actual_margin)}`, color: sel.actual_margin >= 0 ? '#16a34a' : '#dc2626' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Budget lines */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #e5e7eb', fontWeight: 700 }}>Budget Line Items</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['Category','Description','Type','Budg. Qty','Unit','Budg. Rate','Budg. Amt','Actual Amt',''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(sel.lines || []).map(l => (
                    <tr key={l.line_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '8px 12px', color: '#374151' }}>{l.category}</td>
                      <td style={{ padding: '8px 12px' }}>{l.description}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ background: l.line_type === 'revenue' ? '#dcfce7' : '#fee2e2', color: l.line_type === 'revenue' ? '#166534' : '#dc2626', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 600 }}>
                          {l.line_type}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px' }}>{l.budgeted_qty != null ? Number(l.budgeted_qty).toFixed(2) : '—'}</td>
                      <td style={{ padding: '8px 12px' }}>{l.budgeted_unit || '—'}</td>
                      <td style={{ padding: '8px 12px' }}>{l.budgeted_rate != null ? `$${fmt(l.budgeted_rate)}` : '—'}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>${fmt(l.budgeted_amt)}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: '#2563eb' }}>${fmt(l.actual_amt)}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <button onClick={() => deleteLine(l.line_id)} style={{ ...iconBtn, color: '#dc2626' }}><IcoTrash /></button>
                      </td>
                    </tr>
                  ))}
                  {(!sel.lines || sel.lines.length === 0) && (
                    <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>No line items yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add line inline form */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Add Line Item</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={lbl}>Category</label>
                  <select style={{ ...selStyle, minWidth: 120 }} value={lineForm.category} onChange={e => lf('category', e.target.value)}>
                    {LINE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 2, minWidth: 180 }}>
                  <label style={lbl}>Description</label>
                  <input style={inpStyle} value={lineForm.description} onChange={e => lf('description', e.target.value)} placeholder="e.g. Corn seed — Pioneer P0589" />
                </div>
                <div>
                  <label style={lbl}>Type</label>
                  <select style={selStyle} value={lineForm.line_type} onChange={e => lf('line_type', e.target.value)}>
                    <option value="expense">Expense</option>
                    <option value="revenue">Revenue</option>
                  </select>
                </div>
                <div style={{ width: 80 }}>
                  <label style={lbl}>Qty</label>
                  <input style={inpStyle} type="number" value={lineForm.budgeted_qty} onChange={e => lf('budgeted_qty', e.target.value)} />
                </div>
                <div style={{ width: 80 }}>
                  <label style={lbl}>Unit</label>
                  <input style={inpStyle} value={lineForm.budgeted_unit} onChange={e => lf('budgeted_unit', e.target.value)} placeholder="bag" />
                </div>
                <div style={{ width: 90 }}>
                  <label style={lbl}>Rate $</label>
                  <input style={inpStyle} type="number" value={lineForm.budgeted_rate} onChange={e => lf('budgeted_rate', e.target.value)} />
                </div>
                <div style={{ width: 90 }}>
                  <label style={lbl}>Amt $</label>
                  <input style={inpStyle} type="number" value={lineForm.budgeted_amt} onChange={e => lf('budgeted_amt', e.target.value)} />
                </div>
                <button onClick={addLine} style={{ ...btnStyle('#16a34a'), alignSelf: 'flex-end' }}>Add</button>
              </div>
            </div>
          </div>
        )}

        {/* ── VARIANCE ── */}
        {view === 'variance' && variance && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Revenue Variance', val: variance.revenue_variance, budg: variance.budgeted_revenue, actual: variance.actual_revenue },
                { label: 'Cost Variance', val: variance.cost_variance, budg: variance.budgeted_cost, actual: variance.actual_cost },
                { label: 'Margin Variance', val: variance.margin_variance, budg: variance.budgeted_margin, actual: variance.actual_margin },
              ].map(({ label, val, budg, actual }) => (
                <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{label}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>Budget: <strong>${fmt(budg)}</strong></span>
                    <span>Actual: <strong>${fmt(actual)}</strong></span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: varColor(val), marginTop: 8 }}>
                    {val > 0 ? '+' : ''}{fmt(val)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #e5e7eb', fontWeight: 700 }}>Variance by Category</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['Category','Budgeted','Actual','Variance','Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(variance.by_category || []).map(c => (
                    <tr key={c.category} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{c.category}</td>
                      <td style={{ padding: '10px 12px' }}>${fmt(c.budgeted)}</td>
                      <td style={{ padding: '10px 12px' }}>${fmt(c.actual)}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: varColor(c.variance) }}>
                        {c.variance > 0 ? '+' : ''}{fmt(c.variance)}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          background: Math.abs(c.variance) < 0.01 ? '#f3f4f6' : c.variance > 0 ? '#fee2e2' : '#dcfce7',
                          color: Math.abs(c.variance) < 0.01 ? '#374151' : c.variance > 0 ? '#dc2626' : '#166534',
                          borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 600,
                        }}>
                          {Math.abs(c.variance) < 0.01 ? 'on budget' : c.variance > 0 ? 'over' : 'under'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: budget */}
      {modal?.type === 'budget' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={closeModal}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 20, fontWeight: 700 }}>{form.budget_id ? 'Edit' : 'New'} Crop Budget</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Crop Name *</label>
                <input style={inp2} value={form.crop_name || ''} onChange={e => f('crop_name', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Crop Year</label>
                <input style={inp2} type="number" value={form.crop_year || new Date().getFullYear()} onChange={e => f('crop_year', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Season</label>
                <input style={inp2} value={form.season || ''} onChange={e => f('season', e.target.value)} placeholder="Spring, Fall…" />
              </div>
              <div>
                <label style={lbl}>Field Name</label>
                <input style={inp2} value={form.field_name || ''} onChange={e => f('field_name', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Planted Acres</label>
                <input style={inp2} type="number" step="0.1" value={form.planted_acres || ''} onChange={e => f('planted_acres', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Expected Yield</label>
                <input style={inp2} type="number" step="0.1" value={form.expected_yield || ''} onChange={e => f('expected_yield', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Yield Unit</label>
                <input style={inp2} value={form.yield_unit || 'bu'} onChange={e => f('yield_unit', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Expected Price ($/unit)</label>
                <input style={inp2} type="number" step="0.01" value={form.expected_price || ''} onChange={e => f('expected_price', e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Status</label>
                <select style={inp2} value={form.status || 'draft'} onChange={e => f('status', e.target.value)}>
                  {['draft','active','complete'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Notes</label>
                <textarea style={{ ...inp2, height: 60 }} value={form.notes || ''} onChange={e => f('notes', e.target.value)} />
              </div>
            </div>
            <div style={modalBtns}>
              <button onClick={closeModal} style={btnStyle('#6b7280')}>Cancel</button>
              <button onClick={saveBudget} style={btnStyle('#16a34a')}>Save Budget</button>
            </div>
          </div>
        </div>
      )}
          <ThaiymeChat businessId={bid} page="crop-budgets" />
    </AccountLayout>
  );
}

const varColor = (v) => v == null ? '#374151' : v > 0 ? '#dc2626' : v < 0 ? '#16a34a' : '#374151';
const btnStyle = (bg) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' });
const selStyle = { border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 10px', fontSize: 14, background: '#fff' };
const inpStyle = { border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 10px', fontSize: 14, width: '100%', boxSizing: 'border-box' };
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '2px 4px' };
const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 3 };
const inp2 = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const modalBtns = { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 };
