/**
 * PairsleyChat — the floating food-service AI assistant.
 *
 * Mount on any restaurant-related page:
 *
 *   <PairsleyChat businessId={BusinessID} />
 *
 * The widget renders a bottom-right launcher bubble. Clicking it opens a popup
 * panel; a button inside the panel toggles full-screen mode. Messages persist
 * across sessions via Firestore (Pairsley_chats) + Redis short-term buffer on
 * the backend.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AgentBadge from './AgentBadge';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageContext';
import { useNavConfig } from './useNavConfig';

const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';
const PAIRSLEY_GREEN = '#2f7d4a';
const PAIRSLEY_LEAF  = '#6db77d';
const ICON_SRC = '/images/PairsleyAIIcon.webp';

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function newThreadId() {
  if (window.crypto?.randomUUID) return `pairsley_${window.crypto.randomUUID()}`;
  return `pairsley_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function threadStorageKey(peopleId, businessId) {
  return `pairsley_thread_${peopleId || 'anon'}_${businessId || 'none'}`;
}

// ─── Leaf mark ───────────────────────────────────────────────────────────────

function LeafMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 20c0-8 6-14 16-16-1 9-6 16-16 16z"
        fill={PAIRSLEY_LEAF}
        stroke={PAIRSLEY_GREEN}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M5 19L18 6" stroke={PAIRSLEY_GREEN} strokeWidth="1.2" fill="none" />
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
        background: isUser ? PAIRSLEY_GREEN : '#f3f4f6',
        color: isUser ? '#fff' : '#111827',
        border: isUser ? 'none' : '1px solid #e5e7eb',
        wordBreak: 'break-word',
      }}>
        {content}
      </div>
    </div>
  );
}

// ─── Chat panel (inner) ──────────────────────────────────────────────────────

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
    const tid = newThreadId();
    setThreadId(tid);
    localStorage.setItem(threadStorageKey(peopleId, businessId), tid);
    return tid;
  }, [threadId, peopleId, businessId]);

  // Load historical messages for this thread from Firestore
  const loadHistory = useCallback(async (tid) => {
    if (!tid) return;
    setLoadingHist(true);
    try {
      const r = await fetch(`${SAIGE_API}/pairsley/threads/${tid}/messages`, { headers: authHeaders() });
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

  // Auto-scroll on new message
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
      const r = await fetch(`${SAIGE_API}/pairsley/chat`, {
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
      setMessages([...nextMsgs, { role: 'assistant', content: data.response || '(no response)' }]);
    } catch (e) {
      setError(e.message || 'Failed');
      setMessages([...nextMsgs, { role: 'assistant', content: t('pairsley_chat.err_send_failed', { msg: e.message }) }]);
    } finally {
      setSending(false);
    }
  };

  const newConversation = () => {
    const tid = newThreadId();
    setThreadId(tid);
    localStorage.setItem(threadStorageKey(peopleId, businessId), tid);
    setMessages([]);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Layout: fullscreen = center modal; popup = bottom-right panel.
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
          background: PAIRSLEY_GREEN, color: '#fff', padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <img src={ICON_SRC} alt="Pairsley" width={22} height={22} style={{ display:"block", borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Pairsley</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>{t('pairsley_chat.tagline')}</div>
          </div>
          <button onClick={newConversation} style={hdrBtn} title={t('pairsley_chat.btn_new_title')}>{t('pairsley_chat.btn_new')}</button>
          <button onClick={onToggleFullscreen} style={hdrBtn} title={fullscreen ? t('pairsley_chat.btn_exit_fullscreen') : t('pairsley_chat.btn_fullscreen')}>
            {fullscreen ? '⤢' : '⤡'}
          </button>
          <button onClick={onClose} style={hdrBtn} title={t('pairsley_chat.btn_close')}>×</button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{
          flex: 1, padding: 12, overflowY: 'auto', background: '#fafaf9',
        }}>
          {loadingHist && <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{t('pairsley_chat.loading_history')}</div>}
          {!loadingHist && !messages.length && (
            <div style={{ fontSize: 13, color: '#4b5563', padding: '16px 8px', lineHeight: 1.6 }}>
              {t('pairsley_chat.greeting')}
            </div>
          )}
          {messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
          {sending && (
            <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>{t('pairsley_chat.thinking')}</div>
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
            placeholder={t('pairsley_chat.placeholder')}
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
              padding: '8px 14px', background: PAIRSLEY_GREEN, color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
              opacity: input.trim() && !sending ? 1 : 0.6,
            }}
          >
            {t('pairsley_chat.btn_send')}
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

export default function PairsleyChat({ businessId }) {
  const { t } = useTranslation();
  const { isNavActive } = useNavConfig();
  const [open, setOpen]           = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const peopleId = useMemo(() => (
    localStorage.getItem('people_id') || localStorage.getItem('PeopleID') || 'anon'
  ), []);

  useEffect(() => {
    if (!fullscreen) return;
    const onEsc = (e) => { if (e.key === 'Escape') setFullscreen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [fullscreen]);

  if (!isNavActive('widget_pairsley')) return null;

  return (
    <>
      {/* Launcher */}
      <AgentBadge bottom={20} baseRight={20} zIndex={9999}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('pairsley_chat.launcher_aria')}
        style={{
          width: 58, height: 58, borderRadius: '50%',
          background: PAIRSLEY_GREEN, color: '#fff', border: 'none',
          boxShadow: '0 6px 18px -4px rgba(0,0,0,0.35)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title={t('pairsley_chat.launcher_title')}
      >
        <img src={ICON_SRC} alt="Pairsley" width={30} height={30} style={{ display:"block", borderRadius:"50%", objectFit:"cover" }} />
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
