import React, { useEffect, useState, useCallback, useRef } from 'react';
import ThaiymeChat from './ThaiymeChat';
import { useSearchParams, Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const hdrs = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` });

const I = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IcoPlus   = () => <I size={16}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>;
const IcoEdit   = () => <I size={15}><path d="M11 4H4a2 2 0 0 0-2 2v14h14v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></I>;
const IcoArrow  = () => <I size={15}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></I>;
const IcoWarn   = () => <I size={16}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></I>;
const IcoScan   = () => <I size={16}><rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/><rect x="3" y="16" width="5" height="5"/><line x1="21" y1="16" x2="21" y2="21"/><line x1="16" y1="21" x2="21" y2="21"/><line x1="10" y1="7" x2="14" y2="7"/><line x1="10" y1="10" x2="10" y2="14"/><line x1="14" y1="10" x2="14" y2="14"/><line x1="10" y1="14" x2="14" y2="14"/></I>;

const CATEGORIES = ['seed','fertilizer','pesticide','herbicide','fungicide','fuel','lubricant','irrigation','other'];

const fmt2 = (n) => n == null ? '—' : Number(n).toFixed(2);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

const TABS = ['Inventory', 'Transactions', 'Lots', 'Alerts'];

export default function FarmInputInventory() {
  const [params] = useSearchParams();
  const bid = params.get('BusinessID');
  const [tab, setTab]       = useState('Inventory');
  const [inputs, setInputs] = useState([]);
  const [txns, setTxns]     = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selInput, setSelInput] = useState(null);
  const [lots, setLots]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState({});
  const [catFilter, setCatFilter] = useState('');
  const [scanOpen, setScanOpen]   = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle | scanning | found | manual
  const [scanErr, setScanErr]     = useState('');
  const [manualCode, setManualCode] = useState('');
  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const rafRef    = useRef(null);

  const apiFetch = useCallback(async (path, opts) => {
    const r = await fetch(`${API}${path}`, { headers: hdrs(), ...opts });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  }, []);

  const load = useCallback(async () => {
    if (!bid) return;
    setLoading(true);
    try {
      const [inp, sum, alrt] = await Promise.all([
        apiFetch(`/api/farm-inputs/inputs?business_id=${bid}${catFilter ? '&category=' + catFilter : ''}`),
        apiFetch(`/api/farm-inputs/summary?business_id=${bid}`),
        apiFetch(`/api/farm-inputs/alerts?business_id=${bid}`),
      ]);
      setInputs(inp);
      setSummary(sum);
      setAlerts(alrt);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [bid, apiFetch, catFilter]);

  const loadTxns = useCallback(async () => {
    if (!bid) return;
    try {
      const d = await apiFetch(`/api/farm-inputs/transactions?business_id=${bid}&limit=60`);
      setTxns(d);
    } catch (e) { console.error(e); }
  }, [bid, apiFetch]);

  const loadLots = useCallback(async (inputId) => {
    if (!bid) return;
    try {
      const d = await apiFetch(`/api/farm-inputs/inputs/${inputId}/lots?business_id=${bid}`);
      setLots(d);
    } catch (e) { console.error(e); }
  }, [bid, apiFetch]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (tab === 'Transactions') loadTxns(); }, [tab, loadTxns]);

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const openModal = (type, data = {}) => { setModal({ type }); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  const saveInput = async () => {
    try {
      if (form.input_id) {
        await apiFetch(`/api/farm-inputs/inputs/${form.input_id}`, {
          method: 'PUT', body: JSON.stringify({ ...form, business_id: bid }),
        });
      } else {
        await apiFetch('/api/farm-inputs/inputs', {
          method: 'POST', body: JSON.stringify({ ...form, business_id: bid }),
        });
      }
      load();
      closeModal();
    } catch (e) { alert('Save failed'); }
  };

  const recordTxn = async () => {
    try {
      await apiFetch('/api/farm-inputs/transactions', {
        method: 'POST', body: JSON.stringify({ ...form, business_id: bid }),
      });
      load();
      loadTxns();
      closeModal();
    } catch (e) { alert('Transaction failed: ' + e.message); }
  };

  const addLot = async () => {
    try {
      await apiFetch(`/api/farm-inputs/inputs/${selInput}/lots`, {
        method: 'POST', body: JSON.stringify({ ...form, business_id: bid }),
      });
      loadLots(selInput);
      load();
      closeModal();
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const stopCamera = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  }, []);

  const resolveScan = useCallback(async (code) => {
    setScanStatus('found');
    stopCamera();
    try {
      const result = await apiFetch(`/api/farm-inputs/scan?barcode=${encodeURIComponent(code)}&business_id=${bid}`);
      setScanOpen(false);
      setScanStatus('idle');
      setManualCode('');
      // Pre-fill the receive transaction modal
      const prefill = {
        input_id: result.InputID || result.input_id,
        tx_type: 'receive',
        lot_number: result.lot?.LotNumber || result.LotNumber || code,
        unit_cost: result.lot?.UnitCost || result.CostPerUnit || '',
        supplier: result.lot?.Supplier || result.Supplier || '',
        quantity: result.lot?.Quantity || '',
      };
      openModal('txn', prefill);
    } catch (e) {
      setScanErr(`Not found: "${code}". Enter manually or try again.`);
      setScanStatus('manual');
    }
  }, [apiFetch, bid, stopCamera]);

  const startCamera = useCallback(async () => {
    setScanErr('');
    setScanStatus('scanning');
    if (!('BarcodeDetector' in window)) {
      setScanStatus('manual');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      const detector = new window.BarcodeDetector({ formats: ['qr_code','code_128','code_39','ean_13','ean_8','upc_a','upc_e','data_matrix','aztec'] });
      detectorRef.current = detector;
      const tick = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0) { await resolveScan(codes[0].rawValue); return; }
        } catch (_) {}
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      setScanErr('Camera access denied. Use manual entry below.');
      setScanStatus('manual');
    }
  }, [resolveScan]);

  const openScan = () => { setScanOpen(true); setScanStatus('idle'); setScanErr(''); setManualCode(''); };
  const closeScan = () => { stopCamera(); setScanOpen(false); setScanStatus('idle'); };

  return (
    <AccountLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Farm Inputs & Chemical Inventory</h1>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Track seeds, fertilizers, pesticides, and all farm inputs with FEFO lot management.</p>
            </div>
            <Link to={`/spray-applications?BusinessID=${searchParams.get('BusinessID')}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              🌿 Spray Log
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Inputs', val: summary.total_inputs, color: '#2563eb' },
              { label: 'Low Stock', val: summary.low_stock_count, color: '#d97706' },
              { label: 'Expiring (30d)', val: summary.expiring_soon, color: '#7c3aed' },
              { label: 'Expired', val: summary.expired_count, color: '#dc2626' },
              { label: 'Inventory Value', val: `$${Number(summary.total_inventory_value).toFixed(0)}`, color: '#16a34a' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e5e7eb', marginBottom: 24 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 16px', border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: tab === t ? '2px solid #16a34a' : '2px solid transparent',
              color: tab === t ? '#16a34a' : '#6b7280',
              fontWeight: tab === t ? 700 : 500, marginBottom: -2, fontSize: 14,
            }}>
              {t}
              {t === 'Alerts' && alerts.length > 0 && (
                <span style={{ marginLeft: 6, background: '#dc2626', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>
                  {alerts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── INVENTORY ── */}
        {tab === 'Inventory' && (
          <div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <select style={selStyle} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={openScan} style={btnStyle('#7c3aed')}>
                  <IcoScan /> Scan to Receive
                </button>
                <button onClick={() => openModal('txn')} style={btnStyle('#2563eb')}>
                  <IcoArrow /> Record Use / Receipt
                </button>
                <button onClick={() => openModal('input')} style={btnStyle('#16a34a')}>
                  <IcoPlus /> Add Input
                </button>
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['Name','Category','Stock','Unit','Alert Level','Cost/Unit','Expires','Supplier','EPA Reg',''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inputs.map(inp => {
                    const isLow = inp.min_stock_alert != null && inp.current_stock <= inp.min_stock_alert;
                    const isExp = inp.expiry_date && new Date(inp.expiry_date) <= new Date(Date.now() + 30 * 86400000);
                    return (
                      <tr key={inp.input_id} style={{ borderBottom: '1px solid #f3f4f6', background: isLow || isExp ? '#fffbeb' : undefined }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                          {(isLow || isExp) && <IcoWarn />} {inp.input_name}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{inp.category}</td>
                        <td style={{ padding: '10px 12px', fontWeight: isLow ? 700 : 400, color: isLow ? '#dc2626' : '#111827' }}>
                          {fmt2(inp.current_stock)}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{inp.unit}</td>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{fmt2(inp.min_stock_alert)}</td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{inp.cost_per_unit ? `$${fmt2(inp.cost_per_unit)}` : '—'}</td>
                        <td style={{ padding: '10px 12px', color: isExp ? '#dc2626' : '#374151', fontWeight: isExp ? 700 : 400 }}>
                          {fmtDate(inp.expiry_date)}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{inp.supplier || '—'}</td>
                        <td style={{ padding: '10px 12px', color: '#374151', fontSize: 12 }}>{inp.epa_reg_number || '—'}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => openModal('input', { ...inp })} style={iconBtn}><IcoEdit /></button>
                            <button onClick={() => { setSelInput(inp.input_id); loadLots(inp.input_id); setTab('Lots'); }} style={{ ...iconBtn, fontSize: 11, color: '#2563eb', fontWeight: 600 }}>Lots</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {inputs.length === 0 && (
                    <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>No inputs found. Add your first.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab === 'Transactions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
              <button onClick={() => openModal('txn')} style={btnStyle('#2563eb')}>
                <IcoArrow /> Record Transaction
              </button>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['Date','Input','Type','Qty','Unit','Cost','Field','Crop','Notes'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txns.map(t => (
                    <tr key={t.tx_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 12px' }}>{fmtDate(t.created_at)}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{t.input_name}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          background: t.tx_type === 'receive' ? '#dcfce7' : t.tx_type === 'use' ? '#fee2e2' : '#f3f4f6',
                          color: t.tx_type === 'receive' ? '#166534' : t.tx_type === 'use' ? '#dc2626' : '#374151',
                          borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 600,
                        }}>{t.tx_type}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>{fmt2(t.quantity)}</td>
                      <td style={{ padding: '10px 12px' }}>{t.unit}</td>
                      <td style={{ padding: '10px 12px' }}>{t.total_cost ? `$${fmt2(t.total_cost)}` : '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#6b7280' }}>{t.field_id || '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#6b7280' }}>{t.crop_name || '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#6b7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.notes || '—'}</td>
                    </tr>
                  ))}
                  {txns.length === 0 && (
                    <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>No transactions yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── LOTS ── */}
        {tab === 'Lots' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                {selInput ? (
                  <span style={{ fontSize: 14, color: '#374151' }}>
                    Lots for: <strong>{inputs.find(i => i.input_id === selInput)?.input_name}</strong>
                  </span>
                ) : (
                  <span style={{ color: '#6b7280', fontSize: 14 }}>Select an input from the Inventory tab to view its lots.</span>
                )}
              </div>
              {selInput && (
                <button onClick={() => openModal('lot', { input_id: selInput })} style={btnStyle('#16a34a')}>
                  <IcoPlus /> Add Lot
                </button>
              )}
            </div>
            {lots.length > 0 ? (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      {['Lot Number','Qty','Received','Expiry','Cost/Unit','Supplier','Status'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lots.map(l => (
                      <tr key={l.lot_id} style={{ borderBottom: '1px solid #f3f4f6', opacity: l.is_exhausted ? 0.5 : 1 }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{l.lot_number}</td>
                        <td style={{ padding: '10px 12px' }}>{fmt2(l.quantity)}</td>
                        <td style={{ padding: '10px 12px' }}>{fmtDate(l.received_date)}</td>
                        <td style={{ padding: '10px 12px', color: l.expiry_date && new Date(l.expiry_date) < new Date() ? '#dc2626' : '#374151' }}>
                          {fmtDate(l.expiry_date)}
                        </td>
                        <td style={{ padding: '10px 12px' }}>{l.unit_cost ? `$${fmt2(l.unit_cost)}` : '—'}</td>
                        <td style={{ padding: '10px 12px' }}>{l.supplier || '—'}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            background: l.is_exhausted ? '#f3f4f6' : '#dcfce7',
                            color: l.is_exhausted ? '#6b7280' : '#166534',
                            borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 600,
                          }}>
                            {l.is_exhausted ? 'exhausted' : 'available'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : selInput ? (
              <div style={{ color: '#6b7280', textAlign: 'center', padding: 32 }}>No lots for this input yet.</div>
            ) : null}
          </div>
        )}

        {/* ── ALERTS ── */}
        {tab === 'Alerts' && (
          <div>
            {alerts.length === 0 ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 32, textAlign: 'center', color: '#166534' }}>
                All clear — no low-stock or expiry alerts.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {alerts.map(a => (
                  <div key={a.input_id} style={{
                    background: '#fff', border: `1px solid ${a.alert_type === 'expired' ? '#fecaca' : '#fed7aa'}`,
                    borderRadius: 10, padding: '14px 18px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{a.input_name}</div>
                      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>
                        Category: {a.category} · Stock: {fmt2(a.current_stock)} {a.unit}
                        {a.min_stock_alert ? ` (min: ${fmt2(a.min_stock_alert)})` : ''}
                        {a.expiry_date ? ` · Expires: ${fmtDate(a.expiry_date)}` : ''}
                      </div>
                    </div>
                    <span style={{
                      background: a.alert_type === 'expired' ? '#fee2e2' : a.alert_type === 'expiring_soon' ? '#fef3c7' : '#ffedd5',
                      color: a.alert_type === 'expired' ? '#dc2626' : a.alert_type === 'expiring_soon' ? '#92400e' : '#c2410c',
                      borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700,
                    }}>
                      {a.alert_type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SCAN MODAL ── */}
      {scanOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={closeScan}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 420, maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>Scan Barcode / QR Code</h3>
              <button onClick={closeScan} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>

            {scanStatus === 'idle' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 18 }}>
                  Point your camera at a barcode or QR code on a farm input bag/container, or enter a lot number manually.
                </p>
                <button onClick={startCamera} style={{ ...btnStyle('#7c3aed'), width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15 }}>
                  <IcoScan /> Start Camera
                </button>
                <div style={{ margin: '14px 0', color: '#9ca3af', fontSize: 13 }}>— or —</div>
                <button onClick={() => setScanStatus('manual')} style={{ ...btnStyle('#6b7280'), width: '100%', justifyContent: 'center' }}>
                  Enter Barcode / Lot # Manually
                </button>
              </div>
            )}

            {scanStatus === 'scanning' && (
              <div>
                <video ref={videoRef} style={{ width: '100%', borderRadius: 10, background: '#000', aspectRatio: '4/3', objectFit: 'cover' }} muted playsInline />
                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 13, marginTop: 10 }}>Scanning… hold steady</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button onClick={() => setScanStatus('manual')} style={{ ...btnStyle('#6b7280'), flex: 1, justifyContent: 'center' }}>Manual Entry</button>
                  <button onClick={closeScan} style={{ ...btnStyle('#dc2626'), flex: 1, justifyContent: 'center' }}>Cancel</button>
                </div>
              </div>
            )}

            {scanStatus === 'found' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40 }}>✅</div>
                <p style={{ color: '#166534', fontWeight: 600, marginTop: 10 }}>Barcode detected — loading input…</p>
              </div>
            )}

            {scanStatus === 'manual' && (
              <div>
                {scanErr && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{scanErr}</div>}
                <label style={lbl}>Barcode / Lot Number</label>
                <input style={{ ...inp, fontSize: 16, padding: '10px 12px', marginBottom: 14 }}
                  autoFocus
                  placeholder="Scan or type barcode / lot number…"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && manualCode.trim()) resolveScan(manualCode.trim()); }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={closeScan} style={{ ...btnStyle('#6b7280'), flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button onClick={() => manualCode.trim() && resolveScan(manualCode.trim())}
                    disabled={!manualCode.trim()}
                    style={{ ...btnStyle('#7c3aed'), flex: 1, justifyContent: 'center', opacity: manualCode.trim() ? 1 : 0.5 }}>
                    Look Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={closeModal}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

            {/* Add / Edit Input */}
            {modal.type === 'input' && (
              <>
                <h3 style={{ marginBottom: 20, fontWeight: 700 }}>{form.input_id ? 'Edit' : 'Add'} Input</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={lbl}>Input Name *</label>
                    <input style={inp} value={form.input_name || ''} onChange={e => f('input_name', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Category</label>
                    <select style={inp} value={form.category || 'other'} onChange={e => f('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Unit</label>
                    <input style={inp} value={form.unit || ''} onChange={e => f('unit', e.target.value)} placeholder="lb, gal, bag…" />
                  </div>
                  <div>
                    <label style={lbl}>Current Stock</label>
                    <input style={inp} type="number" step="0.001" value={form.current_stock || ''} onChange={e => f('current_stock', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Low-Stock Alert Threshold</label>
                    <input style={inp} type="number" step="0.001" value={form.min_stock_alert || ''} onChange={e => f('min_stock_alert', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Cost per Unit ($)</label>
                    <input style={inp} type="number" step="0.01" value={form.cost_per_unit || ''} onChange={e => f('cost_per_unit', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Supplier</label>
                    <input style={inp} value={form.supplier || ''} onChange={e => f('supplier', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Storage Location</label>
                    <input style={inp} value={form.storage_location || ''} onChange={e => f('storage_location', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Expiry Date</label>
                    <input style={inp} type="date" value={form.expiry_date || ''} onChange={e => f('expiry_date', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Lot Number</label>
                    <input style={inp} value={form.lot_number || ''} onChange={e => f('lot_number', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>REI Hours</label>
                    <input style={inp} type="number" step="0.5" value={form.rei_hours || ''} onChange={e => f('rei_hours', e.target.value)} placeholder="Re-entry interval" />
                  </div>
                  <div>
                    <label style={lbl}>PHI Hours</label>
                    <input style={inp} type="number" step="0.5" value={form.phi_hours || ''} onChange={e => f('phi_hours', e.target.value)} placeholder="Pre-harvest interval" />
                  </div>
                  <div>
                    <label style={lbl}>Active Ingredient</label>
                    <input style={inp} value={form.active_ingredient || ''} onChange={e => f('active_ingredient', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>EPA Reg Number</label>
                    <input style={inp} value={form.epa_reg_number || ''} onChange={e => f('epa_reg_number', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Barcode / QR Code ID</label>
                    <input style={inp} value={form.barcode_id || ''} onChange={e => f('barcode_id', e.target.value)} placeholder="For scan-to-receive" />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={lbl}>Notes</label>
                    <textarea style={{ ...inp, height: 60 }} value={form.notes || ''} onChange={e => f('notes', e.target.value)} />
                  </div>
                </div>
                <div style={modalBtns}>
                  <button onClick={closeModal} style={btnStyle('#6b7280')}>Cancel</button>
                  <button onClick={saveInput} style={btnStyle('#16a34a')}>Save</button>
                </div>
              </>
            )}

            {/* Record Transaction */}
            {modal.type === 'txn' && (
              <>
                <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Record Transaction</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Input *</label>
                    <select style={inp} value={form.input_id || ''} onChange={e => f('input_id', e.target.value)}>
                      <option value="">Select…</option>
                      {inputs.map(i => <option key={i.input_id} value={i.input_id}>{i.input_name} ({fmt2(i.current_stock)} {i.unit})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Type</label>
                    <select style={inp} value={form.tx_type || 'use'} onChange={e => f('tx_type', e.target.value)}>
                      {['receive','use','adjust','dispose'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Quantity *</label>
                    <input style={inp} type="number" step="0.001" value={form.quantity || ''} onChange={e => f('quantity', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Unit Cost ($)</label>
                    <input style={inp} type="number" step="0.01" value={form.unit_cost || ''} onChange={e => f('unit_cost', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Application Date</label>
                    <input style={inp} type="date" value={form.application_date || ''} onChange={e => f('application_date', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Crop</label>
                    <input style={inp} value={form.crop_name || ''} onChange={e => f('crop_name', e.target.value)} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={lbl}>Notes</label>
                    <textarea style={{ ...inp, height: 60 }} value={form.notes || ''} onChange={e => f('notes', e.target.value)} />
                  </div>
                </div>
                <div style={modalBtns}>
                  <button onClick={closeModal} style={btnStyle('#6b7280')}>Cancel</button>
                  <button onClick={recordTxn} style={btnStyle('#2563eb')}>Record</button>
                </div>
              </>
            )}

            {/* Add Lot */}
            {modal.type === 'lot' && (
              <>
                <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Add Lot / Batch</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Lot Number *</label>
                    <input style={inp} value={form.lot_number || ''} onChange={e => f('lot_number', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Quantity *</label>
                    <input style={inp} type="number" step="0.001" value={form.quantity || ''} onChange={e => f('quantity', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Received Date</label>
                    <input style={inp} type="date" value={form.received_date || ''} onChange={e => f('received_date', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Expiry Date</label>
                    <input style={inp} type="date" value={form.expiry_date || ''} onChange={e => f('expiry_date', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Unit Cost ($)</label>
                    <input style={inp} type="number" step="0.01" value={form.unit_cost || ''} onChange={e => f('unit_cost', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Supplier</label>
                    <input style={inp} value={form.supplier || ''} onChange={e => f('supplier', e.target.value)} />
                  </div>
                </div>
                <div style={modalBtns}>
                  <button onClick={closeModal} style={btnStyle('#6b7280')}>Cancel</button>
                  <button onClick={addLot} style={btnStyle('#16a34a')}>Add Lot</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
          <ThaiymeChat businessId={bid} page="farm-inputs" />
    </AccountLayout>
  );
}

const btnStyle = (bg) => ({
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  borderRadius: 8, border: 'none', background: bg, color: '#fff',
  fontWeight: 600, fontSize: 13, cursor: 'pointer',
});
const selStyle = {
  border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 10px', fontSize: 14, background: '#fff',
};
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '2px 4px' };
const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 };
const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 10px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const modalBtns = { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 };
