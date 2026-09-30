import React from 'react';
import { VizActions, VizEmpty } from './VizActions';

const SEV_STYLE = {
  critical: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  high: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
  medium: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
  low: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
};

const MUTED = '#6b7280';
const FONT = 'Montserrat, system-ui, sans-serif';

export default function AlertViz({ spec }) {
  const data = spec?.data || {};
  const { severity, message, field_name } = data;
  const style = SEV_STYLE[severity] || SEV_STYLE.medium;

  if (Object.keys(data).length === 0) return <VizEmpty spec={spec} />;

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 12,
        padding: '12px 14px',
        fontFamily: FONT,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: '#fff',
          color: style.text,
          border: `1px solid ${style.text}33`,
          borderRadius: 999,
          padding: '2px 8px',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {severity || 'alert'}
      </span>
      <div style={{ fontSize: 15, fontWeight: 700, color: style.text, marginTop: 6 }}>
        {spec.title}
      </div>
      {message && <div style={{ fontSize: 13, color: '#1f2937', marginTop: 4 }}>{message}</div>}
      {field_name && <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{field_name}</div>}
      <VizActions spec={spec} />
    </div>
  );
}
