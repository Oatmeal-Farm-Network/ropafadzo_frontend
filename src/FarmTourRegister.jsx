import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

function fmtSlot(iso) {
  if (!iso) return '';
  const dt = new Date(iso);
  if (isNaN(dt)) return String(iso);
  return dt.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function FarmTourRegister() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = params.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [slots, setSlots] = useState([]);
  const [addons, setAddons] = useState([]);
  const [myRegs, setMyRegs] = useState([]);

  const [form, setForm] = useState({
    SlotID: '',
    GuestName: '', GuestEmail: '', GuestPhone: '',
    PartySize: 1, ChildCount: 0,
    WaiverSignedBy: '',
    SpecialRequests: '',
    addonQty: {},
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  const loadMyRegs = () => {
    if (!peopleId) return;
    fetch(`${API}/api/events/${eventId}/tour/registrations?people_id=${peopleId}`)
      .then(r => r.json()).then(setMyRegs).catch(() => {});
  };

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/tour/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/tour/slots`).then(r => r.json()).then(setSlots).catch(() => {});
    fetch(`${API}/api/events/${eventId}/tour/addons`).then(r => r.json()).then(setAddons).catch(() => {});
    loadMyRegs();
  }, [eventId, peopleId]);

  const activeSlots = useMemo(() =>
    slots.filter(s => s.IsActive && Number(s.Booked || 0) < Number(s.Capacity))
  , [slots]);

  const activeAddons = useMemo(() => addons.filter(a => a.IsActive), [addons]);

  const fee = useMemo(() => {
    if (!cfg) return 0;
    const party = Number(form.PartySize) || 0;
    const kids = Math.min(Number(form.ChildCount) || 0, party);
    const adults = Math.max(0, party - kids);
    const adultPrice = Number(cfg.PricePerAdult || 0);
    const childPrice = cfg.PricePerChild != null ? Number(cfg.PricePerChild) : adultPrice;
    const ticket = adults * adultPrice + kids * childPrice;
    const addonTotal = Object.entries(form.addonQty).reduce((s, [id, qty]) => {
      const a = addons.find(x => x.AddOnID === Number(id));
      if (!a) return s;
      return s + Number(a.Price || 0) * Number(qty || 0);
    }, 0);
    return ticket + addonTotal;
  }, [cfg, form, addons]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.GuestName) { setErr(t('farm_tour_register.err_name_required')); return; }
    if (!form.SlotID) { setErr(t('farm_tour_register.err_slot_required')); return; }
    if (cfg?.RequireWaiver && !form.WaiverSignedBy.trim()) {
      setErr(t('farm_tour_register.err_waiver_required'));
      return;
    }
    setSaving(true);
    try {
      const body = {
        SlotID: Number(form.SlotID),
        GuestName: form.GuestName,
        GuestEmail: form.GuestEmail,
        GuestPhone: form.GuestPhone,
        PartySize: Number(form.PartySize) || 1,
        ChildCount: Number(form.ChildCount) || 0,
        WaiverSignedBy: cfg?.RequireWaiver ? form.WaiverSignedBy : null,
        SpecialRequests: form.SpecialRequests,
        PeopleID: peopleId,
        BusinessID: BusinessID ? Number(BusinessID) : null,
        AddOns: Object.entries(form.addonQty)
          .filter(([, q]) => Number(q) > 0)
          .map(([id, q]) => ({ AddOnID: Number(id), Quantity: Number(q) })),
      };
      const r = await fetch(`${API}/api/events/${eventId}/tour/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.detail || t('farm_tour_register.err_booking_failed'));
      }
      setOk(true);
      setForm({
        SlotID: '', GuestName: '', GuestEmail: '', GuestPhone: '',
        PartySize: 1, ChildCount: 0, WaiverSignedBy: '',
        SpecialRequests: '', addonQty: {},
      });
      fetch(`${API}/api/events/${eventId}/tour/slots`).then(r => r.json()).then(setSlots).catch(() => {});
      loadMyRegs();
      setTimeout(() => setOk(false), 4000);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  };

  const configured = cfg?.configured;
  const closed = configured && cfg?.RegistrationEndDate && new Date(cfg.RegistrationEndDate) < new Date();
  const allFull = slots.length > 0 && activeSlots.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('farm_tour_register.heading')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {event?.EventName || 'Event'}
            {event?.EventLocationCity && ` — ${event.EventLocationCity}, ${event.EventLocationState}`}
          </p>
        </div>
        <Link to={`/events/${eventId}`} className="text-sm text-gray-500 hover:text-gray-700">{t('farm_tour_register.btn_back')}</Link>
      </div>

      {!configured && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4 mb-4">
          {t('farm_tour_register.not_configured')}
        </div>
      )}

      {configured && (
        <>
          {cfg.Description && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 text-sm text-gray-700"
                 dangerouslySetInnerHTML={{ __html: cfg.Description }} />
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-gray-500">{t('farm_tour_register.lbl_adult')}</div>
              <div className="font-semibold text-gray-900 text-base">${Number(cfg.PricePerAdult || 0).toFixed(2)}</div>
            </div>
            {cfg.PricePerChild != null && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('farm_tour_register.lbl_child', { age: cfg.ChildAgeLimit })}</div>
                <div className="font-semibold text-gray-900 text-base">${Number(cfg.PricePerChild).toFixed(2)}</div>
              </div>
            )}
            {cfg.RegistrationEndDate && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('farm_tour_register.lbl_booking_closes')}</div>
                <div className="font-semibold text-gray-900 text-sm">{String(cfg.RegistrationEndDate).substring(0, 10)}</div>
              </div>
            )}
          </div>

          {(cfg.DrivingDirections || cfg.ParkingNotes || cfg.ThingsToBring) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {cfg.DrivingDirections && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">{t('farm_tour_register.lbl_directions')}</div>
                  <div dangerouslySetInnerHTML={{ __html: cfg.DrivingDirections }} />
                </div>
              )}
              {cfg.ParkingNotes && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">{t('farm_tour_register.lbl_parking')}</div>
                  <div dangerouslySetInnerHTML={{ __html: cfg.ParkingNotes }} />
                </div>
              )}
              {cfg.ThingsToBring && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">{t('farm_tour_register.lbl_bring')}</div>
                  <div dangerouslySetInnerHTML={{ __html: cfg.ThingsToBring }} />
                </div>
              )}
            </div>
          )}

          {closed && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {t('farm_tour_register.msg_closed')}
            </div>
          )}
          {!closed && allFull && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {t('farm_tour_register.msg_all_full')}
            </div>
          )}

          {myRegs.length > 0 && (
            <div className="bg-[#f6f8f3] border border-[#3D6B34]/20 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-[#3D6B34] mb-2">{t('farm_tour_register.your_bookings')}</h3>
              <div className="space-y-2">
                {myRegs.map(r => (
                  <div key={r.RegID} className="text-sm">
                    <span className="font-medium">{fmtSlot(r.SlotStart)}</span>
                    <span className="text-gray-500"> · {r.GuestName} · {t('farm_tour_register.party_of', { n: r.PartySize })}</span>
                    <span className={`ml-2 text-[11px] px-2 py-0.5 rounded ${r.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.PaidStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!closed && !allFull && (
            <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{err}</div>}
              {ok && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">{t('farm_tour_register.msg_confirmed')}</div>}

              <div>
                <label className={lbl}>{t('farm_tour_register.lbl_slot')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {activeSlots.map(s => {
                    const booked = Number(s.Booked || 0);
                    const left = Number(s.Capacity) - booked;
                    const selected = String(form.SlotID) === String(s.SlotID);
                    return (
                      <label key={s.SlotID} className={`border rounded-lg p-2 cursor-pointer ${selected ? 'border-[#3D6B34] bg-[#f6f8f3]' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="slot"
                          value={s.SlotID}
                          checked={selected}
                          onChange={() => setForm(f => ({ ...f, SlotID: s.SlotID }))}
                          className="sr-only"
                        />
                        <div className="text-sm font-semibold text-gray-900">{fmtSlot(s.SlotStart)}</div>
                        <div className="text-xs text-gray-500">{t('farm_tour_register.spots_left', { min: s.DurationMin, left })}</div>
                        {s.Notes && <div className="text-xs text-gray-600 mt-1">{s.Notes}</div>}
                      </label>
                    );
                  })}
                </div>
                {activeSlots.length === 0 && <div className="text-sm text-gray-500">{t('farm_tour_register.no_slots')}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>{t('farm_tour_register.lbl_name')}</label>
                  <input value={form.GuestName} onChange={e => setForm(f => ({ ...f, GuestName: e.target.value }))} required className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('farm_tour_register.lbl_email')}</label>
                  <input type="email" value={form.GuestEmail} onChange={e => setForm(f => ({ ...f, GuestEmail: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('farm_tour_register.lbl_phone')}</label>
                  <input value={form.GuestPhone} onChange={e => setForm(f => ({ ...f, GuestPhone: e.target.value }))} className={inp} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={lbl}>{t('farm_tour_register.lbl_party_size')}</label>
                    <input type="number" min="1" value={form.PartySize} onChange={e => setForm(f => ({ ...f, PartySize: e.target.value }))} className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>{t('farm_tour_register.lbl_children')}</label>
                    <input type="number" min="0" value={form.ChildCount} onChange={e => setForm(f => ({ ...f, ChildCount: e.target.value }))} className={inp} />
                  </div>
                </div>
              </div>

              {activeAddons.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('farm_tour_register.lbl_addons')}</h3>
                  <div className="space-y-2">
                    {activeAddons.map(a => (
                      <div key={a.AddOnID} className="flex items-start justify-between border border-gray-200 rounded-lg p-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{a.AddOnName} <span className="text-xs text-[#3D6B34] font-semibold">${Number(a.Price).toFixed(2)}</span></div>
                          {a.AddOnDescription && <div className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: a.AddOnDescription }} />}
                        </div>
                        <input
                          type="number" min="0"
                          max={a.MaxQuantity || undefined}
                          value={form.addonQty[a.AddOnID] || 0}
                          onChange={e => setForm(f => ({ ...f, addonQty: { ...f.addonQty, [a.AddOnID]: e.target.value } }))}
                          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center ml-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cfg.RequireWaiver && (
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                  <h3 className="text-sm font-bold text-amber-800 mb-2">{t('farm_tour_register.lbl_waiver')}</h3>
                  {cfg.WaiverText && (
                    <div className="text-xs text-gray-700 mb-3 max-h-40 overflow-y-auto bg-white border border-amber-100 rounded p-2"
                         dangerouslySetInnerHTML={{ __html: cfg.WaiverText }} />
                  )}
                  <label className={lbl}>{t('farm_tour_register.lbl_waiver_sign')}</label>
                  <input value={form.WaiverSignedBy}
                    onChange={e => setForm(f => ({ ...f, WaiverSignedBy: e.target.value }))}
                    required
                    className={inp} placeholder={t('farm_tour_register.placeholder_legal_name')} />
                </div>
              )}

              <div>
                <label className={lbl}>{t('farm_tour_register.lbl_special_requests')}</label>
                <RichTextEditor value={form.SpecialRequests}
                  onChange={(v) => setForm(f => ({ ...f, SpecialRequests: v }))} minHeight={100} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-lg font-semibold text-[#3D6B34]">{t('farm_tour_register.total_label', { amount: fee.toFixed(2) })}</div>
              </div>

              <div className="flex justify-end gap-3">
                <Link to={`/events/${eventId}`} className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 no-underline">
                  {t('farm_tour_register.btn_cancel')}
                </Link>
                <button type="submit" disabled={saving} className="bg-[#3D6B34] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#2d5226] disabled:opacity-50">
                  {saving ? t('farm_tour_register.btn_booking') : t('farm_tour_register.btn_book')}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
