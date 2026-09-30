import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccount } from './AccountContext';
import AccountSidebar from './AccountSidebar';
import PrecisionAgFieldMenu, {
  FIELD_MENU_WIDTH_EXPANDED,
  FIELD_MENU_WIDTH_COLLAPSED,
} from './PrecisionAgFieldMenu';

const EXCLUDED_PREFIXES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/sites/',
  '/judge/',
  '/speaker/',
  '/provenance/',
];

// Paths where the second blade is allowed to appear (when FieldID is set).
const FIELD_MENU_PREFIXES = [
  '/precision-ag/',
  '/oatsense/',
];

function isExcluded(pathname) {
  return EXCLUDED_PREFIXES.some(p =>
    p.endsWith('/') ? pathname.startsWith(p) : pathname === p
  );
}

function isFieldMenuPath(pathname) {
  return FIELD_MENU_PREFIXES.some(p => pathname.startsWith(p));
}

export default function AppShell({ children }) {
  const { Business, BusinessID, Expanded } = useAccount();
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const [fieldMenuExpanded, setFieldMenuExpanded] = useState(() =>
    typeof window !== 'undefined'
      ? localStorage.getItem('pa_field_menu_expanded') !== 'false'
      : true
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pa_field_menu_expanded', String(fieldMenuExpanded));
    }
  }, [fieldMenuExpanded]);

  const showSidebar =
    !!token &&
    !isExcluded(location.pathname);

  if (!showSidebar) {
    return children;
  }

  const params = new URLSearchParams(location.search);
  const fieldId = params.get('FieldID');
  const showFieldMenu = !!fieldId && isFieldMenuPath(location.pathname);

  const accountWidth = Expanded ? 211 : 67;
  const fieldWidth = fieldMenuExpanded ? FIELD_MENU_WIDTH_EXPANDED : FIELD_MENU_WIDTH_COLLAPSED;
  const padPx = accountWidth + (showFieldMenu ? fieldWidth : 0);
  const pad = `${padPx / 16}rem`;

  return (
    <>
      <style>{`
        .app-shell-wrapper { --sidebar-pad: ${pad}; padding-left: var(--sidebar-pad); transition: padding 300ms; }
        .app-shell-wrapper > .app-shell-main {
          padding-top: 72px;
          box-sizing: border-box;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .app-shell-wrapper nav.sticky {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: auto;
          box-sizing: border-box;
        }
        .app-shell-wrapper footer {
          margin-top: auto;
          margin-left: calc(-1 * var(--sidebar-pad));
          width: calc(100% + var(--sidebar-pad));
          box-sizing: border-box;
          position: relative;
          z-index: 50;
        }
      `}</style>
      <AccountSidebar />
      {showFieldMenu && (
        <PrecisionAgFieldMenu
          menuExpanded={fieldMenuExpanded}
          setMenuExpanded={setFieldMenuExpanded}
        />
      )}
      <div className="app-shell-wrapper">
        <div className="app-shell-main">
          {children}
        </div>
      </div>
    </>
  );
}
