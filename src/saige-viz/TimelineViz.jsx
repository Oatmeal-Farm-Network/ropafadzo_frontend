import React from 'react';
import { VizActions, VizEmpty } from './VizActions';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const MUTED = '#6b7280';
const FONT = 'Montserrat, system-ui, sans-serif';

export default function TimelineViz({ spec }) {
  const data = spec?.data || {};
  const items = Array.isArray(data.items) ? data.items : [];

  if (items.length === 0) return <VizEmpty spec={spec} />;

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
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginBottom: 10 }}>
        {spec.title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              paddingBottom: i === items.length - 1 ? 0 : 10,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, marginTop: 4, flexShrink: 0 }} />
              {i !== items.length - 1 && (
                <div style={{ width: 1, flex: 1, background: BORDER, marginTop: 2 }} />
              )}
            </div>
            <div style={{ paddingBottom: 2 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>{item.action || '—'}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                {item.date}
                {item.field ? ` · ${item.field}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      <VizActions spec={spec} />
    </div>
  );
}
