import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';
import AnimalPicker from './AnimalPicker';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';
const FAMACHA_SCORES = [1, 2, 3, 4, 5];
const FAMACHA_LABEL = { 1: 'Excellent (Red)', 2: 'Good (Pink-Red)', 3: 'Borderline (Pink)', 4: 'Danger (Pink-White)', 5: 'Treat (White)' };
const FAMACHA_COLOR = { 1: '#10B981', 2: '#059669', 3: '#F59E0B', 4: '#EF4444', 5: '#DC2626' };
const TEST_TYPES = ['Fecal Egg Count (FEC)', 'FAMACHA Score', 'FECRT (Resistance Test)', 'Larval Development Assay', 'Visual Assessment', 'Other'];
const DEWORMERS = ['Ivermectin', 'Fenbendazole', 'Albendazole', 'Levamisole', 'Moxidectin', 'Doramectin', 'Closantel', 'Other'];
const PARASITE_TYPES = ['Barber Pole Worm (H. contortus)', 'Brown Stomach Worm', 'Liver Fluke', 'Lungworm', 'Coccidia', 'Lice', 'Mange Mites', 'Ticks', 'Flies', 'Other'];

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mont focus:outline-none focus:border-green-500";
function Field({ label, children, className }) {
  return <div className={className}><label className="block text-xs font-semibold text-gray-600 mb-1 font-mont">{label}</label>{children}</div>;
}

const EMPTY = {
  AnimalTag: '', GroupName: '', TestDate: '', TestType: '', ParasiteType: '',
  FamachaScore: '', EggCount: '', EggCountUnit: 'EPG', TreatmentGiven: '',
  DewormProduct: '', DewormDose: '', DewormRoute: '', WithdrawalDate: '',
  TreatedBy: '', FollowUpDate: '', Notes: '',
};

function Form({ init, onSave, onCancel, businessId }) {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [f, setF] = useState(init || EMPTY);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={hh('f_animal_or_group2')}>
          <AnimalPicker businessId={businessId} value={f.AnimalTag} animalId={f.AnimalID}
            onChange={(tag, id) => setF(p => ({ ...p, AnimalTag: tag, AnimalID: id }))} />
        </Field>
        <Field label={hh('f_group_name')}><input value={f.GroupName} onChange={set('GroupName')} placeholder={hh('ph_group_lambs')} className={inp} /></Field>
        <Field label={hh('f_test_date')}><input type="date" value={f.TestDate} onChange={set('TestDate')} className={inp} /></Field>
        <Field label={hh('f_test_type')}>
          <select value={f.TestType} onChange={set('TestType')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {TEST_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label={hh('f_parasite_type')}>
          <select value={f.ParasiteType} onChange={set('ParasiteType')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {PARASITE_TYPES.map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label={hh('f_famacha_score')}>
          <select value={f.FamachaScore} onChange={set('FamachaScore')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {FAMACHA_SCORES.map(n => <option key={n} value={n}>{n} – {FAMACHA_LABEL[n]}</option>)}
          </select>
        </Field>
        <Field label={hh('f_egg_count')}>
          <div className="flex gap-2">
            <input type="number" step="1" value={f.EggCount} onChange={set('EggCount')} className={inp} placeholder={hh('ph_egg_count')} />
            <select value={f.EggCountUnit} onChange={set('EggCountUnit')} className="border border-gray-300 rounded-lg px-2 py-2 text-sm font-mont focus:outline-none focus:border-green-500">
              <option>EPG</option><option>OPG</option>
            </select>
          </div>
        </Field>
        <Field label={hh('f_treatment_given_q')}>
          <select value={f.TreatmentGiven} onChange={set('TreatmentGiven')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('f_yes')}</option><option>{hh('f_no')}</option>
          </select>
        </Field>
        <Field label={hh('f_dewormer')}>
          <select value={f.DewormProduct} onChange={set('DewormProduct')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {DEWORMERS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label={hh('f_dose_amount')}><input value={f.DewormDose} onChange={set('DewormDose')} placeholder={hh('ph_dose')} className={inp} /></Field>
        <Field label={hh('f_route')}><input value={f.DewormRoute} onChange={set('DewormRoute')} placeholder={hh('ph_route')} className={inp} /></Field>
        <Field label={hh('f_withdrawal_date')}><input type="date" value={f.WithdrawalDate} onChange={set('WithdrawalDate')} className={inp} /></Field>
        <Field label={hh('f_treated_by')}><input value={f.TreatedBy} onChange={set('TreatedBy')} className={inp} /></Field>
        <Field label={hh('f_followup_date')}><input type="date" value={f.FollowUpDate} onChange={set('FollowUpDate')} className={inp} /></Field>
        <Field label={hh('f_notes')} className="sm:col-span-2"><textarea value={f.Notes} onChange={set('Notes')} rows={2} className={inp} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, FamachaScore: f.FamachaScore ? parseInt(f.FamachaScore) : null, EggCount: f.EggCount ? parseInt(f.EggCount) : null })}
          className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_save')}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-mont text-gray-600 bg-gray-200 hover:bg-gray-300">{hh('btn_cancel')}</button>
      </div>
    </div>
  );
}

export default function HerdHealthParasites() {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  const { Business, LoadBusiness } = useAccount();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { LoadBusiness(BusinessID); }, [BusinessID]);
  const load = useCallback(() => {
    if (!BusinessID) return;
    setLoading(true);
    fetch(`${API}/api/herd-health/parasites?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : []).then(setRows).catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [BusinessID]);
  useEffect(() => { load(); }, [load]);

  const save = async (f) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/herd-health/parasites/${editing.ParasiteID}`
      : `${API}/api/herd-health/parasites?business_id=${BusinessID}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setShowForm(false); setEditing(null); load();
  };
  const del = async (id) => {
    await fetch(`${API}/api/herd-health/parasites/${id}`, { method: 'DELETE' });
    setDeleting(null); load();
  };

  const today = new Date().toISOString().slice(0, 10);
  const followUpDue = rows.filter(r => r.FollowUpDate && r.FollowUpDate.slice(0, 10) <= today);
  const highFamacha = rows.filter(r => r.FamachaScore >= 4);

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_parasites')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Parasite Control' }]}>
      <div className="space-y-4 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">{hh('parasites_title')}</h1>
            <p className="font-mont text-xs text-gray-500">{hh('parasites_subtitle')}</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_add_parasite')}</button>
        </div>

        {(followUpDue.length > 0 || highFamacha.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {followUpDue.length > 0 && <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-mont text-sm text-amber-800">⚠ <strong>{followUpDue.length}</strong> follow-up{followUpDue.length > 1 ? 's' : ''} {hh('alert_due_overdue')}</div>}
            {highFamacha.length > 0 && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-mont text-sm text-red-800">⚠ <strong>{highFamacha.length}</strong> animal{highFamacha.length > 1 ? 's' : ''} {hh('alert_treatment_needed')}</div>}
          </div>
        )}

        {(showForm && !editing) && <Form onSave={save} onCancel={() => setShowForm(false)} businessId={BusinessID} />}

        {loading ? (
          <div className="text-center py-12 font-mont text-sm text-gray-400 animate-pulse">{hh('loading')}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_parasites')}</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs font-mont">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[hh('th_animal_group'),hh('th_date'),hh('th_test_type'),hh('th_famacha'),hh('th_egg_count'),hh('th_treatment'),hh('th_withdrawal'),''].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(row => (
                  editing?.ParasiteID === row.ParasiteID ? (
                    <tr key={row.ParasiteID}><td colSpan={8} className="p-3">
                      <Form init={editing} onSave={save} onCancel={() => setEditing(null)} businessId={BusinessID} />
                    </td></tr>
                  ) : (
                    <tr key={row.ParasiteID} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-semibold text-gray-800">{row.AnimalTag ? `#${row.AnimalTag}` : row.GroupName || '—'}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.TestDate?.slice(0, 10)}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.TestType}</td>
                      <td className="px-3 py-2.5">
                        {row.FamachaScore != null ? (
                          <span className="font-bold px-1.5 py-0.5 rounded text-white text-xs" style={{ backgroundColor: FAMACHA_COLOR[row.FamachaScore] || '#9CA3AF' }}>
                            {row.FamachaScore}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700">{row.EggCount != null ? `${row.EggCount} ${row.EggCountUnit || 'EPG'}` : '—'}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.DewormProduct || (row.TreatmentGiven === 'No' ? 'None' : '—')}</td>
                      <td className="px-3 py-2.5">
                        {row.WithdrawalDate ? (
                          <span className={row.WithdrawalDate.slice(0, 10) >= today ? 'text-red-600 font-semibold' : 'text-gray-400'}>{row.WithdrawalDate.slice(0, 10)}</span>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          <button onClick={() => setEditing(row)} className="text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-100">{hh('btn_edit')}</button>
                          {deleting === row.ParasiteID
                            ? <><button onClick={() => del(row.ParasiteID)} className="text-red-600 font-semibold px-1.5 py-0.5 rounded bg-red-50">✓</button>
                                <button onClick={() => setDeleting(null)} className="text-gray-400 px-1.5 py-0.5 rounded hover:bg-gray-100">✕</button></>
                            : <button onClick={() => setDeleting(row.ParasiteID)} className="text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50">Del</button>
                          }
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HerdHealthLayout>
  );
}
