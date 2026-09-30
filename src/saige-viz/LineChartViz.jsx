import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { VizActions, VizEmpty } from './VizActions';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const FONT = 'Montserrat, system-ui, sans-serif';

const cardStyle = {
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: '12px 14px',
  fontFamily: FONT,
};

function formatTick(value) {
  const s = String(value ?? '');
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(5);
  return s;
}

export default function LineChartViz({ spec }) {
  const data = spec?.data || {};
  const series = Array.isArray(data.series) ? data.series : [];
  const xKey = data.xKey || 'date';
  const yKey = data.yKey || 'value';
  const unit = data.unit || '';
  const seriesName = spec.title || yKey;

  if (series.length < 1) return <VizEmpty spec={spec} />;

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {spec.type}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937', marginTop: 4, marginBottom: 8 }}>
        {spec.title}
      </div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} tickFormatter={formatTick} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) => {
                const n = typeof value === 'number' ? value : Number(value);
                const shown = Number.isFinite(n) ? n : value;
                const label = unit ? `${shown} ${unit}` : shown;
                return [label, seriesName];
              }}
              labelFormatter={(label) => formatTick(label)}
            />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT }} />
            <Line
              type="monotone"
              dataKey={yKey}
              name={seriesName}
              stroke={GREEN}
              strokeWidth={2.5}
              dot={{ fill: GREEN, r: series.length === 1 ? 5 : 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <VizActions spec={spec} />
    </div>
  );
}
