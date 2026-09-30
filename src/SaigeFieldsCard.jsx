import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function ndviColor(v) {
  if (v == null) return '#9CA3AF';
  if (v < 0.3) return '#EF4444';
  if (v < 0.45) return '#F97316';
  if (v < 0.6) return '#EAB308';
  if (v < 0.7) return '#84CC16';
  return '#22C55E';
}

function ndviLabelKey(v) {
  if (v == null) return 'saige_fields_card.ndvi_no_data';
  if (v < 0.3) return 'saige_fields_card.ndvi_poor';
  if (v < 0.45) return 'saige_fields_card.ndvi_stressed';
  if (v < 0.6) return 'saige_fields_card.ndvi_moderate';
  if (v < 0.7) return 'saige_fields_card.ndvi_good';
  return 'saige_fields_card.ndvi_excellent';
}

const SEV_STYLE = {
  critical: { bg: '#FEF2F2', text: '#991B1B', labelKey: 'saige_fields_card.sev_critical' },
  high:     { bg: '#FFF7ED', text: '#9A3412', labelKey: 'saige_fields_card.sev_high' },
  medium:   { bg: '#FFFBEB', text: '#92400E', labelKey: 'saige_fields_card.sev_medium' },
  low:      { bg: '#F0FDF4', text: '#166534', labelKey: 'saige_fields_card.sev_low' },
};

const URGENCY_STYLE = {
  high:   { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', msgKey: 'saige_fields_card.urgency_high', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  medium: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', msgKey: 'saige_fields_card.urgency_medium', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L5 10a7 7 0 1 0 14 0L12 2z"/></svg> },
  low:    { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', msgKey: 'saige_fields_card.urgency_low', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
};

function NDVIMiniBar({ value }) {
  if (value == null) return (
    <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-mont, sans-serif)' }}>—</span>
  );
  const color = ndviColor(value);
  const pct = Math.max(6, Math.min(100, (value / 1) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 999, height: 6, overflow: 'hidden', minWidth: 40 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mont, sans-serif)', color, fontWeight: 700, minWidth: 36 }}>
        {value.toFixed(3)}
      </span>
    </div>
  );
}

export default function SaigeFieldsCard() {
  const { t } = useTranslation();
  const [state, setState] = useState({ loading: true, data: null, error: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${SAIGE_API}/precision-ag/dashboard`, { headers: authHeaders() });
        const json = res.ok ? await res.json() : null;
        if (cancelled) return;
        setState({ loading: false, data: json?.status === 'ok' ? json : null, error: !res.ok });
      } catch {
        if (!cancelled) setState({ loading: false, data: null, error: true });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (state.loading) {
    return (
      <div style={{ fontSize: 13, color: '#6B7280', fontFamily: 'var(--font-mont, sans-serif)' }}>
        {t('saige_fields_card.loading')}
      </div>
    );
  }

  const data = state.data;

  if (!data || !data.fields || data.fields.length === 0) {
    return (
      <div style={{ fontSize: 13, color: '#6B7280', fontFamily: 'var(--font-mont, sans-serif)' }}>
        {t('saige_fields_card.empty')}
      </div>
    );
  }

  const { fields, alerts = {}, irrigation_urgency } = data;
  const totalAlerts = Object.values(alerts).reduce((s, v) => s + v, 0);
  const hasCritical = (alerts.critical || 0) > 0;
  const hasHigh = (alerts.high || 0) > 0;
  const sortedFields = [...fields].sort((a, b) => (b.ndvi ?? -1) - (a.ndvi ?? -1));
  const bestField = sortedFields[0];
  const maxNDVI = bestField?.ndvi ?? 1;
  const urgencyStyle = irrigation_urgency ? URGENCY_STYLE[irrigation_urgency] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Irrigation urgency banner — only show high/medium */}
      {urgencyStyle && irrigation_urgency !== 'low' && (
        <div style={{
          background: urgencyStyle.bg,
          border: `1px solid ${urgencyStyle.border}`,
          borderRadius: 8,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ display:'inline-flex', alignItems:'center' }}>{urgencyStyle.icon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: urgencyStyle.text, fontFamily: 'var(--font-mont, sans-serif)' }}>
            {t(urgencyStyle.msgKey)}
            {bestField && ` — ${bestField.name}`}
          </span>
        </div>
      )}

      {/* Alert severity pills */}
      {totalAlerts > 0 && (
        <div style={{
          background: hasCritical ? '#FEF2F2' : hasHigh ? '#FFF7ED' : '#FFFBEB',
          border: `1px solid ${hasCritical ? '#FECACA' : hasHigh ? '#FED7AA' : '#FDE68A'}`,
          borderRadius: 8,
          padding: '8px 12px',
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: hasCritical ? '#991B1B' : '#92400E',
            fontFamily: 'var(--font-mont, sans-serif)',
            marginBottom: 6,
          }}>
            <span style={{display:'inline-flex',alignItems:'center',gap:4,verticalAlign:'middle'}}>
              {hasCritical
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              {t('saige_fields_card.active_alerts', { count: totalAlerts })}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['critical', 'high', 'medium', 'low'].map(sev => {
              const count = alerts[sev] || 0;
              if (!count) return null;
              const s = SEV_STYLE[sev];
              return (
                <span key={sev} style={{
                  background: s.bg,
                  color: s.text,
                  border: `1px solid ${s.text}33`,
                  borderRadius: 999,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mont, sans-serif)',
                }}>
                  {count} {t(s.labelKey)}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Fields table */}
      <div style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#14532D', fontFamily: 'var(--font-lora, serif)' }}>
            {t('saige_fields_card.my_fields')}
          </span>
          <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-mont, sans-serif)' }}>
            {t('saige_fields_card.field_count', { count: fields.length })}
          </span>
        </div>
        {sortedFields.slice(0, 6).map((f, i) => {
          const color = ndviColor(f.ndvi);
          const barPct = f.ndvi != null ? Math.max(4, Math.min(100, (f.ndvi / Math.max(maxNDVI, 0.01)) * 100)) : 0;
          const isTop = i === 0 && f.ndvi != null;
          return (
            <div key={f.field_id} style={{
              padding: '9px 12px',
              borderTop: i === 0 ? 'none' : '1px solid #F9FAFB',
              background: isTop ? '#F0FDF4' : '#fff',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '4px 12px',
              alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#111827',
                  fontFamily: 'var(--font-mont, sans-serif)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}>
                  {isTop && <span style={{ fontSize: 12 }}>🏆</span>}
                  {f.name}
                  {f.crop_type && (
                    <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 400 }}>
                      · {f.crop_type}
                    </span>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 4,
                }}>
                  <div style={{
                    flex: 1,
                    background: '#F3F4F6',
                    borderRadius: 999,
                    height: 5,
                    overflow: 'hidden',
                    minWidth: 60,
                  }}>
                    <div style={{ width: `${barPct}%`, height: '100%', background: color + 'CC', borderRadius: 999 }} />
                  </div>
                  <span style={{
                    fontSize: 10,
                    color,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mont, sans-serif)',
                    minWidth: 40,
                  }}>
                    {f.ndvi != null ? `${f.ndvi.toFixed(3)}` : '—'}
                  </span>
                  <span style={{
                    fontSize: 10,
                    color: '#9CA3AF',
                    fontFamily: 'var(--font-mont, sans-serif)',
                  }}>
                    {t(ndviLabelKey(f.ndvi))}
                  </span>
                </div>
              </div>
              {!f.monitoring_enabled && (
                <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'var(--font-mont, sans-serif)' }}>
                  {t('saige_fields_card.monitoring_off')}
                </span>
              )}
            </div>
          );
        })}
        {fields.length > 6 && (
          <div style={{
            padding: '8px 12px',
            borderTop: '1px solid #F3F4F6',
            fontSize: 11,
            color: '#9CA3AF',
            fontFamily: 'var(--font-mont, sans-serif)',
            textAlign: 'center',
          }}>
            {t('saige_fields_card.more_fields', { count: fields.length - 6 })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, fontFamily: 'var(--font-mont, sans-serif)' }}>
        <Link to="/precision-ag/fields" style={{ color: '#3D6B34', fontWeight: 700, textDecoration: 'none' }}>
          Open dashboard
        </Link>
        <Link to="/precision-ag/benchmark" style={{ color: '#3D6B34', fontWeight: 700, textDecoration: 'none' }}>
          Open benchmark
        </Link>
      </div>

      {/* Quick-start suggestions */}
      <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-mont, sans-serif)', lineHeight: 1.5 }}>
        {t('saige_fields_card.suggestions', { field: bestField?.name || t('saige_fields_card.top_field') })}
      </div>
    </div>
  );
}
