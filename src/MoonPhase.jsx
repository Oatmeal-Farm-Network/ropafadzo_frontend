import React from 'react';
import { useTranslation } from 'react-i18next';

// Synodic month length and reference new moon (2000-01-06 18:14 UTC)
const SYNODIC = 29.53058867;
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0) / 86400000; // in days

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// Returns fraction of cycle (0 = new, 0.5 = full) for a given Date
function phaseFraction(date) {
  const days = date.getTime() / 86400000;
  const diff = days - REF_NEW_MOON;
  let frac = (diff % SYNODIC) / SYNODIC;
  if (frac < 0) frac += 1;
  return frac;
}

function phaseInfo(frac) {
  // 8 principal phases, windowed around their exact fractions
  if (frac < 0.0303 || frac >= 0.9697) return { key: 'new',             emoji: '🌑' };
  if (frac < 0.2197)                   return { key: 'waxing_crescent', emoji: '🌒' };
  if (frac < 0.2803)                   return { key: 'first_quarter',   emoji: '🌓' };
  if (frac < 0.4697)                   return { key: 'waxing_gibbous',  emoji: '🌔' };
  if (frac < 0.5303)                   return { key: 'full',            emoji: '🌕' };
  if (frac < 0.7197)                   return { key: 'waning_gibbous',  emoji: '🌖' };
  if (frac < 0.7803)                   return { key: 'last_quarter',    emoji: '🌗' };
  return                                      { key: 'waning_crescent', emoji: '🌘' };
}

// Percent illumination: 100% full, 0% new. Monotonic by distance from full moon.
function illumination(frac) {
  return Math.round((1 - Math.cos(2 * Math.PI * frac)) * 50);
}

export default function MoonPhase() {
  const { t } = useTranslation();

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  // Previous 7, today, next 7
  const series = [];
  for (let off = -7; off <= 7; off++) {
    const d = new Date(today);
    d.setDate(d.getDate() + off);
    const f = phaseFraction(d);
    const info = phaseInfo(f);
    series.push({
      offset: off,
      date: d,
      label: off === 0 ? t('moon_phase.today') : t('moon_phase.day_' + DAY_KEYS[d.getDay()]),
      dayNum: d.getDate(),
      emoji: info.emoji,
      phaseKey: info.key,
      illum: illumination(f),
    });
  }

  return (
    <div>
      {/* 15-day strip: prev 7, today, next 7 */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '0.2rem' }}>
        {series.map((d) => {
          const isToday = d.offset === 0;
          const phaseName = t('moon_phase.phase_' + d.phaseKey);
          return (
            <div
              key={d.offset}
              title={t('moon_phase.title_fmt', { date: d.date.toLocaleDateString(), name: phaseName, illum: d.illum })}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: '0 0 auto',
                minWidth: '40px',
                padding: '0.25rem 0.15rem',
                background: isToday ? '#f0f5e8' : 'transparent',
                borderRadius: '0.5rem',
                border: isToday ? '1px solid #3D6B3455' : '1px solid transparent',
              }}
            >
              <span style={{ fontSize: '0.6rem', fontWeight: 600, color: isToday ? '#3D6B34' : '#6B7280' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.55rem', color: '#9CA3AF' }}>{d.dayNum}</span>
              <span style={{ fontSize: '1.4rem', lineHeight: 1, margin: '0.15rem 0' }}>{d.emoji}</span>
              <span style={{ fontSize: '0.58rem', color: '#6B7280' }}>{d.illum}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
