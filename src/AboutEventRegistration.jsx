import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const ACCENT = '#3D6B34';

const S16 = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const ICONS = {
  ticket:   <S16><rect x="1" y="4" width="14" height="8" rx="1"/><line x1="5" y1="4" x2="5" y2="12" strokeDasharray="1.5 1.5"/><line x1="11" y1="4" x2="11" y2="12" strokeDasharray="1.5 1.5"/></S16>,
  meals:    <S16><path d="M5 2v5a3 3 0 0 0 6 0V2"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="5" y1="14" x2="11" y2="14"/></S16>,
  page:     <S16><rect x="2" y="1" width="12" height="14" rx="1"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="8" y2="11"/></S16>,
  checkin:  <S16><path d="M10 2H6a1 1 0 0 0-1 1v1H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-1V3a1 1 0 0 0-1-1z"/><polyline points="6 8 7.5 9.5 10 7"/></S16>,
  judge:    <S16><path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5z"/></S16>,
  speaker:  <S16><circle cx="8" cy="5" r="2.5"/><path d="M3 14c0-3.3 2.2-5 5-5s5 1.7 5 5"/><line x1="12" y1="2" x2="15" y2="2"/><line x1="12" y1="5" x2="15" y2="5"/></S16>,
  chart:    <S16><rect x="2" y="10" width="3" height="4"/><rect x="6.5" y="6" width="3" height="8"/><rect x="11" y="3" width="3" height="11"/><line x1="1" y1="14" x2="15" y2="14"/></S16>,
  mail:     <S16><rect x="1" y="3" width="14" height="10" rx="1"/><path d="M1 4l7 5 7-5"/></S16>,
  badge:    <S16><rect x="4" y="1" width="8" height="5" rx="1"/><path d="M4 4H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2"/><line x1="8" y1="9" x2="8" y2="11"/><circle cx="8" cy="7.5" r="0.8" fill="currentColor" stroke="none"/></S16>,
  cert:     <S16><rect x="1" y="3" width="14" height="10" rx="1"/><circle cx="8" cy="8" r="2.5"/><line x1="5" y1="12" x2="5" y2="14"/><line x1="11" y1="12" x2="11" y2="14"/></S16>,
  stripe:   <S16><rect x="1" y="4" width="14" height="9" rx="1"/><line x1="1" y1="7" x2="15" y2="7"/><line x1="4" y1="10.5" x2="7" y2="10.5"/></S16>,
};

const S = (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}/>;
const TYPE_ICONS = [
  <S><ellipse cx="12" cy="14" rx="7" ry="5"/><path d="M5 14c0-1-1-3-1-5a3 3 0 0 1 6 0"/><path d="M19 14c0-1 1-3 1-5a3 3 0 0 0-6 0"/></S>,
  <S><path d="M4 4l16 16"/><circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/></S>,
  <S><path d="M8 21l2-5 2 5 2-5 2 5"/><path d="M4 7h16"/><path d="M6 7V4h12v3"/></S>,
  <S><path d="M12 2a3 3 0 0 0 0 6"/><rect x="9" y="8" width="6" height="8" rx="1"/><path d="M7 15v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2"/></S>,
  <S><path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.64 15L22 10.36"/><path d="M2 18L6 22"/></S>,
  <S><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></S>,
  <S><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></S>,
  <S><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></S>,
  <S><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></S>,
  <S><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></S>,
  <S><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></S>,
  <S><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></S>,
  <S><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></S>,
  <S><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></S>,
];

const FEAT_ICONS = [
  ICONS.ticket, ICONS.page, ICONS.checkin, ICONS.judge,
  ICONS.speaker, ICONS.cert, ICONS.badge, ICONS.chart, ICONS.stripe, ICONS.mail,
];

export default function AboutEventRegistration() {
  const { t } = useTranslation();

  const eventTypes = TYPE_ICONS.map((icon, i) => ({
    icon,
    label: t(`event_reg_about.type${i + 1}_label`),
    desc:  t(`event_reg_about.type${i + 1}_desc`),
  }));

  const features = FEAT_ICONS.map((icon, i) => ({
    icon,
    title: t(`event_reg_about.feat${i + 1}_title`),
    body:  t(`event_reg_about.feat${i + 1}_body`),
  }));

  const stats = [
    { v: t('event_reg_about.stat1_v'), l: t('event_reg_about.stat1_l') },
    { v: t('event_reg_about.stat2_v'), l: t('event_reg_about.stat2_l') },
    { v: t('event_reg_about.stat3_v'), l: t('event_reg_about.stat3_l') },
    { v: t('event_reg_about.stat4_v'), l: t('event_reg_about.stat4_l') },
  ];

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Event Registration | Oatmeal Farm Network"
        description="Turnkey event registration for livestock shows, fiber festivals, farm tours, auctions, conferences, competitions, and every other type of ag event."
        canonical="https://oatmealfarmnetwork.com/event-registration"
      />
      <Header />

      {/* ── Hero ── */}
      <div className="mx-auto px-4 pt-2 md:pt-6 w-full" style={{ maxWidth: '1300px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: t('event_reg_about.hero_title') },
        ]} />

        <div className="relative w-full overflow-hidden rounded-xl rounded-b-none md:rounded-b-xl">
          <img
            src="/images/CoreFeaturesEventRegistration.webp"
            alt={t('event_reg_about.hero_title')}
            className="w-full object-cover block h-[160px] md:h-[250px]"
            loading="eager"
            onError={e => { e.target.onerror = null; e.target.src = '/images/OFNEvents.webp'; }}
          />
          <div
            className="hidden md:block absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 45%, rgba(255,255,255,0) 75%)' }}
          />
          <div className="hidden md:flex absolute inset-0 flex-col justify-center px-8 py-6" style={{ maxWidth: '780px' }}>
            <h1 style={{ color: '#000000', fontFamily: "'Lora','Times New Roman',serif", fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px', lineHeight: 1.2 }}>
              {t('event_reg_about.hero_title')}
            </h1>
            <p style={{ color: '#111111', fontSize: '0.92rem', margin: '0 0 16px', lineHeight: 1.6 }}>
              {t('event_reg_about.hero_body')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/events/add"
                className="font-bold px-5 py-2 rounded-lg text-white text-sm transition hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                {t('event_reg_about.hero_cta1')}
              </Link>
              <Link
                to="/events"
                className="font-bold px-5 py-2 rounded-lg border-2 text-sm transition hover:bg-gray-50"
                style={{ color: ACCENT, borderColor: ACCENT }}
              >
                {t('event_reg_about.hero_cta2')}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile: text below image */}
        <div className="md:hidden bg-white px-5 py-4 rounded-b-xl border border-t-0 border-gray-200">
          <h1 style={{ color: '#000000', fontFamily: "'Lora','Times New Roman',serif", fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 8px', lineHeight: 1.2 }}>
            {t('event_reg_about.hero_title')}
          </h1>
          <p style={{ color: '#111111', fontSize: '0.85rem', margin: '0 0 12px', lineHeight: 1.6 }}>
            {t('event_reg_about.hero_body')}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/events/add"
              className="font-bold px-4 py-2 rounded-lg text-white text-sm transition hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              {t('event_reg_about.hero_cta1')}
            </Link>
            <Link
              to="/events"
              className="font-bold px-4 py-2 rounded-lg border-2 text-sm transition hover:bg-gray-50"
              style={{ color: ACCENT, borderColor: ACCENT }}
            >
              {t('event_reg_about.hero_cta2')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto px-4 py-8 w-full flex-grow" style={{ maxWidth: '1300px' }}>

        {/* Stats bar */}
        <div className="bg-white border border-gray-200 rounded-xl mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map(s => (
              <div key={s.l} className="text-center py-4 px-2">
                <div className="text-2xl font-bold" style={{ color: ACCENT }}>{s.v}</div>
                <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide font-semibold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What is it */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('event_reg_about.what_title')}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">{t('event_reg_about.what_body')}</p>
        </section>

        {/* Event types */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('event_reg_about.types_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventTypes.map(et => (
              <div
                key={et.label}
                className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md hover:border-[#819360] transition-all duration-200"
              >
                <div className="shrink-0 flex items-center justify-center px-4" style={{ color: ACCENT, minWidth: '56px' }}>
                  {et.icon}
                </div>
                <div className="flex flex-col justify-center px-4 py-4 flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color: ACCENT }}>{et.label}</div>
                  <div className="text-xs text-gray-600 mt-1 leading-relaxed">{et.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features / what's included */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('event_reg_about.included_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map(f => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} body={f.body} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl px-8 py-6">
          <div>
            <h3
              className="font-bold text-gray-900 text-base mb-1"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}
            >
              {t('event_reg_about.cta_title')}
            </h3>
            <p className="text-sm text-gray-600">{t('event_reg_about.cta_body')}</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/events/add"
              className="px-5 py-2.5 rounded-lg text-white font-bold text-sm shadow hover:shadow-md transition"
              style={{ backgroundColor: ACCENT }}
            >
              {t('event_reg_about.cta1')}
            </Link>
            <Link
              to="/events"
              className="px-5 py-2.5 rounded-lg font-bold border-2 text-sm transition hover:bg-gray-50"
              style={{ color: ACCENT, borderColor: ACCENT }}
            >
              {t('event_reg_about.cta2')}
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-lg font-bold border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              {t('event_reg_about.cta3')}
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, body }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-[#819360] transition-all duration-200">
      <div className="flex items-center gap-2 mb-1">
        <span className="flex items-center shrink-0" style={{ color: ACCENT }}>{icon}</span>
        <h3 className="font-bold text-sm text-gray-900">{title}</h3>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{body}</p>
    </div>
  );
}
