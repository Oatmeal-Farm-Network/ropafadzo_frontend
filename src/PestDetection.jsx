import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import RelatedSuggestions from './RelatedSuggestions.jsx';
import VisionReadout from './VisionReadout.jsx';
import { coachPhoto } from './photoCoach.js';
import { weatherMimicSentence } from './scoutWeather.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || '/saige';

function authHeaders() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function confidenceColor(c) {
  const key = typeof c === 'string' ? c : (c >= 0.75 ? 'high' : c >= 0.45 ? 'medium' : 'low');
  if (key === 'high') return { bg: '#ecfdf5', border: '#86efac', color: '#065f46' };
  if (key === 'medium') return { bg: '#fefce8', border: '#fde047', color: '#854d0e' };
  return { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b' };
}

function peopleId() {
  try {
    return String(JSON.parse(localStorage.getItem('ofnUser') || '{}')?.PeopleID || 'anon');
  } catch {
    return 'anon';
  }
}

function businessIdFromStorage() {
  try {
    const u = JSON.parse(localStorage.getItem('ofnUser') || '{}');
    return u?.BusinessID || u?.business_id || localStorage.getItem('BusinessID') || '';
  } catch {
    return localStorage.getItem('BusinessID') || '';
  }
}

function followUpPrompts() {
  return [
    { title: 'What should I do next?' },
    { title: 'How many stems?' },
    { title: 'How many fruits?' },
    { title: 'Any pests or insect damage?' },
  ];
}

const ANY_PHOTO_CHIPS = [
  'What plant or tree is this?',
  'Is this healthy or stressed?',
  'How many stems?',
  'How many fruits?',
  'Any pests or insect damage?',
  'Nutrient deficiency?',
  'Any weeds?',
  'How many branches?',
  'Are the fruits ready to pick?',
  'Does it need irrigation?',
  'What growth stage is this?',
  'Heat or drought stress?',
  'Count the fruits in this photo',
  'Is the fruit load too heavy?',
  'What should I do next?',
  'Is this photo clear enough?',
];
const FEATURED_CHIPS = [
  'What plant or tree is this?',
  'Is this healthy or stressed?',
  'How many fruits?',
  'How many stems?',
  'Any pests or insect damage?',
  'Nutrient deficiency?',
  'What should I do next?',
];
const MORE_CHIPS = ANY_PHOTO_CHIPS.filter((chip) => !FEATURED_CHIPS.includes(chip));

function cropScanAskFields(scan) {
  if (!scan || scan.abstained) return {};
  const conf = scan.confidence_num ?? scan.confidence;
  return {
    scan_diagnosis: scan.diagnosis || '',
    scan_crop: scan.crop_identified || '',
    scan_confidence: conf ?? '',
    scan_category: scan.category || '',
    scan_actions: scan.recommended_actions || [],
    scan_lookalikes: scan.look_alikes || [],
    prior_health: scan.diagnosis || '',
    prior_crop: scan.crop_identified || '',
    prior_health_conf: typeof conf === 'number' ? (conf > 1 ? conf / 100 : conf) : 0,
  };
}

export default function PestDetection() {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fromPrecisionAg = location.pathname.startsWith('/precision-ag/');
  const [preview, setPreview] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [fields, setFields] = useState([]);
  const [fieldId, setFieldId] = useState(searchParams.get('FieldID') || searchParams.get('fieldId') || '');
  const [askQ, setAskQ] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [askErr, setAskErr] = useState('');
  const [askThread, setAskThread] = useState([]); // {role, content, meta?, readout?}
  const [showMoreChips, setShowMoreChips] = useState(false);
  const [coach, setCoach] = useState(null);
  const [scans, setScans] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const fileInput = useRef(null);
  const cameraInput = useRef(null);
  const secondFileInput = useRef(null);
  const secondCameraInput = useRef(null);

  const businessId = searchParams.get('BusinessID') || businessIdFromStorage();

  useEffect(() => {
    let cancelled = false;
    if (!preview) {
      setCoach(null);
      return undefined;
    }
    coachPhoto(preview).then((result) => {
      if (!cancelled) setCoach(result);
    });
    return () => { cancelled = true; };
  }, [preview]);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/fields?business_id=${businessId}`, {
          headers: authHeaders(),
        });
        if (!r.ok) return;
        const data = await r.json();
        const list = Array.isArray(data) ? data : data.fields || [];
        if (!cancelled) setFields(list);
      } catch {
        /* ignore */
      }
    })();
    return () => { cancelled = true; };
  }, [businessId]);

  const selectedField = fields.find(
    (f) => String(f.fieldid || f.FieldID || f.id) === String(fieldId)
  );
  const fieldName = selectedField?.name || selectedField?.Name || '';
  const cropType =
    selectedField?.croptype || selectedField?.CropType || selectedField?.crop_type || '';

  const pickFile = (file) => {
    if (!file) return;
    setFileBlob(file);
    setResult(null);
    setAskThread([]);
    setAskErr('');
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const askAboutPhoto = async (question, options = {}) => {
    const q = (question || askQ || '').trim();
    const image = options.image || preview;
    if (!q || !image || askLoading) return;
    setAskLoading(true);
    setAskErr('');
    setAskThread((prev) => [...prev, { role: 'user', content: options.userLine || q }]);
    if (!options.image) setAskQ('');
    let weatherNote = '';
    if (fieldId && selectedField) {
      weatherNote = await weatherMimicSentence({
        lat: selectedField.latitude ?? selectedField.Latitude,
        lon: selectedField.longitude ?? selectedField.Longitude,
        address: selectedField.address || selectedField.Address || '',
      });
    }
    try {
      const r = await fetch(`${SAIGE_API}/vision/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          image_base64: image,
          question: q,
          notes: notes || '',
          field_name: fieldName || '',
          crop: cropType || '',
          user_id: peopleId(),
          prior_health: options.prior_health || '',
          prior_crop: options.prior_crop || '',
          prior_health_conf: options.prior_health_conf || 0,
          prior_decision: options.prior_decision || '',
          weather_note: weatherNote,
          ...(options.image ? {} : cropScanAskFields(result)),
        }),
      });
      const rawText = await r.text();
      let j = null;
      try {
        j = rawText ? JSON.parse(rawText) : null;
      } catch {
        j = null;
      }
      if (!r.ok || !j) {
        const hint = !rawText
          ? 'Backend did not respond. Make sure the server on port 8001 is running, then try again.'
          : (rawText.slice(0, 180) || `HTTP ${r.status}`);
        setAskErr(hint);
        setAskThread((prev) => prev.slice(0, -1));
      } else if (j?.status === 'ok' && j.answer) {
        setAskThread((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: j.answer,
            meta: {
              cv: j.cv_helpers_used || [],
              disclaimer: j.disclaimer,
            },
            readout: j.readout || null,
          },
        ]);
      } else {
        setAskErr(j?.message || 'Could not answer about this photo');
        setAskThread((prev) => prev.slice(0, -1));
      }
    } catch (e) {
      setAskErr(e.message || 'Vision ask failed');
      setAskThread((prev) => prev.slice(0, -1));
    } finally {
      setAskLoading(false);
    }
  };

  const lastReadout = [...askThread].reverse().find((m) => m.role === 'assistant' && m.readout)?.readout || null;

  const sendSecondPlant = async (file) => {
    if (!file || !lastReadout || askLoading) return;
    const image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read that photo'));
      reader.readAsDataURL(file);
    });
    const lastQuestion = [...askThread].reverse().find((m) => m.role === 'user')?.content
      || 'Does this closer photo change the read?';
    await askAboutPhoto(lastQuestion, {
      image,
      userLine: 'Closer photo',
      prior_health: lastReadout.health_label || '',
      prior_crop: lastReadout.crop_label || '',
      prior_health_conf: lastReadout.health_confidence || 0,
      prior_decision: lastReadout.decision || '',
    });
  };

  const mapFiToUi = (fi) => {
    const conf = Number(fi.confidence ?? 0);
    return {
      status: fi.abstained ? 'abstained' : 'ok',
      diagnosis: fi.label,
      label: fi.label,
      category: fi.category,
      confidence: conf >= 0.75 ? 'high' : conf >= 0.45 ? 'medium' : 'low',
      confidence_num: conf,
      cnn_confidence: fi.cnn_confidence,
      provider: fi.provider,
      used_gemini: fi.used_gemini,
      crop_identified: fi.crop || cropType || 'unknown',
      crop: fi.crop || cropType,
      symptoms_observed: [],
      recommended_actions: fi.actions || [],
      look_alikes: [],
      notes: (fi.policy_notes || []).join(' '),
      abstained: fi.abstained,
      abstain_reason: fi.abstain_reason,
      scan_id: fi.scan_id,
      scout_id: fi.scout_id,
      pending_action_id: fi.pending_action_id,
      image_url: fi.image_url,
      related_suggestions: [],
      disclaimer: fi.disclaimer,
      source: 'farm_intelligence',
    };
  };

  const loadScanHistory = async (fid) => {
    const id = fid || fieldId;
    if (!id) {
      setScans([]);
      return;
    }
    try {
      const r = await fetch(`${API_URL}/api/fields/${id}/crop-scans?limit=10`, {
        headers: authHeaders(),
      });
      if (!r.ok) return;
      const data = await r.json();
      setScans(Array.isArray(data?.scans) ? data.scans : []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadScanHistory(fieldId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId]);

  const loadSample = async () => {
    setErr('');
    setAskErr('');
    setResult(null);
    setAskThread([]);
    const candidates = [
      '/samples/crop-scan-demo.jpg',
      '/samples/saige-crop-scan-sample.jpg',
      '/images/SaigeAIIcon.webp',
    ];
    try {
      let blob = null;
      for (const url of candidates) {
        const r = await fetch(url);
        if (r.ok) {
          blob = await r.blob();
          break;
        }
      }
      if (!blob) throw new Error('Sample photo unavailable');
      setFileBlob(blob);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(blob);
    } catch (e) {
      setErr(e.message || 'Could not load the sample photo');
    }
  };

  const detect = async () => {
    if (!preview && !fileBlob) return;
    setLoading(true);
    setResult(null);
    setErr('');
    const scanNotes = [
      notes || '',
      'Identify the plant or crop (leaf, stem, fruit, or whole plant).',
      'Say whether it looks healthy or stressed.',
      'If unhealthy, give practical steps to restore health. Do not require a field.',
    ].filter(Boolean).join(' ');
    try {
      const r = await fetch(`${SAIGE_API}/pest/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          image_base64: preview,
          notes: scanNotes,
          user_id: peopleId(),
        }),
      });
      const j = await r.json();
      if (j?.status === 'ok') {
        setResult({ ...j, source: 'saige_pest' });
      } else {
        setErr(j?.message || t('pest_detection.err_failed'));
      }

      // Optional: attach to a field if the farmer picked one. Scan itself does not need a field.
      if (fieldId && fileBlob) {
        try {
          const fd = new FormData();
          fd.append('file', fileBlob);
          if (cropType) fd.append('crop', cropType);
          fd.append('notes', scanNotes);
          fd.append('capture_conditions', 'saige_phone_upload');
          fd.append('confirm', 'false');
          const save = await fetch(`${API_URL}/api/fields/${fieldId}/crop-scan`, {
            method: 'POST',
            headers: authHeaders(),
            body: fd,
          });
          if (save.ok) {
            const fi = await save.json();
            setResult((prev) => prev ? { ...prev, ...mapFiToUi(fi), source: prev.source } : mapFiToUi(fi));
            await loadScanHistory(fieldId);
          }
        } catch {
          /* field save is optional */
        }
      }
    } catch (e) {
      setErr(e.message || t('pest_detection.err_no_service'));
    } finally {
      setLoading(false);
    }
  };

  const confirmScan = async (outcome) => {
    if (!fieldId || !result?.scan_id || confirming) return;
    setConfirming(true);
    setErr('');
    try {
      const r = await fetch(
        `${API_URL}/api/fields/${fieldId}/crop-scans/${result.scan_id}/confirm`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ outcome, create_scout: true }),
        }
      );
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.detail || `HTTP ${r.status}`);
      setResult((prev) => prev ? { ...prev, confirmed: outcome, scout_id: j.scout_id || prev.scout_id } : prev);
      await loadScanHistory(fieldId);
    } catch (e) {
      setErr(e.message || 'Could not save confirmation');
    } finally {
      setConfirming(false);
    }
  };

  const confStyle = result
    ? confidenceColor(result.confidence_num ?? result.confidence)
    : null;
  const followUps = result && !result.abstained ? followUpPrompts() : [];

  const btnPrimary = {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #14532d',
    background: '#14532d',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    minHeight: 44,
  };
  const btnSecondary = {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#14532d',
    fontWeight: 700,
    cursor: 'pointer',
    minHeight: 44,
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Saige Plant Scan | Oatmeal Farm Network"
        description="Photograph a plant, tree, leaf, or fruit. Saige reads health, pests, stems, and fruit counts, then answers follow-up questions on the same photo."
        noIndex
      />
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-5 md:px-6 py-4 sm:py-6 pb-12 box-border">
      <div className="mb-3 text-sm">
        {fromPrecisionAg ? (
          <Link
            to={`/precision-ag/fields${businessId ? `?BusinessID=${businessId}` : ''}`}
            className="text-[#14532d] font-semibold hover:underline"
          >
            ← Precision Ag
          </Link>
        ) : (
          <Link to="/saige" className="text-[#14532d] font-semibold hover:underline">
            ← Saige
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 mb-2">
        <img src="/images/SaigeAIIcon.webp" alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
        <h1
          className="m-0 text-xl sm:text-2xl md:text-[26px] font-extrabold leading-tight"
          style={{ color: '#14532d', fontFamily: "Lora, Georgia, serif" }}
        >
          {fromPrecisionAg ? 'Crop Scan' : 'Saige Plant Scan'}
        </h1>
      </div>
      <p className="text-sm sm:text-[15px] text-gray-600 mt-1 mb-4 leading-relaxed">
        Photograph any crop, leaf, stem, or fruit. Crop Scan identifies the plant, checks health, and suggests how to restore it if it looks stressed. A field is optional.
      </p>

      {fromPrecisionAg && (
        <details className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-3.5">
          <summary className="text-sm font-semibold text-[#14532d] cursor-pointer">
            Optional: save to a field
          </summary>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Scan works without a field. Attach one only if you want this photo stored on a Precision Ag field.
          </p>
          <select
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value)}
            className="w-full min-h-11 text-base px-2.5 py-2 rounded-lg border border-gray-300 bg-white"
          >
            <option value="">No field</option>
            {fields.map((f) => {
              const id = f.fieldid || f.FieldID || f.id;
              const name = f.name || f.Name || `Field ${id}`;
              const crop = f.crop_type || f.croptype || f.CropType || '';
              return (
                <option key={id} value={id}>
                  {name}{crop ? ` · ${crop}` : ''}
                </option>
              );
            })}
          </select>
        </details>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 mb-3.5">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center mb-3">
              <input
                ref={cameraInput}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => pickFile(e.target.files?.[0])}
                style={{ display: 'none' }}
              />
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={(e) => pickFile(e.target.files?.[0])}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => cameraInput.current?.click()}
                className="w-full sm:w-auto"
                style={btnPrimary}
              >
                Take photo
              </button>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="w-full sm:w-auto"
                style={btnSecondary}
              >
                Choose photo
              </button>
              <button
                type="button"
                onClick={loadSample}
                className="w-full sm:w-auto"
                style={{ ...btnSecondary, border: '1px solid #14532d' }}
              >
                Try sample photo
              </button>
              <button
                type="button"
                onClick={detect}
                disabled={loading || !preview}
                className="w-full sm:w-auto"
                style={{
                  ...btnPrimary,
                  opacity: loading || !preview ? 0.5 : 1,
                  cursor: loading || !preview ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Scanning…' : 'Run crop scan'}
              </button>
            </div>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-[min(52vh,420px)] object-contain rounded-lg mb-2 bg-white border border-gray-200"
              />
            )}
            {preview && coach && (
              <div style={{
                marginBottom: 12,
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 650,
                background: coach.ready ? '#ecfdf5' : '#fffbeb',
                border: `1px solid ${coach.ready ? '#86efac' : '#fcd34d'}`,
                color: coach.ready ? '#14532d' : '#92400e',
              }}
              >
                {coach.tip}
              </div>
            )}

            {preview && (
              <div style={{
                marginBottom: 14,
                padding: 12,
                background: '#ecfdf5',
                border: '1px solid #86efac',
                borderRadius: 10,
              }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
                  Ask about this photo
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {FEATURED_CHIPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => askAboutPhoto(c)}
                      disabled={askLoading}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: '1px solid #0f766e',
                        background: '#fff',
                        color: '#0f766e',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: askLoading ? 'not-allowed' : 'pointer',
                        minHeight: 36,
                      }}
                    >
                      {c}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowMoreChips((v) => !v)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 999,
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      color: '#374151',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      minHeight: 36,
                    }}
                  >
                    {showMoreChips ? 'Fewer questions' : 'More questions'}
                  </button>
                  {showMoreChips && MORE_CHIPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => askAboutPhoto(c)}
                      disabled={askLoading}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 999,
                        border: '1px solid #0f766e',
                        background: '#fff',
                        color: '#0f766e',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: askLoading ? 'not-allowed' : 'pointer',
                        minHeight: 36,
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={askQ}
                    onChange={(e) => setAskQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        askAboutPhoto();
                      }
                    }}
                    placeholder="e.g. Is this healthy? How many fruits?"
                    className="flex-1 min-h-11 text-base px-2.5 py-2 rounded-lg border border-gray-300 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => askAboutPhoto()}
                    disabled={!askQ.trim() || askLoading}
                    className="w-full sm:w-auto shrink-0"
                    style={{
                      padding: '12px 16px',
                      background: '#14532d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: !askQ.trim() || askLoading ? 'not-allowed' : 'pointer',
                      opacity: !askQ.trim() || askLoading ? 0.5 : 1,
                      minHeight: 44,
                    }}
                  >
                    {askLoading ? 'Reading…' : 'Ask'}
                  </button>
                </div>
                {askLoading && (
                  <div style={{ marginTop: 8, fontSize: 13, color: '#0f766e', fontWeight: 600 }}>
                    Reading the photo…
                  </div>
                )}
                {askErr && (
                  <div style={{ marginTop: 8, fontSize: 13, color: '#991b1b' }}>{askErr}</div>
                )}
                {lastReadout?.needs_second && !askLoading && (
                  <div style={{ marginTop: 10, padding: 10, background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                      This photo is too blurry or unreadable. Take one sharp shot in daylight — no close-up retake needed for a clear plant photo.
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => secondCameraInput.current?.click()}
                        className="w-full sm:w-auto"
                        style={btnSecondary}
                      >
                        Retake photo
                      </button>
                      <button
                        type="button"
                        onClick={() => secondFileInput.current?.click()}
                        className="w-full sm:w-auto"
                        style={btnSecondary}
                      >
                        Choose another photo
                      </button>
                    </div>
                    <input
                      ref={secondCameraInput}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) sendSecondPlant(file);
                      }}
                    />
                    <input
                      ref={secondFileInput}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (file) sendSecondPlant(file);
                      }}
                    />
                  </div>
                )}
                {askThread.length > 0 && (
                  <div style={{ marginTop: 10, maxHeight: 420, overflowY: 'auto' }}>
                    {askThread.map((m, i) => (
                      <div key={i} style={{ marginBottom: 8 }}>
                        {m.role === 'user' ? (
                          <div style={{
                            padding: '8px 10px',
                            borderRadius: 8,
                            background: '#14532d',
                            color: '#fff',
                            fontSize: 13,
                            lineHeight: 1.45,
                          }}
                          >
                            {m.content}
                          </div>
                        ) : (
                          <div>
                            {m.readout && <VisionReadout readout={m.readout} />}
                            {m.content && !m.readout && (
                              <p style={{
                                margin: 0,
                                color: '#14532d',
                                fontSize: 15,
                                fontWeight: 650,
                                lineHeight: 1.5,
                              }}
                              >
                                {String(m.content).replace(/\*\*/g, '').replace(/`/g, '')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {err && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>
              {err}
            </div>
          )}

          {result && (
            <div style={{ background: confStyle.bg, border: `1px solid ${confStyle.border}`, borderRadius: 12, padding: 16 }}>
              {result.abstained ? (
                <div style={{ fontSize: 16, fontWeight: 700, color: '#991b1b' }}>
                  Photo not usable — {result.abstain_reason || 'retake a clearer leaf close-up'}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 18, fontWeight: 700, color: confStyle.color }}>
                    {String(result.diagnosis || '').replaceAll('_', ' ')}
                    {result.confidence_num != null && (
                      <span style={{ fontSize: 14, fontWeight: 500 }}>
                        {' '}· {Math.round(Number(result.confidence_num) * 100)}%
                      </span>
                    )}
                  </div>
                  {result.crop_identified && result.crop_identified !== 'unknown' && (
                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                      {t('pest_detection.result_crop', { crop: result.crop_identified })}
                      {fieldName ? ` · Field: ${fieldName}` : ''}
                    </div>
                  )}
                </>
              )}

              {result.recommended_actions?.length > 0 && (
                <>
                  <div style={{ marginTop: 12, fontWeight: 600 }}>{t('pest_detection.actions_heading')}</div>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: 22, lineHeight: 1.5 }}>
                    {result.recommended_actions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </>
              )}

              {(result.scout_id || result.pending_action_id || result.scan_id) && (
                <div style={{ marginTop: 10, fontSize: 13, color: '#166534' }}>
                  {result.scan_id ? `Scan #${result.scan_id}. ` : ''}
                  {result.scout_id ? `Scout #${result.scout_id} saved. ` : ''}
                  {result.pending_action_id ? `Pending approval #${result.pending_action_id}.` : ''}
                  {result.confirmed ? ` Confirmed: ${result.confirmed}.` : ''}
                </div>
              )}

              {fromPrecisionAg && result.scan_id && !result.abstained && !result.confirmed && (
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <button
                    type="button"
                    disabled={confirming}
                    onClick={() => confirmScan('correct')}
                    style={btnPrimary}
                  >
                    {confirming ? 'Saving…' : 'Confirm diagnosis'}
                  </button>
                  <button
                    type="button"
                    disabled={confirming}
                    onClick={() => confirmScan('incorrect')}
                    style={btnSecondary}
                  >
                    Mark incorrect
                  </button>
                </div>
              )}

              <RelatedSuggestions
                heading={t('pest_detection.related_heading')}
                items={result.related_suggestions || []}
              />

              {followUps.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#14532d', marginBottom: 8 }}>
                    Ask about this same photo
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {followUps.map((q) => (
                      <button
                        key={q.title}
                        type="button"
                        onClick={() => askAboutPhoto(q.title)}
                        style={{
                          padding: '10px 12px',
                          background: '#fff',
                          border: '1px solid #0f766e',
                          borderRadius: 10,
                          color: '#0f766e',
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                          minHeight: 40,
                        }}
                      >
                        {q.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {fromPrecisionAg && scans.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mt-3.5 mb-3.5">
              <div className="text-sm font-semibold text-[#14532d] mb-2">Recent scans</div>
              <ul className="m-0 p-0 list-none">
                {scans.map((s) => (
                  <li
                    key={s.ScanID}
                    className="text-sm text-gray-700 py-1.5 border-b border-gray-100 last:border-0"
                  >
                    #{s.ScanID} · {String(s.Label || 'unknown').replaceAll('_', ' ')}
                    {s.Confidence != null ? ` · ${Math.round(Number(s.Confidence) * 100)}%` : ''}
                    {s.Provider ? ` · ${s.Provider}` : ''}
                    {s.HumanConfirmedOutcome ? ` · confirmed ${s.HumanConfirmedOutcome}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </main>
      <Footer />
    </div>
  );
}
