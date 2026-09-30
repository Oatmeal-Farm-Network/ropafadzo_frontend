import React from 'react';
import VizRenderer from './VizRenderer';
import { VIZ_MOCKS } from './vizMocks';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const FONT_HEAD = 'Lora, Georgia, serif';
const FONT_BODY = 'Montserrat, system-ui, sans-serif';

export default function VizPlayground() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto 16px',
        padding: '14px 16px',
        background: '#fff',
        border: `1px dashed ${BORDER}`,
        borderRadius: 12,
        fontFamily: FONT_BODY,
      }}
    >
      <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: GREEN, marginBottom: 4 }}>
        Saige viz playground
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        Dev only (`?vizdev=1`). Line/bar are live; other types stay placeholders until G2–G7.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {VIZ_MOCKS.map((spec) => (
          <VizRenderer key={spec.id || spec.title} spec={spec} />
        ))}
      </div>
    </div>
  );
}
