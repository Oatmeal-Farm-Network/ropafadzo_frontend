// src/NotificationBell.jsx
// Header bell: polls unread count, opens a dropdown of recent notifications.
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';
const POLL_MS = 60000;

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function NotificationBell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [count, setCount]   = useState(0);
  const [open,  setOpen]    = useState(false);
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  function timeAgo(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const s = Math.max(0, (Date.now() - d.getTime()) / 1000);
    if (s < 60)     return t('notification_bell.time_just_now');
    if (s < 3600)   return t('notification_bell.time_m', { n: Math.floor(s / 60) });
    if (s < 86400)  return t('notification_bell.time_h', { n: Math.floor(s / 3600) });
    if (s < 604800) return t('notification_bell.time_d', { n: Math.floor(s / 86400) });
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (open && wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const fetchCount = async () => {
    if (!localStorage.getItem('access_token')) return;
    try {
      const r = await fetch(`${API}/api/notifications/unread-count`, { headers: authHeaders() });
      if (r.ok) {
        const d = await r.json();
        setCount(d.count || 0);
      }
    } catch {}
  };

  const fetchList = async () => {
    if (!localStorage.getItem('access_token')) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/notifications?limit=20`, { headers: authHeaders() });
      if (r.ok) setItems(await r.json());
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchCount();
    const intervalId = setInterval(fetchCount, POLL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const toggle = () => {
    if (!open) fetchList();
    setOpen(o => !o);
  };

  const openNotification = async (n) => {
    setOpen(false);
    if (!n.ReadAt) {
      try { await fetch(`${API}/api/notifications/${n.NotificationID}/read`, { method: 'POST', headers: authHeaders() }); } catch {}
      setCount(c => Math.max(0, c - 1));
    }
    if (n.LinkPath) navigate(n.LinkPath);
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API}/api/notifications/read-all`, { method: 'POST', headers: authHeaders() });
      setCount(0);
      setItems(items.map(i => i.ReadAt ? i : { ...i, ReadAt: new Date().toISOString() }));
    } catch {}
  };

  // Hide entirely for logged-out users
  if (!localStorage.getItem('access_token')) return null;

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={toggle}
        className="relative p-1.5 text-gray-700 hover:text-[#3D6B34] transition-colors"
        aria-label={t('notification_bell.aria_label')}
        title={t('notification_bell.title')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-112 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-bold text-gray-800">{t('notification_bell.heading')}</span>
            {count > 0 && (
              <button onClick={markAllRead} className="text-xs text-[#3D6B34] hover:underline">
                {t('notification_bell.mark_all_read')}
              </button>
            )}
          </div>
          <div className="overflow-y-auto grow">
            {loading ? (
              <div className="px-4 py-6 text-center text-xs text-gray-400">{t('notification_bell.loading')}</div>
            ) : items.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-gray-400 italic">
                {t('notification_bell.empty')}
              </div>
            ) : (
              <ul>
                {items.map(n => (
                  <li key={n.NotificationID}>
                    <button
                      onClick={() => openNotification(n)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${n.ReadAt ? '' : 'bg-green-50/40'}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.ReadAt && <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#3D6B34] shrink-0" />}
                        <div className="min-w-0 grow">
                          <div className="text-sm font-semibold text-gray-800 truncate">{n.Title}</div>
                          {n.Body && <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.Body}</div>}
                          <div className="text-[10px] text-gray-400 mt-1">
                            {timeAgo(n.CreatedAt)}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
