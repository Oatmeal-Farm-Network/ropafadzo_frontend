import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const ACCENT = '#3D6B34';
const WARM   = '#f7f2e8';

const SECTION_META = [
  { id: 'farms',       img: '/images/FarmsPageHeader.webp',                color: '#3D6B34', link: '/for-farms' },
  { id: 'ranches',     img: '/images/RanchesHeader.webp',                  color: '#7C5A3A', link: '/for-ranches' },
  { id: 'restaurants', img: '/images/Restaurants.webp',                    color: '#2f7d4a', link: '/for-restaurants' },
  { id: 'artisan',     img: '/images/ArtisanProducers.webp',               color: '#7C3F8B', link: '/for-artisan-producers' },
  { id: 'assoc',       img: '/images/CoreFeaturesAssociationSupport.webp', color: '#B45309', link: '/agriculture-support' },
];

function FeatureChip({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
      <span style={{ color: ACCENT, flexShrink: 0, marginTop: '2px' }}>✓</span>
      {text}
    </li>
  );
}

function AudienceSection({ section, flip }) {
  return (
    <section className="mb-14">
      <div className={`flex flex-col ${flip ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 items-stretch`}>
        <div className="lg:w-2/5 shrink-0 rounded-xl overflow-hidden shadow-sm" style={{ minHeight: '260px' }}>
          <img
            src={section.img}
            alt={section.label}
            className="w-full h-full object-cover"
            style={{ minHeight: '260px' }}
            loading="lazy"
            onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-200 px-7 py-6 shadow-sm flex flex-col justify-between">
          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: `${section.color}18`, color: section.color }}
            >
              {section.label}
            </span>
            <h2
              className="text-xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}
            >
              {section.headline}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-5">{section.body}</p>
            <ul className="space-y-2 mb-6">
              {section.features.map((f, i) => <FeatureChip key={i} text={f} />)}
            </ul>
          </div>
          <div>
            <Link
              to={section.link}
              className="inline-flex items-center gap-1 text-sm font-bold hover:underline"
              style={{ color: section.color }}
            >
              {section.linkText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OFNComingSoon() {
  const { t } = useTranslation();

  const SECTIONS = SECTION_META.map(meta => ({
    ...meta,
    label:    t(`ofn_coming_soon.section_${meta.id}_label`),
    headline: t(`ofn_coming_soon.section_${meta.id}_headline`),
    body:     t(`ofn_coming_soon.section_${meta.id}_body`),
    linkText: t(`ofn_coming_soon.section_${meta.id}_link_text`),
    features: Array.from({ length: 6 }, (_, i) => t(`ofn_coming_soon.section_${meta.id}_f${i + 1}`)),
  }));

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: WARM }}>
      <PageMeta
        title={t('ofn_coming_soon.meta_title')}
        description={t('ofn_coming_soon.meta_desc')}
        canonical="https://oatmealfarmnetwork.com/news"
      />
      <Header />

      <div className="mx-auto px-4 pt-4" style={{ maxWidth: '1100px' }}>
        <Breadcrumbs items={[
          { label: t('ofn_coming_soon.crumb_home'), to: '/' },
          { label: t('ofn_coming_soon.crumb_page') },
        ]} />
      </div>

      <div className="mx-auto px-4 pt-3 pb-10" style={{ maxWidth: '1100px' }}>
        <div className="relative rounded-xl overflow-hidden shadow-md">
          <img
            src="/images/HomePageComingsoon.webp"
            alt={t('ofn_coming_soon.hero_img_alt')}
            className="w-full object-cover"
            style={{ height: '320px' }}
            loading="eager"
            onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 85%)' }}
          />
          <div className="absolute inset-0 flex flex-col justify-center px-10 py-8" style={{ maxWidth: '700px' }}>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-300 mb-2">
              {t('ofn_coming_soon.hero_eyebrow')}
            </span>
            <h1
              className="text-white font-bold mb-3"
              style={{ fontFamily: "'Lora','Times New Roman',serif", fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.2 }}
            >
              {t('ofn_coming_soon.hero_title')}
            </h1>
            <p className="text-white/85 text-sm leading-relaxed">
              {t('ofn_coming_soon.hero_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 pb-16" style={{ maxWidth: '1100px' }}>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-8 py-7 mb-12">
          <p
            className="text-lg font-semibold text-gray-800 leading-relaxed mb-4"
            style={{ fontFamily: "'Lora','Times New Roman',serif" }}
          >
            {t('ofn_coming_soon.lead_p1')}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">{t('ofn_coming_soon.lead_p2')}</p>
          <p
            className="text-sm text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: t('ofn_coming_soon.lead_p3') }}
          />
          <p className="text-sm text-gray-700 leading-relaxed">{t('ofn_coming_soon.lead_p4')}</p>
        </div>

        <div
          className="rounded-xl overflow-hidden shadow-sm mb-12 flex flex-col sm:flex-row"
          style={{ border: `1px solid ${ACCENT}30` }}
        >
          <div className="sm:w-56 shrink-0">
            <img
              src="/images/SaigeBanner.webp"
              alt={t('ofn_coming_soon.ai_img_alt')}
              className="w-full h-full object-cover"
              style={{ minHeight: '160px' }}
              loading="lazy"
              onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
            />
          </div>
          <div className="flex-1 px-7 py-6" style={{ backgroundColor: `${ACCENT}08` }}>
            <h2
              className="font-bold text-gray-900 text-lg mb-2"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}
            >
              {t('ofn_coming_soon.ai_heading')}
            </h2>
            <p
              className="text-sm text-gray-700 leading-relaxed mb-3"
              dangerouslySetInnerHTML={{ __html: t('ofn_coming_soon.ai_p1') }}
            />
            <p className="text-sm text-gray-700 leading-relaxed">{t('ofn_coming_soon.ai_p2')}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/platform/saige"     className="text-xs font-bold hover:underline" style={{ color: ACCENT }}>{t('ofn_coming_soon.ai_saige')}</Link>
              <Link to="/platform/pairsley"  className="text-xs font-bold hover:underline" style={{ color: ACCENT }}>{t('ofn_coming_soon.ai_pairsley')}</Link>
              <Link to="/platform/rosemarie" className="text-xs font-bold hover:underline" style={{ color: ACCENT }}>{t('ofn_coming_soon.ai_rosemarie')}</Link>
              <Link to="/platform/thaiyme"   className="text-xs font-bold hover:underline" style={{ color: ACCENT }}>{t('ofn_coming_soon.ai_thaiyme')}</Link>
            </div>
          </div>
        </div>

        <h2
          className="text-2xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: "'Lora','Times New Roman',serif" }}
        >
          {t('ofn_coming_soon.who_heading')}
        </h2>

        {SECTIONS.map((s, i) => (
          <AudienceSection key={s.id} section={s} flip={i % 2 !== 0} />
        ))}

        <div
          className="rounded-xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
          style={{ backgroundColor: ACCENT, color: '#fff' }}
        >
          <div>
            <h3
              className="font-bold text-xl mb-2"
              style={{ fontFamily: "'Lora','Times New Roman',serif" }}
            >
              {t('ofn_coming_soon.cta_heading')}
            </h3>
            <p className="text-sm text-white/85 leading-relaxed max-w-lg">
              {t('ofn_coming_soon.cta_body')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/signup"
              className="px-6 py-2.5 rounded-lg font-bold text-sm shadow"
              style={{ backgroundColor: '#fff', color: ACCENT }}
            >
              {t('ofn_coming_soon.cta_create')}
            </Link>
            <Link
              to="/directory"
              className="px-6 py-2.5 rounded-lg font-bold text-sm border-2 border-white/60 hover:bg-white/10 transition"
              style={{ color: '#fff' }}
            >
              {t('ofn_coming_soon.cta_browse')}
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
