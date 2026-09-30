import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

function d(v) { return v ? String(v).substring(0, 10) : ''; }
function toLocalInput(iso) {
  if (!iso) return '';
  const dt = new Date(iso);
  if (isNaN(dt)) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}
function fmtDT(iso) {
  if (!iso) return '';
  const dt = new Date(iso);
  if (isNaN(dt)) return String(iso);
  return dt.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function ConfigTab({ eventId }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState({
    Description: '', EarlyBirdPrice: '', EarlyBirdEndDate: '',
    RegularPrice: 0, LatePrice: '', LateStartDate: '', OneDayPrice: '',
    MaxAttendees: '', RegistrationEndDate: '', VenueNotes: '',
    BadgePrintingEnabled: true, IsActive: true,
  });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/conference/config`).then(r => r.json()).then(x => {
      if (x && x.EventID) {
        setCfg({
          Description: x.Description || '',
          EarlyBirdPrice: x.EarlyBirdPrice ?? '',
          EarlyBirdEndDate: d(x.EarlyBirdEndDate),
          RegularPrice: x.RegularPrice ?? 0,
          LatePrice: x.LatePrice ?? '',
          LateStartDate: d(x.LateStartDate),
          OneDayPrice: x.OneDayPrice ?? '',
          MaxAttendees: x.MaxAttendees ?? '',
          RegistrationEndDate: d(x.RegistrationEndDate),
          VenueNotes: x.VenueNotes || '',
          BadgePrintingEnabled: x.BadgePrintingEnabled !== false,
          IsActive: x.IsActive !== false,
        });
      }
    }).catch(() => {});
  }, [eventId]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      const r = await fetch(`${API}/api/events/${eventId}/conference/config`, {
        method: 'PUT', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...cfg,
          EarlyBirdPrice: cfg.EarlyBirdPrice === '' ? null : Number(cfg.EarlyBirdPrice),
          RegularPrice: Number(cfg.RegularPrice) || 0,
          LatePrice: cfg.LatePrice === '' ? null : Number(cfg.LatePrice),
          OneDayPrice: cfg.OneDayPrice === '' ? null : Number(cfg.OneDayPrice),
          MaxAttendees: cfg.MaxAttendees === '' ? null : Number(cfg.MaxAttendees),
        }),
      });
      if (!r.ok) throw new Error(t('conference_admin.err_save_failed'));
      setMsg(t('conference_admin.saved'));
    } catch (ex) { setMsg(ex.message); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  };

  const set = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value }));
  const setB = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.checked }));

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <label className={lbl}>{t('conference_admin.lbl_description')}</label>
        <RichTextEditor value={cfg.Description || ''}
          onChange={(v) => setCfg(c => ({ ...c, Description: v }))} minHeight={160} />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="font-medium text-sm text-[#3D6B34] mb-3">{t('conference_admin.section_pricing')}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={lbl}>{t('conference_admin.lbl_early_bird_price')}</label>
            <input className={inp} type="number" step="0.01" value={cfg.EarlyBirdPrice} onChange={set('EarlyBirdPrice')} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.lbl_early_bird_ends')}</label>
            <input className={inp} type="date" value={cfg.EarlyBirdEndDate} onChange={set('EarlyBirdEndDate')} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.lbl_regular_price')}</label>
            <input className={inp} type="number" step="0.01" value={cfg.RegularPrice} onChange={set('RegularPrice')} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.lbl_late_price')}</label>
            <input className={inp} type="number" step="0.01" value={cfg.LatePrice} onChange={set('LatePrice')} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.lbl_late_starts')}</label>
            <input className={inp} type="date" value={cfg.LateStartDate} onChange={set('LateStartDate')} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.lbl_one_day_price')}</label>
            <input className={inp} type="number" step="0.01" value={cfg.OneDayPrice} onChange={set('OneDayPrice')} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{t('conference_admin.lbl_max_attendees')}</label>
          <input className={inp} type="number" value={cfg.MaxAttendees} onChange={set('MaxAttendees')} />
        </div>
        <div>
          <label className={lbl}>{t('conference_admin.lbl_reg_ends')}</label>
          <input className={inp} type="date" value={cfg.RegistrationEndDate} onChange={set('RegistrationEndDate')} />
        </div>
      </div>

      <div>
        <label className={lbl}>{t('conference_admin.lbl_venue_notes')}</label>
        <textarea className={inp} rows={3} value={cfg.VenueNotes} onChange={set('VenueNotes')} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!cfg.BadgePrintingEnabled} onChange={setB('BadgePrintingEnabled')} />
          <span>{t('conference_admin.lbl_badge_printing')}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!cfg.IsActive} onChange={setB('IsActive')} />
          <span>{t('conference_admin.lbl_is_active')}</span>
        </label>
      </div>

      <div className="flex items-center gap-3 justify-end">
        {msg && <span className="text-sm text-[#3D6B34] mr-auto">{msg}</span>}
        <Link to="/account/events" className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">{t('conference_admin.btn_cancel')}</Link>
        <button type="submit" disabled={saving}
          className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50">
          {saving ? t('conference_admin.btn_saving') : t('conference_admin.btn_save_config')}
        </button>
      </div>
    </form>
  );
}

function SimpleListTab({ eventId, kind, fields, label }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});

  const load = () => fetch(`${API}/api/events/${eventId}/conference/${kind}`)
    .then(r => r.json()).then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, [eventId]);

  const idKey = kind === 'tracks' ? 'TrackID' : 'RoomID';

  const submit = async (e) => {
    e.preventDefault();
    const editing = form[idKey];
    const url = editing
      ? `${API}/api/events/conference/${kind}/${editing}`
      : `${API}/api/events/${eventId}/conference/${kind}`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form),
    });
    setForm({}); load();
  };
  const remove = async (item) => {
    if (!confirm(t('conference_admin.confirm_delete'))) return;
    await fetch(`${API}/api/events/conference/${kind}/${item[idKey]}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        {fields.map(f => (
          <div key={f.k}>
            <label className={lbl}>{f.label}</label>
            {f.type === 'color' ? (
              <input className={inp} type="color" value={form[f.k] || '#3D6B34'}
                onChange={e => setForm(s => ({ ...s, [f.k]: e.target.value }))} />
            ) : (
              <input className={inp} type={f.type || 'text'} value={form[f.k] || ''}
                onChange={e => setForm(s => ({ ...s, [f.k]: e.target.value }))} />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2">
          {form[idKey] && (
            <button type="button" onClick={() => setForm({})}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300">{t('conference_admin.btn_cancel')}</button>
          )}
          <button type="submit" className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-4 py-2 rounded-lg">
            {form[idKey] ? t('conference_admin.btn_save_item') : t('conference_admin.btn_add_item', { label })}
          </button>
        </div>
      </form>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        {items.length === 0 && <div className="p-4 text-sm text-gray-500">{t('conference_admin.items_empty', { label: label.toLowerCase() })}</div>}
        {items.map(it => (
          <div key={it[idKey]} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {kind === 'tracks' && (
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: it.TrackColor || '#3D6B34' }} />
              )}
              <div>
                <div className="text-sm font-medium">{it.TrackName || it.RoomName}</div>
                {it.Description && <div className="text-xs text-gray-500">{it.Description}</div>}
                {it.Capacity && <div className="text-xs text-gray-500">{t('conference_admin.capacity_label', { n: it.Capacity })}</div>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(it)} className="text-xs text-[#3D6B34] hover:underline">{t('conference_admin.btn_edit')}</button>
              <button onClick={() => remove(it)} className="text-xs text-red-600 hover:underline">{t('conference_admin.btn_delete')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeakersTab({ eventId }) {
  const { t } = useTranslation();
  const [speakers, setSpeakers] = useState([]);
  const [form, setForm] = useState({});

  const load = () => fetch(`${API}/api/events/${eventId}/conference/speakers`)
    .then(r => r.json()).then(setSpeakers).catch(() => setSpeakers([]));
  useEffect(() => { load(); }, [eventId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.SpeakerName) return;
    const editing = form.SpeakerID;
    const url = editing
      ? `${API}/api/events/conference/speakers/${editing}`
      : `${API}/api/events/${eventId}/conference/speakers`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form),
    });
    setForm({}); load();
  };
  const remove = async (sp) => {
    if (!confirm(t('conference_admin.confirm_remove_speaker', { name: sp.SpeakerName }))) return;
    await fetch(`${API}/api/events/conference/speakers/${sp.SpeakerID}`, { method: 'DELETE' });
    load();
  };

  const [copiedId, setCopiedId] = useState(null);
  const inviteSpeaker = async (sp) => {
    let code = sp.AccessCode;
    if (!code) {
      const r = await fetch(`${API}/api/events/conference/speakers/${sp.SpeakerID}/issue-code`, { method: 'POST' });
      const data = await r.json();
      code = data.AccessCode;
      load();
    }
    const url = `${window.location.origin}/speaker/${code}`;
    try { await navigator.clipboard.writeText(url); }
    catch { window.prompt('Copy this speaker link:', url); }
    setCopiedId(sp.SpeakerID);
    setTimeout(() => setCopiedId(id => id === sp.SpeakerID ? null : id), 1500);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={lbl}>{t('conference_admin.speaker_lbl_name')}</label>
            <input className={inp} required value={form.SpeakerName || ''}
              onChange={e => setForm(s => ({ ...s, SpeakerName: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.speaker_lbl_title')}</label>
            <input className={inp} value={form.Title || ''}
              onChange={e => setForm(s => ({ ...s, Title: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.speaker_lbl_company')}</label>
            <input className={inp} value={form.Company || ''}
              onChange={e => setForm(s => ({ ...s, Company: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className={lbl}>{t('conference_admin.speaker_lbl_photo')}</label>
            <input className={inp} value={form.PhotoURL || ''}
              onChange={e => setForm(s => ({ ...s, PhotoURL: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.speaker_lbl_email')}</label>
            <input className={inp} type="email" value={form.Email || ''}
              onChange={e => setForm(s => ({ ...s, Email: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className={lbl}>{t('conference_admin.speaker_lbl_bio')}</label>
          <textarea className={inp} rows={3} value={form.Bio || ''}
            onChange={e => setForm(s => ({ ...s, Bio: e.target.value }))} />
        </div>
        <div className="flex gap-2 justify-end">
          {form.SpeakerID && (
            <button type="button" onClick={() => setForm({})}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300">{t('conference_admin.btn_cancel')}</button>
          )}
          <button type="submit" className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-4 py-2 rounded-lg">
            {form.SpeakerID ? t('conference_admin.btn_save_speaker') : t('conference_admin.btn_add_speaker')}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {speakers.map(sp => (
          <div key={sp.SpeakerID} className="border border-gray-200 rounded-lg p-3 flex gap-3">
            {sp.PhotoURL && <img src={sp.PhotoURL} alt="" className="w-16 h-16 rounded object-cover" />}
            <div className="flex-1">
              <div className="font-medium text-sm">{sp.SpeakerName}</div>
              <div className="text-xs text-gray-500">{sp.Title}{sp.Company ? ` · ${sp.Company}` : ''}</div>
              {sp.Bio && <div className="text-xs text-gray-600 mt-1 line-clamp-3">{sp.Bio}</div>}
              <div className="flex gap-2 mt-2 items-center">
                <button onClick={() => inviteSpeaker(sp)} className="text-xs text-[#3D6B34] hover:underline">
                  {copiedId === sp.SpeakerID ? t('conference_admin.btn_copied') : (sp.AccessCode ? t('conference_admin.btn_copy_invite') : t('conference_admin.btn_issue_invite'))}
                </button>
                <button onClick={() => setForm(sp)} className="text-xs text-[#3D6B34] hover:underline">{t('conference_admin.btn_edit')}</button>
                <button onClick={() => remove(sp)} className="text-xs text-red-600 hover:underline">{t('conference_admin.btn_delete')}</button>
              </div>
              {sp.AccessCode && (
                <div className="text-[10px] font-mono text-gray-400 mt-0.5">{t('conference_admin.speaker_code_label', { code: sp.AccessCode })}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionsTab({ eventId }) {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [form, setForm] = useState({ Title: '', SessionStart: '', DurationMin: 60, SessionType: 'Breakout', SpeakerIDs: [] });

  const load = () => Promise.all([
    fetch(`${API}/api/events/${eventId}/conference/sessions`).then(r => r.json()),
    fetch(`${API}/api/events/${eventId}/conference/tracks`).then(r => r.json()),
    fetch(`${API}/api/events/${eventId}/conference/rooms`).then(r => r.json()),
    fetch(`${API}/api/events/${eventId}/conference/speakers`).then(r => r.json()),
  ]).then(([s, trk, r, sp]) => {
    setSessions(s || []); setTracks(trk || []); setRooms(r || []); setSpeakers(sp || []);
  }).catch(() => {});
  useEffect(() => { load(); }, [eventId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.Title || !form.SessionStart) return;
    const editing = form.SessionID;
    const url = editing
      ? `${API}/api/events/conference/sessions/${editing}`
      : `${API}/api/events/${eventId}/conference/sessions`;
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ...form,
        TrackID: form.TrackID || null, RoomID: form.RoomID || null,
        DurationMin: Number(form.DurationMin) || 60,
        Capacity: form.Capacity ? Number(form.Capacity) : null,
      }),
    });
    setForm({ Title: '', SessionStart: '', DurationMin: 60, SessionType: 'Breakout', SpeakerIDs: [] });
    load();
  };
  const edit = (s) => setForm({
    SessionID: s.SessionID, Title: s.Title, Description: s.Description || '',
    SessionStart: toLocalInput(s.SessionStart), DurationMin: s.DurationMin,
    SessionType: s.SessionType, TrackID: s.TrackID || '', RoomID: s.RoomID || '',
    Capacity: s.Capacity || '', SpeakerIDs: (s.Speakers || []).map(x => x.SpeakerID),
  });
  const remove = async (s) => {
    if (!confirm(t('conference_admin.confirm_delete_session', { title: s.Title }))) return;
    await fetch(`${API}/api/events/conference/sessions/${s.SessionID}`, { method: 'DELETE' });
    load();
  };

  const toggleSpeaker = (id) => setForm(f => ({
    ...f,
    SpeakerIDs: f.SpeakerIDs.includes(id) ? f.SpeakerIDs.filter(x => x !== id) : [...f.SpeakerIDs, id],
  }));

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={lbl}>{t('conference_admin.session_lbl_title')}</label>
            <input className={inp} required value={form.Title}
              onChange={e => setForm(f => ({ ...f, Title: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.session_lbl_start')}</label>
            <input className={inp} type="datetime-local" required value={form.SessionStart}
              onChange={e => setForm(f => ({ ...f, SessionStart: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.session_lbl_duration')}</label>
            <input className={inp} type="number" value={form.DurationMin}
              onChange={e => setForm(f => ({ ...f, DurationMin: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.session_lbl_type')}</label>
            <select className={inp} value={form.SessionType}
              onChange={e => setForm(f => ({ ...f, SessionType: e.target.value }))}>
              <option>{t('conference_admin.session_type_keynote')}</option>
              <option>{t('conference_admin.session_type_breakout')}</option>
              <option>{t('conference_admin.session_type_panel')}</option>
              <option>{t('conference_admin.session_type_workshop')}</option>
              <option>{t('conference_admin.session_type_meal')}</option>
              <option>{t('conference_admin.session_type_break')}</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.session_lbl_track')}</label>
            <select className={inp} value={form.TrackID || ''}
              onChange={e => setForm(f => ({ ...f, TrackID: e.target.value }))}>
              <option value="">—</option>
              {tracks.map(track => <option key={track.TrackID} value={track.TrackID}>{track.TrackName}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.session_lbl_room')}</label>
            <select className={inp} value={form.RoomID || ''}
              onChange={e => setForm(f => ({ ...f, RoomID: e.target.value }))}>
              <option value="">—</option>
              {rooms.map(r => <option key={r.RoomID} value={r.RoomID}>{r.RoomName}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>{t('conference_admin.session_lbl_capacity')}</label>
            <input className={inp} type="number" value={form.Capacity || ''}
              onChange={e => setForm(f => ({ ...f, Capacity: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className={lbl}>{t('conference_admin.session_lbl_description')}</label>
          <textarea className={inp} rows={2} value={form.Description || ''}
            onChange={e => setForm(f => ({ ...f, Description: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t('conference_admin.session_lbl_speakers')}</label>
          <div className="flex flex-wrap gap-2">
            {speakers.map(sp => (
              <button type="button" key={sp.SpeakerID} onClick={() => toggleSpeaker(sp.SpeakerID)}
                className={`text-xs px-3 py-1 rounded-full border ${form.SpeakerIDs.includes(sp.SpeakerID)
                  ? 'bg-[#3D6B34] text-white border-[#3D6B34]'
                  : 'border-gray-300 text-gray-700'}`}>
                {sp.SpeakerName}
              </button>
            ))}
            {speakers.length === 0 && <span className="text-xs text-gray-400">{t('conference_admin.no_speakers_hint')}</span>}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          {form.SessionID && (
            <button type="button" onClick={() => setForm({ Title: '', SessionStart: '', DurationMin: 60, SessionType: 'Breakout', SpeakerIDs: [] })}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300">{t('conference_admin.btn_cancel')}</button>
          )}
          <button type="submit" className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-4 py-2 rounded-lg">
            {form.SessionID ? t('conference_admin.btn_save_session') : t('conference_admin.btn_add_session')}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {sessions.length === 0 && <div className="text-sm text-gray-500">{t('conference_admin.sessions_empty')}</div>}
        {sessions.map(s => (
          <div key={s.SessionID} className="border border-gray-200 rounded-lg p-3 flex items-start gap-3">
            {s.TrackColor && <span className="inline-block w-1 h-full self-stretch rounded" style={{ background: s.TrackColor, minHeight: 40 }} />}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{s.Title}</span>
                <span className="text-xs text-gray-500">{fmtDT(s.SessionStart)} · {t('conference_admin.duration_minutes', { n: s.DurationMin })}</span>
                {s.TrackName && <span className="text-xs text-gray-400">· {s.TrackName}</span>}
                {s.RoomName && <span className="text-xs text-gray-400">· {s.RoomName}</span>}
              </div>
              {s.Speakers && s.Speakers.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {s.Speakers.map(sp => sp.SpeakerName).join(', ')}
                </div>
              )}
              {s.Description && <div className="text-xs text-gray-600 mt-1">{s.Description}</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(s)} className="text-xs text-[#3D6B34] hover:underline">{t('conference_admin.btn_edit')}</button>
              <button onClick={() => remove(s)} className="text-xs text-red-600 hover:underline">{t('conference_admin.btn_delete')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationsTab({ eventId }) {
  const { t } = useTranslation();
  const [regs, setRegs] = useState([]);
  const load = () => fetch(`${API}/api/events/${eventId}/conference/registrations`)
    .then(r => r.json()).then(setRegs).catch(() => setRegs([]));
  useEffect(() => { load(); }, [eventId]);

  const toggleCheckin = async (reg) => {
    await fetch(`${API}/api/events/conference/registrations/${reg.RegID}/checkin`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ CheckedIn: !reg.CheckedIn }),
    });
    load();
  };
  const setPaid = async (reg, paid) => {
    await fetch(`${API}/api/events/conference/registrations/${reg.RegID}`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ PaidStatus: paid ? 'paid' : 'pending' }),
    });
    load();
  };
  const remove = async (reg) => {
    if (!confirm(t('conference_admin.confirm_remove', { name: reg.GuestName }))) return;
    await fetch(`${API}/api/events/conference/registrations/${reg.RegID}`, { method: 'DELETE' });
    load();
  };

  if (!regs.length) return <div className="text-sm text-gray-500">{t('conference_admin.no_registrations')}</div>;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="py-2 px-3 text-left">{t('conference_admin.th_attendee')}</th>
            <th className="py-2 px-3 text-left">{t('conference_admin.th_badge')}</th>
            <th className="py-2 px-3 text-left">{t('conference_admin.th_tier')}</th>
            <th className="py-2 px-3 text-left">{t('conference_admin.th_fee')}</th>
            <th className="py-2 px-3 text-left">{t('conference_admin.th_paid')}</th>
            <th className="py-2 px-3 text-left">{t('conference_admin.th_checkin')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {regs.map(reg => (
            <tr key={reg.RegID} className="border-t border-gray-100">
              <td className="py-2 px-3">
                <div className="font-medium">{reg.GuestName}</div>
                <div className="text-xs text-gray-500">{reg.GuestEmail}{reg.Company ? ` · ${reg.Company}` : ''}</div>
              </td>
              <td className="py-2 px-3 text-xs">
                <div className="font-mono">{reg.BadgeCode}</div>
                {reg.BadgeTitle && <div className="text-gray-400">{reg.BadgeTitle}</div>}
              </td>
              <td className="py-2 px-3 text-xs">{reg.TicketTier}</td>
              <td className="py-2 px-3 text-sm">${Number(reg.TotalFee || 0).toFixed(2)}</td>
              <td className="py-2 px-3">
                <button onClick={() => setPaid(reg, reg.PaidStatus !== 'paid')}
                  className={`text-xs px-2 py-1 rounded ${reg.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {reg.PaidStatus === 'paid' ? t('conference_admin.btn_paid') : t('conference_admin.btn_pending')}
                </button>
              </td>
              <td className="py-2 px-3">
                <button onClick={() => toggleCheckin(reg)}
                  className={`text-xs px-2 py-1 rounded ${reg.CheckedIn ? 'bg-[#3D6B34] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {reg.CheckedIn ? t('conference_admin.btn_checked_in') : t('conference_admin.btn_check_in')}
                </button>
              </td>
              <td className="py-2 px-3">
                <button onClick={() => remove(reg)} className="text-xs text-red-600 hover:underline">{t('conference_admin.btn_remove')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ConferenceAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('tab') || 'config';
  const [ev, setEv] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEv).catch(() => {});
  }, [eventId]);

  const setTab = (tabKey) => setSp({ tab: tabKey });

  const trackFields = [
    { k: 'TrackName', label: t('conference_admin.field_track_name') },
    { k: 'TrackColor', label: t('conference_admin.field_color'), type: 'color' },
    { k: 'Description', label: t('conference_admin.field_description') },
  ];
  const roomFields = [
    { k: 'RoomName', label: t('conference_admin.field_room_name') },
    { k: 'Capacity', label: t('conference_admin.field_capacity'), type: 'number' },
    { k: 'Notes', label: t('conference_admin.field_notes') },
  ];

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link to="/account/events" className="text-xs text-gray-500 hover:text-[#3D6B34]">{t('conference_admin.btn_back')}</Link>
            <h1 className="text-2xl font-semibold text-[#3D6B34] mt-1">
              {ev?.EventName || t('conference_admin.event_fallback')} <span className="text-sm text-gray-400 font-normal">{t('conference_admin.event_type_label')}</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
          {[
            ['config', t('conference_admin.tab_config')],
            ['tracks', t('conference_admin.tab_tracks')],
            ['rooms', t('conference_admin.tab_rooms')],
            ['speakers', t('conference_admin.tab_speakers')],
            ['sessions', t('conference_admin.tab_sessions')],
            ['regs', t('conference_admin.tab_regs')],
          ].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 text-sm -mb-px border-b-2 whitespace-nowrap ${tab === k ? 'border-[#3D6B34] text-[#3D6B34]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'config'   && <ConfigTab eventId={eventId} />}
        {tab === 'tracks'   && <SimpleListTab eventId={eventId} kind="tracks" label={t('conference_admin.track_label')} fields={trackFields} />}
        {tab === 'rooms'    && <SimpleListTab eventId={eventId} kind="rooms" label={t('conference_admin.room_label')} fields={roomFields} />}
        {tab === 'speakers' && <SpeakersTab eventId={eventId} />}
        {tab === 'sessions' && <SessionsTab eventId={eventId} />}
        {tab === 'regs'     && <RegistrationsTab eventId={eventId} />}
      </div>
    </EventAdminLayout>
  );
}
