import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lightweight install-prompt banner.
// Shows when the browser fires `beforeinstallprompt` (Chrome/Edge/Android).
// Dismissal is remembered for 30 days. iOS/Safari gets a generic hint since
// they have no install prompt event — user adds via the share sheet.

const DISMISS_KEY = 'ofn_pwa_dismissed_until';

function isDismissed() {
  try {
    const until = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
    return Date.now() < until;
  } catch { return false; }
}

function setDismissed(days = 30) {
  localStorage.setItem(DISMISS_KEY, String(Date.now() + days * 86400000));
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export default function PWAInstallPrompt() {
  const { t } = useTranslation();
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    const onBefore = (e) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBefore);

    // iOS path — show a gentle hint after 8s if the user hasn't already
    // dismissed or installed.
    let timerId;
    if (isIOS() && !isStandalone()) {
      timerId = setTimeout(() => setShowIosHint(true), 8000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBefore);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome !== 'accepted') setDismissed(7);
    setDeferred(null);
    setVisible(false);
  };

  const dismiss = () => {
    setDismissed(30);
    setVisible(false);
    setShowIosHint(false);
  };

  if (!visible && !showIosHint) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 9999,
      maxWidth: 420, margin: '0 auto',
      background: '#14532d', color: '#fff', borderRadius: 12,
      padding: '12px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      display: 'flex', gap: 10, alignItems: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <img src="/images/OFNFavico.png" alt="" style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', padding: 4 }} />
      <div style={{ flex: 1, fontSize: 13, lineHeight: 1.35 }}>
        {visible ? (
          <>{t('pwa_install.msg_install')}</>
        ) : (
          <>{t('pwa_install.msg_ios_prefix')} <strong>{t('pwa_install.msg_ios_add')}</strong>.</>
        )}
      </div>
      {visible && (
        <button onClick={install} style={{ padding: '8px 12px', background: '#fff', color: '#14532d', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          {t('pwa_install.btn_install')}
        </button>
      )}
      <button onClick={dismiss} aria-label={t('pwa_install.btn_dismiss_aria')} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', padding: '0 4px' }}>×</button>
    </div>
  );
}
