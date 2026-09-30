import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RichTextEditor from './RichTextEditor';
import EventAdminLayout from './EventAdminLayout';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const lbl = "block text-xs font-medium text-gray-500 mb-1";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";
const btnGhost = "px-4 py-1.5 text-sm border border-gray-300 rounded-lg";

const AUCTION_TYPES = ['Live', 'Silent', 'Online', 'Stud'];
const LOT_TYPES = ['Animal', 'Fleece', 'Item', 'StudService', 'Package'];
const LOT_STATUSES = ['open', 'closed', 'passed', 'withdrawn'];

function ConfigTab({ eventId }) {
  const { t } = useTranslation();
  const [cfg, setCfg] = useState(null);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/auction/config`).then(r => r.json()).then(setCfg);
  }, [eventId]);
  if (!cfg) return <div className="p-4 text-sm text-gray-500">{t('auction_admin.loading')}</div>;
  const set = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value }));
  const setNum = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value === '' ? null : Number(e.target.value) }));
  const save = async () => {
    setMsg('');
    const r = await fetch(`${API}/api/events/${eventId}/auction/config`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg),
    });
    setMsg(r.ok ? t('auction_admin.msg_saved') : t('auction_admin.msg_save_failed'));
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('auction_admin.lbl_auction_type')}</label>
          <select value={cfg.AuctionType || 'Live'} onChange={set('AuctionType')} className={inp}>
            {AUCTION_TYPES.map(typ => <option key={typ} value={typ}>{typ}</option>)}
          </select></div>
        <div><label className={lbl}>{t('auction_admin.lbl_buyer_premium')}</label>
          <input type="number" step="0.01" value={cfg.BuyerPremiumPercent ?? ''} onChange={setNum('BuyerPremiumPercent')} className={inp} /></div>
        <div><label className={lbl}>{t('auction_admin.lbl_min_increment')}</label>
          <input type="number" step="0.01" value={cfg.MinBidIncrement ?? ''} onChange={setNum('MinBidIncrement')} className={inp} /></div>
        <div><label className={lbl}>{t('auction_admin.lbl_bid_opens')}</label>
          <input type="datetime-local" value={(cfg.BidOpenDate || '').toString().substring(0, 16)} onChange={set('BidOpenDate')} className={inp} /></div>
        <div><label className={lbl}>{t('auction_admin.lbl_bid_closes')}</label>
          <input type="datetime-local" value={(cfg.BidCloseDate || '').toString().substring(0, 16)} onChange={set('BidCloseDate')} className={inp} /></div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!cfg.IsActive}
              onChange={(e) => setCfg(c => ({ ...c, IsActive: e.target.checked }))} />
            {t('auction_admin.lbl_is_active')}
          </label>
        </div>
      </div>
      <div><label className={lbl}>{t('auction_admin.lbl_description')}</label>
        <RichTextEditor value={cfg.Description || ''}
          onChange={(v) => setCfg(c => ({ ...c, Description: v }))} minHeight={180} />
      </div>
      <div><label className={lbl}>{t('auction_admin.lbl_payment_terms')}</label>
        <RichTextEditor value={cfg.PaymentTerms || ''}
          onChange={(v) => setCfg(c => ({ ...c, PaymentTerms: v }))} minHeight={120} />
      </div>
      <div className="flex justify-end items-center gap-3 pt-2">
        {msg && <span className="text-xs text-gray-500 mr-auto">{msg}</span>}
        <button onClick={save} className={btn}>{t('auction_admin.btn_save_config')}</button>
      </div>
    </div>
  );
}

function LotForm({ initial, onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    LotNumber: '', LotType: 'Item', Title: '', Description: '', PhotoURL: '',
    SellerName: '', AnimalID: '', StartingBid: 0, ReserveBid: '', MinIncrement: '',
    DisplayOrder: 0, Status: 'open', ...initial,
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('auction_admin.lot_lbl_number')}</label>
          <input value={form.LotNumber} onChange={set('LotNumber')} className={inp} placeholder="1A" /></div>
        <div><label className={lbl}>{t('auction_admin.lot_lbl_type')}</label>
          <select value={form.LotType} onChange={set('LotType')} className={inp}>
            {LOT_TYPES.map(typ => <option key={typ} value={typ}>{typ}</option>)}
          </select></div>
        <div><label className={lbl}>{t('auction_admin.lot_lbl_order')}</label>
          <input type="number" value={form.DisplayOrder} onChange={set('DisplayOrder')} className={inp} /></div>
      </div>
      <div><label className={lbl}>{t('auction_admin.lot_lbl_title')}</label>
        <input required value={form.Title} onChange={set('Title')} className={inp}
          placeholder={t('auction_admin.lot_placeholder_title')} /></div>
      <div><label className={lbl}>{t('auction_admin.lot_lbl_description')}</label>
        <RichTextEditor value={form.Description || ''}
          onChange={(v) => setForm(f => ({ ...f, Description: v }))} minHeight={150} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div><label className={lbl}>{t('auction_admin.lot_lbl_photo_url')}</label>
          <input value={form.PhotoURL || ''} onChange={set('PhotoURL')} className={inp} /></div>
        <div><label className={lbl}>{t('auction_admin.lot_lbl_seller_name')}</label>
          <input value={form.SellerName || ''} onChange={set('SellerName')} className={inp} /></div>
        <div><label className={lbl}>{t('auction_admin.lot_lbl_animal_id')}</label>
          <input value={form.AnimalID || ''} onChange={set('AnimalID')} className={inp} /></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><label className={lbl}>{t('auction_admin.lot_lbl_starting_bid')}</label>
          <input type="number" step="0.01" value={form.StartingBid || 0} onChange={set('StartingBid')} className={inp} /></div>
        <div><label className={lbl}>{t('auction_admin.lot_lbl_reserve')}</label>
          <input type="number" step="0.01" value={form.ReserveBid || ''} onChange={set('ReserveBid')} className={inp} /></div>
        <div><label className={lbl}>{t('auction_admin.lot_lbl_min_increment')}</label>
          <input type="number" step="0.01" value={form.MinIncrement || ''} onChange={set('MinIncrement')} className={inp} /></div>
        <div><label className={lbl}>{t('auction_admin.lot_lbl_status')}</label>
          <select value={form.Status} onChange={set('Status')} className={inp}>
            {LOT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select></div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className={btnGhost}>{t('auction_admin.btn_cancel')}</button>
        <button type="submit" className={btn}>{t('auction_admin.btn_save_lot')}</button>
      </div>
    </form>
  );
}

function LotsTab({ eventId }) {
  const { t } = useTranslation();
  const [lots, setLots] = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState('');
  const load = () => fetch(`${API}/api/events/${eventId}/auction/lots`).then(r => r.json()).then(setLots);
  useEffect(() => { load(); }, [eventId]);

  const save = async (form) => {
    setErr('');
    const url = editing ? `${API}/api/events/auction/lots/${editing.LotID}`
      : `${API}/api/events/${eventId}/auction/lots`;
    const body = { ...form,
      StartingBid: Number(form.StartingBid || 0),
      ReserveBid: form.ReserveBid ? Number(form.ReserveBid) : null,
      MinIncrement: form.MinIncrement ? Number(form.MinIncrement) : null,
      AnimalID: form.AnimalID ? Number(form.AnimalID) : null,
      DisplayOrder: Number(form.DisplayOrder || 0),
    };
    const r = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!r.ok) { setErr(t('auction_admin.err_save_failed')); return; }
    setAdding(false); setEditing(null); load();
  };
  const remove = async (l) => {
    if (!confirm(t('auction_admin.confirm_delete_lot', { title: l.Title }))) return;
    await fetch(`${API}/api/events/auction/lots/${l.LotID}`, { method: 'DELETE' });
    load();
  };
  const close = async (l) => {
    if (!confirm(t('auction_admin.confirm_close_lot', { title: l.Title }))) return;
    const r = await fetch(`${API}/api/events/auction/lots/${l.LotID}/close`, { method: 'POST' });
    const j = await r.json();
    if (j.status === 'passed') alert(j.reason ? t('auction_admin.lot_passed_reason', { reason: j.reason }) : t('auction_admin.lot_passed_no_bids'));
    load();
  };

  return (
    <div className="space-y-3">
      {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{err}</div>}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t('auction_admin.lots_heading', { count: lots.length })}</h3>
        {!adding && !editing && <button onClick={() => setAdding(true)} className={btn}>{t('auction_admin.btn_add_lot')}</button>}
      </div>
      {(adding || editing) && (
        <LotForm initial={editing || {}} onSave={save}
          onCancel={() => { setAdding(false); setEditing(null); }} />
      )}
      <div className="space-y-2">
        {lots.map(l => (
          <div key={l.LotID} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {l.LotNumber && <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">#{l.LotNumber}</span>}
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-700">{l.LotType}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded ${
                    l.Status === 'open' ? 'bg-green-100 text-green-700'
                    : l.Status === 'closed' ? 'bg-gray-200 text-gray-700'
                    : 'bg-yellow-100 text-yellow-700'}`}>{l.Status}</span>
                </div>
                <div className="font-medium mt-1">{l.Title}</div>
                {l.SellerName && <div className="text-xs text-gray-500">{t('auction_admin.lot_seller', { name: l.SellerName })}</div>}
                {l.Description && <div className="text-xs text-gray-600 mt-1 line-clamp-2">{l.Description}</div>}
              </div>
              <div className="text-right text-sm">
                <div className="text-xs text-gray-500">{t('auction_admin.lot_starting', { amt: Number(l.StartingBid || 0).toFixed(2) })}</div>
                {l.ReserveBid && <div className="text-xs text-gray-500">{t('auction_admin.lot_reserve', { amt: Number(l.ReserveBid).toFixed(2) })}</div>}
                {l.CurrentBid > 0 && (
                  <div className="font-bold text-[#3D6B34]">{t('auction_admin.lot_current', { amt: Number(l.CurrentBid).toFixed(2) })}</div>
                )}
                {l.Status === 'closed' && l.WinnerBid && (
                  <div className="font-bold text-green-700">{t('auction_admin.lot_sold', { amt: Number(l.WinnerBid).toFixed(2) })}</div>
                )}
                <div className="flex gap-2 mt-2 justify-end">
                  {l.Status === 'open' && (
                    <button onClick={() => close(l)} className="text-xs text-green-600 hover:text-green-800">{t('auction_admin.btn_close_award')}</button>
                  )}
                  <button onClick={() => { setEditing(l); setAdding(false); }} className="text-xs text-gray-500 hover:text-gray-800">{t('auction_admin.btn_edit')}</button>
                  <button onClick={() => remove(l)} className="text-xs text-red-500 hover:text-red-700">{t('auction_admin.btn_delete')}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {lots.length === 0 && <div className="text-sm text-gray-500">{t('auction_admin.lots_empty')}</div>}
      </div>
    </div>
  );
}

function BidsTab({ eventId }) {
  const { t } = useTranslation();
  const [lots, setLots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bids, setBids] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}/auction/lots`).then(r => r.json()).then(setLots);
  }, [eventId]);
  const loadBids = (lid) => {
    setSelected(lid);
    fetch(`${API}/api/events/${eventId}/auction/lots/${lid}/bids`).then(r => r.json()).then(setBids);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('auction_admin.bids_lots_header')}</div>
        <div className="bg-white border border-gray-200 rounded-lg max-h-[500px] overflow-y-auto">
          {lots.map(l => (
            <button key={l.LotID} onClick={() => loadBids(l.LotID)}
              className={`w-full text-left px-3 py-2 text-sm border-b hover:bg-gray-50 ${selected === l.LotID ? 'bg-[#3D6B34]/10 font-semibold' : ''}`}>
              <div className="font-medium">
                {l.LotNumber && <span className="font-mono text-xs mr-1">#{l.LotNumber}</span>}
                {l.Title}
              </div>
              <div className="text-xs text-gray-500">
                {t('auction_admin.bids_current', { amt: Number(l.CurrentBid || 0).toFixed(2), status: l.Status })}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        {!selected && <div className="text-sm text-gray-500">{t('auction_admin.bids_select_lot')}</div>}
        {selected && bids.length === 0 && <div className="text-sm text-gray-500">{t('auction_admin.bids_empty')}</div>}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {bids.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr><th className="text-left p-2">{t('auction_admin.bids_col_bidder')}</th><th className="text-left p-2">{t('auction_admin.bids_col_amount')}</th><th className="text-left p-2">{t('auction_admin.bids_col_time')}</th><th className="text-left p-2"></th></tr>
              </thead>
              <tbody>
                {bids.map((b, i) => (
                  <tr key={b.BidID} className={`border-t ${i === 0 ? 'bg-green-50' : ''}`}>
                    <td className="p-2">{b.BidderName || t('auction_admin.bids_person_fallback', { id: b.PeopleID })}</td>
                    <td className="p-2 font-bold">${Number(b.BidAmount).toFixed(2)}</td>
                    <td className="p-2 text-xs text-gray-500">{new Date(b.BidTime).toLocaleString()}</td>
                    <td className="p-2">{b.IsWinning && <span className="text-xs text-green-700 font-semibold">{t('auction_admin.bids_winner')}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuctionAdmin() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const BusinessID = params.get('BusinessID');
  const [tab, setTab] = useState(params.get('tab') || 'config');
  const [event, setEvent] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent);
  }, [eventId]);

  const tabs = [['config', t('auction_admin.tab_config')], ['lots', t('auction_admin.tab_lots')], ['bids', t('auction_admin.tab_bids')]];

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('auction_admin.heading')}</h1>
            <p className="text-sm text-gray-500 mt-1">{event?.EventName || t('auction_admin.event_fallback')}</p>
          </div>
          <Link to={`/events/manage${BusinessID ? `?BusinessID=${BusinessID}` : ''}`}
            className="text-sm text-gray-500 hover:text-gray-700">{t('auction_admin.btn_back')}</Link>
        </div>
        <div className="flex gap-1 border-b border-gray-200 mb-5">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === k ? 'border-[#3D6B34] text-[#3D6B34]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>
        {tab === 'config' && <ConfigTab eventId={eventId} />}
        {tab === 'lots' && <LotsTab eventId={eventId} />}
        {tab === 'bids' && <BidsTab eventId={eventId} />}
      </div>
    </EventAdminLayout>
  );
}
