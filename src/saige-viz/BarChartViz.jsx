import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { VizActions, VizEmpty } from './VizActions';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const FONT = 'Montserrat, system-ui, sans-serif';
const PALETTE = ['#3D6B34', '#819360', '#2c4f25', '#A3301E', '#E6A23C', '#5C7A9A'];

const cardStyle = {
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: '12px 14px',
  fontFamily: FONT,
};

export default function BarChartViz({ spec }) {
  const data = spec?.data || {};
  const series = Array.isArray(data.series) ? data.series : [];
  const xKey = data.xKey || 'field';
  const yKey = data.yKey || 'yield';
  const unit = data.unit || '';
  const seriesName = spec.title || yKey;

  if (series.length < 2) return <VizEmpty spec={spec} />;

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
          <BarChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={56} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) => {
                const n = typeof value === 'number' ? value : Number(value);
                const shown = Number.isFinite(n) ? n : value;
                const label = unit ? `${shown} ${unit}` : shown;
                return [label, seriesName];
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT }} />
            <Bar dataKey={yKey} name={seriesName} radius={[4, 4, 0, 0]}>
              {series.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <VizActions spec={spec} />
    </div>
  );
}
