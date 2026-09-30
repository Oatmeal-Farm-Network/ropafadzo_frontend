// src/FieldHealthWidget.jsx
// Proactive satellite field-health monitoring panel for the Saige page.
// Shows all CropMonitor fields with current NDVI and lets users set threshold alerts.
// Calls /check on load to fire AppNotifications when NDVI newly drops below threshold.
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const GREEN      = '#3D6B34';
const GREEN_DARK = '#2c4f25';
const GREEN_LIGHT = '#f0f7ee';
const GREEN_BORDER = '#c7dfc2';

function ndviColor(v) {
  if (v == null) return '#9ca3af';
  if (v >= 0.7) return '#16a34a';
  if (v >= 0.5) return '#4ade80';
  if (v >= 0.3) return '#f59e0b';
  if (v >= 0.1) return '#ef4444';
  return '#991b1b';
}

function ndviLabel(v) {
  if (v == null) return 'No data';
  if (v >= 0.7) return 'Very Healthy';
  if (v >= 0.5) return 'Healthy';
  if (v >= 0.3) return 'Stressed';
  if (v >= 0.1) return 'High Stress';
  return 'Severe';
}

function NDVIBar({ value }) {
  const pct = value != null ? Math.min(100, Math.max(0, value * 100)) : 0;
  return (
    <div style={{ height: 4, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: ndviColor(value), borderRadius: 4, transition: 'width 0.4s' }} />
    </div>
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

function AlertBell({ active }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

export default function FieldHealthWidget() {
  const { account } = useAccount();
  const isLoggedIn = !!account?.PeopleID;

  const [collapsed, setCollapsed]       = useState(false);
  const [fields, setFields]             = useState([]);
  const [alerts, setAlerts]             = useState([]);
  const [loading, setLoading]           = useState(false);
  const [alertModal, setAlertModal]     = useState(null); // { field_id, name, crop_type, ndvi }
  const [alertThreshold, setAlertThreshold] = useState('');
  const [alertError, setAlertError]     = useState('');
  const [saving, setSaving]             = useState(false);

  const token = () => localStorage.getItem('access_token');
  const authH = () => ({ Authorization: `Bearer ${token()}` });

  const fetchFields = useCallback(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    fetch(`${API}/api/field-health-alerts/fields`, { headers: authH() })
      .then(r => r.ok ? r.json() : [])
      .then(d => setFields(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const fetchAlerts = useCallback(() => {
    if (!isLoggedIn) return;
    fetch(`${API}/api/field-health-alerts`, { headers: authH() })
      .then(r => r.ok ? r.json() : [])
      .then(d => setAlerts(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    fetchFields();
    fetchAlerts();
  }, [fetchFields, fetchAlerts]);

  // Proactive check — fires AppNotifications if thresholds are crossed
  useEffect(() => {
    if (!isLoggedIn || !alerts.length) return;
    fetch(`${API}/api/field-health-alerts/check`, {
      method: 'POST',
      headers: authH(),
    }).catch(() => {});
  }, [isLoggedIn, alerts.length]);

  function alertForField(fieldId) {
    return alerts.find(a => a.FieldID === fieldId || a.FieldID === String(fieldId));
  }

  function openModal(field) {
    const existing = alertForField(field.field_id);
    setAlertModal(field);
    setAlertThreshold(existing ? String(existing.NDVIThreshold) : '');
    setAlertError('');
  }

  async function saveAlert() {
    const t = parseFloat(alertThreshold);
    if (isNaN(t) || t < 0 || t > 1) {
      setAlertError('NDVI threshold must be between 0.00 and 1.00');
      return;
    }
    setSaving(true);
    setAlertError('');
    try {
      const res = await fetch(`${API}/api/field-health-alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authH() },
        body: JSON.stringify({
          field_id: alertModal.field_id,
          field_name: alertModal.name,
          crop_type: alertModal.crop_type,
          ndvi_threshold: t,
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
      setSaving(false);
    }
  }

  async function deleteAlert(alertId) {
    await fetch(`${API}/api/field-health-alerts/${alertId}`, {
      method: 'DELETE',
      headers: authH(),
    }).catch(() => {});
    fetchAlerts();
  }

  if (!isLoggedIn) return null;

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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: GREEN_DARK, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Field Health
          </span>
          {fields.length > 0 && (
            <span style={{ fontSize: 10, color: '#9ca3af' }}>· {fields.length} fields</span>
          )}
        </div>
        <div style={{ color: GREEN, display: 'flex', alignItems: 'center' }}>
          <ChevronDown open={!collapsed} />
        </div>
      </button>

      {!collapsed && (
        <div style={{ padding: '14px 16px' }}>
          {loading && (
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 0 }}>Loading field data…</p>
          )}

          {!loading && fields.length === 0 && (
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 0 }}>
              No fields found. Add fields in the{' '}
              <Link to="/crop-monitor" style={{ color: GREEN, fontWeight: 600 }}>Crop Monitor</Link>{' '}
              to start tracking satellite health.
            </p>
          )}

          {fields.length > 0 && (
            <>
              <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, marginTop: 0 }}>
                Current NDVI from satellite · <Link to="/crop-monitor" style={{ color: GREEN, fontSize: 11 }}>Open Crop Monitor →</Link>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {fields.map(f => {
                  const existingAlert = alertForField(f.field_id);
                  const hasAlert = !!existingAlert;
                  const belowThreshold = hasAlert && f.latest_ndvi != null &&
                    f.latest_ndvi <= parseFloat(existingAlert.NDVIThreshold);
                  return (
                    <div key={f.field_id} style={{
                      background: belowThreshold ? '#fef2f2' : GREEN_LIGHT,
                      borderRadius: 10,
                      padding: '10px 12px',
                      border: `1px solid ${belowThreshold ? '#fca5a5' : GREEN_BORDER}`,
                      position: 'relative',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {f.name}
                          </div>
                          {f.crop_type && (
                            <div style={{ fontSize: 10, color: '#6b7280' }}>{f.crop_type}</div>
                          )}
                          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                              fontSize: 16, fontWeight: 700,
                              color: ndviColor(f.latest_ndvi),
                            }}>
                              {f.latest_ndvi != null ? f.latest_ndvi.toFixed(3) : '—'}
                            </span>
                            <span style={{ fontSize: 10, color: ndviColor(f.latest_ndvi), fontWeight: 600 }}>
                              {ndviLabel(f.latest_ndvi)}
                            </span>
                            {belowThreshold && (
                              <span style={{ fontSize: 9, fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '1px 5px', borderRadius: 4 }}>
                                ALERT
                              </span>
                            )}
                          </div>
                          <NDVIBar value={f.latest_ndvi} />
                          {f.ndvi_date && (
                            <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 3 }}>
                              {f.ndvi_date.slice(0, 10)}
                            </div>
                          )}
                          {hasAlert && (
                            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: GREEN_DARK }}>
                              <span>Alert below {parseFloat(existingAlert.NDVIThreshold).toFixed(3)}</span>
                              <button
                                onClick={() => deleteAlert(existingAlert.AlertID)}
                                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 10, padding: 0 }}
                              >
                                Remove ×
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => openModal(f)}
                          title={hasAlert ? 'Edit NDVI alert' : 'Set NDVI alert'}
                          style={{
                            marginLeft: 8,
                            background: hasAlert ? GREEN : 'transparent',
                            color: hasAlert ? '#fff' : GREEN,
                            border: `1px solid ${hasAlert ? GREEN : GREEN_BORDER}`,
                            borderRadius: 6, padding: '3px 6px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 3, fontSize: 10,
                            flexShrink: 0,
                          }}
                        >
                          <AlertBell active={hasAlert} />
                          {!hasAlert && <span style={{ fontSize: 9 }}>Alert</span>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div style={{ fontSize: 11, color: '#9ca3af' }}>
            Alerts fire automatically via push notification when NDVI drops below your threshold.
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
              Field Health Alert
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#6b7280' }}>
              {alertModal.name}
              {alertModal.crop_type ? ` — ${alertModal.crop_type}` : ''}
            </p>

            {alertModal.latest_ndvi != null && (
              <div style={{
                background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`,
                borderRadius: 8, padding: '8px 12px', marginBottom: 14,
              }}>
                <span style={{ fontSize: 11, color: '#6b7280' }}>Current NDVI: </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: ndviColor(alertModal.latest_ndvi) }}>
                  {alertModal.latest_ndvi.toFixed(3)}
                </span>
                <span style={{ fontSize: 10, color: '#6b7280', marginLeft: 6 }}>
                  ({ndviLabel(alertModal.latest_ndvi)})
                </span>
              </div>
            )}

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Alert me when NDVI drops below
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden', marginBottom: 6 }}>
              <input
                type="number" min="0" max="1" step="0.01"
                placeholder="e.g. 0.40"
                value={alertThreshold}
                onChange={e => setAlertThreshold(e.target.value)}
                style={{ flex: 1, padding: '9px 12px', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit' }}
              />
            </div>
            <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 14 }}>
              0.0 = bare soil, 1.0 = dense healthy canopy. Typical healthy crops: 0.5–0.8.
            </p>

            {alertError && (
              <p style={{ fontSize: 12, color: '#dc2626', marginBottom: 12, marginTop: -8 }}>{alertError}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setAlertModal(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={saveAlert} disabled={saving}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: GREEN, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Save Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
