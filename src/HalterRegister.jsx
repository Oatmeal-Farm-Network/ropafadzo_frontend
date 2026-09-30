import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-4 py-1.5 text-sm border border-gray-300 rounded-lg";

const REG_TYPES = ['Halter', 'Production', 'Fleece', 'Get of Sire', 'Produce of Dam'];
const PEN_TYPES = ['Adult', 'Juvenile', 'Mixed'];

const REG_TYPE_KEY_MAP = {
  'Halter': 'halter', 'Production': 'production', 'Fleece': 'fleece',
  'Get of Sire': 'get_of_sire', 'Produce of Dam': 'produce_of_dam',
};
const PEN_TYPE_KEY_MAP = { 'Adult': 'adult', 'Juvenile': 'juvenile', 'Mixed': 'mixed' };

function AnimalRegForm({ animals, classes, onSave, onCancel, saving, reg }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(reg ? {
    AnimalID: reg.AnimalID, RegistrationType: reg.RegistrationType,
    IsShorn: !!reg.IsShorn, ClassIDs: (reg.classes || []).map(c => c.ClassID),
  } : { AnimalID: '', RegistrationType: 'Halter', IsShorn: false, ClassIDs: [] });

  const animal = animals.find(a => (a.ID ?? a.AnimalID) == form.AnimalID);
  const animalBreed = animal?.Breed || animal?.SpeciesBreed;

  const relevantClasses = classes.filter(c => {
    if (form.RegistrationType !== 'Halter' && c.ClassType !== form.RegistrationType) {
      if (form.RegistrationType === 'Halter') return c.ClassType === 'Halter';
      return c.ClassType === form.RegistrationType;
    }
    return form.RegistrationType === 'Halter' ? c.ClassType === 'Halter' : c.ClassType === form.RegistrationType;
  });

  const byBreed = relevantClasses.reduce((acc, c) => {
    (acc[c.Breed || 'Other'] ||= []).push(c);
    return acc;
  }, {});

  const toggleClass = (cid) => {
    setForm(f => f.ClassIDs.includes(cid)
      ? { ...f, ClassIDs: f.ClassIDs.filter(x => x !== cid) }
      : { ...f, ClassIDs: [...f.ClassIDs, cid] });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className={lbl}>{t('halter_register.lbl_animal')}</label>
          <select required disabled={!!reg} value={form.AnimalID}
            onChange={(e) => setForm(f => ({ ...f, AnimalID: e.target.value }))} className={inp}>
            <option value="">{t('halter_register.option_select_animal')}</option>
            {animals.map(a => (
              <option key={a.ID ?? a.AnimalID} value={a.ID ?? a.AnimalID}>
                {a.FullName || a.AnimalName || a.RegisteredName}
                {a.Breed && ` (${a.Breed})`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('halter_register.lbl_reg_type')}</label>
          <select value={form.RegistrationType}
            onChange={(e) => setForm(f => ({ ...f, RegistrationType: e.target.value, ClassIDs: [] }))}
            className={inp}>
            {REG_TYPES.map(typ => <option key={typ} value={typ}>{t(`halter_register.reg_type_${REG_TYPE_KEY_MAP[typ]}`, { defaultValue: typ })}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.IsShorn}
              onChange={(e) => setForm(f => ({ ...f, IsShorn: e.target.checked }))} />
            {t('halter_register.lbl_is_shorn')}
          </label>
        </div>
      </div>

      {animals.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg p-2">
          {t('halter_register.no_animals_warning')}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className={lbl}>{t('halter_register.lbl_classes', { n: form.ClassIDs.length })}</div>
          {animalBreed && <div className="text-xs text-gray-400">{t('halter_register.animal_breed_hint', { breed: animalBreed })}</div>}
        </div>
        <div className="max-h-[300px] overflow-y-auto bg-white border border-gray-200 rounded-lg p-2 space-y-2">
          {Object.keys(byBreed).length === 0 && (
            <div className="text-xs text-gray-500 p-2">{t('halter_register.no_classes_available', { type: form.RegistrationType })}</div>
          )}
          {Object.entries(byBreed).map(([breed, list]) => (
            <div key={breed}>
              <div className="text-xs font-semibold text-gray-500 uppercase px-1">{breed}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
                {list.map(c => (
                  <label key={c.ClassID}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-50 ${form.ClassIDs.includes(c.ClassID) ? 'bg-[#3D6B34]/10' : ''}`}>
                    <input type="checkbox" checked={form.ClassIDs.includes(c.ClassID)}
                      onChange={() => toggleClass(c.ClassID)} />
                    <span className="flex-1">
                      {c.ClassName}
                      {c.ClassCode && <span className="text-xs text-gray-400 ml-1">({c.ClassCode})</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className={btnGhost}>{t('halter_register.btn_cancel')}</button>
        <button type="submit" disabled={saving} className={btn}>{saving ? t('halter_register.btn_saving') : t('halter_register.btn_save_reg')}</button>
      </div>
    </form>
  );
}

function PenForm({ cfg, onSave, onCancel, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    PenType: 'Adult', NeedsElectricity: false, NeedsStallMat: false, NeedsVetCheck: false, Notes: '',
  });
  const fee = Number(cfg?.FeePerPen || 0)
    + (form.NeedsElectricity ? Number(cfg?.ElectricityFee || 0) : 0)
    + (form.NeedsStallMat ? Number(cfg?.StallMatFee || 0) : 0)
    + (form.NeedsVetCheck ? Number(cfg?.VetCheckFee || 0) : 0);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className={lbl}>{t('halter_register.lbl_pen_type')}</label>
          <select value={form.PenType} onChange={(e) => setForm(f => ({ ...f, PenType: e.target.value }))} className={inp}>
            {PEN_TYPES.map(typ => <option key={typ} value={typ}>{t(`halter_register.pen_type_${PEN_TYPE_KEY_MAP[typ]}`, { defaultValue: typ })}</option>)}
          </select>
        </div>
        <label className="flex items-end gap-2 text-sm pb-2">
          <input type="checkbox" checked={form.NeedsElectricity}
            onChange={(e) => setForm(f => ({ ...f, NeedsElectricity: e.target.checked }))} />
          {t('halter_register.pen_electricity', { fee: Number(cfg?.ElectricityFee || 0).toFixed(2) })}
        </label>
        <label className="flex items-end gap-2 text-sm pb-2">
          <input type="checkbox" checked={form.NeedsStallMat}
            onChange={(e) => setForm(f => ({ ...f, NeedsStallMat: e.target.checked }))} />
          {t('halter_register.pen_stall_mat', { fee: Number(cfg?.StallMatFee || 0).toFixed(2) })}
        </label>
        <label className="flex items-end gap-2 text-sm pb-2">
          <input type="checkbox" checked={form.NeedsVetCheck}
            onChange={(e) => setForm(f => ({ ...f, NeedsVetCheck: e.target.checked }))} />
          {t('halter_register.pen_vet_check', { fee: Number(cfg?.VetCheckFee || 0).toFixed(2) })}
        </label>
      </div>
      <div>
        <label className={lbl}>{t('halter_register.lbl_notes')}</label>
        <RichTextEditor value={form.Notes || ''}
          onChange={(v) => setForm(f => ({ ...f, Notes: v }))} minHeight={120} />
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm">{t('halter_register.pen_fee_label')} <span className="font-bold text-[#3D6B34]">${fee.toFixed(2)}</span></div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className={btnGhost}>{t('halter_register.btn_cancel')}</button>
          <button type="submit" disabled={saving} className={btn}>{saving ? t('halter_register.btn_saving') : t('halter_register.btn_reserve_pen')}</button>
        </div>
      </div>
    </form>
  );
}

export default function HalterRegister() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = params.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [classes, setClasses] = useState([]);
  const [regs, setRegs] = useState([]);
  const [pens, setPens] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [addingPen, setAddingPen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const loadRegs = () => peopleId
    ? fetch(`${API}/api/events/${eventId}/halter/registrations?people_id=${peopleId}`)
        .then(r => r.json()).then(setRegs).catch(() => {})
    : Promise.resolve();
  const loadPens = () => peopleId
    ? fetch(`${API}/api/events/${eventId}/halter/pens?people_id=${peopleId}`)
        .then(r => r.json()).then(setPens).catch(() => {})
    : Promise.resolve();

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/halter/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/halter/classes`).then(r => r.json()).then(setClasses).catch(() => {});
    loadRegs(); loadPens();
    if (BusinessID) {
      fetch(`${API}/auth/animals?BusinessID=${BusinessID}`)
        .then(r => r.ok ? r.json() : [])
        .then(a => setAnimals(Array.isArray(a) ? a : []))
        .catch(() => {});
    }
  }, [eventId, BusinessID, peopleId]);

  const saveReg = async (form) => {
    setErr(''); setSaving(true);
    try {
      const body = {
        AnimalID: Number(form.AnimalID),
        RegistrationType: form.RegistrationType,
        IsShorn: form.IsShorn,
        ClassIDs: form.ClassIDs,
        PeopleID: peopleId,
        BusinessID: BusinessID ? Number(BusinessID) : null,
      };
      let r;
      if (editing) {
        r = await fetch(`${API}/api/events/halter/registrations/${editing.RegID}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      } else {
        r = await fetch(`${API}/api/events/${eventId}/halter/registrations`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      }
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.detail || t('halter_register.err_save_failed')); }
      setAdding(false); setEditing(null); loadRegs();
    } catch (ex) { setErr(ex.message); }
    finally { setSaving(false); }
  };

  const removeReg = async (r) => {
    if (!confirm(t('halter_register.confirm_remove_animal', { name: r.AnimalName }))) return;
    await fetch(`${API}/api/events/halter/registrations/${r.RegID}`, { method: 'DELETE' });
    loadRegs();
  };

  const savePen = async (form) => {
    setErr(''); setSaving(true);
    try {
      const r = await fetch(`${API}/api/events/${eventId}/halter/pens`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, PeopleID: peopleId, BusinessID: BusinessID ? Number(BusinessID) : null }),
      });
      if (!r.ok) throw new Error(t('halter_register.err_pen_reserve_failed'));
      setAddingPen(false); loadPens();
    } catch (ex) { setErr(ex.message); }
    finally { setSaving(false); }
  };

  const removePen = async (p) => {
    if (!confirm(t('halter_register.confirm_release_pen', { id: p.PenID }))) return;
    await fetch(`${API}/api/events/halter/pens/${p.PenID}`, { method: 'DELETE' });
    loadPens();
  };

  const configured = cfg?.configured;
  const closed = configured && cfg?.RegistrationEndDate && new Date(cfg.RegistrationEndDate) < new Date();
  const regFees = regs.reduce((s, r) => s + Number(r.Fee || 0), 0);
  const penFees = pens.reduce((s, p) => s + Number(p.Fee || 0), 0);
  const total = regFees + penFees;
  const maxPens = cfg?.MaxPensPerFarm;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('halter_register.heading')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {event?.EventName || 'Event'}
            {event?.EventLocationCity && ` — ${event.EventLocationCity}, ${event.EventLocationState}`}
          </p>
        </div>
        <Link to={`/events/${eventId}`} className="text-sm text-gray-500 hover:text-gray-700">{t('halter_register.btn_back')}</Link>
      </div>

      {!configured && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4 mb-4">
          {t('halter_register.not_configured')}
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
              <div className="text-gray-500">{t('halter_register.stat_fee_per_animal')}</div>
              <div className="font-semibold text-gray-900 text-base">
                ${Number(cfg.CurrentFeePerAnimal || cfg.FeePerAnimal || 0).toFixed(2)}
              </div>
              {cfg.DiscountFeePerAnimal != null && cfg.DiscountEndDate && (
                <div className="text-[11px] text-gray-400">{t('halter_register.discount_ends', { date: String(cfg.DiscountEndDate).substring(0, 10) })}</div>
              )}
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-gray-500">{t('halter_register.stat_fee_per_pen')}</div>
              <div className="font-semibold text-gray-900 text-base">${Number(cfg.FeePerPen || 0).toFixed(2)}</div>
              {maxPens && <div className="text-[11px] text-gray-400">{t('halter_register.max_per_farm', { n: maxPens })}</div>}
            </div>
            {cfg.RegistrationEndDate && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('halter_register.stat_reg_closes')}</div>
                <div className="font-semibold text-gray-900 text-base">{String(cfg.RegistrationEndDate).substring(0, 10)}</div>
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-gray-500">{t('halter_register.stat_your_total')}</div>
              <div className="font-semibold text-[#3D6B34] text-base">${total.toFixed(2)}</div>
              <div className="text-[11px] text-gray-400">
                {t('halter_register.stat_count', {
                  animals: regs.length, animalS: regs.length === 1 ? '' : 's',
                  pens: pens.length, penS: pens.length === 1 ? '' : 's',
                })}
              </div>
            </div>
          </div>

          {closed && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {t('halter_register.reg_closed')}
            </div>
          )}

          {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{err}</div>}

          {!peopleId && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-3">
              {t('halter_register.login_prompt')} <Link to="/login" className="underline">{t('halter_register.login_link')}</Link> {t('halter_register.login_suffix')}
            </div>
          )}

          {/* ANIMALS */}
          <div className="flex justify-between items-center mb-2 mt-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('halter_register.animals_heading', { n: regs.length })}</h2>
            {!adding && !editing && !closed && peopleId && (
              <button onClick={() => setAdding(true)} className={btn}>{t('halter_register.btn_register_animal')}</button>
            )}
          </div>

          {(adding || editing) && (
            <AnimalRegForm animals={animals} classes={classes} saving={saving} reg={editing}
              onSave={saveReg} onCancel={() => { setAdding(false); setEditing(null); }} />
          )}

          <div className="space-y-2 mt-2">
            {regs.length === 0 && !adding && peopleId && (
              <div className="text-sm text-gray-500">{t('halter_register.no_animals_reg')}</div>
            )}
            {regs.map(r => (
              <div key={r.RegID} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{r.AnimalName || t('halter_register.animal_num', { n: r.AnimalID })}</div>
                    <div className="text-xs text-gray-500">
                      {r.RegistrationType}{r.IsShorn && t('halter_register.label_shorn')}
                      {r.IsCheckedIn && <span className="text-green-700 ml-1">{t('halter_register.label_checked_in')}</span>}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {(r.classes || []).length === 0 && <span className="text-gray-400">{t('halter_register.no_classes_selected')}</span>}
                      {(r.classes || []).map(c => (
                        <div key={c.EntryID}>
                          • {c.ClassName}
                          {c.Placement && <span className="text-[#3D6B34] font-semibold ml-1">— {c.Placement}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm font-medium">${Number(r.Fee || 0).toFixed(2)}</div>
                    <div className={`text-[11px] px-2 py-0.5 rounded ${r.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t(`halter_register.status_${r.PaidStatus}`, { defaultValue: r.PaidStatus })}
                    </div>
                    {!closed && (
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => { setEditing(r); setAdding(false); }} className="text-xs text-gray-500 hover:text-gray-800">{t('halter_register.btn_edit')}</button>
                        <button onClick={() => removeReg(r)} className="text-xs text-red-500 hover:text-red-700">{t('halter_register.btn_remove')}</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PENS */}
          <div className="flex justify-between items-center mb-2 mt-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              {maxPens
                ? t('halter_register.pens_heading_max', { n: pens.length, max: maxPens })
                : t('halter_register.pens_heading', { n: pens.length })}
            </h2>
            {!addingPen && !closed && peopleId && (!maxPens || pens.length < maxPens) && (
              <button onClick={() => setAddingPen(true)} className={btn}>{t('halter_register.btn_add_pen')}</button>
            )}
          </div>

          {addingPen && (
            <PenForm cfg={cfg} saving={saving} onSave={savePen} onCancel={() => setAddingPen(false)} />
          )}

          <div className="space-y-2 mt-2">
            {pens.length === 0 && !addingPen && peopleId && (
              <div className="text-sm text-gray-500">{t('halter_register.no_pens')}</div>
            )}
            {pens.map(p => (
              <div key={p.PenID} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {t('halter_register.pen_number', { num: p.PenNumber || p.PenID, type: p.PenType })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {[
                      p.NeedsElectricity && t('halter_register.extra_electricity'),
                      p.NeedsStallMat && t('halter_register.extra_stall_mat'),
                      p.NeedsVetCheck && t('halter_register.extra_vet_check'),
                    ].filter(Boolean).join(' · ') || t('halter_register.no_extras')}
                    {p.Notes && ` · ${p.Notes}`}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm font-medium">${Number(p.Fee || 0).toFixed(2)}</div>
                  {!closed && (
                    <button onClick={() => removePen(p)} className="text-xs text-red-500 hover:text-red-700">{t('halter_register.btn_release')}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
