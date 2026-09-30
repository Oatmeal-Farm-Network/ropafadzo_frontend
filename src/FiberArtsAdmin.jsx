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
  FeePerEntry: 0,
  DiscountFeePerEntry: '',
  DiscountEndDate: '',
  MaxEntriesPerRegistrant: '',
  MaxEntriesTotal: '',
  RegistrationEndDate: '',
  IsActive: true,
};

function d(val) { return val ? String(val).substring(0, 10) : ''; }

function ConfigTab({ eventId }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(EMPTY_CONFIG);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/fiber-arts/config`)
      .then(r => r.json())
      .then(d_ => {
        if (d_?.configured) {
          setCfg({
            Description: d_.Description || '',
            FeePerEntry: d_.FeePerEntry || 0,
            DiscountFeePerEntry: d_.DiscountFeePerEntry ?? '',
            DiscountEndDate: d(d_.DiscountEndDate),
            MaxEntriesPerRegistrant: d_.MaxEntriesPerRegistrant ?? '',
            MaxEntriesTotal: d_.MaxEntriesTotal ?? '',
            RegistrationEndDate: d(d_.RegistrationEndDate),
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
      const r = await fetch(`${API}/api/events/${eventId}/fiber-arts/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cfg,
          FeePerEntry: Number(cfg.FeePerEntry) || 0,
          DiscountFeePerEntry: cfg.DiscountFeePerEntry === '' ? null : Number(cfg.DiscountFeePerEntry),
          MaxEntriesPerRegistrant: cfg.MaxEntriesPerRegistrant === '' ? null : Number(cfg.MaxEntriesPerRegistrant),
          MaxEntriesTotal: cfg.MaxEntriesTotal === '' ? null : Number(cfg.MaxEntriesTotal),
        }),
      });
      if (!r.ok) throw new Error(t('fiber_arts_admin.save_failed'));
      setMsg(t('fiber_arts_admin.saved'));
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
        <label className={lbl}>{t('fiber_arts_admin.lbl_description')}</label>
        <RichTextEditor value={cfg.Description || ''}
          onChange={(v) => setCfg(c => ({ ...c, Description: v }))} minHeight={200} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>{t('fiber_arts_admin.lbl_fee')}</label>
          <input type="number" step="0.01" value={cfg.FeePerEntry} onChange={set('FeePerEntry')} className={inp} />
        </div>
        <div>
          <label className={lbl}>{t('fiber_arts_admin.lbl_discount_fee')}</label>
          <input type="number" step="0.01" value={cfg.DiscountFeePerEntry} onChange={set('DiscountFeePerEntry')} className={inp} placeholder={t('fiber_arts_admin.placeholder_optional')} />
        </div>
        <div>
          <label className={lbl}>{t('fiber_arts_admin.lbl_discount_ends')}</label>
          <input type="date" value={cfg.DiscountEndDate} onChange={set('DiscountEndDate')} className={inp} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>{t('fiber_arts_admin.lbl_max_per_registrant')}</label>
          <input type="number" min="1" value={cfg.MaxEntriesPerRegistrant} onChange={set('MaxEntriesPerRegistrant')} className={inp} placeholder={t('fiber_arts_admin.placeholder_unlimited')} />
        </div>
        <div>
          <label className={lbl}>{t('fiber_arts_admin.lbl_max_total')}</label>
          <input type="number" min="1" value={cfg.MaxEntriesTotal} onChange={set('MaxEntriesTotal')} className={inp} placeholder={t('fiber_arts_admin.placeholder_unlimited')} />
        </div>
        <div>
          <label className={lbl}>{t('fiber_arts_admin.lbl_reg_closes')}</label>
          <input type="date" value={cfg.RegistrationEndDate} onChange={set('RegistrationEndDate')} className={inp} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={cfg.IsActive} onChange={setB('IsActive')} className="w-4 h-4 accent-green-600" />
        {t('fiber_arts_admin.lbl_active')}
      </label>
      <div className="flex items-center justify-end gap-3 pt-2">
        {msg && <span className="text-sm text-gray-500 mr-auto">{msg}</span>}
        <button type="submit" disabled={saving} className="bg-[#3D6B34] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#2d5226] disabled:opacity-50">
          {saving ? t('fiber_arts_admin.btn_saving') : t('fiber_arts_admin.btn_save')}
        </button>
      </div>
    </form>
  );
}

function CategoriesTab({ eventId }) {
  const { t } = useTranslation();
  const [cats, setCats] = useState([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ CategoryName: '', CategoryDescription: '', DisplayOrder: 0 });
  const [editingId, setEditingId] = useState(null);

  const load = () => fetch(`${API}/api/events/${eventId}/fiber-arts/categories`).then(r => r.json()).then(setCats).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const save = async () => {
    if (!draft.CategoryName) return;
    const url = editingId
      ? `${API}/api/events/fiber-arts/categories/${editingId}`
      : `${API}/api/events/${eventId}/fiber-arts/categories`;
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
    setDraft({ CategoryName: '', CategoryDescription: '', DisplayOrder: 0 });
    setAdding(false);
    setEditingId(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm(t('fiber_arts_admin.confirm_delete_cat'))) return;
    await fetch(`${API}/api/events/fiber-arts/categories/${id}`, { method: 'DELETE' });
    load();
  };

  const startEdit = (c) => {
    setEditingId(c.CategoryID);
    setDraft({ CategoryName: c.CategoryName, CategoryDescription: c.CategoryDescription || '', DisplayOrder: c.DisplayOrder || 0 });
    setAdding(true);
  };

  const seedDefaults = async () => {
    if (!confirm(t('fiber_arts_admin.confirm_seed'))) return;
    const r = await fetch(`${API}/api/events/${eventId}/fiber-arts/categories/bulk-seed`, { method: 'POST' });
    if (r.ok) load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">{t('fiber_arts_admin.cat_desc')}</p>
        <div className="flex gap-2">
          {cats.length === 0 && (
            <button onClick={seedDefaults} className="text-sm border border-[#3D6B34] text-[#3D6B34] px-4 py-1.5 rounded-lg hover:bg-green-50">
              {t('fiber_arts_admin.btn_seed')}
            </button>
          )}
          {!adding && (
            <button onClick={() => setAdding(true)} className="text-sm bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg hover:bg-[#2d5226]">
              {t('fiber_arts_admin.btn_add_cat')}
            </button>
          )}
        </div>
      </div>

      {adding && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
          <div>
            <label className={lbl}>{t('fiber_arts_admin.lbl_cat_name')}</label>
            <input value={draft.CategoryName} onChange={e => setDraft(d => ({ ...d, CategoryName: e.target.value }))} className={inp} />
          </div>
          <div>
            <label className={lbl}>{t('fiber_arts_admin.lbl_cat_desc')}</label>
            <RichTextEditor value={draft.CategoryDescription || ''}
              onChange={(v) => setDraft(d => ({ ...d, CategoryDescription: v }))} minHeight={110} />
          </div>
          <div>
            <label className={lbl}>{t('fiber_arts_admin.lbl_display_order')}</label>
            <input type="number" value={draft.DisplayOrder} onChange={e => setDraft(d => ({ ...d, DisplayOrder: Number(e.target.value) || 0 }))} className={`${inp} w-28`} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setAdding(false); setEditingId(null); setDraft({ CategoryName: '', CategoryDescription: '', DisplayOrder: 0 }); }} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg">{t('fiber_arts_admin.btn_cancel')}</button>
            <button onClick={save} className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg">{editingId ? t('fiber_arts_admin.btn_update') : t('fiber_arts_admin.btn_add')}</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {cats.length === 0 && <div className="text-sm text-gray-500">{t('fiber_arts_admin.no_categories')}</div>}
        {cats.map(c => (
          <div key={c.CategoryID} className="flex items-start justify-between bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{c.CategoryName}</div>
              {c.CategoryDescription && <div className="text-xs text-gray-500 mt-0.5">{c.CategoryDescription}</div>}
              <div className="text-[11px] text-gray-400 mt-1">{t('fiber_arts_admin.order_label', { n: c.DisplayOrder })}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(c)} className="text-xs text-gray-500 hover:text-gray-800">{t('fiber_arts_admin.btn_edit')}</button>
              <button onClick={() => remove(c.CategoryID)} className="text-xs text-red-500 hover:text-red-700">{t('fiber_arts_admin.btn_delete')}</button>
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
  const [judgingId, setJudgingId] = useState(null);
  const [judgeDraft, setJudgeDraft] = useState({ Placement: '', JudgeNotes: '' });

  const load = () => fetch(`${API}/api/events/${eventId}/fiber-arts/entries`).then(r => r.json()).then(setEntries).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const startJudge = (e) => {
    setJudgingId(e.EntryID);
    setJudgeDraft({ Placement: e.Placement || '', JudgeNotes: e.JudgeNotes || '' });
  };

  const saveJudge = async () => {
    await fetch(`${API}/api/events/fiber-arts/entries/${judgingId}/judge`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(judgeDraft),
    });
    setJudgingId(null);
    load();
  };

  const togglePaid = async (e) => {
    const next = e.PaidStatus === 'paid' ? 'pending' : 'paid';
    await fetch(`${API}/api/events/fiber-arts/entries/${e.EntryID}/paid`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ PaidStatus: next }),
    });
    load();
  };

  const byCat = entries.reduce((acc, e) => {
    const key = e.CategoryName || t('fiber_arts_admin.uncategorized');
    (acc[key] ||= []).push(e);
    return acc;
  }, {});

  const registrantCount = new Set(entries.map(e => e.PeopleID)).size;

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        {t('fiber_arts_admin.entry_summary', {
          count: entries.length,
          noun: entries.length === 1 ? t('fiber_arts_admin.entry_singular') : t('fiber_arts_admin.entry_plural'),
          registrants: registrantCount,
        })}
      </div>
      {Object.entries(byCat).map(([cat, list]) => (
        <div key={cat} className="mb-6">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">{cat}</h3>
          <div className="space-y-2">
            {list.map(e => (
              <div key={e.EntryID} className="bg-white border border-gray-200 rounded-lg p-3">
                {judgingId === e.EntryID ? (
                  <div className="space-y-3">
                    <div className="font-medium">{e.EntryTitle}</div>
                    <div>
                      <label className={lbl}>{t('fiber_arts_admin.lbl_placement')}</label>
                      <select value={judgeDraft.Placement} onChange={ev => setJudgeDraft(d => ({ ...d, Placement: ev.target.value }))} className={inp}>
                        {PLACEMENTS.map(p => <option key={p} value={p}>{p || t('fiber_arts_admin.placement_none')}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>{t('fiber_arts_admin.lbl_judge_notes')}</label>
                      <RichTextEditor value={judgeDraft.JudgeNotes || ''}
                        onChange={(v) => setJudgeDraft(d => ({ ...d, JudgeNotes: v }))} minHeight={130} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setJudgingId(null)} className="px-3 py-1 text-sm border border-gray-300 rounded-lg">{t('fiber_arts_admin.btn_cancel_judge')}</button>
                      <button onClick={saveJudge} className="px-3 py-1 text-sm bg-[#3D6B34] text-white rounded-lg">{t('fiber_arts_admin.btn_save_judge')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{e.EntryTitle}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {[e.PeopleFirstName, e.PeopleLastName].filter(Boolean).join(' ')}
                        {e.BusinessName && ` • ${e.BusinessName}`}
                        {e.FiberType && ` • ${e.FiberType}`}
                      </div>
                      {e.Description && <div className="text-xs text-gray-600 mt-1">{e.Description}</div>}
                      {e.Placement && <div className="text-xs font-semibold text-[#3D6B34] mt-1">🏆 {e.Placement}</div>}
                      {e.JudgeNotes && <div className="text-xs italic text-gray-500 mt-0.5">{t('fiber_arts_admin.judge_label')} {e.JudgeNotes}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs text-gray-600">${Number(e.EntryFee || 0).toFixed(2)}</div>
                      <button onClick={() => togglePaid(e)} className={`text-[11px] px-2 py-0.5 rounded ${e.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {e.PaidStatus || 'pending'}
                      </button>
                      <button onClick={() => startJudge(e)} className="text-xs text-blue-600 hover:text-blue-800">{t('fiber_arts_admin.btn_judge')}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FiberArtsAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const BusinessID = params.get('BusinessID');
  const [tab, setTab] = useState(params.get('tab') || 'config');
  const [event, setEvent] = useState(null);

  const TABS = [
    { id: 'config', label: t('fiber_arts_admin.tab_config') },
    { id: 'categories', label: t('fiber_arts_admin.tab_categories') },
    { id: 'entries', label: t('fiber_arts_admin.tab_entries') },
  ];

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
  }, [eventId]);

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('fiber_arts_admin.heading')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {event?.EventName || 'Event'} — {t('fiber_arts_admin.subheading')}
            </p>
          </div>
          <Link to={`/events/manage?BusinessID=${BusinessID || ''}`} className="text-sm text-gray-500 hover:text-gray-700">
            {t('fiber_arts_admin.btn_back')}
          </Link>
        </div>

        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {TABS.map(tab_ => (
            <button
              key={tab_.id}
              onClick={() => setTab(tab_.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === tab_.id ? 'border-[#3D6B34] text-[#3D6B34]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab_.label}
            </button>
          ))}
        </div>

        {tab === 'config' && <ConfigTab eventId={eventId} />}
        {tab === 'categories' && <CategoriesTab eventId={eventId} />}
        {tab === 'entries' && <EntriesTab eventId={eventId} />}
      </div>
    </EventAdminLayout>
  );
}
