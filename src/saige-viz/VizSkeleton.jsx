import React from 'react';

const BORDER = '#c7dfc2';
const TRACK = '#F3F4F6';
const FONT = 'Montserrat, system-ui, sans-serif';

const cardStyle = {
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: '12px 14px',
  fontFamily: FONT,
};

function Bar({ width, height = 10, marginTop = 0 }) {
  return (
    <div
      className="saige-viz-skel-bar"
      style={{
        width,
        height,
        marginTop,
        borderRadius: 6,
        background: TRACK,
      }}
    />
  );
}

/** Gray placeholder for a KPI card, shown while Saige is still
 * thinking. Shape mirrors KpiViz: label line, big value line, hint line. */
export function KpiSkeleton() {
  return (
    <div style={cardStyle}>
      <Bar width="40%" height={8} />
      <Bar width="55%" height={22} marginTop={8} />
      <Bar width="70%" height={8} marginTop={8} />
    </div>
  );
}

/** Gray placeholder for a chart card. Shape mirrors LineChartViz /
 * BarChartViz: title line + a tall chart-area block. */
export function ChartSkeleton() {
  return (
    <div style={cardStyle}>
      <Bar width="45%" height={8} />
      <div
        className="saige-viz-skel-bar"
        style={{ width: '100%', height: 160, marginTop: 10, borderRadius: 8, background: TRACK }}
      />
    </div>
  );
}

/** Mounted next to the thinking spinner while Saige works on a reply
 * that will likely include visualizations. One KPI shape + one chart
 * shape covers the common cases without guessing the exact type. */
export default function VizSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <KpiSkeleton />
      <ChartSkeleton />
      <style>{`
        @keyframes saige-viz-skel-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .saige-viz-skel-bar {
          animation: saige-viz-skel-pulse 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .saige-viz-skel-bar { animation: none; }
        }
      `}</style>
    </div>
  );
}
