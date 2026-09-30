import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const OTF_API = import.meta.env.VITE_OTF_API_URL || import.meta.env.VITE_API_URL || '';
const MILL    = `${OTF_API}/api/admin/mill`;
const POLL_MS = 5000;
const NAV_BG  = '#516234';
const NAV_LT  = '#e8f0e4';

function authHeaders() {
  const token = localStorage.getItem('access_token') || '';
  const pid   = localStorage.getItem('people_id')    || '';
  const lvl   = localStorage.getItem('access_level') || '0';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-people-id': pid, 'x-access-level': lvl };
}
const ME = () => parseInt(localStorage.getItem('people_id') || '0', 10);

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso), now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function avatarLetter(str) { return (str || '?')[0].toUpperCase(); }

const ChevronRight = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Login gate ────────────────────────────────────────────────────────────────
function LoginGate() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <Header />
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <img src="/images/Over-the-Fence-LogIcon.webp" alt={t('over_the_fence_dm.login_title')}
          className="mx-auto mb-4 rounded-xl"
          style={{ height: 64, width: 'auto', objectFit: 'contain' }}
          onError={e => { e.target.style.display = 'none'; }} />
        <h1 className="font-bold text-2xl text-gray-900 mb-2" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
          {t('over_the_fence_dm.login_title')}
        </h1>
        <p className="text-gray-600 mb-6">{t('over_the_fence_dm.login_desc')}</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login"  className="px-5 py-2.5 rounded-lg text-white font-bold text-sm shadow" style={{ backgroundColor: NAV_BG }}>{t('over_the_fence_dm.login_sign_in')}</Link>
          <Link to="/signup" className="px-5 py-2.5 rounded-lg font-bold border-2 text-sm" style={{ color: NAV_BG, borderColor: NAV_BG }}>{t('over_the_fence_dm.login_create')}</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function OverTheFenceDM() {
  const token = localStorage.getItem('access_token');
  if (!token) return <LoginGate />;
  return <DMApp />;
}

// ── Channel row ───────────────────────────────────────────────────────────────
function ChannelRow({ ch, isActive, onClick, indent }) {
  const { t } = useTranslation();
  const isDM = ch.ChannelType === 'dm' || ch.ChannelType === 'group_dm';
  const name = ch.ChannelType === 'group_dm'
    ? (ch.Name || ch.DmPartnerNames || t('over_the_fence_dm.chan_group_default'))
    : ch.ChannelType === 'dm'
    ? (ch.DmPartnerNames || t('over_the_fence_dm.chan_dm_default'))
    : (ch.Name || t('over_the_fence_dm.chan_default'));
  return (
    <button
      onClick={() => onClick(ch)}
      className="w-full text-left flex items-center gap-2.5 hover:bg-gray-50 transition border-b border-gray-50"
      style={{
        padding: indent ? '8px 12px 8px 28px' : '10px 12px',
        backgroundColor: isActive ? NAV_LT : undefined,
      }}
    >
      {isDM ? (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
          style={{ backgroundColor: NAV_BG }}>
          {avatarLetter(name)}
        </div>
      ) : (
        <span className="w-8 h-8 rounded flex items-center justify-center text-gray-400 font-bold text-sm shrink-0"
          style={{ backgroundColor: '#f3f4f6' }}>
          #
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className="font-medium text-sm text-gray-800 truncate">{name}</span>
          {ch.LastMessageAt && (
            <span className="text-[10px] text-gray-400 shrink-0 ml-1">{fmtTime(ch.LastMessageAt)}</span>
          )}
        </div>
        {ch.LastMessage && (
          <div className="text-xs text-gray-400 truncate">{ch.LastMessage}</div>
        )}
      </div>
      {ch.UnreadCount > 0 && (
        <span className="rounded-full text-[10px] font-bold text-white shrink-0"
          style={{ backgroundColor: '#25d366', minWidth: 18, padding: '2px 5px', textAlign: 'center' }}>
          {ch.UnreadCount}
        </span>
      )}
    </button>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
function DMApp() {
  const { t } = useTranslation();

  // Communities
  const [communities,   setCommunities]   = useState([]);
  const [showNewComm,   setShowNewComm]   = useState(false);
  const [newCommName,   setNewCommName]   = useState('');
  const [newCommDesc,   setNewCommDesc]   = useState('');
  const [newCommPublic, setNewCommPublic] = useState(true);
  const [commSaving,    setCommSaving]    = useState(false);

  // Accordion state — dms open by default
  const [expanded, setExpanded] = useState({ dms: true });
  const toggleSection = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

  // Channels / messages
  const [channels,        setChannels]        = useState([]);
  const [active,          setActive]          = useState(null);
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [messages,        setMessages]        = useState([]);
  const [body,            setBody]            = useState('');
  const [sending,         setSending]         = useState(false);
  const [loadingMsg,      setLoadingMsg]      = useState(false);

  // New DM modal
  const [showNew,  setShowNew]  = useState(false);
  const [people,   setPeople]   = useState([]);
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState([]);

  const bottomRef = useRef(null);
  const pollRef   = useRef(null);

  const getChannelName = (ch) => {
    if (!ch) return '';
    if (ch.ChannelType === 'group_dm') return ch.Name || ch.DmPartnerNames || t('over_the_fence_dm.chan_group_default');
    if (ch.ChannelType === 'dm')       return ch.DmPartnerNames || t('over_the_fence_dm.chan_dm_default');
    return ch.Name || t('over_the_fence_dm.chan_default');
  };

  // ── API ────────────────────────────────────────────────────────────────────

  const loadCommunities = useCallback(async () => {
    try {
      const r = await fetch(`${MILL}/communities`, { headers: authHeaders() });
      if (!r.ok) return;
      const data = await r.json();
      setCommunities(Array.isArray(data) ? data : (data.communities || []));
    } catch {}
  }, []);

  const loadChannels = useCallback(async () => {
    try {
      const r = await fetch(`${MILL}/channels`, { headers: authHeaders() });
      if (!r.ok) return;
      const data = await r.json();
      setChannels(data.channels || data || []);
    } catch {}
  }, []);

  const loadMessages = useCallback(async (channelId) => {
    if (!channelId) return;
    try {
      const r = await fetch(`${MILL}/channels/${channelId}/messages`, { headers: authHeaders() });
      if (!r.ok) return;
      const data = await r.json();
      setMessages(data.messages || data || []);
    } catch {}
  }, []);

  const loadPeople = async (q = '') => {
    try {
      const url = q ? `${MILL}/people?q=${encodeURIComponent(q)}` : `${MILL}/people`;
      const r = await fetch(url, { headers: authHeaders() });
      if (!r.ok) return;
      const d = await r.json();
      setPeople(Array.isArray(d) ? d : (d.people || []));
    } catch {}
  };

  // ── Community helpers ──────────────────────────────────────────────────────

  const joinCommunity = async (comm) => {
    try {
      await fetch(`${MILL}/communities/${comm.CommunityID}/join`, { method: 'POST', headers: authHeaders() });
      await loadCommunities();
      await loadChannels();
      setExpanded(e => ({ ...e, [comm.CommunityID]: true }));
    } catch {}
  };

  const createCommunity = async () => {
    if (!newCommName.trim()) return;
    setCommSaving(true);
    try {
      const r = await fetch(`${MILL}/communities`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ name: newCommName.trim(), description: newCommDesc, isPublic: newCommPublic }),
      });
      if (r.ok) {
        const data = await r.json();
        setShowNewComm(false); setNewCommName(''); setNewCommDesc(''); setNewCommPublic(true);
        await loadCommunities();
        await loadChannels();
        const cid = data.communityId || data.CommunityID;
        if (cid) setExpanded(e => ({ ...e, [cid]: true }));
      }
    } catch {}
    setCommSaving(false);
  };

  // ── Channel / DM helpers ───────────────────────────────────────────────────

  const handleChannelClick = (ch) => {
    setActive(ch);
    if (ch.CommunityID) {
      setActiveCommunity(communities.find(c => c.CommunityID === ch.CommunityID) || null);
    } else {
      setActiveCommunity(null);
    }
  };

  const startDM = async () => {
    if (!selected.length) return;
    try {
      const payload = selected.length === 1
        ? { targetPeopleId: selected[0].PeopleID }
        : { memberIds: selected.map(p => p.PeopleID) };
      const r = await fetch(`${MILL}/dm`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      if (r.ok) {
        const data = await r.json();
        setShowNew(false); setSelected([]); setSearch('');
        await loadChannels();
        setExpanded(e => ({ ...e, dms: true }));
        if (data.channelId) {
          setActive({ ChannelID: data.channelId, ChannelType: 'dm', DmPartnerNames: selected[0]?.Name });
          setActiveCommunity(null);
        }
      }
    } catch {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!body.trim() || !active || sending) return;
    setSending(true);
    try {
      const r = await fetch(`${MILL}/channels/${active.ChannelID}/messages`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ body: body.trim() }),
      });
      if (r.ok) {
        setBody('');
        await loadMessages(active.ChannelID);
        await loadChannels();
      }
    } catch {}
    setSending(false);
  };

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => { loadCommunities(); loadChannels(); }, [loadCommunities, loadChannels]);

  useEffect(() => {
    if (!active) { setMessages([]); return; }
    setLoadingMsg(true);
    // GET messages marks the channel read server-side; refresh the channel list so the
    // unread badge clears immediately instead of persisting until the next poll (#54).
    loadMessages(active.ChannelID).finally(() => { setLoadingMsg(false); loadChannels(); });
  }, [active, loadMessages, loadChannels]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    pollRef.current = setInterval(() => {
      loadChannels();
      if (active) loadMessages(active.ChannelID);
    }, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [active, loadChannels, loadMessages]);

  // ── Derived data ───────────────────────────────────────────────────────────

  const dmChannels = channels
    .filter(c => c.ChannelType === 'dm' || c.ChannelType === 'group_dm')
    .sort((a, b) => new Date(b.LastMessageAt || 0) - new Date(a.LastMessageAt || 0));

  const channelsByCommunity = Object.fromEntries(
    communities.map(comm => [
      comm.CommunityID,
      channels
        .filter(c => c.CommunityID === comm.CommunityID)
        .sort((a, b) => (a.Name || '').localeCompare(b.Name || '')),
    ])
  );

  const filteredPeople = people.filter(p =>
    p.PeopleID !== ME() && (p.Name || '').toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="font-sans flex flex-col" style={{ backgroundColor: '#f7f2e8', height: '100vh' }}>
      <PageMeta title={t('over_the_fence_dm.meta_title')} description={t('over_the_fence_dm.meta_desc')} />
      <Header />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-6 py-3 shrink-0" style={{ backgroundColor: '#f7f2e8' }}>
          <Breadcrumbs items={[
            { label: t('over_the_fence_dm.crumb_dashboard'), to: '/dashboard' },
            { label: t('over_the_fence_dm.crumb_page') },
          ]} />
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* ── Left panel ──────────────────────────────────────────── */}
          <div className="flex flex-col border-r border-gray-200 bg-white shrink-0" style={{ width: 300, minWidth: 260 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ backgroundColor: NAV_BG }}>
              <div className="flex items-center gap-2 min-w-0">
                <img src="/images/Over-the-Fence-LogIcon.webp" alt={t('over_the_fence_dm.crumb_page')}
                  style={{ height: 28, width: 'auto', objectFit: 'contain', borderRadius: 6, flexShrink: 0 }}
                  onError={e => { e.target.style.display = 'none'; }} />
                <span className="text-white font-bold text-sm truncate">{t('over_the_fence_dm.header_title')}</span>
              </div>
              <button onClick={() => { setShowNew(true); loadPeople(); }} title={t('over_the_fence_dm.btn_new_dm_title')}
                className="text-white hover:bg-white/20 rounded-full p-1 transition shrink-0 ml-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>

            {/* Accordion list */}
            <div className="flex-1 overflow-y-auto">

              {/* Direct Messages section */}
              <div>
                <div className="flex items-center px-3 py-2">
                  <button
                    onClick={() => toggleSection('dms')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition flex-1 text-left"
                  >
                    <span className="text-gray-400">{expanded.dms ? <ChevronDown /> : <ChevronRight />}</span>
                    {t('over_the_fence_dm.section_dms')}
                  </button>
                  <button onClick={() => { setShowNew(true); loadPeople(); }} title={t('over_the_fence_dm.btn_new_conv_title')}
                    className="text-gray-400 hover:text-gray-700 transition text-base leading-none font-bold ml-1">
                    +
                  </button>
                </div>
                {expanded.dms && dmChannels.map(ch => (
                  <ChannelRow key={ch.ChannelID} ch={ch} isActive={active?.ChannelID === ch.ChannelID} onClick={handleChannelClick} indent={false} />
                ))}
                {expanded.dms && dmChannels.length === 0 && (
                  <div className="px-5 pb-2">
                    <button onClick={() => { setShowNew(true); loadPeople(); }}
                      className="text-xs hover:underline" style={{ color: NAV_BG }}>
                      {t('over_the_fence_dm.btn_start_conv')}
                    </button>
                  </div>
                )}
              </div>

              {/* Community sections */}
              {communities.map(comm => {
                const isOpen = !!expanded[comm.CommunityID];
                const commChannels = channelsByCommunity[comm.CommunityID] || [];
                return (
                  <div key={comm.CommunityID} className="border-t border-gray-100">
                    <div className="flex items-center px-3 py-2">
                      <button
                        onClick={() => toggleSection(comm.CommunityID)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition flex-1 min-w-0 text-left"
                      >
                        <span className="text-gray-400">{isOpen ? <ChevronDown /> : <ChevronRight />}</span>
                        <span className="truncate">{comm.Name}</span>
                        {!comm.IsMember && (
                          <span className="ml-1 text-[10px] text-gray-400 font-normal shrink-0">· join</span>
                        )}
                      </button>
                      {comm.MemberCount > 0 && (
                        <span className="text-[10px] text-gray-400 ml-1 shrink-0">{comm.MemberCount}</span>
                      )}
                    </div>

                    {isOpen && !comm.IsMember && (
                      <div className="px-5 pb-3">
                        <button onClick={() => joinCommunity(comm)}
                          className="text-xs font-bold px-3 py-1 rounded-lg text-white"
                          style={{ backgroundColor: NAV_BG }}>
                          {t('over_the_fence_dm.btn_join_comm')}
                        </button>
                        {comm.Description && (
                          <p className="text-xs text-gray-400 mt-1">{comm.Description}</p>
                        )}
                      </div>
                    )}

                    {isOpen && comm.IsMember && commChannels.map(ch => (
                      <ChannelRow key={ch.ChannelID} ch={ch} isActive={active?.ChannelID === ch.ChannelID} onClick={handleChannelClick} indent />
                    ))}

                    {isOpen && comm.IsMember && commChannels.length === 0 && (
                      <div className="px-5 pb-2 text-xs text-gray-400">{t('over_the_fence_dm.no_channels')}</div>
                    )}
                  </div>
                );
              })}

              {/* Create community */}
              <div className="border-t border-gray-100 px-3 py-2">
                <button onClick={() => setShowNewComm(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  {t('over_the_fence_dm.btn_create_comm')}
                </button>
              </div>

              {/* Forums link */}
              <div className="border-t border-gray-100 px-3 py-2.5">
                <Link to="/over-the-fence/forums"
                  className="flex items-center gap-2 text-xs font-semibold hover:text-gray-900 transition"
                  style={{ color: NAV_BG }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    <line x1="9" y1="10" x2="15" y2="10"/>
                    <line x1="9" y1="14" x2="13" y2="14"/>
                  </svg>
                  Community Forums
                </Link>
              </div>

            </div>
          </div>

          {/* ── Right panel ─────────────────────────────────────────── */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {!active ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8"
                style={{ backgroundColor: '#efeae2' }}>
                <img src="/images/Over-the-Fence-LogIcon.webp" alt={t('over_the_fence_dm.crumb_page')}
                  className="mx-auto mb-4 opacity-60"
                  style={{ height: 72, width: 'auto', objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none'; }} />
                <h2 className="font-bold text-xl text-gray-700 mb-2" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
                  {activeCommunity ? activeCommunity.Name : t('over_the_fence_dm.empty_heading_default')}
                </h2>
                <p className="text-gray-500 text-sm max-w-xs mb-5">
                  {activeCommunity
                    ? (activeCommunity.Description || t('over_the_fence_dm.empty_desc_community'))
                    : t('over_the_fence_dm.empty_desc_default')}
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                  <button onClick={() => { setShowNew(true); loadPeople(); }}
                    className="px-5 py-2.5 rounded-lg text-white font-bold text-sm"
                    style={{ backgroundColor: NAV_BG }}>
                    {t('over_the_fence_dm.btn_new_dm')}
                  </button>
                  <button onClick={() => setShowNewComm(true)}
                    className="px-5 py-2.5 rounded-lg font-bold text-sm border-2"
                    style={{ color: NAV_BG, borderColor: NAV_BG }}>
                    {t('over_the_fence_dm.btn_new_community')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: NAV_BG }}>
                    {(active.ChannelType === 'dm' || active.ChannelType === 'group_dm')
                      ? avatarLetter(getChannelName(active))
                      : '#'}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{getChannelName(active)}</div>
                    <div className="text-xs text-gray-500">
                      {active.ChannelType === 'dm' ? t('over_the_fence_dm.private_conv')
                        : active.ChannelType === 'group_dm' ? t('over_the_fence_dm.group_conv')
                        : active.Description || (activeCommunity?.Name || '')}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2" style={{ backgroundColor: '#efeae2' }}>
                  {loadingMsg && <div className="text-center text-xs text-gray-400 py-4">{t('over_the_fence_dm.loading_msgs')}</div>}
                  {messages.map(msg => {
                    const mine = msg.SenderID === ME();
                    return (
                      <div key={msg.MessageID} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[72%]">
                          {!mine && (
                            <div className="text-[10px] font-semibold mb-0.5 ml-1" style={{ color: NAV_BG }}>
                              {msg.SenderName}
                            </div>
                          )}
                          <div className="px-3 py-2 text-sm shadow-sm"
                            style={{
                              backgroundColor: mine ? '#d9fdd3' : '#ffffff',
                              color: '#111b21',
                              borderRadius: mine ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                            }}>
                            {msg.IsDeleted ? <em className="text-gray-400">{t('over_the_fence_dm.msg_deleted')}</em> : msg.Body}
                          </div>
                          <div className={`text-[10px] text-gray-400 mt-0.5 ${mine ? 'text-right mr-1' : 'ml-1'}`}>
                            {fmtTime(msg.CreatedAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="px-4 py-3 flex gap-2 bg-white border-t border-gray-200 shrink-0">
                  <input
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
                    style={{ backgroundColor: '#f0f2f5' }}
                    placeholder={t('over_the_fence_dm.input_placeholder')}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                  />
                  <button type="submit" disabled={!body.trim() || sending}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white transition disabled:opacity-40 shrink-0"
                    style={{ backgroundColor: NAV_BG }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── New DM modal ────────────────────────────────────────────── */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: NAV_BG }}>
              <span className="text-white font-bold text-sm">{t('over_the_fence_dm.new_dm_title')}</span>
              <button onClick={() => { setShowNew(false); setSelected([]); setSearch(''); }}
                className="text-white hover:bg-white/20 rounded-full p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none"
                placeholder={t('over_the_fence_dm.dm_search_placeholder')} value={search}
                onChange={e => { setSearch(e.target.value); loadPeople(e.target.value); }} />
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {selected.map(p => (
                    <span key={p.PeopleID} className="flex items-center gap-1 text-xs rounded-full px-2 py-0.5"
                      style={{ backgroundColor: NAV_LT, color: NAV_BG }}>
                      {p.Name}
                      <button onClick={() => setSelected(s => s.filter(x => x.PeopleID !== p.PeopleID))} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="max-h-52 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
                {filteredPeople.length === 0 && <div className="px-3 py-3 text-sm text-gray-400 text-center">{t('over_the_fence_dm.dm_no_results')}</div>}
                {filteredPeople.slice(0, 20).map(p => {
                  const sel = selected.some(s => s.PeopleID === p.PeopleID);
                  return (
                    <button key={p.PeopleID}
                      onClick={() => setSelected(s => sel ? s.filter(x => x.PeopleID !== p.PeopleID) : [...s, p])}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 transition"
                      style={sel ? { backgroundColor: NAV_LT } : {}}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: NAV_BG }}>
                        {avatarLetter(p.Name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{p.Name}</div>
                        {p.TeamCompany && <div className="text-xs text-gray-400 truncate">{p.TeamCompany}</div>}
                      </div>
                      {sel && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NAV_BG} strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              <button onClick={startDM} disabled={!selected.length}
                className="w-full mt-3 py-2.5 rounded-lg text-white font-bold text-sm transition disabled:opacity-40"
                style={{ backgroundColor: NAV_BG }}>
                {selected.length > 1 ? t('over_the_fence_dm.btn_start_group_dm') : t('over_the_fence_dm.btn_start_dm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Community modal ──────────────────────────────────────── */}
      {showNewComm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: NAV_BG }}>
              <span className="text-white font-bold text-sm">{t('over_the_fence_dm.new_comm_title')}</span>
              <button onClick={() => setShowNewComm(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t('over_the_fence_dm.comm_name_label')}</label>
                <input value={newCommName} onChange={e => setNewCommName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  placeholder={t('over_the_fence_dm.comm_name_placeholder')} autoFocus />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t('over_the_fence_dm.comm_desc_label')}</label>
                <input value={newCommDesc} onChange={e => setNewCommDesc(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  placeholder={t('over_the_fence_dm.comm_desc_placeholder')} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={newCommPublic} onChange={e => setNewCommPublic(e.target.checked)} className="accent-[#516234]" />
                {t('over_the_fence_dm.comm_public_label')}
              </label>
              <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ backgroundColor: '#f0f7ee', color: '#374151' }}>
                {t('over_the_fence_dm.comm_tip')}
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={createCommunity} disabled={!newCommName.trim() || commSaving}
                  className="flex-1 py-2.5 rounded-lg text-white font-bold text-sm transition disabled:opacity-40"
                  style={{ backgroundColor: NAV_BG }}>
                  {commSaving ? t('over_the_fence_dm.btn_creating') : t('over_the_fence_dm.btn_create')}
                </button>
                <button onClick={() => setShowNewComm(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                  {t('over_the_fence_dm.btn_cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
