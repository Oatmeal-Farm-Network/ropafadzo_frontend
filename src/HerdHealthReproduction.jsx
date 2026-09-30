import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import HerdHealthLayout from './HerdHealthLayout';
import AnimalPicker from './AnimalPicker';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#3D6B34';

const EVENT_TYPES = [
  'Breeding', 'Pregnancy Check', 'Birth / Parturition', 'Abortion / Pregnancy Loss',
  'Weaning', 'Breeding Soundness Exam (BSE)', 'Embryo Flush', 'Embryo Transfer',
  'Hormone / Synchronization Treatment', 'Dry-Off', 'Other',
];
const BREEDING_METHODS = ['Natural Service', 'Artificial Insemination (AI)', 'Embryo Transfer (ET)', 'Other'];
const PREGNANCY_STATUSES = ['Open', 'Bred', 'Confirmed Pregnant', 'Confirmed Open', 'Aborted', 'Unknown'];
const PREGNANCY_CHECK_METHODS = ['Rectal Palpation', 'Transrectal Ultrasound', 'Blood Test (PAG)', 'Milk Progesterone', 'Visual / Behavioral', 'Other'];
const BIRTH_EASE = ['Unassisted', 'Minor Assist', 'Major Assist', 'C-Section', 'Stillbirth'];

const PREGNANCY_COLOR = {
  'Open': '#EF4444', 'Bred': '#3B82F6', 'Confirmed Pregnant': '#10B981',
  'Confirmed Open': '#9CA3AF', 'Aborted': '#DC2626', 'Unknown': '#6B7280',
};

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mont focus:outline-none focus:border-green-500";
function Field({ label, children, className }) {
  return <div className={className}><label className="block text-xs font-semibold text-gray-600 mb-1 font-mont">{label}</label>{children}</div>;
}

const EMPTY = {
  AnimalTag: '', Species: '', EventType: '', EventDate: '',
  BreedingMethod: '', SireTag: '', SireName: '', SireBreed: '', SireRegNumber: '',
  PregnancyStatus: '', PregnancyCheckDate: '', PregnancyCheckMethod: '',
  ExpectedDueDate: '', ActualBirthDate: '', NumberBorn: '', NumberBornAlive: '',
  BirthWeightLbs: '', BirthEase: '', OffspringTags: '',
  WeanDate: '', WeanWeightLbs: '', PerformedBy: '', Notes: '',
};

function Form({ init, onSave, onCancel, businessId }) {
  const { t } = useTranslation();
  const hh = k => t(`herd_health.${k}`);
  const [f, setF] = useState(init || EMPTY);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const isBirth = f.EventType === 'Birth / Parturition';
  const isBreeding = f.EventType === 'Breeding';
  const isPregnancyCheck = f.EventType === 'Pregnancy Check';
  const isWeaning = f.EventType === 'Weaning';

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Core fields always shown */}
        <Field label={hh('f_dam_req')}>
          <AnimalPicker businessId={businessId} value={f.AnimalTag} animalId={f.AnimalID}
            onChange={(tag, id, animal) => setF(p => ({ ...p, AnimalTag: tag, AnimalID: id, Species: animal?.SpeciesName || p.Species }))} />
        </Field>
        <Field label={hh('f_species')}><input value={f.Species} onChange={set('Species')} placeholder={hh('ph_species_auto')} className={inp} /></Field>
        <Field label={hh('f_event_type_req')}>
          <select value={f.EventType} onChange={set('EventType')} className={inp}>
            <option value="">{hh('select_ph')}</option>
            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label={hh('f_event_date')}><input type="date" value={f.EventDate} onChange={set('EventDate')} className={inp} /></Field>

        {/* Breeding fields */}
        {(isBreeding || f.BreedingMethod) && (
          <>
            <Field label={hh('f_breeding_method')}>
              <select value={f.BreedingMethod} onChange={set('BreedingMethod')} className={inp}>
                <option value="">{hh('select_ph')}</option>
                {BREEDING_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label={hh('f_sire_tag')}><input value={f.SireTag} onChange={set('SireTag')} className={inp} /></Field>
            <Field label={hh('f_sire_name')}><input value={f.SireName} onChange={set('SireName')} className={inp} /></Field>
            <Field label={hh('f_sire_breed')}><input value={f.SireBreed} onChange={set('SireBreed')} className={inp} /></Field>
            <Field label={hh('f_sire_reg')}><input value={f.SireRegNumber} onChange={set('SireRegNumber')} className={inp} /></Field>
          </>
        )}

        {/* Pregnancy check fields */}
        {(isPregnancyCheck || f.PregnancyStatus) && (
          <>
            <Field label={hh('f_pregnancy_status')}>
              <select value={f.PregnancyStatus} onChange={set('PregnancyStatus')} className={inp}>
                <option value="">{hh('select_ph')}</option>
                {PREGNANCY_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label={hh('f_check_method')}>
              <select value={f.PregnancyCheckMethod} onChange={set('PregnancyCheckMethod')} className={inp}>
                <option value="">{hh('select_ph')}</option>
                {PREGNANCY_CHECK_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label={hh('f_check_date')}><input type="date" value={f.PregnancyCheckDate} onChange={set('PregnancyCheckDate')} className={inp} /></Field>
            <Field label={hh('f_expected_due')}><input type="date" value={f.ExpectedDueDate} onChange={set('ExpectedDueDate')} className={inp} /></Field>
          </>
        )}

        {/* Birth fields */}
        {(isBirth || f.ActualBirthDate) && (
          <>
            <Field label={hh('f_actual_birth')}><input type="date" value={f.ActualBirthDate} onChange={set('ActualBirthDate')} className={inp} /></Field>
            <Field label={hh('f_num_born')}><input type="number" min="0" value={f.NumberBorn} onChange={set('NumberBorn')} className={inp} /></Field>
            <Field label={hh('f_num_born_alive')}><input type="number" min="0" value={f.NumberBornAlive} onChange={set('NumberBornAlive')} className={inp} /></Field>
            <Field label={hh('f_birth_weight_lbs')}><input type="number" step="0.1" value={f.BirthWeightLbs} onChange={set('BirthWeightLbs')} className={inp} /></Field>
            <Field label={hh('f_birth_ease')}>
              <select value={f.BirthEase} onChange={set('BirthEase')} className={inp}>
                <option value="">{hh('select_ph')}</option>
                {BIRTH_EASE.map(e => <option key={e}>{e}</option>)}
              </select>
            </Field>
            <Field label={hh('f_offspring_tags')} className="sm:col-span-2">
              <input value={f.OffspringTags} onChange={set('OffspringTags')} placeholder={hh('ph_offspring_tags')} className={inp} />
            </Field>
          </>
        )}

        {/* Weaning fields */}
        {(isWeaning || f.WeanDate) && (
          <>
            <Field label={hh('f_wean_date')}><input type="date" value={f.WeanDate} onChange={set('WeanDate')} className={inp} /></Field>
            <Field label={hh('f_wean_weight_lbs')}><input type="number" step="0.1" value={f.WeanWeightLbs} onChange={set('WeanWeightLbs')} className={inp} /></Field>
          </>
        )}

        {/* Always show for non-breeding-specific events */}
        {!isBreeding && !f.BreedingMethod && (
          <Field label={hh('f_expected_due')}><input type="date" value={f.ExpectedDueDate} onChange={set('ExpectedDueDate')} className={inp} /></Field>
        )}

        <Field label={hh('f_performed_by')}><input value={f.PerformedBy} onChange={set('PerformedBy')} className={inp} /></Field>
        <Field label={hh('f_notes')} className="sm:col-span-2"><textarea value={f.Notes} onChange={set('Notes')} rows={2} className={inp} /></Field>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({
          ...f,
          NumberBorn: f.NumberBorn ? parseInt(f.NumberBorn) : null,
          NumberBornAlive: f.NumberBornAlive ? parseInt(f.NumberBornAlive) : null,
          BirthWeightLbs: f.BirthWeightLbs ? parseFloat(f.BirthWeightLbs) : null,
          WeanWeightLbs: f.WeanWeightLbs ? parseFloat(f.WeanWeightLbs) : null,
        })} className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_save')}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-mont text-gray-600 bg-gray-200 hover:bg-gray-300">{hh('btn_cancel')}</button>
      </div>
    </div>
  );
}

export default function HerdHealthReproduction() {
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
    fetch(`${API}/api/herd-health/reproduction?business_id=${BusinessID}`)
      .then(r => r.ok ? r.json() : []).then(setRows).catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [BusinessID]);
  useEffect(() => { load(); }, [load]);

  const save = async (f) => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/herd-health/reproduction/${editing.ReproductionID}`
      : `${API}/api/herd-health/reproduction?business_id=${BusinessID}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    setShowForm(false); setEditing(null); load();
  };
  const del = async (id) => {
    await fetch(`${API}/api/herd-health/reproduction/${id}`, { method: 'DELETE' });
    setDeleting(null); load();
  };

  const today = new Date().toISOString().slice(0, 10);
  const soon = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const dueSoon = rows.filter(r => r.ExpectedDueDate && r.ExpectedDueDate.slice(0, 10) >= today && r.ExpectedDueDate.slice(0, 10) <= soon && !r.ActualBirthDate);
  const overdue = rows.filter(r => r.ExpectedDueDate && r.ExpectedDueDate.slice(0, 10) < today && !r.ActualBirthDate);

  return (
    <HerdHealthLayout Business={Business} BusinessID={BusinessID}
      PeopleID={localStorage.getItem('people_id')} pageTitle={hh('nav_reproduction')}
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Herd Health', to: `/herd-health?BusinessID=${BusinessID}` }, { label: 'Reproduction' }]}>
      <div className="space-y-4 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-lora text-xl font-bold text-gray-900">{hh('reproduction_title')}</h1>
            <p className="font-mont text-xs text-gray-500">{hh('reproduction_subtitle')}</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}
            className="px-4 py-2 rounded-lg text-white text-sm font-mont font-semibold" style={{ backgroundColor: ACCENT }}>{hh('btn_add_record')}</button>
        </div>

        {(dueSoon.length > 0 || overdue.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dueSoon.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 font-mont text-sm text-blue-800">
                🗓 <strong>{dueSoon.length}</strong> animal{dueSoon.length > 1 ? 's' : ''} {hh('alert_due_soon')}
              </div>
            )}
            {overdue.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-mont text-sm text-amber-800">
                ⚠ <strong>{overdue.length}</strong> animal{overdue.length > 1 ? 's' : ''} {hh('alert_overdue_preg')}
              </div>
            )}
          </div>
        )}

        {(showForm && !editing) && <Form onSave={save} onCancel={() => setShowForm(false)} businessId={BusinessID} />}

        {loading ? (
          <div className="text-center py-12 font-mont text-sm text-gray-400 animate-pulse">{hh('loading')}</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 font-mont text-sm text-gray-400">{hh('no_reproduction')}</div>
        ) : (
          <div className="space-y-2">
            {rows.map(row => (
              <div key={row.ReproductionID}>
                {editing?.ReproductionID === row.ReproductionID ? (
                  <Form init={editing} onSave={save} onCancel={() => setEditing(null)} businessId={BusinessID} />
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mont text-sm font-bold text-gray-900">{row.AnimalTag ? `#${row.AnimalTag}` : '—'}</span>
                          {row.Species && <span className="font-mont text-xs text-gray-500">{row.Species}</span>}
                          {row.EventType && (
                            <span className="font-mont text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold">{row.EventType}</span>
                          )}
                          {row.PregnancyStatus && (
                            <span className="font-mont text-xs px-2 py-0.5 rounded-full text-white font-semibold"
                              style={{ backgroundColor: PREGNANCY_COLOR[row.PregnancyStatus] || '#9CA3AF' }}>
                              {row.PregnancyStatus}
                            </span>
                          )}
                        </div>
                        <div className="font-mont text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3">
                          {row.EventDate && <span>{row.EventDate.slice(0, 10)}</span>}
                          {row.BreedingMethod && <span>{row.BreedingMethod}</span>}
                          {row.SireName && <span>{hh('lbl_sire')} {row.SireName}{row.SireBreed ? ` (${row.SireBreed})` : ''}</span>}
                          {row.SireTag && !row.SireName && <span>{hh('lbl_sire_tag')} #{row.SireTag}</span>}
                          {row.ExpectedDueDate && !row.ActualBirthDate && (
                            <span className={
                              row.ExpectedDueDate.slice(0, 10) < today ? 'text-amber-600 font-semibold' :
                              row.ExpectedDueDate.slice(0, 10) <= soon ? 'text-blue-600 font-semibold' : ''
                            }>{hh('lbl_due')} {row.ExpectedDueDate.slice(0, 10)}</span>
                          )}
                          {row.ActualBirthDate && <span className="text-green-700 font-semibold">{hh('lbl_born')} {row.ActualBirthDate.slice(0, 10)}</span>}
                          {row.NumberBornAlive != null && <span>{row.NumberBornAlive} {hh('lbl_born_alive')}{row.NumberBorn > row.NumberBornAlive ? ` / ${row.NumberBorn} ${hh('lbl_total')}` : ''}</span>}
                          {row.BirthEase && <span>{hh('lbl_ease')} {row.BirthEase}</span>}
                          {row.WeanDate && <span>{hh('lbl_weaned')} {row.WeanDate.slice(0, 10)}{row.WeanWeightLbs ? ` ${hh('lbl_at')} ${row.WeanWeightLbs} ${hh('lbl_lbs')}` : ''}</span>}
                          {row.PerformedBy && <span>{hh('lbl_by')} {row.PerformedBy}</span>}
                        </div>
                        {row.OffspringTags && (
                          <p className="font-mont text-xs text-gray-400 mt-0.5">{hh('lbl_offspring')} {row.OffspringTags}</p>
                        )}
                        {row.Notes && <p className="font-mont text-xs text-gray-400 mt-0.5 line-clamp-1">{row.Notes}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditing(row)} className="font-mont text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100">{hh('btn_edit')}</button>
                        {deleting === row.ReproductionID
                          ? <><button onClick={() => del(row.ReproductionID)} className="font-mont text-xs text-red-600 font-semibold px-2 py-1 rounded bg-red-50">{hh('btn_confirm')}</button>
                              <button onClick={() => setDeleting(null)} className="font-mont text-xs text-gray-400 px-2 py-1 rounded hover:bg-gray-100">{hh('btn_cancel')}</button></>
                          : <button onClick={() => setDeleting(row.ReproductionID)} className="font-mont text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">{hh('btn_delete')}</button>
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
