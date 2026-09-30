import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RichTextEditor from './RichTextEditor';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-4 py-1.5 text-sm border border-gray-300 rounded-lg";

const PLACEMENTS = ['', '1st', '2nd', '3rd', '4th', '5th', '6th',
  'Champion', 'Reserve Champion', 'Honorable Mention', 'Disqualified'];
const BREEDS = ['Huacaya', 'Suri', 'Paco-Vicuna', 'Llama', 'Sheep', 'Goat', 'Horse', 'Other'];
const GENDERS = ['Female', 'Male', 'Gelding', 'Unknown'];
const CLASS_TYPES = [
  'Halter', 'Production', 'Get of Sire', 'Produce of Dam', 'Color Championship',
  'Western Pleasure', 'Reining', 'Cutting', 'Working Cow Horse', 'Trail',
  'Dressage', 'Show Jumping', 'Hunters',
  'Barrel Racing', 'Pole Bending', 'Keyhole Race',
  'Versatility', 'Equitation', 'Horsemanship',
  'Showmanship', 'In-Hand',
];

const BREED_KEY_MAP = {
  'Huacaya': 'huacaya', 'Suri': 'suri', 'Paco-Vicuna': 'paco_vicuna',
  'Llama': 'llama', 'Sheep': 'sheep', 'Goat': 'goat', 'Horse': 'horse', 'Other': 'other',
};
const GENDER_KEY_MAP = {
  'Female': 'female', 'Male': 'male', 'Gelding': 'gelding', 'Unknown': 'unknown',
};
const CLASS_TYPE_KEY_MAP = {
  'Halter': 'halter', 'Production': 'production', 'Get of Sire': 'get_of_sire',
  'Produce of Dam': 'produce_of_dam', 'Color Championship': 'color_championship',
  'Western Pleasure': 'western_pleasure', 'Reining': 'reining', 'Cutting': 'cutting',
  'Working Cow Horse': 'working_cow_horse', 'Trail': 'trail', 'Dressage': 'dressage',
  'Show Jumping': 'show_jumping', 'Hunters': 'hunters', 'Barrel Racing': 'barrel_racing',
  'Pole Bending': 'pole_bending', 'Keyhole Race': 'keyhole_race', 'Versatility': 'versatility',
  'Equitation': 'equitation', 'Horsemanship': 'horsemanship', 'Showmanship': 'showmanship',
  'In-Hand': 'in_hand',
};
const PLACEMENT_KEY_MAP = {
  '1st': 'first', '2nd': 'second', '3rd': 'third', '4th': 'fourth', '5th': 'fifth', '6th': 'sixth',
  'Champion': 'champion', 'Reserve Champion': 'reserve_champion',
  'Honorable Mention': 'honorable_mention', 'Disqualified': 'disqualified',
};

function ConfigTab({ eventId }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/halter/config`).then(r => r.json()).then(setCfg);
  }, [eventId]);
  if (!cfg) return <div className="p-4 text-sm text-gray-500">{t('halter_admin.loading')}</div>;
  const set = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value }));
  const setNum = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  const save = async () => {
    setSaving(true); setMsg('');
    try {
      const r = await fetch(`${API}/api/events/${eventId}/halter/config`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg),
      });
      if (!r.ok) throw new Error(t('halter_admin.err_save_failed'));
      setMsg(t('halter_admin.msg_saved'));
    } catch { setMsg(t('halter_admin.err_save_failed')); }
    finally { setSaving(false); }
  };
  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>{t('halter_admin.lbl_description')}</label>
        <RichTextEditor value={cfg.Description || ''}
          onChange={(v) => setCfg(c => ({ ...c, Description: v }))} minHeight={160} />
      </div>
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('halter_admin.fees_heading')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('halter_admin.lbl_fee_per_animal')}</label>
          <input type="number" step="0.01" value={cfg.FeePerAnimal ?? ''} onChange={setNum('FeePerAnimal')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_discount_fee')}</label>
          <input type="number" step="0.01" value={cfg.DiscountFeePerAnimal ?? ''} onChange={setNum('DiscountFeePerAnimal')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_discount_ends')}</label>
          <input type="date" value={(cfg.DiscountEndDate || '').toString().substring(0, 10)} onChange={set('DiscountEndDate')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_production_fee')}</label>
          <input type="number" step="0.01" value={cfg.FeePerProductionAnimal ?? ''} onChange={setNum('FeePerProductionAnimal')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_fee_per_pen')}</label>
          <input type="number" step="0.01" value={cfg.FeePerPen ?? ''} onChange={setNum('FeePerPen')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_vet_check_fee')}</label>
          <input type="number" step="0.01" value={cfg.VetCheckFee ?? ''} onChange={setNum('VetCheckFee')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_electricity_fee')}</label>
          <input type="number" step="0.01" value={cfg.ElectricityFee ?? ''} onChange={setNum('ElectricityFee')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_stall_mat_fee')}</label>
          <input type="number" step="0.01" value={cfg.StallMatFee ?? ''} onChange={setNum('StallMatFee')} className={inp} /></div>
      </div>
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('halter_admin.limits_heading')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><label className={lbl}>{t('halter_admin.lbl_max_pens')}</label>
          <input type="number" value={cfg.MaxPensPerFarm ?? ''} onChange={setNum('MaxPensPerFarm')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_max_juveniles')}</label>
          <input type="number" value={cfg.MaxJuvenilesPerPen ?? ''} onChange={setNum('MaxJuvenilesPerPen')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_max_adults')}</label>
          <input type="number" value={cfg.MaxAdultsPerPen ?? ''} onChange={setNum('MaxAdultsPerPen')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_reg_closes')}</label>
          <input type="date" value={(cfg.RegistrationEndDate || '').toString().substring(0, 10)} onChange={set('RegistrationEndDate')} className={inp} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!cfg.IsActive} onChange={(e) => setCfg(c => ({ ...c, IsActive: e.target.checked }))} />
        {t('halter_admin.lbl_is_active')}
      </label>
      <div className="flex justify-end items-center gap-3 pt-2">
        {msg && <span className="text-xs text-gray-500 mr-auto">{msg}</span>}
        <button onClick={save} disabled={saving} className={btn}>{saving ? t('halter_admin.btn_saving') : t('halter_admin.btn_save_config')}</button>
      </div>
    </div>
  );
}

function ClassesTab({ eventId }) {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [err, setErr] = useState('');
  const load = () => fetch(`${API}/api/events/${eventId}/halter/classes`)
    .then(r => r.json()).then(setClasses);
  useEffect(() => { load(); }, [eventId]);

  const save = async (form) => {
    setErr('');
    const url = editing
      ? `${API}/api/events/halter/classes/${editing.ClassID}`
      : `${API}/api/events/${eventId}/halter/classes`;
    const r = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    if (!r.ok) { setErr(t('halter_admin.err_save_failed')); return; }
    setEditing(null); setAdding(false); load();
  };

  const remove = async (c) => {
    if (!confirm(t('halter_admin.confirm_delete_class', { name: c.ClassName }))) return;
    await fetch(`${API}/api/events/halter/classes/${c.ClassID}`, { method: 'DELETE' });
    load();
  };

  const SEED_OPTIONS = [
    { breed: 'Huacaya',    template: 'alpaca-standard', label: t('halter_admin.seed_label_huacaya'),    desc: t('halter_admin.seed_desc_alpaca_standard') },
    { breed: 'Suri',       template: 'alpaca-standard', label: t('halter_admin.seed_label_suri'),       desc: t('halter_admin.seed_desc_alpaca_standard') },
    { breed: 'Paco-Vicuna',template: 'alpaca-standard', label: t('halter_admin.seed_label_paco_vicuna'),desc: t('halter_admin.seed_desc_alpaca_standard') },
    { breed: 'Horse',      template: 'horse-standard',  label: t('halter_admin.seed_label_horse'),      desc: t('halter_admin.seed_desc_horse_standard') },
    { breed: 'Sheep',      template: 'sheep-standard',  label: t('halter_admin.seed_label_sheep'),      desc: t('halter_admin.seed_desc_sheep_standard') },
    { breed: 'Goat',       template: 'goat-standard',   label: t('halter_admin.seed_label_goat'),       desc: t('halter_admin.seed_desc_goat_standard') },
  ];
  const [seedChoice, setSeedChoice] = useState(SEED_OPTIONS[0].breed);
  const chosen = SEED_OPTIONS.find(o => o.breed === seedChoice) || SEED_OPTIONS[0];

  const seed = async () => {
    if (!confirm(t('halter_admin.confirm_seed', { label: chosen.label, desc: chosen.desc }))) return;
    setSeeding(true); setErr('');
    try {
      const r = await fetch(`${API}/api/events/${eventId}/halter/classes/bulk-seed`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Breed: chosen.breed, Template: chosen.template }),
      });
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.detail || t('halter_admin.err_seed_failed')); }
      load();
    } catch (ex) { setErr(ex.message); }
    finally { setSeeding(false); }
  };

  const grouped = classes.reduce((acc, c) => {
    const b = c.Breed || 'Other';
    (acc[b] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{err}</div>}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-blue-800 mr-2">{t('halter_admin.seed_prompt')}</span>
        <select value={seedChoice} onChange={(e) => setSeedChoice(e.target.value)} className={inp + " max-w-[220px]"}>
          {SEED_OPTIONS.map(o => <option key={o.breed} value={o.breed}>{o.label}</option>)}
        </select>
        <button onClick={seed} disabled={seeding} className={btn}>{seeding ? t('halter_admin.btn_seeding') : t('halter_admin.btn_seed')}</button>
        <span className="text-[11px] text-gray-500 ml-1">{chosen.desc}</span>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('halter_admin.classes_heading', { n: classes.length })}</h3>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)} className={btn}>{t('halter_admin.btn_add_class')}</button>
        )}
      </div>

      {(adding || editing) && (
        <ClassForm
          initial={editing || {}}
          onSave={save}
          onCancel={() => { setAdding(false); setEditing(null); }}
        />
      )}

      {Object.entries(grouped).map(([breed, list]) => (
        <div key={breed}>
          <div className="text-xs font-semibold text-gray-500 uppercase mt-3 mb-1">{breed} ({list.length})</div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="text-left p-2">{t('halter_admin.th_order')}</th>
                  <th className="text-left p-2">{t('halter_admin.th_class')}</th>
                  <th className="text-left p-2">{t('halter_admin.th_code')}</th>
                  <th className="text-left p-2">{t('halter_admin.th_gender')}</th>
                  <th className="text-left p-2">{t('halter_admin.th_age')}</th>
                  <th className="text-left p-2">{t('halter_admin.th_type')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.ClassID} className="border-t">
                    <td className="p-2 text-gray-500">{c.DisplayOrder}</td>
                    <td className="p-2 font-medium">{c.ClassName}</td>
                    <td className="p-2 font-mono text-xs">{c.ClassCode}</td>
                    <td className="p-2">{c.Gender}</td>
                    <td className="p-2">{c.AgeGroup}</td>
                    <td className="p-2">{c.ClassType}</td>
                    <td className="p-2 text-right">
                      <button onClick={() => { setEditing(c); setAdding(false); }} className="text-xs text-gray-500 hover:text-gray-800 mr-2">{t('halter_admin.btn_edit')}</button>
                      <button onClick={() => remove(c)} className="text-xs text-red-500 hover:text-red-700">{t('halter_admin.btn_delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {classes.length === 0 && <div className="text-sm text-gray-500">{t('halter_admin.no_classes')}</div>}
    </div>
  );
}

function ClassForm({ initial, onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    ClassName: initial.ClassName || '', ClassCode: initial.ClassCode || '',
    ShornCode: initial.ShornCode || '', Breed: initial.Breed || 'Huacaya',
    Gender: initial.Gender || 'Female', AgeGroup: initial.AgeGroup || '',
    ClassType: initial.ClassType || 'Halter', DisplayOrder: initial.DisplayOrder || 0,
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><label className={lbl}>{t('halter_admin.lbl_class_name')}</label>
          <input required value={form.ClassName} onChange={set('ClassName')} className={inp} placeholder={t('halter_admin.placeholder_class_name')} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_class_code')}</label>
          <input value={form.ClassCode} onChange={set('ClassCode')} className={inp} placeholder={t('halter_admin.placeholder_class_code')} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_shorn_code')}</label>
          <input value={form.ShornCode} onChange={set('ShornCode')} className={inp} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_breed')}</label>
          <select value={form.Breed} onChange={set('Breed')} className={inp}>
            {BREEDS.map(b => <option key={b} value={b}>{t(`halter_admin.breed_${BREED_KEY_MAP[b]}`, { defaultValue: b })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('halter_admin.lbl_gender')}</label>
          <select value={form.Gender} onChange={set('Gender')} className={inp}>
            {GENDERS.map(g => <option key={g} value={g}>{t(`halter_admin.gender_${GENDER_KEY_MAP[g]}`, { defaultValue: g })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('halter_admin.lbl_age_group')}</label>
          <input value={form.AgeGroup} onChange={set('AgeGroup')} className={inp} placeholder={t('halter_admin.placeholder_age_group')} /></div>
        <div><label className={lbl}>{t('halter_admin.lbl_class_type')}</label>
          <select value={form.ClassType} onChange={set('ClassType')} className={inp}>
            {CLASS_TYPES.map(typ => <option key={typ} value={typ}>{t(`halter_admin.class_type_${CLASS_TYPE_KEY_MAP[typ]}`, { defaultValue: typ })}</option>)}
          </select></div>
        <div><label className={lbl}>{t('halter_admin.lbl_display_order')}</label>
          <input type="number" value={form.DisplayOrder} onChange={set('DisplayOrder')} className={inp} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className={btnGhost}>{t('halter_admin.btn_cancel')}</button>
        <button type="submit" className={btn}>{t('halter_admin.btn_save')}</button>
      </div>
    </form>
  );
}

function RegistrationsTab({ eventId }) {
  const { t } = useTranslation();
  const [regs, setRegs] = useState([]);
  const load = () => fetch(`${API}/api/events/${eventId}/halter/registrations`)
    .then(r => r.json()).then(setRegs);
  useEffect(() => { load(); }, [eventId]);

  const togglePaid = async (r) => {
    await fetch(`${API}/api/events/halter/registrations/${r.RegID}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...r, PaidStatus: r.PaidStatus === 'paid' ? 'pending' : 'paid' }),
    });
    load();
  };
  const toggleCheckin = async (r) => {
    await fetch(`${API}/api/events/halter/registrations/${r.RegID}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...r, IsCheckedIn: !r.IsCheckedIn }),
    });
    load();
  };

  const totalFee = regs.reduce((s, r) => s + Number(r.Fee || 0), 0);
  const byFarm = regs.reduce((acc, r) => {
    const key = r.BusinessName || `${r.FirstName || ''} ${r.LastName || ''}`.trim() || 'Unknown';
    (acc[key] ||= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">{t('halter_admin.stat_total_animals')}</div>
          <div className="font-bold text-gray-900">{regs.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">{t('halter_admin.stat_checked_in')}</div>
          <div className="font-bold text-gray-900">{regs.filter(r => r.IsCheckedIn).length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">{t('halter_admin.stat_paid')}</div>
          <div className="font-bold text-green-700">{regs.filter(r => r.PaidStatus === 'paid').length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">{t('halter_admin.stat_total_fees')}</div>
          <div className="font-bold text-[#3D6B34]">${totalFee.toFixed(2)}</div>
        </div>
      </div>

      {Object.entries(byFarm).map(([farm, list]) => (
        <div key={farm} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">{farm} ({list.length})</div>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 border-t">
              <tr>
                <th className="text-left p-2">{t('halter_admin.th_animal')}</th>
                <th className="text-left p-2">{t('halter_admin.th_type')}</th>
                <th className="text-left p-2">{t('halter_admin.th_classes')}</th>
                <th className="text-left p-2">{t('halter_admin.th_fee')}</th>
                <th className="text-center p-2">{t('halter_admin.th_checkin')}</th>
                <th className="text-center p-2">{t('halter_admin.th_paid')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r.RegID} className="border-t">
                  <td className="p-2">
                    <div className="font-medium">{r.AnimalName || t('halter_admin.animal_num', { n: r.AnimalID })}</div>
                    {r.RegisteredName && <div className="text-xs text-gray-500">{r.RegisteredName}</div>}
                  </td>
                  <td className="p-2">
                    <div>{r.RegistrationType}</div>
                    {r.IsShorn && <div className="text-xs text-gray-500">{t('halter_admin.label_shorn')}</div>}
                  </td>
                  <td className="p-2 text-xs">
                    {(r.classes || []).map(c => (
                      <div key={c.EntryID}>
                        {c.ClassName}
                        {c.Placement && <span className="ml-1 text-[#3D6B34] font-semibold">• {c.Placement}</span>}
                      </div>
                    ))}
                    {(r.classes || []).length === 0 && <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-2">${Number(r.Fee || 0).toFixed(2)}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => toggleCheckin(r)}
                      className={`text-[11px] px-2 py-0.5 rounded ${r.IsCheckedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {r.IsCheckedIn ? t('halter_admin.btn_checked_in') : t('halter_admin.btn_check_in')}
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    <button onClick={() => togglePaid(r)}
                      className={`text-[11px] px-2 py-0.5 rounded ${r.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.PaidStatus}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {regs.length === 0 && <div className="text-sm text-gray-500">{t('halter_admin.no_regs')}</div>}
    </div>
  );
}

function JudgingTab({ eventId }) {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/halter/classes`).then(r => r.json()).then(setClasses);
  }, [eventId]);
  const loadEntries = (cid) => {
    setSelected(cid);
    fetch(`${API}/api/events/${eventId}/halter/classes/${cid}/entries`).then(r => r.json()).then(setEntries);
  };
  const save = async (entry, patch) => {
    await fetch(`${API}/api/events/halter/entries/${entry.EntryID}/judge`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...entry, ...patch }),
    });
    loadEntries(selected);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('halter_admin.judging_classes_heading')}</div>
        <div className="bg-white border border-gray-200 rounded-lg max-h-[500px] overflow-y-auto">
          {classes.map(c => (
            <button key={c.ClassID} onClick={() => loadEntries(c.ClassID)}
              className={`w-full text-left px-3 py-2 text-sm border-b hover:bg-gray-50 ${selected === c.ClassID ? 'bg-[#3D6B34]/10 font-semibold' : ''}`}>
              <div>{c.ClassName}</div>
              <div className="text-xs text-gray-500">{c.Breed} · {c.ClassCode}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        {!selected && <div className="text-sm text-gray-500">{t('halter_admin.hint_select_class')}</div>}
        {selected && entries.length === 0 && <div className="text-sm text-gray-500">{t('halter_admin.hint_no_entries')}</div>}
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.EntryID} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium">{entry.AnimalName}</div>
                  <div className="text-xs text-gray-500">
                    {entry.BusinessName || `${entry.FirstName || ''} ${entry.LastName || ''}`.trim()}
                    {entry.IsShorn && t('halter_admin.label_shorn')}
                    {!entry.IsCheckedIn && <span className="text-red-500">{t('halter_admin.label_not_checked_in')}</span>}
                  </div>
                </div>
                <div className="w-48">
                  <select value={entry.Placement || ''}
                    onChange={(ev) => save(entry, { Placement: ev.target.value || null })} className={inp}>
                    {PLACEMENTS.map(p => (
                      <option key={p} value={p}>
                        {p ? t(`halter_admin.placement_${PLACEMENT_KEY_MAP[p]}`, { defaultValue: p }) : t('halter_admin.placement_none')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-2">
                <label className={lbl}>{t('halter_admin.lbl_judge_notes')}</label>
                <RichTextEditor value={entry.JudgeNotes || ''}
                  onChange={(v) => { if (v !== (entry.JudgeNotes || '')) save(entry, { JudgeNotes: v }); }}
                  minHeight={90} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HalterAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const BusinessID = params.get('BusinessID');
  const [tab, setTab] = useState(params.get('tab') || 'config');
  const [event, setEvent] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent);
  }, [eventId]);

  const tabs = [
    ['config', t('halter_admin.tab_config')],
    ['classes', t('halter_admin.tab_classes')],
    ['registrations', t('halter_admin.tab_registrations')],
    ['judging', t('halter_admin.tab_judging')],
  ];

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('halter_admin.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">{event?.EventName || 'Event'}</p>
          </div>
          <Link to={`/events/manage${BusinessID ? `?BusinessID=${BusinessID}` : ''}`}
            className="text-sm text-gray-500 hover:text-gray-700">{t('halter_admin.btn_back')}</Link>
        </div>

        <div className="flex gap-1 border-b border-gray-200 mb-5">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === k ? 'border-[#3D6B34] text-[#3D6B34]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'config' && <ConfigTab eventId={eventId} />}
        {tab === 'classes' && <ClassesTab eventId={eventId} />}
        {tab === 'registrations' && <RegistrationsTab eventId={eventId} />}
        {tab === 'judging' && <JudgingTab eventId={eventId} />}
      </div>
    </EventAdminLayout>
  );
}
