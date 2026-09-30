import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

const COURSES = ['Appetizer', 'Salad', 'Soup', 'Main', 'Side', 'Dessert', 'Beverage'];

function d(v) { return v ? String(v).substring(0, 10) : ''; }

const EMPTY_CONFIG = {
  Description: '', PricePerSeat: 0, ChildPricePerSeat: '', ChildAgeLimit: 12,
  MaxSeats: '', MealTime: '', DressCode: '', MenuIntro: '',
  RegistrationEndDate: '', IsActive: true,
};

function ConfigTab({ eventId }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(EMPTY_CONFIG);
  const [stats, setStats] = useState({ SeatsBooked: 0 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetch(`${API}/api/events/${eventId}/dining/config`)
    .then(r => r.json())
    .then(d_ => {
      if (d_?.configured) {
        setCfg({
          Description: d_.Description || '',
          PricePerSeat: d_.PricePerSeat || 0,
          ChildPricePerSeat: d_.ChildPricePerSeat ?? '',
          ChildAgeLimit: d_.ChildAgeLimit ?? 12,
          MaxSeats: d_.MaxSeats ?? '',
          MealTime: d_.MealTime || '',
          DressCode: d_.DressCode || '',
          MenuIntro: d_.MenuIntro || '',
          RegistrationEndDate: d(d_.RegistrationEndDate),
          IsActive: !!d_.IsActive,
        });
        setStats({ SeatsBooked: d_.SeatsBooked || 0 });
      }
    })
    .catch(() => {});

  useEffect(() => { load(); }, [eventId]);

  const set = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value }));
  const setB = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.checked }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const r = await fetch(`${API}/api/events/${eventId}/dining/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cfg,
          PricePerSeat: Number(cfg.PricePerSeat) || 0,
          ChildPricePerSeat: cfg.ChildPricePerSeat === '' ? null : Number(cfg.ChildPricePerSeat),
          ChildAgeLimit: Number(cfg.ChildAgeLimit) || 12,
          MaxSeats: cfg.MaxSeats === '' ? null : Number(cfg.MaxSeats),
        }),
      });
      if (!r.ok) throw new Error('Save failed');
      setMsg(t('dining_admin.msg_saved'));
      load();
    } catch (ex) {
      setMsg(ex.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#f6f8f3] border border-[#3D6B34]/20 rounded-lg p-3">
          <div className="text-xs text-gray-500">{t('dining_admin.stat_seats_booked')}</div>
          <div className="text-lg font-semibold text-[#3D6B34]">
            {stats.SeatsBooked}{cfg.MaxSeats ? ` / ${cfg.MaxSeats}` : ''}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500">{t('dining_admin.stat_adult_price')}</div>
          <div className="text-lg font-semibold text-gray-800">${Number(cfg.PricePerSeat || 0).toFixed(2)}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-500">{t('dining_admin.stat_child_price')}</div>
          <div className="text-lg font-semibold text-gray-800">
            {cfg.ChildPricePerSeat === '' || cfg.ChildPricePerSeat == null
              ? t('dining_admin.child_price_same')
              : `$${Number(cfg.ChildPricePerSeat).toFixed(2)}`}
          </div>
        </div>
      </div>

      <div>
        <label className={lbl}>{t('dining_admin.lbl_description')}</label>
        <RichTextEditor value={cfg.Description || ''}
          onChange={(v) => setCfg(c => ({ ...c, Description: v }))} minHeight={180} />
      </div>
      <div>
        <label className={lbl}>{t('dining_admin.lbl_menu_intro')}</label>
        <RichTextEditor value={cfg.MenuIntro || ''}
          onChange={(v) => setCfg(c => ({ ...c, MenuIntro: v }))} minHeight={120} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>{t('dining_admin.lbl_adult_price')}</label>
          <input type="number" step="0.01" value={cfg.PricePerSeat} onChange={set('PricePerSeat')} className={inp} />
        </div>
        <div>
          <label className={lbl}>{t('dining_admin.lbl_child_price')}</label>
          <input type="number" step="0.01" value={cfg.ChildPricePerSeat} onChange={set('ChildPricePerSeat')} className={inp} placeholder={t('dining_admin.placeholder_child_price')} />
        </div>
        <div>
          <label className={lbl}>{t('dining_admin.lbl_child_age')}</label>
          <input type="number" min="0" value={cfg.ChildAgeLimit} onChange={set('ChildAgeLimit')} className={inp} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>{t('dining_admin.lbl_max_seats')}</label>
          <input type="number" min="1" value={cfg.MaxSeats} onChange={set('MaxSeats')} className={inp} placeholder={t('dining_admin.placeholder_max_seats')} />
        </div>
        <div>
          <label className={lbl}>{t('dining_admin.lbl_reg_closes')}</label>
          <input type="date" value={cfg.RegistrationEndDate} onChange={set('RegistrationEndDate')} className={inp} />
        </div>
        <div>
          <label className={lbl}>{t('dining_admin.lbl_meal_time')}</label>
          <input value={cfg.MealTime} onChange={set('MealTime')} className={inp} placeholder={t('dining_admin.placeholder_meal_time')} />
        </div>
      </div>

      <div>
        <label className={lbl}>{t('dining_admin.lbl_dress_code')}</label>
        <input value={cfg.DressCode} onChange={set('DressCode')} className={inp} placeholder={t('dining_admin.placeholder_dress_code')} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={cfg.IsActive} onChange={setB('IsActive')} className="w-4 h-4 accent-green-600" />
        {t('dining_admin.lbl_is_active')}
      </label>

      <div className="flex justify-end gap-3 pt-2">
        {msg && <span className="text-sm text-gray-500 self-center mr-auto">{msg}</span>}
        <button type="submit" disabled={saving} className="bg-[#3D6B34] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#2d5226] disabled:opacity-50">
          {saving ? t('dining_admin.btn_saving') : t('dining_admin.btn_save_config')}
        </button>
      </div>
    </form>
  );
}

function MenuTab({ eventId }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);

  const COURSE_LABELS = {
    'Appetizer': t('dining_admin.course_appetizer'),
    'Salad': t('dining_admin.course_salad'),
    'Soup': t('dining_admin.course_soup'),
    'Main': t('dining_admin.course_main'),
    'Side': t('dining_admin.course_side'),
    'Dessert': t('dining_admin.course_dessert'),
    'Beverage': t('dining_admin.course_beverage'),
  };

  const load = () => fetch(`${API}/api/events/${eventId}/dining/menu`)
    .then(r => r.json()).then(setItems).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const startAdd = () => {
    setEditing('new');
    setDraft({ Course: 'Main', ItemName: '', ItemDescription: '',
      IsVegetarian: false, IsVegan: false, IsGlutenFree: false,
      UpchargeFee: 0, DisplayOrder: 0, IsActive: true });
  };
  const startEdit = (i) => { setEditing(i.MenuItemID); setDraft({ ...i }); };

  const save = async () => {
    if (!draft.ItemName) return;
    const body = {
      ...draft,
      UpchargeFee: Number(draft.UpchargeFee) || 0,
      DisplayOrder: Number(draft.DisplayOrder) || 0,
    };
    const url = editing === 'new'
      ? `${API}/api/events/${eventId}/dining/menu`
      : `${API}/api/events/dining/menu/${editing}`;
    const method = editing === 'new' ? 'POST' : 'PUT';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setEditing(null); setDraft(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm(t('dining_admin.confirm_delete_menu_item'))) return;
    await fetch(`${API}/api/events/dining/menu/${id}`, { method: 'DELETE' });
    load();
  };

  const byCourse = COURSES.reduce((acc, c) => { acc[c] = []; return acc; }, { Other: [] });
  items.forEach(i => {
    if (byCourse[i.Course]) byCourse[i.Course].push(i);
    else byCourse.Other.push(i);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          {t('dining_admin.menu_subtitle')}
        </p>
        {!editing && (
          <button onClick={startAdd} className="text-sm bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg hover:bg-[#2d5226]">
            {t('dining_admin.btn_add_menu_item')}
          </button>
        )}
      </div>

      {editing && draft && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={lbl}>{t('dining_admin.lbl_course')}</label>
              <select value={draft.Course} onChange={e => setDraft(d => ({ ...d, Course: e.target.value }))} className={inp}>
                {COURSES.map(c => <option key={c} value={c}>{COURSE_LABELS[c] || c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={lbl}>{t('dining_admin.lbl_item_name')}</label>
              <input value={draft.ItemName} onChange={e => setDraft(d => ({ ...d, ItemName: e.target.value }))} className={inp} />
            </div>
          </div>
          <div>
            <label className={lbl}>{t('dining_admin.lbl_description')}</label>
            <RichTextEditor value={draft.ItemDescription || ''}
              onChange={(v) => setDraft(d => ({ ...d, ItemDescription: v }))} minHeight={100} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.IsVegetarian} onChange={e => setDraft(d => ({ ...d, IsVegetarian: e.target.checked }))} /> {t('dining_admin.lbl_vegetarian')}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.IsVegan} onChange={e => setDraft(d => ({ ...d, IsVegan: e.target.checked }))} /> {t('dining_admin.lbl_vegan')}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.IsGlutenFree} onChange={e => setDraft(d => ({ ...d, IsGlutenFree: e.target.checked }))} /> {t('dining_admin.lbl_gluten_free')}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.IsActive} onChange={e => setDraft(d => ({ ...d, IsActive: e.target.checked }))} /> {t('dining_admin.lbl_available')}
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={lbl}>{t('dining_admin.lbl_upcharge')}</label>
              <input type="number" step="0.01" value={draft.UpchargeFee} onChange={e => setDraft(d => ({ ...d, UpchargeFee: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className={lbl}>{t('dining_admin.lbl_display_order')}</label>
              <input type="number" value={draft.DisplayOrder} onChange={e => setDraft(d => ({ ...d, DisplayOrder: e.target.value }))} className={inp} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setEditing(null); setDraft(null); }} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg">{t('dining_admin.btn_cancel')}</button>
            <button onClick={save} className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg">
              {editing === 'new' ? t('dining_admin.btn_add') : t('dining_admin.btn_update')}
            </button>
          </div>
        </div>
      )}

      {Object.entries(byCourse).map(([course, list]) => {
        if (list.length === 0) return null;
        return (
          <div key={course} className="mb-5">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">{COURSE_LABELS[course] || course}</h3>
            <div className="space-y-2">
              {list.map(i => (
                <div key={i.MenuItemID} className={`flex items-start justify-between bg-white border rounded-lg p-3 ${i.IsActive ? 'border-gray-200' : 'border-gray-200 opacity-50'}`}>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{i.ItemName}</div>
                    {i.ItemDescription && <div className="text-xs text-gray-600 mt-0.5" dangerouslySetInnerHTML={{ __html: i.ItemDescription }} />}
                    <div className="flex gap-2 mt-1">
                      {i.IsVegetarian && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">V</span>}
                      {i.IsVegan && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">VG</span>}
                      {i.IsGlutenFree && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">GF</span>}
                      {Number(i.UpchargeFee) > 0 && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">+${Number(i.UpchargeFee).toFixed(2)}</span>}
                      {!i.IsActive && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{t('dining_admin.badge_hidden')}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(i)} className="text-xs text-gray-500 hover:text-gray-800">{t('dining_admin.btn_edit')}</button>
                    <button onClick={() => remove(i.MenuItemID)} className="text-xs text-red-500 hover:text-red-700">{t('dining_admin.btn_delete')}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {items.length === 0 && !editing && (
        <div className="text-sm text-gray-500">{t('dining_admin.menu_empty')}</div>
      )}
    </div>
  );
}

function TablesTab({ eventId }) {
  const { t } = useTranslation();
  const [tables, setTables] = useState([]);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);

  const load = () => fetch(`${API}/api/events/${eventId}/dining/tables`)
    .then(r => r.json()).then(setTables).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const startAdd = () => {
    setEditing('new');
    setDraft({ TableNumber: '', SeatCount: 8, TableLocation: '', Notes: '' });
  };
  const startEdit = (tbl) => { setEditing(tbl.TableID); setDraft({ ...tbl }); };

  const save = async () => {
    if (!draft.TableNumber) return;
    const body = { ...draft, SeatCount: Number(draft.SeatCount) || 8 };
    const url = editing === 'new'
      ? `${API}/api/events/${eventId}/dining/tables`
      : `${API}/api/events/dining/tables/${editing}`;
    const method = editing === 'new' ? 'POST' : 'PUT';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setEditing(null); setDraft(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm(t('dining_admin.confirm_delete_table'))) return;
    await fetch(`${API}/api/events/dining/tables/${id}`, { method: 'DELETE' });
    load();
  };

  const bulkAdd = async () => {
    const countStr = prompt(t('dining_admin.prompt_table_count'));
    const count = Number(countStr);
    if (!count || count < 1) return;
    const seatsStr = prompt(t('dining_admin.prompt_seats_per_table'), '8');
    const seats = Number(seatsStr) || 8;
    const start = tables.length + 1;
    for (let i = 0; i < count; i++) {
      await fetch(`${API}/api/events/${eventId}/dining/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TableNumber: String(start + i), SeatCount: seats }),
      });
    }
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">{t('dining_admin.tables_subtitle')}</p>
        {!editing && (
          <div className="flex gap-2">
            <button onClick={bulkAdd} className="text-sm border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              {t('dining_admin.btn_bulk_create')}
            </button>
            <button onClick={startAdd} className="text-sm bg-[#3D6B34] text-white px-4 py-1.5 rounded-lg hover:bg-[#2d5226]">
              {t('dining_admin.btn_add_table')}
            </button>
          </div>
        )}
      </div>

      {editing && draft && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={lbl}>{t('dining_admin.lbl_table_number')}</label>
              <input value={draft.TableNumber} onChange={e => setDraft(d => ({ ...d, TableNumber: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className={lbl}>{t('dining_admin.lbl_seat_count')}</label>
              <input type="number" min="1" value={draft.SeatCount} onChange={e => setDraft(d => ({ ...d, SeatCount: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className={lbl}>{t('dining_admin.lbl_location')}</label>
              <input value={draft.TableLocation || ''} onChange={e => setDraft(d => ({ ...d, TableLocation: e.target.value }))} className={inp} placeholder={t('dining_admin.placeholder_location')} />
            </div>
          </div>
          <div>
            <label className={lbl}>{t('dining_admin.lbl_notes')}</label>
            <input value={draft.Notes || ''} onChange={e => setDraft(d => ({ ...d, Notes: e.target.value }))} className={inp} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setEditing(null); setDraft(null); }} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg">{t('dining_admin.btn_cancel')}</button>
            <button onClick={save} className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg">
              {editing === 'new' ? t('dining_admin.btn_add') : t('dining_admin.btn_update')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {tables.map(tbl => {
          const assigned = Number(tbl.SeatsAssigned || 0);
          const full = assigned >= Number(tbl.SeatCount);
          return (
            <div key={tbl.TableID} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{t('dining_admin.table_heading', { number: tbl.TableNumber })}</div>
                  {tbl.TableLocation && <div className="text-xs text-gray-500">{tbl.TableLocation}</div>}
                </div>
                <div className={`text-xs px-2 py-0.5 rounded ${full ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {assigned} / {tbl.SeatCount}
                </div>
              </div>
              {tbl.Notes && <div className="text-xs text-gray-500 mt-1">{tbl.Notes}</div>}
              <div className="flex gap-2 mt-2">
                <button onClick={() => startEdit(tbl)} className="text-xs text-gray-500 hover:text-gray-800">{t('dining_admin.btn_edit')}</button>
                <button onClick={() => remove(tbl.TableID)} className="text-xs text-red-500 hover:text-red-700">{t('dining_admin.btn_delete')}</button>
              </div>
            </div>
          );
        })}
      </div>
      {tables.length === 0 && !editing && (
        <div className="text-sm text-gray-500">{t('dining_admin.tables_empty')}</div>
      )}
    </div>
  );
}

function SeatingTab({ eventId }) {
  const { t } = useTranslation();
  const [chart, setChart] = useState({ tables: [], byTable: {}, unassigned: [] });

  const load = () => fetch(`${API}/api/events/${eventId}/dining/seating-chart`)
    .then(r => r.json()).then(setChart).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const assign = async (regId, tableId) => {
    await fetch(`${API}/api/events/dining/registrations/${regId}/seat`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ TableID: tableId || null }),
    });
    load();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">{t('dining_admin.seating_subtitle')}</p>
        <button onClick={() => window.print()} className="text-sm border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 print:hidden">
          {t('dining_admin.btn_print')}
        </button>
      </div>

      {chart.unassigned.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <h3 className="text-sm font-bold text-yellow-800 mb-2">{t('dining_admin.unassigned_heading', { count: chart.unassigned.length })}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {chart.unassigned.map(g => (
              <div key={g.RegID} className="bg-white border border-yellow-200 rounded p-2 text-sm">
                <div className="font-medium">{g.GuestName}</div>
                <div className="text-xs text-gray-500">
                  {t('dining_admin.party_of', { size: g.PartySize })}
                  {g.ChildCount ? ` ${t('dining_admin.child_suffix', { count: g.ChildCount })}` : ''}
                </div>
                <select
                  value=""
                  onChange={(e) => assign(g.RegID, e.target.value ? Number(e.target.value) : null)}
                  className="mt-1 text-xs border border-gray-300 rounded px-1 py-0.5 w-full"
                >
                  <option value="">{t('dining_admin.opt_assign_table')}</option>
                  {chart.tables.map(tbl => <option key={tbl.TableID} value={tbl.TableID}>{t('dining_admin.table_option', { number: tbl.TableNumber })}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {chart.tables.map(tbl => {
          const guests = chart.byTable[tbl.TableID] || [];
          const seated = guests.reduce((s, g) => s + Number(g.PartySize || 0), 0);
          const full = seated >= Number(tbl.SeatCount);
          return (
            <div key={tbl.TableID} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">{t('dining_admin.table_heading', { number: tbl.TableNumber })}</div>
                <div className={`text-xs px-2 py-0.5 rounded ${full ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {seated} / {tbl.SeatCount}
                </div>
              </div>
              {tbl.TableLocation && <div className="text-xs text-gray-500 mb-2">{tbl.TableLocation}</div>}
              <div className="space-y-1">
                {guests.map(g => (
                  <div key={g.RegID} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1 last:border-b-0">
                    <div className="min-w-0">
                      <div className="truncate">{g.GuestName}</div>
                      <div className="text-[10px] text-gray-500">
                        {t('dining_admin.seat_count', { count: g.PartySize })}
                        {g.DietaryRestrictions && ` · ${g.DietaryRestrictions}`}
                      </div>
                    </div>
                    <button onClick={() => assign(g.RegID, null)} className="text-[10px] text-red-500 hover:text-red-700 ml-2 print:hidden">×</button>
                  </div>
                ))}
                {guests.length === 0 && <div className="text-xs text-gray-400 italic">{t('dining_admin.seating_empty_cell')}</div>}
              </div>
            </div>
          );
        })}
      </div>
      {chart.tables.length === 0 && (
        <div className="text-sm text-gray-500">{t('dining_admin.seating_no_tables')}</div>
      )}
    </div>
  );
}

function RegistrationsTab({ eventId }) {
  const { t } = useTranslation();
  const [regs, setRegs] = useState([]);
  const [tables, setTables] = useState([]);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);

  const load = () => {
    fetch(`${API}/api/events/${eventId}/dining/registrations`)
      .then(r => r.json()).then(setRegs).catch(() => {});
    fetch(`${API}/api/events/${eventId}/dining/tables`)
      .then(r => r.json()).then(setTables).catch(() => {});
  };
  useEffect(() => { load(); }, [eventId]);

  const startEdit = (r) => {
    setEditing(r.RegID);
    setDraft({
      TableID: r.TableID || '',
      SeatNumbers: r.SeatNumbers || '',
      PaidStatus: r.PaidStatus || 'pending',
      Status: r.Status || 'confirmed',
      OrganizerNotes: r.OrganizerNotes || '',
    });
  };

  const save = async () => {
    await fetch(`${API}/api/events/dining/registrations/${editing}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...draft,
        TableID: draft.TableID === '' ? null : Number(draft.TableID),
      }),
    });
    setEditing(null); setDraft(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm(t('dining_admin.confirm_remove_reg'))) return;
    await fetch(`${API}/api/events/dining/registrations/${id}`, { method: 'DELETE' });
    load();
  };

  const totalRevenue = regs.filter(r => r.PaidStatus === 'paid').reduce((s, r) => s + Number(r.TotalFee || 0), 0);
  const expectedRevenue = regs.reduce((s, r) => s + Number(r.TotalFee || 0), 0);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-gray-500">{t('dining_admin.stat_registrations')}</div>
          <div className="text-lg font-semibold">{regs.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-gray-500">{t('dining_admin.stat_seats_booked')}</div>
          <div className="text-lg font-semibold">{regs.reduce((s, r) => s + Number(r.PartySize || 0), 0)}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-gray-500">{t('dining_admin.stat_revenue_paid')}</div>
          <div className="text-lg font-semibold text-[#3D6B34]">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-gray-500">{t('dining_admin.stat_expected')}</div>
          <div className="text-lg font-semibold text-gray-800">${expectedRevenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="space-y-2">
        {regs.map(r => {
          const isEditing = editing === r.RegID;
          return (
            <div key={r.RegID} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{r.GuestName}</div>
                  <div className="text-xs text-gray-500">
                    {t('dining_admin.party_of', { size: r.PartySize })}
                    {r.ChildCount ? ` ${t('dining_admin.child_suffix', { count: r.ChildCount })}` : ''}
                    {r.GuestEmail && ` • ${r.GuestEmail}`}
                    {r.TableNumber && ` • ${t('dining_admin.table_heading', { number: r.TableNumber })}`}
                  </div>
                  {r.DietaryRestrictions && <div className="text-xs text-amber-700 mt-1">🥗 {r.DietaryRestrictions}</div>}
                  {r.SpecialRequests && <div className="text-xs text-gray-600 mt-0.5">{t('dining_admin.note_prefix', { text: r.SpecialRequests })}</div>}
                  {r.Choices?.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      {r.Choices.map(c => `${c.Course}: ${c.ItemName}`).join(' • ')}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="text-sm font-medium">${Number(r.TotalFee || 0).toFixed(2)}</div>
                  <div className={`text-[11px] px-2 py-0.5 rounded ${r.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.PaidStatus}
                  </div>
                  {!isEditing && (
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => startEdit(r)} className="text-xs text-gray-500 hover:text-gray-800">{t('dining_admin.btn_edit')}</button>
                      <button onClick={() => remove(r.RegID)} className="text-xs text-red-500 hover:text-red-700">{t('dining_admin.btn_remove')}</button>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && draft && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className={lbl}>{t('dining_admin.lbl_table')}</label>
                      <select value={draft.TableID} onChange={e => setDraft(d => ({ ...d, TableID: e.target.value }))} className={inp}>
                        <option value="">{t('dining_admin.opt_unassigned')}</option>
                        {tables.map(tbl => <option key={tbl.TableID} value={tbl.TableID}>{t('dining_admin.table_option', { number: tbl.TableNumber })}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>{t('dining_admin.lbl_seat_numbers')}</label>
                      <input value={draft.SeatNumbers} onChange={e => setDraft(d => ({ ...d, SeatNumbers: e.target.value }))} className={inp} placeholder={t('dining_admin.placeholder_seat_numbers')} />
                    </div>
                    <div>
                      <label className={lbl}>{t('dining_admin.lbl_paid_status')}</label>
                      <select value={draft.PaidStatus} onChange={e => setDraft(d => ({ ...d, PaidStatus: e.target.value }))} className={inp}>
                        <option value="pending">{t('dining_admin.status_pending')}</option>
                        <option value="paid">{t('dining_admin.status_paid')}</option>
                        <option value="refunded">{t('dining_admin.status_refunded')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>{t('dining_admin.lbl_status')}</label>
                    <select value={draft.Status} onChange={e => setDraft(d => ({ ...d, Status: e.target.value }))} className={inp}>
                      <option value="confirmed">{t('dining_admin.status_confirmed')}</option>
                      <option value="waitlist">{t('dining_admin.status_waitlist')}</option>
                      <option value="cancelled">{t('dining_admin.status_cancelled')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>{t('dining_admin.lbl_organizer_notes')}</label>
                    <RichTextEditor value={draft.OrganizerNotes || ''}
                      onChange={(v) => setDraft(d => ({ ...d, OrganizerNotes: v }))} minHeight={90} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditing(null); setDraft(null); }} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg">{t('dining_admin.btn_cancel')}</button>
                    <button onClick={save} className="px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg">{t('dining_admin.btn_save')}</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {regs.length === 0 && <div className="text-sm text-gray-500">{t('dining_admin.regs_empty')}</div>}
    </div>
  );
}

export default function DiningAdmin() {
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
    { id: 'config', label: t('dining_admin.tab_config') },
    { id: 'menu', label: t('dining_admin.tab_menu') },
    { id: 'tables', label: t('dining_admin.tab_tables') },
    { id: 'registrations', label: t('dining_admin.tab_registrations') },
    { id: 'seating', label: t('dining_admin.tab_seating') },
  ];

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('dining_admin.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('dining_admin.subheading', { eventName: event?.EventName || t('dining_admin.event_fallback') })}
            </p>
          </div>
          <Link to={`/events/manage?BusinessID=${BusinessID || ''}`} className="text-sm text-gray-500 hover:text-gray-700">
            {t('dining_admin.btn_back')}
          </Link>
        </div>

        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map(tabItem => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === tabItem.id ? 'border-[#3D6B34] text-[#3D6B34]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {tab === 'config' && <ConfigTab eventId={eventId} />}
        {tab === 'menu' && <MenuTab eventId={eventId} />}
        {tab === 'tables' && <TablesTab eventId={eventId} />}
        {tab === 'registrations' && <RegistrationsTab eventId={eventId} />}
        {tab === 'seating' && <SeatingTab eventId={eventId} />}
      </div>
    </EventAdminLayout>
  );
}
