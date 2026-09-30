import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useIsLoggedIn } from './useIsLoggedIn';

const ACCENT = '#3D6B34';


const STATS_VALUES = ['6', '10+', '24h', '∞'];

export default function AboutPrecisionAg() {
  const { t } = useTranslation();
  const isLoggedIn = useIsLoggedIn();

  const features = [
    { img: '/images/PrecsisionAgSateliteCropMonitoring.webp',        title: t('precision.feat1_title'),  body: t('precision.feat1_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionProfessionalPredictiveClimateStress.webp', title: t('precision.feat2_title'),  body: t('precision.feat2_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionAgSoil&IrragationIntellegence.webp',   title: t('precision.feat3_title'),  body: t('precision.feat3_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionAgGrowingDegreeDays&Maturity.webp',    title: t('precision.feat4_title'),  body: t('precision.feat4_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionAgFieldScouting&ActivityLog.webp',     title: t('precision.feat5_title'),  body: t('precision.feat5_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionAgManagementZones.webp',               title: t('precision.feat6_title'),  body: t('precision.feat6_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionAgYieldForecasting.webp',              title: t('precision.feat7_title'),  body: t('precision.feat7_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionCarbon&CropRotation.webp',             title: t('precision.feat8_title'),  body: t('precision.feat8_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionAgAlerts.webp',                        title: t('precision.feat9_title'),  body: t('precision.feat9_body'),  link: '/oatsense' },
    { img: '/images/PrecsisionProfessionalFieldReport.webp',         title: t('precision.feat10_title'), body: t('precision.feat10_body'), link: '/oatsense' },
  ];

  const stats = [
    { value: STATS_VALUES[0], label: t('precision.stat1_lbl') },
    { value: STATS_VALUES[1], label: t('precision.stat2_lbl') },
    { value: STATS_VALUES[2], label: t('precision.stat3_lbl') },
    { value: STATS_VALUES[3], label: t('precision.stat4_lbl') },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Precision Agriculture | Oatmeal Farm Network"
        description="Satellite crop monitoring, predictive climate stress, soil intelligence, yield forecasting, and more — all in one integrated precision agriculture platform."
        canonical="https://oatmealfarmnetwork.com/platform/precision-ag"
      />
      <Header />

      {/* Breadcrumbs */}
      <div className="mx-auto px-4 pt-4" style={{ maxWidth: '1300px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Our Services', to: '/platform' },
          { label: 'Precision Ag' },
        ]} />
      </div>

      {/* Hero — photo + dark gradient overlay */}
      <div className="mx-auto px-4 pt-2" style={{ maxWidth: '1300px' }}>
        <div className="relative w-full overflow-hidden rounded-xl">
          <img
            src="/images/PrecisionAgBanner.webp"
            alt={t('precision.hero_title')}
            className="w-full object-cover"
            style={{ height: '260px', display: 'block' }}
            loading="eager"
            fetchPriority="high"
            width="1300"
            height="260"
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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffffff' }}>Precision Agriculture</span>
            </div>
            <h1 style={{ color: '#ffffff', fontFamily: "'Lora','Times New Roman',serif", fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px', lineHeight: 1.2 }}>
              {t('precision.hero_title', 'Oatsense — Precision Agriculture')}
            </h1>
            <p style={{ color: '#ffffff', fontSize: '0.92rem', margin: '0 0 16px', lineHeight: 1.6 }}>
              {t('precision.hero_body')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/precision-ag/fields" className="bg-white font-bold px-5 py-2.5 rounded-lg shadow hover:shadow-md transition text-sm" style={{ color: ACCENT }}>
                {t('precision.hero_cta1', 'View My Fields')}
              </Link>
              {!isLoggedIn && (
                <Link to="/signup" className="border-2 font-bold px-5 py-2.5 rounded-lg transition text-sm hover:bg-white/10" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
                  {t('precision.hero_cta2', 'Open an Account')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-auto px-4 pt-4" style={{ maxWidth: '1300px' }}>
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map(s => (
              <div key={s.label} className="text-center py-4 px-2">
                <div className="text-2xl font-bold" style={{ color: ACCENT }}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto px-4 py-8" style={{ maxWidth: '1300px' }}>

        {/* What is it */}
        <section className="mb-8">
          <h2
            className="text-lg font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'Lora','Times New Roman',serif" }}
          >
            {t('precision.what_title')}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">{t('precision.what_body')}</p>
        </section>

        {/* Features grid */}
        <h2
          className="text-lg font-bold text-gray-900 mb-5"
          style={{ fontFamily: "'Lora','Times New Roman',serif" }}
        >
          {t('precision.included_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {features.map((f, i) => (
            <ToolCard key={i} img={f.img} title={f.title} body={f.body} link={f.link} />
          ))}
        </div>

        {/* How it works */}
        <h2
          className="text-lg font-bold text-gray-900 mb-5"
          style={{ fontFamily: "'Lora','Times New Roman',serif" }}
        >
          {t('precision.how_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <StepCard n="1" title={t('precision.step1_title')} body={t('precision.step1_body')} />
          <StepCard n="2" title={t('precision.step2_title')} body={t('precision.step2_body')} />
          <StepCard n="3" title={t('precision.step3_title')} body={t('precision.step3_body')} />
        </div>

        {/* Bottom CTA — matching /for-farms banner style */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4
                     bg-white border border-gray-200 rounded-xl px-8 py-6"
        >
          <div>
            <h3
              className="font-bold text-gray-900 text-base mb-1"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}
            >
              {t('precision.cta_title')}
            </h3>
            <p className="text-sm text-gray-600">{t('precision.cta_body')}</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/oatsense"
              className="px-5 py-2.5 rounded-lg text-white font-bold text-sm shadow hover:shadow-md transition"
              style={{ backgroundColor: ACCENT }}
            >
              {t('precision.cta1')}
            </Link>
            {!isLoggedIn && (
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-lg font-bold border-2 text-sm transition hover:bg-gray-50"
                style={{ color: ACCENT, borderColor: ACCENT }}
              >
                {t('precision.cta2')}
              </Link>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

// ── ToolCard — matches /for-farms horizontal card style ──────────────
function ToolCard({ img, title, body, link }) {
  return (
    <div className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md hover:border-[#819360] transition-all duration-200">
      <Link
        to={link}
        className="shrink-0"
        style={{ width: '155px', minHeight: '155px' }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <img
          src={img}
          alt=""
          className="w-full h-full object-cover"
          style={{ display: 'block', minHeight: '155px' }}
        />
      </Link>
      <div className="flex flex-col justify-between px-5 py-4 flex-1 min-w-0">
        <div>
          <Link
            to={link}
            className="font-bold text-sm hover:underline"
            style={{ color: ACCENT }}
          >
            {title}
          </Link>
          <p className="text-xs text-gray-600 leading-relaxed mt-1">{body}</p>
        </div>
      </div>
    </div>
  );
}

// ── StepCard — matches white card style ──────────────────────────────
function StepCard({ n, title, body }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-5 shadow-sm">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3"
        style={{ backgroundColor: ACCENT }}
      >
        {n}
      </div>
      <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600 leading-relaxed">{body}</p>
    </div>
  );
}
