/**
 * FloorPlanPublic — vendor-facing booth picker.
 *
 * Shows the floor plan image with booths colored by status. Click an available
 * booth → confirm dialog → reservation.  The reservation calls the existing
 * vendor application's /vendor-fair/applications endpoint to create the app
 * record, then claims the booth.
 *
 * Mounted at /events/:eventId/floor-plan.
 */
import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-2 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50 font-semibold";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const STATUS_COLOR = {
  available: { fill: '#16A34A', stroke: '#14532D' },
  reserved:  { fill: '#F59E0B', stroke: '#78350F' },
  sold:      { fill: '#3B82F6', stroke: '#1E40AF' },
  blocked:   { fill: '#9CA3AF', stroke: '#4B5563' },
};

export default function FloorPlanPublic() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const accountCtx = useAccount() || {};
  const ctxBiz = accountCtx.BusinessID;
  const businessId = params.get('BusinessID') || ctxBiz;
  const peopleId = localStorage.getItem('people_id') || localStorage.getItem('PeopleID');

  const [event, setEvent] = useState(null);
  const [plan, setPlan]   = useState(null);
  const [booths, setBooths] = useState([]);
  const [picked, setPicked] = useState(null);
  const [contact, setContact] = useState({ BusinessName: '', ContactName: '', ContactEmail: '', ContactPhone: '', ProductCategories: '', NeedsElectricity: false });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState('');

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent);
  }, [eventId]);
  const refreshBooths = () => {
    fetch(`${API}/api/events/${eventId}/floor-plan`).then(r => r.json()).then(d => setPlan(d.floor_plan || null));
    fetch(`${API}/api/events/${eventId}/floor-plan/booths`).then(r => r.json()).then(setBooths);
  };
  useEffect(refreshBooths, [eventId]);

  const W = plan?.ImageWidth  || 1000;
  const H = plan?.ImageHeight || 600;

  const reserve = async () => {
    if (!picked || !contact.BusinessName.trim()) { setMsg(t('floor_plan_public.err_biz_required')); return; }
    setBusy(true); setMsg('');
    try {
      // 1. Create vendor application
      const appRes = await fetch(`${API}/api/events/${eventId}/vendor-fair/applications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PeopleID:    peopleId ? Number(peopleId) : null,
          BusinessID:  businessId ? Number(businessId) : null,
          BusinessName: contact.BusinessName,
          ContactName:  contact.ContactName,
          ContactEmail: contact.ContactEmail,
          ContactPhone: contact.ContactPhone,
          ProductCategories: contact.ProductCategories,
          NeedsElectricity:  contact.NeedsElectricity ? 1 : 0,
          BoothSize: 'Custom',
          RequestedLocation: picked.BoothNumber,
          Status: 'pending',
        }),
      });
      if (!appRes.ok) throw new Error(t('floor_plan_public.err_app_failed'));
      const { AppID } = await appRes.json();

      // 2. Reserve the booth atomically
      const rsv = await fetch(`${API}/api/events/floor-plan/booths/${picked.BoothID}/reserve`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AppID, expected_status: 'available' }),
      });
      if (!rsv.ok) {
        const j = await rsv.json().catch(() => ({}));
        throw new Error(j.detail || t('floor_plan_public.err_reserve_failed'));
      }
      setMsg(t('floor_plan_public.success_reserved', { number: picked.BoothNumber }));
      setPicked(null);
      refreshBooths();
    } catch (e) {
      setMsg(t('floor_plan_public.err_prefix', { msg: e.message }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('floor_plan_public.heading', { name: event?.EventName || 'Event' })}</h1>
            <p className="text-sm text-gray-500">{t('floor_plan_public.description')}</p>
          </div>
          <Link to={`/events/${eventId}`} className={btnGhost}>{t('floor_plan_public.btn_back')}</Link>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-wrap gap-4">
          {Object.entries(STATUS_COLOR).map(([k, c]) => (
            <div key={k} className="flex items-center gap-2 text-xs"><span className="w-4 h-4 rounded" style={{ background: c.fill }} /><span>{t(`floor_plan_public.status_${k}`)}</span></div>
          ))}
          {plan?.ScaleHint && <div className="text-xs text-gray-500 ml-auto">{plan.ScaleHint}</div>}
        </div>

        {!plan?.ImageURL ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
            {t('floor_plan_public.no_floor_plan')}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-auto" style={{ maxHeight: '70vh' }}>
            <div style={{ position: 'relative', width: W, height: H }}>
              <img src={plan.ImageURL} alt="floor plan" style={{ width: W, height: H, display: 'block' }} />
              <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {booths.map(b => {
                  const c = STATUS_COLOR[b.Status] || STATUS_COLOR.blocked;
                  const clickable = b.Status === 'available';
                  return (
                    <g key={b.BoothID} style={{ cursor: clickable ? 'pointer' : 'not-allowed' }}
                       onClick={() => clickable && setPicked(b)}>
                      <rect x={b.X} y={b.Y} width={b.Width} height={b.Height}
                        fill={c.fill} fillOpacity={clickable ? 0.6 : 0.85}
                        stroke={c.stroke} strokeWidth={picked?.BoothID === b.BoothID ? 4 : 1.5} />
                      <text x={b.X + b.Width/2} y={b.Y + b.Height/2 + 5} textAnchor="middle"
                        fontSize={Math.min(b.Width, b.Height) * 0.32} fill="#fff" fontWeight="bold"
                        style={{ pointerEvents: 'none' }}>
                        {b.BoothNumber}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Booking modal-ish form */}
        {picked && (
          <div className="bg-white rounded-xl border-2 border-[#3D6B34] p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-lora text-xl font-bold text-gray-900">{t('floor_plan_public.claim_heading', { number: picked.BoothNumber })}</h2>
                <p className="text-sm text-gray-500">
                  {picked.Price
                    ? t('floor_plan_public.tier_price', { tier: picked.Tier, price: Number(picked.Price).toFixed(0) })
                    : t('floor_plan_public.tier_only', { tier: picked.Tier })}
                </p>
              </div>
              <button onClick={() => setPicked(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className={lbl}>{t('floor_plan_public.lbl_business_name')}</label><input className={inp} value={contact.BusinessName} onChange={e => setContact(c => ({ ...c, BusinessName: e.target.value }))} /></div>
              <div><label className={lbl}>{t('floor_plan_public.lbl_contact_name')}</label><input className={inp} value={contact.ContactName} onChange={e => setContact(c => ({ ...c, ContactName: e.target.value }))} /></div>
              <div><label className={lbl}>{t('floor_plan_public.lbl_email')}</label><input className={inp} type="email" value={contact.ContactEmail} onChange={e => setContact(c => ({ ...c, ContactEmail: e.target.value }))} /></div>
              <div><label className={lbl}>{t('floor_plan_public.lbl_phone')}</label><input className={inp} value={contact.ContactPhone} onChange={e => setContact(c => ({ ...c, ContactPhone: e.target.value }))} /></div>
              <div className="md:col-span-2"><label className={lbl}>{t('floor_plan_public.lbl_product_categories')}</label><input className={inp} value={contact.ProductCategories} onChange={e => setContact(c => ({ ...c, ProductCategories: e.target.value }))} placeholder={t('floor_plan_public.placeholder_categories')} /></div>
              <label className="md:col-span-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={contact.NeedsElectricity} onChange={e => setContact(c => ({ ...c, NeedsElectricity: e.target.checked }))} />
                {t('floor_plan_public.lbl_electricity')}
              </label>
            </div>
            {msg && <div className={`text-sm ${msg.startsWith('Error') ? 'text-red-600' : 'text-emerald-700'}`}>{msg}</div>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setPicked(null)} className={btnGhost}>{t('floor_plan_public.btn_cancel')}</button>
              <button onClick={reserve} disabled={busy || !contact.BusinessName.trim()} className={btn}>
                {busy ? t('floor_plan_public.btn_reserving') : t('floor_plan_public.btn_claim', { number: picked.BoothNumber })}
              </button>
            </div>
          </div>
        )}

        {!picked && msg && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">{msg}</div>}
      </div>
    </div>
  );
}
