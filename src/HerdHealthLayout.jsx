import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import SaigeWidget from './SaigeWidget';

const ACCENT = '#3D6B34';

const S = ({ children }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const NAV_ITEMS = [
  {
    key: 'dashboard',
    labelKey: 'nav_dashboard',
    path: '/herd-health',
    icon: <S><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></S>,
  },
  {
    key: 'events',
    labelKey: 'nav_events',
    path: '/herd-health/events',
    icon: <S><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></S>,
  },
  {
    key: 'vaccinations',
    labelKey: 'nav_vaccinations',
    path: '/herd-health/vaccinations',
    icon: <S><path d="M19 9l-7 7-7-7"/><line x1="12" y1="16" x2="12" y2="3"/><path d="M5 21h14"/></S>,
  },
  {
    key: 'treatments',
    labelKey: 'nav_treatments',
    path: '/herd-health/treatments',
    icon: <S><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></S>,
  },
  {
    key: 'vet-visits',
    labelKey: 'nav_vet_visits',
    path: '/herd-health/vet-visits',
    icon: <S><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></S>,
  },
  {
    key: 'medications',
    labelKey: 'nav_medications',
    path: '/herd-health/medications',
    icon: <S><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"/><circle cx="18" cy="18" r="3"/><path d="m22 22-1.5-1.5"/></S>,
  },
  {
    key: 'weight',
    labelKey: 'nav_weight',
    path: '/herd-health/weight',
    icon: <S><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></S>,
  },
  {
    key: 'parasites',
    labelKey: 'nav_parasites',
    path: '/herd-health/parasites',
    icon: <S><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12c0-2.21 1.79-4 4-4"/><path d="M16 12c0 2.21-1.79 4-4 4"/><path d="M12 8v8"/></S>,
  },
  {
    key: 'quarantine',
    labelKey: 'nav_quarantine',
    path: '/herd-health/quarantine',
    icon: <S><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></S>,
  },
  {
    key: 'mortality',
    labelKey: 'nav_mortality',
    path: '/herd-health/mortality',
    icon: <S><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></S>,
  },
  {
    key: 'lab-results',
    labelKey: 'nav_lab_results',
    path: '/herd-health/lab-results',
    icon: <S><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></S>,
  },
  {
    key: 'biosecurity',
    labelKey: 'nav_biosecurity',
    path: '/herd-health/biosecurity',
    icon: <S><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></S>,
  },
  {
    key: 'vet-contacts',
    labelKey: 'nav_vet_contacts',
    path: '/herd-health/vet-contacts',
    icon: <S><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></S>,
  },
  {
    key: 'reproduction',
    labelKey: 'nav_reproduction',
    path: '/herd-health/reproduction',
    icon: <S><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></S>,
  },
  {
    key: 'reports',
    labelKey: 'nav_reports',
    path: '/herd-health/reports',
    icon: <S><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></S>,
  },
];

export default function HerdHealthLayout({ children, Business, BusinessID, PeopleID, pageTitle, breadcrumbs }) {
  const location = useLocation();
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [collapsed, setCollapsed] = useState(false);

  const activeKey = NAV_ITEMS.find(item => {
    if (item.path === '/herd-health') return location.pathname === '/herd-health';
    return location.pathname.startsWith(item.path);
  })?.key;

  return (
    <AccountLayout
      Business={Business}
      BusinessID={BusinessID}
      PeopleID={PeopleID}
      pageTitle={pageTitle}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex gap-0 -ml-4 -mr-4 min-h-screen" style={{ marginTop: '-1rem' }}>

        {/* Herd Health sub-sidebar */}
        <div
          className="shrink-0 border-r border-gray-200 flex flex-col transition-all duration-200"
          style={{
            width: collapsed ? '44px' : '192px',
            backgroundColor: '#f9f7f3',
            paddingTop: '1rem',
          }}
        >
          {/* Collapse toggle */}
          <div className="flex items-center justify-end px-2 mb-3">
            <button
              onClick={() => setCollapsed(c => !c)}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              title={collapsed ? hh('btn_expand') : hh('btn_collapse')}
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {collapsed
                  ? <><line x1="2" y1="2" x2="2" y2="14"/><line x1="5" y1="8" x2="14" y2="8"/><polyline points="10,4 14,8 10,12"/></>
                  : <><line x1="14" y1="2" x2="14" y2="14"/><line x1="2" y1="8" x2="11" y2="8"/><polyline points="6,4 2,8 6,12"/></>
                }
              </svg>
            </button>
          </div>

          {!collapsed && (
            <div className="px-2 mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">{hh('sidebar_heading')}</p>
            </div>
          )}

          <nav className="flex flex-col gap-0.5 px-1.5 overflow-y-auto flex-1">
            {NAV_ITEMS.map(item => {
              const isActive = activeKey === item.key;
              const to = `${item.path}?BusinessID=${BusinessID}`;
              return (
                <Link
                  key={item.key}
                  to={to}
                  title={collapsed ? hh(item.labelKey) : undefined}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    color: isActive ? ACCENT : '#4B5563',
                    backgroundColor: isActive ? `${ACCENT}18` : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    justifyContent: collapsed ? 'center' : undefined,
                  }}
                >
                  <span className="shrink-0" style={{ color: isActive ? ACCENT : '#9CA3AF' }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{hh(item.labelKey)}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Page content */}
        <div className="flex-1 min-w-0 p-5 overflow-auto">
          {children}
        </div>
      </div>
      <SaigeWidget businessId={BusinessID} pageContext="Herd Health" />
    </AccountLayout>
  );
}
