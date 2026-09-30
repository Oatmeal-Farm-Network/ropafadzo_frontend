/**
 * InstallPrompt — captures Chrome/Edge/Android `beforeinstallprompt` and shows
 * a small banner the user can dismiss or click to install. Mount once, near
 * the top of the React tree.
 *
 * Suppression rules:
 *   - Hidden if already running standalone (display-mode: standalone)
 *   - Hidden if dismissed in last 14 days (localStorage)
 *   - Hidden until the browser has actually fired beforeinstallprompt
 */
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const DISMISS_KEY = 'ofn_install_dismissed_at';
const COOLDOWN_DAYS = 14;

function dismissedRecently() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (!at) return false;
    const ageDays = (Date.now() - at) / (1000 * 60 * 60 * 24);
    return ageDays < COOLDOWN_DAYS;
  } catch { return false; }
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  if (window.navigator?.standalone) return true;  // iOS Safari
  return false;
}

export default function InstallPrompt() {
  const { t } = useTranslation();
  const [evt, setEvt] = useState(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (isStandalone()) return;
    if (dismissedRecently()) return;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setEvt(e);
      setHidden(false);
    };
    const onInstalled = () => {
      setHidden(true);
      setEvt(null);
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!evt) return;
    evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === 'dismissed') {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    }
    setHidden(true);
    setEvt(null);
  };

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setHidden(true);
  };

  if (hidden || !evt) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      bottom: 16, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9000,
      background: '#3D6B34',
      color: '#fff',
      borderRadius: 12,
      boxShadow: '0 6px 24px -8px rgba(0,0,0,0.4)',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      maxWidth: 'calc(100vw - 32px)',
      fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
      fontSize: 13.5,
    }}>
      <img src="/images/OFNFavico.png" alt="" style={{ width: 28, height: 28, borderRadius: 6 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{t('install_prompt.heading')}</div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>{t('install_prompt.body')}</div>
      </div>
      <button onClick={install} style={{
        background: '#fff', color: '#3D6B34', border: 'none',
        padding: '6px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 13,
      }}>{t('install_prompt.btn_install')}</button>
      <button onClick={dismiss} aria-label={t('install_prompt.btn_dismiss_aria')} style={{
        background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer',
        fontSize: 18, lineHeight: 1, padding: '0 4px',
      }}>×</button>
    </div>,
    document.body,
  );
}
