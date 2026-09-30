import React from 'react';
import { VizActions, VizEmpty } from './VizActions';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const MUTED = '#6b7280';
const AMBER = '#B45309';
const FONT = 'Montserrat, system-ui, sans-serif';

export default function KpiViz({ spec }) {
  const data = spec?.data || {};
  const { value, unit, delta, hint } = data;
  const hasValue = value !== null && value !== undefined;
  const hasDelta = typeof delta === 'number';
  const deltaColor = hasDelta && delta < 0 ? AMBER : GREEN;

  if (Object.keys(data).length === 0) return <VizEmpty spec={spec} />;

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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>
          {hasValue ? value : '—'}
          {hasValue && unit ? (
            <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 2 }}>{unit}</span>
          ) : null}
        </span>
        {hasValue && hasDelta && (
          <span style={{ fontSize: 12, fontWeight: 700, color: deltaColor }}>
            {delta > 0 ? '+' : ''}
            {delta}
            {unit || ''}
          </span>
        )}
      </div>
      {hint && <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{hint}</div>}
      <VizActions spec={spec} />
    </div>
  );
}
