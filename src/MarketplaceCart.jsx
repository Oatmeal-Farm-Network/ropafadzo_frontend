// src/MarketplaceCart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AccountLayout from './AccountLayout';
import { useAccount } from './AccountContext';

const API = import.meta.env.VITE_API_URL || '';

export default function MarketplaceCart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { Business } = useAccount();
  const peopleId = localStorage.getItem('people_id');
  const businessId = new URLSearchParams(window.location.search).get('BusinessID');

  const [cart, setCart] = useState({ sellers: [], itemCount: 0, subtotal: 0, platformFee: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/marketplace/cart/${peopleId}`);
      const data = await res.json();
      setCart(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { if (peopleId) loadCart(); }, [peopleId]);

  const updateItem = async (cartItemId, quantity) => {
    await fetch(`${API}/api/marketplace/cart/${cartItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Quantity: quantity, Notes: null }),
    });
    loadCart();
  };

  const removeItem = async (cartItemId) => {
    await fetch(`${API}/api/marketplace/cart/${cartItemId}`, { method: 'DELETE' });
    loadCart();
  };

  const handleCheckout = async () => {
    if (cart.itemCount === 0) return;
    setChecking(true);
    try {
      const res = await fetch(`${API}/api/marketplace/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BuyerPeopleID: parseInt(peopleId),
          BuyerBusinessID: businessId ? parseInt(businessId) : null,
          DeliveryMethod: deliveryMethod,
          DeliveryAddress: deliveryAddress || null,
          DeliveryNotes: deliveryNotes || null,
          RequestedDeliveryDate: deliveryDate || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/orders/${data.OrderID}?new=true`);
      } else {
        alert(data.detail || t('marketplace_cart.err_checkout'));
      }
    } catch (err) {
      alert(t('marketplace_cart.err_checkout_detail', { message: err.message }));
    } finally { setChecking(false); }
  };

  const DELIVERY_METHODS = [
    { key: 'pickup',         label: t('marketplace_cart.method_pickup') },
    { key: 'local_delivery', label: t('marketplace_cart.method_local_delivery') },
    { key: 'shipping',       label: t('marketplace_cart.method_shipping') },
  ];

  const content = (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{t('marketplace_cart.page_title')}</h1>
        <button onClick={() => navigate('/marketplaces/farm-to-table')} className="text-sm text-[#819360] font-semibold hover:underline">
          {t('marketplace_cart.continue_shopping')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{t('marketplace_cart.loading')}</div>
      ) : cart.itemCount === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">{t('marketplace_cart.empty')}</p>
          <button onClick={() => navigate('/marketplaces/farm-to-table')}
            className="bg-[#819360] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#3D6B35]">
            {t('marketplace_cart.btn_browse')}
          </button>
        </div>
      ) : (
        <>
          {/* Items grouped by seller */}
          {cart.sellers.map(seller => (
            <div key={seller.SellerBusinessID} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-bold text-gray-700">{seller.SellerName}</h2>
                <p className="text-xs text-gray-400">{t('marketplace_cart.seller_subtotal', { amount: seller.subtotal.toFixed(2) })}</p>
              </div>
              {seller.items.map(item => (
                <div key={item.CartItemID} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.ImageURL ? <img src={item.ImageURL} className="w-full h-full object-cover" alt={item.Title} /> :
                      (item.ProductType === 'meat'
                        ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18.6 6.62a2.5 2.5 0 0 1-3.53 3.53L5 20a2 2 0 0 1-2.83-2.83l10.16-10.16a2.5 2.5 0 0 1 3.53-3.53"/><path d="m15.5 5.5-3 3"/></svg>
                        : item.ProductType === 'processed_food'
                        ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l1 7H7L8 2z"/><path d="M7 9c0 7 2 11 5 11s5-4 5-11"/></svg>
                        : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 22"/><path d="M9.5 9.5s1-3 4.5-5c0 0 1 3-1 7"/><path d="M3.82 22s1.5-3.5 8.18-4.5"/></svg>
                      )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800 text-sm">{item.Title}</p>
                    <p className="text-xs text-gray-400">{t('marketplace_cart.item_price_per', { price: parseFloat(item.UnitPrice).toFixed(2), unit: item.UnitLabel || t('marketplace_cart.unit_each') })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateItem(item.CartItemID, item.Quantity - 1)}
                      className="w-7 h-7 rounded bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.Quantity}</span>
                    <button onClick={() => updateItem(item.CartItemID, item.Quantity + 1)}
                      className="w-7 h-7 rounded bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">+</button>
                  </div>
                  <p className="text-sm font-bold text-gray-800 w-20 text-right">${item.lineTotal.toFixed(2)}</p>
                  <button onClick={() => removeItem(item.CartItemID)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                </div>
              ))}
            </div>
          ))}

          {/* Delivery options */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-700 mb-3">{t('marketplace_cart.delivery_heading')}</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {DELIVERY_METHODS.map(m => (
                <button key={m.key} onClick={() => setDeliveryMethod(m.key)}
                  className={`p-3 rounded-lg border text-sm font-semibold text-center ${deliveryMethod === m.key ? 'border-[#819360] bg-[#f0f5e8] text-[#819360]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {m.label}
                </button>
              ))}
            </div>
            {deliveryMethod !== 'pickup' && (
              <div className="space-y-3">
                <input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder={t('marketplace_cart.placeholder_address')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                <div className="flex gap-3">
                  <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <input value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)}
                    placeholder={t('marketplace_cart.placeholder_notes')} className="grow border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-700 mb-3">{t('marketplace_cart.summary_heading')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('marketplace_cart.subtotal', { count: cart.itemCount })}</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('marketplace_cart.platform_fee')}</span>
                <span>${cart.platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                <span>{t('marketplace_cart.total')}</span>
                <span className="text-[#819360]">${cart.total.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{t('marketplace_cart.payment_note')}</p>
            <button onClick={handleCheckout} disabled={checking}
              className="w-full mt-4 bg-[#819360] hover:bg-[#3D6B35] text-white font-bold py-3 rounded-xl text-lg disabled:opacity-50">
              {checking ? t('marketplace_cart.btn_placing') : t('marketplace_cart.btn_place_order')}
            </button>
          </div>
        </>
      )}
    </div>
  );

  if (businessId) {
    return (
      <AccountLayout
        Business={Business}
        BusinessID={businessId}
        PeopleID={peopleId}
        pageTitle={t('marketplace_cart.page_title')}
        breadcrumbs={[
          { label: t('marketplace_cart.breadcrumb_dashboard'), to: '/dashboard' },
          { label: t('marketplace_cart.breadcrumb_marketplace') },
          { label: t('marketplace_cart.breadcrumb_cart') },
        ]}
      >
        {content}
      </AccountLayout>
    );
  }
  return content;
}
