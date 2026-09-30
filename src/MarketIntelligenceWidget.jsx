// src/MarketIntelligenceWidget.jsx
// Proactive market intelligence panel for the Saige page.
// Shows live USDA cash prices, CME futures links, market news headlines,
// and lets logged-in farmers set commodity price threshold alerts.
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const SAIGE_API = (import.meta.env.VITE_SAIGE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000/saige').replace(/\/+$/, '');
const GREEN = '#3D6B34';
const GREEN_DARK = '#2c4f25';
const GREEN_LIGHT = '#f0f7ee';
const GREEN_BORDER = '#c7dfc2';

// USDA AMS reports that return live cash prices (no API key required)
const AMS_COMMODITIES = [
  {
    key: 'chicken_breast',
    label: 'Nat\'l Chicken Breast',
    report: 'LM_PY0305',
    unit: 'cwt',
    itemMatch: 'Boneless Skinless',
  },
  {
    key: 'pork_loin',
    label: 'Nat\'l Pork Loin',
    report: 'LM_PK602',
    unit: 'cwt',
    itemMatch: 'Pork Loin',
  },
];

// Produce commodities fetched server-side from USDA F&V Market News; displayed from price history
const PRODUCE_COMMODITY_LABELS = [
  { label: 'Strawberries',  unit: 'flat' },
  { label: 'Blueberries',   unit: 'flat' },
  { label: 'Microgreens',   unit: 'lb'   },
  { label: 'Mixed Greens',  unit: 'lb'   },
  { label: 'Roma Tomatoes', unit: 'lb'   },
];

// CME/ICE futures — no free machine-readable API; link out
const CME_COMMODITIES = [
  { key: 'corn',       label: 'Corn',         symbol: 'ZC', unit: 'bu',  url: 'https://www.cmegroup.com/markets/agriculture/grains/corn.html' },
  { key: 'soybeans',   label: 'Soybeans',     symbol: 'ZS', unit: 'bu',  url: 'https://www.cmegroup.com/markets/agriculture/oilseeds/soybean.html' },
  { key: 'live_cattle',label: 'Live Cattle',  symbol: 'LE', unit: 'cwt', url: 'https://www.cmegroup.com/markets/agriculture/livestock/live-cattle.html' },
  { key: 'lean_hogs',  label: 'Lean Hogs',    symbol: 'HE', unit: 'cwt', url: 'https://www.cmegroup.com/markets/agriculture/livestock/lean-hogs.html' },
];

function TrendArrow({ current, prev }) {
  if (current == null || prev == null) return null;
  const diff = current - prev;
  if (Math.abs(diff) < 0.001) return <span className="text-xs text-gray-400 ml-1">—</span>;
  return diff > 0
    ? <span className="text-xs font-bold ml-1" style={{ color: '#16a34a' }}>▲</span>
    : <span className="text-xs font-bold ml-1" style={{ color: '#dc2626' }}>▼</span>;
}

function BellIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function ChevronDown({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
         style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function Sparkline({ points, width = 80, height = 28 }) {
  if (!points || points.length < 2) return null;
  const prices = points.map(p => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const n = prices.length;
  const xs = prices.map((_, i) => (i / (n - 1)) * width);
  const ys = prices.map(p => height - ((p - min) / range) * (height - 2) - 1);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const rising = prices[prices.length - 1] >= prices[0];
  const color = rising ? '#16a34a' : '#ef4444';
  return (
    <svg width={width} height={height} style={{ display: 'block', marginTop: 4 }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function MarketIntelligenceWidget() {
  const { account } = useAccount();
  const isLoggedIn = !!account?.PeopleID;

  const [collapsed, setCollapsed]     = useState(false);
  const [amsData, setAmsData]         = useState({});   // key → price
  const [priceHistory, setPriceHistory] = useState({}); // label → { points, pct_change, trend }
  const [loadingAms, setLoadingAms]   = useState(true);
  const [news, setNews]               = useState([]);
  const [alerts, setAlerts]           = useState([]);   // user's saved alerts
  const [alertModal, setAlertModal]   = useState(null); // { commodity, unit } | null
  const [alertForm, setAlertForm]     = useState({ direction: 'above', threshold: '' });
  const [savingAlert, setSavingAlert] = useState(false);
  const [alertError, setAlertError]   = useState('');

  // ── Fetch USDA AMS prices ──────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    Promise.allSettled(
      AMS_COMMODITIES.map(c =>
        fetch(`${SAIGE_API}/market/usda/ams/${c.report}`, { signal: controller.signal })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            const results = Array.isArray(data?.results) ? data.results : [];
            if (!results.length) return { key: c.key, price: null };
            const row = results.find(r =>
              r.label?.toLowerCase().includes(c.itemMatch.toLowerCase())
            ) || results[0];
            const price = parseFloat(row?.price ?? row?.avg_price ?? null);
            return { key: c.key, price: isNaN(price) ? null : price };
          })
          .catch(() => ({ key: c.key, price: null }))
      )
    ).then(results => {
      const map = {};
      results.forEach(r => { if (r.value) map[r.value.key] = r.value.price; });
      setAmsData(map);
      setLoadingAms(false);
    });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  // ── Fetch 30-day price history for sparklines ─────────────────────────────
  useEffect(() => {
    if (loadingAms) return;
    fetch(`${API}/api/commodity-prices/history?days=30`)
      .then(r => r.ok ? r.json() : {})
      .then(d => setPriceHistory(typeof d === 'object' ? d : {}))
      .catch(() => {});
  }, [loadingAms]);

  // ── Fetch market news ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/news?category=market&limit=4`)
      .then(r => r.ok ? r.json() : [])
      .then(d => setNews(Array.isArray(d) ? d.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  // ── Fetch user alerts ──────────────────────────────────────────────────────
  const fetchAlerts = useCallback(() => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem('access_token');
    fetch(`${API}/api/market-alerts`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : [])
      .then(d => setAlerts(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  // ── Check alerts against live prices ──────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || loadingAms || !alerts.length) return;
    const prices = AMS_COMMODITIES
      .filter(c => amsData[c.key] != null)
      .map(c => ({ commodity: c.label, price: amsData[c.key] }));
    if (!prices.length) return;
    const token = localStorage.getItem('access_token');
    fetch(`${API}/api/market-alerts/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ prices }),
    }).catch(() => {});
  }, [isLoggedIn, loadingAms, amsData, alerts.length]);

  // ── Alert CRUD ─────────────────────────────────────────────────────────────
  function openAlertModal(commodity, unit) {
    setAlertModal({ commodity, unit });
    setAlertForm({ direction: 'above', threshold: '' });
    setAlertError('');
  }

  async function saveAlert() {
    const thresh = parseFloat(alertForm.threshold);
    if (!thresh || thresh <= 0) { setAlertError('Enter a valid price.'); return; }
    setSavingAlert(true);
    setAlertError('');
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API}/api/market-alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          commodity: alertModal.commodity,
          direction: alertForm.direction,
          threshold_price: thresh,
          unit: alertModal.unit,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAlertError(err.detail || 'Failed to save alert.');
        return;
      }
      setAlertModal(null);
      fetchAlerts();
    } catch {
      setAlertError('Network error. Try again.');
    } finally {
      setSavingAlert(false);
    }
  }

  async function deleteAlert(alertId) {
    const token = localStorage.getItem('access_token');
    await fetch(`${API}/api/market-alerts/${alertId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => {});
    fetchAlerts();
  }

  function alertsFor(commodityLabel) {
    return alerts.filter(a => a.Commodity === commodityLabel);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${GREEN_BORDER}`,
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 12,
      fontFamily: 'Montserrat, system-ui, sans-serif',
    }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', background: GREEN_LIGHT,
          border: 'none', borderBottom: `1px solid ${GREEN_BORDER}`, cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN}
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: GREEN_DARK, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Market Intelligence
          </span>
        </div>
        <div style={{ color: GREEN, display: 'flex', alignItems: 'center' }}>
          <ChevronDown open={!collapsed} />
        </div>
      </button>

      {!collapsed && (
        <div style={{ padding: '14px 16px' }}>

          {/* Live USDA prices */}
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, marginTop: 0 }}>
            Live USDA cash prices
            {!loadingAms && <span style={{ marginLeft: 6, color: '#9ca3af' }}>· updated just now</span>}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {AMS_COMMODITIES.map(c => {
              const price = amsData[c.key];
              const myAlerts = alertsFor(c.label);
              const hasAlert = myAlerts.length > 0;
              return (
                <div key={c.key} style={{
                  background: GREEN_LIGHT, borderRadius: 10, padding: '10px 12px',
                  border: `1px solid ${GREEN_BORDER}`, position: 'relative',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                    {loadingAms
                      ? <span style={{ fontSize: 12, color: '#9ca3af' }}>Loading…</span>
                      : price != null
                        ? `$${price.toFixed(2)}`
                        : <span style={{ fontSize: 12, color: '#9ca3af' }}>Unavailable</span>}
                    {price != null && <span style={{ fontSize: 11, fontWeight: 400, color: '#6b7280', marginLeft: 3 }}>/ {c.unit}</span>}
                  </div>
                  {isLoggedIn && (
                    <button
                      onClick={() => openAlertModal(c.label, c.unit)}
                      title={hasAlert ? `${myAlerts.length} alert(s) set` : 'Set price alert'}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        background: hasAlert ? GREEN : 'transparent',
                        color: hasAlert ? '#fff' : GREEN,
                        border: `1px solid ${hasAlert ? GREEN : GREEN_BORDER}`,
                        borderRadius: 6, padding: '2px 5px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 3, fontSize: 10,
                      }}
                    >
                      <BellIcon active={hasAlert} />
                      {hasAlert && <span>{myAlerts.length}</span>}
                    </button>
                  )}
                  {/* Price sparkline */}
                  {(() => {
                    const hist = priceHistory[c.label];
                    if (!hist || !hist.points?.length) return null;
                    const pct = hist.pct_change;
                    return (
                      <div style={{ marginTop: 4 }}>
                        <Sparkline points={hist.points} width={80} height={24} />
                        {pct != null && (
                          <span style={{ fontSize: 9, color: pct >= 0 ? '#16a34a' : '#ef4444', fontWeight: 600 }}>
                            {pct >= 0 ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}% 30d
                          </span>
                        )}
                      </div>
                    );
                  })()}
                  {/* Active alerts summary */}
                  {hasAlert && (
                    <div style={{ marginTop: 4 }}>
                      {myAlerts.map(a => (
                        <div key={a.AlertID} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: GREEN_DARK }}>
                          <span>{a.Direction === 'above' ? '▲' : '▼'} ${parseFloat(a.ThresholdPrice).toFixed(2)}</span>
                          <button onClick={() => deleteAlert(a.AlertID)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 10, padding: 0 }}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Produce & specialty crop prices from USDA F&V (server-fetched) */}
          {PRODUCE_COMMODITY_LABELS.some(c => priceHistory[c.label]?.latest) && (
            <>
              <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Live USDA produce prices</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {PRODUCE_COMMODITY_LABELS.map(c => {
                  const hist = priceHistory[c.label];
                  if (!hist?.latest) return null;
                  const myAlerts = alertsFor(c.label);
                  const hasAlert = myAlerts.length > 0;
                  return (
                    <div key={c.label} style={{
                      background: GREEN_LIGHT, borderRadius: 10, padding: '10px 12px',
                      border: `1px solid ${GREEN_BORDER}`, position: 'relative',
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                        {c.label}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                        ${hist.latest.toFixed(2)}
                        <span style={{ fontSize: 11, fontWeight: 400, color: '#6b7280', marginLeft: 3 }}>/ {c.unit}</span>
                      </div>
                      {isLoggedIn && (
                        <button
                          onClick={() => openAlertModal(c.label, c.unit)}
                          title={hasAlert ? `${myAlerts.length} alert(s) set` : 'Set price alert'}
                          style={{
                            position: 'absolute', top: 8, right: 8,
                            background: hasAlert ? GREEN : 'transparent',
                            color: hasAlert ? '#fff' : GREEN,
                            border: `1px solid ${hasAlert ? GREEN : GREEN_BORDER}`,
                            borderRadius: 6, padding: '2px 5px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 3, fontSize: 10,
                          }}
                        >
                          <BellIcon active={hasAlert} />
                          {hasAlert && <span>{myAlerts.length}</span>}
                        </button>
                      )}
                      <div style={{ marginTop: 4 }}>
                        <Sparkline points={hist.points} width={80} height={24} />
                        {hist.pct_change != null && (
                          <span style={{ fontSize: 9, color: hist.pct_change >= 0 ? '#16a34a' : '#ef4444', fontWeight: 600 }}>
                            {hist.pct_change >= 0 ? '▲' : '▼'} {Math.abs(hist.pct_change).toFixed(1)}% 30d
                          </span>
                        )}
                      </div>
                      {hasAlert && (
                        <div style={{ marginTop: 4 }}>
                          {myAlerts.map(a => (
                            <div key={a.AlertID} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: GREEN_DARK }}>
                              <span>{a.Direction === 'above' ? '▲' : '▼'} ${parseFloat(a.ThresholdPrice).toFixed(2)}</span>
                              <button onClick={() => deleteAlert(a.AlertID)}
                                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 10, padding: 0 }}>
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* CME futures links */}
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Futures quotes (CME / ICE)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {CME_COMMODITIES.map(c => (
              <a key={c.key} href={c.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'block', background: '#fafafa', borderRadius: 10,
                  padding: '10px 12px', border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                      {c.symbol} · {c.label}
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>per {c.unit}</div>
                  </div>
                  <span style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>View ↗</span>
                </div>
              </a>
            ))}
          </div>

          {/* Market news */}
          {news.length > 0 && (
            <>
              <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Market news</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {news.map(article => (
                  <a key={article.id} href={article.url || '#'} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', display: 'block', padding: '8px 10px',
                      background: '#fafafa', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
                      {article.title}
                    </div>
                    {article.source && (
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>{article.source}</div>
                    )}
                  </a>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/commodity-prices"
              style={{ fontSize: 11, color: GREEN, fontWeight: 600, textDecoration: 'none' }}>
              Full price report →
            </Link>
            <Link to="/app/news"
              style={{ fontSize: 11, color: '#6b7280', textDecoration: 'none' }}>
              All market news →
            </Link>
          </div>
        </div>
      )}

      {/* Alert modal */}
      {alertModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: 24, width: 320,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            fontFamily: 'Montserrat, system-ui, sans-serif',
          }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#111827' }}>
              Price Alert
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#6b7280' }}>
              {alertModal.commodity}
            </p>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Alert me when price goes
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {['above', 'below'].map(d => (
                <button key={d} onClick={() => setAlertForm(f => ({ ...f, direction: d }))}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: `2px solid`,
                    borderColor: alertForm.direction === d ? GREEN : '#e5e7eb',
                    background: alertForm.direction === d ? GREEN_LIGHT : '#fff',
                    color: alertForm.direction === d ? GREEN_DARK : '#6b7280',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}>
                  {d === 'above' ? '▲ Above' : '▼ Below'}
                </button>
              ))}
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Threshold price (per {alertModal.unit})
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
              <span style={{ padding: '9px 10px', background: '#f9fafb', color: '#6b7280', fontSize: 13, borderRight: '1px solid #d1d5db' }}>$</span>
              <input
                type="number" min="0" step="0.01"
                placeholder="0.00"
                value={alertForm.threshold}
                onChange={e => setAlertForm(f => ({ ...f, threshold: e.target.value }))}
                style={{ flex: 1, padding: '9px 12px', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit' }}
              />
            </div>

            {alertError && (
              <p style={{ fontSize: 12, color: '#dc2626', marginBottom: 12, marginTop: -8 }}>{alertError}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setAlertModal(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={saveAlert} disabled={savingAlert}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: savingAlert ? 0.7 : 1 }}>
                {savingAlert ? 'Saving…' : 'Save Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
