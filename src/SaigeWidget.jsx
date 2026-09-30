/**
 * SaigeWidget — floating Saige chat bubble with voice (STT + TTS).
 *
 * Mount on any page:
 *   <SaigeWidget businessId={BusinessID} pageContext="Herd Health" />
 *
 * Bottom-right launcher icon opens a popup.
 * Expand (⤡) navigates to the full /saige page which has the chat history sidebar.
 * Voice: mic button for speech-to-text, 🔊 per-bubble for text-to-speech,
 *        auto-speak toggle in the header.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AgentBadge from './AgentBadge';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import { useLanguage } from './LanguageContext';
import { PRECISION_AG_ONLY } from './precisionAgMode';
import VizRenderer from './saige-viz/VizRenderer';
import VizSkeleton from './saige-viz/VizSkeleton';

function normalizeSaigeApiBase(rawValue) {
  // Base URL already includes the /saige prefix (unified local backend mounts
  // Saige at /saige; prod points at the standalone saige-backend root). Only
  // trim trailing slashes — do NOT strip /saige, or the unified backend 404/405s.
  const value = (rawValue || 'http://localhost:8000/saige').trim();
  if (!value) return 'http://localhost:8000/saige';
  return value.replace(/\/+$/, '');
}

const SAIGE_API   = normalizeSaigeApiBase(import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige');
const SAIGE_GREEN = '#3D6B34';
const SAIGE_DARK  = '#2c4f25';
const SAIGE_LIGHT = '#f0f7ee';
const SAIGE_BORDER = '#c7dfc2';
const FONT_BODY   = 'Montserrat, system-ui, sans-serif';
const AUTOSPEAK_KEY = 'saige_widget_autospeak';

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getPeopleId() {
  return localStorage.getItem('people_id') || localStorage.getItem('PeopleID') || '';
}

// Strip markdown so TTS doesn't read "asterisk asterisk bold".
function cleanForSpeech(text) {
  return (text || '')
    .replace(/```[\s\S]*?```/g, ' code block. ')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/[•▪–—]/g, ',')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .substring(0, 2000);
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({
  role,
  content,
  ttsSupported,
  onSpeak,
  threadId,
  onFeedback,
  proposals,
  visualizations,
  onDecideProposal,
  decidingProposalId,
}) {
  const isUser = role === 'user';
  const [voted, setVoted] = React.useState(null); // null | 'up' | 'down'
  const vizSpecs = !isUser && Array.isArray(visualizations)
    ? visualizations.slice(0, 2)
    : [];
  const mapViz = vizSpecs.filter((v) => v && (v.type === 'farm_map' || v.type === 'field_map' || v.type === 'heatmap'));
  const cardViz = vizSpecs.filter((v) => v && v.type !== 'farm_map' && v.type !== 'field_map' && v.type !== 'heatmap');
  const hasViz = vizSpecs.length > 0;

  function handleFeedback(rating) {
    if (voted) return;
    setVoted(rating > 0 ? 'up' : 'down');
    onFeedback && onFeedback(rating);
  }

  const pending = Array.isArray(proposals)
    ? proposals.filter((p) => p && !p._dismissed && !p._executed && String(p.tool || '').toLowerCase() !== 'save_plan')
    : [];

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          marginRight: 6, marginTop: 2, background: SAIGE_GREEN,
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="/images/SaigeAIIcon.webp" alt="" style={{ width: 26, height: 26, objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ position: 'relative', maxWidth: hasViz ? '90%' : '82%' }}>
        <div style={{
          padding: '8px 12px',
          paddingRight: !isUser && ttsSupported ? '28px' : '12px',
          borderRadius: 12,
          fontSize: 13.5,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontFamily: FONT_BODY,
          background: isUser ? SAIGE_GREEN : SAIGE_LIGHT,
          color: isUser ? '#fff' : '#111827',
          border: isUser ? 'none' : `1px solid ${SAIGE_BORDER}`,
        }}>
          {content}
          {!isUser && cardViz.map((v) => (
            <div key={v.id || v.title} style={{ marginTop: 8 }}>
              <VizRenderer spec={v} />
            </div>
          ))}
          {!isUser && Array.isArray(proposals) && proposals.map((p, pi) => {
            if (!p || p._dismissed) return null;
            if (String(p.tool || '').toLowerCase() === 'save_plan') return null;
            const pid = p.proposal_id || `local-${pi}`;
            return (
              <div
                key={pid}
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 8,
                  border: `1px solid ${SAIGE_BORDER}`,
                  background: '#fff',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: SAIGE_DARK, marginBottom: 4 }}>
                  {p._executed ? 'Done' : 'Approve this change?'}
                </div>
                <div style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>
                  {p.summary || `${p.tool || 'action'} proposed`}
                </div>
                {!p._executed && (
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      disabled={decidingProposalId === pid}
                      onClick={() => onDecideProposal && onDecideProposal(pi, 'reject')}
                      style={{
                        fontSize: 11, padding: '4px 8px', borderRadius: 6,
                        border: '1px solid #fecaca', background: '#fff', color: '#b91c1c',
                        cursor: 'pointer', fontWeight: 600,
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={decidingProposalId === pid}
                      onClick={() => onDecideProposal && onDecideProposal(pi, 'approve')}
                      style={{
                        fontSize: 11, padding: '4px 8px', borderRadius: 6,
                        border: 'none', background: SAIGE_GREEN, color: '#fff',
                        cursor: 'pointer', fontWeight: 600,
                      }}
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!isUser && content && ttsSupported && (
          <button
            onClick={() => onSpeak(content)}
            title="Read aloud"
            style={{
              position: 'absolute', top: 5, right: 5,
              background: 'transparent', border: 'none',
              color: SAIGE_GREEN, fontSize: 12, cursor: 'pointer',
              padding: '2px 3px', lineHeight: 1,
            }}
          >🔊</button>
        )}
        {!isUser && content && (
          <div style={{ display: 'flex', gap: 4, marginTop: 3, justifyContent: 'flex-end' }}>
            <button
              onClick={() => handleFeedback(1)}
              title="Helpful"
              style={{
                background: 'none', border: 'none', cursor: voted ? 'default' : 'pointer',
                fontSize: 13, lineHeight: 1, padding: '1px 3px', opacity: voted === 'down' ? 0.3 : 1,
                color: voted === 'up' ? SAIGE_GREEN : '#9ca3af',
              }}
            >👍</button>
            <button
              onClick={() => handleFeedback(-1)}
              title="Not helpful"
              style={{
                background: 'none', border: 'none', cursor: voted ? 'default' : 'pointer',
                fontSize: 13, lineHeight: 1, padding: '1px 3px', opacity: voted === 'up' ? 0.3 : 1,
                color: voted === 'down' ? '#dc2626' : '#9ca3af',
              }}
            >👎</button>
          </div>
        )}
        {!isUser && pending.length > 0 && (
          <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
            Pending action{pending.length > 1 ? 's' : ''} need your approval
          </div>
        )}
        {!isUser && mapViz.map((v) => (
          <div key={v.id || v.title} style={{ marginTop: 8, width: '100%' }}>
            <VizRenderer spec={v} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Quick prompts ─────────────────────────────────────────────────────────────
function quickPrompts(ctx) {
  const c = (ctx || '').toLowerCase();
  if (c.includes('herd health') || c.includes('herd') || c.includes('livestock')) {
    return [
      'Any withdrawal alerts?',
      'Vaccinations overdue?',
      'Animals in quarantine?',
      'Medication inventory low?',
      'When are my next animals due to calve?',
    ];
  }
  if (c.includes('precision') || c.includes('field') || c.includes('crop')) {
    return ['Check my fields', 'Any pest alerts?', 'Irrigation needed?', 'Crop benchmark'];
  }
  return ['Livestock health tips', 'Crop advice', 'Weather impacts', 'Ask anything'];
}

const chipStyle = {
  background: SAIGE_LIGHT,
  color: SAIGE_GREEN,
  border: `1px solid ${SAIGE_BORDER}`,
  borderRadius: 999,
  padding: '3px 10px',
  fontSize: 11,
  fontFamily: FONT_BODY,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const hdrBtn = {
  background: 'rgba(255,255,255,0.18)',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '4px 9px',
  fontSize: 13,
  cursor: 'pointer',
  fontWeight: 700,
  lineHeight: 1,
  fontFamily: FONT_BODY,
};

// ── Parse + fire MAP_CMD embedded in Saige's reply ────────────────────────────
function extractMapCmd(text) {
  const m = (text || '').match(/\[MAP_CMD:\s*([^\]]+)\]/);
  if (!m) return text;
  const params = {};
  m[1].trim().split(/\s+/).forEach(part => {
    const eq = part.indexOf('=');
    if (eq > -1) {
      const k = part.slice(0, eq);
      const v = part.slice(eq + 1).replace(/^"|"$/g, '');
      params[k] = isNaN(v) ? v : parseFloat(v);
    }
  });
  if (params.lat && params.lon) {
    window.dispatchEvent(new CustomEvent('saige:map-command', {
      detail: { action: params.action || 'flyTo', lat: params.lat, lon: params.lon, zoom: params.zoom || 12 },
    }));
  }
  return text.replace(/\[MAP_CMD:[^\]]+\]/g, '').trim();
}

// ── Chat panel ────────────────────────────────────────────────────────────────
function ChatPanel({ businessId, fieldId, pageContext, language, onClose, onFullPage, messages, setMessages, ttsBackendOkRef }) {
  const [input, setInput]       = useState('');
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState('');
  const [imageData, setImageData]       = useState(null);   // base64 payload (no prefix)
  const [imagePreview, setImagePreview] = useState(null);   // data URL for thumbnail
  const imgInputRef = useRef(null);
  const [threadId]              = useState(() => {
    const pid = getPeopleId();
    const k = `saige_widget_thread_${pid}_${businessId || 0}`;
    const stored = localStorage.getItem(k);
    if (stored) return stored;
    const newTid = `saige_w_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(k, newTid);
    return newTid;
  });

  // ── Voice state ──────────────────────────────────────────────────────────────
  const ttsSupported = typeof window !== 'undefined' && typeof Audio !== 'undefined';
  const sttSupported = typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [autoSpeak, setAutoSpeak] = useState(() => {
    try { const s = localStorage.getItem(AUTOSPEAK_KEY); return s === null ? true : s === 'true'; } catch { return true; }
  });
  const [speaking,  setSpeaking]  = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceErr,  setVoiceErr]  = useState(null);
  const [decidingProposalId, setDecidingProposalId] = useState(null);

  const recRef        = useRef(null);
  const isRecRef      = useRef(false);
  const transcriptRef = useRef('');
  const pausedTtsRef  = useRef(false);
  const sendRef       = useRef(() => {});
  const audioRef      = useRef(null);

  const showVoiceErr = (msg) => { setVoiceErr(msg); setTimeout(() => setVoiceErr(null), 4000); };

  const onImageSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setImagePreview(dataUrl);
      // Strip the "data:<mime>;base64," prefix to get only the base64 payload
      setImageData(dataUrl.split(',')[1] || null);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected if cleared
    e.target.value = '';
  }, []);

  const clearImage = useCallback(() => {
    setImageData(null);
    setImagePreview(null);
  }, []);

  const sendFeedback = useCallback((rating) => {
    fetch(`${SAIGE_API}/chat/feedback`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ thread_id: threadId, rating }),
    }).catch(() => {}); // fire-and-forget; silently ignore errors
  }, [threadId]);

  const _resumeMicAfterTts = useCallback(() => {
    if (pausedTtsRef.current && recRef.current && isRecRef.current) {
      pausedTtsRef.current = false;
      setTimeout(() => { try { recRef.current?.start(); } catch {} }, 350);
    } else {
      pausedTtsRef.current = false;
    }
  }, []);

  const stopTTS = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current._objectUrl) URL.revokeObjectURL(audioRef.current._objectUrl);
      audioRef.current = null;
    }
    try { window.speechSynthesis?.cancel(); } catch {}
    setSpeaking(false);
    _resumeMicAfterTts();
  }, [_resumeMicAfterTts]);

  const _playViaSpeechSynthesis = useCallback((cleaned) => {
    if (!window.speechSynthesis) { setSpeaking(false); pausedTtsRef.current = false; return; }

    const _speak = (voices) => {
      const utt = new SpeechSynthesisUtterance(cleaned);
      const savedVoice = localStorage.getItem('lavendir_tts_voice');
      let voice = savedVoice ? (voices.find(v => v.name === savedVoice) || null) : null;
      if (!voice) {
        voice =
          voices.find(v => v.name === 'Google US English') ||
          voices.find(v => /google/i.test(v.name) && /female/i.test(v.name) && v.lang.startsWith('en')) ||
          voices.find(v => /google/i.test(v.name) && v.lang === 'en-US') ||
          voices.find(v => /google/i.test(v.name) && v.lang.startsWith('en')) ||
          voices.find(v => v.lang.startsWith('en') && /female/i.test(v.name)) ||
          null;
      }
      if (voice) utt.voice = voice;
      utt.lang = 'en-US';
      utt.rate = 1.0;
      utt.onend  = () => { setSpeaking(false); _resumeMicAfterTts(); };
      utt.onerror = () => { setSpeaking(false); pausedTtsRef.current = false; };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      _speak(voices);
    } else {
      // Chrome loads voices asynchronously — wait for them, fall back after 1 s
      let done = false;
      const onLoaded = () => {
        if (done) return;
        done = true;
        window.speechSynthesis.onvoiceschanged = null;
        _speak(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.onvoiceschanged = onLoaded;
      setTimeout(() => { if (!done) { done = true; window.speechSynthesis.onvoiceschanged = null; _speak([]); } }, 1000);
    }
  }, [_resumeMicAfterTts]);

  const playTTS = useCallback(async (text) => {
    if (!ttsSupported) return;
    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;
    if (recRef.current && isRecRef.current) {
      pausedTtsRef.current = true;
      try { recRef.current.stop(); } catch {}
    }
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current._objectUrl) URL.revokeObjectURL(audioRef.current._objectUrl);
      audioRef.current = null;
    }
    try { window.speechSynthesis?.cancel(); } catch {}
    setSpeaking(true);

    // ── Backend TTS (skip if already known to be unavailable this session) ───
    if (ttsBackendOkRef && ttsBackendOkRef.current !== false) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000); // 4 s hard limit
      try {
        const res = await fetch(`${SAIGE_API}/tts`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ text: cleaned }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`TTS ${res.status}`);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const audio = new Audio(objectUrl);
        const savedSpk = localStorage.getItem('lavendir_spk_device_id');
        if (savedSpk && typeof audio.setSinkId === 'function') {
          try { await audio.setSinkId(savedSpk); } catch {}
        }
        audio._objectUrl = objectUrl;
        audioRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(objectUrl);
          audioRef.current = null;
          setSpeaking(false);
          _resumeMicAfterTts();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          audioRef.current = null;
          if (ttsBackendOkRef) ttsBackendOkRef.current = false;
          _playViaSpeechSynthesis(cleaned);
        };
        await audio.play();
        if (ttsBackendOkRef) ttsBackendOkRef.current = true;
        return;
      } catch (e) {
        clearTimeout(timer);
        if (ttsBackendOkRef) ttsBackendOkRef.current = false;
        console.warn('[TTS] Backend unavailable — switching to speechSynthesis for this session:', e.message);
      }
    }

    // ── Instant fallback: browser speechSynthesis ─────────────────────────────
    _playViaSpeechSynthesis(cleaned);
  }, [ttsSupported, ttsBackendOkRef, _resumeMicAfterTts, _playViaSpeechSynthesis]);

  const saveAutoSpeak = (v) => {
    setAutoSpeak(v);
    try { localStorage.setItem(AUTOSPEAK_KEY, String(v)); } catch {}
    if (!v && speaking) stopTTS();
  };

  const stopRecording = useCallback(() => {
    isRecRef.current = false;
    if (recRef.current) { try { recRef.current.stop(); } catch {} recRef.current = null; }
    const text = transcriptRef.current.trim();
    transcriptRef.current = '';
    setInput('');
    setRecording(false);
    if (text) sendRef.current(text);
  }, []);

  const startRecording = useCallback(() => {
    if (recording || !sttSupported) return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    try {
      const rec = new SpeechRec();
      rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';
      let finalText = '';
      let silenceTimer = null;
      const submitIfReady = () => {
        const text = transcriptRef.current.trim();
        if (!text) return;
        transcriptRef.current = ''; finalText = '';
        setInput('');
        sendRef.current(text);
      };
      rec.onresult = (e) => {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(submitIfReady, 1500);
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
          else interim += e.results[i][0].transcript;
        }
        const combined = finalText + interim;
        transcriptRef.current = combined;
        setInput(combined);
      };
      rec.onend = () => { if (isRecRef.current && !pausedTtsRef.current) { try { rec.start(); } catch {} } };
      rec.onerror = (e) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        if (e.error === 'not-allowed') showVoiceErr('Microphone access denied. Check browser permissions.');
        else showVoiceErr(`Mic error: ${e.error}`);
        stopRecording();
      };
      rec.start();
      recRef.current = rec;
      isRecRef.current = true;
      setRecording(true);
    } catch { showVoiceErr('Could not start microphone.'); }
  }, [recording, sttSupported, stopRecording]);

  useEffect(() => () => {
    isRecRef.current = false;
    if (recRef.current) { try { recRef.current.stop(); } catch {} }
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      if (audioRef.current._objectUrl) { try { URL.revokeObjectURL(audioRef.current._objectUrl); } catch {} }
    }
  }, []);

  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const decideProposal = useCallback(async (msgIdx, proposalIdx, decision) => {
    const msg = messages[msgIdx];
    const proposal = msg?.proposals?.[proposalIdx];
    if (!proposal || proposal._executed || proposal._dismissed) return;
    const pid = proposal.proposal_id;
    if (decision === 'reject' && !pid) {
      setMessages((prev) => prev.map((m, i) => (i !== msgIdx ? m : {
        ...m,
        proposals: (m.proposals || []).map((pp, j) => (j === proposalIdx ? { ...pp, _dismissed: true } : pp)),
      })));
      return;
    }
    if (!pid) {
      setError('This proposal is missing an id — refresh and try again.');
      return;
    }
    if (decision === 'approve' && !window.confirm('Approve this Saige change?')) return;
    setDecidingProposalId(pid);
    setError('');
    try {
      const thread = proposal.thread_id || threadId;
      let ok = false;
      const r = await fetch(`${SAIGE_API}/proposals/${pid}/decide`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ decision, thread_id: thread, edits: {} }),
      });
      if (r.ok) {
        ok = true;
      } else {
        const r2 = await fetch(`${SAIGE_API}/resume`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ thread_id: thread, decision, proposal_id: pid }),
        });
        ok = r2.ok;
        if (!ok) {
          const j = await r2.json().catch(() => ({}));
          throw new Error(j?.message || j?.detail || `HTTP ${r2.status}`);
        }
      }
      if (ok) {
        setMessages((prev) => {
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
      }
    } catch (e) {
      setError(e.message || `Could not ${decision}`);
    } finally {
      setDecidingProposalId(null);
    }
  }, [messages, setMessages, threadId]);

  const send = useCallback(async (text) => {
    const val = (text || input).trim();
    if (!val || sending) return;
    setError('');
    const fieldHint = fieldId ? `[Field #${fieldId}]` : '';
    const pageHint  = pageContext ? `[Page: ${pageContext}]` : '';
    const userInput = [fieldHint, pageHint, val].filter(Boolean).join(' ').trim();
    const capturedImage = imageData;  // capture before clearing
    const body = JSON.stringify({
      user_input: userInput,
      thread_id: threadId,
      business_id: businessId ? String(businessId) : null,
      field_id: fieldId ? String(fieldId) : null,
      language: language || 'en',
      ...(capturedImage ? { image_data: capturedImage } : {}),
    });
    clearImage();

    const nextMsgs = [...messages, { role: 'user', content: val }];
    setMessages(nextMsgs);
    setInput('');
    setSending(true);

    // ── Try streaming endpoint first ─────────────────────────────────────────
    let streamOk = false;
    try {
      const res = await fetch(`${SAIGE_API}/chat/stream`, {
        method: 'POST',
        headers: authHeaders(),
        body,
      });
      if (res.ok && res.body) {
        streamOk = true;
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let partial = '';
        let streamedReply = '';
        // Insert a placeholder assistant bubble; we'll update it token-by-token
        setMessages([...nextMsgs, { role: 'assistant', content: '' }]);

        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          partial += decoder.decode(value, { stream: true });
          const lines = partial.split('\n');
          partial = lines.pop();
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            let evt;
            try { evt = JSON.parse(line.slice(6)); } catch { continue; }
            if (evt.type === 'token') {
              streamedReply += evt.content;
              setMessages(prev => {
                const upd = [...prev];
                upd[upd.length - 1] = { role: 'assistant', content: streamedReply };
                return upd;
              });
            } else if (evt.type === 'done') {
              // Fire map command from diagnosis (LLM text doesn't echo [MAP_CMD])
              if (evt.diagnosis) extractMapCmd(evt.diagnosis);
              const cleaned = extractMapCmd(
                streamedReply.replace(/\*\*/g, '').replace(/##\s+/g, '').replace(/\*/g, '').trim()
              );
              // If no tokens were streamed (e.g. all iterations consumed by tool calls),
              // fall back to the text portion of the server diagnosis (before any MAP_CMD).
              const diagText = evt.diagnosis
                ? extractMapCmd(evt.diagnosis.replace(/\*\*/g, '').replace(/\*/g, '').trim())
                : '';
              let finalReply = cleaned || diagText || 'No response received.';
              if (evt.status === 'interrupted' && !/approval|reply yes|reply \*\*yes\*\*/i.test(finalReply)) {
                finalReply = `${finalReply}\n\nI've prepared change proposal(s) for your approval. Reply yes to approve or no to cancel.`.trim();
              }
              const proposals = Array.isArray(evt.proposals) ? evt.proposals : [];
              const visualizations = Array.isArray(evt.visualizations) ? evt.visualizations : [];
              setMessages(prev => {
                const upd = [...prev];
                upd[upd.length - 1] = {
                  role: 'assistant',
                  content: finalReply,
                  ...(proposals.length ? { proposals } : {}),
                  ...(visualizations.length ? { visualizations } : {}),
                };
                return upd;
              });
              if (autoSpeak && finalReply) playTTS(finalReply);
              break outer;
            }
          }
        }
      }
    } catch (_streamErr) {
      // Fall through to non-streaming fallback
      streamOk = false;
    }

    // ── Fallback: non-streaming /chat ────────────────────────────────────────
    if (!streamOk) {
      try {
        const res = await fetch(`${SAIGE_API}/chat`, {
          method: 'POST',
          headers: authHeaders(),
          body,
        });
        if (!res.ok) throw new Error(`Server error (${res.status})`);
        let parsedBody = null;
        try {
          const bodyText = await res.text();
          parsedBody = bodyText ? JSON.parse(bodyText) : null;
        } catch {
          parsedBody = null;
        }
        const data = parsedBody && typeof parsedBody === 'object' ? parsedBody : {};
        let reply = '';
        if (data.status === 'complete') {
          reply = (data.diagnosis || '').replace(/\*\*/g, '').replace(/##\s+/g, '').replace(/\*/g, '').trim();
          if (data.recommendations?.length > 0 && !data.recommendations.every(r => reply.includes(r.slice(0, 30)))) {
            reply += '\n\n' + data.recommendations.map(r => `• ${r}`).join('\n');
          }
        } else if (data.status === 'requires_input') {
          const q = (data.ui?.question || '').trim();
          const opts = Array.isArray(data.ui?.options) ? data.ui.options : [];
          reply = q;
          if (opts.length > 0) reply += '\n\n' + opts.map(o => `• ${o}`).join('\n');
        } else if (data.status === 'error') {
          reply = data.message || 'Something went wrong. Please try again.';
        } else if (data.status === 'interrupted') {
          reply = data.diagnosis || data.response || 'Action requires your approval.';
        } else {
          reply = data.diagnosis || data.response || 'No response received.';
        }
        reply = extractMapCmd(reply);
        const finalReply = reply || 'No response received.';
        const proposals = Array.isArray(data.proposals) ? data.proposals : [];
        const visualizations = Array.isArray(data.visualizations) ? data.visualizations : [];
        setMessages([...nextMsgs, {
          role: 'assistant',
          content: finalReply,
          ...(proposals.length ? { proposals } : {}),
          ...(visualizations.length ? { visualizations } : {}),
        }]);
        if (autoSpeak) playTTS(finalReply);
      } catch (e) {
        setError(e.message);
        setMessages([...nextMsgs, { role: 'assistant', content: `Error: ${e.message}` }]);
      }
    }

    setSending(false);
  }, [input, imageData, clearImage, messages, sending, threadId, businessId, fieldId, pageContext, language, autoSpeak, playTTS]);

  sendRef.current = send;

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const prompts = quickPrompts(pageContext);

  return (
    <div style={{
      position: 'fixed',
      bottom: 90,
      right: 20,
      width: 'min(390px, 94vw)',
      height: 'min(560px, 80vh)',
      zIndex: 9999,
      borderRadius: 16,
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 12px 44px -8px rgba(0,0,0,0.32)',
      border: `1px solid ${SAIGE_BORDER}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: SAIGE_GREEN,
        color: '#fff',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        flexShrink: 0,
      }}>
        <img src="/images/SaigeAIIcon.webp" alt="Saige" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Lora, serif' }}>Saige</div>
          <div style={{ fontSize: 10, opacity: 0.85, fontFamily: FONT_BODY }}>AI Livestock & Farm Assistant</div>
        </div>
        {/* Auto-speak toggle */}
        {ttsSupported && (
          <button
            onClick={() => saveAutoSpeak(!autoSpeak)}
            title={autoSpeak ? 'Auto-speak on — click to mute' : 'Auto-speak off — click to enable'}
            style={{ ...hdrBtn, background: autoSpeak ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.18)', color: autoSpeak ? SAIGE_DARK : '#fff', padding: '4px 7px', fontSize: 12 }}
          >
            {autoSpeak ? '🔊' : '🔇'}
          </button>
        )}
        {/* Open full page */}
        <button
          onClick={onFullPage}
          title="Open full Saige (with chat history)"
          style={hdrBtn}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
        <button onClick={onClose} style={hdrBtn} title="Close">×</button>
      </div>

      {/* Speaking indicator */}
      {speaking && (
        <div style={{
          background: SAIGE_LIGHT, borderBottom: `1px solid ${SAIGE_BORDER}`,
          padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11, fontFamily: FONT_BODY, color: SAIGE_DARK,
        }}>
          <span style={{ display: 'inline-flex', gap: 2, alignItems: 'flex-end', height: 12 }}>
            {[0, 0.15, 0.3].map((d, i) => (
              <span key={i} style={{ display: 'inline-block', width: 2.5, height: 4, background: SAIGE_GREEN, borderRadius: 2, animation: 'saige-wave 1s ease-in-out infinite', animationDelay: `${d}s` }} />
            ))}
          </span>
          <span>Speaking…</span>
          <button onClick={stopTTS} style={{ marginLeft: 4, padding: '2px 8px', borderRadius: 999, background: SAIGE_GREEN, border: 'none', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Stop</button>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, padding: '12px 12px 8px', overflowY: 'auto', background: '#fafdf9' }}>
        {messages.length === 0 && (
          <div style={{ fontSize: 13, color: '#4b5563', padding: '8px 4px', lineHeight: 1.65, fontFamily: FONT_BODY }}>
            Hey there! I'm Saige. Whether y'all need help with crop decisions, livestock health, soil, weather, or sourcing local ingredients — I'm here for it. What's going on with your farm today?
          </div>
        )}
        {messages.map((m, i) => (
          <Bubble
            key={i}
            role={m.role}
            content={m.content}
            ttsSupported={ttsSupported}
            onSpeak={playTTS}
            onFeedback={m.role === 'assistant' ? sendFeedback : undefined}
            proposals={m.proposals}
            visualizations={m.visualizations}
            decidingProposalId={decidingProposalId}
            onDecideProposal={m.role === 'assistant'
              ? (pi, decision) => decideProposal(i, pi, decision)
              : undefined}
          />
        ))}
        {sending && (
          <div style={{ padding: '4px 0' }}>
            <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic', fontFamily: FONT_BODY }}>
              Saige is thinking…
            </div>
            <div style={{ marginTop: 8 }}>
              <VizSkeleton />
            </div>
          </div>
        )}
        {error && <div style={{ fontSize: 11, color: '#991b1b', marginTop: 4 }}>{error}</div>}
      </div>

      {/* Quick prompts — shown until first message */}
      {messages.length === 0 && (
        <div style={{ padding: '4px 10px 6px', display: 'flex', flexWrap: 'wrap', gap: 5, flexShrink: 0, borderTop: `1px solid #e5f0e2` }}>
          {prompts.map(p => (
            <button key={p} onClick={() => send(p)} style={chipStyle}>{p}</button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div style={{ padding: '8px 10px 10px', borderTop: '1px solid #e5e7eb', background: '#fff', flexShrink: 0 }}>
        {/* Image preview strip */}
        {imagePreview && (
          <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <img
              src={imagePreview}
              alt="attached"
              style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, border: `1px solid ${SAIGE_BORDER}` }}
            />
            <span style={{ fontSize: 11, color: '#6b7280', fontFamily: FONT_BODY, flex: 1 }}>Image attached</span>
            <button
              onClick={clearImage}
              title="Remove image"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 15, lineHeight: 1 }}
            >×</button>
          </div>
        )}
        {/* Hidden file input */}
        <input
          ref={imgInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onImageSelect}
        />
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {sttSupported && (
            <button
              onClick={() => recording ? stopRecording() : startRecording()}
              title={recording ? 'Stop recording' : 'Speak to Saige'}
              style={{
                width: 36, height: 36, flexShrink: 0,
                borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: recording ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : SAIGE_LIGHT,
                color: recording ? '#fff' : SAIGE_DARK,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, transition: 'all 0.15s',
                animation: recording ? 'saige-rec-pulse 1.4s ease-in-out infinite' : 'none',
                boxShadow: recording ? 'none' : `inset 0 0 0 1px ${SAIGE_BORDER}`,
              }}
            >
              {recording ? '■' : '🎤'}
            </button>
          )}
          {/* Image attach button */}
          <button
            onClick={() => imgInputRef.current?.click()}
            title="Attach a photo"
            style={{
              width: 36, height: 36, flexShrink: 0,
              borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: imagePreview ? SAIGE_GREEN : SAIGE_LIGHT,
              color: imagePreview ? '#fff' : SAIGE_DARK,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, transition: 'all 0.15s',
              boxShadow: `inset 0 0 0 1px ${SAIGE_BORDER}`,
            }}
          >
            {/* Camera icon */}
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={recording ? 'Listening…' : 'Ask Saige about your herd…'}
            style={{
              flex: 1,
              resize: 'none',
              border: `1px solid ${recording ? '#ef4444' : '#d1d5db'}`,
              borderRadius: 8,
              padding: '8px 10px',
              fontSize: 13.5,
              fontFamily: FONT_BODY,
              outline: 'none',
              minHeight: 36,
              lineHeight: 1.4,
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || sending}
            aria-label="Send message"
            title="Send message"
            style={{
              padding: '8px 13px',
              background: SAIGE_GREEN,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
              opacity: input.trim() && !sending ? 1 : 0.5,
              fontFamily: FONT_BODY,
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
        {voiceErr && (
          <div style={{ marginTop: 5, fontSize: 11, color: '#991b1b', fontFamily: FONT_BODY }}>{voiceErr}</div>
        )}
      </div>

      <style>{`
        @keyframes saige-wave {
          0%, 100% { height: 4px; }
          50% { height: 13px; }
        }
        @keyframes saige-rec-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.55); }
          50% { box-shadow: 0 0 0 7px rgba(239,68,68,0); }
        }
      `}</style>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function SaigeWidget({ businessId: propBusinessId, fieldId, pageContext }) {
  const { Expanded: sidebarExpanded, BusinessID: contextBusinessId } = useAccount();
  // Prefer the explicit prop (passed from the URL), fall back to the currently-selected
  // business from AccountContext so Saige knows the business on pages without ?BusinessID=
  const businessId = propBusinessId ?? contextBusinessId ?? null;
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ttsBackendOkRef = useRef(null); // null=untested, true=working, false=unavailable this session

  // ── Persist messages across close/reopen and page navigation ─────────────
  const msgsKey = `saige_widget_msgs_${getPeopleId()}_${businessId ?? 0}`;
  const [messages, setMessages] = useState(() => {
    try {
      const s = sessionStorage.getItem(msgsKey);
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { sessionStorage.setItem(msgsKey, JSON.stringify(messages)); } catch {}
  }, [messages, msgsKey]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open]);

  const goFullPage = () => {
    setOpen(false);
    const qs = businessId ? `?BusinessID=${businessId}` : '';
    navigate(`/saige${qs}`);
  };

  return (
    <>
      {/* FAB launcher */}
      {createPortal(
        <AgentBadge bottom={20} baseRight={20} zIndex={9998}>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Open Saige AI assistant"
          title="Ask Saige"
          style={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            background: 'transparent',
            boxShadow: '0 6px 20px -4px rgba(0,0,0,0.35)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img
            src="/images/SaigeAIIcon.webp"
            alt="Saige"
            style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
          />
        </button>
        </AgentBadge>,
        document.body,
      )}

      {/* Chat panel — Coming Soon in Precision Ag–only mode; live chat otherwise */}
      {open && createPortal(
        PRECISION_AG_ONLY ? (
          <div
            style={{
              position: 'fixed',
              bottom: 96,
              right: 20,
              width: 340,
              maxWidth: 'calc(100vw - 32px)',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
              border: `1px solid ${SAIGE_BORDER}`,
              zIndex: 9999,
              fontFamily: FONT_BODY,
              overflow: 'hidden',
            }}
          >
            <div style={{ background: SAIGE_GREEN, color: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Saige</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600, color: '#1f2937' }}>Coming Soon</p>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                Saige will be available here soon.
              </p>
            </div>
          </div>
        ) : (
        <ChatPanel
          businessId={businessId}
          fieldId={fieldId}
          pageContext={pageContext}
          language={language}
          onClose={() => setOpen(false)}
          onFullPage={goFullPage}
          messages={messages}
          setMessages={setMessages}
          ttsBackendOkRef={ttsBackendOkRef}
        />
        ),
        document.body,
      )}
    </>
  );
}
