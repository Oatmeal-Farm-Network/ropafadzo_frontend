import React from 'react';
import { VizActions, VizEmpty } from './VizActions';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const MUTED = '#6b7280';
const FONT = 'Montserrat, system-ui, sans-serif';
const HEADER_BG = '#f0f7ee';

const KIND_COLOR = {
  plant: '#3D6B34',
  harvest: '#E6A23C',
  frost: '#5C7A9A',
  activity: '#819360',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isoDay(value) {
  const s = String(value || '');
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : '';
}

function parseYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function groupByDate(events) {
  const map = new Map();
  events.forEach((e) => {
    const day = isoDay(e?.date);
    if (!day) return;
    if (!map.has(day)) map.set(day, []);
    map.get(day).push(e);
  });
  return map;
}

export default function CalendarViz({ spec }) {
  const data = spec?.data || {};
  const events = Array.isArray(data.events) ? data.events.filter((e) => e && isoDay(e.date)) : [];
  if (events.length === 0) return <VizEmpty spec={spec} />;

  const { year, month } = parseYearMonth();
  const byDate = groupByDate(events);
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const startWeekday = new Date(year, month - 1, 1).getDay();
  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const inMonth = events.filter((e) => isoDay(e.date).startsWith(prefix));
  const otherMonths = events.filter((e) => !isoDay(e.date).startsWith(prefix));

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
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937', marginTop: 4, marginBottom: 8 }}>
        {spec.title}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>
        {MONTHS[month - 1]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: MUTED,
              textAlign: 'center',
              padding: '4px 0',
            }}
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day == null) {
            return <div key={`b${i}`} style={{ minHeight: 36 }} />;
          }
          const key = `${prefix}${String(day).padStart(2, '0')}`;
          const dayEvents = byDate.get(key) || [];
          const kinds = [...new Set(dayEvents.map((e) => e.kind || 'activity'))];
          return (
            <div
              key={key}
              title={dayEvents.map((e) => e.label || e.kind).join(', ')}
              style={{
                minHeight: 36,
                borderRadius: 6,
                background: dayEvents.length ? HEADER_BG : 'transparent',
                padding: '4px 2px 6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1f2937' }}>{day}</div>
              {kinds.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 2 }}>
                  {kinds.slice(0, 3).map((kind) => (
                    <span
                      key={kind}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: KIND_COLOR[kind] || KIND_COLOR.activity,
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8, fontSize: 11, color: MUTED }}>
        <span><span style={{ color: KIND_COLOR.plant }}>●</span> plant</span>
        <span><span style={{ color: KIND_COLOR.harvest }}>●</span> harvest</span>
        <span><span style={{ color: KIND_COLOR.frost }}>●</span> frost</span>
        <span><span style={{ color: KIND_COLOR.activity }}>●</span> activity</span>
      </div>
      {inMonth.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {inMonth.slice(0, 8).map((e, i) => (
            <div key={i} style={{ fontSize: 12, color: '#1f2937', marginTop: 2 }}>
              <span style={{ color: KIND_COLOR[e.kind] || KIND_COLOR.activity, marginRight: 6 }}>●</span>
              {isoDay(e.date).slice(5)} · {e.label || e.kind}
              {e.field ? ` · ${e.field}` : ''}
            </div>
          ))}
        </div>
      )}
      {otherMonths.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 2 }}>Other months</div>
          {otherMonths.slice(0, 6).map((e, i) => (
            <div key={i} style={{ fontSize: 12, color: '#1f2937', marginTop: 2 }}>
              <span style={{ color: KIND_COLOR[e.kind] || KIND_COLOR.activity, marginRight: 6 }}>●</span>
              {isoDay(e.date)} · {e.label || e.kind}
            </div>
          ))}
        </div>
      )}
      <VizActions spec={spec} />
    </div>
  );
}
