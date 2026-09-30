import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import AnimalPickerStep from './AnimalPickerStep';
import WizardPayStep from './WizardPayStep';
import WizardAttendeesStep from './WizardAttendeesStep';
import ThaiymeChat from './ThaiymeChat';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#3D6B34]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

// Maps EventFeatures FeatureKey → step key
const FEATURE_STEPS = {
  halter_module:     'halter',
  fleece_module:     'fleece',
  spinoff_module:    'spinoff',
  fiber_arts_module: 'fiber_arts',
  vendor_fair_module:'vendor',
};

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function StepHeader({ stepIndex, steps }) {
  return (
    <div className="flex items-center gap-1 mb-6 text-xs overflow-x-auto">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={`flex items-center gap-1.5 whitespace-nowrap ${i === stepIndex ? 'text-[#3D6B34] font-semibold' : i < stepIndex ? 'text-green-700' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 ${
              i < stepIndex ? 'bg-green-600 border-green-600 text-white'
              : i === stepIndex ? 'border-[#3D6B34] text-[#3D6B34]'
              : 'border-gray-300 text-gray-400'
            }`}>{i < stepIndex ? '✓' : i + 1}</div>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`h-px flex-1 min-w-[12px] ${i < stepIndex ? 'bg-green-300' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function InfoStep({ form, setForm, onNext }) {
  const { t } = useTranslation();
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const ready = form.AttendeeFirstName && form.AttendeeLastName && form.AttendeeEmail;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.info_title')}</h2>
      <p className="text-xs text-gray-500 mb-5">{t('event_wizard.info_subtitle')}</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className={lbl}>{t('event_wizard.label_first_name')}</label>
          <input value={form.AttendeeFirstName} onChange={set('AttendeeFirstName')} className={inp} /></div>
        <div><label className={lbl}>{t('event_wizard.label_last_name')}</label>
          <input value={form.AttendeeLastName} onChange={set('AttendeeLastName')} className={inp} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className={lbl}>{t('event_wizard.label_email')}</label>
          <input type="email" value={form.AttendeeEmail} onChange={set('AttendeeEmail')} className={inp} /></div>
        <div><label className={lbl}>{t('event_wizard.label_phone')} <span className="text-gray-400 font-normal">{t('event_wizard.label_phone_optional')}</span></label>
          <input value={form.AttendeePhone} onChange={set('AttendeePhone')} className={inp} /></div>
      </div>
      <div className="flex justify-end mt-5">
        <button disabled={!ready} onClick={onNext}
          className="bg-[#3D6B34] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2d5226] disabled:opacity-50">
          {t('event_wizard.btn_continue')}
        </button>
      </div>
    </div>
  );
}

function HalterStep({ eventId, cartId, pickedAnimals, entries, setEntries, onNext, onBack, businessId, peopleId }) {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [cfg, setCfg] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/halter/classes`).then(r => r.json()).then(setClasses).catch(() => setClasses([]));
    fetch(`${API}/api/events/${eventId}/halter/config`).then(r => r.json()).then(setCfg).catch(() => {});
  }, [eventId]);

  const entryForAnimal = (animalId) => entries.find(e => e.AnimalID === animalId) || { AnimalID: animalId, ClassIDs: [] };
  const toggleClass = (animalId, classId) => {
    setEntries(prev => {
      const existing = prev.find(e => e.AnimalID === animalId);
      if (existing) {
        const has = existing.ClassIDs.includes(classId);
        const next = { ...existing, ClassIDs: has ? existing.ClassIDs.filter(x => x !== classId) : [...existing.ClassIDs, classId] };
        return prev.map(e => e.AnimalID === animalId ? next : e);
      }
      return [...prev, { AnimalID: animalId, ClassIDs: [classId] }];
    });
  };

  const feePerClass = Number(cfg?.CurrentFee || cfg?.FeePerClass || 0);
  const totalClasses = entries.reduce((s, e) => s + e.ClassIDs.length, 0);

  if (!pickedAnimals.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.step_halter')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('event_wizard.halter_no_animals')}</p>
        <div className="flex justify-between">
          <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.btn_back')}</button>
          <button onClick={onNext} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.halter_skip')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.step_halter')}</h2>
      <p className="text-xs text-gray-500 mb-4">{t('event_wizard.halter_fee_hint', { fee: feePerClass.toFixed(2) })}</p>

      {classes.length === 0 && <div className="text-sm text-gray-500">{t('event_wizard.halter_no_classes')}</div>}

      {pickedAnimals.map(a => {
        const e = entryForAnimal(a.ID ?? a.AnimalID);
        const aid = a.ID ?? a.AnimalID;
        return (
          <div key={aid} className="border border-gray-200 rounded-xl p-4 mb-3">
            <div className="font-semibold text-gray-800 mb-2">{a.FullName || a.AnimalName}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {classes.map(c => (
                <label key={c.ClassID} className="flex items-center gap-2 text-sm py-1">
                  <input type="checkbox" checked={e.ClassIDs.includes(c.ClassID)}
                    onChange={() => toggleClass(aid, c.ClassID)} className="accent-green-600" />
                  <span>{c.ClassName}{c.Description && <span className="text-gray-400"> — {c.Description}</span>}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
        <div className="text-gray-600">{t('event_wizard.halter_tally', { count: totalClasses, fee: feePerClass.toFixed(2) })}</div>
        <div className="font-bold text-[#3D6B34]">${(totalClasses * feePerClass).toFixed(2)}</div>
      </div>

      <div className="flex justify-between mt-5">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.btn_back')}</button>
        <button onClick={onNext} className="bg-[#3D6B34] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2d5226]">{t('event_wizard.btn_continue')}</button>
      </div>
    </div>
  );
}

function FleeceStep({ eventId, entries, setEntries, onNext, onBack, pickedAnimals }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(null);
  const [divisions, setDivisions] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/fleece/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/fleece/divisions`).then(r => r.ok ? r.json() : []).then(d => setDivisions(Array.isArray(d) ? d : [])).catch(() => {});
  }, [eventId]);

  const add = () => setEntries([...entries, { FleeceName: '', Breed: '', Color: '', SourceAnimalID: '', DivisionID: '', Description: '' }]);
  const upd = (i, k, v) => setEntries(entries.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const remove = (i) => setEntries(entries.filter((_, idx) => idx !== i));

  const fee = Number(cfg?.CurrentFee || cfg?.FeePerFleece || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.step_fleece')}</h2>
      <p className="text-xs text-gray-500 mb-4">{t('event_wizard.fleece_subtitle', { fee: fee.toFixed(2) })}</p>

      {entries.map((e, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-700 text-sm">{t('event_wizard.fleece_n', { n: i + 1 })}</div>
            <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">{t('event_wizard.btn_remove')}</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl}>{t('event_wizard.label_fleece_name')}</label>
              <input className={inp} value={e.FleeceName} onChange={ev => upd(i, 'FleeceName', ev.target.value)} /></div>
            <div><label className={lbl}>{t('event_wizard.label_source_animal')}</label>
              <select className={inp} value={e.SourceAnimalID} onChange={ev => upd(i, 'SourceAnimalID', ev.target.value)}>
                <option value="">{t('event_wizard.none_option')}</option>
                {pickedAnimals.map(a => <option key={a.ID ?? a.AnimalID} value={a.ID ?? a.AnimalID}>{a.FullName || a.AnimalName}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className={lbl}>{t('event_wizard.label_breed')}</label><input className={inp} value={e.Breed} onChange={ev => upd(i, 'Breed', ev.target.value)} /></div>
            <div><label className={lbl}>{t('event_wizard.label_color')}</label><input className={inp} value={e.Color} onChange={ev => upd(i, 'Color', ev.target.value)} /></div>
            {divisions.length > 0 && (
              <div><label className={lbl}>{t('event_wizard.label_division')}</label>
                <select className={inp} value={e.DivisionID} onChange={ev => upd(i, 'DivisionID', ev.target.value)}>
                  <option value="">{t('event_wizard.none_option')}</option>
                  {divisions.map(d => <option key={d.DivisionID} value={d.DivisionID}>{d.DivisionName}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      ))}

      <button onClick={add} className="text-sm text-[#3D6B34] border border-[#3D6B34] rounded-lg px-3 py-1.5 hover:bg-green-50">{t('event_wizard.btn_add_fleece')}</button>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
        <div className="text-gray-600">{t('event_wizard.fleece_tally', { count: entries.length, fee: fee.toFixed(2) })}</div>
        <div className="font-bold text-[#3D6B34]">${(entries.length * fee).toFixed(2)}</div>
      </div>

      <div className="flex justify-between mt-5">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.btn_back')}</button>
        <button onClick={onNext} className="bg-[#3D6B34] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2d5226]">{t('event_wizard.btn_continue')}</button>
      </div>
    </div>
  );
}

function SpinOffStep({ eventId, entries, setEntries, onNext, onBack, pickedAnimals }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/spinoff/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/spinoff/categories`).then(r => r.ok ? r.json() : []).then(c => setCategories(Array.isArray(c) ? c : [])).catch(() => {});
  }, [eventId]);

  const add = () => setEntries([...entries, { EntryTitle: '', SpinnerName: '', FiberType: '', FiberSource: '', SourceAnimalID: '', CategoryID: '', Description: '' }]);
  const upd = (i, k, v) => setEntries(entries.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const remove = (i) => setEntries(entries.filter((_, idx) => idx !== i));
  const fee = Number(cfg?.CurrentFee || cfg?.FeePerEntry || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.step_spinoff')}</h2>
      <p className="text-xs text-gray-500 mb-4">{t('event_wizard.spinoff_subtitle', { fee: fee.toFixed(2) })}</p>

      {entries.map((e, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-700 text-sm">{t('event_wizard.entry_n', { n: i + 1 })}</div>
            <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">{t('event_wizard.btn_remove')}</button>
          </div>
          <div><label className={lbl}>{t('event_wizard.label_entry_title')}</label>
            <input className={inp} value={e.EntryTitle} onChange={ev => upd(i, 'EntryTitle', ev.target.value)} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={lbl}>{t('event_wizard.label_spinner_name')}</label>
              <input className={inp} value={e.SpinnerName} onChange={ev => upd(i, 'SpinnerName', ev.target.value)} /></div>
            <div><label className={lbl}>{t('event_wizard.label_fiber_type')}</label>
              <input className={inp} value={e.FiberType} onChange={ev => upd(i, 'FiberType', ev.target.value)} /></div>
          </div>
          {categories.length > 0 && (
            <div><label className={lbl}>{t('event_wizard.label_category')}</label>
              <select className={inp} value={e.CategoryID} onChange={ev => upd(i, 'CategoryID', ev.target.value)}>
                <option value="">{t('event_wizard.none_option')}</option>
                {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
              </select>
            </div>
          )}
        </div>
      ))}

      <button onClick={add} className="text-sm text-[#3D6B34] border border-[#3D6B34] rounded-lg px-3 py-1.5 hover:bg-green-50">{t('event_wizard.btn_add_entry')}</button>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
        <div className="text-gray-600">{t('event_wizard.entry_tally', { count: entries.length, fee: fee.toFixed(2) })}</div>
        <div className="font-bold text-[#3D6B34]">${(entries.length * fee).toFixed(2)}</div>
      </div>

      <div className="flex justify-between mt-5">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.btn_back')}</button>
        <button onClick={onNext} className="bg-[#3D6B34] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2d5226]">{t('event_wizard.btn_continue')}</button>
      </div>
    </div>
  );
}

function FiberArtsStep({ eventId, entries, setEntries, onNext, onBack }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(null);
  const [cats, setCats] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/fiber-arts/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/fiber-arts/categories`).then(r => r.ok ? r.json() : []).then(c => setCats(Array.isArray(c) ? c : [])).catch(() => {});
  }, [eventId]);

  const add = () => setEntries([...entries, { EntryTitle: '', CategoryID: '', Description: '' }]);
  const upd = (i, k, v) => setEntries(entries.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const remove = (i) => setEntries(entries.filter((_, idx) => idx !== i));
  const fee = Number(cfg?.CurrentFee || cfg?.FeePerEntry || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.step_fiber_arts')}</h2>
      <p className="text-xs text-gray-500 mb-4">{t('event_wizard.fiber_subtitle', { fee: fee.toFixed(2) })}</p>

      {entries.map((e, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-700 text-sm">{t('event_wizard.entry_n', { n: i + 1 })}</div>
            <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">{t('event_wizard.btn_remove')}</button>
          </div>
          <div><label className={lbl}>{t('event_wizard.label_entry_title')}</label>
            <input className={inp} value={e.EntryTitle} onChange={ev => upd(i, 'EntryTitle', ev.target.value)} /></div>
          {cats.length > 0 && (
            <div><label className={lbl}>{t('event_wizard.label_category')}</label>
              <select className={inp} value={e.CategoryID} onChange={ev => upd(i, 'CategoryID', ev.target.value)}>
                <option value="">{t('event_wizard.none_option')}</option>
                {cats.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
              </select>
            </div>
          )}
        </div>
      ))}

      <button onClick={add} className="text-sm text-[#3D6B34] border border-[#3D6B34] rounded-lg px-3 py-1.5 hover:bg-green-50">{t('event_wizard.btn_add_entry')}</button>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
        <div className="text-gray-600">{t('event_wizard.entry_tally', { count: entries.length, fee: fee.toFixed(2) })}</div>
        <div className="font-bold text-[#3D6B34]">${(entries.length * fee).toFixed(2)}</div>
      </div>

      <div className="flex justify-between mt-5">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.btn_back')}</button>
        <button onClick={onNext} className="bg-[#3D6B34] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2d5226]">{t('event_wizard.btn_continue')}</button>
      </div>
    </div>
  );
}

function VendorStep({ eventId, booth, setBooth, onNext, onBack }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/vendor-fair/config`).then(r => r.json()).then(setCfg).catch(() => {});
  }, [eventId]);
  const fee = Number(cfg?.BoothFee || 0);
  const set = (k) => (e) => setBooth({ ...booth, [k]: e.target.value });
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.step_vendor')}</h2>
      <p className="text-xs text-gray-500 mb-4">{t('event_wizard.vendor_subtitle', { fee: fee.toFixed(2) })}</p>
      <label className="flex items-center gap-2 text-sm mb-3">
        <input type="checkbox" checked={!!booth.include} onChange={e => setBooth({ ...booth, include: e.target.checked })} className="accent-green-600" />
        {t('event_wizard.vendor_include')}
      </label>
      {booth.include && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className={lbl}>{t('event_wizard.label_stall_name')}</label>
            <input className={inp} value={booth.BusinessName || ''} onChange={set('BusinessName')} /></div>
          <div><label className={lbl}>{t('event_wizard.label_products')}</label>
            <input className={inp} value={booth.Products || ''} onChange={set('Products')} /></div>
          <div className="md:col-span-2"><label className={lbl}>{t('event_wizard.label_special_requests')}</label>
            <textarea rows={2} className={inp} value={booth.Notes || ''} onChange={set('Notes')} /></div>
        </div>
      )}
      <div className="flex justify-between mt-5">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.btn_back')}</button>
        <button onClick={onNext} className="bg-[#3D6B34] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2d5226]">{t('event_wizard.btn_continue')}</button>
      </div>
    </div>
  );
}

function MealsStep({ eventId, sessions, selections, setSelections, onNext, onBack }) {
  const { t } = useTranslation();
  const setQty = (sid, qty) => setSelections({ ...selections, [sid]: { ...selections[sid], Quantity: Math.max(0, qty) } });
  const setDiet = (sid, diet) => setSelections({ ...selections, [sid]: { ...selections[sid], DietaryNotes: diet } });
  const total = sessions.reduce((s, x) => s + (selections[x.SessionID]?.Quantity || 0) * Number(x.Price || 0), 0);

  if (sessions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.meals_title')}</h2>
      <p className="text-xs text-gray-500 mb-4">{t('event_wizard.meals_subtitle')}</p>
      {sessions.map(s => {
        const sel = selections[s.SessionID] || { Quantity: 0, DietaryNotes: '' };
        const remaining = s.MaxTickets ? s.MaxTickets - (s.SoldCount || 0) : null;
        const soldOut = remaining !== null && remaining <= 0;
        return (
          <div key={s.SessionID} className="border border-gray-200 rounded-xl p-4 mb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{s.SessionName}</div>
                <div className="text-xs text-gray-500">
                  {s.SessionDate && new Date(s.SessionDate).toLocaleDateString()}
                  {s.SessionTime && ` • ${s.SessionTime}`}
                </div>
                {s.Description && <div className="text-xs text-gray-600 mt-1">{s.Description}</div>}
                <div className="text-sm font-bold text-[#3D6B34] mt-1">${Number(s.Price || 0).toFixed(2)}</div>
                {remaining !== null && (
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {soldOut ? t('event_wizard.sold_out') : t('event_wizard.tickets_left', { count: remaining })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button disabled={soldOut} onClick={() => setQty(s.SessionID, (sel.Quantity || 0) - 1)}
                  className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-40">−</button>
                <span className="w-6 text-center text-sm font-medium">{sel.Quantity || 0}</span>
                <button disabled={soldOut} onClick={() => setQty(s.SessionID, (sel.Quantity || 0) + 1)}
                  className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-40">+</button>
              </div>
            </div>
            {(sel.Quantity || 0) > 0 && (
              <div className="mt-3">
                <label className={lbl}>{t('event_wizard.label_dietary_notes')}</label>
                <input className={inp} placeholder={t('event_wizard.dietary_placeholder')}
                  value={sel.DietaryNotes || ''} onChange={e => setDiet(s.SessionID, e.target.value)} />
              </div>
            )}
          </div>
        );
      })}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm">
        <div className="text-gray-600">{t('event_wizard.meals_subtotal')}</div>
        <div className="font-bold text-[#3D6B34]">${total.toFixed(2)}</div>
      </div>
      <div className="flex justify-between mt-5">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.btn_back')}</button>
        <button onClick={onNext} className="bg-[#3D6B34] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2d5226]">{t('event_wizard.btn_continue')}</button>
      </div>
    </div>
  );
}

function ReviewStep({ cart, items, onBack, onPay, submitting }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-1">{t('event_wizard.review_title')}</h2>
      <p className="text-xs text-gray-500 mb-4">{t('event_wizard.review_subtitle')}</p>

      <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden mb-4">
        {items.length === 0 && <div className="px-4 py-6 text-sm text-center text-gray-400">{t('event_wizard.review_no_items')}</div>}
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
            <div>
              <span className="text-xs uppercase text-gray-400 mr-2">{it.FeatureKey}</span>
              <span className="font-medium">{it.Label}</span>
              {it.Quantity > 1 && <span className="text-gray-400 ml-1">× {it.Quantity}</span>}
            </div>
            <div className="font-semibold">${Number(it.LineAmount ?? (it.Quantity * it.UnitAmount)).toFixed(2)}</div>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 text-sm">
          <span>{t('event_wizard.review_subtotal')}</span>
          <span className="font-semibold">${Number(cart?.Subtotal || 0).toFixed(2)}</span>
        </div>
        {Number(cart?.PlatformFeeAmount || 0) > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 text-xs text-gray-500">
            <span>{t('event_wizard.review_platform_fee')}</span>
            <span>${Number(cart.PlatformFeeAmount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
          <span className="font-bold">{t('event_wizard.review_total')}</span>
          <span className="font-bold text-lg text-[#3D6B34]">${Number(cart?.Total || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">{t('event_wizard.btn_back')}</button>
        <button onClick={onPay} disabled={submitting}
          className="bg-[#3D6B34] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#2d5226] disabled:opacity-50">
          {submitting ? t('event_wizard.btn_preparing') : (Number(cart?.Total || 0) > 0 ? t('event_wizard.btn_pay') : t('event_wizard.btn_complete'))}
        </button>
      </div>
    </div>
  );
}

export default function EventRegisterWizard() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [qs] = useSearchParams();
  const navigate = useNavigate();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = qs.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [features, setFeatures] = useState([]);
  const [mealSessions, setMealSessions] = useState([]);
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    AttendeeFirstName: '', AttendeeLastName: '', AttendeeEmail: '', AttendeePhone: '',
  });
  const [animals, setAnimals] = useState([]);
  const [halterEntries, setHalterEntries] = useState([]);
  const [fleeceEntries, setFleeceEntries] = useState([]);
  const [spinoffEntries, setSpinoffEntries] = useState([]);
  const [fiberEntries, setFiberEntries] = useState([]);
  const [vendor, setVendor] = useState({ include: false });
  const [mealSel, setMealSel] = useState({});

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/events/${eventId}`).then(r => r.json()),
      fetch(`${API}/api/events/${eventId}/features`).then(r => r.json()),
      fetch(`${API}/api/events/${eventId}/meals/sessions`).then(r => r.ok ? r.json() : []),
    ]).then(([ev, feats, meals]) => {
      setEvent(ev);
      setFeatures(feats?.features || []);
      setMealSessions(Array.isArray(meals) ? meals : []);
      setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
  }, [eventId]);

  useEffect(() => {
    if (!peopleId) return;
    fetch(`${API}/auth/people/${peopleId}`).then(r => r.ok ? r.json() : null).then(p => {
      if (!p) return;
      setForm(f => ({
        AttendeeFirstName: f.AttendeeFirstName || p.PeopleFirstName || '',
        AttendeeLastName:  f.AttendeeLastName  || p.PeopleLastName  || '',
        AttendeeEmail:     f.AttendeeEmail     || p.PeopleEmail     || '',
        AttendeePhone:     f.AttendeePhone     || p.PeoplePhone     || '',
      }));
    }).catch(() => {});
  }, [peopleId]);

  const stepLabelMap = useMemo(() => ({
    halter:     t('event_wizard.step_halter'),
    fleece:     t('event_wizard.step_fleece'),
    spinoff:    t('event_wizard.step_spinoff'),
    fiber_arts: t('event_wizard.step_fiber_arts'),
    vendor:     t('event_wizard.step_vendor'),
  }), [t]);

  const featureSteps = useMemo(() => {
    const keys = new Set((features || []).map(f => f.FeatureKey));
    return Object.entries(FEATURE_STEPS)
      .filter(([fk]) => keys.has(fk))
      .map(([_, stepKey]) => ({ key: stepKey, label: stepLabelMap[stepKey] }));
  }, [features, stepLabelMap]);

  const steps = useMemo(() => {
    const s = [{ key: 'info', label: t('event_wizard.step_info') }];
    s.push({ key: 'attendees', label: t('event_wizard.step_attendees') });
    if (featureSteps.some(f => f.key === 'halter')) {
      s.push({ key: 'animals', label: t('event_wizard.step_animals') });
    }
    featureSteps.forEach(f => s.push(f));
    if (mealSessions.length > 0) s.push({ key: 'meals', label: t('event_wizard.step_meals') });
    s.push({ key: 'review', label: t('event_wizard.step_review') });
    s.push({ key: 'pay', label: t('event_wizard.step_pay') });
    s.push({ key: 'done', label: t('event_wizard.step_done') });
    return s;
  }, [featureSteps, mealSessions, t]);

  const [stepIndex, setStepIndex] = useState(0);
  const current = steps[stepIndex];

  const goNext = () => setStepIndex(i => Math.min(i + 1, steps.length - 1));
  const goBack = () => setStepIndex(i => Math.max(i - 1, 0));

  const ensureCart = async () => {
    if (cart?.CartID) return cart;
    const res = await fetch(`${API}/api/events/${eventId}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        PeopleID: peopleId,
        BusinessID: BusinessID ? Number(BusinessID) : null,
        ...form,
      }),
    });
    const j = await res.json();
    const full = await fetch(`${API}/api/events/cart/${j.CartID}`).then(r => r.json());
    setCart(full);
    return full;
  };

  const buildReviewItems = async () => {
    const c = await ensureCart();
    const out = [];

    if (halterEntries.length && featureSteps.some(f => f.key === 'halter')) {
      const [classes, cfg] = await Promise.all([
        fetch(`${API}/api/events/${eventId}/halter/classes`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/events/${eventId}/halter/config`).then(r => r.json()).catch(() => ({})),
      ]);
      const fee = Number(cfg?.CurrentFee || cfg?.FeePerClass || 0);
      const classNameById = Object.fromEntries((classes || []).map(c => [c.ClassID, c.ClassName]));
      halterEntries.forEach(he => {
        const a = animals.find(x => (x.ID ?? x.AnimalID) === he.AnimalID);
        he.ClassIDs.forEach(cid => {
          out.push({ FeatureKey: 'halter', Label: `${a?.FullName || a?.AnimalName || 'Animal'} — ${classNameById[cid] || `Class ${cid}`}`, Quantity: 1, UnitAmount: fee, LineAmount: fee });
        });
      });
    }

    if (fleeceEntries.length) {
      const cfg = await fetch(`${API}/api/events/${eventId}/fleece/config`).then(r => r.json()).catch(() => ({}));
      const fee = Number(cfg?.CurrentFee || cfg?.FeePerFleece || 0);
      fleeceEntries.forEach(e => out.push({ FeatureKey: 'fleece', Label: e.FleeceName || t('event_wizard.fleece_entry_default'), Quantity: 1, UnitAmount: fee, LineAmount: fee }));
    }
    if (spinoffEntries.length) {
      const cfg = await fetch(`${API}/api/events/${eventId}/spinoff/config`).then(r => r.json()).catch(() => ({}));
      const fee = Number(cfg?.CurrentFee || cfg?.FeePerEntry || 0);
      spinoffEntries.forEach(e => out.push({ FeatureKey: 'spinoff', Label: e.EntryTitle || t('event_wizard.spinoff_entry_default'), Quantity: 1, UnitAmount: fee, LineAmount: fee }));
    }
    if (fiberEntries.length) {
      const cfg = await fetch(`${API}/api/events/${eventId}/fiber-arts/config`).then(r => r.json()).catch(() => ({}));
      const fee = Number(cfg?.CurrentFee || cfg?.FeePerEntry || 0);
      fiberEntries.forEach(e => out.push({ FeatureKey: 'fiber-arts', Label: e.EntryTitle || t('event_wizard.fiber_entry_default'), Quantity: 1, UnitAmount: fee, LineAmount: fee }));
    }
    if (vendor.include) {
      const cfg = await fetch(`${API}/api/events/${eventId}/vendor-fair/config`).then(r => r.json()).catch(() => ({}));
      const fee = Number(cfg?.BoothFee || 0);
      const label = vendor.BusinessName
        ? t('event_wizard.vendor_stall_named', { name: vendor.BusinessName })
        : t('event_wizard.vendor_stall_label');
      out.push({ FeatureKey: 'vendor', Label: label, Quantity: 1, UnitAmount: fee, LineAmount: fee });
    }
    mealSessions.forEach(s => {
      const sel = mealSel[s.SessionID];
      if (sel?.Quantity > 0) {
        const price = Number(s.Price || 0);
        out.push({ FeatureKey: 'meal', SourceTable: 'OFNEventMealSessions', SourceID: s.SessionID,
          Label: `${s.SessionName}${sel.DietaryNotes ? ` (${sel.DietaryNotes})` : ''}`,
          Quantity: sel.Quantity, UnitAmount: price, LineAmount: price * sel.Quantity });
      }
    });

    const totals = await fetch(`${API}/api/events/cart/${c.CartID}/items`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: out }),
    }).then(r => r.json());

    setItems(out);
    setCart(cu => ({ ...cu, ...totals }));
    return { cart: { ...c, ...totals }, items: out };
  };

  useEffect(() => {
    if (current?.key === 'review') {
      buildReviewItems().catch(e => setError(e.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const finalizeFeatureEntries = async () => {
    const c = await ensureCart();
    const link = (table, id) => fetch(`${API}/api/events/cart/${c.CartID}/link`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ SourceTable: table, SourceID: id, IDColumn: 'EntryID' }),
    });

    for (const he of halterEntries) {
      for (const classId of he.ClassIDs) {
        const r = await fetch(`${API}/api/events/${eventId}/halter/entries`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ClassID: classId, AnimalID: he.AnimalID,
            PeopleID: peopleId, BusinessID: BusinessID ? Number(BusinessID) : null,
          }),
        });
        const j = await r.json().catch(() => ({}));
        if (j?.EntryID) await link('OFNEventHalterEntries', j.EntryID);
      }
    }
    for (const fe of fleeceEntries) {
      const r = await fetch(`${API}/api/events/${eventId}/fleece/entries`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fe,
          SourceAnimalID: fe.SourceAnimalID ? Number(fe.SourceAnimalID) : null,
          DivisionID: fe.DivisionID ? Number(fe.DivisionID) : null,
          PeopleID: peopleId, BusinessID: BusinessID ? Number(BusinessID) : null }),
      });
      const j = await r.json().catch(() => ({}));
      if (j?.EntryID) await link('OFNEventFleeceEntries', j.EntryID);
    }
    for (const se of spinoffEntries) {
      const r = await fetch(`${API}/api/events/${eventId}/spinoff/entries`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...se,
          SourceAnimalID: se.SourceAnimalID ? Number(se.SourceAnimalID) : null,
          CategoryID: se.CategoryID ? Number(se.CategoryID) : null,
          PeopleID: peopleId, BusinessID: BusinessID ? Number(BusinessID) : null }),
      });
      const j = await r.json().catch(() => ({}));
      if (j?.EntryID) await link('OFNEventSpinOffEntries', j.EntryID);
    }
    for (const fe of fiberEntries) {
      const r = await fetch(`${API}/api/events/${eventId}/fiber-arts/entries`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fe,
          CategoryID: fe.CategoryID ? Number(fe.CategoryID) : null,
          PeopleID: peopleId, BusinessID: BusinessID ? Number(BusinessID) : null }),
      });
      const j = await r.json().catch(() => ({}));
      if (j?.EntryID) await link('OFNEventFiberArtsEntries', j.EntryID);
    }
    if (vendor.include) {
      const r = await fetch(`${API}/api/events/${eventId}/vendor-fair/booths`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...vendor,
          PeopleID: peopleId, BusinessID: BusinessID ? Number(BusinessID) : null }),
      });
      const j = await r.json().catch(() => ({}));
      if (j?.BoothID) await link('OFNEventVendorFairBooths', j.BoothID);
    }
    for (const [sid, sel] of Object.entries(mealSel)) {
      if (!sel?.Quantity) continue;
      const r = await fetch(`${API}/api/events/${eventId}/meals/tickets`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SessionID: Number(sid), Quantity: sel.Quantity,
          DietaryNotes: sel.DietaryNotes || null,
          AttendeeName: `${form.AttendeeFirstName} ${form.AttendeeLastName}`.trim(),
          CartID: c.CartID, PeopleID: peopleId,
          BusinessID: BusinessID ? Number(BusinessID) : null,
        }),
      });
      await r.json().catch(() => null);
    }
  };

  const goToPay = async () => {
    setSubmitting(true); setError('');
    try {
      await finalizeFeatureEntries();
      goNext();
    } catch (e) {
      setError(e.message || t('event_wizard.error_finalize'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50"><Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">{t('event_wizard.loading')}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <PageMeta title={`Register for ${event?.EventName || 'Event'}`} canonical={`https://oatmealfarmnetwork.com/events/${eventId}/register`} noIndex />
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumbs items={[
          { label: t('event_wizard.breadcrumb_events'), to: '/events' },
          { label: event?.EventName || 'Event', to: `/events/${eventId}` },
          { label: t('event_wizard.breadcrumb_register') },
        ]} />
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{t('event_wizard.register_heading', { name: event?.EventName })}</h1>
          {event?.EventStartDate && <div className="text-sm text-gray-500">{formatDate(event.EventStartDate)}</div>}
        </div>

        <StepHeader stepIndex={stepIndex} steps={steps} />

        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">{error}</div>}

        {current.key === 'info' && (
          <InfoStep form={form} setForm={setForm} onNext={async () => { await ensureCart(); goNext(); }} />
        )}
        {current.key === 'attendees' && (
          <WizardAttendeesStep
            cartId={cart?.CartID}
            businessId={BusinessID}
            payer={{ FirstName: form.AttendeeFirstName, LastName: form.AttendeeLastName, Email: form.AttendeeEmail }}
            onNext={async () => { await ensureCart(); goNext(); }}
            onBack={goBack}
          />
        )}
        {current.key === 'animals' && (
          <AnimalPickerStep
            businessId={BusinessID}
            peopleId={peopleId}
            picked={animals}
            setPicked={setAnimals}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {current.key === 'halter' && (
          <HalterStep eventId={eventId} cartId={cart?.CartID} pickedAnimals={animals} entries={halterEntries} setEntries={setHalterEntries} onNext={goNext} onBack={goBack} businessId={BusinessID} peopleId={peopleId} />
        )}
        {current.key === 'fleece' && (
          <FleeceStep eventId={eventId} entries={fleeceEntries} setEntries={setFleeceEntries} onNext={goNext} onBack={goBack} pickedAnimals={animals} />
        )}
        {current.key === 'spinoff' && (
          <SpinOffStep eventId={eventId} entries={spinoffEntries} setEntries={setSpinoffEntries} onNext={goNext} onBack={goBack} pickedAnimals={animals} />
        )}
        {current.key === 'fiber_arts' && (
          <FiberArtsStep eventId={eventId} entries={fiberEntries} setEntries={setFiberEntries} onNext={goNext} onBack={goBack} />
        )}
        {current.key === 'vendor' && (
          <VendorStep eventId={eventId} booth={vendor} setBooth={setVendor} onNext={goNext} onBack={goBack} />
        )}
        {current.key === 'meals' && (
          <MealsStep eventId={eventId} sessions={mealSessions} selections={mealSel} setSelections={setMealSel} onNext={goNext} onBack={goBack} />
        )}
        {current.key === 'review' && (
          <ReviewStep cart={cart} items={items} onBack={goBack} onPay={goToPay} submitting={submitting} />
        )}
        {current.key === 'pay' && cart && (
          <WizardPayStep cartId={cart.CartID} total={cart.Total} eventId={eventId} hostBusinessId={event?.BusinessID} onPaid={() => goNext()} onBack={goBack} />
        )}
        {current.key === 'done' && cart && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm text-center">
            <div className="flex justify-center mb-4"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3D6B34" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('event_wizard.done_title')}</h1>
            <p className="text-gray-500 mb-4">{t('event_wizard.done_reg_num', { id: cart.CartID })}</p>
            <div className="flex gap-3 justify-center">
              <Link to="/my-registrations" className="text-[#3D6B34] hover:underline text-sm">{t('event_wizard.done_my_regs')}</Link>
              <Link to={`/events/${eventId}`} className="text-[#3D6B34] hover:underline text-sm">{t('event_wizard.done_back_event')}</Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ThaiymeChat eventId={Number(eventId) || null} page="event_register_wizard" />
    </div>
  );
}
