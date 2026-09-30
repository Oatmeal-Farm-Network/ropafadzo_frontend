import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

function fmtDT(iso) {
  if (!iso) return '';
  const dt = new Date(iso);
  if (isNaN(dt)) return String(iso);
  return dt.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function ConferenceRegister() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = params.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({
    GuestName: '', GuestEmail: '', GuestPhone: '', Company: '',
    BadgeTitle: '', TicketTier: 'full',
    DietaryRestrictions: '', SpecialRequests: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/conference/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/conference/sessions`).then(r => r.json()).then(setSessions).catch(() => {});
  }, [eventId]);

  const tierOptions = useMemo(() => {
    if (!cfg) return [];
    const today = new Date().toISOString().substring(0, 10);
    const opts = [];
    const ebPrice = cfg.EarlyBirdPrice;
    const ebEnd = cfg.EarlyBirdEndDate ? String(cfg.EarlyBirdEndDate).substring(0, 10) : null;
    const latePrice = cfg.LatePrice;
    const lateStart = cfg.LateStartDate ? String(cfg.LateStartDate).substring(0, 10) : null;

    let current = 'regular';
    if (ebPrice != null && ebEnd && today <= ebEnd) current = 'early-bird';
    else if (latePrice != null && lateStart && today >= lateStart) current = 'late';

    opts.push({
      value: 'full',
      label: `Full pass — $${Number(current === 'early-bird' ? ebPrice : current === 'late' ? latePrice : (cfg.RegularPrice || 0)).toFixed(2)}`,
      price: current === 'early-bird' ? Number(ebPrice) : current === 'late' ? Number(latePrice) : Number(cfg.RegularPrice || 0),
      tier: current,
    });
    if (cfg.OneDayPrice != null) {
      opts.push({ value: 'one-day', label: `One-day — $${Number(cfg.OneDayPrice).toFixed(2)}`, price: Number(cfg.OneDayPrice), tier: 'one-day' });
    }
    return opts;
  }, [cfg]);

  const selected = tierOptions.find(o => o.value === form.TicketTier) || tierOptions[0];

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.GuestName.trim()) { setErr(t('conf_reg.error_name_required')); return; }
    setSaving(true);
    try {
      const r = await fetch(`${API}/api/events/${eventId}/conference/registrations`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          PeopleID: peopleId, BusinessID: BusinessID ? Number(BusinessID) : null,
          ...form,
          TicketTier: selected?.value === 'one-day' ? 'one-day' : undefined,
        }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.detail || 'Registration failed');
      }
      setResult(await r.json());
    } catch (ex) { setErr(ex.message); }
    finally { setSaving(false); }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] py-10 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-xl font-semibold text-[#3D6B34] mb-2">{t('conf_reg.registered_title')}</h1>
          <div className="text-sm text-gray-600 mb-4">{event?.EventName}</div>
          <div className="bg-[#F5F2E8] border border-[#E8DEC2] rounded-lg p-4 mb-4">
            <div className="text-xs text-gray-500">{t('conf_reg.badge_code_label')}</div>
            <div className="font-mono text-lg text-[#3D6B34]">{result.BadgeCode}</div>
            <div className="text-xs text-gray-500 mt-2">{t('conf_reg.tier_display', { tier: result.TicketTier, amount: Number(result.TotalFee).toFixed(2) })}</div>
          </div>
          <Link to={`/events/${eventId}`} className="text-sm text-[#3D6B34] hover:underline">{t('conf_reg.back_event')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EE] py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <Link to={`/events/${eventId}`} className="text-xs text-gray-500 hover:text-[#3D6B34]">{t('conf_reg.back')}</Link>
        <h1 className="text-2xl font-semibold text-[#3D6B34] mt-1 mb-1">
          {t('conf_reg.register_heading_prefix')} {event?.EventName || 'Conference'}
        </h1>
        <div className="text-sm text-gray-500 mb-5">{t('conf_reg.type_label')}</div>

        {cfg?.Description && (
          <div className="prose prose-sm max-w-none mb-5" dangerouslySetInnerHTML={{ __html: cfg.Description }} />
        )}

        {sessions.length > 0 && (
          <details className="mb-5">
            <summary className="text-sm font-medium text-[#3D6B34] cursor-pointer">{t('conf_reg.agenda_label', { count: sessions.length })}</summary>
            <ul className="mt-2 text-xs text-gray-600 space-y-1">
              {sessions.map(s => (
                <li key={s.SessionID}>
                  <span className="text-gray-400">{fmtDT(s.SessionStart)}</span> · <span className="font-medium text-gray-800">{s.Title}</span>
                  {s.TrackName && <span className="ml-2 text-gray-500">[{s.TrackName}]</span>}
                </li>
              ))}
            </ul>
          </details>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={lbl}>{t('conf_reg.label_full_name')}</label>
              <input className={inp} required value={form.GuestName}
                onChange={e => setForm(f => ({ ...f, GuestName: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>{t('conf_reg.label_email')}</label>
              <input className={inp} type="email" value={form.GuestEmail}
                onChange={e => setForm(f => ({ ...f, GuestEmail: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>{t('conf_reg.label_phone')}</label>
              <input className={inp} value={form.GuestPhone}
                onChange={e => setForm(f => ({ ...f, GuestPhone: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>{t('conf_reg.label_company')}</label>
              <input className={inp} value={form.Company}
                onChange={e => setForm(f => ({ ...f, Company: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>{t('conf_reg.label_badge_title')}</label>
              <input className={inp} value={form.BadgeTitle}
                onChange={e => setForm(f => ({ ...f, BadgeTitle: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>{t('conf_reg.label_ticket')}</label>
              <select className={inp} value={form.TicketTier}
                onChange={e => setForm(f => ({ ...f, TicketTier: e.target.value }))}>
                {tierOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={lbl}>{t('conf_reg.label_dietary')}</label>
            <input className={inp} value={form.DietaryRestrictions}
              onChange={e => setForm(f => ({ ...f, DietaryRestrictions: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t('conf_reg.label_special_requests')}</label>
            <textarea className={inp} rows={2} value={form.SpecialRequests}
              onChange={e => setForm(f => ({ ...f, SpecialRequests: e.target.value }))} />
          </div>

          {selected && (
            <div className="bg-[#F5F2E8] border border-[#E8DEC2] rounded-lg p-3 text-sm">
              {t('conf_reg.total_label')} <span className="font-medium text-[#3D6B34]">${Number(selected.price).toFixed(2)}</span>
            </div>
          )}

          {err && <div className="text-sm text-red-600">{err}</div>}

          <div className="flex items-center gap-3 justify-end">
            <Link to={`/events/${eventId}`} className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              {t('conf_reg.btn_cancel')}
            </Link>
            <button type="submit" disabled={saving}
              className="bg-[#3D6B34] hover:bg-[#2D5228] text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50">
              {saving ? t('conf_reg.btn_submitting') : t('conf_reg.btn_register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
