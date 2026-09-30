import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API_URL = import.meta.env.VITE_API_URL;

const CI = ({ children }) => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', flexShrink: 0 }}>
    {children}
  </svg>
);

const CATEGORIES = [
  { value: 'Observation',       tKey: 'cat_observation',       icon: <CI><ellipse cx="8" cy="8" rx="6" ry="4"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="8" r="0.8" fill="currentColor" stroke="none"/></CI>,  color: '#6D8E22', bg: '#f0f5e8' },
  { value: 'Planting',          tKey: 'cat_planting',          icon: <CI><path d="M8 14V9"/><path d="M4 6c0-2.5 2-4 4-4s4 1.5 4 4-2 3-4 3-4-.5-4-3z"/></CI>,  color: '#2E7D32', bg: '#e8f5e9' },
  { value: 'Spray Application', tKey: 'cat_spray_application', icon: <CI><path d="M4 13V7a4 4 0 0 1 8 0v6"/><line x1="6" y1="7" x2="10" y2="7"/><path d="M8 4V2"/><line x1="6" y1="13" x2="10" y2="13"/></CI>,  color: '#1565C0', bg: '#e3f2fd' },
  { value: 'Irrigation',        tKey: 'cat_irrigation',        icon: <CI><path d="M8 2c0 4-5 6-5 9a5 5 0 0 0 10 0c0-3-5-5-5-9z"/></CI>,  color: '#0277BD', bg: '#e1f5fe' },
  { value: 'Harvest',           tKey: 'cat_harvest',           icon: <CI><path d="M2 12c2-2 4-2 6 0s4 2 6 0"/><path d="M5 9a3 3 0 0 1 6 0"/><line x1="8" y1="6" x2="8" y2="2"/></CI>,  color: '#F57F17', bg: '#fffde7' },
  { value: 'Scouting',          tKey: 'cat_scouting',          icon: <CI><circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="14" y2="14"/></CI>,  color: '#6A1B9A', bg: '#f3e5f5' },
  { value: 'Pest',              tKey: 'cat_pest',              icon: <CI><ellipse cx="8" cy="9" rx="3" ry="4"/><circle cx="8" cy="4" r="2"/><path d="M5 6l-2-2M11 6l2-2M5 10l-2 1M11 10l2 1"/></CI>,  color: '#B71C1C', bg: '#ffebee' },
  { value: 'Disease',           tKey: 'cat_disease',           icon: <CI><circle cx="8" cy="8" r="5"/><circle cx="6" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="10" r="1" fill="currentColor" stroke="none"/></CI>,  color: '#AD1457', bg: '#fce4ec' },
  { value: 'Weed',              tKey: 'cat_weed',              icon: <CI><path d="M8 14V8"/><path d="M8 10c0-3 3-5 5-4"/><path d="M8 8c0-3-3-5-5-4"/></CI>,  color: '#388E3C', bg: '#e8f5e9' },
  { value: 'Nutrient',          tKey: 'cat_nutrient',          icon: <CI><path d="M6 2h4l1 4H5z"/><path d="M5 6l-1 7h8l-1-7"/></CI>, color: '#5D4037', bg: '#efebe9' },
  { value: 'Equipment',         tKey: 'cat_equipment',         icon: <CI><path d="M13 3a3.5 3.5 0 0 0-4.2 3.5L2.5 12.5a1.5 1.5 0 1 0 2 2L10 9a3.5 3.5 0 1 0 3-6z"/><circle cx="12.5" cy="3.5" r="1"/></CI>,  color: '#4E342E', bg: '#efebe9' },
  { value: 'Weather',           tKey: 'cat_weather',           icon: <CI><path d="M11 6a3 3 0 0 0-6 0 2.5 2.5 0 0 0 0 5h6a2.5 2.5 0 0 0 0-5z"/></CI>, color: '#0288D1', bg: '#e1f5fe' },
  { value: 'General',           tKey: 'cat_general',           icon: <CI><rect x="4" y="2" width="8" height="12" rx="1"/><path d="M6 2V1h4v1"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="8.5" x2="10" y2="8.5"/></CI>,  color: '#546E7A', bg: '#eceff1' },
];

// Scouting-style categories surface severity/GPS/photo inputs and a severity badge.
const SCOUTING_CATEGORIES = new Set(['Scouting', 'Pest', 'Disease', 'Weed', 'Nutrient', 'Irrigation', 'Weather']);

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const SEV_COLOR  = { Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Critical: '#EF4444' };

const EMPTY_FORM = {
  note_date: new Date().toISOString().slice(0, 10),
  category:  'Observation',
  title:     '',
  content:   '',
  severity:  '',
  latitude:  '',
  longitude: '',
  image_url: '',
};

function getCat(value) {
  return CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function groupByDate(notes) {
  const groups = {};
  notes.forEach(n => {
    const key = n.note_date || 'Unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

// ─── Journal Templates ────────────────────────────────────────────────────────
const JOURNAL_TEMPLATES = [
  {
    id: 'scouting',
    label: 'Weekly Scouting',
    category: 'Scouting',
    title: 'Weekly Crop Scouting — {date}',
    content: `Crop Stage: [e.g., V6 / Tillering / Heading]
Overall Canopy Health: [Good / Fair / Poor]

PEST PRESSURE
• Insects observed: [species, count/100 plants or per trap]
• Threshold reached: [Yes / No]
• Action required: [None / Monitor / Treat]

DISEASE
• Signs/symptoms: [describe or None]
• Severity: [0–10% / 10–25% / >25%]

WEED PRESSURE
• Dominant species: [describe]
• Coverage: [light / moderate / heavy]

CROP STRESS INDICATORS
• Nutrient deficiency signs: [None / Nitrogen / Phosphorus / describe]
• Moisture stress: [None / Mild / Severe]

RECOMMENDED ACTIONS
1.
2.

NEXT SCOUTING DATE: `,
  },
  {
    id: 'spray',
    label: 'Spray Application',
    category: 'Spray Application',
    title: 'Spray Application — {date}',
    content: `PRODUCT & RATE
• Product name:
• EPA Reg #:
• Rate: [oz/ac or L/ha]
• Carrier volume: [GPA or L/ha]
• Tank mix: [additional products or None]

APPLICATION
• Operator:
• Equipment:
• Nozzle type & pressure:
• Start time:          End time:
• Field area treated: [ha]

WEATHER CONDITIONS
• Temperature: [°F / °C]
• Wind speed & direction:
• Relative humidity:
• Inversion present: [Yes / No]

TARGET
• Pest / Disease / Weed:
• Crop stage at application:

RESTRICTIONS
• Re-entry interval (REI): [hrs]
• Pre-harvest interval (PHI): [days]

NOTES: `,
  },
  {
    id: 'planting',
    label: 'Planting Record',
    category: 'Planting',
    title: 'Planting Record — {date}',
    content: `SEED
• Variety / Hybrid:
• Seed lot #:
• Germination rate: [%]
• Seed treatment: [Fungicide / Insecticide / None]

PLANTING PARAMETERS
• Seeding rate: [seeds/ac or kg/ha]
• Row spacing: [inches / cm]
• Seeding depth: [inches / cm]
• Equipment:

FIELD CONDITIONS AT PLANTING
• Soil temperature (2"): [°F / °C]
• Soil moisture: [Dry / Adequate / Wet]
• Seedbed tilth: [Excellent / Good / Fair]
• Previous crop:

FERTILIZER AT PLANTING
• Starter fertilizer: [product, rate, or None]
• In-furrow: [product or None]

TARGET POPULATION: [plants/ac or /ha]
ACTUAL POPULATION CHECK: [to be filled after emergence]

NOTES: `,
  },
  {
    id: 'irrigation',
    label: 'Irrigation Event',
    category: 'Irrigation',
    title: 'Irrigation Event — {date}',
    content: `SYSTEM & SCHEDULE
• Irrigation system type: [Drip / Pivot / Furrow / Flood / Sprinkler]
• Zone / Set #:
• Start time:          End time:
• Duration: [hrs]

APPLICATION
• Water applied: [inches / mm]
• Flow rate: [GPM or m³/hr]
• System pressure: [PSI or bar]

SOIL MOISTURE (before)
• Sensor readings or feel method: [Dry / Adequate / Field Capacity]
• Deficit before irrigation: [inches / mm]

WATER SOURCE
• Source: [Well / Canal / Pond / Municipal]
• EC (if known): [dS/m]

POST-IRRIGATION NOTES
• Runoff observed: [Yes / No]
• Ponding: [Yes / No]
• Uniformity: [Excellent / Good / Poor]

NEXT IRRIGATION SCHEDULED:
NOTES: `,
  },
  {
    id: 'harvest',
    label: 'Harvest Record',
    category: 'Harvest',
    title: 'Harvest Record — {date}',
    content: `CROP & VARIETY
• Crop:
• Variety / Hybrid:
• Planting date:

YIELD
• Estimated yield: [bu/ac, lb/ac, or t/ha]
• Actual yield (weigh ticket):
• Moisture at harvest: [%]
• Test weight / Quality grade:

HARVEST OPERATION
• Equipment:
• Operator(s):
• Start time:          End time:
• Acres harvested today:

CONDITIONS
• Weather:
• Field conditions: [Dry / Muddy / Average]
• Header height:
• Cylinder/rotor speed:
• Harvest loss estimate: [bu/ac]

STORAGE / MARKETING
• Storage location:
• Drying required: [Yes / No] — Target moisture: [%]
• Delivered to:

NOTES: `,
  },
  {
    id: 'soil',
    label: 'Soil Observation',
    category: 'Observation',
    title: 'Soil Observation — {date}',
    content: `VISUAL ASSESSMENT
• Soil color: [dark brown / light tan / reddish / describe]
• Texture feel: [Sandy / Loamy / Clayey]
• Structure: [Granular / Blocky / Platy / Massive]
• Tilth: [Excellent / Good / Fair / Poor]

COMPACTION
• Surface crusting: [None / Mild / Severe]
• Hard-pan depth (if probed): [inches / cm or N/A]
• Penetration resistance: [easy / moderate / hard with probe]

BIOLOGICAL ACTIVITY
• Earthworms per sq ft (12" deep):
• Fungal hyphae visible: [Yes / No]
• Crop residue decomposition: [Good / Slow]

CHEMISTRY (if tested)
• pH:
• EC: [dS/m]
• Nitrate-N: [ppm]
• Organic matter: [%]

MOISTURE PROFILE
• 0–6": [Dry / Moist / Wet]
• 6–12":
• 12–24":

RECOMMENDATIONS:

NOTES: `,
  },
];

// ─── NoteForm ─────────────────────────────────────────────────────────────────
function NoteForm({ fields, initialFieldId, businessId, peopleId, editNote, onSave, onCancel, templateInit }) {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState(
    editNote
      ? {
          note_date: editNote.note_date,
          category:  editNote.category,
          title:     editNote.title,
          content:   editNote.content,
          severity:  editNote.severity  ?? '',
          latitude:  editNote.latitude  ?? '',
          longitude: editNote.longitude ?? '',
          image_url: editNote.image_url ?? '',
        }
      : templateInit
      ? {
          ...EMPTY_FORM,
          category: templateInit.category,
          title:    templateInit.title.replace('{date}', today),
          content:  templateInit.content,
        }
      : EMPTY_FORM
  );
  const [fieldId, setFieldId] = useState(initialFieldId || (fields[0] ? String(fields[0].fieldid ?? fields[0].id) : ''));
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const textareaRef  = useRef(null);
  const fileInputRef = useRef(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError,   setGpsError]   = useState('');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [form.content]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePhotoChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(p => ({ ...p, image_url: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleGpsDetect = () => {
    if (!navigator.geolocation) { setGpsError('Geolocation not supported by your browser'); return; }
    setGpsLoading(true); setGpsError('');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(p => ({
          ...p,
          latitude:  pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGpsLoading(false);
      },
      () => { setGpsError('Could not get location — check browser permissions.'); setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { setError(t('oatsense_notes.form_error_required')); return; }
    setSaving(true); setError('');
    try {
      const url    = editNote ? `${API_URL}/api/notes/${editNote.note_id}` : `${API_URL}/api/notes`;
      const method = editNote ? 'PUT' : 'POST';
      const isScouting = SCOUTING_CATEGORIES.has(form.category);
      const sharedFields = {
        note_date: form.note_date,
        category:  form.category,
        title:     form.title,
        content:   form.content,
        severity:  isScouting && form.severity ? form.severity : null,
        latitude:  form.latitude  !== '' ? parseFloat(form.latitude)  : null,
        longitude: form.longitude !== '' ? parseFloat(form.longitude) : null,
        image_url: form.image_url || null,
      };
      const body = editNote
        ? sharedFields
        : { ...sharedFields, field_id: parseInt(fieldId), business_id: parseInt(businessId), people_id: peopleId ? parseInt(peopleId) : null };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).detail || 'Save failed');
      const saved = await res.json();
      onSave(saved, !!editNote);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D8E22] transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}

      {!editNote && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('oatsense_notes.form_label_field')}</label>
          <select value={fieldId} onChange={e => setFieldId(e.target.value)} className={inputCls} required>
            <option value="">{t('oatsense_notes.form_select_field')}</option>
            {fields.map(f => {
              const id = f.fieldid ?? f.id;
              return <option key={id} value={id}>{f.name}</option>;
            })}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('oatsense_notes.form_label_date')}</label>
          <input type="date" name="note_date" value={form.note_date} onChange={handleChange} className={inputCls} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('oatsense_notes.form_label_category')}</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.icon} {t('oatsense_notes.' + c.tKey)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('oatsense_notes.form_label_title')}</label>
        <input type="text" name="title" value={form.title} onChange={handleChange}
          placeholder={t('oatsense_notes.form_title_placeholder')}
          className={inputCls} required />
      </div>

      {SCOUTING_CATEGORIES.has(form.category) && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
          <div className="text-xs font-semibold font-mont text-gray-500 uppercase tracking-wide">{t('oatsense_notes.form_scouting_details')}</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('oatsense_notes.form_label_severity')}</label>
              <select name="severity" value={form.severity} onChange={handleChange} className={inputCls}>
                <option value="">{t('oatsense_notes.form_severity_none')}</option>
                {SEVERITIES.map(s => <option key={s} value={s}>{t('oatsense_notes.sev_' + s.toLowerCase())}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
              <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="14" height="10" rx="1.5"/><circle cx="8" cy="9" r="2.5"/><path d="M5 4l1-2h4l1 2"/></svg>
                  Choose Photo
                </button>
                {form.image_url && (
                  <div className="relative">
                    <img src={form.image_url} className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                      onError={e => e.currentTarget.style.display = 'none'} alt="" />
                    <button type="button" onClick={() => setForm(p => ({ ...p, image_url: '' }))}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none">×</button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('oatsense_notes.form_label_latitude')}</label>
                  <input type="number" step="any" name="latitude" value={form.latitude} onChange={handleChange}
                    placeholder="e.g. 42.34521" className={inputCls} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('oatsense_notes.form_label_longitude')}</label>
                  <input type="number" step="any" name="longitude" value={form.longitude} onChange={handleChange}
                    placeholder="e.g. -85.12734" className={inputCls} />
                </div>
                <button type="button" onClick={handleGpsDetect} disabled={gpsLoading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 shrink-0">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2"/><circle cx="8" cy="8" r="5.5" strokeDasharray="2 2"/></svg>
                  {gpsLoading ? 'Detecting…' : 'Auto GPS'}
                </button>
              </div>
              {gpsError && <p className="text-xs text-red-500 mt-1">{gpsError}</p>}
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('oatsense_notes.form_label_content')}</label>
        <textarea
          ref={textareaRef}
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder={t('oatsense_notes.form_content_placeholder')}
          className={`${inputCls} resize-none overflow-hidden min-h-[120px]`}
          required
        />
        <div className="text-xs text-gray-400 mt-1 text-right">{t('oatsense_notes.form_char_count', { count: form.content.length })}</div>
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
          {t('oatsense_notes.btn_cancel')}
        </button>
        <button type="submit" disabled={saving}
          className="px-6 py-2 rounded-lg text-white text-sm font-semibold transition disabled:opacity-50"
          style={{ background: '#819360' }}>
          {saving ? t('oatsense_notes.btn_saving') : editNote ? t('oatsense_notes.btn_save_changes') : t('oatsense_notes.btn_add_entry')}
        </button>
      </div>
    </form>
  );
}

// ─── NoteCard ─────────────────────────────────────────────────────────────────
function NoteCard({ note, fieldName, onEdit, onDelete }) {
  const { t } = useTranslation();
  const [expanded,      setExpanded]      = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cat    = getCat(note.category);
  const isLong = note.content.length > 220;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full font-mont"
                style={{ background: cat.bg, color: cat.color, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                {cat.icon} {t('oatsense_notes.' + cat.tKey)}
              </span>
              {note.severity && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full font-mont"
                  style={{ background: (SEV_COLOR[note.severity] || '#9CA3AF') + '22', color: SEV_COLOR[note.severity] || '#374151' }}>
                  {note.severity}
                </span>
              )}
              {fieldName && (
                <span className="text-xs text-gray-400 font-mont">📍 {fieldName}</span>
              )}
              {(note.latitude != null && note.longitude != null) && (
                <span className="text-xs text-gray-400 font-mont">
                  {Number(note.latitude).toFixed(5)}, {Number(note.longitude).toFixed(5)}
                </span>
              )}
            </div>
            <h3 className="font-lora font-bold text-gray-900 text-base leading-snug">{note.title}</h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onEdit(note)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              title={t('oatsense_notes.card_edit_title')}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2l3 3-8 8H3v-3z"/></svg>
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button onClick={() => onDelete(note.note_id)}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg font-medium">{t('oatsense_notes.btn_delete')}</button>
                <button onClick={() => setConfirmDelete(false)}
                  className="text-xs px-2 py-1 border border-gray-200 rounded-lg text-gray-500">{t('oatsense_notes.btn_cancel_delete')}</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                title={t('oatsense_notes.card_delete_title')}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 4 4 4 14 4"/><path d="M5 4V2.5h6V4"/><path d="M4 4l1 9h6l1-9"/></svg>
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 font-mont leading-relaxed whitespace-pre-wrap">
          {!expanded && isLong ? note.content.slice(0, 220) + '…' : note.content}
        </p>
        {isLong && (
          <button onClick={() => setExpanded(p => !p)}
            className="mt-1.5 text-xs text-[#6D8E22] font-mont font-semibold hover:underline">
            {expanded ? t('oatsense_notes.btn_show_less') : t('oatsense_notes.btn_read_more')}
          </button>
        )}
        {note.image_url && (
          <img src={note.image_url}
            className="mt-3 w-48 h-32 object-cover rounded-lg border border-gray-100"
            alt={t('oatsense_notes.img_alt')}
            onError={e => e.currentTarget.style.display = 'none'} />
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OatSenseNotes() {
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

  const [fields,           setFields]           = useState([]);
  const [notes,            setNotes]            = useState([]);
  const [activeField,      setActiveField]      = useState(initFieldId || 'all');
  const [catFilter,        setCatFilter]        = useState('all');
  const [showForm,         setShowForm]         = useState(false);
  const [editNote,         setEditNote]         = useState(null);
  const [activeTemplate,   setActiveTemplate]   = useState(null);
  const [showTemplatePick, setShowTemplatePick] = useState(false);
  const [loadingNotes,     setLoadingNotes]     = useState(false);
  const [error,            setError]            = useState('');

  useEffect(() => { if (businessId) LoadBusiness(businessId); }, [businessId]);

  useEffect(() => {
    if (!businessId) return;
    fetch(`${API_URL}/api/fields?business_id=${businessId}`)
      .then(r => r.json())
      .then(data => setFields(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [businessId]);

  useEffect(() => {
    if (!businessId) return;
    setLoadingNotes(true);
    const params = new URLSearchParams({ business_id: businessId });
    if (activeField && activeField !== 'all') params.set('field_id', activeField);
    if (catFilter   && catFilter   !== 'all') params.set('category', catFilter);
    fetch(`${API_URL}/api/notes?${params}`)
      .then(r => r.json())
      .then(data => { setNotes(Array.isArray(data) ? data : []); setError(''); })
      .catch(() => setError(t('oatsense_notes.error_load')))
      .finally(() => setLoadingNotes(false));
  }, [businessId, activeField, catFilter]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (activeField && activeField !== 'all') next.set('FieldID', activeField);
    else next.delete('FieldID');
    setSearchParams(next, { replace: true });
  }, [activeField]);

  const getFieldName = id => {
    const f = fields.find(f => String(f.fieldid ?? f.id) === String(id));
    return f?.name ?? '';
  };

  const handleSave = (saved, isEdit) => {
    if (isEdit) {
      setNotes(prev => prev.map(n => n.note_id === saved.note_id ? saved : n));
    } else {
      setNotes(prev => [saved, ...prev]);
    }
    setShowForm(false);
    setEditNote(null);
  };

  const handleDelete = async noteId => {
    try {
      await fetch(`${API_URL}/api/notes/${noteId}`, { method: 'DELETE' });
      setNotes(prev => prev.filter(n => n.note_id !== noteId));
    } catch {}
  };

  const handleEdit = note => {
    setEditNote(note);
    setActiveTemplate(null);
    setShowTemplatePick(false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openNew  = () => { setEditNote(null); setActiveTemplate(null); setShowTemplatePick(true); setShowForm(false); };
  const closeForm = () => { setShowForm(false); setShowTemplatePick(false); setEditNote(null); setActiveTemplate(null); };
  const startBlank = () => { setActiveTemplate(null); setShowTemplatePick(false); setShowForm(true); };
  const startTemplate = (tpl) => { setActiveTemplate(tpl); setShowTemplatePick(false); setShowForm(true); };

  const grouped = groupByDate(notes);
  const activeFieldObj = activeField !== 'all'
    ? fields.find(f => String(f.fieldid ?? f.id) === String(activeField))
    : null;

  if (!Business) return <div className="p-8 text-gray-500 font-mont">{t('oatsense.loading')}</div>;

  return (
    <AccountLayout Business={Business} BusinessID={businessId} PeopleID={PeopleID} pageTitle={t('oatsense_notes.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to: '/dashboard' }, { label: t('oatsense_notes.breadcrumb_oatsense') }, { label: t('oatsense_notes.breadcrumb_journal') }]}>
      <div className="max-w-4xl mx-auto pb-20">

        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-lora text-3xl font-bold text-gray-900">{t('oatsense_notes.heading')}</h1>
            <p className="text-gray-500 font-mont text-sm mt-1">
              {t('oatsense_notes.subheading')}
            </p>
          </div>
          <button onClick={openNew}
            className="px-5 py-2.5 rounded-lg font-mont font-semibold text-white text-sm shadow-sm transition-all hover:opacity-90"
            style={{ background: '#819360' }}>
            {t('oatsense_notes.btn_new_entry')}
          </button>
        </div>

        {/* Template picker */}
        {showTemplatePick && (
          <div className="bg-white rounded-xl border-2 border-[#6D8E22] shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-lora font-bold text-gray-900 text-lg">Choose a Template</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <p className="text-sm text-gray-500 font-mont mb-5">Start from a structured template or open a blank entry.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <button
                onClick={startBlank}
                className="flex flex-col items-start p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#6D8E22] hover:bg-[#f8faf2] transition text-left"
              >
                <span className="text-2xl mb-2">📝</span>
                <span className="font-semibold text-sm text-gray-800">Blank Entry</span>
                <span className="text-xs text-gray-400 mt-0.5">Free-form note</span>
              </button>
              {JOURNAL_TEMPLATES.map(tpl => {
                const cat = getCat(tpl.category);
                return (
                  <button
                    key={tpl.id}
                    onClick={() => startTemplate(tpl)}
                    className="flex flex-col items-start p-4 rounded-xl border-2 border-gray-100 hover:border-[#6D8E22] hover:bg-[#f8faf2] transition text-left"
                    style={{ borderColor: cat.color + '40' }}
                  >
                    <span className="text-xl mb-2" style={{ color: cat.color }}>{cat.icon}</span>
                    <span className="font-semibold text-sm text-gray-800">{tpl.label}</span>
                    <span className="text-xs mt-0.5" style={{ color: cat.color }}>{tpl.category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Slide-down form */}
        {showForm && (
          <div className="bg-white rounded-xl border-2 border-[#6D8E22] shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-lora font-bold text-gray-900 text-lg flex-1">
                {editNote ? t('oatsense_notes.editing_title', { title: editNote.title }) : activeTemplate ? activeTemplate.label : t('oatsense_notes.new_entry_heading')}
              </h2>
              {!editNote && (
                <button onClick={() => { setShowForm(false); setShowTemplatePick(true); }} className="text-xs text-[#6D8E22] hover:underline font-mont">
                  ← Change template
                </button>
              )}
            </div>
            <NoteForm
              fields={fields}
              initialFieldId={activeField !== 'all' ? activeField : initFieldId || ''}
              businessId={businessId}
              peopleId={PeopleID}
              editNote={editNote}
              templateInit={activeTemplate}
              onSave={handleSave}
              onCancel={closeForm}
            />
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 mb-6 space-y-3">
          {/* Field selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mont font-semibold text-gray-400 uppercase tracking-wide w-12">{t('oatsense_notes.filter_field_label')}</span>
            <select
              value={activeField}
              onChange={e => setActiveField(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mont focus:outline-none focus:ring-2 focus:ring-[#6D8E22] transition flex-1 max-w-xs"
            >
              <option value="all">{t('oatsense_notes.filter_all_fields')}</option>
              {fields.map(f => {
                const id = f.fieldid ?? f.id;
                return <option key={id} value={id}>{f.name}</option>;
              })}
            </select>
            {activeFieldObj && (
              <button
                onClick={() => navigate(`/precision-ag/analyses?BusinessID=${businessId}&FieldID=${activeField}`)}
                className="text-xs font-mont font-semibold text-[#6D8E22] hover:underline ml-auto">
                {t('oatsense_notes.view_analysis_link')}
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mont font-semibold text-gray-400 uppercase tracking-wide w-12">{t('oatsense_notes.filter_type_label')}</span>
            <button
              onClick={() => setCatFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-mont font-semibold transition ${catFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('oatsense_notes.filter_all')}
            </button>
            {CATEGORIES.map(c => (
              <button key={c.value}
                onClick={() => setCatFilter(catFilter === c.value ? 'all' : c.value)}
                className="px-3 py-1 rounded-full text-xs font-mont font-semibold transition"
                style={catFilter === c.value
                  ? { background: c.color, color: 'white', display: 'inline-flex', alignItems: 'center', gap: 3 }
                  : { background: c.bg, color: c.color, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                {c.icon} {t('oatsense_notes.' + c.tKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Active field banner */}
        {activeFieldObj && (
          <div className="flex items-center gap-3 bg-[#f0f5e8] border border-[#c5d98a] rounded-xl px-5 py-3 mb-6 flex-wrap">
            <span className="text-[#6D8E22] font-lora font-bold flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 1a4.5 4.5 0 0 0-4.5 4.5C3.5 9 8 15 8 15s4.5-6 4.5-9.5A4.5 4.5 0 0 0 8 1z"/><circle cx="8" cy="5.5" r="1.5"/></svg>
              {activeFieldObj.name}
            </span>
            {activeFieldObj.crop_type && (
              <span className="text-sm text-gray-500 font-mont flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14V9"/><path d="M4 6c0-2.5 2-4 4-4s4 1.5 4 4-2 3-4 3-4-.5-4-3z"/></svg>
                {activeFieldObj.crop_type}
              </span>
            )}
            {activeFieldObj.field_size_hectares && (
              <span className="text-sm text-gray-500 font-mont">{activeFieldObj.field_size_hectares} ha</span>
            )}
          </div>
        )}

        {/* Notes timeline */}
        {loadingNotes ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm">{t('oatsense_notes.loading_entries')}</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 font-mont text-sm">{error}</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-24">
            <div className="flex justify-center mb-4 text-gray-300">
            <svg width="56" height="56" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="1" width="10" height="14" rx="1"/><path d="M5 1V0h6v1"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="7.5" x2="11" y2="7.5"/><line x1="5" y1="10" x2="9" y2="10"/></svg>
          </div>
            <div className="font-lora text-2xl text-gray-700 mb-2">{t('oatsense_notes.no_entries_heading')}</div>
            <div className="font-mont text-sm text-gray-400 mb-6">
              {catFilter !== 'all' || activeField !== 'all'
                ? t('oatsense_notes.no_entries_filters')
                : t('oatsense_notes.no_entries_empty')}
            </div>
            {catFilter === 'all' && activeField === 'all' && (
              <button onClick={openNew}
                className="px-6 py-2.5 rounded-lg text-white font-mont font-semibold text-sm"
                style={{ background: '#819360' }}>
                {t('oatsense_notes.btn_first_entry')}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([dateKey, dayNotes]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="font-lora font-bold text-gray-400 text-sm whitespace-nowrap">
                    {formatDate(dateKey)}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <div className="space-y-3">
                  {dayNotes.map(note => (
                    <NoteCard
                      key={note.note_id}
                      note={note}
                      fieldName={activeField === 'all' ? getFieldName(note.field_id) : ''}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center text-xs text-gray-300 font-mont pt-4">
              {t(notes.length === 1 ? 'oatsense_notes.entries_count_one' : 'oatsense_notes.entries_count_other', { count: notes.length })}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
