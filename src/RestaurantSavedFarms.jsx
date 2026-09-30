// src/RestaurantSavedFarms.jsx
// "My Farms" — restaurants' saved-farm list for quick re-ordering.
// Route: /restaurant/farms
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

export default function RestaurantSavedFarms() {
  const { t } = useTranslation();
  const rs = k => t(`restaurant.${k}`);
  const navigate = useNavigate();
  const { businesses } = useAccount() || {};

  const restaurantBusiness = Array.isArray(businesses)
    ? businesses.find(b => (b.BusinessType || '').toLowerCase() === 'restaurant')
    : null;
  const buyerBusinessId = restaurantBusiness?.BusinessID || null;

  const [farms,   setFarms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState('');

  const load = async () => {
    if (!buyerBusinessId) { setLoading(false); return; }
    setLoading(true);
    setErr('');
    try {
      const r = await fetch(`${API}/api/marketplace/saved-farms?buyer_business_id=${buyerBusinessId}`);
      if (!r.ok) throw new Error(`${r.status}`);
      const data = await r.json();
      setFarms(Array.isArray(data) ? data : []);
    } catch {
      setErr(rs('load_error_farms'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [buyerBusinessId]);

  const removeFarm = async (farmBusinessId) => {
    setFarms(prev => prev.filter(f => f.FarmBusinessID !== farmBusinessId));
    try {
      await fetch(`${API}/api/marketplace/saved-farms?buyer_business_id=${buyerBusinessId}&farm_business_id=${farmBusinessId}`, { method: 'DELETE' });
    } catch {
      load();
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f7f2e8' }}>
      <PageMeta
        title="My Farms | Saved Farms for Restaurants"
        description="Your saved farms for quick re-ordering through the OatmealFarmNetwork marketplace."
      />
      <Header />

      <div className="mx-auto px-4 pt-4 pb-10" style={{ maxWidth: '1100px' }}>
        <Breadcrumbs items={[
          { label: 'Home', to: '/' },
          { label: 'Marketplaces', to: '/marketplaces' },
          { label: 'Farm-to-Table', to: '/marketplaces/farm-to-table' },
          { label: 'My Farms' },
        ]} />

        <div className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Lora','Times New Roman',serif" }}>
              {rs('saved_farms_title')}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Saved farms for {restaurantBusiness?.BusinessName || 'your restaurant'} — quick access for re-ordering and standing relationships.
            </p>
          </div>
          <button
            onClick={() => navigate('/marketplaces/farm-to-table')}
            className="bg-[#3D6B34] hover:bg-[#2d5225] text-white font-bold px-4 py-2 rounded-lg text-sm"
          >
            {rs('btn_find_more_farms')}
          </button>
        </div>

        {!buyerBusinessId ? (
          <EmptyState
            title={rs('no_biz_title')}
            body={rs('no_biz_body')}
            cta={<Link to="/account" className="text-[#3D6B34] underline font-semibold">{rs('go_to_account')}</Link>}
          />
        ) : loading ? (
          <div className="text-center py-16 text-gray-400">{rs('loading_farms')}</div>
        ) : err ? (
          <div className="text-center py-16 text-red-500">{err}</div>
        ) : farms.length === 0 ? (
          <EmptyState
            title={rs('no_farms_title')}
            body={rs('no_farms_body')}
            cta={
              <button
                onClick={() => navigate('/marketplaces/farm-to-table')}
                className="bg-[#3D6B34] hover:bg-[#2d5225] text-white font-bold px-4 py-2 rounded-lg text-sm"
              >
                {rs('btn_browse_marketplace')}
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {farms.map(f => (
              <FarmCard
                key={f.SavedID}
                farm={f}
                onRemove={() => removeFarm(f.FarmBusinessID)}
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

function FarmCard({ farm, onRemove }) {
  const { t } = useTranslation();
  const rs = k => t(`restaurant.${k}`);
  const location = [farm.AddressCity, farm.AddressState].filter(Boolean).join(', ');
  const profileUrl = `/marketplaces/livestock/ranch/${farm.FarmBusinessID}`;
  const marketplaceUrl = `/marketplaces/farm-to-table?seller=${encodeURIComponent(farm.BusinessName || '')}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <Link to={profileUrl} className="font-bold text-base text-[#3D6B34] hover:underline block truncate">
            {farm.BusinessName || 'Unnamed Farm'}
          </Link>
          {location && <p className="text-xs text-gray-500 mt-0.5">📍 {location}</p>}
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 text-lg leading-none"
          title={rs('btn_remove_farm')}
          aria-label={rs('btn_remove_farm')}
        >
          ×
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {farm.PickupAvailable ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#e8f0dc', color: '#3D6B34' }}>
            🚜 Pickup
          </span>
        ) : null}
        {farm.ShippingAvailable ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#e8f0dc', color: '#3D6B34' }}>
            🚚 Delivery
          </span>
        ) : null}
        {farm.DeliveryRadius ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {farm.DeliveryRadius} mi radius
          </span>
        ) : null}
      </div>

      {farm.Notes && (
        <p className="text-xs text-gray-600 italic bg-gray-50 rounded p-2 mb-3">"{farm.Notes}"</p>
      )}

      <div className="flex gap-2">
        <Link
          to={profileUrl}
          className="flex-1 text-center text-xs font-semibold border border-[#3D6B34] text-[#3D6B34] hover:bg-[#e8f0dc] py-1.5 rounded-lg"
        >
          {rs('btn_view_farm')}
        </Link>
        <Link
          to={marketplaceUrl}
          className="flex-1 text-center text-xs font-semibold bg-[#3D6B34] hover:bg-[#2d5225] text-white py-1.5 rounded-lg"
        >
          {rs('btn_shop_products')}
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ title, body, cta }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
      <div className="flex justify-center mb-3"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M17 8c0 2.5-2 4-5 4S7 10.5 7 8c0-3 2.5-5 5-5s5 2 5 5z"/><line x1="12" y1="22" x2="4" y2="22"/><line x1="12" y1="22" x2="20" y2="22"/></svg></div>
      <p className="text-lg font-bold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{body}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
