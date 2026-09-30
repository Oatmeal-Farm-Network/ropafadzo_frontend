/**
 * Home page — aligned to the OFN homepage mock (cream, olive, Lora).
 *
 * Layout:
 *   1. Hero (split): headline + CTA left, field image right
 *   2. "Built for the Ecosystem" — 4 pillars
 *   3. Stats bar
 *   4. Company News + Market News
 *   5. Core Features — 3×3 grid
 *   6. Footer
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import OTFDMWidget from './OTFDMWidget';

const CREAM = '#f7f2e8';
const OLIVE = '#3d6b34';
const INK = '#2c2c2c';
const MUTED = '#6b6b6b';
const LORA = "'Lora', 'Times New Roman', serif";

const IMG_HERO = '/images/NewsHeroWheat.png';
const IMG_FARM = '/images/Homefarm.webp';
const IMG_RANCHES = '/images/Homeranches.webp';
const IMG_ARTISAN = '/images/HomeArtisanProducers.webp';
const IMG_RESTAURANTS = '/images/HomeRestaurants.webp';
const IMG_COMPANY_NEWS = '/images/HomeCompanyNews.jpg';
const IMG_MARKET_NEWS = '/images/HomeMarketNews.jpg';
const IMG_PRECISION = '/images/CoreFeaturesPrecisionAg.webp';
const IMG_FARM2TABLE = '/images/CoreFeaturesFarm2Table.webp';
const IMG_ASSOCIATION = '/images/CoreFeaturesAssociationSupport.webp';
const IMG_LIVESTOCK = '/images/HomepageLivestockMarketplace.webp';
const IMG_EVENTS = '/images/EventsHeader.webp';
const IMG_AI_ADVISORS = '/images/SaigeBanner.webp';
const IMG_CHEF_PANTRY = '/images/Restaurants.webp';
const IMG_WEBSITE = '/images/HomeCustomWebsiteSystem.webp';
const IMG_KNOWLEDGE = '/images/PlantDBHome.webp';

function EcosystemCard({ title, description, img, link, eager }) {
  const { t } = useTranslation();
  return (
    <article className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col hover:shadow-md hover:border-[#3d6b34]/25 transition-all duration-200">
      <Link to={link} className="block aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding={eager ? 'sync' : 'async'}
          fetchPriority={eager ? 'high' : 'auto'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/images/DirectoryHome.webp';
          }}
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-bold text-lg mb-2"
          style={{ fontFamily: LORA, color: INK }}
        >
          {title}
        </h3>
        <p className="text-sm flex-1 leading-relaxed" style={{ color: MUTED }}>
          {description}
        </p>
        <Link
          to={link}
          className="mt-4 self-end text-sm font-bold no-underline hover:underline"
          style={{ color: OLIVE }}
        >
          {t('home.explore_arrow')}
        </Link>
      </div>
    </article>
  );
}

function NewsCard({ title, description, img, link, imageRight }) {
  const { t } = useTranslation();
  const Img = (
    <Link
      to={link}
      className="block w-full md:w-[42%] shrink-0 overflow-hidden aspect-video md:aspect-auto md:min-h-[240px] bg-[#f0ece4]"
    >
      <img
        src={img}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      />
    </Link>
  );
  const Text = (
    <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
      <h3
        className="font-bold text-xl md:text-2xl mb-3 leading-snug"
        style={{ fontFamily: LORA, color: OLIVE }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: MUTED }}>
        {description}
      </p>
      <Link
        to={link}
        className="self-start text-sm font-bold no-underline hover:underline"
        style={{ color: OLIVE }}
      >
        {t('home.explore_arrow')}
      </Link>
    </div>
  );
  return (
    <article className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow duration-200">
      {imageRight ? (
        <>
          {Text}
          {Img}
        </>
      ) : (
        <>
          {Img}
          {Text}
        </>
      )}
    </article>
  );
}

const COMPANY_NEWS_TEXT =
  'Stay informed with the latest updates from across the Oatmeal ecosystem. Our Company News section covers product launches, feature updates, partnerships, and key milestones shaping the future of agriculture and food systems. Discover innovations in AI-powered tools and stories from farmers, producers, and restaurants. Stay connected to how we’re building a more transparent, efficient, and connected farm-to-table network.';

const MARKET_NEWS_TEXT =
  'Stay updated on the latest trends and insights shaping the agricultural and food markets. Our Market News section covers pricing shifts, supply and demand changes, seasonal forecasts, and key industry developments. From crop performance to livestock trends and emerging market opportunities, we provide the insights you need to make informed decisions and stay ahead in a rapidly evolving food ecosystem.';

function MarketNewsCard() {
  const { t } = useTranslation();
  return (
    <NewsCard
      title={t('home.market_news_title', 'Market News')}
      description={t('home.market_news_desc', MARKET_NEWS_TEXT)}
      img={IMG_MARKET_NEWS}
      link="/app/news"
      imageRight
    />
  );
}

function FeatureCard({ title, description, img, link }) {
  const { t } = useTranslation();
  return (
    <article className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col hover:shadow-md hover:border-[#3d6b34]/25 transition-all duration-200">
      <Link to={link} className="block aspect-video overflow-hidden">
        <img
          src={img}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/images/DirectoryHome.webp';
          }}
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-base mb-2" style={{ fontFamily: LORA }}>
          <Link to={link} className="no-underline hover:underline" style={{ color: OLIVE }}>
            {title}
          </Link>
        </h3>
        <p className="text-xs flex-1 leading-relaxed" style={{ color: MUTED }}>
          {description}
        </p>
        <Link
          to={link}
          className="mt-3 self-end text-xs font-bold no-underline hover:underline"
          style={{ color: OLIVE }}
        >
          {t('home.explore_arrow')}
        </Link>
      </div>
    </article>
  );
}

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: CREAM }}>
      <PageMeta
        title="Oatmeal Farm Network | AI-Powered Farm & Food Network"
        description="Connect farms, buyers, and food businesses with AI-powered tools. Browse 3,000+ livestock breeds, 4,000+ plant varieties, 14,000+ ingredients, and a local food marketplace on Oatmeal Farm Network."
        keywords="farm network, livestock marketplace, plant database, food system directory, AI farming, agriculture, livestock breeds, farm to table"
        canonical="https://oatmealfarmnetwork.com"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Oatmeal Farm Network',
            url: 'https://oatmealfarmnetwork.com',
            logo: 'https://oatmealfarmnetwork.com/images/Oatmeal-Farm-Network-og-default.jpg',
            sameAs: [],
            description:
              'AI-powered farm and food system network connecting farms, buyers, and food businesses.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Oatmeal Farm Network',
            url: 'https://oatmealfarmnetwork.com',
          },
        ]}
      />
      <Header />

      {/* ─── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1
              className="leading-[1.15] mb-4"
              style={{
                fontFamily: LORA,
                fontWeight: 700,
                fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
                color: INK,
              }}
            >
              {t('home.hero_tagline')}
              <br />
              <span
                style={{
                  color: OLIVE,
                  fontSize: 'clamp(2rem, 4vw, 3.1rem)',
                }}
              >
                {t('home.hero_title')}
              </span>
            </h1>
            <p
              className="text-base md:text-lg font-semibold mb-3 leading-snug"
              style={{ color: INK }}
            >
              {t('home.hero_body1')}
            </p>
            <p className="text-sm md:text-base mb-7 leading-relaxed max-w-xl" style={{ color: MUTED }}>
              {t('home.hero_body2')}
            </p>
            <Link
              to="/directory"
              className="home-hero-cta inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold no-underline hover:opacity-90 transition"
              style={{ background: OLIVE, color: '#ffffff' }}
            >
              {t('home.explore_directory', 'Explore Directory')}
            </Link>
          </div>

          <div className="relative pb-5 pl-5 sm:pb-6 sm:pl-6 md:pb-8 md:pl-0">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] md:aspect-[5/4]">
              <img
                src={IMG_HERO}
                alt="Golden wheat field at sunset"
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/HomePageField.webp';
                }}
              />
            </div>
            {/* Glass quote — overlaps bottom-left corner of photo (matches mock) */}
            <aside
              className="absolute bottom-0 left-0 z-10 max-w-[11rem] sm:max-w-[12.5rem] md:max-w-[13.5rem] rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 md:-bottom-3 md:-left-4"
              style={{
                background: 'rgba(255, 255, 255, 0.58)',
                backdropFilter: 'blur(14px) saturate(140%)',
                WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                border: '1px solid rgba(255, 255, 255, 0.72)',
                boxShadow:
                  '0 12px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              }}
            >
              <p
                className="text-center italic text-[12px] sm:text-[13px] md:text-[14px] leading-snug m-0"
                style={{
                  fontFamily: LORA,
                  color: '#4a4a4a',
                }}
              >
                {t('home.hero_quote')}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── 2. Built for the Ecosystem ─────────────────────────────────── */}
      <section className="pb-12 md:pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: LORA, color: INK }}
            >
              {t('home.ecosystem_title')}{' '}
              <span style={{ color: OLIVE }}>{t('home.ecosystem_span')}</span>
            </h2>
            <p className="mt-2 text-sm md:text-base" style={{ color: MUTED }}>
              {t('home.ecosystem_sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <EcosystemCard
              title={t('home.ecosystem_farm_title')}
              description={t('home.ecosystem_farm_desc')}
              img={IMG_FARM}
              link="/for-farms"
              eager
            />
            <EcosystemCard
              title={t('home.ecosystem_ranches_title')}
              description={t('home.ecosystem_ranches_desc')}
              img={IMG_RANCHES}
              link="/for-ranches"
              eager
            />
            <EcosystemCard
              title={t('home.ecosystem_artisan_title')}
              description={t('home.ecosystem_artisan_desc')}
              img={IMG_ARTISAN}
              link="/for-artisan-producers"
              eager
            />
            <EcosystemCard
              title={t('home.ecosystem_restaurants_title')}
              description={t('home.ecosystem_restaurants_desc')}
              img={IMG_RESTAURANTS}
              link="/for-restaurants"
              eager
            />
          </div>
        </div>
      </section>

      {/* ─── 3. Stats bar ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: OLIVE }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-7 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {[
            { n: '4K+', label: t('home.stats_plants'), link: '/plant-knowledgebase' },
            { n: '3K+', label: t('home.stats_livestock'), link: '/livestock' },
            { n: '1,400+', label: t('home.stats_ingredients'), link: '/ingredient-knowledgebase' },
            { n: '52', label: t('home.stats_categories'), link: '/directory' },
          ].map((s) => (
            <Link
              key={s.label}
              to={s.link}
              className="block rounded-xl px-2 py-2 font-bold transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none no-underline"
              style={{ fontFamily: LORA, color: '#ffffff' }}
            >
              <div className="text-3xl md:text-4xl leading-none" style={{ color: '#ffffff' }}>
                {s.n}
              </div>
              <div
                className="text-[10px] md:text-xs tracking-[0.14em] uppercase mt-2"
                style={{ color: 'rgba(255,255,255,0.92)' }}
              >
                {s.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 4. Company News + Market News ──────────────────────────────── */}
      <section className="py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-5">
          <NewsCard
            title={t('home.news_company_title', 'Company News')}
            description={t('home.news_company_desc', COMPANY_NEWS_TEXT)}
            img={IMG_COMPANY_NEWS}
            link="/news"
            imageRight={false}
          />
          <MarketNewsCard />
        </div>
      </section>

      <OTFDMWidget />

      {/* ─── 5. Core Features ───────────────────────────────────────────── */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2
            className="text-3xl md:text-4xl font-bold mb-8 text-center"
            style={{ fontFamily: LORA, color: INK }}
          >
            {t('home.features_title')}{' '}
            <span style={{ color: OLIVE }}>{t('home.features_span')}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              title={t('home.feat_precision_title')}
              description={t('home.feat_precision_desc')}
              img={IMG_PRECISION}
              link="/platform/precision-ag"
            />
            <FeatureCard
              title={t('home.feat_farm2table_title')}
              description={t('home.feat_farm2table_desc')}
              img={IMG_FARM2TABLE}
              link="/marketplaces/farm-to-table"
            />
            <FeatureCard
              title={t('home.feat_association_title')}
              description={t('home.feat_association_desc')}
              img={IMG_ASSOCIATION}
              link="/agriculture-support"
            />
            <FeatureCard
              title={t('home.feat_livestock_title')}
              description={t('home.feat_livestock_desc')}
              img={IMG_LIVESTOCK}
              link="/marketplaces"
            />
            <FeatureCard
              title={t('home.feat_events_title')}
              description={t('home.feat_events_desc')}
              img={IMG_EVENTS}
              link="/event-registration"
            />
            <FeatureCard
              title={t('home.feat_ai_title')}
              description={t('home.feat_ai_desc')}
              img={IMG_AI_ADVISORS}
              link="/ai-agents"
            />
            <FeatureCard
              title={t('home.feat_chef_title')}
              description={t('home.feat_chef_desc')}
              img={IMG_CHEF_PANTRY}
              link="/chef-pantry"
            />
            <FeatureCard
              title={t('home.feat_website_title')}
              description={t('home.feat_website_desc')}
              img={IMG_WEBSITE}
              link="/website-builder"
            />
            <FeatureCard
              title={t('home.feat_knowledge_title')}
              description={t('home.feat_knowledge_desc')}
              img={IMG_KNOWLEDGE}
              link="/knowledgebases"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
