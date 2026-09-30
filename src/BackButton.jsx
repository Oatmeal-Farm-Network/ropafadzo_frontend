import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HIDE_EXACT = new Set([
  '/',
  '/login',
  '/signup',
  '/forgot-password',
]);

const HIDE_PREFIXES = [
  '/sites/',
  '/judge/',
  '/speaker/',
  '/provenance/',
];

export function shouldHideBack(pathname) {
  if (HIDE_EXACT.has(pathname)) return true;
  return HIDE_PREFIXES.some((p) => pathname.startsWith(p));
}

/** Shared navigate-back helper used by breadcrumb ← and the global bar. */
export function useGoBack(fallbackTo) {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    // Prefer in-app history when the user arrived from another OFN page.
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1);
      return;
    }
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
      navigate(-1);
      return;
    }
    const loggedIn = !!localStorage.getItem('access_token');
    const fallback =
      fallbackTo ||
      (loggedIn && location.pathname !== '/dashboard' ? '/dashboard' : '/');
    navigate(fallback);
  };
}

/**
 * Compact ← control matching the Testimonials mock (green, text-xs).
 * Use inline in breadcrumbs or as a standalone bar.
 */
export default function BackButton({
  label = 'Back',
  fallbackTo,
  className = '',
  style = {},
  showLabel = false,
}) {
  const goBack = useGoBack(fallbackTo);

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1 font-semibold hover:underline ${className}`}
      style={{
        color: '#3D6B34',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontSize: '0.75rem',
        lineHeight: 1.25,
        ...style,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '0.95em' }}>←</span>
      {showLabel ? <span>{label}</span> : null}
    </button>
  );
}
