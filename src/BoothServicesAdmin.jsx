import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const CATEGORIES = ['general', 'electrical', 'water', 'internet', 'furniture', 'av', 'shipping'];
const CAT_ICON = {
  general:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  electrical: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  water:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L5 10a7 7 0 1 0 14 0L12 2z"/></svg>,
  internet:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  furniture:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="10" rx="2"/><path d="M3 13h18"/><path d="M8 21v-8"/><path d="M16 21v-8"/></svg>,
  av:         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  shipping:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
};

function ServiceForm({ svc, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(svc || {
    Name: '', Description: '', Category: 'general', Price: 0, Unit: 'each',
    MaxPerBooth: '', IsRequired: false, IsActive: true, SortOrder: 100,
  });
  const set    = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <label className={lbl}>{t('booth_services.label_name')}</label>
          <input className={inp} placeholder={t('booth_services.placeholder_name')} value={s.Name} onChange={set('Name')} />
        </div>
        <div>
          <label className={lbl}>{t('booth_services.label_category')}</label>
          <select className={inp} value={s.Category} onChange={set('Category')}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{t('booth_services.cat_' + c, { defaultValue: c })}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('booth_services.label_sort')}</label>
          <input className={inp} type="number" value={s.SortOrder ?? 100} onChange={setNum('SortOrder')} />
        </div>
        <div>
          <label className={lbl}>{t('booth_services.label_price')}</label>
          <input className={inp} type="number" step="0.01" value={s.Price ?? 0} onChange={setNum('Price')} />
        </div>
        <div>
          <label className={lbl}>{t('booth_services.label_unit')}</label>
          <input className={inp} placeholder={t('booth_services.placeholder_unit')} value={s.Unit || 'each'} onChange={set('Unit')} />
        </div>
        <div>
          <label className={lbl}>{t('booth_services.label_max_per_booth')}</label>
          <input className={inp} type="number" placeholder={t('booth_services.placeholder_unlimited')} value={s.MaxPerBooth ?? ''} onChange={setNum('MaxPerBooth')} />
        </div>
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={!!s.IsActive} onChange={e => setS(prev => ({ ...prev, IsActive: e.target.checked }))} />
            {t('booth_services.active')}
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={!!s.IsRequired} onChange={e => setS(prev => ({ ...prev, IsRequired: e.target.checked }))} />
            {t('booth_services.required')}
          </label>
        </div>
      </div>
      <div>
        <label className={lbl}>{t('booth_services.label_description')}</label>
        <textarea className={inp} rows={2} value={s.Description || ''} onChange={set('Description')} placeholder={t('booth_services.placeholder_description')} />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('booth_services.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} disabled={!s.Name} className={btn}>{t('booth_services.btn_save')}</button>
      </div>
    </div>
  );
}

export default function BoothServicesAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [services, setServices] = useState([]);
  const [revenue, setRevenue]   = useState(null);
  const [editing, setEditing]   = useState(null);
  const [adding, setAdding]     = useState(false);
  const [loading, setLoading]   = useState(true);

  const refresh = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/events/${eventId}/booth-services?active_only=false`).then(r => r.json()),
      fetch(`${API}/api/events/${eventId}/booth-services/revenue`).then(r => r.json()),
    ]).then(([s, r]) => { setServices(s); setRevenue(r); setLoading(false); });
  };
  useEffect(refresh, [eventId]);

  const save = async (s) => {
    const isEdit = !!s.ServiceID;
    const url = isEdit ? `${API}/api/events/booth-services/${s.ServiceID}` : `${API}/api/events/${eventId}/booth-services`;
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
    if (r.ok) { setEditing(null); setAdding(false); refresh(); } else alert(t('booth_services.err_save'));
  };

  const del = async (id) => {
    if (!window.confirm(t('booth_services.confirm_delete'))) return;
    const r = await fetch(`${API}/api/events/booth-services/${id}`, { method: 'DELETE' });
    const j = await r.json();
    if (j.soft_deleted) alert(j.message || t('booth_services.deactivated'));
    refresh();
  };

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-5xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('booth_services.page_title')}</h1>
            <p className="text-sm text-gray-500">{t('booth_services.subheading')}</p>
          </div>
          <Link to={`/events/${eventId}`} className={btnGhost}>{t('booth_services.btn_event_detail')}</Link>
        </div>

        {revenue && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-end justify-between flex-wrap gap-3">
              <div>
                <div className="text-[10px] uppercase text-gray-500 font-semibold">{t('booth_services.total_revenue_label')}</div>
                <div className="text-3xl font-bold text-gray-900">${Number(revenue.total_revenue || 0).toLocaleString()}</div>
              </div>
              <div className="text-xs text-gray-500">
                {t('booth_services.catalog_count', { count: (revenue.by_service || []).length })}
              </div>
            </div>
            {revenue.by_service?.length > 0 && (
              <div className="mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {revenue.by_service.filter(r => Number(r.revenue || 0) > 0).map(r => (
                  <div key={r.ServiceID} className="border border-gray-100 rounded-lg p-2 text-xs">
                    <div className="font-semibold text-gray-700 flex items-center gap-1.5">
                      <span className="text-gray-500">{CAT_ICON[r.Category] || CAT_ICON.general}</span>{r.Name}
                    </div>
                    <div className="text-gray-500">{r.units_sold} {r.Unit} · ${Number(r.revenue).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={() => setAdding(true)} className={btn}>{t('booth_services.btn_add')}</button>
        </div>
        {adding && <ServiceForm onSave={save} onCancel={() => setAdding(false)} />}

        {loading && <div className="text-sm text-gray-500">{t('booth_services.loading')}</div>}
        {!loading && services.length === 0 && (
          <div className="text-sm text-gray-500 italic">{t('booth_services.empty')}</div>
        )}

        <div className="space-y-2">
          {services.map(s => editing?.ServiceID === s.ServiceID ? (
            <ServiceForm key={s.ServiceID} svc={editing} onSave={save} onCancel={() => setEditing(null)} />
          ) : (
            <div key={s.ServiceID} className={`border rounded-xl p-3 flex items-start gap-3 ${s.IsActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="shrink-0 text-gray-500">{CAT_ICON[s.Category] || CAT_ICON.general}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className={s.IsActive ? 'text-gray-900' : 'text-gray-500'}>{s.Name}</strong>
                  <span className="text-sm text-gray-600">${Number(s.Price || 0).toFixed(2)} / {s.Unit}</span>
                  {s.IsRequired && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold uppercase">
                      {t('booth_services.badge_required')}
                    </span>
                  )}
                  {!s.IsActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700 font-semibold uppercase">
                      {t('booth_services.badge_inactive')}
                    </span>
                  )}
                  {s.MaxPerBooth && (
                    <span className="text-xs text-gray-500">
                      {t('booth_services.max_per_booth', { n: s.MaxPerBooth })}
                    </span>
                  )}
                </div>
                {s.Description && <div className="text-xs text-gray-600 mt-0.5">{s.Description}</div>}
              </div>
              <button onClick={() => setEditing(s)} className={btnGhost}>{t('booth_services.btn_edit')}</button>
              <button onClick={() => del(s.ServiceID)} className="text-xs text-red-600 hover:underline">{t('booth_services.btn_delete')}</button>
            </div>
          ))}
        </div>
      </div>
    </EventAdminLayout>
  );
}
