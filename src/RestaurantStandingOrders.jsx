// src/RestaurantStandingOrders.jsx
// "Standing Orders" — recurring purchases for restaurants.
// Route: /restaurant/standing-orders
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';
import { useAccount } from './AccountContext';
import PairsleyChat from './PairsleyChat';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL || '';

const FREQUENCY_KEYS = { weekly: 'freq_weekly', biweekly: 'freq_biweekly', monthly: 'freq_monthly' };
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function RestaurantStandingOrders() {
  const { t } = useTranslation();
  const rs = k => t(`restaurant.${k}`);
  const navigate = useNavigate();
  const { businesses } = useAccount() || {};

  const restaurantBusiness = Array.isArray(businesses)
    ? businesses.find(b => (b.BusinessType || '').toLowerCase() === 'restaurant')
    : null;
  const buyerBusinessId = restaurantBusiness?.BusinessID || null;

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState('');

  const load = async () => {
    if (!buyerBusinessId) { setLoading(false); return; }
    setLoading(true);
    setErr('');
    try {
      const r = await fetch(`${API}/api/marketplace/standing-orders?buyer_business_id=${buyerBusinessId}`);
      if (!r.ok) throw new Error(`${r.status}`);
      const data = await r.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setErr(rs('load_error_orders'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [buyerBusinessId]);

  const updateStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o.StandingOrderID === id ? { ...o, Status: status } : o));
    try {
      await fetch(`${API}/api/marketplace/standing-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: status }),
      });
    } catch { load(); }
  };

  const updateQty = async (id, qty) => {
    if (qty <= 0) return;
    setOrders(prev => prev.map(o => o.StandingOrderID === id ? { ...o, Quantity: qty } : o));
    try {
      await fetch(`${API}/api/marketplace/standing-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Quantity: qty }),
      });
    } catch { load(); }
  };

  const removeOrder = async (id) => {
    if (!window.confirm('Cancel this standing order?')) return;
    setOrders(prev => prev.filter(o => o.StandingOrderID !== id));
    try {
      await fetch(`${API}/api/marketplace/standing-orders/${id}`, { method: 'DELETE' });
    } catch { load(); }
  };

  const markFulfilled = async (order) => {
    const qtyInput = window.prompt(
      `Record delivery for "${order.ProductTitle || 'standing order'}".\nDelivered quantity (${order.UnitLabel || 'unit'}):`,
      String(order.Quantity ?? '')
    );
    if (qtyInput === null) return;
    const qty = parseFloat(qtyInput);
    if (!(qty > 0)) { alert('Please enter a positive quantity.'); return; }
    const notes = window.prompt('Optional notes (e.g. "left at back door"). Leave blank for none:', '') || null;
    try {
      const r = await fetch(`${API}/api/marketplace/standing-orders/${order.StandingOrderID}/fulfill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DeliveredQuantity: qty, Notes: notes }),
      });
      if (!r.ok) throw new Error(`${r.status}`);
      await load();
    } catch {
      alert('Could not record delivery — please try again.');
    }
  };

  const skipNext = async (order) => {
    const next = order.NextDeliveryDate || '(no date set)';
    if (!window.confirm(`Skip the ${next} delivery for "${order.ProductTitle || 'this order'}"?\nThe farm will be notified and the next date rolled forward by one cycle.`)) return;
    const reason = window.prompt('Optional reason (sent to the farm). Leave blank for none:', '') || null;
    try {
      const r = await fetch(`${API}/api/marketplace/standing-orders/${order.StandingOrderID}/skip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Reason: reason, InitiatedBy: 'buyer' }),
      });
      if (!r.ok) throw new Error(`${r.status}`);
      await load();
    } catch {
      alert('Could not skip delivery — please try again.');
    }
  };

  const reschedule = async (order) => {
    const current = order.NextDeliveryDate || '';
    const newDate = window.prompt(
      `Reschedule "${order.ProductTitle || 'this order'}".\nEnter the new delivery date as YYYY-MM-DD:`,
      current
    );
    if (newDate === null) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate.trim())) { alert('Please enter a date in YYYY-MM-DD format.'); return; }
    const reason = window.prompt('Optional reason (sent to the farm). Leave blank for none:', '') || null;
    try {
      const r = await fetch(`${API}/api/marketplace/standing-orders/${order.StandingOrderID}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ NewDate: newDate.trim(), Reason: reason, InitiatedBy: 'buyer' }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.detail || `${r.status}`);
      }
      await load();
    } catch (e) {
      alert(`Could not reschedule: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="Standing Orders | Recurring Restaurant Purchases"
        description="Manage your recurring weekly and monthly orders from local farms."
      />
      <Header />

      <div className="mx-auto px-4 pt-4 pb-10" style={{ maxWidth: '1100px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Marketplaces', to: '/marketplaces' },
          { label: 'Farm-to-Table', to: '/marketplaces/farm-to-table' },
          { label: 'Standing Orders' },
        ]} />

        <div className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
              {rs('standing_orders_title')}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Recurring purchases for {restaurantBusiness?.BusinessName || 'your restaurant'} — set it once, reorder forever.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/restaurant/farms" className="bg-white border border-[#3D6B34] text-[#3D6B34] hover:bg-[#e8f0dc] font-bold px-4 py-2 rounded-lg text-sm">
              {rs('btn_my_farms')}
            </Link>
            <Link to="/marketplaces/farm-to-table" className="bg-[#3D6B34] hover:bg-[#2d5225] text-white font-bold px-4 py-2 rounded-lg text-sm">
              {rs('btn_add_from_marketplace')}
            </Link>
          </div>
        </div>

        {!buyerBusinessId ? (
          <EmptyState
            title={rs('no_biz_standing_title')}
            body={rs('no_biz_standing_body')}
            cta={<Link to="/account" className="text-[#3D6B34] underline font-semibold">{rs('go_to_account')}</Link>}
          />
        ) : loading ? (
          <div className="text-center py-16 text-gray-400">{rs('loading')}</div>
        ) : err ? (
          <div className="text-center py-16 text-red-500">{err}</div>
        ) : orders.length === 0 ? (
          <EmptyState
            title={rs('no_orders_title')}
            body={rs('no_orders_body')}
            cta={
              <button onClick={() => navigate('/marketplaces/farm-to-table')}
                className="bg-[#3D6B34] hover:bg-[#2d5225] text-white font-bold px-4 py-2 rounded-lg text-sm">
                {rs('btn_browse_mkt')}
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
              <OrderRow
                key={o.StandingOrderID}
                order={o}
                onPause={() => updateStatus(o.StandingOrderID, 'paused')}
                onResume={() => updateStatus(o.StandingOrderID, 'active')}
                onRemove={() => removeOrder(o.StandingOrderID)}
                onQtyChange={(q) => updateQty(o.StandingOrderID, q)}
                onFulfill={() => markFulfilled(o)}
                onSkip={() => skipNext(o)}
                onReschedule={() => reschedule(o)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <PairsleyChat businessId={buyerBusinessId} />
    </div>
  );
}

function OrderRow({ order: o, onPause, onResume, onRemove, onQtyChange, onFulfill, onSkip, onReschedule }) {
  const { t } = useTranslation();
  const rs = k => t(`restaurant.${k}`);
  const [qty, setQty] = useState(o.Quantity);
  const status = o.Status || 'active';
  const isOverdue = status === 'overdue';
  const isActive = status === 'active' || isOverdue;
  const next = o.NextDeliveryDate ? new Date(o.NextDeliveryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null;
  const location = [o.FarmCity, o.FarmState].filter(Boolean).join(', ');

  return (
    <div
      className="bg-white rounded-xl border p-4 flex flex-wrap items-start gap-4 shadow-sm"
      style={{
        borderColor: isOverdue ? '#dc2626' : '#e5e7eb',
        opacity: isActive ? 1 : 0.65,
      }}
    >
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-bold text-gray-900 truncate">{o.ProductTitle || `${o.ListingType} #${o.ListingSourceID}`}</h3>
          {isOverdue && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{rs('badge_overdue')}</span>}
          {!isActive && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">{o.Status}</span>}
        </div>
        <Link to={`/marketplaces/livestock/ranch/${o.FarmBusinessID}`} className="text-sm text-[#3D6B34] hover:underline">
          {o.FarmName}
        </Link>
        {location && <span className="text-xs text-gray-500"> · 📍 {location}</span>}
        <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
          <span>🔁 {FREQUENCY_KEYS[o.Frequency] ? rs(FREQUENCY_KEYS[o.Frequency]) : o.Frequency}</span>
          {o.DayOfWeek != null && <span>📆 {DAY_NAMES[o.DayOfWeek]}</span>}
          {next && <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>{rs('lbl_next')} {next}</span>}
        </div>
        {o.Notes && <p className="text-xs italic text-gray-600 mt-2">"{o.Notes}"</p>}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-xs text-gray-500 mr-1">{rs('lbl_qty')}</span>
        <button onClick={() => { const n = Math.max(1, parseFloat(qty) - 1); setQty(n); onQtyChange(n); }}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-bold">−</button>
        <input
          type="number" min="0.25" step="0.25" value={qty}
          onChange={e => setQty(e.target.value)}
          onBlur={() => onQtyChange(parseFloat(qty) || 1)}
          className="w-16 text-center border border-gray-300 rounded px-1 py-0.5 text-sm"
        />
        <button onClick={() => { const n = parseFloat(qty) + 1; setQty(n); onQtyChange(n); }}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-bold">+</button>
        <span className="text-xs text-gray-500 ml-1">{o.UnitLabel || rs('lbl_unit')}</span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
        {isActive && (
          <button onClick={onFulfill} className="text-xs font-semibold text-white bg-[#3D6B34] hover:bg-[#2d5225] px-3 py-1.5 rounded">
            {rs('btn_mark_fulfilled')}
          </button>
        )}
        {isActive && (
          <button onClick={onSkip} className="text-xs font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded">
            {rs('btn_skip')}
          </button>
        )}
        {isActive && (
          <button onClick={onReschedule} className="text-xs font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded">
            {rs('btn_reschedule')}
          </button>
        )}
        {isActive ? (
          <button onClick={onPause} className="text-xs font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded">
            {rs('btn_pause')}
          </button>
        ) : (
          <button onClick={onResume} className="text-xs font-semibold text-[#3D6B34] border border-[#3D6B34] hover:bg-[#e8f0dc] px-3 py-1.5 rounded">
            {rs('btn_resume')}
          </button>
        )}
        <button onClick={onRemove} className="text-xs font-semibold text-red-500 hover:underline px-2 py-1.5">
          {rs('btn_cancel')}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ title, body, cta }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
      <div className="flex justify-center mb-3"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></div>
      <p className="text-lg font-bold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{body}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
