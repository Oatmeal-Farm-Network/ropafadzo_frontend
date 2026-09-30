// src/TarrigonChat.jsx
// Tarrigon (pronounced "Tarragon") — Enterprise Supply Chain AI agent.
// Floating chat widget: expandable panel, suggestion chips, history, clear.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AgentBadge from './AgentBadge';
import { createPortal } from 'react-dom';
import { useAccount } from './AccountContext';

const API          = import.meta.env.VITE_API_URL || '';
const AGENT_NAME   = 'Tarrigon';
const TEAL         = '#1e6b5a';
const TEAL_DARK    = '#164f42';
const SIDEBAR_EXPANDED_W  = 211;
const SIDEBAR_COLLAPSED_W = 67;

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

// ── Icon ──────────────────────────────────────────────────────────────────────
function TarrigonIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="20" cy="20" r="20" fill={TEAL} />
      {/* chain-link / supply chain icon */}
      <path d="M13 20c0-2.2 1.8-4 4-4h2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M27 20c0 2.2-1.8 4-4 4h-2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="11" y="16" width="8" height="8" rx="4" stroke="white" strokeWidth="2.2" fill="none"/>
      <rect x="21" y="16" width="8" height="8" rx="4" stroke="white" strokeWidth="2.2" fill="none"/>
      {/* herb leaf accent at top */}
      <path d="M20 10 C18 12 17 14 20 15 C23 14 22 12 20 10Z" fill="white" opacity="0.7"/>
    </svg>
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
    .replace(/`(.*?)`/g, `<code style="background:#e6f3ef;color:${TEAL};padding:0 3px;border-radius:3px;">$1</code>`)
    .split('\n').join('<br />');
  return (
    <span
      style={{ fontFamily: 'Verdana, Geneva, sans-serif', fontSize: '12pt', lineHeight: 1.45, display: 'block' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export default function TarrigonChat({ businessId, page }) {
  const { Expanded: sidebarExpanded } = useAccount();
  const sidebarW = sidebarExpanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  const [open, setOpen]       = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [chips, setChips]     = useState([]);

  const bottomRef  = useRef(null);
  const greetedRef = useRef(false);

  // ── Hydrate history + suggestions on first open ───────────────────────────
  useEffect(() => {
    if (!open) return;
    const params = new URLSearchParams();
    if (businessId) params.set('business_id', businessId);
    if (page)       params.set('page', page);

    fetch(`${API}/api/tarrigon/history?${params}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : { messages: [] })
      .then(data => { if (Array.isArray(data?.messages) && data.messages.length) setMessages(data.messages); })
      .catch(() => {});

    fetch(`${API}/api/tarrigon/suggestions?${params}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : { suggestions: [] })
      .then(data => setChips(Array.isArray(data?.suggestions) ? data.suggestions : []))
      .catch(() => setChips([]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Greeting ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open && messages.length === 0 && !greetedRef.current) {
      greetedRef.current = true;
      setMessages([{
        role: 'assistant',
        content: `Hi, I'm ${AGENT_NAME} — your supply chain intelligence assistant. I can help you analyze exceptions, review margins, check shipment status, and identify demand-supply gaps. How can I help?`,
      }]);
    }
  }, [open, messages.length]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const userText = (typeof text === 'string' ? text : input).trim();
    if (!userText || loading) return;
    setInput('');
    setError('');
    const next = [...messages, { role: 'user', content: userText }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/tarrigon/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          business_id: businessId ? parseInt(businessId) : null,
          page: page || null,
          messages: next,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail || `Chat failed (${res.status})`);
      }
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (e) {
      setError(e.message || 'Network error.');
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that request right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, businessId, page]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = async () => {
    setMessages([]); greetedRef.current = false; setError('');
    const params = new URLSearchParams();
    if (businessId) params.set('business_id', businessId);
    try { await fetch(`${API}/api/tarrigon/history?${params}`, { method: 'DELETE', headers: authHeaders() }); } catch {}
  };

  // ── Floating button ───────────────────────────────────────────────────────
  if (!open) {
    return createPortal(
      <AgentBadge bottom={24} baseRight={24} zIndex={50}>
      <button
        onClick={() => setOpen(true)}
        title={`Chat with ${AGENT_NAME}`}
        className="flex items-center justify-center transition-all hover:scale-110 active:scale-95 rounded-full shadow-lg"
        style={{ background: 'transparent', border: 'none', padding: 0 }}
      >
        <TarrigonIcon size={60} />
      </button>
      </AgentBadge>,
      document.body,
    );
  }

  // ── Panel geometry ────────────────────────────────────────────────────────
  const panelStyle = expanded
    ? { top: 72, left: sidebarW, width: `calc(100vw - ${sidebarW}px)`, height: 'calc(100vh - 72px)', zIndex: 9999, borderRadius: 0, position: 'fixed' }
    : { width: 360, height: 540, bottom: 24, right: 24, zIndex: 50, borderRadius: '1rem', position: 'fixed' };

  return createPortal(
    <div
      className="flex flex-col shadow-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid #e5e7eb', ...panelStyle }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ background: TEAL }}>
        <TarrigonIcon size={28} />
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-none">{AGENT_NAME}</p>
          <p className="text-white/80 text-xs mt-0.5">Supply Chain Intelligence</p>
        </div>
        <div className="flex items-center gap-1">
          {/* Expand/collapse */}
          <button
            onClick={() => setExpanded(v => !v)}
            title={expanded ? 'Collapse' : 'Expand'}
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
          <button onClick={clearChat} title="Clear chat" className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors" style={{ border: 'none', cursor: 'pointer' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          {/* Close */}
          <button
            onClick={() => { setOpen(false); setExpanded(false); }}
            aria-label="Close"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors text-lg leading-none"
            style={{ border: 'none', cursor: 'pointer' }}
          >×</button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: '#f0f9f6' }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
            {m.role === 'assistant' && <TarrigonIcon size={22} />}
            <div
              className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${expanded ? 'max-w-[60%]' : 'max-w-[80%]'} ${
                m.role === 'user'
                  ? 'bg-gray-800 text-white rounded-br-sm'
                  : 'bg-white border text-gray-800 rounded-bl-sm shadow-sm'
              }`}
              style={m.role === 'assistant' ? { borderColor: '#c6e8df' } : {}}
            >
              <MessageContent text={m.content} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <TarrigonIcon size={22} />
            <div className="bg-white border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm" style={{ borderColor: '#c6e8df' }}>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: TEAL, animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: TEAL, animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: TEAL, animationDelay: '300ms' }} />
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
      {chips.length > 0 && messages.length <= 1 && (
        <div className="px-3 py-2 border-t flex flex-wrap gap-1.5 shrink-0" style={{ borderColor: '#c6e8df', background: '#f0f9f6' }}>
          {chips.map((c, i) => (
            <button key={i} onClick={() => sendMessage(c)}
              className="text-xs px-2 py-1 rounded-full border bg-white hover:bg-emerald-50 transition-colors"
              style={{ borderColor: '#9dcfbf', color: TEAL }}>
              {c}
            </button>
          ))}
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="border-t px-3 py-2.5 flex items-end gap-2 bg-white shrink-0" style={{ borderColor: '#e5e7eb' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="Ask about exceptions, margins, shipments…"
          className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{ maxHeight: 120, '--tw-ring-color': TEAL }}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="px-3 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
          style={{ background: TEAL }}
        >
          Send
        </button>
      </div>
    </div>,
    document.body,
  );
}
