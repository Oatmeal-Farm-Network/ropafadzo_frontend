import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';
import AnimalPicker from './AnimalPicker';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';
const TEST_PANELS = [
  'CBC (Complete Blood Count)', 'BMP / CMP (Metabolic Panel)', 'Liver Panel',
  'Fecal Egg Count', 'Fecal Culture', 'Brucellosis Test', 'TB Test (Tuberculin)',
  'Johne\'s Disease (ELISA)', 'BVD / IBR / PI3 Screen', 'Leptospirosis Titer',
  'Pregnancy Test', 'Culture & Sensitivity', 'PCR Panel', 'Mineral Profile',
  'Blood Urea Nitrogen (BUN)', 'Viral Serology', 'Toxicology Screen', 'Other',
];
const RESULT_STATUSES = ['Pending', 'Normal', 'Abnormal', 'Inconclusive', 'Positive', 'Negative'];
const STATUS_COLOR = { Pending: '#6B7280', Normal: '#10B981', Abnormal: '#EF4444', Inconclusive: '#F59E0B', Positive: '#DC2626', Negative: '#059669' };

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mont focus:outline-none focus:border-green-500";
function Field({ label, children, className }) {
  return <div className={className}><label className="block text-xs font-semibold text-gray-600 mb-1 font-mont">{label}</label>{children}</div>;
}

const EMPTY = {
  AnimalTag: '', GroupName: '', SampleDate: '', ResultDate: '', LabName: '',
  AccessionNumber: '', TestPanel: '', ResultStatus: 'Pending',
  ResultSummary: '', AbnormalValues: '', ReferenceRanges: '', Interpretation: '',
  VetReviewed: '', FollowUpRequired: '', FollowUpDate: '', Notes: '',
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
        <Field label={hh('f_group_name_lab')}><input value={f.GroupName} onChange={set('GroupName')} placeholder={hh('ph_group_lab')} className={inp} /></Field>
        <Field label={hh('f_sample_date')}><input type="date" value={f.SampleDate} onChange={set('SampleDate')} className={inp} /></Field>
        <Field label={hh('f_result_date')}><input type="date" value={f.ResultDate} onChange={set('ResultDate')} className={inp} /></Field>
        <Field label={hh('f_laboratory')}>
          <input value={f.LabName} onChange={set('LabName')} placeholder={hh('ph_lab')} className={inp} />
        </Field>
        <Field label={hh('f_accession_num')}><input value={f.AccessionNumber} onChange={set('AccessionNumber')} className={inp} /></Field>
        <Field label={hh('f_test_panel')}>
          <select value={f.TestPanel} onChange={set('TestPanel')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {TEST_PANELS.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label={hh('f_result_status')}>
          <select value={f.ResultStatus} onChange={set('ResultStatus')} className={inp}>
            {RESULT_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label={hh('f_result_summary')} className="sm:col-span-2"><textarea value={f.ResultSummary} onChange={set('ResultSummary')} rows={2} className={inp} /></Field>
        <Field label={hh('f_abnormal_values')} className="sm:col-span-2"><textarea value={f.AbnormalValues} onChange={set('AbnormalValues')} rows={2} placeholder={hh('ph_abnormal')} className={inp} /></Field>
        <Field label={hh('f_reference_ranges')} className="sm:col-span-2"><textarea value={f.ReferenceRanges} onChange={set('ReferenceRanges')} rows={2} className={inp} /></Field>
        <Field label={hh('f_clinical_interp')} className="sm:col-span-2"><textarea value={f.Interpretation} onChange={set('Interpretation')} rows={3} className={inp} /></Field>
        <Field label={hh('f_vet_reviewed')}><input value={f.VetReviewed} onChange={set('VetReviewed')} className={inp} /></Field>
        <Field label={hh('f_followup_required')}>
          <select value={f.FollowUpRequired} onChange={set('FollowUpRequired')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('f_yes')}</option><option>{hh('f_no')}</option>
          </select>
        </Field>
        <Field label={hh('f_followup_date')}><input type="date" value={f.FollowUpDate} onChange={set('FollowUpDate')} className={inp} /></Field>
        <Field label={hh('f_notes')} className="sm:col-span-2"><textarea value={f.Notes} onChange={set('Notes')} rows={2} className={inp} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(f)} className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_save')}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-mont text-gray-600 bg-gray-200 hover:bg-gray-300">{hh('btn_cancel')}</button>
      </div>
    </div>
  );
}

export default function HerdHealthLabResults() {
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
    fetch(`${API}/api/herd-health/lab-results?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : []).then(setRows).catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [BusinessID]);
  useEffect(() => { load(); }, [load]);

  const save = async (f) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/herd-health/lab-results/${editing.LabResultID}`
      : `${API}/api/herd-health/lab-results?business_id=${BusinessID}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setShowForm(false); setEditing(null); load();
  };
  const del = async (id) => {
    await fetch(`${API}/api/herd-health/lab-results/${id}`, { method: 'DELETE' });
    setDeleting(null); load();
  };

  const today = new Date().toISOString().slice(0, 10);
  const pending = rows.filter(r => r.ResultStatus === 'Pending');
  const abnormal = rows.filter(r => r.ResultStatus === 'Abnormal' || r.ResultStatus === 'Positive');

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_lab_results')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Lab Results' }]}>
      <div className="space-y-4 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">{hh('lab_results_title')}</h1>
            <p className="font-mont text-xs text-gray-500">{hh('lab_results_subtitle')}</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_add_result')}</button>
        </div>

        {(pending.length > 0 || abnormal.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pending.length > 0 && <div className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 font-mont text-sm text-gray-700"><strong>{pending.length}</strong> result{pending.length > 1 ? 's' : ''} {hh('alert_pending')}</div>}
            {abnormal.length > 0 && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-mont text-sm text-red-800">⚠ <strong>{abnormal.length}</strong> {hh('alert_abnormal')}{abnormal.length > 1 ? 's' : ''} — {hh('alert_review')}</div>}
          </div>
        )}

        {(showForm && !editing) && <Form onSave={save} onCancel={() => setShowForm(false)} businessId={BusinessID} />}

        {loading ? (
          <div className="text-center py-12 font-mont text-sm text-gray-400 animate-pulse">{hh('loading')}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_lab_results')}</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs font-mont">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[hh('th_animal_group'),hh('th_sample_date'),hh('th_test'),hh('th_lab'),hh('th_status'),hh('th_vet_reviewed'),''].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(row => (
                  editing?.LabResultID === row.LabResultID ? (
                    <tr key={row.LabResultID}><td colSpan={7} className="p-3">
                      <Form init={editing} onSave={save} onCancel={() => setEditing(null)} businessId={BusinessID} />
                    </td></tr>
                  ) : (
                    <tr key={row.LabResultID} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-semibold text-gray-800">{row.AnimalTag ? `#${row.AnimalTag}` : row.GroupName || '—'}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.SampleDate?.slice(0, 10)}</td>
                      <td className="px-3 py-2.5 text-gray-700">{row.TestPanel}</td>
                      <td className="px-3 py-2.5 text-gray-400">{row.LabName}</td>
                      <td className="px-3 py-2.5">
                        <span className="font-semibold px-1.5 py-0.5 rounded text-white text-xs" style={{ backgroundColor: STATUS_COLOR[row.ResultStatus] || '#9CA3AF' }}>
                          {row.ResultStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">{row.VetReviewed || '—'}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          <button onClick={() => setEditing(row)} className="text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-100">{hh('btn_edit')}</button>
                          {deleting === row.LabResultID
                            ? <><button onClick={() => del(row.LabResultID)} className="text-red-600 font-semibold px-1.5 py-0.5 rounded bg-red-50">✓</button>
                                <button onClick={() => setDeleting(null)} className="text-gray-400 px-1.5 py-0.5 rounded hover:bg-gray-100">✕</button></>
                            : <button onClick={() => setDeleting(row.LabResultID)} className="text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50">Del</button>
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
