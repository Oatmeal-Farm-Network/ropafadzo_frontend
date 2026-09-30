import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useAccount } from './AccountContext';
import { useLanguage } from './LanguageContext';
import { typeAdminModule } from './eventTypeAdminMap';

const API = import.meta.env.VITE_API_URL || '';
const CREAM = '#f7f2e8';
const OLIVE = '#5b7044';
const INK = '#2c2c2c';
const MUTED = '#6b6b6b';
const FALLBACK_IMG = '/images/EventsHeader.webp';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function IconCal({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function IconPin({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconPhone({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
function IconMail({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function IconWeb({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
    </svg>
  );
}
function IconPeople({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
    </svg>
  );
}

function AdminToolbar({ ev, eventId, businessId }) {
  const { t } = useTranslation();
  const typeModule = typeAdminModule(ev.EventType);
  const bizQs = businessId ? `?BusinessID=${businessId}` : '';
  const link =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold no-underline transition-colors';

  return (
    <div
      className="rounded-2xl px-4 py-3 mb-6 flex flex-wrap items-center gap-2"
      style={{ background: '#eceae6' }}
    >
      <span className="text-[10px] font-bold tracking-[0.14em] uppercase mr-1" style={{ color: OLIVE }}>
        {t('events.admin_label')}
      </span>
      <Link
        to={`/events/${eventId}/dashboard`}
        className={link}
        style={{ background: OLIVE, color: '#fff' }}
      >
        {t('events.admin_dashboard')}
      </Link>
      {typeModule && (
        <Link
          to={`/events/${eventId}/${typeModule.path}${bizQs}`}
          className={link}
          style={{ background: '#fff', color: OLIVE, border: `1px solid ${OLIVE}33` }}
        >
          {typeModule.label}
        </Link>
      )}
      <Link to={`/events/${eventId}/checkin`} className={link} style={{ background: '#fff', color: INK }}>
        {t('events.checkin_link')}
      </Link>
      <Link to={`/events/${eventId}/broadcast`} className={link} style={{ background: '#fff', color: INK }}>
        {t('events.broadcast_link')}
      </Link>
      <Link to={`/events/${eventId}/analytics`} className={link} style={{ background: '#fff', color: INK }}>
        {t('events.analytics_link')}
      </Link>
      <a href={`${API}/api/events/${eventId}/attendees.csv`} className={link} style={{ background: '#fff', color: INK }}>
        {t('events.attendees_csv')}
      </a>
      <a href={`${API}/api/events/${eventId}/calendar.ics`} className={link} style={{ background: '#fff', color: INK }}>
        {t('events.export_ics')}
      </a>
      <Link to={`/account/events?edit=${eventId}`} className={link} style={{ background: '#fff', color: INK }}>
        {t('events.edit_details')}
      </Link>
      <Link to="/account/events" className={link} style={{ background: '#fff', color: MUTED }}>
        {t('events.all_my_events')}
      </Link>
    </div>
  );
}

function PublicFeatureCTAs({ features, ev, eventId }) {
  const { t } = useTranslation();
  const publics = (features || []).filter((f) => f.PublicPath);
  if (publics.length === 0 && !ev.RegistrationRequired && !ev.EventStartDate) return null;

  const isExternal = (p) => /^https?:\/\//.test(p) || p.startsWith('/api/');
  const core = publics.find((f) => f.IsCoreModule);
  const calendar = publics.find((f) => f.FeatureKey === 'calendar_ics');
  const extras = publics.filter(
    (f) => !f.IsCoreModule && f.FeatureKey !== 'calendar_ics' && !isExternal(f.PublicPath)
  );

  const WIZARD_KEYS = new Set([
    'halter_module',
    'fleece_module',
    'spinoff_module',
    'fiber_arts_module',
    'vendor_fair_module',
  ]);
  const hasWizardFeature = publics.some((f) => WIZARD_KEYS.has(f.FeatureKey));

  const primary =
    'w-full block text-center font-bold py-3.5 rounded-xl transition-opacity hover:opacity-90 text-sm no-underline';
  const secondary =
    'w-full block text-center text-sm py-3 rounded-xl no-underline font-semibold transition-colors';

  return (
    <div className="space-y-2.5">
      {hasWizardFeature && (
        <a href={`/events/${eventId}/register/wizard`} className={primary} style={{ background: OLIVE, color: '#ffffff' }}>
          {t('events.register_btn')}
        </a>
      )}

      {!hasWizardFeature && core && (
        <a href={core.PublicPath} className={primary} style={{ background: OLIVE, color: '#ffffff' }}>
          {core.Icon && <span className="mr-2">{core.Icon}</span>}
          {core.FeatureName} →
        </a>
      )}

      {!hasWizardFeature && !core && ev.RegistrationRequired && (
        <a href={`/events/${eventId}/register`} className={primary} style={{ background: OLIVE, color: '#ffffff' }}>
          {t('events.register_btn_simple')}
        </a>
      )}

      {calendar && ev.EventStartDate && (
        <a
          href={`${API}${calendar.PublicPath}`}
          className={secondary}
          style={{ background: '#eceae6', color: INK }}
        >
          {t('events.add_to_calendar')}
        </a>
      )}
      {!calendar && ev.EventStartDate && (
        <a
          href={`${API}/api/events/${eventId}/calendar.ics`}
          className={secondary}
          style={{ background: '#eceae6', color: INK }}
        >
          {t('events.add_to_calendar_simple')}
        </a>
      )}

      {extras.map((f) => (
        <a
          key={f.FeatureID}
          href={f.PublicPath}
          title={f.FeatureDescription || ''}
          className={secondary}
          style={{ border: `1.5px solid ${OLIVE}`, color: OLIVE, background: 'transparent' }}
        >
          {f.Icon && <span className="mr-1">{f.Icon}</span>}
          {f.FeatureName} →
        </a>
      ))}
    </div>
  );
}

function FloorPlanCTA({ eventId }) {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/floor-plan`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.floor_plan?.ImageURL) return;
        fetch(`${API}/api/events/${eventId}/floor-plan/summary`)
          .then((r) => (r.ok ? r.json() : null))
          .then((s) => {
            if ((s?.total || 0) > 0) setSummary(s);
          });
      });
  }, [eventId]);
  if (!summary) return null;
  return (
    <Link
      to={`/events/${eventId}/floor-plan`}
      className="block rounded-xl p-4 no-underline hover:opacity-90 transition-opacity mt-3"
      style={{ background: OLIVE, color: '#ffffff' }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-bold text-sm">{t('events.floor_plan_title')}</div>
          <div className="text-xs text-white/80 mt-0.5">
            {t('events.floor_plan_body', {
              available: summary.by_status?.available || 0,
              total: summary.total,
            })}
          </div>
        </div>
        <span className="text-xl font-light">→</span>
      </div>
    </Link>
  );
}

function DetailRow({ icon, children }) {
  return (
    <div className="flex gap-3 py-3 border-b border-black/[0.06] last:border-0">
      <div className="shrink-0 mt-0.5" style={{ color: OLIVE }}>
        {icon}
      </div>
      <div className="text-sm min-w-0 leading-relaxed" style={{ color: INK }}>
        {children}
      </div>
    </div>
  );
}

export default function EventDetail() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { language } = useLanguage();
  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [sponsorTiers, setSponsorTiers] = useState([]);
  const accountCtx = useAccount() || {};
  const myBusinesses = accountCtx.businesses || [];

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}?lang=${language}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setEv(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId, language]);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/features`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setFeatures(Array.isArray(d?.features) ? d.features : []))
      .catch(() => setFeatures([]));
  }, [eventId]);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/sponsors/public`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setSponsorTiers(Array.isArray(d) ? d : []))
      .catch(() => setSponsorTiers([]));
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen font-sans" style={{ background: CREAM }}>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center" style={{ color: MUTED }}>
          {t('events.loading_detail')}
        </div>
        <Footer />
      </div>
    );
  }

  if (!ev) {
    return (
      <div className="min-h-screen font-sans" style={{ background: CREAM }}>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="mb-4" style={{ color: MUTED }}>
            {t('events.not_found')}
          </p>
          <Link to="/events" className="hover:underline font-semibold" style={{ color: OLIVE }}>
            {t('events.back_events')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasOptions = ev.options?.length > 0;
  const isAdmin = !!myBusinesses.find((b) => Number(b.BusinessID) === Number(ev.BusinessID));
  const adminBusinessId = isAdmin ? ev.BusinessID : null;
  const location = [
    ev.EventLocationName,
    ev.EventLocationStreet,
    [ev.EventLocationCity, ev.EventLocationState, ev.EventLocationZip].filter(Boolean).join(', '),
  ].filter(Boolean);

  const locationStr = [ev.EventLocationCity, ev.EventLocationState].filter(Boolean).join(', ');
  const evDesc = ev.EventDescription
    ? ev.EventDescription.replace(/<[^>]+>/g, '').slice(0, 155)
    : `${ev.EventName}${locationStr ? ` in ${locationStr}` : ''}. Register for this farm event on Oatmeal Farm Network.`;
  const evCanonical = `https://oatmealfarmnetwork.com/events/${eventId}`;
  const startIso = ev.EventStartDate ? new Date(ev.EventStartDate).toISOString() : undefined;
  const endIso = ev.EventEndDate ? new Date(ev.EventEndDate).toISOString() : startIso;
  const heroImg = ev.EventImage || FALLBACK_IMG;

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ background: CREAM }}>
      <PageMeta
        title={`${ev.EventName} | Farm Events`}
        description={evDesc}
        keywords={`${ev.EventName}, ${ev.EventType || 'farm event'}, ${ev.BusinessName || ''}, ${locationStr}, farm events`}
        image={ev.EventImage || undefined}
        canonical={evCanonical}
        ogType="event"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: ev.EventName,
            description: evDesc,
            ...(startIso ? { startDate: startIso } : {}),
            ...(endIso ? { endDate: endIso } : {}),
            ...(ev.EventImage ? { image: ev.EventImage } : {}),
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: {
              '@type': 'Place',
              name: ev.EventLocationName || locationStr || 'TBD',
              ...(ev.EventLocationStreet || ev.EventLocationCity
                ? {
                    address: {
                      '@type': 'PostalAddress',
                      ...(ev.EventLocationStreet ? { streetAddress: ev.EventLocationStreet } : {}),
                      ...(ev.EventLocationCity ? { addressLocality: ev.EventLocationCity } : {}),
                      ...(ev.EventLocationState ? { addressRegion: ev.EventLocationState } : {}),
                      ...(ev.EventLocationZip ? { postalCode: ev.EventLocationZip } : {}),
                    },
                  }
                : {}),
            },
            ...(ev.BusinessName
              ? { organizer: { '@type': 'Organization', name: ev.BusinessName } }
              : {}),
            ...(ev.IsFree
              ? {
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: evCanonical,
                  },
                }
              : {}),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://oatmealfarmnetwork.com' },
              { '@type': 'ListItem', position: 2, name: 'Events', item: 'https://oatmealfarmnetwork.com/events' },
              { '@type': 'ListItem', position: 3, name: ev.EventName, item: evCanonical },
            ],
          },
        ]}
      />
      <Header />

      {/* Hero */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: 380 }}>
        <img
          src={heroImg}
          alt=""
          className="w-full h-[240px] md:h-[340px] object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,20,20,0.75) 0%, rgba(20,20,20,0.25) 55%, rgba(20,20,20,0.1) 100%)',
          }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-4 md:px-6 pb-8 md:pb-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {ev.EventType && (
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/90" style={{ color: INK }}>
                {ev.EventType}
              </span>
            )}
            {ev.IsFree ? (
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full text-white" style={{ background: OLIVE }}>
                {t('events.free_badge')}
              </span>
            ) : (
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/90" style={{ color: OLIVE }}>
                {t('events.paid_badge')}
              </span>
            )}
            {ev.RegistrationRequired && (
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                {t('events.reg_required')}
              </span>
            )}
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight max-w-3xl drop-shadow-md"
            style={{ fontFamily: "'Lora', 'Times New Roman', serif", color: '#ffffff' }}
          >
            {ev.EventName}
          </h1>
          {ev.BusinessName && (
            <p className="text-sm mt-2 drop-shadow" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {t('events.hosted_by', { name: ev.BusinessName })}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 grow w-full">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: t('events.title'), to: '/events' },
            { label: ev.EventName },
          ]}
        />

        {isAdmin && <AdminToolbar ev={ev} eventId={eventId} businessId={adminBusinessId} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {ev.EventDescription && (
              <section>
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "'Lora', serif", color: INK }}
                >
                  {t('events.about_event')}
                </h2>
                {/<[a-z][\s\S]*>/i.test(ev.EventDescription || '') ? (
                  <div
                    className="text-[0.95rem] leading-relaxed prose prose-sm max-w-none"
                    style={{ color: '#444' }}
                    dangerouslySetInnerHTML={{ __html: ev.EventDescription }}
                  />
                ) : (
                  <p className="text-[0.95rem] leading-relaxed whitespace-pre-line" style={{ color: '#444' }}>
                    {ev.EventDescription}
                  </p>
                )}
              </section>
            )}

            {ev.dates?.length > 0 && (
              <section>
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "'Lora', serif", color: INK }}
                >
                  {t('events.schedule')}
                </h2>
                <ul className="space-y-2">
                  {ev.dates.map((d) => (
                    <li
                      key={d.DateID}
                      className="flex flex-wrap items-center gap-3 text-sm rounded-xl px-4 py-3"
                      style={{ background: '#fff' }}
                    >
                      <span className="font-semibold" style={{ color: INK }}>
                        {formatDate(d.EventDate)}
                      </span>
                      {(d.StartTime || d.EndTime) && (
                        <span style={{ color: MUTED }}>
                          {d.StartTime}
                          {d.EndTime ? ` – ${d.EndTime}` : ''}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {hasOptions && (
              <section>
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "'Lora', serif", color: INK }}
                >
                  {t('events.reg_options')}
                </h2>
                <div className="rounded-2xl overflow-hidden bg-white divide-y divide-black/[0.06]">
                  {ev.options.map((opt) => (
                    <div key={opt.OptionID} className="px-4 py-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm" style={{ color: INK }}>
                          {opt.OptionName}
                        </p>
                        {opt.OptionDescription && (
                          <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                            {opt.OptionDescription}
                          </p>
                        )}
                        {opt.MaxQty && (
                          <p className="text-xs text-amber-700 mt-0.5">{t('events.opt_limit', { max: opt.MaxQty })}</p>
                        )}
                      </div>
                      <span className="font-bold text-sm shrink-0" style={{ color: OLIVE }}>
                        {parseFloat(opt.Price) === 0
                          ? t('events.free_price')
                          : `$${parseFloat(opt.Price).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sponsorTiers.length > 0 && (
              <section>
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "'Lora', serif", color: INK }}
                >
                  {t('events.thanks_sponsors')}
                </h2>
                <div className="rounded-2xl bg-white p-5 space-y-5">
                  {sponsorTiers.map((tier) => (
                    <div key={tier.TierID}>
                      <div
                        className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3"
                        style={{ color: OLIVE }}
                      >
                        {tier.Name}
                      </div>
                      <div
                        className="grid gap-3"
                        style={{
                          gridTemplateColumns: `repeat(${Math.max(1, Math.min(tier.DisplayColumns || 3, 6))}, minmax(0, 1fr))`,
                        }}
                      >
                        {tier.Sponsors.map((s) => {
                          const inner = s.LogoURL ? (
                            <img
                              src={s.LogoURL}
                              alt={s.Name}
                              className="object-contain mx-auto"
                              style={{
                                maxWidth: tier.LogoSizePx || 200,
                                maxHeight: (tier.LogoSizePx || 200) * 0.6,
                              }}
                            />
                          ) : (
                            <div className="text-sm font-semibold text-center" style={{ color: INK }}>
                              {s.Name}
                            </div>
                          );
                          const wrap = s.WebsiteURL ? (
                            <a
                              href={
                                s.WebsiteURL.startsWith('http')
                                  ? s.WebsiteURL
                                  : `https://${s.WebsiteURL}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:opacity-80 transition-opacity"
                            >
                              {inner}
                            </a>
                          ) : (
                            inner
                          );
                          return (
                            <div key={s.SponsorID} className="text-center" title={s.Tagline || s.Name}>
                              {wrap}
                              {s.Tagline && (
                                <div className="text-[10px] mt-1 italic" style={{ color: MUTED }}>
                                  {s.Tagline}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar — one cohesive panel */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 rounded-2xl bg-white shadow-sm border border-black/[0.04] overflow-hidden">
              <div className="px-5 pt-5 pb-2">
                <h3
                  className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1"
                  style={{ color: OLIVE }}
                >
                  {t('events.event_details_label')}
                </h3>
              </div>

              <div className="px-5 pb-2">
                {ev.EventStartDate && (
                  <DetailRow icon={<IconCal />}>
                    <p className="font-semibold">{formatDate(ev.EventStartDate)}</p>
                    {ev.EventEndDate && ev.EventEndDate !== ev.EventStartDate && (
                      <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                        {t('events.end_date_prefix')} {formatDate(ev.EventEndDate)}
                      </p>
                    )}
                  </DetailRow>
                )}

                {location.length > 0 && (
                  <DetailRow icon={<IconPin />}>
                    {location.map((l, i) => (
                      <p key={i} className={i === 0 ? 'font-semibold' : ''}>
                        {l}
                      </p>
                    ))}
                  </DetailRow>
                )}

                {ev.EventPhone && (
                  <DetailRow icon={<IconPhone />}>
                    <a href={`tel:${ev.EventPhone}`} className="font-medium hover:underline" style={{ color: OLIVE }}>
                      {ev.EventPhone}
                    </a>
                  </DetailRow>
                )}

                {ev.EventContactEmail && (
                  <DetailRow icon={<IconMail />}>
                    <a
                      href={`mailto:${ev.EventContactEmail}`}
                      className="font-medium hover:underline break-all"
                      style={{ color: OLIVE }}
                    >
                      {ev.EventContactEmail}
                    </a>
                  </DetailRow>
                )}

                {ev.EventWebsite && (
                  <DetailRow icon={<IconWeb />}>
                    <a
                      href={
                        ev.EventWebsite.startsWith('http')
                          ? ev.EventWebsite
                          : `https://${ev.EventWebsite}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline break-all"
                      style={{ color: OLIVE }}
                    >
                      {ev.EventWebsite}
                    </a>
                  </DetailRow>
                )}

                {ev.MaxAttendees && (
                  <DetailRow icon={<IconPeople />}>
                    <p>
                      {t('events.max_attendees', {
                        max: ev.MaxAttendees,
                        count: ev.AttendeeCount || 0,
                      })}
                    </p>
                  </DetailRow>
                )}
              </div>

              <div className="px-5 py-5 border-t border-black/[0.06]" style={{ background: CREAM }}>
                <PublicFeatureCTAs features={features} ev={ev} eventId={eventId} />
                <FloorPlanCTA eventId={eventId} />
              </div>

              {ev.BusinessName && (
                <div className="px-5 py-4 border-t border-black/[0.06]">
                  <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-1" style={{ color: MUTED }}>
                    {t('events.organized_by')}
                  </p>
                  <Link
                    to={`/profile?BusinessID=${ev.BusinessID}`}
                    className="font-bold no-underline hover:opacity-80"
                    style={{ color: INK }}
                  >
                    {ev.BusinessName}
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/events"
              className="block text-center text-sm font-semibold mt-4 hover:underline"
              style={{ color: OLIVE }}
            >
              {t('events.all_events')}
            </Link>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
