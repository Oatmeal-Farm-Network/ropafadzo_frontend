import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from './useUserProfile.js';

const CLIMATES = [
  'tropical', 'subtropical', 'arid', 'semi_arid',
  'temperate_maritime', 'temperate_continental', 'cold', 'mountain',
];
const ZONES = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

export default function SaigeProfile() {
  const { t } = useTranslation();
  const { profile, setProfile, clearProfile } = useUserProfile();
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [zone, setZone] = useState(profile.zone);
  const [climate, setClimate] = useState(profile.climate);
  const [lat, setLat] = useState(profile.lat || '');
  const [lon, setLon] = useState(profile.lon || '');
  const [crops, setCrops] = useState((profile.crops || []).join(', '));
  const [saved, setSaved] = useState(false);

  const save = () => {
    setProfile({
      city, state, zone, climate,
      lat: lat ? +lat : null,
      lon: lon ? +lon : null,
      crops: crops.split(',').map(s => s.trim()).filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(+pos.coords.latitude.toFixed(4));
      setLon(+pos.coords.longitude.toFixed(4));
    });
  };

  const input = { padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, width: '100%' };
  const labelStyle = { fontSize: 13, color: '#374151', marginBottom: 4, display: 'block' };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 36, height: 36 }} />
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#14532d' }}>{t('saige_profile.heading')}</h1>
      </div>
      <p style={{ color: '#4b5563', marginTop: 4, marginBottom: 18 }}>
        {t('saige_profile.desc_prefix')}
        <Link to="/saige"> {t('saige_profile.desc_link')}</Link>.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        <div>
          <label style={labelStyle}>{t('saige_profile.label_city')}</label>
          <input value={city} onChange={e => setCity(e.target.value)} style={input} placeholder={t('saige_profile.placeholder_city')} />
        </div>
        <div>
          <label style={labelStyle}>{t('saige_profile.label_state')}</label>
          <input value={state} onChange={e => setState(e.target.value.toUpperCase())} style={input} placeholder={t('saige_profile.placeholder_state')} maxLength={2} />
        </div>
        <div>
          <label style={labelStyle}>{t('saige_profile.label_zone')}</label>
          <select value={zone} onChange={e => setZone(e.target.value)} style={input}>
            <option value="">—</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('saige_profile.label_climate')}</label>
          <select value={climate} onChange={e => setClimate(e.target.value)} style={input}>
            <option value="">—</option>
            {CLIMATES.map(c => <option key={c} value={c}>{t('saige_profile.climate_' + c, { defaultValue: c.replace(/_/g, ' ') })}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t('saige_profile.label_lat')}</label>
          <input value={lat} onChange={e => setLat(e.target.value)} style={input} placeholder={t('saige_profile.placeholder_lat')} />
        </div>
        <div>
          <label style={labelStyle}>{t('saige_profile.label_lon')}</label>
          <input value={lon} onChange={e => setLon(e.target.value)} style={input} placeholder={t('saige_profile.placeholder_lon')} />
        </div>
      </div>
      <button onClick={useMyLocation} style={{ marginTop: 8, padding: '6px 12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
        {t('saige_profile.btn_use_location')}
      </button>

      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>{t('saige_profile.label_crops')}</label>
        <input
          value={crops}
          onChange={e => setCrops(e.target.value)}
          style={input}
          placeholder={t('saige_profile.placeholder_crops')}
        />
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={save} style={{ padding: '10px 20px', background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          {t('saige_profile.btn_save')}
        </button>
        <button onClick={clearProfile} style={{ padding: '10px 20px', background: '#fff', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 8, cursor: 'pointer' }}>
          {t('saige_profile.btn_clear')}
        </button>
        {saved && <span style={{ color: '#14532d', fontWeight: 600 }}>{t('saige_profile.saved')}</span>}
      </div>
    </div>
  );
}
