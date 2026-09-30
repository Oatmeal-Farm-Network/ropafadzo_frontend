import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
function d(v) { return v ? String(v).substring(0, 10) : ''; }

function ConfigTab({ eventId }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState({
    Description: '', EntryFee: 0, SpectatorFee: 0, EntryDeadline: '',
    MaxEntriesPerPerson: '', JudgingStyle: 'rubric', DropHighLow: false,
    PublishLeaderboard: true, AwardTiers: '', RulesText: '', IsActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/competition/config`).then(r => r.json()).then(x => {
      if (x) setCfg({
        Description: x.Description || '',
        EntryFee: x.EntryFee ?? 0,
        SpectatorFee: x.SpectatorFee ?? 0,
        EntryDeadline: d(x.EntryDeadline),
        MaxEntriesPerPerson: x.MaxEntriesPerPerson ?? '',
        JudgingStyle: x.JudgingStyle || 'rubric',
        DropHighLow: !!x.DropHighLow,
        PublishLeaderboard: x.PublishLeaderboard !== false,
        AwardTiers: x.AwardTiers || '',
        RulesText: x.RulesText || '',
        IsActive: x.IsActive !== false,
      });
    }).catch(() => {});
  }, [eventId]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      const r = await fetch(`${API}/api/events/${eventId}/competition/config`, {
        method: 'PUT', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...cfg,
          EntryFee: Number(cfg.EntryFee) || 0,
          SpectatorFee: Number(cfg.SpectatorFee) || 0,
          MaxEntriesPerPerson: cfg.MaxEntriesPerPerson === '' ? null : Number(cfg.MaxEntriesPerPerson),
        }),
      });
      if (!r.ok) throw new Error('Save failed');
      setMsg(t('competition_admin.msg_saved'));
    } catch (ex) { setMsg(ex.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  };

  const set = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value }));
  const setB = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.checked }));

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <label className={lbl}>{t('competition_admin.lbl_description')}</label>
        <RichTextEditor value={cfg.Description || ''}
          onChange={(v) => setCfg(c => ({ ...c, Description: v }))} minHeight={140} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className={lbl}>{t('competition_admin.lbl_entry_fee')}</label>
          <input className={inp} type="number" step="0.01" value={cfg.EntryFee} onChange={set('EntryFee')} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_spectator_fee')}</label>
          <input className={inp} type="number" step="0.01" value={cfg.SpectatorFee} onChange={set('SpectatorFee')} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_entry_deadline')}</label>
          <input className={inp} type="date" value={cfg.EntryDeadline} onChange={set('EntryDeadline')} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_max_entries_per_person')}</label>
          <input className={inp} type="number" value={cfg.MaxEntriesPerPerson} onChange={set('MaxEntriesPerPerson')} />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="font-medium text-sm text-[#3D6B34]">{t('competition_admin.section_judging')}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={lbl}>{t('competition_admin.lbl_style')}</label>
            <select className={inp} value={cfg.JudgingStyle} onChange={set('JudgingStyle')}>
              <option value="rubric">{t('competition_admin.style_rubric')}</option>
              <option value="placement">{t('competition_admin.style_placement')}</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm pb-2">
              <input type="checkbox" checked={!!cfg.DropHighLow} onChange={setB('DropHighLow')} />
              <span>{t('competition_admin.lbl_drop_high_low')}</span>
            </label>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!cfg.PublishLeaderboard} onChange={setB('PublishLeaderboard')} />
          <span>{t('competition_admin.lbl_publish_leaderboard')}</span>
        </label>
      </div>

      <div>
        <label className={lbl}>{t('competition_admin.lbl_award_tiers')}</label>
        <textarea className={inp} rows={2} value={cfg.AwardTiers} onChange={set('AwardTiers')} />
      </div>
      <div>
        <label className={lbl}>{t('competition_admin.lbl_rules')}</label>
        <RichTextEditor value={cfg.RulesText || ''}
          onChange={(v) => setCfg(c => ({ ...c, RulesText: v }))} minHeight={140} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!cfg.IsActive} onChange={setB('IsActive')} />
        <span>{t('competition_admin.lbl_is_active')}</span>
      </label>

      <div className="flex items-center gap-3 justify-end">
        {msg && <span className="text-sm text-[#3D6B34] mr-auto">{msg}</span>}
        <Link to="/account/events" className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">{t('competition_admin.btn_cancel')}</Link>
        <button type="submit" disabled={saving}
          className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50">
          {saving ? t('competition_admin.btn_saving') : t('competition_admin.btn_save_config')}
        </button>
      </div>
    </form>
  );
}

function CategoriesTab({ eventId }) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [criteriaByCat, setCriteriaByCat] = useState({});
  const [catForm, setCatForm] = useState({});
  const [critForm, setCritForm] = useState({});

  const loadCats = () => fetch(`${API}/api/events/${eventId}/competition/categories`)
    .then(r => r.json()).then(async cats => {
      setCategories(cats || []);
      const map = {};
      for (const c of (cats || [])) {
        const res = await fetch(`${API}/api/events/competition/categories/${c.CategoryID}/criteria`).then(r => r.json());
        map[c.CategoryID] = res || [];
      }
      setCriteriaByCat(map);
    }).catch(() => {});
  useEffect(() => { loadCats(); }, [eventId]);

  const saveCategory = async (e) => {
    e.preventDefault();
    if (!catForm.CategoryName) return;
    const editing = catForm.CategoryID;
    const url = editing
      ? `${API}/api/events/competition/categories/${editing}`
      : `${API}/api/events/${eventId}/competition/categories`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ ...catForm, MaxEntries: catForm.MaxEntries ? Number(catForm.MaxEntries) : null }),
    });
    setCatForm({}); loadCats();
  };
  const deleteCategory = async (c) => {
    if (!confirm(t('competition_admin.confirm_delete_category', { name: c.CategoryName }))) return;
    await fetch(`${API}/api/events/competition/categories/${c.CategoryID}`, { method: 'DELETE' });
    loadCats();
  };

  const saveCriterion = async (categoryId) => {
    const f = critForm[categoryId] || {};
    if (!f.CriterionName) return;
    const editing = f.CriterionID;
    const url = editing
      ? `${API}/api/events/competition/criteria/${editing}`
      : `${API}/api/events/competition/categories/${categoryId}/criteria`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...f,
        MaxPoints: Number(f.MaxPoints) || 10,
        Weight: Number(f.Weight) || 1,
      }),
    });
    setCritForm(s => ({ ...s, [categoryId]: {} }));
    loadCats();
  };
  const deleteCriterion = async (categoryId, crit) => {
    if (!confirm(t('competition_admin.confirm_delete_criterion', { name: crit.CriterionName }))) return;
    await fetch(`${API}/api/events/competition/criteria/${crit.CriterionID}`, { method: 'DELETE' });
    loadCats();
  };

  return (
    <div className="space-y-5">
      <form onSubmit={saveCategory} className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-2">
          <label className={lbl}>{t('competition_admin.lbl_category_name')}</label>
          <input className={inp} required value={catForm.CategoryName || ''}
            onChange={e => setCatForm(s => ({ ...s, CategoryName: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_max_entries')}</label>
          <input className={inp} type="number" value={catForm.MaxEntries || ''}
            onChange={e => setCatForm(s => ({ ...s, MaxEntries: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-2">
          {catForm.CategoryID && (
            <button type="button" onClick={() => setCatForm({})} className="text-sm px-4 py-2 rounded-lg border border-gray-300">{t('competition_admin.btn_cancel')}</button>
          )}
          <button type="submit" className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-4 py-2 rounded-lg">
            {catForm.CategoryID ? t('competition_admin.btn_save_category') : t('competition_admin.btn_add_category')}
          </button>
        </div>
      </form>

      {categories.map(cat => {
        const rubric = criteriaByCat[cat.CategoryID] || [];
        const f = critForm[cat.CategoryID] || {};
        return (
          <div key={cat.CategoryID} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-sm text-[#3D6B34]">{cat.CategoryName}</div>
                {cat.MaxEntries && <div className="text-xs text-gray-500">{t('competition_admin.max_entries_label', { n: cat.MaxEntries })}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCatForm(cat)} className="text-xs text-[#3D6B34] hover:underline">{t('competition_admin.btn_edit')}</button>
                <button onClick={() => deleteCategory(cat)} className="text-xs text-red-600 hover:underline">{t('competition_admin.btn_delete')}</button>
              </div>
            </div>

            <div className="text-xs uppercase text-gray-500 mb-2">{t('competition_admin.section_rubric')}</div>
            <div className="space-y-1 mb-3">
              {rubric.length === 0 && <div className="text-xs text-gray-400">{t('competition_admin.criteria_empty')}</div>}
              {rubric.map(c => (
                <div key={c.CriterionID} className="flex items-center gap-2 text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{c.CriterionName}</span>
                    <span className="text-xs text-gray-500 ml-2">{t('competition_admin.criterion_meta', { pts: c.MaxPoints, w: c.Weight })}</span>
                  </div>
                  <button onClick={() => setCritForm(s => ({ ...s, [cat.CategoryID]: c }))}
                    className="text-xs text-[#3D6B34] hover:underline">{t('competition_admin.btn_edit')}</button>
                  <button onClick={() => deleteCriterion(cat.CategoryID, c)}
                    className="text-xs text-red-600 hover:underline">{t('competition_admin.btn_delete')}</button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div className="md:col-span-2">
                <label className={lbl}>{t('competition_admin.lbl_criterion')}</label>
                <input className={inp} value={f.CriterionName || ''}
                  onChange={e => setCritForm(s => ({ ...s, [cat.CategoryID]: { ...(s[cat.CategoryID] || {}), CriterionName: e.target.value } }))} />
              </div>
              <div>
                <label className={lbl}>{t('competition_admin.lbl_max_points')}</label>
                <input className={inp} type="number" step="0.01" value={f.MaxPoints ?? 10}
                  onChange={e => setCritForm(s => ({ ...s, [cat.CategoryID]: { ...(s[cat.CategoryID] || {}), MaxPoints: e.target.value } }))} />
              </div>
              <div>
                <label className={lbl}>{t('competition_admin.lbl_weight')}</label>
                <input className={inp} type="number" step="0.01" value={f.Weight ?? 1}
                  onChange={e => setCritForm(s => ({ ...s, [cat.CategoryID]: { ...(s[cat.CategoryID] || {}), Weight: e.target.value } }))} />
              </div>
              <div className="md:col-span-4 flex gap-2">
                <button type="button" onClick={() => saveCriterion(cat.CategoryID)}
                  className="text-xs bg-[#3D6B34] hover:bg-[#2D5228] text-white px-3 py-1.5 rounded">
                  {f.CriterionID ? t('competition_admin.btn_save_criterion') : t('competition_admin.btn_add_criterion')}
                </button>
                {f.CriterionID && (
                  <button type="button" onClick={() => setCritForm(s => ({ ...s, [cat.CategoryID]: {} }))}
                    className="text-xs px-3 py-1.5 rounded border border-gray-300">{t('competition_admin.btn_cancel')}</button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JudgesTab({ eventId }) {
  const { t } = useTranslation();
  const [judges, setJudges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const copyInvite = async (j) => {
    const url = `${window.location.origin}/judge/${j.AccessCode}`;
    try { await navigator.clipboard.writeText(url); }
    catch { window.prompt('Copy this judge link:', url); }
    setCopiedId(j.JudgeID);
    setTimeout(() => setCopiedId(id => id === j.JudgeID ? null : id), 1500);
  };

  const load = () => Promise.all([
    fetch(`${API}/api/events/${eventId}/competition/judges`).then(r => r.json()),
    fetch(`${API}/api/events/${eventId}/competition/categories`).then(r => r.json()),
  ]).then(([j, c]) => { setJudges(j || []); setCategories(c || []); }).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const save = async (e) => {
    e.preventDefault();
    if (!form.JudgeName) return;
    const editing = form.JudgeID;
    const url = editing
      ? `${API}/api/events/competition/judges/${editing}`
      : `${API}/api/events/${eventId}/competition/judges`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ ...form, CategoryID: form.CategoryID || null }),
    });
    setForm({}); load();
  };
  const remove = async (j) => {
    if (!confirm(t('competition_admin.confirm_remove_judge', { name: j.JudgeName }))) return;
    await fetch(`${API}/api/events/competition/judges/${j.JudgeID}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={save} className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className={lbl}>{t('competition_admin.lbl_judge_name')}</label>
          <input className={inp} required value={form.JudgeName || ''}
            onChange={e => setForm(s => ({ ...s, JudgeName: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_email')}</label>
          <input className={inp} type="email" value={form.Email || ''}
            onChange={e => setForm(s => ({ ...s, Email: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_category_all')}</label>
          <select className={inp} value={form.CategoryID || ''}
            onChange={e => setForm(s => ({ ...s, CategoryID: e.target.value }))}>
            <option value="">{t('competition_admin.opt_all_categories')}</option>
            {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_credentials')}</label>
          <input className={inp} value={form.Credentials || ''}
            onChange={e => setForm(s => ({ ...s, Credentials: e.target.value }))} />
        </div>
        <div className="md:col-span-4 flex justify-end gap-2">
          {form.JudgeID && (
            <button type="button" onClick={() => setForm({})} className="text-sm px-4 py-2 rounded-lg border border-gray-300">{t('competition_admin.btn_cancel')}</button>
          )}
          <button type="submit" className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-4 py-2 rounded-lg">
            {form.JudgeID ? t('competition_admin.btn_save_judge') : t('competition_admin.btn_add_judge')}
          </button>
        </div>
      </form>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {judges.length === 0 && <div className="p-4 text-sm text-gray-500">{t('competition_admin.judges_empty')}</div>}
        {judges.map(j => {
          const cat = categories.find(c => c.CategoryID === j.CategoryID);
          return (
            <div key={j.JudgeID} className="p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{j.JudgeName}</div>
                <div className="text-xs text-gray-500">
                  {cat?.CategoryName || t('competition_admin.opt_all_categories')}{j.Email ? ` · ${j.Email}` : ''}
                  {j.Credentials && ` · ${j.Credentials}`}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">{t('competition_admin.judge_code_label', { code: j.AccessCode })}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copyInvite(j)} className="text-xs text-[#3D6B34] hover:underline">
                  {copiedId === j.JudgeID ? t('competition_admin.btn_copied') : t('competition_admin.btn_copy_invite')}
                </button>
                <button onClick={() => setForm(j)} className="text-xs text-[#3D6B34] hover:underline">{t('competition_admin.btn_edit')}</button>
                <button onClick={() => remove(j)} className="text-xs text-red-600 hover:underline">{t('competition_admin.btn_delete')}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EntriesTab({ eventId }) {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({});
  const [scoring, setScoring] = useState(null);

  const load = () => Promise.all([
    fetch(`${API}/api/events/${eventId}/competition/entries`).then(r => r.json()),
    fetch(`${API}/api/events/${eventId}/competition/categories`).then(r => r.json()),
  ]).then(([e, c]) => { setEntries(e || []); setCategories(c || []); }).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const save = async (e) => {
    e.preventDefault();
    if (!form.EntrantName || !form.CategoryID) return;
    const editing = form.EntryID;
    const url = editing
      ? `${API}/api/events/competition/entries/${editing}`
      : `${API}/api/events/${eventId}/competition/entries`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form),
    });
    setForm({}); load();
  };
  const toggleCheckin = async (en) => {
    await fetch(`${API}/api/events/competition/entries/${en.EntryID}/checkin`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ CheckedIn: !en.CheckedIn }),
    });
    load();
  };
  const remove = async (en) => {
    if (!confirm(t('competition_admin.confirm_delete_entry', { name: en.EntrantName }))) return;
    await fetch(`${API}/api/events/competition/entries/${en.EntryID}`, { method: 'DELETE' });
    load();
  };

  const openScore = async (entry) => {
    const [judges, criteria, scores] = await Promise.all([
      fetch(`${API}/api/events/${eventId}/competition/judges`).then(r => r.json()),
      fetch(`${API}/api/events/competition/categories/${entry.CategoryID}/criteria`).then(r => r.json()),
      fetch(`${API}/api/events/competition/entries/${entry.EntryID}/scores`).then(r => r.json()),
    ]);
    const eligibleJudges = (judges || []).filter(j => !j.CategoryID || j.CategoryID === entry.CategoryID);
    setScoring({ entry, judges: eligibleJudges, criteria: criteria || [], scores: scores || [] });
  };

  const filtered = filter ? entries.filter(e => String(e.CategoryID) === filter) : entries;

  return (
    <div className="space-y-4">
      <form onSubmit={save} className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <label className={lbl}>{t('competition_admin.lbl_entrant_name')}</label>
          <input className={inp} required value={form.EntrantName || ''}
            onChange={e => setForm(s => ({ ...s, EntrantName: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_category')}</label>
          <select className={inp} required value={form.CategoryID || ''}
            onChange={e => setForm(s => ({ ...s, CategoryID: e.target.value }))}>
            <option value="">—</option>
            {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_entry_number')}</label>
          <input className={inp} value={form.EntryNumber || ''}
            onChange={e => setForm(s => ({ ...s, EntryNumber: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_entrant_email')}</label>
          <input className={inp} value={form.EntrantEmail || ''}
            onChange={e => setForm(s => ({ ...s, EntrantEmail: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_entrant_phone')}</label>
          <input className={inp} value={form.EntrantPhone || ''}
            onChange={e => setForm(s => ({ ...s, EntrantPhone: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t('competition_admin.lbl_entry_title')}</label>
          <input className={inp} value={form.EntryTitle || ''}
            onChange={e => setForm(s => ({ ...s, EntryTitle: e.target.value }))} />
        </div>
        <div className="md:col-span-3 flex justify-end gap-2">
          {form.EntryID && (
            <button type="button" onClick={() => setForm({})} className="text-sm px-4 py-2 rounded-lg border border-gray-300">{t('competition_admin.btn_cancel')}</button>
          )}
          <button type="submit" className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-4 py-2 rounded-lg">
            {form.EntryID ? t('competition_admin.btn_save_entry') : t('competition_admin.btn_add_entry')}
          </button>
        </div>
      </form>

      <div>
        <label className={lbl}>{t('competition_admin.lbl_filter_category')}</label>
        <select className={inp + ' max-w-sm'} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">{t('competition_admin.opt_all')}</option>
          {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
        </select>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="py-2 px-3 text-left">{t('competition_admin.th_number')}</th>
              <th className="py-2 px-3 text-left">{t('competition_admin.th_entrant')}</th>
              <th className="py-2 px-3 text-left">{t('competition_admin.th_category')}</th>
              <th className="py-2 px-3 text-left">{t('competition_admin.th_checkin')}</th>
              <th className="py-2 px-3 text-left">{t('competition_admin.th_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(en => {
              const cat = categories.find(c => c.CategoryID === en.CategoryID);
              return (
                <tr key={en.EntryID} className={`border-t border-gray-100 ${en.Disqualified ? 'bg-red-50' : ''}`}>
                  <td className="py-2 px-3 font-mono text-xs">{en.EntryNumber || en.EntryID}</td>
                  <td className="py-2 px-3">
                    <div className="font-medium">{en.EntrantName}</div>
                    {en.EntryTitle && <div className="text-xs text-gray-500">{en.EntryTitle}</div>}
                  </td>
                  <td className="py-2 px-3 text-xs">{cat?.CategoryName}</td>
                  <td className="py-2 px-3">
                    <button onClick={() => toggleCheckin(en)}
                      className={`text-xs px-2 py-1 rounded ${en.CheckedIn ? 'bg-[#3D6B34] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {en.CheckedIn ? t('competition_admin.btn_checked_in') : t('competition_admin.btn_check_in')}
                    </button>
                  </td>
                  <td className="py-2 px-3 text-xs">
                    <button onClick={() => openScore(en)} className="text-[#3D6B34] hover:underline mr-2">{t('competition_admin.btn_score')}</button>
                    <button onClick={() => setForm(en)} className="text-[#3D6B34] hover:underline mr-2">{t('competition_admin.btn_edit')}</button>
                    <button onClick={() => remove(en)} className="text-red-600 hover:underline">{t('competition_admin.btn_delete')}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {scoring && <ScoreModal data={scoring} onClose={() => { setScoring(null); load(); }} />}
    </div>
  );
}

function ScoreModal({ data, onClose }) {
  const { t } = useTranslation();
  const { entry, judges, criteria } = data;
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const s = {}; const c = {};
    (data.scores || []).forEach(r => {
      s[`${r.JudgeID}:${r.CriterionID}`] = r.Points;
      c[`${r.JudgeID}:${r.CriterionID}`] = r.Comment || '';
    });
    setScores(s); setComments(c);
  }, [data]);

  const [activeJudge, setActiveJudge] = useState(judges[0]?.JudgeID || null);
  useEffect(() => { if (!activeJudge && judges[0]) setActiveJudge(judges[0].JudgeID); }, [judges]);

  const save = async (crit) => {
    if (!activeJudge) return;
    const key = `${activeJudge}:${crit.CriterionID}`;
    await fetch(`${API}/api/events/competition/entries/${entry.EntryID}/scores`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        JudgeID: activeJudge, CriterionID: crit.CriterionID,
        Points: Number(scores[key] || 0), Comment: comments[key] || '',
      }),
    });
  };

  if (!judges.length) return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-5 max-w-md">
        <div className="text-sm">{t('competition_admin.no_judges_msg')}</div>
        <button onClick={onClose} className="mt-3 text-sm px-4 py-2 rounded-lg border border-gray-300">{t('competition_admin.btn_close')}</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-5 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-semibold text-[#3D6B34]">{t('competition_admin.score_heading', { name: entry.EntrantName })}</div>
            {entry.EntryTitle && <div className="text-xs text-gray-500">{entry.EntryTitle}</div>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {judges.map(j => (
            <button key={j.JudgeID} onClick={() => setActiveJudge(j.JudgeID)}
              className={`text-xs px-3 py-1 rounded-full border ${activeJudge === j.JudgeID
                ? 'bg-[#3D6B34] text-white border-[#3D6B34]'
                : 'border-gray-300 text-gray-700'}`}>
              {j.JudgeName}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {criteria.length === 0 && <div className="text-sm text-gray-500">{t('competition_admin.criteria_none')}</div>}
          {criteria.map(crit => {
            const key = `${activeJudge}:${crit.CriterionID}`;
            return (
              <div key={crit.CriterionID} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="font-medium text-sm">{crit.CriterionName}</div>
                  <div className="text-xs text-gray-500">{t('competition_admin.criterion_meta', { pts: crit.MaxPoints, w: crit.Weight })}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <input type="number" step="0.01" min="0" max={crit.MaxPoints}
                    className={inp + ' max-w-[120px]'}
                    value={scores[key] ?? ''}
                    onChange={e => setScores(s => ({ ...s, [key]: e.target.value }))}
                    onBlur={() => save(crit)} />
                  <input className={inp} placeholder={t('competition_admin.placeholder_comment')}
                    value={comments[key] || ''}
                    onChange={e => setComments(s => ({ ...s, [key]: e.target.value }))}
                    onBlur={() => save(crit)} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-5 py-2 rounded-lg">{t('competition_admin.btn_done')}</button>
        </div>
      </div>
    </div>
  );
}

function LeaderboardTab({ eventId }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/competition/leaderboard`)
      .then(r => r.json()).then(setData).catch(() => setData(null));
  }, [eventId]);

  if (!data) return <div className="text-sm text-gray-500">{t('competition_admin.loading')}</div>;

  return (
    <div className="space-y-5">
      {data.DropHighLow && <div className="text-xs text-gray-500">{t('competition_admin.drop_high_low_note')}</div>}
      {data.Leaderboard.length === 0 && <div className="text-sm text-gray-500">{t('competition_admin.leaderboard_empty')}</div>}
      {data.Leaderboard.map(cat => (
        <div key={cat.CategoryID} className="border border-gray-200 rounded-lg p-4">
          <div className="font-medium text-sm text-[#3D6B34] mb-3">{cat.CategoryName}</div>
          {cat.Entries.length === 0 ? (
            <div className="text-xs text-gray-500">{t('competition_admin.entries_empty')}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 uppercase">
                <tr>
                  <th className="py-1 text-left w-12">{t('competition_admin.th_rank')}</th>
                  <th className="py-1 text-left">{t('competition_admin.th_entrant')}</th>
                  <th className="py-1 text-right w-24">{t('competition_admin.th_judges')}</th>
                  <th className="py-1 text-right w-24">{t('competition_admin.th_number')}</th>
                </tr>
              </thead>
              <tbody>
                {cat.Entries.map(e => (
                  <tr key={e.EntryID} className="border-t border-gray-100">
                    <td className="py-2 font-semibold">
                      {e.Disqualified ? <span className="text-red-500 text-xs">DQ</span> : (e.Rank || '—')}
                    </td>
                    <td className="py-2">
                      <div>{e.EntrantName}</div>
                      {e.EntryTitle && <div className="text-xs text-gray-500">{e.EntryTitle}</div>}
                    </td>
                    <td className="py-2 text-right text-xs">{e.JudgeCount}</td>
                    <td className="py-2 text-right font-mono">
                      {e.FinalScore != null ? Number(e.FinalScore).toFixed(2) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CompetitionAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('tab') || 'config';
  const [ev, setEv] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEv).catch(() => {});
  }, [eventId]);

  const setTab = (tabKey) => setSp({ tab: tabKey });

  const TABS = [
    ['config', t('competition_admin.tab_config')],
    ['categories', t('competition_admin.tab_categories')],
    ['judges', t('competition_admin.tab_judges')],
    ['entries', t('competition_admin.tab_entries')],
    ['leaderboard', t('competition_admin.tab_leaderboard')],
  ];

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-4">
          <Link to="/account/events" className="text-xs text-gray-500 hover:text-[#3D6B34]">{t('competition_admin.btn_back')}</Link>
          <h1 className="text-2xl font-semibold text-[#3D6B34] mt-1">
            {ev?.EventName || t('competition_admin.event_fallback')} <span className="text-sm text-gray-400 font-normal">{t('competition_admin.event_type_label')}</span>
          </h1>
        </div>

        <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
          {TABS.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 text-sm -mb-px border-b-2 whitespace-nowrap ${tab === k ? 'border-[#3D6B34] text-[#3D6B34]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'config'      && <ConfigTab eventId={eventId} />}
        {tab === 'categories'  && <CategoriesTab eventId={eventId} />}
        {tab === 'judges'      && <JudgesTab eventId={eventId} />}
        {tab === 'entries'     && <EntriesTab eventId={eventId} />}
        {tab === 'leaderboard' && <LeaderboardTab eventId={eventId} />}
      </div>
    </EventAdminLayout>
  );
}
