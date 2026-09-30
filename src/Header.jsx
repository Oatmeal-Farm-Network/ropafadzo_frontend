import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import NotificationBell from './NotificationBell';
import CartBell from './CartBell';
import LanguageSelector from './LanguageSelector';
import { PRECISION_AG_ONLY } from './precisionAgMode';

const OTF_API = import.meta.env.VITE_OTF_API_URL || '';

// AI advisor destinations: logged-in users go straight to the actual advisor tool;
// logged-out visitors get the marketing "About" page (/platform/<slug>).
const AI_ADVISOR_ROUTE = {
  saige:     '/saige',       // Saige advisor page
  cassia:    '/cassia',      // Cassia onboarding
  pairsley:  '/chef',        // Pairsley chat lives on the Chef Dashboard
  rosemarie: '/recipes',     // Rosemarie = Recipe Manager
  thaiyme:   '/accounting',  // Thaiyme chat lives on Accounting
};
const advisorTo = (slug, isLoggedIn) =>
  (isLoggedIn && AI_ADVISOR_ROUTE[slug]) || `/platform/${slug}`;

const Header = () => {
  const { t } = useTranslation();
  const [activeNavKeys, setActiveNavKeys] = useState(new Set());
  const [navLoaded, setNavLoaded] = useState(false);

  // Returns true if item should be shown (defaults true until config loads)
  const nav = (key) => {
    if (PRECISION_AG_ONLY && (key === 'marketplaces' || key === 'newsroom')) return false;
    return !navLoaded || activeNavKeys.has(key);
  };
  const { businesses, clearBusiness } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const [kbMobileOpen, setKbMobileOpen] = useState(false);
  const [mktOpen, setMktOpen] = useState(false);
  const [mktMobileOpen, setMktMobileOpen] = useState(false);
  const [nrOpen, setNrOpen] = useState(false);
  const [nrMobileOpen, setNrMobileOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [svcMobileOpen, setSvcMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMobileOpen, setAiMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [psOpen, setPsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const kbRef = useRef(null);
  const mktRef = useRef(null);
  const nrRef = useRef(null);
  const svcRef = useRef(null);
  const aiRef = useRef(null);
  const psRef = useRef(null);

  // Fetch active nav keys from OAT backend (fails silently — all items show if unavailable)
  useEffect(() => {
    fetch(`${OTF_API}/api/admin/ofn-nav/public`)
      .then(r => r.ok ? r.json() : [])
      .then(items => {
        setActiveNavKeys(new Set(items.map(i => i.NavKey)));
        setNavLoaded(true);
      })
      .catch(() => setNavLoaded(false));
  }, []);

  useEffect(() => {
    const refreshAuth = () => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
      const peopleId = localStorage.getItem('people_id') || localStorage.getItem('PeopleID');
      const firstName =
        localStorage.getItem('first_name') ||
        localStorage.getItem('PeopleFirstName') ||
        '';

      // Token is the source of truth for authentication. Name is display-only.
      if (token && peopleId) {
        setIsLoggedIn(true);
        setUser({ firstName, peopleId });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      console.debug('[Header] auth check', { hasToken: !!token, hasPeopleId: !!peopleId, hasFirstName: !!firstName });
    };
    refreshAuth();
    window.addEventListener('storage', refreshAuth);
    return () => window.removeEventListener('storage', refreshAuth);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (kbRef.current && !kbRef.current.contains(e.target)) setKbOpen(false);
      if (mktRef.current && !mktRef.current.contains(e.target)) setMktOpen(false);
      if (nrRef.current && !nrRef.current.contains(e.target)) setNrOpen(false);
      if (svcRef.current && !svcRef.current.contains(e.target)) setSvcOpen(false);
      if (aiRef.current && !aiRef.current.contains(e.target)) setAiOpen(false);
      if (psRef.current && !psRef.current.contains(e.target)) setPsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
  ['access_token', 'people_id', 'first_name', 'last_name', 'access_level',
   'AccessToken', 'PeopleID', 'PeopleFirstName', 'PeopleLastName', 'AccessLevel',
   'selected_business_id']
    .forEach(k => localStorage.removeItem(k));
  Object.keys(localStorage)
  .filter(k => k.startsWith('saige_'))
  .forEach(k => localStorage.removeItem(k));
  clearBusiness();
  setIsLoggedIn(false);
  setUser(null);
  navigate('/login');
};

  const KbDropdown = () => (
    <div className="absolute top-full left-0 pt-2 w-48 z-10000">
      <div className="bg-white rounded shadow-lg overflow-hidden">
        {nav('kb_plants')      && <Link to="/plant-knowledgebase"       onClick={() => setKbOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.plants')}</Link>}
        {nav('kb_livestock')   && <Link to="/livestock"                 onClick={() => setKbOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.livestock_breeds')}</Link>}
        {nav('kb_ingredients') && <Link to="/ingredient-knowledgebase"  onClick={() => setKbOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.ingredients')}</Link>}
      </div>
    </div>
  );

  const NrDropdown = () => (
    <div className="absolute top-full left-0 pt-2 w-44 z-10000">
      <div className="bg-white rounded shadow-lg overflow-hidden">
        {nav('nr_newsfeed') && <Link to="/app/news" onClick={() => setNrOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.newsfeed')}</Link>}
        {nav('nr_blogs')    && <Link to="/blog"     onClick={() => setNrOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.blogs')}</Link>}
      </div>
    </div>
  );

  const FALLBACK_AGENTS = [
    { ServiceID: 'f1', Slug: 'saige',     Title: 'Saige',     IconEmoji: '🌾', RoutePath: '/platform/saige',     IsAgent: true },
    { ServiceID: 'f2', Slug: 'rosemarie', Title: 'Rosemarie', IconEmoji: '🌿', RoutePath: '/platform/rosemarie', IsAgent: true },
    { ServiceID: 'f3', Slug: 'pairsley',  Title: 'Pairsley',  IconEmoji: '🍳', RoutePath: '/platform/pairsley',  IsAgent: true },
  ];
  const FALLBACK_PLATFORM = [
    { ServiceID: 'p1', Slug: 'website-builder', Title: 'Website Builder', IconEmoji: '🖥️', RoutePath: '/platform/website-builder', IsAgent: false },
    { ServiceID: 'p2', Slug: 'marketplace',     Title: 'Marketplace',     IconEmoji: '🛒', RoutePath: '/platform/marketplace',     IsAgent: false },
    { ServiceID: 'p3', Slug: 'events',          Title: 'Events',          IconEmoji: '🎪', RoutePath: '/platform/events',          IsAgent: false },
    { ServiceID: 'p4', Slug: 'crop-monitor',    Title: 'Crop Monitor',    IconEmoji: '🛰️', RoutePath: '/platform/crop-monitor',    IsAgent: false },
    { ServiceID: 'p5', Slug: 'directory',       Title: 'Directory',       IconEmoji: '📖', RoutePath: '/platform/directory',       IsAgent: false },
  ];

  const SVC_AGENT_KEYS   = { f1: 'svc_saige', f2: 'svc_rosemarie', f3: 'svc_pairsley' };
  const SVC_PLATFORM_KEYS = { p1: 'svc_website', p2: 'svc_marketplace', p3: 'svc_events', p4: 'svc_crop_monitor', p5: 'svc_directory' };

  const SvcDropdown = () => (
    <div className="absolute top-full left-0 pt-2 w-56 z-10000">
      <div className="bg-white rounded shadow-lg overflow-hidden py-1">
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('nav.ai_agents')}</p>
        {FALLBACK_AGENTS.filter(s => nav(SVC_AGENT_KEYS[s.ServiceID])).map(s => (
          <Link key={s.ServiceID} to={s.RoutePath}
            onClick={() => setSvcOpen(false)}
            className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
            {s.Title}
          </Link>
        ))}
        <hr className="my-1 border-gray-100" />
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{t('nav.platform_services')}</p>
        {FALLBACK_PLATFORM.filter(s => nav(SVC_PLATFORM_KEYS[s.ServiceID])).map(s => (
          <Link key={s.ServiceID} to={s.RoutePath}
            onClick={() => setSvcOpen(false)}
            className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
            {s.Title}
          </Link>
        ))}
      </div>
    </div>
  );

  const SvcMobileLinks = () => (
    <ul className="mt-2 space-y-2 text-sm">
      {FALLBACK_AGENTS.filter(s => nav(SVC_AGENT_KEYS[s.ServiceID])).map(s => (
        <li key={s.ServiceID}><Link to={s.RoutePath} onClick={() => setIsOpen(false)} className="!text-white/80 block">{s.Title}</Link></li>
      ))}
      {FALLBACK_PLATFORM.filter(s => nav(SVC_PLATFORM_KEYS[s.ServiceID])).map(s => (
        <li key={s.ServiceID}><Link to={s.RoutePath} onClick={() => setIsOpen(false)} className="!text-white/80 block">{s.Title}</Link></li>
      ))}
    </ul>
  );

  const MktDropdown = () => (
    <div className="absolute top-full left-0 pt-2 w-56 z-10000">
      <div className="bg-white rounded shadow-lg overflow-hidden">
        {nav('mkt_farm2table')   && <Link to="/marketplaces/farm-to-table" onClick={() => setMktOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.farm2table')}</Link>}
        {nav('mkt_products')     && <Link to="/marketplace/products"       onClick={() => setMktOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.products_marketplace')}</Link>}
        {nav('mkt_livestock')    && <Link to="/marketplaces/livestock"      onClick={() => setMktOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.livestock_marketplace')}</Link>}
        {nav('mkt_equipment')    && <Link to="/marketplaces/equipment"      onClick={() => setMktOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Equipment Marketplace</Link>}
        {nav('mkt_realestate')   && <Link to="/marketplaces/real-estate"    onClick={() => setMktOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Real Estate For Sale</Link>}
        {nav('mkt_services_dir') && <><hr className="my-1 border-gray-100" /><Link to="/services/directory" onClick={() => setMktOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.services_directory')}</Link></>}
        {nav('mkt_events')       && <><hr className="my-1 border-gray-100" /><Link to="/events"             onClick={() => setMktOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">{t('nav.events')}</Link></>}
      </div>
    </div>
  );

  const KbMobileLinks = () => (
    <ul className="mt-2 space-y-2 text-sm">
      {nav('kb_plants')      && <li><Link to="/plant-knowledgebase"      onClick={() => setIsOpen(false)} className="!text-white/80 block">{t('nav.plants')}</Link></li>}
      {nav('kb_livestock')   && <li><Link to="/livestock"                onClick={() => setIsOpen(false)} className="!text-white/80 block">{t('nav.livestock_breeds')}</Link></li>}
      {nav('kb_ingredients') && <li><Link to="/ingredient-knowledgebase" onClick={() => setIsOpen(false)} className="!text-white/80 block">{t('nav.ingredients')}</Link></li>}
    </ul>
  );

  const MktMobileLinks = () => (
    <ul className="mt-2 space-y-2 text-sm">
      {nav('mkt_farm2table')   && <li><Link to="/marketplaces/farm-to-table" onClick={() => setIsOpen(false)} className="!text-white/80 block">{t('nav.farm2table')}</Link></li>}
      {nav('mkt_products')     && <li><Link to="/marketplace/products"       onClick={() => setIsOpen(false)} className="!text-white/80 block">{t('nav.products_marketplace')}</Link></li>}
      {nav('mkt_livestock')    && <li><Link to="/marketplaces/livestock"      onClick={() => setIsOpen(false)} className="!text-white/80 block">{t('nav.livestock_marketplace')}</Link></li>}
      {nav('mkt_equipment')    && <li><Link to="/marketplaces/equipment"      onClick={() => setIsOpen(false)} className="!text-white/80 block">Equipment Marketplace</Link></li>}
      {nav('mkt_realestate')   && <li><Link to="/marketplaces/real-estate"    onClick={() => setIsOpen(false)} className="!text-white/80 block">Real Estate For Sale</Link></li>}
      {nav('mkt_services_dir') && <li><Link to="/services/directory"          onClick={() => setIsOpen(false)} className="!text-white/80 block">{t('nav.services_directory')}</Link></li>}
      {nav('mkt_events')       && <li><Link to="/events"                      onClick={() => setIsOpen(false)} className="!text-white/80 block">{t('nav.events')}</Link></li>}
    </ul>
  );

  const AiDropdown = () => (
    <div className="absolute top-full left-0 pt-2 w-44 z-10000">
      <div className="bg-white rounded shadow-lg overflow-hidden">
        {nav('ai_saige')    && <Link to={advisorTo('saige', isLoggedIn)}     onClick={() => setAiOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Saige</Link>}
        {(nav('ai_cassia') || nav('ai_saige')) && <Link to={advisorTo('cassia', isLoggedIn)}    onClick={() => setAiOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Cassia</Link>}
        {nav('ai_pairsley') && <Link to={advisorTo('pairsley', isLoggedIn)}  onClick={() => setAiOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Pairsley</Link>}
        {nav('ai_rosemarie')&& <Link to={advisorTo('rosemarie', isLoggedIn)} onClick={() => setAiOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Rosemarie</Link>}
        {nav('ai_thaiyme')  && <Link to={advisorTo('thaiyme', isLoggedIn)}   onClick={() => setAiOpen(false)} className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Thaiyme</Link>}
      </div>
    </div>
  );

  const AiMobileLinks = () => (
    <ul className="mt-2 space-y-2 text-sm">
      {nav('ai_saige')     && <li><Link to={advisorTo('saige', isLoggedIn)}     onClick={() => setIsOpen(false)} className="!text-white/80 block">Saige</Link></li>}
      {(nav('ai_cassia') || nav('ai_saige')) && <li><Link to={advisorTo('cassia', isLoggedIn)}    onClick={() => setIsOpen(false)} className="!text-white/80 block">Cassia</Link></li>}
      {nav('ai_pairsley')  && <li><Link to={advisorTo('pairsley', isLoggedIn)}  onClick={() => setIsOpen(false)} className="!text-white/80 block">Pairsley</Link></li>}
      {nav('ai_rosemarie') && <li><Link to={advisorTo('rosemarie', isLoggedIn)} onClick={() => setIsOpen(false)} className="!text-white/80 block">Rosemarie</Link></li>}
      {nav('ai_thaiyme')   && <li><Link to={advisorTo('thaiyme', isLoggedIn)}   onClick={() => setIsOpen(false)} className="!text-white/80 block">Thaiyme</Link></li>}
    </ul>
  );

  const LoginIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );

  const ChevronIcon = ({ open }) => (
    <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const LORA = "'Lora', 'Times New Roman', serif";
  const guestLinkClass =
    'no-underline transition-opacity hover:opacity-85 text-[14px] xl:text-[15px]';
  const guestLinkStyle = { color: '#ffffff', fontFamily: LORA };
  const appLinkStyle = { color: '#ffffff' };
  // Logged-out: simple marketing nav on every page. Logged-in: full app nav.
  const isGuest = !isLoggedIn;
  const headerBg = '#8b3a2b';

  return (
    <nav
      className={`relative py-3.5 px-5 md:px-8 shadow-md sticky top-0 z-10000 ${isGuest ? '' : 'font-montserrat'}`}
      style={{ backgroundColor: headerBg }}
    >
      <div
        className={`mx-auto flex justify-between items-center gap-4 ${isGuest ? 'max-w-[1400px]' : 'max-w-[1400px]'}`}
      >

        {/* Logo */}
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center shrink-0">
          <img
            src="/images/Oatmeal-Farm-Network-logo-horizontal-white.webp"
            className="h-11 md:h-[52px]"
            alt="Oatmeal Farm Network"
            width="160"
            height="40"
            fetchPriority="high"
          />
        </Link>

        {/* Guest nav — Home, Directory, Knowledgebases, Marketplaces, Saige, Contact, Login */}
        {isGuest ? (
          <>
            <div
              className="hidden md:flex items-center ml-auto shrink-0"
              style={{ gap: '1.75rem' }}
            >
              {[
                { to: '/', label: t('nav.home') },
                { to: '/directory', label: t('nav.directory') },
                { to: '/knowledgebases', label: t('nav.knowledgebases') },
                { to: '/marketplaces', label: t('nav.marketplaces') },
                { to: '/platform/saige', label: t('nav.saige', 'Saige') },
                { to: '/contact-us', label: t('nav.contact') },
                { to: '/login', label: t('nav.login') },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={guestLinkClass}
                  style={{ ...guestLinkStyle, whiteSpace: 'nowrap', display: 'inline-block' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="md:hidden flex justify-end ml-auto">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl focus:outline-none" type="button" aria-label="Menu">
                {isOpen ? '✕' : '☰'}
              </button>
            </div>
            {isOpen && (
              <div
                className="md:hidden absolute top-full left-0 w-full border-t border-white/10 shadow-xl z-50"
                style={{ backgroundColor: '#8b3a2b' }}
              >
                <div className="flex flex-col p-6 gap-4 text-base font-normal text-center">
                  {[
                    { to: '/', label: t('nav.home') },
                    { to: '/directory', label: t('nav.directory') },
                    { to: '/knowledgebases', label: t('nav.knowledgebases') },
                    { to: '/marketplaces', label: t('nav.marketplaces') },
                    { to: '/platform/saige', label: t('nav.saige', 'Saige') },
                    { to: '/contact-us', label: t('nav.contact') },
                    { to: '/login', label: t('nav.login') },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="block"
                      style={guestLinkStyle}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
        {/* Desktop Navigation (logged in) */}
        <div
          className="hidden xl:flex flex-1 items-center justify-center min-w-0"
          style={{ gap: '1.25rem' }}
        >
          {nav('dashboard') && (
            <Link to="/dashboard" className="nav-link text-xs whitespace-nowrap" style={appLinkStyle}>
              {t('nav.dashboard')}
            </Link>
          )}
          {nav('directory') && (
            <Link to="/directory" className="nav-link text-xs whitespace-nowrap" style={appLinkStyle}>
              {t('nav.directory')}
            </Link>
          )}

          {nav('marketplaces') && (
            <div className="relative shrink-0" ref={mktRef} onMouseEnter={() => setMktOpen(true)} onMouseLeave={() => setMktOpen(false)}>
              <button onClick={() => setMktOpen(!mktOpen)} className="nav-link flex items-center gap-1 focus:outline-none text-xs whitespace-nowrap" style={appLinkStyle}>
                {t('nav.marketplaces')} <ChevronIcon open={mktOpen} />
              </button>
              {mktOpen && <MktDropdown />}
            </div>
          )}

          {nav('services') && (
            <div className="relative shrink-0" ref={svcRef} onMouseEnter={() => setSvcOpen(true)} onMouseLeave={() => setSvcOpen(false)}>
              <button onClick={() => setSvcOpen(!svcOpen)} className="nav-link flex items-center gap-1 focus:outline-none text-xs whitespace-nowrap" style={appLinkStyle}>
                {t('nav.services')} <ChevronIcon open={svcOpen} />
              </button>
              {svcOpen && <SvcDropdown />}
            </div>
          )}

          {nav('ai_advisors') && (
            <div className="relative shrink-0" ref={aiRef} onMouseEnter={() => setAiOpen(true)} onMouseLeave={() => setAiOpen(false)}>
              <button onClick={() => setAiOpen(!aiOpen)} className="nav-link flex items-center gap-1 focus:outline-none text-xs whitespace-nowrap" style={appLinkStyle}>
                {t('nav.ai_advisors', 'AI Advisors')} <ChevronIcon open={aiOpen} />
              </button>
              {aiOpen && <AiDropdown />}
            </div>
          )}

          {nav('newsroom') && (
            <div className="relative shrink-0" ref={nrRef} onMouseEnter={() => setNrOpen(true)} onMouseLeave={() => setNrOpen(false)}>
              <button onClick={() => setNrOpen(!nrOpen)} className="nav-link flex items-center gap-1 focus:outline-none text-xs whitespace-nowrap" style={appLinkStyle}>
                {t('nav.newsroom')} <ChevronIcon open={nrOpen} />
              </button>
              {nrOpen && <NrDropdown />}
            </div>
          )}

          {nav('knowledgebases') && (
            <div className="relative shrink-0" ref={kbRef} onMouseEnter={() => setKbOpen(true)} onMouseLeave={() => setKbOpen(false)}>
              <button onClick={() => setKbOpen(!kbOpen)} className="nav-link flex items-center gap-1 focus:outline-none text-xs whitespace-nowrap" style={appLinkStyle}>
                {t('nav.knowledgebases')} <ChevronIcon open={kbOpen} />
              </button>
              {kbOpen && <KbDropdown />}
            </div>
          )}

          {nav('contact') && (
            <Link to="/contact-us" className="nav-link text-xs whitespace-nowrap" style={appLinkStyle}>
              {t('nav.contact')}
            </Link>
          )}
        </div>

        {/* Utility icons (logged in) */}
        <div className="hidden xl:flex items-center shrink-0" style={{ gap: '0.75rem' }}>
          {!PRECISION_AG_ONLY && <CartBell />}
          <NotificationBell />
          <LanguageSelector />
          <div className="relative" ref={psRef}>
            <button
              onClick={() => setPsOpen(o => !o)}
              onMouseEnter={() => setPsOpen(true)}
              title="Personal Settings"
              className="text-white/80 hover:text-white transition-colors flex items-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            </button>
            {psOpen && (
              <div
                className="absolute right-0 top-full pt-2 w-52 z-10000"
                onMouseLeave={() => setPsOpen(false)}
              >
                <div className="bg-white rounded shadow-lg overflow-hidden">
                  <Link to="/account/settings" onClick={() => setPsOpen(false)} className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">Login &amp; Account</Link>
                  <Link to="/account/settings?tab=audio" onClick={() => setPsOpen(false)} className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">Language &amp; Audio Settings</Link>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title={t('nav.log_out')}
            className="text-white/80 hover:text-white transition-colors flex items-center"
          >
            <LogoutIcon />
          </button>
        </div>

        {/* Hamburger (logged in) */}
        <div className="xl:hidden flex items-center gap-3 ml-auto shrink-0">
          <div className="flex items-center gap-2">
            {!PRECISION_AG_ONLY && <CartBell />}
            <NotificationBell />
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl focus:outline-none" type="button" aria-label="Menu">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

      {/* Mobile Menu (logged in) */}
      {isOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full border-t border-white/10 shadow-xl z-50" style={{ backgroundColor: headerBg }}>
          <div className="flex flex-col p-6 gap-4 text-base font-normal text-center">

            {nav('dashboard') && (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="nav-link block" style={appLinkStyle}>
                {t('nav.dashboard')}
              </Link>
            )}
            {nav('directory') && (
              <Link to="/directory" onClick={() => setIsOpen(false)} className="nav-link block" style={appLinkStyle}>
                {t('nav.directory')}
              </Link>
            )}

            {nav('marketplaces') && (
              <div>
                <button onClick={() => setMktMobileOpen(!mktMobileOpen)} className="flex items-center justify-center gap-1 w-full" style={appLinkStyle}>
                  {t('nav.marketplaces')} <ChevronIcon open={mktMobileOpen} />
                </button>
                {mktMobileOpen && <MktMobileLinks />}
              </div>
            )}

            {nav('services') && (
              <div>
                <button onClick={() => setSvcMobileOpen(!svcMobileOpen)} className="flex items-center justify-center gap-1 w-full" style={appLinkStyle}>
                  {t('nav.services')} <ChevronIcon open={svcMobileOpen} />
                </button>
                {svcMobileOpen && <SvcMobileLinks />}
              </div>
            )}

            {nav('ai_advisors') && (
              <div>
                <button onClick={() => setAiMobileOpen(!aiMobileOpen)} className="flex items-center justify-center gap-1 w-full" style={appLinkStyle}>
                  {t('nav.ai_advisors', 'AI Advisors')} <ChevronIcon open={aiMobileOpen} />
                </button>
                {aiMobileOpen && <AiMobileLinks />}
              </div>
            )}

            {nav('newsroom') && (
              <div>
                <button onClick={() => setNrMobileOpen(!nrMobileOpen)} className="flex items-center justify-center gap-1 w-full" style={appLinkStyle}>
                  {t('nav.newsroom')} <ChevronIcon open={nrMobileOpen} />
                </button>
                {nrMobileOpen && (
                  <div className="mt-2 flex flex-col gap-2 text-sm">
                    {nav('nr_newsfeed') && <Link to="/app/news" onClick={() => setIsOpen(false)} className="block" style={{ color: 'rgba(255,255,255,0.85)' }}>{t('nav.newsfeed')}</Link>}
                    {nav('nr_blogs')    && <Link to="/blog"     onClick={() => setIsOpen(false)} className="block" style={{ color: 'rgba(255,255,255,0.85)' }}>{t('nav.blogs')}</Link>}
                  </div>
                )}
              </div>
            )}

            {nav('knowledgebases') && (
              <div>
                <button onClick={() => setKbMobileOpen(!kbMobileOpen)} className="flex items-center justify-center gap-1 w-full" style={appLinkStyle}>
                  {t('nav.knowledgebases')} <ChevronIcon open={kbMobileOpen} />
                </button>
                {kbMobileOpen && <KbMobileLinks />}
              </div>
            )}

            {nav('contact') && (
              <Link to="/contact-us" onClick={() => setIsOpen(false)} className="nav-link block" style={appLinkStyle}>
                {t('nav.contact')}
              </Link>
            )}

            <div className="flex items-center justify-center gap-5 pt-2">
              <LanguageSelector />
              <button onClick={handleLogout} title={t('nav.log_out')} className="text-white/80 hover:text-white transition-colors flex items-center">
                <LogoutIcon />
              </button>
            </div>
          </div>
        </div>
      )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;