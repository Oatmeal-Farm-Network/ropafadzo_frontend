import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BackButton, { shouldHideBack } from './BackButton';

/**
 * Site-wide ← Back control.
 * Hidden on home/auth/portal routes, and when a page already renders
 * Breadcrumbs / AccountLayout back (those include their own ←).
 *
 * Fixed under the sticky header so it works on every page layout.
 */
export default function GlobalBackBar() {
  const location = useLocation();
  const [hasLocalBack, setHasLocalBack] = useState(false);

  useEffect(() => {
    const check = () => {
      setHasLocalBack(!!document.querySelector('[data-ofn-breadcrumbs]'));
    };
    check();
    const t1 = setTimeout(check, 50);
    const t2 = setTimeout(check, 350);
    const obs = new MutationObserver(check);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      obs.disconnect();
    };
  }, [location.pathname, location.search]);

  if (shouldHideBack(location.pathname) || hasLocalBack) return null;

  return (
    <div
      data-ofn-global-back
      style={{
        position: 'fixed',
        top: 72,
        left: 'var(--sidebar-pad, 0px)',
        zIndex: 55,
        padding: '10px 16px',
        pointerEvents: 'none',
      }}
    >
      <span style={{ pointerEvents: 'auto' }}>
        <BackButton showLabel label="Back" />
      </span>
    </div>
  );
}
