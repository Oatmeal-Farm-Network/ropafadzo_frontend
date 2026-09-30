import React, { useEffect, useState, useCallback } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams, Link } from 'react-router-dom';
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
const IcoEye   = () => <I size={14}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></I>;
const IcoTrace = () => <I size={14}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></I>;
const IcoMove  = () => <I size={14}><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><line x1="2" y1="12" x2="22" y2="12"/><polyline points="15 19 12 22 9 19"/></I>;

const fmt = (n) => n == null ? '—' : Number(n).toFixed(2);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

const STATUS_COLORS = {
  in_storage: { bg: '#dbeafe', color: '#1d4ed8' },
  shipped:    { bg: '#dcfce7', color: '#166534' },
  quarantine: { bg: '#fef3c7', color: '#92400e' },
  disposed:   { bg: '#f3f4f6', color: '#6b7280' },
};

export default function HarvestLots() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const [lots, setLots]       = useState([]);
  const [summary, setSummary] = useState(null);
  const [detail, setDetail]   = useState(null);
  const [trace, setTrace]     = useState(null);
  const [view, setView]       = useState('list'); // list | detail | trace
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState({});
  const [filters, setFilters] = useState({ status: '', crop: '' });

  const load = useCallback(async () => {
    if (!bid) return;
    try {
      const [l, s] = await Promise.all([
        apiFetch(`/api/harvest-lots/lots?business_id=${bid}${filters.status ? '&status=' + filters.status : ''}${filters.crop ? '&crop_name=' + encodeURIComponent(filters.crop) : ''}`),
        apiFetch(`/api/harvest-lots/summary?business_id=${bid}`),
      ]);
      setLots(l);
      setSummary(s);
    } catch (e) { console.error(e); }
  }, [bid, filters]);

  const loadDetail = async (id) => {
    try {
      const d = await apiFetch(`/api/harvest-lots/lots/${id}?business_id=${bid}`);
      setDetail(d);
    } catch (e) { console.error(e); }
  };

  const loadTrace = async (id) => {
    try {
      const d = await apiFetch(`/api/harvest-lots/lots/${id}/trace?business_id=${bid}`);
      setTrace(d);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, [load]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const openModal = (type, data = {}) => { setModal({ type }); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  const saveLot = async () => {
    try {
      if (form.lot_id) {
        await apiFetch(`/api/harvest-lots/lots/${form.lot_id}`, { method: 'PUT', body: JSON.stringify({ ...form, business_id: bid }) });
      } else {
        await apiFetch('/api/harvest-lots/lots', { method: 'POST', body: JSON.stringify({ ...form, business_id: bid }) });
      }
      load();
      closeModal();
    } catch (e) { alert('Save failed'); }
  };

  const recordMovement = async () => {
    try {
      await apiFetch(`/api/harvest-lots/lots/${form.lot_id}/movements`, { method: 'POST', body: JSON.stringify({ ...form, business_id: bid }) });
      if (detail?.lot_id === form.lot_id) loadDetail(form.lot_id);
      load();
      closeModal();
    } catch (e) { alert('Failed'); }
  };

  const addQC = async () => {
    try {
      await apiFetch(`/api/harvest-lots/lots/${form.lot_id}/qc`, { method: 'POST', body: JSON.stringify({ ...form, business_id: bid }) });
      if (detail?.lot_id === form.lot_id) loadDetail(form.lot_id);
      closeModal();
    } catch (e) { alert('Failed'); }
  };

  const openDetailView = async (l) => {
    await loadDetail(l.lot_id);
    setView('detail');
  };

  const openTraceView = async (id) => {
    await loadTrace(id);
    setView('trace');
  };

  return (
    <AccountLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: 20 }}>
          {view !== 'list' && (
            <button onClick={() => { setView('list'); setDetail(null); setTrace(null); }} style={{ ...btn('#6b7280'), marginBottom: 8, fontSize: 12 }}>← Back</button>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
                {view === 'list' ? 'Harvest Lot Traceability' : view === 'trace' ? `Trace: ${trace?.lot?.lot_number}` : `Lot: ${detail?.lot_number}`}
              </h1>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Track harvest lots from field to shipment with full input & QC traceability.</p>
            </div>
            <Link to={`/perishable-trace?BusinessID=${bid}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f5f3ff', border: '1.5px solid #c4b5fd', borderRadius: 8, padding: '7px 14px', textDecoration: 'none', color: '#7c3aed', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="0.5"/><rect x="14" y="3" width="7" height="7" rx="0.5"/><rect x="3" y="14" width="7" height="7" rx="0.5"/>
                <path d="M17 14v3.5h3.5"/><line x1="14" y1="17.5" x2="17" y2="17.5"/>
              </svg>
              Perishable Trace
            </Link>
            <Link to={`/harvest-bins?BusinessID=${bid}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 8, padding: '7px 14px', textDecoration: 'none', color: '#9a3412', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="8" width="12" height="8" rx="1"/><path d="M5 8V5l3-3 3 3v3"/>
              </svg>
              Bin Traceability
            </Link>
          </div>
        </div>

        {/* Summary */}
        {view === 'list' && summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Lots', val: summary.total_lots, color: '#2563eb' },
              { label: 'In Storage', val: summary.in_storage, color: '#16a34a' },
              { label: 'Shipped', val: summary.shipped, color: '#6b7280' },
              { label: 'Expiring 30d', val: summary.expiring_soon, color: '#d97706' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST ── */}
        {view === 'list' && (
          <>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <select style={sel} value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}>
                  <option value="">All Status</option>
                  {['in_storage','shipped','quarantine','disposed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input style={sel} value={filters.crop} onChange={e => setFilters(p => ({ ...p, crop: e.target.value }))} placeholder="Search crop…" />
              </div>
              <button onClick={() => openModal('lot')} style={btn('#16a34a')}>
                <IcoPlus /> New Lot
              </button>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['Lot #','Crop','Variety','Harvest','Qty','Grade','Location','Expiry','Status',''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lots.map(l => {
                    const sc = STATUS_COLORS[l.status] || STATUS_COLORS.in_storage;
                    return (
                      <tr key={l.lot_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#2563eb', cursor: 'pointer' }} onClick={() => openDetailView(l)}>{l.lot_number}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{l.crop_name}</td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{l.variety || '—'}</td>
                        <td style={{ padding: '10px 12px' }}>{fmtDate(l.harvest_date)}</td>
                        <td style={{ padding: '10px 12px' }}>{fmt(l.quantity)} {l.unit}</td>
                        <td style={{ padding: '10px 12px' }}>{l.grade_quality || '—'}</td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{l.storage_location || '—'}</td>
                        <td style={{ padding: '10px 12px', color: l.expiry_date && new Date(l.expiry_date) < new Date() ? '#dc2626' : '#374151' }}>
                          {fmtDate(l.expiry_date)}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ ...sc, borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{l.status}</span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => openDetailView(l)} style={iBtn} title="Detail"><IcoEye /></button>
                            <button onClick={() => openTraceView(l.lot_id)} style={iBtn} title="Trace Report"><IcoTrace /></button>
                            <button onClick={() => openModal('movement', { lot_id: l.lot_id })} style={iBtn} title="Record Movement"><IcoMove /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {lots.length === 0 && (
                    <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>No harvest lots. Create your first.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── DETAIL ── */}
        {view === 'detail' && detail && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button onClick={() => openModal('movement', { lot_id: detail.lot_id })} style={btn('#2563eb')}><IcoMove /> Record Movement</button>
              <button onClick={() => openModal('qc', { lot_id: detail.lot_id })} style={btn('#7c3aed')}>QC Inspection</button>
              <button onClick={() => openTraceView(detail.lot_id)} style={btn('#d97706')}><IcoTrace /> Full Trace</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Lot Details</div>
                {[
                  ['Lot Number', detail.lot_number],
                  ['Crop', detail.crop_name],
                  ['Variety', detail.variety || '—'],
                  ['Harvest Date', fmtDate(detail.harvest_date)],
                  ['Quantity', `${fmt(detail.quantity)} ${detail.unit}`],
                  ['Grade', detail.grade_quality || '—'],
                  ['Storage', detail.storage_location || '—'],
                  ['Condition', detail.storage_condition || '—'],
                  ['Expiry', fmtDate(detail.expiry_date)],
                  ['Certification', detail.certification_status || '—'],
                  ['Moisture', detail.moisture_content != null ? `${detail.moisture_content}%` : '—'],
                  ['Test Weight', detail.test_weight || '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>
                    <span style={{ color: '#6b7280' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                {/* Inputs Applied */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Inputs Applied ({detail.inputs?.length || 0})</div>
                  {(detail.inputs || []).map(i => (
                    <div key={i.link_id} style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <strong>{i.input_name}</strong> · {i.input_category} · {fmt(i.quantity)} {i.unit} · {fmtDate(i.application_date)}
                      {i.pre_harvest_interval ? ` · PHI: ${i.pre_harvest_interval}h` : ''}
                    </div>
                  ))}
                  {(!detail.inputs || detail.inputs.length === 0) && <div style={{ color: '#9ca3af', fontSize: 13 }}>None recorded</div>}
                </div>

                {/* QC */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>QC Inspections</div>
                  {(detail.qc_records || []).map(q => (
                    <div key={q.qc_id} style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{fmtDate(q.inspection_date)} · {q.inspected_by || 'Unknown'}</span>
                      <span style={{ fontWeight: 700, color: q.result === 'pass' ? '#16a34a' : '#dc2626' }}>{q.result} {q.grade ? `· Grade: ${q.grade}` : ''}</span>
                    </div>
                  ))}
                  {(!detail.qc_records || detail.qc_records.length === 0) && <div style={{ color: '#9ca3af', fontSize: 13 }}>No inspections</div>}
                </div>
              </div>
            </div>

            {/* Movements */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Movement History</div>
              {(detail.movements || []).map(m => (
                <div key={m.movement_id} style={{ fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>{m.movement_type}</strong> · {fmt(m.quantity)} units · {fmtDate(m.movement_date)}</span>
                  <span style={{ color: '#6b7280' }}>{m.from_location || ''}{m.from_location && m.to_location ? ' → ' : ''}{m.to_location || ''}{m.recipient ? ` · To: ${m.recipient}` : ''}</span>
                </div>
              ))}
              {(!detail.movements || detail.movements.length === 0) && <div style={{ color: '#9ca3af', fontSize: 13 }}>No movements</div>}
            </div>
          </div>
        )}

        {/* ── TRACE ── */}
        {view === 'trace' && trace && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              {[
                { label: 'Inputs Applied', val: trace.trace_summary?.total_inputs },
                { label: 'Movements', val: trace.trace_summary?.total_movements },
                { label: 'QC Pass', val: trace.trace_summary?.qc_pass },
                { label: 'QC Fail', val: trace.trace_summary?.qc_fail },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{val ?? 0}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
                </div>
              ))}
            </div>
            {[
              { title: 'Inputs Applied', rows: trace.inputs_applied, cols: ['Input', 'Category', 'Qty', 'App. Date', 'PHI'], render: i => [i.input_name, i.input_category, `${fmt(i.quantity)} ${i.unit}`, fmtDate(i.application_date), i.pre_harvest_interval ? `${i.pre_harvest_interval}h` : '—'] },
              { title: 'Movement Chain', rows: trace.movements, cols: ['Type','Qty','Date','From','To','Recipient'], render: m => [m.movement_type, fmt(m.quantity), fmtDate(m.movement_date), m.from_location || '—', m.to_location || '—', m.recipient || '—'] },
              { title: 'QC Inspections', rows: trace.qc_inspections, cols: ['Date','Inspector','Result','Grade','Notes'], render: q => [fmtDate(q.inspection_date), q.inspected_by || '—', q.result, q.grade || '—', q.notes || '—'] },
            ].map(({ title, rows, cols, render }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '12px 18px', borderBottom: '1px solid #e5e7eb', fontWeight: 700 }}>{title}</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      {cols.map(c => <th key={c} style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {(rows || []).map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        {render(r).map((v, j) => <td key={j} style={{ padding: '8px 12px' }}>{v}</td>)}
                      </tr>
                    ))}
                    {(!rows || rows.length === 0) && (
                      <tr><td colSpan={cols.length} style={{ padding: 16, textAlign: 'center', color: '#9ca3af' }}>None</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={closeModal}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            {modal.type === 'lot' && (
              <>
                <h3 style={{ marginBottom: 20, fontWeight: 700 }}>New Harvest Lot</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={lbl}>Crop Name *</label><input style={inpS} value={form.crop_name || ''} onChange={e => f('crop_name', e.target.value)} /></div>
                  <div><label style={lbl}>Variety</label><input style={inpS} value={form.variety || ''} onChange={e => f('variety', e.target.value)} /></div>
                  <div><label style={lbl}>Harvest Date *</label><input style={inpS} type="date" value={form.harvest_date || ''} onChange={e => f('harvest_date', e.target.value)} /></div>
                  <div><label style={lbl}>Quantity *</label><input style={inpS} type="number" step="0.001" value={form.quantity || ''} onChange={e => f('quantity', e.target.value)} /></div>
                  <div><label style={lbl}>Unit</label><input style={inpS} value={form.unit || 'lb'} onChange={e => f('unit', e.target.value)} /></div>
                  <div><label style={lbl}>Grade / Quality</label><input style={inpS} value={form.grade_quality || ''} onChange={e => f('grade_quality', e.target.value)} /></div>
                  <div><label style={lbl}>Storage Location</label><input style={inpS} value={form.storage_location || ''} onChange={e => f('storage_location', e.target.value)} /></div>
                  <div><label style={lbl}>Expiry Date</label><input style={inpS} type="date" value={form.expiry_date || ''} onChange={e => f('expiry_date', e.target.value)} /></div>
                  <div><label style={lbl}>Cert. Status</label><input style={inpS} value={form.certification_status || ''} onChange={e => f('certification_status', e.target.value)} placeholder="organic, conventional…" /></div>
                  <div><label style={lbl}>Lot Number (auto if blank)</label><input style={inpS} value={form.lot_number || ''} onChange={e => f('lot_number', e.target.value)} /></div>
                  <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Notes</label><textarea style={{ ...inpS, height: 60 }} value={form.notes || ''} onChange={e => f('notes', e.target.value)} /></div>
                </div>
                <div style={mBtns}><button onClick={closeModal} style={btn('#6b7280')}>Cancel</button><button onClick={saveLot} style={btn('#16a34a')}>Create Lot</button></div>
              </>
            )}
            {modal.type === 'movement' && (
              <>
                <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Record Movement</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={lbl}>Type</label><select style={inpS} value={form.movement_type || 'transfer'} onChange={e => f('movement_type', e.target.value)}>{['transfer','ship','process','sample','dispose'].map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                  <div><label style={lbl}>Quantity</label><input style={inpS} type="number" step="0.001" value={form.quantity || ''} onChange={e => f('quantity', e.target.value)} /></div>
                  <div><label style={lbl}>From Location</label><input style={inpS} value={form.from_location || ''} onChange={e => f('from_location', e.target.value)} /></div>
                  <div><label style={lbl}>To Location</label><input style={inpS} value={form.to_location || ''} onChange={e => f('to_location', e.target.value)} /></div>
                  <div><label style={lbl}>Recipient</label><input style={inpS} value={form.recipient || ''} onChange={e => f('recipient', e.target.value)} /></div>
                  <div><label style={lbl}>Movement Date</label><input style={inpS} type="date" value={form.movement_date || ''} onChange={e => f('movement_date', e.target.value)} /></div>
                  <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Notes</label><textarea style={{ ...inpS, height: 50 }} value={form.notes || ''} onChange={e => f('notes', e.target.value)} /></div>
                </div>
                <div style={mBtns}><button onClick={closeModal} style={btn('#6b7280')}>Cancel</button><button onClick={recordMovement} style={btn('#2563eb')}>Record</button></div>
              </>
            )}
            {modal.type === 'qc' && (
              <>
                <h3 style={{ marginBottom: 20, fontWeight: 700 }}>QC Inspection</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={lbl}>Inspector</label><input style={inpS} value={form.inspected_by || ''} onChange={e => f('inspected_by', e.target.value)} /></div>
                  <div><label style={lbl}>Inspection Date</label><input style={inpS} type="date" value={form.inspection_date || ''} onChange={e => f('inspection_date', e.target.value)} /></div>
                  <div><label style={lbl}>Result</label><select style={inpS} value={form.result || 'pass'} onChange={e => f('result', e.target.value)}><option value="pass">Pass</option><option value="fail">Fail</option><option value="conditional">Conditional</option></select></div>
                  <div><label style={lbl}>Grade Assigned</label><input style={inpS} value={form.grade || ''} onChange={e => f('grade', e.target.value)} /></div>
                  <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Notes</label><textarea style={{ ...inpS, height: 60 }} value={form.notes || ''} onChange={e => f('notes', e.target.value)} /></div>
                </div>
                <div style={mBtns}><button onClick={closeModal} style={btn('#6b7280')}>Cancel</button><button onClick={addQC} style={btn('#7c3aed')}>Save Inspection</button></div>
              </>
            )}
          </div>
        </div>
      )}
          <ThaiymeChat businessId={bid} page="harvest-lots" />
    </AccountLayout>
  );
}

const btn = (bg) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' });
const sel = { border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 10px', fontSize: 14, background: '#fff' };
const iBtn = { background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '2px 4px' };
const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 3 };
const inpS = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const mBtns = { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 };
