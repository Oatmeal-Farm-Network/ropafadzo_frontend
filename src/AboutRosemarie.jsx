// src/AboutRosemarie.jsx
// Route: /platform/rosemarie
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import RosemarieChat from './RosemarieChat';
import { useIsLoggedIn } from './useIsLoggedIn';

const ACCENT = '#8B5CF6';

export default function AboutRosemarie() {
  const { t } = useTranslation();
  const isLoggedIn = useIsLoggedIn();

  const S = (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}/>;

  const forItems = [
    { icon: <S><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></S>, label: t('rosemarie.for1') },
    { icon: <S><path d="M3 12C3 7 7 4 12 4s9 3 9 8v8H3v-8z"/><path d="M12 4v2"/></S>, label: t('rosemarie.for2') },
    { icon: <S><path d="M2 16l10-12 10 12H2z"/><line x1="2" y1="16" x2="22" y2="16"/></S>, label: t('rosemarie.for3') },
    { icon: <S><path d="M7 20s4-6 4-10a4 4 0 0 0-8 0c0 4 4 10 4 10z"/><path d="M7 20h10"/><path d="M13 12s2-3 5-3"/></S>, label: t('rosemarie.for4') },
    { icon: <S><path d="M12 2c0 0-6 6-6 11a6 6 0 0 0 12 0c0-5-6-11-6-11z"/></S>, label: t('rosemarie.for5') },
    { icon: <S><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/></S>, label: t('rosemarie.for6') },
    { icon: <S><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/><line x1="15" y1="9" x2="15" y2="21"/></S>, label: t('rosemarie.for7') },
    { icon: <S><path d="M6 13L5 21l7-4 7 4-1-8"/><path d="M5 4l7 4 7-4"/><path d="M5 4v9m14-9v9"/></S>, label: t('rosemarie.for8') },
  ];

  const capabilities = [
    { icon: <S><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></S>, title: t('rosemarie.cap1_title'), body: t('rosemarie.cap1_body') },
    { icon: <S><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></S>, title: t('rosemarie.cap2_title'), body: t('rosemarie.cap2_body') },
    { icon: <S><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></S>, title: t('rosemarie.cap3_title'), body: t('rosemarie.cap3_body') },
    { icon: <S><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></S>, title: t('rosemarie.cap4_title'), body: t('rosemarie.cap4_body') },
    { icon: <S><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></S>, title: t('rosemarie.cap5_title'), body: t('rosemarie.cap5_body') },
    { icon: <S><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></S>, title: t('rosemarie.cap6_title'), body: t('rosemarie.cap6_body') },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Rosemarie | AI Agent for Artisan Food Producers"
        description="Rosemarie is the Oatmeal Farm Network AI agent for mills, bakers, cheesemakers, and artisan food producers — recipes, yields, sourcing, labeling, and small-batch operations."
        keywords="artisan food producer AI, bakery software, recipe management AI, batch tracking software, small food business tools, Rosemarie AI, Oatmeal Farm Network, artisan producer technology"
        canonical="https://oatmealfarmnetwork.com/platform/rosemarie"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'Rosemarie',
            'applicationCategory': 'BusinessApplication',
            'operatingSystem': 'Web',
            'url': 'https://oatmealfarmnetwork.com/platform/rosemarie',
            'description': 'AI consultant for artisan food producers — recipe management, batch tracking, ingredient sourcing, and production operations.',
            'featureList': ['Recipe management', 'Batch tracking', 'Ingredient sourcing', 'Yield calculation', 'Production planning', 'Labeling guidance'],
            'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
            'provider': { '@type': 'Organization', 'name': 'Oatmeal Farm Network', 'url': 'https://oatmealfarmnetwork.com' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://oatmealfarmnetwork.com' },
              { '@type': 'ListItem', 'position': 2, 'name': 'Services', 'item': 'https://oatmealfarmnetwork.com/platform' },
              { '@type': 'ListItem', 'position': 3, 'name': 'Rosemarie', 'item': 'https://oatmealfarmnetwork.com/platform/rosemarie' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: t('rosemarie.cap1_title'), acceptedAnswer: { '@type': 'Answer', text: t('rosemarie.cap1_body') } },
              { '@type': 'Question', name: t('rosemarie.cap2_title'), acceptedAnswer: { '@type': 'Answer', text: t('rosemarie.cap2_body') } },
              { '@type': 'Question', name: t('rosemarie.cap3_title'), acceptedAnswer: { '@type': 'Answer', text: t('rosemarie.cap3_body') } },
              { '@type': 'Question', name: t('rosemarie.cap4_title'), acceptedAnswer: { '@type': 'Answer', text: t('rosemarie.cap4_body') } },
              { '@type': 'Question', name: t('rosemarie.cap5_title'), acceptedAnswer: { '@type': 'Answer', text: t('rosemarie.cap5_body') } },
              { '@type': 'Question', name: t('rosemarie.cap6_title'), acceptedAnswer: { '@type': 'Answer', text: t('rosemarie.cap6_body') } },
            ],
          },
        ]}
      />
      <Header />

      {/* Breadcrumbs */}
      <div className="mx-auto px-4 pt-4" style={{ maxWidth: '1300px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Our Services', to: '/platform' },
          { label: 'Rosemarie' },
        ]} />
      </div>

      {/* Coming Soon banner */}
      <div style={{
        background: '#8B5CF6', color: '#fff',
        textAlign: 'center', padding: '1.25rem 1rem',
        fontFamily: "'Lora','Times New Roman',serif",
      }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.04em' }}>Coming Soon!</span>
        <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', opacity: 0.9 }}>
          Rosemarie is currently in development. Check back soon!
        </p>
      </div>

      {/* Hero — photo + gradient overlay */}
      <div className="mx-auto px-4 pt-2" style={{ maxWidth: '1300px' }}>
        <div className="relative w-full overflow-hidden rounded-xl">
          <img
            src="/images/RosemarieBanner.webp"
            alt="Rosemarie AI for Artisan Food Producers"
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
            style={{ background: 'linear-gradient(to right, rgba(60,20,120,0.92) 0%, rgba(60,20,120,0.75) 45%, rgba(60,20,120,0) 78%)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8 py-6" style={{ maxWidth: '720px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}>
                <img src="/images/RosemariAIIcon.webp" alt="Rosemarie" width="28" height="28" style={{ display: 'block', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffffff' }}>{t('rosemarie.hero_badge')}</span>
            </div>
            <h1 style={{ color: '#ffffff', fontFamily: "'Lora','Times New Roman',serif", fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px', lineHeight: 1.2 }}>
              {t('rosemarie.hero_title')}
            </h1>
            <p style={{ color: '#ffffff', fontSize: '0.92rem', margin: '0 0 4px', lineHeight: 1.6 }}>
              {t('rosemarie.hero_body')}
            </p>
            <div className="flex flex-wrap gap-3">
              {!isLoggedIn && (
                <Link to="/signup" className="bg-white font-bold px-5 py-2.5 rounded-lg shadow hover:shadow-md transition text-sm" style={{ color: ACCENT }}>
                  Open an Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8" style={{ maxWidth: '1300px' }}>

        <section className="mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('rosemarie.what_title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">{t('rosemarie.what_body')}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('rosemarie.for_title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {forItems.map(x => (
              <div key={x.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <div className="mb-1 flex justify-center">{x.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{x.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('rosemarie.cap_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map(c => (
              <Capability key={c.title} icon={c.icon} title={c.title} body={c.body} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('rosemarie.ask_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 italic">
                {t(`rosemarie.q${i}`)}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 text-center bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
            {t('rosemarie.cta_title')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{t('rosemarie.cta_body')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {!isLoggedIn && (
              <Link to="/signup"
                className="px-6 py-3 rounded-lg font-bold shadow hover:shadow-md transition"
                style={{ backgroundColor: '#3D6B35', color: '#ffffff' }}>
                {t('rosemarie.cta1')}
              </Link>
            )}
          </div>
        </section>
      </div>

      <RosemarieChat />
      <Footer />
    </div>
  );
}

function Capability({ icon, title, body }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="flex items-center">{icon}</span>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{body}</p>
    </div>
  );
}
