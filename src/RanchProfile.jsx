import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const GCP_BUCKET_URL = 'https://storage.googleapis.com/oatmeal-farm-network-images/Animals';

const SOCIAL_LINKS = [
  { key: 'facebook',    icon: '/icons/facebook.png',         alt: 'Facebook',    base: 'https://facebook.com/' },
  { key: 'x',          icon: '/icons/TwitterX.png',          alt: 'Twitter/X',   base: 'https://twitter.com/' },
  { key: 'instagram',  icon: '/icons/instagramicon.png',     alt: 'Instagram',   base: 'https://instagram.com/' },
  { key: 'pinterest',  icon: '/icons/PinterestLogo.png',     alt: 'Pinterest',   base: 'https://pinterest.com/' },
  { key: 'youtube',    icon: '/icons/YouTube.jpg',           alt: 'YouTube',     base: 'https://youtube.com/' },
  { key: 'blog',       icon: '/icons/BlogIcon.png',          alt: 'Blog',        base: '' },
  { key: 'truth_social', icon: '/icons/Truthsocial.png',    alt: 'Truth Social', base: '' },
  { key: 'other_social1', icon: '/icons/GeneralSocialIcon.png', alt: 'Social',  base: '' },
  { key: 'other_social2', icon: '/icons/GeneralSocialIcon.png', alt: 'Social',  base: '' },
];

function AnimalCard({ animal, isStuds }) {
  const { t } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);
  const detailUrl = `/livestockmarketplace/Animals/Details.asp?ID=${animal.animal_id}`;
  const priceLabel = isStuds ? t('ranch_profile.stud_fee') : t('ranch_profile.price_label');

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '12px', display: 'flex', gap: '12px', marginBottom: '12px', backgroundColor: '#fff' }}>
      <div style={{ width: '90px', flexShrink: 0 }}>
        {!imgFailed && animal.photo ? (
          <a href={detailUrl}>
            <img src={animal.photo} alt={animal.full_name} loading="lazy"
              onError={() => setImgFailed(true)}
              style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee' }} />
          </a>
        ) : (
          <div style={{ width: '90px', height: '90px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '11px' }}>
            {t('ranch_profile.no_photo')}
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <a href={detailUrl} style={{ fontWeight: 'bold', color: '#333', textDecoration: 'none', fontSize: '1rem', display: 'block', marginBottom: '4px' }}>
          {animal.full_name}
        </a>
        {animal.breeds.length > 0 && <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#666' }}>{animal.breeds.join(', ')}</p>}
        <p style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>
          <strong>{priceLabel}:</strong> {animal.price ? `$${Math.round(animal.price).toLocaleString()}` : t('ranch_profile.call_for_price')}
        </p>
        <a href={detailUrl} style={{ backgroundColor: '#6c757d', color: '#fff', padding: '4px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem' }}>
          {t('ranch_profile.view_details')}
        </a>
      </div>
    </div>
  );
}

function AnimalsTab({ businessId, isStuds }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/ranches/profile/${businessId}/animals?page=${page}&studs_only=${isStuds}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [businessId, page, isStuds]);

  if (loading) return <div style={{ padding: '20px', color: '#888' }}>{t('ranch_profile.loading')}</div>;
  if (!data || data.animals.length === 0) return (
    <div style={{ padding: '20px', color: '#888' }}>{isStuds ? t('ranch_profile.no_stud_listings') : t('ranch_profile.no_sale_listings')}</div>
  );

  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '12px' }}>{t('ranch_profile.animal_count', { count: data.total })}</p>
      {data.animals.map(a => <AnimalCard key={a.animal_id} animal={a} isStuds={isStuds} />)}
      {data.total_pages > 1 && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
          {page > 1 && <button onClick={() => setPage(p => p - 1)} style={btnStyle}>{t('ranch_profile.prev')}</button>}
          {page < data.total_pages && <button onClick={() => setPage(p => p + 1)} style={btnStyle}>{t('ranch_profile.next')}</button>}
        </div>
      )}
    </div>
  );
}

function ContactTab({ ranch }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [q] = useState(() => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { a, b, answer: a + b };
  });
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(userAnswer) !== q.answer) { alert(t('ranch_profile.alert_wrong_answer')); return; }
    if (!formData.name || !formData.email) { alert(t('ranch_profile.alert_required')); return; }
    setSent(true);
  };

  if (sent) return (
    <div style={{ backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', padding: '16px' }}>
      <h4 style={{ margin: '0 0 8px', color: '#155724' }}>{t('ranch_profile.msg_sent')}</h4>
      <p style={{ margin: 0, color: '#155724' }}>{t('ranch_profile.thank_you', { name: ranch.business_name })}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '16px' }}>{t('ranch_profile.contact_heading', { name: ranch.business_name })}</h3>
      {ranch.address_city && (
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
          {[ranch.address_street, ranch.address_city, ranch.address_state, ranch.address_zip, ranch.address_country].filter(Boolean).join(', ')}
        </p>
      )}
      {ranch.email && (
        <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
          <strong>Email:</strong> <a href={`mailto:${ranch.email}`} style={{ color: '#507033' }}>{ranch.email}</a>
        </p>
      )}
      <form onSubmit={handleSubmit}>
        {[
          { id: 'name', tkey: 'ranch_profile.field_name', type: 'text', required: true },
          { id: 'email', tkey: 'ranch_profile.field_email', type: 'email', required: true },
          { id: 'phone', tkey: 'ranch_profile.field_phone', type: 'tel', required: false, optional: true },
        ].map(f => (
          <div key={f.id} style={{ marginBottom: '12px' }}>
            <label style={formLabel}>
              {t(f.tkey)}
              {f.optional && <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 400, marginLeft: 4 }}>{t('ranch_profile.optional')}</span>}
            </label>
            <input type={f.type} value={formData[f.id]} onChange={e => setFormData(p => ({ ...p, [f.id]: e.target.value }))}
              required={f.required} style={formInput} />
          </div>
        ))}
        <div style={{ marginBottom: '12px' }}>
          <label style={formLabel}>{t('ranch_profile.field_message')}</label>
          <textarea value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
            rows={4} style={{ ...formInput, resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '16px', backgroundColor: '#f8f8f8', padding: '12px', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.85rem', fontWeight: 600 }}>{t('ranch_profile.human_verification')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{q.a} + {q.b} =</span>
            <input type="number" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
              placeholder="?" style={{ width: '60px', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }} />
          </div>
        </div>
        <button type="submit" style={{ backgroundColor: '#819360', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          {t('ranch_profile.send')}
        </button>
      </form>
    </div>
  );
}

function EventsTab({ events }) {
  const { t } = useTranslation();
  const fmtDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return String(d); }
  };
  const daysUntil = (d) => {
    if (!d) return null;
    const t = new Date(d);
    if (isNaN(t)) return null;
    return Math.ceil((t - new Date()) / (1000 * 60 * 60 * 24));
  };

  if (!events || events.length === 0) return (
    <div style={{ padding: '20px', color: '#888' }}>{t('ranch_profile.no_events')}</div>
  );

  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '12px' }}>
        {t('ranch_profile.event_count', { count: events.length })}
      </p>
      {events.map(e => {
        const days = daysUntil(e.EventStartDate);
        const loc = [e.EventLocationCity, e.EventLocationState].filter(Boolean).join(', ');
        return (
          <div key={e.EventID} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '14px', marginBottom: '12px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Link to={`/events/${e.EventID}`} style={{ fontWeight: 'bold', color: '#333', textDecoration: 'none', fontSize: '1rem', display: 'block', marginBottom: '4px' }}>
                {e.EventName}
              </Link>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                {fmtDate(e.EventStartDate)}
                {e.EventEndDate && e.EventEndDate !== e.EventStartDate && ` – ${fmtDate(e.EventEndDate)}`}
                {loc && ` · ${loc}`}
              </p>
              {days != null && days >= 0 && days <= 30 && (
                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#eef3e7', color: '#3D6B34', fontWeight: 600 }}>
                  {t('ranch_profile.days_until', { count: days })}
                </span>
              )}
            </div>
            <Link to={`/events/${e.EventID}`}
              style={{ backgroundColor: '#507033', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {t('ranch_profile.register')}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function RanchProfile() {
  const { t } = useTranslation();
  const { businessId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [ranch, setRanch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animalCounts, setAnimalCounts] = useState({ for_sale: 0, studs: 0 });
  const [events, setEvents] = useState([]);

  const activeTab = searchParams.get('tab') || 'home';
  const setTab = (tab) => setSearchParams({ tab });

  useEffect(() => {
    fetch(`${API_URL}/api/ranches/profile/${businessId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setRanch(d); setLoading(false); })
      .catch(() => setLoading(false));

    // Get counts for tab visibility
    fetch(`${API_URL}/api/ranches/profile/${businessId}/animals?per_page=1&studs_only=false`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setAnimalCounts(prev => ({ ...prev, for_sale: d.total })))
      .catch(() => {});
    fetch(`${API_URL}/api/ranches/profile/${businessId}/animals?per_page=1&studs_only=true`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setAnimalCounts(prev => ({ ...prev, studs: d.total })))
      .catch(() => {});
    fetch(`${API_URL}/api/my-events?business_id=${businessId}`)
      .then(r => r.ok ? r.json() : [])
      .then(rows => {
        const upcoming = (Array.isArray(rows) ? rows : [])
          .filter(e => e.IsPublished && (!e.EventEndDate || new Date(e.EventEndDate) >= new Date()));
        setEvents(upcoming);
      })
      .catch(() => {});
  }, [businessId]);

  if (loading) return (
    <div className="min-h-screen font-sans">
      <Header />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 16px' }} className="animate-pulse">
        <div style={{ height: '120px', backgroundColor: '#e8e8e8', borderRadius: '8px', marginBottom: '20px' }} />
        <div style={{ height: '40px', backgroundColor: '#e8e8e8', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ height: '200px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
      </div>
      <Footer />
    </div>
  );

  if (!ranch) return (
    <div className="min-h-screen font-sans">
      <Header />
      <div style={{ textAlign: 'center', padding: '60px' }}><p>{t('ranch_profile.not_found')}</p><Link to="/marketplaces/livestock">{t('ranch_profile.back')}</Link></div>
      <Footer />
    </div>
  );

  const TABS = [
    { key: 'home', label: t('ranch_profile.tab_home'), always: true },
    { key: 'animals', label: t('ranch_profile.tab_animals', { count: animalCounts.for_sale }), show: animalCounts.for_sale > 0 },
    { key: 'studs', label: t('ranch_profile.tab_studs', { count: animalCounts.studs }), show: animalCounts.studs > 0 },
    { key: 'events', label: t('ranch_profile.tab_events', { count: events.length }), show: events.length > 0 },
    { key: 'contact', label: t('ranch_profile.tab_contact'), always: true },
  ].filter(tab => tab.always || tab.show);

  const ranchLocation = [ranch.address_city, ranch.address_state].filter(Boolean).join(', ');
  const ranchDesc = ranch.description
    ? ranch.description.replace(/<[^>]+>/g, '').slice(0, 155)
    : `${ranch.business_name}${ranchLocation ? ' in ' + ranchLocation : ''} — livestock ranch and breeder on Oatmeal Farm Network.`;

  return (
    <div className="min-h-screen font-sans">
      <PageMeta
        title={`${ranch.business_name}${ranchLocation ? ' — ' + ranchLocation : ''} | Ranch Profile`}
        description={ranchDesc}
        keywords={`${ranch.business_name}, ${ranchLocation}, livestock ranch, breeder, farm, ranch profile`}
        canonical={`https://oatmealfarmnetwork.com/marketplaces/livestock/ranch/${businessId}`}
        ogType="profile"
        image={ranch.header_image || ranch.logo || undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: ranch.business_name,
          description: ranchDesc,
          url: `https://oatmealfarmnetwork.com/marketplaces/livestock/ranch/${businessId}`,
          ...(ranch.address_city ? {
            address: {
              '@type': 'PostalAddress',
              streetAddress: ranch.address_street || undefined,
              addressLocality: ranch.address_city || undefined,
              addressRegion: ranch.address_state || undefined,
              postalCode: ranch.address_zip || undefined,
              addressCountry: ranch.address_country || undefined,
            }
          } : {}),
          ...(ranch.email ? { email: ranch.email } : {}),
        }}
      />
      <Header />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px 3rem' }}>
        <div style={{ paddingTop: '0.5rem' }}>
          <Breadcrumbs items={[
            { label: 'Home', to: '/' },
            { label: 'Marketplaces', to: '/marketplaces' },
            { label: 'Livestock', to: '/marketplaces/livestock' },
            { label: 'Ranches' },
            { label: ranch.business_name },
          ]} />
        </div>

        {/* Ranch header — logo or name */}
        <div style={{ textAlign: 'center', padding: '24px 0 16px', borderBottom: '1px solid #eee' }}>
          {ranch.header_image ? (
            <img src={ranch.header_image} alt={ranch.business_name}
              style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none'; }} />
          ) : ranch.logo ? (
            <img src={ranch.logo} alt={ranch.business_name}
              style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>{ranch.business_name}</h1>
          )}
          {(ranch.header_image || ranch.logo) && (
            <h2 style={{ fontSize: '1.4rem', color: '#333', marginTop: '8px' }}>{ranch.business_name}</h2>
          )}
          {(ranch.address_city || ranch.address_state) && (
            <p style={{ color: '#888', fontSize: '0.9rem', margin: '4px 0 0' }}>
              {[ranch.address_city, ranch.address_state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '24px', overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setTab(tab.key)}
              style={{
                padding: '10px 20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                backgroundColor: activeTab === tab.key ? '#507033' : 'transparent',
                color: activeTab === tab.key ? '#fff' : '#555',
                fontWeight: activeTab === tab.key ? 700 : 400,
                borderBottom: activeTab === tab.key ? '2px solid #507033' : 'none',
                fontSize: '0.9rem',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'home' && (
          <div>
            {ranch.home_heading && <h2 style={{ marginBottom: '16px' }}>{ranch.home_heading}</h2>}
            {ranch.home_text && <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#444', marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: ranch.home_text }} />}
            {ranch.home_text2 && <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#444', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: ranch.home_text2 }} />}

            {/* Contact info block */}
            <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1rem' }}>{ranch.business_name}</strong>
              {[ranch.address_street, ranch.address_city && `${ranch.address_city}, ${ranch.address_state} ${ranch.address_zip}`, ranch.address_country]
                .filter(Boolean).map((line, i) => <p key={i} style={{ margin: '0 0 4px', fontSize: '0.9rem', color: '#555' }}>{line}</p>)}
              {ranch.email && <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                <a href={`mailto:${ranch.email}`} style={{ color: '#507033' }}>{ranch.email}</a>
              </p>}
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {SOCIAL_LINKS.map(s => ranch[s.key] ? (
                <a key={s.key} href={ranch[s.key].startsWith('http') ? ranch[s.key] : `${s.base}${ranch[s.key]}`}
                  target="_blank" rel="noopener noreferrer">
                  <img src={s.icon} alt={s.alt} style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                </a>
              ) : null)}
            </div>

            <button onClick={() => setTab('contact')}
              style={{ backgroundColor: '#507033', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
              {t('ranch_profile.contact_btn')}
            </button>
          </div>
        )}

        {activeTab === 'animals' && <AnimalsTab businessId={businessId} isStuds={false} />}
        {activeTab === 'studs' && <AnimalsTab businessId={businessId} isStuds={true} />}
        {activeTab === 'events' && <EventsTab events={events} />}
        {activeTab === 'contact' && <ContactTab ranch={ranch} />}
      </div>

      <Footer />
    </div>
  );
}

const btnStyle = { padding: '5px 12px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.85rem' };
const formLabel = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '4px' };
const formInput = { width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem', boxSizing: 'border-box' };
