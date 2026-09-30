import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RelatedSuggestions({ heading, items = [] }) {
  const { t } = useTranslation();
  const displayHeading = heading !== undefined ? heading : t('related_suggestions.heading');

  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginTop: 18, padding: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#14532d', marginBottom: 10 }}>{displayHeading}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((it, i) => (
          <Link
            key={i}
            to={it.url || '/saige'}
            style={{
              display: 'block',
              padding: '8px 12px',
              background: '#fff',
              border: '1px solid #86efac',
              borderRadius: 10,
              textDecoration: 'none',
              color: '#14532d',
              minWidth: 180,
              maxWidth: 280,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700 }}>{it.title}</div>
            {it.description && (
              <div style={{ fontSize: 12, color: '#4b5563', marginTop: 2, lineHeight: 1.35 }}>{it.description}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
