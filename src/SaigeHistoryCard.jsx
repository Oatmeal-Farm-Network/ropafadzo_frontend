import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

const TYPE_COLORS = {
  pest:  '#991b1b',
  soil:  '#854d0e',
  price: '#0f766e',
};

const TYPE_ROUTES = {
  pest:  '/saige/pest-detection',
  soil:  '/saige/soil-challenges',
  price: '/saige/price-forecast',
};

function summarize(e, t) {
  const p = e.payload || {};
  if (e.type === 'pest')  return `${p.diagnosis || t('saige_history.unknown')} (${p.confidence || '—'})`;
  if (e.type === 'soil')  return p.headline || t('saige_history.soil_challenges', { count: (p.challenges || []).length });
  if (e.type === 'price') return t('saige_history.summarize_price', { commodity: p.commodity || '?', confidence: p.confidence || '—' });
  return '';
}

export default function SaigeHistoryCard({ limit = 5 }) {
  const { t } = useTranslation();
  const [entries, setEntries] = useState(null);

  const TYPE_META = {
    pest:  { label: t('saige_history.type_pest'),  color: TYPE_COLORS.pest,  to: TYPE_ROUTES.pest },
    soil:  { label: t('saige_history.type_soil'),  color: TYPE_COLORS.soil,  to: TYPE_ROUTES.soil },
    price: { label: t('saige_history.type_price'), color: TYPE_COLORS.price, to: TYPE_ROUTES.price },
  };

  useEffect(() => {
    const uid = String(JSON.parse(localStorage.getItem('ofnUser') || '{}')?.PeopleID || '');
    if (!uid) { setEntries([]); return; }
    fetch(`${SAIGE_API}/history/${encodeURIComponent(uid)}?limit=${limit}`)
      .then(r => r.json())
      .then(j => setEntries(j?.entries || []))
      .catch(() => setEntries([]));
  }, [limit]);

  if (entries === null) {
    return <div style={{ fontSize: 13, color: '#6b7280' }}>{t('saige_history.loading')}</div>;
  }
  if (entries.length === 0) {
    return (
      <div style={{ fontSize: 13, color: '#6b7280' }}>
        {t('saige_history.empty_prefix')}{' '}
        <Link to="/saige/pest-detection">{t('saige_history.link_pest')}</Link>,{' '}
        <Link to="/saige/soil-challenges">{t('saige_history.link_soil')}</Link>, or{' '}
        <Link to="/saige/price-forecast">{t('saige_history.link_price')}</Link>{' '}
        {t('saige_history.empty_suffix')}
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#14532d', marginBottom: 8 }}>{t('saige_history.heading')}</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {entries.map(e => {
          const meta = TYPE_META[e.type] || { label: e.type, color: '#4b5563', to: '/saige' };
          const when = e.created_at ? new Date(e.created_at).toLocaleString() : '';
          return (
            <Link
              key={e.id}
              to={meta.to}
              style={{ display: 'block', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8, textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: meta.color }}>{meta.label}</span>
                <span style={{ fontSize: 13, color: '#111827' }}>{summarize(e, t)}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7280' }}>{when}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
