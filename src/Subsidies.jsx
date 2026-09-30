import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

export default function Subsidies() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('US');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`${SAIGE_API}/subsidies/countries`)
      .then(r => r.json())
      .then(j => setCountries(j?.countries || ['US']))
      .catch(() => setCountries(['US']));
  }, []);

  useEffect(() => {
    fetch(`${SAIGE_API}/subsidies/categories?country=${encodeURIComponent(country)}`)
      .then(r => r.json())
      .then(j => setCategories(j?.categories || []))
      .catch(() => setErr(t('subsidies.err_no_service')));
    search(category, keyword, country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const search = async (c = category, k = keyword, cc = country) => {
    setLoading(true);
    setErr('');
    try {
      const params = new URLSearchParams();
      if (cc) params.set('country', cc);
      if (c) params.set('category', c);
      if (k) params.set('keyword', k);
      params.set('limit', '50');
      const r = await fetch(`${SAIGE_API}/subsidies?${params.toString()}`);
      const j = await r.json();
      if (j?.status === 'ok') setPrograms(j.programs || []);
      else setErr(t('subsidies.err_lookup'));
    } catch {
      setErr(t('subsidies.err_lookup'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 36, height: 36 }} />
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#14532d' }}>{t('subsidies.heading')}</h1>
      </div>
      <p style={{ color: '#4b5563', marginTop: 4, marginBottom: 18 }}>
        {t('subsidies.desc_prefix')}{' '}
        <Link to="/saige">{t('subsidies.desc_link')}</Link>.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 14 }}>
        <div style={{ flex: '0 0 120px' }}>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('subsidies.label_country')}</label>
          <select value={country} onChange={(e) => { setCountry(e.target.value); setCategory(''); }} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }}>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('subsidies.label_category')}</label>
          <select value={category} onChange={(e) => { setCategory(e.target.value); search(e.target.value, keyword); }} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4, textTransform: 'capitalize' }}>
            <option value="">{t('subsidies.category_all')}</option>
            {categories.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div style={{ flex: '2 1 260px' }}>
          <label style={{ fontSize: 13, color: '#374151' }}>{t('subsidies.label_keyword')}</label>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search(category, keyword); }} placeholder={t('subsidies.keyword_placeholder')} style={{ display: 'block', width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
        </div>
        <button onClick={() => search(category, keyword)} disabled={loading} style={{ padding: '10px 18px', background: '#14532d', color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer' }}>{t('subsidies.btn_search')}</button>
      </div>

      {err && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 10, borderRadius: 8 }}>{err}</div>}
      {loading && <div style={{ color: '#6b7280' }}>{t('subsidies.loading')}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {programs.map(p => (
          <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#14532d' }}>{p.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{p.agency} • {p.category.replace(/_/g, ' ')}</div>
            <div style={{ fontSize: 13, marginBottom: 6 }}><strong>{t('subsidies.field_who')}</strong> {p.who}</div>
            <div style={{ fontSize: 13, marginBottom: 6 }}><strong>{t('subsidies.field_what')}</strong> {p.what}</div>
            <div style={{ fontSize: 13, marginBottom: 6 }}><strong>{t('subsidies.field_typical_award')}</strong> {p.typical_award}</div>
            <div style={{ fontSize: 13, marginBottom: 6 }}><strong>{t('subsidies.field_how')}</strong> {p.how}</div>
            <div style={{ fontSize: 13, marginBottom: 6 }}><strong>{t('subsidies.field_deadline')}</strong> {p.deadline}</div>
            <a href={p.url} target="_blank" rel="noreferrer" style={{ color: '#0f766e', fontSize: 13, fontWeight: 600 }}>{t('subsidies.btn_official')}</a>
          </div>
        ))}
        {!loading && programs.length === 0 && <div style={{ color: '#6b7280' }}>{t('subsidies.no_programs')}</div>}
      </div>
    </div>
  );
}
