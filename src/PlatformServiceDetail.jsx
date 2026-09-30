// src/PlatformServiceDetail.jsx
// Generic DB-driven detail page for a platform service.
// Route: /platform/:slug  (fallback when the slug has no custom About page)
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const API = import.meta.env.VITE_API_URL || '';

// Extended editorial content for platform-managed service slugs.
const SERVICE_CONTENT = {
  'website-builder': {
    intro: "Launch a professional farm website in an afternoon — not three months. The Oatmeal Farm Network Website Builder is drag-and-drop, but every widget is farm-aware, so your product inventory, ranch profile, blog, and events stay in sync with the rest of your account without any copy-paste.",
    sections: [
      { title: 'Widgets tuned to farms', body: 'Product catalogs, animal-of-the-week, upcoming events, blog feeds, testimonials, contact forms, custom domains, and more — all drag-and-drop.' },
      { title: 'One source of truth', body: 'Add an animal or list a product once, and it appears on your website, your directory profile, and the marketplace automatically.' },
      { title: 'Custom domains', body: 'Point your own domain at your OFN site in minutes. SSL is automatic; DNS is straightforward.' },
      { title: 'AI help built in', body: 'Need a new page? Ask Saige, Pairsley, or Rosemarie to draft it for you — publishing still requires your review.' },
    ],
    ctaLabel: 'Build your site',
    ctaTo: '/website-builder',
  },
  'marketplace': {
    intro: "List your farm products once and they show up everywhere buyers are looking — Farm 2 Table for chefs, the general Products marketplace for consumers, and the Livestock marketplace for ranches. Stripe payouts, messaging, and order tracking are built in.",
    sections: [
      { title: 'Three marketplaces, one listing', body: 'A single product record flows into Farm 2 Table, Products, and Livestock as appropriate.' },
      { title: 'Stripe Connect payouts', body: 'Connect your Stripe account and get paid directly. We never touch the money.' },
      { title: 'Wholesale + retail pricing', body: 'Show retail by default and unlock wholesale pricing for verified restaurant and co-op buyers.' },
      { title: 'Provenance cards', body: 'Every product can print a provenance card showing the farm, the field, and the animal it came from.' },
    ],
    ctaLabel: 'Start selling',
    ctaTo: '/account',
  },
  'events': {
    intro: "Turnkey event management for the ag world — fiber festivals, livestock shows, farm tours, auctions, vendor fairs, conferences, competitions, and more. Registration, ticketing, meals, check-in, payouts, and post-event certificates all in one place.",
    sections: [
      { title: 'Every event shape', body: 'Simple workshops, multi-day conferences, fiber competitions, livestock auctions, farm tours, vendor fairs — templates for each.' },
      { title: 'Tickets, meals, and packages', body: 'Sell multiple ticket types, optional meal plans, and add-ons. Promo codes, waitlists, and refunds included.' },
      { title: 'Check-in & nametags', body: 'Print nametags, barn cards, and class sheets. Scan people in on arrival. Broadcast announcements day-of.' },
      { title: 'Analytics & payouts', body: 'Real-time attendance, revenue, and demographics — plus Stripe payouts straight to the organizing account.' },
    ],
    ctaLabel: 'See upcoming events',
    ctaTo: '/events',
  },
  'crop-monitor': {
    intro: "Field-level imagery and crop-health analytics, built on top of satellite and drone data. See what's thriving and what's struggling before you drive out to look.",
    sections: [
      { title: 'Satellite + drone imagery', body: 'Regular satellite passes plus drone overlays when you have them. NDVI, moisture, and custom indices.' },
      { title: 'Crop detection', body: 'Identify what is growing where — and flag unexpected changes in cover.' },
      { title: 'Season-over-season trends', body: 'Compare this year to last year at a glance, by field.' },
      { title: 'Saige integration', body: 'Ask Saige to summarize field health, plan rotations, or flag risk hotspots for next week\'s weather.' },
    ],
    ctaLabel: 'Open Crop Monitor',
    ctaTo: '/precision-ag',
  },
  'directory': {
    intro: "A searchable directory of farms, ranches, mills, bakers, chefs, and agricultural businesses — all on Oatmeal Farm Network. Filter by product, livestock breed, certification, region, and more.",
    sections: [
      { title: 'Searchable by everything that matters', body: 'Product, species, breed, region, delivery radius, certifications, and more.' },
      { title: 'Profiles you control', body: 'Your business card on the public internet — photos, story, products, events, and contact.' },
      { title: 'Free for members', body: 'Every OFN account gets a directory profile. No tiered pricing to get listed.' },
    ],
    ctaLabel: 'Browse the directory',
    ctaTo: '/directory',
  },
};

export default function PlatformServiceDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API}/api/platform-services/by-slug/${encodeURIComponent(slug)}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.ok ? r.json() : null;
      })
      .then(d => { setSvc(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const content = SERVICE_CONTENT[slug] || null;
  const accent = svc?.AccentColor || '#3D6B34';

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title={svc ? `${svc.Title} | Oatmeal Farm Network` : 'Service | Oatmeal Farm Network'}
        description={svc?.Summary || svc?.Tagline || 'Platform service from Oatmeal Farm Network'}
        canonical={svc ? `https://oatmealfarmnetwork.com/platform/${svc.Slug}` : undefined}
      />
      <Header />

      {loading ? (
        <div className="grow flex items-center justify-center text-gray-400">{t('platform_svc.loading')}</div>
      ) : notFound || !svc ? (
        <div className="grow max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('platform_svc.not_found_title')}</h1>
          <p className="text-gray-600 mb-4">{t('platform_svc.not_found_body')}</p>
          <button onClick={() => navigate('/platform')}
            className="px-4 py-2 rounded-lg bg-[#3D6B34] text-white font-semibold">
            {t('platform_svc.see_all')}
          </button>
        </div>
      ) : (
        <>
          <div className="relative text-white py-16 px-4" style={{ backgroundColor: accent }}>
            <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
            <div className="relative max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                  {svc.IconEmoji || '✦'}
                </div>
                {svc.Category && (
                  <span className="text-xs font-bold uppercase tracking-widest text-white/90">{svc.Category}</span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-3 drop-shadow" style={{ color: '#fff' }}>{svc.Title}</h1>
              {svc.Tagline && <p className="text-lg text-white/95 drop-shadow max-w-2xl">{svc.Tagline}</p>}
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-8 grow w-full">
            <Breadcrumbs items={[
              { label: 'Home', to: '/' },
              { label: t('platform_svc.title'), to: '/platform' },
              { label: svc.Title },
            ]} />

            {svc.Summary && (
              <p className="mt-4 text-gray-700 leading-relaxed text-lg">{svc.Summary}</p>
            )}

            {content && (
              <>
                {content.intro && (
                  <p className="mt-6 text-gray-700 leading-relaxed">{content.intro}</p>
                )}
                {Array.isArray(content.sections) && content.sections.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.sections.map((sec, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-bold text-gray-900 mb-1">{sec.title}</h3>
                        <p className="text-sm text-gray-600">{sec.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {content.ctaLabel && content.ctaTo && (
                  <div className="mt-10 text-center bg-white border border-gray-200 rounded-2xl p-8">
                    <Link to={content.ctaTo}
                      className="inline-block px-6 py-3 rounded-lg text-white font-bold shadow hover:shadow-md transition"
                      style={{ backgroundColor: accent }}>
                      {content.ctaLabel} →
                    </Link>
                  </div>
                )}
              </>
            )}

            {!content && (
              <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600">
                {t('platform_svc.coming_soon', { title: svc.Title })}
                <div className="mt-3">
                  <Link to="/platform" className="font-semibold" style={{ color: accent }}>
                    {t('platform_svc.back_all')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
