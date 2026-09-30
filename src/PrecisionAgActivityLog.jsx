import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';
import { useFields, API_URL } from './precisionAgUtils';

const ACTIVITY_TYPES = ['Spray', 'Fertilize', 'Tillage', 'Irrigation', 'Harvest', 'Planting', 'Scouting', 'Soil Sample', 'Other'];
const TYPE_COLOR = {
  Spray:        '#7C3AED',
  Fertilize:    '#059669',
  Tillage:      '#92400E',
  Irrigation:   '#2563EB',
  Harvest:      '#D97706',
  Planting:     '#16A34A',
  Scouting:     '#0891B2',
  'Soil Sample':'#6B7280',
  Other:        '#9CA3AF',
};
const TYPE_ICON = {
  Spray:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="M4.93 10.93l4.24 4.24"/><path d="M2 18h6"/><circle cx="12" cy="18" r="4"/><path d="M12 14v-2"/></svg>,
  Fertilize:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 20.99"/><path d="M9.1 17.64C10.63 16.13 12.5 14.5 17 13"/><path d="M17 8c0 6-5 9-5 9"/></svg>,
  Tillage:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Irrigation:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L5 10a7 7 0 1 0 14 0L12 2z"/></svg>,
  Harvest:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 0 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><path d="M20 4H4v16"/></svg>,
  Planting:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20s4-6 4-10a4 4 0 0 0-8 0c0 4 4 10 4 10z"/><path d="M7 20h10"/><path d="M13 12s2-3 5-3"/></svg>,
  Scouting:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  'Soil Sample':<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>,
  Other:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
};

function ActivityRow({ item, onDelete }) {
  const { t } = useTranslation();
  const color = TYPE_COLOR[item.activity_type] || '#9CA3AF';
  const icon = TYPE_ICON[item.activity_type] || TYPE_ICON.Other;
  return (
    <div className="flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: color + '18', color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mont text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: color + '18', color }}>
            {t('activity_log.type_' + item.activity_type.toLowerCase().replace(/\s+/g, '_'), { defaultValue: item.activity_type })}
          </span>
          <span className="font-mont text-xs text-gray-400">{item.activity_date}</span>
          {item.operator_name && <span className="font-mont text-xs text-gray-400">— {item.operator_name}</span>}
        </div>
        {item.product && (
          <div className="font-mont text-sm text-gray-800 mt-0.5">
            {item.product}
            {item.rate != null && (
              <span className="text-gray-400"> @ {item.rate} {item.rate_unit || ''}</span>
            )}
          </div>
        )}
        {item.notes && <div className="font-mont text-xs text-gray-500 mt-0.5">{item.notes}</div>}
      </div>
      <button onClick={() => onDelete(item.activity_id)}
        className="text-gray-300 hover:text-red-400 text-sm font-mont px-2 py-1 rounded flex-shrink-0"
        title={t('activity_log.delete_title')}>
        ×
      </button>
    </div>
  );
}

const EMPTY_FORM = {
  activity_date: new Date().toISOString().slice(0, 10),
  activity_type: 'Other',
  product: '',
  rate: '',
  rate_unit: '',
  operator_name: '',
  notes: '',
};

export default function PrecisionAgActivityLog() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const fields = useFields(BusinessID);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId)
      setSelectedFieldId(String(fields[0].fieldid || fields[0].id));
  }, [fields]);

  const load = useCallback(async () => {
    if (!selectedFieldId) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/activity-log`);
      setActivities(r.ok ? await r.json() : []);
    } catch { setActivities([]); }
    setLoading(false);
  }, [selectedFieldId]);

  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, rate: form.rate ? parseFloat(form.rate) : null };
      const r = await fetch(`${API_URL}/api/fields/${selectedFieldId}/activity-log`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        setForm(EMPTY_FORM);
        setShowForm(false);
        load();
      } else {
        alert(t('activity_log.alert_save_error', { error: await r.text() }));
      }
    } finally { setSaving(false); }
  };

  const deleteActivity = async (id) => {
    if (!confirm(t('activity_log.confirm_delete'))) return;
    await fetch(`${API_URL}/api/fields/${selectedFieldId}/activity-log/${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = filterType ? activities.filter(a => a.activity_type === filterType) : activities;
  const typeCounts = ACTIVITY_TYPES.reduce((acc, actType) => {
    acc[actType] = activities.filter(a => a.activity_type === actType).length;
    return acc;
  }, {});

  return (
    <AccountLayout Business={Business} BusinessID={BusinessID} PeopleID={localStorage.getItem('people_id')}
      pageTitle={t('activity_log.page_title')} breadcrumbs={[{ label: t('nav.dashboard'), to:'/dashboard' }, { label: t('precision_ag_alerts.breadcrumb_precision_ag') }, { label: t('activity_log.page_title') }]}>
      <div className="max-w-full mx-auto space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900 mb-1">{t('activity_log.heading')}</h1>
            <p className="font-mont text-sm text-gray-500">{t('activity_log.subheading')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!navigator.geolocation) { alert(t('activity_log.alert_no_geolocation')); return; }
                setGpsLoading(true);
                navigator.geolocation.getCurrentPosition(
                  pos => {
                    const { latitude, longitude, accuracy } = pos.coords;
                    const ts = new Date().toLocaleString();
                    setForm({
                      ...EMPTY_FORM,
                      activity_type: 'Scouting',
                      notes: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m) @ ${ts}`,
                    });
                    setShowForm(true);
                    setGpsLoading(false);
                  },
                  () => { alert(t('activity_log.alert_gps_error')); setGpsLoading(false); }
                );
              }}
              disabled={gpsLoading}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-mont font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50">
              {gpsLoading ? t('activity_log.btn_gps_loading') : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{t('activity_log.btn_quick_note')}</>}
            </button>
            <button onClick={() => { setForm(EMPTY_FORM); setShowForm(p => !p); }}
              className="px-5 py-2.5 bg-[#6D8E22] text-white text-sm font-mont font-semibold rounded-lg hover:bg-[#5a7519]">
              {t('activity_log.btn_log_activity')}
            </button>
          </div>
        </div>

        {/* Field selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="text-xs font-semibold font-mont text-gray-500 block mb-1">{t('activity_log.field_label')}</label>
          <select value={selectedFieldId} onChange={e => setSelectedFieldId(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2 min-w-52">
            {fields.map(f => <option key={f.fieldid||f.id} value={String(f.fieldid||f.id)}>{f.name}</option>)}
          </select>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-[#6D8E22] p-5">
            <div className="font-mont text-sm font-semibold text-gray-700 mb-4">{t('activity_log.form_title')}</div>
            <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold font-mont text-gray-500">{t('activity_log.form_date')}</label>
                <input type="date" required value={form.activity_date}
                  onChange={e => setForm(p => ({ ...p, activity_date: e.target.value }))}
                  className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold font-mont text-gray-500">{t('activity_log.form_type')}</label>
                <select required value={form.activity_type}
                  onChange={e => setForm(p => ({ ...p, activity_type: e.target.value }))}
                  className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
                  {ACTIVITY_TYPES.map(actType => (
                    <option key={actType} value={actType}>
                      {t('activity_log.type_' + actType.toLowerCase().replace(/\s+/g, '_'), { defaultValue: actType })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold font-mont text-gray-500">{t('activity_log.form_product')}</label>
                <input type="text" placeholder={t('activity_log.form_product_placeholder')} value={form.product}
                  onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
                  className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-semibold font-mont text-gray-500">{t('activity_log.form_rate')}</label>
                  <input type="number" step="any" placeholder="0.0" value={form.rate}
                    onChange={e => setForm(p => ({ ...p, rate: e.target.value }))}
                    className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
                </div>
                <div className="flex flex-col gap-1 w-28">
                  <label className="text-xs font-semibold font-mont text-gray-500">{t('activity_log.form_unit')}</label>
                  <select value={form.rate_unit} onChange={e => setForm(p => ({ ...p, rate_unit: e.target.value }))}
                    className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2">
                    <option value="">—</option>
                    {['L/ha','kg/ha','gal/ac','lb/ac','oz/ac','units/ac','in'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold font-mont text-gray-500">{t('activity_log.form_operator')}</label>
                <input type="text" placeholder={t('activity_log.form_operator_placeholder')} value={form.operator_name}
                  onChange={e => setForm(p => ({ ...p, operator_name: e.target.value }))}
                  className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2 md:col-span-1">
                <label className="text-xs font-semibold font-mont text-gray-500">{t('activity_log.form_notes')}</label>
                <input type="text" placeholder={t('activity_log.form_notes_placeholder')} value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="border border-gray-300 rounded-lg text-sm font-mont px-3 py-2" />
              </div>
              <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-mont text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  {t('activity_log.btn_cancel')}
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-[#6D8E22] text-white text-sm font-mont font-semibold rounded-lg hover:bg-[#5a7519] disabled:opacity-50">
                  {saving ? t('activity_log.btn_saving') : t('activity_log.btn_save')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter pills */}
        {activities.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilterType('')}
              className={`px-3 py-1 rounded-full text-xs font-mont font-semibold ${!filterType ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('activity_log.filter_all', { count: activities.length })}
            </button>
            {ACTIVITY_TYPES.filter(actType => typeCounts[actType] > 0).map(actType => (
              <button key={actType} onClick={() => setFilterType(actType === filterType ? '' : actType)}
                className="px-3 py-1 rounded-full text-xs font-mont font-semibold"
                style={{ background: filterType === actType ? TYPE_COLOR[actType] : TYPE_COLOR[actType] + '18',
                         color: filterType === actType ? '#fff' : TYPE_COLOR[actType] }}>
                {TYPE_ICON[actType]} {t('activity_log.type_' + actType.toLowerCase().replace(/\s+/g, '_'), { defaultValue: actType })} ({typeCounts[actType]})
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 font-mont text-sm animate-pulse">{t('activity_log.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="mb-4 flex justify-center"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg></div>
            <div className="font-lora text-xl text-gray-600 mb-2">{t('activity_log.no_activities_title')}</div>
            <div className="font-mont text-sm text-gray-400">{t('activity_log.no_activities_body')}</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filtered.map(item => (
              <ActivityRow key={item.activity_id} item={item} onDelete={deleteActivity} />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
