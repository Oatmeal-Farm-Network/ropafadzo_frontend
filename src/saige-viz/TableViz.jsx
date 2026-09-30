import React from 'react';
import { useTranslation } from 'react-i18next';
import { VizActions, VizEmpty } from './VizActions';

const BORDER = '#c7dfc2';
const HEADER_BG = '#f0f7ee';
const MUTED = '#6b7280';
const FONT = 'Montserrat, system-ui, sans-serif';

const MAX_ROWS = 20;

export default function TableViz({ spec }) {
  const { t } = useTranslation();
  const data = spec?.data || {};
  const columns = Array.isArray(data.columns) ? data.columns : [];
  const rows = Array.isArray(data.rows) ? data.rows : [];

  if (rows.length === 0) return <VizEmpty spec={spec} />;

  const visibleRows = rows.slice(0, MAX_ROWS);
  const extraCount = rows.length - visibleRows.length;

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
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>{spec.title}</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: 'left',
                    padding: '6px 8px',
                    background: HEADER_BG,
                    borderBottom: `1px solid ${BORDER}`,
                    fontWeight: 700,
                    color: '#1f2937',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: '6px 8px',
                      borderBottom: `1px solid ${HEADER_BG}`,
                      color: '#1f2937',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cell ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {extraCount > 0 && (
        <div style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>
          {t('saige_viz.more_rows', { count: extraCount })}
        </div>
      )}
      <VizActions spec={spec} />
    </div>
  );
}
