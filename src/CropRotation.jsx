import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API_URL   = import.meta.env.VITE_API_URL;
const SAIGE_API = import.meta.env.VITE_SAIGE_API_URL || 'http://localhost:8000/saige';

// ─── Crop colour palette ──────────────────────────────────────────────────────
const CROP_STYLES = [
  { match: ['corn', 'maize'],              bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', icon: '🌽' },
  { match: ['soybean', 'soy'],             bg: '#D1FAE5', border: '#10B981', text: '#064E3B', icon: '🫘' },
  { match: ['wheat'],                      bg: '#FDE68A', border: '#D97706', text: '#78350F', icon: '🌾' },
  { match: ['oat'],                        bg: '#ECFCCB', border: '#6D8E22', text: '#365314', icon: '🌾' },
  { match: ['barley'],                     bg: '#FEE2E2', border: '#B45309', text: '#7C2D12', icon: '🌾' },
  { match: ['canola', 'rapeseed'],         bg: '#FEF9C3', border: '#FBBF24', text: '#713F12', icon: '🌼' },
  { match: ['sunflower'],                  bg: '#FED7AA', border: '#F97316', text: '#7C2D12', icon: '🌻' },
  { match: ['sorghum', 'milo'],            bg: '#FECACA', border: '#EF4444', text: '#7F1D1D', icon: '🌾' },
  { match: ['alfalfa', 'clover', 'vetch'], bg: '#BBF7D0', border: '#4ADE80', text: '#14532D', icon: '🌿' },
  { match: ['cover', 'rye', 'radish'],     bg: '#CFFAFE', border: '#06B6D4', text: '#164E63', icon: '🌱' },
  { match: ['cotton'],                     bg: '#F3F4F6', border: '#9CA3AF', text: '#374151', icon: '☁️' },
  { match: ['rice'],                       bg: '#F0FDF4', border: '#86EFAC', text: '#166534', icon: '🌾' },
  { match: ['potato', 'tuber'],            bg: '#FEF3C7', border: '#92400E', text: '#451A03', icon: '🥔' },
  { match: ['fallow', 'rest', 'idle'],     bg: '#F9FAFB', border: '#D1D5DB', text: '#6B7280', icon: '🟫' },
];

function getCropStyle(cropName) {
  const key = (cropName || '').toLowerCase();
  const match = CROP_STYLES.find(s => s.match.some(m => key.includes(m)));
  return match || { bg: '#F3F4F6', border: '#6D8E22', text: '#374151', icon: '🌱' };
}

const YIELD_UNITS = ['bu/ac', 't/ha', 'lbs/ac', 'cwt/ac', 'tons/ac', 'kg/ha'];

const EMPTY_FORM = {
  season_year:   new Date().getFullYear(),
  crop_name:     '',
  variety:       '',
  planting_date: '',
  harvest_date:  '',
  yield_amount:  '',
  yield_unit:    'bu/ac',
  is_cover_crop: false,
  notes:         '',
};

// ─── Rotation analysis engine ─────────────────────────────────────────────────
function analyzeRotation(entries, t) {
  if (!entries.length) return null;
  const sorted = [...entries].filter(e => !e.is_cover_crop).sort((a, b) => a.season_year - b.season_year);
  const all    = [...entries].sort((a, b) => a.season_year - b.season_year);
  const insights = [];

  // Consecutive same crop
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].crop_name.toLowerCase() === sorted[i - 1].crop_name.toLowerCase()) {
      insights.push({ type: 'warning', text: t('crop_rotation.insight_consecutive', { crop: sorted[i].crop_name, year1: sorted[i - 1].season_year, year2: sorted[i].season_year }) });
    }
  }

  // Legume benefit
  const legumes = ['soy', 'alfalfa', 'clover', 'vetch', 'pea', 'bean'];
  if (sorted.some(e => legumes.some(l => e.crop_name.toLowerCase().includes(l)))) {
    insights.push({ type: 'good', text: t('crop_rotation.insight_legume') });
  }

  // Cover crop benefit
  if (all.some(e => e.is_cover_crop)) {
    insights.push({ type: 'good', text: t('crop_rotation.insight_cover_crop') });
  }

  // Diversity
  const recent = sorted.slice(-4);
  const unique = new Set(recent.map(e => e.crop_name.toLowerCase())).size;
  if (unique >= 3) {
    insights.push({ type: 'good', text: t('crop_rotation.insight_strong_diversity', { count: unique, seasons: recent.length }) });
  } else if (unique <= 1 && sorted.length >= 3) {
    insights.push({ type: 'warning', text: t('crop_rotation.insight_low_diversity') });
  }

  // Next crop recommendation
  const last = sorted[sorted.length - 1];
  let recommendation = null;
  if (last) {
    const lc = last.crop_name.toLowerCase();
    if (lc.includes('corn') || lc.includes('maize'))
      recommendation = { crop: t('crop_rotation.rec_corn_label'), reason: t('crop_rotation.rec_corn_reason') };
    else if (lc.includes('soy') || lc.includes('bean'))
      recommendation = { crop: t('crop_rotation.rec_soy_label'), reason: t('crop_rotation.rec_soy_reason') };
    else if (lc.includes('wheat') || lc.includes('barley') || lc.includes('oat'))
      recommendation = { crop: t('crop_rotation.rec_wheat_label'), reason: t('crop_rotation.rec_wheat_reason') };
    else if (lc.includes('canola') || lc.includes('rapeseed'))
      recommendation = { crop: t('crop_rotation.rec_canola_label'), reason: t('crop_rotation.rec_canola_reason') };
    else
      recommendation = { crop: t('crop_rotation.rec_default_label'), reason: t('crop_rotation.rec_default_reason') };
  }

  return { insights, recommendation };
}

// ─── Rotation Wheel SVG ───────────────────────────────────────────────────────
function RotationWheel({ entries }) {
  const { t } = useTranslation();
  const main = [...entries].filter(e => !e.is_cover_crop).sort((a, b) => a.season_year - b.season_year).slice(-6);
  if (main.length < 2) return null;
  const n = main.length;
  const cx = 160, cy = 160, R = 110, nr = 34;

  const pos = main.map((_, i) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-xs mx-auto">
      <defs>
        <marker id="wh-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#9CA3AF" />
        </marker>
      </defs>
      {/* Center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="serif">{t('crop_rotation.wheel_rotation')}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="serif">{t('crop_rotation.wheel_cycle')}</text>

      {/* Arrows */}
      {main.map((_, i) => {
        const from = pos[i], to = pos[(i + 1) % n];
        const dx = to.x - from.x, dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / dist, ny = dy / dist;
        return (
          <line key={i}
            x1={from.x + nx * nr} y1={from.y + ny * nr}
            x2={to.x - nx * (nr + 2)} y2={to.y - ny * (nr + 2)}
            stroke="#D1D5DB" strokeWidth="1.5" markerEnd="url(#wh-arrow)"
          />
        );
      })}

      {/* Nodes */}
      {main.map((entry, i) => {
        const { x, y } = pos[i];
        const s = getCropStyle(entry.crop_name);
        const label = entry.crop_name.length > 9 ? entry.crop_name.slice(0, 9) : entry.crop_name;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={nr} fill={s.bg} stroke={s.border} strokeWidth="2.5" />
            <text x={x} y={y - 8} textAnchor="middle" fontSize="15">{s.icon}</text>
            <text x={x} y={y + 5} textAnchor="middle" fontSize="7.5" fill={s.text} fontWeight="700">{label}</text>
            <text x={x} y={y + 16} textAnchor="middle" fontSize="7" fill="#9CA3AF">{entry.season_year}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── 5-Year Timeline ──────────────────────────────────────────────────────────
function FiveYearTimeline({ entries }) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
  const byYear = Object.fromEntries(entries.map(e => [e.season_year, e]));
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-lora font-bold text-gray-900 text-base mb-3">5-Year Timeline</h3>
      <div className="space-y-1.5">
        {years.map(yr => {
          const crop = byYear[yr];
          if (!crop) return (
            <div key={yr} className="flex items-center gap-3">
              <span className="font-mont text-xs text-gray-400 w-10 text-right shrink-0">{yr}</span>
              <div className="flex-1 h-7 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center px-3">
                <span className="font-mont text-xs text-gray-300">no record</span>
              </div>
            </div>
          );
          const s = getCropStyle(crop.crop_name);
          return (
            <div key={yr} className="flex items-center gap-3">
              <span className="font-mont text-xs font-semibold text-gray-600 w-10 text-right shrink-0">{yr}</span>
              <div className="flex-1 h-7 rounded-lg flex items-center gap-2 px-3"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <span className="text-sm">{s.icon}</span>
                <span className="font-mont text-xs font-semibold truncate" style={{ color: s.text }}>{crop.crop_name}</span>
                {crop.is_cover_crop && <span className="ml-auto font-mont text-xs text-cyan-600 shrink-0">cover</span>}
                {crop.yield_amount && !crop.is_cover_crop && (
                  <span className="ml-auto font-mont text-xs shrink-0" style={{ color: s.text, opacity: 0.7 }}>
                    {crop.yield_amount} {crop.yield_unit}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Season Form ──────────────────────────────────────────────────────────────
function SeasonForm({ fieldId, businessId, editEntry, onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(
    editEntry ? {
      season_year:   editEntry.season_year,
      crop_name:     editEntry.crop_name,
      variety:       editEntry.variety || '',
      planting_date: editEntry.planting_date || '',
      harvest_date:  editEntry.harvest_date || '',
      yield_amount:  editEntry.yield_amount ?? '',
      yield_unit:    editEntry.yield_unit || 'bu/ac',
      is_cover_crop: editEntry.is_cover_crop || false,
      notes:         editEntry.notes || '',
    } : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D8E22] transition';

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.crop_name.trim()) { setError(t('crop_rotation.error_crop_required')); return; }
    setSaving(true); setError('');
    try {
      const url    = editEntry ? `${API_URL}/api/crop-rotation/${editEntry.rotation_id}` : `${API_URL}/api/crop-rotation`;
      const method = editEntry ? 'PUT' : 'POST';
      const body   = editEntry
        ? { season_year: +form.season_year, crop_name: form.crop_name, variety: form.variety || null,
            planting_date: form.planting_date || null, harvest_date: form.harvest_date || null,
            yield_amount: form.yield_amount ? +form.yield_amount : null, yield_unit: form.yield_unit || null,
            is_cover_crop: form.is_cover_crop, notes: form.notes || null }
        : { field_id: +fieldId, business_id: +businessId, season_year: +form.season_year,
            crop_name: form.crop_name, variety: form.variety || null,
            planting_date: form.planting_date || null, harvest_date: form.harvest_date || null,
            yield_amount: form.yield_amount ? +form.yield_amount : null, yield_unit: form.yield_unit || null,
            is_cover_crop: form.is_cover_crop, notes: form.notes || null };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).detail || 'Save failed');
      onSave(await res.json(), !!editEntry);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_rotation.label_season_year')}</label>
          <input type="number" value={form.season_year} onChange={e => set('season_year', e.target.value)}
            min="1900" max="2100" className={inp} required />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_cover_crop} onChange={e => set('is_cover_crop', e.target.checked)}
              className="w-4 h-4 accent-[#6D8E22]" />
            <span className="text-sm font-medium text-gray-700">{t('crop_rotation.label_cover_crop')}</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_rotation.label_crop_name')}</label>
          <input type="text" value={form.crop_name} onChange={e => set('crop_name', e.target.value)}
            placeholder="e.g. Corn, Soybeans, Winter Wheat" className={inp} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_rotation.label_variety')} <span className="text-xs text-gray-400 font-normal">{t('crop_rotation.optional')}</span></label>
          <input type="text" value={form.variety} onChange={e => set('variety', e.target.value)}
            placeholder="e.g. DeKalb DKC52-61" className={inp} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_rotation.label_planting_date')} <span className="text-xs text-gray-400 font-normal">{t('crop_rotation.optional')}</span></label>
          <input type="date" value={form.planting_date} onChange={e => set('planting_date', e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_rotation.label_harvest_date')} <span className="text-xs text-gray-400 font-normal">{t('crop_rotation.optional')}</span></label>
          <input type="date" value={form.harvest_date} onChange={e => set('harvest_date', e.target.value)} className={inp} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_rotation.label_yield')} <span className="text-xs text-gray-400 font-normal">{t('crop_rotation.optional')}</span></label>
          <input type="number" step="0.01" min="0" value={form.yield_amount} onChange={e => set('yield_amount', e.target.value)}
            placeholder="e.g. 185" className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_rotation.label_unit')}</label>
          <select value={form.yield_unit} onChange={e => set('yield_unit', e.target.value)} className={inp}>
            {YIELD_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop_rotation.label_notes')}</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
          rows={3} placeholder="Variety performance, field conditions, issues observed…"
          className={`${inp} resize-none`} />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
          {t('crop_rotation.btn_cancel')}
        </button>
        <button type="submit" disabled={saving}
          className="px-6 py-2 rounded-lg text-white text-sm font-semibold transition disabled:opacity-50"
          style={{ background: '#819360' }}>
          {saving ? t('crop_rotation.btn_saving') : editEntry ? t('crop_rotation.btn_save_changes') : t('crop_rotation.btn_add')}
        </button>
      </div>
    </form>
  );
}

// ─── Season Card ──────────────────────────────────────────────────────────────
function SeasonCard({ entry, onEdit, onDelete }) {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const s = getCropStyle(entry.crop_name);

  return (
    <div className="flex gap-4 items-start">
      {/* Year badge + line */}
      <div className="flex flex-col items-center shrink-0 w-14">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-lora font-bold text-sm border-2"
          style={{ background: s.bg, borderColor: s.border, color: s.text }}>
          {entry.season_year}
        </div>
        <div className="w-0.5 flex-1 mt-1" style={{ background: s.border, opacity: 0.3, minHeight: 20 }} />
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all mb-4">
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-lora font-bold text-gray-900">{s.icon} {entry.crop_name}</span>
                {entry.is_cover_crop && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mont font-semibold bg-cyan-100 text-cyan-700">{t('crop_rotation.card_cover_crop')}</span>
                )}
              </div>
              {entry.variety && (
                <p className="text-sm text-gray-500 font-mont mt-0.5">{t('crop_rotation.card_variety', { variety: entry.variety })}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => onEdit(entry)} title="Edit"
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition text-sm">✏️</button>
              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => onDelete(entry.rotation_id)}
                    className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg font-medium">{t('crop_rotation.card_delete')}</button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-500">{t('crop_rotation.btn_cancel')}</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} title="Delete"
                  className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition text-sm">🗑</button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-mont text-gray-500 mt-2">
            {entry.planting_date && <span>🌱 {t('crop_rotation.card_planted', { date: entry.planting_date })}</span>}
            {entry.harvest_date  && <span>🌾 {t('crop_rotation.card_harvested', { date: entry.harvest_date })}</span>}
            {entry.yield_amount  && <span>📊 {entry.yield_amount} {entry.yield_unit}</span>}
          </div>

          {entry.notes && (
            <p className="text-sm text-gray-600 font-mont mt-3 leading-relaxed border-t border-gray-50 pt-2">{entry.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CropRotation() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate    = useNavigate();
  const businessId  = (() => {
    const raw = searchParams.get('BusinessID');
    if (!raw || raw === 'null' || raw === 'undefined') return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();
  const initFieldId = searchParams.get('FieldID');
  const PeopleID    = localStorage.getItem('PeopleID') || localStorage.getItem('people_id');
  const { Business, LoadBusiness } = useAccount();

  const [fields,      setFields]      = useState([]);
  const [entries,     setEntries]     = useState([]);
  const [activeField, setActiveField] = useState(initFieldId || '');
  const [showForm,    setShowForm]    = useState(false);
  const [editEntry,   setEditEntry]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const autoOpenedRef = useRef(false);
  const [saigeAdvice, setSaigeAdvice] = useState('');
  const [saigeLoading, setSaigeLoading] = useState(false);

  useEffect(() => { if (businessId) LoadBusiness(businessId); }, [businessId]);

  useEffect(() => {
    if (!businessId) return;
    fetch(`${API_URL}/api/fields?business_id=${businessId}`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setFields(list);
        if (!activeField && list.length) setActiveField(String(list[0].fieldid ?? list[0].id));
      })
      .catch(() => {});
  }, [businessId]);

  useEffect(() => {
    if (!businessId || !activeField) return;
    autoOpenedRef.current = false;
    setLoading(true);
    fetch(`${API_URL}/api/crop-rotation?business_id=${businessId}&field_id=${activeField}`)
      .then(r => r.json())
      .then(data => { setEntries(Array.isArray(data) ? data : []); setError(''); })
      .catch(() => setError(t('crop_rotation.error_load')))
      .finally(() => setLoading(false));
  }, [businessId, activeField]);

  // Auto-open the form when the field has no entries yet
  useEffect(() => {
    if (!loading && !error && entries.length === 0 && activeField && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      setEditEntry(null);
      setShowForm(true);
    }
  }, [loading, error, entries.length, activeField]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (activeField) next.set('FieldID', activeField);
    else next.delete('FieldID');
    setSearchParams(next, { replace: true });
  }, [activeField]);

  const handleSave = (saved, isEdit) => {
    setEntries(prev => isEdit
      ? prev.map(e => e.rotation_id === saved.rotation_id ? saved : e)
      : [saved, ...prev]
    );
    setShowForm(false); setEditEntry(null);
  };

  const handleDelete = async id => {
    try {
      await fetch(`${API_URL}/api/crop-rotation/${id}`, { method: 'DELETE' });
      setEntries(prev => prev.filter(e => e.rotation_id !== id));
    } catch {}
  };

  const handleEdit = entry => { setEditEntry(entry); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const askSaige = async () => {
    if (!entries.length) return;
    setSaigeLoading(true);
    setSaigeAdvice('');
    const sorted = [...entries].sort((a, b) => a.season_year - b.season_year);
    const history = sorted.map(e => `${e.season_year}: ${e.crop_name}${e.yield_amount ? ` (${e.yield_amount} ${e.yield_unit})` : ''}`).join(', ');
    const prompt = `I'm reviewing my crop rotation history for one field. Here is the crop sequence: ${history}. Based on this rotation history, what are the soil health implications, disease or pest risks, and what crop should I plant next? Keep it practical and concise.`;
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
      const r = await fetch(`${SAIGE_API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ user_input: prompt, business_id: businessId ? Number(businessId) : undefined }),
      });
      const data = await r.json();
      setSaigeAdvice(data.response || data.message || 'No response from Saige.');
    } catch {
      setSaigeAdvice('Could not reach Saige. Please try again.');
    }
    setSaigeLoading(false);
  };
  const openNew    = ()    => { setEditEntry(null);  setShowForm(true); };
  const closeForm  = ()    => { setShowForm(false);  setEditEntry(null); };

  const sortedEntries = [...entries].sort((a, b) => b.season_year - a.season_year);
  const analysis = analyzeRotation(entries, t);
  const activeFieldObj = fields.find(f => String(f.fieldid ?? f.id) === String(activeField));

  if (!Business) return <div className="p-8 text-gray-500 font-mont">{t('crop_rotation.loading_history')}</div>;

  return (
    <AccountLayout Business={Business} BusinessID={businessId} PeopleID={PeopleID} pageTitle={t('crop_rotation.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to: '/dashboard' }, { label: t('crop_detection.breadcrumb_crops') }, { label: t('crop_rotation.breadcrumb_rotation') }]}>
      <div className="max-w-5xl mx-auto pb-20">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-lora text-3xl font-bold text-gray-900">{t('crop_rotation.heading')}</h1>
            <p className="text-gray-500 font-mont text-sm mt-1">
              {t('crop_rotation.subheading')}
            </p>
          </div>
          {activeField && (
            <button onClick={openNew}
              className="px-5 py-2.5 rounded-lg font-mont font-semibold text-white text-sm shadow-sm hover:opacity-90 transition"
              style={{ background: '#819360' }}>
              {t('crop_rotation.btn_add_season')}
            </button>
          )}
        </div>

        {/* Field selector */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-6 flex flex-wrap items-center gap-4">
          <span className="text-xs font-mont font-semibold text-gray-400 uppercase tracking-wide">{t('crop_rotation.field_label')}</span>
          <select value={activeField} onChange={e => setActiveField(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mont focus:outline-none focus:ring-2 focus:ring-[#6D8E22] transition flex-1 max-w-xs">
            <option value="">{t('crop_rotation.field_select_placeholder')}</option>
            {fields.map(f => {
              const id = f.fieldid ?? f.id;
              return <option key={id} value={id}>{f.name}</option>;
            })}
          </select>
          {activeFieldObj && (
            <button onClick={() => navigate(`/precision-ag/analyses?BusinessID=${businessId}&FieldID=${activeField}`)}
              className="text-xs font-mont font-semibold text-[#6D8E22] hover:underline ml-auto">
              {t('crop_rotation.view_analysis')}
            </button>
          )}
        </div>

        {/* No field selected */}
        {!activeField ? (
          <div className="text-center py-24">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></div>
            <div className="font-lora text-xl text-gray-700">{t('crop_rotation.select_field_prompt')}</div>
          </div>
        ) : (
          <>
            {/* Slide-down form */}
            {showForm && (
              <div className="bg-white rounded-xl border-2 border-[#6D8E22] shadow-lg p-6 mb-8">
                <h2 className="font-lora font-bold text-gray-900 text-lg mb-4">
                  {editEntry ? t('crop_rotation.editing_header', { crop: editEntry.crop_name, year: editEntry.season_year }) : t('crop_rotation.add_season_header')}
                </h2>
                <SeasonForm
                  fieldId={activeField}
                  businessId={businessId}
                  editEntry={editEntry}
                  onSave={handleSave}
                  onCancel={closeForm}
                />
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm">{t('crop_rotation.loading_history')}</div>
            ) : error ? (
              <div className="text-center py-16 text-red-500 font-mont text-sm">{error}</div>
            ) : entries.length === 0 ? null : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Current season + Timeline */}
                <div className="lg:col-span-2">
                  {/* Most recent entry — featured */}
                  {sortedEntries[0] && (() => {
                    const cur = sortedEntries[0];
                    const s = getCropStyle(cur.crop_name);
                    return (
                      <div className="rounded-xl border-2 p-5 mb-6 flex items-start justify-between gap-4"
                        style={{ borderColor: s.border, background: s.bg }}>
                        <div>
                          <div className="text-xs font-mont font-semibold uppercase tracking-widest mb-1"
                            style={{ color: s.text, opacity: 0.7 }}>{t('crop_rotation.current_season')}</div>
                          <div className="font-lora font-bold text-2xl mb-1" style={{ color: s.text }}>
                            {s.icon} {cur.crop_name}
                            {cur.is_cover_crop && <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-mont font-semibold bg-cyan-100 text-cyan-700">Cover Crop</span>}
                          </div>
                          {cur.variety && <div className="text-sm font-mont mb-1" style={{ color: s.text }}>{cur.variety}</div>}
                          <div className="flex flex-wrap gap-4 text-xs font-mont mt-2" style={{ color: s.text, opacity: 0.8 }}>
                            <span className="font-semibold">{cur.season_year}</span>
                            {cur.planting_date && <span>🌱 {t('crop_rotation.card_planted', { date: cur.planting_date })}</span>}
                            {cur.harvest_date  && <span>🌾 {t('crop_rotation.card_harvested', { date: cur.harvest_date })}</span>}
                            {cur.yield_amount  && <span>📊 {cur.yield_amount} {cur.yield_unit}</span>}
                          </div>
                          {cur.notes && <p className="text-xs font-mont mt-2" style={{ color: s.text, opacity: 0.75 }}>{cur.notes}</p>}
                        </div>
                        <button onClick={() => handleEdit(cur)}
                          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-mont font-semibold border transition hover:opacity-80"
                          style={{ borderColor: s.border, color: s.text, background: 'rgba(255,255,255,0.5)' }}>
                          {t('crop_rotation.btn_edit')}
                        </button>
                      </div>
                    );
                  })()}

                  <h2 className="font-lora font-bold text-gray-900 text-xl mb-4">{t('crop_rotation.season_history')}</h2>
                  <div>
                    {sortedEntries.map(entry => (
                      <SeasonCard
                        key={entry.rotation_id}
                        entry={entry}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Wheel + Analysis */}
                <div className="space-y-6">

                  {/* 5-year timeline */}
                  <FiveYearTimeline entries={entries} />

                  {/* Rotation wheel */}
                  {entries.filter(e => !e.is_cover_crop).length >= 2 && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                      <h3 className="font-lora font-bold text-gray-900 text-base mb-3 text-center">{t('crop_rotation.rotation_cycle')}</h3>
                      <RotationWheel entries={entries} />
                    </div>
                  )}

                  {/* Analysis */}
                  {analysis && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
                      <h3 className="font-lora font-bold text-gray-900 text-base">{t('crop_rotation.rotation_analysis')}</h3>

                      {analysis.insights.map((ins, i) => (
                        <div key={i} className={`flex gap-3 rounded-lg p-3 text-sm font-mont ${ins.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
                          <span className="shrink-0">{ins.type === 'warning' ? '⚠️' : '✅'}</span>
                          <span className={ins.type === 'warning' ? 'text-amber-800' : 'text-green-800'}>{ins.text}</span>
                        </div>
                      ))}

                      {analysis.recommendation && (
                        <div className="rounded-lg p-4 border-2 border-[#6D8E22] bg-[#f0f5e8]">
                          <div className="text-xs font-mont font-semibold text-[#6D8E22] uppercase tracking-wide mb-1">{t('crop_rotation.recommended_next')}</div>
                          <div className="font-lora font-bold text-gray-900 text-base mb-1">
                            {getCropStyle(analysis.recommendation.crop).icon} {analysis.recommendation.crop}
                          </div>
                          <p className="text-xs font-mont text-gray-600">{analysis.recommendation.reason}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Saige rotation advisor */}
                  {entries.length >= 1 && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-lora font-bold text-gray-900 text-base">Ask Saige</h3>
                          <p className="text-xs font-mont text-gray-500 mt-0.5">AI rotation advisor — soil health, disease risk, next crop</p>
                        </div>
                        <button
                          onClick={askSaige}
                          disabled={saigeLoading}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                          style={{ background: saigeLoading ? '#9ca3af' : '#6D8E22', transition: 'background 0.2s' }}>
                          {saigeLoading ? (
                            <>
                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 40" />
                              </svg>
                              Asking…
                            </>
                          ) : '🌱 Get Advice'}
                        </button>
                      </div>
                      {saigeAdvice && (
                        <div className="rounded-lg bg-[#f0f5e8] border border-[#c3d9a2] p-4 text-sm font-mont text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {saigeAdvice}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Field quick stats */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-lora font-bold text-gray-900 text-base mb-3">{t('crop_rotation.field_summary')}</h3>
                    <div className="space-y-2 text-sm font-mont text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('crop_rotation.seasons_recorded')}</span>
                        <span className="font-semibold text-gray-900">{entries.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('crop_rotation.main_crops')}</span>
                        <span className="font-semibold text-gray-900">{entries.filter(e => !e.is_cover_crop).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('crop_rotation.cover_crops_count')}</span>
                        <span className="font-semibold text-gray-900">{entries.filter(e => e.is_cover_crop).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('crop_rotation.unique_crops')}</span>
                        <span className="font-semibold text-gray-900">
                          {new Set(entries.map(e => e.crop_name.toLowerCase())).size}
                        </span>
                      </div>
                      {entries.some(e => e.yield_amount) && (
                        <div className="flex justify-between">
                          <span>{t('crop_rotation.avg_yield')}</span>
                          <span className="font-semibold text-gray-900">
                            {(entries.filter(e => e.yield_amount).reduce((s, e) => s + e.yield_amount, 0) / entries.filter(e => e.yield_amount).length).toFixed(1)}
                            {' '}{entries.find(e => e.yield_amount)?.yield_unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
