import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';
import RichTextEditor from './RichTextEditor';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";

const COURSE_ORDER = ['Appetizer', 'Salad', 'Soup', 'Main', 'Side', 'Dessert', 'Beverage'];

export default function DiningRegister() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = params.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [menu, setMenu] = useState([]);
  const [myRegs, setMyRegs] = useState([]);

  const [form, setForm] = useState({
    GuestName: '', GuestEmail: '', GuestPhone: '',
    PartySize: 1, ChildCount: 0,
    DietaryRestrictions: '', SpecialRequests: '',
    choicesByCourse: {},
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  const loadMyRegs = () => {
    if (!peopleId) return;
    fetch(`${API}/api/events/${eventId}/dining/registrations?people_id=${peopleId}`)
      .then(r => r.json()).then(setMyRegs).catch(() => {});
  };

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent).catch(() => {});
    fetch(`${API}/api/events/${eventId}/dining/config`).then(r => r.json()).then(setCfg).catch(() => {});
    fetch(`${API}/api/events/${eventId}/dining/menu`).then(r => r.json()).then(setMenu).catch(() => {});
    loadMyRegs();
  }, [eventId, peopleId]);

  const activeMenu = useMemo(() => menu.filter(m => m.IsActive), [menu]);
  const byCourse = useMemo(() => {
    const g = {};
    activeMenu.forEach(m => { (g[m.Course] ||= []).push(m); });
    return g;
  }, [activeMenu]);
  const courses = useMemo(() => [
    ...COURSE_ORDER.filter(c => byCourse[c]),
    ...Object.keys(byCourse).filter(c => !COURSE_ORDER.includes(c)),
  ], [byCourse]);

  const fee = useMemo(() => {
    if (!cfg) return 0;
    const party = Number(form.PartySize) || 0;
    const kids = Math.min(Number(form.ChildCount) || 0, party);
    const adults = Math.max(0, party - kids);
    const adultPrice = Number(cfg.PricePerSeat || 0);
    const childPrice = cfg.ChildPricePerSeat != null ? Number(cfg.ChildPricePerSeat) : adultPrice;
    const base = adults * adultPrice + kids * childPrice;
    const upcharge = Object.values(form.choicesByCourse || {})
      .filter(Boolean)
      .reduce((s, id) => {
        const m = menu.find(x => x.MenuItemID === Number(id));
        return s + (m ? Number(m.UpchargeFee || 0) : 0);
      }, 0);
    return base + upcharge;
  }, [cfg, form, menu]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.GuestName) { setErr(t('dining_reg.error_name_required')); return; }
    setSaving(true);
    try {
      const body = {
        GuestName: form.GuestName,
        GuestEmail: form.GuestEmail,
        GuestPhone: form.GuestPhone,
        PartySize: Number(form.PartySize) || 1,
        ChildCount: Number(form.ChildCount) || 0,
        DietaryRestrictions: form.DietaryRestrictions,
        SpecialRequests: form.SpecialRequests,
        PeopleID: peopleId,
        BusinessID: BusinessID ? Number(BusinessID) : null,
        Choices: Object.entries(form.choicesByCourse)
          .filter(([, id]) => id)
          .map(([course, id]) => ({ MenuItemID: Number(id), GuestLabel: course })),
      };
      const r = await fetch(`${API}/api/events/${eventId}/dining/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.detail || 'Registration failed');
      }
      setOk(true);
      setForm({
        GuestName: '', GuestEmail: '', GuestPhone: '',
        PartySize: 1, ChildCount: 0,
        DietaryRestrictions: '', SpecialRequests: '',
        choicesByCourse: {},
      });
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
  const seatsLeft = cfg?.MaxSeats ? Number(cfg.MaxSeats) - Number(cfg.SeatsBooked || 0) : null;
  const sellout = seatsLeft != null && seatsLeft <= 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dining_reg.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {event?.EventName || 'Event'}
            {event?.EventLocationCity && ` — ${event.EventLocationCity}, ${event.EventLocationState}`}
          </p>
        </div>
        <Link to={`/events/${eventId}`} className="text-sm text-gray-500 hover:text-gray-700">{t('dining_reg.back_event')}</Link>
      </div>

      {!configured && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4 mb-4">
          {t('dining_reg.not_configured')}
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
              <div className="text-gray-500">{t('dining_reg.label_adult_seat')}</div>
              <div className="font-semibold text-gray-900 text-base">${Number(cfg.PricePerSeat || 0).toFixed(2)}</div>
            </div>
            {cfg.ChildPricePerSeat != null && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('dining_reg.label_child_age', { age: cfg.ChildAgeLimit })}</div>
                <div className="font-semibold text-gray-900 text-base">${Number(cfg.ChildPricePerSeat).toFixed(2)}</div>
              </div>
            )}
            {cfg.MealTime && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('dining_reg.label_meal_time')}</div>
                <div className="font-semibold text-gray-900 text-sm">{cfg.MealTime}</div>
              </div>
            )}
            {seatsLeft != null && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-gray-500">{t('dining_reg.label_seats_remaining')}</div>
                <div className={`font-semibold text-base ${sellout ? 'text-red-600' : 'text-[#3D6B34]'}`}>
                  {Math.max(0, seatsLeft)}
                </div>
              </div>
            )}
          </div>

          {cfg.DressCode && (
            <div className="text-xs text-gray-500 mb-4">{t('dining_reg.dress_code_prefix')} {cfg.DressCode}</div>
          )}

          {closed && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {t('dining_reg.reg_closed')}
            </div>
          )}
          {sellout && !closed && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {t('dining_reg.sold_out')}
            </div>
          )}

          {myRegs.length > 0 && (
            <div className="bg-[#f6f8f3] border border-[#3D6B34]/20 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-[#3D6B34] mb-2">{t('dining_reg.your_reservations')}</h3>
              <div className="space-y-2">
                {myRegs.map(r => (
                  <div key={r.RegID} className="text-sm">
                    <span className="font-medium">{r.GuestName}</span>
                    <span className="text-gray-500"> {t('dining_reg.party_of', { size: r.PartySize })}{r.TableNumber ? ` ${t('dining_reg.table_label', { number: r.TableNumber })}` : ''}</span>
                    <span className={`ml-2 text-[11px] px-2 py-0.5 rounded ${r.PaidStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.PaidStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!closed && !sellout && (
            <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{err}</div>}
              {ok && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">{t('dining_reg.confirmed')}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>{t('dining_reg.label_your_name')}</label>
                  <input value={form.GuestName} onChange={e => setForm(f => ({ ...f, GuestName: e.target.value }))} required className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('dining_reg.label_email')}</label>
                  <input type="email" value={form.GuestEmail} onChange={e => setForm(f => ({ ...f, GuestEmail: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className={lbl}>{t('dining_reg.label_phone')}</label>
                  <input value={form.GuestPhone} onChange={e => setForm(f => ({ ...f, GuestPhone: e.target.value }))} className={inp} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={lbl}>{t('dining_reg.label_party_size')}</label>
                    <input type="number" min="1" value={form.PartySize} onChange={e => setForm(f => ({ ...f, PartySize: e.target.value }))} className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>{t('dining_reg.label_children')}</label>
                    <input type="number" min="0" value={form.ChildCount} onChange={e => setForm(f => ({ ...f, ChildCount: e.target.value }))} className={inp} />
                  </div>
                </div>
              </div>

              {cfg.MenuIntro && (
                <div className="text-sm text-gray-700 border-l-2 border-[#3D6B34] pl-3"
                     dangerouslySetInnerHTML={{ __html: cfg.MenuIntro }} />
              )}

              {courses.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('dining_reg.menu_choices')}</h3>
                  <div className="space-y-3">
                    {courses.map(course => (
                      <div key={course}>
                        <label className={lbl}>{course}</label>
                        <div className="space-y-1">
                          {byCourse[course].map(m => (
                            <label key={m.MenuItemID} className="flex items-start gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="radio"
                                name={`course-${course}`}
                                value={m.MenuItemID}
                                checked={form.choicesByCourse[course] === m.MenuItemID}
                                onChange={() => setForm(f => ({ ...f, choicesByCourse: { ...f.choicesByCourse, [course]: m.MenuItemID } }))}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {m.ItemName}
                                  {Number(m.UpchargeFee) > 0 && <span className="text-xs text-blue-700 ml-2">(+${Number(m.UpchargeFee).toFixed(2)})</span>}
                                </div>
                                {m.ItemDescription && <div className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: m.ItemDescription }} />}
                                <div className="flex gap-1 mt-1">
                                  {m.IsVegetarian && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">V</span>}
                                  {m.IsVegan && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">VG</span>}
                                  {m.IsGlutenFree && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">GF</span>}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className={lbl}>{t('dining_reg.label_dietary')}</label>
                <input value={form.DietaryRestrictions} onChange={e => setForm(f => ({ ...f, DietaryRestrictions: e.target.value }))} className={inp} placeholder={t('dining_reg.dietary_placeholder')} />
              </div>
              <div>
                <label className={lbl}>{t('dining_reg.label_special_requests')}</label>
                <RichTextEditor value={form.SpecialRequests}
                  onChange={(v) => setForm(f => ({ ...f, SpecialRequests: v }))} minHeight={100} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-lg font-semibold text-[#3D6B34]">{t('dining_reg.total_display', { amount: fee.toFixed(2) })}</div>
              </div>

              <div className="flex justify-end gap-3">
                <Link to={`/events/${eventId}`} className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 no-underline">
                  {t('dining_reg.btn_cancel')}
                </Link>
                <button type="submit" disabled={saving} className="bg-[#3D6B34] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#2d5226] disabled:opacity-50">
                  {saving ? t('dining_reg.btn_saving') : t('dining_reg.btn_reserve')}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
