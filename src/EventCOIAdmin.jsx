/**
 * EventCOIAdmin — review COI uploads for an event.
 *
 * Lists every Certificate of Insurance uploaded by sponsors / vendors, with
 * status badges, expiry warnings (red <0 days, amber <30 days), policy
 * details, and inline status update + reviewer notes.
 *
 * Includes an upload form at top so organizers can upload on behalf of an
 * entity if they receive the COI by email.
 */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const STATUS_COLORS = {
  pending:  'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100   text-red-800   border-red-200',
  expired:  'bg-gray-100  text-gray-700  border-gray-300',
};

function StatusBadge({ value }) {
  return <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${STATUS_COLORS[value] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{value}</span>;
}

function ExpiryBadge({ days }) {
  const { t } = useTranslation();
  if (days == null) return <span className="text-[10px] text-gray-400">{t('event_coi_admin.no_expiry')}</span>;
  if (days < 0)   return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-semibold">{t('event_coi_admin.expired_days_ago', { n: -days })}</span>;
  if (days < 30)  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-semibold">{t('event_coi_admin.expires_in_days', { n: days })}</span>;
  return <span className="text-[10px] text-gray-500">{t('event_coi_admin.days_remaining', { n: days })}</span>;
}

export function COIUploadWidget({ eventId, entityType, entityId, entityName, onUploaded }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [meta, setMeta] = useState({ EffectiveDate: '', ExpiryDate: '', CarrierName: '', PolicyNumber: '', CoverageAmount: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState('');

  const submit = async () => {
    if (!file) { setMsg(t('event_coi_admin.err_pick_file')); return; }
    setBusy(true); setMsg('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('entity_type', entityType);
    fd.append('entity_id',   String(entityId));
    if (entityName) fd.append('entity_name', entityName);
    Object.entries(meta).forEach(([k, v]) => { if (v) fd.append(k.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''), v); });
    const r = await fetch(`${API}/api/events/${eventId}/coi/upload`, { method: 'POST', body: fd });
    setBusy(false);
    if (r.ok) {
      setMsg(t('event_coi_admin.upload_success'));
      setFile(null);
      setMeta({ EffectiveDate: '', ExpiryDate: '', CarrierName: '', PolicyNumber: '', CoverageAmount: '' });
      onUploaded?.();
    } else {
      const j = await r.json().catch(() => ({}));
      setMsg(t('event_coi_admin.upload_error', { detail: j.detail || t('event_coi_admin.upload_failed') }));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div>
        <label className={lbl}>{t('event_coi_admin.lbl_file')}</label>
        <input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div><label className={lbl}>{t('event_coi_admin.lbl_effective_date')}</label><input className={inp} type="date" value={meta.EffectiveDate} onChange={e => setMeta(m => ({ ...m, EffectiveDate: e.target.value }))} /></div>
        <div><label className={lbl}>{t('event_coi_admin.lbl_expiry_date')}</label><input className={inp} type="date" value={meta.ExpiryDate} onChange={e => setMeta(m => ({ ...m, ExpiryDate: e.target.value }))} /></div>
        <div><label className={lbl}>{t('event_coi_admin.lbl_coverage_amount')}</label><input className={inp} type="number" step="1000" value={meta.CoverageAmount} onChange={e => setMeta(m => ({ ...m, CoverageAmount: e.target.value }))} /></div>
        <div><label className={lbl}>{t('event_coi_admin.lbl_carrier')}</label><input className={inp} value={meta.CarrierName} onChange={e => setMeta(m => ({ ...m, CarrierName: e.target.value }))} /></div>
        <div className="md:col-span-2"><label className={lbl}>{t('event_coi_admin.lbl_policy_number')}</label><input className={inp} value={meta.PolicyNumber} onChange={e => setMeta(m => ({ ...m, PolicyNumber: e.target.value }))} /></div>
      </div>
      {msg && <div className={`text-sm ${msg.startsWith('Error') ? 'text-red-600' : 'text-emerald-700'}`}>{msg}</div>}
      <div className="flex justify-end">
        <button onClick={submit} disabled={busy || !file} className={btn}>{busy ? t('event_coi_admin.btn_uploading') : t('event_coi_admin.btn_upload')}</button>
      </div>
    </div>
  );
}

export default function EventCOIAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [items, setItems]     = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter]   = useState({ status: '', entity_type: '' });
  const [editing, setEditing] = useState(null);
  const [adding, setAdding]   = useState(false);
  const [addMeta, setAddMeta] = useState({ entity_type: 'sponsor', entity_id: '', entity_name: '' });

  const refresh = () => {
    const params = new URLSearchParams();
    if (filter.status)      params.set('status', filter.status);
    if (filter.entity_type) params.set('entity_type', filter.entity_type);
    fetch(`${API}/api/events/${eventId}/coi?${params}`).then(r => r.json()).then(setItems);
    fetch(`${API}/api/events/${eventId}/coi/summary`).then(r => r.json()).then(setSummary);
  };
  useEffect(refresh, [eventId, filter.status, filter.entity_type]);

  const save = async (i) => {
    await fetch(`${API}/api/events/coi/${i.COIID}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(i),
    });
    setEditing(null); refresh();
  };
  const del = async (id) => {
    if (!window.confirm(t('event_coi_admin.confirm_delete'))) return;
    await fetch(`${API}/api/events/coi/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-5xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('event_coi_admin.heading')}</h1>
            <p className="text-sm text-gray-500">{t('event_coi_admin.subheading')}</p>
          </div>
          <Link to={`/events/${eventId}`} className={btnGhost}>{t('event_coi_admin.btn_event_detail')}</Link>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['pending','approved','rejected','expired'].map(k => (
              <div key={k} className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="text-[10px] uppercase text-gray-500 font-semibold">{k}</div>
                <div className="text-2xl font-bold">{summary.by_status?.[k] || 0}</div>
              </div>
            ))}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="text-[10px] uppercase text-amber-700 font-semibold">{t('event_coi_admin.expiring_soon')}</div>
              <div className="text-2xl font-bold text-amber-700">{summary.expiring_in_30_days || 0}</div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center text-xs bg-white border border-gray-200 rounded-xl p-3">
          <span className="text-gray-500 font-medium">{t('event_coi_admin.filter_label')}</span>
          <select className="border border-gray-300 rounded px-2 py-1 text-xs" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
            <option value="">{t('event_coi_admin.filter_all_statuses')}</option>
            <option value="pending">{t('event_coi_admin.status_pending')}</option>
            <option value="approved">{t('event_coi_admin.status_approved')}</option>
            <option value="rejected">{t('event_coi_admin.status_rejected')}</option>
            <option value="expired">{t('event_coi_admin.status_expired')}</option>
          </select>
          <select className="border border-gray-300 rounded px-2 py-1 text-xs" value={filter.entity_type} onChange={e => setFilter(f => ({ ...f, entity_type: e.target.value }))}>
            <option value="">{t('event_coi_admin.filter_all_entities')}</option>
            <option value="sponsor">{t('event_coi_admin.entity_sponsor')}</option>
            <option value="vendor">{t('event_coi_admin.entity_vendor')}</option>
            <option value="exhibitor">{t('event_coi_admin.entity_exhibitor')}</option>
            <option value="speaker">{t('event_coi_admin.entity_speaker')}</option>
            <option value="other">{t('event_coi_admin.entity_other')}</option>
          </select>
          <button onClick={() => setAdding(v => !v)} className={`${btnGhost} ml-auto`}>{adding ? t('event_coi_admin.btn_cancel_upload') : t('event_coi_admin.btn_upload_coi')}</button>
        </div>

        {adding && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div><label className={lbl}>{t('event_coi_admin.lbl_entity_type')}</label>
                <select className={inp} value={addMeta.entity_type} onChange={e => setAddMeta(m => ({ ...m, entity_type: e.target.value }))}>
                  <option value="sponsor">{t('event_coi_admin.entity_sponsor')}</option>
                  <option value="vendor">{t('event_coi_admin.entity_vendor')}</option>
                  <option value="exhibitor">{t('event_coi_admin.entity_exhibitor')}</option>
                  <option value="speaker">{t('event_coi_admin.entity_speaker')}</option>
                  <option value="other">{t('event_coi_admin.entity_other')}</option>
                </select></div>
              <div><label className={lbl}>{t('event_coi_admin.lbl_entity_id')}</label><input className={inp} type="number" value={addMeta.entity_id} onChange={e => setAddMeta(m => ({ ...m, entity_id: e.target.value }))} placeholder={t('event_coi_admin.placeholder_entity_id')} /></div>
              <div><label className={lbl}>{t('event_coi_admin.lbl_entity_name')}</label><input className={inp} value={addMeta.entity_name} onChange={e => setAddMeta(m => ({ ...m, entity_name: e.target.value }))} /></div>
            </div>
            {addMeta.entity_id && (
              <COIUploadWidget eventId={eventId} entityType={addMeta.entity_type} entityId={Number(addMeta.entity_id)} entityName={addMeta.entity_name} onUploaded={() => { setAdding(false); refresh(); }} />
            )}
          </div>
        )}

        {items.length === 0 && <div className="text-sm text-gray-500 italic">{t('event_coi_admin.no_cois')}</div>}

        <div className="space-y-2">
          {items.map(i => editing?.COIID === i.COIID ? (
            <div key={i.COIID} className="bg-blue-50/30 border border-blue-300 rounded-xl p-4 space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div><label className={lbl}>{t('event_coi_admin.lbl_status')}</label>
                  <select className={inp} value={editing.Status} onChange={e => setEditing({ ...editing, Status: e.target.value })}>
                    <option>pending</option><option>approved</option><option>rejected</option><option>expired</option>
                  </select></div>
                <div><label className={lbl}>{t('event_coi_admin.lbl_effective')}</label><input className={inp} type="date" value={(editing.EffectiveDate || '').toString().slice(0,10)} onChange={e => setEditing({ ...editing, EffectiveDate: e.target.value })} /></div>
                <div><label className={lbl}>{t('event_coi_admin.lbl_expiry')}</label><input className={inp} type="date" value={(editing.ExpiryDate || '').toString().slice(0,10)} onChange={e => setEditing({ ...editing, ExpiryDate: e.target.value })} /></div>
                <div><label className={lbl}>{t('event_coi_admin.lbl_carrier')}</label><input className={inp} value={editing.CarrierName || ''} onChange={e => setEditing({ ...editing, CarrierName: e.target.value })} /></div>
                <div><label className={lbl}>{t('event_coi_admin.lbl_policy_hash')}</label><input className={inp} value={editing.PolicyNumber || ''} onChange={e => setEditing({ ...editing, PolicyNumber: e.target.value })} /></div>
                <div><label className={lbl}>{t('event_coi_admin.lbl_coverage')}</label><input className={inp} type="number" value={editing.CoverageAmount || ''} onChange={e => setEditing({ ...editing, CoverageAmount: Number(e.target.value) })} /></div>
              </div>
              <div><label className={lbl}>{t('event_coi_admin.lbl_reviewer_notes')}</label><textarea className={inp} rows={2} value={editing.ReviewerNotes || ''} onChange={e => setEditing({ ...editing, ReviewerNotes: e.target.value })} /></div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditing(null)} className={btnGhost}>{t('event_coi_admin.btn_cancel')}</button>
                <button onClick={() => save(editing)} className={btn}>{t('event_coi_admin.btn_save')}</button>
              </div>
            </div>
          ) : (
            <div key={i.COIID} className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-sm">{i.EntityType}#{i.EntityID}</strong>
                    {i.EntityName && <span className="text-xs text-gray-500">— {i.EntityName}</span>}
                    <StatusBadge value={i.Status} />
                    <ExpiryBadge days={i.days_until_expiry} />
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 flex flex-wrap gap-x-3">
                    {i.CarrierName && <span>{i.CarrierName}</span>}
                    {i.PolicyNumber && <span>{t('event_coi_admin.policy_label')} {i.PolicyNumber}</span>}
                    {i.CoverageAmount > 0 && <span>${Number(i.CoverageAmount).toLocaleString()} {t('event_coi_admin.coverage_label')}</span>}
                    {i.EffectiveDate && <span>{t('event_coi_admin.effective_label')} {String(i.EffectiveDate).slice(0,10)}</span>}
                    {i.ExpiryDate && <span>{t('event_coi_admin.expires_label')} {String(i.ExpiryDate).slice(0,10)}</span>}
                    <span className="text-gray-400">{t('event_coi_admin.uploaded_label')} {new Date(i.UploadedAt).toLocaleDateString()}</span>
                  </div>
                  {i.ReviewerNotes && <div className="text-xs text-gray-700 mt-1 bg-gray-50 rounded p-2">{i.ReviewerNotes}</div>}
                </div>
                <a href={i.FileURL} target="_blank" rel="noreferrer" className={btnGhost}>{t('event_coi_admin.btn_view_file')}</a>
                <button onClick={() => setEditing(i)} className={btnGhost}>{t('event_coi_admin.btn_review')}</button>
                <button onClick={() => del(i.COIID)} className="text-xs text-red-600 hover:underline">{t('event_coi_admin.btn_delete')}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EventAdminLayout>
  );
}
