import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

export default function CompetitionRegister() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = params.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    EntrantName: '', EntrantEmail: '', EntrantPhone: '',
    CategoryID: '', EntryTitle: '', EntryNotes: '', PhotoURL: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/competition/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/competition/categories`).then(r => r.json()).then(setCategories).catch(() => {});
  }, [eventId]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.EntrantName || !form.CategoryID) { setErr(t('comp_reg.error_required')); return; }
    setSaving(true);
    try {
      const r = await fetch(`${API}/api/events/${eventId}/competition/entries`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          EntrantPeopleID: peopleId, BusinessID: BusinessID ? Number(BusinessID) : null,
          ...form,
        }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.detail || 'Submission failed');
      }
      setResult(await r.json());
    } catch (ex) { setErr(ex.message); }
    finally { setSaving(false); }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] py-10 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-xl font-semibold text-[#3D6B34] mb-2">{t('comp_reg.submitted_title')}</h1>
          <div className="text-sm text-gray-600 mb-4">{event?.EventName}</div>
          <div className="text-sm text-gray-700">
            {t('comp_reg.entry_id', { id: result.EntryID })}
            {result.EntryFeePaid > 0 && <> {t('comp_reg.entry_fee', { amount: Number(result.EntryFeePaid).toFixed(2) })}</>}
          </div>
          <Link to={`/events/${eventId}`} className="inline-block mt-5 text-sm text-[#3D6B34] hover:underline">{t('comp_reg.back_event')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EE] py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <Link to={`/events/${eventId}`} className="text-xs text-gray-500 hover:text-[#3D6B34]">{t('comp_reg.back')}</Link>
        <h1 className="text-2xl font-semibold text-[#3D6B34] mt-1 mb-1">
          {t('comp_reg.heading_prefix')} {event?.EventName || ''}
        </h1>
        <div className="text-sm text-gray-500 mb-5">{t('comp_reg.type_label')}</div>

        {cfg?.Description && (
          <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: cfg.Description }} />
        )}
        {cfg?.RulesText && (
          <details className="mb-5">
            <summary className="text-sm font-medium text-[#3D6B34] cursor-pointer">{t('comp_reg.rules_label')}</summary>
            <div className="prose prose-sm max-w-none mt-2" dangerouslySetInnerHTML={{ __html: cfg.RulesText }} />
          </details>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={lbl}>{t('comp_reg.label_name')}</label>
              <input className={inp} required value={form.EntrantName}
                onChange={e => setForm(f => ({ ...f, EntrantName: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>{t('comp_reg.label_email')}</label>
              <input className={inp} type="email" value={form.EntrantEmail}
                onChange={e => setForm(f => ({ ...f, EntrantEmail: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>{t('comp_reg.label_phone')}</label>
              <input className={inp} value={form.EntrantPhone}
                onChange={e => setForm(f => ({ ...f, EntrantPhone: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>{t('comp_reg.label_category')}</label>
              <select className={inp} required value={form.CategoryID}
                onChange={e => setForm(f => ({ ...f, CategoryID: e.target.value }))}>
                <option value="">—</option>
                {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>{t('comp_reg.label_entry_title')}</label>
            <input className={inp} value={form.EntryTitle}
              onChange={e => setForm(f => ({ ...f, EntryTitle: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('comp_reg.label_photo_url')}</label>
            <input className={inp} value={form.PhotoURL}
              onChange={e => setForm(f => ({ ...f, PhotoURL: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('comp_reg.label_notes')}</label>
            <textarea className={inp} rows={3} value={form.EntryNotes}
              onChange={e => setForm(f => ({ ...f, EntryNotes: e.target.value }))} />
          </div>

          {cfg?.EntryFee > 0 && (
            <div className="bg-[#F5F2E8] border border-[#E8DEC2] rounded-lg p-3 text-sm">
              {t('comp_reg.entry_fee_label')} <span className="font-medium text-[#3D6B34]">${Number(cfg.EntryFee).toFixed(2)}</span>
            </div>
          )}

          {err && <div className="text-sm text-red-600">{err}</div>}

          <div className="flex items-center gap-3 justify-end">
            <Link to={`/events/${eventId}`} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              {t('comp_reg.btn_cancel')}
            </Link>
            <button type="submit" disabled={saving}
              className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50">
              {saving ? t('comp_reg.btn_submitting') : t('comp_reg.btn_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
