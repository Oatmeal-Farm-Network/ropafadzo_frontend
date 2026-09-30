import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, API_URL } from './precisionAgUtils';

const CATEGORIES = ['General', 'Pest', 'Disease', 'Weed', 'Irrigation', 'Nutrient', 'Weather'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

const SEV_COLOR = { Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Critical: '#EF4444' };
const CAT_ICON = {
  General:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Pest:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8c-1 0-2 .5-2 1.5S11 11 12 11s2-.5 2-1.5S13 8 12 8z"/><path d="M12 11v5"/><path d="M7 8l-3-2"/><path d="M17 8l3-2"/><path d="M9.5 16.5L7 19"/><path d="M14.5 16.5L17 19"/><ellipse cx="12" cy="9" rx="4" ry="5"/></svg>,
  Disease:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>,
  Weed:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></svg>,
  Irrigation:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L5 10a7 7 0 1 0 14 0L12 2z"/></svg>,
  Nutrient:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>,
  Weather:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/></svg>,
};

function ScoutCard({ scout, onDelete }) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const sevColor = SEV_COLOR[scout.severity] || '#9CA3AF';
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
      <div className="flex-shrink-0 w-10 flex items-center justify-center text-gray-500">{CAT_ICON[scout.category] || CAT_ICON.General}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-mont text-sm font-semibold text-gray-800">
            {t('scouting.cat_' + scout.category.toLowerCase(), { defaultValue: scout.category })}
          </span>
          {scout.severity && (
            <span className="px-2 py-0.5 rounded-full text-xs font-mont font-bold" style={{ background: sevColor + '22', color: sevColor }}>
              {t('scouting.sev_' + scout.severity.toLowerCase(), { defaultValue: scout.severity })}
            </span>
          )}
          <span className="font-mont text-xs text-gray-400 ml-auto">
            {new Date(scout.observed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        {scout.notes && <p className="font-mont text-sm text-gray-600 mb-2">{scout.notes}</p>}
        {scout.image_url && (
          <img src={scout.image_url} alt="Scout" className="w-32 h-24 object-cover rounded-lg border border-gray-100 mb-2" onError={e => e.currentTarget.style.display='none'} />
        )}
        {(scout.latitude || scout.longitude) && (
          <div className="font-mont text-xs text-gray-400">{scout.latitude?.toFixed(5)}, {scout.longitude?.toFixed(5)}</div>
        )}
      </div>
      <div className="flex-shrink-0">
        {confirming ? (
          <div className="flex flex-col gap-1">
            <button onClick={() => onDelete(scout.scout_id)} className="text-xs px-2 py-1 bg-red-500 text-white rounded font-mont">{t('scouting.btn_confirm')}</button>
            <button onClick={() => setConfirming(false)} className="text-xs px-2 py-1 border border-gray-200 rounded font-mont">{t('scouting.btn_cancel')}</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="text-xs text-gray-400 hover:text-red-500 font-mont">{t('scouting.btn_delete')}</button>
        )}
      </div>
    </div>
  );
}

function AddScoutForm({ fieldId, onSaved, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    category: 'General', severity: '', notes: '',
    observed_at: new Date().toISOString().slice(0, 10),
    latitude: '', longitude: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.notes.trim()) { setError(t('scouting.error_need_note')); return; }
    setSaving(true); setError('');
    try {
      const r = await fetch(`${API_URL}/api/fields/${fieldId}/scouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          observed_at: form.observed_at + 'T00:00:00',
          latitude:  form.latitude  ? parseFloat(form.latitude)  : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
        }),
      });
      if (!r.ok) throw new Error(await r.text());
      onSaved(await r.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-lora font-bold text-gray-900">{t('scouting.form_title')}</h3>
      {error && <div className="text-xs text-red-600 bg-red-50 rounded px-3 py-2 font-mont">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold font-mont text-gray-500">{t('scouting.form_date')}</label>
          <input type="date" value={form.observed_at} onChange={e => set('observed_at', e.target.value)}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold font-mont text-gray-500">{t('scouting.form_category')}</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{t('scouting.cat_' + c.toLowerCase(), { defaultValue: c })}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold font-mont text-gray-500">{t('scouting.form_severity')}</label>
          <select value={form.severity} onChange={e => set('severity', e.target.value)}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
            <option value="">{t('scouting.form_severity_none')}</option>
            {SEVERITIES.map(sev => (
              <option key={sev} value={sev}>{t('scouting.sev_' + sev.toLowerCase(), { defaultValue: sev })}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold font-mont text-gray-500">{t('scouting.form_notes')}</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
          placeholder={t('scouting.form_notes_placeholder')}
          className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold font-mont text-gray-500">{t('scouting.form_latitude')}</label>
          <input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)}
            placeholder="e.g. 41.8781"
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold font-mont text-gray-500">{t('scouting.form_longitude')}</label>
          <input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)}
            placeholder="e.g. -87.6298"
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-mont text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">{t('scouting.btn_cancel')}</button>
        <button onClick={submit} disabled={saving}
          className="px-5 py-2 text-sm font-mont font-semibold bg-[#6D8E22] text-white rounded-lg hover:bg-[#5a7519] disabled:opacity-50">
          {saving ? t('scouting.btn_saving') : t('scouting.btn_save')}
        </button>
      </div>
    </div>
  );
}

export default function PrecisionAgScouting() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [scouts, setScouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  const loadScouts = useCallback(async () => {
    if (!selectedFieldId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/scouts`);
      setScouts(r.ok ? await r.json() : []);
    } finally {
      setLoading(false);
    }
  }, [selectedFieldId]);

  useEffect(() => { loadScouts(); }, [loadScouts]);

  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (id) => {
    setDeleteError('');
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/scouts/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setScouts(s => s.filter(x => x.scout_id !== id));
    } catch {
      setDeleteError(t('scouting.error_delete_failed', { defaultValue: 'Could not delete this observation. Please try again.' }));
    }
  };

  const filtered = filterCat === 'All' ? scouts : scouts.filter(s => s.category === filterCat);

  const counts = CATEGORIES.reduce((acc, c) => {
    acc[c] = scouts.filter(s => s.category === c).length;
    return acc;
  }, {});

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={t('scouting.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to:'/dashboard' }, { label: t('precision_ag_alerts.breadcrumb_precision_ag') }, { label: t('scouting.page_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{t('scouting.heading')}</h1>
            <p className="font-mont text-sm text-gray-500">{t('scouting.subheading')}</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#6D8E22] text-white text-sm font-mont font-semibold rounded-lg hover:bg-[#5a7519]">
            {t('scouting.btn_add')}
          </button>
        </div>

        {/* Field selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold font-mont text-gray-500">{t('scouting.field_label')}</label>
            <select value={selectedFieldId} onChange={e => { setSelectedFieldId(e.target.value); setShowForm(false); }}
              className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
              {fields.length === 0 && <option value="">{t('scouting.no_fields')}</option>}
              {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
            </select>
          </div>
          {scouts.length > 0 && (
            <div className="font-mont text-xs text-gray-400 self-end pb-2">
              {t('scouting.obs_count', { count: scouts.length })}
            </div>
          )}
        </div>

        {showForm && (
          <AddScoutForm
            fieldId={selectedFieldId}
            onSaved={s => { setScouts(prev => [s, ...prev]); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Category filter pills */}
        {scouts.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {['All', ...CATEGORIES].map(c => {
              const active = filterCat === c;
              const count = c === 'All' ? scouts.length : (counts[c] || 0);
              if (c !== 'All' && count === 0) return null;
              const label = c === 'All' ? t('scouting.filter_all') : t('scouting.cat_' + c.toLowerCase(), { defaultValue: c });
              return (
                <button key={c} onClick={() => setFilterCat(c)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mont font-semibold border transition-all"
                  style={{ background: active ? '#6D8E22' : 'white', borderColor: active ? '#6D8E22' : '#E5E7EB', color: active ? 'white' : '#6B7280' }}>
                  {c !== 'All' && CAT_ICON[c]} {label}
                  <span className="ml-0.5 opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Observations */}
        {deleteError && (
          <div className="text-xs text-red-600 bg-red-50 rounded px-3 py-2 font-mont">{deleteError}</div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{t('scouting.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
            <div className="font-lora text-xl text-gray-600 mb-2">{scouts.length === 0 ? t('scouting.no_obs_title') : t('scouting.no_obs_filtered_title')}</div>
            <div className="font-mont text-sm text-gray-400">
              {scouts.length === 0 ? t('scouting.no_obs_body') : t('scouting.no_obs_filtered_body')}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(s => <ScoutCard key={s.scout_id} scout={s} onDelete={handleDelete} />)}
          </div>
        )}

        {/* Summary stats */}
        {scouts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="font-mont text-sm font-semibold text-gray-600 mb-3">{t('scouting.severity_title')}</div>
            <div className="flex gap-4 flex-wrap">
              {SEVERITIES.map(sev => {
                const count = scouts.filter(s => s.severity === sev).length;
                if (!count) return null;
                return (
                  <div key={sev} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: SEV_COLOR[sev] }} />
                    <span className="font-mont text-sm text-gray-600">{t('scouting.sev_' + sev.toLowerCase(), { defaultValue: sev })}</span>
                    <span className="font-mont text-sm font-bold" style={{ color: SEV_COLOR[sev] }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
