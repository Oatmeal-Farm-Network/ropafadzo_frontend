// src/Breadcrumbs.jsx
// Reusable breadcrumb nav matching the site-wide style (green #3D6B34 links,
// › separators). Also emits BreadcrumbList JSON-LD to <head> for SEO.
//
// Usage:
//   <Breadcrumbs items={[
//     { label: 'Livestock Marketplace', to: '/marketplaces/livestock' },
//     { label: 'Alpacas', to: '/marketplaces/livestock/alpacas' },
//     { label: 'ALR Josephine' }, // last item (current page) — omit `to`
//   ]} />
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackButton from './BackButton';

const BASE_URL = 'https://oatmealfarmnetwork.com';
const MARKER   = 'data-breadcrumb-jsonld';

export default function Breadcrumbs({ items: rawItems = [], className = '', style = {} }) {
  const { t } = useTranslation();
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('access_token');
  const [psOpen, setPsOpen] = useState(false);
  const psRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!psOpen) return;
    const handler = (e) => { if (psRef.current && !psRef.current.contains(e.target)) setPsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [psOpen]);

  // When signed in, the Dashboard is the user's home. Swap any leading "Home → /"
  // crumb for "Dashboard → /dashboard", then collapse the duplicate if the next
  // crumb is already Dashboard.
  const items = (() => {
    if (!isLoggedIn || !rawItems.length) return rawItems;
    const first = rawItems[0];
    if (first.to !== '/' && first.label !== 'Home') return rawItems;
    const rest = rawItems.slice(1);
    if (rest.length && (rest[0].label === 'Dashboard' || rest[0].to === '/dashboard')) {
      return rest;
    }
    return [{ label: 'Dashboard', to: '/dashboard' }, ...rest];
  })();

  const key = JSON.stringify(items);
  const backFallback = items.find((it) => it.to)?.to;

  useEffect(() => {
    if (!items || items.length === 0) return;
    const list = items.map((it, i) => {
      const entry = {
        '@type': 'ListItem',
        position: i + 1,
        name: it.label,
      };
      if (it.to) entry.item = BASE_URL + it.to;
      return entry;
    });
    const data = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: list,
    };
    document.querySelectorAll(`script[${MARKER}]`).forEach(el => el.remove());
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute(MARKER, 'true');
    el.text = JSON.stringify(data);
    document.head.appendChild(el);
    return () => {
      document.querySelectorAll(`script[${MARKER}]`).forEach(el => el.remove());
    };
  }, [key]);

  if (!items || items.length === 0) return null;

  return (
    <div
      className={`text-xs mb-3 flex flex-wrap items-center ${className}`}
      style={style}
      data-ofn-breadcrumbs
    >
      <nav
        aria-label={t('breadcrumbs.nav_aria')}
        className="flex flex-wrap items-center"
        style={{ gap: 4, color: '#6b7280' }}
      >
        <BackButton fallbackTo={backFallback} style={{ marginRight: 2 }} />
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <span aria-hidden="true" style={{ color: '#9ca3af' }}>›</span>}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  style={{ color: '#3D6B34', textDecoration: 'none', fontWeight: 600 }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{ color: isLast ? '#374151' : '#6b7280' }}
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {isLoggedIn && (
        <div className="ml-auto relative" ref={psRef}>
          <button
            onClick={() => setPsOpen(o => !o)}
            title={t('breadcrumbs.btn_personal_settings')}
            style={{ color: '#3D6B34', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="5" r="2.5"/>
              <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5"/>
            </svg>
          </button>
          {psOpen && (
            <div
              className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
              style={{ minWidth: 200 }}
            >
              <Link
                to="/account/settings"
                onClick={() => setPsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                style={{ color: '#374151', textDecoration: 'none', fontSize: '0.8rem' }}
              >
                {t('breadcrumbs.link_account')}
              </Link>
              <Link
                to="/account/settings?tab=audio"
                onClick={() => setPsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                style={{ color: '#374151', textDecoration: 'none', fontSize: '0.8rem' }}
              >
                {t('breadcrumbs.link_language')}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
