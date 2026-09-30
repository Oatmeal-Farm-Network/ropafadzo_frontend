import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, useLanguage } from './LanguageContext';

const REGION_ORDER = [
  'Americas & British Isles',
  'Western Europe',
  'Northern Europe',
  'Eastern & Central Europe',
  'Mediterranean & Near East',
  'South Asia',
  'Southeast & East Asia',
  'East Africa',
];

function groupByRegion(list) {
  const map = {};
  for (const lang of list) {
    if (!map[lang.region]) map[lang.region] = [];
    map[lang.region].push(lang);
  }
  return map;
}

export default function LanguageSelector() {
  const { t } = useTranslation();
  const { language, setLanguage, nativeName } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const modalRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onClickOut = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOut);
    };
  }, [open]);

  const filtered = query.trim()
    ? LANGUAGES.filter(l =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.native.toLowerCase().includes(query.toLowerCase())
      )
    : LANGUAGES;

  const grouped = groupByRegion(filtered);
  const regions = REGION_ORDER.filter(r => grouped[r]?.length > 0);

  const pick = (code) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Change language"
        aria-label="Change language"
        className="flex items-center gap-1 text-white/80 hover:text-white transition-colors text-xs font-medium"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 6 }}
      >
        <GlobeIcon />
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            ref={modalRef}
            style={{
              background: '#fff',
              borderRadius: 14,
              width: '100%',
              maxWidth: 540,
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px -10px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px 12px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}>
              <GlobeIcon color="#374151" size={20} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#111827', fontFamily: 'Montserrat, sans-serif' }}>
                  {t('lang.title')}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: '#6b7280', fontFamily: 'Montserrat, sans-serif' }}>
                  {t('lang.subtitle')}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: '#f3f4f6', border: 'none', borderRadius: 8,
                  width: 30, height: 30, cursor: 'pointer',
                  fontSize: 16, color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>

            {/* Search */}
            <div style={{ padding: '12px 20px 8px', flexShrink: 0 }}>
              <input
                ref={searchRef}
                type="text"
                placeholder={t('lang.search_placeholder')}
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: 'Montserrat, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Language list */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '4px 20px 16px' }}>
              {regions.length === 0 && (
                <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', padding: '24px 0', fontFamily: 'Montserrat, sans-serif' }}>
                  {t('lang.no_results', { query })}
                </p>
              )}
              {regions.map(region => (
                <div key={region} style={{ marginBottom: 16 }}>
                  <p style={{
                    margin: '12px 0 6px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
                    {region}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 8px' }}>
                    {grouped[region].map(lang => {
                      const active = lang.code === language;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => pick(lang.code)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '7px 10px',
                            borderRadius: 8,
                            border: active ? '1.5px solid #3D6B34' : '1.5px solid transparent',
                            background: active ? '#f0f7ee' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f9fafb'; }}
                          onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#3D6B34' : '#111827', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {lang.native}
                            </div>
                            <div style={{ fontSize: 10.5, color: '#6b7280', fontFamily: 'Montserrat, sans-serif' }}>
                              {lang.name}
                            </div>
                          </div>
                          {active && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D6B34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GlobeIcon({ color = 'currentColor', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
