/**
 * RosemarieChat — the floating artisan-producer AI assistant.
 *
 * Mount on any producer-related page (bakery dashboard, mill inventory,
 * processed-foods seller page, etc.):
 *
 *   <RosemarieChat businessId={BusinessID} />
 *
 * Bottom-right launcher bubble opens a popup; fullscreen toggle inside.
 * Messages persist via Firestore (Rosemarie_chats) + Redis short-term
 * buffer on the backend.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AgentBadge from './AgentBadge';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageContext';
import { useNavConfig } from './useNavConfig';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';
const ROSEMARIE_PURPLE = '#8B5CF6';
const ROSEMARIE_DEEP   = '#6D3DCB';
const ICON_SRC = '/images/RosemariAIIcon.webp';

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function newThreadId() {
  if (window.crypto?.randomUUID) return `rosemarie_${window.crypto.randomUUID()}`;
  return `rosemarie_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function threadStorageKey(peopleId, businessId) {
  return `rosemarie_thread_${peopleId || 'anon'}_${businessId || 'none'}`;
}

// ─── Sprig mark (rosemary sprig) ─────────────────────────────────────────────

function SprigMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v18" stroke={ROSEMARIE_DEEP} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 6c-2 1-3 2-4 4M12 10c-2 1-3 2-4 4M12 14c-2 1-3 2-4 4" stroke={ROSEMARIE_PURPLE} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M12 6c2 1 3 2 4 4M12 10c2 1 3 2 4 4M12 14c2 1 3 2 4 4" stroke={ROSEMARIE_PURPLE} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Message bubble ──────────────────────────────────────────────────────────

function Bubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 8,
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '8px 12px',
        borderRadius: 12,
        fontSize: 13.5,
        lineHeight: 1.45,
        whiteSpace: 'pre-wrap',
        background: isUser ? ROSEMARIE_PURPLE : '#f5f3ff',
        color: isUser ? '#fff' : '#111827',
        border: isUser ? 'none' : '1px solid #e9d5ff',
        wordBreak: 'break-word',
      }}>
        {content}
      </div>
    </div>
  );
}

// ─── Chat panel ──────────────────────────────────────────────────────────────

function ChatPanel({ businessId, peopleId, onClose, onToggleFullscreen, fullscreen }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [threadId, setThreadId]   = useState(() => {
    return localStorage.getItem(threadStorageKey(peopleId, businessId)) || null;
  });
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [sending, setSending]     = useState(false);
  const [loadingHist, setLoadingHist] = useState(false);
  const [error, setError]         = useState('');
  const scrollRef = useRef(null);

  const ensureThread = useCallback(() => {
    if (threadId) return threadId;
    const newTid = newThreadId();
    setThreadId(newTid);
    localStorage.setItem(threadStorageKey(peopleId, businessId), newTid);
    return newTid;
  }, [threadId, peopleId, businessId]);

  const loadHistory = useCallback(async (tid) => {
    if (!tid) return;
    setLoadingHist(true);
    try {
      const r = await fetch(`${SAIGE_API}/rosemarie/threads/${tid}/messages`, { headers: authHeaders() });
      if (r.ok) {
        const data = await r.json();
        const msgs = (data.messages || []).map((m) => ({ role: m.role, content: m.content }));
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoadingHist(false);
    }
  }, []);

  useEffect(() => {
    if (threadId) loadHistory(threadId);
  }, [threadId, loadHistory]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setError('');
    const tid = ensureThread();
    const nextMsgs = [...messages, { role: 'user', content: text }];
    setMessages(nextMsgs);
    setInput('');
    setSending(true);
    try {
      const r = await fetch(`${SAIGE_API}/rosemarie/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          user_input: text,
          thread_id: tid,
          business_id: businessId ? Number(businessId) : null,
          language: language || 'en',
        }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.message || body.error || `HTTP ${r.status}`);
      }
      const data = await r.json();
      setMessages([...nextMsgs, { role: 'assistant', content: data.response || t('rosemarie_chat.no_response') }]);
    } catch (e) {
      setError(e.message || t('rosemarie_chat.err_failed'));
      setMessages([...nextMsgs, { role: 'assistant', content: t('rosemarie_chat.err_send', { msg: e.message }) }]);
    } finally {
      setSending(false);
    }
  };

  const newConversation = () => {
    const newTid = newThreadId();
    setThreadId(newTid);
    localStorage.setItem(threadStorageKey(peopleId, businessId), newTid);
    setMessages([]);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const wrapperStyle = fullscreen
    ? {
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(17,24,39,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }
    : {
        position: 'fixed', bottom: 86, right: 20, zIndex: 10000,
      };

  const panelStyle = fullscreen
    ? {
        width: 'min(920px, 96vw)', height: 'min(88vh, 900px)',
        background: '#fff', borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 25px 60px -10px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column',
      }
    : {
        width: 'min(400px, 94vw)', height: 'min(560px, 78vh)',
        background: '#fff', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', border: '1px solid #e5e7eb',
        display: 'flex', flexDirection: 'column',
      };

  return (
    <div style={wrapperStyle} onClick={(e) => { if (fullscreen && e.target === e.currentTarget) onClose(); }}>
      <div style={panelStyle}>
        {/* Header */}
        <div style={{
          background: ROSEMARIE_PURPLE, color: '#fff', padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <img src={ICON_SRC} alt="Rosemarie" width={22} height={22} style={{ display:"block", borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Rosemarie</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>{t('rosemarie_chat.subtitle')}</div>
          </div>
          <button onClick={newConversation} style={hdrBtn} title={t('rosemarie_chat.btn_new_title')}>{t('rosemarie_chat.btn_new')}</button>
          <button onClick={onToggleFullscreen} style={hdrBtn} title={fullscreen ? t('rosemarie_chat.btn_exit_fullscreen') : t('rosemarie_chat.btn_fullscreen')}>
            {fullscreen ? '⤢' : '⤡'}
          </button>
          <button onClick={onClose} style={hdrBtn} title={t('rosemarie_chat.btn_close')}>×</button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{
          flex: 1, padding: 12, overflowY: 'auto', background: '#fafaf9',
        }}>
          {loadingHist && <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{t('rosemarie_chat.loading_history')}</div>}
          {!loadingHist && !messages.length && (
            <div style={{ fontSize: 13, color: '#4b5563', padding: '16px 8px', lineHeight: 1.6 }}>
              {t('rosemarie_chat.welcome')}
            </div>
          )}
          {messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
          {sending && (
            <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>{t('rosemarie_chat.thinking')}</div>
          )}
          {error && (
            <div style={{ fontSize: 12, color: '#991b1b', marginTop: 6 }}>{error}</div>
          )}
        </div>

        {/* Composer */}
        <div style={{
          padding: 10, borderTop: '1px solid #e5e7eb', background: '#fff',
          display: 'flex', gap: 8, alignItems: 'flex-end',
        }}>
          <textarea
            rows={fullscreen ? 2 : 1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={t('rosemarie_chat.placeholder')}
            style={{
              flex: 1, resize: 'none', border: '1px solid #d1d5db', borderRadius: 8,
              padding: '8px 10px', fontSize: 13.5, fontFamily: 'inherit',
              outline: 'none', minHeight: 36,
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            style={{
              padding: '8px 14px', background: ROSEMARIE_PURPLE, color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
              opacity: input.trim() && !sending ? 1 : 0.6,
            }}
          >
            {t('rosemarie_chat.btn_send')}
          </button>
        </div>
      </div>
    </div>
  );
}

const hdrBtn = {
  background: 'rgba(255,255,255,0.15)', color: '#fff',
  border: 'none', borderRadius: 6, padding: '4px 8px',
  fontSize: 12, cursor: 'pointer', fontWeight: 600,
};

// ─── Launcher bubble ─────────────────────────────────────────────────────────

export default function RosemarieChat({ businessId }) {
  const { t } = useTranslation();
  const { isNavActive } = useNavConfig();
  const [open, setOpen]           = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const peopleId = useMemo(() => (
    localStorage.getItem('people_id') || localStorage.getItem('PeopleID') || 'anon'
  ), []);

  const isLoggedIn = !!(localStorage.getItem('access_token') || localStorage.getItem('AccessToken'));

  useEffect(() => {
    if (!fullscreen) return;
    const onEsc = (e) => { if (e.key === 'Escape') setFullscreen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [fullscreen]);

  if (!isLoggedIn) return null;
  if (!isNavActive('widget_rosemarie')) return null;

  return (
    <>
      <AgentBadge bottom={20} baseRight={20} zIndex={9999}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('rosemarie_chat.launcher_aria')}
        style={{
          width: 58, height: 58, borderRadius: '50%',
          background: ROSEMARIE_PURPLE, color: '#fff', border: 'none',
          boxShadow: '0 6px 18px -4px rgba(0,0,0,0.35)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title={t('rosemarie_chat.launcher_title')}
      >
        <img src={ICON_SRC} alt="Rosemarie" width={30} height={30} style={{ display:"block", borderRadius:"50%", objectFit:"cover" }} />
      </button>
      </AgentBadge>

      {open && (
        <ChatPanel
          businessId={businessId}
          peopleId={peopleId}
          fullscreen={fullscreen}
          onClose={() => { setOpen(false); setFullscreen(false); }}
          onToggleFullscreen={() => setFullscreen((v) => !v)}
        />
      )}
    </>
  );
}
