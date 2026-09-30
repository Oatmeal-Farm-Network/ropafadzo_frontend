// src/AboutCropMonitor.jsx
// Route: /platform/crop-monitor
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const ACCENT = '#2563EB';

export default function AboutCropMonitor() {
  const { t } = useTranslation();

  const S = (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}/>;
  const features = [
    { icon: <S><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/><path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"/></S>, titleKey: 'feat1_title', bodyKey: 'feat1_body' },
    { icon: <S><path d="M7 20s4-6 4-10a4 4 0 0 0-8 0c0 4 4 10 4 10z"/><path d="M7 20h10"/><path d="M13 12s2-3 5-3"/></S>, titleKey: 'feat2_title', bodyKey: 'feat2_body' },
    { icon: <S><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></S>, titleKey: 'feat3_title', bodyKey: 'feat3_body' },
    { icon: <S><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></S>, titleKey: 'feat4_title', bodyKey: 'feat4_body' },
    { icon: <S><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></S>, titleKey: 'feat5_title', bodyKey: 'feat5_body' },
    { icon: <S><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></S>, titleKey: 'feat6_title', bodyKey: 'feat6_body' },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Crop Monitor | Oatmeal Farm Network"
        description="Field-level imagery and crop-health analytics built on satellite and drone data. NDVI, moisture, crop detection, and season-over-season trends."
        canonical="https://oatmealfarmnetwork.com/platform/crop-monitor"
      />
      <Header />

      {/* Breadcrumbs */}
      <div className="mx-auto px-4 pt-4" style={{ maxWidth: '1300px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Our Services', to: '/platform' },
          { label: t('crop_monitor.hero_title') },
        ]} />
      </div>

      {/* Hero — photo + gradient overlay */}
      <div className="mx-auto px-4 pt-2" style={{ maxWidth: '1300px' }}>
        <div className="relative w-full overflow-hidden rounded-xl">
          <img
            src="/images/CoreFeaturesPrecisionAg.webp"
            alt="Crop Monitor"
            className="w-full object-cover"
            style={{ height: '260px', display: 'block' }}
            loading="eager"
            onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(15,55,150,0.92) 0%, rgba(15,55,150,0.75) 45%, rgba(15,55,150,0) 78%)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8 py-6" style={{ maxWidth: '720px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/><path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10"/></svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffffff' }}>{t('crop_monitor.hero_badge')}</span>
            </div>
            <h1 style={{ color: '#ffffff', fontFamily: "'Lora','Times New Roman',serif", fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px', lineHeight: 1.2 }}>
              {t('crop_monitor.hero_title')}
            </h1>
            <p style={{ color: '#ffffff', fontSize: '0.92rem', margin: '0 0 16px', lineHeight: 1.6 }}>
              {t('crop_monitor.hero_body')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/precision-ag/fields" className="bg-white font-bold px-5 py-2.5 rounded-lg shadow hover:shadow-md transition text-sm" style={{ color: ACCENT }}>
                {t('crop_monitor.hero_cta1')}
              </Link>
              <Link to="/precision-ag/add" className="border-2 font-bold px-5 py-2.5 rounded-lg transition text-sm hover:bg-white/10" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
                {t('crop_monitor.hero_cta2')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8" style={{ maxWidth: '1300px' }}>

        <section className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('crop_monitor.what_title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">{t('crop_monitor.what_body')}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('crop_monitor.included_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map(f => (
              <Feature key={f.titleKey} icon={f.icon}
                title={t(`crop_monitor.${f.titleKey}`)}
                body={t(`crop_monitor.${f.bodyKey}`)} />
            ))}
          </div>
        </section>

        <section className="mt-10 text-center bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('crop_monitor.cta_title')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{t('crop_monitor.cta_body')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/precision-ag/fields"
              className="px-6 py-3 rounded-lg text-white font-bold shadow hover:shadow-md transition"
              style={{ backgroundColor: ACCENT }}>
              {t('crop_monitor.cta1')}
            </Link>
            <Link to="/precision-ag/visualizations"
              className="px-6 py-3 rounded-lg border-2 font-bold transition"
              style={{ borderColor: ACCENT, color: ACCENT }}>
              {t('crop_monitor.cta2')}
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

function Feature({ icon, title, body }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{body}</p>
    </div>
  );
}
