import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import { useAccount } from './AccountContext';
import SaigeFieldsCard from './SaigeFieldsCard';
import SaigeDraftsPanel from './SaigeDraftsPanel';
import SaigeProposalsPanel from './SaigeProposalsPanel';
import MarketIntelligenceWidget from './MarketIntelligenceWidget';
import FieldHealthWidget from './FieldHealthWidget';
import VizPlayground from './saige-viz/VizPlayground';
import VizRenderer from './saige-viz/VizRenderer';
import VizSkeleton from './saige-viz/VizSkeleton';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
function normalizeSaigeApiBase(rawValue) {
  // Base URL already includes the /saige prefix (unified local backend mounts
  // Saige at /saige; prod points at the standalone saige-backend root). Only
  // trim trailing slashes — do NOT strip /saige, or the unified backend 404/405s.
  const value = (rawValue || 'http://localhost:8000/saige').trim();
  if (!value) return 'http://localhost:8000/saige';
  return value.replace(/\/+$/, '');
}

const SAIGE_API = normalizeSaigeApiBase(import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige');
const CHAT_REQUEST_TIMEOUT_MS = 75000;

// ─── PALETTE (matches floating SaigeWidget) ──────────────────────────────────
const SAIGE_GREEN      = '#3D6B34';
const SAIGE_GREEN_DARK = '#2c4f25';
const SAIGE_LIGHT      = '#f0f7ee';
const SAIGE_BORDER     = '#c7dfc2';
const SAIGE_PANEL_BG   = '#fafdf9';
const SAIGE_TEXT       = '#1f2937';
const SAIGE_MUTED      = '#6b7280';
const SAIGE_FONT_HEAD  = 'Lora, Georgia, serif';
const SAIGE_FONT_BODY  = 'Montserrat, system-ui, sans-serif';

// ─── STORAGE HELPERS (user-scoped) ───────────────────────────────────────────
function threadsKey(userId) { return `saige_threads_${userId}`; }
function msgKey(userId, threadId) { return `saige_msg_${userId}_${threadId}`; }
function quizKey(userId, threadId) { return `saige_quiz_${userId}_${threadId}`; }

function saveThread(userId, threadId, messages, status, advisoryType) {
  if (!userId) return;
  try {
    localStorage.setItem(msgKey(userId, threadId), JSON.stringify(messages));
    const threads = getStoredThreads(userId);
    const preview = messages.filter(m => m.role === 'user').pop()?.content?.slice(0, 80) || 'New conversation';
    const entry = { thread_id: threadId, preview, status, advisory_type: advisoryType, updated_at: new Date().toISOString() };
    const idx = threads.findIndex(t => t.thread_id === threadId);
    if (idx >= 0) threads[idx] = entry; else threads.unshift(entry);
    localStorage.setItem(threadsKey(userId), JSON.stringify(threads));
  } catch (e) { console.warn('saveThread failed', e); }
}

function getLocalThreads(userId) {
  if (!userId) return [];
  return getStoredThreads(userId);
}

function getLocalMessages(userId, threadId) {
  if (!userId) return [];
  try { const r = localStorage.getItem(msgKey(userId, threadId)); return r ? JSON.parse(r) : []; }
  catch { return []; }
}

function saveQuiz(userId, threadId, quiz) {
  if (!userId) return;
  try {
    if (quiz) localStorage.setItem(quizKey(userId, threadId), JSON.stringify(quiz));
    else localStorage.removeItem(quizKey(userId, threadId));
  } catch (e) { console.warn('saveQuiz failed', e); }
}

function getLocalQuiz(userId, threadId) {
  if (!userId) return null;
  try { const r = localStorage.getItem(quizKey(userId, threadId)); return r ? JSON.parse(r) : null; }
  catch { return null; }
}

function deleteLocalThread(userId, threadId) {
  if (!userId) return;
  try {
    localStorage.removeItem(msgKey(userId, threadId));
    localStorage.removeItem(quizKey(userId, threadId));
    const threads = getStoredThreads(userId).filter(t => t.thread_id !== threadId);
    localStorage.setItem(threadsKey(userId), JSON.stringify(threads));
  } catch (e) { console.warn('deleteLocalThread failed', e); }
}

function getStoredThreads(userId) {
  if (!userId) return [];
  try { const r = localStorage.getItem(threadsKey(userId)); return r ? JSON.parse(r) : []; }
  catch { return []; }
}

function generateThreadId() {
  return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function mergeThreads(apiThreads, localThreads) {
  const seen = new Set();
  const merged = [];
  for (const t of apiThreads) { seen.add(t.thread_id); merged.push(t); }
  for (const t of localThreads) { if (!seen.has(t.thread_id)) merged.push(t); }
  merged.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  return merged;
}

function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hello! I'm Saige, your AI agricultural assistant. Ask me about crops, livestock, soil health, weather impacts, or any farming question.",
};

const STAGE_MESSAGES = {
  default:   ['🔍 Analyzing your question...', '📋 Assessment in process...', '🌱 Growing ideas...', '🚜 Harvesting knowledge...', '🧑‍🌾 Preparing your advice...'],
  weather:   ['🌦️ Checking weather conditions...', '☀️ Analyzing climate data...', '🌧️ Processing weather forecast...'],
  livestock: ['🐄 Checking livestock knowledge base...', '🐑 Retrieving breed database...', '🐓 Consulting veterinary experts...'],
  crops:     ['🌾 Consulting crop experts...', '🌿 Analyzing soil & plant health...', '🪴 Processing crop recommendations...'],
  mixed:     ['🌾🐄 Analyzing integrated farm data...', '📋 Processing mixed advisory...', '🧑‍🌾 Preparing comprehensive advice...'],
};

const ADVISORY_COLORS = {
  weather:   { bg: 'rgba(14,165,233,0.18)',  text: '#0369a1' },
  livestock: { bg: 'rgba(245,158,11,0.20)',  text: '#92400e' },
  crops:     { bg: 'rgba(34,197,94,0.20)',   text: SAIGE_GREEN_DARK },
  mixed:     { bg: 'rgba(168,85,247,0.20)',  text: '#6b21a8' },
};

// ─── THINKING INDICATOR ───────────────────────────────────────────────────────
function ThinkingDots({ stage }) {
  const { t } = useTranslation();
  const [msgIdx, setMsgIdx] = useState(0);
  const stageMessages = {
    default:   t('saige_page.stage_default', { returnObjects: true }),
    weather:   t('saige_page.stage_weather', { returnObjects: true }),
    livestock: t('saige_page.stage_livestock', { returnObjects: true }),
    crops:     t('saige_page.stage_crops', { returnObjects: true }),
    mixed:     t('saige_page.stage_mixed', { returnObjects: true }),
  };
  const msgs = stageMessages[stage] || stageMessages.default;
  useEffect(() => {
    setMsgIdx(0);
    const iv = setInterval(() => setMsgIdx(i => (i + 1) % msgs.length), 1500);
    return () => clearInterval(iv);
  }, [stage, msgs.length]);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{
          maxWidth: '80%', borderRadius: 12, padding: '12px 16px',
          background: SAIGE_LIGHT,
          border: `1px solid ${SAIGE_BORDER}`, color: SAIGE_TEXT,
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: SAIGE_FONT_BODY,
        }}>
          <svg style={{ width: 18, height: 18, flexShrink: 0, animation: 'saige-spin 1s linear infinite' }}
            fill="none" viewBox="0 0 24 24" stroke={SAIGE_GREEN} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span style={{ fontSize: 13, color: SAIGE_GREEN_DARK, fontStyle: 'italic' }}>{msgs[msgIdx]}</span>
        </div>
      </div>
      <div style={{ maxWidth: '90%', marginTop: 10 }}>
        <VizSkeleton />
      </div>
    </div>
  );
}

// ─── CHAT BUBBLE ─────────────────────────────────────────────────────────────
function ChatBubble({ message, voiceSupported, onSpeak, onDecideProposal, decidingProposalId, onFeedback }) {
  const { t } = useTranslation();
  const isUser = message.role === 'user';
  const [voted, setVoted] = useState(null); // null | 'up' | 'down'
  const proposals = Array.isArray(message.proposals) ? message.proposals : [];
  const visualizations = !isUser && Array.isArray(message.visualizations)
    ? message.visualizations.slice(0, 3)
    : [];
  const mapViz = visualizations.filter((v) => v && (v.type === 'farm_map' || v.type === 'field_map' || v.type === 'heatmap'));
  const cardViz = visualizations.filter((v) => v && v.type !== 'farm_map' && v.type !== 'field_map' && v.type !== 'heatmap');
  const hasViz = visualizations.length > 0;
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginRight: 8, marginTop: 2,
          background: SAIGE_GREEN,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <img src="/images/SaigeAIIcon.webp" alt="Saige" style={{ width: 32, height: 32, objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ maxWidth: hasViz ? '90%' : '75%', minWidth: 0, flex: hasViz ? '1 1 auto' : undefined }}>
      <div className={isUser ? undefined : 'saige-msg'} style={{
        position: 'relative',
        maxWidth: '100%', borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        padding: '9px 13px',
        background: isUser ? SAIGE_GREEN : SAIGE_LIGHT,
        border: isUser ? 'none' : `1px solid ${SAIGE_BORDER}`,
        color: isUser ? '#fff' : SAIGE_TEXT,
        fontSize: 13.5, lineHeight: 1.55,
        fontFamily: SAIGE_FONT_BODY,
        boxShadow: '0 1px 2px rgba(15,40,10,0.06)',
        paddingRight: !isUser && voiceSupported ? '2.2rem' : '13px',
      }}>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</p>
        {!isUser && cardViz.map((v) => (
          <div key={v.id || v.title} style={{ marginTop: 10 }}>
            <VizRenderer spec={v} />
          </div>
        ))}
        {!isUser && proposals.map((p, pi) => {
          if (!p || p._dismissed) return null;
          if (String(p.tool || '').toLowerCase() === 'save_plan') return null;
          const pid = p.proposal_id || `local-${pi}`;
          return (
            <div
              key={pid}
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                border: `1px solid ${SAIGE_BORDER}`,
                background: '#fff',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: SAIGE_GREEN_DARK, marginBottom: 4 }}>
                {p._executed ? 'Done' : 'Approve this change?'}
              </div>
              <div style={{ fontSize: 12, color: '#374151', marginBottom: 8 }}>
                {p.summary || `${p.tool || 'action'} proposed`}
              </div>
              {!p._executed && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    disabled={decidingProposalId === pid}
                    onClick={() => onDecideProposal && onDecideProposal(pi, 'reject')}
                    style={{
                      fontSize: 12, padding: '5px 10px', borderRadius: 8,
                      border: '1px solid #fecaca', background: '#fff', color: '#b91c1c',
                      cursor: 'pointer', fontWeight: 600, fontFamily: SAIGE_FONT_BODY,
                    }}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={decidingProposalId === pid}
                    onClick={() => onDecideProposal && onDecideProposal(pi, 'approve')}
                    style={{
                      fontSize: 12, padding: '5px 10px', borderRadius: 8,
                      border: 'none', background: SAIGE_GREEN, color: '#fff',
                      cursor: 'pointer', fontWeight: 600, fontFamily: SAIGE_FONT_BODY,
                    }}
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {!isUser && voiceSupported && (
          <button
            className="saige-speak"
            onClick={() => onSpeak(message.content)}
            title={t('saige_page.read_aloud_title')}
            style={{
              position: 'absolute', top: 5, right: 5,
              background: 'transparent', border: 'none',
              color: SAIGE_GREEN, fontSize: 13, cursor: 'pointer',
              padding: '2px 4px', opacity: 0, transition: 'opacity 0.15s',
              lineHeight: 1,
            }}
          >🔊</button>
        )}
      </div>
      {!isUser && message.content && onFeedback && (
        <div style={{ display: 'flex', gap: 4, marginTop: 4, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => { if (voted) return; setVoted('up'); onFeedback(1); }}
            title="Helpful"
            style={{
              background: 'none', border: 'none', cursor: voted ? 'default' : 'pointer',
              fontSize: 13, lineHeight: 1, padding: '1px 3px', opacity: voted === 'down' ? 0.3 : 1,
              color: voted === 'up' ? SAIGE_GREEN : '#9ca3af',
            }}
          >👍</button>
          <button
            type="button"
            onClick={() => { if (voted) return; setVoted('down'); onFeedback(-1); }}
            title="Not helpful"
            style={{
              background: 'none', border: 'none', cursor: voted ? 'default' : 'pointer',
              fontSize: 13, lineHeight: 1, padding: '1px 3px', opacity: voted === 'up' ? 0.3 : 1,
              color: voted === 'down' ? '#dc2626' : '#9ca3af',
            }}
          >👎</button>
        </div>
      )}
      {!isUser && mapViz.map((v) => (
        <div key={v.id || v.title} style={{ marginTop: 10, width: '100%' }}>
          <VizRenderer spec={v} />
        </div>
      ))}
      </div>
    </div>
  );
}

// ─── QUIZ CARD ────────────────────────────────────────────────────────────────
function QuizCard({ quiz, selectedOption, customAnswer, onOptionChange, onCustomChange, onSubmit }) {
  const { t } = useTranslation();
  const canSubmit = selectedOption || customAnswer.trim();
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
      <div style={{
        maxWidth: '80%', borderRadius: 12, padding: '16px 18px',
        background: '#fff',
        border: `1px solid ${SAIGE_BORDER}`, color: SAIGE_TEXT,
        boxShadow: '0 2px 6px rgba(15,40,10,0.06)',
        fontFamily: SAIGE_FONT_BODY,
      }}>
        <p style={{ fontSize: 14, color: SAIGE_TEXT, marginBottom: 14, lineHeight: 1.5, fontWeight: 500 }}>{quiz.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {quiz.options.map(opt => (
            <label key={opt} style={{
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              padding: '8px 10px', borderRadius: 8, fontSize: 13,
              background: selectedOption === opt ? SAIGE_LIGHT : '#fafafa',
              border: `1px solid ${selectedOption === opt ? SAIGE_GREEN : '#e5e7eb'}`,
              color: SAIGE_TEXT,
              transition: 'all 0.15s',
            }}>
              <input type="radio" name="saige-quiz" value={opt}
                checked={selectedOption === opt}
                onChange={e => { onOptionChange(e.target.value); onCustomChange(''); }}
                style={{ accentColor: SAIGE_GREEN }}
              />
              {opt}
            </label>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${SAIGE_BORDER}`, paddingTop: 12, marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: SAIGE_MUTED, marginBottom: 8 }}>{t('saige_page.quiz_or_write')}</p>
          <input type="text" value={customAnswer}
            onChange={e => { onCustomChange(e.target.value); onOptionChange(''); }}
            onKeyDown={e => { if (e.key === 'Enter' && canSubmit) onSubmit(); }}
            placeholder={t('saige_page.quiz_placeholder')}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, fontSize: 13,
              background: '#fff', border: '1px solid #d1d5db', color: SAIGE_TEXT,
              outline: 'none', boxSizing: 'border-box', fontFamily: SAIGE_FONT_BODY,
            }}
          />
        </div>
        <button onClick={onSubmit} disabled={!canSubmit} style={{
          width: '100%', padding: '10px', borderRadius: 8, border: 'none',
          background: canSubmit ? SAIGE_GREEN : '#e5e7eb',
          color: canSubmit ? 'white' : '#9ca3af',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          fontWeight: 600, fontSize: 13, transition: 'background 0.15s',
          fontFamily: SAIGE_FONT_BODY,
        }}>{t('saige_page.btn_submit_answer')}</button>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function ChatSidebar({ threads, activeThreadId, isCollapsed, isLoading, onToggle, onSelect, onDelete, onNewChat }) {
  const { t } = useTranslation();
  return (
    <div style={{
      width: isCollapsed ? 0 : 260, minWidth: isCollapsed ? 0 : 260,
      overflow: 'hidden', transition: 'all 0.3s ease',
      background: '#fff', borderRight: `1px solid ${SAIGE_BORDER}`,
      display: 'flex', flexDirection: 'column', position: 'relative', flexShrink: 0,
      fontFamily: SAIGE_FONT_BODY,
    }}>
      <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${SAIGE_BORDER}` }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: SAIGE_GREEN_DARK, textTransform: 'uppercase', letterSpacing: 1 }}>{t('saige_page.sidebar_heading')}</span>
      </div>
      <div style={{ padding: '10px 10px 6px' }}>
        <button onClick={onNewChat} style={{
          width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none',
          background: SAIGE_GREEN, color: 'white',
          cursor: 'pointer', fontWeight: 600, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontFamily: SAIGE_FONT_BODY,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = SAIGE_GREEN_DARK}
          onMouseLeave={e => e.currentTarget.style.background = SAIGE_GREEN}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> {t('saige_page.btn_new_chat')}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        {isLoading && threads.length === 0 && (
          <p style={{ textAlign: 'center', color: SAIGE_MUTED, fontSize: 12, padding: '20px 0' }}>{t('saige_page.sidebar_loading')}</p>
        )}
        {!isLoading && threads.length === 0 && (
          <p style={{ textAlign: 'center', color: SAIGE_MUTED, fontSize: 12, padding: '20px 8px', lineHeight: 1.5 }}>
            {t('saige_page.sidebar_empty')}
          </p>
        )}
        {threads.map(thread => {
          const isActive = thread.thread_id === activeThreadId;
          const color = thread.advisory_type ? ADVISORY_COLORS[thread.advisory_type] : null;
          return (
            <div key={thread.thread_id} onClick={() => onSelect(thread.thread_id)}
              style={{
                position: 'relative', padding: '9px 10px', borderRadius: 8, marginBottom: 3,
                cursor: 'pointer', transition: 'background 0.15s',
                background: isActive ? SAIGE_LIGHT : 'transparent',
                border: isActive ? `1px solid ${SAIGE_BORDER}` : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f5faf3'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <p style={{ margin: '0 0 4px', fontSize: 13, color: SAIGE_TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 20, fontWeight: isActive ? 600 : 500 }}>
                {thread.preview || t('saige_page.thread_empty_preview')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: thread.status === 'complete' ? SAIGE_GREEN : '#d97706', flexShrink: 0 }} />
                {color && (
                  <span style={{ padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 600, background: color.bg, color: color.text }}>
                    {thread.advisory_type}
                  </span>
                )}
                <span style={{ fontSize: 11, color: SAIGE_MUTED, marginLeft: 'auto' }}>{formatRelativeTime(thread.updated_at)}</span>
              </div>
              <button onClick={e => { e.stopPropagation(); onDelete(thread.thread_id); }}
                style={{
                  position: 'absolute', top: 8, right: 6, padding: '3px', borderRadius: 4,
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                  opacity: 0, transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#dc2626'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = 0; e.currentTarget.style.color = '#9ca3af'; }}
              >✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ABOUT SAIGE (logged-out view) ───────────────────────────────────────────
function AboutSaige() {
  const { t } = useTranslation();
  const features = [
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6D8E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L15 17H9l-.7-2C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/><line x1="9" y1="21" x2="15" y2="21"/><line x1="9.5" y1="17" x2="9.5" y2="21"/><line x1="14.5" y1="17" x2="14.5" y2="21"/></svg>, title: t('saige_page.feat_expertise_title'), desc: t('saige_page.feat_expertise_desc') },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6D8E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>, title: t('saige_page.feat_learning_title'), desc: t('saige_page.feat_learning_desc') },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6D8E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="8" y2="2"/><line x1="8" y1="22" x2="8" y2="12"/><path d="M8 12a4 4 0 0 1 0-6"/><line x1="16" y1="22" x2="16" y2="18"/><line x1="16" y1="2" x2="16" y2="12"/><path d="M16 12a4 4 0 0 0 0 6"/></svg>, title: t('saige_page.feat_f2t_title'), desc: t('saige_page.feat_f2t_desc') },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6D8E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: t('saige_page.feat_trust_title'), desc: t('saige_page.feat_trust_desc') },
  ];
  const coming = [
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, title: t('saige_page.coming_marketplace_title'), desc: t('saige_page.coming_marketplace_desc') },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9c0 4-4 7-7 9-3-2-7-5-7-9a7 7 0 0 1 14 0z"/><circle cx="12" cy="9" r="2.5"/></svg>, title: t('saige_page.coming_livestock_title'), desc: t('saige_page.coming_livestock_desc') },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: t('saige_page.coming_insights_title'), desc: t('saige_page.coming_insights_desc') },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>, title: t('saige_page.coming_analysis_title'), desc: t('saige_page.coming_analysis_desc') },
  ];
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <div className="w-full relative overflow-hidden" style={{ minHeight: '480px' }}>
        <img src="/images/SaigeBanner.webp" alt="Farmer using Saige AI in the field" fetchPriority="high" loading="eager" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,20,10,0.88) 0%, rgba(10,20,10,0.65) 55%, rgba(10,20,10,0.15) 100%)' }} />
        <div className="relative max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10" style={{ minHeight: '480px' }}>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M17 8c0 2.5-2 4-5 4S7 10.5 7 8c0-3 2.5-5 5-5s5 2 5 5z"/><line x1="12" y1="22" x2="4" y2="22"/><line x1="12" y1="22" x2="20" y2="22"/></svg>
              <h1 className="text-5xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Saige</h1>
            </div>
            <p className="text-xl font-semibold mb-4" style={{ color: '#86efac' }}>{t('saige_page.about_hero_subtitle')}</p>
            <p className="text-base leading-relaxed mb-6 max-w-lg" style={{ color: '#d1fae5' }}>
              {t('saige_page.about_hero_body')}{' '}
              <Link to="/contact-us" className="underline hover:text-white" style={{ color: '#6ee7b7' }}>{t('saige_page.about_hero_contact')}</Link> to learn more.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm" style={{ background: 'rgba(234,179,8,0.2)', border: '2px solid #eab308', color: '#fde047' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> {t('saige_page.about_coming_soon_badge')}
            </div>
          </div>
          <div className="flex-1 max-w-sm w-full">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20" style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(8px)' }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: 'rgba(30,41,59,0.95)' }}>
                <img src="/images/SaigeAIIcon.webp" alt="Saige" className="w-6 h-6 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>Saige</div>
                  <div className="text-gray-400 text-xs">AI Agricultural Assistant</div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0"><img src="/images/SaigeAIIcon.webp" alt="Saige" className="w-5 h-5" /></div>
                  <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-gray-200 max-w-xs" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                    Hello! I'm Saige. Ask me about crops, livestock, soil health, or weather impacts.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-white max-w-xs" style={{ background: 'linear-gradient(135deg,#1d4ed8,#1e40af)' }}>
                    What cover crops work best for clay soil?
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0"><img src="/images/SaigeAIIcon.webp" alt="Saige" className="w-5 h-5" /></div>
                  <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-gray-200 max-w-xs" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                    For clay soil, crimson clover and winter rye are excellent choices — they improve drainage and add nitrogen...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('saige_page.about_what_title')}</h2>
        <p className="text-gray-500 text-center mb-10">{t('saige_page.about_what_sub')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4 items-start">
              <span className="flex-shrink-0 flex items-center">{f.icon}</span>
              <div><h3 className="font-bold text-gray-900 text-base mb-1">{f.title}</h3><p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-14 px-6 text-center" style={{ background: 'linear-gradient(135deg, #0f172a, #14532d)' }}>
        <h2 className="text-3xl font-bold text-white mb-4">{t('saige_page.about_future_title')}</h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">{t('saige_page.about_future_body')}</p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid #eab308', color: '#d97706' }}>{t('saige_page.about_next_badge')}</span>
          <h2 className="text-3xl font-bold text-gray-900">{t('saige_page.about_next_title')}</h2>
          <p className="text-gray-500 mt-2">{t('saige_page.about_next_sub')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {coming.map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-yellow-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{t('saige_page.about_coming_badge')}</span></div>
              <span className="mb-3 flex items-center">{f.icon}</span>
              <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-14">
        <div className="rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6" style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }}>
          <span className="flex-shrink-0 flex items-center"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span>
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-2" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>{t('saige_page.about_live_badge')}</div>
            <h3 className="text-xl font-bold text-white mb-2">{t('saige_page.about_dir_title')}</h3>
            <p className="text-green-200 text-sm leading-relaxed">{t('saige_page.about_dir_body')}</p>
          </div>
          <Link to="/directory" className="flex-shrink-0 bg-white text-green-800 font-bold py-2 px-6 rounded-xl text-sm hover:bg-green-50 transition-colors">{t('saige_page.about_dir_link')}</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function getAuthHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function getResponseErrorMessage(res) {
  let details = '';
  try {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const payload = await res.json();
      details =
        payload?.message ||
        payload?.detail ||
        payload?.error ||
        '';
      if (!details && payload && typeof payload === 'object') {
        details = JSON.stringify(payload);
      }
    } else {
      details = (await res.text()).trim();
    }
  } catch {
    details = '';
  }

  if (!details) return `HTTP ${res.status}`;
  return `HTTP ${res.status}: ${details}`;
}

const _msgCache = new Map();

// ─── VOICE HELPERS ───────────────────────────────────────────────────────────
// Strip markdown so spoken output doesn't read "asterisk asterisk".
function cleanForSpeech(text) {
  return (text || '')
    .replace(/```[\s\S]*?```/g, ' code block. ')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[•▪–—]/g, ',')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .substring(0, 2000);
}

const SAIGE_AUTOSPEAK_KEY = 'saige_auto_speak';

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SaigePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { Business, LoadBusiness, BusinessID: contextBusinessID } = useAccount();

  // BusinessID priority: URL param > AccountContext > localStorage fallback
  const [BusinessID, setBusinessID] = useState(() => {
    return (
      searchParams.get('BusinessID') ||
      localStorage.getItem('selected_business_id') ||
      null
    );
  });

  // Keep BusinessID in sync with AccountContext and persist to localStorage
  useEffect(() => {
    const urlID = searchParams.get('BusinessID');
    const ctxID = contextBusinessID ? String(contextBusinessID) : null;
    const best = urlID || ctxID || localStorage.getItem('selected_business_id') || null;
    if (best && best !== BusinessID) {
      setBusinessID(best);
    }
    if (best) {
      localStorage.setItem('selected_business_id', best);
    }
  }, [contextBusinessID, searchParams]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState(null);
  const prevBusinessRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
    const pid = localStorage.getItem('people_id');
    setIsLoggedIn(Boolean(token));
    setUserId(pid || null);
    setAuthChecked(true);
  }, []);

  useEffect(() => { if (BusinessID) LoadBusiness(BusinessID); }, [BusinessID]);

  useEffect(() => {
    if (!authChecked) return;
    const nextBiz = BusinessID || null;
    if (prevBusinessRef.current === null) {
      prevBusinessRef.current = nextBiz;
      return;
    }
    if (prevBusinessRef.current !== nextBiz) {
      // Switching businesses should start a fresh Saige thread to avoid
      // stale graph state carrying old business context.
      setActiveThreadId(generateThreadId());
      setActiveChat([WELCOME_MESSAGE]);
      setQuiz(null);
      setSelectedOption('');
      setCustomAnswer('');
      setInput('');
      advisoryTypeRef.current = null;
      setProcessingStage('default');
    }
    prevBusinessRef.current = nextBiz;
  }, [BusinessID, authChecked]);

  const welcomeMsg = { role: 'assistant', content: t('saige_page.welcome') };

  const [activeThreadId, setActiveThreadId]     = useState('');
  const [activeChat, setActiveChat]             = useState([welcomeMsg]);
  const [quiz, setQuiz]                         = useState(null);
  const [selectedOption, setSelectedOption]     = useState('');
  const [customAnswer, setCustomAnswer]         = useState('');
  const [isThinking, setIsThinking]             = useState(false);
  const [input, setInput]                       = useState('');
  const [processingStage, setProcessingStage]   = useState('default');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [threads, setThreads]                   = useState([]);
  const [threadsLoading, setThreadsLoading]     = useState(false);

  const advisoryTypeRef = useRef(null);
  const switchingRef    = useRef(false);
  const abortRef        = useRef(null);
  const inputRef        = useRef(null);

  // ── Voice (browser-native TTS + STT) ───────────────────────────────────────
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const sttSupported = typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const voiceSupported = ttsSupported || sttSupported;

  const [autoSpeak, setAutoSpeak] = useState(() => {
    try {
      const stored = localStorage.getItem(SAIGE_AUTOSPEAK_KEY);
      return stored === null ? false : stored === 'true';
    } catch { return false; }
  });
  const [speaking,  setSpeaking]  = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [decidingProposalId, setDecidingProposalId] = useState(null);
  const [proposalsRefreshKey, setProposalsRefreshKey] = useState(0);

  const recognitionRef    = useRef(null);
  const isRecordingRef    = useRef(false);
  const liveTranscriptRef = useRef('');
  const pausedForTtsRef   = useRef(false);
  const sendMsgRef        = useRef(() => {});

  const showVoiceError = (msg) => {
    setVoiceError(msg);
    setTimeout(() => setVoiceError(null), 4000);
  };

  const stopTTS = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
    if (pausedForTtsRef.current && recognitionRef.current && isRecordingRef.current) {
      pausedForTtsRef.current = false;
      setTimeout(() => {
        try { recognitionRef.current?.start(); } catch {}
      }, 350);
    } else {
      pausedForTtsRef.current = false;
    }
  }, [ttsSupported]);

  const playTTS = useCallback((text) => {
    if (!ttsSupported) return;
    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;
    // Pause mic while we speak so Saige doesn't hear herself
    if (recognitionRef.current && isRecordingRef.current) {
      pausedForTtsRef.current = true;
      try { recognitionRef.current.stop(); } catch {}
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    // Prefer an English female voice if one is available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => /en[-_]US/i.test(v.lang) && /female|samantha|jenny|aria|zira/i.test(v.name)) ||
      voices.find(v => /en[-_]GB/i.test(v.lang) && /female|hazel|libby/i.test(v.name)) ||
      voices.find(v => /^en/i.test(v.lang));
    if (preferred) utter.voice = preferred;
    utter.onend = () => {
      setSpeaking(false);
      if (pausedForTtsRef.current && recognitionRef.current && isRecordingRef.current) {
        pausedForTtsRef.current = false;
        setTimeout(() => { try { recognitionRef.current?.start(); } catch {} }, 350);
      } else {
        pausedForTtsRef.current = false;
      }
    };
    utter.onerror = () => { setSpeaking(false); pausedForTtsRef.current = false; };
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }, [ttsSupported]);

  const setAndSaveAutoSpeak = (v) => {
    setAutoSpeak(v);
    try { localStorage.setItem(SAIGE_AUTOSPEAK_KEY, String(v)); } catch {}
    if (!v && speaking) stopTTS();
  };

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    const text = liveTranscriptRef.current.trim();
    liveTranscriptRef.current = '';
    setInput('');
    setRecording(false);
    if (text) sendMsgRef.current(text);
  }, []);

  const startRecording = useCallback(() => {
    if (recording || !sttSupported) return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      let finalText = '';
      let silenceTimer = null;
      const SILENCE_MS = 1500;

      const submitIfReady = () => {
        const text = liveTranscriptRef.current.trim();
        if (!text) return;
        liveTranscriptRef.current = '';
        finalText = '';
        setInput('');
        sendMsgRef.current(text);
      };

      rec.onresult = (e) => {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(submitIfReady, SILENCE_MS);
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
          else interim += e.results[i][0].transcript;
        }
        const combined = finalText + interim;
        liveTranscriptRef.current = combined;
        setInput(combined);
      };
      rec.onend = () => {
        if (isRecordingRef.current && !pausedForTtsRef.current) {
          try { rec.start(); } catch {}
        }
      };
      rec.onerror = (e) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        if (e.error === 'not-allowed') showVoiceError(t('saige_page.mic_denied'));
        else showVoiceError(t('saige_page.mic_error', { error: e.error }));
        stopRecording();
      };
      rec.start();
      recognitionRef.current = rec;
      isRecordingRef.current = true;
      setRecording(true);
    } catch (err) {
      showVoiceError(t('saige_page.mic_start_failed'));
    }
  }, [recording, sttSupported, stopRecording]);

  // Cleanup voice on unmount
  useEffect(() => () => {
    isRecordingRef.current = false;
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }
    if (ttsSupported) { try { window.speechSynthesis.cancel(); } catch {} }
  }, [ttsSupported]);

  useEffect(() => { if (!activeThreadId) setActiveThreadId(generateThreadId()); }, [activeThreadId]);
  useEffect(() => { if (window.innerWidth < 900) setSidebarCollapsed(true); }, []);

  // Feature-bridge: when another Saige page hands off (e.g. pest detection
  // → "Ask Saige about this"), it navigates here with ?prompt=... and we
  // prefill the input so the user can tweak before sending.
  const bridgedRef = useRef(false);
  useEffect(() => {
    if (bridgedRef.current) return;
    const incoming = searchParams.get('prompt');
    if (incoming) {
      setInput(incoming);
      bridgedRef.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeThreadId && activeChat.length > 0 && userId) {
      saveThread(userId, activeThreadId, activeChat, 'active', advisoryTypeRef.current);
    }
  }, [activeThreadId, activeChat, userId]);

  useEffect(() => {
    if (activeThreadId && userId) saveQuiz(userId, activeThreadId, quiz);
  }, [activeThreadId, quiz, userId]);

  const fetchThreads = useCallback(async () => {
    if (!userId) return;
    setThreadsLoading(true);
    const localThreads = getLocalThreads(userId);
    let apiThreads = [];
    try {
      const res = await fetch(`${SAIGE_API}/threads?user_id=${userId}`, { headers: getAuthHeaders() });
      if (res.ok) { const d = await res.json(); apiThreads = d.threads || []; }
    } catch { /* backend unavailable */ }
    setThreads(mergeThreads(apiThreads, localThreads));
    setThreadsLoading(false);
  }, [userId]);

  useEffect(() => { if (isLoggedIn && userId) fetchThreads(); }, [fetchThreads, isLoggedIn, userId]);

  async function handleSelectThread(threadId) {
    if (threadId === activeThreadId || switchingRef.current) return;
    switchingRef.current = true;
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      let messages = [];
      const cached = _msgCache.get(threadId);
      if (cached && Date.now() - cached.ts < 30000) {
        messages = cached.messages;
      } else {
        try {
          const res = await fetch(`${SAIGE_API}/threads/${threadId}/messages?user_id=${userId}`, { signal: ctrl.signal, headers: getAuthHeaders() });
          if (res.ok) {
            const d = await res.json();
            messages = (d.messages || []).map((m) => ({
              role: m.role,
              content: m.content,
              visualizations: m.metadata?.visualizations || m.visualizations || [],
            }));
            _msgCache.set(threadId, { messages, ts: Date.now() });
          }
        } catch (e) {
          if (e instanceof DOMException && e.name === 'AbortError') return;
        }
      }
      if (messages.length === 0) messages = getLocalMessages(userId, threadId);
      const savedQuiz = getLocalQuiz(userId, threadId);
      setActiveThreadId(threadId);
      setActiveChat(messages.length > 0 ? messages : [welcomeMsg]);
      setQuiz(savedQuiz);
      setSelectedOption('');
      setCustomAnswer('');
      setInput('');
    } finally {
      switchingRef.current = false;
    }
  }

  async function handleDeleteThread(threadId) {
    deleteLocalThread(userId, threadId);
    try { await fetch(`${SAIGE_API}/threads/${threadId}?user_id=${userId}`, { method: 'DELETE', headers: getAuthHeaders() }); } catch { /* ok */ }
    if (activeThreadId === threadId) {
      setActiveThreadId(generateThreadId());
      setActiveChat([welcomeMsg]);
      setQuiz(null); setSelectedOption(''); setCustomAnswer(''); setInput('');
    }
    fetchThreads();
  }

  function handleNewChat() {
    setActiveThreadId(generateThreadId());
    setActiveChat([WELCOME_MESSAGE]);
    setQuiz(null); setSelectedOption(''); setCustomAnswer(''); setInput('');
    advisoryTypeRef.current = null;
    setProcessingStage('default');
    fetchThreads();
  }

  async function decideProposal(msgIdx, proposalIdx, decision) {
    const msg = activeChat[msgIdx];
    const proposal = msg?.proposals?.[proposalIdx];
    if (!proposal || proposal._executed || proposal._dismissed) return;
    const pid = proposal.proposal_id;
    if (decision === 'reject' && !pid) {
      setActiveChat((prev) => prev.map((m, i) => (i !== msgIdx ? m : {
        ...m,
        proposals: (m.proposals || []).map((pp, j) => (j === proposalIdx ? { ...pp, _dismissed: true } : pp)),
      })));
      return;
    }
    if (!pid) {
      setActiveChat((prev) => [
        ...prev,
        { role: 'assistant', content: 'This proposal is missing an id — refresh and try again.' },
      ]);
      return;
    }
    if (decision === 'approve' && !window.confirm('Approve this Saige change?')) return;
    setDecidingProposalId(pid);
    try {
      const thread = proposal.thread_id || activeThreadId;
      let ok = false;
      const r = await fetch(`${SAIGE_API}/proposals/${pid}/decide`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ decision, thread_id: thread, edits: {} }),
      });
      if (r.ok) {
        ok = true;
      } else {
        const r2 = await fetch(`${SAIGE_API}/resume`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ thread_id: thread, decision, proposal_id: pid }),
        });
        ok = r2.ok;
        if (!ok) {
          const j = await r2.json().catch(() => ({}));
          throw new Error(j?.message || j?.detail || `HTTP ${r2.status}`);
        }
      }
      if (ok) {
        setActiveChat((prev) => {
          const next = prev.map((m, i) => (i !== msgIdx ? m : {
            ...m,
            proposals: (m.proposals || []).map((pp, j) => (
              j === proposalIdx
                ? { ...pp, _executed: decision === 'approve', _dismissed: decision === 'reject' }
                : pp
            )),
          }));
          const doneText = decision === 'approve'
            ? `Done — ${proposal.summary || 'change applied'}.`
            : 'Okay, I cancelled that change.';
          return [...next, { role: 'assistant', content: doneText }];
        });
        setProposalsRefreshKey((k) => k + 1);
      }
    } catch (e) {
      setActiveChat((prev) => [
        ...prev,
        { role: 'assistant', content: `Could not ${decision}: ${e.message || 'please try again.'}` },
      ]);
    } finally {
      setDecidingProposalId(null);
    }
  }

  function sendFeedback(rating) {
    if (!activeThreadId) return;
    fetch(`${SAIGE_API}/chat/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ thread_id: activeThreadId, rating }),
    }).catch(() => {});
  }

  async function sendMessage(val, options = {}) {
    if (!activeThreadId || !val?.trim()) return;
    const showBubble = options.showUserBubble ?? true;
    if (showBubble) setActiveChat(prev => [...prev, { role: 'user', content: val }]);
    setInput('');

    const lower = val.toLowerCase();
    let earlyStage = 'default';
    if (['weather','temperature','forecast','rain','climate'].some(w => lower.includes(w))) earlyStage = 'weather';
    else if (['cattle','cow','sheep','goat','livestock','animal','breed'].some(w => lower.includes(w))) earlyStage = 'livestock';
    else if (['crop','plant','wheat','rice','corn','tomato','guava','orange','soy'].some(w => lower.includes(w))) earlyStage = 'crops';

    setProcessingStage(earlyStage);
    setIsThinking(true);
    setQuiz(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CHAT_REQUEST_TIMEOUT_MS);
      const res = await fetch(`${SAIGE_API}/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        signal: controller.signal,
        body: JSON.stringify({
          user_input: val,
          thread_id: activeThreadId,
          user_id: userId,
          business_id: BusinessID || null,
        }),
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorMessage = await getResponseErrorMessage(res);
        setActiveChat(prev => [
          ...prev,
          { role: 'assistant', content: t('saige_page.err_server', { message: errorMessage }) },
        ]);
        return;
      }

      let parsedBody = null;
      try {
        const text = await res.text();
        parsedBody = text ? JSON.parse(text) : null;
      } catch {
        parsedBody = null;
      }
      const payload = parsedBody && typeof parsedBody === 'object' ? parsedBody : {};

      if (payload.processing_stage && payload.processing_stage !== 'default') {
        setProcessingStage(payload.processing_stage);
      }

      setSelectedOption('');
      setCustomAnswer('');

      if (payload.status === 'requires_input') {
        setQuiz(payload.ui);
      } else if (payload.status === 'complete' || payload.status === 'interrupted' || payload.status === 'success') {
        let content = '';
        if (payload.diagnosis?.trim()) {
          content = payload.diagnosis.replace(/\*\*/g, '').replace(/##\s+/g, '').replace(/\*/g, '').trim();
        } else if (payload.response?.trim()) {
          content = String(payload.response).replace(/\*\*/g, '').replace(/##\s+/g, '').replace(/\*/g, '').trim();
        }
        if (payload.recommendations?.length > 0) {
          const embedded = payload.recommendations.some(r =>
            content.toLowerCase().includes(r.toLowerCase().substring(0, 30))
          );
          if (!embedded) {
            content += '\n\nQuick Tips:\n';
            payload.recommendations.slice(0, 3).forEach(r => {
              content += `\n${r.replace(/\*\*/g, '').replace(/\*/g, '').trim()}`;
            });
          }
        }
        if (!content?.trim()) {
          content = payload.diagnosis || payload.response || t('saige_page.err_generic');
        }
        if (payload.status === 'interrupted' && !/approval|reply yes|reply \*\*yes\*\*/i.test(content)) {
          content = `${content}\n\nI've prepared change proposal(s) for your approval. Reply yes to approve or no to cancel.`.trim();
        }
        const proposals = Array.isArray(payload.proposals) ? payload.proposals : [];
        const visualizations = Array.isArray(payload.visualizations) ? payload.visualizations : [];
        advisoryTypeRef.current = payload.advisory_type || null;
        setActiveChat(prev => {
          const updated = [
            ...prev,
            {
              role: 'assistant',
              content,
              ...(proposals.length ? { proposals } : {}),
              ...(visualizations.length ? { visualizations } : {}),
            },
          ];
          saveThread(userId, activeThreadId, updated, payload.status || 'complete', payload.advisory_type || null);
          return updated;
        });
        fetchThreads();
        if (proposals.length) setProposalsRefreshKey((k) => k + 1);
        if (autoSpeak && content) playTTS(content);
      } else if (payload.status === 'error') {
        setActiveChat(prev => [...prev, { role: 'assistant', content: t('saige_page.err_server', { message: payload.message || 'Please try again.' }) }]);
      } else {
        setActiveChat(prev => [...prev, { role: 'assistant', content: t('saige_page.thanks') }]);
      }
    } catch (error) {
      const isAbort = error?.name === 'AbortError';
      const message = isAbort
        ? 'Request timed out. Saige is busy right now, please retry.'
        : (error?.message ? `${t('saige_page.err_connect')} (${error.message})` : t('saige_page.err_connect'));
      setActiveChat(prev => [...prev, { role: 'assistant', content: message }]);
    } finally {
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleSubmitQuiz() {
    const answer = customAnswer.trim() || selectedOption;
    if (!answer || !quiz) return;
    setActiveChat(prev => [...prev, { role: 'assistant', content: `${quiz.question}\n\nAnswer submitted: ${answer}` }]);
    setSelectedOption('');
    setCustomAnswer('');
    sendMessage(answer, { showUserBubble: false });
  }

  // Keep mic-callback's send fn fresh — speech callbacks fire after state
  // updates, and capturing sendMessage in a closure would go stale.
  sendMsgRef.current = sendMessage;

  if (!authChecked) return null;
  if (!isLoggedIn) return <AboutSaige />;

  return (
    <>
    <PageMeta title="Saige | Agricultural AI Assistant | OFN" noIndex />
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={userId} pageTitle={t('saige_page.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to: '/dashboard' }, { label: t('saige_page.breadcrumb') }]}>
      <div style={{
        margin: '-24px -24px calc(-24px - 3rem)',
        display: 'flex',
        flexDirection: 'column',
        // AppShell already offsets the 72px header; 180px subtracted it again and left a hole.
        height: 'calc(100dvh - 108px)',
        overflow: 'hidden',
      }}>

        <div style={{
          padding: '10px 18px', background: SAIGE_GREEN, color: '#fff',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
        }}>
          <button onClick={() => setSidebarCollapsed(p => !p)}
            style={{
              background: 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer',
              padding: '6px 10px', borderRadius: 6, color: '#fff', fontSize: 16,
              fontWeight: 700, lineHeight: 1,
            }}
            title={sidebarCollapsed ? t('saige_page.toggle_sidebar_show') : t('saige_page.toggle_sidebar_hide')}
          >☰</button>
          <img src="/images/SaigeAIIcon.webp" alt="Saige" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.4)' }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: SAIGE_FONT_HEAD, fontWeight: 700, fontSize: 17, lineHeight: 1.1, color: '#fff' }}>Saige</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: SAIGE_FONT_BODY }}>
              {t('saige_page.subtitle')}
            </div>
          </div>
          {ttsSupported && (
            <button
              onClick={() => setAndSaveAutoSpeak(!autoSpeak)}
              title={autoSpeak ? t('saige_page.autospeak_on_title') : t('saige_page.autospeak_off_title')}
              style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 999,
                background: autoSpeak ? '#fff' : 'rgba(255,255,255,0.18)',
                color: autoSpeak ? SAIGE_GREEN_DARK : '#fff',
                border: '1px solid ' + (autoSpeak ? '#fff' : 'rgba(255,255,255,0.35)'),
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: SAIGE_FONT_BODY,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 13 }}>{autoSpeak ? '🔊' : '🔇'}</span>
              <span>{autoSpeak ? t('saige_page.autospeak_on') : t('saige_page.autospeak_off')}</span>
            </button>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: SAIGE_PANEL_BG }}>
          <ChatSidebar
            threads={threads}
            activeThreadId={activeThreadId}
            isCollapsed={sidebarCollapsed}
            isLoading={threadsLoading}
            onToggle={() => setSidebarCollapsed(p => !p)}
            onSelect={handleSelectThread}
            onDelete={handleDeleteThread}
            onNewChat={handleNewChat}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 8px' }}>
              {isLoggedIn && (
                <div style={{ maxWidth: 800, margin: '0 auto 16px' }}>
                  <SaigeDraftsPanel businessId={BusinessID ? Number(BusinessID) : 0} />
                  <SaigeProposalsPanel
                    key={proposalsRefreshKey}
                    businessId={BusinessID ? Number(BusinessID) : 0}
                    threadId={activeThreadId || ''}
                    onChange={() => setProposalsRefreshKey((k) => k + 1)}
                  />
                </div>
              )}
              {isLoggedIn && activeChat.length <= 1 && (
                <div style={{ maxWidth: 800, margin: '0 auto 16px' }}>
                  <SaigeFieldsCard />
                </div>
              )}
              {activeChat.length <= 1 && (
                <div style={{ maxWidth: 800, margin: '0 auto 16px' }}>
                  <MarketIntelligenceWidget />
                  <FieldHealthWidget />
                </div>
              )}
              {import.meta.env.DEV && searchParams.get('vizdev') === '1' && (
                <VizPlayground />
              )}
              {activeChat.map((msg, i) => (
                <ChatBubble
                  key={i}
                  message={msg}
                  voiceSupported={ttsSupported}
                  onSpeak={playTTS}
                  decidingProposalId={decidingProposalId}
                  onDecideProposal={msg.role === 'assistant'
                    ? (pi, decision) => decideProposal(i, pi, decision)
                    : undefined}
                  onFeedback={msg.role === 'assistant' ? sendFeedback : undefined}
                />
              ))}
              {isThinking && <ThinkingDots stage={processingStage} />}
              {quiz && !isThinking && (
                <QuizCard
                  quiz={quiz}
                  selectedOption={selectedOption}
                  customAnswer={customAnswer}
                  onOptionChange={setSelectedOption}
                  onCustomChange={setCustomAnswer}
                  onSubmit={handleSubmitQuiz}
                />
              )}
            </div>

            {speaking && (
              <div style={{
                padding: '8px 20px', borderTop: `1px solid ${SAIGE_BORDER}`, background: SAIGE_LIGHT,
                display: 'flex', justifyContent: 'center',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 14px', borderRadius: 999,
                  background: '#fff', border: `1px solid ${SAIGE_GREEN}`,
                  color: SAIGE_GREEN_DARK, fontSize: 12, fontWeight: 600,
                  fontFamily: SAIGE_FONT_BODY,
                }}>
                  <span style={{ display: 'inline-flex', gap: 3, alignItems: 'flex-end', height: 14 }}>
                    <span style={{ display: 'inline-block', width: 3, height: 4, background: SAIGE_GREEN, borderRadius: 2, animation: 'saige-wave 1s ease-in-out infinite', animationDelay: '0s' }} />
                    <span style={{ display: 'inline-block', width: 3, height: 4, background: SAIGE_GREEN, borderRadius: 2, animation: 'saige-wave 1s ease-in-out infinite', animationDelay: '0.15s' }} />
                    <span style={{ display: 'inline-block', width: 3, height: 4, background: SAIGE_GREEN, borderRadius: 2, animation: 'saige-wave 1s ease-in-out infinite', animationDelay: '0.3s' }} />
                  </span>
                  {t('saige_page.speaking')}
                  <button onClick={stopTTS} style={{
                    marginLeft: 6, padding: '3px 10px', borderRadius: 999,
                    background: SAIGE_GREEN, border: `1px solid ${SAIGE_GREEN_DARK}`,
                    color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    fontFamily: SAIGE_FONT_BODY,
                  }}>{t('saige_page.btn_stop')}</button>
                </div>
              </div>
            )}

            {!quiz && !isThinking && (
              <div style={{ padding: '12px 20px 16px', borderTop: `1px solid ${SAIGE_BORDER}`, background: '#fff', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 10, maxWidth: 800, margin: '0 auto', alignItems: 'center' }}>
                  {sttSupported && (
                    <button
                      onClick={() => (recording ? stopRecording() : startRecording())}
                      title={recording ? t('saige_page.mic_stop_title') : t('saige_page.mic_start_title')}
                      style={{
                        width: 42, height: 42, flexShrink: 0,
                        borderRadius: '50%', border: 'none', cursor: 'pointer',
                        background: recording
                          ? 'linear-gradient(135deg,#ef4444,#b91c1c)'
                          : SAIGE_LIGHT,
                        color: recording ? 'white' : SAIGE_GREEN_DARK,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, transition: 'all 0.15s',
                        animation: recording ? 'saige-rec-pulse 1.4s ease-in-out infinite' : 'none',
                        boxShadow: recording ? 'none' : `inset 0 0 0 1px ${SAIGE_BORDER}`,
                      }}
                    >
                      {recording ? '■' : '🎤'}
                    </button>
                  )}
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && input.trim()) sendMessage(input); }}
                    placeholder={recording ? t('saige_page.input_listening') : t('saige_page.input_placeholder')}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10,
                      background: '#fff',
                      border: '1px solid ' + (recording ? '#ef4444' : '#d1d5db'),
                      color: SAIGE_TEXT, fontSize: 13.5, outline: 'none',
                      fontFamily: SAIGE_FONT_BODY,
                    }}
                  />
                  <button
                    onClick={() => input.trim() && sendMessage(input)}
                    disabled={!input.trim()}
                    style={{
                      padding: '10px 18px', borderRadius: 10, border: 'none',
                      background: input.trim() ? SAIGE_GREEN : '#e5e7eb',
                      color: input.trim() ? 'white' : '#9ca3af',
                      cursor: input.trim() ? 'pointer' : 'not-allowed',
                      fontWeight: 600, fontSize: 13.5, transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: SAIGE_FONT_BODY,
                    }}
                    onMouseEnter={e => { if (input.trim()) e.currentTarget.style.background = SAIGE_GREEN_DARK; }}
                    onMouseLeave={e => { if (input.trim()) e.currentTarget.style.background = SAIGE_GREEN; }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {t('saige_page.btn_send')}
                  </button>
                </div>
              </div>
            )}

            {voiceError && (
              <div style={{
                position: 'absolute', bottom: 88, left: '50%', transform: 'translateX(-50%)',
                padding: '8px 16px', borderRadius: 8,
                background: '#fee2e2', color: '#991b1b',
                border: '1px solid #fca5a5', fontSize: 12, fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10,
                fontFamily: SAIGE_FONT_BODY,
              }}>
                {voiceError}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes saige-spin { 100% { transform: rotate(360deg); } }
        @keyframes saige-wave {
          0%, 100% { height: 4px; }
          50%      { height: 14px; }
        }
        @keyframes saige-rec-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.55); }
          50%      { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        .saige-msg:hover .saige-speak { opacity: 1 !important; }
      `}</style>
    </AccountLayout>
    </>
  );
}