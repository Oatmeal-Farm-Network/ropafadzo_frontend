import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from './useUserProfile.js';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

const ZONES = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

export default function RegionCrops() {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const [climates, setClimates] = useState([]);
  const [mode, setMode] = useState(profile.zone ? 'zone' : (profile.climate ? 'climate' : 'climate'));
  const [climate, setClimate] = useState(profile.climate || '');
  const [zone, setZone] = useState(profile.zone || '');
  const [lat, setLat] = useState(profile.lat ? String(profile.lat) : '');
  const [lon, setLon] = useState(profile.lon ? String(profile.lon) : '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`${SAIGE_API}/region/climates`)
      .then(r => r.json())
      .then(j => setClimates(j?.climates || []))
      .catch(() => setErr(t('region_crops.err_no_service')));
  }, []);

  const fetchRecs = async () => {
    const params = new URLSearchParams();
    if (mode === 'climate' && climate) params.set('climate', climate);
    if (mode === 'zone' && zone)       params.set('zone', zone);
    if (mode === 'latlon' && lat && lon) { params.set('lat', lat); params.set('lon', lon); }
    if ([...params.keys()].length === 0) return;

    setLoading(true);
    setResult(null);
    setErr('');
    try {
      const r = await fetch(`${SAIGE_API}/region/recommend?${params.toString()}`);
      const j = await r.json();
      if (j?.status === 'ok') setResult(j);
      else setErr(j?.message || t('region_crops.err_no_recs'));
    } catch {
      setErr(t('region_crops.err_lookup'));
    } finally {
      setLoading(false);
    }
  };

  const MODES = [
    ['climate', t('region_crops.mode_climate')],
    ['zone',    t('region_crops.mode_zone')],
    ['latlon',  t('region_crops.mode_latlon')],
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 36, height: 36 }} />
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#14532d' }}>{t('region_crops.heading')}</h1>
      </div>
      <p style={{ color: '#4b5563', marginTop: 4, marginBottom: 18 }}>
        {t('region_crops.desc_prefix')}{' '}
        <Link to="/saige">{t('region_crops.desc_link')}</Link>.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {MODES.map(([k, lbl]) => (
          <button key={k} onClick={() => setMode(k)} style={{
            padding: '6px 12px', borderRadius: 999, border: '1px solid #d1d5db',
            background: mode === k ? '#14532d' : '#ffffff',
            color: mode === k ? '#ffffff' : '#1f2937', cursor: 'pointer', fontSize: 13
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        {mode === 'climate' && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: '#374151' }}>{t('region_crops.label_climate')}</label>
              <select value={climate} onChange={(e) => setClimate(e.target.value)} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4, textTransform: 'capitalize' }}>
                <option value="">{t('region_crops.select_placeholder')}</option>
                {climates.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={fetchRecs} disabled={!climate || loading} style={{ padding: '10px 18px', background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, cursor: (!climate || loading) ? 'not-allowed' : 'pointer', opacity: (!climate || loading) ? 0.5 : 1 }}>{t('region_crops.btn_recommend')}</button>
          </div>
        )}
        {mode === 'zone' && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: '#374151' }}>{t('region_crops.label_zone')}</label>
              <select value={zone} onChange={(e) => setZone(e.target.value)} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}>
                <option value="">{t('region_crops.select_placeholder')}</option>
                {ZONES.map(z => <option key={z} value={z}>{t('region_crops.zone_option', { z })}</option>)}
              </select>
            </div>
            <button onClick={fetchRecs} disabled={!zone || loading} style={{ padding: '10px 18px', background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, cursor: (!zone || loading) ? 'not-allowed' : 'pointer', opacity: (!zone || loading) ? 0.5 : 1 }}>{t('region_crops.btn_recommend')}</button>
          </div>
        )}
        {mode === 'latlon' && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 160px' }}>
              <label style={{ fontSize: 13, color: '#374151' }}>{t('region_crops.label_lat')}</label>
              <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder={t('region_crops.placeholder_lat')} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label style={{ fontSize: 13, color: '#374151' }}>{t('region_crops.label_lon')}</label>
              <input type="number" step="any" value={lon} onChange={(e) => setLon(e.target.value)} placeholder={t('region_crops.placeholder_lon')} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
            </div>
            <button onClick={fetchRecs} disabled={!lat || !lon || loading} style={{ padding: '10px 18px', background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, cursor: (!lat || !lon || loading) ? 'not-allowed' : 'pointer', opacity: (!lat || !lon || loading) ? 0.5 : 1 }}>{t('region_crops.btn_recommend')}</button>
          </div>
        )}
      </div>

      {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{err}</div>}
      {loading && <div style={{ color: '#6b7280' }}>{t('region_crops.loading')}</div>}

      {result && !loading && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 17, fontWeight: 700, textTransform: 'capitalize', marginBottom: 2 }}>
            {t('region_crops.result_climate', { climate: result.climate })}
          </div>
          <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 14 }}>{t('region_crops.result_source', { source: result.source })}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {(result.crops || []).map((c, i) => (
              <div key={i} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 10 }}>
                <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{c.name}</div>
                <div style={{ fontSize: 13, color: '#4b5563', marginTop: 2 }}>{c.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
