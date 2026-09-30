import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GREEN = '#3D6B34';
const BORDER = '#c7dfc2';
const MUTED = '#6b7280';
const FONT = 'Montserrat, system-ui, sans-serif';

function readStoredBusinessId() {
  try {
    return localStorage.getItem('selected_business_id') || '';
  } catch {
    return '';
  }
}

/** Map Saige viz hrefs onto real SPA routes (query-string FieldID / BusinessID). */
export function resolveVizHref(href, spec) {
  if (!href || typeof href !== 'string') return href;
  const bid = spec?.data?.business_id || readStoredBusinessId();
  const fieldPath = href.match(/^\/precision-ag\/fields\/(\d+)\/?$/);
  if (fieldPath) {
    const qs = new URLSearchParams();
    if (bid) qs.set('BusinessID', String(bid));
    qs.set('FieldID', fieldPath[1]);
    return `/precision-ag/analyses?${qs.toString()}`;
  }
  if (href.startsWith('/precision-ag/analysis/maps')) {
    const qIndex = href.indexOf('?');
    const path = qIndex >= 0 ? href.slice(0, qIndex) : href;
    const qs = new URLSearchParams(qIndex >= 0 ? href.slice(qIndex + 1) : '');
    if (bid && !qs.get('BusinessID')) qs.set('BusinessID', String(bid));
    const fid = qs.get('field_id') || qs.get('FieldID') || spec?.data?.field_id;
    if (fid) {
      if (!qs.get('FieldID')) qs.set('FieldID', String(fid));
      if (!qs.get('field_id')) qs.set('field_id', String(fid));
    }
    const s = qs.toString();
    return s ? `${path}?${s}` : path;
  }
  if (href === '/precision-ag/fields' && bid) {
    return `/precision-ag/fields?BusinessID=${bid}`;
  }
  return href;
}

function ActionLink({ href, spec, children, style }) {
  const to = resolveVizHref(href, spec);
  if (/^https?:\/\//i.test(to)) {
    return (
      <a href={to} style={style} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} style={style}>
      {children}
    </Link>
  );
}

/** Action-link row shared by every card. Green button style, matches
 * the proposal "Approve" button on SaigePage. Renders nothing if the
 * spec has no actions. */
export function VizActions({ spec }) {
  const { t } = useTranslation();
  const actions = Array.isArray(spec?.actions) ? spec.actions : [];
  const valid = actions.filter((a) => a && a.href);
  if (valid.length === 0) return null;

  const style = {
    fontSize: 12,
    padding: '5px 10px',
    borderRadius: 8,
    border: 'none',
    background: GREEN,
    color: '#fff',
    fontWeight: 600,
    fontFamily: FONT,
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
      {valid.map((action, i) => (
        <ActionLink key={i} href={action.href} spec={spec} style={style}>
          {action.label || t('saige_viz.open_full')}
        </ActionLink>
      ))}
    </div>
  );
}

/** Shared empty state: title + "No data yet" + first action if any.
 * Used by every card when its spec.data has nothing to show. */
export function VizEmpty({ spec }) {
  const { t } = useTranslation();
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
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>{spec?.title}</div>
      <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{t('saige_viz.no_data')}</div>
      <VizActions spec={spec} />
    </div>
  );
}
