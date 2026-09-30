/**
 * AggregatorLogistics — dispatch and cold-chain tracking.
 *
 * Each dispatch is a single vehicle moving goods between three legs:
 *  - inbound : farm → aggregator (matches a Purchase)
 *  - b2b     : aggregator → buyer (matches a B2B order)
 *  - d2c     : aggregator → consumer (matches a D2C order)
 * Cold-chain temperature is logged per dispatch; a breach flag marks any
 * trip where the cooling threshold was violated, surfacing on the hub
 * dashboard.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50";

const ORDER_TYPES = ['b2b', 'd2c', 'inbound'];
const STATUSES    = ['scheduled', 'in_transit', 'delivered', 'failed'];

const S = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#3D6B34]">
    {children}
  </svg>
);
const ORDER_TYPE_ICON = {
  b2b:     <S><rect x="2" y="5" width="12" height="9" rx="1"/><path d="M5 5V3a3 3 0 0 1 6 0v2"/><line x1="8" y1="8" x2="8" y2="11"/></S>,
  d2c:     <S><rect x="1" y="7" width="10" height="6" rx="1"/><path d="M11 9h2l2 2v2h-4V9z"/><circle cx="4" cy="13.5" r="1.2"/><circle cx="12" cy="13.5" r="1.2"/></S>,
  inbound: <S><path d="M8 2v9"/><polyline points="5 8 8 11 11 8"/><rect x="2" y="12" width="12" height="2" rx="0.5"/></S>,
};

const fmtDT = (s) => s ? new Date(s).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '';

function DispatchForm({ row, onSave, onCancel }) {
  const { t } = useTranslation();
  const [s, setS] = useState(row || {
    OrderType: 'b2b', OrderID: '', VehicleID: '',
    DriverName: '', DriverPhone: '',
    PickupTime: '', DeliveryTime: '',
    ColdChainTempC: '', ColdChainBreach: false,
    RouteNotes: '', Status: 'scheduled',
  });
  const set = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  const setNum = k => e => setS(prev => ({ ...prev, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  const setBool = k => e => setS(prev => ({ ...prev, [k]: e.target.checked }));
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('agg_logistics.lbl_type')}</label>
          <select className={inp} value={s.OrderType} onChange={set('OrderType')}>
            {ORDER_TYPES.map(x => <option key={x}>{x}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_logistics.lbl_order_id')}</label><input className={inp} type="number" value={s.OrderID ?? ''} onChange={setNum('OrderID')} placeholder={t('agg_logistics.placeholder_order_id')} /></div>
        <div><label className={lbl}>{t('agg_logistics.lbl_status')}</label>
          <select className={inp} value={s.Status} onChange={set('Status')}>
            {STATUSES.map(x => <option key={x}>{x}</option>)}
          </select></div>
        <div><label className={lbl}>{t('agg_logistics.lbl_vehicle')}</label><input className={inp} value={s.VehicleID || ''} onChange={set('VehicleID')} placeholder={t('agg_logistics.placeholder_vehicle')} /></div>
        <div><label className={lbl}>{t('agg_logistics.lbl_driver_name')}</label><input className={inp} value={s.DriverName || ''} onChange={set('DriverName')} /></div>
        <div><label className={lbl}>{t('agg_logistics.lbl_driver_phone')}</label><input className={inp} value={s.DriverPhone || ''} onChange={set('DriverPhone')} /></div>
        <div><label className={lbl}>{t('agg_logistics.lbl_pickup_time')}</label><input className={inp} type="datetime-local" value={(s.PickupTime || '').slice(0,16)} onChange={set('PickupTime')} /></div>
        <div><label className={lbl}>{t('agg_logistics.lbl_delivery_time')}</label><input className={inp} type="datetime-local" value={(s.DeliveryTime || '').slice(0,16)} onChange={set('DeliveryTime')} /></div>
        <div><label className={lbl}>{t('agg_logistics.lbl_cold_temp')}</label><input className={inp} type="number" step="0.1" value={s.ColdChainTempC ?? ''} onChange={setNum('ColdChainTempC')} /></div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!s.ColdChainBreach} onChange={setBool('ColdChainBreach')} />
            {t('agg_logistics.lbl_breach')}
          </label>
        </div>
      </div>
      <div><label className={lbl}>{t('agg_logistics.lbl_route_notes')}</label><textarea className={inp} rows={2} value={s.RouteNotes || ''} onChange={set('RouteNotes')} placeholder={t('agg_logistics.placeholder_notes')} /></div>
      <div className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel} className={btnGhost}>{t('agg_logistics.btn_cancel')}</button>}
        <button onClick={() => onSave(s)} className={btn}>{t('agg_logistics.btn_save')}</button>
      </div>
    </div>
  );
}

export default function AggregatorLogistics() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { BusinessID: ctxBID } = useAccount();
  const BusinessID = params.get('BusinessID') || ctxBID;
  const [list, setList]    = useState([]);
  const [editing, setEdit] = useState(null);
  const [adding, setAdd]   = useState(false);
  const [statusF, setStF]  = useState('');
  const [typeF,   setTpF]  = useState('');

  const refresh = () => {
    if (!BusinessID) return;
    const qs = new URLSearchParams();
    if (statusF) qs.set('status',     statusF);
    if (typeF)   qs.set('order_type', typeF);
    fetch(`${API}/api/aggregator/${BusinessID}/logistics?${qs}`).then(r => r.json()).then(setList);
  };
  useEffect(refresh, [BusinessID, statusF, typeF]);

  const save = async (d) => {
    const isEdit = !!d.DispatchID;
    const url = isEdit ? `${API}/api/aggregator/logistics/${d.DispatchID}` : `${API}/api/aggregator/${BusinessID}/logistics`;
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(d) });
    if (r.ok) { setEdit(null); setAdd(false); refresh(); } else alert(t('agg_logistics.alert_save_failed'));
  };
  const del = async (id) => {
    if (!window.confirm(t('agg_logistics.confirm_delete'))) return;
    await fetch(`${API}/api/aggregator/logistics/${id}`, { method: 'DELETE' });
    refresh();
  };

  if (!BusinessID) {
    return (
      <AccountLayout pageTitle={t('agg_logistics.page_title')}>
        <div className="p-6 text-sm text-gray-500">{t('agg_logistics.no_business')}</div>
      </AccountLayout>
    );
  }

  const inTransit = list.filter(r => r.Status === 'in_transit').length;
  const breaches  = list.filter(r => r.ColdChainBreach).length;
  const statusColor = (st) => st === 'delivered' ? 'bg-emerald-100 text-emerald-800'
                          : st === 'in_transit' ? 'bg-blue-100 text-blue-800'
                          : st === 'failed' ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-700';

  return (
    <AccountLayout
      pageTitle={t('agg_logistics.page_title')}
      breadcrumbs={[
        { label: t('agg_logistics.crumb_account'), to: '/account' },
        { label: t('agg_logistics.crumb_aggregation'), to: `/aggregator?BusinessID=${BusinessID}` },
        { label: t('agg_logistics.crumb_logistics') },
      ]}
    >
      <div className="max-w-6xl mx-auto p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-lora text-2xl font-bold text-gray-900">{t('agg_logistics.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('agg_logistics.desc')}</p>
          </div>
          <Link to={`/aggregator?BusinessID=${BusinessID}`} className={btnGhost}>{t('agg_logistics.btn_hub')}</Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 grid grid-cols-3 gap-3 text-sm">
          <div><div className="text-[10px] uppercase text-gray-500 font-semibold">{t('agg_logistics.stat_records')}</div><div className="text-xl font-bold">{list.length}</div></div>
          <div><div className="text-[10px] uppercase text-gray-500 font-semibold">{t('agg_logistics.stat_in_transit')}</div><div className="text-xl font-bold">{inTransit}</div></div>
          <div><div className="text-[10px] uppercase text-gray-500 font-semibold">{t('agg_logistics.stat_breaches')}</div><div className={`text-xl font-bold ${breaches > 0 ? 'text-red-600' : ''}`}>{breaches}</div></div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select className={inp + ' max-w-xs'} value={typeF} onChange={e => setTpF(e.target.value)}>
            <option value="">{t('agg_logistics.filter_all_types')}</option>
            {ORDER_TYPES.map(x => <option key={x}>{x}</option>)}
          </select>
          <select className={inp + ' max-w-xs'} value={statusF} onChange={e => setStF(e.target.value)}>
            <option value="">{t('agg_logistics.filter_all_statuses')}</option>
            {STATUSES.map(x => <option key={x}>{x}</option>)}
          </select>
          <div className="flex-1" />
          <button onClick={() => setAdd(true)} className={btn}>{t('agg_logistics.btn_schedule')}</button>
        </div>

        {adding && <DispatchForm onSave={save} onCancel={() => setAdd(false)} />}
        {list.length === 0 && <div className="text-sm text-gray-500 italic">{t('agg_logistics.no_records')}</div>}

        <div className="space-y-2">
          {list.map(r => editing?.DispatchID === r.DispatchID ? (
            <DispatchForm key={r.DispatchID} row={editing} onSave={save} onCancel={() => setEdit(null)} />
          ) : (
            <div key={r.DispatchID}
                 className={`border rounded-xl p-3 flex items-start gap-3 ${r.ColdChainBreach ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
              <div className="shrink-0 mt-0.5">{ORDER_TYPE_ICON[r.OrderType] || ORDER_TYPE_ICON.b2b}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-gray-900 capitalize">{r.OrderType}</strong>
                  {r.OrderID && <span className="text-xs text-gray-500">{t('agg_logistics.label_order', { id: r.OrderID })}</span>}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${statusColor(r.Status)}`}>{r.Status}</span>
                  {r.ColdChainBreach && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-200 text-red-900 font-semibold uppercase">{t('agg_logistics.badge_breach')}</span>}
                </div>
                <div className="text-xs text-gray-700 mt-0.5">
                  {r.VehicleID && t('agg_logistics.label_vehicle', { id: r.VehicleID })}
                  {r.DriverName && ` · ${r.DriverName}`}
                  {r.DriverPhone && ` (${r.DriverPhone})`}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {r.PickupTime && t('agg_logistics.label_pickup', { time: fmtDT(r.PickupTime) })}
                  {r.DeliveryTime && t('agg_logistics.label_delivered', { time: fmtDT(r.DeliveryTime) })}
                  {r.ColdChainTempC != null && t('agg_logistics.label_max_temp', { temp: r.ColdChainTempC })}
                </div>
                {r.RouteNotes && <div className="text-xs text-gray-500 mt-0.5">{r.RouteNotes}</div>}
              </div>
              <button onClick={() => setEdit(r)} className={btnGhost}>{t('agg_logistics.btn_edit')}</button>
              <button onClick={() => del(r.DispatchID)} className="text-xs text-red-600 hover:underline">{t('agg_logistics.btn_delete')}</button>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}
