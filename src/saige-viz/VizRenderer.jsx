import React from 'react';
import LineChartViz from './LineChartViz';
import BarChartViz from './BarChartViz';
import KpiViz from './KpiViz';
import AlertViz from './AlertViz';
import TableViz from './TableViz';
import TimelineViz from './TimelineViz';
import ProgressViz from './ProgressViz';
import MapViz from './MapViz';
import CalendarViz from './CalendarViz';

const GREEN = '#3D6B34';
const LIGHT = '#f0f7ee';
const BORDER = '#c7dfc2';
const MUTED = '#6b7280';
const FONT = 'Montserrat, system-ui, sans-serif';

const KNOWN_TYPES = [
  'kpi',
  'line_chart',
  'bar_chart',
  'table',
  'alert_card',
  'timeline',
  'progress',
  'farm_map',
  'field_map',
  'heatmap',
  'calendar',
];

function PlaceholderCard({ spec, label }) {
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
      <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {spec.type}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937', marginTop: 4 }}>
        {spec.title}
      </div>
      <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{label}</div>
    </div>
  );
}

export default function VizRenderer({ spec }) {
  if (!spec || !spec.type) return null;

  switch (spec.type) {
    case 'kpi':
      return <KpiViz spec={spec} />;
    case 'alert_card':
      return <AlertViz spec={spec} />;
    case 'table':
      return <TableViz spec={spec} />;
    case 'progress':
      return <ProgressViz spec={spec} />;
    case 'timeline':
      return <TimelineViz spec={spec} />;
    case 'line_chart':
      return <LineChartViz spec={spec} />;
    case 'bar_chart':
      return <BarChartViz spec={spec} />;
    case 'farm_map':
    case 'field_map':
    case 'heatmap':
      return <MapViz spec={spec} />;
    case 'calendar':
      return <CalendarViz spec={spec} />;
    default:
      return (
        <div
          style={{
            background: LIGHT,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: '12px 14px',
            fontFamily: FONT,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>{spec.title}</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Chart coming soon</div>
        </div>
      );
  }
}

export { KNOWN_TYPES };
