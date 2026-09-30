import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';
const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#819360]";
const btn = "px-4 py-1.5 text-sm bg-[#3D6B34] text-white rounded-lg hover:bg-[#2d5226] disabled:opacity-50";

export default function AuctionBrowse() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const { BusinessID: ctxBusinessID } = useAccount() || {};
  const BusinessID = params.get('BusinessID') || ctxBusinessID;
  const peopleId = Number(localStorage.getItem('people_id')) || null;

  const [event, setEvent] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [lots, setLots] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    fetch(`${API}/api/events/${eventId}/auction/lots`).then(r => r.json()).then(setLots);
    if (peopleId) {
      fetch(`${API}/api/events/${eventId}/auction/my-bids?people_id=${peopleId}`)
        .then(r => r.json()).then(setMyBids).catch(() => {});
    }
  };

  useEffect(() => {
    fetch(`${API}/api/events/${eventId}`).then(r => r.json()).then(setEvent);
    fetch(`${API}/api/events/${eventId}/auction/config`).then(r => r.json()).then(setCfg);
    load();
  }, [eventId, peopleId]);

  const bid = async (lot) => {
    setErr(''); setMsg('');
    const amount = Number(bidAmounts[lot.LotID] || 0);
    if (!peopleId) { setErr(t('auction.err_login')); return; }
    if (!amount) { setErr(t('auction.err_enter_amount')); return; }
    try {
      const r = await fetch(`${API}/api/events/${eventId}/auction/lots/${lot.LotID}/bid`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PeopleID: peopleId,
          BusinessID: BusinessID ? Number(BusinessID) : null,
          BidAmount: amount,
          BidderName: null,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail || 'Bid rejected');
      setMsg(t('auction.bid_placed', { title: lot.Title, amount: amount.toFixed(2) }));
      setBidAmounts(b => ({ ...b, [lot.LotID]: '' }));
      load();
    } catch (ex) { setErr(ex.message); }
  };

  const configured = cfg?.configured;
  const biddingOpen = cfg?.bidding_open;
  const openLots = lots.filter(l => l.Status === 'open');
  const closedLots = lots.filter(l => l.Status !== 'open');

  const nextMin = (l) => {
    const cur = Number(l.CurrentBid || 0);
    const inc = Number(l.MinIncrement || cfg?.MinBidIncrement || 10);
    return cur === 0 ? Number(l.StartingBid || 0) : cur + inc;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('auction.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {event?.EventName || 'Event'}
            {cfg?.AuctionType && ` · ${cfg.AuctionType}`}
          </p>
        </div>
        <Link to={`/events/${eventId}`} className="text-sm text-gray-500 hover:text-gray-700">{t('auction.back_event')}</Link>
      </div>

      {!configured && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4 mb-4">
          {t('auction.not_configured')}
        </div>
      )}

      {configured && cfg.Description && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 whitespace-pre-wrap text-sm text-gray-700">
          {cfg.Description}
        </div>
      )}

      {configured && !biddingOpen && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 text-sm rounded-lg p-3 mb-4">
          {t('auction.bidding_closed')}
          {cfg.BidOpenDate && <> {t('auction.opens', { date: new Date(cfg.BidOpenDate).toLocaleString() })}</>}
          {cfg.BidCloseDate && <> {t('auction.closes', { date: new Date(cfg.BidCloseDate).toLocaleString() })}</>}
        </div>
      )}

      {!peopleId && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-3">
          {t('auction.login_prompt_pre')} <Link to="/login" className="underline">{t('auction.login_prompt_link')}</Link> {t('auction.login_prompt_post')}
        </div>
      )}

      {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-3">{err}</div>}
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-3">{msg}</div>}

      {myBids.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="text-xs font-bold text-blue-800 uppercase mb-1">{t('auction.recent_bids')}</div>
          <div className="text-sm space-y-0.5">
            {myBids.slice(0, 5).map(b => (
              <div key={b.BidID} className="flex justify-between">
                <span>{b.LotNumber && <span className="font-mono text-xs mr-1">#{b.LotNumber}</span>}{b.Title}</span>
                <span className="font-semibold">
                  ${Number(b.BidAmount).toFixed(2)}
                  {b.IsWinning && <span className="text-green-700 ml-1">{t('auction.won_badge')}</span>}
                  {b.Status === 'open' && Number(b.BidAmount) === Number(b.CurrentBid) && <span className="text-blue-700 ml-1">{t('auction.leading_badge')}</span>}
                  {b.Status === 'open' && Number(b.BidAmount) < Number(b.CurrentBid) && <span className="text-gray-500 ml-1">{t('auction.outbid_badge')}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 mt-2">{t('auction.open_lots', { count: openLots.length })}</h2>
      <div className="space-y-3">
        {openLots.map(l => (
          <div key={l.LotID} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex gap-4">
              {l.PhotoURL && (
                <img src={l.PhotoURL} alt="" className="w-24 h-24 object-cover rounded-lg border border-gray-100" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {l.LotNumber && <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">#{l.LotNumber}</span>}
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-700">{l.LotType}</span>
                </div>
                <div className="font-medium mt-1">{l.Title}</div>
                {l.SellerName && <div className="text-xs text-gray-500">{t('auction.seller_label')} {l.SellerName}</div>}
                {l.Description && <div className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{l.Description}</div>}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-gray-500 text-xs">{t('auction.starting', { amount: Number(l.StartingBid || 0).toFixed(2) })}</span>
                  {l.CurrentBid > 0 && (
                    <span className="font-bold text-[#3D6B34]">{t('auction.current', { amount: Number(l.CurrentBid).toFixed(2) })}</span>
                  )}
                  <span className="text-xs text-gray-400">{t('auction.next_min', { amount: nextMin(l).toFixed(2) })}</span>
                </div>
              </div>
            </div>
            {biddingOpen && peopleId && (
              <div className="mt-3 flex gap-2">
                <input type="number" step="0.01" min={nextMin(l)} placeholder={`$${nextMin(l).toFixed(2)}`}
                  value={bidAmounts[l.LotID] || ''}
                  onChange={(e) => setBidAmounts(b => ({ ...b, [l.LotID]: e.target.value }))}
                  className={inp + " max-w-[160px]"} />
                <button onClick={() => bid(l)} className={btn}>{t('auction.btn_place_bid')}</button>
              </div>
            )}
          </div>
        ))}
        {openLots.length === 0 && configured && <div className="text-sm text-gray-500">{t('auction.no_open_lots')}</div>}
      </div>

      {closedLots.length > 0 && (
        <>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 mt-6">{t('auction.closed_lots', { count: closedLots.length })}</h2>
          <div className="space-y-2">
            {closedLots.map(l => (
              <div key={l.LotID} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                <div className="flex-1">
                  {l.LotNumber && <span className="font-mono text-xs mr-1">#{l.LotNumber}</span>}
                  <span className="text-sm">{l.Title}</span>
                </div>
                <div className="text-right">
                  <div className={`text-[11px] px-2 py-0.5 rounded inline-block ${
                    l.Status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>{l.Status}</div>
                  {l.WinnerBid && <div className="text-sm font-bold text-green-700">{t('auction.sold', { amount: Number(l.WinnerBid).toFixed(2) })}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
