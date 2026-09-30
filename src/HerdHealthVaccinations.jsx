import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';
import AnimalPicker from './AnimalPicker';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';

const ROUTES_ADMIN = ['IM', 'SQ', 'IN', 'Oral', 'Topical', 'IV'];
const VACCINE_TYPES = ['Modified Live Virus (MLV)', 'Killed/Inactivated', 'Toxoid', 'Recombinant', 'Subunit', 'Other'];

const EMPTY = {
  AnimalTag:'', GroupName:'', VaccineName:'', VaccineManufacturer:'', VaccineType:'',
  AdministeredDate:'', NextDueDate:'', Dosage:'', Route:'', LotNumber:'',
  ExpirationDate:'', AdministeredBy:'', Notes:'',
};

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mont focus:outline-none focus:border-green-500";
function Field({ label, children, className }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 mb-1 font-mont">{label}</label>
      {children}
    </div>
  );
}

function Form({ init, onSave, onCancel, businessId }) {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [f, setF] = useState(init || EMPTY);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={hh('f_animal_or_group')}>
          <AnimalPicker businessId={businessId} value={f.AnimalTag} animalId={f.AnimalID}
            onChange={(tag, id) => setF(p => ({ ...p, AnimalTag: tag, AnimalID: id }))} />
        </Field>
        <Field label={hh('f_group_name')}><input value={f.GroupName} onChange={set('GroupName')} placeholder={hh('ph_group_name')} className={inp} /></Field>
        <Field label={hh('f_vaccine_name')}><input value={f.VaccineName} onChange={set('VaccineName')} className={inp} required /></Field>
        <Field label={hh('f_manufacturer')}><input value={f.VaccineManufacturer} onChange={set('VaccineManufacturer')} className={inp} /></Field>
        <Field label={hh('f_vaccine_type')}>
          <select value={f.VaccineType} onChange={set('VaccineType')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {VACCINE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label={hh('f_route')}>
          <select value={f.Route} onChange={set('Route')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {ROUTES_ADMIN.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label={hh('f_date_administered')}><input type="date" value={f.AdministeredDate} onChange={set('AdministeredDate')} className={inp} /></Field>
        <Field label={hh('f_next_due_date')}><input type="date" value={f.NextDueDate} onChange={set('NextDueDate')} className={inp} /></Field>
        <Field label={hh('f_dosage')}><input value={f.Dosage} onChange={set('Dosage')} placeholder={hh('ph_dosage')} className={inp} /></Field>
        <Field label={hh('f_administered_by')}><input value={f.AdministeredBy} onChange={set('AdministeredBy')} className={inp} /></Field>
        <Field label={hh('f_lot_number')}><input value={f.LotNumber} onChange={set('LotNumber')} className={inp} /></Field>
        <Field label={hh('f_vial_expiration')}><input type="date" value={f.ExpirationDate} onChange={set('ExpirationDate')} className={inp} /></Field>
        <Field label={hh('f_notes')} className="sm:col-span-2"><textarea value={f.Notes} onChange={set('Notes')} rows={2} className={inp} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(f)} className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_save')}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-mont text-gray-600 bg-gray-200 hover:bg-gray-300">{hh('btn_cancel')}</button>
      </div>
    </div>
  );
}

export default function HerdHealthVaccinations() {
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
    fetch(`${API}/api/herd-health/vaccinations?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : []).then(setRows).catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [BusinessID]);

  useEffect(() => { load(); }, [load]);

  const save = async (f) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/herd-health/vaccinations/${editing.VaccinationID}`
      : `${API}/api/herd-health/vaccinations?business_id=${BusinessID}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setShowForm(false); setEditing(null); load();
  };

  const del = async (id) => {
    await fetch(`${API}/api/herd-health/vaccinations/${id}`, { method: 'DELETE' });
    setDeleting(null); load();
  };

  const today = new Date().toISOString().slice(0, 10);
  const overdue = rows.filter(r => r.NextDueDate && r.NextDueDate.slice(0,10) < today);

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_vaccinations')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Vaccinations' }]}>
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">{hh('vaccinations_title')}</h1>
            <p className="font-mont text-xs text-gray-500">{hh('vaccinations_subtitle')}</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold"
            style={{ backgroundColor: ACCENT }}>{hh('btn_add_vaccination')}</button>
        </div>

        {overdue.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-mont text-sm text-amber-800">
            <strong>{overdue.length} vaccination{overdue.length > 1 ? 's' : ''}</strong> {hh('past_due')}
          </div>
        )}

        {(showForm && !editing) && (
          <Form onSave={save} onCancel={() => setShowForm(false)} businessId={BusinessID} />
        )}

        {loading ? (
          <div className="text-center py-12 font-mont text-sm text-gray-400 animate-pulse">{hh('loading')}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_vaccinations')}</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs font-mont">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[hh('th_animal_group'),hh('th_vaccine'),hh('th_type'),hh('th_date_given'),hh('th_next_due'),hh('th_by'),''].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(row => {
                  const due = row.NextDueDate?.slice(0,10);
                  const isOverdue = due && due < today;
                  return editing?.VaccinationID === row.VaccinationID ? (
                    <tr key={row.VaccinationID}><td colSpan={7} className="p-3">
                      <Form init={editing} onSave={save} onCancel={() => setEditing(null)} businessId={BusinessID} />
                    </td></tr>
                  ) : (
                    <tr key={row.VaccinationID} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-semibold text-gray-800">{row.AnimalTag ? `#${row.AnimalTag}` : row.GroupName || '—'}</td>
                      <td className="px-3 py-2.5 text-gray-700">{row.VaccineName}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.VaccineType}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.AdministeredDate?.slice(0,10)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>{due || '—'}</span>
                        {isOverdue && <span className="ml-1 text-red-500">⚠</span>}
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">{row.AdministeredBy}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          <button onClick={() => setEditing(row)} className="text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-100">{hh('btn_edit')}</button>
                          {deleting === row.VaccinationID
                            ? <><button onClick={() => del(row.VaccinationID)} className="text-red-600 font-semibold px-1.5 py-0.5 rounded bg-red-50">✓</button>
                                <button onClick={() => setDeleting(null)} className="text-gray-400 px-1.5 py-0.5 rounded hover:bg-gray-100">✕</button></>
                            : <button onClick={() => setDeleting(row.VaccinationID)} className="text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50">Del</button>
                          }
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HerdHealthLayout>
  );
}
