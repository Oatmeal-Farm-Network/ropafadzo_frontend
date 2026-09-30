import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

function Pill({ children, color = '#e2e8f0', textColor = '#1f2937' }) {
  return (
    <span style={{
      display: 'inline-block',
      background: color,
      color: textColor,
      fontSize: 12,
      borderRadius: 999,
      padding: '2px 10px',
      marginRight: 6,
      marginBottom: 6,
    }}>{children}</span>
  );
}

function CropCard({ title, list, good }) {
  if (!list || list.length === 0) return null;
  const bg = good ? '#ecfdf5' : '#fef2f2';
  const border = good ? '#86efac' : '#fca5a5';
  const titleColor = good ? '#065f46' : '#991b1b';
  return (
    <div style={{ border: `1px solid ${border}`, background: bg, borderRadius: 10, padding: 14, marginBottom: 12 }}>
      <div style={{ fontWeight: 700, color: titleColor, marginBottom: 8 }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {list.map((item, i) => {
          const [name, reason] = Array.isArray(item) ? item : [item, ''];
          return (
            <li key={`${name}-${i}`} style={{ padding: '4px 0', borderBottom: i === list.length - 1 ? 'none' : '1px dashed #e5e7eb' }}>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{name}</span>
              {reason ? <span style={{ color: '#4b5563' }}> — {reason}</span> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function CompanionPlanting() {
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [selected, setSelected] = useState('');
  const [record, setRecord] = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [error, setError] = useState('');

  const [pairA, setPairA] = useState('');
  const [pairB, setPairB] = useState('');
  const [pairResult, setPairResult] = useState(null);
  const [pairLoading, setPairLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${SAIGE_API}/companion/crops`);
        const j = await res.json();
        if (cancelled) return;
        setCrops(Array.isArray(j?.crops) ? j.crops : []);
      } catch (e) {
        if (!cancelled) setError(t('companion_planting.err_service'));
      } finally {
        if (!cancelled) setLoadingCrops(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handlePick = async (crop) => {
    if (!crop) return;
    setSelected(crop);
    setRecord(null);
    setError('');
    setLoadingRecord(true);
    try {
      const res = await fetch(`${SAIGE_API}/companion/${encodeURIComponent(crop)}`);
      const j = await res.json();
      if (j?.status === 'ok') setRecord(j.record);
      else setError(t('companion_planting.err_no_data', { crop }));
    } catch (e) {
      setError(t('companion_planting.err_lookup_failed'));
    } finally {
      setLoadingRecord(false);
    }
  };

  const handlePairCheck = async () => {
    if (!pairA || !pairB) return;
    setPairLoading(true);
    setPairResult(null);
    try {
      const res = await fetch(`${SAIGE_API}/companion/check/pair?a=${encodeURIComponent(pairA)}&b=${encodeURIComponent(pairB)}`);
      const j = await res.json();
      setPairResult(j?.result || null);
    } catch (e) {
      setPairResult({ verdict: 'error', explanation: t('companion_planting.err_pair_service') });
    } finally {
      setPairLoading(false);
    }
  };

  const verdictStyle = useMemo(() => {
    if (!pairResult) return {};
    const v = pairResult.verdict;
    if (v === 'good') return { background: '#ecfdf5', border: '1px solid #86efac', color: '#065f46' };
    if (v === 'bad') return { background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' };
    if (v === 'neutral') return { background: '#f3f4f6', border: '1px solid #d1d5db', color: '#374151' };
    return { background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412' };
  }, [pairResult]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 36, height: 36 }} />
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#14532d' }}>{t('companion_planting.heading')}</h1>
      </div>
      <p style={{ color: '#4b5563', marginTop: 4, marginBottom: 20 }}>
        {t('companion_planting.desc')} <Link to="/saige">{t('companion_planting.desc_link')}</Link>.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* SINGLE CROP LOOKUP */}
        <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18 }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: 18, fontWeight: 700 }}>{t('companion_planting.section_single')}</h2>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('companion_planting.lbl_choose_crop')}</label>
          <select
            value={selected}
            onChange={(e) => handlePick(e.target.value)}
            disabled={loadingCrops}
            style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4, marginBottom: 14, textTransform: 'capitalize' }}
          >
            <option value="">{loadingCrops ? t('companion_planting.opt_loading') : t('companion_planting.opt_select')}</option>
            {crops.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {loadingRecord && <div style={{ color: '#6b7280' }}>{t('companion_planting.loading')}</div>}

          {record && !loadingRecord && (
            <>
              <CropCard title={t('companion_planting.card_friends')} list={record.friends} good />
              <CropCard title={t('companion_planting.card_foes')} list={record.foes} good={false} />
              {record.notes && (
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, fontSize: 13, color: '#374151' }}>
                  <strong>{t('companion_planting.notes_prefix')}</strong> {record.notes}
                </div>
              )}
            </>
          )}
        </section>

        {/* PAIR CHECK */}
        <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18 }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: 18, fontWeight: 700 }}>{t('companion_planting.section_pair')}</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 140px' }}>
              <label style={{ fontSize: 13, color: '#374151' }}>{t('companion_planting.lbl_crop_a')}</label>
              <input
                list="companion-crops"
                value={pairA}
                onChange={(e) => setPairA(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}
                placeholder={t('companion_planting.placeholder_crop_a')}
              />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label style={{ fontSize: 13, color: '#374151' }}>{t('companion_planting.lbl_crop_b')}</label>
              <input
                list="companion-crops"
                value={pairB}
                onChange={(e) => setPairB(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}
                placeholder={t('companion_planting.placeholder_crop_b')}
              />
            </div>
            <button
              onClick={handlePairCheck}
              disabled={!pairA || !pairB || pairLoading}
              style={{ padding: '9px 14px', background: '#14532d', color: '#fff', borderRadius: 8, border: 'none', cursor: (!pairA || !pairB) ? 'not-allowed' : 'pointer', opacity: (!pairA || !pairB) ? 0.5 : 1 }}
            >
              {pairLoading ? t('companion_planting.btn_checking') : t('companion_planting.btn_check')}
            </button>
          </div>

          <datalist id="companion-crops">
            {crops.map(c => <option key={c} value={c} />)}
          </datalist>

          {pairResult && (
            <div style={{ ...verdictStyle, padding: 12, borderRadius: 10, marginTop: 14 }}>
              <div style={{ fontWeight: 700, textTransform: 'capitalize', marginBottom: 4 }}>
                {t('companion_planting.verdict_prefix')} {pairResult.verdict || 'unknown'}
              </div>
              {pairResult.explanation && <div>{pairResult.explanation}</div>}
            </div>
          )}

          <div style={{ marginTop: 18, fontSize: 13, color: '#6b7280' }}>
            {t('companion_planting.tip')}
          </div>
        </section>
      </div>

      {/* QUICK BROWSE */}
      <section style={{ marginTop: 24, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: 16, fontWeight: 700 }}>{t('companion_planting.section_all')}</h3>
        <div>
          {crops.map(c => (
            <button key={c} onClick={() => handlePick(c)} style={{ background: 'transparent', border: 'none', padding: 0, marginRight: 6, marginBottom: 6, cursor: 'pointer' }}>
              <Pill color={selected === c ? '#14532d' : '#e2e8f0'} textColor={selected === c ? '#ffffff' : '#1f2937'}>{c}</Pill>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
