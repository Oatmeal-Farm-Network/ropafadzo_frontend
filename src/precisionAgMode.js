/** Local / staging flag: run OFN as a Precision Ag–only site. */
export const PRECISION_AG_ONLY = import.meta.env.VITE_PRECISION_AG_ONLY === 'true';

export const PRECISION_AG_HOME = '/precision-ag/fields';

/**
 * Paths reachable when VITE_PRECISION_AG_ONLY=true.
 * Everything else should redirect to PRECISION_AG_HOME.
 */
export function isPrecisionAgAllowedPath(pathname) {
  if (!pathname) return false;
  if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password') return true;
  if (pathname === '/logout') return true;
  if (pathname === '/dashboard') return true;
  if (pathname === '/directory' || pathname.startsWith('/directory/')) return true;
  if (pathname === '/account' || pathname.startsWith('/account/')) return true;
  if (pathname === '/accounts' || pathname.startsWith('/accounts/')) return true;
  if (pathname.startsWith('/precision-ag')) return true;
  if (pathname === '/platform/precision-ag') return true;
  // Saige is kept as a Coming Soon surface only (no live chat in this mode)
  if (pathname === '/saige' || pathname.startsWith('/saige/')) return true;
  if (pathname === '/platform/saige') return true;
  // Legacy aliases that redirect into Precision Ag
  if (pathname === '/oatsense' || pathname.startsWith('/oatsense/')) return true;
  return false;
}

/** Build home URL, preserving BusinessID when present (URL or localStorage). */
export function precisionAgHomeUrl(search = '') {
  const params = new URLSearchParams(typeof search === 'string' ? search : '');
  let bid = params.get('BusinessID');
  if (!bid && typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('selected_business_id');
    if (stored && stored !== 'null' && stored !== 'undefined') bid = stored;
  }
  return bid ? `${PRECISION_AG_HOME}?BusinessID=${encodeURIComponent(bid)}` : PRECISION_AG_HOME;
}
