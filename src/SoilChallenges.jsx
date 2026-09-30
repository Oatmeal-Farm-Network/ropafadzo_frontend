import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RelatedSuggestions from './RelatedSuggestions.jsx';
import { useUserProfile } from './useUserProfile.js';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

const FIELD_KEYS = [
  { key: 'ph',                 unitKey: '',             hintKey: 'hint_ph' },
  { key: 'organic_matter_pct', unitKey: 'unit_pct',     hintKey: 'hint_organic_matter_pct' },
  { key: 'nitrogen_ppm',       unitKey: 'unit_ppm',     hintKey: 'hint_nitrogen_ppm' },
  { key: 'phosphorus_ppm',     unitKey: 'unit_ppm',     hintKey: 'hint_phosphorus_ppm' },
  { key: 'potassium_ppm',      unitKey: 'unit_ppm',     hintKey: 'hint_potassium_ppm' },
  { key: 'cec_meq',            unitKey: 'unit_meq',     hintKey: 'hint_cec_meq' },
  { key: 'salinity_dsm',       unitKey: 'unit_dsm',     hintKey: 'hint_salinity_dsm' },
  { key: 'moisture_pct',       unitKey: 'unit_pct',     hintKey: 'hint_moisture_pct' },
  { key: 'bulk_density_gcc',   unitKey: 'unit_gcc',     hintKey: 'hint_bulk_density_gcc' },
  { key: 'sodium_pct_cec',     unitKey: 'unit_pct_cec', hintKey: 'hint_sodium_pct_cec' },
];

const CROP_OVERRIDES = [
  '', 'blueberry', 'cranberry', 'azalea', 'rhododendron', 'potato', 'alfalfa', 'asparagus', 'rice',
];

export default function SoilChallenges() {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const [values, setValues] = useState({});
  const [crop, setCrop] = useState((profile.crops && profile.crops[0]) || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const FIELDS = FIELD_KEYS.map(f => ({
    key: f.key,
    label: t('soil_challenges.field_' + f.key),
    unit: f.unitKey ? t('soil_challenges.' + f.unitKey) : '',
    hint: t('soil_challenges.' + f.hintKey),
  }));

  const assess = async () => {
    const payload = {
      crop: crop || null,
      user_id: String(JSON.parse(localStorage.getItem('ofnUser') || '{}')?.PeopleID || 'anon'),
    };
    for (const f of FIELDS) {
      const v = values[f.key];
      if (v !== undefined && v !== '' && !isNaN(parseFloat(v))) {
        payload[f.key] = parseFloat(v);
      }
    }
    setLoading(true);
    setResult(null);
    setErr('');
    try {
      const r = await fetch(`${SAIGE_API}/soil/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      setResult(j);
    } catch {
      setErr(t('soil_challenges.err_assessment'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 36, height: 36 }} />
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#14532d' }}>{t('soil_challenges.heading')}</h1>
      </div>
      <p style={{ color: '#4b5563', marginTop: 4, marginBottom: 18 }}>
        {t('soil_challenges.desc_prefix')}
        <Link to="/saige"> {t('soil_challenges.desc_link')}</Link>.
      </p>

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 13, color: '#374151' }}>{t('soil_challenges.label_crop')}</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}>
              {CROP_OVERRIDES.map(c => <option key={c} value={c}>{c ? c : t('soil_challenges.crop_general')}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {FIELDS.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 13, color: '#374151' }}>{f.label} {f.unit && <span style={{ color: '#9ca3af' }}>({f.unit})</span>}</label>
              <input
                type="number"
                step="any"
                value={values[f.key] ?? ''}
                onChange={(e) => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.hint}
                style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={assess} disabled={loading} style={{ padding: '10px 20px', background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? t('soil_challenges.btn_loading') : t('soil_challenges.btn_assess')}
          </button>
        </div>
      </div>

      {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 10, borderRadius: 8 }}>{err}</div>}

      {result && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{result.headline}</div>
          {Array.isArray(result.challenges) && result.challenges.map((c, i) => (
            <div key={i} style={{
              background: c.severity === 'severe' ? '#fef2f2' : '#fefce8',
              border: c.severity === 'severe' ? '1px solid #fca5a5' : '1px solid #fde047',
              borderRadius: 10, padding: 12, marginBottom: 10
            }}>
              <div style={{ fontWeight: 700, color: c.severity === 'severe' ? '#991b1b' : '#854d0e', marginBottom: 4 }}>
                {c.summary} <span style={{ fontWeight: 400 }}>{t('soil_challenges.value_label', { value: c.value })}</span>
              </div>
              <ul style={{ margin: '6px 0 0 0', paddingLeft: 20, lineHeight: 1.5 }}>
                {(c.remediation || []).map((step, k) => <li key={k} style={{ marginBottom: 3 }}>{step}</li>)}
              </ul>
            </div>
          ))}
          <RelatedSuggestions
            heading={t('soil_challenges.related_heading')}
            items={result.related_suggestions || []}
          />
        </div>
      )}
    </div>
  );
}
