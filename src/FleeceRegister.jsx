import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

const EMPTY_ENTRY = {
  FleeceName: '',
  Breed: '',
  Color: '',
  Micron: '',
  StapleLength: '',
  SourceAnimalID: '',
  DivisionID: '',
  Description: '',
};

function EntryForm({ initial, onSave, onCancel, animals, divisions, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initial || EMPTY_ENTRY);
  const set = (k) => (ev) => setForm(f => ({ ...f, [k]: ev.target.value }));
  return (
    <form onSubmit={(ev) => { ev.preventDefault(); onSave(form); }} className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div>
        <label className={lbl}>{t('fleece_register.lbl_fleece_name')}</label>
        <input value={form.FleeceName} onChange={set('FleeceName')} required className={inp} placeholder={t('fleece_register.placeholder_fleece')} />
      </div>
      {divisions.length > 0 && (
        <div>
          <label className={lbl}>{t('fleece_register.lbl_division')}</label>
          <select value={form.DivisionID} onChange={set('DivisionID')} className={inp}>
            <option value="">{t('fleece_register.option_none')}</option>
            {divisions.map(d_ => (
              <option key={d_.DivisionID} value={d_.DivisionID}>
                {d_.DivisionName}
                {d_.BreedGroup && ` — ${d_.BreedGroup}`}
                {d_.AgeGroup && ` (${d_.AgeGroup})`}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className={lbl}>{t('fleece_register.lbl_breed')}</label>
          <input value={form.Breed} onChange={set('Breed')} className={inp} placeholder={t('fleece_register.placeholder_breed')} />
        </div>
        <div>
          <label className={lbl}>{t('fleece_register.lbl_color')}</label>
          <input value={form.Color} onChange={set('Color')} className={inp} placeholder={t('fleece_register.placeholder_color')} />
        </div>
        <div>
          <label className={lbl}>{t('fleece_register.lbl_source_animal')}</label>
          <select value={form.SourceAnimalID} onChange={set('SourceAnimalID')} className={inp}>
            <option value="">{t('fleece_register.option_none')}</option>
            {animals.map(a => <option key={a.ID ?? a.AnimalID} value={a.ID ?? a.AnimalID}>{a.FullName || a.AnimalName}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{t('fleece_register.lbl_micron')}</label>
          <input value={form.Micron} onChange={set('Micron')} className={inp} placeholder={t('fleece_register.placeholder_micron')} />
        </div>
        <div>
          <label className={lbl}>{t('fleece_register.lbl_staple')}</label>
          <input value={form.StapleLength} onChange={set('StapleLength')} className={inp} placeholder={t('fleece_register.placeholder_staple')} />
        </div>
      </div>
      <div>
        <label className={lbl}>{t('fleece_register.lbl_notes')}</label>
        <RichTextEditor value={form.Description || ''}
          onChange={(v) => setForm(f => ({ ...f, Description: v }))} minHeight={120} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg">{t('fleece_register.btn_cancel')}</button>
        <button type="submit" disabled={saving} className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg disabled:opacity-50">
          {saving ? t('fleece_register.btn_saving') : t('fleece_register.btn_save')}
        </button>
      </div>
    </form>
  );
}

export default function FleeceRegister() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = params.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [entries, setEntries] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const loadEntries = () => peopleId
    ? fetch(`${API}/api/events/${eventId}/fleece/entries?people_id=${peopleId}`).then(r => r.json()).then(setEntries).catch(() => {})
    : Promise.resolve();

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/fleece/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/fleece/divisions`).then(r => r.ok ? r.json() : []).then(d_ => setDivisions(Array.isArray(d_) ? d_ : [])).catch(() => {});
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
        SourceAnimalID: form.SourceAnimalID ? Number(form.SourceAnimalID) : null,
        DivisionID: form.DivisionID ? Number(form.DivisionID) : null,
        PeopleID: peopleId,
        BusinessID: BusinessID ? Number(BusinessID) : null,
      };
      const r = editing
        ? await fetch(`${API}/api/events/fleece/entries/${editing.EntryID}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
          })
        : await fetch(`${API}/api/events/${eventId}/fleece/entries`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
          });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.detail || t('fleece_register.err_save_failed'));
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
    if (!confirm(t('fleece_register.confirm_remove', { name: entry.FleeceName || t('fleece_register.fleece_fallback') }))) return;
    await fetch(`${API}/api/events/fleece/entries/${entry.EntryID}`, { method: 'DELETE' });
    loadEntries();
  };

  const total = entries.reduce((s, entry) => s + Number(entry.EntryFee || 0), 0);
  const configured = cfg?.configured;
  const closed = configured && cfg?.RegistrationEndDate && new Date(cfg.RegistrationEndDate) < new Date();
  const notYetOpen = configured && cfg?.RegistrationStartDate && new Date(cfg.RegistrationStartDate) > new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('fleece_register.heading')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {event?.EventName || 'Event'}
            {event?.EventLocationCity && ` — ${event.EventLocationCity}, ${event.EventLocationState}`}
          </p>
        </div>
        <Link to={`/events/${eventId}`} className="text-sm text-gray-500 hover:text-gray-700">{t('fleece_register.btn_back')}</Link>
      </div>

      {!configured && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4 mb-4">
          {t('fleece_register.not_configured')}
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
              <div className="text-gray-500">{t('fleece_register.stat_fee')}</div>
              <div className="font-semibold text-gray-900 text-base">${Number(cfg.CurrentFee || cfg.FeePerFleece || 0).toFixed(2)}</div>
              {cfg.DiscountFeePerFleece != null && cfg.DiscountEndDate && (
                <div className="text-[11px] text-gray-400">
                  {t('fleece_register.discount_ends', { date: String(cfg.DiscountEndDate).substring(0, 10) })}
                </div>
              )}
            </div>
            {cfg.MaxFleecesPerRegistrant && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('fleece_register.stat_max')}</div>
                <div className="font-semibold text-gray-900 text-base">{entries.length} / {cfg.MaxFleecesPerRegistrant}</div>
              </div>
            )}
            {cfg.RegistrationEndDate && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('fleece_register.stat_reg_closes')}</div>
                <div className="font-semibold text-gray-900 text-base">{String(cfg.RegistrationEndDate).substring(0, 10)}</div>
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-gray-500">{t('fleece_register.stat_total')}</div>
              <div className="font-semibold text-[#3D6B34] text-base">${total.toFixed(2)}</div>
            </div>
          </div>

          {notYetOpen && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg p-3 mb-4">
              {t('fleece_register.not_yet_open', { date: String(cfg.RegistrationStartDate).substring(0, 10) })}
            </div>
          )}
          {closed && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {t('fleece_register.closed')}
            </div>
          )}

          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{err}</div>}

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('fleece_register.your_fleeces_heading')}</h2>
            {!adding && !editing && !closed && !notYetOpen && peopleId && (
              <button onClick={() => setAdding(true)} className="text-sm bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg hover:bg-[#2d5226]">
                {t('fleece_register.btn_add')}
              </button>
            )}
          </div>

          {!peopleId && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-3">
              {t('fleece_register.login_prompt')} <Link to="/login" className="underline">{t('fleece_register.login_link')}</Link> {t('fleece_register.login_suffix')}
            </div>
          )}

          {(adding || editing) && (
            <EntryForm
              initial={editing || EMPTY_ENTRY}
              onSave={save}
              onCancel={() => { setAdding(false); setEditing(null); }}
              animals={animals}
              divisions={divisions}
              saving={saving}
            />
          )}

          <div className="space-y-2 mt-3">
            {entries.length === 0 && !adding && peopleId && (
              <div className="text-sm text-gray-500">{t('fleece_register.no_entries')}</div>
            )}
            {entries.map(entry => (
              <div key={entry.EntryID} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{entry.FleeceName || entry.AnimalName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {[entry.DivisionName, entry.Breed, entry.Color, entry.Micron && `${entry.Micron}μ`, entry.StapleLength].filter(Boolean).join(' • ')}
                    </div>
                    {entry.Description && <div className="text-xs text-gray-600 mt-1">{entry.Description}</div>}
                    {entry.Placement && <div className="text-xs font-semibold text-[#3D6B34] mt-1">🏆 {entry.Placement}{entry.Score != null && ` • ${t('fleece_register.score_label', { n: entry.Score })}`}</div>}
                    {entry.JudgeNotes && <div className="text-xs italic text-gray-500 mt-0.5">{t('fleece_register.judge_prefix')} {entry.JudgeNotes}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm font-medium">${Number(entry.EntryFee || 0).toFixed(2)}</div>
                    <div className={`text-[11px] px-2 py-0.5 rounded ${entry.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {entry.PaidStatus || t('fleece_register.status_pending')}
                    </div>
                    {!closed && (
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => { setEditing(entry); setAdding(false); }} className="text-xs text-gray-500 hover:text-gray-800">{t('fleece_register.btn_edit')}</button>
                        <button onClick={() => remove(entry)} className="text-xs text-red-500 hover:text-red-700">{t('fleece_register.btn_remove')}</button>
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
