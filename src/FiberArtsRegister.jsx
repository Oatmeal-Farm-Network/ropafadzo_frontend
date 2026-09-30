import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

const EMPTY_ENTRY = {
  CategoryID: '',
  EntryTitle: '',
  Description: '',
  FiberType: '',
  SourceAnimalID: '',
};

function EntryForm({ initial, onSave, onCancel, categories, animals, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initial || EMPTY_ENTRY);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div>
        <label className={lbl}>{t('fiber_arts_register.lbl_entry_title')}</label>
        <input value={form.EntryTitle} onChange={set('EntryTitle')} required className={inp} placeholder={t('fiber_arts_register.placeholder_entry_title')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{t('fiber_arts_register.lbl_category')}</label>
          <select value={form.CategoryID} onChange={set('CategoryID')} className={inp}>
            <option value="">{t('fiber_arts_register.opt_select')}</option>
            {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('fiber_arts_register.lbl_fiber_type')}</label>
          <input value={form.FiberType} onChange={set('FiberType')} className={inp} placeholder={t('fiber_arts_register.placeholder_fiber_type')} />
        </div>
      </div>
      <div>
        <label className={lbl}>{t('fiber_arts_register.lbl_source_animal')}</label>
        <select value={form.SourceAnimalID} onChange={set('SourceAnimalID')} className={inp}>
          <option value="">{t('fiber_arts_register.opt_no_animal')}</option>
          {animals.map(a => <option key={a.ID ?? a.AnimalID} value={a.ID ?? a.AnimalID}>{a.FullName || a.AnimalName}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>{t('fiber_arts_register.lbl_description')}</label>
        <RichTextEditor value={form.Description || ''}
          onChange={(v) => setForm(f => ({ ...f, Description: v }))} minHeight={140} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg">{t('fiber_arts_register.btn_cancel')}</button>
        <button type="submit" disabled={saving} className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg disabled:opacity-50">
          {saving ? t('fiber_arts_register.btn_saving') : t('fiber_arts_register.btn_save')}
        </button>
      </div>
    </form>
  );
}

export default function FiberArtsRegister() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = params.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const loadEntries = () => peopleId
    ? fetch(`${API}/api/events/${eventId}/fiber-arts/entries?people_id=${peopleId}`).then(r => r.json()).then(setEntries).catch(() => {})
    : Promise.resolve();

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/fiber-arts/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/fiber-arts/categories`).then(r => r.json()).then(setCategories).catch(() => {});
    loadEntries();
    if (BusinessID) {
      fetch(`${API}/auth/animals?BusinessID=${BusinessID}`)
        .then(r => r.ok ? r.json() : [])
        .then(a => setAnimals(Array.isArray(a) ? a : []))
        .catch(() => {});
    }
  }, [eventId, BusinessID, peopleId]);

  const save = async (form) => {
    setErr('');
    setSaving(true);
    try {
      const body = {
        ...form,
        CategoryID: form.CategoryID ? Number(form.CategoryID) : null,
        SourceAnimalID: form.SourceAnimalID ? Number(form.SourceAnimalID) : null,
        PeopleID: peopleId,
        BusinessID: BusinessID ? Number(BusinessID) : null,
      };
      let r;
      if (editing) {
        r = await fetch(`${API}/api/events/fiber-arts/entries/${editing.EntryID}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      } else {
        r = await fetch(`${API}/api/events/${eventId}/fiber-arts/entries`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      }
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.detail || t('fiber_arts_register.save_failed'));
      }
      setAdding(false);
      setEditing(null);
      loadEntries();
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (entry) => {
    if (!confirm(t('fiber_arts_register.confirm_remove', { title: entry.EntryTitle }))) return;
    await fetch(`${API}/api/events/fiber-arts/entries/${entry.EntryID}`, { method: 'DELETE' });
    loadEntries();
  };

  const total = entries.reduce((s, e) => s + Number(e.EntryFee || 0), 0);
  const configured = cfg?.configured;
  const closed = configured && cfg?.RegistrationEndDate && new Date(cfg.RegistrationEndDate) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('fiber_arts_register.heading')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {event?.EventName || 'Event'}
            {event?.EventLocationCity && ` — ${event.EventLocationCity}, ${event.EventLocationState}`}
          </p>
        </div>
        <Link to={`/events/${eventId}`} className="text-sm text-gray-500 hover:text-gray-700">{t('fiber_arts_register.btn_back')}</Link>
      </div>

      {!configured && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4 mb-4">
          {t('fiber_arts_register.not_configured')}
        </div>
      )}

      {configured && (
        <>
          {cfg.Description && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 whitespace-pre-wrap text-sm text-gray-700">
              {cfg.Description}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-gray-500">{t('fiber_arts_register.lbl_fee_per_entry')}</div>
              <div className="font-semibold text-gray-900 text-base">${Number(cfg.CurrentFee || cfg.FeePerEntry || 0).toFixed(2)}</div>
              {cfg.DiscountFeePerEntry != null && cfg.DiscountEndDate && (
                <div className="text-[11px] text-gray-400">
                  {t('fiber_arts_register.discount_ends', { date: String(cfg.DiscountEndDate).substring(0, 10) })}
                </div>
              )}
            </div>
            {cfg.MaxEntriesPerRegistrant && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('fiber_arts_register.lbl_max_per_registrant')}</div>
                <div className="font-semibold text-gray-900 text-base">{entries.length} / {cfg.MaxEntriesPerRegistrant}</div>
              </div>
            )}
            {cfg.RegistrationEndDate && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('fiber_arts_register.lbl_reg_closes')}</div>
                <div className="font-semibold text-gray-900 text-base">{String(cfg.RegistrationEndDate).substring(0, 10)}</div>
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-gray-500">{t('fiber_arts_register.lbl_your_total')}</div>
              <div className="font-semibold text-[#3D6B34] text-base">${total.toFixed(2)}</div>
            </div>
          </div>

          {closed && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {t('fiber_arts_register.msg_closed')}
            </div>
          )}

          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{err}</div>}

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('fiber_arts_register.your_entries')}</h2>
            {!adding && !editing && !closed && peopleId && (
              <button onClick={() => setAdding(true)} className="text-sm bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg hover:bg-[#2d5226]">
                {t('fiber_arts_register.btn_add_entry')}
              </button>
            )}
          </div>

          {!peopleId && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-3">
              {t('fiber_arts_register.login_prompt_text')} <Link to="/login" className="underline">{t('fiber_arts_register.login_link')}</Link> {t('fiber_arts_register.login_prompt_suffix')}
            </div>
          )}

          {(adding || editing) && (
            <EntryForm
              initial={editing || EMPTY_ENTRY}
              onSave={save}
              onCancel={() => { setAdding(false); setEditing(null); }}
              categories={categories}
              animals={animals}
              saving={saving}
            />
          )}

          <div className="space-y-2 mt-3">
            {entries.length === 0 && !adding && peopleId && (
              <div className="text-sm text-gray-500">{t('fiber_arts_register.no_entries')}</div>
            )}
            {entries.map(e => (
              <div key={e.EntryID} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{e.EntryTitle}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {e.CategoryName || t('fiber_arts_register.uncategorized')}
                      {e.FiberType && ` • ${e.FiberType}`}
                    </div>
                    {e.Description && <div className="text-xs text-gray-600 mt-1">{e.Description}</div>}
                    {e.Placement && <div className="text-xs font-semibold text-[#3D6B34] mt-1">🏆 {e.Placement}</div>}
                    {e.JudgeNotes && <div className="text-xs italic text-gray-500 mt-0.5">{t('fiber_arts_register.judge_label')} {e.JudgeNotes}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm font-medium">${Number(e.EntryFee || 0).toFixed(2)}</div>
                    <div className={`text-[11px] px-2 py-0.5 rounded ${e.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {e.PaidStatus}
                    </div>
                    {!closed && (
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => { setEditing(e); setAdding(false); }} className="text-xs text-gray-500 hover:text-gray-800">{t('fiber_arts_register.btn_edit')}</button>
                        <button onClick={() => remove(e)} className="text-xs text-red-500 hover:text-red-700">{t('fiber_arts_register.btn_remove')}</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
