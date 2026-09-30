import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';
import AnimalPicker from './AnimalPicker';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';
const ROUTES_ADMIN = ['IM', 'SQ', 'IV', 'Oral', 'Topical', 'Intranasal', 'Intramammary', 'Other'];
const OUTCOMES = ['Recovered', 'Ongoing', 'Improving', 'Deteriorating', 'Died', 'Culled'];
const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mont focus:outline-none focus:border-green-500";
function Field({ label, children, className }) {
  return <div className={className}><label className="block text-xs font-semibold text-gray-600 mb-1 font-mont">{label}</label>{children}</div>;
}
const EMPTY = {
  AnimalTag:'', TreatmentDate:'', Diagnosis:'', Medication:'', ActiveIngredient:'',
  Dosage:'', Route:'', Frequency:'', DurationDays:'', WithdrawalDate:'', WithdrawalMilk:'',
  PrescribedBy:'', AdministeredBy:'', Cost:'', Outcome:'', Notes:'',
};

function Form({ init, onSave, onCancel, businessId }) {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [f, setF] = useState(init || EMPTY);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={hh('f_animal')}>
          <AnimalPicker businessId={businessId} value={f.AnimalTag} animalId={f.AnimalID}
            onChange={(tag, id) => setF(p => ({ ...p, AnimalTag: tag, AnimalID: id }))} />
        </Field>
        <Field label={hh('f_treatment_date')}><input type="date" value={f.TreatmentDate} onChange={set('TreatmentDate')} className={inp} /></Field>
        <Field label={hh('f_diagnosis')} className="sm:col-span-2"><input value={f.Diagnosis} onChange={set('Diagnosis')} className={inp} /></Field>
        <Field label={hh('f_medication_drug')}><input value={f.Medication} onChange={set('Medication')} className={inp} /></Field>
        <Field label={hh('f_active_ingredient')}><input value={f.ActiveIngredient} onChange={set('ActiveIngredient')} className={inp} /></Field>
        <Field label={hh('f_dosage')}><input value={f.Dosage} onChange={set('Dosage')} placeholder={hh('ph_dosage_weight')} className={inp} /></Field>
        <Field label={hh('f_route')}>
          <select value={f.Route} onChange={set('Route')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {ROUTES_ADMIN.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label={hh('f_frequency')}><input value={f.Frequency} onChange={set('Frequency')} placeholder={hh('ph_frequency')} className={inp} /></Field>
        <Field label={hh('f_duration_days')}><input type="number" value={f.DurationDays} onChange={set('DurationDays')} className={inp} /></Field>
        <Field label={hh('f_meat_withdrawal')}><input type="date" value={f.WithdrawalDate} onChange={set('WithdrawalDate')} className={inp} /></Field>
        <Field label={hh('f_milk_withdrawal')}><input type="date" value={f.WithdrawalMilk} onChange={set('WithdrawalMilk')} className={inp} /></Field>
        <Field label={hh('f_prescribed_by')}><input value={f.PrescribedBy} onChange={set('PrescribedBy')} className={inp} /></Field>
        <Field label={hh('f_administered_by')}><input value={f.AdministeredBy} onChange={set('AdministeredBy')} className={inp} /></Field>
        <Field label={hh('f_cost')}><input type="number" step="0.01" value={f.Cost} onChange={set('Cost')} className={inp} /></Field>
        <Field label={hh('f_outcome')}>
          <select value={f.Outcome} onChange={set('Outcome')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {OUTCOMES.map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label={hh('f_notes')} className="sm:col-span-2"><textarea value={f.Notes} onChange={set('Notes')} rows={2} className={inp} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(f)} className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_save')}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-mont text-gray-600 bg-gray-200 hover:bg-gray-300">{hh('btn_cancel')}</button>
      </div>
    </div>
  );
}

const OUTCOME_COLOR = { Recovered: '#10B981', Ongoing: '#2563EB', Improving: '#059669', Deteriorating: '#D97706', Died: '#6B7280', Culled: '#6B7280' };

export default function HerdHealthTreatments() {
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
    fetch(`${API}/api/herd-health/treatments?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : []).then(setRows).catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [BusinessID]);
  useEffect(() => { load(); }, [load]);

  const save = async (f) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/herd-health/treatments/${editing.TreatmentID}`
      : `${API}/api/herd-health/treatments?business_id=${BusinessID}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, DurationDays: f.DurationDays ? parseInt(f.DurationDays) : null, Cost: f.Cost ? parseFloat(f.Cost) : null }) });
    setShowForm(false); setEditing(null); load();
  };
  const del = async (id) => {
    await fetch(`${API}/api/herd-health/treatments/${id}`, { method: 'DELETE' });
    setDeleting(null); load();
  };

  const today = new Date().toISOString().slice(0,10);
  const withdrawalAlert = rows.filter(r => r.WithdrawalDate && r.WithdrawalDate.slice(0,10) >= today);

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_treatments')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Treatments' }]}>
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">{hh('treatments_title')}</h1>
            <p className="font-mont text-xs text-gray-500">{hh('treatments_subtitle')}</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_log_treatment')}</button>
        </div>

        {withdrawalAlert.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-mont text-sm text-red-800">
            ⚠ <strong>{withdrawalAlert.length} animal{withdrawalAlert.length > 1 ? 's' : ''}</strong> {hh('alert_withdrawal')}
          </div>
        )}

        {(showForm && !editing) && <Form onSave={save} onCancel={() => setShowForm(false)} businessId={BusinessID} />}

        {loading ? (
          <div className="text-center py-12 font-mont text-sm text-gray-400 animate-pulse">{hh('loading')}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_treatments')}</div>
        ) : (
          <div className="space-y-2">
            {rows.map(row => (
              <div key={row.TreatmentID}>
                {editing?.TreatmentID === row.TreatmentID ? (
                  <Form init={editing} onSave={save} onCancel={() => setEditing(null)} businessId={BusinessID} />
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mont text-sm font-bold text-gray-900">{row.AnimalTag ? `#${row.AnimalTag}` : '—'}</span>
                          <span className="font-mont text-sm text-gray-700">{row.Diagnosis}</span>
                          {row.Outcome && <span className="font-mont text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: OUTCOME_COLOR[row.Outcome] || '#9CA3AF' }}>{row.Outcome}</span>}
                        </div>
                        <div className="font-mont text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3">
                          <span>{row.TreatmentDate?.slice(0,10)}</span>
                          <span>{row.Medication}{row.Dosage ? ` · ${row.Dosage}` : ''}{row.Route ? ` · ${row.Route}` : ''}</span>
                          {row.WithdrawalDate && <span className={row.WithdrawalDate.slice(0,10) >= today ? 'text-red-600 font-semibold' : 'text-green-600'}>{hh('lbl_withdrawal')} {row.WithdrawalDate.slice(0,10)}</span>}
                          {row.Cost && <span>{hh('lbl_cost')} ${parseFloat(row.Cost).toFixed(2)}</span>}
                        </div>
                        {row.Notes && <p className="font-mont text-xs text-gray-500 mt-1 line-clamp-1">{row.Notes}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditing(row)} className="font-mont text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100">{hh('btn_edit')}</button>
                        {deleting === row.TreatmentID
                          ? <><button onClick={() => del(row.TreatmentID)} className="font-mont text-xs text-red-600 font-semibold px-2 py-1 rounded bg-red-50">{hh('btn_confirm')}</button>
                              <button onClick={() => setDeleting(null)} className="font-mont text-xs text-gray-400 px-2 py-1 rounded hover:bg-gray-100">{hh('btn_cancel')}</button></>
                          : <button onClick={() => setDeleting(row.TreatmentID)} className="font-mont text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">{hh('btn_delete')}</button>
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </HerdHealthLayout>
  );
}
