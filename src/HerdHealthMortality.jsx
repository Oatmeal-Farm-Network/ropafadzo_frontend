import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';
const CAUSES = ['Disease', 'Respiratory', 'Digestive / Bloat', 'Dystocia / Birthing', 'Predator', 'Injury / Trauma', 'Poisoning', 'Lightning / Weather', 'Old Age', 'Unknown', 'Other'];
const DISPOSAL_METHODS = ['Rendering', 'Burial on-site', 'Composting', 'Incineration', 'Landfill', 'Veterinary Disposal', 'Other'];

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mont focus:outline-none focus:border-green-500";
function Field({ label, children, className }) {
  return <div className={className}><label className="block text-xs font-semibold text-gray-600 mb-1 font-mont">{label}</label>{children}</div>;
}

const EMPTY = {
  AnimalTag: '', Species: '', Breed: '', Sex: '', AgeYears: '', WeightLbs: '',
  DateOfDeath: '', CauseOfDeath: '', PreliminaryDiagnosis: '',
  PostMortemPerformed: '', PostMortemFindings: '', SamplesSubmitted: '',
  LabResultsSummary: '', DisposalMethod: '', DisposalDate: '', DisposalLocation: '',
  InsuranceClaim: '', InsuranceClaimNumber: '', EstimatedValue: '',
  ReportedToAuthorities: '', WitnessedBy: '', VetNotified: '', Notes: '',
};

function Form({ init, onSave, onCancel }) {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [f, setF] = useState(init || EMPTY);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={hh('f_animal_tag')}><input value={f.AnimalTag} onChange={set('AnimalTag')} className={inp} /></Field>
        <Field label={hh('f_death_date')}><input type="date" value={f.DateOfDeath} onChange={set('DateOfDeath')} className={inp} /></Field>
        <Field label={hh('f_species')}><input value={f.Species} onChange={set('Species')} placeholder={hh('ph_species')} className={inp} /></Field>
        <Field label={hh('f_breed')}><input value={f.Breed} onChange={set('Breed')} className={inp} /></Field>
        <Field label={hh('f_sex')}>
          <select value={f.Sex} onChange={set('Sex')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('opt_male')}</option><option>{hh('opt_female')}</option><option>{hh('opt_castrated')}</option>
          </select>
        </Field>
        <Field label={hh('f_age_years')}><input type="number" step="0.1" value={f.AgeYears} onChange={set('AgeYears')} className={inp} /></Field>
        <Field label={hh('f_weight_lbs')}><input type="number" step="1" value={f.WeightLbs} onChange={set('WeightLbs')} className={inp} /></Field>
        <Field label={hh('f_cause_of_death')}>
          <select value={f.CauseOfDeath} onChange={set('CauseOfDeath')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {CAUSES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label={hh('f_prelim_diagnosis')} className="sm:col-span-2"><input value={f.PreliminaryDiagnosis} onChange={set('PreliminaryDiagnosis')} className={inp} /></Field>
        <Field label={hh('f_post_mortem')}>
          <select value={f.PostMortemPerformed} onChange={set('PostMortemPerformed')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('f_yes')}</option><option>{hh('f_no')}</option><option>{hh('f_partial')}</option>
          </select>
        </Field>
        <Field label={hh('f_vet_notified')}><input value={f.VetNotified} onChange={set('VetNotified')} className={inp} /></Field>
        <Field label={hh('f_post_mortem_findings')} className="sm:col-span-2"><textarea value={f.PostMortemFindings} onChange={set('PostMortemFindings')} rows={2} className={inp} /></Field>
        <Field label={hh('f_samples_submitted')}><input value={f.SamplesSubmitted} onChange={set('SamplesSubmitted')} placeholder={hh('ph_samples')} className={inp} /></Field>
        <Field label={hh('f_lab_results_summary')}><input value={f.LabResultsSummary} onChange={set('LabResultsSummary')} className={inp} /></Field>
        <Field label={hh('f_disposal_method')}>
          <select value={f.DisposalMethod} onChange={set('DisposalMethod')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {DISPOSAL_METHODS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label={hh('f_disposal_date')}><input type="date" value={f.DisposalDate} onChange={set('DisposalDate')} className={inp} /></Field>
        <Field label={hh('f_disposal_location')}><input value={f.DisposalLocation} onChange={set('DisposalLocation')} className={inp} /></Field>
        <Field label={hh('f_reported_authorities')}>
          <select value={f.ReportedToAuthorities} onChange={set('ReportedToAuthorities')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('f_yes')}</option><option>{hh('f_no')}</option><option>{hh('opt_not_required')}</option>
          </select>
        </Field>
        <Field label={hh('f_insurance_claim')}>
          <select value={f.InsuranceClaim} onChange={set('InsuranceClaim')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('f_yes')}</option><option>{hh('f_no')}</option><option>{hh('f_na')}</option>
          </select>
        </Field>
        <Field label={hh('f_insurance_claim_num')}><input value={f.InsuranceClaimNumber} onChange={set('InsuranceClaimNumber')} className={inp} /></Field>
        <Field label={hh('f_estimated_value')}><input type="number" step="0.01" value={f.EstimatedValue} onChange={set('EstimatedValue')} className={inp} /></Field>
        <Field label={hh('f_witnessed_by')}><input value={f.WitnessedBy} onChange={set('WitnessedBy')} className={inp} /></Field>
        <Field label={hh('f_notes')} className="sm:col-span-2"><textarea value={f.Notes} onChange={set('Notes')} rows={2} className={inp} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, AgeYears: f.AgeYears ? parseFloat(f.AgeYears) : null, WeightLbs: f.WeightLbs ? parseFloat(f.WeightLbs) : null, EstimatedValue: f.EstimatedValue ? parseFloat(f.EstimatedValue) : null })}
          className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_save')}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-mont text-gray-600 bg-gray-200 hover:bg-gray-300">{hh('btn_cancel')}</button>
      </div>
    </div>
  );
}

export default function HerdHealthMortality() {
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
    fetch(`${API}/api/herd-health/mortality?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : []).then(setRows).catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [BusinessID]);
  useEffect(() => { load(); }, [load]);

  const save = async (f) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/herd-health/mortality/${editing.MortalityID}`
      : `${API}/api/herd-health/mortality?business_id=${BusinessID}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setShowForm(false); setEditing(null); load();
  };
  const del = async (id) => {
    await fetch(`${API}/api/herd-health/mortality/${id}`, { method: 'DELETE' });
    setDeleting(null); load();
  };

  const pendingDisposal = rows.filter(r => !r.DisposalMethod);
  const openClaims = rows.filter(r => r.InsuranceClaim === 'Yes' && !r.InsuranceClaimNumber);

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_mortality')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Mortality' }]}>
      <div className="space-y-4 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">{hh('mortality_title')}</h1>
            <p className="font-mont text-xs text-gray-500">{hh('mortality_subtitle')}</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_log_death')}</button>
        </div>

        {(pendingDisposal.length > 0 || openClaims.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingDisposal.length > 0 && <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-mont text-sm text-amber-800">⚠ <strong>{pendingDisposal.length}</strong> record{pendingDisposal.length > 1 ? 's' : ''} {hh('alert_missing_disposal')}</div>}
            {openClaims.length > 0 && <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 font-mont text-sm text-blue-800">ℹ <strong>{openClaims.length}</strong> insurance claim{openClaims.length > 1 ? 's' : ''} {hh('alert_no_claim_number')}</div>}
          </div>
        )}

        {rows.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 grid grid-cols-3 gap-4 text-center">
            <div><div className="font-lora text-xl font-bold text-gray-900">{rows.length}</div><div className="font-mont text-xs text-gray-500">{hh('stat_total_deaths')}</div></div>
            <div><div className="font-lora text-xl font-bold text-gray-900">{rows.filter(r => r.InsuranceClaim === 'Yes').length}</div><div className="font-mont text-xs text-gray-500">{hh('stat_insurance_claims')}</div></div>
            <div><div className="font-lora text-xl font-bold text-gray-900">${rows.reduce((s, r) => s + (parseFloat(r.EstimatedValue) || 0), 0).toLocaleString()}</div><div className="font-mont text-xs text-gray-500">{hh('stat_est_value')}</div></div>
          </div>
        )}

        {(showForm && !editing) && <Form onSave={save} onCancel={() => setShowForm(false)} />}

        {loading ? (
          <div className="text-center py-12 font-mont text-sm text-gray-400 animate-pulse">{hh('loading')}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_mortality')}</div>
        ) : (
          <div className="space-y-3">
            {rows.map(row => (
              <div key={row.MortalityID}>
                {editing?.MortalityID === row.MortalityID ? (
                  <Form init={editing} onSave={save} onCancel={() => setEditing(null)} />
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mont text-sm font-bold text-gray-900">{row.AnimalTag ? `#${row.AnimalTag}` : '—'}</span>
                          {row.Species && <span className="font-mont text-xs text-gray-500">{row.Species}{row.Breed ? ` · ${row.Breed}` : ''}</span>}
                          {row.CauseOfDeath && <span className="font-mont text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{row.CauseOfDeath}</span>}
                          {row.InsuranceClaim === 'Yes' && <span className="font-mont text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Insurance</span>}
                        </div>
                        <div className="font-mont text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3">
                          {row.DateOfDeath && <span>{row.DateOfDeath.slice(0, 10)}</span>}
                          {row.EstimatedValue && <span>Value: ${parseFloat(row.EstimatedValue).toFixed(2)}</span>}
                          {row.DisposalMethod && <span>{hh('lbl_disposal')} {row.DisposalMethod}</span>}
                          {row.PostMortemPerformed === 'Yes' && <span className="text-blue-600">{hh('lbl_pm_performed')}</span>}
                        </div>
                        {row.PreliminaryDiagnosis && <p className="font-mont text-xs text-gray-600 mt-1 line-clamp-1">{row.PreliminaryDiagnosis}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditing(row)} className="font-mont text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100">{hh('btn_edit')}</button>
                        {deleting === row.MortalityID
                          ? <><button onClick={() => del(row.MortalityID)} className="font-mont text-xs text-red-600 font-semibold px-2 py-1 rounded bg-red-50">{hh('btn_confirm')}</button>
                              <button onClick={() => setDeleting(null)} className="font-mont text-xs text-gray-400 px-2 py-1 rounded hover:bg-gray-100">{hh('btn_cancel')}</button></>
                          : <button onClick={() => setDeleting(row.MortalityID)} className="font-mont text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">{hh('btn_delete')}</button>
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
