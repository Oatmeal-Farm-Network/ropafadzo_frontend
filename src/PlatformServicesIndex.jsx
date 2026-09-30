// src/PlatformServicesIndex.jsx
// Public index of OFN's platform services — AI agents + platform offerings.
// Route: /platform
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const API = import.meta.env.VITE_API_URL || '';

export default function PlatformServicesIndex() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API}/api/platform-services`)
      .then(r => r.ok ? r.json() : [])
      .then(d => { setServices(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const agents   = services.filter(s => s.IsAgent);
  const platform = services.filter(s => !s.IsAgent);

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Services | Oatmeal Farm Network"
        description="AI agents and platform services from Oatmeal Farm Network — Saige, Rosemarie, Pairsley, marketplace, website builder, events, and more."
        canonical="https://oatmealfarmnetwork.com/platform"
      />
      <Header />

      {/* Hero */}
      <div className="relative bg-[#3D6B34] text-white py-16 px-4 bg-center bg-cover">
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 drop-shadow" style={{ color: '#fff' }}>{t('platform_svc.title')}</h1>
          <p className="text-white drop-shadow">{t('platform_svc.body')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grow w-full">
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: t('platform_svc.title') },
        ]} />

        {loading ? (
          <div className="text-center py-20 text-gray-400">{t('platform_svc.loading')}</div>
        ) : (
          <>
            {agents.length > 0 && (
              <section className="mt-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
                  {t('platform_svc.agents_title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {agents.map(s => <ServiceCard key={s.ServiceID} s={s} tall learnMore={t('platform_svc.learn_more')} />)}
                </div>
              </section>
            )}

            {platform.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
                  {t('platform_svc.platform_title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platform.map(s => <ServiceCard key={s.ServiceID} s={s} learnMore={t('platform_svc.learn_more')} />)}
                </div>
              </section>
            )}

            {services.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
                {t('platform_svc.no_services')}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

function ServiceCard({ s, tall, learnMore }) {
  const accent = s.AccentColor || '#3D6B34';
  const to = s.RoutePath || `/platform/${s.Slug}`;
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col no-underline group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
             style={{ backgroundColor: `${accent}15`, color: accent }}>
          {s.IconEmoji || '✦'}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-(--accent) transition-colors truncate"
              style={{ ['--accent']: accent }}>
            {s.Title}
          </h3>
          {s.Category && (
            <p className="text-[11px] font-semibold uppercase tracking-wide"
               style={{ color: accent }}>
              {s.Category}
            </p>
          )}
        </div>
      </div>
      {s.Tagline && (
        <p className="text-sm font-semibold text-gray-700 mb-1">{s.Tagline}</p>
      )}
      {s.Summary && (
        <p className={`text-sm text-gray-600 ${tall ? '' : 'line-clamp-3'}`}>{s.Summary}</p>
      )}
      <div className="mt-auto pt-3">
        <span className="text-xs font-semibold" style={{ color: accent }}>
          {learnMore}
        </span>
      </div>
    </Link>
  );
}
