import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const PLACEHOLDER = '/images/MissingLivestockImage.webp';

function useColumnCount() {
  const getCount = () => {
    if (window.innerWidth >= 1280) return 5;
    if (window.innerWidth >= 640)  return 4;
    return 2;
  };
  const [cols, setCols] = useState(getCount);
  useEffect(() => {
    const update = () => setCols(getCount());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

const SIDEBAR_SECTIONS = [
  {
    id: 'for_sale',
    items: [
      { key: 'sp_alpacas',     path: '/marketplaces/livestock/alpacas' },
      { key: 'sp_bison',       path: '/marketplaces/livestock/bison' },
      { key: 'sp_buffalo',     path: '/marketplaces/livestock/buffalo' },
      { key: 'sp_camels',      path: '/marketplaces/livestock/camels' },
      { key: 'sp_cattle',      path: '/marketplaces/livestock/cattle' },
      { key: 'sp_chickens',    path: '/marketplaces/livestock/chickens' },
      { key: 'sp_crocodiles',  path: '/marketplaces/livestock/crocodiles' },
      { key: 'sp_deer',        path: '/marketplaces/livestock/deer' },
      { key: 'sp_dogs',        path: '/marketplaces/livestock/dogs' },
      { key: 'sp_donkeys',     path: '/marketplaces/livestock/donkeys' },
      { key: 'sp_ducks',       path: '/marketplaces/livestock/ducks' },
      { key: 'sp_emus',        path: '/marketplaces/livestock/emus' },
      { key: 'sp_geese',       path: '/marketplaces/livestock/geese' },
      { key: 'sp_goats',       path: '/marketplaces/livestock/goats' },
      { key: 'sp_guinea_fowl', path: '/marketplaces/livestock/guinea-fowl' },
      { key: 'sp_honey_bees',  path: '/marketplaces/livestock/honey-bees' },
      { key: 'sp_horses',      path: '/marketplaces/livestock/horses' },
      { key: 'sp_llamas',      path: '/marketplaces/livestock/llamas' },
      { key: 'sp_musk_ox',     path: '/marketplaces/livestock/musk-ox' },
      { key: 'sp_ostriches',   path: '/marketplaces/livestock/ostriches' },
      { key: 'sp_pheasants',   path: '/marketplaces/livestock/pheasants' },
      { key: 'sp_pigeons',     path: '/marketplaces/livestock/pigeons' },
      { key: 'sp_pigs',        path: '/marketplaces/livestock/pigs' },
      { key: 'sp_quails',      path: '/marketplaces/livestock/quails' },
      { key: 'sp_rabbits',     path: '/marketplaces/livestock/rabbits' },
      { key: 'sp_sheep',       path: '/marketplaces/livestock/sheep' },
      { key: 'sp_snails',      path: '/marketplaces/livestock/snails' },
      { key: 'sp_turkeys',     path: '/marketplaces/livestock/turkeys' },
      { key: 'sp_yaks',        path: '/marketplaces/livestock/yaks' },
    ],
  },
  {
    id: 'studs',
    items: [
      { key: 'sp_alpaca_studs',  path: '/marketplaces/livestock/studs/alpacas' },
      { key: 'sp_bison_studs',   path: '/marketplaces/livestock/studs/bison' },
      { key: 'sp_buffalo_studs', path: '/marketplaces/livestock/studs/buffalo' },
      { key: 'sp_camel_studs',   path: '/marketplaces/livestock/studs/camels' },
      { key: 'sp_cattle_studs',  path: '/marketplaces/livestock/studs/cattle' },
      { key: 'sp_dog_studs',     path: '/marketplaces/livestock/studs/dogs' },
      { key: 'sp_donkey_studs',  path: '/marketplaces/livestock/studs/donkeys' },
      { key: 'sp_goat_studs',    path: '/marketplaces/livestock/studs/goats' },
      { key: 'sp_horse_studs',   path: '/marketplaces/livestock/studs/horses' },
      { key: 'sp_llama_studs',   path: '/marketplaces/livestock/studs/llamas' },
      { key: 'sp_pig_studs',     path: '/marketplaces/livestock/studs/pigs' },
      { key: 'sp_rabbit_studs',  path: '/marketplaces/livestock/studs/rabbits' },
      { key: 'sp_sheep_studs',   path: '/marketplaces/livestock/studs/sheep' },
      { key: 'sp_yak_studs',     path: '/marketplaces/livestock/studs/yaks' },
    ],
  },
  {
    id: 'ranches',
    items: [
      { key: 'sp_alpaca_ranches',      path: '/marketplaces/livestock/ranches/alpacas' },
      { key: 'sp_bees_honey',          path: '/marketplaces/livestock/ranches/honey-bees' },
      { key: 'sp_bison_ranches',       path: '/marketplaces/livestock/ranches/bison' },
      { key: 'sp_buffalo_ranches',     path: '/marketplaces/livestock/ranches/buffalo' },
      { key: 'sp_camel_ranches',       path: '/marketplaces/livestock/ranches/camels' },
      { key: 'sp_cattle_ranches',      path: '/marketplaces/livestock/ranches/cattle' },
      { key: 'sp_chicken_ranches',     path: '/marketplaces/livestock/ranches/chickens' },
      { key: 'sp_crocodile_ranches',   path: '/marketplaces/livestock/ranches/crocodiles' },
      { key: 'sp_deer_ranches',        path: '/marketplaces/livestock/ranches/deer' },
      { key: 'sp_dog_ranches',         path: '/marketplaces/livestock/ranches/dogs' },
      { key: 'sp_donkey_ranches',      path: '/marketplaces/livestock/ranches/donkeys' },
      { key: 'sp_duck_ranches',        path: '/marketplaces/livestock/ranches/ducks' },
      { key: 'sp_emu_ranches',         path: '/marketplaces/livestock/ranches/emus' },
      { key: 'sp_geese_ranches',       path: '/marketplaces/livestock/ranches/geese' },
      { key: 'sp_goat_ranches',        path: '/marketplaces/livestock/ranches/goats' },
      { key: 'sp_guinea_fowl_ranches', path: '/marketplaces/livestock/ranches/guinea-fowl' },
      { key: 'sp_horse_ranches',       path: '/marketplaces/livestock/ranches/horses' },
      { key: 'sp_llama_ranches',       path: '/marketplaces/livestock/ranches/llamas' },
      { key: 'sp_musk_ox_ranches',     path: '/marketplaces/livestock/ranches/musk-ox' },
      { key: 'sp_ostrich_ranches',     path: '/marketplaces/livestock/ranches/ostriches' },
      { key: 'sp_pheasant_ranches',    path: '/marketplaces/livestock/ranches/pheasants' },
      { key: 'sp_pig_ranches',         path: '/marketplaces/livestock/ranches/pigs' },
      { key: 'sp_pigeon_ranches',      path: '/marketplaces/livestock/ranches/pigeons' },
      { key: 'sp_quail_ranches',       path: '/marketplaces/livestock/ranches/quails' },
      { key: 'sp_rabbit_ranches',      path: '/marketplaces/livestock/ranches/rabbits' },
      { key: 'sp_sheep_ranches',       path: '/marketplaces/livestock/ranches/sheep' },
      { key: 'sp_snail_ranches',       path: '/marketplaces/livestock/ranches/snails' },
      { key: 'sp_turkey_ranches',      path: '/marketplaces/livestock/ranches/turkeys' },
      { key: 'sp_yak_ranches',         path: '/marketplaces/livestock/ranches/yaks' },
    ],
  },
];

function Sidebar({ collapsed, onToggle }) {
  const { t } = useTranslation();
  const [openSections, setOpenSections] = useState({ for_sale: true });

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{
      width: collapsed ? '40px' : '220px',
      minWidth: collapsed ? '40px' : '220px',
      transition: 'all 0.3s ease',
      backgroundColor: '#f5f5f0',
      borderRight: '1px solid #ddd',
      overflowY: collapsed ? 'hidden' : 'auto',
      overflowX: 'hidden',
      position: 'sticky',
      top: '72px',
      maxHeight: 'calc(100vh - 72px)',
      flexShrink: 0,
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '10px', border: 'none',
          backgroundColor: '#e59a24', color: '#fff',
          fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '6px',
        }}
      >
        {!collapsed && <span style={{ fontSize: '12px', fontWeight: 600 }}>{t('livestock_mkt.browse')}</span>}
        <span style={{ fontSize: '18px' }}>{collapsed ? '☰' : '✕'}</span>
      </button>

      {!collapsed && (
        <div style={{ padding: '8px 0' }}>
          {SIDEBAR_SECTIONS.map(section => (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%', padding: '8px 12px', border: 'none',
                  backgroundColor: '#e8e8e0', color: '#333',
                  fontWeight: '700', fontSize: '12px', textAlign: 'left',
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}
              >
                {t(`livestock_mkt.section_${section.id}`)}
                <span>{openSections[section.id] ? '▲' : '▼'}</span>
              </button>

              {openSections[section.id] && (
                <ul style={{ listStyle: 'none', margin: 0, padding: '4px 0' }}>
                  {section.items.map(item => (
                    <li key={item.key}>
                      <Link
                        to={item.path}
                        style={{
                          display: 'block', padding: '5px 16px',
                          fontSize: '13px', color: '#4d734d',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5ede5'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {t(`livestock_mkt.${item.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnimalCard({ animal }) {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState(animal.photo || PLACEHOLDER);

  const breeds = [animal.breeds?.[0], animal.breeds?.[1]].filter(Boolean).join(' / ') || '';

  const priceLabel = animal.price
    ? `$${Math.round(animal.price).toLocaleString()}`
    : t('livestock_mkt.price_call');

  const shortName = animal.full_name?.length > 30
    ? animal.full_name.substring(0, 30) + '…'
    : animal.full_name;

  return (
    <Link
      to={`/marketplaces/livestock/animal/${animal.animal_id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', height: '100%' }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          transition: 'box-shadow 0.2s, transform 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <div style={{ width: '100%', height: '180px', backgroundColor: '#f0ede6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={imgSrc}
            alt={animal.full_name}
            loading="lazy"
            onError={() => setImgSrc(PLACEHOLDER)}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#222', lineHeight: 1.3 }}>
            {shortName}
          </div>
          {breeds && (
            <div style={{ fontSize: '0.78rem', color: '#666' }}>{breeds}</div>
          )}
          {animal.seller && (
            <div style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {animal.seller}{animal.location ? `, ${animal.location}` : ''}
            </div>
          )}
          <div style={{ fontSize: '0.85rem', color: '#3D6B34', fontWeight: 600, marginTop: '2px' }}>
            {priceLabel}
          </div>
        </div>

        <div style={{
          padding: '8px 12px',
          borderTop: '1px solid #f0ede6',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#3D6B34' }}>
            {t('livestock_mkt.explore')}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedRow({ animals }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-4">
      {animals.map(animal => (
        <AnimalCard key={animal.animal_id} animal={animal} />
      ))}
    </div>
  );
}

function CardGrid({ animals }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-4">
      {animals.map(animal => (
        <AnimalCard key={animal.animal_id} animal={animal} />
      ))}
    </div>
  );
}

export default function LivestockMarketplace() {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const cols = useColumnCount();

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarCollapsed(true);

    fetch(`${API_URL}/api/marketplace/homepage-listings`)
      .then(r => r.json())
      .then(data => { setListings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const featured = listings.slice(0, cols);
  const allRest  = listings.slice(cols);
  const rest     = allRest.slice(0, Math.floor(allRest.length / cols) * cols);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Livestock Marketplace | Buy & Sell Farm Animals"
        description="Browse livestock for sale across 28 species including cattle, pigs, sheep, goats, chickens, alpacas, and more. Connect directly with farmers, ranchers, and breeders on Oatmeal Farm Network."
        keywords="livestock marketplace, farm animals for sale, cattle for sale, sheep for sale, alpacas for sale, buy livestock, sell livestock"
        canonical="https://oatmealfarmnetwork.com/marketplaces/livestock"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Livestock Marketplace',
            url: 'https://oatmealfarmnetwork.com/marketplaces/livestock',
            description: 'Livestock of America marketplace — buy and sell farm animals directly from ranchers and breeders.',
          },
          listings.length > 0 ? {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            url: 'https://oatmealfarmnetwork.com/marketplaces/livestock',
            itemListElement: listings.slice(0, 12).map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://oatmealfarmnetwork.com/marketplaces/livestock/animal/${a.animal_id}`,
              name: a.full_name,
            })),
          } : null,
        ].filter(Boolean)}
      />
      <Header />

      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'flex-start' }}>

        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />

        <div style={{ flex: 1, minWidth: 0 }}>

          <div style={{ width: '100%' }}>
            <img
              src="/images/LOAwebbanner1898x360.webp"
              alt="Livestock of America"
              loading="eager"
              fetchPriority="high"
              style={{ width: '100%', display: 'block', maxHeight: '200px', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>

          <div style={{ padding: '1.5rem 1.5rem 1rem' }}>
            <Breadcrumbs items={[
              { label: 'Home', to: '/' },
              { label: t('livestock_mkt.crumb_marketplaces'), to: '/marketplaces' },
              { label: t('livestock_mkt.crumb_livestock') },
            ]} />
            <h1 style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {t('livestock_mkt.title')}
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              {t('livestock_mkt.intro1')}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.6, marginBottom: '1rem' }}>
              {t('livestock_mkt.intro2')}
            </p>
            <Link to="/signup" className="regsubmit2">{t('livestock_mkt.join_now')}</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>{t('livestock_mkt.loading')}</div>
          ) : listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
              <p style={{ marginBottom: '1rem' }}>{t('livestock_mkt.no_listings')}</p>
              <Link to="/signup" className="regsubmit2">{t('livestock_mkt.list_animals')}</Link>
            </div>
          ) : (
            <>
              {listings.length > 0 && (
                <div style={{ backgroundColor: '#e59a24', padding: '1.5rem' }}>
                  <h2 style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.25rem', color: '#222' }}>
                    {t('livestock_mkt.featured')}
                  </h2>
                  <FeaturedRow animals={featured} />
                </div>
              )}

              {rest.length > 0 && (
                <div style={{
                  backgroundImage: "url('/images/HomepageBackground.jpg')",
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  padding: '1.5rem',
                }}>
                  <h2 style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.25rem', color: '#222' }}>
                    {t('livestock_mkt.more_listings')}
                  </h2>
                  <CardGrid animals={rest} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
