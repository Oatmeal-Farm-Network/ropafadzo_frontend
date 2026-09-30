import React from 'react';
import { VizActions, VizEmpty } from './VizActions';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const TRACK = '#F3F4F6';
const MUTED = '#6b7280';
const FONT = 'Montserrat, system-ui, sans-serif';

export default function ProgressViz({ spec }) {
  const data = spec?.data || {};
  const { label, percent, hint } = data;
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));

  if (!label && percent == null) return <VizEmpty spec={spec} />;

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: '12px 14px',
        fontFamily: FONT,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {spec.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>{label || '—'}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>{pct}%</span>
      </div>
      <div style={{ background: TRACK, borderRadius: 999, height: 8, overflow: 'hidden', marginTop: 8 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: GREEN, borderRadius: 999 }} />
      </div>
      {hint && <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{hint}</div>}
      <VizActions spec={spec} />
    </div>
  );
}
