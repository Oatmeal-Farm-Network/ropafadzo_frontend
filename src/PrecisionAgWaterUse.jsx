import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, API_URL } from './precisionAgUtils';

function pickValue(row) {
  if (!row || typeof row !== 'object') return null;
  const v = row.eta_mm ?? row.value ?? row.mean ?? row.eta;
  return typeof v === 'number' ? v : (typeof v === 'string' && v ? Number(v) : null);
}

function SeriesChart({ rows }) {
  if (!rows?.length) return null;
  const W = 680, H = 200, PAD = { l: 40, r: 16, t: 12, b: 32 };
  const values = rows.map(pickValue).map(v => (v == null ? 0 : v));
  const max = Math.max(...values, 1);
  const cx = i => PAD.l + (i / Math.max(1, rows.length - 1)) * (W - PAD.l - PAD.r);
  const cy = v => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
  const linePath = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${cx(i)},${cy(v)}`).join(' ');
  const ticks = [0, max * 0.5, max];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
      {ticks.map((v, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={cy(v)} x2={W - PAD.r} y2={cy(v)} stroke="#f0f0f0" />
          <text x={PAD.l - 4} y={cy(v) + 4} fontSize="10" fill="#9CA3AF" textAnchor="end">{v.toFixed(1)}</text>
        </g>
      ))}
      <path d={`${linePath} L${cx(rows.length - 1)},${H - PAD.b} L${cx(0)},${H - PAD.b} Z`} fill="#0EA5E9" fillOpacity="0.12" />
      <path d={linePath} fill="none" stroke="#0EA5E9" strokeWidth="2" />
      {rows.map((r, i) => (
        <circle key={i} cx={cx(i)} cy={cy(values[i])} r="3" fill="#0EA5E9" />
      ))}
      {rows.map((r, i) => {
        if (i % Math.ceil(rows.length / 6) !== 0 && i !== rows.length - 1) return null;
        const label = (r.date || r.period || '').slice(0, 10);
        return (
          <text key={`x-${i}`} x={cx(i)} y={H - 10} fontSize="9" fill="#9CA3AF" textAnchor="middle">{label}</text>
        );
      })}
    </svg>
  );
}

export default function PrecisionAgWaterUse() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const fieldId = searchParams.get('FieldID');
  const BusinessID = searchParams.get('BusinessID');
  const { Business } = useAccount();
  const fields = useFields(BusinessID);
  const field = useMemo(
    () => fields.find(f => String(f.fieldid ?? f.id) === String(fieldId)),
    [fields, fieldId]
  );

  const [snapshot, setSnapshot] = useState(null);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fieldId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`${API_URL}/api/fields/${fieldId}/water-use`).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(`${API_URL}/api/fields/${fieldId}/water-use/series?limit=12`).then(r => (r.ok ? r.json() : null)).catch(() => null),
    ])
      .then(([snap, ser]) => {
        setSnapshot((snap || {}).wapor || null);
        const rows = ((ser || {}).wapor || {}).series || ((ser || {}).wapor || {}).rows || [];
        setSeries(Array.isArray(rows) ? rows : []);
      })
      .catch(e => setError(e.message || t('precision_ag_water.error_load')))
      .finally(() => setLoading(false));
  }, [fieldId]);

  const latestValue = pickValue(snapshot) ?? (series?.length ? pickValue(series[series.length - 1]) : null);

  return (
    <AccountLayout
      Business={Business}
      BusinessID={BusinessID}
      PeopleID={typeof window !== 'undefined' ? localStorage.getItem('people_id') : null}
      pageTitle={t('precision_ag_water.page_title')}
      breadcrumbs={[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t('precision_ag_water.breadcrumb_precision') },
        { label: t('precision_ag_water.page_title') },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="font-lora text-2xl font-bold text-gray-900">{t('precision_ag_water.heading')}</h1>
          <p className="font-mont text-sm text-gray-500">
            {t('precision_ag_water.subheading')}
            {field?.name && <> {t('precision_ag_water.subheading_for_field', { name: field.name })}</>}.
          </p>
        </div>

        {!fieldId && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-sm">
            {t('precision_ag_water.no_field')}
          </div>
        )}

        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
            {t('precision_ag_water.loading')}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && fieldId && (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('precision_ag_water.latest_et_label')}</div>
                <div className="text-3xl font-mont font-bold text-sky-700 mt-1">
                  {latestValue != null ? `${latestValue.toFixed(2)} mm` : '—'}
                </div>
                {snapshot?.date && (
                  <div className="text-xs text-gray-500 mt-1">{t('precision_ag_water.as_of', { date: snapshot.date })}</div>
                )}
                {snapshot?.units && snapshot.units !== 'mm' && (
                  <div className="text-xs text-gray-500 mt-1">{t('precision_ag_water.units', { units: snapshot.units })}</div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{t('precision_ag_water.source_label')}</div>
                <div className="text-base font-mont text-gray-900 mt-1">
                  {snapshot?.source || snapshot?.model || t('precision_ag_water.source_default')}
                </div>
                <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {t('precision_ag_water.eta_desc')}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-lora text-lg font-bold text-gray-900 mb-3">{t('precision_ag_water.recent_series')}</h2>
              {series?.length ? (
                <SeriesChart rows={series} />
              ) : (
                <div className="text-sm text-gray-500">{t('precision_ag_water.no_series')}</div>
              )}
            </div>

            {(!snapshot && !series?.length) && (
              <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-sm">
                {t('precision_ag_water.no_data')}
              </div>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
