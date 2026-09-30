import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const tok = localStorage.getItem('access_token');
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

const ROLE_VALUES = ['exhibitor', 'youth', 'child', 'guest', 'other'];

/**
 * Group registration step. Lets the payer add additional people who will be
 * counted in the registration (e.g. parent paying for kids in a junior show,
 * farm registering multiple exhibitors).
 *
 * Props:
 *   cartId    — required, the active cart
 *   payer     — {FirstName, LastName, Email} (read-only display)
 *   onNext / onBack
 */
export default function WizardAttendeesStep({ cartId, payer, businessId, onNext, onBack }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [teamOpen, setTeamOpen] = useState(false);

  const load = () => {
    if (!cartId) return;
    setLoading(true);
    fetch(`${API}/api/events/cart/${cartId}/attendees`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setRows(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };
  useEffect(load, [cartId]);

  const save = async (a) => {
    const isNew = !a.AttendeeID;
    const url = isNew
      ? `${API}/api/events/cart/${cartId}/attendees`
      : `${API}/api/events/cart/attendees/${a.AttendeeID}`;
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(a),
    });
    if (!res.ok) { alert(t('wizard_attendees.err_save_failed')); return; }
    setEditing(null);
    load();
  };

  const remove = async (a) => {
    if (!confirm(t('wizard_attendees.confirm_remove', { name: a.FirstName || t('wizard_attendees.attendee_fallback') }))) return;
    await fetch(`${API}/api/events/cart/attendees/${a.AttendeeID}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    load();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">{t('wizard_attendees.heading')}</h2>
      <p className="text-sm text-gray-500 mb-5">
        {t('wizard_attendees.subheading')}
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5 text-sm">
        <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-1">{t('wizard_attendees.payer_label')}</div>
        <div className="text-gray-800">
          {[payer?.FirstName, payer?.LastName].filter(Boolean).join(' ') || t('wizard_attendees.payer_you')}
          {payer?.Email && <span className="text-gray-500"> · {payer.Email}</span>}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 py-4">{t('wizard_attendees.loading')}</div>
      ) : (
        <div className="space-y-2 mb-4">
          {rows.map(a => (
            <div key={a.AttendeeID} className="border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800">
                  {[a.FirstName, a.LastName].filter(Boolean).join(' ') || t('wizard_attendees.unnamed_attendee')}
                  {a.Role && (
                    <span className="ml-2 text-[10px] uppercase bg-gray-100 text-gray-600 rounded px-2 py-0.5">
                      {a.Role}
                    </span>
                  )}
                </div>
                {a.Email && <div className="text-xs text-gray-500">{a.Email}</div>}
                {a.NameTagTitle && <div className="text-xs text-gray-500">{t('wizard_attendees.badge_prefix', { title: a.NameTagTitle })}</div>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(a)} className="text-xs text-[#3D6B34] hover:underline">{t('wizard_attendees.btn_edit')}</button>
                <button onClick={() => remove(a)} className="text-xs text-red-600 hover:underline">{t('wizard_attendees.btn_remove')}</button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-sm text-gray-400 py-2 text-center italic">
              {t('wizard_attendees.empty')}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => setEditing({ Role: 'exhibitor' })}
          className="flex-1 border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-600 hover:border-[#3D6B34] hover:text-[#3D6B34]">
          {t('wizard_attendees.btn_add_attendee')}
        </button>
        {businessId && (
          <button onClick={() => setTeamOpen(true)}
            className="px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#3D6B34] hover:text-[#3D6B34]">
            {t('wizard_attendees.btn_import_team')}
          </button>
        )}
      </div>

      {editing && <AttendeeEditor a={editing} onSave={save} onClose={() => setEditing(null)} />}
      {teamOpen && (
        <TeamPicker
          businessId={businessId}
          existing={rows}
          onPick={async (people) => {
            for (const p of people) {
              await fetch(`${API}/api/events/cart/${cartId}/attendees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify({
                  PeopleID:  p.PeopleID,
                  FirstName: p.FirstName,
                  LastName:  p.LastName,
                  Email:     p.Email,
                  Phone:     p.Phone,
                  Role:      'exhibitor',
                }),
              });
            }
            setTeamOpen(false);
            load();
          }}
          onClose={() => setTeamOpen(false)}
        />
      )}

      <div className="flex justify-between mt-6 pt-4 border-t">
        <button onClick={onBack} className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          {t('wizard_attendees.btn_back')}
        </button>
        <button onClick={onNext} className="px-6 py-2 text-sm rounded-lg bg-[#3D6B34] text-white hover:bg-[#2f5226]">
          {t('wizard_attendees.btn_continue')}
        </button>
      </div>
    </div>
  );
}

function AttendeeEditor({ a, onSave, onClose }) {
  const { t } = useTranslation();
  const [d, setD] = useState({ ...a });
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  const roles = [
    { value: 'exhibitor', label: t('wizard_attendees.role_exhibitor') },
    { value: 'youth',     label: t('wizard_attendees.role_youth') },
    { value: 'child',     label: t('wizard_attendees.role_child') },
    { value: 'guest',     label: t('wizard_attendees.role_guest') },
    { value: 'other',     label: t('wizard_attendees.role_other') },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5">
        <h3 className="text-lg font-semibold text-[#3D6B34] mb-3">
          {a.AttendeeID ? t('wizard_attendees.editor_edit_heading') : t('wizard_attendees.editor_add_heading')}
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <input className="border rounded px-3 py-2" placeholder={t('wizard_attendees.placeholder_first_name')}
            value={d.FirstName || ''} onChange={e => set('FirstName', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder={t('wizard_attendees.placeholder_last_name')}
            value={d.LastName || ''} onChange={e => set('LastName', e.target.value)} />
          <input className="border rounded px-3 py-2 col-span-2" placeholder={t('wizard_attendees.placeholder_email')}
            value={d.Email || ''} onChange={e => set('Email', e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder={t('wizard_attendees.placeholder_phone')}
            value={d.Phone || ''} onChange={e => set('Phone', e.target.value)} />
          <select className="border rounded px-3 py-2" value={d.Role || 'exhibitor'}
            onChange={e => set('Role', e.target.value)}>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <input className="border rounded px-3 py-2 col-span-2"
            placeholder={t('wizard_attendees.placeholder_nametag')}
            value={d.NameTagTitle || ''} onChange={e => set('NameTagTitle', e.target.value)} />
          <input className="border rounded px-3 py-2" type="date"
            value={(d.DateOfBirth || '').substring(0, 10)}
            onChange={e => set('DateOfBirth', e.target.value)}
            placeholder={t('wizard_attendees.placeholder_dob')} />
          <input className="border rounded px-3 py-2" placeholder={t('wizard_attendees.placeholder_notes')}
            value={d.Notes || ''} onChange={e => set('Notes', e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded border border-gray-300">{t('wizard_attendees.btn_cancel')}</button>
          <button onClick={() => onSave(d)} className="text-sm px-4 py-2 rounded bg-[#3D6B34] text-white">
            {a.AttendeeID ? t('wizard_attendees.btn_save') : t('wizard_attendees.btn_add')}
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamPicker({ businessId, existing, onPick, onClose }) {
  const { t } = useTranslation();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState({});
  const existingEmails = new Set((existing || []).map(a => (a.Email || '').toLowerCase()).filter(Boolean));

  useEffect(() => {
    fetch(`${API}/api/businesses/${businessId}/team`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(d => setTeam(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [businessId]);

  const toggle = (pid) => setPicked(p => ({ ...p, [pid]: !p[pid] }));
  const chosen = team.filter(m => picked[m.PeopleID]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5">
        <h3 className="text-lg font-semibold text-[#3D6B34] mb-2">{t('wizard_attendees.team_heading')}</h3>
        <p className="text-xs text-gray-500 mb-3">
          {t('wizard_attendees.team_subheading')}
        </p>
        {loading ? (
          <div className="py-6 text-center text-sm text-gray-500">{t('wizard_attendees.loading')}</div>
        ) : team.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">{t('wizard_attendees.team_empty')}</div>
        ) : (
          <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg">
            {team.map(p => {
              const already = existingEmails.has((p.Email || '').toLowerCase());
              return (
                <label key={p.PeopleID}
                  className={`flex items-center gap-3 px-3 py-2 border-b border-gray-100 text-sm
                    ${already ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
                  <input type="checkbox" disabled={already}
                    checked={!!picked[p.PeopleID]}
                    onChange={() => !already && toggle(p.PeopleID)} />
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-800">
                      {[p.FirstName, p.LastName].filter(Boolean).join(' ') || t('wizard_attendees.no_name')}
                      {already && <span className="ml-2 text-[10px] text-gray-400">{t('wizard_attendees.already_added')}</span>}
                    </div>
                    {p.Email && <div className="text-xs text-gray-500">{p.Email}</div>}
                  </div>
                </label>
              );
            })}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}
            className="text-sm px-4 py-2 rounded border border-gray-300">{t('wizard_attendees.btn_cancel')}</button>
          <button onClick={() => onPick(chosen)}
            disabled={chosen.length === 0}
            className="text-sm px-4 py-2 rounded bg-[#3D6B34] text-white disabled:opacity-50">
            {t('wizard_attendees.btn_add_count', { count: chosen.length || '' })}
          </button>
        </div>
      </div>
    </div>
  );
}
