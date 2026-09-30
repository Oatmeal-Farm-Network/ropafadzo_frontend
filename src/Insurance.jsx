import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from './useUserProfile.js';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

export default function Insurance() {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const [sp] = useSearchParams();
  const [crops, setCrops] = useState([]);
  const [crop, setCrop] = useState(sp.get('crop') || (profile.crops && profile.crops[0]) || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`${SAIGE_API}/insurance/crops`)
      .then(r => r.json())
      .then(j => setCrops(j?.crops || []))
      .catch(() => setErr(t('insurance.err_no_service')));
    if (crop) lookup(crop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lookup = async (c = crop) => {
    if (!c) return;
    setLoading(true);
    setResult(null);
    setErr('');
    try {
      const r = await fetch(`${SAIGE_API}/insurance/for/${encodeURIComponent(c)}`);
      const j = await r.json();
      if (j?.status === 'ok') setResult(j);
      else setErr(j?.message || t('insurance.err_no_match'));
    } catch {
      setErr(t('insurance.err_lookup_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 36, height: 36 }} />
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#14532d' }}>{t('insurance.heading')}</h1>
      </div>
      <p style={{ color: '#4b5563', marginTop: 4, marginBottom: 18 }}>
        {t('insurance.desc_prefix')}{' '}
        <Link to="/saige">{t('insurance.desc_link')}</Link>{' '}
        {t('insurance.desc_suffix')}
      </p>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px' }}>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('insurance.label_crop')}</label>
          <select value={crop} onChange={(e) => { setCrop(e.target.value); lookup(e.target.value); }} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4, textTransform: 'capitalize' }}>
            <option value="">{t('insurance.select_placeholder')}</option>
            {crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 10, borderRadius: 8 }}>{err}</div>}
      {loading && <div style={{ color: '#6b7280' }}>{t('insurance.loading')}</div>}

      {result && !loading && (
        <>
          <div style={{ marginBottom: 12, fontSize: 14 }}>
            {t('insurance.products_for')} <strong style={{ textTransform: 'capitalize' }}>{result.crop}</strong>:
          </div>
          {(result.products || []).map(p => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#14532d' }}>{p.name}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}><strong>{t('insurance.field_covers')}</strong> {p.covers}</div>
              <div style={{ fontSize: 13, marginTop: 3 }}><strong>{t('insurance.field_best_for')}</strong> {p.best_for}</div>
              <div style={{ fontSize: 13, marginTop: 3 }}><strong>{t('insurance.field_coverage_range')}</strong> {p.coverage_range}</div>
              {p.notes && <div style={{ fontSize: 13, marginTop: 3, color: '#4b5563' }}>{p.notes}</div>}
            </div>
          ))}
          <a
            href={result.agent_finder_url}
            target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', marginTop: 8, padding: '10px 18px', background: '#14532d', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}
          >
            {t('insurance.btn_find_agent')}
          </a>
        </>
      )}
    </div>
  );
}
