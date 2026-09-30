import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OTF_API = import.meta.env.VITE_OTF_API_URL || import.meta.env.VITE_API_URL || '';
const MILL = `${OTF_API}/api/admin/mill`;

function authHeaders() {
  const token = localStorage.getItem('access_token') || '';
  const pid   = localStorage.getItem('people_id')    || '';
  const lvl   = localStorage.getItem('access_level') || '0';
  return { Authorization: `Bearer ${token}`, 'x-people-id': pid, 'x-access-level': lvl };
}

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function OTFDMWidget() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [channels,   setChannels]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  function chanName(ch) {
    if (ch.ChannelType === 'group_dm') return ch.Name || ch.DmPartnerNames || t('otf_dm_widget.chan_group');
    if (ch.ChannelType === 'dm')       return ch.DmPartnerNames || t('otf_dm_widget.chan_dm');
    return `#${ch.Name}`;
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { setLoading(false); return; }
    setIsLoggedIn(true);
    fetch(`${MILL}/channels`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = (data.channels || data || [])
          .filter(c => c.ChannelType === 'dm' || c.ChannelType === 'group_dm')
          .sort((a, b) => new Date(b.LastMessageAt || 0) - new Date(a.LastMessageAt || 0))
          .slice(0, 4);
        setChannels(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!isLoggedIn) return null;

  const totalUnread = channels.reduce((s, c) => s + (c.UnreadCount || 0), 0);

  return (
    <section className="pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100" style={{ backgroundColor: '#008069' }}>
            <div className="flex items-center gap-2.5">
              <img
                src="/images/Over-the-Fence-LogIcon.webp"
                alt="Over The Fence DM"
                className="w-7 h-7 rounded-lg"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span className="text-white font-bold text-sm">{t('otf_dm_widget.header')}</span>
              {totalUnread > 0 && (
                <span className="rounded-full text-[10px] font-bold text-white px-2 py-0.5" style={{ backgroundColor: '#25d366' }}>
                  {t('otf_dm_widget.new_badge', { count: totalUnread })}
                </span>
              )}
            </div>
            <Link
              to="/over-the-fence"
              className="text-white/80 hover:text-white text-xs font-semibold transition"
            >
              {t('otf_dm_widget.link_open')}
            </Link>
          </div>

          {/* Conversation rows */}
          {loading && (
            <div className="px-5 py-4 text-sm text-gray-400">{t('otf_dm_widget.loading')}</div>
          )}
          {!loading && channels.length === 0 && (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-gray-500 mb-3">{t('otf_dm_widget.empty_msg')}</p>
              <Link
                to="/over-the-fence"
                className="inline-block px-4 py-2 rounded-lg text-white text-sm font-bold"
                style={{ backgroundColor: '#008069' }}
              >
                {t('otf_dm_widget.btn_new')}
              </Link>
            </div>
          )}
          {!loading && channels.length > 0 && (
            <div className="divide-y divide-gray-50">
              {channels.map(ch => (
                <Link
                  key={ch.ChannelID}
                  to="/over-the-fence"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: '#008069' }}
                  >
                    {(chanName(ch) || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-sm text-gray-900 truncate">{chanName(ch)}</span>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">{fmtTime(ch.LastMessageAt)}</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{ch.LastMessage || ''}</div>
                  </div>
                  {ch.UnreadCount > 0 && (
                    <span
                      className="rounded-full text-[10px] font-bold text-white px-1.5 py-0.5 shrink-0"
                      style={{ backgroundColor: '#25d366', minWidth: 18, textAlign: 'center' }}
                    >
                      {ch.UnreadCount}
                    </span>
                  )}
                </Link>
              ))}
              <div className="px-5 py-2.5 text-right">
                <Link to="/over-the-fence" className="text-xs font-bold hover:underline" style={{ color: '#008069' }}>
                  {t('otf_dm_widget.link_view_all')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
