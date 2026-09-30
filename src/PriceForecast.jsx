import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RelatedSuggestions from './RelatedSuggestions.jsx';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

export default function PriceForecast() {
  const { t } = useTranslation();
  const [commodities, setCommodities] = useState([]);
  const [commodity, setCommodity] = useState('');
  const [months, setMonths] = useState(6);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`${SAIGE_API}/price/commodities`)
      .then(r => r.json())
      .then(j => setCommodities(j?.commodities || []))
      .catch(() => setErr(t('price_forecast.err_no_service')));
  }, []);

  const fetchForecast = async (c = commodity, m = months) => {
    if (!c) return;
    setLoading(true);
    setData(null);
    setErr('');
    try {
      const uid = String(JSON.parse(localStorage.getItem('ofnUser') || '{}')?.PeopleID || 'anon');
      const r = await fetch(`${SAIGE_API}/price/forecast/${encodeURIComponent(c)}?months_ahead=${m}&user_id=${encodeURIComponent(uid)}`);
      const j = await r.json();
      if (j?.status === 'ok') setData(j);
      else setErr(t('price_forecast.err_no_forecast'));
    } catch {
      setErr(t('price_forecast.err_lookup'));
    } finally {
      setLoading(false);
    }
  };

  const badge = data?.confidence === 'medium' ? { bg: '#fefce8', color: '#854d0e' }
              : data?.confidence === 'low' ? { bg: '#fef2f2', color: '#991b1b' }
              : { bg: '#ecfdf5', color: '#065f46' };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 36, height: 36 }} />
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#14532d' }}>{t('price_forecast.heading')}</h1>
      </div>
      <p style={{ color: '#4b5563', marginTop: 4, marginBottom: 18 }}>
        {t('price_forecast.desc_prefix')}
        <Link to="/saige"> {t('price_forecast.desc_link')}</Link>.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('price_forecast.label_commodity')}</label>
          <select
            value={commodity}
            onChange={(e) => { setCommodity(e.target.value); fetchForecast(e.target.value, months); }}
            style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4, textTransform: 'capitalize' }}
          >
            <option value="">{t('price_forecast.select_placeholder')}</option>
            {commodities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: '0 0 140px' }}>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('price_forecast.label_months')}</label>
          <select
            value={months}
            onChange={(e) => { setMonths(Number(e.target.value)); if (commodity) fetchForecast(commodity, Number(e.target.value)); }}
            style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}
          >
            {[3, 6, 9, 12].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 10, borderRadius: 8 }}>{err}</div>}
      {loading && <div style={{ color: '#6b7280' }}>{t('price_forecast.loading')}</div>}

      {data && !loading && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 18, fontWeight: 700, textTransform: 'capitalize' }}>{data.commodity}</div>
            <span style={{ ...badge, padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
              {t('price_forecast.confidence', { level: data.confidence })}
            </span>
            <span style={{ color: '#6b7280', fontSize: 13 }}>{data.unit}</span>
          </div>
          <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>{t('price_forecast.source', { source: data.source })}</div>
          <div style={{ fontSize: 14, marginBottom: 14 }}>{t('price_forecast.recent_avg', { value: data.recent_average, unit: data.unit })}</div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>{t('price_forecast.th_month')}</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>{t('price_forecast.th_low')}</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>{t('price_forecast.th_expected')}</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>{t('price_forecast.th_high')}</th>
              </tr>
            </thead>
            <tbody>
              {(data.forecast || []).map(f => (
                <tr key={f.month}>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>{f.month}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', color: '#6b7280' }}>{f.low}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontWeight: 700 }}>{f.expected}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', color: '#6b7280' }}>{f.high}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.notes && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#4b5563' }}>{data.notes}</div>
          )}
          <RelatedSuggestions
            heading={t('price_forecast.related_heading')}
            items={data.related_suggestions || []}
          />
        </div>
      )}
    </div>
  );
}
