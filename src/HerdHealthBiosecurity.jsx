import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';
const LOG_TYPES = [
  'Visitor Entry', 'Vehicle Entry', 'Animal Delivery', 'Feed Delivery',
  'Medication / Supply Delivery', 'Employee Entry', 'Quarantine Check',
  'Facility Cleaning & Disinfection', 'Pest Control', 'Water Test',
  'Protocol Review / Update', 'Incident / Breach', 'Other',
];
const RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const RISK_COLOR = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444', Critical: '#DC2626' };

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mont focus:outline-none focus:border-green-500";
function Field({ label, children, className }) {
  return <div className={className}><label className="block text-xs font-semibold text-gray-600 mb-1 font-mont">{label}</label>{children}</div>;
}

const EMPTY = {
  LogDate: '', LogType: '', PersonOrOrg: '', Purpose: '', EntryPoint: '',
  VehiclePlate: '', PPEUsed: '', BootDipUsed: '', AreaAccessed: '',
  AnimalContactMade: '', RiskLevel: 'Low', ProtocolsFollowed: '',
  IncidentDescription: '', CorrectiveAction: '', LoggedBy: '', Notes: '',
};

function Form({ init, onSave, onCancel }) {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [f, setF] = useState(init || EMPTY);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={hh('f_date')}><input type="date" value={f.LogDate} onChange={set('LogDate')} className={inp} /></Field>
        <Field label={hh('f_log_type')}>
          <select value={f.LogType} onChange={set('LogType')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {LOG_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label={hh('f_person_org')}><input value={f.PersonOrOrg} onChange={set('PersonOrOrg')} className={inp} /></Field>
        <Field label={hh('f_purpose')}><input value={f.Purpose} onChange={set('Purpose')} className={inp} /></Field>
        <Field label={hh('f_entry_point')}><input value={f.EntryPoint} onChange={set('EntryPoint')} placeholder={hh('ph_entry_point')} className={inp} /></Field>
        <Field label={hh('f_vehicle_id')}><input value={f.VehiclePlate} onChange={set('VehiclePlate')} className={inp} /></Field>
        <Field label={hh('f_areas_accessed')}><input value={f.AreaAccessed} onChange={set('AreaAccessed')} placeholder={hh('ph_areas')} className={inp} /></Field>
        <Field label={hh('f_animal_contact')}>
          <select value={f.AnimalContactMade} onChange={set('AnimalContactMade')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('f_yes')}</option><option>{hh('f_no')}</option>
          </select>
        </Field>
        <Field label={hh('f_ppe_used')}>
          <select value={f.PPEUsed} onChange={set('PPEUsed')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('opt_yes_full')}</option><option>{hh('opt_yes_partial')}</option><option>{hh('f_no')}</option>
          </select>
        </Field>
        <Field label={hh('f_boot_dip')}>
          <select value={f.BootDipUsed} onChange={set('BootDipUsed')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            <option>{hh('f_yes')}</option><option>{hh('f_no')}</option><option>{hh('f_na')}</option>
          </select>
        </Field>
        <Field label={hh('f_risk_level')}>
          <select value={f.RiskLevel} onChange={set('RiskLevel')} className={inp}>
            {RISK_LEVELS.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label={hh('f_protocols_followed')}><input value={f.ProtocolsFollowed} onChange={set('ProtocolsFollowed')} placeholder={hh('ph_protocol')} className={inp} /></Field>
        <Field label={hh('f_logged_by')}><input value={f.LoggedBy} onChange={set('LoggedBy')} className={inp} /></Field>
        <Field label={hh('f_incident_desc')} className="sm:col-span-2"><textarea value={f.IncidentDescription} onChange={set('IncidentDescription')} rows={2} placeholder={hh('ph_incident')} className={inp} /></Field>
        <Field label={hh('f_corrective_action')} className="sm:col-span-2"><textarea value={f.CorrectiveAction} onChange={set('CorrectiveAction')} rows={2} className={inp} /></Field>
        <Field label={hh('f_notes')} className="sm:col-span-2"><textarea value={f.Notes} onChange={set('Notes')} rows={2} className={inp} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(f)} className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_save')}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-mont text-gray-600 bg-gray-200 hover:bg-gray-300">{hh('btn_cancel')}</button>
      </div>
    </div>
  );
}

export default function HerdHealthBiosecurity() {
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
    fetch(`${API}/api/herd-health/biosecurity?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : []).then(setRows).catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [BusinessID]);
  useEffect(() => { load(); }, [load]);

  const save = async (f) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/herd-health/biosecurity/${editing.BiosecurityID}`
      : `${API}/api/herd-health/biosecurity?business_id=${BusinessID}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setShowForm(false); setEditing(null); load();
  };
  const del = async (id) => {
    await fetch(`${API}/api/herd-health/biosecurity/${id}`, { method: 'DELETE' });
    setDeleting(null); load();
  };

  const incidents = rows.filter(r => r.LogType === 'Incident / Breach' || r.RiskLevel === 'Critical' || r.RiskLevel === 'High');

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_biosecurity')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Biosecurity' }]}>
      <div className="space-y-4 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">{hh('biosecurity_title')}</h1>
            <p className="font-mont text-xs text-gray-500">{hh('biosecurity_subtitle')}</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_add_entry')}</button>
        </div>

        {incidents.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-mont text-sm text-red-800">
            ⚠ <strong>{incidents.length}</strong> {hh('alert_high_risk')}{incidents.length > 1 ? 's' : ''} on record — {hh('alert_review_rec')}
          </div>
        )}

        {(showForm && !editing) && <Form onSave={save} onCancel={() => setShowForm(false)} />}

        {loading ? (
          <div className="text-center py-12 font-mont text-sm text-gray-400 animate-pulse">{hh('loading')}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_biosecurity')}</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs font-mont">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[hh('th_date'),hh('th_type'),hh('th_person_org'),hh('th_area'),hh('th_risk'),hh('th_ppe'),hh('f_logged_by'),''].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(row => (
                  editing?.BiosecurityID === row.BiosecurityID ? (
                    <tr key={row.BiosecurityID}><td colSpan={8} className="p-3">
                      <Form init={editing} onSave={save} onCancel={() => setEditing(null)} />
                    </td></tr>
                  ) : (
                    <tr key={row.BiosecurityID} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-500">{row.LogDate?.slice(0, 10)}</td>
                      <td className="px-3 py-2.5 text-gray-700">{row.LogType}</td>
                      <td className="px-3 py-2.5 font-semibold text-gray-800">{row.PersonOrOrg || '—'}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.AreaAccessed || '—'}</td>
                      <td className="px-3 py-2.5">
                        <span className="font-semibold px-1.5 py-0.5 rounded text-white text-xs" style={{ backgroundColor: RISK_COLOR[row.RiskLevel] || '#9CA3AF' }}>
                          {row.RiskLevel}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">{row.PPEUsed || '—'}</td>
                      <td className="px-3 py-2.5 text-gray-400">{row.LoggedBy || '—'}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          <button onClick={() => setEditing(row)} className="text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-100">{hh('btn_edit')}</button>
                          {deleting === row.BiosecurityID
                            ? <><button onClick={() => del(row.BiosecurityID)} className="text-red-600 font-semibold px-1.5 py-0.5 rounded bg-red-50">✓</button>
                                <button onClick={() => setDeleting(null)} className="text-gray-400 px-1.5 py-0.5 rounded hover:bg-gray-100">✕</button></>
                            : <button onClick={() => setDeleting(row.BiosecurityID)} className="text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50">Del</button>
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
