import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';
import AnimalPicker from './AnimalPicker';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';
const METHODS = ['Scale', 'Weight Tape', 'Visual Estimate'];
const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mont focus:outline-none focus:border-green-500";
function Field({ label, children, className }) {
  return <div className={className}><label className="block text-xs font-semibold text-gray-600 mb-1 font-mont">{label}</label>{children}</div>;
}
const EMPTY = { AnimalTag:'', RecordDate:'', WeightLbs:'', WeightKg:'', BodyConditionScore:'', FrameScore:'', RecordedBy:'', Method:'', Notes:'' };

const BCS_LABEL = { 1:'Emaciated', 2:'Very Thin', 3:'Thin', 4:'Below Average', 5:'Average', 6:'Above Average', 7:'Good', 8:'Fat', 9:'Very Fat' };

function Form({ init, onSave, onCancel, businessId }) {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [f, setF] = useState(init || EMPTY);
  const set = k => e => {
    let v = e.target.value;
    if (k === 'WeightLbs' && v && !f.WeightKg) setF(p => ({ ...p, WeightKg: (parseFloat(v) * 0.453592).toFixed(1), [k]: v }));
    else if (k === 'WeightKg' && v && !f.WeightLbs) setF(p => ({ ...p, WeightLbs: (parseFloat(v) / 0.453592).toFixed(1), [k]: v }));
    else setF(p => ({ ...p, [k]: v }));
  };
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={hh('f_animal')}>
          <AnimalPicker businessId={businessId} value={f.AnimalTag} animalId={f.AnimalID}
            onChange={(tag, id) => setF(p => ({ ...p, AnimalTag: tag, AnimalID: id }))} />
        </Field>
        <Field label={hh('f_record_date')}><input type="date" value={f.RecordDate} onChange={set('RecordDate')} className={inp} /></Field>
        <Field label={hh('f_weight_lbs')}><input type="number" step="0.1" value={f.WeightLbs} onChange={set('WeightLbs')} className={inp} /></Field>
        <Field label={hh('f_weight_kg')}><input type="number" step="0.1" value={f.WeightKg} onChange={set('WeightKg')} className={inp} /></Field>
        <Field label={hh('f_bcs')}>
          <select value={f.BodyConditionScore} onChange={set('BodyConditionScore')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n} – {BCS_LABEL[n]}</option>)}
          </select>
        </Field>
        <Field label={hh('f_frame_score')}>
          <select value={f.FrameScore} onChange={set('FrameScore')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
        <Field label={hh('f_weigh_method')}>
          <select value={f.Method} onChange={set('Method')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label={hh('f_recorded_by')}><input value={f.RecordedBy} onChange={set('RecordedBy')} className={inp} /></Field>
        <Field label={hh('f_notes')} className="sm:col-span-2"><textarea value={f.Notes} onChange={set('Notes')} rows={2} className={inp} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, WeightLbs: f.WeightLbs ? parseFloat(f.WeightLbs) : null, WeightKg: f.WeightKg ? parseFloat(f.WeightKg) : null, BodyConditionScore: f.BodyConditionScore ? parseFloat(f.BodyConditionScore) : null, FrameScore: f.FrameScore ? parseInt(f.FrameScore) : null })}
          className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_save')}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-mont text-gray-600 bg-gray-200 hover:bg-gray-300">Cancel</button>
      </div>
    </div>
  );
}

const BCS_COLOR = { 1:'#DC2626',2:'#EF4444',3:'#F97316',4:'#F59E0B',5:'#10B981',6:'#059669',7:'#047857',8:'#F59E0B',9:'#EF4444' };

export default function HerdHealthWeight() {
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
    fetch(`${API}/api/herd-health/weights?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : []).then(setRows).catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [BusinessID]);
  useEffect(() => { load(); }, [load]);

  const save = async (f) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/herd-health/weights/${editing.WeightID}`
      : `${API}/api/herd-health/weights?business_id=${BusinessID}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setShowForm(false); setEditing(null); load();
  };
  const del = async (id) => {
    await fetch(`${API}/api/herd-health/weights/${id}`, { method: 'DELETE' });
    setDeleting(null); load();
  };

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_weight')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Weight & BCS' }]}>
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">{hh('weight_title')}</h1>
            <p className="font-mont text-xs text-gray-500">{hh('weight_subtitle')}</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_add_record')}</button>
        </div>

        {(showForm && !editing) && <Form onSave={save} onCancel={() => setShowForm(false)} businessId={BusinessID} />}

        {loading ? (
          <div className="text-center py-12 font-mont text-sm text-gray-400 animate-pulse">{hh('loading')}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_weight_records')}</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs font-mont">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[hh('th_animal'),hh('th_date'),hh('th_weight_lbs'),hh('th_weight_kg'),hh('th_bcs'),hh('th_frame'),hh('th_method'),hh('th_by'),''].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(row => (
                  editing?.WeightID === row.WeightID ? (
                    <tr key={row.WeightID}><td colSpan={9} className="p-3">
                      <Form init={editing} onSave={save} onCancel={() => setEditing(null)} businessId={BusinessID} />
                    </td></tr>
                  ) : (
                    <tr key={row.WeightID} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-semibold text-gray-800">#{row.AnimalTag || '—'}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.RecordDate?.slice(0,10)}</td>
                      <td className="px-3 py-2.5 text-gray-700">{row.WeightLbs != null ? `${row.WeightLbs}` : '—'}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.WeightKg != null ? `${row.WeightKg}` : '—'}</td>
                      <td className="px-3 py-2.5">
                        {row.BodyConditionScore != null ? (
                          <span className="font-bold px-1.5 py-0.5 rounded" style={{ color: BCS_COLOR[Math.round(row.BodyConditionScore)] || '#6B7280', background: (BCS_COLOR[Math.round(row.BodyConditionScore)] || '#6B7280') + '20' }}>
                            {row.BodyConditionScore}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">{row.FrameScore || '—'}</td>
                      <td className="px-3 py-2.5 text-gray-400">{row.Method}</td>
                      <td className="px-3 py-2.5 text-gray-400">{row.RecordedBy}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          <button onClick={() => setEditing(row)} className="text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-100">{hh('btn_edit')}</button>
                          {deleting === row.WeightID
                            ? <><button onClick={() => del(row.WeightID)} className="text-red-600 font-semibold px-1.5 py-0.5 rounded bg-red-50">✓</button>
                                <button onClick={() => setDeleting(null)} className="text-gray-400 px-1.5 py-0.5 rounded hover:bg-gray-100">✕</button></>
                            : <button onClick={() => setDeleting(row.WeightID)} className="text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50">Del</button>
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
