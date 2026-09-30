// src/ThaiymeChat.jsx
// Thaiyme — Business Operations AI agent.
// Features: voice input (Web Speech API), TTS (male Google voice),
//           fullscreen sidebar-aware layout, previous-sessions blade.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import AgentBadge from './AgentBadge';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageContext';
import { useAccount } from './AccountContext';

const API          = import.meta.env.VITE_API_URL || '';
const AGENT_NAME   = 'Thaiyme';
const ACCENT_COLOR = '#7A5A3D';
const ICON_SRC     = '/images/ThaiymeAIIcon.webp';
const SIDEBAR_EXPANDED_W  = 211;
const SIDEBAR_COLLAPSED_W = 67;
const SESSIONS_KEY = 'thaiyme:sessions';

// ── Auth ──────────────────────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('access_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

// ── Session registry (localStorage) ──────────────────────────────────────────
function loadSessions() {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]'); } catch { return []; }
}
function upsertSession(key, name, preview) {
  const list = loadSessions().filter(s => s.key !== key);
  list.unshift({ key, name, preview: (preview || '').slice(0, 80), ts: Date.now() });
  try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(list.slice(0, 30))); } catch {}
}

// ── Message storage ───────────────────────────────────────────────────────────
function _storageKey({ businessId, eventId }) {
  const pid = localStorage.getItem('people_id') || 'anon';
  const scope = eventId ? `event:${eventId}` : (businessId ? `biz:${businessId}` : 'global');
  return `thaiyme:msgs:${pid}:${scope}`;
}
function _loadStored(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function _saveStored(key, msgs) {
  try { localStorage.setItem(key, JSON.stringify((msgs || []).slice(-100))); } catch {}
}

// ── Session display name ──────────────────────────────────────────────────────
function _sessionName(page, businessId, eventId) {
  if (page === 'accounting')                          return 'Accounting';
  if (page?.startsWith('event_register'))             return 'Event Registration';
  if (page === 'simple_event_register')               return 'Event Registration';
  if (eventId)                                        return `Event #${eventId}`;
  if (businessId)                                     return `Business #${businessId}`;
  return 'Thaiyme Chat';
}

// ── TTS helpers ───────────────────────────────────────────────────────────────
function stripMarkdown(text) {
  return (text || '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/<br\s*\/?>/gi, ' ');
}

function findMaleVoice(voices) {
  return (
    voices.find(v => v.name === 'Google UK English Male') ||
    voices.find(v => v.name === 'Google US English') ||
    voices.find(v => /google/i.test(v.name) && v.lang.startsWith('en')) ||
    voices.find(v => v.lang.startsWith('en') && !/female/i.test(v.name)) ||
    voices.find(v => v.lang.startsWith('en')) ||
    null
  );
}

// ── Markdown renderer ─────────────────────────────────────────────────────────
function MessageContent({ text }) {
  const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const html = esc(text || '')
    .replace(/^#{1,6}\s+(.+)$/gm, '<strong>$1</strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#fdf6ed;color:#7A5A3D;padding:0 3px;border-radius:3px;">$1</code>')
    .split('\n').join('<br />');
  return (
    <span
      style={{ fontFamily: 'Verdana, Geneva, sans-serif', fontSize: '12pt', lineHeight: 1.45, display: 'block' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Icon ──────────────────────────────────────────────────────────────────────
function ThaiymeIcon({ size = 24 }) {
  return <img src={ICON_SRC} alt="Thaiyme" width={size} height={size} style={{ display: 'block', flexShrink: 0 }} />;
}

// ── Main widget ───────────────────────────────────────────────────────────────
export default function ThaiymeChat({ businessId, eventId, page }) {
  const { t }        = useTranslation();
  const { language } = useLanguage();
  const { Expanded: sidebarExpanded } = useAccount();
  const sidebarW     = sidebarExpanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;
  const storageKey   = _storageKey({ businessId, eventId });
  const sessionName  = _sessionName(page, businessId, eventId);

  // ── Core state ────────────────────────────────────────────────────────────
  const [open, setOpen]           = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const [messages, setMessages]   = useState(() => _loadStored(storageKey));
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [chips, setChips]         = useState([]);

  // ── Voice state ───────────────────────────────────────────────────────────
  const [ttsEnabled, setTtsEnabled]   = useState(false);
  const [listening, setListening]     = useState(false);
  const [voices, setVoices]           = useState([]);
  const recognitionRef                = useRef(null);
  const ttsEnabledRef                 = useRef(false);

  // ── Sessions blade ────────────────────────────────────────────────────────
  const [sessions, setSessions]               = useState(loadSessions);
  const [viewingKey, setViewingKey]           = useState(null); // null = current session
  const [viewingMessages, setViewingMessages] = useState([]);

  const bottomRef   = useRef(null);
  const greetedRef  = useRef(false);

  // Keep ttsEnabledRef in sync
  useEffect(() => { ttsEnabledRef.current = ttsEnabled; }, [ttsEnabled]);

  // ── Load TTS voices ───────────────────────────────────────────────────────
  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis?.getVoices() || []);
    load();
    window.speechSynthesis?.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', load);
  }, []);

  const maleVoice = useMemo(() => findMaleVoice(voices), [voices]);

  const speak = useCallback((text) => {
    if (!ttsEnabledRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(stripMarkdown(text));
    if (maleVoice) u.voice = maleVoice;
    u.rate  = 1.0;
    u.pitch = 0.85;
    window.speechSynthesis.speak(u);
  }, [maleVoice]);

  // ── Voice recognition ─────────────────────────────────────────────────────
  const toggleListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice recognition is not supported in this browser. Try Chrome or Edge.'); return; }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.continuous      = false;
    rec.interimResults  = false;
    rec.lang            = language === 'es' ? 'es-US' : 'en-US';
    rec.onresult  = (e) => {
      const t = e.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${t}` : t);
    };
    rec.onend   = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  }, [listening, language]);

  // Cleanup recognition on unmount
  useEffect(() => () => recognitionRef.current?.stop(), []);

  // Stop TTS on close
  useEffect(() => {
    if (!open) window.speechSynthesis?.cancel();
  }, [open]);

  // ── Persist + reset on scope change ──────────────────────────────────────
  useEffect(() => { _saveStored(storageKey, messages); }, [messages, storageKey]);
  useEffect(() => {
    setMessages(_loadStored(storageKey));
    greetedRef.current = false;
    setViewingKey(null);
  }, [storageKey]);

  // ── Hydrate from server on first open ────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const params = new URLSearchParams();
    if (businessId) params.set('business_id', businessId);
    if (eventId)    params.set('event_id', eventId);
    if (page)       params.set('page', page);
    fetch(`${API}/api/thaiyme/history?${params}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : { messages: [] })
      .then(data => { if (Array.isArray(data?.messages) && data.messages.length) setMessages(data.messages); })
      .catch(() => {});
    fetch(`${API}/api/thaiyme/suggestions?${params}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : { suggestions: [] })
      .then(data => setChips(Array.isArray(data?.suggestions) ? data.suggestions : []))
      .catch(() => setChips([]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Greeting ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open && messages.length === 0 && !greetedRef.current) {
      greetedRef.current = true;
      const whereKey = eventId
        ? 'thaiyme_chat.where_events'
        : (businessId && page === 'accounting' ? 'thaiyme_chat.where_books' : 'thaiyme_chat.where_business');
      const greeting = t('thaiyme_chat.greeting', { name: AGENT_NAME, where: t(whereKey) });
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [open, messages.length, businessId, eventId, page]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // ── Refresh sessions blade when messages change ───────────────────────────
  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    upsertSession(storageKey, sessionName, last.content);
    setSessions(loadSessions());
  }, [messages, storageKey, sessionName]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const userText = (typeof text === 'string' ? text : input).trim();
    if (!userText || loading) return;
    setInput('');
    setError('');
    setViewingKey(null); // return to live session
    const next = [...messages, { role: 'user', content: userText }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/thaiyme/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          business_id: businessId || null,
          event_id:    eventId    || null,
          page:        page       || null,
          messages:    next,
          language:    language   || 'en',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail || `Chat failed (${res.status})`);
      }
      const data     = await res.json();
      const proposals = Array.isArray(data?.proposals) ? data.proposals : [];
      const reply    = { role: 'assistant', content: data.content, proposals: proposals.length ? proposals : undefined };
      setMessages(prev => [...prev, reply]);
      speak(data.content);
    } catch (e) {
      setError(e.message || t('thaiyme_chat.err_network'));
      setMessages(prev => [...prev, { role: 'assistant', content: t('thaiyme_chat.err_backend') }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, businessId, eventId, page, language, speak]);

  // ── Confirm / dismiss proposals ───────────────────────────────────────────
  const confirmProposal = useCallback(async (msgIdx, pi) => {
    const p = messages[msgIdx]?.proposals?.[pi];
    if (!p) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/thaiyme/confirm`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(p),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || 'Confirm failed');
      setMessages(prev => prev.map((m, i) => i !== msgIdx ? m : {
        ...m, proposals: (m.proposals || []).map((pp, j) => j === pi ? { ...pp, _executed: true } : pp),
      }));
      const done = t('thaiyme_chat.done_action', { summary: p.summary });
      setMessages(prev => [...prev, { role: 'assistant', content: done }]);
      speak(done);
    } catch (e) { setError(e.message || 'Network error.'); }
    finally { setLoading(false); }
  }, [messages, speak]);

  const dismissProposal = useCallback((msgIdx, pi) => {
    setMessages(prev => prev.map((m, i) => i !== msgIdx ? m : {
      ...m, proposals: (m.proposals || []).map((pp, j) => j === pi ? { ...pp, _dismissed: true } : pp),
    }));
  }, []);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = async () => {
    window.speechSynthesis?.cancel();
    setMessages([]); greetedRef.current = false;
    try { localStorage.removeItem(storageKey); } catch {}
    const params = new URLSearchParams();
    if (businessId) params.set('business_id', businessId);
    if (eventId)    params.set('event_id', eventId);
    try { await fetch(`${API}/api/thaiyme/history?${params}`, { method: 'DELETE', headers: authHeaders() }); } catch {}
  };

  // ── Session switching (view only) ─────────────────────────────────────────
  const switchToSession = (s) => {
    if (s.key === storageKey) { setViewingKey(null); return; }
    setViewingKey(s.key);
    setViewingMessages(_loadStored(s.key));
  };

  const activeMessages = viewingKey ? viewingMessages : messages;
  const isViewing      = !!viewingKey;

  // ── Floating button ───────────────────────────────────────────────────────
  if (!open) {
    return createPortal(
      <AgentBadge bottom={24} baseRight={24} zIndex={50}>
      <button
        onClick={() => setOpen(true)}
        title={t('thaiyme_chat.launcher_title')}
        className="flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: 'transparent', border: 'none', padding: 0 }}
      >
        <ThaiymeIcon size={64} />
      </button>
      </AgentBadge>,
      document.body,
    );
  }

  // ── Panel geometry ────────────────────────────────────────────────────────
  // Fullscreen leaves the left AccountSidebar (64px collapsed) uncovered.
  const panelStyle = expanded
    ? { top: 72, left: sidebarW, width: `calc(100vw - ${sidebarW}px)`, height: 'calc(100vh - 72px)', zIndex: 9999, borderRadius: 0, position: 'fixed' }
    : { width: 360, height: 540, bottom: 24, right: 24, zIndex: 50, borderRadius: '1rem', position: 'fixed' };

  // ── Input bar with mic ────────────────────────────────────────────────────
  const InputBar = (
    <div className="border-t border-gray-100 px-3 py-2.5 flex items-end gap-2 bg-white shrink-0">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        rows={1}
        placeholder={listening ? 'Listening…' : t('thaiyme_chat.placeholder')}
        className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        style={{ maxHeight: 120 }}
        disabled={loading || isViewing}
      />
      {/* Mic button */}
      <button
        onClick={toggleListening}
        title={listening ? 'Stop listening' : 'Speak your message'}
        disabled={isViewing}
        className="p-2 rounded-xl transition-colors"
        style={{
          background: listening ? '#ef4444' : '#f3f4f6',
          color: listening ? '#fff' : ACCENT_COLOR,
          border: 'none',
          cursor: isViewing ? 'not-allowed' : 'pointer',
        }}
      >
        {listening ? (
          // Animated mic-off
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="10" y="2" width="4" height="11" rx="2"/>
            <path d="M5 10a7 7 0 0 0 14 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="11" rx="3"/>
            <path d="M5 10a7 7 0 0 0 14 0"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
          </svg>
        )}
      </button>
      {/* Send */}
      <button
        onClick={() => sendMessage()}
        disabled={loading || !input.trim() || isViewing}
        className="px-3 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
        style={{ background: ACCENT_COLOR }}
      >
        {t('thaiyme_chat.btn_send')}
      </button>
    </div>
  );

  return createPortal(
    <div
      className="flex flex-col shadow-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid #e5e7eb', ...panelStyle }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ background: ACCENT_COLOR }}>
        <ThaiymeIcon size={28} />
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-none">{AGENT_NAME}</p>
          <p className="text-white/80 text-xs mt-0.5">{t('thaiyme_chat.subtitle')}</p>
        </div>
        <div className="flex items-center gap-1">
          {/* TTS toggle */}
          <button
            onClick={() => { window.speechSynthesis?.cancel(); setTtsEnabled(v => !v); }}
            title={ttsEnabled ? 'Mute voice' : 'Enable voice (male Google)'}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: ttsEnabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            {ttsEnabled ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            )}
          </button>
          {/* Expand/collapse */}
          <button
            onClick={() => setExpanded(v => !v)}
            title={expanded ? t('thaiyme_chat.btn_collapse') : t('thaiyme_chat.btn_expand')}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {expanded
                ? <><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></>
                : <><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>
              }
            </svg>
          </button>
          {/* Clear */}
          <button onClick={clearChat} title={t('thaiyme_chat.btn_clear')} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors" style={{ border: 'none', cursor: 'pointer' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          {/* Close */}
          <button
            onClick={() => { window.speechSynthesis?.cancel(); setOpen(false); setExpanded(false); }}
            aria-label="Close"
            title="Close"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors text-lg leading-none"
            style={{ border: 'none', cursor: 'pointer' }}
          >×</button>
        </div>
      </div>

      {/* ── Body: sessions blade + chat ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sessions blade — fullscreen only */}
        {expanded && (
          <div className="flex flex-col shrink-0 overflow-y-auto border-r border-gray-200" style={{ width: 220, background: '#fdfaf3' }}>
            <div className="px-3 py-2.5 border-b border-gray-200 shrink-0">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Previous Chats</p>
            </div>

            {/* Current session always first */}
            <button
              onClick={() => setViewingKey(null)}
              className="w-full text-left px-3 py-3 border-b border-gray-100 transition-colors"
              style={{
                background: !viewingKey ? '#fdf6ee' : 'transparent',
                border: 'none',
                borderBottom: '1px solid #f3f4f6',
                borderLeft: !viewingKey ? `3px solid ${ACCENT_COLOR}` : '3px solid transparent',
                cursor: 'pointer',
              }}
            >
              <p className="text-xs font-bold truncate" style={{ color: ACCENT_COLOR }}>{sessionName}</p>
              <p className="text-xs text-gray-400 mt-0.5">Current session</p>
            </button>

            {/* Other sessions */}
            {sessions.filter(s => s.key !== storageKey).map(s => (
              <button
                key={s.key}
                onClick={() => switchToSession(s)}
                className="w-full text-left px-3 py-3 transition-colors"
                style={{
                  background: viewingKey === s.key ? '#fdf6ee' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #f3f4f6',
                  borderLeft: viewingKey === s.key ? `3px solid ${ACCENT_COLOR}` : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <p className="text-xs font-semibold text-gray-700 truncate">{s.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{s.preview || '—'}</p>
                <p className="text-xs text-gray-300 mt-0.5">{new Date(s.ts).toLocaleDateString()}</p>
              </button>
            ))}

            {sessions.filter(s => s.key !== storageKey).length === 0 && (
              <p className="text-xs text-gray-400 px-3 py-4 italic">No other sessions yet.</p>
            )}
          </div>
        )}

        {/* ── Chat column ── */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Viewing-another-session banner */}
          {isViewing && (
            <div className="px-3 py-2 flex items-center gap-2 shrink-0" style={{ background: '#fef3c7', borderBottom: '1px solid #fde68a' }}>
              <span className="text-xs text-amber-800 flex-1">Viewing a past session — read only.</span>
              <button onClick={() => setViewingKey(null)} className="text-xs font-bold hover:underline" style={{ color: ACCENT_COLOR, background: 'none', border: 'none', cursor: 'pointer' }}>
                Back to active chat
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: '#fdfaf3' }}>
            {activeMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {m.role === 'assistant' && <ThaiymeIcon size={22} />}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${expanded ? 'max-w-[60%]' : 'max-w-[80%]'} ${
                    m.role === 'user'
                      ? 'bg-gray-800 text-white rounded-br-sm'
                      : 'bg-white border border-amber-100 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <MessageContent text={m.content} />
                  {m.role === 'assistant' && Array.isArray(m.proposals) && m.proposals.map((p, pi) =>
                    p._dismissed ? null : (
                      <div key={pi} className="mt-2 border border-amber-300 rounded-lg p-2.5 bg-amber-50">
                        <div className="text-xs font-semibold mb-1" style={{ color: ACCENT_COLOR }}>
                          {p._executed ? t('thaiyme_chat.proposal_done') : t('thaiyme_chat.proposal_confirm')}
                        </div>
                        <div className="text-xs text-gray-700 mb-2">{p.summary}</div>
                        {!p._executed && !isViewing && (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => dismissProposal(i, pi)} disabled={loading}
                              className="text-xs px-2.5 py-1 rounded border border-gray-300 hover:bg-white disabled:opacity-50">
                              {t('thaiyme_chat.btn_proposal_no')}
                            </button>
                            <button onClick={() => confirmProposal(i, pi)} disabled={loading}
                              className="text-xs px-2.5 py-1 rounded text-white disabled:opacity-50"
                              style={{ background: ACCENT_COLOR }}>
                              {t('thaiyme_chat.btn_proposal_yes')}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <ThaiymeIcon size={22} />
                <div className="bg-white border border-amber-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: ACCENT_COLOR, animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: ACCENT_COLOR, animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: ACCENT_COLOR, animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-3 py-2 bg-red-50 border-t border-red-200 text-xs text-red-700 shrink-0">{error}</div>
          )}

          {/* Suggestion chips */}
          {chips.length > 0 && messages.length <= 1 && !isViewing && (
            <div className="px-3 py-2 border-t border-amber-100 bg-amber-50/40 shrink-0 flex flex-wrap gap-1.5">
              {chips.map((c, i) => (
                <button key={i} onClick={() => sendMessage(c)}
                  className="text-xs px-2 py-1 rounded-full border border-amber-200 bg-white hover:bg-amber-100 transition-colors"
                  style={{ color: ACCENT_COLOR }}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {InputBar}
        </div>
      </div>
    </div>,
    document.body,
  );
}
