import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const STORAGE_MIC  = 'lavendir_mic_device_id';
const STORAGE_SPK  = 'lavendir_spk_device_id';
const STORAGE_TTS  = 'lavendir_tts_voice';
const STORAGE_LANG = 'ofn_language';

const BTN = 'px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed';
const BTN_STYLE = { backgroundColor: '#516234' };

// ── Language form ──────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en',    label: 'English' },
  { code: 'es',    label: 'Spanish — Español' },
  { code: 'fr',    label: 'French — Français' },
  { code: 'de',    label: 'German — Deutsch' },
  { code: 'pt',    label: 'Portuguese — Português' },
  { code: 'it',    label: 'Italian — Italiano' },
  { code: 'nl',    label: 'Dutch — Nederlands' },
  { code: 'pl',    label: 'Polish — Polski' },
  { code: 'ru',    label: 'Russian — Русский' },
  { code: 'uk',    label: 'Ukrainian — Українська' },
  { code: 'ar',    label: 'Arabic — العربية' },
  { code: 'he',    label: 'Hebrew — עברית' },
  { code: 'fa',    label: 'Persian — فارسی' },
  { code: 'hi',    label: 'Hindi — हिन्दी' },
  { code: 'bn',    label: 'Bengali — বাংলা' },
  { code: 'ur',    label: 'Urdu — اردو' },
  { code: 'zh',    label: 'Chinese Simplified — 中文(简体)' },
  { code: 'zh-TW', label: 'Chinese Traditional — 中文(繁體)' },
  { code: 'ja',    label: 'Japanese — 日本語' },
  { code: 'ko',    label: 'Korean — 한국어' },
  { code: 'vi',    label: 'Vietnamese — Tiếng Việt' },
  { code: 'th',    label: 'Thai — ภาษาไทย' },
  { code: 'id',    label: 'Indonesian — Bahasa Indonesia' },
  { code: 'ms',    label: 'Malay — Bahasa Melayu' },
  { code: 'tr',    label: 'Turkish — Türkçe' },
  { code: 'sv',    label: 'Swedish — Svenska' },
  { code: 'da',    label: 'Danish — Dansk' },
  { code: 'no',    label: 'Norwegian — Norsk' },
  { code: 'fi',    label: 'Finnish — Suomi' },
  { code: 'cs',    label: 'Czech — Čeština' },
  { code: 'sk',    label: 'Slovak — Slovenčina' },
  { code: 'ro',    label: 'Romanian — Română' },
  { code: 'hu',    label: 'Hungarian — Magyar' },
  { code: 'el',    label: 'Greek — Ελληνικά' },
  { code: 'sw',    label: 'Swahili — Kiswahili' },
  { code: 'tl',    label: 'Filipino — Filipino' },
];

function LanguageForm({ selectClass, labelClass }) {
  const [lang,    setLang]    = useState(localStorage.getItem(STORAGE_LANG) || i18n.language || 'en');
  const [saved,   setSaved]   = useState(false);

  const handleSave = () => {
    localStorage.setItem(STORAGE_LANG, lang);
    i18n.changeLanguage(lang);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#516234" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2c-2 2-3.5 5-3.5 10s1.5 8 3.5 10"/>
          <path d="M12 2c2 2 3.5 5 3.5 10s-1.5 8-3.5 10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <h3 className="font-bold text-gray-800">Language Preference</h3>
      </div>

      <div className="mb-2">
        <label className={labelClass}>Display Language</label>
        <select className={selectClass} value={lang} onChange={e => { setLang(e.target.value); setSaved(false); }}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
        <p className="text-xs text-gray-400 mt-1.5">Sets the display language across the entire site.</p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
        {saved && <span className="text-sm text-green-600 font-medium">✓ Language saved!</span>}
        <button onClick={handleSave} className={BTN} style={BTN_STYLE}>
          Save Language
        </button>
      </div>
    </div>
  );
}

// ── Audio helpers ──────────────────────────────────────────────────────────────

function AudioSection() {
  const [mics,      setMics]      = useState([]);
  const [spks,      setSpks]      = useState([]);
  const [voices,    setVoices]    = useState([]);
  const [selMic,    setSelMic]    = useState(localStorage.getItem(STORAGE_MIC)  || '');
  const [selSpk,    setSelSpk]    = useState(localStorage.getItem(STORAGE_SPK)  || '');
  const [selVoice,  setSelVoice]  = useState(localStorage.getItem(STORAGE_TTS)  || '');
  const [micLevel,  setMicLevel]  = useState(0);
  const [testingMic, setTestingMic] = useState(false);
  const [testingSpk, setTestingSpk] = useState(false);
  const [permError,  setPermError]  = useState('');
  const [saved,      setSaved]      = useState(false);

  const animRef    = useRef(null);
  const streamRef  = useRef(null);

  useEffect(() => {
    async function loadDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop()));
        const devices = await navigator.mediaDevices.enumerateDevices();
        setMics(devices.filter(d => d.kind === 'audioinput'));
        setSpks(devices.filter(d => d.kind === 'audiooutput'));
        setPermError('');
      } catch {
        setPermError('Microphone permission denied. Please allow microphone access in your browser settings.');
      }
    }
    loadDevices();

    const loadVoices = () => {
      const v = window.speechSynthesis?.getVoices() || [];
      const en = v.filter(v => v.lang.startsWith('en'));
      setVoices(en);
      if (!localStorage.getItem(STORAGE_TTS) && en.length) {
        const google = en.find(v => v.name.includes('Google US English'));
        setSelVoice(google?.name || en[0]?.name || '');
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const startMicTest = async () => {
    setTestingMic(true);
    setMicLevel(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        { audio: selMic ? { deviceId: { exact: selMic } } : true }
      );
      streamRef.current = stream;
      const ctx      = new AudioContext();
      const src      = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setMicLevel(Math.min(100, avg * 2.5));
        animRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      setPermError('Could not access microphone: ' + e.message);
      setTestingMic(false);
    }
  };

  const stopMicTest = () => {
    cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setMicLevel(0);
    setTestingMic(false);
  };

  const testSpeaker = () => {
    setTestingSpk(true);
    const utt = new SpeechSynthesisUtterance('Hello! This is Lavendir. Your audio is working.');
    if (selVoice) {
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selVoice);
      if (voice) utt.voice = voice;
    }
    utt.lang = 'en-US';
    utt.onend = () => setTestingSpk(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  };

  const saveAudio = () => {
    localStorage.setItem(STORAGE_MIC,  selMic);
    localStorage.setItem(STORAGE_SPK,  selSpk);
    localStorage.setItem(STORAGE_TTS,  selVoice);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const selectClass = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Audio Settings</h2>
      <p className="text-sm text-gray-500 mb-5">Configure microphone and speaker for Lavendir, your AI website assistant.</p>


      {permError && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{permError}</div>
      )}

      {/* Microphone */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          <h3 className="font-bold text-gray-800">Microphone</h3>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Microphone</label>
          <select className={selectClass} value={selMic} onChange={e => setSelMic(e.target.value)}>
            <option value="">System Default</option>
            {mics.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Device ${d.deviceId.slice(0, 8)}`}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Input Level</span>
            {testingMic && <span className="text-xs text-purple-600 animate-pulse">● Recording…</span>}
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-75"
              style={{ width: `${micLevel}%`, background: micLevel > 70 ? '#EF4444' : micLevel > 40 ? '#F59E0B' : '#7C5CBF' }} />
          </div>
        </div>

        <button
          onClick={testingMic ? stopMicTest : startMicTest}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
            testingMic ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                       : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'}`}
        >
          {testingMic ? '⏹ Stop Test' : '▶ Test Microphone'}
        </button>
        <p className="text-xs text-gray-400 mt-2">Speak into your microphone — the level bar should move.</p>
      </div>

      {/* Speaker & Voice */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <h3 className="font-bold text-gray-800">Speaker &amp; Voice</h3>
        </div>

        {spks.length > 0 && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Output Device</label>
            <select className={selectClass} value={selSpk} onChange={e => setSelSpk(e.target.value)}>
              <option value="">System Default</option>
              {spks.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Device ${d.deviceId.slice(0, 8)}`}</option>)}
            </select>
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Lavendir's Voice</label>
          <select className={selectClass} value={selVoice} onChange={e => setSelVoice(e.target.value)}>
            <option value="">Browser Default</option>
            {voices.map(v => <option key={v.name} value={v.name}>{v.name}{v.name.includes('Google') ? ' ⭐' : ''}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Voices marked ⭐ are high-quality Google voices (Chrome only).</p>
        </div>

        <button
          onClick={testSpeaker}
          disabled={testingSpk}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors disabled:opacity-50"
        >
          {testingSpk ? '🔊 Playing…' : '▶ Test Speaker'}
        </button>

        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">✓ Saved!</span>}
          <button onClick={saveAudio} className={BTN} style={BTN_STYLE}>
            Save Audio Settings
          </button>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-purple-800 mb-2">Tips for best results with Lavendir</p>
        <ul className="text-xs text-purple-700 space-y-1 list-disc list-inside">
          <li>Use <strong>Google Chrome</strong> for the best voice quality and speech recognition</li>
          <li>Select <strong>Google US English</strong> as the voice for natural-sounding responses</li>
          <li>Use a headset to prevent echo when voice is enabled</li>
        </ul>
      </div>
    </div>
  );
}

// ── Password strength rules ────────────────────────────────────────────────────

function pwRules(pw) {
  return {
    length:  pw.length >= 7,
    upper:   /[A-Z]/.test(pw),
    special: /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(pw),
  };
}
function pwValid(pw) {
  const r = pwRules(pw);
  return r.length && r.upper && r.special;
}

// ── Profile form ───────────────────────────────────────────────────────────────

function ProfileForm({ initialData, inputClass, labelClass }) {
  const [form,    setForm]    = useState({ first_name: '', last_name: '', email: '' });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (initialData) setForm({ first_name: initialData.first_name, last_name: initialData.last_name, email: initialData.email });
  }, [initialData]);

  const update = (field, val) => { setForm(f => ({ ...f, [field]: val })); setSuccess(''); setError(''); };

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/auth/update-login`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ first_name: form.first_name, last_name: form.last_name, email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'An error occurred.'); }
      else {
        setSuccess('Profile saved.');
        localStorage.setItem('first_name', data.PeopleFirstName);
        localStorage.setItem('last_name',  data.PeopleLastName);
      }
    } catch { setError('An error occurred. Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="mb-8">
      <h3 className="text-base font-bold text-gray-800 mb-4">Profile Information</h3>

      {success && <div className="mb-4 bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-3 text-sm">{success}</div>}
      {error   && <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input type="text" className={inputClass} value={form.first_name} onChange={e => update('first_name', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input type="text" className={inputClass} value={form.last_name} onChange={e => update('last_name', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input type="email" className={inputClass} value={form.email} onChange={e => update('email', e.target.value)} />
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={handleSave} disabled={saving} className={BTN} style={BTN_STYLE}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Eye toggle icons ───────────────────────────────────────────────────────────

function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="10" ry="6" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EyeClosed() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2-4 5-6 10-6s8 2 10 6" />
      <path d="M2 12c2 4 5 6 10 6s8-2 10-6" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
}

function PwInput({ label, field, value, show, onToggle, onChange, inputClass, labelClass, extraClass = '', autoComplete }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className={`${inputClass} pr-10 ${extraClass}`}
          value={value}
          onChange={e => onChange(field, e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
          title={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOpen /> : <EyeClosed />}
        </button>
      </div>
    </div>
  );
}

// ── Password form ──────────────────────────────────────────────────────────────

function PasswordForm({ inputClass, labelClass }) {
  const [form,    setForm]    = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [show,    setShow]    = useState({ current_password: false, new_password: false, confirm_password: false });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const update     = (field, val) => { setForm(f => ({ ...f, [field]: val })); setSuccess(''); setError(''); };
  const toggleShow = (field)      => setShow(s => ({ ...s, [field]: !s[field] }));

  const rules    = pwRules(form.new_password);
  const matches  = form.new_password === form.confirm_password && form.new_password.length > 0;
  const canSave  = pwValid(form.new_password) && matches && form.current_password.length > 0;

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/auth/update-login`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: form.current_password, new_password: form.new_password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'An error occurred.'); }
      else {
        setSuccess('Password changed successfully.');
        setForm({ current_password: '', new_password: '', confirm_password: '' });
        setShow({ current_password: false, new_password: false, confirm_password: false });
      }
    } catch { setError('An error occurred. Please try again.'); }
    finally { setSaving(false); }
  };

  const Rule = ({ ok, label }) => (
    <li className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {ok ? <polyline points="2 8 6 12 14 4" /> : <circle cx="8" cy="8" r="5" />}
      </svg>
      {label}
    </li>
  );

  const confirmExtra = form.confirm_password.length > 0
    ? (matches ? 'border-green-400 focus:border-green-500 focus:ring-green-300' : 'border-red-400 focus:border-red-500 focus:ring-red-300')
    : '';

  return (
    <div>
      <h3 className="text-base font-bold text-gray-800 mb-4">Change Password</h3>

      {success && <div className="mb-4 bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-3 text-sm">{success}</div>}
      {error   && <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <PwInput label="Current Password" field="current_password" value={form.current_password}
          show={show.current_password} onToggle={() => toggleShow('current_password')}
          onChange={update} inputClass={inputClass} labelClass={labelClass} autoComplete="current-password" />

        <div>
          <PwInput label="New Password" field="new_password" value={form.new_password}
            show={show.new_password} onToggle={() => toggleShow('new_password')}
            onChange={update} inputClass={inputClass} labelClass={labelClass} autoComplete="new-password" />
          {form.new_password.length > 0 && (
            <ul className="mt-2 space-y-1 pl-1">
              <Rule ok={rules.length}  label="At least 7 characters" />
              <Rule ok={rules.upper}   label="At least 1 uppercase letter" />
              <Rule ok={rules.special} label="At least 1 special character" />
            </ul>
          )}
        </div>

        <div>
          <PwInput label="Confirm New Password" field="confirm_password" value={form.confirm_password}
            show={show.confirm_password} onToggle={() => toggleShow('confirm_password')}
            onChange={update} inputClass={inputClass} labelClass={labelClass}
            extraClass={confirmExtra} autoComplete="new-password" />
          {form.confirm_password.length > 0 && !matches && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
          )}
        </div>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          {!canSave && !saving && (
            <p className="text-xs text-gray-400">Complete the requirements above to enable this button.</p>
          )}
          <button onClick={handleSave} disabled={!canSave || saving} className={BTN} style={BTN_STYLE}>
            {saving ? 'Saving…' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Login info section ─────────────────────────────────────────────────────────

function LoginSection() {
  const [initialData, setInitialData] = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setInitialData({
          first_name: data.PeopleFirstName || '',
          last_name:  data.PeopleLastName  || '',
          email:      data.PeopleEmail     || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#819360] focus:ring-1 focus:ring-[#819360]';
  const labelClass = 'block text-sm font-medium text-gray-600 mb-1';

  if (loading) return <div className="text-gray-400 text-sm py-4">Loading…</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Login &amp; Account</h2>
      <p className="text-sm text-gray-500 mb-6">Update your name, email address, or change your password.</p>
      <ProfileForm initialData={initialData} inputClass={inputClass} labelClass={labelClass} />
      <hr className="border-gray-200 mb-8" />
      <PasswordForm inputClass={inputClass} labelClass={labelClass} />
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const TABS = ['Login & Account', 'Language & Audio Settings'];

export default function AccountSettings() {
  const { Business } = useAccount();
  const PeopleID = localStorage.getItem('people_id');
  const location = useLocation();
  const selectClass = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#819360] bg-white';
  const labelClass  = 'block text-sm font-medium text-gray-600 mb-1';

  const urlTab = new URLSearchParams(location.search).get('tab');
  const [tab, setTab] = useState(() =>
    urlTab === 'audio' ? 'Language & Audio Settings' : 'Login & Account'
  );

  useEffect(() => {
    const t = new URLSearchParams(location.search).get('tab');
    setTab(t === 'audio' ? 'Language & Audio Settings' : 'Login & Account');
  }, [location.search]);

  return (
    <AccountLayout Business={Business} BusinessID={null} PeopleID={PeopleID} pageTitle="Settings" breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Settings' }]}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Personal Settings</h1>
          <p className="text-sm text-gray-500">Manage your login information, language, and audio preferences.</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Login & Account' && <LoginSection />}
        {tab === 'Language & Audio Settings' && (
          <>
            <LanguageForm selectClass={selectClass} labelClass={labelClass} />
            <AudioSection />
          </>
        )}

      </div>
    </AccountLayout>
  );
}
