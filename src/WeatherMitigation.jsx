import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

const PHASE_KEYS = ['planning', 'imminent', 'active', 'recovery'];

export default function WeatherMitigation() {
  const { t } = useTranslation();
  const [hazards, setHazards] = useState([]);
  const [hazard, setHazard] = useState('');
  const [phase, setPhase] = useState('imminent');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const PHASES = PHASE_KEYS.map(key => ({ key, label: t('weather_mitigation.phase_' + key) }));

  useEffect(() => {
    fetch(`${SAIGE_API}/mitigation/hazards`)
      .then(r => r.json())
      .then(j => setHazards(j?.hazards || []))
      .catch(() => setErr(t('weather_mitigation.err_no_service')));
  }, []);

  const fetchPlan = async (h, p) => {
    if (!h) return;
    setLoading(true);
    setPlan(null);
    setErr('');
    try {
      const r = await fetch(`${SAIGE_API}/mitigation/${encodeURIComponent(h)}?phase=${encodeURIComponent(p)}`);
      const j = await r.json();
      if (j?.status === 'ok') setPlan(j.plan);
      else setErr(t('weather_mitigation.err_no_plan'));
    } catch {
      setErr(t('weather_mitigation.err_lookup'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 36, height: 36 }} />
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#14532d' }}>{t('weather_mitigation.heading')}</h1>
      </div>
      <p style={{ color: '#4b5563', marginTop: 4, marginBottom: 18 }}>
        {t('weather_mitigation.desc_prefix')}{' '}
        <Link to="/saige">{t('weather_mitigation.desc_link')}</Link>.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
        <div style={{ flex: '1 1 240px' }}>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('weather_mitigation.label_hazard')}</label>
          <select
            value={hazard}
            onChange={(e) => { setHazard(e.target.value); fetchPlan(e.target.value, phase); }}
            style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4, textTransform: 'capitalize' }}
          >
            <option value="">{t('weather_mitigation.select_hazard')}</option>
            {hazards.map(h => (
              <option key={h} value={h}>{h.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1 1 240px' }}>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('weather_mitigation.label_phase')}</label>
          <select
            value={phase}
            onChange={(e) => { setPhase(e.target.value); if (hazard) fetchPlan(hazard, e.target.value); }}
            style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}
          >
            {PHASES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{err}</div>}
      {loading && <div style={{ color: '#6b7280' }}>{t('weather_mitigation.loading')}</div>}

      {plan && !loading && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 700, textTransform: 'capitalize', marginBottom: 2 }}>
            {plan.hazard.replace(/_/g, ' ')} — {t('weather_mitigation.phase_' + plan.phase, { defaultValue: plan.phase })}
          </div>
          {plan.steps.length === 0 ? (
            <div style={{ color: '#6b7280', marginTop: 10 }}>
              {t('weather_mitigation.no_steps')}{' '}
              {plan.all_phases.filter(p => p !== plan.phase).map(p => (
                <button key={p} onClick={() => { setPhase(p); fetchPlan(plan.hazard, p); }} style={{ marginLeft: 4, background: '#e2e8f0', border: 'none', padding: '3px 10px', borderRadius: 999, cursor: 'pointer', fontSize: 12 }}>
                  {t('weather_mitigation.phase_' + p, { defaultValue: p })}
                </button>
              ))}
            </div>
          ) : (
            <ol style={{ margin: '12px 0 0 0', paddingLeft: 22, lineHeight: 1.55 }}>
              {plan.steps.map((s, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{s}</li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
