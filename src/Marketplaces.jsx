import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function AnimalCard({ animal }) {
  const [failed, setFailed] = useState(false);
  const { t } = useTranslation();

  // Skip rendering this card entirely if image fails
  if (failed) return null;

  const priceDisplay = () => {
    if (animal.sale_price && animal.price) {
      const discounted = animal.price * ((100 - animal.sale_price) / 100);
      return (
        <>
          Price: <span style={{ textDecoration: 'line-through', color: 'red' }}>${Math.round(animal.price).toLocaleString()}</span>
          {' '}<strong>${Math.round(discounted).toLocaleString()}</strong>
        </>
      );
    }
    if (animal.price) {
      return <>Price: <strong>${Math.round(animal.price).toLocaleString()}</strong></>;
    }
    return <strong>{t('livestock_mkt.price_call')}</strong>;
  };

  const shortName = animal.full_name?.length > 28
    ? animal.full_name.substring(0, 28) + '...'
    : animal.full_name;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '2px solid #abacab',
        borderRadius: '4px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '2px 2px 15px #a7ac20';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Image */}
      <div style={{ width: '200px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '10px' }}>
        <img
          src={animal.photo}
          alt={animal.full_name}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '180px', objectFit: 'contain' }}
        />
      </div>

      {/* Details */}
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.82rem', color: '#555', width: '100%' }}>
        <a
          href={`/livestockmarketplace/Animals/Details.asp?ID=${animal.animal_id}&CurrentPeopleID=${animal.people_id}`}
          style={{ fontWeight: 600, color: '#333', textDecoration: 'none', display: 'block' }}
        >
          {shortName}
        </a>
        <div style={{ color: '#666', marginTop: '2px' }}>
          {animal.breed} {animal.species}
        </div>
        <div style={{ marginTop: '4px' }}>
          {priceDisplay()}
        </div>
      </div>
    </div>
  );
}

function CardGrid({ animals }) {
  // Render cards but filter out nulls (failed images render null)
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      {animals.map(animal => (
        <AnimalCard key={animal.animal_id} animal={animal} />
      ))}
    </div>
  );
}

export default function LivestockMarketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`${API_URL}/api/marketplace/homepage-listings`)
      .then(r => r.json())
      .then(data => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const featured = listings.slice(0, 4);
  const browse = listings.slice(4, 12);

  return (
    <div className="min-h-screen font-sans">
      <Header />

      {/* Top banner image */}
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

      {/* Intro */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 1rem' }}>
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
          {/* Featured Listings — gold section */}
          {featured.length > 0 && (
            <div style={{ backgroundColor: '#e59a24', padding: '1.5rem 1rem 2rem' }}>
              <h2 style={{
                textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold',
                marginBottom: '1.25rem', color: '#222',
              }}>
                {t('livestock_mkt.featured')}
              </h2>
              <CardGrid animals={featured} />
            </div>
          )}

          {/* Browse Listings — background image section */}
          {browse.length > 0 && (
            <div style={{
              backgroundImage: "url('/images/HomepageBackground.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '1.5rem 1rem 2rem',
              minHeight: '600px',
            }}>
              <h2 style={{
                textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold',
                marginBottom: '1.25rem', color: '#222',
              }}>
                {t('livestock_mkt.browse')}
              </h2>
              {/* Two rows of 4 */}
              <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {browse.slice(0, 4).map(animal => (
                    <AnimalCard key={animal.animal_id} animal={animal} />
                  ))}
                </div>
                {browse.length > 4 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {browse.slice(4, 8).map(animal => (
                      <AnimalCard key={animal.animal_id} animal={animal} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}