import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

const PLACEMENTS = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', 'Champion', 'Reserve Champion', 'Honorable Mention', 'Disqualified'];

const EMPTY_CONFIG = {
  Description: '',
  FeePerFleece: 0,
  DiscountFeePerFleece: '',
  DiscountStartDate: '',
  DiscountEndDate: '',
  RegistrationStartDate: '',
  RegistrationEndDate: '',
  MaxFleecesPerRegistrant: '',
  IsActive: true,
};

function d(val) { return val ? String(val).substring(0, 10) : ''; }

function ConfigTab({ eventId }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(EMPTY_CONFIG);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/fleece/config`)
      .then(r => r.json())
      .then(d_ => {
        if (d_?.configured) {
          setCfg({
            Description: d_.Description || '',
            FeePerFleece: d_.FeePerFleece || 0,
            DiscountFeePerFleece: d_.DiscountFeePerFleece ?? '',
            DiscountStartDate: d(d_.DiscountStartDate),
            DiscountEndDate: d(d_.DiscountEndDate),
            RegistrationStartDate: d(d_.RegistrationStartDate),
            RegistrationEndDate: d(d_.RegistrationEndDate),
            MaxFleecesPerRegistrant: d_.MaxFleecesPerRegistrant ?? '',
            IsActive: !!d_.IsActive,
          });
        }
      })
      .catch(() => {});
  }, [eventId]);

  const set = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value }));
  const setB = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.checked }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const r = await fetch(`${API}/api/events/${eventId}/fleece/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cfg,
          FeePerFleece: Number(cfg.FeePerFleece) || 0,
          DiscountFeePerFleece: cfg.DiscountFeePerFleece === '' ? null : Number(cfg.DiscountFeePerFleece),
          MaxFleecesPerRegistrant: cfg.MaxFleecesPerRegistrant === '' ? null : Number(cfg.MaxFleecesPerRegistrant),
        }),
      });
      if (!r.ok) throw new Error(t('fleece_admin.err_save_failed'));
      setMsg(t('fleece_admin.msg_saved'));
    } catch (ex) {
      setMsg(ex.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <label className={lbl}>{t('fleece_admin.lbl_show_desc')}</label>
        <RichTextEditor value={cfg.Description || ''}
          onChange={(v) => setCfg(c => ({ ...c, Description: v }))} minHeight={200} />
      </div>

      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('fleece_admin.section_fees')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>{t('fleece_admin.lbl_fee')}</label>
          <input type="number" step="0.01" value={cfg.FeePerFleece} onChange={set('FeePerFleece')} className={inp} />
        </div>
        <div>
          <label className={lbl}>{t('fleece_admin.lbl_discount_fee')}</label>
          <input type="number" step="0.01" value={cfg.DiscountFeePerFleece} onChange={set('DiscountFeePerFleece')} className={inp} placeholder={t('fleece_admin.placeholder_optional')} />
        </div>
        <div>
          <label className={lbl}>{t('fleece_admin.lbl_max_fleeces')}</label>
          <input type="number" min="1" value={cfg.MaxFleecesPerRegistrant} onChange={set('MaxFleecesPerRegistrant')} className={inp} placeholder={t('fleece_admin.placeholder_unlimited')} />
        </div>
      </div>

      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('fleece_admin.section_reg_window')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>{t('fleece_admin.lbl_reg_opens')}</label>
          <input type="date" value={cfg.RegistrationStartDate} onChange={set('RegistrationStartDate')} className={inp} />
        </div>
        <div>
          <label className={lbl}>{t('fleece_admin.lbl_reg_closes')}</label>
          <input type="date" value={cfg.RegistrationEndDate} onChange={set('RegistrationEndDate')} className={inp} />
        </div>
      </div>

      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('fleece_admin.section_discount_window')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>{t('fleece_admin.lbl_discount_starts')}</label>
          <input type="date" value={cfg.DiscountStartDate} onChange={set('DiscountStartDate')} className={inp} />
        </div>
        <div>
          <label className={lbl}>{t('fleece_admin.lbl_discount_ends')}</label>
          <input type="date" value={cfg.DiscountEndDate} onChange={set('DiscountEndDate')} className={inp} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={cfg.IsActive} onChange={setB('IsActive')} className="w-4 h-4 accent-green-600" />
        {t('fleece_admin.lbl_active')}
      </label>

      <div className="flex items-center justify-end gap-3 pt-2">
        {msg && <span className="text-sm text-gray-500 mr-auto">{msg}</span>}
        <button type="submit" disabled={saving} className="bg-[#3D6B34] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#2d5226] disabled:opacity-50">
          {saving ? t('fleece_admin.btn_saving') : t('fleece_admin.btn_save_config')}
        </button>
      </div>
    </form>
  );
}

function DivisionsTab({ eventId }) {
  const { t } = useTranslation();
  const [divs, setDivs] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const EMPTY_DIV = { DivisionName: '', BreedGroup: '', AgeGroup: '', Description: '', DisplayOrder: 0 };
  const [draft, setDraft] = useState(EMPTY_DIV);

  const load = () => fetch(`${API}/api/events/${eventId}/fleece/divisions`).then(r => r.json()).then(setDivs).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const save = async () => {
    if (!draft.DivisionName) return;
    const url = editingId
      ? `${API}/api/events/fleece/divisions/${editingId}`
      : `${API}/api/events/${eventId}/fleece/divisions`;
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
    setDraft(EMPTY_DIV);
    setAdding(false);
    setEditingId(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm(t('fleece_admin.confirm_delete_div'))) return;
    await fetch(`${API}/api/events/fleece/divisions/${id}`, { method: 'DELETE' });
    load();
  };

  const startEdit = (d_) => {
    setEditingId(d_.DivisionID);
    setDraft({
      DivisionName: d_.DivisionName,
      BreedGroup: d_.BreedGroup || '',
      AgeGroup: d_.AgeGroup || '',
      Description: d_.Description || '',
      DisplayOrder: d_.DisplayOrder || 0,
    });
    setAdding(true);
  };

  const seedDefaults = async () => {
    if (!confirm(t('fleece_admin.confirm_seed'))) return;
    const r = await fetch(`${API}/api/events/${eventId}/fleece/divisions/bulk-seed`, { method: 'POST' });
    if (r.ok) load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">{t('fleece_admin.divisions_desc')}</p>
        <div className="flex gap-2">
          {divs.length === 0 && (
            <button onClick={seedDefaults} className="text-sm border border-[#3D6B34] text-[#3D6B34] px-4 py-1.5 rounded-lg hover:bg-green-50">
              {t('fleece_admin.btn_seed_defaults')}
            </button>
          )}
          {!adding && (
            <button onClick={() => setAdding(true)} className="text-sm bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg hover:bg-[#2d5226]">
              {t('fleece_admin.btn_add_div')}
            </button>
          )}
        </div>
      </div>

      {adding && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={lbl}>{t('fleece_admin.lbl_div_name')}</label>
              <input value={draft.DivisionName} onChange={e => setDraft(d => ({ ...d, DivisionName: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className={lbl}>{t('fleece_admin.lbl_breed_group')}</label>
              <input value={draft.BreedGroup} onChange={e => setDraft(d => ({ ...d, BreedGroup: e.target.value }))} className={inp} placeholder={t('fleece_admin.placeholder_breed_group')} />
            </div>
            <div>
              <label className={lbl}>{t('fleece_admin.lbl_age_group')}</label>
              <input value={draft.AgeGroup} onChange={e => setDraft(d => ({ ...d, AgeGroup: e.target.value }))} className={inp} placeholder={t('fleece_admin.placeholder_age_group')} />
            </div>
          </div>
          <div>
            <label className={lbl}>{t('fleece_admin.lbl_div_desc')}</label>
            <RichTextEditor value={draft.Description || ''}
              onChange={(v) => setDraft(d => ({ ...d, Description: v }))} minHeight={110} />
          </div>
          <div>
            <label className={lbl}>{t('fleece_admin.lbl_display_order')}</label>
            <input type="number" value={draft.DisplayOrder} onChange={e => setDraft(d => ({ ...d, DisplayOrder: Number(e.target.value) || 0 }))} className={`${inp} w-28`} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setAdding(false); setEditingId(null); setDraft(EMPTY_DIV); }} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg">{t('fleece_admin.btn_cancel')}</button>
            <button onClick={save} className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg">{editingId ? t('fleece_admin.btn_update') : t('fleece_admin.btn_add')}</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {divs.length === 0 && <div className="text-sm text-gray-500">{t('fleece_admin.no_divs')}</div>}
        {divs.map(d_ => (
          <div key={d_.DivisionID} className="flex items-start justify-between bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{d_.DivisionName}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {d_.BreedGroup && `${t('fleece_admin.breed_prefix')} ${d_.BreedGroup}`}
                {d_.BreedGroup && d_.AgeGroup && ' • '}
                {d_.AgeGroup && `${t('fleece_admin.age_prefix')} ${d_.AgeGroup}`}
              </div>
              {d_.Description && <div className="text-xs text-gray-500 mt-0.5">{d_.Description}</div>}
              <div className="text-[11px] text-gray-400 mt-1">{t('fleece_admin.order_label', { n: d_.DisplayOrder })}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(d_)} className="text-xs text-gray-500 hover:text-gray-800">{t('fleece_admin.btn_edit')}</button>
              <button onClick={() => remove(d_.DivisionID)} className="text-xs text-red-500 hover:text-red-700">{t('fleece_admin.btn_delete')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntriesTab({ eventId }) {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);

  const load = () => fetch(`${API}/api/events/${eventId}/fleece/entries`)
    .then(r => r.json()).then(setEntries).catch(() => setEntries([]));
  useEffect(() => { load(); }, [eventId]);

  const togglePaid = async (entry) => {
    const next = entry.PaidStatus === 'paid' ? 'pending' : 'paid';
    await fetch(`${API}/api/events/fleece/entries/${entry.EntryID}/paid`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ PaidStatus: next }),
    });
    load();
  };

  const totalFee = entries.reduce((s, entry) => s + Number(entry.EntryFee || 0), 0);
  const byFarm = entries.reduce((acc, entry) => {
    const key = entry.BusinessName || [entry.PeopleFirstName, entry.PeopleLastName].filter(Boolean).join(' ') || 'Unknown';
    (acc[key] ||= []).push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">{t('fleece_admin.stat_total')}</div>
          <div className="font-bold text-gray-900">{entries.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">{t('fleece_admin.stat_paid')}</div>
          <div className="font-bold text-green-700">{entries.filter(entry => entry.PaidStatus === 'paid').length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">{t('fleece_admin.stat_fees')}</div>
          <div className="font-bold text-[#3D6B34]">${totalFee.toFixed(2)}</div>
        </div>
      </div>

      {entries.length === 0 && <div className="text-sm text-gray-500">{t('fleece_admin.no_entries')}</div>}

      {Object.entries(byFarm).map(([farm, list]) => (
        <div key={farm} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">{farm} ({list.length})</div>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 border-t">
              <tr>
                <th className="text-left p-2">{t('fleece_admin.col_animal')}</th>
                <th className="text-left p-2">{t('fleece_admin.col_breed')}</th>
                <th className="text-left p-2">{t('fleece_admin.col_color')}</th>
                <th className="text-right p-2">{t('fleece_admin.col_fee')}</th>
                <th className="text-center p-2">{t('fleece_admin.col_paid')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map(entry => (
                <tr key={entry.EntryID} className="border-t">
                  <td className="p-2 font-medium">{entry.AnimalName || entry.FleeceName || t('fleece_admin.fleece_num', { n: entry.EntryID })}</td>
                  <td className="p-2">{entry.Breed || '—'}</td>
                  <td className="p-2">{entry.Color || '—'}</td>
                  <td className="p-2 text-right">${Number(entry.EntryFee || 0).toFixed(2)}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => togglePaid(entry)}
                      className={`text-[11px] px-2 py-0.5 rounded ${entry.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {entry.PaidStatus || t('fleece_admin.status_pending')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function JudgingTab({ eventId }) {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [judgingId, setJudgingId] = useState(null);
  const [draft, setDraft] = useState({ Placement: '', JudgeNotes: '', Score: '' });

  const load = () => fetch(`${API}/api/events/${eventId}/fleece/entries`)
    .then(r => r.json()).then(setEntries).catch(() => setEntries([]));
  useEffect(() => { load(); }, [eventId]);

  const start = (entry) => {
    setJudgingId(entry.EntryID);
    setDraft({ Placement: entry.Placement || '', JudgeNotes: entry.JudgeNotes || '', Score: entry.Score ?? '' });
  };

  const save = async () => {
    await fetch(`${API}/api/events/fleece/entries/${judgingId}/judge`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...draft,
        Score: draft.Score === '' ? null : Number(draft.Score),
      }),
    });
    setJudgingId(null);
    load();
  };

  return (
    <div className="space-y-2">
      {entries.length === 0 && <div className="text-sm text-gray-500">{t('fleece_admin.no_entries_judge')}</div>}
      {entries.map(entry => (
        <div key={entry.EntryID} className="bg-white border border-gray-200 rounded-lg p-3">
          {judgingId === entry.EntryID ? (
            <div className="space-y-3">
              <div className="font-medium">{entry.AnimalName || entry.FleeceName || t('fleece_admin.fleece_num', { n: entry.EntryID })}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>{t('fleece_admin.lbl_placement')}</label>
                  <select value={draft.Placement} onChange={ev => setDraft(d => ({ ...d, Placement: ev.target.value }))} className={inp}>
                    {PLACEMENTS.map(p => <option key={p} value={p}>{p || t('fleece_admin.placement_none')}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>{t('fleece_admin.lbl_score')}</label>
                  <input type="number" step="0.01" value={draft.Score} onChange={ev => setDraft(d => ({ ...d, Score: ev.target.value }))} className={inp} />
                </div>
              </div>
              <div>
                <label className={lbl}>{t('fleece_admin.lbl_judge_notes')}</label>
                <RichTextEditor value={draft.JudgeNotes || ''}
                  onChange={(v) => setDraft(d => ({ ...d, JudgeNotes: v }))} minHeight={130} />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setJudgingId(null)} className="px-3 py-1 text-sm border border-gray-300 rounded-lg">{t('fleece_admin.btn_cancel')}</button>
                <button onClick={save} className="px-3 py-1 text-sm bg-[#3D6B34] text-white rounded-lg">{t('fleece_admin.btn_save')}</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{entry.AnimalName || entry.FleeceName || t('fleece_admin.fleece_num', { n: entry.EntryID })}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {[entry.PeopleFirstName, entry.PeopleLastName].filter(Boolean).join(' ')}
                  {entry.BusinessName && ` • ${entry.BusinessName}`}
                  {entry.Breed && ` • ${entry.Breed}`}
                  {entry.Color && ` • ${entry.Color}`}
                </div>
                {entry.Placement && <div className="text-xs font-semibold text-[#3D6B34] mt-1">🏆 {entry.Placement}{entry.Score != null && ` • ${t('fleece_admin.score_label', { n: entry.Score })}`}</div>}
                {entry.JudgeNotes && <div className="text-xs italic text-gray-500 mt-0.5">{t('fleece_admin.judge_prefix')} {entry.JudgeNotes}</div>}
              </div>
              <button onClick={() => start(entry)} className="text-xs text-blue-600 hover:text-blue-800 shrink-0">{t('fleece_admin.btn_judge')}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FleeceAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const BusinessID = params.get('BusinessID');
  const [tab, setTab] = useState(params.get('tab') || 'config');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
  }, [eventId]);

  const TABS = [
    ['config', t('fleece_admin.tab_config')],
    ['divisions', t('fleece_admin.tab_divisions')],
    ['entries', t('fleece_admin.tab_entries')],
    ['judging', t('fleece_admin.tab_judging')],
  ];

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('fleece_admin.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {event?.EventName || 'Event'} — {t('fleece_admin.admin_console_suffix')}
            </p>
          </div>
          <Link to={`/events/manage?BusinessID=${BusinessID || ''}`} className="text-sm text-gray-500 hover:text-gray-700">
            {t('fleece_admin.btn_back')}
          </Link>
        </div>

        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === id ? 'border-[#3D6B34] text-[#3D6B34]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'config' && <ConfigTab eventId={eventId} />}
        {tab === 'divisions' && <DivisionsTab eventId={eventId} />}
        {tab === 'entries' && <EntriesTab eventId={eventId} />}
        {tab === 'judging' && <JudgingTab eventId={eventId} />}
      </div>
    </EventAdminLayout>
  );
}
